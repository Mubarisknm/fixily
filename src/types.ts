export type ThemeMode = 'light' | 'dark';

export interface KochiLocation {
  id: string;
  name: string;
  pin: string;
  lat: number;
  lng: number;
}

export interface ServiceTier {
  name: string;
  price: number;
  duration: string;
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
}

export interface PartnerKYC {
  aadhaarVerified: boolean;
  dlNumber?: string;
  pccStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED';
  pccRefNo?: string;
  pccExpiry?: string;
  bankVerified: boolean;
}

export interface GigPartner {
  id: string;
  name: string;
  phone: string;
  role: string;
  rating: number;
  jobsCompleted: number;
  isOnline: boolean;
  currentLocation: {
    name: string;
    lat: number;
    lng: number;
  };
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
  status: 'PENDING' | 'ASSIGNED' | 'PRE_INSPECTION_DONE' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedPartnerId?: string | null;
  assignedPartnerName?: string | null;
  assignedPartnerPhone?: string | null;
  pricing: JobPricing;
  paymentStatus: 'PAID_UPI' | 'PAY_ON_SERVICE';
  vehicleDetails?: string;
  preServiceChecklist?: PreServiceChecklist | null;
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
