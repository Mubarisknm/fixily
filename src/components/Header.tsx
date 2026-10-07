import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
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
  Navigation,
  Globe,
  Lock,
  User,
  LogOut,
  AlertCircle,
  Smartphone,
  Monitor
} from 'lucide-react';
import { KochiLocation, ThemeMode, AppLanguage, UserSession, UserRole } from '../types';
import { useTranslation } from '../utils/translations';
import { KeralaMapLocationModal } from './KeralaMapLocationModal';
import { FykziLogo } from './FykziLogo';

interface HeaderProps {
  activeTab: 'customer' | 'partner' | 'admin';
  setActiveTab: (tab: 'customer' | 'partner' | 'admin') => void;
  selectedLocation: KochiLocation;
  locations: KochiLocation[];
  onSelectLocation: (loc: KochiLocation) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenEmergency?: () => void;
  language: AppLanguage;
  onToggleLanguage: () => void;
  currentUser: UserSession | null;
  onOpenAuthModal: (role: UserRole) => void;
  onLogout: () => void;
  isMobileView?: boolean;
  onToggleMobileView?: () => void;
  onOpenLocationModal?: () => void;
  onDetectLiveGps?: () => void;
  isDetectingLiveGps?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedLocation,
  locations,
  onSelectLocation,
  theme,
  onToggleTheme,
  onOpenEmergency,
  language,
  onToggleLanguage,
  currentUser,
  onOpenAuthModal,
  onLogout,
  isMobileView,
  onToggleMobileView,
  onOpenLocationModal,
  onDetectLiveGps,
  isDetectingLiveGps
}) => {
  const { t } = useTranslation(language);
  const isDark = theme === 'dark';

  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [searchLocationQuery, setSearchLocationQuery] = useState<string>('');
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [gpsToast, setGpsToast] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  const filteredLocations = locations.filter(loc => {
    const q = searchLocationQuery.toLowerCase().trim();
    return (
      !q ||
      loc.name.toLowerCase().includes(q) ||
      (loc.district && loc.district.toLowerCase().includes(q)) ||
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

  const handleSwitchToPartner = () => {
    setShowUserDropdown(false);
    if (currentUser?.role === 'partner' || currentUser?.role === 'admin') {
      setActiveTab('partner');
    } else {
      // Require phone OTP login for Partner Portal (Item 14)
      onOpenAuthModal('partner');
    }
  };

  const handleSwitchToAdmin = () => {
    setShowUserDropdown(false);
    if (currentUser?.role === 'admin') {
      setActiveTab('admin');
    } else {
      // Require Admin Security PIN authentication (Item 14)
      onOpenAuthModal('admin');
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 border-b backdrop-blur-md ${
      isDark
        ? 'bg-[#0F172A]/95 text-white border-slate-800/80 shadow-md'
        : 'bg-[#F8FAFC]/95 text-slate-900 border-slate-200/90 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Logo & Prominent Active Location Display */}
          <div className="flex items-center space-x-1.5 sm:space-x-4 min-w-0">
            <div
              onClick={() => setActiveTab('customer')}
              className="cursor-pointer group shrink-0"
              title="Fykzi Kerala — Home"
            >
              <FykziLogo isDark={isDark} size="md" variant="full" />
            </div>

            {/* Active District / Location Selector */}
            <div className="flex items-center space-x-1 sm:space-x-1.5">
              <button
                onClick={() => {
                  if (onOpenLocationModal) {
                    onOpenLocationModal();
                  } else {
                    setShowLocationModal(true);
                  }
                }}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  selectedLocation.isLiveGps
                    ? isDark
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 hover:border-emerald-400'
                      : 'bg-emerald-50/90 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                    : isDark
                    ? 'bg-slate-900/90 border-blue-500/30 text-blue-200 hover:border-blue-400 hover:bg-slate-800'
                    : 'bg-blue-50/80 border-blue-200 text-blue-900 hover:bg-blue-100'
                }`}
                title="Click to change your location or view the Kerala map"
              >
                {selectedLocation.isLiveGps ? (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                ) : (
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${
                    selectedLocation.isServiced !== false ? 'bg-blue-500' : 'bg-amber-500'
                  }`} />
                )}

                <MapPin className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${
                  selectedLocation.isLiveGps ? 'text-emerald-500' : 'text-blue-500'
                }`} />

                <div className="text-left flex flex-col justify-center leading-tight">
                  <div className="flex items-center space-x-1">
                    <span className="truncate max-w-[65px] sm:max-w-[125px] font-black text-[11px] sm:text-xs">
                      {selectedLocation.name.split('(')[0]}
                    </span>
                    {selectedLocation.isLiveGps && (
                      <span className="text-[9px] font-black uppercase px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                        Live
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>

              {/* Quick "Use Live GPS" shortcut button when custom location is active */}
              {!selectedLocation.isLiveGps && onDetectLiveGps && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetectLiveGps();
                  }}
                  disabled={isDetectingLiveGps}
                  className="flex items-center space-x-1 px-2 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Detect and switch to your live GPS location"
                >
                  <Crosshair className={`w-3 h-3 ${isDetectingLiveGps ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline">Use Live GPS</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            
            {/* Language Switcher (Item 8: Malayalam support) */}
            <button
              onClick={onToggleLanguage}
              className={`flex items-center space-x-1 px-2 py-1.5 sm:px-2.5 rounded-xl border text-xs font-black transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-blue-500'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-300'
              }`}
              title="Toggle English / മലയാളം"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="hidden sm:inline">{language === 'en' ? 'മലയാളം' : 'English'}</span>
              <span className="sm:hidden font-black text-[11px]">{language === 'en' ? 'ML' : 'EN'}</span>
            </button>

            {/* SOS Emergency Helpline (Shown on sm+, MobileBottomNav has main SOS on mobile) */}
            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="hidden sm:flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 transition-transform hover:scale-105 active:scale-95 animate-pulse"
                title="24/7 Emergency Helplines: Police 112, Ambulance 108, Fire 101"
              >
                <Siren className="w-3.5 h-3.5" />
                <span>SOS</span>
              </button>
            )}

            {/* Theme Toggle Button (Shown on sm+, available in drawer on mobile) */}
            <button
              onClick={onToggleTheme}
              className={`hidden sm:flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-sm ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 hover:border-amber-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
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
                  <Moon className="w-4 h-4 text-blue-600 fill-blue-600" />
                  <span className="hidden md:inline">Dark</span>
                </>
              )}
            </button>

            {/* Mobile Phone View / Desktop Switcher (Desktop only!) */}
            {onToggleMobileView && (
              <button
                onClick={onToggleMobileView}
                className={`hidden md:flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-black transition-all shadow-sm ${
                  isMobileView
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30'
                    : isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-blue-500 hover:bg-slate-800'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-200'
                }`}
                title={isMobileView ? "Switch back to Fullscreen Desktop View" : "Switch to Mobile Phone View"}
              >
                {isMobileView ? (
                  <>
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                    <span>Phone View</span>
                  </>
                )}
              </button>
            )}

            {/* Protected Role-Based Account Button (Item 14: No open public tabs) */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-black transition-all ${
                      isDark
                        ? 'bg-blue-950/40 border-blue-800 text-blue-200 hover:bg-blue-900/50'
                        : 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="max-w-[60px] sm:max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                    <span className="text-[9px] uppercase px-1 rounded bg-blue-600 text-white font-extrabold hidden sm:inline">
                      {currentUser.role}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserDropdown && (
                    <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl p-2 z-50 text-xs animate-in fade-in ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                      <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="font-extrabold">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-400">{currentUser.phone}</div>
                        <div className="text-[10px] text-emerald-500 font-bold mt-0.5">✓ Phone OTP Verified</div>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setActiveTab('customer');
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center space-x-2 ${
                            activeTab === 'customer'
                              ? 'bg-blue-600 text-white'
                              : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Customer Portal</span>
                        </button>

                        <button
                          onClick={handleSwitchToPartner}
                          className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center space-x-2 ${
                            activeTab === 'partner'
                              ? 'bg-blue-600 text-white'
                              : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5 text-blue-400" />
                          <span>Gig Partner Portal</span>
                        </button>

                        <button
                          onClick={handleSwitchToAdmin}
                          className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center space-x-2 ${
                            activeTab === 'admin'
                              ? 'bg-blue-600 text-white'
                              : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                          <span>Admin Console</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-rose-500 font-bold hover:bg-rose-500/10 flex items-center space-x-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{t('logout_btn')}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => onOpenAuthModal('customer')}
                  className="flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md transition-all cursor-pointer shrink-0"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('login_btn')}</span>
                  <span className="sm:hidden text-xs">Login</span>
                </button>
              )}
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

      {/* Interactive Kerala Map & Rural Village Selector Modal */}
      <KeralaMapLocationModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        selectedLocation={selectedLocation}
        locations={locations}
        onSelectLocation={onSelectLocation}
        theme={theme}
        language={language}
      />
    </header>
  );
};
