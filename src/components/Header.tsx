import React from 'react';
import { ShieldCheck, UserCheck, LayoutDashboard, MapPin, Wrench, Sun, Moon, Search, Siren } from 'lucide-react';
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

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 border-b backdrop-blur-md ${
      isDark
        ? 'bg-slate-950/90 text-white border-slate-800/80 shadow-md'
        : 'bg-white/95 text-slate-900 border-slate-200/90 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand Logo & Location */}
          <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
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
                <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                  Doorstep Services & 24/7 Roadside Rescue
                </p>
              </div>
            </div>

            {/* Quick Location Picker */}
            <div className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-slate-700'
                : 'bg-slate-100/80 border-slate-200 text-slate-700 hover:bg-slate-200/60'
            }`}>
              <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <select
                value={selectedLocation.id}
                onChange={(e) => {
                  const loc = locations.find(l => l.id === e.target.value);
                  if (loc) onSelectLocation(loc);
                }}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer pr-1"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Controls: SOS Emergency, Theme Toggle & Portal Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            
            {/* SOS Emergency Helpline Button */}
            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 transition-transform hover:scale-105 active:scale-95 animate-pulse"
                title="24/7 Emergency Helplines: Police 112, Ambulance 108, Fire 101"
              >
                <Siren className="w-3.5 h-3.5" />
                <span>SOS</span>
              </button>
            )}

            {/* Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-sm ${
                isDark
                  ? 'bg-slate-900 border-amber-500/30 text-amber-300 hover:bg-slate-800 hover:border-amber-400'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={isDark ? "Switch to Day Light Mode" : "Switch to Night Dark Mode"}
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="hidden sm:inline">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-purple-700 fill-purple-700" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              )}
            </button>

            {/* Portal Switcher (Compact & Friendly) */}
            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('customer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'customer'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer
              </button>

              <button
                onClick={() => setActiveTab('partner')}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
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
    </header>
  );
};
