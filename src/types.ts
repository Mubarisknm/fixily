export type ThemeMode = 'light' | 'dark';
export type AppLanguage = 'en' | 'ml';
export type UserRole = 'customer' | 'partner' | 'admin';

export interface UserSession {
  id: string;
  phone?: string;
  email?: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  avatar?: string;
  authProvider?: 'google' | 'email' | 'phone';
  partnerId?: string;
}

export interface DisputeReport {
  id: string;
  jobId: string;
  serviceTitle: string;
  customerPhone: string;
  partnerName?: string;
  issueType: 'damage' | 'overcharging' | 'unprofessional' | 'no_show' | 'quality';
  description: string;
  photoUrls?: string[];
  status: 'OPEN' | 'INVESTIGATING' | 'REFUNDED' | 'RESOLVED';
  refundAmount?: number;
  createdAt: string;
}

export interface KochiLocation {
  id: string;
  name: string;
  city?: string;
  district?: string;
  taluk?: string;
  panchayat?: string;
  regionType?: 'URBAN' | 'RURAL_VILLAGE' | 'HIGH_RANGE' | 'COASTAL';
  state?: string;
  pin: string;
  lat: number;
  lng: number;
  isServiced?: boolean;
  isLiveGps?: boolean;
}

export type ServiceLocation = KochiLocation;

export interface CustomerSavedAddress {
  id: string;
  label: 'Home' | 'Work' | 'Other';
  customTitle?: string;
  houseOrBuilding: string;
  streetOrArea: string;
  landmark?: string;
  location: KochiLocation;
  contactName?: string;
  contactPhone?: string;
  isDefault?: boolean;
}

export interface ServiceTier {
  name: string;
  price: number;
  duration: string;
  description?: string;
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
  malayalamTitle?: string;
  tagline: string;
  malayalamTagline?: string;
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
  priceRangeNotice?: string;
  sparePartsNotice?: string;
  features: string[];
  rating: number;
  reviewsCount: number;
  isNewService?: boolean;
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
  pccCheckedByFykzi?: boolean;
  pccCheckedByFykso?: boolean;
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
  escrowBalance?: number;
  withdrawableBalance?: number;
  todaysEarnings: number;
  photoUrl: string;
  aadhaarMasked?: string;
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
  itemizedDiagnostic?: number;
  itemizedLaborEstimate?: string;
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
  customerPhoneMasked?: string;
  location: {
    address: string;
    microMarket: string;
    lat: number;
    lng: number;
  };
  maskedAddress?: string;
  scheduledTime: string;
  targetDate?: string;
  targetTimeSlot?: string;
  preferredPartnerId?: string | null;
  preferredPartnerName?: string | null;
  status:
    | 'PENDING'
    | 'ASSIGNED'
    | 'PROVIDER_ASSIGNED'
    | 'ON_THE_WAY'
    | 'PRE_INSPECTION_DONE'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'DISPUTED';
  assignedPartnerId?: string | null;
  assignedPartnerName?: string | null;
  assignedPartnerPhone?: string | null;
  completionOtp?: string;
  startOtp?: string;
  beforeWorkPhotos?: string[];
  afterWorkPhotos?: string[];
  pricing: JobPricing;
  paymentStatus: 'PAID_UPI' | 'PAY_ON_SERVICE' | 'PAID_CARD';
  paymentMethod?: 'PAY_AFTER_SERVICE' | 'UPI' | 'CARD';
  vehicleDetails?: string;
  preServiceChecklist?: PreServiceChecklist | null;
  customerFeedback?: JobFeedback | null;
  damageReported?: boolean;
  damageNotes?: string;
  disputeReport?: DisputeReport;
  cancellationReason?: string;
  cancelledAt?: string;
  refundStatus?: 'NOT_APPLICABLE' | 'REFUND_PENDING' | 'REFUNDED_TO_UPI' | 'REFUNDED_100' | 'NO_CHARGE';
  rescheduledAt?: string;
  invoiceId?: string;
  payoutHoldUntil?: string;
  payoutStatus?: 'IN_ESCROW' | 'RELEASED' | 'DISPUTED' | 'ESCROW_HOLD';
  isNriProperty?: boolean;
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

export interface NotificationPreferences {
  whatsapp: boolean;
  push: boolean;
  email: boolean;
  sms: boolean;
  voice: boolean;
}
