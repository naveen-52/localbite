import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Utensils,
  MapPin,
  Store,
  Clock,
  ArrowRight,
  CheckCircle2,
  Search,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Flame,
  Radio,
} from 'lucide-react';

// Curated authentic street food categories with publication-quality imagery
const STREET_FOOD_CATEGORIES = [
  {
    name: 'Tea & Coffee Corner',
    category: 'Tea & Coffee Stall',
    emoji: '🫖',
    badge: 'Popular Morning & Evening',
    description: 'Hot cutting chai, ginger tea, and strong South Indian filter coffee.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Hot Tiffin & Dosa Center',
    category: 'Tiffin & Breakfast',
    emoji: '🥞',
    badge: 'Fresh Off The Tawa',
    description: 'Crispy ghee roast dosas, steaming soft idlis, and hot medu vadas.',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Street Chaat & Pani Puri',
    category: 'Chaat & Street Snacks',
    emoji: '🧆',
    badge: 'Evening Favorite',
    description: 'Crispy tangy pani puris, bhel puri, samosa chaat, and sev puri.',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fresh Juices & Thick Shakes',
    category: 'Fresh Juices & Shakes',
    emoji: '🥤',
    badge: 'Cold & Refreshing',
    description: 'Pure cold-pressed seasonal juices, tender coconut, and fruit milkshakes.',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Kulfi & Artisanal Ice Creams',
    category: 'Kulfi & Ice Creams',
    emoji: '🍨',
    badge: 'Sweet Chilled Delight',
    description: 'Authentic matka rabdi kulfi, mango stick kulfi, and faloodas.',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fast Food & Grilled Sandwiches',
    category: 'Fast Food & Sandwiches',
    emoji: '🥪',
    badge: 'Quick Bites',
    description: 'Street-style Bombay sandwiches, spicy noodles, rolls, and frankies.',
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sweet & Savory Bakery',
    category: 'Sweet & Savory',
    emoji: '🥟',
    badge: 'Crispy & Crunchy',
    description: 'Hot samosas, onion pakodas, freshly baked puffs, and traditional sweets.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Street Dum Biryani Handi',
    category: 'Biryani & Pulao Point',
    emoji: '🍗',
    badge: 'Steaming Hot Pot',
    description: 'Aromatic wood-fired street biryani, kuska, and spiced chicken kebabs.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  },
];

// Interactive sample stalls for live radar showcase
const SAMPLE_RADAR_STALLS = [
  {
    id: 1,
    name: 'Namma Ooru Kulfi & Juice Cart',
    category: 'Kulfi & Ice Creams',
    distance: '0.4 km',
    landmark: 'Opp. Girls High School, Gandhi Road',
    openStatus: 'OPEN NOW',
    photo: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80',
    dishes: [
      { name: 'Fresh Alphonso Mango Kulfi', price: '₹40', status: 'AVAILABLE', tag: 'Fresh Batch' },
      { name: 'Matka Rabdi Malai Kulfi', price: '₹50', status: 'LIMITED', tag: 'Only 3 left' },
      { name: 'Cold Badam Milk Shake', price: '₹35', status: 'AVAILABLE', tag: 'Chilled' },
    ],
    mapCoord: { x: '58%', y: '42%' },
  },
  {
    id: 2,
    name: 'Sharmaji Cutting Chai & Samosa Stall',
    category: 'Tea & Coffee Stall',
    distance: '0.7 km',
    landmark: 'Railway Station Road, Corner Shop',
    openStatus: 'OPEN NOW',
    photo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
    dishes: [
      { name: 'Special Adrak Elaichi Chai', price: '₹12', status: 'AVAILABLE', tag: 'Steaming Hot' },
      { name: 'Punjabi Aloo Samosa (2 pcs)', price: '₹30', status: 'LIMITED', tag: 'Frying Batch 2' },
      { name: 'Crispy Onion Pakoda (100g)', price: '₹25', status: 'AVAILABLE', tag: 'Crispy' },
    ],
    mapCoord: { x: '35%', y: '65%' },
  },
  {
    id: 3,
    name: 'Annapoorna Hot Tiffin Center',
    category: 'Tiffin & Breakfast',
    distance: '1.1 km',
    landmark: 'Weekly Market Cross Road',
    openStatus: 'OPEN NOW',
    photo: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
    dishes: [
      { name: 'Ghee Podi Masala Dosa', price: '₹55', status: 'AVAILABLE', tag: 'Chef Special' },
      { name: 'Mini Guntur Idli (14 pcs)', price: '₹40', status: 'AVAILABLE', tag: 'Hot & Soft' },
      { name: 'Medu Vada with Sambar', price: '₹20', status: 'SOLD OUT', tag: 'Sold Out' },
    ],
    mapCoord: { x: '72%', y: '30%' },
  },
];

// Interactive search suggestion pills
const SEARCH_SUGGESTIONS = [
  'Mango Kulfi',
  'Masala Dosa',
  'Cutting Chai',
  'Pani Puri',
  'Hot Samosa',
  'Filter Coffee',
  'Chicken Biryani',
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeStall = SAMPLE_RADAR_STALLS[activePreviewIndex];

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/explore?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setHeroSearch(suggestion);
    navigate(`/explore?q=${encodeURIComponent(suggestion)}`);
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen warm-festival-bg flex flex-col font-sans overflow-x-hidden text-[#25233A]">
      
      {/* =========================================================================
          1. HERO SECTION - Vibrant Food Festival with Subtle Warm Radial Gradient
         ========================================================================= */}
      <section className="relative overflow-hidden hero-radial-bg border-b border-[#25233A]/10 pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Subtle Decorative Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#FFD43B]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-24 right-10 w-96 h-96 bg-[#FF8A00]/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#EF4444]/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="w-full relative z-10 max-w-6xl mx-auto text-center">
          
          {/* Top Motive Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 border border-[#FF8A00]/40 text-[#25233A] mb-6 shadow-xs backdrop-blur-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8A00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8A00]"></span>
            </span>
            <span>Hyper-Local Street Food Discovery &amp; Vendor Showcase</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#25233A] tracking-tight leading-[1.1] sm:leading-tight">
            The Right Place to{' '}
            <span className="text-[#C92F32] underline decoration-[#FFD43B] decoration-wavy decoration-from-font">
              Eat, Buy
            </span>{' '}
            &amp;{' '}
            <span className="text-[#FF8A00]">
              Advertise
            </span>{' '}
            Local Food.
          </h1>

          {/* Supporting Subtitle */}
          <p className="mt-5 sm:mt-6 text-base sm:text-lg lg:text-xl text-[#25233A]/80 max-w-3xl mx-auto leading-relaxed">
            LocalBite connects hungry food lovers directly with neighborhood tea stalls, kulfi carts, tiffin centers, and street snack spots. 
            Check <strong>real-time live food availability</strong> before you walk over, or <strong>advertise your own eatery</strong> to nearby customers with zero commission.
          </p>

          {/* Prominent Search Bar with Integrated Button */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="mt-8 max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-[#25233A]/5 border border-[#25233A]/15 flex flex-col sm:flex-row items-center gap-2 focus-within:border-[#FF8A00] focus-within:ring-2 focus-within:ring-[#FF8A00]/20 transition-all"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-5 h-5 text-[#FF8A00] absolute left-3.5" />
              <input
                type="text"
                placeholder="Search dish, cart or street (e.g. Mango Kulfi, Masala Dosa, Chai)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl text-[#25233A] placeholder:text-[#25233A]/40 focus:outline-none text-sm font-medium"
              />
              {heroSearch && (
                <button
                  type="button"
                  onClick={() => setHeroSearch('')}
                  className="mr-3 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3.5 bg-[#C92F32] hover:bg-[#AE292E] text-white font-black text-sm rounded-xl shadow-md shadow-[#C92F32]/25 transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer active:scale-98"
            >
              <span>Explore Stalls</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Interactive Search Suggestion Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#25233A]/60 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-[#FF8A00]" /> Trending:
            </span>
            {SEARCH_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 rounded-full bg-white/80 hover:bg-white text-[#25233A] border border-[#25233A]/10 hover:border-[#FF8A00] transition-all font-medium text-[11px] shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Dual Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              className="px-7 py-3.5 rounded-2xl bg-[#C92F32] hover:bg-[#AE292E] text-white text-sm font-black shadow-lg shadow-[#C92F32]/20 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-98"
            >
              <Utensils className="w-4 h-4 text-[#FFD43B]" />
              <span>Explore Live Food Radar</span>
            </Link>

            <Link
              to="/register?role=SHOP_OWNER"
              className="px-7 py-3.5 rounded-2xl bg-white hover:bg-[#FFF8EC] text-[#25233A] text-sm font-black border-2 border-[#FF8A00] shadow-sm transition-all flex items-center gap-2 hover:-translate-y-0.5 active:scale-98"
            >
              <Store className="w-4 h-4 text-[#FF8A00]" />
              <span>Advertise Your Stall (Free Onboarding)</span>
            </Link>
          </div>

          {/* Feature Guarantee Indicators */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-[#25233A]/80 pt-6 border-t border-[#25233A]/10">
            <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-full border border-[#25233A]/5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Sub-Second Live WebSocket Updates</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-full border border-[#25233A]/5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#FF8A00] flex-shrink-0" />
              <span>0% Commission on Food Sales</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-full border border-[#25233A]/5 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Zero-App Instant QR Standee</span>
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================================
          2. INTERACTIVE LIVE RADAR PREVIEW - Authentic Real-Time Discovery Showcase
         ========================================================================= */}
      <section className="py-14 sm:py-20 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-7xl mx-auto">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#FF8A00]/15 text-[#FF8A00] mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Interactive Live Radar Preview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#25233A] tracking-tight">
            See What's Cooking Nearby In Real-Time
          </h2>
          <p className="text-sm text-[#25233A]/70 mt-2">
            Switch between nearby roadside eateries to preview how foodies check live availability before stepping out.
          </p>
        </div>

        {/* Live Interactive Showcase Card Container */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#25233A]/15 shadow-xl shadow-[#25233A]/5 overflow-hidden">
          
          {/* Quick Stall Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 border-b border-slate-100 no-scrollbar">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 whitespace-nowrap mr-1">
              Select Sample Stall:
            </span>
            {SAMPLE_RADAR_STALLS.map((stall, idx) => (
              <button
                key={stall.id}
                onClick={() => setActivePreviewIndex(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                  activePreviewIndex === idx
                    ? 'bg-[#25233A] text-white shadow-md'
                    : 'bg-slate-100 text-[#25233A]/70 hover:bg-slate-200'
                }`}
              >
                <span>{stall.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  activePreviewIndex === idx ? 'bg-[#FF8A00] text-white' : 'bg-white text-slate-600'
                }`}>
                  {stall.distance}
                </span>
              </button>
            ))}
          </div>

          {/* Interactive Split View: Map Radar Simulation (Left) + Live Stall Card (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
            
            {/* Left: Interactive Simulated Radar Map (5 Cols) */}
            <div className="lg:col-span-5 bg-[#25233A] rounded-2xl p-6 text-white relative overflow-hidden min-h-[320px] sm:min-h-[360px] flex flex-col justify-between border border-slate-800 shadow-inner">
              
              {/* Radar Grid Overlay */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px), linear-gradient(to right, #FFF 1px, transparent 1px), linear-gradient(to bottom, #FFF 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />

              {/* Concentric Pulsing Radar Rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-emerald-500/30 radar-pulse-ring pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-emerald-500/20 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-slate-700/40 pointer-events-none" />

              {/* Center User Dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-300 mt-1 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-xs">
                  You are here
                </span>
              </div>

              {/* Stall Markers Placed on Radar */}
              {SAMPLE_RADAR_STALLS.map((stall, idx) => (
                <button
                  key={stall.id}
                  onClick={() => setActivePreviewIndex(idx)}
                  className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 p-1.5 rounded-xl transition-all cursor-pointer ${
                    activePreviewIndex === idx
                      ? 'bg-[#FF8A00] text-white ring-4 ring-[#FF8A00]/40 scale-110 shadow-lg'
                      : 'bg-white/90 text-[#25233A] hover:bg-white hover:scale-105'
                  }`}
                  style={{ top: stall.mapCoord.y, left: stall.mapCoord.x }}
                  title={stall.name}
                >
                  <MapPin className="w-3.5 h-3.5 text-[#C92F32]" />
                  <span className="text-[10px] font-black whitespace-nowrap hidden sm:inline max-w-[90px] truncate">
                    {stall.name.split(' ')[0]}
                  </span>
                </button>
              ))}

              {/* Top Radar Info Badge */}
              <div className="relative z-10 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-xs text-emerald-400 font-extrabold border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live GPS Scanning
                </span>
                <span className="text-[11px] text-slate-400 font-semibold bg-black/40 px-2.5 py-1 rounded-lg">
                  Radius: 5.0 km
                </span>
              </div>

              {/* Bottom Radar Action */}
              <div className="relative z-10 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-300 font-bold">Active Radar Stall</p>
                  <p className="text-xs text-white font-black truncate max-w-[180px]">{activeStall.name}</p>
                </div>
                <Link
                  to="/explore"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Open Full Map</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

            {/* Right: Live Stall Details & Live Menu Cards (7 Cols) */}
            <div className="lg:col-span-7 bg-[#FFF8EC]/60 rounded-2xl p-5 sm:p-6 border border-[#FF8A00]/20 flex flex-col justify-between">
              
              <div>
                {/* Stall Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#25233A]/10">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeStall.photo}
                      alt={activeStall.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-[#25233A]/10 shadow-sm"
                    />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#FF8A00]">
                        {activeStall.category}
                      </span>
                      <h3 className="text-xl font-black text-[#25233A] leading-tight">
                        {activeStall.name}
                      </h3>
                      <p className="text-xs text-[#25233A]/60 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#FF8A00]" />
                        <span>{activeStall.landmark}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {activeStall.openStatus}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-white text-[#25233A] border border-slate-200">
                      {activeStall.distance} away
                    </span>
                  </div>
                </div>

                {/* Real-time Dishes Inventory */}
                <div className="mt-4 space-y-2.5">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#25233A]/60">
                    Live Stock Broadcast (<span className="text-emerald-700">Sub-Second WebSocket Sync</span>):
                  </p>
                  
                  {activeStall.dishes.map((dish, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#25233A]/10 shadow-2xs hover:border-[#FF8A00]/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-[#25233A]">{dish.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {dish.tag}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#FF8A00]">{dish.price}</span>
                      </div>

                      <div>
                        {dish.status === 'AVAILABLE' && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            AVAILABLE
                          </span>
                        )}
                        {dish.status === 'LIMITED' && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-[#FF8A00]/10 text-[#FF8A00] border border-[#FF8A00]/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF8A00]" />
                            LIMITED STOCK
                          </span>
                        )}
                        {dish.status === 'SOLD OUT' && (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <X className="w-3 h-3" />
                            SOLD OUT
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer with Direct Explore Link */}
              <div className="mt-6 pt-4 border-t border-[#25233A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[11px] text-[#25233A]/70 font-semibold">
                  Scan countertop standee at stall with any phone camera. Zero app install.
                </span>
                <Link
                  to="/explore"
                  className="px-5 py-2.5 bg-[#C92F32] hover:bg-[#AE292E] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>Explore All Stalls Near You</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =========================================================================
          3. STREET FOOD CATEGORIES CAROUSEL - Visual Food Festival
         ========================================================================= */}
      <section className="py-16 bg-white border-y border-[#25233A]/10 px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-black text-[#FF8A00] uppercase tracking-wider block mb-1">
                Authentic Taste On Every Corner
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#25233A] tracking-tight">
                Explore Street Food Varieties
              </h2>
            </div>
            
            {/* Carousel Navigation Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#25233A] shadow-xs hover:border-[#FF8A00] transition-all cursor-pointer active:scale-95"
                aria-label="Previous categories"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-[#25233A] shadow-xs hover:border-[#FF8A00] transition-all cursor-pointer active:scale-95"
                aria-label="Next categories"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrolling Carousel with Snapping */}
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto pb-4 carousel-snap no-scrollbar scroll-smooth"
          >
            {STREET_FOOD_CATEGORIES.map((item) => (
              <Link
                key={item.category}
                to={`/explore?category=${encodeURIComponent(item.category)}`}
                className="carousel-item-snap flex-shrink-0 w-72 sm:w-80 group relative rounded-3xl overflow-hidden bg-slate-900 border border-[#25233A]/10 card-hover-lift flex flex-col justify-end p-5 text-white h-72 sm:h-80"
              >
                {/* Background Image with Zoom Effect */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-85 group-hover:opacity-95"
                />
                
                {/* Multi-layered Gradient for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#25233A] via-[#25233A]/40 to-transparent" />
                
                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-2xl bg-black/50 backdrop-blur-md p-2 rounded-2xl shadow-sm">
                    {item.emoji}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-[#FF8A00] text-white px-2.5 py-1 rounded-full shadow-sm">
                    {item.badge}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight group-hover:text-[#FFD43B] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-black text-[#FF8A00] group-hover:text-[#FFD43B] transition-colors">
                    <span>Spot Live Stalls</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* =========================================================================
          4. THE TWIN MOTIVES - For Foodies & For Roadside Stall Owners
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-black text-[#C92F32] uppercase tracking-wider block mb-2">
            Two Sides • One Live Platform
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#25233A] tracking-tight">
            Built for Street Foodies &amp; Roadside Vendors
          </h2>
          <p className="text-sm sm:text-base text-[#25233A]/70 mt-3">
            Big food delivery aggregators ignore roadside food stalls and charge 30% cuts. LocalBite empowers the authentic street cooking ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Motive Card 1: For Foodies */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#25233A]/10 shadow-sm card-hover-lift flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8EC] text-[#C92F32] border border-[#C92F32]/20 flex items-center justify-center mb-6 shadow-xs">
                <Utensils className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-[#C92F32] uppercase tracking-wider">
                For Foodies &amp; Snack Seekers
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#25233A] mt-1">
                The Right Place to Find &amp; Eat Authentic Street Food
              </h3>
              <p className="text-[#25233A]/70 text-sm mt-3 leading-relaxed">
                Never travel across town only to find the stall closed or your favorite snack sold out. Check live inventory on your phone before stepping out.
              </p>

              {/* 4 Feature Items */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 text-xs font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#25233A]">Hyper-Local Street Map Discovery</h4>
                    <p className="text-xs text-[#25233A]/60 mt-0.5">Find carts pinned right at their street corner, tree landmark, or bus stop.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 text-xs font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#25233A]">Real-Time Availability Radar</h4>
                    <p className="text-xs text-[#25233A]/60 mt-0.5">Sub-second live badges: Available, Limited Batch, or Sold Out.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 text-xs font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#25233A]">Direct Counter Pricing</h4>
                    <p className="text-xs text-[#25233A]/60 mt-0.5">Zero delivery markups or hidden fees. Pay authentic counter prices directly.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 text-xs font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#25233A]">100% Guest Friendly</h4>
                    <p className="text-xs text-[#25233A]/60 mt-0.5">Search stalls, check menus, and scan QR standees without any mandatory login.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#C92F32] hover:bg-[#AE292E] text-white font-black text-sm shadow-md transition-all active:scale-98"
              >
                <span>Find Food Near You</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Motive Card 2: For Stall Owners */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#FF8A00]/30 shadow-sm card-hover-lift flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-[#FF8A00]/10 to-transparent w-48 h-48 pointer-events-none rounded-bl-full" />
            
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#FF8A00]/10 text-[#FF8A00] border border-[#FF8A00]/30 flex items-center justify-center mb-6 shadow-xs">
                <Store className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-[#FF8A00] uppercase tracking-wider">
                For Stall &amp; Eatery Owners
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#25233A] mt-1">
                Advertise Your Own Shop &amp; Attract More Customers
              </h3>
              <p className="text-[#25233A]/70 text-sm mt-3 leading-relaxed">
                Put your tea stall, tiffin cart, or fruit juice spot in front of thousands of nearby customers with 0% platform commission.
              </p>

              {/* 4 Feature Items */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-[#FF8A00] flex items-center justify-center flex-shrink-0 text-xs font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#25233A]">Pin Real Location on Google-Style Map</h4>
                    <p className="text-xs text-[#25233A]/60 mt-0.5">Drag the pin to your exact roadside cart corner or tree landmark.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-[#FF8A00] flex items-center justify-center flex-shrink-0 text-xs font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#25233A]">1-Tap Mobile Stock Updates</h4>
                    <p className="text-xs text-[#25233A]/60 mt-0.5">Sold out of Samosas or Kulfi? Tap once on your phone in under 3 seconds.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-[#FF8A00] flex items-center justify-center flex-shrink-0 text-xs font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#25233A]">Branded Countertop QR Standee</h4>
                    <p className="text-xs text-[#25233A]/60 mt-0.5">Download your print-ready standee. Customers scan with any camera to view live menus.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-[#FF8A00] flex items-center justify-center flex-shrink-0 text-xs font-black">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#25233A]">0% Commission (Keep 100% of Earnings)</h4>
                    <p className="text-xs text-[#25233A]/60 mt-0.5">We never take a cut from your daily food sales. Direct customer relationships.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100">
              <Link
                to="/register?role=SHOP_OWNER"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-[#FF8A00] hover:bg-[#e07a00] text-white font-black text-sm shadow-md shadow-[#FF8A00]/25 transition-all active:scale-98"
              >
                <span>Register &amp; Advertise Your Stall</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          5. PLATFORM COMPARISON - The LocalBite Advantage
         ========================================================================= */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="text-xs font-black text-[#FF8A00] uppercase tracking-wider block mb-2">
            Why LocalBite Exists
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#25233A] tracking-tight">
            How LocalBite Compares To Traditional Apps
          </h2>
          <p className="text-sm text-[#25233A]/70 mt-2">
            Delivery aggregators are built for high-end restaurants. LocalBite is purpose-built for roadside street food culture.
          </p>
        </div>

        {/* Comparison Table / Matrix Card */}
        <div className="bg-white rounded-3xl border border-[#25233A]/15 shadow-xl shadow-[#25233A]/5 overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-[#25233A] text-white p-5 sm:p-6 text-xs sm:text-sm font-black items-center">
            <div className="col-span-5 sm:col-span-4">Platform Feature</div>
            <div className="col-span-3 sm:col-span-4 text-center text-slate-300 font-semibold">Traditional Apps</div>
            <div className="col-span-4 text-center text-[#FFD43B]">LocalBite Platform</div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-slate-100 text-xs sm:text-sm font-medium">
            
            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-slate-50/60 transition-colors">
              <span className="col-span-5 sm:col-span-4 font-black text-[#25233A]">Platform Commission</span>
              <span className="col-span-3 sm:col-span-4 text-center text-rose-600 font-bold flex items-center justify-center gap-1">
                <X className="w-4 h-4 hidden sm:inline" /> 25% – 35% cut
              </span>
              <span className="col-span-4 text-center text-emerald-700 font-black flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded-xl">
                <Check className="w-4 h-4 text-emerald-600" /> 0% Commission (Free)
              </span>
            </div>

            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-slate-50/60 transition-colors bg-[#FFF8EC]/30">
              <span className="col-span-5 sm:col-span-4 font-black text-[#25233A]">Live Stock Accuracy</span>
              <span className="col-span-3 sm:col-span-4 text-center text-slate-500 flex items-center justify-center gap-1">
                <X className="w-4 h-4 hidden sm:inline text-rose-500" /> Outdated or static PDFs
              </span>
              <span className="col-span-4 text-center text-emerald-700 font-black flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded-xl">
                <Check className="w-4 h-4 text-emerald-600" /> Sub-second live WebSocket sync
              </span>
            </div>

            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-slate-50/60 transition-colors">
              <span className="col-span-5 sm:col-span-4 font-black text-[#25233A]">Roadside Stall Focus</span>
              <span className="col-span-3 sm:col-span-4 text-center text-slate-500 flex items-center justify-center gap-1">
                <X className="w-4 h-4 hidden sm:inline text-rose-500" /> High-end hotels only
              </span>
              <span className="col-span-4 text-center text-emerald-700 font-black flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded-xl">
                <Check className="w-4 h-4 text-emerald-600" /> 100% street carts &amp; tiffin spots
              </span>
            </div>

            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-slate-50/60 transition-colors bg-[#FFF8EC]/30">
              <span className="col-span-5 sm:col-span-4 font-black text-[#25233A]">Customer Access</span>
              <span className="col-span-3 sm:col-span-4 text-center text-slate-500 flex items-center justify-center gap-1">
                <X className="w-4 h-4 hidden sm:inline text-rose-500" /> Forced 60MB app download
              </span>
              <span className="col-span-4 text-center text-emerald-700 font-black flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded-xl">
                <Check className="w-4 h-4 text-emerald-600" /> Zero app required (Web &amp; QR)
              </span>
            </div>

            <div className="grid grid-cols-12 p-4 sm:p-5 items-center hover:bg-slate-50/60 transition-colors">
              <span className="col-span-5 sm:col-span-4 font-black text-[#25233A]">Stall Advertising</span>
              <span className="col-span-3 sm:col-span-4 text-center text-slate-500 flex items-center justify-center gap-1">
                <X className="w-4 h-4 hidden sm:inline text-rose-500" /> Expensive ad bidding
              </span>
              <span className="col-span-4 text-center text-emerald-700 font-black flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded-xl">
                <Check className="w-4 h-4 text-emerald-600" /> Instant street radar visibility
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          6. VENDOR CONVERSION SECTION - Promote Free Stall Onboarding
         ========================================================================= */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-[#C92F32] via-[#FF8A00] to-[#FF8A00] p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          
          <div className="max-w-2xl relative z-10">
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white inline-block mb-3">
              📢 Street Eatery &amp; Cart Owners
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to Attract More Food Lovers to Your Stall?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/95 leading-relaxed font-medium">
              Join LocalBite in under 2 minutes. Pin your cart on the street map, upload food photos, toggle stock in 1 tap, and download your printable countertop QR standee.
            </p>

            {/* 3 Simple Onboarding Steps */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold text-white">
              <div className="bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/15">
                <span className="text-[#FFD43B] font-black text-sm block">1. Pin Location</span>
                <span className="text-white/80 text-[11px]">Exact corner or landmark on map.</span>
              </div>
              <div className="bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/15">
                <span className="text-[#FFD43B] font-black text-sm block">2. Add Menu</span>
                <span className="text-white/80 text-[11px]">Upload photos and counter rates.</span>
              </div>
              <div className="bg-black/20 backdrop-blur-xs p-3 rounded-xl border border-white/15">
                <span className="text-[#FFD43B] font-black text-sm block">3. Print Standee</span>
                <span className="text-white/80 text-[11px]">Place on counter for customer scans.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 flex-shrink-0 relative z-10">
            <Link
              to="/register?role=SHOP_OWNER"
              className="px-8 py-4 bg-white hover:bg-slate-50 text-[#25233A] font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all text-center active:scale-98"
            >
              Register Your Stall (Free)
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 bg-black/25 hover:bg-black/35 text-white font-bold text-sm rounded-2xl backdrop-blur-xs transition-all text-center border border-white/20 active:scale-98"
            >
              Explore Live Stalls
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. COMPREHENSIVE FOOTER - Deep Charcoal Visual Finish
         ========================================================================= */}
      <footer className="mt-auto bg-[#25233A] text-slate-300 py-14 px-4 sm:px-8 lg:px-12 xl:px-16 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 pb-12 border-b border-slate-800">
          
          {/* Logo & Platform Mission */}
          <div className="max-w-sm">
            <Link to="/" className="inline-block bg-white p-2 rounded-2xl shadow-sm hover:scale-105 transition-transform mb-3">
              <img
                src="/logo.png"
                alt="LocalBite Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mt-2 font-medium">
              Hyper-local street food discovery &amp; live availability broadcast platform. Connecting food lovers with authentic tea stalls, tiffin carts, and roadside eateries with zero commission.
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="font-black text-white uppercase tracking-wider text-[11px] mb-3 text-[#FFD43B]">
                For Foodies
              </p>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li><Link to="/explore" className="hover:text-white transition-colors">Explore Nearby Stalls</Link></li>
                <li><Link to="/explore?category=Tiffin %26 Breakfast" className="hover:text-white transition-colors">Tiffin Centers</Link></li>
                <li><Link to="/explore?category=Tea %26 Coffee Stall" className="hover:text-white transition-colors">Chai &amp; Filter Coffee</Link></li>
                <li><Link to="/explore?category=Kulfi %26 Ice Creams" className="hover:text-white transition-colors">Kulfi &amp; Ice Creams</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Live Availability Map</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-black text-white uppercase tracking-wider text-[11px] mb-3 text-[#FF8A00]">
                For Stall Owners
              </p>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li><Link to="/register?role=SHOP_OWNER" className="hover:text-white transition-colors">Register Your Stall</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Owner Login</Link></li>
                <li><Link to="/owner/dashboard" className="hover:text-white transition-colors">1-Tap Food Manager</Link></li>
                <li><Link to="/owner/subscription" className="hover:text-white transition-colors">Subscription Plans</Link></li>
                <li><Link to="/register?role=SHOP_OWNER" className="hover:text-white transition-colors">Print Standee Guide</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-black text-white uppercase tracking-wider text-[11px] mb-3 text-[#EF4444]">
                Platform
              </p>
              <ul className="space-y-2 text-slate-400 font-medium">
                <li><Link to="/login" className="hover:text-white transition-colors">Owner &amp; Admin Sign In</Link></li>
                <li><Link to="/register?role=SHOP_OWNER" className="hover:text-white transition-colors">Register Your Stall</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-white transition-colors">Admin Control Hub</Link></li>
                <li><Link to="/explore" className="hover:text-white transition-colors">Open Street Radar</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Guarantee Tags */}
        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} LocalBite Open Platform. Empowering local street food vendors &amp; foodies.</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-emerald-400 font-bold">Sub-Second Live Push</span>
            <span>•</span>
            <span className="text-[#FF8A00] font-bold">Hyper-Local GPS Radar</span>
            <span>•</span>
            <span className="text-[#FFD43B] font-bold">0% Commission</span>
          </div>
        </div>
      </footer>

    </div>
  );
};