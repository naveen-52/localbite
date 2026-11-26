import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, Store, ArrowRight, Utensils, CheckCircle2 } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      // Registration is strictly for Roadside Stall / Shop Owners
      await register({
        fullName,
        email,
        phoneNumber,
        password,
        role: 'SHOP_OWNER',
      });

      navigate('/owner/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Check inputs.');
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
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#FF8A00]/10 text-[#FF8A00] border border-[#FF8A00]/25 mb-2">
            <Store className="w-3.5 h-3.5" />
            <span>Stall Owner Onboarding</span>
          </div>
          <h1 className="text-2xl font-black text-[#25233A] tracking-tight">Register Your Food Stall</h1>
          <p className="text-xs text-[#25233A]/70 mt-1">
            Free online showcase with 0% commission on all food sales.
          </p>
        </div>

        {/* Free Foodie Notice */}
        <div className="mb-6 p-3.5 rounded-2xl bg-[#FFF8EC] border border-[#FF8A00]/30 text-xs text-[#25233A]">
          <div className="flex items-center gap-2 font-bold text-[#C92F32]">
            <Utensils className="w-4 h-4" />
            <span>Looking for street food?</span>
          </div>
          <p className="text-[11px] text-[#25233A]/80 mt-1">
            Customers do not need an account. You can search stalls and view live menus freely.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1 mt-2 text-[11px] font-black text-[#C92F32] hover:underline"
          >
            <span>Browse Stalls As Guest</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#25233A] uppercase mb-1">Owner / Cook Name</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#25233A] uppercase mb-1">Stall Contact Phone</label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="tel"
                required
                placeholder="e.g. +91 98765 43210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#25233A] uppercase mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                required
                placeholder="owner@example.com"
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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8A00]"
              />
            </div>
          </div>

          {/* Value Highlights */}
          <div className="pt-2 text-[11px] text-[#25233A]/70 space-y-1 font-medium">
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Free listing with real-time map location pin</span>
            </p>
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>1-tap mobile food availability updates</span>
            </p>
            <p className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Downloadable countertop QR standee</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-[#FF8A00] hover:bg-[#e07a00] text-white font-black rounded-xl text-sm shadow-md shadow-[#FF8A00]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {loading ? 'Registering Stall...' : 'Register Stall & Launch Dashboard'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-5 text-center text-xs text-[#25233A]/60">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#C92F32] hover:underline">
            Owner Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
