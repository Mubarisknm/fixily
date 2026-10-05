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
  Check,
  Calendar,
  MessageSquare,
  Award,
  ThumbsUp,
  BadgeAlert
} from 'lucide-react';
import { ServiceItem, KochiLocation, BookingJob, ThemeMode, GigPartner } from '../types';
import { LiveMap } from '../components/LiveMap';
import { EmergencyModal } from '../components/EmergencyModal';
import { api } from '../services/api';

interface CustomerAppProps {
  services: ServiceItem[];
  selectedLocation: KochiLocation;
  jobs: BookingJob[];
  partners?: GigPartner[];
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
  partners = [],
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

  // Scheduling Search State
  const [targetDate, setTargetDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [targetTimeSlot, setTargetTimeSlot] = useState<string>('Immediate Emergency Dispatch (15-20 Mins)');
  const [isCustomSlot, setIsCustomSlot] = useState<boolean>(false);
  const [customTimeInput, setCustomTimeInput] = useState<string>('02:00 PM - 04:00 PM');

  // Direct Partner Booking State
  const [preferredPartner, setPreferredPartner] = useState<GigPartner | null>(null);

  // Customer Feedback Modal State
  const [feedbackJob, setFeedbackJob] = useState<BookingJob | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackServiceQuality, setFeedbackServiceQuality] = useState<number>(5);
  const [feedbackPunctuality, setFeedbackPunctuality] = useState<number>(5);
  const [feedbackDamageOccurred, setFeedbackDamageOccurred] = useState<boolean>(false);
  const [feedbackDamageNotes, setFeedbackDamageNotes] = useState<string>('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState<boolean>(false);

  // Booking Modal State
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('Mathew Thomas');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98950 12345');
  const [address, setAddress] = useState<string>(`Asset Homes Enclave, ${selectedLocation.name}`);
  const [vehicleDetails, setVehicleDetails] = useState<string>('Honda City (KL-07-CC-4091)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('UPI');
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTrackJob, setActiveTrackJob] = useState<BookingJob | null>(null);

  // Top Verified Pros ranking: Online/Available first, then Top Rated Pro, then trust score
  const sortedPartners = useMemo(() => {
    if (!partners || partners.length === 0) return [];
    return [...partners].sort((a, b) => {
      if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
      if (a.isTopRated !== b.isTopRated) return a.isTopRated ? -1 : 1;
      const scoreA = (a.rating || 4.5) * 100 + (a.jobsCompleted || 0) * 5;
      const scoreB = (b.rating || 4.5) * 100 + (b.jobsCompleted || 0) * 5;
      return scoreB - scoreA;
    });
  }, [partners]);

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
      const matchesCategory = selectedCategoryTab === 'all' || service.category === selectedCategoryTab;
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
    setPreferredPartner(null);
    setSelectedService(service);
    if (service.tiers && service.tiers.length > 0) {
      setSelectedTier(service.tiers[0].name);
    } else {
      setSelectedTier(service.tagline);
    }
    setBookingStep(1);
  };

  const handleStartDirectBooking = (partner: GigPartner) => {
    setPreferredPartner(partner);
    const matchedService = services.find(s =>
      partner.role.toLowerCase().includes(s.title.toLowerCase()) ||
      s.title.toLowerCase().includes(partner.role.toLowerCase()) ||
      partner.role.toLowerCase().includes(s.category.toLowerCase())
    ) || services[0];

    setSelectedService(matchedService);
    if (matchedService.tiers && matchedService.tiers.length > 0) {
      setSelectedTier(matchedService.tiers[0].name);
    } else {
      setSelectedTier(matchedService.tagline);
    }
    if (partner.availableSlots && partner.availableSlots.length > 0) {
      setTargetTimeSlot(partner.availableSlots[0]);
    }
    setBookingStep(1);
  };

  const handleConfirmBooking = async () => {
    if (!selectedService) return;
    setIsSubmitting(true);
    const finalSlot = isCustomSlot ? customTimeInput : targetTimeSlot;
    try {
      await api.createBooking({
        serviceId: selectedService.id,
        tierName: selectedTier,
        customerName,
        customerPhone,
        microMarket: selectedLocation.name,
        address,
        scheduledTime: `${targetDate} • ${finalSlot}`,
        targetDate,
        targetTimeSlot: finalSlot,
        preferredPartnerId: preferredPartner?.id,
        preferredPartnerName: preferredPartner?.name,
        vehicleDetails,
        paymentMethod
      });
      setIsSubmitting(false);
      const partnerNotice = preferredPartner ? ` Assigned directly to ${preferredPartner.name}!` : '';
      setSelectedService(null);
      setPreferredPartner(null);
      onRefreshJobs();
      alert(`🎉 Booking Confirmed!${partnerNotice} Scheduled for ${targetDate} (${finalSlot}). The freelancer will review and confirm availability.`);
    } catch (err) {
      setIsSubmitting(false);
      alert('Booking failed. Please try again.');
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackJob) return;
    if (!feedbackComment.trim()) {
      alert('Please provide a brief review comment');
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      await api.submitJobFeedback(feedbackJob.id, {
        rating: feedbackRating,
        comment: feedbackComment.trim(),
        serviceQualityRating: feedbackServiceQuality,
        punctualityRating: feedbackPunctuality,
        zeroDamageConfirmed: !feedbackDamageOccurred
      });
      setIsSubmittingFeedback(false);
      setFeedbackJob(null);
      setFeedbackComment('');
      setFeedbackDamageOccurred(false);
      setFeedbackDamageNotes('');
      onRefreshJobs();
      alert('⭐ Thank you! Your verified feedback has been submitted. The freelancer rating and top listing have been updated.');
    } catch (err) {
      setIsSubmittingFeedback(false);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const myActiveJobs = jobs.filter(j => j.status !== 'CANCELLED');
  const completedJobsNeedingFeedback = jobs.filter(j => j.status === 'COMPLETED' && !j.customerFeedback);
  const completedJobsWithFeedback = jobs.filter(j => j.status === 'COMPLETED' && j.customerFeedback);

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

          {/* Scheduling Bar (Date & Custom Time Slots) */}
          <div className={`p-3.5 rounded-2xl border space-y-2.5 max-w-xl transition-all ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/90 border-purple-100 shadow-sm'
          }`}>
            <div className="flex items-center justify-between text-xs font-black">
              <span className="flex items-center space-x-1.5 text-purple-600 dark:text-purple-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Search with Scheduling & Custom Time Slots</span>
              </span>
              <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                Worker Confirms Availability
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Target Service Date
                </label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none focus:border-purple-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
                    className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition-colors shrink-0 ${
                      targetDate === new Date().toISOString().split('T')[0]
                        ? 'bg-purple-600 text-white border-purple-600'
                        : isDark ? 'border-slate-700 text-slate-300' : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    Today
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setTargetDate(tomorrow.toISOString().split('T')[0]);
                    }}
                    className="px-2 py-2 rounded-xl text-[10px] font-bold border transition-colors shrink-0 border-slate-200 dark:border-slate-700"
                  >
                    Tmrw
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={targetTimeSlot}
                  onChange={(e) => {
                    setTargetTimeSlot(e.target.value);
                    if (e.target.value === 'CUSTOM') {
                      setIsCustomSlot(true);
                    } else {
                      setIsCustomSlot(false);
                    }
                  }}
                  className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none focus:border-purple-500 ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Immediate Emergency Dispatch (15-20 Mins)">⚡ Immediate (15-20 Mins Dispatch)</option>
                  <option value="Morning: 09:00 AM - 12:00 PM">Morning: 09:00 AM - 12:00 PM</option>
                  <option value="Afternoon: 01:00 PM - 04:00 PM">Afternoon: 01:00 PM - 04:00 PM</option>
                  <option value="Evening: 05:00 PM - 08:00 PM">Evening: 05:00 PM - 08:00 PM</option>
                  <option value="Night: 08:00 PM - 10:00 PM">Night: 08:00 PM - 10:00 PM</option>
                  <option value="CUSTOM">Custom Time Slot...</option>
                </select>
              </div>
            </div>

            {isCustomSlot && (
              <div className="pt-1">
                <input
                  type="text"
                  value={customTimeInput}
                  onChange={(e) => setCustomTimeInput(e.target.value)}
                  placeholder="e.g. 03:30 PM - 05:30 PM or Specific Window"
                  className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none focus:border-purple-500 ${
                    isDark ? 'bg-slate-900 border-purple-500/50 text-white' : 'bg-white border-purple-400 text-slate-900'
                  }`}
                />
              </div>
            )}
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-tr from-purple-600/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Rate & Review Freelancer Prompt (Customer Feedback) */}
      {completedJobsNeedingFeedback.length > 0 && (
        <div className={`rounded-2xl p-4 sm:p-5 border shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-purple-950/40 border-amber-500/30 text-white'
            : 'bg-gradient-to-r from-amber-50 via-white to-purple-50 border-amber-200 text-slate-900'
        }`}>
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
              <Star className="w-6 h-6 fill-slate-950 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  Rate Completed Service
                </span>
                <span className="text-xs font-bold text-slate-400">Order #{completedJobsNeedingFeedback[0].id}</span>
              </div>
              <h4 className="font-black text-sm mt-0.5">
                How was your experience with {completedJobsNeedingFeedback[0].assignedPartnerName || 'the Freelancer'}?
              </h4>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Service: <strong>{completedJobsNeedingFeedback[0].serviceTitle}</strong>. Your feedback directly impacts worker trust score and top ranking!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setFeedbackJob(completedJobsNeedingFeedback[0]);
              setFeedbackRating(5);
              setFeedbackComment('');
              setFeedbackDamageOccurred(false);
            }}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 shrink-0 hover:scale-105 cursor-pointer"
          >
            <Star className="w-4 h-4 fill-slate-950" />
            <span>Add Feedback & Review</span>
          </button>
        </div>
      )}

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

      {/* 🌟 Top Verified Freelancers & Specialists (Ranked by Trust & Experience) */}
      {sortedPartners.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className={`text-lg sm:text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  🌟 Top Verified Freelancers & Pros
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-600 text-white">
                  Ranked by Trust & Experience
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Top performers earn higher hourly rates. Available pros listed first with verified Kerala Police Thuna PCC and damage liability.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {sortedPartners.filter(p => p.isOnline).length} Available Online Now
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedPartners.map((partner) => (
              <div
                key={partner.id}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                  partner.isTopRated
                    ? isDark
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950/30 border-amber-500/40 shadow-lg shadow-purple-950/20'
                      : 'bg-white border-amber-300 shadow-md ring-1 ring-amber-400/20'
                    : isDark
                    ? 'bg-slate-900/90 border-slate-800 hover:border-purple-500/50'
                    : 'bg-white border-slate-200 hover:border-purple-300 shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  {/* Partner Header */}
                  <div className="flex items-start space-x-3">
                    <div className="relative shrink-0">
                      <img
                        src={partner.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={partner.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-500/40 shadow"
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                          isDark ? 'border-slate-900' : 'border-white'
                        } ${partner.isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`}
                        title={partner.isOnline ? 'Online & Available' : 'Offline'}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                        <h4 className="font-black text-sm truncate">{partner.name}</h4>
                        {partner.isTopRated && (
                          <span className="inline-flex items-center space-x-0.5 text-[9px] font-black uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-1.5 py-0.2 rounded-md shadow">
                            <Star className="w-2.5 h-2.5 fill-slate-950" />
                            <span>Top Pro</span>
                          </span>
                        )}
                      </div>

                      <p className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                        {partner.role}
                      </p>

                      <div className="flex items-center space-x-2 mt-1">
                        <span className="flex items-center space-x-1 text-xs font-black text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{partner.rating}</span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({partner.reviewsCount || partner.reviews?.length || 0} reviews • {partner.jobsCompleted} jobs)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hourly Rate & Multiplier Tag */}
                  <div className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                    partner.isTopRated
                      ? isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
                      : isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <span className="text-[11px] font-bold">Earnings Rate:</span>
                    <span className="font-black">
                      ₹{Math.round(350 * (partner.hourlyRateMultiplier || 1.0))}/hr
                      <span className="text-[10px] font-normal ml-1 text-slate-400">
                        ({(partner.hourlyRateMultiplier || 1.0).toFixed(2)}x tier)
                      </span>
                    </span>
                  </div>

                  {/* Trust & Damage Liability Badges */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center space-x-1.5 text-[10.5px] text-emerald-500 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Kerala Police Thuna PCC Verified</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-[10.5px] text-blue-500 dark:text-blue-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">100% Damage Responsibility Agreed</span>
                    </div>
                  </div>

                  {/* Available Time Slots */}
                  {partner.availableSlots && partner.availableSlots.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">
                        Open Slots:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {partner.availableSlots.slice(0, 2).map((slot, idx) => (
                          <span
                            key={idx}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border ${
                              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                            }`}
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Customer Review Snippet */}
                  {partner.reviews && partner.reviews.length > 0 && (
                    <div className={`p-2 rounded-xl text-[10.5px] italic border ${
                      isDark ? 'bg-slate-950/70 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      "{partner.reviews[0].comment.slice(0, 65)}..."
                      <span className="block not-italic font-bold text-[9px] mt-0.5 text-slate-400">
                        — {partner.reviews[0].customerName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Direct Booking Button */}
                <button
                  type="button"
                  onClick={() => handleStartDirectBooking(partner)}
                  className={`mt-4 w-full py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-md ${
                    partner.isOnline
                      ? 'bg-purple-600 hover:bg-purple-500 text-white hover:scale-[1.02]'
                      : isDark
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{partner.isOnline ? 'Book This Worker Directly' : 'Schedule with Worker'}</span>
                </button>
              </div>
            ))}
          </div>
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

              {/* Step 2: Time & Address with Freelancer Availability */}
              {bookingStep === 2 && (
                <div className="space-y-4">
                  {/* Direct Worker Booking Banner if selected */}
                  {preferredPartner && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-amber-500/10 to-purple-500/10 border border-purple-500/30 flex items-center space-x-3">
                      <img
                        src={preferredPartner.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={preferredPartner.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-purple-500/50 shadow shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 bg-purple-500/20 px-2 py-0.2 rounded-full">
                            Direct Pro Booking
                          </span>
                          {preferredPartner.isTopRated && (
                            <span className="text-[9px] font-black uppercase bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded">
                              ⭐ Top Pro
                            </span>
                          )}
                        </div>
                        <h4 className="font-black text-xs text-white truncate mt-0.5">{preferredPartner.name}</h4>
                        <div className="text-[11px] text-slate-300 flex items-center space-x-2">
                          <span className="text-amber-400 font-bold">{preferredPartner.rating} ★</span>
                          <span>• {preferredPartner.role}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Scheduled Date and Customized Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1 text-slate-400">
                        Target Service Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                        className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-purple-500 font-bold ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1 text-slate-400">
                        {preferredPartner ? `${preferredPartner.name.split(' ')[0]}'s Available Slot *` : 'Preferred Time Slot *'}
                      </label>
                      {preferredPartner && preferredPartner.availableSlots && preferredPartner.availableSlots.length > 0 ? (
                        <select
                          value={targetTimeSlot}
                          onChange={(e) => {
                            setTargetTimeSlot(e.target.value);
                            setIsCustomSlot(e.target.value === 'CUSTOM');
                          }}
                          className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-purple-500 font-bold ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        >
                          {preferredPartner.availableSlots.map((slot, i) => (
                            <option key={i} value={slot}>{slot}</option>
                          ))}
                          <option value="CUSTOM">Custom Slot Window...</option>
                        </select>
                      ) : (
                        <select
                          value={targetTimeSlot}
                          onChange={(e) => {
                            setTargetTimeSlot(e.target.value);
                            setIsCustomSlot(e.target.value === 'CUSTOM');
                          }}
                          className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-purple-500 font-bold ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        >
                          <option value="Immediate Emergency Dispatch (15-20 Mins)">⚡ Immediate Emergency Dispatch (15-20 Mins)</option>
                          <option value="Morning: 09:00 AM - 12:00 PM">Morning: 09:00 AM - 12:00 PM</option>
                          <option value="Afternoon: 01:00 PM - 04:00 PM">Afternoon: 01:00 PM - 04:00 PM</option>
                          <option value="Evening: 05:00 PM - 08:00 PM">Evening: 05:00 PM - 08:00 PM</option>
                          <option value="Night: 08:00 PM - 10:00 PM">Night: 08:00 PM - 10:00 PM</option>
                          <option value="CUSTOM">Custom Time Slot...</option>
                        </select>
                      )}
                    </div>
                  </div>

                  {isCustomSlot && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        Type Your Customized Time Window:
                      </label>
                      <input
                        type="text"
                        value={customTimeInput}
                        onChange={(e) => setCustomTimeInput(e.target.value)}
                        placeholder="e.g. 03:00 PM - 04:30 PM"
                        className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-purple-500 font-bold ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  )}

                  <div className={`p-2.5 rounded-xl border text-[11px] flex items-center space-x-2 ${
                    isDark ? 'bg-blue-950/20 border-blue-900/40 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-900'
                  }`}>
                    <ShieldCheck className="w-4 h-4 shrink-0 text-blue-400" />
                    <span>
                      <strong>Damage Guarantee:</strong> The freelancer assumes 100% damage responsibility and legal liability for product/premises care.
                    </span>
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

      {/* 8.5. Customer Feedback & Rating Modal */}
      {feedbackJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border my-auto flex flex-col ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 p-5 text-slate-950 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/20 px-2.5 py-0.5 rounded-full">
                  Verified Service Review
                </span>
                <h3 className="text-lg font-black mt-1">Rate Your Freelancer</h3>
                <p className="text-xs text-slate-900 font-medium">
                  Order #{feedbackJob.id} • {feedbackJob.serviceTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackJob(null)}
                className="text-slate-950/80 hover:text-slate-950 p-1.5 rounded-full hover:bg-slate-950/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitFeedback} className="p-5 sm:p-6 space-y-4">
              {/* Partner Banner */}
              <div className={`p-3.5 rounded-2xl border flex items-center space-x-3 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black">{feedbackJob.assignedPartnerName || 'Assigned Partner'}</h4>
                  <p className="text-[11px] text-slate-400">
                    Trusted pro performance impacts their earnings tier & top ranking.
                  </p>
                </div>
              </div>

              {/* 5-Star Rating Selector */}
              <div className="text-center py-2 space-y-2">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400">
                  Overall Rating *
                </label>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= feedbackRating
                            ? 'fill-amber-400 text-amber-400'
                            : isDark ? 'text-slate-700' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="text-xs font-black text-amber-500">
                  {feedbackRating === 5 && '⭐⭐⭐⭐⭐ 5.0 - Exceptional & Highly Recommended'}
                  {feedbackRating === 4 && '⭐⭐⭐⭐ 4.0 - Very Good & Reliable'}
                  {feedbackRating === 3 && '⭐⭐⭐ 3.0 - Satisfactory Service'}
                  {feedbackRating === 2 && '⭐⭐ 2.0 - Below Expectations'}
                  {feedbackRating === 1 && '⭐ 1.0 - Poor Workmanship'}
                </div>
              </div>

              {/* Quality & Punctuality Quick Chips */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Service Quality
                  </label>
                  <select
                    value={feedbackServiceQuality}
                    onChange={(e) => setFeedbackServiceQuality(Number(e.target.value))}
                    className={`w-full p-2 rounded-xl text-xs font-bold border focus:outline-none focus:border-amber-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value={5}>5 ★ - Flawless Quality</option>
                    <option value={4}>4 ★ - Good Quality</option>
                    <option value={3}>3 ★ - Average</option>
                    <option value={2}>2 ★ - Minor Issues</option>
                    <option value={1}>1 ★ - Unsatisfactory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                    Arrival & Punctuality
                  </label>
                  <select
                    value={feedbackPunctuality}
                    onChange={(e) => setFeedbackPunctuality(Number(e.target.value))}
                    className={`w-full p-2 rounded-xl text-xs font-bold border focus:outline-none focus:border-amber-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value={5}>5 ★ - Prompt & On-Time</option>
                    <option value={4}>4 ★ - Slight Delay (Under 10m)</option>
                    <option value={3}>3 ★ - Moderate Delay</option>
                    <option value={2}>2 ★ - Late Arrival</option>
                    <option value={1}>1 ★ - Very Late</option>
                  </select>
                </div>
              </div>

              {/* Written Review */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1.5">
                  Detailed Feedback / Review *
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share details about the freelancer's attitude, tool cleanliness, and speed..."
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-medium ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Product / Property Damage Check */}
              <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                feedbackDamageOccurred
                  ? 'border-red-500/50 bg-red-500/5'
                  : isDark ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-emerald-200 bg-emerald-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className={`w-4 h-4 ${feedbackDamageOccurred ? 'text-red-500' : 'text-emerald-500'}`} />
                    <span className="text-xs font-black">
                      Did any property or product damage occur?
                    </span>
                  </div>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    feedbackDamageOccurred ? 'bg-red-500 text-white' : 'bg-emerald-500 text-slate-950'
                  }`}>
                    {feedbackDamageOccurred ? 'Damage Reported' : 'Zero Damage Verified'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedbackDamageOccurred(false)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      !feedbackDamageOccurred
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    ✓ No Damage (Safe Work)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFeedbackDamageOccurred(true)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      feedbackDamageOccurred
                        ? 'bg-red-500 text-white border-red-500 shadow-sm'
                        : isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    ⚠️ Report Damage
                  </button>
                </div>

                {feedbackDamageOccurred && (
                  <div className="pt-2">
                    <label className="block text-[10px] font-black uppercase text-red-400 mb-1">
                      Describe Damage for Freelancer Responsibility Settlement:
                    </label>
                    <textarea
                      rows={2}
                      value={feedbackDamageNotes}
                      onChange={(e) => setFeedbackDamageNotes(e.target.value)}
                      placeholder="Specify damaged component, appliance, scratch, or leak..."
                      className={`w-full text-xs p-2.5 rounded-xl border border-red-500/50 focus:outline-none focus:ring-1 focus:ring-red-500 ${
                        isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
                      }`}
                    />
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setFeedbackJob(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black shadow-lg transition-transform hover:scale-105 disabled:opacity-50 flex items-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmittingFeedback ? 'Submitting Review...' : 'Publish Feedback'}</span>
                </button>
              </div>
            </form>
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
