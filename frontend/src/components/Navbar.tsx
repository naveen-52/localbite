import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, LogOut, User as UserIcon, ShieldAlert, Menu, X, Compass, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#25233A]/10 shadow-xs">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 group flex-shrink-0">
            <img
              src="/logo.png"
              alt="LocalBite Logo"
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Stalls
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#25233A]">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-xl transition-all ${
                isActive('/')
                  ? 'bg-[#25233A] text-white shadow-xs'
                  : 'text-[#25233A]/80 hover:text-[#25233A] hover:bg-[#FFF8EC]'
              }`}
            >
              Home
            </Link>

            <Link
              to="/explore"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                isActive('/explore') || isActive('/stalls')
                  ? 'bg-[#C92F32] text-white shadow-xs'
                  : 'text-[#25233A]/80 hover:text-[#25233A] hover:bg-[#FFF8EC]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Stalls Radar</span>
            </Link>

            {/* Vendor Callout CTA */}
            <Link
              to="/register?role=SHOP_OWNER"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[#FF8A00] bg-[#FF8A00]/10 hover:bg-[#FF8A00]/20 border border-[#FF8A00]/25 transition-all ml-1 font-bold"
            >
              <Store className="w-3.5 h-3.5 text-[#FF8A00]" />
              <span>Advertise Your Stall</span>
            </Link>
          </nav>
        </div>

        {/* Right: Actions & User RBAC */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {user?.role === 'SHOP_OWNER' && (
                <Link
                  to="/owner/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#FF8A00] bg-[#FF8A00]/10 border border-[#FF8A00]/30 hover:bg-[#FF8A00]/20 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">My Stall</span>
                </Link>
              )}

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#C92F32] bg-[#C92F32]/10 border border-[#C92F32]/30 hover:bg-[#C92F32]/20 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Hub</span>
                </Link>
              )}

              <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-[#FFF8EC] border border-[#FF8A00]/30 flex items-center justify-center text-[#25233A] font-bold text-xs">
                  {user?.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <p className="font-bold text-[#25233A] leading-tight truncate max-w-[120px]">{user?.fullName}</p>
                  <p className="text-[#25233A]/60 leading-tight capitalize text-[10px]">{user?.role.toLowerCase().replace('_', ' ')}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-500 hover:text-[#C92F32] hover:bg-rose-50 transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register?role=SHOP_OWNER"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#25233A] hover:bg-[#FFF8EC] border border-slate-200 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-[#FF8A00]" />
                <span>Register Stall</span>
              </Link>
              
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-white bg-[#C92F32] hover:bg-[#AE292E] shadow-sm transition-all"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            </>
          )}

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#25233A] hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-[#C92F32]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 shadow-xl px-4 py-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3">
            {/* Customer Group */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1">
                Foodies &amp; Discovery
              </p>
              <div className="space-y-1">
                <Link
                  to="/"
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                    isActive('/') ? 'bg-[#25233A] text-white' : 'text-[#25233A] hover:bg-[#FFF8EC]'
                  }`}
                >
                  <span>Home</span>
                  <Compass className="w-4 h-4 opacity-70" />
                </Link>

                <Link
                  to="/explore"
                  onClick={closeMobileMenu}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold ${
                    isActive('/explore') ? 'bg-[#C92F32] text-white' : 'text-[#25233A] hover:bg-[#FFF8EC]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Live Stalls Radar</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </Link>
              </div>
            </div>

            {/* Vendor Group */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-[#FF8A00] px-2 mb-1">
                Roadside Stall Owners
              </p>
              <div className="space-y-1">
                <Link
                  to="/register?role=SHOP_OWNER"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold bg-[#FF8A00]/10 text-[#FF8A00] border border-[#FF8A00]/30 hover:bg-[#FF8A00]/20"
                >
                  <span>Advertise Your Stall</span>
                  <Store className="w-4 h-4" />
                </Link>

                {!isAuthenticated && (
                  <Link
                    to="/register?role=SHOP_OWNER"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <span>Register New Stall (Free)</span>
                    <Store className="w-4 h-4 text-slate-400" />
                  </Link>
                )}
              </div>
            </div>

            {/* User / Auth Options on Mobile */}
            <div className="pt-2 border-t border-slate-100">
              {isAuthenticated ? (
                <div className="space-y-1">
                  {user?.role === 'SHOP_OWNER' && (
                    <Link
                      to="/owner/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#FF8A00] bg-[#FF8A00]/10"
                    >
                      <span>Owner Dashboard &amp; Stock</span>
                      <Store className="w-4 h-4" />
                    </Link>
                  )}
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin/dashboard"
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#C92F32] bg-[#C92F32]/10"
                    >
                      <span>Admin Control Hub</span>
                      <ShieldAlert className="w-4 h-4" />
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 text-left"
                  >
                    <span>Sign Out</span>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex-1 py-2.5 text-center text-xs font-black text-white bg-[#C92F32] hover:bg-[#AE292E] rounded-xl shadow-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="flex-1 py-2.5 text-center text-xs font-bold text-[#25233A] bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
