import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Utensils,
  MapPin,
  Store,
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  Search,
  Check,
} from 'lucide-react';
import { STALL_PHOTO_PRESETS } from '../components/StallPhotoPicker';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/explore?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 1. HERO SECTION - Full Widescreen with Dual Motive Focus */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/80 via-white to-slate-50 border-b border-slate-200 py-16 sm:py-24 px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Soft Background Blur Blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full relative z-10 max-w-6xl mx-auto text-center">
          
          {/* Motive Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-300 text-amber-900 mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
            <span>Find Authentic Street Food &amp; Advertise Your Own Stall</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight sm:leading-none">
            The Right Place to <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-rose-600">Eat, Buy</span> &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-600">Advertise</span> Local Food.
          </h1>

          {/* Core Motive Description */}
          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            LocalBite connects hungry food lovers with neighborhood tea stalls, kulfi carts, tiffin centers, and street snack joints. 
            Check <strong>real-time live food availability</strong> before walking over, or <strong>advertise your own eatery</strong> to thousands of nearby customers with zero commission.
          </p>

          {/* Quick Dish / Stall Search Box */}
          <form
            onSubmit={handleHeroSearchSubmit}
            className="mt-8 max-w-2xl mx-auto bg-white p-2.5 rounded-2xl shadow-xl shadow-amber-500/10 border border-amber-200 flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="w-5 h-5 text-amber-600 absolute left-3.5" />
              <input
                type="text"
                placeholder="Search dish or street (e.g. Mango Kulfi, Masala Dosa, Chai)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-black text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
            >
              <span>Explore Stalls</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Dual Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-black shadow-lg shadow-slate-900/10 transition-all flex items-center gap-2"
            >
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Explore Live Food Radar</span>
            </Link>

            <Link
              to="/register?role=SHOP_OWNER"
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50/80 text-amber-800 text-sm font-black border-2 border-amber-300 shadow-sm transition-all flex items-center gap-2"
            >
              <Store className="w-4 h-4 text-amber-600" />
              <span>Advertise Your Stall (Free Onboarding)</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sub-Second Live WebSocket Updates</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>0% Commission on Food Sales</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero-App QR Standee for Customers</span>
            </span>
          </div>

          {/* Interactive Live Stall Preview Showcase */}
          <div className="mt-14 max-w-4xl mx-auto bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-2xl text-left relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                  Live Stall Radar Preview
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Real-Time Customer Screen View
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              {/* Stall Card Simulation */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div className="h-40 rounded-xl overflow-hidden relative shadow-inner bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80"
                    alt="Kulfi Stall"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 flex gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" /> OPEN NOW
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-slate-800 shadow-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-600" /> 0.8 km
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold tracking-wider text-amber-600 uppercase">
                    Kulfi &amp; Artisanal Ice Creams
                  </span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    Namma Ooru Kulfi Cart
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Near Girls High School, Main Gandhi Road</span>
                  </p>
                </div>

                {/* Live Food Items */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-800">Fresh Mango Kulfi</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      AVAILABLE
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-800">Matka Rabdi Kulfi</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      LIMITED (Only 3 left)
                    </span>
                  </div>
                </div>
              </div>

              {/* Vendor Advertising Feature Simulation */}
              <div className="flex flex-col justify-between p-4 bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-2xl border border-amber-200/80">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white shadow-xs mb-3">
                    <Store className="w-3.5 h-3.5" />
                    <span>For Shop &amp; Cart Owners</span>
                  </div>
                  <h4 className="text-xl font-black text-slate-900 leading-snug">
                    Turn Footfall Into Regulars With Zero Tech Hassle
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    LocalBite gives roadside eateries a live digital showcase. Customers in your city searching for food spot your cart on the street map instantly.
                  </p>

                  <div className="mt-4 space-y-2.5 text-xs text-slate-700 font-medium">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Upload stall front photos &amp; real food varieties</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Update food stock in 1 tap from your phone</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Print customized QR standees for your counter</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-200/60 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Ready to advertise?</p>
                    <p className="text-[11px] text-slate-500">Takes less than 2 minutes</p>
                  </div>
                  <Link
                    to="/register?role=SHOP_OWNER"
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-black rounded-xl shadow-md hover:opacity-90 transition-all"
                  >
                    Register Stall
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. THE TWIN MOTIVES SECTION - Two Audiences, One Platform */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-black text-amber-600 uppercase tracking-wider block mb-2">
            Why LocalBite Exists
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Built for Local Food Lovers &amp; Local Street Eateries
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Big delivery apps ignore roadside stalls and charge 30% commissions. LocalBite bridges the gap directly between local cooks and neighborhood foodies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Motive Card 1: For Foodies */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 shadow-inner">
                <Utensils className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                For Foodies &amp; Snack Seekers
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                The Right Place to Find &amp; Eat Authentic Street Food
              </h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Craving hot masala dosa, steaming idli, cutting chai, or chilled mango kulfi? Never travel across town only to find the stall closed or your favorite dish sold out.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Hyper-Local Map Discovery</h4>
                    <p className="text-xs text-slate-500">Discover roadside stalls pinned right at their physical street corner and landmark.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Live Availability Radar</h4>
                    <p className="text-xs text-slate-500">Check live dish status (Available, Limited, Sold Out) before stepping out of home or office.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Direct From the Cook</h4>
                    <p className="text-xs text-slate-500">Enjoy fresh food right at the counter. Zero inflated delivery prices or cold food.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Find Food Near You</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Motive Card 2: For Stall Owners */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 shadow-inner">
                <Store className="w-7 h-7" />
              </div>
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">
                For Stall &amp; Eatery Owners
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Advertise Your Own Shop &amp; Attract More Customers
              </h3>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Put your tea stall, tiffin cart, or fruit juice spot in front of thousands of nearby customers. Give your business a modern digital presence without paying platform cuts.
              </p>

              <div className="mt-6 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Pin Stall &amp; Upload Photos</h4>
                    <p className="text-xs text-slate-500">Select exact GPS coordinates, type street landmarks, and upload your appetizing food photos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">1-Tap Food Availability Updates</h4>
                    <p className="text-xs text-slate-500">Sold out of Samosas or Kulfi? Tap once on your smartphone to immediately inform all customers.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Smart Countertop QR Standee</h4>
                    <p className="text-xs text-slate-500">Print your custom standee. Customers scan with any phone camera to view live food varieties instantly.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link
                to="/register?role=SHOP_OWNER"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-95 text-white font-black text-sm shadow-md shadow-amber-500/20 transition-all"
              >
                <span>Register &amp; Advertise Your Stall</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. POPULAR STREET FOOD CATEGORIES - Visual Exploration */}
      <section className="py-16 bg-white border-y border-slate-200 px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider block mb-1">
                Craving Something Specific?
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Explore Popular Street Food Varieties
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group self-start sm:self-auto"
            >
              <span>View all categories on map</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {STALL_PHOTO_PRESETS.map((cat) => (
              <Link
                key={cat.name}
                to={`/explore?category=${encodeURIComponent(cat.category)}`}
                className="group relative rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all flex flex-col bg-slate-900 h-52 sm:h-60"
              >
                <img
                  src={cat.url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute top-3 left-3 text-2xl bg-black/40 backdrop-blur-xs p-1.5 rounded-xl">
                  {cat.emoji}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                    {cat.category}
                  </span>
                  <h3 className="text-sm sm:text-base font-black leading-tight mt-0.5">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-white/80 group-hover:text-amber-300 flex items-center gap-1 mt-1 font-semibold">
                    <span>Spot Nearby Stalls</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMPARISON - The LocalBite Difference */}
      <section className="py-20 px-4 sm:px-8 lg:px-12 xl:px-16 w-full max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <span className="text-xs font-black text-amber-600 uppercase tracking-wider block mb-2">
            The LocalBite Difference
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Street Food Vendors &amp; Customers Choose LocalBite
          </h2>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-900 text-white p-4 sm:p-6 text-xs sm:text-sm font-black">
            <div>Feature / Motive</div>
            <div className="text-center text-slate-400 font-semibold">Traditional Delivery Apps</div>
            <div className="text-center text-amber-400">LocalBite Platform</div>
          </div>

          <div className="divide-y divide-slate-100 text-xs sm:text-sm">
            <div className="grid grid-cols-3 p-4 sm:p-5 items-center">
              <span className="font-bold text-slate-800">Platform Commission</span>
              <span className="text-center text-rose-600 font-semibold">25% – 35% cut per order</span>
              <span className="text-center text-emerald-600 font-bold flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> 0% Commission (Free)
              </span>
            </div>

            <div className="grid grid-cols-3 p-4 sm:p-5 items-center bg-slate-50/50">
              <span className="font-bold text-slate-800">Live Inventory Accuracy</span>
              <span className="text-center text-slate-500">Outdated or static PDFs</span>
              <span className="text-center text-emerald-600 font-bold flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> Sub-second live WebSocket sync
              </span>
            </div>

            <div className="grid grid-cols-3 p-4 sm:p-5 items-center">
              <span className="font-bold text-slate-800">Roadside Mini Stall Focus</span>
              <span className="text-center text-slate-500">Focuses only on high-end hotels</span>
              <span className="text-center text-emerald-600 font-bold flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> 100% built for street carts &amp; tiffin spots
              </span>
            </div>

            <div className="grid grid-cols-3 p-4 sm:p-5 items-center bg-slate-50/50">
              <span className="font-bold text-slate-800">Customer Access</span>
              <span className="text-center text-slate-500">Forced heavy app download</span>
              <span className="text-center text-emerald-600 font-bold flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> Zero app required (Web &amp; Camera QR)
              </span>
            </div>

            <div className="grid grid-cols-3 p-4 sm:p-5 items-center">
              <span className="font-bold text-slate-800">Stall Advertising</span>
              <span className="text-center text-slate-500">Must pay hefty ad budget</span>
              <span className="text-center text-emerald-600 font-bold flex items-center justify-center gap-1">
                <Check className="w-4 h-4" /> Instant hyper-local street radar visibility
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VENDOR CALLOUT BANNER - Drive Stall Registrations */}
      <section className="py-16 px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs text-white inline-block mb-3">
              📢 Advertise Your Roadside Stall
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to attract more food lovers to your stall today?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/90 leading-relaxed">
              Join LocalBite. Pin your exact cart location on Google-style maps, upload your appetizing food photos, update live availability in 1 tap, and print your countertop QR standee.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link
              to="/register?role=SHOP_OWNER"
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all text-center"
            >
              Register Stall (Free)
            </Link>
            <Link
              to="/explore"
              className="px-8 py-4 bg-black/25 hover:bg-black/35 text-white font-bold text-sm rounded-2xl backdrop-blur-xs transition-all text-center border border-white/20"
            >
              Explore Live Stalls
            </Link>
          </div>
        </div>
      </section>

      {/* 6. COMPREHENSIVE FOOTER */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 px-4 sm:px-8 lg:px-12 xl:px-16 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8 pb-10 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-md">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Local<span className="text-amber-500">Bite</span>
              </span>
            </div>
            <p className="mt-3 text-slate-400 max-w-sm text-xs leading-relaxed">
              Hyper-local street food discovery &amp; live availability broadcast platform. Helping people find authentic food and helping vendors advertise their stalls.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">For Foodies</p>
              <ul className="space-y-2">
                <li><Link to="/explore" className="hover:text-amber-400">Explore Nearby Stalls</Link></li>
                <li><Link to="/explore?category=Tiffin %26 Breakfast" className="hover:text-amber-400">Tiffin Centers</Link></li>
                <li><Link to="/explore?category=Tea %26 Coffee Stall" className="hover:text-amber-400">Chai &amp; Filter Coffee</Link></li>
                <li><Link to="/explore?category=Kulfi %26 Ice Creams" className="hover:text-amber-400">Kulfi &amp; Ice Creams</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">For Stall Owners</p>
              <ul className="space-y-2">
                <li><Link to="/register?role=SHOP_OWNER" className="hover:text-amber-400">Register Your Stall</Link></li>
                <li><Link to="/login" className="hover:text-amber-400">Owner Login</Link></li>
                <li><Link to="/owner/dashboard" className="hover:text-amber-400">1-Tap Food Manager</Link></li>
                <li><Link to="/owner/subscription" className="hover:text-amber-400">Subscription Plans</Link></li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Platform</p>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-amber-400">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-amber-400">Create Account</Link></li>
                <li><Link to="/admin/dashboard" className="hover:text-amber-400">Platform Admin</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} LocalBite Open Platform. Empowering local street food vendors &amp; foodies.</p>
          <div className="flex gap-4">
            <span>Sub-second Live Push</span>
            <span>•</span>
            <span>Hyper-Local GPS Radar</span>
            <span>•</span>
            <span>0% Commission</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
