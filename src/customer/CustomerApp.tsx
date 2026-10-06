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
  BadgeAlert,
  FileText,
  RotateCcw,
  Ban,
  Shield,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { ServiceItem, KochiLocation, BookingJob, ThemeMode, GigPartner, AppLanguage } from '../types';
import { LiveMap } from '../components/LiveMap';
import { EmergencyModal } from '../components/EmergencyModal';
import { CancellationPolicyModal } from '../components/CancellationPolicyModal';
import { DisputeModal } from '../components/DisputeModal';
import { InvoiceModal } from '../components/InvoiceModal';
import { useTranslation } from '../utils/translations';
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
  language?: AppLanguage;
  onOpenCancellationPolicy?: () => void;
  onOpenDispute?: (job: BookingJob) => void;
  onOpenInvoice?: (job: BookingJob) => void;
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
    <text x="300" y="325" font-size="13" font-family="sans-serif" fill="#a78bfa" text-anchor="middle">Fykso Verified Service • Kerala</text>
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
  setIsEmergencyModalOpen,
  language = 'en',
  onOpenCancellationPolicy,
  onOpenDispute,
  onOpenInvoice
}) => {
  const isDark = theme === 'dark';
  const { t } = useTranslation(language);

  const [internalEmergencyOpen, setInternalEmergencyOpen] = useState<boolean>(false);
  const emergencyModalOpen = isEmergencyModalOpen !== undefined ? isEmergencyModalOpen : internalEmergencyOpen;
  const setEmergencyModalOpen = setIsEmergencyModalOpen || setInternalEmergencyOpen;

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [otherServicesSubFilter, setOtherServicesSubFilter] = useState<string>('all');

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

  // Booking Modal State (Defaults to Pay After Service - COD)
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [bookingStep, setBookingStep] = useState<number>(1);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('Mathew Thomas');
  const [customerPhone, setCustomerPhone] = useState<string>('+91 98950 12345');
  const [address, setAddress] = useState<string>(`Asset Homes Enclave, ${selectedLocation.name}`);
  const [vehicleDetails, setVehicleDetails] = useState<string>('Honda City (KL-07-CC-4091)');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'COD'>('COD');
  const [includeInsurance, setIncludeInsurance] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeTrackJob, setActiveTrackJob] = useState<BookingJob | null>(null);

  // Rescheduling & Cancellation Modals
  const [reschedulingJob, setReschedulingJob] = useState<BookingJob | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [newRescheduleSlot, setNewRescheduleSlot] = useState<string>('Morning: 09:00 AM - 12:00 PM');
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);

  const [cancellingJob, setCancellingJob] = useState<BookingJob | null>(null);
  const [cancellationReasonInput, setCancellationReasonInput] = useState<string>('Change of plans');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  // Invoice, Dispute & Policy Modals
  const [activeInvoiceJob, setActiveInvoiceJob] = useState<BookingJob | null>(null);
  const [activeDisputeJob, setActiveDisputeJob] = useState<BookingJob | null>(null);
  const [policyModalOpen, setPolicyModalOpen] = useState<boolean>(false);

  // Unserviced area notify state
  const [notifyPhone, setNotifyPhone] = useState<string>('');
  const [notifySuccess, setNotifySuccess] = useState<boolean>(false);

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

  // Filter Trade-Specific Experts for the selected category or active search query
  // NOTE: When on 'all' with no search query, returns [] so the main grid does NOT show top workers
  const categoryMatchedPartners = useMemo(() => {
    if (!sortedPartners || sortedPartners.length === 0) return [];
    const q = searchQuery.toLowerCase().trim();

    // REMOVE from main grid: if 'all' and no search query, return empty to keep home page minimal
    if (selectedCategoryTab === 'all' && !q) {
      return [];
    }

    return sortedPartners.filter((partner) => {
      const role = (partner.role || '').toLowerCase();
      const name = (partner.name || '').toLowerCase();

      // If user searched for something:
      if (q) {
        if (name.includes(q) || role.includes(q)) return true;
        if (q.includes('mechanic') && (role.includes('mechanic') || role.includes('breakdown'))) return true;
        if (q.includes('driver') && role.includes('driver')) return true;
        if (q.includes('electric') && role.includes('electrician')) return true;
        if (q.includes('plumb') && role.includes('plumber')) return true;
        if (q.includes('salon') && (role.includes('salon') || role.includes('beautician') || role.includes('stylist'))) return true;
        if (q.includes('clean') && role.includes('clean')) return true;
      }

      // If a specific core category tab is selected:
      if (selectedCategoryTab === 'Mechanic & Roadside Assistance' || selectedCategoryTab === 'Vehicle Care') {
        return role.includes('mechanic') || role.includes('breakdown') || role.includes('car');
      }
      if (selectedCategoryTab === 'Driver' || selectedCategoryTab === 'Rental Cars & Taxi Services') {
        return role.includes('driver') || role.includes('chauffeur');
      }
      if (selectedCategoryTab === 'Electrical Services') {
        return role.includes('electrician') || role.includes('wiring') || role.includes('electrical');
      }
      if (selectedCategoryTab === 'Plumbing & Water Management' || selectedCategoryTab === 'Water Supply') {
        return role.includes('plumber') || role.includes('pipeline') || role.includes('plumbing');
      }
      if (selectedCategoryTab === 'Appliance Care & Servicing') {
        return role.includes('ac') || role.includes('appliance') || role.includes('technician') || role.includes('electrician');
      }
      if (selectedCategoryTab === 'Personal Grooming & At-Home Wellness') {
        return role.includes('salon') || role.includes('beautician') || role.includes('stylist') || role.includes('wellness');
      }
      if (selectedCategoryTab === 'Deep Cleaning & Housekeeping' || selectedCategoryTab === 'Outdoor & Property Maintenance') {
        return role.includes('clean') || role.includes('housekeep') || role.includes('sanitiz');
      }
      if (selectedCategoryTab === 'Carpenter & Locksmith') {
        return role.includes('carpenter') || role.includes('lock') || role.includes('wood');
      }
      if (selectedCategoryTab === 'CCTV & Smart Security') {
        return role.includes('cctv') || role.includes('security') || role.includes('lock');
      }
      if (
        selectedCategoryTab === 'Other Services' ||
        selectedCategoryTab === 'Other Works' ||
        q.includes('other') ||
        q.includes('custom') ||
        q.includes('solar') ||
        q.includes('garden') ||
        q.includes('iot')
      ) {
        const hasCustom = Boolean(partner.customProfessions && partner.customProfessions.length > 0);
        if (otherServicesSubFilter === 'worker-custom') {
          return hasCustom || role.includes('solar') || role.includes('garden') || role.includes('iot') || role.includes('custom') || role.includes('freelance');
        }
        if (otherServicesSubFilter === 'cleaning') {
          return role.includes('clean') || role.includes('housekeep') || role.includes('sanitiz');
        }
        if (otherServicesSubFilter === 'carpentry') {
          return role.includes('carpenter') || role.includes('paint') || role.includes('wood') || role.includes('lock') || role.includes('waterproof');
        }
        if (otherServicesSubFilter === 'security') {
          return role.includes('cctv') || role.includes('security');
        }
        if (otherServicesSubFilter === 'salon') {
          return role.includes('salon') || role.includes('beautician') || role.includes('stylist') || role.includes('wellness');
        }
        if (otherServicesSubFilter === 'mobility') {
          return role.includes('driver') || role.includes('taxi') || role.includes('chauffeur');
        }
        if (otherServicesSubFilter === 'tech') {
          return role.includes('mobile') || role.includes('laptop') || role.includes('repair') || role.includes('tech');
        }
        if (otherServicesSubFilter === 'water') {
          return role.includes('water') || role.includes('tanker');
        }

        return (
          hasCustom ||
          role.includes('solar') ||
          role.includes('iot') ||
          role.includes('smart') ||
          role.includes('garden') ||
          role.includes('landscap') ||
          role.includes('paint') ||
          role.includes('waterproof') ||
          role.includes('cctv') ||
          role.includes('carpenter') ||
          role.includes('clean') ||
          role.includes('housekeep') ||
          role.includes('salon') ||
          role.includes('stylist') ||
          role.includes('freelance') ||
          role.includes('custom')
        );
      }
      return false;
    });
  }, [sortedPartners, selectedCategoryTab, searchQuery, otherServicesSubFilter]);

  // Dynamic title, icon and info for trade-specific experts section
  const categoryExpertInfo = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (q.includes('mechanic') || selectedCategoryTab === 'Mechanic & Roadside Assistance' || selectedCategoryTab === 'Vehicle Care') {
      return {
        title: 'Verified Mechanics & Breakdown Specialists',
        icon: '🔧',
        badge: 'Mechanic Rescue Hub',
        desc: 'Certified breakdown mechanics & vehicle technicians ready with Thuna PCC verification and 100% damage liability guarantee.'
      };
    }
    if (q.includes('driver') || selectedCategoryTab === 'Driver' || selectedCategoryTab === 'Rental Cars & Taxi Services') {
      return {
        title: 'Verified Acting Drivers & Chauffeurs',
        icon: '👨‍✈️',
        badge: 'Thuna PCC Verified',
        desc: 'Professional drivers with minimum 3+ years experience and clear Kerala Police background verification.'
      };
    }
    if (q.includes('electric') || selectedCategoryTab === 'Electrical Services') {
      return {
        title: 'Verified Electricians & Wiring Specialists',
        icon: '⚡',
        badge: 'Short-Circuit & Fuse Care',
        desc: 'Licensed electrical pros for rapid emergency troubleshooting, inverter diagnostics, and safe home wiring.'
      };
    }
    if (q.includes('plumb') || selectedCategoryTab === 'Plumbing & Water Management' || selectedCategoryTab === 'Water Supply') {
      return {
        title: 'Verified Plumbers & Pipeline Specialists',
        icon: '💧',
        badge: 'Leakage & Pump Care',
        desc: 'Equipped with pressure pumps and diagnostic tools for concealed leakage, motor repairs, and sanitaryware.'
      };
    }
    if (q.includes('appliance') || selectedCategoryTab === 'Appliance Care & Servicing') {
      return {
        title: 'Verified AC & Appliance Technicians',
        icon: '❄️',
        badge: 'Cooling & Machine Care',
        desc: 'Trained specialists for high-pressure foam jet AC service, washing machine repairs, and kitchen appliances.'
      };
    }
    if (q.includes('salon') || selectedCategoryTab === 'Personal Grooming & At-Home Wellness') {
      return {
        title: 'Verified At-Home Stylists & Beauticians',
        icon: '✂️',
        badge: 'Hygienic Single-Use Kits',
        desc: 'Certified salon artists and therapists bringing sanitized luxury grooming and wellness to your home.'
      };
    }
    if (
      q.includes('other') ||
      q.includes('custom') ||
      q.includes('solar') ||
      q.includes('garden') ||
      q.includes('iot') ||
      selectedCategoryTab === 'Other Services' ||
      selectedCategoryTab === 'Other Works'
    ) {
      if (otherServicesSubFilter === 'worker-custom') {
        return {
          title: 'Verified Worker Custom Trades & Freelancers',
          icon: '👤',
          badge: 'Worker-Added Trades',
          desc: 'Unique trades and customized services published directly by certified freelance partners with full damage liability guarantee.'
        };
      }
      return {
        title: 'Verified Trade Specialists & Custom Freelancers',
        icon: '🛠️',
        badge: 'Specialized & Custom Works',
        desc: 'Certified independent freelancers and specialized trade pros offering carpentry, deep cleaning, security, and custom trades with 100% damage liability guarantee.'
      };
    }
    return {
      title: 'Verified Trade Specialists & Pros',
      icon: '⭐',
      badge: 'Verified Freelancers',
      desc: 'Top-rated freelance professionals in this trade with verified credentials and damage liability guarantee.'
    };
  }, [selectedCategoryTab, searchQuery, otherServicesSubFilter]);

  // Partners matching the currently selected service (used in Checkout Modal)
  const matchingPartnersForSelectedService = useMemo(() => {
    if (!selectedService || !sortedPartners) return [];
    const sTitle = selectedService.title.toLowerCase();
    const sCat = selectedService.category.toLowerCase();

    return sortedPartners.filter(p => {
      const role = p.role.toLowerCase();
      if (selectedService.createdByPartnerId && p.id === selectedService.createdByPartnerId) {
        return true;
      }
      if (
        sCat === 'other works' ||
        sCat === 'other services' ||
        sCat.includes('other') ||
        sTitle.includes('solar') ||
        sTitle.includes('garden') ||
        sTitle.includes('iot') ||
        sTitle.includes('custom') ||
        Boolean(selectedService.createdByPartnerId)
      ) {
        return (
          role.includes('solar') ||
          role.includes('iot') ||
          role.includes('smart') ||
          role.includes('garden') ||
          role.includes('custom') ||
          role.includes('freelance') ||
          Boolean(p.customProfessions && p.customProfessions.length > 0)
        );
      }
      if (sCat.includes('mechanic') || sTitle.includes('mechanic') || sCat.includes('vehicle') || sTitle.includes('car')) {
        return role.includes('mechanic') || role.includes('breakdown') || role.includes('car');
      }
      if (sCat.includes('driver') || sTitle.includes('driver')) {
        return role.includes('driver') || role.includes('chauffeur');
      }
      if (sCat.includes('electrical') || sTitle.includes('electrician')) {
        return role.includes('electrician') || role.includes('wiring') || role.includes('electrical');
      }
      if (sCat.includes('plumbing') || sTitle.includes('plumber')) {
        return role.includes('plumber') || role.includes('pipeline') || role.includes('plumbing');
      }
      if (sCat.includes('appliance') || sTitle.includes('ac')) {
        return role.includes('ac') || role.includes('appliance') || role.includes('technician') || role.includes('electrician');
      }
      if (sCat.includes('grooming') || sCat.includes('salon') || sTitle.includes('salon')) {
        return role.includes('salon') || role.includes('beautician') || role.includes('stylist');
      }
      return false;
    });
  }, [selectedService, sortedPartners]);

  // Core Doorstep Category IDs shown on Minimal Home View
  const CORE_CATEGORY_IDS = [
    'Mechanic & Roadside Assistance',
    'Driver',
    'Electrical Services',
    'Plumbing & Water Management',
    'Appliance Care & Servicing',
    'Vehicle Care'
  ];

  // Minimal Category Clusters - 7 Core Doorstep Essentials + 1 Prominent 'Other Services' Gateway
  const categoryClusters = [
    { id: 'all', label: 'Essential Services', icon: '🌟' },
    { id: 'Mechanic & Roadside Assistance', label: 'Roadside Rescue', icon: '🚨', tag: '20m ETA' },
    { id: 'Driver', label: 'Acting Drivers', icon: '👨‍✈️', tag: 'Thuna PCC' },
    { id: 'Electrical Services', label: 'Electrician', icon: '⚡' },
    { id: 'Plumbing & Water Management', label: 'Plumbing', icon: '💧' },
    { id: 'Appliance Care & Servicing', label: 'Appliance & AC', icon: '❄️' },
    { id: 'Vehicle Care', label: 'Vehicle Care', icon: '🚗' },
    { id: 'Other Services', label: 'Other Services', icon: '🛠️', tag: 'Custom Trades & More', isHighlight: true }
  ];

  // Helper to determine if a service is in the core doorstep category
  const isCoreService = (s: ServiceItem) => {
    return CORE_CATEGORY_IDS.includes(s.category) && !s.createdByPartnerId;
  };

  // Helper to determine if a service belongs to "Other Services"
  const isOtherService = (s: ServiceItem) => {
    return !CORE_CATEGORY_IDS.includes(s.category) || Boolean(s.createdByPartnerId) || s.category === 'Other Works' || s.category === 'Other Services';
  };

  // Filter Services by Category, Sub-Filter and Search Query
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Search Query: searches all services across the entire platform
    if (q) {
      return services.filter(service => {
        const matchesSearch =
          service.title.toLowerCase().includes(q) ||
          service.category.toLowerCase().includes(q) ||
          (service.tagline && service.tagline.toLowerCase().includes(q)) ||
          (service.features && service.features.some(f => f.toLowerCase().includes(q))) ||
          (service.createdByPartnerName && service.createdByPartnerName.toLowerCase().includes(q));

        if (selectedCategoryTab === 'all') return matchesSearch;
        if (selectedCategoryTab === 'Other Services') {
          return matchesSearch && isOtherService(service);
        }
        return matchesSearch && service.category === selectedCategoryTab;
      });
    }

    // 2. Home Page ('all'): minimalize! Show ONLY the core essential doorstep services
    if (selectedCategoryTab === 'all') {
      return services.filter(service => isCoreService(service));
    }

    // 3. Other Services Tab: all non-core works and all worker-added custom works
    if (selectedCategoryTab === 'Other Services') {
      return services.filter(service => {
        if (!isOtherService(service)) return false;

        if (otherServicesSubFilter === 'all') return true;
        if (otherServicesSubFilter === 'worker-custom') {
          return Boolean(service.createdByPartnerId) || service.category === 'Other Works' || service.category === 'Other Services';
        }
        if (otherServicesSubFilter === 'agro') {
          return service.category === 'Agro & Palm Tree Care' || service.category === 'Garden & Compound Maintenance' || service.title.toLowerCase().includes('coconut') || service.title.toLowerCase().includes('weed');
        }
        if (otherServicesSubFilter === 'monsoon') {
          return service.category === 'Monsoon & Roof Protection' || service.title.toLowerCase().includes('roof') || service.title.toLowerCase().includes('waterproof');
        }
        if (otherServicesSubFilter === 'elderly') {
          return service.category === 'Elderly Care & Family Assistance' || service.title.toLowerCase().includes('elderly') || service.title.toLowerCase().includes('hospital');
        }
        if (otherServicesSubFilter === 'cleaning') {
          return service.category === 'Deep Cleaning & Housekeeping' || service.category === 'Outdoor & Property Maintenance';
        }
        if (otherServicesSubFilter === 'carpentry') {
          return service.category === 'Carpenter & Locksmith' || service.category === 'Painter & Waterproofing';
        }
        if (otherServicesSubFilter === 'security') {
          return service.category === 'CCTV & Smart Security';
        }
        if (otherServicesSubFilter === 'nri') {
          return service.category === 'NRI / Absentee Property Stewardship';
        }
        if (otherServicesSubFilter === 'salon') {
          return service.category === 'Personal Grooming & At-Home Wellness';
        }
        if (otherServicesSubFilter === 'mobility') {
          return service.category === 'Rental Cars & Taxi Services';
        }
        if (otherServicesSubFilter === 'tech') {
          return service.category === 'Laptop and Mobile Phone Repair';
        }
        if (otherServicesSubFilter === 'water') {
          return service.category === 'Water Supply' || service.category === 'Septic & Drainage Sanitation';
        }
        return true;
      });
    }

    // 4. Specific Core Category Tab (Roadside Rescue, Electrician, Plumber, etc.)
    return services.filter(service => service.category === selectedCategoryTab);
  }, [services, selectedCategoryTab, searchQuery, otherServicesSubFilter]);

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

  const handleStartDirectBooking = (partner: GigPartner, explicitService?: ServiceItem) => {
    setPreferredPartner(partner);
    let matchedService = explicitService;
    if (!matchedService) {
      if (selectedCategoryTab !== 'all' && selectedCategoryTab !== 'Other Services') {
        matchedService = services.find(s => s.category === selectedCategoryTab);
      }
      if (!matchedService && partner.customProfessions && partner.customProfessions.length > 0) {
        matchedService = services.find(s => s.createdByPartnerId === partner.id);
      }
      if (!matchedService) {
        matchedService = services.find(s =>
          partner.role.toLowerCase().includes(s.title.toLowerCase()) ||
          s.title.toLowerCase().includes(partner.role.toLowerCase()) ||
          partner.role.toLowerCase().includes(s.category.toLowerCase())
        );
      }
      if (!matchedService) {
        matchedService = services[0];
      }
    }

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

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingJob) return;
    setIsRescheduling(true);
    try {
      await api.rescheduleJob(reschedulingJob.id, newRescheduleDate, newRescheduleSlot);
      setIsRescheduling(false);
      setReschedulingJob(null);
      onRefreshJobs();
      alert(`✅ Job #${reschedulingJob.id} rescheduled to ${newRescheduleDate} (${newRescheduleSlot}) with ₹0 reschedule fee!`);
    } catch (err) {
      setIsRescheduling(false);
      alert('Failed to reschedule job. Please try again.');
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingJob) return;
    setIsCancelling(true);
    try {
      await api.cancelJob(cancellingJob.id, cancellationReasonInput);
      setIsCancelling(false);
      setCancellingJob(null);
      onRefreshJobs();
      alert(`✅ Order #${cancellingJob.id} cancelled. 100% refund applied according to Fykso Kerala policy.`);
    } catch (err) {
      setIsCancelling(false);
      alert('Failed to cancel job. Please try again.');
    }
  };

  const handleRebookPartner = (job: BookingJob) => {
    const matchedPartner = partners.find(p => p.id === job.assignedPartnerId);
    const matchedService = services.find(s => s.id === job.serviceId) || services[0];
    if (matchedPartner) {
      handleStartDirectBooking(matchedPartner, matchedService);
    } else {
      handleStartBooking(matchedService);
    }
  };

  const myActiveJobs = jobs.filter(j => j.status !== 'CANCELLED');
  const completedJobsNeedingFeedback = jobs.filter(j => j.status === 'COMPLETED' && !j.customerFeedback);
  const completedJobsWithFeedback = jobs.filter(j => j.status === 'COMPLETED' && j.customerFeedback);
  const allCompletedJobs = jobs.filter(j => j.status === 'COMPLETED');

  return (
    <div className="space-y-6 pb-20 w-full max-w-full overflow-x-hidden">
      
      {/* 0. Coverage Notice Banner for upcoming Kerala districts */}
      {selectedLocation.isServiced === false && (
        <div className={`rounded-3xl p-5 sm:p-6 border-2 transition-all shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/60 via-slate-900 to-blue-950/40 border-amber-500/50 text-white'
            : 'bg-gradient-to-r from-amber-50 via-white to-blue-50 border-amber-300 text-slate-900'
        }`}>
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-black shadow-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full">
                  Upcoming Coverage Zone
                </span>
                <span className="text-xs font-bold text-amber-500">
                  {selectedLocation.name} ({selectedLocation.district || 'District'})
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black mt-1">
                Standard doorstep services are launching soon in {selectedLocation.name}!
              </h3>
              <p className={`text-xs mt-0.5 max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Full technician network is currently live in <strong>Kochi, Kozhikode, and Trivandrum</strong>. In {selectedLocation.name}, our 24/7 emergency SOS helpline is active. Get notified on WhatsApp with ₹200 launch credits.
              </p>
            </div>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
            {notifySuccess ? (
              <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2.5 rounded-xl">
                ✓ You're on the priority notification list!
              </div>
            ) : (
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <input
                  type="tel"
                  value={notifyPhone}
                  onChange={(e) => setNotifyPhone(e.target.value)}
                  placeholder="WhatsApp Mobile..."
                  className={`text-xs p-2.5 rounded-xl border font-bold focus:outline-none focus:border-amber-500 w-full sm:w-44 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (notifyPhone.trim().length >= 10) {
                      setNotifySuccess(true);
                    } else {
                      alert('Please enter a valid 10-digit mobile number');
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-all shadow shrink-0 cursor-pointer"
                >
                  Notify Me
                </button>
              </div>
            )}
            <a
              href={`https://wa.me/919895000112?text=Hello%20Fykso%20Support,%20is%20service%20available%20in%20${encodeURIComponent(selectedLocation.name)}?`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center space-x-1 shrink-0"
            >
              <span>WhatsApp Support</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 1. Welcoming Hero Banner */}
      <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-lg transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border-slate-800 text-white'
          : 'bg-gradient-to-br from-white via-blue-50/40 to-emerald-50/20 border-blue-100 text-slate-900 shadow-sm'
      }`}>
        <div className="relative z-10 max-w-3xl space-y-4">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-600/20">
            <span>⚡ {t('hero_badge')} • {selectedLocation.name}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {t('hero_title')}
          </h1>

          <p className={`text-sm sm:text-base font-medium max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {t('hero_sub')}
          </p>

          {/* Interactive Search Bar */}
          <div className={`relative flex items-center rounded-2xl border p-1.5 shadow-md max-w-xl transition-all ${
            isDark
              ? 'bg-slate-950/90 border-slate-700/80 focus-within:border-blue-500 ring-blue-500/20'
              : 'bg-white border-slate-200 focus-within:border-blue-500 ring-blue-500/10'
          }`}>
            <Search className="w-5 h-5 text-blue-600 ml-3 mr-2 shrink-0" />
            <input
              id="service-search-input"
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors shadow-sm"
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
              { label: '🥥 Coconut Climber', query: 'coconut' },
              { label: '🌧️ Roof Leak Fix', query: 'roof' },
              { label: '🏥 Senior Care Escort', query: 'hospital' },
              { label: '❄️ AC Cleaning', query: 'ac' },
              { label: '⚡ Electrician', query: 'electrician' }
            ].map(chip => (
              <button
                key={chip.label}
                onClick={() => setSearchQuery(chip.query)}
                className={`text-xs px-2.5 py-1 rounded-full font-semibold border transition-all ${
                  searchQuery === chip.query
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-200'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Scheduling Bar (Date & Custom Time Slots) */}
          <div className={`p-3.5 rounded-2xl border space-y-2.5 max-w-xl transition-all ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/90 border-blue-100 shadow-sm'
          }`}>
            <div className="flex items-center justify-between text-xs font-black">
              <span className="flex items-center space-x-1.5 text-blue-600 dark:text-blue-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Search with Scheduling & Custom Time Slots</span>
              </span>
              <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
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
                    className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none focus:border-blue-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setTargetDate(new Date().toISOString().split('T')[0])}
                    className={`px-2 py-2 rounded-xl text-[10px] font-bold border transition-colors shrink-0 ${
                      targetDate === new Date().toISOString().split('T')[0]
                        ? 'bg-blue-600 text-white border-blue-600'
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
                  className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none focus:border-blue-500 ${
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
                  className={`w-full p-2 rounded-xl border text-xs font-bold focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-900 border-blue-500/50 text-white' : 'bg-white border-blue-400 text-slate-900'
                  }`}
                />
              </div>
            )}
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Rate & Review Freelancer Prompt (Customer Feedback) */}
      {completedJobsNeedingFeedback.length > 0 && (
        <div className={`rounded-2xl p-4 sm:p-5 border shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-blue-950/40 border-amber-500/30 text-white'
            : 'bg-gradient-to-r from-amber-50 via-white to-blue-50 border-amber-200 text-slate-900'
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

      {/* 3. Comprehensive Active Orders & Live Status Hub */}
      {myActiveJobs.length > 0 && (
        <div id="active-orders-section" className="space-y-4 scroll-mt-20">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{t('active_orders')} ({myActiveJobs.length})</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">Live Status & Customer Controls</span>
          </div>

          <div className="space-y-4">
            {myActiveJobs.map((job) => {
              const statusStep =
                job.status === 'PENDING' ? 1 :
                job.status === 'ASSIGNED' ? 2 :
                job.status === 'ON_THE_WAY' ? 3 :
                job.status === 'IN_PROGRESS' ? 4 : 5;

              return (
                <div
                  key={job.id}
                  className={`rounded-3xl p-5 sm:p-6 border shadow-xl space-y-4 transition-all ${
                    isDark
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 border-blue-800/40 text-white'
                      : 'bg-white border-blue-200 text-slate-900 shadow-md'
                  }`}
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Order #{job.id}
                        </span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {job.paymentStatus === 'PAY_ON_SERVICE' ? '💵 Pay After Service' : '✓ Paid UPI'}
                        </span>
                        {job.rescheduledAt && (
                          <span className="text-[10px] bg-blue-500/20 text-blue-400 font-bold px-2 py-0.5 rounded-full">
                            Rescheduled
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-black mt-0.5">{job.serviceTitle}</h4>
                      <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        📅 Scheduled: <strong>{job.scheduledTime || `${job.targetDate} (${job.targetTimeSlot})`}</strong> • 📍 {job.location.address}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                        job.status === 'IN_PROGRESS'
                          ? 'bg-emerald-500 text-slate-950 animate-pulse'
                          : 'bg-blue-600/20 text-blue-600 dark:text-blue-300 border border-blue-500/30'
                      }`}>
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* 5-Step Live Progress Stepper */}
                  <div className="py-2">
                    <div className="grid grid-cols-5 gap-1.5 text-center">
                      {[
                        { step: 1, label: t('step_booked'), icon: '📝' },
                        { step: 2, label: t('step_assigned'), icon: '👤' },
                        { step: 3, label: t('step_on_way'), icon: '🚗' },
                        { step: 4, label: t('step_in_progress'), icon: '⚙️' },
                        { step: 5, label: t('step_completed'), icon: '✓' }
                      ].map((s) => {
                        const isDone = statusStep >= s.step;
                        const isCurrent = statusStep === s.step;
                        return (
                          <div key={s.step} className="space-y-1">
                            <div className={`h-1.5 rounded-full transition-all ${
                              isDone ? 'bg-emerald-500' : isDark ? 'bg-slate-800' : 'bg-slate-200'
                            }`} />
                            <div className="text-[10px] font-bold truncate">
                              <span className={isCurrent ? 'text-emerald-500 font-black' : isDone ? 'text-slate-300' : 'text-slate-500'}>
                                {s.label}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Customer Completion OTP Gate Box (Shown during IN_PROGRESS) */}
                  {job.status === 'IN_PROGRESS' && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-500/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                      <div className="flex items-center space-x-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                          🔒
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block">
                            Your 4-Digit Job Completion OTP
                          </span>
                          <div className="text-2xl font-mono font-black text-white tracking-widest mt-0.5">
                            {job.completionOtp || '4921'}
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-300 max-w-sm leading-relaxed">
                        ⚠️ <strong>Satisfaction Guarantee:</strong> Give this OTP to {job.assignedPartnerName || 'the partner'} ONLY after inspecting the finished service. Payout is withheld until you provide this code.
                      </div>
                    </div>
                  )}

                  {/* Assigned Partner Profile Bar if assigned */}
                  {job.assignedPartnerName && (
                    <div className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-blue-50/60 border-blue-200'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black">{job.assignedPartnerName}</h4>
                          <span className="text-[10px] text-emerald-500 font-extrabold flex items-center space-x-1">
                            <ShieldCheck className="w-3 h-3" />
                            <span>PCC Document Checked by Fykso</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <a
                          href={`tel:${job.assignedPartnerPhone || '+919895012345'}`}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center space-x-1 shadow"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call via Masked Relay</span>
                        </a>

                        <button
                          onClick={() => setActiveTrackJob(job)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center space-x-1 shadow"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Track Radar</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Customer Controls & Policies Action Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setReschedulingJob(job);
                        setNewRescheduleDate(job.targetDate || new Date().toISOString().split('T')[0]);
                        setNewRescheduleSlot(job.targetTimeSlot || 'Morning: 09:00 AM - 12:00 PM');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border ${
                        isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t('reschedule_btn')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCancellingJob(job)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border text-rose-500 ${
                        isDark ? 'border-rose-900/50 hover:bg-rose-950/40' : 'border-rose-200 hover:bg-rose-50'
                      }`}
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>{t('cancel_btn')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveInvoiceJob(job)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border ${
                        isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('receipt_btn')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveDisputeJob(job)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 border text-amber-400 ${
                        isDark ? 'border-amber-900/50 hover:bg-amber-950/40' : 'border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>{t('dispute_btn')}</span>
                    </button>

                    <a
                      href={`https://wa.me/919895000112?text=Hello%20Fykso%20Support,%20I%20am%20tracking%20Order%20%23${job.id}%20(${encodeURIComponent(job.serviceTitle)}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-xs text-emerald-500 font-bold hover:underline flex items-center space-x-1"
                    >
                      <span>WhatsApp Confirm</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3.5. Easy Rebooking of Favorite Previous Providers */}
      {allCompletedJobs.length > 0 && (
        <div className={`rounded-3xl p-5 border shadow-sm space-y-3 ${
          isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Easy Rebooking: Previous Preferred Pros</span>
            </h4>
            <span className="text-[10px] font-bold text-slate-400">1-Tap Re-hire</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {allCompletedJobs.slice(0, 3).map((pastJob) => (
              <div
                key={pastJob.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <h5 className="font-bold text-xs">{pastJob.assignedPartnerName || 'Verified Pro'}</h5>
                  <p className="text-[11px] text-slate-400 truncate">{pastJob.serviceTitle}</p>
                  <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">
                    ✓ Completed #{pastJob.id}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRebookPartner(pastJob)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black transition-all shrink-0 shadow cursor-pointer"
                >
                  {t('rebook_btn')}
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
            const isOther = cluster.id === 'Other Services';
            return (
              <button
                key={cluster.id}
                onClick={() => {
                  setSelectedCategoryTab(cluster.id);
                  if (cluster.id !== 'Other Services') {
                    setOtherServicesSubFilter('all');
                  }
                }}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? isOther
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md ring-2 ring-blue-600/40'
                      : 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/30'
                    : isOther
                    ? isDark
                      ? 'bg-blue-950/40 border-blue-800/60 text-blue-300 hover:bg-blue-900/50 hover:border-blue-600 font-extrabold'
                      : 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 hover:border-blue-300 font-extrabold'
                    : isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-blue-200 hover:bg-blue-50/50'
                }`}
              >
                <span>{cluster.icon}</span>
                <span>{cluster.label}</span>
                {cluster.tag && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isOther
                      ? 'bg-blue-200 text-blue-900 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className={`text-base font-extrabold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {selectedCategoryTab === 'all'
                ? 'Core Doorstep Essentials'
                : selectedCategoryTab === 'Other Services'
                ? 'Other Services & Worker Custom Trades'
                : selectedCategoryTab}
            </h3>
            {selectedCategoryTab !== 'all' && (
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white">
                {selectedCategoryTab === 'Other Services' ? 'Expanded Hub' : 'Selected Category'}
              </span>
            )}
          </div>
          {(selectedCategoryTab !== 'all' || searchQuery || otherServicesSubFilter !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategoryTab('all');
                setSearchQuery('');
                setOtherServicesSubFilter('all');
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Reset to Core Services
            </button>
          )}
        </div>

        {/* Sub-filter Bar for 'Other Services' */}
        {selectedCategoryTab === 'Other Services' && (
          <div className={`p-4 rounded-3xl border space-y-3 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-blue-50/50 border-blue-200'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className={`text-sm font-black flex items-center space-x-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>🛠️</span>
                  <span>Explore Other Works &amp; Worker Custom Trades</span>
                </h4>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Specialized trade services, installations, and custom freelance professions added directly by verified partners.
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-blue-600 text-white shrink-0 self-start sm:self-auto shadow-sm">
                {filteredServices.length} Works Available
              </span>
            </div>

            {/* Sub-filter chips */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: 'All Other Works', icon: '🌐' },
                { id: 'worker-custom', label: 'Worker Custom Trades', icon: '👤', tag: 'Partner Added' },
                { id: 'agro', label: 'Coconut & Farm', icon: '🥥', tag: 'Essential' },
                { id: 'monsoon', label: 'Monsoon Roof Fix', icon: '🌧️', tag: 'Monsoon' },
                { id: 'elderly', label: 'Senior Care Escort', icon: '🏥', tag: 'Family' },
                { id: 'cleaning', label: 'Cleaning & Property', icon: '✨' },
                { id: 'carpentry', label: 'Carpentry & Paint', icon: '🔨' },
                { id: 'security', label: 'CCTV & Security', icon: '📹' },
                { id: 'nri', label: 'Vacant Home Care', icon: '🏡' },
                { id: 'salon', label: 'Salon & Spa', icon: '✂️' },
                { id: 'mobility', label: 'Taxi & Rentals', icon: '🚕' },
                { id: 'tech', label: 'Mobile & Laptop', icon: '📱' },
                { id: 'water', label: 'Water Tanker & Septic', icon: '🚚' },
              ].map((sub) => {
                const isActive = otherServicesSubFilter === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setOtherServicesSubFilter(sub.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600/20'
                        : isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <span>{sub.icon}</span>
                    <span>{sub.label}</span>
                    {sub.tag && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                      }`}>
                        {sub.tag}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 🔧 Trade-Specific Verified Experts (Displayed when a specific category or trade is selected, e.g. Mechanic) */}
        {categoryMatchedPartners.length > 0 && (
          <div className={`p-4 sm:p-5 rounded-3xl border transition-all ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/20 border-blue-900/40'
              : 'bg-gradient-to-br from-blue-50/50 via-white to-amber-50/40 border-blue-200 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{categoryExpertInfo.icon}</span>
                  <h4 className={`text-base sm:text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {categoryExpertInfo.title}
                  </h4>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-slate-950">
                    {categoryExpertInfo.badge}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {categoryExpertInfo.desc}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400 shrink-0">
                {categoryMatchedPartners.filter(p => p.isOnline).length} Available for Direct Booking
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryMatchedPartners.map((partner) => (
                <div
                  key={partner.id}
                  className={`rounded-2xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                    partner.isTopRated
                      ? isDark
                        ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-blue-950/20 ring-1 ring-amber-500/20'
                        : 'bg-white border-amber-300 shadow-md ring-1 ring-amber-400/20'
                      : isDark
                      ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/50'
                      : 'bg-white border-slate-200 hover:border-blue-300 shadow-sm'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Partner Header */}
                    <div className="flex items-start space-x-3">
                      <div className="relative shrink-0">
                        <img
                          src={partner.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                          alt={partner.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/40 shadow"
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
                          <h5 className="font-black text-sm truncate">{partner.name}</h5>
                          {partner.isTopRated && (
                            <span className="inline-flex items-center space-x-0.5 text-[9px] font-black uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-1.5 py-0.2 rounded-md shadow">
                              <Star className="w-2.5 h-2.5 fill-slate-950" />
                              <span>Top Pro</span>
                            </span>
                          )}
                        </div>

                        <p className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
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

                    {/* Earnings / Rate Tag */}
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
                    <div className="space-y-1.5 pt-0.5">
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
                      <div className="space-y-1 pt-0.5">
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
                        "{partner.reviews[0].comment.slice(0, 70)}..."
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
                        ? 'bg-blue-600 hover:bg-blue-500 text-white hover:scale-[1.02]'
                        : isDark
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{partner.isOnline ? `Book ${partner.name.split(' ')[0]} Directly` : `Schedule with ${partner.name.split(' ')[0]}`}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
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
                    ? 'bg-slate-900/90 border-slate-800/90 hover:border-blue-500/80 text-white shadow-md hover:-translate-y-1 hover:shadow-xl'
                    : 'bg-white border-slate-200/90 hover:border-blue-300 text-slate-900 shadow-sm hover:shadow-xl hover:-translate-y-1'
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
                    {service.createdByPartnerName ? (
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1">
                        <span>👤 {service.createdByPartnerName.split(' ')[0]}'s Custom Work</span>
                      </span>
                    ) : service.category === 'Mechanic & Roadside Assistance' ? (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                        ⚡ 20m Rescue
                      </span>
                    ) : service.category === 'Driver' ? (
                      <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>PCC Checked</span>
                      </span>
                    ) : service.category === 'Other Works' || service.category === 'Other Services' ? (
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow flex items-center space-x-1">
                        <span>🛠️ Custom Trade</span>
                      </span>
                    ) : (
                      <span className="bg-slate-950/70 backdrop-blur text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
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

                    {service.createdByPartnerName && (
                      <div className="mt-1 flex items-center space-x-1">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 inline-flex items-center space-x-1">
                          <span>👤 Added by Pro: {service.createdByPartnerName}</span>
                        </span>
                      </div>
                    )}

                    <p className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {service.tagline}
                    </p>
                  </div>

                  {/* Upfront Transparent Pricing and Action */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        {service.tiers ? 'Starts at' : 'Diagnostic Visit'}
                      </span>
                      <div className="flex items-baseline space-x-1">
                        <span className="text-base font-black text-blue-600 dark:text-blue-400">
                          ₹{service.tiers ? service.tiers[0].price : service.basePrice || service.diagnosticFee || service.estPrice}
                        </span>
                        {service.priceRangeNotice && (
                          <span className="text-[9px] text-slate-400 font-semibold truncate max-w-[110px]" title={service.priceRangeNotice}>
                            • {service.priceRangeNotice}
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-emerald-500 font-extrabold block">
                        ✓ {service.sparePartsNotice || 'Transparent Estimate Guarantee'}
                      </span>
                    </div>

                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow transition-all duration-200 flex items-center space-x-1 group-hover:scale-105 shrink-0"
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

        {/* Gateway Banner to Other Services & Worker Custom Trades when on Home / Core View */}
        {selectedCategoryTab === 'all' && !searchQuery && (
          <div className={`mt-8 rounded-3xl p-6 sm:p-8 border shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 ${
            isDark
              ? 'bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border-blue-500/30'
              : 'bg-gradient-to-r from-blue-100 via-white to-indigo-100 border-blue-200'
          }`}>
            <div className="flex items-start space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg text-2xl">
                🛠️
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
                    Other Services &amp; Custom Trades Hub
                  </span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {services.filter(s => isOtherService(s)).length}+ Specialized Works
                  </span>
                </div>
                <h4 className={`text-lg sm:text-xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Need Deep Cleaning, Carpentry, Painting, or Worker-Added Trades?
                </h4>
                <p className={`text-xs sm:text-sm mt-1 max-w-xl ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  We keep the home page uncluttered with core essentials. Click below to browse all other works including CCTV setup, water tankers, NRI property care, and custom freelance trades (Solar, Gardening, IoT) added by our verified partners.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedCategoryTab('Other Services');
                setOtherServicesSubFilter('all');
              }}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 shrink-0 hover:scale-105 cursor-pointer"
            >
              <span>Explore Other Services ({services.filter(s => isOtherService(s)).length}+)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 6. Why Kochi Trusts Fykso (Trust & Assurance Section) */}
      <div className={`rounded-3xl p-6 sm:p-8 border shadow-sm transition-colors ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div className="text-center max-w-xl mx-auto mb-6">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">
            Fykso Guarantee
          </span>
          <h3 className={`text-xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Why Customers Trust Fykso at Their Doorstep
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs">PCC Checked by Fykso</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Every driver and doorstep pro has their PCC independently checked by Fykso to confirm zero criminal background.
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
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold mb-2.5">
              <CreditCard className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-xs">Pay After Service (COD)</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              ₹0 advance required. Inspect the work first, then pay via Cash or UPI upon satisfaction.
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
                <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                  Step {bookingStep} of 3 • Fykso Booking
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
                                ? 'border-blue-600 bg-blue-500/10 font-bold ring-2 ring-blue-500/20'
                                : isDark
                                ? 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="tier"
                                checked={selectedTier === t.name}
                                onChange={() => setSelectedTier(t.name)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                              />
                              <div>
                                <span className="text-xs font-bold block">{t.name}</span>
                                <span className="text-[10px] text-slate-400">{t.duration || 'Full Service'}</span>
                              </div>
                            </div>
                            <div className="font-black text-sm text-blue-600 dark:text-blue-400">
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
                        <div className="font-black text-base text-blue-600 mt-2">
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
                      className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Time & Address with Freelancer Availability */}
              {bookingStep === 2 && (
                <div className="space-y-4">
                  {/* Matching Trade Specialists Selector for this Service */}
                  {matchingPartnersForSelectedService.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Specialist Selection
                        </label>
                        <span className="text-[10px] text-blue-500 font-bold">
                          {preferredPartner ? `Direct: ${preferredPartner.name.split(' ')[0]}` : 'Auto-Dispatch (Instant)'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {/* Auto-Dispatch button */}
                        <button
                          type="button"
                          onClick={() => {
                            setPreferredPartner(null);
                            setTargetTimeSlot('Immediate Emergency Dispatch (15-20 Mins)');
                            setIsCustomSlot(false);
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2.5 cursor-pointer ${
                            !preferredPartner
                              ? 'border-blue-600 bg-blue-500/15 ring-2 ring-blue-500/30 font-bold'
                              : isDark
                              ? 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                              : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-500 flex items-center justify-center shrink-0">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black">⚡ Auto-Assign Nearest</div>
                            <div className="text-[10px] text-slate-400">Instant 15-20 min arrival</div>
                          </div>
                        </button>

                        {/* Trade Partners (e.g. Anand Kumar, Sanjay R.) */}
                        {matchingPartnersForSelectedService.map((p) => {
                          const isSelected = preferredPartner?.id === p.id;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setPreferredPartner(p);
                                if (p.availableSlots && p.availableSlots.length > 0) {
                                  setTargetTimeSlot(p.availableSlots[0]);
                                  setIsCustomSlot(false);
                                }
                              }}
                              className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2.5 cursor-pointer ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-500/15 ring-2 ring-blue-500/30 font-bold'
                                  : isDark
                                  ? 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200'
                              }`}
                            >
                              <img
                                src={p.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                                alt={p.name}
                                className="w-8 h-8 rounded-lg object-cover border border-blue-500/50 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs font-black truncate">{p.name}</span>
                                  <span className="text-[10px] text-amber-500 font-bold shrink-0">{p.rating}★</span>
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">{p.role}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Direct Worker Booking Banner if selected */}
                  {preferredPartner && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/15 via-amber-500/10 to-blue-500/10 border border-blue-500/30 flex items-center space-x-3">
                      <img
                        src={preferredPartner.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                        alt={preferredPartner.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-blue-500/50 shadow shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-500/20 px-2 py-0.2 rounded-full">
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
                        className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-blue-500 font-bold ${
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
                          className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-blue-500 font-bold ${
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
                          className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-blue-500 font-bold ${
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
                        className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-blue-500 font-bold ${
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
                      className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 ${
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
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 ${
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
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 ${
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
                      <span className="text-blue-600 dark:text-blue-400">
                        ₹{(selectedService.tiers ? (selectedService.tiers.find(t => t.name === selectedTier)?.price || selectedService.tiers[0].price) : (selectedService.basePrice || selectedService.diagnosticFee || 299)) + 35 + 19}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider mb-2 text-slate-400">
                      Payment Mode (Pay After Service Preferred in Kerala)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className={`p-3 rounded-2xl border flex items-center space-x-2.5 cursor-pointer ${
                        paymentMethod === 'COD' ? 'border-blue-600 bg-blue-500/10 font-bold ring-2 ring-blue-500/20' : 'border-slate-800'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="text-blue-600"
                        />
                        <div>
                          <span className="text-xs font-bold block">💵 Pay After Service</span>
                          <span className="text-[10px] text-slate-400">Cash / UPI on completion</span>
                        </div>
                      </label>

                      <label className={`p-3 rounded-2xl border flex items-center space-x-2.5 cursor-pointer ${
                        paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-500/10 font-bold ring-2 ring-blue-500/20' : 'border-slate-800'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'UPI'}
                          onChange={() => setPaymentMethod('UPI')}
                          className="text-blue-600"
                        />
                        <div>
                          <span className="text-xs font-bold block">⚡ Instant UPI / GPay</span>
                          <span className="text-[10px] text-slate-400">100% Refundable hold</span>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3">
                      <span className="flex items-center space-x-1">
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>100% Free cancellation before partner dispatch</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setPolicyModalOpen(true)}
                        className="text-blue-400 hover:underline font-bold"
                      >
                        Refund Policy
                      </button>
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md flex items-center space-x-1"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-xl"
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
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
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
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
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
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600 p-5 text-slate-950 flex items-start justify-between">
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
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
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

      {/* 10. Customer Reschedule Modal */}
      {reschedulingJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2">
                <RotateCcw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-black">Reschedule Service Slot</h3>
              </div>
              <button onClick={() => setReschedulingJob(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="p-5 sm:p-6 space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                Order <strong>#{reschedulingJob.id}</strong> • {reschedulingJob.serviceTitle}
                <span className="block text-emerald-500 font-bold mt-0.5">✓ ₹0 Free Rescheduling Guarantee</span>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1">
                  Select New Date *
                </label>
                <input
                  type="date"
                  required
                  value={newRescheduleDate}
                  onChange={(e) => setNewRescheduleDate(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border font-bold focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1">
                  Select New Time Slot *
                </label>
                <select
                  value={newRescheduleSlot}
                  onChange={(e) => setNewRescheduleSlot(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border font-bold focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Morning: 09:00 AM - 12:00 PM">Morning: 09:00 AM - 12:00 PM</option>
                  <option value="Afternoon: 01:00 PM - 04:00 PM">Afternoon: 01:00 PM - 04:00 PM</option>
                  <option value="Evening: 05:00 PM - 08:00 PM">Evening: 05:00 PM - 08:00 PM</option>
                  <option value="Night: 08:00 PM - 10:00 PM">Night: 08:00 PM - 10:00 PM</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReschedulingJob(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-700 text-slate-400 hover:text-white"
                >
                  Keep Existing
                </button>
                <button
                  type="submit"
                  disabled={isRescheduling}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white shadow-lg disabled:opacity-50"
                >
                  {isRescheduling ? 'Updating Slot...' : 'Confirm Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. Customer Free Cancellation Modal */}
      {cancellingJob && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2 text-rose-500">
                <Ban className="w-5 h-5" />
                <h3 className="text-base font-black">Cancel Service Booking</h3>
              </div>
              <button onClick={() => setCancellingJob(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCancelSubmit} className="p-5 sm:p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
                <div className="font-bold text-rose-400">100% Free Cancellation Guarantee:</div>
                <p className="text-slate-300">
                  Zero cancellation charges before the service partner arrives at your address. Any advance UPI hold is refunded instantly to your original payment mode within 2-4 hours.
                </p>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-400 mb-1">
                  Reason for Cancellation
                </label>
                <select
                  value={cancellationReasonInput}
                  onChange={(e) => setCancellationReasonInput(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border font-bold focus:outline-none focus:border-rose-500 ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="Change of plans / Emergency postponed">Change of plans / Emergency postponed</option>
                  <option value="Booked incorrect time slot">Booked incorrect time slot</option>
                  <option value="Issue resolved on my own">Issue resolved on my own</option>
                  <option value="Selected wrong service">Selected wrong service</option>
                  <option value="Found alternate local solution">Found alternate local solution</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancellingJob(null)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-slate-700 text-slate-400 hover:text-white"
                >
                  Keep Booking
                </button>
                <button
                  type="submit"
                  disabled={isCancelling}
                  className="flex-1 py-2.5 rounded-xl text-xs font-black bg-rose-600 hover:bg-rose-500 text-white shadow-lg disabled:opacity-50"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Free Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 12. Formal Tax Invoice & Receipt Modal */}
      {activeInvoiceJob && (
        <InvoiceModal
          isOpen={Boolean(activeInvoiceJob)}
          onClose={() => setActiveInvoiceJob(null)}
          job={activeInvoiceJob}
          theme={theme}
        />
      )}

      {/* 13. Dispute & Bad Experience Modal */}
      {activeDisputeJob && (
        <DisputeModal
          isOpen={Boolean(activeDisputeJob)}
          onClose={() => setActiveDisputeJob(null)}
          job={activeDisputeJob}
          theme={theme}
          onDisputeSubmitted={() => {
            onRefreshJobs();
            setActiveDisputeJob(null);
          }}
        />
      )}

      {/* 14. Cancellation & Refund Policy Modal */}
      <CancellationPolicyModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
        theme={theme}
      />

      {/* 15. Floating 24/7 Kerala WhatsApp Helpline Widget */}
      <a
        href="https://wa.me/919895000112?text=Hello%20Fykso%20Support,%20I%20am%20inquiring%20about%20doorstep%20services%20in%20Kerala."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl flex items-center space-x-2 hover:scale-105 transition-all group cursor-pointer border border-emerald-400/40"
        title="Fykso Kerala 24/7 WhatsApp Helpline"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-black">WhatsApp Help (+91 98950 00112)</span>
      </a>

    </div>
  );
};
