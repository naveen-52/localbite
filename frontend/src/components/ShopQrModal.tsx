import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { ShopDetail } from '../types';
import { X, Printer, QrCode, Sparkles, Copy, Check, Globe } from 'lucide-react';

interface ShopQrModalProps {
  shop: ShopDetail;
  onClose: () => void;
}

export const ShopQrModal: React.FC<ShopQrModalProps> = ({ shop, onClose }) => {
  const printAreaRef = useRef<HTMLDivElement>(null);
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  
  // Allow overriding with custom production domain or local network IP
  const [customDomain, setCustomDomain] = useState('');
  const [copied, setCopied] = useState(false);

  // Compute final QR URL: custom domain if entered, or window.location.origin
  const baseOrigin = customDomain ? (customDomain.startsWith('http') ? customDomain : `https://${customDomain}`) : window.location.origin;
  const stallUrl = `${baseOrigin}/shops/${shop.slug}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(stallUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Top Actions */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-extrabold text-slate-900">Stall QR Code Standee</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Localhost / Production Notice (no-print) */}
        {isLocalhost && (
          <div className="p-3 bg-amber-50/80 border-b border-amber-200/80 text-left text-xs no-print">
            <div className="flex items-start gap-2">
              <Globe className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-950">
                  Testing Locally? How Phone Scanning Works:
                </p>
                <p className="text-[11px] text-amber-800 mt-0.5">
                  Right now the URL is on <code>localhost</code> (which only exists on this PC). <b>Once you deploy the app to production</b> (e.g. Vercel, AWS, or your domain), this QR code automatically uses your live public website URL and works with 100% of phone cameras!
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. localbite.app or your-ip:5173"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value.trim())}
                    className="flex-1 px-2.5 py-1 text-xs bg-white rounded-lg border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {customDomain && (
                    <button
                      onClick={() => setCustomDomain('')}
                      className="text-[11px] text-amber-700 underline font-semibold"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Printable Standee Card */}
        <div ref={printAreaRef} className="p-8 text-center bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30">
          
          <img src="/logo.png" alt="LocalBite" className="h-14 w-auto mx-auto mb-2 object-contain" />

          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-500 text-white shadow-sm mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LocalBite Live Menu Radar</span>
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
            {shop.name}
          </h3>
          <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mt-1">
            {shop.categoryName}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {shop.addressLine}, {shop.city}
          </p>

          {/* QR Code Container */}
          <div className="my-6 p-4 bg-white rounded-2xl border-2 border-dashed border-amber-300 inline-block shadow-md">
            <QRCodeSVG
              value={stallUrl}
              size={210}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="max-w-xs mx-auto">
            <p className="text-sm font-extrabold text-slate-800">
              Scan with any Phone Camera or Google Lens
            </p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Check live food availability, dish prices, and special varieties without standing in line.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span>Powered by LocalBite Platform</span>
            <span>Zero App Install Required</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2 no-print">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{copied ? 'Link Copied!' : 'Copy Stall Link'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Standee</span>
          </button>
        </div>

      </div>
    </div>
  );
};
