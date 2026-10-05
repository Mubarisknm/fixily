import { KochiLocation, ServiceItem, GigPartner, BookingJob, AdminStats } from '../types';
import { KOCHI_LOCATIONS, SERVICES, MOCK_PARTNERS, MOCK_JOBS } from '../data/db';

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
const API_BASE = `${BASE_URL}/api`;

async function fetchJson(url: string, options?: RequestInit) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn(`API call to ${url} failed, using local fallback state:`, err);
    return null;
  }
}

// Local fallback state in case server is not running
let localPartners: GigPartner[] = [...MOCK_PARTNERS];
let localJobs: BookingJob[] = [...MOCK_JOBS];

export const api = {
  async getLocations(): Promise<KochiLocation[]> {
    const data = await fetchJson(`${API_BASE}/locations`);
    return data || KOCHI_LOCATIONS;
  },

  async getServices(): Promise<ServiceItem[]> {
    const data = await fetchJson(`${API_BASE}/services`);
    return data || (SERVICES as ServiceItem[]);
  },

  async getPartners(): Promise<GigPartner[]> {
    const data = await fetchJson(`${API_BASE}/partners`);
    return data || localPartners;
  },

  async registerPartner(payload: {
    name: string;
    phone: string;
    role: string;
    city?: string;
    vehicle?: string;
    dlNumber?: string;
    aadhaarNumber?: string;
    govtIdType?: 'AADHAAR' | 'PAN' | 'VOTER_ID' | 'DRIVING_LICENSE' | 'PASSPORT';
    govtIdNumber?: string;
    damageLiabilityAgreed?: boolean;
    pccRefNo?: string;
    pccExpiry?: string;
    upiId?: string;
    photoUrl?: string;
  }): Promise<GigPartner> {
    const data = await fetchJson(`${API_BASE}/partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (data) return data;

    const newPartner: GigPartner = {
      id: `p-${Date.now().toString().slice(-4)}`,
      name: payload.name || 'Fixily Verified Partner',
      phone: payload.phone || '+91 98470 00000',
      role: payload.role || 'Freelance Service Partner',
      rating: 5.0,
      jobsCompleted: 0,
      isOnline: true,
      currentLocation: {
        name: payload.city || 'Kochi Hub',
        lat: 10.0159,
        lng: 76.3419
      },
      kyc: {
        aadhaarVerified: Boolean(payload.aadhaarNumber),
        aadhaarNumber: payload.aadhaarNumber || undefined,
        govtIdType: payload.govtIdType || 'AADHAAR',
        govtIdNumber: payload.govtIdNumber || payload.aadhaarNumber || undefined,
        govtIdFileAttached: true,
        dlNumber: payload.dlNumber || undefined,
        pccStatus: payload.pccRefNo ? 'VERIFIED' : 'PENDING_REVIEW',
        pccRefNo: payload.pccRefNo || 'THUNA-PCC-SUBMITTED',
        pccExpiry: payload.pccExpiry || '2027-09-30',
        bankVerified: true,
        damageLiabilityAgreed: Boolean(payload.damageLiabilityAgreed),
        liabilityAgreementTimestamp: new Date().toISOString()
      },
      damageLiabilityAgreed: Boolean(payload.damageLiabilityAgreed),
      targetAchievement: {
        weeklyTarget: 15,
        completedJobsThisWeek: 0,
        bonusAmount: 1500,
        isBonusUnlocked: false,
        tierLevel: 'STANDARD',
        commissionDiscountPercent: 0
      },
      reviews: [],
      reviewsCount: 0,
      hourlyRateMultiplier: 1.0,
      vehicle: payload.vehicle || 'Standard Service Kit',
      walletBalance: 250, // Welcome joining bonus
      todaysEarnings: 0,
      photoUrl: payload.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    localPartners.unshift(newPartner);
    return newPartner;
  },

  async togglePartnerDuty(id: string, isOnline: boolean): Promise<GigPartner> {
    const data = await fetchJson(`${API_BASE}/partners/${id}/duty`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOnline })
    });
    if (data) return data;
    
    const p = localPartners.find((item: GigPartner) => item.id === id);
    if (p) p.isOnline = isOnline;
    return p || localPartners[0];
  },

  async approvePartnerKYC(id: string, pccStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED', pccRefNo?: string): Promise<GigPartner> {
    const data = await fetchJson(`${API_BASE}/partners/${id}/kyc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pccStatus, pccRefNo })
    });
    if (data) return data;

    const p = localPartners.find((item: GigPartner) => item.id === id);
    if (p) {
      p.kyc.pccStatus = pccStatus;
      if (pccRefNo) p.kyc.pccRefNo = pccRefNo;
    }
    return p || localPartners[0];
  },

  async withdrawWallet(id: string, amount: number, upiId: string): Promise<{ success: boolean; walletBalance: number; message: string }> {
    const data = await fetchJson(`${API_BASE}/partners/${id}/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, upiId })
    });
    if (data) {
      return { success: true, walletBalance: data.walletBalance, message: `₹${amount} transferred to ${upiId}` };
    }

    const p = localPartners.find((item: GigPartner) => item.id === id);
    if (p) {
      p.walletBalance = Math.max(0, p.walletBalance - amount);
      return { success: true, walletBalance: p.walletBalance, message: `₹${amount} transferred to ${upiId} via Instant RazorpayX` };
    }
    return { success: false, walletBalance: 0, message: 'Partner not found' };
  },

  async getJobs(): Promise<BookingJob[]> {
    const data = await fetchJson(`${API_BASE}/jobs`);
    return data || localJobs;
  },

  async createBooking(payload: any): Promise<BookingJob> {
    const data = await fetchJson(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (data) return data;

    const service = (SERVICES as ServiceItem[]).find((s: ServiceItem) => s.id === payload.serviceId) || (SERVICES as ServiceItem[])[0];
    const newJob: BookingJob = {
      id: `FIX-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceId: service.id,
      serviceTitle: service.title,
      tierName: payload.tierName || service.tagline,
      customerName: payload.customerName || 'Kochi Customer',
      customerPhone: payload.customerPhone || '+91 98950 00000',
      location: {
        address: payload.address || 'Kakkanad, Kochi',
        microMarket: payload.microMarket || 'Kakkanad',
        lat: 10.0159 + (Math.random() - 0.5) * 0.02,
        lng: 76.3419 + (Math.random() - 0.5) * 0.02
      },
      scheduledTime: payload.scheduledTime || (payload.targetDate && payload.targetTimeSlot ? `${payload.targetDate} (${payload.targetTimeSlot})` : 'Immediate Dispatch'),
      targetDate: payload.targetDate || new Date().toISOString().split('T')[0],
      targetTimeSlot: payload.targetTimeSlot || 'Immediate Dispatch',
      preferredPartnerId: payload.preferredPartnerId || null,
      preferredPartnerName: payload.preferredPartnerName || null,
      status: payload.preferredPartnerId ? 'ASSIGNED' : 'PENDING',
      assignedPartnerId: payload.preferredPartnerId || null,
      assignedPartnerName: payload.preferredPartnerName || null,
      pricing: {
        baseFare: 499,
        platformCommission: 75,
        partnerEarnings: 424,
        convenienceFee: 35,
        microInsurance: 19,
        totalPaid: 553
      },
      paymentStatus: payload.paymentMethod === 'COD' ? 'PAY_ON_SERVICE' : 'PAID_UPI',
      vehicleDetails: payload.vehicleDetails || 'Honda City',
      createdAt: new Date().toISOString()
    };
    localJobs.unshift(newJob);
    return newJob;
  },

  async submitJobFeedback(jobId: string, feedback: {
    rating: number;
    comment: string;
    serviceQualityRating?: number;
    punctualityRating?: number;
    zeroDamageConfirmed?: boolean;
  }): Promise<BookingJob> {
    const data = await fetchJson(`${API_BASE}/jobs/${jobId}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback)
    });
    if (data) return data;

    const job = localJobs.find((j: BookingJob) => j.id === jobId);
    if (job) {
      job.customerFeedback = {
        ...feedback,
        createdAt: new Date().toISOString()
      };

      if (job.assignedPartnerId) {
        const partner = localPartners.find((p: GigPartner) => p.id === job.assignedPartnerId);
        if (partner) {
          if (!partner.reviews) partner.reviews = [];
          partner.reviews.unshift({
            id: `rev-${Date.now().toString().slice(-4)}`,
            customerName: job.customerName,
            rating: feedback.rating,
            comment: feedback.comment,
            serviceTitle: job.serviceTitle,
            createdAt: new Date().toISOString().split('T')[0]
          });
          partner.reviewsCount = (partner.reviewsCount || 0) + 1;
          const sum = partner.reviews.reduce((acc, r) => acc + r.rating, 0);
          partner.rating = Number((sum / partner.reviews.length).toFixed(2));
          if (partner.rating >= 4.9 && partner.jobsCompleted >= 50) {
            partner.isTopRated = true;
            partner.hourlyRateMultiplier = 1.25;
          }
        }
      }
    }
    return job || localJobs[0];
  },

  async acceptJob(jobId: string, partnerId: string): Promise<BookingJob> {
    const data = await fetchJson(`${API_BASE}/jobs/${jobId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerId })
    });
    if (data) return data;

    const job = localJobs.find((j: BookingJob) => j.id === jobId);
    const partner = localPartners.find((p: GigPartner) => p.id === partnerId);
    if (job && partner) {
      job.status = 'ASSIGNED';
      job.assignedPartnerId = partner.id;
      job.assignedPartnerName = partner.name;
      job.assignedPartnerPhone = partner.phone;
    }
    return job || localJobs[0];
  },

  async uploadPreCheck(jobId: string, photos: any[]): Promise<BookingJob> {
    const data = await fetchJson(`${API_BASE}/jobs/${jobId}/precheck`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos })
    });
    if (data) return data;

    const job = localJobs.find((j: BookingJob) => j.id === jobId);
    if (job) {
      job.preServiceChecklist = {
        completedAt: new Date().toLocaleString(),
        photos
      };
      job.status = 'IN_PROGRESS';
    }
    return job || localJobs[0];
  },

  async completeJob(jobId: string): Promise<BookingJob> {
    const data = await fetchJson(`${API_BASE}/jobs/${jobId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (data) return data;

    const job = localJobs.find((j: BookingJob) => j.id === jobId);
    if (job) {
      job.status = 'COMPLETED';
      if (job.assignedPartnerId) {
        const p = localPartners.find((item: GigPartner) => item.id === job.assignedPartnerId);
        if (p) {
          p.walletBalance += job.pricing.partnerEarnings;
          p.todaysEarnings += job.pricing.partnerEarnings;
          p.jobsCompleted += 1;
        }
      }
    }
    return job || localJobs[0];
  },

  async getAdminStats(): Promise<AdminStats> {
    const data = await fetchJson(`${API_BASE}/stats`);
    if (data) return data;

    const totalJobs = localJobs.length;
    const completedJobs = localJobs.filter((j: BookingJob) => j.status === 'COMPLETED').length;
    const gmv = localJobs.reduce((acc: number, j: BookingJob) => acc + (j.pricing?.totalPaid || 0), 0);
    const platformRevenue = localJobs.reduce((acc: number, j: BookingJob) => acc + (j.pricing?.platformCommission || 0) + (j.pricing?.convenienceFee || 0), 0);

    return {
      totalJobs,
      completedJobs,
      gmv,
      platformRevenue,
      activePartnersCount: localPartners.filter((p: GigPartner) => p.isOnline).length,
      verifiedPccCount: localPartners.filter((p: GigPartner) => p.kyc.pccStatus === 'VERIFIED').length,
      averageTakeRate: '15.8%'
    };
  }
};
