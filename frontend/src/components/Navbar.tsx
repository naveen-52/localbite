import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-6">
          {/* Brand Logo with New LocalBite Official Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/logo.png"
              alt="LocalBite"
              className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
            />
            <span className="hidden sm:inline-block ml-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
              Live Stalls
            </span>
          </Link>

          {/* Core Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Live Stalls Radar</span>
            </Link>
            <Link
              to="/register?role=SHOP_OWNER"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Advertise Your Stall</span>
            </Link>
          </nav>
        </div>

        {/* Dynamic Action Buttons based on RBAC */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {user?.role === 'SHOP_OWNER' && (
                <Link
                  to="/owner/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  <span>My Stall</span>
                </Link>
              )}

              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Hub</span>
                </Link>
              )}

              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-semibold text-sm">
                  {user?.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-800 leading-tight">{user?.fullName}</p>
                  <p className="text-slate-500 leading-tight capitalize">{user?.role.toLowerCase().replace('_', ' ')}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register?role=SHOP_OWNER"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Store className="w-4 h-4 text-amber-600" />
                <span>Register Stall</span>
              </Link>
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-all"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
