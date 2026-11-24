import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { AvailabilitySocketClient } from '../services/websocket';
import type { FoodItem, ShopDetail, AvailabilityEvent } from '../types';
import { ArrowLeft, Clock, MapPin, Phone, Radio, Sparkles, Utensils, Store } from 'lucide-react';

export const ShopDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveSocketActive, setLiveSocketActive] = useState(false);
  const [lastUpdatedNotice, setLastUpdatedNotice] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadShopAndMenu(slug);
    }
  }, [slug]);

  const loadShopAndMenu = async (shopSlug: string) => {
    try {
      setLoading(true);
      const shopRes = await api.getShopBySlug(shopSlug);
      if (shopRes.success && shopRes.data) {
        const currentShop = shopRes.data;
        setShop(currentShop);

        const menuRes = await api.getShopMenu(currentShop.id);
        if (menuRes.success && menuRes.data) {
          setMenu(menuRes.data);
        }

        // Initialize Real-Time WebSocket Listener
        const socketClient = new AvailabilitySocketClient();
        socketClient.connect(
          currentShop.id,
          (event: AvailabilityEvent) => {
            // Live state update on menu item
            setMenu((prevMenu) =>
              prevMenu.map((item) =>
                item.id === event.foodItemId
                  ? {
                      ...item,
                      availabilityStatus: event.status,
                      currentQuantity: event.remainingQuantity ?? item.currentQuantity,
                      updatedAt: event.updatedAt,
                    }
                  : item
              )
            );

            setLastUpdatedNotice(`⚡ "${event.foodName}" availability updated to ${event.status.replace('_', ' ')}!`);
            setTimeout(() => setLastUpdatedNotice(null), 4000);
          },
          () => setLiveSocketActive(false)
        );

        setLiveSocketActive(true);

        return () => {
          socketClient.disconnect();
        };
      }
    } catch (e) {
      console.error('Failed to load shop:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3" />
        <p className="text-sm font-semibold text-slate-500">Connecting to live stall radar...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900">Stall Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested mini shop could not be located or may be pending verification.</p>
        <Link to="/" className="mt-4 inline-block px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-semibold">
          Return to Browse Stalls
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-slate-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </Link>

          {/* Live WebSocket Status Pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>{liveSocketActive ? 'Live WebSocket Sync' : 'Static Fallback'}</span>
          </div>
        </div>
      </div>

      {/* Floating Live Update Alert Toast */}
      {lastUpdatedNotice && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{lastUpdatedNotice}</span>
        </div>
      )}

      {/* Stall Hero Profile - Full Widescreen with Banner */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-6">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Real Stall Photo Banner if available */}
          {(shop.bannerImageUrl || shop.profileImageUrl) && (
            <div className="h-56 sm:h-72 w-full relative bg-slate-900 overflow-hidden">
              <img
                src={shop.bannerImageUrl || shop.profileImageUrl}
                alt={shop.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/95 text-slate-800 shadow-md">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>{shop.categoryName}</span>
                </span>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              {!(shop.bannerImageUrl || shop.profileImageUrl) && (
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  {shop.categoryName}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {shop.name}
              </h1>
              {shop.description && (
                <p className="text-sm text-slate-600 mt-1 max-w-2xl">{shop.description}</p>
              )}
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{shop.addressLine}, {shop.city} - {shop.postalCode}</span>
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <a href={`tel:${shop.phoneNumber}`} className="hover:text-amber-600 underline">
                  {shop.phoneNumber}
                </a>
              </p>
            </div>

            {/* Operating Status Badge */}
            <div className="sm:text-right flex-shrink-0">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm ${
                  shop.statusInfo.open
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
                {shop.statusInfo.open ? 'OPEN NOW' : 'CLOSED'}
              </span>
              <p className="text-xs font-semibold text-slate-600 mt-2">
                {shop.statusInfo.statusMessage}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Menu & Availability Catalog - Full Widescreen Grid */}
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Food Varieties & Live Availability</h2>
            <p className="text-xs text-slate-500">Inventory states update automatically via live WebSocket push.</p>
          </div>
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
            {menu.length} Varieties Listed
          </span>
        </div>

        {menu.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-sm font-semibold text-slate-600">The shop owner has not published any food items yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {menu.map((dish) => {
              const isAvailable = dish.availabilityStatus === 'AVAILABLE';
              const isLimited = dish.availabilityStatus === 'LIMITED';
              const isSoldOut = dish.availabilityStatus === 'SOLD_OUT';

              return (
                <div
                  key={dish.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col justify-between ${
                    isSoldOut
                      ? 'border-slate-200 opacity-60 bg-slate-50'
                      : 'border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {dish.imageUrl ? (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100 shadow-inner">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                        <Utensils className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base leading-tight">{dish.name}</h3>
                          {dish.regionalName && (
                            <span className="text-xs text-slate-500 font-medium block mt-0.5">
                              {dish.regionalName}
                            </span>
                          )}
                        </div>

                        {/* High-Contrast Live Availability Indicator */}
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs ${
                              isAvailable
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : isLimited
                                ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                                : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}
                          >
                            {isAvailable && 'Available'}
                            {isLimited && 'Limited'}
                            {isSoldOut && 'Sold Out'}
                          </span>

                          {dish.quantityTracked && isLimited && dish.currentQuantity > 0 && (
                            <span className="text-[10px] font-bold text-amber-700 mt-1">
                              Only {dish.currentQuantity} left!
                            </span>
                          )}
                        </div>
                      </div>

                      {dish.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dish.description}</p>
                      )}

                      <p className="text-base font-extrabold text-slate-900 mt-2">
                        ₹{dish.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
