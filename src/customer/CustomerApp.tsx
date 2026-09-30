import React, { useState, useMemo } from 'react';
import {
  Car,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Zap,
  Phone,
  ArrowRight,
  X,
  Droplets,
  Wrench,
  Camera,
  Search,
  Scissors,
  UserCheck,
  Building,
  Cpu,
  Navigation,
  Users,
  Heart,
  Smartphone,
  Droplet,
  ShoppingBag,
  Hammer,
  Siren,
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  Flame,
  Share2,
  Copy,
  Check
} from 'lucide-react';
import { ServiceItem, KochiLocation, BookingJob, ThemeMode } from '../types';
import { LiveMap } from '../components/LiveMap';
import { EmergencyModal } from '../components/EmergencyModal';
import { api } from '../services/api';

interface CustomerAppProps {
  services: ServiceItem[];
  selectedLocation: KochiLocation;
  jobs: BookingJob[];
  onRefreshJobs: () => void;
  theme: ThemeMode;
  isEmergencyModalOpen?: boolean;
  setIsEmergencyModalOpen?: (open: boolean) => void;
}

// Fallback SVG Generator for bulletproof image rendering under all network conditions
const getFallbackImage = (title: string) => {
  const t = (title || '').toLowerCase();
  let iconText = '🛠️';
  let categoryTheme = '#4c1d95';

  if (t.includes('mechanic') || t.includes('breakdown') || t.includes('auto')) {
    iconText = '🔧';
    categoryTheme = '#d97706';
  } else if (t.includes('car') || t.includes('wash') || t.includes('detailing')) {
    iconText = '🚗';
    categoryTheme = '#059669';
  } else if (t.includes('driver')) {
    iconText = '👨‍✈️';
    categoryTheme = '#2563eb';
  } else if (t.includes('electrician') || t.includes('wire') || t.includes('fuse')) {
    iconText = '⚡';
    categoryTheme = '#d97706';
  } else if (t.includes('plumber') || t.includes('leak') || t.includes('pipe')) {
    iconText = '🔧';
    categoryTheme = '#0284c7';
  } else if (t.includes('carpenter') || t.includes('wood') || t.includes('lock')) {
    iconText = '🔨';
    categoryTheme = '#b45309';
  } else if (t.includes('cctv') || t.includes('security') || t.includes('camera')) {
    iconText = '📹';
    categoryTheme = '#1d4ed8';
  } else if (t.includes('appliance') || t.includes('ac') || t.includes('chimney')) {
    iconText = '⚙️';
    categoryTheme = '#4f46e5';
  } else if (t.includes('cleaning') || t.includes('housekeeping')) {
    iconText = '✨';
    categoryTheme = '#0d9488';
  } else if (t.includes('pressure') || t.includes('interlock')) {
    iconText = '💦';
    categoryTheme = '#7c3aed';
  } else if (t.includes('nri') || t.includes('stewardship')) {
    iconText = '🏡';
    categoryTheme = '#334155';
  } else if (t.includes('salon') || t.includes('makeup')) {
    iconText = '✂️';
    categoryTheme = '#e11d48';
  } else if (t.includes('mobile') || t.includes('laptop')) {
    iconText = '📱';
    categoryTheme = '#2563eb';
  } else if (t.includes('water supply') || t.includes('tanker')) {
    iconText = '💧';
    categoryTheme = '#0284c7';
  }

  const safeTitle = (title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="url(#grad)"/>
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${categoryTheme};stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
      </linearGradient>
    </defs>
    <circle cx="300" cy="170" r="65" fill="rgba(255,255,255,0.12)"/>
    <text x="300" y="190" font-size="65" text-anchor="middle" dominant-baseline="middle">${iconText}</text>
    <text x="300" y="290" font-size="22" font-family="sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle">${safeTitle}</text>
    <text x="300" y="325" font-size="13" font-family="sans-serif" fill="#a78bfa" text-anchor="middle">Fixily Verified Service • Kerala</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const CustomerApp: React.FC<CustomerAppProps> = ({
  services,
  selectedLocation,
  jobs,
  onRefreshJobs,
  theme,
  isEmergencyModalOpen,
  setIsEmergencyModalOpen
}) => {
  const isDark = theme === 'dark';
  const [internalEmergencyOpen, setInternalEmergencyOpen] = useState<boolean>(false);
  const emergencyModalOpen = isEmergencyModalOpen !== undefined ? isEmergencyModalOpen : internalEmergencyOpen;
  const setEmergencyModalOpen = setIsEmergencyModalOpen || setInternalEmergencyOpen;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  // Booking Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('Mathew Thomas');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98950 12345');
  const [address, setAddress] = useState<string>(`Asset Homes Enclave, ${selectedLocation.name}`);
  const [scheduledTime, setScheduledTime] = useState<string>('Immediate (15-20 Mins)');
  const [vehicleDetails, setVehicleDetails] = useState<string>('Honda City (KL-07-CC-4091)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTrackJob, setActiveTrackJob] = useState<BookingJob | null>(null);

  // Friendly Category Clusters
  const categoryClusters = [
    { id: 'all', label: 'All Services', icon: '🌟' },
    { id: 'Mechanic & Roadside Assistance', label: 'Roadside Rescue', icon: '🚨', tag: '20m ETA' },
    { id: 'Vehicle Care', label: 'Vehicle Care', icon: '🚗' },
    { id: 'Driver', label: 'Acting Drivers', icon: '👨‍✈️', tag: 'Thuna PCC' },
    { id: 'Electrical Services', label: 'Electrician', icon: '⚡' },
    { id: 'Plumbing & Water Management', label: 'Plumbing', icon: '💧' },
    { id: 'Appliance Care & Servicing', label: 'Appliance & AC', icon: '❄️' },
    { id: 'Deep Cleaning & Housekeeping', label: 'Cleaning', icon: '✨' },
    { id: 'Carpenter & Locksmith', label: 'Carpenter', icon: '🔨' },
    { id: 'CCTV & Smart Security', label: 'CCTV Security', icon: '📹' },
    { id: 'NRI / Absentee Property Stewardship', label: 'NRI Property Care', icon: '🏡' },
    { id: 'Personal Grooming & At-Home Wellness', label: 'Salon & Spa', icon: '✂️' },
    { id: 'Rental Cars & Taxi Services', label: 'Rental & Taxi', icon: '🚕' },
    { id: 'Water Supply', label: 'Water Tanker', icon: '🚚' }
  ];

  // Filter Services by Category and Search Query
  const filteredServices = useMemo(() => {
    return services.filter(service => {
      // Category Filter
      const matchesCategory = selectedCategoryTab === 'all' || service.category === selectedCategoryTab;
      
      // Search Filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        service.title.toLowerCase().includes(q) ||
        service.category.toLowerCase().includes(q) ||
        (service.tagline && service.tagline.toLowerCase().includes(q)) ||
        (service.features && service.features.some(f => f.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategoryTab, searchQuery]);

  const handleStartBooking = (service: ServiceItem) => {
    setSelectedService(service);
    if (service.tiers && service.tiers.length > 0) {
      setSelectedTier(service.tiers[0].name);
    } else {
      setSelectedTier(service.tagline);
    }
    setBookingStep(1);
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    setIsSubmitting(true);
    try {
      await api.createBooking({
        serviceId: selectedService.id,
        tierName: selectedTier,
        customerName,
        customerPhone,
        microMarket: selectedLocation.name,
        address,
        scheduledTime,
        vehicleDetails,
        paymentMethod
      });
      setIsSubmitting(false);
      setSelectedService(null);
      onRefreshJobs();
      alert(`🎉 Booking Confirmed! Your dispatch is being assigned to the closest verified partner near ${selectedLocation.name}.`);
    } catch (err) {
      setIsSubmitting(false);
      alert('Booking failed. Please try again.');
    }
  };

  const myActiveJobs = jobs.filter(j => j.status !== 'CANCELLED');

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. Welcoming Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-lg transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border-slate-800 text-white'
          : 'bg-gradient-to-br from-white via-purple-50/40 to-amber-50/30 border-purple-100 text-slate-900 shadow-sm'
      }`}>
        <div className="relative z-10 max-w-3xl space-y-4">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span>⚡ Rapid 20-Min Doorstep Dispatch across {selectedLocation.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Reliable doorstep services & 20-minute roadside rescue.
          </h1>

          <p className={`text-sm sm:text-base font-medium max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Book verified mechanics, certified drivers, electricians, and trusted home care specialists in seconds.
          </p>

          {/* Interactive Search Bar */}
          <div className={`relative flex items-center rounded-2xl border p-1.5 shadow-md max-w-xl transition-all ${
            isDark
              ? 'bg-slate-950/90 border-slate-700/80 focus-within:border-purple-500 ring-purple-500/20'
              : 'bg-white border-slate-200 focus-within:border-purple-500 ring-purple-500/10'
          }`}>
            <Search className="w-5 h-5 text-purple-600 ml-3 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 'Mechanic', 'Car Wash', 'Driver', 'AC Service'..."
              className="w-full bg-transparent text-sm font-semibold focus:outline-none placeholder:text-slate-400 py-2"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1.5 mr-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {}}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm"
            >
              Search
            </button>
          </div>

          {/* Quick Trending Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400">Popular:</span>
            {[
              { label: '🚨 20m Mechanic', query: 'mechanic' },
              { label: '👨‍✈️ Thuna Driver', query: 'driver' },
              { label: '🚗 Foam Car Wash', query: 'car wash' },
              { label: '❄️ AC Cleaning', query: 'ac' },
              { label: '⚡ Electrician', query: 'electrician' }
            ].map(chip => (
              <button
                key={chip.label}
                onClick={() => setSearchQuery(chip.query)}
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all ${
                  searchQuery === chip.query
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-purple-50 hover:border-purple-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-tr from-purple-600/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3. Active Order Live Banner */}
      {myActiveJobs.length > 0 && (
        <div className={`rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border ${
          isDark
            ? 'bg-slate-900 border-purple-900/60 text-white'
            : 'bg-purple-900 text-white border-purple-800'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="bg-amber-400 text-slate-950 p-2.5 rounded-xl font-black shrink-0 shadow">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-300 font-extrabold">
                Active Order #{myActiveJobs[0].id}
              </div>
              <div className="font-bold text-sm text-white">
                {myActiveJobs[0].serviceTitle} — <span className="text-amber-300 font-extrabold">{myActiveJobs[0].status.replace('_', ' ')}</span>
              </div>
              <p className="text-[11px] text-purple-200">
                Partner dispatched to {myActiveJobs[0].location.address}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTrackJob(myActiveJobs[0])}
            className="w-full sm:w-auto bg-white text-purple-900 hover:bg-purple-50 px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1 shadow"
          >
            <span>Track on Live Radar</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Curated Category Cluster Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className={`text-lg sm:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Explore Service Categories
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {filteredServices.length} options ready
          </span>
        </div>

        {/* Horizontal Category Carousel */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {categoryClusters.map((cluster) => {
            const isSelected = selectedCategoryTab === cluster.id;
            return (
              <button
                key={cluster.id}
                onClick={() => setSelectedCategoryTab(cluster.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-600/30'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-purple-50/50'
                }`}
              >
                <span>{cluster.icon}</span>
                <span>{cluster.label}</span>
                {cluster.tag && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                  }`}>
                    {cluster.tag}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Service Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {selectedCategoryTab === 'all' ? 'All Verified Services' : selectedCategoryTab}
          </h3>
          {(selectedCategoryTab !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategoryTab('all');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-purple-600 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredServices.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
          }`}>
            <Wrench className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <h4 className="text-base font-bold">No services found for "{searchQuery}"</h4>
            <p className="text-xs mt-1">Try searching for 'Mechanic', 'Car Wash', 'Driver', or 'AC'.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryTab('all');
              }}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
            >
              Show All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => handleStartBooking(service)}
                className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                  isDark
                    ? 'bg-slate-900/90 border-slate-800/90 hover:border-purple-500/80 text-white shadow-md hover:-translate-y-1 hover:shadow-xl'
                    : 'bg-white border-slate-200/90 hover:border-purple-300 text-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Photo Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <img
                    src={service.imageUrl || getFallbackImage(service.title)}
                    onError={(e) => {
                      e.currentTarget.src = getFallbackImage(service.title);
                    }}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5">
                    {service.isInstant && (
                      <span className="bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center space-x-1 shadow">
                        <Zap className="w-3 h-3 fill-amber-300" />
                        <span>Instant</span>
                      </span>
                    )}
                  </div>

                  {/* Right Badges */}
                  <div className="absolute top-2.5 right-2.5">
                    {service.category === 'Mechanic & Roadside Assistance' ? (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                        ⚡ 20m Rescue
                      </span>
                    ) : service.category === 'Driver' ? (
                      <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Thuna PCC</span>
                      </span>
                    ) : (
                      <span className="bg-slate-950/70 backdrop-blur text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {service.eta}
                      </span>
                    )}
                  </div>

                  {/* Rating pill on image bottom */}
                  <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1.5 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded-lg text-[11px] font-bold text-white shadow">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{service.rating}</span>
                    <span className="text-slate-400 text-[10px]">({service.reviewsCount})</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className={`font-black text-sm leading-snug line-clamp-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {service.title}
                    </h4>

                    <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {service.tagline}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {service.tiers ? 'Starts at' : 'Flat Diagnostic'}
                      </span>
                      <span className="text-base font-black text-purple-600 dark:text-purple-400">
                        ₹{service.tiers ? service.tiers[0].price : service.basePrice || service.diagnosticFee || service.estPrice}
                      </span>
                    </div>

                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow transition-all duration-200 flex items-center space-x-1 group-hover:scale-105"
                    >
                      <span>Book</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Why Kochi Trusts Fixily (Trust & Assurance Section) */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-colors ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-extrabold text-purple-600 uppercase tracking-widest">
            Fixily Guarantee
          </span>
          <h3 className={`text-xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Why Customers Trust Fixily at Their Doorstep
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs">Kerala Police Thuna PCC</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Every driver and doorstep pro undergoes mandatory police criminal background clearance.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold mb-2.5">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs">20-Min Rapid Arrival</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Emergency roadside mechanics and technicians dispatched rapidly to your live location.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold mb-2.5">
              <Camera className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs">4-Angle Photo Inspection</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Complete photographic pre-inspection before working on your car or appliances.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold mb-2.5">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs">₹0 Hidden Charges</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Upfront pricing, transparent rates, and pay after completion via Cash or Instant UPI.
            </p>
          </div>
        </div>
      </div>

      {/* 7. 3-Step Checkout Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className={`p-5 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">
                  Step {bookingStep} of 3 • Fixily Booking
                </span>
                <h3 className="text-base font-black">{selectedService.title}</h3>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Step 1: Package Selection */}
              {bookingStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-slate-400">
                      Choose Service Package
                    </label>
                    {selectedService.tiers && selectedService.tiers.length > 0 ? (
                      <div className="space-y-2.5">
                        {selectedService.tiers.map((t) => (
                          <label
                            key={t.name}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                              selectedTier === t.name
                                ? 'border-purple-600 bg-purple-500/10 font-bold ring-2 ring-purple-500/20'
                                : isDark
                                ? 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-purple-200'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="tier"
                                checked={selectedTier === t.name}
                                onChange={() => setSelectedTier(t.name)}
                                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                              />
                              <div>
                                <span className="text-xs font-bold block">{t.name}</span>
                                <span className="text-[10px] text-slate-400">{t.duration || 'Full Service'}</span>
                              </div>
                            </div>
                            <div className="font-black text-sm text-purple-600 dark:text-purple-400">
                              ₹{t.price}
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-2xl border text-xs ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}>
                        <div className="font-bold text-sm">Standard Base Diagnostic</div>
                        <div className="text-xs text-slate-400 mt-1">{selectedService.tagline}</div>
                        <div className="font-black text-base text-purple-600 mt-2">
                          ₹{selectedService.basePrice || selectedService.diagnosticFee || 299}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-slate-400">
                      Vehicle or Appliance Details
                    </label>
                    <input
                      type="text"
                      value={vehicleDetails}
                      onChange={(e) => setVehicleDetails(e.target.value)}
                      placeholder="e.g. Honda City / Daikin 1.5T AC"
                      className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-purple-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Time & Address */}
              {bookingStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-slate-400">
                      Preferred Arrival Slot
                    </label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-purple-500 font-bold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="Immediate Emergency Dispatch (15-20 Mins)">⚡ Immediate Emergency Dispatch (15-20 Mins)</option>
                      <option value="Today Evening (4:00 PM - 6:00 PM)">Today Evening (4:00 PM - 6:00 PM)</option>
                      <option value="Tomorrow Morning (9:00 AM - 11:00 AM)">Tomorrow Morning (9:00 AM - 11:00 AM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-slate-400">
                      Service Address ({selectedLocation.name})
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-purple-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-slate-400">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-purple-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1.5 text-slate-400">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-purple-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Transparent Bill & Payment */}
              {bookingStep === 3 && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-2xl border space-y-2.5 text-xs ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex justify-between font-medium">
                      <span>Service Package ({selectedTier || selectedService.title})</span>
                      <span className="font-bold">
                        ₹{selectedService.tiers ? (selectedService.tiers.find(t => t.name === selectedTier)?.price || selectedService.tiers[0].price) : (selectedService.basePrice || selectedService.diagnosticFee || 299)}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Convenience & Safety Fee</span>
                      <span>₹35</span>
                    </div>

                    <div className="flex justify-between text-slate-400">
                      <span>Micro-Damage Transit Insurance</span>
                      <span>₹19</span>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 flex justify-between font-black text-sm">
                      <span>Total Payable</span>
                      <span className="text-purple-600 dark:text-purple-400">
                        ₹{(selectedService.tiers ? (selectedService.tiers.find(t => t.name === selectedTier)?.price || selectedService.tiers[0].price) : (selectedService.basePrice || selectedService.diagnosticFee || 299)) + 35 + 19}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-slate-400">
                      Payment Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`p-3 rounded-2xl border flex items-center space-x-2.5 cursor-pointer ${
                        paymentMethod === 'UPI' ? 'border-purple-600 bg-purple-500/10 font-bold' : 'border-slate-800'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'UPI'}
                          onChange={() => setPaymentMethod('UPI')}
                          className="text-purple-600"
                        />
                        <span className="text-xs">Pay via UPI / GPay</span>
                      </label>

                      <label className={`p-3 rounded-2xl border flex items-center space-x-2.5 cursor-pointer ${
                        paymentMethod === 'COD' ? 'border-purple-600 bg-purple-500/10 font-bold' : 'border-slate-800'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="text-purple-600"
                        />
                        <span className="text-xs">Pay After Service (Cash)</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer Controls */}
            <div className={`p-4 border-t flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {bookingStep > 1 ? (
                <button
                  onClick={() => setBookingStep(bookingStep - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Back
                </button>
              ) : <div />}

              {bookingStep < 3 ? (
                <button
                  onClick={() => setBookingStep(bookingStep + 1)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center space-x-1"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-xl"
                >
                  {isSubmitting ? 'Confirming Dispatch...' : 'Confirm & Request Partner'}
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 8. Live Radar Tracker Modal */}
      {activeTrackJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border max-h-[90vh] flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <div className="text-[10px] font-black text-purple-600 uppercase tracking-wider">
                  Live Dispatch Tracker • Order #{activeTrackJob.id}
                </div>
                <h3 className="text-base font-extrabold">{activeTrackJob.serviceTitle}</h3>
              </div>
              <button
                onClick={() => setActiveTrackJob(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{activeTrackJob.assignedPartnerName || 'Assigned Partner'}</h4>
                    <span className="text-[10px] text-emerald-500 font-extrabold flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Kerala Police Thuna PCC Verified</span>
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${activeTrackJob.assignedPartnerPhone || '+919847012345'}`}
                  className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              <LiveMap
                center={{ lat: activeTrackJob.location.lat, lng: activeTrackJob.location.lng }}
                zoom={14}
                markers={[
                  {
                    id: 'cust-1',
                    lat: activeTrackJob.location.lat,
                    lng: activeTrackJob.location.lng,
                    title: activeTrackJob.customerName,
                    subtitle: activeTrackJob.location.address,
                    type: 'customer'
                  },
                  {
                    id: 'partner-1',
                    lat: activeTrackJob.location.lat + 0.004,
                    lng: activeTrackJob.location.lng - 0.003,
                    title: activeTrackJob.assignedPartnerName || 'Technician / Mechanic',
                    subtitle: 'Verified Gig Partner',
                    type: 'partner'
                  }
                ]}
                height="240px"
              />
            </div>
          </div>
        </div>
      )}

      {/* 9. Standalone Emergency SOS Modal Fallback */}
      {isEmergencyModalOpen === undefined && (
        <EmergencyModal
          isOpen={emergencyModalOpen}
          onClose={() => setEmergencyModalOpen(false)}
          currentLocation={selectedLocation}
          theme={theme}
        />
      )}

    </div>
  );
};
