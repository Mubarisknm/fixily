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
import { KeralaMapLocationModal } from './components/KeralaMapLocationModal';
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
      regionType: 'URBAN'
    };
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [partners, setPartners] = useState<GigPartner[]>([]);
  const [jobs, setJobs] = useState<BookingJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

  const handleSelectLocation = (loc: KochiLocation) => {
    setSelectedLocation(loc);
    try {
      localStorage.setItem('fixily_selected_location', JSON.stringify(loc));
    } catch (e) {}
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
        />

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
