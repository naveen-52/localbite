import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, X } from 'lucide-react';

interface DishPhotoPickerProps {
  value: string;
  onChange: (url: string) => void;
}

export const FOOD_PHOTO_PRESETS = [
  {
    name: 'Kulfi / Ice Cream',
    emoji: '🍦',
    url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Fresh Fruit Juice',
    emoji: '🥤',
    url: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Masala Dosa',
    emoji: '🥞',
    url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Soft Idli',
    emoji: '🍚',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Filter Coffee',
    emoji: '☕',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cutting Chai',
    emoji: '🫖',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Crispy Samosa',
    emoji: '🥟',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Pani Puri / Chaat',
    emoji: '🧆',
    url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Hot Pongal',
    emoji: '🥣',
    url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Street Biryani',
    emoji: '🍗',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
  },
];

export const DishPhotoPicker: React.FC<DishPhotoPickerProps> = ({ value, onChange }) => {
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Compress and handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 600px width/height for fast loading
        const canvas = document.createElement('canvas');
        const maxDim = 600;
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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onChange(dataUrl);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
          <span>Dish Photo (Optional)</span>
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
        <div className="relative rounded-2xl overflow-hidden border border-amber-200 shadow-md group h-36">
          <img src={value} alt="Dish Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow hover:bg-rose-700"
            >
              Change Photo
            </button>
          </div>
        </div>
      ) : (
        /* Choose Photo Mode */
        <div className="space-y-2.5">
          {/* File Upload Button */}
          <label className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 cursor-pointer transition-all text-slate-600 hover:text-amber-800">
            <Camera className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold">Upload Photo from Phone / Computer</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

          {/* Quick Preset Photos */}
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Or Choose a Delicious Preset Photo:</span>
            </p>
            <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto pr-1">
              {FOOD_PHOTO_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onChange(preset.url)}
                  className="group relative rounded-xl overflow-hidden border border-slate-200 hover:border-amber-500 hover:ring-2 hover:ring-amber-500/20 text-left transition-all aspect-square bg-slate-100 flex flex-col justify-end p-1"
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  <span className="relative z-10 text-[9px] font-bold text-white bg-slate-900/80 px-1 py-0.5 rounded leading-tight backdrop-blur-xs line-clamp-1">
                    {preset.emoji} {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Direct URL */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-[11px] text-slate-500 hover:text-amber-600 underline font-medium"
            >
              {showUrlInput ? 'Hide URL input' : 'Or paste an Image URL'}
            </button>
            {showUrlInput && (
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1.5 w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
