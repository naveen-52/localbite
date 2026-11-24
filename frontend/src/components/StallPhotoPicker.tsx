import React, { useState } from 'react';
import { Camera, Sparkles, X, Store, Check } from 'lucide-react';

interface StallPhotoPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  categoryHint?: string;
}

export const STALL_PHOTO_PRESETS = [
  {
    name: 'Kulfi & Ice Cream Cart',
    category: 'Kulfi & Ice Creams',
    emoji: '🍨',
    url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fresh Juice & Shake Stall',
    category: 'Fresh Juices & Shakes',
    emoji: '🥤',
    url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Hot Tiffin & Dosa Center',
    category: 'Tiffin & Breakfast',
    emoji: '🥞',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tea & Filter Coffee Corner',
    category: 'Tea & Coffee Stall',
    emoji: '🫖',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Street Chaat & Pani Puri Cart',
    category: 'Chaat & Street Snacks',
    emoji: '🧆',
    url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fast Food & Sandwich Spot',
    category: 'Fast Food & Sandwiches',
    emoji: '🥪',
    url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Sweet & Savory Bakery Stall',
    category: 'Sweet & Savory',
    emoji: '🥟',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
  },
  {
    name: 'Street Dum Biryani Handi',
    category: 'Biryani & Pulao Point',
    emoji: '🍗',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  },
];

export const getCategoryDefaultBanner = (categoryName?: string): string => {
  if (!categoryName) return STALL_PHOTO_PRESETS[2].url;
  const lower = categoryName.toLowerCase();
  if (lower.includes('kulfi') || lower.includes('ice cream')) return STALL_PHOTO_PRESETS[0].url;
  if (lower.includes('juice') || lower.includes('shake') || lower.includes('fruit')) return STALL_PHOTO_PRESETS[1].url;
  if (lower.includes('tiffin') || lower.includes('breakfast') || lower.includes('dosa') || lower.includes('idli')) return STALL_PHOTO_PRESETS[2].url;
  if (lower.includes('tea') || lower.includes('coffee') || lower.includes('chai')) return STALL_PHOTO_PRESETS[3].url;
  if (lower.includes('chaat') || lower.includes('pani puri') || lower.includes('snack')) return STALL_PHOTO_PRESETS[4].url;
  if (lower.includes('fast food') || lower.includes('sandwich') || lower.includes('burger')) return STALL_PHOTO_PRESETS[5].url;
  if (lower.includes('sweet') || lower.includes('bakery') || lower.includes('savory') || lower.includes('samosa')) return STALL_PHOTO_PRESETS[6].url;
  if (lower.includes('biryani') || lower.includes('pulao') || lower.includes('rice')) return STALL_PHOTO_PRESETS[7].url;
  return STALL_PHOTO_PRESETS[2].url;
};

export const StallPhotoPicker: React.FC<StallPhotoPickerProps> = ({
  value,
  onChange,
  label = 'Stall Front / Banner Photo',
  categoryHint,
}) => {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Compress and handle file upload from device/camera
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 800px width/height for fast loading & compact storage
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        onChange(dataUrl);
        setUploading(false);
      };
      img.onerror = () => setUploading(false);
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
          <Store className="w-3.5 h-3.5 text-amber-600" />
          <span>{label}</span>
          <span className="text-[10px] text-amber-600 font-normal lowercase">(shown on customer cards)</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Remove Photo</span>
          </button>
        )}
      </div>

      {/* Active Photo Preview */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border border-amber-300 shadow-md group h-44 sm:h-48 bg-slate-900">
          <img src={value} alt="Stall Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40 flex flex-col justify-between p-3.5">
            <span className="self-start inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/90 text-white shadow">
              <Check className="w-3 h-3" /> Photo Attached
            </span>
            <div className="flex items-center justify-between">
              <p className="text-xs text-white/90 font-medium">This banner will appear on customer search cards</p>
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-lg text-xs font-bold shadow transition-all"
              >
                Change Photo
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Photo Selector / Upload Options */
        <div className="space-y-3">
          {/* File Upload / Camera Trigger */}
          <label className="flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/80 cursor-pointer transition-all text-amber-900 shadow-xs">
            <Camera className="w-5 h-5 text-amber-600" />
            <span className="text-xs font-bold">
              {uploading ? 'Processing Image...' : 'Upload Shop Front / Cart Photo from Device'}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>

          {/* Quick Street Stall Banner Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Or pick a matching eatery photo preset:
              </span>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-[11px] text-amber-600 hover:underline font-semibold"
              >
                {showUrlInput ? 'Hide URL' : 'Paste Image URL'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {STALL_PHOTO_PRESETS.map((preset) => {
                const isSelected = value === preset.url;
                const isMatchingHint =
                  categoryHint &&
                  preset.category.toLowerCase().includes(categoryHint.toLowerCase());

                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => onChange(preset.url)}
                    className={`relative rounded-xl overflow-hidden border p-1.5 text-left transition-all group ${
                      isSelected
                        ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-md bg-amber-50'
                        : isMatchingHint
                        ? 'border-amber-300 bg-amber-50/40 hover:border-amber-400'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="h-16 rounded-lg overflow-hidden relative mb-1.5 bg-slate-100">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 text-sm bg-black/40 backdrop-blur-xs px-1 rounded">
                        {preset.emoji}
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight">
                      {preset.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom URL Input Accordion */}
          {showUrlInput && (
            <div className="flex gap-2 p-2 bg-slate-100 rounded-xl">
              <input
                type="url"
                placeholder="https://example.com/stall-photo.jpg"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleApplyCustomUrl}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
