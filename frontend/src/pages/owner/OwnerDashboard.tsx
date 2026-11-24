import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { FoodItem, ShopDetail, ShopCategory, AvailabilityStatus } from '../../types';
import {
  Store,
  Plus,
  Power,
  Check,
  AlertTriangle,
  XCircle,
  CreditCard,
  Clock,
  QrCode,
  MapPin,
  Phone,
  ExternalLink,
  Edit3,
  X,
  Utensils,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ShopQrModal } from '../../components/ShopQrModal';
import { LocationPickerMap } from '../../components/LocationPickerMap';
import { DishPhotoPicker } from '../../components/DishPhotoPicker';
import { getStallTheme } from '../../utils/stallThemes';

export const OwnerDashboard: React.FC = () => {
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditShopModal, setShowEditShopModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // New Stall Registration Form State (using Map & place/landmark instead of raw coordinates)
  const [newShopName, setNewShopName] = useState('');
  const [newShopCategory, setNewShopCategory] = useState<number>(1);
  const [newShopPhone, setNewShopPhone] = useState('');
  const [newShopAddress, setNewShopAddress] = useState('');
  const [newShopCity, setNewShopCity] = useState('');
  const [newShopState, setNewShopState] = useState('Tamil Nadu');
  const [newShopPostal, setNewShopPostal] = useState('600001');
  const [newShopLat, setNewShopLat] = useState(13.0827);
  const [newShopLng, setNewShopLng] = useState(80.2707);

  // Edit Stall State
  const [editName, setEditName] = useState('');
  const [editCategoryId, setEditCategoryId] = useState<number>(1);
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editPostal, setEditPostal] = useState('');
  const [editLat, setEditLat] = useState(13.0827);
  const [editLng, setEditLng] = useState(80.2707);

  // Add Item Form State
  const [itemName, setItemName] = useState('');
  const [itemRegionalName, setItemRegionalName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImageUrl, setItemImageUrl] = useState('');

  useEffect(() => {
    loadShop();
  }, []);

  const loadShop = async () => {
    try {
      setLoading(true);
      const catRes = await api.getCategories();
      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
        if (catRes.data.length > 0) {
          setNewShopCategory(catRes.data[0].id);
        }
      }

      const shopRes = await api.getMyShop();
      if (shopRes.success && shopRes.data) {
        const s = shopRes.data;
        setShop(s);
        setEditName(s.name);
        setEditPhone(s.phoneNumber);
        setEditAddress(s.addressLine);
        setEditCity(s.city);
        setEditState(s.state);
        setEditPostal(s.postalCode);
        setEditLat(s.latitude);
        setEditLng(s.longitude);

        const menuRes = await api.getShopMenu(s.id);
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

  // Handle Location Picked from Map for Registration
  const handleRegisterLocationSelected = (loc: {
    lat: number;
    lng: number;
    city?: string;
    area?: string;
    addressLine?: string;
  }) => {
    setNewShopLat(loc.lat);
    setNewShopLng(loc.lng);
    if (loc.city) setNewShopCity(loc.city);
    if (loc.addressLine) setNewShopAddress(loc.addressLine);
  };

  // Handle Location Picked from Map for Editing
  const handleEditLocationSelected = (loc: {
    lat: number;
    lng: number;
    city?: string;
    area?: string;
    addressLine?: string;
  }) => {
    setEditLat(loc.lat);
    setEditLng(loc.lng);
    if (loc.city) setEditCity(loc.city);
    if (loc.addressLine) setEditAddress(loc.addressLine);
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
        latitude: newShopLat,
        longitude: newShopLng,
      };
      const res = await api.createShop(payload);
      if (res.success && res.data) {
        setShop(res.data);
        loadShop();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to register shop');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShop = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        name: editName,
        categoryId: editCategoryId,
        phoneNumber: editPhone,
        addressLine: editAddress,
        city: editCity,
        state: editState,
        postalCode: editPostal,
        latitude: editLat,
        longitude: editLng,
      };
      const res = await api.updateShop(payload);
      if (res.success && res.data) {
        setShop(res.data);
        setShowEditShopModal(false);
        alert('Stall details and theme updated successfully!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update shop details');
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
        imageUrl: itemImageUrl || undefined,
        availabilityStatus: 'AVAILABLE',
      });
      if (res.success && res.data) {
        setMenu((prev) => [res.data, ...prev]);
        setShowAddModal(false);
        setItemName('');
        setItemRegionalName('');
        setItemPrice('');
        setItemDescription('');
        setItemImageUrl('');
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
      const reason = !shop.temporarilyClosed
        ? prompt('Enter reason for closure (optional):') || 'Emergency Close'
        : undefined;
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

  // 1. View when vendor hasn't created a shop profile yet (Map + Place/Landmark Based)
  if (!shop) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">Register Your Roadside Stall</h1>
              <p className="text-xs text-slate-500">Pin your stall on the street map in 2 minutes.</p>
            </div>
          </div>

          <form onSubmit={handleCreateShop} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Stall / Shop Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Namma Oru Kulfi, Kumar Mini Tiffin"
                value={newShopName}
                onChange={(e) => setNewShopName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Food Category (Choose Stall Type)
              </label>
              <select
                value={newShopCategory}
                onChange={(e) => setNewShopCategory(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Contact Phone Number
              </label>
              <input
                type="text"
                required
                placeholder="+919876543210"
                value={newShopPhone}
                onChange={(e) => setNewShopPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Interactive Real-Time Map Location Picker */}
            <div className="pt-2 pb-1 border-t border-slate-100">
              <LocationPickerMap
                initialLat={newShopLat}
                initialLng={newShopLng}
                onLocationSelected={handleRegisterLocationSelected}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Place / Landmark & Street Address
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Near Girls School, Gandhi Road"
                value={newShopAddress}
                onChange={(e) => setNewShopAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  City / Town
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aruppukottai"
                  value={newShopCity}
                  onChange={(e) => setNewShopCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tamil Nadu"
                  value={newShopState}
                  onChange={(e) => setNewShopState(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  required
                  placeholder="626101"
                  value={newShopPostal}
                  onChange={(e) => setNewShopPostal(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-black text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all mt-4"
            >
              Register Stall & Launch Live Radar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Active Stall Themed Landing Page
  const theme = getStallTheme(shop.categoryName);
  const totalDishes = menu.length;
  const availableCount = menu.filter((d) => d.availabilityStatus === 'AVAILABLE').length;
  const limitedCount = menu.filter((d) => d.availabilityStatus === 'LIMITED').length;
  const soldOutCount = menu.filter((d) => d.availabilityStatus === 'SOLD_OUT').length;

  return (
    <div className={`min-h-screen ${theme.heroBgClass} pb-28 transition-colors`}>
      {/* Themed Hero Showcase Landing Header */}
      <div className="relative overflow-hidden border-b border-amber-200/50">
        {/* Floating Category Emojis in Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none opacity-20">
          <div className="absolute top-2 left-6 text-4xl animate-bounce duration-1000">
            {theme.floatingEmojis[0]}
          </div>
          <div className="absolute top-8 right-12 text-5xl">
            {theme.floatingEmojis[1]}
          </div>
          <div className="absolute bottom-4 left-1/3 text-4xl">
            {theme.floatingEmojis[2]}
          </div>
          <div className="absolute top-4 right-1/4 text-3xl">
            {theme.floatingEmojis[3]}
          </div>
          <div className="absolute bottom-2 right-8 text-4xl">
            {theme.floatingEmojis[4] || theme.floatingEmojis[0]}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              {/* Category Pill with Theme Emojis */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 shadow-xs border border-amber-200 mb-3 text-slate-800">
                <span className="text-base">{theme.floatingEmojis[0]}</span>
                <span>{shop.categoryName}</span>
                <span className="text-amber-500 font-normal">|</span>
                <span className="text-slate-500 normal-case font-medium">
                  {theme.themeTitle}
                </span>
              </div>

              {/* Stall Name */}
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {shop.name}
              </h1>

              {/* Theme Motto */}
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                {theme.bannerMotto}
              </p>

              {/* Address & Hours */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-700">
                <span className="flex items-center gap-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>
                    {shop.addressLine}, {shop.city}
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>{shop.phoneNumber}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>{shop.statusInfo.statusMessage}</span>
                </span>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/shops/${shop.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-xs transition-all"
                title="Open live customer page"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                <span>Customer View</span>
              </Link>

              <button
                onClick={() => setShowQrModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-xs transition-all"
                title="Print QR Standee"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-600" />
                <span>QR Standee</span>
              </button>

              <button
                onClick={() => setShowEditShopModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-xs transition-all"
                title="Edit stall information & theme"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Edit Stall</span>
              </button>

              <Link
                to="/owner/subscription"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-xs transition-all"
              >
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span>Billing</span>
              </Link>

              <button
                onClick={handleToggleEmergencyClosure}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-all ${
                  shop.temporarilyClosed
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
                title="Emergency Stall Close"
              >
                <Power className="w-3.5 h-3.5" />
                <span>{shop.temporarilyClosed ? 'Reopen Stall' : 'Close Stall'}</span>
              </button>
            </div>
          </div>

          {/* Quick Health Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Dishes
              </span>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalDishes}</p>
            </div>

            <div className="bg-emerald-50/80 backdrop-blur-xs p-3.5 rounded-2xl border border-emerald-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Available Now
              </span>
              <p className="text-2xl font-black text-emerald-700 mt-0.5">{availableCount}</p>
            </div>

            <div className="bg-amber-50/80 backdrop-blur-xs p-3.5 rounded-2xl border border-amber-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Limited Stock
              </span>
              <p className="text-2xl font-black text-amber-700 mt-0.5">{limitedCount}</p>
            </div>

            <div className="bg-rose-50/80 backdrop-blur-xs p-3.5 rounded-2xl border border-rose-200/80 shadow-xs">
              <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                Sold Out
              </span>
              <p className="text-2xl font-black text-rose-700 mt-0.5">{soldOutCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Vendor Touch Inventory Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>Live Food Availability Manager</span>
            </h2>
            <p className="text-xs text-slate-600">
              Tap buttons below to broadcast instant inventory changes to customers' phone screens in &lt;1 second.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-md shadow-amber-500/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </button>
        </div>

        {/* 3-Tap Availability Grid with Dish Photos */}
        {menu.length === 0 ? (
          <div className="text-center py-16 bg-white/80 backdrop-blur-xs rounded-3xl border border-dashed border-slate-300 p-6">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No dishes on your stall menu yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Add your first dish (e.g. Mango Kulfi, Masala Dosa, Filter Coffee) and attach an appetizing photo!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              + Add First Food Item
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {menu.map((dish) => {
              const isAvail = dish.availabilityStatus === 'AVAILABLE';
              const isLimit = dish.availabilityStatus === 'LIMITED';
              const isSold = dish.availabilityStatus === 'SOLD_OUT';

              return (
                <div
                  key={dish.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSold
                      ? 'border-slate-200/80 bg-slate-50/60 opacity-75'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {/* Left: Dish Photo + Info */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    {/* Dish Photo Thumbnail */}
                    {dish.imageUrl ? (
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/80 shadow-xs">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200/60 text-2xl">
                        {theme.floatingEmojis[0] || '🍽️'}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                          {dish.name}
                        </h3>
                        {dish.regionalName && (
                          <span className="text-xs text-slate-500 font-semibold font-sans">
                            ({dish.regionalName})
                          </span>
                        )}
                      </div>

                      {dish.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {dish.description}
                        </p>
                      )}

                      <p className="text-sm font-black text-slate-900 mt-1">
                        ₹{dish.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Touch-Optimized 3-Tap Availability Buttons */}
                  <div className="grid grid-cols-3 gap-2 w-full md:w-auto md:min-w-[340px] flex-shrink-0">
                    <button
                      type="button"
                      disabled={updatingId === dish.id}
                      onClick={() => handleAvailabilityToggle(dish.id, 'AVAILABLE')}
                      className={`vendor-btn py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isAvail
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-600/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>Available</span>
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === dish.id}
                      onClick={() => handleAvailabilityToggle(dish.id, 'LIMITED')}
                      className={`vendor-btn py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isLimit
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-500/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Limited</span>
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === dish.id}
                      onClick={() => handleAvailabilityToggle(dish.id, 'SOLD_OUT')}
                      className={`vendor-btn py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                        isSold
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 ring-2 ring-rose-600/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Sold Out</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Food Item Modal (With Photo Upload & Presets) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Add Food Item to Stall</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dish Name (English / Common)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mango Kulfi, Masala Dosa, Chai"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Regional Script / Local Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. மாங்காய் குல்ஃபி, மசால் தோசை"
                  value={itemRegionalName}
                  onChange={(e) => setItemRegionalName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Price (₹ INR)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="40.00"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Photo Upload & Presets */}
              <div className="pt-2 border-t border-slate-100">
                <DishPhotoPicker
                  value={itemImageUrl}
                  onChange={(url) => setItemImageUrl(url)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Short Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Thick creamy mango stick kulfi made with real Alphonso pulp"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all"
                >
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stall Information & Theme Modal */}
      {showEditShopModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3 className="font-extrabold text-slate-900 text-base">Edit Stall Profile & Theme</h3>
              </div>
              <button
                onClick={() => setShowEditShopModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateShop} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Stall / Shop Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Food Category (Updates Dashboard Theme!)
                </label>
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  💡 Changing your category updates your dashboard theme (e.g. Fresh Fruits, Tea & Coffee, or Tiffin Cart).
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Location Picker Map for Edit */}
              <div className="pt-2 pb-1 border-t border-slate-100">
                <LocationPickerMap
                  initialLat={editLat}
                  initialLng={editLng}
                  onLocationSelected={handleEditLocationSelected}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Place / Landmark & Street Address
                </label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    City / Town
                  </label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={editPostal}
                    onChange={(e) => setEditPostal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditShopModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-bold text-xs shadow-md transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code Modal Standee */}
      {showQrModal && <ShopQrModal shop={shop} onClose={() => setShowQrModal(false)} />}
    </div>
  );
};
