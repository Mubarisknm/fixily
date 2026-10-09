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
  ChevronDown,
  Package,
  CheckCircle,
  Layers,
  Inbox
} from 'lucide-react';
import {
  ServiceItem,
  KochiLocation,
  BookingJob,
  ThemeMode,
  GigPartner,
  AppLanguage,
  UserSession,
  UserRole,
  CustomerNavTab
} from '../types';
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
  customerNavTab?: CustomerNavTab;
  setCustomerNavTab?: (tab: CustomerNavTab) => void;
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
    tagline: "Kerala's most trusted 24/7 doorstep service & breakdown network",
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
  customerNavTab = 'home',
  setCustomerNavTab,
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
  const [ordersSubTab, setOrdersSubTab] = useState<'active' | 'completed'>('active');

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

  // Rescheduling & Cancellation State
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

  // Navigation helpers
  const navigateToServices = (categoryId?: string) => {
    if (categoryId) setSelectedCategoryTab(categoryId);
    if (setCustomerNavTab) {
      setCustomerNavTab('services');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToOrders = () => {
    if (setCustomerNavTab) {
      setCustomerNavTab('orders');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      if (cat === 'all') return true;
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

  // Trade-specific Top Rated Technicians when on Services page or filtering
  const activeTradeTechnicians = useMemo(() => {
    return getMatchedTechniciansForCategory(selectedCategoryTab, searchQuery);
  }, [partners, selectedCategoryTab, searchQuery]);

  // Active Category Banner Title
  const activeCategoryBadgeTitle = useMemo(() => {
    const matched = EXPERTISE_CATEGORIES.find(c => c.id === selectedCategoryTab);
    if (matched && matched.badgeTitle) return matched.badgeTitle;
    if (searchQuery.trim()) {
      return `TOP RATED SPECIALISTS FOR "${searchQuery.toUpperCase()}"`;
    }
    return 'TOP RATED VERIFIED SPECIALISTS IN KERALA';
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
      return services;
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
      if (setCustomerNavTab) {
        setCustomerNavTab('orders');
      }
    } catch (err) {
      setIsSubmitting(false);
      alert('Booking failed. Please try again.');
    }
  };

  const handleCancelBooking = async () => {
    if (!cancellingJob) return;
    setIsCancelling(true);
    try {
      await api.cancelJob(cancellingJob.id, cancellationReasonInput);
      setIsCancelling(false);
      setCancellingJob(null);
      onRefreshJobs();
      alert('✅ Booking cancelled successfully. No cancellation charges applied.');
    } catch (err) {
      setIsCancelling(false);
      alert('Failed to cancel booking. Please contact support.');
    }
  };

  const handleRescheduleBooking = async () => {
    if (!reschedulingJob) return;
    setIsRescheduling(true);
    try {
      await api.rescheduleJob(reschedulingJob.id, newRescheduleDate, newRescheduleSlot);
      setIsRescheduling(false);
      setReschedulingJob(null);
      onRefreshJobs();
      alert(`✅ Booking rescheduled to ${newRescheduleDate} (${newRescheduleSlot})!`);
    } catch (err) {
      setIsRescheduling(false);
      alert('Failed to reschedule. Please try again.');
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackJob) return;
    setIsSubmittingFeedback(true);
    try {
      await api.submitJobFeedback(feedbackJob.id, {
        rating: feedbackRating,
        comment: feedbackComment,
        serviceQualityRating: feedbackServiceQuality,
        punctualityRating: feedbackPunctuality,
        zeroDamageConfirmed: !feedbackDamageOccurred
      });
      setIsSubmittingFeedback(false);
      setFeedbackJob(null);
      onRefreshJobs();
      alert('⭐ Thank you for your review! Your rating helps maintain 5-star service quality.');
    } catch (err) {
      setIsSubmittingFeedback(false);
      setFeedbackJob(null);
      alert('Thank you for your feedback!');
    }
  };

  const myActiveJobs = useMemo(() => {
    return jobs.filter(j => j.status !== 'CANCELLED' && j.status !== 'COMPLETED');
  }, [jobs]);

  const myCompletedJobs = useMemo(() => {
    return jobs.filter(j => j.status === 'COMPLETED');
  }, [jobs]);

  return (
    <div className="space-y-6 pb-24 w-full max-w-full overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* COMMON TOP GREETING & LOCATION HEADER (Present across all views)           */}
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
            title="Tap to change address & location"
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
                navigateToOrders();
              } else {
                alert('No new notifications right now.');
              }
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all cursor-pointer relative ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
            }`}
            title="Notifications & Reminders"
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
      {/* VIEW 1: HOME PAGE (Minimal, 3D Deck, 10-Trade Hub, How it works, Safety)   */}
      {/* ========================================================================= */}
      {customerNavTab === 'home' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Search Bar - Quick jump to Services */}
          <div
            onClick={() => navigateToServices()}
            className={`relative flex items-center rounded-full border px-4 py-3 shadow-sm transition-all cursor-pointer group ${
              isDark
                ? 'bg-slate-900/90 border-slate-800 text-white hover:border-blue-500/70 ring-1 ring-slate-800'
                : 'bg-white border-slate-200 text-slate-900 hover:border-blue-400 shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
            }`}
          >
            <Search className="w-4 h-4 text-blue-500 mr-2.5 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-semibold text-slate-400 truncate flex-1">
              Search "Driver", "Electrician", "Mechanic", "AC Repair"...
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-500 border border-blue-500/20">
              Browse
            </span>
          </div>

          {/* 3D Popping & Shuffling Hero Showcase Deck */}
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
                      if (!isCenter) {
                        setActiveHeroSlide(idx);
                      } else {
                        navigateToServices();
                      }
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

          {/* "OUR EXPERTISE" CATEGORY GRID (Interactive 3D Spatial Hub) */}
          <div id="our-expertise-section" className="space-y-3 pt-2 expertise-3d-perspective-container">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>OUR EXPERTISE</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                </h3>
              </div>
              <button
                onClick={() => navigateToServices('all')}
                className="text-[11px] font-bold text-blue-500 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>View All Services</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 3D Animated Category Cards Grid */}
            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-2.5">
              {EXPERTISE_CATEGORIES.map((cat, idx) => {
                const floatClass = idx % 3 === 0 ? 'animate-3d-float-1' : idx % 3 === 1 ? 'animate-3d-float-2' : 'animate-3d-float-3';

                return (
                  <button
                    key={cat.id}
                    onClick={() => navigateToServices(cat.id)}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 cursor-pointer expertise-3d-card ${floatClass} ${
                      isDark
                        ? 'bg-[#0F172A]/90 border-slate-800 text-slate-200 hover:border-blue-500/50 hover:bg-slate-850 shadow-md shadow-slate-950/50'
                        : 'bg-white border-slate-200/90 text-slate-700 hover:border-blue-300 hover:bg-blue-50/60 shadow-md shadow-slate-200/60'
                    }`}
                  >
                    {/* 3D Elevated Emoji Icon Container */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center text-xl sm:text-2xl expertise-3d-icon transition-transform ${
                        isDark ? 'bg-slate-800/80 shadow-inner' : 'bg-slate-100 shadow-sm'
                      }`}
                    >
                      <span className={cat.actionClass}>{cat.icon}</span>
                    </div>

                    {/* 3D Elevated Label */}
                    <span className="text-[10px] sm:text-[11px] font-black truncate w-full expertise-3d-label">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Active Bookings Banner (If user has ongoing jobs) */}
          {myActiveJobs.length > 0 && (
            <div
              onClick={navigateToOrders}
              className="p-4 rounded-3xl bg-gradient-to-r from-blue-900/80 to-indigo-950/90 border border-blue-600/40 text-white shadow-lg cursor-pointer flex items-center justify-between group hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/40 border border-blue-400 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-300 animate-spin" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                      Active Order Live
                    </span>
                    <span className="text-xs font-bold text-slate-300">#{myActiveJobs[0].id}</span>
                  </div>
                  <h4 className="font-black text-sm mt-0.5">{myActiveJobs[0].serviceTitle}</h4>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-300 group-hover:text-white">
                <span>Track Order</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* "HOW FYKZI WORKS" (4 Simple Steps Walkthrough) */}
          <div id="how-it-works-section" className={`rounded-3xl p-6 border shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900/60 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-black uppercase tracking-wider">How Fykzi Works</h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">4-Step Guarantee</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { step: '1', title: 'Choose Service', desc: 'Select from 10+ essential trades or search custom works.' },
                { step: '2', title: 'Top Pro Matched', desc: 'Top-rated verified specialist in your area is assigned in 15 mins.' },
                { step: '3', title: '4-Angle Pre-Check', desc: 'Photos taken before starting ensure 100% zero dispute.' },
                { step: '4', title: '4-Digit OTP', desc: 'Pay and confirm completion only when fully satisfied.' }
              ].map((s) => (
                <div key={s.step} className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-black w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {s.step}
                  </span>
                  <h5 className="font-bold text-xs">{s.title}</h5>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Badges & Trust Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { icon: '🛡️', title: 'Police Verified', sub: 'PCC checked specialists' },
              { icon: '📸', title: '4-Angle Photos', sub: 'Zero dispute guarantee' },
              { icon: '🔐', title: '4-Digit OTP', sub: 'Pay after satisfaction' },
              { icon: '⚡', title: '15-20 Min ETA', sub: 'Emergency breakdown rescue' }
            ].map((b, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-2xl border text-center space-y-1 ${
                  isDark ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="text-xl">{b.icon}</div>
                <h5 className="text-xs font-black truncate">{b.title}</h5>
                <p className="text-[10px] text-slate-400 line-clamp-1">{b.sub}</p>
              </div>
            ))}
          </div>

          {/* Big CTA Banner to Explore All Services */}
          <div className={`p-6 rounded-3xl border text-center space-y-3 relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-950 border-slate-800 text-white'
              : 'bg-gradient-to-b from-blue-50 via-white to-blue-50/50 border-blue-200 text-slate-900'
          }`}>
            <div className="relative z-10 space-y-2">
              <h3 className="text-base sm:text-lg font-black">Ready to Book a Doorstep Specialist?</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Discover all 10+ trades, inspect top-rated specialists, and book in under 60 seconds with zero advance payment.
              </p>
              <button
                onClick={() => navigateToServices('all')}
                className="mt-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg inline-flex items-center space-x-2 transition-transform hover:scale-105 cursor-pointer"
              >
                <span>Explore All Services</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: SERVICES PAGE (Full Catalog, Top Specialists, Category Filter)    */}
      {/* ========================================================================= */}
      {customerNavTab === 'services' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Header Title */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-blue-500" />
                <span>Doorstep Services & Specialists</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Select category or book verified specialists directly
              </p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-blue-600/10 text-blue-500 border border-blue-500/20">
              {filteredServices.length} Services
            </span>
          </div>

          {/* Search Bar & Custom Scheduling Toggle */}
          <div className={`relative flex items-center rounded-full border px-4 py-2.5 shadow-sm transition-all ${
            isDark
              ? 'bg-slate-900/90 border-slate-800 text-white focus-within:border-blue-500 ring-1 ring-slate-800'
              : 'bg-white border-slate-200 text-slate-900 focus-within:border-blue-500 shadow-[0_2px_10px_rgba(0,0,0,0.04)]'
          }`}>
            <Search className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
            <input
              id="services-page-search"
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

          {/* Schedule Custom Drawer */}
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

          {/* 10-Trade Horizontal Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
            {EXPERTISE_CATEGORIES.map((cat) => {
              const isSelected = selectedCategoryTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryTab(cat.id);
                    setSearchQuery('');
                  }}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-black shrink-0 transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                      : isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-sm'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* TOP RATED TECHNICIANS ROW FOR SELECTED CATEGORY (e.g. Drivers first) */}
          {activeTradeTechnicians.length > 0 && (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 shadow-sm">
                  <span>• {activeCategoryBadgeTitle} •</span>
                </div>
                <span className="text-[11px] font-bold text-slate-400">
                  {activeTradeTechnicians.length} Top Rated Available
                </span>
              </div>

              {/* Horizontal Slider of Specialists */}
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

                        <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                          <span className={`w-1.5 h-1.5 rounded-full ${pro.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                          <span>{pro.isOnline ? 'Available Now' : 'Offline'}</span>
                        </div>
                      </div>

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

          {/* Full Grid of Service Cards */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Available Doorstep Services
              </h3>
              <span className="text-xs font-bold text-slate-400">{filteredServices.length} Options</span>
            </div>

            {filteredServices.length === 0 ? (
              <div className={`p-8 rounded-3xl border text-center space-y-3 ${
                isDark ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}>
                <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                <h4 className="font-black text-sm">No exact services found</h4>
                <p className="text-xs text-slate-400">Try searching for different keywords or view all services.</p>
                <button
                  onClick={() => {
                    setSelectedCategoryTab('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
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
            )}
          </div>

          {/* Custom Trade Quote Request */}
          <div className={`p-4 rounded-3xl border flex items-center justify-between ${
            isDark ? 'bg-slate-900/50 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <div className="space-y-0.5">
              <h4 className="font-black text-xs sm:text-sm">Need a Custom Work or Trade?</h4>
              <p className="text-[11px] text-slate-400">Request specialized freelance pros for solar, gardening, carpentry or custom repair.</p>
            </div>
            <button
              onClick={() => {
                const otherService = services.find(s => s.category === 'Other Works' || s.category === 'Other Services') || services[0];
                handleStartBooking(otherService);
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shrink-0 cursor-pointer hover:bg-blue-500"
            >
              Get Custom Quote
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: ORDERS PAGE (Live Radar, 4-Digit OTP, Pre-Photos, Invoices)       */}
      {/* ========================================================================= */}
      {customerNavTab === 'orders' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span>My Orders & Live Tracking</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time dispatch, 4-digit security OTP & tax invoices
              </p>
            </div>
          </div>

          {/* Subtabs Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setOrdersSubTab('active')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                ordersSubTab === 'active'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Active Bookings</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                ordersSubTab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {myActiveJobs.length}
              </span>
            </button>
            <button
              onClick={() => setOrdersSubTab('completed')}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                ordersSubTab === 'completed'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Completed & Invoices</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                ordersSubTab === 'completed' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {myCompletedJobs.length}
              </span>
            </button>
          </div>

          {/* SUBTAB 1: ACTIVE BOOKINGS */}
          {ordersSubTab === 'active' && (
            <div className="space-y-4">
              {myActiveJobs.length === 0 ? (
                <div className={`p-10 rounded-3xl border text-center space-y-3 ${
                  isDark ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <Package className="w-12 h-12 text-slate-500 mx-auto" />
                  <h4 className="font-black text-base">No Active Bookings</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    You don't have any ongoing doorstep service requests right now. Book an expert in 15-20 minutes.
                  </p>
                  <button
                    onClick={() => navigateToServices('all')}
                    className="mt-2 px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md inline-flex items-center space-x-1.5 cursor-pointer"
                  >
                    <span>Browse & Book Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                myActiveJobs.map((job) => {
                  const statusColors: Record<string, string> = {
                    PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    ASSIGNED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                    REACHED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                    IN_PROGRESS: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    COMPLETED: 'bg-emerald-500 text-slate-950'
                  };

                  return (
                    <div
                      key={job.id}
                      className={`rounded-3xl p-5 border shadow-lg space-y-4 transition-all ${
                        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      {/* Top Job Info */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30">
                              Order #{job.id}
                            </span>
                            <span className="text-xs text-slate-400">{job.scheduledTime}</span>
                          </div>
                          <h3 className="text-base font-black mt-1">{job.serviceTitle}</h3>
                          <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-red-500" />
                            <span className="truncate">{job.location.address}</span>
                          </p>
                        </div>
                        <span className={`text-xs font-black px-3 py-1 rounded-full border ${statusColors[job.status] || 'bg-slate-800 text-slate-300'}`}>
                          {job.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* 5-Stage Visual Progress Radar */}
                      <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                          <span>Live Progress Radar</span>
                          <span className="text-blue-400">
                            Step {job.status === 'PENDING' ? '1/4' : (job.status === 'ASSIGNED' || job.status === 'PROVIDER_ASSIGNED') ? '2/4' : (job.status === 'ON_THE_WAY' || job.status === 'PRE_INSPECTION_DONE') ? '3/4' : '4/4'}
                          </span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                          {[
                            { label: 'Requested', active: true },
                            { label: 'Assigned', active: job.status !== 'PENDING' },
                            { label: 'At Doorstep', active: job.status === 'ON_THE_WAY' || job.status === 'PRE_INSPECTION_DONE' || job.status === 'IN_PROGRESS' || job.status === 'COMPLETED' },
                            { label: 'In Progress', active: job.status === 'IN_PROGRESS' || job.status === 'COMPLETED' }
                          ].map((st, sIdx) => (
                            <div key={sIdx} className="space-y-1">
                              <div className={`h-1.5 rounded-full ${st.active ? 'bg-emerald-500 shadow-sm shadow-emerald-500' : 'bg-slate-800'}`} />
                              <span className={st.active ? 'text-white' : 'text-slate-500'}>{st.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 4-Digit Security OTP Banner */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/40 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-emerald-400 font-black uppercase tracking-wider block">
                            🔐 4-Digit Completion Security OTP
                          </span>
                          <p className="text-[11px] text-slate-300 mt-0.5">
                            Share with pro only when work is 100% completed
                          </p>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-mono font-black text-lg tracking-widest shadow">
                          {job.completionOtp || '4921'}
                        </div>
                      </div>

                      {/* Assigned Specialist Card */}
                      {job.assignedPartnerName && (
                        <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow">
                              {job.assignedPartnerName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs">{job.assignedPartnerName}</h4>
                              <span className="text-[10px] text-emerald-400 font-bold block">★ Verified Fykzi Specialist</span>
                            </div>
                          </div>
                          {job.assignedPartnerPhone && (
                            <a
                              href={`tel:${job.assignedPartnerPhone}`}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1 shadow"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Call Pro</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* 4-Angle Pre-Service Photos (If available) */}
                      {job.preServiceChecklist && job.preServiceChecklist.photos && job.preServiceChecklist.photos.length > 0 && (
                        <div className="space-y-2 pt-1 border-t border-slate-800">
                          <span className="text-[10px] font-black uppercase text-slate-400 flex items-center space-x-1">
                            <Camera className="w-3.5 h-3.5 text-blue-400" />
                            <span>Pre-Service 4-Angle Inspection Photos (Dispute Protection)</span>
                          </span>
                          <div className="grid grid-cols-4 gap-2">
                            {job.preServiceChecklist.photos.map((p, pIdx) => (
                              <div key={pIdx} className="rounded-xl overflow-hidden border border-slate-800 aspect-square bg-slate-950">
                                <img src={p.url} alt={`Pre-check ${p.angle}`} className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons (Reschedule / Cancel / Emergency) */}
                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={() => setReschedulingJob(job)}
                          className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          type="button"
                          onClick={() => setCancellingJob(job)}
                          className="flex-1 py-2 rounded-xl border border-red-900/60 bg-red-950/20 text-red-400 hover:bg-red-900/30 text-xs font-bold cursor-pointer"
                        >
                          Cancel Order
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmergencyModalOpen(true)}
                          className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-black flex items-center space-x-1 cursor-pointer"
                          title="SOS / Emergency"
                        >
                          <Siren className="w-3.5 h-3.5" />
                          <span>SOS</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* SUBTAB 2: COMPLETED ORDERS & INVOICES */}
          {ordersSubTab === 'completed' && (
            <div className="space-y-4">
              {myCompletedJobs.length === 0 ? (
                <div className={`p-10 rounded-3xl border text-center space-y-3 ${
                  isDark ? 'bg-slate-900/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <FileText className="w-12 h-12 text-slate-500 mx-auto" />
                  <h4 className="font-black text-base">No Completed Orders Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Your past completed bookings, digital tax invoices, and service receipts will appear here.
                  </p>
                </div>
              ) : (
                myCompletedJobs.map((job) => (
                  <div
                    key={job.id}
                    className={`rounded-3xl p-5 border shadow-md space-y-3 ${
                      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                          COMPLETED • #{job.id}
                        </span>
                        <h3 className="text-base font-black mt-0.5">{job.serviceTitle}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Completed on {job.scheduledTime}</p>
                      </div>
                      <span className="text-sm font-black text-emerald-400">
                        ₹{job.pricing?.totalPaid || 499}
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Serviced By</span>
                        <span className="font-bold">{job.assignedPartnerName || 'Verified Specialist'}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        100% Verified Work
                      </span>
                    </div>

                    {/* Completed Order Action Buttons */}
                    <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          if (onOpenInvoice) {
                            onOpenInvoice(job);
                          } else {
                            setActiveInvoiceJob(job);
                          }
                        }}
                        className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Download Invoice</span>
                      </button>

                      <button
                        onClick={() => setFeedbackJob(job)}
                        className="flex-1 py-2 rounded-xl border border-slate-700 hover:border-amber-400 text-amber-400 text-xs font-bold flex items-center justify-center space-x-1 cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Rate Service</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

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

      {/* ========================================================================= */}
      {/* 10. RESCHEDULE MODAL                                                      */}
      {/* ========================================================================= */}
      {reschedulingJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-5 border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="text-base font-black">Reschedule Service</h3>
              <button onClick={() => setReschedulingJob(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">New Target Date</label>
                <input
                  type="date"
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">New Time Slot</label>
                <select
                  value={newRescheduleSlot}
                  onChange={(e) => setNewRescheduleSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-bold"
                >
                  <option value="Morning: 09:00 AM - 12:00 PM">Morning: 09:00 AM - 12:00 PM</option>
                  <option value="Afternoon: 01:00 PM - 04:00 PM">Afternoon: 01:00 PM - 04:00 PM</option>
                  <option value="Evening: 05:00 PM - 08:00 PM">Evening: 05:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setReschedulingJob(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold"
              >
                Back
              </button>
              <button
                onClick={handleRescheduleBooking}
                disabled={isRescheduling}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black"
              >
                {isRescheduling ? 'Rescheduling...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. CANCELLATION MODAL                                                    */}
      {/* ========================================================================= */}
      {cancellingJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-5 border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="text-base font-black text-red-400">Cancel Booking #{cancellingJob.id}</h3>
              <button onClick={() => setCancellingJob(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-slate-300">Please let us know why you are cancelling this service:</p>
              <select
                value={cancellationReasonInput}
                onChange={(e) => setCancellationReasonInput(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-bold"
              >
                <option value="Change of plans">Change of plans</option>
                <option value="Booked by mistake">Booked by mistake</option>
                <option value="Found alternative solution">Found alternative solution</option>
                <option value="Technician delayed">Technician delayed</option>
                <option value="Other reasons">Other reasons</option>
              </select>
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-[11px]">
                🛡️ 100% Zero-Cancellation fee guarantee. No penalty will be applied.
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setCancellingJob(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. CUSTOMER FEEDBACK & RATING MODAL                                      */}
      {/* ========================================================================= */}
      {feedbackJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-5 border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b pb-3 border-slate-800">
              <h3 className="text-base font-black">Rate & Review Service</h3>
              <button onClick={() => setFeedbackJob(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="text-center space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Overall Experience</span>
                <div className="flex items-center justify-center space-x-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star className={`w-6 h-6 ${star <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Your Review / Comments</label>
                <textarea
                  rows={3}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Share your experience with the technician and service quality..."
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setFeedbackJob(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitFeedback}
                disabled={isSubmittingFeedback}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black"
              >
                {isSubmittingFeedback ? 'Submitting...' : 'Submit Rating'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {activeInvoiceJob && (
        <InvoiceModal
          isOpen={Boolean(activeInvoiceJob)}
          onClose={() => setActiveInvoiceJob(null)}
          job={activeInvoiceJob}
          theme={theme}
        />
      )}

    </div>
  );
};

export default CustomerApp;
