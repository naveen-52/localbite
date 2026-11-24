import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import type { NearbyShop, ShopCategory } from '../types';
import { ShopMapView } from '../components/ShopMapView';
import { Search, MapPin, Clock, Utensils, CheckCircle2, ChevronRight, SlidersHorizontal, Map as MapIcon, List as ListIcon, Loader2, Navigation } from 'lucide-react';
import { getCategoryDefaultBanner } from '../components/StallPhotoPicker';

export const HomePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'ALL';
  const initialQuery = searchParams.get('q') || '';

  const [shops, setShops] = useState<NearbyShop[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [radiusKm, setRadiusKm] = useState(5.0);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(true);
  const [currentCityLabel, setCurrentCityLabel] = useState('My Current GPS');
  const [citySearchInput, setCitySearchInput] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const citySearchTimeout = useRef<any>(null);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const q = searchParams.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 9.5100, // Default to registered stall region or GPS
    lng: 78.1000,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setCurrentCityLabel('My Current GPS');
        },
        () => {
          // Default coordinates retained on deny
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [userLocation, radiusKm]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [shopsRes, catRes] = await Promise.all([
        api.getNearbyShops(userLocation.lat, userLocation.lng, radiusKm),
        api.getCategories(),
      ]);

      if (catRes.success && catRes.data) {
        setCategories(catRes.data);
      }

      if (shopsRes.success && shopsRes.data) {
        setShops(shopsRes.data);
      } else {
        setShops([]);
      }
    } catch (e) {
      console.error('Failed to fetch nearby shops:', e);
    } finally {
      setLoading(false);
    }
  };

  // Google Maps Style City Search
  const handleCitySearch = (query: string) => {
    setCitySearchInput(query);
    if (!query.trim() || query.length < 2) {
      setCitySuggestions([]);
      setShowCityDropdown(false);
      return;
    }

    if (citySearchTimeout.current) clearTimeout(citySearchTimeout.current);
    citySearchTimeout.current = setTimeout(async () => {
      try {
        setIsSearchingCity(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&countrycodes=in&limit=5&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (res.ok) {
          const data = await res.json();
          setCitySuggestions(data);
          setShowCityDropdown(data.length > 0);
        }
      } catch (err) {
        console.error('City search error:', err);
      } finally {
        setIsSearchingCity(false);
      }
    }, 300);
  };

  const handleSelectCitySuggestion = (place: any) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setUserLocation({ lat, lng });
    setCurrentCityLabel(place.display_name.split(',')[0]);
    setCitySearchInput('');
    setShowCityDropdown(false);
  };

  const filteredShops = shops.filter((shop) => {
    const matchesCategory = selectedCategory === 'ALL' || shop.categoryName.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          shop.categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOpen = !onlyOpen || shop.open;
    return matchesCategory && matchesSearch && matchesOpen;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Search Section - Expanded Widescreen */}
      <div className="bg-gradient-to-b from-amber-50 via-white to-slate-50 border-b border-slate-200 py-10 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 mb-4">
            <Utensils className="w-3.5 h-3.5" />
            Hyper-Local Street Food Availability
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Check what's <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600">Hot & Available</span> before you walk over.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
            Real-time live inventory from nearby tea stalls, tiffin centers, and roadside eateries.
          </p>

          {/* Search & Radius Filter Box */}
          <div className="mt-8 bg-white p-2.5 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row gap-2 max-w-3xl mx-auto">
            <div className="relative flex-1 flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search stalls or dishes (e.g. Idli, Samosa, Chai)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-sm"
              />
            </div>

            <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 ml-2" />
              <select
                value={radiusKm}
                onChange={(e) => setRadiusKm(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 text-xs font-semibold rounded-lg px-3 py-2 text-slate-700 focus:outline-none"
              >
                <option value={1.0}>Within 1 km</option>
                <option value={3.0}>Within 3 km</option>
                <option value={5.0}>Within 5 km</option>
                <option value={10.0}>Within 10 km</option>
                <option value={25.0}>Within 25 km</option>
                <option value={50.0}>Within 50 km</option>
                <option value={1000.0}>All Stalls (State-wide)</option>
              </select>

              <button
                onClick={() => setOnlyOpen(!onlyOpen)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  onlyOpen
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Open Only
              </button>
            </div>
          </div>

          {/* Location / Town Search with Autocomplete */}
          <div className="mt-4 max-w-xl mx-auto relative text-left">
            <div className="relative">
              <MapPin className="w-4 h-4 text-amber-600 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder={`Search city or town (Currently: ${currentCityLabel})...`}
                value={citySearchInput}
                onChange={(e) => handleCitySearch(e.target.value)}
                onFocus={() => {
                  if (citySuggestions.length > 0) setShowCityDropdown(true);
                }}
                className="w-full pl-10 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white shadow-xs text-slate-800 placeholder:text-slate-400"
              />
              {isSearchingCity && (
                <Loader2 className="w-3.5 h-3.5 text-amber-600 absolute right-3 top-3 animate-spin" />
              )}
            </div>

            {/* City Suggestions Dropdown */}
            {showCityDropdown && citySuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-52 overflow-y-auto">
                {citySuggestions.map((place) => (
                  <button
                    key={place.place_id}
                    type="button"
                    onClick={() => handleSelectCitySuggestion(place)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-amber-50 border-b border-slate-100 last:border-0 transition-colors flex items-center gap-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {place.display_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Location & Town Switcher Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <button
              onClick={() => {
                setUserLocation({ lat: 9.5100, lng: 78.1000 });
                setCurrentCityLabel('Aruppukottai');
                setRadiusKm(25.0);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                currentCityLabel === 'Aruppukottai'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Aruppukottai</span>
            </button>

            <button
              onClick={() => {
                setUserLocation({ lat: 13.0827, lng: 80.2707 });
                setCurrentCityLabel('Chennai');
                setRadiusKm(25.0);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                currentCityLabel === 'Chennai'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Chennai</span>
            </button>

            <button
              onClick={() => {
                setUserLocation({ lat: 9.9252, lng: 78.1198 });
                setCurrentCityLabel('Madurai');
                setRadiusKm(25.0);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                currentCityLabel === 'Madurai'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Madurai</span>
            </button>

            <button
              onClick={() => {
                setRadiusKm(1000.0);
                setCurrentCityLabel('All Registered Stalls');
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                radiusKm >= 500
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>Explore All Stalls (State-wide)</span>
            </button>

            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition((pos) => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setCurrentCityLabel('My GPS Location');
                  });
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
            >
              <Navigation className="w-3 h-3 text-amber-600" />
              <span>My GPS</span>
            </button>
          </div>

          {/* Category Filter Pills (Fixed horizontal scroll & alignment) */}
          <div className="mt-6 w-full max-w-4xl mx-auto overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-2 min-w-max mx-auto px-4 justify-start md:justify-center">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                  selectedCategory === 'ALL'
                    ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Eateries
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                    selectedCategory.toLowerCase() === cat.name.toLowerCase()
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/20'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Full Widescreen Layout */}
      <main className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
        
        {/* Toggle List View vs Interactive Street Map View */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>Nearby Mini Stalls</span>
            <span className="text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
              {filteredShops.length} Found
            </span>
          </h2>

          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListIcon className="w-4 h-4" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Street Map</span>
            </button>
          </div>
        </div>

        {/* View Switcher: Interactive Map or Grid Cards */}
        {viewMode === 'map' ? (
          <ShopMapView
            shops={filteredShops}
            userLocation={userLocation}
            radiusKm={radiusKm}
          />
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-3">
                <div className="h-44 bg-slate-100 rounded-xl" />
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 max-w-lg mx-auto p-6 shadow-sm">
            <img src="/logo.png" alt="LocalBite" className="h-16 w-auto mx-auto mb-3 object-contain" />
            <h3 className="text-base font-bold text-slate-800">No stalls found in this radius</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              No registered stalls found within {radiusKm} km of this location, or they don't match the selected filter.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setRadiusKm(1000.0);
                  setSelectedCategory('ALL');
                  setOnlyOpen(false);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Explore All Stalls (State-wide)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredShops.map((shop) => (
              <Link
                key={shop.id}
                to={`/shops/${shop.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 transition-all overflow-hidden flex flex-col"
              >
                {/* Stall Header / Banner Photo */}
                <div className="h-44 relative overflow-hidden bg-slate-900">
                  <img
                    src={shop.bannerImageUrl || shop.profileImageUrl || getCategoryDefaultBanner(shop.categoryName)}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Gradient Overlay for Readable Badges */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/30 pointer-events-none" />

                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md ${
                        shop.open
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      {shop.open ? 'OPEN NOW' : 'CLOSED'}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-slate-800 shadow-md">
                      <MapPin className="w-3 h-3 text-amber-600" />
                      {shop.distanceKm} km away
                    </span>
                  </div>
                </div>

                {/* Stall Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-amber-600 uppercase">
                      {shop.categoryName}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors mt-0.5">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                      <span>{shop.addressLine}</span>
                    </p>
                  </div>

                  {/* Availability Highlight Pill */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className={`w-4 h-4 ${shop.availableItemCount > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                      <span className="text-xs font-semibold text-slate-700">
                        {shop.availableItemCount > 0
                          ? `${shop.availableItemCount} Items Available`
                          : 'Inventory depleted'}
                      </span>
                    </div>
                    <div className="text-amber-600 group-hover:translate-x-1 transition-transform">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
