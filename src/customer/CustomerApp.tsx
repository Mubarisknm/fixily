import React, { useState } from 'react';
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
  Hammer
} from 'lucide-react';
import { ServiceItem, KochiLocation, BookingJob, ThemeMode } from '../types';
import { LiveMap } from '../components/LiveMap';
import { api } from '../services/api';

interface CustomerAppProps {
  services: ServiceItem[];
  selectedLocation: KochiLocation;
  jobs: BookingJob[];
  onRefreshJobs: () => void;
  theme: ThemeMode;
}

// 3D Animated Category Logo Component
const Category3DIcon: React.FC<{ id: string; isDark: boolean; isSelected: boolean }> = ({ id, isDark, isSelected }) => {
  switch (id) {
    case 'Mechanic & Roadside Assistance':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-red-500 text-slate-950 shadow-[0_4px_12px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-all duration-300">
          <Wrench className="w-4 h-4 fill-slate-950 group-hover:rotate-90 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 text-[9px] animate-bounce">⚡</span>
          <span className="absolute inset-0 rounded-xl bg-amber-400/20 animate-ping pointer-events-none" />
        </div>
      );

    case 'Vehicle Care':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 text-white shadow-[0_4px_12px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-all duration-300">
          <Car className="w-4 h-4 group-hover:animate-bounce" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-200 rounded-full animate-ping opacity-75" />
          <span className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-emerald-200 rounded-full animate-pulse" />
        </div>
      );

    case 'Driver':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 text-white shadow-[0_4px_12px_rgba(59,130,246,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          <UserCheck className="w-4 h-4 group-hover:scale-115 transition-transform" />
          <span className="absolute -bottom-1 w-5 h-1 bg-sky-300/60 rounded-full animate-pulse" />
        </div>
      );

    case 'Electrical Services':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 text-slate-950 shadow-[0_4px_12px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-all duration-300">
          <Zap className="w-4 h-4 fill-slate-950 animate-pulse" />
          <span className="absolute inset-0 rounded-xl bg-amber-400/30 animate-ping pointer-events-none" />
        </div>
      );

    case 'Plumbing & Water Management':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-400 text-white shadow-[0_4px_12px_rgba(6,182,212,0.4)] group-hover:scale-110 transition-all duration-300">
          <Wrench className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          <span className="absolute -top-1 right-0 text-[10px] animate-bounce">💧</span>
        </div>
      );

    case 'Carpenter & Locksmith':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-700 via-yellow-700 to-amber-500 text-white shadow-[0_4px_12px_rgba(180,83,9,0.5)] group-hover:scale-110 transition-all duration-300">
          <Hammer className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
        </div>
      );

    case 'CCTV & Smart Security':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-400 text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-all duration-300">
          <Camera className="w-4 h-4 group-hover:scale-120 transition-transform" />
          <span className="absolute inset-0 rounded-xl border border-cyan-300/40 animate-pulse" />
        </div>
      );

    case 'Appliance Care & Servicing':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-400 text-white shadow-[0_4px_12px_rgba(147,51,234,0.4)] group-hover:scale-110 transition-all duration-300">
          <Cpu className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
          <span className="absolute inset-0 rounded-xl border border-purple-300/40 animate-pulse" />
        </div>
      );

    case 'Deep Cleaning & Housekeeping':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 via-emerald-400 to-cyan-300 text-slate-950 shadow-[0_4px_12px_rgba(20,184,166,0.5)] group-hover:scale-110 transition-all duration-300">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span className="absolute -top-1 -right-1 text-[8px] animate-bounce">✨</span>
        </div>
      );

    case 'Outdoor & Property Maintenance':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-500 to-fuchsia-400 text-white shadow-[0_4px_12px_rgba(139,92,246,0.4)] group-hover:scale-110 transition-all duration-300">
          <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform" />
          <span className="absolute bottom-0 w-4 h-1 bg-fuchsia-300/60 rounded-full animate-ping" />
        </div>
      );

    case 'NRI / Absentee Property Stewardship':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900 text-amber-300 border border-amber-400/40 shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-all duration-300">
          <Building className="w-4 h-4 group-hover:scale-115 transition-transform" />
          <ShieldCheck className="w-3 h-3 text-amber-400 absolute -bottom-1 -right-1" />
        </div>
      );

    case 'Personal Grooming & At-Home Wellness':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-300 text-white shadow-[0_4px_12px_rgba(244,63,94,0.4)] group-hover:scale-110 transition-all duration-300">
          <Scissors className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 text-[8px] animate-pulse">💖</span>
        </div>
      );

    case 'Rental Cars & Taxi Services':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 text-emerald-400 border border-emerald-500/40 shadow-[0_4px_12px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-all duration-300">
          <Navigation className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="absolute bottom-0.5 w-4 h-0.5 bg-emerald-400 animate-pulse" />
        </div>
      );

    case 'Laptop and Mobile Phone Repair':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-all duration-300">
          <Smartphone className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="absolute inset-0 rounded-xl border border-cyan-200/50 animate-pulse" />
        </div>
      );

    case 'Water Supply':
      return (
        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 via-blue-500 to-cyan-300 text-white shadow-[0_4px_12px_rgba(14,165,233,0.5)] group-hover:scale-110 transition-all duration-300">
          <Droplet className="w-4 h-4 fill-sky-200 group-hover:animate-bounce" />
          <span className="absolute -bottom-1 w-5 h-1 bg-cyan-200/80 rounded-full animate-ping" />
        </div>
      );

    default:
      return (
        <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center">
          <Sparkles className="w-4 h-4" />
        </div>
      );
  }
};

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
  theme
}) => {
  const isDark = theme === 'dark';
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('Mathew Thomas');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98950 12345');
  const [address, setAddress] = useState<string>(`Villa 14, Asset Homes Enclave, ${selectedLocation.name}`);
  const [scheduledTime, setScheduledTime] = useState<string>('Today, 3:30 PM');
  const [vehicleDetails, setVehicleDetails] = useState<string>('Honda City (KL-07-CC-4091)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTrackJob, setActiveTrackJob] = useState<BookingJob | null>(null);
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

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
      alert('🎉 Booking Confirmed! Your dispatch is being assigned to the closest verified partner in Kochi.');
    } catch (err) {
      setIsSubmitting(false);
      alert('Booking failed. Please try again.');
    }
  };

  const myActiveJobs = jobs.filter(j => j.status !== 'CANCELLED');

  // Categories List including Mechanic & Security
  const categoriesList = [
    { id: 'Mechanic & Roadside Assistance', name: 'Mechanic', eta: '20m', special: 'Rescue' },
    { id: 'Vehicle Care', name: 'Car Wash', eta: '30m' },
    { id: 'Driver', name: 'Driver', eta: '25m', special: 'Thuna PCC' },
    { id: 'Electrical Services', name: 'Electrician', eta: '30m' },
    { id: 'Plumbing & Water Management', name: 'Plumber', eta: '35m' },
    { id: 'Carpenter & Locksmith', name: 'Carpenter', eta: '30m' },
    { id: 'CCTV & Smart Security', name: 'CCTV Security', eta: '35m' },
    { id: 'Appliance Care & Servicing', name: 'Appliances', eta: '45m' },
    { id: 'Deep Cleaning & Housekeeping', name: 'Deep Clean', eta: '60m' },
    { id: 'Outdoor & Property Maintenance', name: 'Property', eta: '45m' },
    { id: 'NRI / Absentee Property Stewardship', name: 'NRI Care', eta: 'Sched' },
    { id: 'Personal Grooming & At-Home Wellness', name: 'Salon & Spa', eta: '45m' },
    { id: 'Rental Cars & Taxi Services', name: 'Taxi Rental', eta: '20m' },
    { id: 'Laptop and Mobile Phone Repair', name: 'Device Repair', eta: '30m' },
    { id: 'Water Supply', name: 'Water Tanker', eta: '40m' }
  ];

  const filteredServices = services.filter(s => {
    if (selectedCategoryTab === 'all') return true;
    return s.category === selectedCategoryTab;
  });

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. Compact Hero Launcher Widget */}
      <div className={`rounded-2xl p-4 sm:p-5 border shadow-xl transition-colors duration-200 ${
        isDark ? 'bg-slate-900/90 border-slate-800/90 text-white' : 'bg-white border-slate-200/90 text-slate-900'
      }`}>
        <div className="space-y-3">
          
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center space-x-2">
              <span>Home services at your doorstep</span>
            </h1>
            <span className="text-[10px] font-extrabold text-purple-600 bg-purple-100 dark:bg-purple-950 dark:text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-300 dark:border-purple-800">
              📍 {selectedLocation.name}
            </span>
          </div>

          {/* 3D Category Launcher Grid with Mechanic & Security */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 pt-1">
            {categoriesList.map((cat) => {
              const isSelected = selectedCategoryTab === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.id === selectedCategoryTab ? 'all' : cat.id)}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-2xl border text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isSelected
                      ? 'border-purple-500 bg-purple-950/40 text-white font-black ring-2 ring-purple-500/40 shadow-[0_6px_20px_rgba(168,85,247,0.3)]'
                      : isDark
                      ? 'bg-slate-950/90 border-slate-800/80 text-white hover:border-purple-500/80 hover:bg-slate-900'
                      : 'bg-slate-50 border-slate-200/90 text-slate-900 hover:bg-white hover:border-purple-400'
                  }`}
                >
                  <span className="absolute -top-1.5 bg-purple-600 text-white text-[8px] font-black px-1.5 py-0 rounded-full shadow-md">
                    {cat.eta}
                  </span>

                  <div className="mb-1 mt-1">
                    <Category3DIcon id={cat.id} isDark={isDark} isSelected={isSelected} />
                  </div>
                  
                  <span className="text-[10px] font-black leading-tight truncate w-full">
                    {cat.name}
                  </span>
                  
                  {cat.special && (
                    <span className="text-[8px] font-black text-amber-400 bg-amber-950/90 border border-amber-500/40 px-1 rounded mt-0.5">
                      {cat.special}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Active Booking Banner */}
      {myActiveJobs.length > 0 && (
        <div className={`rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border ${
          isDark
            ? 'bg-slate-900 border-purple-900/60 text-white'
            : 'bg-purple-900 text-white border-purple-800'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="bg-amber-400 text-slate-950 p-2 rounded-xl font-black shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-amber-300 font-extrabold">
                Active Order ({myActiveJobs[0].id})
              </div>
              <div className="font-bold text-xs text-white">
                {myActiveJobs[0].serviceTitle} — <span className="text-amber-300 font-extrabold">{myActiveJobs[0].status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTrackJob(myActiveJobs[0])}
            className="w-full sm:w-auto bg-white text-purple-900 hover:bg-purple-50 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center space-x-1 shadow"
          >
            <span>Track</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Service Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {selectedCategoryTab === 'all' ? 'All Services & Mechanics' : selectedCategoryTab}
            </h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {filteredServices.length} verified options available
            </p>
          </div>

          {selectedCategoryTab !== 'all' && (
            <button
              onClick={() => setSelectedCategoryTab('all')}
              className="text-xs font-bold text-purple-600 hover:underline"
            >
              Clear Filter
            </button>
          )}
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onClick={() => handleStartBooking(service)}
              className={`group cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isDark
                  ? 'bg-slate-900/90 border-slate-800 hover:border-purple-500/80 text-white shadow-md hover:-translate-y-1'
                  : 'bg-white border-slate-200/90 hover:border-purple-300 text-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1'
              }`}
            >
              {/* Photo Header */}
              <div className="relative h-40 overflow-hidden bg-slate-900">
                <img
                  src={service.imageUrl || getFallbackImage(service.title)}
                  onError={(e) => {
                    e.currentTarget.src = getFallbackImage(service.title);
                  }}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {service.isInstant && (
                  <span className="absolute top-2.5 left-2.5 bg-slate-950/80 backdrop-blur text-amber-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center space-x-1 shadow">
                    <Zap className="w-2.5 h-2.5 fill-amber-300" />
                    <span>Instant</span>
                  </span>
                )}

                {service.category === 'Mechanic & Roadside Assistance' && (
                  <span className="absolute top-2.5 right-2.5 bg-amber-950/90 border border-amber-500 text-amber-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow">
                    ⚡ 20m Rescue
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`font-extrabold text-xs leading-snug ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {service.title}
                  </h3>

                  <div className="flex items-center space-x-2 text-[11px] font-semibold mt-1">
                    <span className="flex items-center text-amber-500 font-extrabold">
                      ★ {service.rating}
                    </span>
                    <span className={isDark ? 'text-slate-500' : 'text-slate-300'}>•</span>
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                      {service.eta}
                    </span>
                  </div>
                </div>

                {/* Price Readout */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-sm font-black">
                    ₹{service.tiers ? service.tiers[0].price : service.basePrice || service.diagnosticFee || service.estPrice}
                  </div>
                  
                  <span className="text-[11px] font-extrabold text-purple-600 group-hover:translate-x-1 transition-transform flex items-center">
                    Book <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3-Step Checkout Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600">
                  Step {bookingStep} of 3 • Fixily Booking
                </span>
                <h3 className="text-sm font-extrabold">{selectedService.title}</h3>
              </div>
              <button onClick={() => setSelectedService(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {bookingStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider">
                      Select Package / Option
                    </label>
                    {selectedService.tiers ? (
                      <div className="space-y-2">
                        {selectedService.tiers.map((t) => (
                          <label
                            key={t.name}
                            className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              selectedTier === t.name
                                ? 'border-purple-600 bg-purple-50/60 font-bold text-purple-950 ring-2 ring-purple-600/20'
                                : isDark ? 'border-slate-800 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="tier"
                                checked={selectedTier === t.name}
                                onChange={() => setSelectedTier(t.name)}
                                className="text-purple-600 focus:ring-purple-500"
                              />
                              <span>{t.name}</span>
                            </div>
                            <div className="font-extrabold text-purple-700">₹{t.price}</div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className={`p-3 rounded-xl border text-xs ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}>
                        Standard Base Diagnostic: <strong className="font-bold">₹{selectedService.basePrice || selectedService.diagnosticFee}</strong>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">
                      Location / Vehicle Trouble Address ({selectedLocation.name})
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-purple-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold mb-1">Arrival Slot</label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-purple-500 font-semibold ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      <option value="Immediate Emergency Dispatch (20 Mins)">Immediate Emergency Dispatch (20 Mins)</option>
                      <option value="Today, 3:30 PM">Today, 3:30 PM</option>
                    </select>
                  </div>
                </div>
              )}

              {bookingStep === 3 && (
                <div className="space-y-3">
                  <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="font-bold border-b pb-2 flex justify-between">
                      <span>Total Payable</span>
                      <span className="text-purple-600 font-extrabold">₹{(selectedService.diagnosticFee || 299) + 35 + (includeInsurance ? 19 : 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`px-5 py-3.5 border-t flex items-center justify-between ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              {bookingStep > 1 ? (
                <button onClick={() => setBookingStep(bookingStep - 1)} className="text-xs font-bold text-slate-400">
                  Back
                </button>
              ) : <div />}

              {bookingStep < 3 ? (
                <button
                  onClick={() => setBookingStep(bookingStep + 1)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Dispatch'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Live Tracker Modal */}
      {activeTrackJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border max-h-[90vh] flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-4 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <div className="text-[10px] font-black text-purple-600 uppercase tracking-wider">
                  Live Dispatch Radar • Order #{activeTrackJob.id}
                </div>
                <h3 className="text-sm font-extrabold">{activeTrackJob.serviceTitle}</h3>
              </div>
              <button onClick={() => setActiveTrackJob(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
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
                height="220px"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
