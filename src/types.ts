export type ThemeMode = 'light' | 'dark';

export interface KochiLocation {
  id: string;
  name: string;
  city?: string;
  state?: string;
  pin: string;
  lat: number;
  lng: number;
}

export type ServiceLocation = KochiLocation;

export interface ServiceTier {
  name: string;
  price: number;
  duration: string;
}

export interface CustomProfession {
  id: string;
  title: string;
  category: string;
  tagline: string;
  priceType: 'tiered' | 'base_plus_hourly' | 'flat_diagnostic' | 'quote' | 'subscription';
  price: number;
  eta?: string;
  features: string[];
  equipment?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface ServiceItem {
  id: string;
  phase: number;
  category: string;
  title: string;
  tagline: string;
  badge?: string;
  icon: string;
  imageUrl: string;
  eta: string;
  priceType: 'tiered' | 'base_plus_hourly' | 'flat_diagnostic' | 'quote' | 'subscription';
  tiers?: ServiceTier[];
  basePrice?: number;
  baseHours?: number;
  extraPricePerHour?: number;
  nightAllowance?: number;
  allowancePolicy?: string;
  diagnosticFee?: number;
  estPrice?: number;
  features: string[];
  rating: number;
  reviewsCount: number;
  isInstant?: boolean;
  createdByPartnerId?: string;
  createdByPartnerName?: string;
}

export interface PartnerReview {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  jobId?: string;
  serviceTitle?: string;
  createdAt: string;
}

export interface TargetAchievement {
  weeklyTarget: number;
  completedJobsThisWeek: number;
  bonusAmount: number;
  isBonusUnlocked: boolean;
  tierLevel: 'STANDARD' | 'BRONZE_PRO' | 'SILVER_PRO' | 'GOLD_TOP_RATED';
  commissionDiscountPercent: number;
}

export interface PartnerKYC {
  aadhaarVerified: boolean;
  aadhaarNumber?: string;
  govtIdType?: 'AADHAAR' | 'PAN' | 'VOTER_ID' | 'DRIVING_LICENSE' | 'PASSPORT';
  govtIdNumber?: string;
  govtIdFileAttached?: boolean;
  dlNumber?: string;
  pccStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED';
  pccRefNo?: string;
  pccExpiry?: string;
  bankVerified: boolean;
  damageLiabilityAgreed: boolean;
  liabilityAgreementTimestamp?: string;
}

export interface GigPartner {
  id: string;
  name: string;
  phone: string;
  role: string;
  secondaryRoles?: string[];
  customProfessions?: CustomProfession[];
  rating: number;
  jobsCompleted: number;
  reviewsCount?: number;
  reviews?: PartnerReview[];
  isOnline: boolean;
  isTopRated?: boolean;
  hourlyRateMultiplier?: number;
  currentLocation: {
    name: string;
    lat: number;
    lng: number;
  };
  availableSlots?: string[];
  targetAchievement?: TargetAchievement;
  damageLiabilityAgreed?: boolean;
  kyc: PartnerKYC;
  equipment?: string;
  vehicle?: string;
  walletBalance: number;
  todaysEarnings: number;
  photoUrl: string;
}

export interface InspectionPhoto {
  angle: string;
  url: string;
  notes: string;
}

export interface PreServiceChecklist {
  completedAt: string;
  photos: InspectionPhoto[];
}

export interface JobPricing {
  baseFare: number;
  platformCommission: number;
  partnerEarnings: number;
  convenienceFee: number;
  microInsurance: number;
  totalPaid: number;
  allowanceReturnBus?: number;
}

export interface JobFeedback {
  rating: number;
  comment: string;
  serviceQualityRating?: number;
  punctualityRating?: number;
  zeroDamageConfirmed?: boolean;
  createdAt: string;
}

export interface BookingJob {
  id: string;
  serviceId: string;
  serviceTitle: string;
  tierName: string;
  customerName: string;
  customerPhone: string;
  location: {
    address: string;
    microMarket: string;
    lat: number;
    lng: number;
  };
  scheduledTime: string;
  targetDate?: string;
  targetTimeSlot?: string;
  preferredPartnerId?: string | null;
  preferredPartnerName?: string | null;
  status: 'PENDING' | 'ASSIGNED' | 'PRE_INSPECTION_DONE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedPartnerId?: string | null;
  assignedPartnerName?: string | null;
  assignedPartnerPhone?: string | null;
  pricing: JobPricing;
  paymentStatus: 'PAID_UPI' | 'PAY_ON_SERVICE';
  vehicleDetails?: string;
  preServiceChecklist?: PreServiceChecklist | null;
  customerFeedback?: JobFeedback | null;
  damageReported?: boolean;
  damageNotes?: string;
  createdAt: string;
}

export interface AdminStats {
  totalJobs: number;
  completedJobs: number;
  gmv: number;
  platformRevenue: number;
  activePartnersCount: number;
  verifiedPccCount: number;
  averageTakeRate: string;
}
