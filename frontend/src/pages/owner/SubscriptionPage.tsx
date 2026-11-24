import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { SubscriptionPlan, ShopDetail } from '../../types';
import { Check, ShieldCheck, ArrowLeft, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SubscriptionPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, shopRes, histRes] = await Promise.all([
        api.getPlans(),
        api.getMyShop(),
        api.getPaymentHistory(),
      ]);

      if (plansRes.success) setPlans(plansRes.data);
      if (shopRes.success) setShop(shopRes.data);
      if (histRes.success) setHistory(histRes.data);
    } catch (e) {
      console.error('Failed to load subscription data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!shop) return;
    try {
      setProcessingPlanId(plan.id);

      // 1. Create order on backend (retrieves real price from DB)
      const orderRes = await api.createPaymentOrder(shop.id, plan.id);
      if (!orderRes.success || !orderRes.data) {
        throw new Error('Failed to create payment order');
      }

      const orderData = orderRes.data;

      // 2. Razorpay Checkout Flow (Handles both live SDK and developer sandbox mode)
      const isMock = orderData.gatewayOrderId.startsWith('order_mock_');

      if (isMock) {
        // Sandbox Simulation: simulate signature verification
        const confirm = window.confirm(
          `[Sandbox Test Mode]\n\nSimulate successful payment of ₹${orderData.amount} for "${orderData.planTitle}"?`
        );
        if (!confirm) return;

        const verifyRes = await api.verifyPayment({
          razorpayOrderId: orderData.gatewayOrderId,
          razorpayPaymentId: 'pay_mock_' + Date.now(),
          razorpaySignature: 'mock_signature_sandbox',
        });

        if (verifyRes.success) {
          alert('Payment verified and subscription activated successfully!');
          loadData();
        }
      } else {
        // Production Razorpay Checkout JS
        const options = {
          key: orderData.razorpayKeyId,
          amount: Math.round(orderData.amount * 100),
          currency: orderData.currency,
          name: 'LocalBite Platform',
          description: orderData.planTitle,
          order_id: orderData.gatewayOrderId,
          handler: async (response: any) => {
            const verifyRes = await api.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            if (verifyRes.success) {
              alert('Payment confirmed! Subscription active.');
              loadData();
            }
          },
          theme: {
            color: '#f59e0b',
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || 'Payment processing failed');
    } finally {
      setProcessingPlanId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading plan pricing & billing...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header - Full Widescreen */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full">
          <Link to="/owner/dashboard" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 mb-3">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stall Dashboard</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900">Subscription & Platform Fees</h1>
          <p className="text-xs text-slate-500 mt-1">
            Keep your stall live on the customer map and broadcast real-time availability.
          </p>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8">
        
        {/* Available Plans Grid */}
        <h2 className="text-base font-extrabold text-slate-900 mb-4">Choose Your Plan</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-400 transition-colors"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {plan.billingInterval.replace('_', ' ')}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">{plan.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-slate-900">₹{plan.price.toFixed(0)}</span>
                  <span className="text-xs text-slate-500 font-semibold">/ {plan.durationDays} Days</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>Real-time availability broadcast to customers</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>48-Hour automatic renewal grace period</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified vendor badge on public map</span>
                </div>

                <button
                  disabled={processingPlanId === plan.id}
                  onClick={() => handleSubscribe(plan)}
                  className="w-full mt-4 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md transition-all text-xs"
                >
                  {processingPlanId === plan.id ? 'Connecting Gateway...' : `Activate for ₹${plan.price.toFixed(0)}`}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment History Table */}
        <div className="mt-12">
          <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-600" />
            <span>Transaction & Receipt History</span>
          </h2>

          {history.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
              <p className="text-xs text-slate-500 font-semibold">No transactions recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Plan</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">{tx.transactionRef}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700">{tx.plan?.title || 'Subscription'}</td>
                      <td className="px-4 py-3 font-extrabold text-slate-900">₹{tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            tx.status === 'SUCCESS'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
