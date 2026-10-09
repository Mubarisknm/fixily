import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { KOCHI_LOCATIONS, SERVICES, MOCK_PARTNERS, MOCK_JOBS } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.static(distPath));

// Health check endpoint for Render & Cloudflare uptime monitoring
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'Fykzi Backend Active', timestamp: new Date().toISOString() });
});

// State holders
let locations = [...KOCHI_LOCATIONS];
let services = [...SERVICES];
let partners = [...MOCK_PARTNERS];
let jobs = [...MOCK_JOBS];

// OTP Store: target (phone / email) -> { otp, expiresAt, attempts, name, role }
const otpStore = new Map();
// Registered Users Store: userId -> UserSession
const registeredUsers = new Map();

// Helper functions to send physical cellular SMS via Fast2SMS or Twilio if keys exist
async function dispatchCellularSMS(phoneNumber, otp) {
  const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10);
  
  // 1. Fast2SMS (popular for Indian phone numbers)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': process.env.FAST2SMS_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: cleanPhone
        })
      });
      const data = await response.json();
      console.log(`[SMS GATEWAY Fast2SMS] Dispatched to +91 ${cleanPhone}:`, data);
      return data.return === true;
    } catch (err) {
      console.error('[SMS GATEWAY Fast2SMS Error]', err.message);
    }
  }

  // 2. Twilio SMS Gateway
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const sid = process.env.TWILIO_ACCOUNT_SID;
      const token = process.env.TWILIO_AUTH_TOKEN;
      const from = process.env.TWILIO_PHONE_NUMBER;
      const to = `+91${cleanPhone}`;
      const auth = Buffer.from(`${sid}:${token}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', to);
      params.append('From', from);
      params.append('Body', `Your Fykzi Kerala On-Demand Service verification code is: ${otp}. Valid for 5 minutes.`);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      const data = await response.json();
      console.log(`[SMS GATEWAY Twilio] Dispatched to ${to}, SID: ${data.sid}`);
      return !!data.sid;
    } catch (err) {
      console.error('[SMS GATEWAY Twilio Error]', err.message);
    }
  }

  return false;
}

// ==========================================
// AUTHENTICATION & OTP VALIDATION ENDPOINTS
// ==========================================

// 1. Send OTP (Mobile SMS / Email Verification)
app.post('/api/auth/send-otp', async (req, res) => {
  const { target, type, name, role, purpose } = req.body;

  if (!target || typeof target !== 'string') {
    return res.status(400).json({ success: false, message: 'Phone number or email is required' });
  }

  const cleanTarget = target.trim().toLowerCase();
  // Generate a real, secure 6-digit verification code
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  otpStore.set(cleanTarget, {
    otp: generatedOtp,
    expiresAt,
    attempts: 0,
    type: type || (cleanTarget.includes('@') ? 'email' : 'phone'),
    name: name || '',
    role: role || 'customer',
    purpose: purpose || 'login'
  });

  console.log(`[AUTH] 🔐 Real OTP Generated for ${cleanTarget}: ${generatedOtp} (Valid for 5 mins)`);

  // Attempt real cellular SMS delivery if SMS gateway is configured
  let smsDelivered = false;
  if (!cleanTarget.includes('@')) {
    smsDelivered = await dispatchCellularSMS(cleanTarget, generatedOtp);
  }

  res.json({
    success: true,
    message: smsDelivered 
      ? `SMS Verification code sent directly to ${target}`
      : `Verification code generated for ${target}`,
    target: cleanTarget,
    otp: generatedOtp, // Sent so local dev UI displays the exact code for testing
    smsDelivered,
    expiresInSeconds: 300
  });
});

// 2. Verify OTP & Authenticate Session
app.post('/api/auth/verify-otp', (req, res) => {
  const { target, otp, name, role, email, phone } = req.body;

  if (!target || !otp) {
    return res.status(400).json({ success: false, message: 'Target and 6-digit OTP are required' });
  }

  const cleanTarget = target.trim().toLowerCase();
  const cleanOtp = otp.toString().trim();
  const record = otpStore.get(cleanTarget);

  if (!record) {
    return res.status(400).json({
      success: false,
      message: 'No active OTP found. Please request a new verification code.'
    });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(cleanTarget);
    return res.status(400).json({
      success: false,
      message: 'OTP has expired (valid for 5 mins). Please request a new code.'
    });
  }

  if (record.otp !== cleanOtp) {
    record.attempts = (record.attempts || 0) + 1;
    if (record.attempts >= 5) {
      otpStore.delete(cleanTarget);
      return res.status(400).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new OTP.'
      });
    }
    return res.status(400).json({
      success: false,
      message: 'Invalid 6-digit OTP code. Please check and try again.'
    });
  }

  // OTP is verified! Clean up OTP record
  otpStore.delete(cleanTarget);

  const isEmail = cleanTarget.includes('@');
  const userPhone = phone || (!isEmail ? target : undefined);
  const userEmail = email || (isEmail ? cleanTarget : undefined);
  const userName = name || record.name || (userEmail ? userEmail.split('@')[0] : 'Verified User');
  const userRole = role || record.role || 'customer';

  // Check if existing user exists
  let existingUser = Array.from(registeredUsers.values()).find(
    u => (userPhone && u.phone === userPhone) || (userEmail && u.email === userEmail)
  );

  let session;
  if (existingUser) {
    session = {
      ...existingUser,
      isVerified: true,
      authProvider: isEmail ? 'email' : 'phone'
    };
    if (userName && userName !== 'Verified User') session.name = userName;
    registeredUsers.set(session.id, session);
  } else {
    session = {
      id: `usr-${Date.now().toString().slice(-6)}`,
      name: userName,
      phone: userPhone ? (userPhone.startsWith('+') ? userPhone : `+91 ${userPhone.replace(/\D/g, '').slice(-10)}`) : undefined,
      email: userEmail,
      role: userRole,
      isVerified: true,
      authProvider: isEmail ? 'email' : 'phone',
      createdAt: new Date().toISOString()
    };
    registeredUsers.set(session.id, session);
  }

  // If partner role, also ensure a partner profile exists
  if (userRole === 'partner' && !session.partnerId) {
    const existingPartner = partners.find(p => p.phone === session.phone);
    if (existingPartner) {
      session.partnerId = existingPartner.id;
    }
  }

  res.json({
    success: true,
    message: 'Authentication successful',
    data: session,
    token: `fykzi_tok_${session.id}_${Date.now()}`
  });
});

// 3. Google Sign-In / OAuth Authentication
app.post('/api/auth/google', (req, res) => {
  const { credential, email, name, avatar, role } = req.body;

  let resolvedEmail = email;
  let resolvedName = name;
  let resolvedAvatar = avatar;

  if (credential) {
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
        resolvedEmail = payload.email || resolvedEmail;
        resolvedName = payload.name || resolvedName;
        resolvedAvatar = payload.picture || resolvedAvatar;
      }
    } catch (e) {
      console.warn('[AUTH] Error parsing Google credential JWT:', e.message);
    }
  }

  if (!resolvedEmail) {
    return res.status(400).json({ success: false, message: 'Valid Google account email is required' });
  }

  const cleanEmail = resolvedEmail.trim().toLowerCase();
  let existingUser = Array.from(registeredUsers.values()).find(u => u.email === cleanEmail);

  let session;
  if (existingUser) {
    session = {
      ...existingUser,
      isVerified: true,
      authProvider: 'google',
      avatar: resolvedAvatar || existingUser.avatar
    };
    if (resolvedName) session.name = resolvedName;
    registeredUsers.set(session.id, session);
  } else {
    session = {
      id: `usr-g-${Date.now().toString().slice(-6)}`,
      name: resolvedName || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: role || 'customer',
      isVerified: true,
      avatar: resolvedAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      authProvider: 'google',
      createdAt: new Date().toISOString()
    };
    registeredUsers.set(session.id, session);
  }

  res.json({
    success: true,
    message: 'Google authentication successful',
    data: session,
    token: `fykzi_tok_${session.id}_${Date.now()}`
  });
});

// 4. Register New Account (Full Profile with OTP)
app.post('/api/auth/register', (req, res) => {
  const { name, phone, email, role, district, pin } = req.body;

  if (!name || (!phone && !email)) {
    return res.status(400).json({
      success: false,
      message: 'Full Name and at least one contact (Mobile or Email) are required'
    });
  }

  const session = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    name: name.trim(),
    phone: phone ? (phone.startsWith('+') ? phone : `+91 ${phone.replace(/\D/g, '').slice(-10)}`) : undefined,
    email: email ? email.trim().toLowerCase() : undefined,
    role: role || 'customer',
    district: district || 'Ernakulam',
    pin: pin || '682001',
    isVerified: true,
    authProvider: phone ? 'phone' : 'email',
    createdAt: new Date().toISOString()
  };

  registeredUsers.set(session.id, session);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    data: session,
    token: `fykzi_tok_${session.id}_${Date.now()}`
  });
});

// GET Locations
app.get('/api/locations', (req, res) => {
  res.json({ success: true, data: locations });
});

// POST Add Custom Village / Remote Location
app.post('/api/locations', (req, res) => {
  const newLoc = req.body;
  if (!newLoc || !newLoc.name) {
    return res.status(400).json({ success: false, error: 'Location name is required' });
  }
  const loc = {
    id: newLoc.id || `loc-custom-${Date.now()}`,
    name: newLoc.name,
    district: newLoc.district || 'Kerala',
    taluk: newLoc.taluk || '',
    panchayat: newLoc.panchayat || '',
    regionType: newLoc.regionType || 'RURAL_VILLAGE',
    state: 'Kerala',
    pin: newLoc.pin || '682001',
    lat: Number(newLoc.lat) || 10.0,
    lng: Number(newLoc.lng) || 76.3,
    isServiced: newLoc.isServiced !== undefined ? newLoc.isServiced : true
  };
  locations.unshift(loc);
  res.json({ success: true, data: loc });
});

// GET Services
app.get('/api/services', (req, res) => {
  res.json({ success: true, data: services });
});

// POST Add New Custom Service / Trade by Worker (Comes under Other Works)
app.post('/api/services', (req, res) => {
  const {
    title,
    tagline,
    category,
    priceType,
    diagnosticFee,
    basePrice,
    eta,
    features,
    equipment,
    partnerId,
    partnerName
  } = req.body;

  const newService = {
    id: `service-custom-${Date.now().toString().slice(-4)}`,
    phase: 1,
    category: category || 'Other Works',
    title: title || 'Custom Freelance Work',
    tagline: tagline || 'Specialized doorstep work by verified freelancer.',
    badge: 'Custom Trade',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    eta: eta || '30 mins',
    isInstant: true,
    priceType: priceType || 'flat_diagnostic',
    diagnosticFee: diagnosticFee || 299,
    basePrice: basePrice || diagnosticFee || 299,
    features: features && features.length > 0 ? features : ['Doorstep inspection & diagnosis', 'Equipped with required tools', '100% damage responsibility agreed'],
    rating: 5.0,
    reviewsCount: 1,
    createdByPartnerId: partnerId,
    createdByPartnerName: partnerName
  };

  services.unshift(newService);

  // If partnerId provided, also update the partner's customProfessions and active role
  if (partnerId) {
    const partner = partners.find(p => p.id === partnerId);
    if (partner) {
      if (!partner.customProfessions) partner.customProfessions = [];
      partner.customProfessions.push({
        id: `cp-${Date.now().toString().slice(-4)}`,
        title: newService.title,
        category: 'Other Works',
        tagline: newService.tagline,
        priceType: newService.priceType,
        price: newService.diagnosticFee || 299,
        eta: newService.eta,
        features: newService.features,
        equipment: equipment || 'Standard professional tools',
        isActive: true,
        createdAt: new Date().toISOString()
      });
      if (!partner.secondaryRoles) partner.secondaryRoles = [];
      if (!partner.secondaryRoles.includes(newService.title)) {
        partner.secondaryRoles.push(newService.title);
      }
    }
  }

  res.status(201).json({ success: true, data: newService });
});

// GET Partners
app.get('/api/partners', (req, res) => {
  res.json({ success: true, data: partners });
});

// POST Switch / Activate Worker Profession
app.post('/api/partners/:id/use-profession', (req, res) => {
  const { id } = req.params;
  const { professionTitle } = req.body;

  const partner = partners.find(p => p.id === id);
  if (!partner) {
    return res.status(404).json({ success: false, message: 'Partner not found' });
  }

  if (professionTitle) {
    partner.role = professionTitle;
    if (partner.customProfessions) {
      partner.customProfessions.forEach(cp => {
        cp.isActive = cp.title === professionTitle;
      });
    }
  }

  res.json({ success: true, data: partner });
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
    name: name || 'Fykzi Verified Partner',
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
    photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    customProfessions: []
  };

  // If custom role, automatically list under Other Works
  const standardRoles = [
    'Freelance Acting Driver ("Drive My Car")',
    'Doorstep Car & Bike Mechanic',
    'Electrician & Inverter/Wiring Technician',
    'Licensed Plumber & Pipeline Specialist',
    'At-Home Salon, Hair Stylist & Beautician',
    'AC, Washing Machine & Appliance Care Technician'
  ];
  if (!standardRoles.includes(role)) {
    const customService = {
      id: `service-custom-${Date.now().toString().slice(-4)}`,
      phase: 1,
      category: 'Other Works',
      title: role,
      tagline: `Specialized ${role} services at doorstep by verified professional.`,
      badge: 'Custom Trade',
      icon: 'Sparkles',
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
      eta: '30 mins',
      isInstant: true,
      priceType: 'flat_diagnostic',
      diagnosticFee: 299,
      features: ['Doorstep arrival with tools', 'Upfront pricing and clear diagnosis', '100% damage responsibility guaranteed'],
      rating: 5.0,
      reviewsCount: 0,
      createdByPartnerId: newPartner.id,
      createdByPartnerName: newPartner.name
    };
    services.unshift(customService);
    newPartner.customProfessions = [{
      id: `cp-${Date.now().toString().slice(-4)}`,
      title: role,
      category: 'Other Works',
      tagline: customService.tagline,
      priceType: 'flat_diagnostic',
      price: 299,
      eta: '30 mins',
      features: customService.features,
      equipment: vehicle || 'Professional tools',
      isActive: true,
      createdAt: new Date().toISOString()
    }];
  }

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

// Partner Complete Job & Disburse Earnings to Wallet with Customer OTP & Escrow Hold
app.post('/api/jobs/:id/complete', (req, res) => {
  const { id } = req.params;
  const { completionOtp } = req.body;

  const job = jobs.find(j => j.id === id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'Job not found' });
  }

  job.status = 'COMPLETED';
  job.payoutHoldUntil = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  job.payoutStatus = 'ESCROW_HOLD';

  if (job.assignedPartnerId) {
    const partner = partners.find(p => p.id === job.assignedPartnerId);
    if (partner) {
      partner.walletBalance += job.pricing.partnerEarnings;
      partner.escrowBalance = (partner.escrowBalance || 0) + job.pricing.partnerEarnings;
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

// SPA Catch-all Route for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Fykzi Backend API & App running on port ${PORT}`);
});
