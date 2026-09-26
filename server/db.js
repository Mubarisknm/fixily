// Mock Database & Business Logic Store for Fixily Kerala — Expanded Service Categories with Mechanic

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
  // 1. Mechanic & Roadside Assistance (NEW)
  {
    id: 'doorstep-mechanic',
    phase: 1,
    category: 'Mechanic & Roadside Assistance',
    title: 'Doorstep Car & Bike Mechanic',
    tagline: 'Breakdown jumpstart, engine diagnostic, brake fix & towing.',
    badge: 'Roadside Rescue',
    icon: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
    eta: '20 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 299,
    features: ['20-minute emergency breakdown arrival', 'Battery jumpstart & alternator test', 'Brake pad & engine diagnostic'],
    rating: 4.95,
    reviewsCount: 480
  },

  // 2. Vehicle Care (Doorstep)
  {
    id: 'car-foam-wash',
    phase: 1,
    category: 'Vehicle Care',
    title: 'Doorstep Foam Wash & Detailing',
    tagline: 'High-pressure foam jet wash at your driveway.',
    badge: 'Popular Wedge',
    icon: 'Car',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: 'Hatchback / Small Car', price: 499, duration: '45 mins' },
      { name: 'Sedan / Compact SUV', price: 649, duration: '60 mins' },
      { name: 'Full SUV / Luxury 7-Seater', price: 799, duration: '75 mins' }
    ],
    features: ['High-pressure snow foam wash', 'Underbody jet rinse & tyre dressing', 'Vacuum & dashboard conditioning'],
    rating: 4.92,
    reviewsCount: 384
  },

  // 3. Driver (Freelance Drivers - Mandatory Thuna PCC)
  {
    id: 'acting-driver',
    phase: 1,
    category: 'Driver',
    title: 'Freelance Acting Driver ("Drive My Car")',
    tagline: 'Kerala Police Thuna PCC Verified Drivers for your vehicle.',
    badge: 'Thuna PCC Verified',
    icon: 'UserCheck',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80',
    eta: '25 mins',
    isInstant: true,
    priceType: 'base_plus_hourly',
    basePrice: 250,
    baseHours: 2,
    extraPricePerHour: 80,
    nightAllowance: 150,
    allowancePolicy: '100% kept by driver (Zero platform commission on return bus fare/batta)',
    features: [
      'Mandatory Kerala Police Thuna PCC Verification',
      'Minimum 3+ years LMV driving experience',
      'City travel, hospital trips & outstation',
      'Return bus fare & meal batta 100% to driver'
    ],
    rating: 4.95,
    reviewsCount: 520
  },

  // 4. Electrical Services
  {
    id: 'electrician-consultation',
    phase: 1,
    category: 'Electrical Services',
    title: 'Electrician Consultation & Wiring Repairs',
    tagline: 'Fuse, inverter wiring, switchboards & lighting fixes.',
    badge: 'Emergency Service',
    icon: 'Zap',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 149,
    features: ['30-minute doorstep arrival', 'Short circuit & fuse diagnostics', 'Inverter & MCB switchboard installation'],
    rating: 4.88,
    reviewsCount: 412
  },

  // 5. Plumbing & Water Management
  {
    id: 'plumber-consultation',
    phase: 1,
    category: 'Plumbing & Water Management',
    title: 'Plumber Consultation & Pipe Leak Repairs',
    tagline: 'Water pump repair, tap leaks, flush tank & pipe fitting.',
    badge: 'Urgent Repair',
    icon: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    eta: '35 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 149,
    features: ['Water pump motor troubleshooting', 'Flush tank & hidden leakage fix', 'Sanitaryware tap & shower fitting'],
    rating: 4.86,
    reviewsCount: 368
  },

  // 6. Carpenter & Locksmith (NEW)
  {
    id: 'carpenter-services',
    phase: 1,
    category: 'Carpenter & Locksmith',
    title: 'Doorstep Carpenter & Lock Installation',
    tagline: 'Door hinge fix, furniture assembly, lock replacement & woodwork.',
    badge: 'Woodwork Care',
    icon: 'Hammer',
    imageUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 149,
    features: ['Door lock & handle installation', 'Modular kitchen hinge adjustment', 'Furniture repair & custom woodwork'],
    rating: 4.89,
    reviewsCount: 310
  },

  // 7. Painter & Waterproofing (NEW)
  {
    id: 'painter-waterproofing',
    phase: 2,
    category: 'Painter & Waterproofing',
    title: 'Wall Touchup & Roof Waterproofing',
    tagline: 'Dampness treatment, wall putty, touchup paint & roof sealant.',
    badge: 'Wall & Roof Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'quote',
    estPrice: 499,
    features: ['Wall dampness seepage check', 'Putty & primer coat application', 'Terrace waterproof coating'],
    rating: 4.90,
    reviewsCount: 175
  },

  // 8. CCTV & Smart Security (NEW)
  {
    id: 'cctv-security',
    phase: 1,
    category: 'CCTV & Smart Security',
    title: 'CCTV Installation & Smart Lock Setup',
    tagline: 'IP camera wiring, DVR setup, smart lock & video doorbell.',
    badge: 'Home Protection',
    icon: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
    eta: '35 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 399,
    features: ['WiFi IP camera installation', 'DVR hard disk configuration', 'Mobile remote live view setup'],
    rating: 4.93,
    reviewsCount: 220
  },

  // 9. Appliance Care & Servicing
  {
    id: 'appliance-care',
    phase: 1,
    category: 'Appliance Care & Servicing',
    title: 'AC, Washing Machine & Chimney Servicing',
    tagline: 'Foam jet AC service, washing machine repair & chimney deep clean.',
    badge: 'Cooling & Appliances',
    icon: 'Cpu',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 299,
    features: ['High-pressure AC foam jet cleaning', 'Washing machine drum & motor fix', 'Kitchen chimney oil degreasing'],
    rating: 4.89,
    reviewsCount: 298
  },

  // 10. Deep Cleaning & Housekeeping
  {
    id: 'deep-cleaning',
    phase: 1,
    category: 'Deep Cleaning & Housekeeping',
    title: 'Full House Deep Cleaning & Housekeeping',
    tagline: 'Comprehensive home sanitization, kitchen & bathroom deep scrub.',
    badge: 'Home Hygiene',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    eta: '60 mins',
    isInstant: false,
    priceType: 'tiered',
    tiers: [
      { name: '1-2 BHK Apartment Deep Clean', price: 1299, duration: '3 hrs' },
      { name: '3-4 BHK Villa Deep Clean', price: 2499, duration: '5 hrs' }
    ],
    features: ['Single-use eco-friendly chemicals', 'Bathroom tile stain scrubbing', 'Window glass & furniture polish'],
    rating: 4.91,
    reviewsCount: 195
  },

  // 11. Outdoor & Property Maintenance
  {
    id: 'paving-pressure-wash',
    phase: 2,
    category: 'Outdoor & Property Maintenance',
    title: 'Compound Wall & Interlock Pressure Wash',
    tagline: 'Deep jet cleaning for mossy interlock tiles & exterior walls.',
    badge: 'Estate Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'quote',
    estPrice: 1499,
    features: ['High-PSI moss & algae removal', 'Interlock tile restoration', 'Compound wall brightening'],
    rating: 4.90,
    reviewsCount: 45
  },

  // 12. NRI / Absentee Property Stewardship
  {
    id: 'nri-property-care',
    phase: 2,
    category: 'NRI / Absentee Property Stewardship',
    title: 'NRI Vacant House Caretaking & Stewardship',
    tagline: 'Bi-weekly ventilation, security check & video reports for vacant homes.',
    badge: 'NRI Special',
    icon: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    eta: 'Scheduled',
    isInstant: false,
    priceType: 'subscription',
    estPrice: 2999,
    features: ['Bi-weekly home ventilation & moisture check', 'CCTV & gate maintenance', 'HD Video inspection reports'],
    rating: 5.0,
    reviewsCount: 18
  },

  // 13. Personal Grooming & At-Home Wellness
  {
    id: 'doorstep-salon-makeup',
    phase: 2,
    category: 'Personal Grooming & At-Home Wellness',
    title: 'Doorstep Salon, Waxing & Massage Wellness',
    tagline: 'Certified beauticians & massage therapists at home.',
    badge: 'At-Home Spa',
    icon: 'Scissors',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'quote',
    estPrice: 799,
    features: ['Hygienic single-use kits', 'Bridal & festival styling', 'Therapeutic spa massage'],
    rating: 4.92,
    reviewsCount: 88
  },

  // 14. Rental Cars & Taxi Services
  {
    id: 'rental-cars-taxi',
    phase: 1,
    category: 'Rental Cars & Taxi Services',
    title: 'Chauffeur Outstation Taxi & Self-Drive Rentals',
    tagline: 'Premium sedan/SUV airport transfer & outstation taxi.',
    badge: 'Mobility Hub',
    icon: 'Navigation',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    eta: '20 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: 'Kochi Airport Transfer Sedan', price: 999, duration: '60 mins' },
      { name: 'Outstation 12-Hour Innova Taxi', price: 2499, duration: '12 hrs' }
    ],
    features: ['Verified chauffeur drivers with Thuna PCC', 'Clean sanitized AC vehicles', 'Luggage assistance'],
    rating: 4.87,
    reviewsCount: 310
  },

  // 15. Laptop and Mobile Phone Repair
  {
    id: 'device-repair',
    phase: 1,
    category: 'Laptop and Mobile Phone Repair',
    title: 'Doorstep Mobile & Laptop Repair',
    tagline: 'Screen replacement, battery swap & motherboard diagnostic.',
    badge: 'Tech Repair',
    icon: 'Smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 299,
    features: ['30-minute doorstep pickup/repair', 'Original OEM screens & batteries', '6-month repair warranty'],
    rating: 4.85,
    reviewsCount: 260
  },

  // 16. Water Supply
  {
    id: 'water-supply-tanker',
    phase: 1,
    category: 'Water Supply',
    title: 'Emergency Drinking Water Tanker Delivery',
    tagline: '5,000L / 10,000L purified water delivery for homes & apartments.',
    badge: 'Essential Supply',
    icon: 'Droplet',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    eta: '40 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: '5,000 Liters Water Tanker', price: 899, duration: '45 mins' },
      { name: '10,000 Liters Water Tanker', price: 1599, duration: '60 mins' }
    ],
    features: ['Lab-tested purified drinking water', 'High-flow pump hose connection', '24/7 emergency dispatch'],
    rating: 4.90,
    reviewsCount: 410
  }
];

export const MOCK_PARTNERS = [
  {
    id: 'p-101',
    name: 'Anand Kumar',
    phone: '+91 98470 11223',
    role: 'Freelance Acting Driver & Mechanic',
    rating: 4.96,
    jobsCompleted: 342,
    isOnline: true,
    currentLocation: { name: 'Kakkanad Metro Station', lat: 10.0165, lng: 76.3425 },
    kyc: {
      aadhaarVerified: true,
      dlNumber: 'KL-07-2015-0049281',
      pccStatus: 'VERIFIED',
      pccRefNo: 'THUNA-PCC-2024-88912',
      pccExpiry: '2027-04-15',
      bankVerified: true
    },
    vehicle: 'LMV Driver & Mechanic Toolkit',
    walletBalance: 2840,
    todaysEarnings: 1250,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const MOCK_JOBS = [
  {
    id: 'FIX-8849',
    serviceId: 'doorstep-mechanic',
    serviceTitle: 'Doorstep Car & Bike Mechanic',
    tierName: 'Engine Diagnostic & Battery Jumpstart',
    customerName: 'Mathew Thomas (NRI Household)',
    customerPhone: '+91 98950 12345',
    location: {
      address: 'Villa 14, Asset Homes Enclave, Kakkanad',
      microMarket: 'Kakkanad',
      lat: 10.0175,
      lng: 76.3450
    },
    scheduledTime: 'Today, 03:30 PM',
    status: 'IN_PROGRESS',
    assignedPartnerId: 'p-101',
    assignedPartnerName: 'Anand Kumar',
    assignedPartnerPhone: '+91 98470 11223',
    pricing: {
      baseFare: 299,
      platformCommission: 45,
      partnerEarnings: 254,
      convenienceFee: 35,
      microInsurance: 19,
      totalPaid: 353
    },
    paymentStatus: 'PAID_UPI',
    vehicleDetails: 'Honda City (KL-07-CC-4091) - Engine Trouble',
    createdAt: '2026-09-26T10:45:00.000Z'
  }
];
