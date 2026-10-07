import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Crosshair,
  Search,
  X,
  Check,
  Compass,
  Navigation,
  Mountain,
  Waves,
  Building,
  Trees,
  Layers,
  Sparkles,
  ChevronRight,
  Plus,
  Info
} from 'lucide-react';
import { KochiLocation, ThemeMode, AppLanguage } from '../types';
import { useTranslation } from '../utils/translations';

// 14 Kerala Districts with geographic centers
export const KERALA_DISTRICTS = [
  { name: 'Ernakulam', lat: 9.9816, lng: 76.2999, zoom: 11, labelMl: 'എറണാകുളം' },
  { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366, zoom: 11, labelMl: 'തിരുവനന്തപുരം' },
  { name: 'Kozhikode', lat: 11.2588, lng: 75.7804, zoom: 11, labelMl: 'കോഴിക്കോട്' },
  { name: 'Idukki', lat: 9.9189, lng: 77.1025, zoom: 10, labelMl: 'ഇടുക്കി' },
  { name: 'Wayanad', lat: 11.6854, lng: 76.1320, zoom: 10, labelMl: 'വയനാട്' },
  { name: 'Thrissur', lat: 10.5276, lng: 76.2144, zoom: 11, labelMl: 'തൃശ്ശൂർ' },
  { name: 'Malappuram', lat: 11.0510, lng: 76.0711, zoom: 11, labelMl: 'മലപ്പുറം' },
  { name: 'Palakkad', lat: 10.7867, lng: 76.6548, zoom: 11, labelMl: 'പാലക്കാട്' },
  { name: 'Kannur', lat: 11.8745, lng: 75.3704, zoom: 11, labelMl: 'കണ്ണൂർ' },
  { name: 'Kottayam', lat: 9.5916, lng: 76.5222, zoom: 11, labelMl: 'കോട്ടയം' },
  { name: 'Alappuzha', lat: 9.4981, lng: 76.3388, zoom: 11, labelMl: 'ആലപ്പുഴ' },
  { name: 'Kollam', lat: 8.8932, lng: 76.6141, zoom: 11, labelMl: 'കൊല്ലം' },
  { name: 'Pathanamthitta', lat: 9.2648, lng: 76.7870, zoom: 11, labelMl: 'പത്തനംതിട്ട' },
  { name: 'Kasaragod', lat: 12.4996, lng: 74.9869, zoom: 11, labelMl: 'കാസർഗോഡ്' },
];

// Haversine formula to find nearest distance in kilometers
export function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface KeralaMapLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: KochiLocation;
  locations: KochiLocation[];
  onSelectLocation: (loc: KochiLocation) => void;
  theme: ThemeMode;
  language: AppLanguage;
  onAddNewLocation?: (loc: KochiLocation) => void;
}

export const KeralaMapLocationModal: React.FC<KeralaMapLocationModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  locations,
  onSelectLocation,
  theme,
  language,
  onAddNewLocation
}) => {
  const { t } = useTranslation(language);
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'map' | 'directory'>('map');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedRegionType, setSelectedRegionType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pin state on the interactive map
  const [pinnedLocation, setPinnedLocation] = useState<KochiLocation>(selectedLocation);
  const [customLandmark, setCustomLandmark] = useState<string>('');
  const [pinDistanceToNearest, setPinDistanceToNearest] = useState<number | null>(null);

  // Show Add Village Form toggle
  const [showAddVillageForm, setShowAddVillageForm] = useState<boolean>(false);
  const [newVillageName, setNewVillageName] = useState<string>('');
  const [newVillageDistrict, setNewVillageDistrict] = useState<string>('Ernakulam');
  const [newVillageTaluk, setNewVillageTaluk] = useState<string>('');
  const [newVillagePin, setNewVillagePin] = useState<string>('');
  const [newVillageRegion, setNewVillageRegion] = useState<'RURAL_VILLAGE' | 'HIGH_RANGE' | 'COASTAL' | 'URBAN'>('RURAL_VILLAGE');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const activePinMarkerRef = useRef<L.Marker | null>(null);

  // Initialize or update Leaflet map
  useEffect(() => {
    if (!isOpen || activeTab !== 'map') return;

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      // Clean up previous instance if needed
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      try {
        const initialLat = pinnedLocation.lat || 10.15;
        const initialLng = pinnedLocation.lng || 76.45;
        const initialZoom = pinnedLocation.lat ? 12 : 8.5;

        const map = L.map(mapContainerRef.current, {
          center: [initialLat, initialLng],
          zoom: initialZoom,
          minZoom: 7,
          maxZoom: 18,
          maxBounds: [
            [7.8, 74.0], // Southwest bound (Indian Ocean below Kerala)
            [13.5, 78.5]  // Northeast bound (Karnataka/Tamil Nadu border)
          ],
          zoomControl: true
        });

        // OpenStreetMap Tile Layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        leafletMapRef.current = map;

        // Render markers for all available Kerala locations
        renderLocationMarkers(map, markersLayer, locations);

        // Place initial selected pin
        placeActivePinMarker(map, pinnedLocation.lat, pinnedLocation.lng, pinnedLocation.name);

        // Map Click Listener: User taps anywhere on Kerala
        map.on('click', (e: L.LeafletMouseEvent) => {
          handleMapPinDrop(e.latlng.lat, e.latlng.lng, map);
        });

        map.invalidateSize();
      } catch (err) {
        console.error('Kerala Leaflet map initialization error:', err);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isOpen, activeTab]);

  // Redraw predefined location markers when locations change
  const renderLocationMarkers = (map: L.Map, layer: L.LayerGroup, locList: KochiLocation[]) => {
    layer.clearLayers();

    locList.forEach((loc) => {
      let pinColor = 'bg-indigo-600'; // URBAN default
      let pinIcon = '🏙️';
      if (loc.regionType === 'RURAL_VILLAGE') {
        pinColor = 'bg-emerald-600';
        pinIcon = '🌾';
      } else if (loc.regionType === 'HIGH_RANGE') {
        pinColor = 'bg-amber-600';
        pinIcon = '⛰️';
      } else if (loc.regionType === 'COASTAL') {
        pinColor = 'bg-sky-600';
        pinIcon = '🌊';
      }

      const isCurrentSelected = pinnedLocation.id === loc.id;

      const markerHtml = `
        <div class="group relative flex items-center justify-center cursor-pointer">
          <div class="${pinColor} ${isCurrentSelected ? 'ring-4 ring-blue-400 ring-offset-2 scale-125' : 'hover:scale-115'} w-6 h-6 rounded-full text-[10px] text-white font-black flex items-center justify-center shadow-lg border-2 border-white transition-transform">
            ${pinIcon}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'kerala-village-marker',
        html: markerHtml,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: inherit; font-size: 12px; line-height: 1.3; min-width: 170px;" class="p-1">
          <div style="font-weight: 800; font-size: 13px; color: #1e1b4b;">${loc.name}</div>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">
            ${loc.district ? `District: <b>${loc.district}</b>` : ''}
            ${loc.taluk ? `<br/>Taluk: ${loc.taluk}` : ''}
            <br/>PIN: ${loc.pin}
          </div>
          <div style="margin-top: 6px; display: inline-block; padding: 2px 6px; border-radius: 9999px; font-size: 10px; font-weight: 700; ${
            loc.isServiced !== false ? 'background: #dcfce7; color: #166534;' : 'background: #fef3c7; color: #92400e;'
          }">
            ${loc.isServiced !== false ? '● Active Fykzi Hub' : '○ Launching Soon'}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        setPinnedLocation({ ...loc, isLiveGps: false });
        setCustomLandmark('');
        setPinDistanceToNearest(0);
        placeActivePinMarker(map, loc.lat, loc.lng, loc.name);
      });

      layer.addLayer(marker);
    });
  };

  // Place or update the highlighted animated active pin marker
  const placeActivePinMarker = (map: L.Map, lat: number, lng: number, title: string) => {
    if (activePinMarkerRef.current) {
      activePinMarkerRef.current.remove();
    }

    const pinHtml = `
      <div class="relative flex items-center justify-center">
        <span class="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-blue-400 opacity-75"></span>
        <div class="relative w-9 h-9 rounded-full bg-blue-600 border-2 border-white shadow-2xl flex items-center justify-center text-white font-extrabold text-sm drop-shadow-lg">
          📍
        </div>
      </div>
    `;

    const activeIcon = L.divIcon({
      className: 'active-kerala-pin',
      html: pinHtml,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    const activeMarker = L.marker([lat, lng], {
      icon: activeIcon,
      zIndexOffset: 1000
    }).addTo(map);

    activePinMarkerRef.current = activeMarker;
  };

  // Handle map click anywhere to resolve nearest remote village
  const handleMapPinDrop = (lat: number, lng: number, map: L.Map, isLive = false) => {
    // Find closest location from known database
    let closestLoc = locations[0];
    let minDistance = Infinity;

    locations.forEach(loc => {
      const d = getHaversineDistanceKm(lat, lng, loc.lat, loc.lng);
      if (d < minDistance) {
        minDistance = d;
        closestLoc = loc;
      }
    });

    setPinDistanceToNearest(minDistance);

    // If within 1.5 km of a known village, adopt that village
    // Otherwise construct a remote village landmark entry
    let locationTitle = closestLoc ? closestLoc.name : 'Remote Kerala Location';
    if (minDistance > 2.0 && closestLoc) {
      locationTitle = `Near ${closestLoc.name} (${minDistance.toFixed(1)} km)`;
    }

    const newResolvedLocation: KochiLocation = {
      id: isLive ? `loc-live-gps` : `loc-pin-${Date.now()}`,
      name: locationTitle,
      district: closestLoc?.district || 'Kerala',
      taluk: closestLoc?.taluk || '',
      panchayat: closestLoc?.panchayat || '',
      regionType: closestLoc?.regionType || 'RURAL_VILLAGE',
      pin: closestLoc?.pin || '682001',
      lat,
      lng,
      isServiced: true,
      isLiveGps: isLive
    };

    setPinnedLocation(newResolvedLocation);
    placeActivePinMarker(map, lat, lng, locationTitle);
  };

  // GPS Click handler
  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        const { latitude, longitude } = position.coords;

        if (leafletMapRef.current) {
          leafletMapRef.current.flyTo([latitude, longitude], 14, { duration: 1.5 });
          handleMapPinDrop(latitude, longitude, leafletMapRef.current, true);
        }

        setToastMessage(`🛰️ Live GPS Pin dropped at ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        setTimeout(() => setToastMessage(null), 3500);
      },
      (err) => {
        setIsDetectingGps(false);
        console.warn('GPS detection error:', err);
        alert('Could not detect GPS location. You can tap directly on the Kerala map to pick your village!');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Fly to specific Kerala district
  const handleFlyToDistrict = (districtName: string) => {
    setSelectedDistrict(districtName);

    if (districtName === 'All') {
      if (leafletMapRef.current) {
        leafletMapRef.current.flyTo([10.15, 76.45], 8.5, { duration: 1.2 });
      }
      return;
    }

    const distInfo = KERALA_DISTRICTS.find(d => d.name === districtName);
    if (distInfo && leafletMapRef.current) {
      leafletMapRef.current.flyTo([distInfo.lat, distInfo.lng], distInfo.zoom, { duration: 1.2 });
    }
  };

  // Confirm and set location for the entire Fykzi app
  const handleConfirmLocation = () => {
    const finalLocation: KochiLocation = {
      ...pinnedLocation,
      name: customLandmark.trim()
        ? `${customLandmark.trim()} (${pinnedLocation.name.split('(')[0].trim()})`
        : pinnedLocation.name
    };

    onSelectLocation(finalLocation);

    // Save to localStorage so custom remote area persists
    try {
      const stored = localStorage.getItem('fykzi_custom_locations') || localStorage.getItem('fykso_custom_locations');
      const existing = stored ? JSON.parse(stored) : [];
      if (!existing.some((l: KochiLocation) => l.id === finalLocation.id)) {
        localStorage.setItem('fykzi_custom_locations', JSON.stringify([finalLocation, ...existing]));
      }
    } catch (e) {
      // LocalStorage fallback
    }

    setToastMessage(`📍 Location set to: ${finalLocation.name}`);
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 600);
  };

  // Add custom remote village submission
  const handleCreateNewVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVillageName.trim()) return;

    const baseDist = KERALA_DISTRICTS.find(d => d.name === newVillageDistrict) || KERALA_DISTRICTS[0];

    // Slightly randomize coordinates around district center if creating from directory
    const customLoc: KochiLocation = {
      id: `loc-custom-${Date.now()}`,
      name: newVillageName.trim(),
      district: newVillageDistrict,
      taluk: newVillageTaluk.trim() || undefined,
      regionType: newVillageRegion,
      pin: newVillagePin.trim() || '682001',
      lat: baseDist.lat + (Math.random() - 0.5) * 0.08,
      lng: baseDist.lng + (Math.random() - 0.5) * 0.08,
      isServiced: true
    };

    if (onAddNewLocation) {
      onAddNewLocation(customLoc);
    }

    onSelectLocation(customLoc);
    setPinnedLocation(customLoc);
    setShowAddVillageForm(false);
    setToastMessage(`✅ Added & Selected: ${customLoc.name}`);
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 700);
  };

  // Filter locations for Directory Tab
  const filteredDirectoryLocations = locations.filter((loc) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      loc.name.toLowerCase().includes(q) ||
      (loc.district && loc.district.toLowerCase().includes(q)) ||
      (loc.taluk && loc.taluk.toLowerCase().includes(q)) ||
      (loc.panchayat && loc.panchayat.toLowerCase().includes(q)) ||
      (loc.pin && loc.pin.includes(q));

    const matchesDistrict =
      selectedDistrict === 'All' ||
      loc.district?.toLowerCase() === selectedDistrict.toLowerCase();

    const matchesRegion =
      selectedRegionType === 'ALL' || loc.regionType === selectedRegionType;

    return matchesSearch && matchesDistrict && matchesRegion;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div
        className={`relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-600 text-white text-xs font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce">
            <Check className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base leading-tight flex items-center space-x-2">
                <span>{language === 'ml' ? 'കേരള ലൊക്കേഷൻ തിരഞ്ഞെടുക്കുക' : 'Choose Your Kerala Location'}</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                  14 Districts & Rural Villages
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'ml'
                  ? 'മാപ്പിൽ തൊട്ടോ ഗ്രാമങ്ങളുടെ പട്ടികയിൽ നിന്നോ നിങ്ങളുടെ സ്ഥലം തിരഞ്ഞെടുക്കുക'
                  : 'Tap anywhere on the interactive Kerala map or pick from 80+ rural villages & taluks'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & GPS Bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800 text-xs font-black">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{language === 'ml' ? '🗺️ മാപ്പിൽ പിൻ ചെയ്യുക' : '🗺️ Kerala Map Pin'}</span>
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center space-x-1.5 ${
                activeTab === 'directory'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>
                {language === 'ml'
                  ? `📋 ഗ്രാമ ഡയറക്ടറി (${locations.length})`
                  : `📋 Village Directory (${locations.length})`}
              </span>
            </button>
          </div>

          {/* Quick GPS Button */}
          <button
            onClick={handleDetectGPS}
            disabled={isDetectingGps}
            className="py-1.5 px-3 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300 font-extrabold text-xs flex items-center space-x-1.5 hover:bg-blue-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Crosshair className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
            <span>
              {isDetectingGps
                ? (language === 'ml' ? 'കണ്ടെത്തുന്നു...' : 'Detecting GPS...')
                : (language === 'ml' ? '🎯 എൻ്റെ ലൊക്കേഷൻ (GPS)' : '🎯 My GPS Location')}
            </span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE KERALA MAP */}
        {activeTab === 'map' && (
          <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
            {/* District Quick-Fly Horizontal Pills */}
            <div className="px-5 py-2.5 border-b border-slate-100 dark:border-slate-800/80 overflow-x-auto no-scrollbar flex items-center space-x-1.5 shrink-0 bg-slate-50/50 dark:bg-slate-950/30">
              <span className="text-[10px] font-black uppercase text-slate-400 shrink-0 mr-1 flex items-center space-x-1">
                <Compass className="w-3 h-3 text-blue-500" />
                <span>Jump:</span>
              </span>
              <button
                onClick={() => handleFlyToDistrict('All')}
                className={`text-[11px] font-black px-2.5 py-1 rounded-xl shrink-0 transition-all ${
                  selectedDistrict === 'All'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                }`}
              >
                All Kerala
              </button>
              {KERALA_DISTRICTS.map((dist) => (
                <button
                  key={dist.name}
                  onClick={() => handleFlyToDistrict(dist.name)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl shrink-0 transition-all ${
                    selectedDistrict === dist.name
                      ? 'bg-blue-600 text-white font-black shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'
                  }`}
                >
                  {language === 'ml' ? dist.labelMl : dist.name}
                </button>
              ))}
            </div>

            {/* Leaflet Map Box */}
            <div className="relative w-full h-64 sm:h-80 md:h-96 shrink-0 bg-slate-100 dark:bg-slate-950">
              <div ref={mapContainerRef} className="w-full h-full z-10" />

              {/* Map Guide Overlay Pill */}
              <div className="absolute top-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg border border-slate-700 flex items-center space-x-1.5 pointer-events-none">
                <MapPin className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>
                  {language === 'ml'
                    ? 'നിങ്ങളുടെ ഗ്രാമത്തിലോ വീടിനടുത്തോ മാപ്പിൽ തൊടുക'
                    : 'Tap anywhere on the Kerala map to pin your doorstep'}
                </span>
              </div>

              {/* Legend overlay */}
              <div className="absolute bottom-3 right-3 z-[400] bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1.5 rounded-xl shadow-lg border border-slate-700 hidden sm:flex items-center space-x-2 pointer-events-none">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Rural Village</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>High-Range</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                  <span>Coastal</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span>Urban</span>
                </span>
              </div>
            </div>

            {/* Selected / Pinned Location Card */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-blue-500/5 to-transparent border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {pinnedLocation.name}
                    </h4>
                    {pinnedLocation.district && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-300">
                        {pinnedLocation.district}
                      </span>
                    )}
                    {pinnedLocation.regionType && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {pinnedLocation.regionType.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {pinnedLocation.taluk && <span>Taluk: <b>{pinnedLocation.taluk}</b></span>}
                    {pinnedLocation.panchayat && <span>Panchayat: <b>{pinnedLocation.panchayat}</b></span>}
                    <span>PIN: <b>{pinnedLocation.pin}</b></span>
                    <span>GPS: <b>{pinnedLocation.lat.toFixed(4)}, {pinnedLocation.lng.toFixed(4)}</b></span>
                    {pinDistanceToNearest !== null && pinDistanceToNearest > 0 && (
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        ({pinDistanceToNearest.toFixed(1)} km from nearest hub)
                      </span>
                    )}
                  </div>
                </div>

                {/* Confirm Location Button */}
                <button
                  onClick={handleConfirmLocation}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-lg shadow-blue-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {language === 'ml' ? 'ഈ ലൊക്കേഷൻ ഉറപ്പാക്കുക' : 'Set as Active Location'}
                  </span>
                </button>
              </div>

              {/* Landmark / House Name Input */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center gap-2">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                  {language === 'ml' ? 'വീട്ടുപേര് / പ്രധാന ലാൻഡ്മാർക്ക്:' : 'Specific Landmark / House:'}
                </div>
                <input
                  type="text"
                  value={customLandmark}
                  onChange={(e) => setCustomLandmark(e.target.value)}
                  placeholder="e.g. Near St. Mary Church / Karshika Bhavan / Estate Road"
                  className={`flex-1 w-full px-3 py-1.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600'
                      : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VILLAGE & TALUK DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-5 space-y-3 min-h-0">
            {/* Search Bar & Add Button */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'ml'
                      ? 'ഗ്രാമം, താലൂക്ക്, ജില്ല, അല്ലെങ്കിൽ പിൻ കോഡ് തിരയുക...'
                      : 'Search village, taluk, district or pin (e.g. Devikulam, Kuttanad, 685612)...'
                  }
                  className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Add Custom Village Toggle */}
              <button
                onClick={() => setShowAddVillageForm(!showAddVillageForm)}
                className="w-full sm:w-auto py-2.5 px-3.5 rounded-2xl border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300 font-extrabold text-xs flex items-center justify-center space-x-1.5 hover:bg-blue-500/20 transition-all shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {showAddVillageForm
                    ? (language === 'ml' ? 'ഫോം മറയ്ക്കുക' : 'Close Form')
                    : (language === 'ml' ? '+ പുതിയ ഗ്രാമം ചേർക്കുക' : '+ Add Remote Village')}
                </span>
              </button>
            </div>

            {/* Inline Add Village Form */}
            {showAddVillageForm && (
              <form
                onSubmit={handleCreateNewVillage}
                className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3 animate-in fade-in"
              >
                <div className="flex items-center space-x-2 text-xs font-black text-blue-600 dark:text-blue-300">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {language === 'ml'
                      ? 'നിങ്ങളുടെ ഗ്രാമമോ എസ്റ്റേറ്റോ ഫിക്സിയിൽ ചേർക്കുക'
                      : 'Add Your Village, Estate or Hamlet to Fykzi Kerala'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Village / Area Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newVillageName}
                      onChange={(e) => setNewVillageName(e.target.value)}
                      placeholder="e.g. Nelliyampathy Valley"
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      District *
                    </label>
                    <select
                      value={newVillageDistrict}
                      onChange={(e) => setNewVillageDistrict(e.target.value)}
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                    >
                      {KERALA_DISTRICTS.map((d) => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      Taluk / Panchayat
                    </label>
                    <input
                      type="text"
                      value={newVillageTaluk}
                      onChange={(e) => setNewVillageTaluk(e.target.value)}
                      placeholder="e.g. Chittur"
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      value={newVillagePin}
                      onChange={(e) => setNewVillagePin(e.target.value)}
                      placeholder="e.g. 678508"
                      className={`w-full px-3 py-1.5 rounded-xl border text-xs font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-slate-400">Category:</span>
                    <button
                      type="button"
                      onClick={() => setNewVillageRegion('RURAL_VILLAGE')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                        newVillageRegion === 'RURAL_VILLAGE'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Rural Village
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVillageRegion('HIGH_RANGE')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                        newVillageRegion === 'HIGH_RANGE'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      High-Range
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewVillageRegion('COASTAL')}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                        newVillageRegion === 'COASTAL'
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Coastal
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-700 shadow-md transition-all cursor-pointer"
                  >
                    Save & Set Location
                  </button>
                </div>
              </form>
            )}

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pb-1">
              {/* Region Type Filter */}
              <button
                onClick={() => setSelectedRegionType('ALL')}
                className={`text-[10px] font-black px-2.5 py-1 rounded-xl transition-all ${
                  selectedRegionType === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All Regions ({locations.length})
              </button>
              <button
                onClick={() => setSelectedRegionType('RURAL_VILLAGE')}
                className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center space-x-1 transition-all ${
                  selectedRegionType === 'RURAL_VILLAGE'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                }`}
              >
                <Trees className="w-3 h-3" />
                <span>Rural Villages</span>
              </button>
              <button
                onClick={() => setSelectedRegionType('HIGH_RANGE')}
                className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center space-x-1 transition-all ${
                  selectedRegionType === 'HIGH_RANGE'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}
              >
                <Mountain className="w-3 h-3" />
                <span>High-Range Hills</span>
              </button>
              <button
                onClick={() => setSelectedRegionType('COASTAL')}
                className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center space-x-1 transition-all ${
                  selectedRegionType === 'COASTAL'
                    ? 'bg-sky-600 text-white'
                    : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                }`}
              >
                <Waves className="w-3 h-3" />
                <span>Coastal</span>
              </button>
              <button
                onClick={() => setSelectedRegionType('URBAN')}
                className={`text-[10px] font-black px-2.5 py-1 rounded-xl flex items-center space-x-1 transition-all ${
                  selectedRegionType === 'URBAN'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                }`}
              >
                <Building className="w-3 h-3" />
                <span>Towns / Urban</span>
              </button>

              {/* District Select Dropdown */}
              <div className="ml-auto flex items-center space-x-1">
                <span className="text-[10px] font-bold text-slate-400">District:</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className={`text-[11px] font-bold px-2 py-1 rounded-xl border ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200'
                  }`}
                >
                  <option value="All">All 14 Districts</option>
                  {KERALA_DISTRICTS.map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List of Villages */}
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {filteredDirectoryLocations.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-semibold">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>No locations matched your filter or search query.</p>
                  <p className="mt-1 text-[11px] text-blue-500 font-bold">
                    You can switch to the Map tab to drop a pin anywhere, or click "+ Add Remote Village" above!
                  </p>
                </div>
              ) : (
                filteredDirectoryLocations.map((loc) => {
                  const isSelected = selectedLocation.id === loc.id;
                  const isServiced = loc.isServiced !== false;

                  let badgeColor = 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
                  let icon = '🏙️';
                  if (loc.regionType === 'RURAL_VILLAGE') {
                    badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                    icon = '🌾';
                  } else if (loc.regionType === 'HIGH_RANGE') {
                    badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
                    icon = '⛰️';
                  } else if (loc.regionType === 'COASTAL') {
                    badgeColor = 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20';
                    icon = '🌊';
                  }

                  return (
                    <div
                      key={loc.id}
                      className={`p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600/10 text-blue-600 dark:text-blue-300'
                          : isDark
                          ? 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5">
                        <span className="text-lg mt-0.5">{icon}</span>
                        <div>
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-extrabold text-sm">{loc.name}</span>
                            {loc.district && (
                              <span className="text-[10px] text-slate-400">({loc.district})</span>
                            )}
                            {loc.regionType && (
                              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badgeColor}`}>
                                {loc.regionType.replace('_', ' ')}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-2">
                            {loc.taluk && <span>Taluk: {loc.taluk}</span>}
                            {loc.panchayat && <span>Panchayat: {loc.panchayat}</span>}
                            <span>PIN: {loc.pin}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {/* View On Map Button */}
                        <button
                          onClick={() => {
                            setPinnedLocation(loc);
                            setActiveTab('map');
                            if (leafletMapRef.current) {
                              leafletMapRef.current.flyTo([loc.lat, loc.lng], 13, { duration: 1.0 });
                              placeActivePinMarker(leafletMapRef.current, loc.lat, loc.lng, loc.name);
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-300 text-[10px] font-extrabold flex items-center space-x-1 transition-all cursor-pointer"
                        >
                          <Navigation className="w-3 h-3" />
                          <span className="hidden sm:inline">View on Map</span>
                        </button>

                        {/* Select Button */}
                        <button
                          onClick={() => {
                            onSelectLocation({ ...loc, isLiveGps: false });
                            setToastMessage(`📍 Selected: ${loc.name}`);
                            setTimeout(() => {
                              setToastMessage(null);
                              onClose();
                            }, 400);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all flex items-center space-x-1 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-300 hover:bg-blue-600 hover:text-white'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Active</span>
                            </>
                          ) : (
                            <span>Select</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>
              {language === 'ml'
                ? 'ഫിക്സി കേരളത്തിലെ 14 ജില്ലകളിലെ ഗ്രാമങ്ങളിലും സേവനം എത്തിക്കുന്നു'
                : 'Fykzi delivers doorstep verified services across all 14 districts & villages'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
