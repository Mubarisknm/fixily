import React from 'react';
import { ShieldCheck, UserCheck, LayoutDashboard, MapPin, Wrench, Car, Sun, Moon, Search } from 'lucide-react';
import { KochiLocation, ThemeMode } from '../types';

interface HeaderProps {
  activeTab: 'customer' | 'partner' | 'admin';
  setActiveTab: (tab: 'customer' | 'partner' | 'admin') => void;
  selectedLocation: KochiLocation;
  locations: KochiLocation[];
  onSelectLocation: (loc: KochiLocation) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedLocation,
  locations,
  onSelectLocation,
  theme,
  onToggleTheme
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 border-b shadow-sm ${
      isDark
        ? 'bg-slate-950 text-white border-slate-800'
        : 'bg-white text-slate-900 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('customer')}>
            <div className="bg-slate-900 text-white p-2 rounded-xl font-black flex items-center justify-center shadow-md">
              <Wrench className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Fixily
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  Kerala
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold hidden sm:block">
                On-Demand Services Platform
              </p>
            </div>
          </div>

          {/* Location & Search Bar (Urban Company Style) */}
          <div className="hidden lg:flex items-center space-x-3 flex-1 max-w-xl mx-4">
            
            {/* Location Selector */}
            <div className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-semibold shrink-0 ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
              <select
                value={selectedLocation.id}
                onChange={(e) => {
                  const loc = locations.find(l => l.id === e.target.value);
                  if (loc) onSelectLocation(loc);
                }}
                className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Global Search Input */}
            <div className={`relative flex-1 flex items-center rounded-xl border px-3 py-2 text-xs ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search for 'Car Wash', 'Electrician', 'Driver'..."
                className="bg-transparent w-full focus:outline-none text-xs font-medium"
              />
            </div>
          </div>

          {/* Right Controls: Theme Toggle & Role Switcher */}
          <div className="flex items-center space-x-3 shrink-0">
            
            {/* Day / Night Switchable Theme Toggle Button */}
            <button
              onClick={onToggleTheme}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-300 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
              }`}
              title="Toggle Day / Night Theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="hidden sm:inline">Day Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-700 fill-slate-700" />
                  <span className="hidden sm:inline">Night Dark</span>
                </>
              )}
            </button>

            {/* Navigation Tabs */}
            <div className={`flex items-center p-1 rounded-xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setActiveTab('customer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'customer'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer App
              </button>

              <button
                onClick={() => setActiveTab('partner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'partner'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Gig Partner App
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
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
