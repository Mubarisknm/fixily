import express from 'express';
import cors from 'cors';
import { KOCHI_LOCATIONS, SERVICES, MOCK_PARTNERS, MOCK_JOBS } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint for Render & Cloudflare uptime monitoring
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Fixily Backend Active', timestamp: new Date().toISOString() });
});

// State holders
let partners = [...MOCK_PARTNERS];
let jobs = [...MOCK_JOBS];

// GET Locations
app.get('/api/locations', (req, res) => {
  res.json({ success: true, data: KOCHI_LOCATIONS });
});

// GET Services
app.get('/api/services', (req, res) => {
  res.json({ success: true, data: SERVICES });
});

// GET Partners
app.get('/api/partners', (req, res) => {
  res.json({ success: true, data: partners });
});

// POST Register New Partner / Onboarding with KYC
app.post('/api/partners', (req, res) => {
  const {
    name,
    phone,
    role,
    city,
    vehicle,
    dlNumber,
    aadhaarNumber,
    pccRefNo,
    pccExpiry,
    upiId,
    photoUrl
  } = req.body;

  const newPartner = {
    id: `p-${Date.now().toString().slice(-4)}`,
    name: name || 'Fixily Verified Partner',
    phone: phone || '+91 98470 00000',
    role: role || 'Freelance Service Partner',
    rating: 5.0,
    jobsCompleted: 0,
    isOnline: true,
    currentLocation: {
      name: city || 'Kochi Hub',
      lat: 10.0159,
      lng: 76.3419
    },
    kyc: {
      aadhaarVerified: Boolean(aadhaarNumber),
      dlNumber: dlNumber || undefined,
      pccStatus: pccRefNo ? 'VERIFIED' : 'PENDING_REVIEW',
      pccRefNo: pccRefNo || 'THUNA-PCC-SUBMITTED',
      pccExpiry: pccExpiry || '2027-09-30',
      bankVerified: true
    },
    vehicle: vehicle || 'Standard Service Kit',
    walletBalance: 250, // Welcome joining bonus
    todaysEarnings: 0,
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
  };

  partners.unshift(newPartner);
  res.status(201).json({ success: true, data: newPartner });
});

// Toggle Partner Online Status
app.post('/api/partners/:id/duty', (req, res) => {
  const { id } = req.params;
  const { isOnline } = req.body;
  
  const partner = partners.find(p => p.id === id);
  if (!partner) {
    return res.status(404).json({ success: false, message: 'Partner not found' });
  }
  partner.isOnline = Boolean(isOnline);
  res.json({ success: true, data: partner });
});

// Admin Approve Partner KYC & PCC Document
app.post('/api/partners/:id/kyc', (req, res) => {
  const { id } = req.params;
  const { pccStatus, pccRefNo } = req.body;

  const partner = partners.find(p => p.id === id);
  if (!partner) {
    return res.status(404).json({ success: false, message: 'Partner not found' });
  }

  partner.kyc.pccStatus = pccStatus || 'VERIFIED';
  if (pccRefNo) partner.kyc.pccRefNo = pccRefNo;
  partner.kyc.aadhaarVerified = true;
  partner.kyc.bankVerified = true;

  res.json({ success: true, data: partner });
});

// Partner Instant 1-Tap UPI Cashout
app.post('/api/partners/:id/withdraw', (req, res) => {
  const { id } = req.params;
  const { amount, upiId } = req.body;

  const partner = partners.find(p => p.id === id);
  if (!partner) {
    return res.status(404).json({ success: false, message: 'Partner not found' });
  }

  const withdrawAmount = amount || partner.walletBalance;
  if (withdrawAmount <= 0 || withdrawAmount > partner.walletBalance) {
    return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
  }

  partner.walletBalance -= withdrawAmount;
  res.json({
    success: true,
    message: `₹${withdrawAmount} disbursed to ${upiId || 'partner@upi'} via Instant RazorpayX UPI Intent`,
    data: { walletBalance: partner.walletBalance }
  });
});

// GET Jobs
app.get('/api/jobs', (req, res) => {
  res.json({ success: true, data: jobs });
});

// POST Customer Create Booking
app.post('/api/jobs', (req, res) => {
  const {
    serviceId,
    tierName,
    customerName,
    customerPhone,
    microMarket,
    address,
    scheduledTime,
    targetDate,
    targetTimeSlot,
    preferredPartnerId,
    preferredPartnerName,
    vehicleDetails,
    paymentMethod
  } = req.body;

  const service = SERVICES.find(s => s.id === serviceId);
  if (!service) {
    return res.status(400).json({ success: false, message: 'Invalid service selected' });
  }

  let baseFare = 499;
  if (service.tiers && tierName) {
    const tier = service.tiers.find(t => t.name === tierName);
    if (tier) baseFare = tier.price;
  } else if (service.basePrice) {
    baseFare = service.basePrice;
  }

  const convenienceFee = 35;
  const microInsurance = 19;
  const platformCommission = Math.round(baseFare * 0.15);
  const partnerEarnings = baseFare - platformCommission;

  const newJob = {
    id: `FIX-${Math.floor(1000 + Math.random() * 9000)}`,
    serviceId,
    serviceTitle: service.title,
    tierName: tierName || service.tagline,
    customerName: customerName || 'Kochi Customer',
    customerPhone: customerPhone || '+91 98950 00000',
    location: {
      address: address || 'Kakkanad, Kochi',
      microMarket: microMarket || 'Kakkanad',
      lat: 10.0159 + (Math.random() - 0.5) * 0.02,
      lng: 76.3419 + (Math.random() - 0.5) * 0.02
    },
    scheduledTime: scheduledTime || (targetDate && targetTimeSlot ? `${targetDate} (${targetTimeSlot})` : 'Immediate Dispatch'),
    targetDate: targetDate || new Date().toISOString().split('T')[0],
    targetTimeSlot: targetTimeSlot || 'Immediate Dispatch',
    preferredPartnerId: preferredPartnerId || null,
    preferredPartnerName: preferredPartnerName || null,
    status: preferredPartnerId ? 'ASSIGNED' : 'PENDING',
    assignedPartnerId: preferredPartnerId || null,
    assignedPartnerName: preferredPartnerName || null,
    pricing: {
      baseFare,
      platformCommission,
      partnerEarnings,
      convenienceFee,
      microInsurance,
      totalPaid: baseFare + convenienceFee + microInsurance
    },
    paymentStatus: paymentMethod === 'COD' ? 'PAY_ON_SERVICE' : 'PAID_UPI',
    vehicleDetails: vehicleDetails || 'N/A',
    preServiceChecklist: null,
    createdAt: new Date().toISOString()
  };

  jobs.unshift(newJob);
  res.status(201).json({ success: true, data: newJob });
});

// Customer Submit Rating & Review for Completed Job
app.post('/api/jobs/:id/feedback', (req, res) => {
  const { id } = req.params;
  const { rating, comment, serviceQualityRating, punctualityRating, zeroDamageConfirmed } = req.body;

  const job = jobs.find(j => j.id === id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  job.customerFeedback = {
    rating: Number(rating) || 5,
    comment: comment || 'Service completed satisfactorily.',
    serviceQualityRating: Number(serviceQualityRating) || 5,
    punctualityRating: Number(punctualityRating) || 5,
    zeroDamageConfirmed: Boolean(zeroDamageConfirmed),
    createdAt: new Date().toISOString()
  };

  // Dynamically update assigned partner trust score, rating and reviews
  if (job.assignedPartnerId) {
    const partner = partners.find(p => p.id === job.assignedPartnerId);
    if (partner) {
      if (!partner.reviews) partner.reviews = [];
      partner.reviews.unshift({
        id: `rev-${Date.now().toString().slice(-4)}`,
        customerName: job.customerName,
        rating: Number(rating) || 5,
        comment: comment || 'Service completed satisfactorily.',
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

  res.json({ success: true, data: job });
});

// Partner Accept Job
app.post('/api/jobs/:id/accept', (req, res) => {
  const { id } = req.params;
  const { partnerId } = req.body;

  const job = jobs.find(j => j.id === id);
  const partner = partners.find(p => p.id === partnerId);

  if (!job || !partner) {
    return res.status(404).json({ success: false, message: 'Job or Partner not found' });
  }

  job.status = 'ASSIGNED';
  job.assignedPartnerId = partner.id;
  job.assignedPartnerName = partner.name;
  job.assignedPartnerPhone = partner.phone;

  res.json({ success: true, data: job });
});

// Partner Upload Pre-Service Inspection Checklist (4-Angle Photos)
app.post('/api/jobs/:id/precheck', (req, res) => {
  const { id } = req.params;
  const { photos } = req.body;

  const job = jobs.find(j => j.id === id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  job.preServiceChecklist = {
    completedAt: new Date().toLocaleString(),
    photos: photos || [
      { angle: 'Front Angle', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80', notes: 'Pre-service photo verified' },
      { angle: 'Rear Angle', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80', notes: 'Pre-service photo verified' },
      { angle: 'Left Flank', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80', notes: 'No prior damage' },
      { angle: 'Right Flank', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop&q=80', notes: 'Recorded' }
    ]
  };
  job.status = 'IN_PROGRESS';

  res.json({ success: true, data: job });
});

// Partner Complete Job & Disburse Earnings to Wallet
app.post('/api/jobs/:id/complete', (req, res) => {
  const { id } = req.params;

  const job = jobs.find(j => j.id === id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  job.status = 'COMPLETED';

  if (job.assignedPartnerId) {
    const partner = partners.find(p => p.id === job.assignedPartnerId);
    if (partner) {
      partner.walletBalance += job.pricing.partnerEarnings;
      partner.todaysEarnings += job.pricing.partnerEarnings;
      partner.jobsCompleted += 1;
      // Increment weekly target progress
      if (partner.targetAchievement) {
        partner.targetAchievement.completedJobsThisWeek += 1;
        if (partner.targetAchievement.completedJobsThisWeek >= partner.targetAchievement.weeklyTarget) {
          partner.targetAchievement.isBonusUnlocked = true;
          partner.walletBalance += partner.targetAchievement.bonusAmount;
          partner.todaysEarnings += partner.targetAchievement.bonusAmount;
        }
      }
    }
  }

  res.json({ success: true, data: job });
});

// Admin Analytics Stats
app.get('/api/stats', (req, res) => {
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED').length;
  const gmv = jobs.reduce((acc, j) => acc + (j.pricing?.totalPaid || 0), 0);
  const platformRevenue = jobs.reduce((acc, j) => acc + (j.pricing?.platformCommission || 0) + (j.pricing?.convenienceFee || 0), 0);
  const activePartnersCount = partners.filter(p => p.isOnline).length;
  const verifiedPccCount = partners.filter(p => p.kyc.pccStatus === 'VERIFIED').length;

  res.json({
    success: true,
    data: {
      totalJobs,
      completedJobs,
      gmv,
      platformRevenue,
      activePartnersCount,
      verifiedPccCount,
      averageTakeRate: '15.8%'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Fixily Backend API running on port ${PORT}`);
});
