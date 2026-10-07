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
  Monitor,
  Sparkles,
  Mail
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
  const [gpsToast, setGpsToast] = useState<string | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState<boolean>(false);

  const handleQuickSearchClick = () => {
    setActiveTab('customer');
    const searchInput = document.getElementById('service-search-input');
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    } else {
      window.scrollTo({ top: 150, behavior: 'smooth' });
    }
  };

  const handleSwitchToPartner = () => {
    setShowUserDropdown(false);
    if (currentUser?.role === 'partner' || currentUser?.role === 'admin') {
      setActiveTab('partner');
    } else {
      onOpenAuthModal('partner');
    }
  };

  const handleSwitchToAdmin = () => {
    setShowUserDropdown(false);
    if (currentUser?.role === 'admin') {
      setActiveTab('admin');
    } else {
      onOpenAuthModal('admin');
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-xl ${
      isDark
        ? 'bg-[#0F172A]/90 text-white border-slate-800/80 shadow-[0_4px_25px_rgba(0,0,0,0.4)]'
        : 'bg-[#F8FAFC]/90 text-slate-900 border-slate-200/90 shadow-[0_4px_20px_rgba(37,99,235,0.06)]'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-1.5 sm:gap-4">
          
          {/* 1. Left: Brand Logo & Interactive Location Selector */}
          <div className="flex items-center space-x-1.5 sm:space-x-3 min-w-0">
            <div
              onClick={() => setActiveTab('customer')}
              className="cursor-pointer group shrink-0 transition-transform active:scale-95"
              title="Fykzi Kerala — Home"
            >
              <FykziLogo isDark={isDark} size="md" variant="full" />
            </div>

            {/* Active Kerala Location Selector Pill */}
            <button
              onClick={() => {
                if (onOpenLocationModal) {
                  onOpenLocationModal();
                } else {
                  setShowLocationModal(true);
                }
              }}
              className={`flex items-center space-x-1.5 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl border text-xs font-bold transition-all shadow-sm cursor-pointer card-3d-interactive shrink-0 max-w-[130px] sm:max-w-[210px] ${
                selectedLocation.isLiveGps
                  ? isDark
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 hover:border-emerald-400'
                    : 'bg-emerald-50/90 border-emerald-300 text-emerald-950 hover:bg-emerald-100'
                  : isDark
                  ? 'bg-slate-900/90 border-blue-500/30 text-blue-200 hover:border-blue-400 hover:bg-slate-800'
                  : 'bg-blue-50/80 border-blue-200 text-blue-900 hover:bg-blue-100'
              }`}
              title="Tap to change area or explore Kerala live map"
            >
              {selectedLocation.isLiveGps ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : (
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  selectedLocation.isServiced !== false ? 'bg-blue-500' : 'bg-amber-500'
                }`} />
              )}

              <MapPin className={`w-3.5 h-3.5 shrink-0 ${
                selectedLocation.isLiveGps ? 'text-emerald-500' : 'text-blue-500'
              }`} />

              <div className="text-left flex flex-col justify-center leading-tight min-w-0">
                <div className="flex items-center space-x-1">
                  <span className="truncate font-black text-[11px] sm:text-xs">
                    {selectedLocation.name.split('(')[0]}
                  </span>
                  {selectedLocation.isLiveGps && (
                    <span className="text-[8px] font-black uppercase px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 shrink-0">
                      GPS
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3 h-3 opacity-60 shrink-0 hidden sm:inline" />
            </button>

            {/* Quick Live GPS Shortcut on Tablet/Desktop */}
            {!selectedLocation.isLiveGps && onDetectLiveGps && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDetectLiveGps();
                }}
                disabled={isDetectingLiveGps}
                className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
                title="Switch to your live GPS location"
              >
                <Crosshair className={`w-3 h-3 ${isDetectingLiveGps ? 'animate-spin' : ''}`} />
                <span>Live GPS</span>
              </button>
            )}
          </div>

          {/* 2. Right: Action Controls (Search, Language, Day/Night, Profile) */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            
            {/* Quick Search Button (Smooth Scroll to Search) */}
            <button
              onClick={handleQuickSearchClick}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-blue-500 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 shadow-sm'
              }`}
              title="Search services, technicians and repairs"
            >
              <Search className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="hidden md:inline">Search</span>
            </button>

            {/* Language Switcher (Malayalam / English) */}
            <button
              onClick={onToggleLanguage}
              className={`px-2 py-1.5 sm:px-2.5 rounded-xl border text-xs font-black transition-all flex items-center space-x-1 cursor-pointer ${
                isDark
                  ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-blue-500'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 shadow-sm'
              }`}
              title="Toggle English / മലയാളം"
            >
              <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="hidden sm:inline font-bold">{language === 'en' ? 'മലയാളം' : 'English'}</span>
              <span className="sm:hidden font-black text-[10px]">{language === 'en' ? 'ML' : 'EN'}</span>
            </button>

            {/* SOS Emergency Helpline */}
            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="hidden sm:flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md shadow-red-600/30 transition-transform hover:scale-105 active:scale-95 animate-pulse cursor-pointer"
                title="24/7 Emergency Helplines: Police 112, Ambulance 108, Fire 101"
              >
                <Siren className="w-3.5 h-3.5" />
                <span>SOS</span>
              </button>
            )}

            {/* Day / Night Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-sm flex items-center space-x-1 cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700 hover:border-amber-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-200'
              }`}
              title={isDark ? "Switch to Day Light Mode" : "Switch to Night Dark Mode"}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="hidden lg:inline">Day</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                  <span className="hidden lg:inline">Dark</span>
                </>
              )}
            </button>

            {/* Mobile View / Desktop Simulator Switcher (Desktop only) */}
            {onToggleMobileView && (
              <button
                onClick={onToggleMobileView}
                className={`hidden md:flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-black transition-all shadow-sm cursor-pointer ${
                  isMobileView
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30'
                    : isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-blue-500 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                }`}
                title={isMobileView ? "Switch to Desktop Full View" : "Preview Mobile Phone Simulator"}
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

            {/* User Profile / Google Sign-In Button */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className={`flex items-center space-x-1.5 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-2xl border text-xs font-black transition-all card-3d-interactive cursor-pointer ${
                      isDark
                        ? 'bg-blue-950/60 border-blue-700/60 text-blue-200 hover:bg-blue-900/50'
                        : 'bg-blue-50 border-blue-200 text-blue-900 hover:bg-blue-100'
                    }`}
                  >
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-500"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                        {currentUser.name.charAt(0)}
                      </div>
                    )}
                    <span className="max-w-[55px] sm:max-w-[85px] truncate text-[11px] sm:text-xs">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </button>

                  {/* 3D Glassmorphic Dropdown Menu */}
                  {showUserDropdown && (
                    <div className={`absolute right-0 mt-2 w-64 rounded-3xl border shadow-2xl p-2.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-200 ${
                      isDark
                        ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]'
                        : 'bg-white border-slate-200 text-slate-900 shadow-[0_20px_50px_rgba(37,99,235,0.15)]'
                    }`}>
                      <div className="p-2.5 border-b border-slate-100 dark:border-slate-800">
                        <div className="font-black text-sm">{currentUser.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {currentUser.email || currentUser.phone || 'Verified User'}
                        </div>
                        <div className="flex items-center space-x-1 text-[10px] text-emerald-500 font-bold mt-1">
                          <span>✓</span>
                          <span>
                            {currentUser.authProvider === 'google'
                              ? 'Google Authenticated'
                              : currentUser.authProvider === 'email'
                              ? 'Email Verified'
                              : 'Phone OTP Verified'}
                          </span>
                        </div>
                      </div>

                      <div className="py-1.5 space-y-1">
                        <button
                          onClick={() => {
                            setActiveTab('customer');
                            setShowUserDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
                            activeTab === 'customer'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                          }`}
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Customer Service Portal</span>
                        </button>

                        <button
                          onClick={handleSwitchToPartner}
                          className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
                            activeTab === 'partner'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5 text-blue-400" />
                          <span>Gig Partner Portal</span>
                        </button>

                        <button
                          onClick={handleSwitchToAdmin}
                          className={`w-full text-left px-3 py-2 rounded-xl font-bold flex items-center space-x-2 transition-colors cursor-pointer ${
                            activeTab === 'admin'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                          }`}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                          <span>Admin Console</span>
                        </button>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-rose-500 font-bold hover:bg-rose-500/10 flex items-center space-x-2 cursor-pointer transition-colors"
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
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md shadow-blue-600/30 transition-all card-3d-interactive cursor-pointer shrink-0"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t('login_btn')}</span>
                  <span className="sm:hidden text-xs font-black">Login</span>
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
