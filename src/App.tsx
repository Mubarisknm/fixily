import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { CustomerApp } from './customer/CustomerApp';
import { PartnerApp } from './partner/PartnerApp';
import { AdminConsole } from './admin/AdminConsole';
import { EmergencyModal } from './components/EmergencyModal';
import { PhoneOTPAuthModal } from './components/PhoneOTPAuthModal';
import { CancellationPolicyModal } from './components/CancellationPolicyModal';
import { LegalFooter } from './components/LegalFooter';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobilePhoneSimulator } from './components/MobilePhoneSimulator';
import { KeralaMapLocationModal, getHaversineDistanceKm } from './components/KeralaMapLocationModal';
import { KOCHI_LOCATIONS } from './data/db';
import { Crosshair, MapPin } from 'lucide-react';
import {
  KochiLocation,
  ServiceItem,
  GigPartner,
  BookingJob,
  ThemeMode,
  AppLanguage,
  UserRole,
  UserSession
} from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'customer' | 'partner' | 'admin'>('customer');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('fixily_theme');
    return (saved === 'light' || saved === 'dark') ? (saved as ThemeMode) : 'dark';
  });

  const [language, setLanguage] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('fixily_lang');
      return saved === 'ml' ? 'ml' : 'en';
    } catch {
      return 'en';
    }
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('fixily_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isMobilePhoneView, setIsMobilePhoneView] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('fixily_phone_view');
      if (saved !== null) return saved === 'true';
      return false;
    } catch {
      return false;
    }
  });

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; role: UserRole }>({
    isOpen: false,
    role: 'customer'
  });

  const [cancellationPolicyOpen, setCancellationPolicyOpen] = useState<boolean>(false);

  const [locations, setLocations] = useState<KochiLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<KochiLocation>(() => {
    try {
      const saved = localStorage.getItem('fixily_selected_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) return parsed;
      }
    } catch (e) {}
    return {
      id: 'kakkanad',
      name: 'Kakkanad (InfoPark & Seaport)',
      district: 'Ernakulam',
      pin: '682030',
      lat: 10.0159,
      lng: 76.3419,
      regionType: 'URBAN',
      isLiveGps: false
    };
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isDetectingLiveGps, setIsDetectingLiveGps] = useState<boolean>(false);
  const [liveGpsToast, setLiveGpsToast] = useState<{ message: string; isLive: boolean } | null>(null);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [partners, setPartners] = useState<GigPartner[]>([]);
  const [jobs, setJobs] = useState<BookingJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  // Auto-detect Live Geolocation whenever the user opens the app
  const detectLiveLocation = (showToast = true) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLiveGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsDetectingLiveGps(false);
        const { latitude, longitude } = position.coords;

        // Match against known Kerala locations
        const pool = locations.length > 0 ? locations : KOCHI_LOCATIONS;
        let closest = pool[0];
        let minDist = Infinity;
        pool.forEach((loc) => {
          const dist = getHaversineDistanceKm(latitude, longitude, loc.lat, loc.lng);
          if (dist < minDist) {
            minDist = dist;
            closest = loc;
          }
        });

        let resolvedName = closest ? closest.name : 'Kerala Live Location';
        if (minDist > 1.8 && closest) {
          resolvedName = `Live: ${closest.name.split('(')[0].trim()} Area`;
        }

        const liveLoc: KochiLocation = {
          id: `loc-live-gps-${Date.now()}`,
          name: resolvedName,
          district: closest?.district || 'Kerala',
          taluk: closest?.taluk,
          panchayat: closest?.panchayat,
          regionType: closest?.regionType || 'URBAN',
          pin: closest?.pin || '682001',
          lat: latitude,
          lng: longitude,
          isServiced: true,
          isLiveGps: true
        };

        setSelectedLocation(liveLoc);
        try {
          localStorage.setItem('fixily_selected_location', JSON.stringify(liveLoc));
        } catch (e) {}

        if (showToast) {
          setLiveGpsToast({
            message: `🛰️ Live Location Active: ${closest ? closest.name.split('(')[0].trim() : 'Kerala'}`,
            isLive: true
          });
          setTimeout(() => setLiveGpsToast(null), 4000);
        }
      },
      (err) => {
        setIsDetectingLiveGps(false);
        console.warn('Live location auto-detection prompt skipped or unavailable:', err.message);
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  };

  // Run live geolocation detection immediately whenever the app opens
  useEffect(() => {
    detectLiveLocation(true);
  }, []);

  const handleSelectLocation = (loc: KochiLocation) => {
    const updated = { ...loc };
    setSelectedLocation(updated);
    try {
      localStorage.setItem('fixily_selected_location', JSON.stringify(updated));
    } catch (e) {}
    setLiveGpsToast({
      message: updated.isLiveGps
        ? `🛰️ Live Location Active: ${updated.name.split('(')[0]}`
        : `📍 Changed Location to: ${updated.name.split('(')[0]}`,
      isLive: !!updated.isLiveGps
    });
    setTimeout(() => setLiveGpsToast(null), 3500);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [locs, servs, parts, jobsData] = await Promise.all([
        api.getLocations(),
        api.getServices(),
        api.getPartners(),
        api.getJobs()
      ]);
      // Merge custom added locations from localStorage if any
      let finalLocs = locs;
      try {
        const customLocsStr = localStorage.getItem('fixily_custom_locations');
        if (customLocsStr) {
          const customLocs: KochiLocation[] = JSON.parse(customLocsStr);
          if (Array.isArray(customLocs) && customLocs.length > 0) {
            finalLocs = [...customLocs, ...locs.filter(l => !customLocs.some(c => c.id === l.id))];
          }
        }
      } catch (e) {}
      setLocations(finalLocs);
      if (finalLocs.length > 0 && !selectedLocation) setSelectedLocation(finalLocs[0]);
      setServices(servs);
      setPartners(parts);
      setJobs(jobsData);
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('fixily_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      // Local storage protection
    }
  }, [theme]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('fixily_session', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('fixily_session');
      }
    } catch (e) {
      // Local storage protection
    }
  }, [currentUser]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'ml' : 'en';
      try {
        localStorage.setItem('fixily_lang', next);
      } catch (e) {}
      return next;
    });
  };

  const handleToggleMobilePhoneView = () => {
    setIsMobilePhoneView(prev => {
      const next = !prev;
      try {
        localStorage.setItem('fixily_phone_view', String(next));
      } catch (e) {}
      return next;
    });
  };

  const handleOpenAuthModal = (role: UserRole) => {
    setAuthModal({ isOpen: true, role });
  };

  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    setAuthModal({ isOpen: false, role: 'customer' });
    if (session.role === 'partner') {
      setActiveTab('partner');
    } else if (session.role === 'admin') {
      setActiveTab('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('customer');
  };

  const handleTabChange = (tab: 'customer' | 'partner' | 'admin') => {
    if (tab === 'partner' && currentUser?.role !== 'partner' && currentUser?.role !== 'admin') {
      setAuthModal({ isOpen: true, role: 'partner' });
      return;
    }
    if (tab === 'admin' && currentUser?.role !== 'admin') {
      setAuthModal({ isOpen: true, role: 'admin' });
      return;
    }
    setActiveTab(tab);
  };

  // Count active orders for the mobile bottom nav badge
  const activeJobsCount = useMemo(() => {
    return jobs.filter(j =>
      j.status === 'PENDING' ||
      j.status === 'ASSIGNED' ||
      j.status === 'PROVIDER_ASSIGNED' ||
      j.status === 'ON_THE_WAY' ||
      j.status === 'IN_PROGRESS'
    ).length;
  }, [jobs]);

  const isDark = theme === 'dark';

  return (
    <MobilePhoneSimulator
      isEnabled={isMobilePhoneView}
      onToggleEnabled={handleToggleMobilePhoneView}
      theme={theme}
      language={language}
    >
      <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans relative w-full max-w-full overflow-x-hidden ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        <Header
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          selectedLocation={selectedLocation}
          locations={locations}
          onSelectLocation={handleSelectLocation}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onOpenEmergency={() => setIsEmergencyModalOpen(true)}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuthModal}
          onLogout={handleLogout}
          isMobileView={isMobilePhoneView}
          onToggleMobileView={handleToggleMobilePhoneView}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onDetectLiveGps={() => detectLiveLocation(true)}
          isDetectingLiveGps={isDetectingLiveGps}
        />

        {/* Live GPS & Location Change Floating Notification Toast */}
        {liveGpsToast && (
          <div className={`fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 rounded-2xl shadow-2xl flex items-center space-x-2.5 animate-bounce transition-all backdrop-blur-md ${
            liveGpsToast.isLive
              ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-500/40 shadow-emerald-900/30'
              : 'bg-slate-900/90 text-white border border-purple-500/40 shadow-purple-900/30'
          }`}>
            {liveGpsToast.isLive ? (
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            ) : (
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
            )}
            <span className="text-xs font-black">{liveGpsToast.message}</span>
          </div>
        )}

        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 w-full max-w-full overflow-x-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">Loading Fixily Platform...</p>
            </div>
          ) : (
            <>
              {activeTab === 'customer' && (
                <CustomerApp
                  services={services}
                  selectedLocation={selectedLocation}
                  jobs={jobs}
                  partners={partners}
                  onRefreshJobs={loadAllData}
                  theme={theme}
                  isEmergencyModalOpen={isEmergencyModalOpen}
                  setIsEmergencyModalOpen={setIsEmergencyModalOpen}
                  language={language}
                  onOpenCancellationPolicy={() => setCancellationPolicyOpen(true)}
                />
              )}

              {activeTab === 'partner' && (
                <PartnerApp
                  partners={partners}
                  jobs={jobs}
                  onRefreshData={loadAllData}
                  theme={theme}
                />
              )}

              {activeTab === 'admin' && (
                <AdminConsole
                  partners={partners}
                  jobs={jobs}
                  locations={locations}
                  onRefreshData={loadAllData}
                />
              )}
            </>
          )}
        </main>

        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          currentLocation={selectedLocation}
          theme={theme}
        />

        <PhoneOTPAuthModal
          isOpen={authModal.isOpen}
          onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
          targetRole={authModal.role}
          onLoginSuccess={handleLoginSuccess}
          theme={theme}
          language={language}
        />

        <CancellationPolicyModal
          isOpen={cancellationPolicyOpen}
          onClose={() => setCancellationPolicyOpen(false)}
          theme={theme}
          language={language}
        />

        {/* Production DPDP Act compliant Legal & Transparency Footer */}
        <LegalFooter
          theme={theme}
          language={language}
          onOpenCancellationPolicy={() => setCancellationPolicyOpen(true)}
          onOpenPartnerLogin={() => handleOpenAuthModal('partner')}
          onOpenAdminLogin={() => handleOpenAuthModal('admin')}
        />

        {/* Native Mobile Bottom Navigation Bar */}
        <MobileBottomNav
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          activeJobsCount={activeJobsCount}
          onOpenEmergency={() => setIsEmergencyModalOpen(true)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          language={language}
          onToggleLanguage={handleToggleLanguage}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuthModal}
          onLogout={handleLogout}
          selectedLocation={selectedLocation}
          onOpenCancellationPolicy={() => setCancellationPolicyOpen(true)}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onDetectLiveGps={() => detectLiveLocation(true)}
        />

        {/* Interactive Kerala Map & Rural Village Selector Modal */}
        <KeralaMapLocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          selectedLocation={selectedLocation}
          locations={locations}
          onSelectLocation={handleSelectLocation}
          theme={theme}
          language={language}
          onAddNewLocation={(newLoc) => {
            setLocations(prev => [newLoc, ...prev]);
            api.addLocation(newLoc).catch(() => {});
          }}
        />
      </div>
    </MobilePhoneSimulator>
  );
}

export default App;
