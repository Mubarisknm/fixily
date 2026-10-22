import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  MapPin,
  Wrench,
  Sun,
  Moon,
  Search,
  ChevronRight,
  ChevronDown,
  X,
  Globe,
  Lock,
  User,
  LogOut,
  Bell,
  Volume2,
  VolumeX,
  Menu,
  Mic,
  MicOff,
  Zap,
  Sparkles,
  CheckCircle2,
  SlidersHorizontal,
  Navigation,
  Compass,
  ArrowRight
} from 'lucide-react';
import { KochiLocation, ThemeMode, AppLanguage, UserSession, UserRole } from '../types';
import { useTranslation } from '../utils/translations';
import { KeralaMapLocationModal } from './KeralaMapLocationModal';
import { FykziLogo } from './FykziLogo';
import { sound } from '../utils/soundEffects';

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
  onOpenManageAddress?: () => void;
  onOpenNotificationSettings?: () => void;
  isMenuDrawerOpen?: boolean;
  onSetMenuDrawerOpen?: (open: boolean) => void;
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
  isDetectingLiveGps,
  onOpenManageAddress,
  onOpenNotificationSettings,
  isMenuDrawerOpen,
  onSetMenuDrawerOpen
}) => {
  const { t } = useTranslation(language);
  const isDark = theme === 'dark';

  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [showMenuDrawer, setShowMenuDrawer] = useState<boolean>(false);
  const isDrawerVisible = isMenuDrawerOpen !== undefined ? isMenuDrawerOpen : showMenuDrawer;
  const setDrawerVisible = onSetMenuDrawerOpen || setShowMenuDrawer;
  const [activeCategoryTab, setActiveCategoryTab] = useState<'services' | 'rescue' | 'partner'>('services');
  const [instantFilterActive, setInstantFilterActive] = useState<boolean>(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('fykzi_sound_fx') : null;
    const isEnabled = saved !== null ? saved === 'true' : true;
    sound.enabled = isEnabled;
    return isEnabled;
  });

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fykzi_sound_fx', String(next));
    }
    if (next) {
      sound.playClick();
    }
  };

  // Synchronize category tab with global tab
  useEffect(() => {
    if (activeTab === 'partner') {
      setActiveCategoryTab('partner');
    } else if (activeTab === 'customer') {
      if (activeCategoryTab === 'partner') {
        setActiveCategoryTab('services');
      }
    }
  }, [activeTab]);

  const handleSelectCategory = (cat: 'services' | 'rescue' | 'partner') => {
    sound.playClick();
    setActiveCategoryTab(cat);

    if (cat === 'services') {
      setActiveTab('customer');
      const servicesSection = document.getElementById('services-grid-section') || document.getElementById('customer-services-container');
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (cat === 'rescue') {
      setActiveTab('customer');
      if (onOpenEmergency) {
        onOpenEmergency();
      }
    } else if (cat === 'partner') {
      // Directly switch to the Partner Portal
      setActiveTab('partner');
    }
  };

  const handleSearchSubmit = (queryToUse?: string) => {
    sound.playClick();
    const q = (queryToUse !== undefined ? queryToUse : headerSearchQuery).trim();
    setActiveTab('customer');

    const searchInput = (document.getElementById('services-page-search') || document.getElementById('service-search-input')) as HTMLInputElement | null;
    if (searchInput) {
      searchInput.value = q;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchInput.focus();
    } else {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handleVoiceSearch = () => {
    sound.playClick();
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceToast('Speech recognition not supported in this browser');
      setTimeout(() => setVoiceToast(null), 3000);
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = language === 'ml' ? 'ml-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setVoiceToast('Listening... Speak a service name');

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setHeaderSearchQuery(transcript);
        setVoiceToast(`Searching: "${transcript}"`);
        setTimeout(() => setVoiceToast(null), 2500);
        handleSearchSubmit(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceToast('Voice input cancelled or unavailable');
        setTimeout(() => setVoiceToast(null), 2500);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const cleanLocationName = (selectedLocation?.name || 'Kent Baywatch Suites')
    .replace(/^Live:\s*/i, '')
    .replace(/\s*Area$/i, '')
    .split('(')[0]
    .trim();

  const locationSubtitle = [
    cleanLocationName,
    selectedLocation?.district || selectedLocation?.city || 'Kochi',
    'Kerala, India'
  ].filter(Boolean).join(', ');

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-xl ${
      isDark
        ? 'bg-[#0B0F19]/95 text-white border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        : 'bg-[#F8FAFC]/95 text-slate-900 border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.05)]'
    }`}>
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-2 sm:py-3 space-y-2.5">
        
        {/* ======================================================== */}
        {/* ROW 1: LOCATION HEADER & CIRCULAR MENU BUTTON (Swiggy Style) */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Location Title + Chevron + Subtitle */}
          <div
            onClick={() => {
              sound.playClick();
              if (onOpenLocationModal) {
                onOpenLocationModal();
              } else {
                setShowLocationModal(true);
              }
            }}
            className="flex items-start space-x-2.5 cursor-pointer group min-w-0 flex-1 select-none"
            title="Tap to change delivery location & explore Kerala map"
          >
            {/* Small subtle brand mark */}
            <div className="mt-0.5 shrink-0 group-hover:scale-105 transition-transform">
              <FykziLogo isDark={isDark} size="sm" variant="icon" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base sm:text-lg font-black tracking-tight truncate group-hover:text-teal-500 transition-colors">
                  {cleanLocationName}
                </h1>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                
                {selectedLocation.isLiveGps && (
                  <span className="relative flex h-2 w-2 shrink-0 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 truncate">
                {locationSubtitle}
              </p>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* ROW 2: 3 CATEGORY TABS (Swiggy Curved Card / Pill Style) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          
          {/* Tab 1: Doorstep Services */}
          <button
            type="button"
            onClick={() => handleSelectCategory('services')}
            className={`flex items-center justify-center space-x-2 sm:space-x-3 py-2.5 px-2 rounded-2xl border transition-all cursor-pointer select-none ${
              activeCategoryTab === 'services' && activeTab === 'customer'
                ? isDark
                  ? 'bg-gradient-to-r from-teal-950/80 to-slate-900 border-teal-500/60 text-white shadow-lg shadow-teal-950/40'
                  : 'bg-teal-50/90 border-teal-400 text-teal-950 shadow-md shadow-teal-500/10'
                : isDark
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  : 'bg-white border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-sm shrink-0 transition-transform ${
              activeCategoryTab === 'services' && activeTab === 'customer' ? 'scale-110' : ''
            } ${
              isDark ? 'bg-teal-500/20 text-teal-300' : 'bg-teal-100 text-teal-700'
            }`}>
              🛠️
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs sm:text-sm font-black truncate leading-tight">
                Services
              </div>
              <div className="text-[10px] font-semibold text-slate-400 truncate hidden xs:block">
                Doorstep
              </div>
            </div>
          </button>

          {/* Tab 2: 15-Min Rescue */}
          <button
            type="button"
            onClick={() => handleSelectCategory('rescue')}
            className={`flex items-center justify-center space-x-2 sm:space-x-3 py-2.5 px-2 rounded-2xl border transition-all cursor-pointer select-none ${
              activeCategoryTab === 'rescue'
                ? isDark
                  ? 'bg-gradient-to-r from-rose-950/80 to-slate-900 border-rose-500/60 text-white shadow-lg shadow-rose-950/40'
                  : 'bg-rose-50/90 border-rose-400 text-rose-950 shadow-md shadow-rose-500/10'
                : isDark
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  : 'bg-white border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
            }`}
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-sm shrink-0 transition-transform ${
              activeCategoryTab === 'rescue' ? 'scale-110' : ''
            } ${
              isDark ? 'bg-rose-500/20 text-rose-300' : 'bg-rose-100 text-rose-700'
            }`}>
              ⚡
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs sm:text-sm font-black truncate leading-tight">
                15-Min Rescue
              </div>
              <div className="text-[10px] font-semibold text-slate-400 truncate hidden xs:block">
                Breakdown
              </div>
            </div>
          </button>

          {/* Tab 3: Partner Portal (Specialist Pro) */}
          <button
            type="button"
            onClick={() => handleSelectCategory('partner')}
            className={`flex items-center justify-center space-x-2 sm:space-x-3 py-2.5 px-2 rounded-2xl border transition-all cursor-pointer select-none ${
              activeCategoryTab === 'partner' || activeTab === 'partner'
                ? isDark
                  ? 'bg-gradient-to-r from-blue-950/80 to-slate-900 border-blue-500/60 text-white shadow-lg shadow-blue-950/40'
                  : 'bg-blue-50/90 border-blue-400 text-blue-950 shadow-md shadow-blue-500/10'
                : isDark
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  : 'bg-white border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
            }`}
            title="Open Specialist & Partner Portal"
          >
            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-sm shrink-0 transition-transform ${
              activeCategoryTab === 'partner' || activeTab === 'partner' ? 'scale-110' : ''
            } ${
              isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
            }`}>
              🔧
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs sm:text-sm font-black truncate leading-tight">
                Partner Portal
              </div>
              <div className="text-[10px] font-semibold text-slate-400 truncate hidden xs:block">
                Specialist Pro
              </div>
            </div>
          </button>

        </div>

        {/* ======================================================== */}
        {/* ROW 3: PROMINENT SEARCH PILL + MIC + INSTANT FILTER PILL */}
        {/* ======================================================== */}
        <div className={`flex items-center rounded-2xl border px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm transition-all ${
          isDark
            ? 'bg-slate-900/90 border-slate-700/80 text-white focus-within:border-teal-500 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
            : 'bg-white border-slate-200/90 text-slate-900 focus-within:border-teal-500 shadow-[0_4px_16px_rgba(0,0,0,0.06)]'
        }`}>
          
          {/* Search Icon */}
          <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />

          {/* Search Input */}
          <input
            id="fykzi-header-search-bar"
            type="text"
            value={headerSearchQuery}
            onChange={(e) => setHeaderSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit();
              }
            }}
            placeholder="Search for 'AC Repair', 'Mechanic', 'Electrician'..."
            className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400 truncate"
          />

          {/* Clear button if typed */}
          {headerSearchQuery && (
            <button
              onClick={() => {
                setHeaderSearchQuery('');
                handleSearchSubmit('');
              }}
              className="p-1 text-slate-400 hover:text-slate-200 rounded-full mr-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Divider */}
          <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 shrink-0" />

          {/* Orange Microphone Voice Search Icon */}
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`p-1.5 rounded-full transition-all cursor-pointer shrink-0 relative ${
              isListening ? 'bg-orange-500 text-white animate-pulse' : 'text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/40'
            }`}
            title="Search with Voice"
          >
            {isListening ? (
              <MicOff className="w-4 h-4 text-white" />
            ) : (
              <Mic className="w-4 h-4 text-orange-500 fill-orange-500/20" />
            )}
          </button>

          {/* Instant Filter Pill (Swiggy 'VEG' style toggle button) */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setInstantFilterActive(!instantFilterActive);
              handleSearchSubmit(!instantFilterActive ? 'Emergency' : '');
            }}
            className={`ml-2 px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider flex items-center space-x-1 border transition-all cursor-pointer shrink-0 select-none ${
              instantFilterActive
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm shadow-emerald-600/30'
                : isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Filter by instant 15-minute dispatch"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${instantFilterActive ? 'bg-white' : 'bg-emerald-500'}`} />
            <span>15-MIN</span>
          </button>

        </div>

      </div>

      {/* Voice Recognition Notification Toast */}
      {voiceToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white border border-teal-500/50 text-xs font-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2 animate-in fade-in">
          <Mic className="w-4 h-4 text-orange-400 animate-pulse" />
          <span>{voiceToast}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SLIDE-OUT NAVIGATION DRAWER (Clean Menu & Account Settings) */}
      {/* ======================================================== */}
      {isDrawerVisible && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerVisible(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Drawer Content */}
          <div className={`relative w-full max-w-sm h-full flex flex-col z-10 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300 ${
            isDark ? 'bg-slate-950 text-white border-l border-slate-800' : 'bg-white text-slate-900 border-l border-slate-200'
          }`}>
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FykziLogo isDark={isDark} size="sm" variant="full" />
              </div>
              <button
                onClick={() => setDrawerVisible(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-teal-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-600 text-white font-black text-lg flex items-center justify-center">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-sm truncate">{currentUser.name}</div>
                    <div className="text-xs text-slate-400 truncate">
                      {currentUser.phone || currentUser.email || 'Verified Member'}
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] text-emerald-500 font-bold mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Account</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="font-black text-sm">Welcome to Fykzi Kerala</div>
                  <p className="text-xs text-slate-400">
                    Sign in to book doorstep services, track live mechanics & manage toolkits.
                  </p>
                  <button
                    onClick={() => {
                      setDrawerVisible(false);
                      onOpenAuthModal('customer');
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs shadow-md shadow-teal-600/30 flex items-center justify-center space-x-2 cursor-pointer transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span>Login / Register</span>
                  </button>
                </div>
              )}
            </div>

            {/* Portal Switcher Navigation */}
            <div className="p-4 space-y-1.5 border-b border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1">
                Portals & Modes
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('customer');
                  setDrawerVisible(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'customer'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : isDark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <User className="w-4 h-4 text-teal-400" />
                  <span>Customer Services Portal</span>
                </div>
                {activeTab === 'customer' && <span className="text-[10px] font-black uppercase">Active</span>}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setActiveTab('partner');
                  setDrawerVisible(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'partner'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : isDark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Wrench className="w-4 h-4 text-blue-400" />
                  <span>Specialist Partner Portal</span>
                </div>
                {activeTab === 'partner' && <span className="text-[10px] font-black uppercase">Active</span>}
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  setDrawerVisible(false);
                  if (currentUser?.role === 'admin') {
                    setActiveTab('admin');
                  } else {
                    onOpenAuthModal('admin');
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : isDark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Admin Operations Console</span>
                </div>
                {activeTab === 'admin' && <span className="text-[10px] font-black uppercase">Active</span>}
              </button>
            </div>

            {/* Quick Settings & Toggles */}
            <div className="p-4 space-y-1.5 border-b border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1">
                Quick Preferences
              </div>

              {/* Language Toggle */}
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleLanguage();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>App Language</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  {language === 'en' ? 'മലയാളം' : 'English'}
                </span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleTheme();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
                  <span>Display Theme</span>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {isDark ? 'Night (Dark)' : 'Day (Light)'}
                </span>
              </button>

              {/* Sound FX Toggle */}
              <button
                onClick={handleToggleSound}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-teal-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  <span>Spatial Audio SFX</span>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {soundEnabled ? 'Enabled' : 'Muted'}
                </span>
              </button>
            </div>

            {/* Location & Preferences */}
            <div className="p-4 space-y-1.5 flex-1">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 mb-1">
                Location & Alerts
              </div>

              <button
                onClick={() => {
                  setDrawerVisible(false);
                  if (onOpenManageAddress) {
                    onOpenManageAddress();
                  } else if (onOpenLocationModal) {
                    onOpenLocationModal();
                  } else {
                    setShowLocationModal(true);
                  }
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Manage Address & GPS</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setDrawerVisible(false);
                  onOpenNotificationSettings?.();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isDark ? 'hover:bg-slate-900 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Notifications & Reminders</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* Logout Footer */}
            {currentUser && (
              <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    setDrawerVisible(false);
                    onLogout();
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl text-rose-500 font-bold hover:bg-rose-500/10 cursor-pointer transition-colors text-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

          </div>
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
