import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface LocationPickerMapProps {
  initialLat?: number;
  initialLng?: number;
  onLocationSelected: (loc: {
    lat: number;
    lng: number;
    city?: string;
    area?: string;
    addressLine?: string;
  }) => void;
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
  const [isDetecting, setIsDetecting] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Custom Animated Stall Pin Icon
  const createStallPin = () => {
    return L.divIcon({
      className: 'stall-picker-pin',
      html: `
        <div style="position: relative; width: 34px; height: 34px;">
          <div style="position: absolute; width: 34px; height: 34px; background: linear-gradient(135deg, #f59e0b, #ef4444); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          </div>
          <div style="position: absolute; width: 14px; height: 14px; background: white; border-radius: 50%; top: 10px; left: 10px;"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });
  };

  // Reverse Geocode using OpenStreetMap Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      setIsGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const city =
          addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
        const area =
          addr.neighbourhood || addr.suburb || addr.residential || addr.road || '';
        const landmark = addr.amenity || addr.shop || addr.building || '';
        const road = addr.road || '';

        const fullStreet = [landmark, road, area].filter(Boolean).join(', ');

        onLocationSelected({
          lat,
          lng,
          city: city || undefined,
          area: area || undefined,
          addressLine: fullStreet || undefined,
        });
      } else {
        onLocationSelected({ lat, lng });
      }
    } catch (e) {
      // Fallback without geocoded text
      onLocationSelected({ lat, lng });
    } finally {
      setIsGeocoding(false);
    }
  };

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

      marker.bindPopup('<b>Your Stall is here!</b><br/>Drag or click anywhere to adjust.').openPopup();

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
    }
  }, []);

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
          markerRef.current.bindPopup('<b>Stall Location Detected!</b>').openPopup();
        }

        reverseGeocode(lat, lng);
        setIsDetecting(false);
      },
      (err) => {
        alert('Could not detect location: ' + err.message + '. Please click on the map to place your pin.');
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-600" />
          <span>Point Stall on Real-Time Map</span>
        </label>
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={isDetecting}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-all disabled:opacity-50"
        >
          {isDetecting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>Detect My Stall GPS</span>
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
        <div ref={mapContainerRef} className="h-56 w-full z-10" />
        {isGeocoding && (
          <div className="absolute top-2 right-2 z-20 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-700 shadow border border-slate-200 flex items-center gap-1.5">
            <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
            <span>Finding address...</span>
          </div>
        )}
      </div>
      <p className="text-[11px] text-slate-500">
        💡 Click or drag the pin to your exact roadside cart location. City and landmark will auto-fill.
      </p>
    </div>
  );
};
