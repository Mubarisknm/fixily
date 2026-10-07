import React, { useState } from 'react';
import {
  Home,
  Search,
  Clock,
  Siren,
  User,
  ShieldCheck,
  Lock,
  Globe,
  Sun,
  Moon,
  X,
  LogOut,
  ChevronRight,
  MessageSquare,
  FileText,
  MapPin,
  Sparkles,
  Crosshair
} from 'lucide-react';
import { ThemeMode, AppLanguage, UserSession, UserRole, KochiLocation } from '../types';
import { useTranslation } from '../utils/translations';

interface MobileBottomNavProps {
  activeTab: 'customer' | 'partner' | 'admin';
  setActiveTab: (tab: 'customer' | 'partner' | 'admin') => void;
  activeJobsCount: number;
  onOpenEmergency: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  language: AppLanguage;
  onToggleLanguage: () => void;
  currentUser: UserSession | null;
  onOpenAuthModal: (role: UserRole) => void;
  onLogout: () => void;
  selectedLocation: KochiLocation;
  onOpenCancellationPolicy?: () => void;
  onOpenLocationModal?: () => void;
  onDetectLiveGps?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  activeJobsCount,
  onOpenEmergency,
  theme,
  onToggleTheme,
  language,
  onToggleLanguage,
  currentUser,
  onOpenAuthModal,
  onLogout,
  selectedLocation,
  onOpenCancellationPolicy,
  onOpenLocationModal,
  onDetectLiveGps
}) => {
  const { t } = useTranslation(language);
  const isDark = theme === 'dark';
  const [showAccountDrawer, setShowAccountDrawer] = useState<boolean>(false);

  const handleNavHome = () => {
    setActiveTab('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavSearch = () => {
    setActiveTab('customer');
    const searchEl = document.getElementById('service-search-input');
    if (searchEl) {
      searchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchEl.focus();
    } else {
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handleNavBookings = () => {
    setActiveTab('customer');
    if (!currentUser) {
      onOpenAuthModal('customer');
      return;
    }
    const ordersEl = document.getElementById('active-orders-section');
    if (ordersEl) {
      ordersEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Sticky Bottom Navigation Bar for Mobile View */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className={`fixed bottom-0 left-0 right-0 z-40 transition-colors duration-200 border-t backdrop-blur-xl ${
          isDark
            ? 'bg-[#0F172A]/95 border-slate-800/90 text-slate-400'
            : 'bg-[#F8FAFC]/95 border-slate-200/90 text-slate-600'
        } shadow-[0_-8px_30px_rgba(0,0,0,0.12)]`}
      >
        <div className="max-w-md mx-auto px-3 py-1.5 flex items-center justify-around">
          
          {/* Tab 1: Home */}
          <button
            onClick={handleNavHome}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
              activeTab === 'customer'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                : 'hover:text-blue-500 font-medium'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            <span className="text-[10px] leading-tight">
              {language === 'ml' ? 'ഹോം' : 'Home'}
            </span>
          </button>

          {/* Tab 2: Search Services */}
          <button
            onClick={handleNavSearch}
            className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 hover:text-blue-500 font-medium"
          >
            <Search className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            <span className="text-[10px] leading-tight">
              {language === 'ml' ? 'തിരയുക' : 'Search'}
            </span>
          </button>

          {/* Tab 3: SOS Emergency (Elevated Highlight) */}
          <button
            onClick={onOpenEmergency}
            className="flex flex-col items-center justify-center -mt-4 transition-transform active:scale-90"
            title="Kerala Emergency SOS 112"
          >
            <div className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 border-2 border-white dark:border-slate-900 animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-red-600 dark:text-red-400 mt-0.5">
              SOS
            </span>
          </button>

          {/* Tab 4: Bookings (With Active Badge) */}
          <button
            onClick={handleNavBookings}
            className="relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 hover:text-blue-500 font-medium"
          >
            <Clock className="w-5 h-5 mb-0.5 stroke-[2.2]" />
            {activeJobsCount > 0 && (
              <span className="absolute -top-0.5 right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm animate-bounce">
                {activeJobsCount}
              </span>
            )}
            <span className="text-[10px] leading-tight">
              {language === 'ml' ? 'ഓർഡറുകൾ' : 'Orders'}
            </span>
          </button>

          {/* Tab 5: Account / Roles Drawer */}
          <button
            onClick={() => setShowAccountDrawer(true)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all active:scale-95 ${
              showAccountDrawer || activeTab !== 'customer'
                ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                : 'hover:text-blue-500 font-medium'
            }`}
          >
            <div className="relative">
              <User className="w-5 h-5 mb-0.5 stroke-[2.2]" />
              {currentUser && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </div>
            <span className="text-[10px] leading-tight">
              {language === 'ml' ? 'അക്കൗണ്ട്' : 'Account'}
            </span>
          </button>

        </div>
      </nav>

      {/* Mobile Account & Quick Controls Drawer */}
      {showAccountDrawer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setShowAccountDrawer(false)}
          />

          <div
            className={`relative w-full max-w-lg rounded-t-3xl border-t shadow-2xl p-6 overflow-y-auto max-h-[85vh] transition-all z-10 animate-in slide-in-from-bottom duration-300 ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Drawer Drag Pill */}
            <div className="w-12 h-1.5 bg-slate-400/40 rounded-full mx-auto mb-4" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                    {currentUser ? currentUser.name.charAt(0) : 'F'}
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-sm">
                    {currentUser ? currentUser.name : 'Fykzi Kerala User'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {currentUser ? (currentUser.email || currentUser.phone) : 'Doorstep Verified Services'}
                  </p>
                  {currentUser && (
                    <span className="inline-block text-[10px] text-emerald-500 font-bold">
                      ✓ {currentUser.authProvider === 'google' ? 'Google Verified' : currentUser.authProvider === 'email' ? 'Email Verified' : 'OTP Verified'}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowAccountDrawer(false)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive Location Card with Live GPS Status & Changer */}
            <div className={`w-full my-3 p-3.5 rounded-2xl border transition-all flex flex-col space-y-2.5 ${
              selectedLocation.isLiveGps
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-blue-500/10 border-blue-500/20'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5 text-xs">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    selectedLocation.isLiveGps ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {selectedLocation.isLiveGps ? (
                      <Crosshair className="w-4 h-4 animate-spin-slow" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                        {selectedLocation.name}
                      </span>
                      {selectedLocation.district && (
                        <span className={`text-[10px] font-bold ${
                          selectedLocation.isLiveGps
                            ? 'text-emerald-600 dark:text-emerald-300'
                            : 'text-blue-600 dark:text-blue-300'
                        }`}>
                          ({selectedLocation.district})
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      PIN: {selectedLocation.pin} • {selectedLocation.isLiveGps ? '🛰️ Live GPS Active' : '📍 Custom Area'}
                    </div>
                  </div>
                </div>

                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white shadow-sm shrink-0 ${
                  selectedLocation.isLiveGps ? 'bg-emerald-600' : 'bg-blue-600'
                }`}>
                  {selectedLocation.isLiveGps ? 'Live GPS' : 'Custom'}
                </span>
              </div>

              {/* Action Buttons: Change on Map or Switch to Live GPS */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200/50 dark:border-slate-800/80">
                <button
                  onClick={() => {
                    setShowAccountDrawer(false);
                    onOpenLocationModal?.();
                  }}
                  className="py-1.5 px-2 rounded-xl bg-blue-600 text-white text-[11px] font-black flex items-center justify-center space-x-1 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <MapPin className="w-3 h-3" />
                  <span>Change on Map</span>
                </button>

                <button
                  onClick={() => {
                    setShowAccountDrawer(false);
                    onDetectLiveGps?.();
                  }}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-black flex items-center justify-center space-x-1 active:scale-95 transition-all cursor-pointer shadow-sm ${
                    selectedLocation.isLiveGps
                      ? 'bg-emerald-600 text-white'
                      : 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20'
                  }`}
                >
                  <Crosshair className="w-3 h-3" />
                  <span>{selectedLocation.isLiveGps ? 'Refresh GPS' : 'Use Live GPS'}</span>
                </button>
              </div>
            </div>

            {/* Portal Switcher Buttons */}
            <div className="space-y-2 py-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1">
                Switch Platform Portal
              </div>

              {/* Customer Portal */}
              <button
                onClick={() => {
                  setActiveTab('customer');
                  setShowAccountDrawer(false);
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  activeTab === 'customer'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Home className="w-4 h-4" />
                  <div>
                    <div className="text-xs font-black">Customer Service Portal</div>
                    <div className={`text-[10px] ${activeTab === 'customer' ? 'text-blue-200' : 'text-slate-400'}`}>
                      Book verified technicians, car wash &amp; repairs
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              {/* Gig Partner Portal */}
              <button
                onClick={() => {
                  setShowAccountDrawer(false);
                  if (currentUser?.role === 'partner' || currentUser?.role === 'admin') {
                    setActiveTab('partner');
                  } else {
                    onOpenAuthModal('partner');
                  }
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  activeTab === 'partner'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Lock className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-xs font-black flex items-center space-x-1.5">
                      <span>Gig Partner Portal</span>
                      <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.2 rounded font-mono font-bold">
                        OTP Protected
                      </span>
                    </div>
                    <div className={`text-[10px] ${activeTab === 'partner' ? 'text-blue-200' : 'text-slate-400'}`}>
                      Job radar, wallets &amp; KYC onboarding
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              {/* Admin Console */}
              <button
                onClick={() => {
                  setShowAccountDrawer(false);
                  if (currentUser?.role === 'admin') {
                    setActiveTab('admin');
                  } else {
                    onOpenAuthModal('admin');
                  }
                }}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  activeTab === 'admin'
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="text-xs font-black flex items-center space-x-1.5">
                      <span>Admin Operations Console</span>
                      <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.2 rounded font-mono font-bold">
                        PIN Protected
                      </span>
                    </div>
                    <div className={`text-[10px] ${activeTab === 'admin' ? 'text-blue-200' : 'text-slate-400'}`}>
                      PCC review, escrow holds &amp; GMV metrics
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>
            </div>

            {/* Quick Settings: Language & Theme */}
            <div className="grid grid-cols-2 gap-2 pt-3">
              <button
                onClick={onToggleLanguage}
                className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 text-xs font-black transition-all ${
                  isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <Globe className="w-4 h-4 text-blue-500" />
                <span>{language === 'en' ? 'മലയാളം' : 'English'}</span>
              </button>

              <button
                onClick={onToggleTheme}
                className={`p-3 rounded-2xl border flex items-center justify-center space-x-2 text-xs font-black transition-all ${
                  isDark ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                {isDark ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>Day Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-blue-700 fill-blue-700" />
                    <span>Night Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Help & Policies Links */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-4 space-y-2">
              <a
                href="https://wa.me/919895000112?text=Hello%20Fykzi%20Support,%20I%20am%20using%20the%20mobile%20app."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-2.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>24/7 Kerala WhatsApp Support (+91 98950 00112)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>

              {onOpenCancellationPolicy && (
                <button
                  onClick={() => {
                    setShowAccountDrawer(false);
                    onOpenCancellationPolicy();
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-between text-left"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Cancellation, Refund &amp; Dispute Policy</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Auth Action (Login / Logout) */}
            <div className="pt-4 mt-2">
              {currentUser ? (
                <button
                  onClick={() => {
                    setShowAccountDrawer(false);
                    onLogout();
                  }}
                  className="w-full py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-black flex items-center justify-center space-x-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('logout_btn')} ({currentUser.name.split(' ')[0]})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowAccountDrawer(false);
                    onOpenAuthModal('customer');
                  }}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 cursor-pointer active:scale-95 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>{t('login_btn')} (Google / Email / Mobile)</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};
