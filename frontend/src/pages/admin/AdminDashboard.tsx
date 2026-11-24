import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { PlatformStats, SubscriptionPlan } from '../../types';
import { ShieldCheck, Users, Store, IndianRupee, Clock, Check, X, FileText } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [pendingShops, setPendingShops] = useState<any[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Price Edit State
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [newPrice, setNewPrice] = useState<string>('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, pendingRes, plansRes, logsRes] = await Promise.all([
        api.getPlatformStats(),
        api.getPendingShops(0, 10),
        api.getPlans(),
        api.getAuditLogs(0, 10),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (pendingRes.success && pendingRes.data) setPendingShops(pendingRes.data.content || []);
      if (plansRes.success) setPlans(plansRes.data);
      if (logsRes.success && logsRes.data) setAuditLogs(logsRes.data.content || []);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyShop = async (shopId: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      const res = await api.verifyShop(shopId, status);
      if (res.success) {
        alert(`Shop has been ${status.toLowerCase()} successfully!`);
        loadAdminData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Verification update failed');
    }
  };

  const handleUpdatePrice = async (planId: number) => {
    try {
      const priceNum = parseFloat(newPrice);
      if (isNaN(priceNum) || priceNum <= 0) {
        alert('Please enter a valid positive price');
        return;
      }
      const res = await api.updatePlanPrice(planId, priceNum);
      if (res.success) {
        alert('Plan price updated and logged in admin audit history!');
        setEditingPlanId(null);
        setNewPrice('');
        loadAdminData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Price update failed');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading platform governance portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Top Banner - Full Widescreen */}
      <div className="bg-slate-900 text-white py-8 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-rose-400" />
              <h1 className="text-2xl font-black tracking-tight">Platform Control & Governance</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Super Admin authorization: audit logs, verification queue, and dynamic plan pricing.
            </p>
          </div>
          <span className="text-xs font-mono bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-rose-400">
            AUDIT_MODE: STRICT
          </span>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8">
        
        {/* Metric Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Users className="w-5 h-5 text-amber-500 mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase">Customers</p>
              <p className="text-2xl font-black text-slate-900">{stats.totalCustomers}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Store className="w-5 h-5 text-emerald-500 mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase">Active Shops</p>
              <p className="text-2xl font-black text-slate-900">{stats.activeShops}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <Clock className="w-5 h-5 text-amber-500 mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase">Pending Approvals</p>
              <p className="text-2xl font-black text-amber-600">{stats.pendingShops}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <IndianRupee className="w-5 h-5 text-emerald-600 mb-2" />
              <p className="text-xs font-bold text-slate-500 uppercase">Platform Revenue</p>
              <p className="text-2xl font-black text-emerald-600">₹{stats.totalRevenue.toFixed(0)}</p>
            </div>
          </div>
        )}

        {/* Pending Shop Verification Queue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-extrabold text-slate-900">Pending Shop Verification Queue</h2>
            <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
              {pendingShops.length} Awaiting Approval
            </span>
          </div>

          {pendingShops.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No pending stall registrations right now.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingShops.map((shop) => (
                <div key={shop.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{shop.name}</h3>
                    <p className="text-xs text-slate-500">{shop.addressLine}, {shop.city} • Ph: {shop.phoneNumber}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">GPS: {shop.latitude}, {shop.longitude}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVerifyShop(shop.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve Listing
                    </button>
                    <button
                      onClick={() => handleVerifyShop(shop.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Pricing Configuration */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-base font-extrabold text-slate-900 mb-1">Dynamic Platform & Plan Pricing</h2>
          <p className="text-xs text-slate-500 mb-4">
            Only administrators can modify prices. Every modification creates an immutable audit record.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{plan.title}</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {plan.billingInterval}
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 mt-2">₹{plan.price.toFixed(2)}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  {editingPlanId === plan.id ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="New ₹"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-24 px-2 py-1 text-xs rounded border border-slate-300 focus:outline-none"
                      />
                      <button
                        onClick={() => handleUpdatePrice(plan.id)}
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPlanId(null)}
                        className="px-2 py-1 text-slate-500 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingPlanId(plan.id);
                        setNewPrice(plan.price.toString());
                      }}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700"
                    >
                      Modify Fee
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Activity & Audit Logs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-extrabold text-slate-900">Immutable Admin Audit Logs</h2>
          </div>

          <div className="overflow-hidden border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Action</th>
                  <th className="px-4 py-2.5">Entity</th>
                  <th className="px-4 py-2.5">Changes (Old $\to$ New)</th>
                  <th className="px-4 py-2.5">IP Address</th>
                  <th className="px-4 py-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-bold text-slate-800">{log.action}</td>
                    <td className="px-4 py-2 text-slate-600">{log.entityType} #{log.entityId}</td>
                    <td className="px-4 py-2 text-slate-500 truncate max-w-xs">
                      {log.oldValueJson} $\rightarrow$ {log.newValueJson}
                    </td>
                    <td className="px-4 py-2 text-slate-500">{log.ipAddress}</td>
                    <td className="px-4 py-2 text-slate-400">{new Date(log.createdAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
