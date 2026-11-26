import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Store, Utensils } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      
      const savedUserStr = localStorage.getItem('localbite_user');
      if (savedUserStr) {
        const user = JSON.parse(savedUserStr);
        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard');
        } else if (user.role === 'SHOP_OWNER') {
          navigate('/owner/dashboard');
        } else {
          navigate('/explore');
        }
      } else {
        navigate('/explore');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen warm-festival-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-7 sm:p-8 max-w-md w-full border border-[#25233A]/15 shadow-xl shadow-[#25233A]/5">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block hover:scale-105 transition-transform mb-2">
            <img src="/logo.png" alt="LocalBite Logo" className="h-16 w-auto mx-auto object-contain" />
          </Link>
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-slate-100 text-[#25233A] border border-slate-200 mb-2">
            <Store className="w-3.5 h-3.5 text-[#FF8A00]" />
            <span>Owner &amp; Admin Portal</span>
          </div>
          <h1 className="text-2xl font-black text-[#25233A] tracking-tight">Sign In to LocalBite</h1>
          <p className="text-xs text-[#25233A]/70 mt-1">
            Access your food stall management dashboard or platform control.
          </p>
        </div>

        {/* Friendly Guest Notification */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#FFF8EC] border border-[#FF8A00]/30 text-xs text-[#25233A]">
          <div className="flex items-center gap-2 font-bold text-[#C92F32]">
            <Utensils className="w-4 h-4" />
            <span>Hungry for street snacks?</span>
          </div>
          <p className="text-[11px] text-[#25233A]/80 mt-1">
            Foodies do not need to log in! Explore local eateries and check live availability without an account.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 mt-2 text-[11px] font-black text-[#C92F32] hover:underline"
          >
            <span>Explore Live Food Radar</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#25233A] uppercase mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                required
                placeholder="owner@example.com or admin@localbite.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#25233A] uppercase mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#25233A] hover:bg-slate-800 text-white font-black rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#25233A]/60">
          Want to advertise your food stall?{' '}
          <Link to="/register?role=SHOP_OWNER" className="font-bold text-[#FF8A00] hover:underline">
            Register Stall (Free)
          </Link>
        </div>

      </div>
    </div>
  );
};
