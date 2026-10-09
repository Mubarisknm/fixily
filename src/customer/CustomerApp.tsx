import React, { useState, useMemo, useEffect } from 'react';
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
  BadgeAlert,
  FileText,
  RotateCcw,
  Ban,
  Shield,
  HelpCircle,
  ExternalLink,
  Bell,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ServiceItem, KochiLocation, BookingJob, ThemeMode, GigPartner, AppLanguage, UserSession, UserRole } from '../types';
import { LiveMap } from '../components/LiveMap';
import { EmergencyModal } from '../components/EmergencyModal';
import { CancellationPolicyModal } from '../components/CancellationPolicyModal';
import { DisputeModal } from '../components/DisputeModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { useTranslation } from '../utils/translations';
import { api } from '../services/api';
import { sendPushNotification } from '../utils/pushNotifications';

interface CustomerAppProps {
  services: ServiceItem[];
  selectedLocation: KochiLocation;
  jobs: BookingJob[];
  partners?: GigPartner[];
  onRefreshJobs: () => void;
  theme: ThemeMode;
  isEmergencyModalOpen?: boolean;
  setIsEmergencyModalOpen?: (open: boolean) => void;
  language?: AppLanguage;
  onOpenCancellationPolicy?: () => void;
  onOpenDispute?: (job: BookingJob) => void;
  onOpenInvoice?: (job: BookingJob) => void;
  currentUser?: UserSession | null;
  onOpenAuthModal?: (role: UserRole) => void;
  onOpenLocationModal?: () => void;
  onOpenManageAddress?: () => void;
  onOpenNotificationSettings?: () => void;
}

interface HeroShowcaseSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
  imageUrl: string;
}

const HERO_SHOWCASE_SLIDES: HeroShowcaseSlide[] = [
  {
    id: 'hero-team-1',
    title: 'FYKZI.',
    subtitle: 'WE FIX, YOU RELAX',
    tagline: 'Kerala\'s most trusted 24/7 doorstep service & breakdown network',
    badge: '★ 4.9 Rated Service',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hero-team-2',
    title: 'EXPERT CARE.',
    subtitle: 'AT YOUR DOORSTEP',
    tagline: 'Verified mechanics, electricians, plumbers & AC technicians in 15-20 mins',
    badge: '🛡️ PCC Verified Pros',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hero-team-3',
    title: 'CAR SPA & MECHANIC.',
    subtitle: 'ONSITE RESCUE',
    tagline: 'High-pressure foam jet wash, ceramic detailing & battery jumpstart across Kerala',
    badge: '⚡ Instant Dispatch',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80'
  },
  {
    id: 'hero-team-4',
    title: 'ACTING DRIVER.',
    subtitle: 'SAFE & RELIABLE',
    tagline: 'Hire background-verified private chauffeurs for city & highway trips',
    badge: '👨‍✈️ 5-Star Drivers',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80'
  }
];

const EXPERTISE_CATEGORIES = [
  { id: 'all', label: 'All Services', icon: '🌟', actionClass: 'action-icon-star', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { id: 'Driver', label: 'Acting Driver', icon: '👨‍✈️', actionClass: 'action-icon-driver', color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20', badgeTitle: 'TOP RATED DRIVERS & CHAUFFEURS' },
  { id: 'Electrical Services', label: 'Electrician', icon: '⚡', actionClass: 'action-icon-electrician', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20', badgeTitle: 'TOP RATED ELECTRICIANS & WIRING PROS' },
  { id: 'Mechanic & Roadside Assistance', label: 'Mechanic', icon: '🔧', actionClass: 'action-icon-mechanic', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20', badgeTitle: 'TOP RATED MECHANICS & RESCUE PROS' },
  { id: 'Appliance Care & Servicing', label: 'AC Repair', icon: '❄️', actionClass: 'action-icon-ac', color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20', badgeTitle: 'TOP RATED AC & APPLIANCE TECHNICIANS' },
  { id: 'Plumbing & Water Management', label: 'Plumber', icon: '🚰', actionClass: 'action-icon-plumber', color: 'bg-sky-500/10 text-sky-500 border-sky-500/20', badgeTitle: 'TOP RATED PLUMBERS & PIPELINE EXPERTS' },
  { id: 'Vehicle Care', label: 'Car Spa', icon: '🚗', actionClass: 'action-icon-carspa', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20', badgeTitle: 'TOP RATED CAR SPA & DETAILING SPECIALISTS' },
  { id: 'Deep Cleaning & Housekeeping', label: 'Deep Clean', icon: '🧹', actionClass: 'action-icon-clean', color: 'bg-teal-500/10 text-teal-500 border-teal-500/20', badgeTitle: 'TOP RATED HOUSEKEEPING & DEEP CLEANERS' },
  { id: 'Carpenter & Locksmith', label: 'Carpenter', icon: '🔨', actionClass: 'action-icon-carpenter', color: 'bg-amber-600/10 text-amber-600 border-amber-600/20', badgeTitle: 'TOP RATED CARPENTERS & LOCKSMITHS' },
  { id: 'Other Services', label: 'Other Works', icon: '🛠️', actionClass: 'action-icon-tools', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20', badgeTitle: 'TOP RATED CUSTOM TRADE FREELANCERS' }
];

export const CustomerApp: React.FC<CustomerAppProps> = ({
  services,
  selectedLocation,
  jobs,
  partners = [],
  onRefreshJobs,
  theme,
  isEmergencyModalOpen,
  setIsEmergencyModalOpen,
  language = 'en',
  onOpenCancellationPolicy,
  onOpenDispute,
  onOpenInvoice,
  currentUser,
  onOpenAuthModal,
  onOpenLocationModal,
  onOpenManageAddress,
  onOpenNotificationSettings
}) => {
  const isDark = theme === 'dark';
  const { t } = useTranslation(language);

  const [internalEmergencyOpen, setInternalEmergencyOpen] = useState<boolean>(false);
  const emergencyModalOpen = isEmergencyModalOpen !== undefined ? isEmergencyModalOpen : internalEmergencyOpen;
  const setEmergencyModalOpen = setIsEmergencyModalOpen || setInternalEmergencyOpen;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [showScheduleDrawer, setShowScheduleDrawer] = useState<boolean>(false);

  // 3D Shuffling Hero Showcase State
  const [activeHeroSlide, setActiveHeroSlide] = useState<number>(0);
  const [isHeroAutoPlay, setIsHeroAutoPlay] = useState<boolean>(true);

  // Auto-shuffle hero slide every 4 seconds
  useEffect(() => {
    if (!isHeroAutoPlay) return;
    const timer = setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % HERO_SHOWCASE_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isHeroAutoPlay]);

  // Touch Swipe State for 3D Hero Carousel
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    setIsHeroAutoPlay(false);
    setTouchStartX(e.touches[0].clientX);
  };

  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (diff > 40) {
        // Swipe Left -> Next
        setActiveHeroSlide((prev) => (prev + 1) % HERO_SHOWCASE_SLIDES.length);
      } else if (diff < -40) {
        // Swipe Right -> Prev
        setActiveHeroSlide((prev) => (prev === 0 ? HERO_SHOWCASE_SLIDES.length - 1 : prev - 1));
      }
    }
    setTouchStartX(null);
    setTimeout(() => setIsHeroAutoPlay(true), 5000);
  };

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
  const [customerName, setCustomerName] = useState<string>(() => currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState<string>(() => currentUser?.phone || '');
  const [address, setAddress] = useState<string>(() => selectedLocation?.name ? `${selectedLocation.name}` : '');
  const [vehicleDetails, setVehicleDetails] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('COD');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedLocation?.name && !address) {
      setAddress(`${selectedLocation.name}`);
    }
  }, [selectedLocation]);

  // Rescheduling & Cancellation Modals
  const [reschedulingJob, setReschedulingJob] = useState<BookingJob | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [newRescheduleSlot, setNewRescheduleSlot] = useState<string>('Morning: 09:00 AM - 12:00 PM');
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);

  const [cancellingJob, setCancellingJob] = useState<BookingJob | null>(null);
  const [cancellationReasonInput, setCancellationReasonInput] = useState<string>('Change of plans');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Invoice & Dispute Modals
  const [activeInvoiceJob, setActiveInvoiceJob] = useState<BookingJob | null>(null);
  const [activeDisputeJob, setActiveDisputeJob] = useState<BookingJob | null>(null);

  // Dynamic time-based greeting
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return language === 'ml' ? 'സുപ്രഭാതം 🌅' : 'Good morning 🌅';
    }
    if (hour < 17) {
      return language === 'ml' ? 'ശുഭദിനം ☀️' : 'Good afternoon ☀️';
    }
    return language === 'ml' ? 'ശുഭസായാഹ്നം 🌆' : 'Good evening 🌆';
  }, [language]);

  // Display user name
  const displayUserName = useMemo(() => {
    if (currentUser?.name) return currentUser.name;
    return language === 'ml' ? 'സ്വാഗതം' : 'Welcome to Fykzi';
  }, [currentUser, language]);

  // User avatar initial
  const userAvatarInitial = useMemo(() => {
    if (currentUser?.name) return currentUser.name.charAt(0).toUpperCase();
    return 'F';
  }, [currentUser]);

  // Trade-specific helper to match and rank top technicians for any category / search query
  const getMatchedTechniciansForCategory = (category: string, query: string) => {
    if (!partners || partners.length === 0) return [];
    const q = (query || '').toLowerCase().trim();
    const cat = (category || '').toLowerCase().trim();

    return partners.filter((p) => {
      const role = (p.role || '').toLowerCase();
      const name = (p.name || '').toLowerCase();

      // If user typed a search query
      if (q) {
        if (name.includes(q) || role.includes(q)) return true;
        if (q.includes('driver') && (role.includes('driver') || role.includes('chauffeur'))) return true;
        if (q.includes('mechanic') && (role.includes('mechanic') || role.includes('breakdown'))) return true;
        if (q.includes('electric') && (role.includes('electric') || role.includes('wiring'))) return true;
        if (q.includes('plumb') && (role.includes('plumb') || role.includes('pipe'))) return true;
        if (q.includes('ac') && (role.includes('ac') || role.includes('appliance'))) return true;
        if (q.includes('clean') && (role.includes('clean') || role.includes('housekeep'))) return true;
      }

      // If category tab is selected
      if (cat === 'driver' || cat.includes('driver')) {
        return role.includes('driver') || role.includes('chauffeur');
      }
      if (cat.includes('mechanic') || cat.includes('roadside')) {
        return role.includes('mechanic') || role.includes('breakdown') || role.includes('auto');
      }
      if (cat.includes('electric')) {
        return role.includes('electrician') || role.includes('wiring') || role.includes('electrical');
      }
      if (cat.includes('plumb')) {
        return role.includes('plumber') || role.includes('pipeline') || role.includes('plumbing');
      }
      if (cat.includes('appliance') || cat.includes('ac')) {
        return role.includes('ac') || role.includes('appliance') || role.includes('technician');
      }
      if (cat.includes('vehicle') || cat.includes('car')) {
        return role.includes('car') || role.includes('detailing') || role.includes('wash') || role.includes('mechanic');
      }
      if (cat.includes('clean')) {
        return role.includes('clean') || role.includes('sanitiz') || role.includes('housekeep');
      }
      if (cat.includes('carpenter')) {
        return role.includes('carpenter') || role.includes('wood') || role.includes('lock');
      }
      if (cat.includes('other')) {
        return Boolean(p.customProfessions && p.customProfessions.length > 0) || role.includes('solar') || role.includes('garden') || role.includes('custom') || role.includes('freelance');
      }

      return false;
    }).sort((a, b) => {
      // Online first, then Top Rated Pro, then rating descending
      if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
      if (a.isTopRated !== b.isTopRated) return a.isTopRated ? -1 : 1;
      return (b.rating || 4.5) - (a.rating || 4.5);
    });
  };

  // Trade-specific Top Rated Technicians when a particular category is active or search query is present
  const activeTradeTechnicians = useMemo(() => {
    // When on 'all' with no search query, return empty so main grid is minimal!
    if (selectedCategoryTab === 'all' && !searchQuery.trim()) {
      return [];
    }
    return getMatchedTechniciansForCategory(selectedCategoryTab, searchQuery);
  }, [partners, selectedCategoryTab, searchQuery]);

  // Active Category Banner Title
  const activeCategoryBadgeTitle = useMemo(() => {
    const matched = EXPERTISE_CATEGORIES.find(c => c.id === selectedCategoryTab);
    if (matched && matched.badgeTitle) return matched.badgeTitle;
    if (searchQuery.trim()) {
      return `TOP RATED SPECIALISTS FOR "${searchQuery.toUpperCase()}"`;
    }
    return 'TOP RATED VERIFIED SPECIALISTS';
  }, [selectedCategoryTab, searchQuery]);

  // Filter Services by Category and Search Query
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (q) {
      return services.filter(service => {
        return (
          service.title.toLowerCase().includes(q) ||
          service.category.toLowerCase().includes(q) ||
          (service.tagline && service.tagline.toLowerCase().includes(q)) ||
          (service.features && service.features.some(f => f.toLowerCase().includes(q))) ||
          (service.createdByPartnerName && service.createdByPartnerName.toLowerCase().includes(q))
        );
      });
    }

    if (selectedCategoryTab === 'all') {
      return services.slice(0, 8);
    }

    if (selectedCategoryTab === 'Other Services') {
      return services.filter(
        s => s.category === 'Other Works' || s.category === 'Other Services' || Boolean(s.createdByPartnerId)
      );
    }

    return services.filter(s => s.category === selectedCategoryTab);
  }, [services, selectedCategoryTab, searchQuery]);

  // Matching technicians for the currently selected service (used inside Booking Modal)
  const serviceMatchingTechnicians = useMemo(() => {
    if (!selectedService) return [];
    return getMatchedTechniciansForCategory(selectedService.category, selectedService.title);
  }, [selectedService, partners]);

  const handleStartBooking = (service: ServiceItem) => {
    setSelectedService(service);
    setSelectedTier(service.tiers ? service.tiers[0].name : service.title);
    setBookingStep(1);
    // Auto-select the top-rated specialist if direct booking or default to nearest
    const matching = getMatchedTechniciansForCategory(service.category, service.title);
    if (matching.length > 0 && matching[0].isOnline) {
      setPreferredPartner(matching[0]);
    } else {
      setPreferredPartner(null);
    }
  };

  const handleStartDirectBooking = (partner: GigPartner, service?: ServiceItem) => {
    const matchedService = service || services.find(
      s => s.category.toLowerCase().includes(partner.role.toLowerCase().split(' ')[0]) ||
           s.title.toLowerCase().includes(partner.role.toLowerCase().split(' ')[0])
    ) || services[0];

    setSelectedService(matchedService);
    setSelectedTier(matchedService.tiers ? matchedService.tiers[0].name : matchedService.title);
    setPreferredPartner(partner);
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
      const partnerNotice = preferredPartner ? ` Assigned directly to top-rated pro ${preferredPartner.name} (★ ${preferredPartner.rating})!` : '';
      
      sendPushNotification(
        '🎉 Booking Confirmed - Fykzi',
        `Your ${selectedService.title} is scheduled for ${targetDate} (${finalSlot}). Technician dispatched shortly.`,
        { isOrderRelated: true }
      );

      setSelectedService(null);
      setPreferredPartner(null);
      onRefreshJobs();
      alert(`🎉 Booking Confirmed!${partnerNotice} Scheduled for ${targetDate} (${finalSlot}). The specialist will confirm availability immediately.`);
    } catch (err) {
      setIsSubmitting(false);
      alert('Booking failed. Please try again.');
    }
  };

  const myActiveJobs = jobs.filter(j => j.status !== 'CANCELLED');

  return (
    <div className="space-y-6 pb-24 w-full max-w-full overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. TOP MINIMAL GREETING & LOCATION HEADER (Matching Reference Style)       */}
      {/* ========================================================================= */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className={`text-xs font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {greetingText}
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
            {displayUserName}
          </h2>
          <button
            type="button"
            onClick={() => {
              if (onOpenManageAddress) {
                onOpenManageAddress();
              } else if (onOpenLocationModal) {
                onOpenLocationModal();
              }
            }}
            className="flex items-center space-x-1.5 mt-0.5 text-left cursor-pointer active:opacity-70 group"
            title="Tap to change Kerala address & location"
          >
            {selectedLocation.isLiveGps ? (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            ) : (
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400">
                CURRENT -
              </span>
            )}
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 truncate max-w-[200px] group-hover:underline">
              {selectedLocation.name.replace(/^Live:\s*/i, '').replace(/\s*Area$/i, '').split('(')[0].trim()}
            </span>
            <ChevronDown className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Notification Bell */}
          <button
            onClick={() => {
              if (onOpenNotificationSettings) {
                onOpenNotificationSettings();
              } else if (currentUser && myActiveJobs.length > 0) {
                const el = document.getElementById('active-orders-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              } else {
                alert('No new notifications right now.');
              }
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer relative ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
            title="Notifications & Settings"
          >
            <Bell className="w-4 h-4" />
            {myActiveJobs.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* User Initial Avatar Circle */}
          <div
            onClick={() => {
              if (!currentUser && onOpenAuthModal) {
                onOpenAuthModal('customer');
              }
            }}
            className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-105"
            title={currentUser ? currentUser.name : 'Click to Login'}
          >
            {userAvatarInitial}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MINIMAL PILL SEARCH BAR (Matching Reference Style)                      */}
      {/* ========================================================================= */}
      <div className={`relative flex items-center rounded-full border px-4 py-2.5 shadow-sm transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-white focus-within:border-blue-500 ring-1 ring-slate-800'
          : 'bg-white border-slate-200 text-slate-900 focus-within:border-blue-500 shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
      }`}>
        <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
        <input
          id="service-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder='Search "Driver", "Electrician", "Mechanic", "AC Repair"...'
          className="w-full bg-transparent text-xs sm:text-sm font-semibold focus:outline-none placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 text-slate-400 hover:text-white rounded-full mr-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => setShowScheduleDrawer(!showScheduleDrawer)}
          className={`p-1.5 rounded-full border transition-all cursor-pointer ${
            showScheduleDrawer
              ? 'bg-blue-600 text-white border-blue-600'
              : isDark ? 'border-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'
          }`}
          title="Schedule Time Slot"
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Optional Smooth Scheduling Bar Drawer */}
      {showScheduleDrawer && (
        <div className={`p-3.5 rounded-3xl border text-xs space-y-2.5 animate-in slide-in-from-top-2 duration-200 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-blue-50/70 border-blue-200'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center space-x-1.5 text-blue-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Custom Service Scheduling</span>
            </span>
            <button onClick={() => setShowScheduleDrawer(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Preferred Slot</label>
              <select
                value={targetTimeSlot}
                onChange={(e) => setTargetTimeSlot(e.target.value)}
                className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none ${
                  isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <option value="Immediate Emergency Dispatch (15-20 Mins)">⚡ Immediate (15-20 Mins Dispatch)</option>
                <option value="Morning: 09:00 AM - 12:00 PM">Morning: 09:00 AM - 12:00 PM</option>
                <option value="Afternoon: 01:00 PM - 04:00 PM">Afternoon: 01:00 PM - 04:00 PM</option>
                <option value="Evening: 05:00 PM - 08:00 PM">Evening: 05:00 PM - 08:00 PM</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HERO 3D POPPING & SHUFFLING SHOWCASE DECK ("FYKZI. WE FIX, YOU RELAX") */}
      {/* ========================================================================= */}
      <div
        className="relative pt-1 pb-2 hero-3d-stage select-none"
        onTouchStart={handleHeroTouchStart}
        onTouchEnd={handleHeroTouchEnd}
        onMouseEnter={() => setIsHeroAutoPlay(false)}
        onMouseLeave={() => setIsHeroAutoPlay(true)}
      >
        <div className="relative h-44 sm:h-52 md:h-60 overflow-visible flex items-center justify-center">
          {HERO_SHOWCASE_SLIDES.map((slide, idx) => {
            const total = HERO_SHOWCASE_SLIDES.length;
            let diff = idx - activeHeroSlide;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            const isCenter = diff === 0;
            const isRight = diff === 1;
            const isLeft = diff === -1;

            let transformStyle = '';
            let zIndex = 10;
            let opacity = 0;
            let pointerEvents = 'none';
            let filter = 'brightness(0.5)';
            let boxShadow = 'none';

            if (isCenter) {
              transformStyle = 'translateX(0%) scale(1) translateZ(35px) rotateY(0deg)';
              zIndex = 30;
              opacity = 1;
              pointerEvents = 'auto';
              filter = 'brightness(1)';
              boxShadow = '0 24px 45px -10px rgba(0,0,0,0.7), 0 0 25px rgba(37, 99, 235, 0.25)';
            } else if (isRight) {
              transformStyle = 'translateX(40%) scale(0.86) translateZ(-40px) rotateY(-20deg)';
              zIndex = 20;
              opacity = 0.65;
              pointerEvents = 'auto';
              filter = 'brightness(0.65) saturate(0.85)';
              boxShadow = '0 15px 30px -10px rgba(0,0,0,0.5)';
            } else if (isLeft) {
              transformStyle = 'translateX(-40%) scale(0.86) translateZ(-40px) rotateY(20deg)';
              zIndex = 20;
              opacity = 0.65;
              pointerEvents = 'auto';
              filter = 'brightness(0.65) saturate(0.85)';
              boxShadow = '0 15px 30px -10px rgba(0,0,0,0.5)';
            } else {
              transformStyle = diff > 0 
                ? 'translateX(65%) scale(0.7) translateZ(-100px) rotateY(-35deg)'
                : 'translateX(-65%) scale(0.7) translateZ(-100px) rotateY(35deg)';
              zIndex = 10;
              opacity = 0;
              pointerEvents = 'none';
            }

            return (
              <div
                key={slide.id}
                onClick={() => {
                  if (!isCenter) setActiveHeroSlide(idx);
                }}
                style={{
                  transform: transformStyle,
                  zIndex,
                  opacity,
                  filter,
                  boxShadow,
                  pointerEvents: pointerEvents as any
                }}
                className={`absolute w-[88%] sm:w-[82%] md:w-[78%] h-full rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-950 hero-3d-card-item cursor-pointer`}
              >
                <img
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="w-full h-full object-cover transform hover:scale-105 transition-all duration-700"
                />

                {/* Smooth Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/30 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3.5">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-md">
                    {slide.badge}
                  </span>
                </div>

                {/* Banner Content */}
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <div className="flex items-baseline space-x-2">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
                      {slide.title}
                    </h1>
                    <span className="text-xs sm:text-sm font-black text-blue-400 tracking-wider drop-shadow">
                      {slide.subtitle}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1 mt-0.5 drop-shadow">
                    {slide.tagline}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 3D Arrow Navigation Controls */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveHeroSlide((prev) => (prev === 0 ? HERO_SHOWCASE_SLIDES.length - 1 : prev - 1));
            }}
            className="absolute left-1 sm:left-3 z-40 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur shadow-lg border border-slate-800 transition-all cursor-pointer hover:scale-110 active:scale-95"
            title="Previous Card"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveHeroSlide((prev) => (prev + 1) % HERO_SHOWCASE_SLIDES.length);
            }}
            className="absolute right-1 sm:right-3 z-40 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-blue-600 text-white flex items-center justify-center backdrop-blur shadow-lg border border-slate-800 transition-all cursor-pointer hover:scale-110 active:scale-95"
            title="Next Card"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3D Carousel Deck Dots Indicator */}
        <div className="pt-2.5 flex items-center justify-center space-x-2">
          {HERO_SHOWCASE_SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveHeroSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === activeHeroSlide ? 'w-6 bg-blue-500 shadow-sm shadow-blue-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. "OUR EXPERTISE" CATEGORY GRID (Interactive 3D Spatial Hub)             */}
      {/* ========================================================================= */}
      <div id="our-expertise-section" className="space-y-3 pt-2 expertise-3d-perspective-container">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>OUR EXPERTISE</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            </h3>
          </div>
          <span className="text-[11px] font-bold text-slate-400">10 Verified Trades</span>
        </div>

        {/* 3D Animated Category Cards Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-2.5">
          {EXPERTISE_CATEGORIES.map((cat, idx) => {
            const isSelected = selectedCategoryTab === cat.id;
            const floatClass = idx % 3 === 0 ? 'animate-3d-float-1' : idx % 3 === 1 ? 'animate-3d-float-2' : 'animate-3d-float-3';

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategoryTab(cat.id);
                  setSearchQuery('');
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 cursor-pointer expertise-3d-card ${floatClass} ${
                  isSelected
                    ? 'expertise-3d-selected bg-gradient-to-b from-blue-600 to-blue-700 text-white border-blue-400 ring-2 ring-blue-400/40'
                    : isDark
                    ? 'bg-[#0F172A]/90 border-slate-800 text-slate-200 hover:border-blue-500/50 hover:bg-slate-850 shadow-md shadow-slate-950/50'
                    : 'bg-white border-slate-200/90 text-slate-700 hover:border-blue-300 hover:bg-blue-50/60 shadow-md shadow-slate-200/60'
                }`}
              >
                {/* 3D Elevated Emoji Icon Container */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xl sm:text-2xl expertise-3d-icon transition-transform ${
                    isSelected
                      ? 'bg-white/20 text-white shadow-inner'
                      : isDark
                      ? 'bg-slate-800/80 shadow-inner'
                      : 'bg-slate-100 shadow-sm'
                  }`}
                >
                  <span className={cat.actionClass}>{cat.icon}</span>
                </div>

                {/* 3D Elevated Label */}
                <span className={`text-[10px] sm:text-[11px] font-black truncate w-full expertise-3d-label ${
                  isSelected ? 'text-white' : ''
                }`}>
                  {cat.label}
                </span>

                {/* Subtle Active Indicator Beacon */}
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. PARTICULAR TRADE TOP-RATED TECHNICIANS ROW (e.g. Drivers shown first)  */}
      {/* ========================================================================= */}
      {activeTradeTechnicians.length > 0 && (
        <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Trade-Specific Pill Badge Header */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 shadow-sm">
              <span>• {activeCategoryBadgeTitle} •</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400">
              {activeTradeTechnicians.length} Top Rated in Area
            </span>
          </div>

          {/* Horizontal Slider of Top Rated Pros for THIS Selected Trade */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {activeTradeTechnicians.map((pro, index) => {
              const initial = pro.name.charAt(0).toUpperCase();
              const colors = [
                'bg-blue-600 text-white',
                'bg-indigo-600 text-white',
                'bg-emerald-600 text-white',
                'bg-teal-600 text-white',
                'bg-cyan-600 text-white'
              ];
              const avatarColor = colors[index % colors.length];

              return (
                <div
                  key={pro.id}
                  className={`w-44 sm:w-48 shrink-0 rounded-3xl p-4 border shadow-md flex flex-col justify-between transition-all card-3d-interactive ${
                    isDark
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-slate-800'
                      : 'bg-gradient-to-b from-slate-50 via-white to-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      {/* Pro Circle Initial */}
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-base shadow-md ${avatarColor}`}>
                        {initial}
                      </div>

                      <span className="bg-amber-400/20 text-amber-500 border border-amber-400/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{pro.rating}</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {pro.name}
                      </h4>
                      <span className="text-[11px] font-bold text-blue-500 dark:text-blue-400 block truncate lowercase">
                        {pro.role}
                      </span>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <span className={`w-1.5 h-1.5 rounded-full ${pro.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                      <span>{pro.isOnline ? 'Available Now' : 'Currently offline'}</span>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <button
                    onClick={() => handleStartDirectBooking(pro)}
                    className="mt-3 w-full py-2 rounded-xl text-[11px] font-black bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all cursor-pointer flex items-center justify-center space-x-1"
                  >
                    <span>⚡ Book {pro.name.split(' ')[0]}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. SERVICE CARDS LISTING FOR SELECTED EXPERTISE (Shown on Selection/Search)*/}
      {/* ========================================================================= */}
      {(selectedCategoryTab !== 'all' || searchQuery.trim() !== '') && (
        <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {searchQuery.trim() !== ''
                  ? `Search: "${searchQuery}"`
                  : `${selectedCategoryTab} Services`}
              </h4>
              <button
                onClick={() => {
                  setSelectedCategoryTab('all');
                  setSearchQuery('');
                }}
                className="text-[10px] font-bold text-slate-400 hover:text-white px-2.5 py-0.5 rounded-full border border-slate-700 bg-slate-800/60 cursor-pointer transition-colors"
              >
                ✕ View All
              </button>
            </div>
            <span className="text-xs font-bold text-slate-400">{filteredServices.length} Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`rounded-3xl border p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between card-3d-interactive ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block">
                      {service.category}
                    </span>
                    <h4 className="font-black text-sm sm:text-base leading-snug mt-0.5">{service.title}</h4>
                    {service.malayalamTitle && (
                      <p className="text-[11px] text-teal-500 font-bold">{service.malayalamTitle}</p>
                    )}
                  </div>
                  <span className="text-xl p-2 bg-slate-800/10 rounded-2xl shrink-0">
                    {service.icon === 'Wrench' ? '🔧' : service.icon === 'Droplet' ? '💧' : service.icon === 'ShieldCheck' ? '🛡️' : service.icon === 'Navigation' ? '👨‍✈️' : '⚡'}
                  </span>
                </div>

                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'} line-clamp-2`}>
                  {service.tagline}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Standard Rate</span>
                    <span className="font-black text-sm text-blue-600 dark:text-blue-400">
                      ₹{service.diagnosticFee || service.estPrice || (service.tiers ? service.tiers[0].price : 299)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-bold">ETA</span>
                    <span className="font-black text-slate-700 dark:text-slate-300">{service.eta || '20 mins'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartBooking(service)}
                className="mt-3 w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Book Service</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* ========================================================================= */}
      {/* 7. ACTIVE ORDERS & LIVE RADAR STATUS (When User is Logged In)             */}
      {/* ========================================================================= */}
      {currentUser && myActiveJobs.length > 0 && (
        <div id="active-orders-section" className="space-y-3 pt-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>My Active Orders ({myActiveJobs.length})</span>
          </h3>

          <div className="space-y-3">
            {myActiveJobs.map((job) => (
              <div
                key={job.id}
                className={`rounded-3xl p-5 border shadow-md space-y-3 ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">Order #{job.id}</span>
                    <h4 className="text-sm font-black text-white">{job.serviceTitle}</h4>
                    <p className="text-xs text-slate-400">Scheduled: {job.scheduledTime}</p>
                  </div>
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950">
                    {job.status.replace('_', ' ')}
                  </span>
                </div>

                {job.status === 'IN_PROGRESS' && (
                  <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold">4-Digit Completion OTP:</span>
                    <span className="text-lg font-mono font-black text-white tracking-widest">{job.completionOtp || '4921'}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. "HOW FYKZI WORKS" (4 Simple Steps Walkthrough)                          */}
      {/* ========================================================================= */}
      <div id="how-it-works-section" className={`rounded-3xl p-6 border shadow-sm space-y-4 ${
        isDark ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-black uppercase tracking-wider">How Fykzi Works</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { step: '1', title: 'Choose Service', desc: 'Select from 10+ essential trades or type custom works.' },
            { step: '2', title: 'Top Pro Matched', desc: 'Top-rated verified specialist in your area is assigned in 15 mins.' },
            { step: '3', title: '4-Angle Pre-Check', desc: 'Photos taken before starting ensure 100% zero dispute.' },
            { step: '4', title: '4-Digit OTP', desc: 'Pay and confirm completion only when fully satisfied.' }
          ].map((s) => (
            <div key={s.step} className="p-3 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-1">
              <span className="text-[10px] font-black w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                {s.step}
              </span>
              <h5 className="font-bold text-xs">{s.title}</h5>
              <p className="text-[11px] text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. BOOKING MODAL (With Top-Rated Specialist Selection)                    */}
      {/* ========================================================================= */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-3xl max-w-lg w-full border shadow-2xl overflow-hidden my-auto ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">Booking Service</span>
                <h3 className="text-base font-black">{selectedService.title}</h3>
              </div>
              <button onClick={() => setSelectedService(null)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              
              {/* Top Rated Specialist Picker in Checkout */}
              {serviceMatchingTechnicians.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-[10px] font-black uppercase text-slate-300">
                    Top Rated Specialists in your Area (Select Preferred Pro)
                  </label>
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setPreferredPartner(null)}
                      className={`p-2.5 rounded-2xl border text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        preferredPartner === null
                          ? 'bg-blue-600 text-white border-blue-600 shadow'
                          : isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      ⚡ Auto-Assign Nearest Pro
                    </button>
                    {serviceMatchingTechnicians.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPreferredPartner(p)}
                        className={`p-2.5 rounded-2xl border text-xs font-bold shrink-0 flex items-center space-x-2 transition-all cursor-pointer ${
                          preferredPartner?.id === p.id
                            ? 'bg-blue-600 text-white border-blue-600 shadow'
                            : isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                          {p.name.charAt(0)}
                        </div>
                        <span>{p.name.split(' ')[0]}</span>
                        <span className="text-amber-400">★ {p.rating}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border font-bold focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Doorstep Address *</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full p-2.5 rounded-xl border focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-950/20 border border-blue-800/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Pay After Service (Cash / UPI)</span>
                  <span className="font-black text-sm text-emerald-400">
                    ₹{selectedService.diagnosticFee || selectedService.estPrice || 299} (Flat Diagnostic)
                  </span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                  Zero Upfront Charge
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black shadow-lg cursor-pointer"
                >
                  {isSubmitting ? 'Confirming...' : 'Confirm Doorstep Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerApp;
