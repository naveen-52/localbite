import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { NearbyShop } from '../types';
import { useNavigate } from 'react-router-dom';

interface ShopMapViewProps {
  shops: NearbyShop[];
  userLocation: { lat: number; lng: number };
  radiusKm: number;
}

export const ShopMapView: React.FC<ShopMapViewProps> = ({ shops, userLocation, radiusKm }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Map if not already created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(
        [userLocation.lat, userLocation.lng],
        radiusKm <= 2 ? 15 : radiusKm <= 5 ? 14 : 13
      );

      // OpenStreetMap Standard Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(
        [userLocation.lat, userLocation.lng],
        radiusKm <= 2 ? 15 : radiusKm <= 5 ? 14 : 13
      );
    }

    const map = mapInstanceRef.current;

    // Clear previous layers/markers (except tile layer)
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // 1. Add User Location Marker & Accuracy Radius
    const userMarkerIcon = L.divIcon({
      className: 'user-location-pin',
      html: `
        <div style="position: relative; width: 20px; height: 20px;">
          <div style="position: absolute; width: 20px; height: 20px; background-color: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);"></div>
          <div style="position: absolute; width: 40px; height: 40px; top: -10px; left: -10px; background-color: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    L.marker([userLocation.lat, userLocation.lng], { icon: userMarkerIcon })
      .addTo(map)
      .bindPopup('<b>You are here</b><br>Searching within ' + radiusKm + ' km radius');

    // Radius circle
    L.circle([userLocation.lat, userLocation.lng], {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.06,
      radius: radiusKm * 1000,
    }).addTo(map);

    // 2. Add Stall Markers
    shops.forEach((shop) => {
      const isGreen = shop.open && shop.availableItemCount > 0;
      const isOrange = shop.open && shop.availableItemCount === 0;
      const pinColor = isGreen ? '#059669' : isOrange ? '#d97706' : '#64748b';

      const customIcon = L.divIcon({
        className: 'custom-stall-marker',
        html: `
          <div style="
            background-color: ${pinColor};
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              color: white;
              font-weight: 800;
              font-size: 11px;
            ">
              ${isGreen ? '✓' : '!'}
            </span>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30],
      });

      const marker = L.marker([Number(shop.latitude), Number(shop.longitude)], { icon: customIcon }).addTo(map);

      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '180px';
      popupContent.innerHTML = `
        <div style="font-family: inherit;">
          <div style="font-size: 10px; font-weight: 700; color: #d97706; text-transform: uppercase;">
            ${shop.categoryName}
          </div>
          <div style="font-size: 14px; font-weight: 800; color: #0f172a; margin-top: 2px;">
            ${shop.name}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            ${shop.distanceKm} km away • ${shop.open ? '<span style="color:#059669;font-weight:700;">OPEN</span>' : '<span style="color:#e11d48;font-weight:700;">CLOSED</span>'}
          </div>
          <div style="font-size: 11px; font-weight: 600; color: #0f172a; margin-top: 6px;">
            ${shop.availableItemCount > 0 ? shop.availableItemCount + ' Items Available' : 'No items ready'}
          </div>
          <button id="btn-shop-${shop.id}" style="
            margin-top: 8px;
            width: 100%;
            background-color: #f59e0b;
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 6px 10px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
          ">
            View Live Menu →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-shop-${shop.id}`);
        if (btn) {
          btn.onclick = () => navigate(`/shops/${shop.slug}`);
        }
      });
    });
  }, [shops, userLocation, radiusKm, navigate]);

  return (
    <div className="w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-md relative">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-slate-200 text-xs flex flex-col gap-1.5 pointer-events-auto">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <div className="w-3 h-3 rounded-full bg-emerald-600" />
          <span>Open with Food Available</span>
        </div>
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <div className="w-3 h-3 rounded-full bg-amber-600" />
          <span>Open (Limited / Low Stock)</span>
        </div>
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <div className="w-3 h-3 rounded-full bg-slate-500" />
          <span>Closed / Depleted</span>
        </div>
      </div>
    </div>
  );
};
