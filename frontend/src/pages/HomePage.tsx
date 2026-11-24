import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { NearbyShop, ShopCategory } from '../types';
import { ShopMapView } from '../components/ShopMapView';
import { Search, MapPin, Clock, Utensils, CheckCircle2, ChevronRight, SlidersHorizontal, Map as MapIcon, List as ListIcon, Loader2, Navigation } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [shops, setShops] = useState<NearbyShop[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [radiusKm, setRadiusKm] = useState(5.0);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(true);
  const [isDemoFallback, setIsDemoFallback] = useState(false);
  const [currentCityLabel, setCurrentCityLabel] = useState('Chennai Central');
  const [citySearchInput, setCitySearchInput] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<any[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const citySearchTimeout = useRef<any>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 13.0827, // Default Chennai coordinates
    lng: 80.2707,
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

      if (shopsRes.success && shopsRes.data && shopsRes.data.length > 0) {
        setShops(shopsRes.data);
        setIsDemoFallback(false);
      } else {
        // If 0 stalls in immediate radius, check for stalls state-wide (radius 1000 km)
        const allRes = await api.getNearbyShops(userLocation.lat, userLocation.lng, 1000.0);
        if (allRes.success && allRes.data && allRes.data.length > 0) {
          setShops(allRes.data);
          setIsDemoFallback(true);
        } else {
          setShops([]);
          setIsDemoFallback(false);
        }
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
      
      {/* Hero Search Section */}
      <div className="bg-gradient-to-b from-amber-50 via-white to-slate-50 border-b border-slate-200 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 mb-4">
            <Utensils className="w-3.5 h-3.5" />
            Hyper-Local Street Food Availability
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Check what's <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-rose-600">Hot & Available</span> before you walk over.
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Real-time live inventory from nearby tea stalls, tiffin centers, and roadside eateries.
          </p>

          {/* Search & Radius Filter Box */}
          <div className="mt-8 bg-white p-2.5 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
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
                setIsDemoFallback(false);
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
                setCurrentCityLabel('Chennai Central');
                setRadiusKm(10.0);
                setIsDemoFallback(false);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                currentCityLabel === 'Chennai Central'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>Chennai Central</span>
            </button>

            <button
              onClick={() => {
                setUserLocation({ lat: 9.9252, lng: 78.1198 });
                setCurrentCityLabel('Madurai');
                setRadiusKm(25.0);
                setIsDemoFallback(false);
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
                setIsDemoFallback(false);
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

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Demo fallback notice banner */}
        {isDemoFallback && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-800 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  Showing Active Sample Eateries in Park Town, Chennai
                </p>
                <p className="text-[11px] text-slate-600">
                  No registered stalls found within {radiusKm} km of your GPS location. Loaded sample stalls so you can explore real-time availability!
                </p>
              </div>
            </div>
            <Link
              to="/register"
              className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-all shadow-sm flex-shrink-0"
            >
              Register a Stall Here
            </Link>
          </div>
        )}
        
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-3">
                <div className="h-32 bg-slate-100 rounded-xl" />
                <div className="h-5 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredShops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 max-w-lg mx-auto p-6 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Utensils className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No stalls found in this radius</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              No registered stalls found within {radiusKm} km of this location, or they don't match the selected filter.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                onClick={() => {
                  setUserLocation({ lat: 13.0827, lng: 80.2707 });
                  setRadiusKm(10.0);
                  setSelectedCategory('ALL');
                  setOnlyOpen(false);
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Explore Chennai Stalls (10 km)</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <Link
                key={shop.id}
                to={`/shops/${shop.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/5 transition-all overflow-hidden flex flex-col"
              >
                {/* Stall Header / Banner */}
                <div className="h-36 bg-gradient-to-tr from-amber-100 to-rose-100 relative p-4 flex items-start justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${
                      shop.open
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {shop.open ? 'OPEN NOW' : 'CLOSED'}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm border border-slate-200/50">
                    <MapPin className="w-3 h-3 text-amber-600" />
                    {shop.distanceKm} km away
                  </span>
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
