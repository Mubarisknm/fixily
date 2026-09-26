import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LiveMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    subtitle?: string;
    type: 'partner' | 'customer' | 'job';
  }>;
  height?: string;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  center,
  zoom = 13,
  markers = [],
  height = '350px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Prevent Leaflet container already initialized error in React StrictMode
    if ((mapRef.current as any)._leaflet_id) {
      if (leafletInstance.current) {
        leafletInstance.current.setView([center.lat, center.lng], zoom);
      }
      return;
    }

    try {
      const map = L.map(mapRef.current).setView([center.lat, center.lng], zoom);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      markersLayer.current = L.layerGroup().addTo(map);
      leafletInstance.current = map;
    } catch (e) {
      console.warn('Leaflet map init warning:', e);
    }

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, [center.lat, center.lng, zoom]);

  useEffect(() => {
    if (!leafletInstance.current || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    markers.forEach(m => {
      let colorClass = 'bg-teal-600';
      if (m.type === 'customer') colorClass = 'bg-amber-600';
      if (m.type === 'job') colorClass = 'bg-emerald-600';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="${colorClass} text-white font-bold text-xs p-2 rounded-full shadow-lg border-2 border-white flex items-center justify-center w-8 h-8 transform hover:scale-110 transition-transform">
                ${m.type === 'partner' ? '🚗' : m.type === 'customer' ? '🏠' : '⚡'}
               </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([m.lat, m.lng], { icon: customIcon });
      
      const popupContent = `
        <div class="p-1 font-sans text-xs">
          <div class="font-bold text-slate-900">${m.title}</div>
          ${m.subtitle ? `<div class="text-slate-600 text-[11px]">${m.subtitle}</div>` : ''}
          <div class="mt-1 inline-block bg-teal-100 text-teal-800 text-[10px] px-1.5 py-0.5 rounded font-semibold">
            GPS Verified
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersLayer.current?.addLayer(marker);
    });

  }, [markers]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapRef} style={{ height, width: '100%' }} className="z-10 bg-slate-100" />
      <div className="absolute top-3 right-3 z-20 bg-slate-900/90 backdrop-blur text-white text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-700 shadow-md">
        📍 Kochi Live Dispatch Radar
      </div>
    </div>
  );
};
