import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CustomerApp } from './customer/CustomerApp';
import { PartnerApp } from './partner/PartnerApp';
import { AdminConsole } from './admin/AdminConsole';
import { EmergencyModal } from './components/EmergencyModal';
import { KochiLocation, ServiceItem, GigPartner, BookingJob, ThemeMode } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'customer' | 'partner' | 'admin'>('customer');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('fixily_theme');
    return (saved === 'light' || saved === 'dark') ? (saved as ThemeMode) : 'dark';
  });
  const [locations, setLocations] = useState<KochiLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<KochiLocation>({
    id: 'kakkanad',
    name: 'Kakkanad (InfoPark & Seaport)',
    pin: '682030',
    lat: 10.0159,
    lng: 76.3419
  });
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [partners, setPartners] = useState<GigPartner[]>([]);
  const [jobs, setJobs] = useState<BookingJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);

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
      setLocations(locs);
      if (locs.length > 0 && !selectedLocation) setSelectedLocation(locs[0]);
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

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-200 flex flex-col font-sans ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedLocation={selectedLocation}
        locations={locations}
        onSelectLocation={setSelectedLocation}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                onRefreshJobs={loadAllData}
                theme={theme}
                isEmergencyModalOpen={isEmergencyModalOpen}
                setIsEmergencyModalOpen={setIsEmergencyModalOpen}
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

      <footer className={`border-t py-6 text-center text-xs transition-colors duration-200 ${
        isDark ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-purple-600">Fixily Platform</span>
            <span>• Kerala On-Demand Services</span>
          </div>
          <div className="text-[11px]">
            Mode: <strong className="text-purple-600 uppercase font-extrabold">{theme} Mode</strong> • © {new Date().getFullYear()} Fixily Technologies
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
