import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';
import { Utensils, Lock, Mail, User, Phone, Store, UserCheck, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = (searchParams.get('role') as Role) || 'CUSTOMER';

  const [role, setRole] = useState<Role>(initialRole);
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
      await register({
        fullName,
        email,
        phoneNumber,
        password,
        role,
      });

      if (role === 'SHOP_OWNER') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-xl shadow-slate-200/50">
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white mx-auto mb-3 shadow-md">
            <Utensils className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create LocalBite Account</h1>
          <p className="text-xs text-slate-500 mt-1">Select your role to get started</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('CUSTOMER')}
            className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'CUSTOMER'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Foodie / Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('SHOP_OWNER')}
            className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              role === 'SHOP_OWNER'
                ? 'bg-white text-amber-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4 text-amber-600" />
            <span>Stall Owner</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
            <div className="relative flex items-center">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="tel"
                required
                placeholder="+919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                required
                minLength={8}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Registering Account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-amber-600 hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
