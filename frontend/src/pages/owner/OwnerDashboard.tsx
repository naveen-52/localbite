import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { FoodItem, ShopDetail, ShopCategory, AvailabilityStatus } from '../../types';
import { Store, Plus, Power, Check, AlertTriangle, XCircle, CreditCard, Clock, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShopQrModal } from '../../components/ShopQrModal';

export const OwnerDashboard: React.FC = () => {
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // New Stall Registration Form State
  const [newShopName, setNewShopName] = useState('');
  const [newShopCategory, setNewShopCategory] = useState<number>(1);
  const [newShopPhone, setNewShopPhone] = useState('');
  const [newShopAddress, setNewShopAddress] = useState('');
  const [newShopCity, setNewShopCity] = useState('');
  const [newShopState, setNewShopState] = useState('');
  const [newShopPostal, setNewShopPostal] = useState('');
  const [newShopLat, setNewShopLat] = useState('13.0827');
  const [newShopLng, setNewShopLng] = useState('80.2707');

  // Add Item Form State
  const [itemName, setItemName] = useState('');
  const [itemRegionalName, setItemRegionalName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');

  useEffect(() => {
    loadShop();
  }, []);

  const loadShop = async () => {
    try {
      setLoading(true);
      const catRes = await api.getCategories();
      if (catRes.success) setCategories(catRes.data);

      const shopRes = await api.getMyShop();
      if (shopRes.success && shopRes.data) {
        setShop(shopRes.data);
        const menuRes = await api.getShopMenu(shopRes.data.id);
        if (menuRes.success && menuRes.data) {
          setMenu(menuRes.data);
        }
      }
    } catch (e: any) {
      console.log('No registered shop yet or error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name: newShopName,
        categoryId: newShopCategory,
        phoneNumber: newShopPhone,
        addressLine: newShopAddress,
        city: newShopCity,
        state: newShopState,
        postalCode: newShopPostal,
        latitude: parseFloat(newShopLat),
        longitude: parseFloat(newShopLng),
      };
      const res = await api.createShop(payload);
      if (res.success && res.data) {
        setShop(res.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register shop');
    } finally {
      setLoading(false);
    }
  };

  // 1-Tap Quick Availability Toggle Function (<5 seconds)
  const handleAvailabilityToggle = async (itemId: number, newStatus: AvailabilityStatus) => {
    try {
      setUpdatingId(itemId);
      // Optimistic UI update
      setMenu((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, availabilityStatus: newStatus } : item))
      );
      await api.updateAvailability(itemId, newStatus);
    } catch (err: any) {
      alert('Failed to update availability: ' + err.message);
      // Revert if API failed
      loadShop();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    try {
      const res = await api.addFoodItem(shop.id, {
        name: itemName,
        regionalName: itemRegionalName,
        price: parseFloat(itemPrice),
        description: itemDescription,
        availabilityStatus: 'AVAILABLE',
      });
      if (res.success && res.data) {
        setMenu((prev) => [res.data, ...prev]);
        setShowAddModal(false);
        setItemName('');
        setItemRegionalName('');
        setItemPrice('');
        setItemDescription('');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add food item');
    }
  };

  const handleToggleEmergencyClosure = async () => {
    if (!shop) return;
    const confirm = window.confirm(
      shop.temporarilyClosed
        ? 'Reopen your stall and resume live customer visibility?'
        : 'Temporarily close your stall (e.g. for rain, emergency, or batter finished)?'
    );
    if (!confirm) return;

    try {
      const reason = !shop.temporarilyClosed ? prompt('Enter reason for closure (optional):') || 'Emergency Close' : undefined;
      const res = await api.toggleShopClosure(!shop.temporarilyClosed, reason);
      if (res.success && res.data) {
        setShop(res.data);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update shop status');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading your stall control center...</p>
      </div>
    );
  }

  // View when vendor hasn't created a shop profile yet
  if (!shop) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Register Your Food Stall</h1>
              <p className="text-xs text-slate-500">Get your roadside stall on the map in 2 minutes.</p>
            </div>
          </div>

          <form onSubmit={handleCreateShop} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stall / Shop Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Kumar Mini Tiffin Shop"
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Food Category</label>
              <select
                value={newShopCategory}
                onChange={(e) => setNewShopCategory(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Phone Number</label>
              <input
                type="text"
                required
                placeholder="+919876543210"
                value={newShopPhone}
                onChange={(e) => setNewShopPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Street Address</label>
              <input
                type="text"
                required
                placeholder="Near Bus Stand, 4th Cross"
                value={newShopAddress}
                onChange={(e) => setNewShopAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">City</label>
                <input
                  type="text"
                  required
                  placeholder="Chennai"
                  value={newShopCity}
                  onChange={(e) => setNewShopCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">State</label>
                <input
                  type="text"
                  required
                  placeholder="Tamil Nadu"
                  value={newShopState}
                  onChange={(e) => setNewShopState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Pincode</label>
                <input
                  type="text"
                  required
                  placeholder="600001"
                  value={newShopPostal}
                  onChange={(e) => setNewShopPostal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Latitude</label>
                <input
                  type="text"
                  required
                  value={newShopLat}
                  onChange={(e) => setNewShopLat(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Longitude</label>
                <input
                  type="text"
                  required
                  value={newShopLng}
                  onChange={(e) => setNewShopLng(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-colors mt-2"
            >
              Complete Stall Registration
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active Shop Owner Mobile-First Quick Inventory Management View
  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      
      {/* Vendor Top Bar */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 leading-tight">{shop.name}</h1>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  shop.verificationStatus === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {shop.verificationStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{shop.statusInfo.statusMessage}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Print Stall QR Standee"
            >
              <QrCode className="w-5 h-5 text-amber-600" />
            </button>

            <Link
              to="/owner/subscription"
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Subscription & Billing"
            >
              <CreditCard className="w-5 h-5 text-amber-600" />
            </Link>

            {/* Emergency Temporary Close Toggle */}
            <button
              onClick={handleToggleEmergencyClosure}
              className={`p-2.5 rounded-xl transition-colors ${
                shop.temporarilyClosed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              }`}
              title={shop.temporarilyClosed ? 'Reopen Stall' : 'Temporary Emergency Close'}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Vendor Touch Inventory Container */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Live Food Availability</h2>
            <p className="text-xs text-slate-500">Tap below to update live status on customers' screens immediately.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Dish</span>
          </button>
        </div>

        {/* 3-Tap Availability Grid: Built specifically for mobile ergonomics */}
        <div className="space-y-3">
          {menu.map((dish) => {
            const isAvail = dish.availabilityStatus === 'AVAILABLE';
            const isLimit = dish.availabilityStatus === 'LIMITED';
            const isSold = dish.availabilityStatus === 'SOLD_OUT';

            return (
              <div
                key={dish.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-base text-slate-900">{dish.name}</span>
                    {dish.regionalName && (
                      <span className="text-xs text-slate-500 font-medium">({dish.regionalName})</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-700">₹{dish.price.toFixed(2)}</span>
                </div>

                {/* Oversized Touch Buttons: Available / Limited / Sold Out */}
                <div className="grid grid-cols-3 gap-2 sm:w-80">
                  
                  {/* 1. AVAILABLE BUTTON */}
                  <button
                    disabled={updatingId === dish.id}
                    onClick={() => handleAvailabilityToggle(dish.id, 'AVAILABLE')}
                    className={`vendor-btn rounded-xl font-black text-xs transition-all ${
                      isAvail
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-600 ring-offset-1'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                    }`}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    AVAILABLE
                  </button>

                  {/* 2. LIMITED BUTTON */}
                  <button
                    disabled={updatingId === dish.id}
                    onClick={() => handleAvailabilityToggle(dish.id, 'LIMITED')}
                    className={`vendor-btn rounded-xl font-black text-xs transition-all ${
                      isLimit
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-500 ring-offset-1'
                        : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                    }`}
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    LIMITED
                  </button>

                  {/* 3. SOLD OUT BUTTON */}
                  <button
                    disabled={updatingId === dish.id}
                    onClick={() => handleAvailabilityToggle(dish.id, 'SOLD_OUT')}
                    className={`vendor-btn rounded-xl font-black text-xs transition-all ${
                      isSold
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-600 ring-offset-1'
                        : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    SOLD OUT
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Dish Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Add Food Item to Stall</h2>
            <form onSubmit={handleAddItem} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dish Name (English / Common)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masala Dosa, Chai, Samosa"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Regional Script / Local Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. மசால் தோசை"
                  value={itemRegionalName}
                  onChange={(e) => setItemRegionalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹ INR)</label>
                <input
                  type="number"
                  step="0.50"
                  required
                  placeholder="40.00"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Short Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Crispy roast with potato masala and 2 chutneys"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Stall QR Standee Modal */}
      {showQrModal && shop && (
        <ShopQrModal shop={shop} onClose={() => setShowQrModal(false)} />
      )}
    </div>
  );
};
