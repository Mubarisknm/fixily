import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  LayoutDashboard,
  MapPin,
  Wrench,
  Sun,
  Moon,
  Search,
  Siren,
  ChevronDown,
  Crosshair,
  Check,
  X,
  Compass,
  Navigation
} from 'lucide-react';
import { KochiLocation, ThemeMode } from '../types';

interface HeaderProps {
  activeTab: 'customer' | 'partner' | 'admin';
  setActiveTab: (tab: 'customer' | 'partner' | 'admin') => void;
  selectedLocation: KochiLocation;
  locations: KochiLocation[];
  onSelectLocation: (loc: KochiLocation) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenEmergency?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedLocation,
  locations,
  onSelectLocation,
  theme,
  onToggleTheme,
  onOpenEmergency
}) => {
  const isDark = theme === 'dark';
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>('');
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsToast, setGpsToast] = useState<string | null>(null);

  const filteredLocations = locations.filter(loc => {
    const q = searchLocationQuery.toLowerCase().trim();
    return (
      !q ||
      loc.name.toLowerCase().includes(q) ||
      (loc.pin && loc.pin.includes(q)) ||
      (loc.city && loc.city.toLowerCase().includes(q))
    );
  });

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingGps(false);
        const { latitude, longitude } = position.coords;
        let closest = locations[0];
        let minDist = Infinity;
        locations.forEach(loc => {
          const d = Math.hypot(loc.lat - latitude, loc.lng - longitude);
          if (d < minDist) {
            minDist = d;
            closest = loc;
          }
        });
        if (closest) {
          onSelectLocation(closest);
          setGpsToast(`🎯 GPS matched nearest hub: ${closest.name}`);
          setTimeout(() => setGpsToast(null), 3500);
          setShowLocationModal(false);
        }
      },
      () => {
        setIsDetectingGps(false);
        alert('Could not detect GPS location. Please select your area manually.');
      },
      { timeout: 10000 }
    );
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 border-b backdrop-blur-md ${
      isDark
        ? 'bg-slate-950/90 text-white border-slate-800/80 shadow-md'
        : 'bg-white/95 text-slate-900 border-slate-200/90 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & Prominent Active Location Display */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <div
              onClick={() => setActiveTab('customer')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-purple-600 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-200">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    Fixily
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                    On-Demand
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium hidden lg:block">
                  Doorstep Services & 24/7 Roadside Rescue
                </p>
              </div>
            </div>

            {/* Prominent Active Location Indicator & Settings Trigger */}
            <button
              onClick={() => setShowLocationModal(true)}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                isDark
                  ? 'bg-slate-900/90 border-purple-500/30 text-purple-200 hover:border-purple-400 hover:bg-slate-800'
                  : 'bg-purple-50/80 border-purple-200 text-purple-900 hover:bg-purple-100'
              }`}
              title="Click to view or change your active service location"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
              <div className="text-left flex flex-col sm:flex-row sm:items-center sm:space-x-1">
                <span className="truncate max-w-[100px] sm:max-w-[160px] font-black">
                  {selectedLocation.name.split('(')[0]}
                </span>
                <span className="text-[9px] uppercase font-black px-1 rounded bg-purple-500/20 text-purple-400 hidden sm:inline">
                  Active
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
            </button>
          </div>

          {/* Right Controls: SOS Emergency, Theme Toggle & Portal Switcher */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            
            {/* SOS Emergency Helpline Button */}
            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 transition-transform hover:scale-105 active:scale-95 animate-pulse"
                title="24/7 Emergency Helplines: Police 112, Ambulance 108, Fire 101"
              >
                <Siren className="w-3.5 h-3.5" />
                <span>SOS</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-sm ${
                isDark
                  ? 'bg-slate-900 border-amber-500/30 text-amber-300 hover:bg-slate-800 hover:border-amber-400'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? "Switch to Day Light Mode" : "Switch to Night Dark Mode"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="hidden md:inline">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-purple-700 fill-purple-700" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
            </button>

            {/* Portal Switcher */}
            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('customer')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'customer'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer
              </button>

              <button
                onClick={() => setActiveTab('partner')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'partner'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Gig Partner Portal"
              >
                Partner
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Admin Management Console"
              >
                Admin
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* GPS Matching Toast */}
      {gpsToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white text-xs font-black px-4 py-2 rounded-2xl shadow-xl flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{gpsToast}</span>
        </div>
      )}

      {/* Location Change Settings Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden my-auto flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Modal Header */}
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Location Settings</h3>
                  <p className="text-[11px] text-slate-400">
                    Switch your active city or micro-market coverage
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowLocationModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Currently Active Location Highlight Card */}
            <div className="p-5 space-y-4">
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark ? 'bg-purple-950/30 border-purple-500/40 text-purple-200' : 'bg-purple-50 border-purple-200 text-purple-900'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black shrink-0">
                    📍
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-500">
                      Currently Using
                    </span>
                    <h4 className="text-sm font-extrabold">{selectedLocation.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      PIN: {selectedLocation.pin} • GPS: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </span>
                  </div>
                </div>

                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                  ACTIVE
                </span>
              </div>

              {/* 1-Tap Detect Current GPS Button */}
              <button
                onClick={handleDetectGPS}
                disabled={isDetectingGps}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Crosshair className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingGps ? 'Acquiring GPS Coordinates...' : 'Detect My Current GPS Location'}</span>
              </button>

              {/* Search Filter */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchLocationQuery}
                  onChange={(e) => setSearchLocationQuery(e.target.value)}
                  placeholder="Search city, neighborhood, or PIN code..."
                  className={`w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 font-semibold ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Location Options Grid */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {filteredLocations.map(loc => {
                  const isCurrent = loc.id === selectedLocation.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => {
                        onSelectLocation(loc);
                        setShowLocationModal(false);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs ${
                        isCurrent
                          ? isDark
                            ? 'bg-purple-900/30 border-purple-500 text-white font-extrabold'
                            : 'bg-purple-50 border-purple-500 text-purple-950 font-extrabold'
                          : isDark
                          ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          : 'bg-white border-slate-200 hover:border-purple-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <MapPin className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-purple-500' : 'text-slate-400'}`} />
                        <div>
                          <div className="font-bold">{loc.name}</div>
                          <span className="text-[10px] text-slate-400 font-mono">PIN: {loc.pin}</span>
                        </div>
                      </div>

                      {isCurrent ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="text-[10px] font-bold text-purple-500 hover:underline">Select</span>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Modal Footer */}
            <div className={`p-4 border-t text-right ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <button
                onClick={() => setShowLocationModal(false)}
                className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-800 text-white hover:bg-slate-700"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
};
