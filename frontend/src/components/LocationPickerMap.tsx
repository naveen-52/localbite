import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Loader2, Search, X, Check } from 'lucide-react';

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelected: (loc: {
    lat: number;
    lng: number;
    city?: string;
    area?: string;
    addressLine?: string;
    postalCode?: string;
  }) => void;
}

interface PlaceSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    [key: string]: string | undefined;
  };
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  initialLat = 13.0827,
  initialLng = 80.2707,
  onLocationSelected,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });

  // Google Maps Style Search & Autocomplete
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [selectedPlaceName, setSelectedPlaceName] = useState('');
  const searchTimeoutRef = useRef<any>(null);

  // Custom Animated Stall Pin Icon
  const createStallPin = () => {
    return L.divIcon({
      className: 'stall-picker-pin',
      html: `
        <div style="position: relative; width: 36px; height: 36px;">
          <div style="position: absolute; width: 36px; height: 36px; background: linear-gradient(135deg, #f59e0b, #ef4444); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2.5px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
          </div>
          <div style="position: absolute; width: 14px; height: 14px; background: white; border-radius: 50%; top: 11px; left: 11px;"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
    });
  };

  // Reverse geocode when pin is manually dragged
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: { 'Accept-Language': 'en' },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
        const area = addr.neighbourhood || addr.suburb || addr.residential || '';
        const road = addr.road || addr.amenity || '';
        const postcode = addr.postcode || '';

        const fullStreet = [road, area].filter(Boolean).join(', ');
        setSelectedPlaceName(data.display_name?.split(',').slice(0, 3).join(', ') || '');

        onLocationSelected({
          lat,
          lng,
          city: city || undefined,
          area: area || undefined,
          addressLine: fullStreet || undefined,
          postalCode: postcode || undefined,
        });
      } else {
        onLocationSelected({ lat, lng });
      }
    } catch (e) {
      onLocationSelected({ lat, lng });
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
      }).setView([currentCoords.lat, currentCoords.lng], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const marker = L.marker([currentCoords.lat, currentCoords.lng], {
        icon: createStallPin(),
        draggable: true,
      }).addTo(map);

      marker.on('dragend', (e) => {
        const newPos = e.target.getLatLng();
        setCurrentCoords({ lat: newPos.lat, lng: newPos.lng });
        reverseGeocode(newPos.lat, newPos.lng);
      });

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCurrentCoords({ lat, lng });
        reverseGeocode(lat, lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Leaflet size invalidate fix for modals
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
  }, []);

  // Update map when coordinates change externally
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([initialLat, initialLng], 15);
      markerRef.current.setLatLng([initialLat, initialLng]);
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 200);
    }
  }, [initialLat, initialLng]);

  // Search Places Autocomplete (Google Maps style)
  const handleSearchInput = (text: string) => {
    setSearchQuery(text);
    if (!text.trim() || text.length < 2) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            text
          )}&countrycodes=in&limit=6&addressdetails=1`,
          {
            headers: { 'Accept-Language': 'en' },
          }
        );
        if (res.ok) {
          const data: PlaceSuggestion[] = await res.json();
          setSuggestions(data);
          setShowDropdown(data.length > 0);
        }
      } catch (err) {
        console.error('Location search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // When a user taps a place suggestion
  const handleSelectSuggestion = (place: PlaceSuggestion) => {
    const lat = parseFloat(place.lat);
    const lng = parseFloat(place.lon);
    setCurrentCoords({ lat, lng });
    setShowDropdown(false);
    setSearchQuery(place.display_name.split(',').slice(0, 2).join(', '));
    setSelectedPlaceName(place.display_name);

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([lat, lng], 16);
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.bindPopup(`<b>${place.display_name.split(',')[0]}</b>`).openPopup();
      mapInstanceRef.current.invalidateSize();
    }

    const addr = place.address || {};
    const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
    const area = addr.neighbourhood || addr.suburb || addr.residential || '';
    const landmark = addr.amenity || addr.road || place.display_name.split(',')[0] || '';
    const road = addr.road || '';
    const postcode = addr.postcode || '';

    const fullStreet = [landmark !== road ? landmark : '', road, area].filter(Boolean).join(', ');

    onLocationSelected({
      lat,
      lng,
      city: city || undefined,
      area: area || undefined,
      addressLine: fullStreet || place.display_name.split(',').slice(0, 2).join(', '),
      postalCode: postcode || undefined,
    });
  };

  // GPS Auto-detect
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCurrentCoords({ lat, lng });

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
          markerRef.current.setLatLng([lat, lng]);
          mapInstanceRef.current.invalidateSize();
        }

        reverseGeocode(lat, lng);
        setIsDetecting(false);
      },
      (err) => {
        alert('Could not detect GPS: ' + err.message + '. Please use the search bar above.');
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-3">
      {/* Google Maps Style Location Search Bar with Autocomplete Suggestions */}
      <div className="relative">
        <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-amber-600" />
            <span>Search Stall Place / Area (Google Maps Style)</span>
          </span>
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200"
          >
            {isDetecting ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Navigation className="w-3 h-3 text-amber-600" />
            )}
            <span>Use My GPS</span>
          </button>
        </label>

        <div className="relative">
          <input
            type="text"
            placeholder="Type place name (e.g. Aruppukottai, Girls School, Park Town, Madurai)..."
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-amber-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/20 shadow-xs"
          />
          <Search className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-amber-600 absolute right-3 top-3 animate-spin" />
          )}
          {searchQuery && !isSearching && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSuggestions([]);
                setShowDropdown(false);
              }}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Autocomplete Dropdown List with Surrounding Places */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden max-h-60 overflow-y-auto">
            <div className="p-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Suggested Locations:
            </div>
            {suggestions.map((place) => (
              <button
                key={place.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(place)}
                className="w-full text-left p-3 hover:bg-amber-50/70 border-b border-slate-100 last:border-0 transition-colors flex items-start gap-2.5 group"
              >
                <MapPin className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-amber-800 line-clamp-1">
                    {place.display_name.split(',')[0]}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {place.display_name.split(',').slice(1).join(',')}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Location Pill */}
      {selectedPlaceName && (
        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span className="line-clamp-1 font-semibold">{selectedPlaceName}</span>
        </div>
      )}

      {/* Real-time Map with Draggable Pin */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
        <div
          ref={mapContainerRef}
          className="w-full h-48 sm:h-56 z-10"
          style={{ minHeight: '190px' }}
        />
      </div>

      <p className="text-[11px] text-slate-500">
        💡 <b>How to set location:</b> Type your area in the search bar above to auto-suggest, or drag the map pin to your exact roadside cart.
      </p>
    </div>
  );
};
