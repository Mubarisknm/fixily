// Mock Database & Business Logic Store for Fykzi Kerala

export const KOCHI_LOCATIONS = [
  { id: 'kakkanad', name: 'Kakkanad (InfoPark & Seaport)', pin: '682030', lat: 10.0159, lng: 76.3419 },
  { id: 'edappally', name: 'Edappally (Lulu Mall & Toll)', pin: '682024', lat: 10.0261, lng: 76.3084 },
  { id: 'vyttila', name: 'Vyttila Mobility Hub', pin: '682019', lat: 9.9674, lng: 76.3182 },
  { id: 'fortkochi', name: 'Fort Kochi & Mattancherry', pin: '682001', lat: 9.9648, lng: 76.2427 },
  { id: 'aluva', name: 'Aluva Metro & Bank Junction', pin: '683101', lat: 10.1076, lng: 76.3516 },
  { id: 'trippunithura', name: 'Trippunithura (Statue Junction)', pin: '682301', lat: 9.9482, lng: 76.3478 },
  { id: 'palarivattom', name: 'Palarivattom & Kaloor', pin: '682025', lat: 9.9984, lng: 76.3018 }
];

export const SERVICES = [
  // Phase 1 Wedge Services
  {
    id: 'car-foam-wash',
    phase: 1,
    category: 'Automotive Care',
    title: 'Doorstep Foam Wash & Detailing',
    tagline: 'High-pressure foam jet wash at your driveway.',
    badge: 'Popular Wedge',
    icon: 'Car',
    priceType: 'tiered',
    tiers: [
      { name: 'Hatchback / Small Car', price: 499, duration: '45 mins' },
      { name: 'Sedan / Compact SUV', price: 649, duration: '60 mins' },
      { name: 'Full SUV / Luxury 7-Seater', price: 799, duration: '75 mins' }
    ],
    features: [
      'High-pressure snow foam wash',
      'Underbody jet rinse & tyre dressing',
      'Vacuum & dashboard conditioning',
      'Water tank hookup or portable eco-wash option'
    ],
    rating: 4.9,
    reviewsCount: 384
  },
  {
    id: 'acting-driver',
    phase: 1,
    category: 'Mobility & Drivers',
    title: 'On-Demand Acting Driver ("Drive My Car")',
    tagline: 'Verified professional drivers for your personal vehicle.',
    badge: 'High Demand',
    icon: 'SteeringWheel',
    priceType: 'base_plus_hourly',
    basePrice: 250,
    baseHours: 2,
    extraPricePerHour: 80,
    nightAllowance: 150,
    allowancePolicy: '100% kept by driver (Zero platform commission on return bus fare/batta)',
    features: [
      'Min 3+ years experience with LMV',
      'Kerala Police Thuna PCC Verified',
      'City travel, hospital trips & outstation',
      'Return bus fare / meal batta direct to driver'
    ],
    rating: 4.95,
    reviewsCount: 520
  },
  {
    id: 'urgent-electrical-plumbing',
    phase: 1,
    category: 'Home Repairs',
    title: 'Urgent Electrical & Plumbing Diagnostics',
    tagline: '30-minute doorstep arrival for fuse, leaks & pump issues.',
    badge: 'Emergency Service',
    icon: 'Wrench',
    priceType: 'flat_diagnostic',
    diagnosticFee: 199,
    features: [
      '30 to 45 min urgent dispatch in Kochi',
      'Pre-quoted transparent repair rates',
      'Water pump, inverter & pipe leak specialists',
      'Warranty on replaced spare parts'
    ],
    rating: 4.85,
    reviewsCount: 290
  },

  // Phase 2 Estate & Outdoor Home Care
  {
    id: 'paving-pressure-wash',
    phase: 2,
    category: 'Estate & Outdoor',
    title: 'Compound Wall & Interlock Pressure Wash',
    tagline: 'Deep jet cleaning for mossy interlock tiles & exterior walls.',
    badge: 'Phase 2 Preview',
    icon: 'Sparkles',
    priceType: 'quote',
    estPrice: 1499,
    features: ['High-PSI moss & algae removal', 'Interlock tile restoration', 'Compound wall brightening'],
    rating: 4.9,
    reviewsCount: 45
  },
  {
    id: 'water-tank-cleaning',
    phase: 2,
    category: 'Estate & Outdoor',
    title: 'Overhead Water Tank & Well Sanitization',
    tagline: 'Sludge removal & UV/chlorine treatment for home water systems.',
    badge: 'Phase 2 Preview',
    icon: 'Droplets',
    priceType: 'tiered',
    tiers: [
      { name: 'Up to 1,000 Liters Tank', price: 899, duration: '2 hrs' },
      { name: '2,000+ Liters Multi-tank', price: 1499, duration: '3 hrs' }
    ],
    features: ['Automated sludge vacuuming', 'Antibacterial spray treatment', 'Sediment filter check'],
    rating: 4.88,
    reviewsCount: 62
  },

  // Phase 3 Lifestyle & NRI Stewardship
  {
    id: 'nri-property-care',
    phase: 3,
    category: 'Stewardship & Lifestyle',
    title: 'NRI Annual Property Stewardship',
    tagline: 'Complete caretaking & weekly inspection reports for vacant homes.',
    badge: 'Phase 3 Preview',
    icon: 'ShieldCheck',
    priceType: 'subscription',
    estPrice: 2999,
    features: ['Bi-weekly home ventilation & moisture check', 'CCTV & gate maintenance', 'HD Video inspection reports'],
    rating: 5.0,
    reviewsCount: 18
  },
  {
    id: 'doorstep-salon-makeup',
    phase: 3,
    category: 'Stewardship & Lifestyle',
    title: 'Doorstep Salon & Event Makeup',
    tagline: 'Professional beauticians for home visits & bridal prep.',
    badge: 'Phase 3 Preview',
    icon: 'Scissors',
    priceType: 'quote',
    estPrice: 799,
    features: ['Hygienic single-use kits', 'Bridal & festival styling', 'Certified hair & skin specialists'],
    rating: 4.92,
    reviewsCount: 88
  }
];

export const MOCK_PARTNERS = [
  {
    id: 'p-101',
    name: 'Anand Kumar',
    phone: '+91 98470 11223',
    role: 'Acting Driver',
    rating: 4.96,
    jobsCompleted: 342,
    isOnline: true,
    currentLocation: { name: 'Kakkanad Metro Station', lat: 10.0165, lng: 76.3425 },
    kyc: {
      aadhaarVerified: true,
      dlNumber: 'KL-07-2015-0049281',
      pccStatus: 'VERIFIED' as const,
      pccRefNo: 'THUNA-PCC-2024-88912',
      pccExpiry: '2027-04-15',
      bankVerified: true
    },
    vehicle: 'LMV Driver (Manual & Auto Transmission)',
    walletBalance: 2840,
    todaysEarnings: 1250,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-102',
    name: 'Suhail V.M.',
    phone: '+91 97441 55443',
    role: 'Detailing Specialist',
    rating: 4.91,
    jobsCompleted: 189,
    isOnline: true,
    currentLocation: { name: 'Edappally Toll', lat: 10.0270, lng: 76.3090 },
    kyc: {
      aadhaarVerified: true,
      dlNumber: 'KL-07-2018-0012495',
      pccStatus: 'VERIFIED' as const,
      pccRefNo: 'THUNA-PCC-2024-55109',
      pccExpiry: '2026-11-20',
      bankVerified: true
    },
    equipment: 'Kärcher HD Foam Jet + Portable 100L Water Tank Rig',
    walletBalance: 4120,
    todaysEarnings: 1950,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-103',
    name: 'Rajesh Nair',
    phone: '+91 94472 99881',
    role: 'Licensed Electrician & Plumber',
    rating: 4.88,
    jobsCompleted: 410,
    isOnline: false,
    currentLocation: { name: 'Vyttila Hub', lat: 9.9680, lng: 76.3190 },
    kyc: {
      aadhaarVerified: true,
      dlNumber: 'KL-07-2012-0099182',
      pccStatus: 'VERIFIED' as const,
      pccRefNo: 'THUNA-PCC-2023-11204',
      pccExpiry: '2026-08-10',
      bankVerified: true
    },
    walletBalance: 1560,
    todaysEarnings: 680,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-104',
    name: 'Jibin Varghese',
    phone: '+91 96330 44112',
    role: 'Acting Driver',
    rating: 4.78,
    jobsCompleted: 76,
    isOnline: true,
    currentLocation: { name: 'Palarivattom', lat: 9.9990, lng: 76.3025 },
    kyc: {
      aadhaarVerified: true,
      dlNumber: 'KL-07-2020-0084721',
      pccStatus: 'PENDING_REVIEW' as const,
      pccRefNo: 'THUNA-PCC-2026-99301',
      pccExpiry: 'N/A',
      bankVerified: true
    },
    walletBalance: 920,
    todaysEarnings: 0,
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80'
  }
];

export const MOCK_JOBS = [
  {
    id: 'FIX-8849',
    serviceId: 'car-foam-wash',
    serviceTitle: 'Doorstep Foam Wash & Detailing',
    tierName: 'Sedan / Compact SUV',
    customerName: 'Mathew Thomas (NRI Household)',
    customerPhone: '+91 98950 12345',
    location: {
      address: 'Villa 14, Asset Homes Enclave, Kakkanad',
      microMarket: 'Kakkanad',
      lat: 10.0175,
      lng: 76.3450
    },
    scheduledTime: 'Today, 03:30 PM',
    status: 'IN_PROGRESS' as const,
    assignedPartnerId: 'p-102',
    assignedPartnerName: 'Suhail V.M.',
    assignedPartnerPhone: '+91 97441 55443',
    pricing: {
      baseFare: 649,
      platformCommission: 97,
      partnerEarnings: 552,
      convenienceFee: 35,
      microInsurance: 19,
      totalPaid: 703
    },
    paymentStatus: 'PAID_UPI' as const,
    vehicleDetails: 'Honda City (KL-07-CC-4091) - White',
    preServiceChecklist: {
      completedAt: '2026-09-19 15:32 PM',
      photos: [
        { angle: 'Front Bumper', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80', notes: 'Minor scratch on front left lip' },
        { angle: 'Rear Right Fender', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80', notes: 'Clean condition' },
        { angle: 'Left Side Doors', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80', notes: 'No dents recorded' },
        { angle: 'Interior Dashboard', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop&q=80', notes: 'Pre-wash dust on mats' }
      ]
    },
    createdAt: '2026-09-19T14:45:00.000Z'
  },
  {
    id: 'FIX-8850',
    serviceId: 'acting-driver',
    serviceTitle: 'On-Demand Acting Driver',
    tierName: '4 Hours City Drive + Hospital Trip',
    customerName: 'Dr. Elizabeth Philip',
    customerPhone: '+91 94460 77112',
    location: {
      address: 'Skyline Imperial, Edappally Toll',
      microMarket: 'Edappally',
      lat: 10.0268,
      lng: 76.3088
    },
    scheduledTime: 'Today, 05:00 PM',
    status: 'ASSIGNED' as const,
    assignedPartnerId: 'p-101',
    assignedPartnerName: 'Anand Kumar',
    assignedPartnerPhone: '+91 98470 11223',
    pricing: {
      baseFare: 410,
      allowanceReturnBus: 80,
      platformCommission: 61,
      partnerEarnings: 429,
      convenienceFee: 35,
      microInsurance: 19,
      totalPaid: 544
    },
    paymentStatus: 'PAY_ON_SERVICE' as const,
    vehicleDetails: 'Toyota Innova Crysta (Automatic)',
    preServiceChecklist: null,
    createdAt: '2026-09-19T16:10:00.000Z'
  }
];
