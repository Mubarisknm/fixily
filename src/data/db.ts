// Mock Database & Business Logic Store for Fixily Kerala
import { KochiLocation, ServiceItem, GigPartner, BookingJob } from '../types';

export const KOCHI_LOCATIONS: KochiLocation[] = [
  // Active Kerala Hubs
  { id: 'kakkanad', name: 'Kakkanad (InfoPark & SmartCity)', city: 'Kochi', district: 'Ernakulam', state: 'Kerala', pin: '682030', lat: 10.0159, lng: 76.3419, isServiced: true },
  { id: 'edappally', name: 'Edappally & Lulu Mall', city: 'Kochi', district: 'Ernakulam', state: 'Kerala', pin: '682024', lat: 10.0261, lng: 76.3084, isServiced: true },
  { id: 'vyttila', name: 'Vyttila Mobility Hub & Kaloor', city: 'Kochi', district: 'Ernakulam', state: 'Kerala', pin: '682019', lat: 9.9674, lng: 76.3182, isServiced: true },
  { id: 'fortkochi', name: 'Fort Kochi & Mattancherry', city: 'Kochi', district: 'Ernakulam', state: 'Kerala', pin: '682001', lat: 9.9648, lng: 76.2427, isServiced: true },
  { id: 'aluva', name: 'Aluva Metro & Airport Corridor', city: 'Kochi', district: 'Ernakulam', state: 'Kerala', pin: '683101', lat: 10.1076, lng: 76.3516, isServiced: true },

  { id: 'trivandrum', name: 'Trivandrum (Technopark & Kowdiar)', city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', pin: '695581', lat: 8.5241, lng: 76.9366, isServiced: true },
  { id: 'kozhikode', name: 'Kozhikode (Hilite City & Beach)', city: 'Kozhikode', district: 'Kozhikode', state: 'Kerala', pin: '673001', lat: 11.2588, lng: 75.7804, isServiced: true },
  { id: 'thrissur', name: 'Thrissur (Swaraj Round & East Fort)', city: 'Thrissur', district: 'Thrissur', state: 'Kerala', pin: '680001', lat: 10.5276, lng: 76.2144, isServiced: true },
  { id: 'kannur', name: 'Kannur (Thavakkara & Payyambalam)', city: 'Kannur', district: 'Kannur', state: 'Kerala', pin: '670001', lat: 11.8745, lng: 75.3704, isServiced: true },
  { id: 'kottayam', name: 'Kottayam (Kanjikuzhy & Collectorate)', city: 'Kottayam', district: 'Kottayam', state: 'Kerala', pin: '686001', lat: 9.5916, lng: 76.5222, isServiced: true },
  { id: 'kollam', name: 'Kollam (Chinnakada & Asramam)', city: 'Kollam', district: 'Kollam', state: 'Kerala', pin: '691001', lat: 8.8932, lng: 76.6141, isServiced: true },
  { id: 'palakkad', name: 'Palakkad (Fort Maidan & Town)', city: 'Palakkad', district: 'Palakkad', state: 'Kerala', pin: '678001', lat: 10.7867, lng: 76.6548, isServiced: true },
  { id: 'alappuzha', name: 'Alappuzha (Boat Jetty & Beach Road)', city: 'Alappuzha', district: 'Alappuzha', state: 'Kerala', pin: '688001', lat: 9.4981, lng: 76.3388, isServiced: true },
  { id: 'malappuram', name: 'Malappuram (Manjeri & Down Hill)', city: 'Malappuram', district: 'Malappuram', state: 'Kerala', pin: '676505', lat: 11.0732, lng: 76.0740, isServiced: true },

  // Expansion Districts (Marked as Unserviced to demonstrate clear availability warnings per requirement 9)
  { id: 'wayanad', name: 'Wayanad (Kalpetta & Sulthan Bathery)', city: 'Kalpetta', district: 'Wayanad', state: 'Kerala', pin: '673121', lat: 11.6050, lng: 76.0830, isServiced: false },
  { id: 'idukki', name: 'Idukki & Munnar High-Range', city: 'Munnar', district: 'Idukki', state: 'Kerala', pin: '685612', lat: 10.0889, lng: 77.0595, isServiced: false },
  { id: 'kasaragod', name: 'Kasaragod (Kanhangad & Town)', city: 'Kasaragod', district: 'Kasaragod', state: 'Kerala', pin: '671121', lat: 12.5102, lng: 74.9852, isServiced: false },
  { id: 'pathanamthitta', name: 'Pathanamthitta (Adoor & Thiruvalla)', city: 'Pathanamthitta', district: 'Pathanamthitta', state: 'Kerala', pin: '689645', lat: 9.2648, lng: 76.7870, isServiced: false }
];

export const SERVICES: ServiceItem[] = [
  // 1. Mechanic & Roadside Assistance (Core)
  {
    id: 'doorstep-mechanic',
    phase: 1,
    category: 'Mechanic & Roadside Assistance',
    title: 'Doorstep Car & Bike Mechanic',
    malayalamTitle: 'ഡോർസ്റ്റെപ്പ് കാർ & ബൈക്ക് മെക്കാനിക്',
    tagline: 'Breakdown jumpstart, engine diagnostic, brake fix & towing.',
    malayalamTagline: 'ബാറ്ററി ജമ്പ്സ്റ്റാർട്ട്, ബ്രേക്ക് റിപ്പയർ, എഞ്ചിൻ തകരാറുകൾ.',
    badge: 'Roadside Rescue',
    icon: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    eta: '20 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 199,
    priceRangeNotice: '₹199 diagnostic fee. Full repair quote given upfront before work begins.',
    sparePartsNotice: 'Spare parts billed at actual retail MRP with printed bill.',
    features: ['20-minute rapid breakdown arrival', 'Battery jumpstart & alternator voltage test', 'Brake pad inspection & diagnostic report'],
    rating: 4.8,
    reviewsCount: 38
  },

  // 2. Acting Drivers (Core)
  {
    id: 'acting-driver',
    phase: 1,
    category: 'Driver',
    title: 'Freelance Acting Driver ("Drive My Car")',
    malayalamTitle: 'ആക്ടിംഗ് ഡ്രൈവർ (നിങ്ങളുടെ കാർ ഓടിക്കാൻ)',
    tagline: 'Police clearance (PCC) checked drivers for city, hospital & outstation.',
    malayalamTagline: 'പോലീസ് ക്ലിയറൻസ് പരിശോധിച്ച ഡ്രൈവർമാർ. ഹോസ്പിറ്റൽ, ശബരിമല, യാത്രകൾക്ക്.',
    badge: 'PCC Checked Pro',
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
    priceRangeNotice: '₹250 for first 2 hours + ₹80/hr. No surprise surge pricing.',
    features: [
      'Police Clearance Certificate (PCC) checked by Fixily',
      'Minimum 3+ years active LMV driving experience',
      'Hospital visits, Sabarimala pilgrimage, airport runs',
      'Return bus fare & meal allowance kept 100% by driver'
    ],
    rating: 4.9,
    reviewsCount: 42
  },

  // 3. Electrical Services (Core)
  {
    id: 'electrician-consultation',
    phase: 1,
    category: 'Electrical Services',
    title: 'Electrician Consultation & Inverter Wiring',
    malayalamTitle: 'ഇലക്ട്രീഷ്യൻ & ഇൻവെർട്ടർ വയറിംഗ്',
    tagline: 'Monsoon short circuits, MCB trips, inverter setup & switchboard fixes.',
    malayalamTagline: 'ഷോർട്ട് സർക്യൂട്ട്, ഇൻവെർട്ടർ തകരാറുകൾ, സ്വിച്ച്ബോർഡ് റിപ്പയർ.',
    badge: 'Emergency Electrician',
    icon: 'Zap',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 149,
    priceRangeNotice: '₹149 visiting inspection fee (waived if repair is undertaken). Typical fixes: ₹250 - ₹550.',
    sparePartsNotice: 'Wires and MCB switches provided at hardware store MRP.',
    features: ['30-minute rapid arrival', 'Short circuit & monsoon earth leakage check', 'Inverter battery setup & MCB rewiring'],
    rating: 4.8,
    reviewsCount: 29
  },

  // 4. Plumbing & Water Management (Core)
  {
    id: 'plumber-consultation',
    phase: 1,
    category: 'Plumbing & Water Management',
    title: 'Plumber Consultation & Motor Pump Repair',
    malayalamTitle: 'പ്ലംബർ സർവീസും മോട്ടോർ പമ്പ് റിപ്പയറും',
    tagline: 'Water pump troubleshooting, pipeline leaks, taps & sanitaryware.',
    malayalamTagline: 'പമ്പ് മോട്ടോർ തകരാറുകൾ, പൈപ്പ് ലീക്ക്, ടാപ്പുകൾ, ഫ്ലഷ് ടാങ്ക്.',
    badge: 'Urgent Plumber',
    icon: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    eta: '35 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 149,
    priceRangeNotice: '₹149 inspection fee. Estimated labor range: ₹200 - ₹500 depending on leakage depth.',
    sparePartsNotice: 'Pipes, valves & sealants charged on actual store bill.',
    features: ['Water pump capacitor & motor inspection', 'Concealed leak detection & tap washer fix', 'Sanitaryware & shower pressure check'],
    rating: 4.7,
    reviewsCount: 31
  },

  // 5. Appliance Care & Servicing (Core - Highly Demanded in Kerala)
  {
    id: 'appliance-care',
    phase: 1,
    category: 'Appliance Care & Servicing',
    title: 'AC Foam Jet Cleaning & Appliance Care',
    malayalamTitle: 'എസി ഫോം ജെറ്റ് സർവീസും അപ്ലയൻസ് റിപ്പയറും',
    tagline: 'High-pressure foam jet AC service, gas leak fix & washing machine repairs.',
    malayalamTagline: 'എസി സർവീസ്, ഗ്യാസ് ലീക്ക് റിപ്പയർ, വാഷിംഗ് മെഷീൻ തകരാറുകൾ.',
    badge: 'Cooling & Machine Care',
    icon: 'Cpu',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: 'Split AC High-Pressure Foam Jet Clean', price: 499, duration: '45 mins' },
      { name: 'Split AC Deep Clean + Gas Pressure Check', price: 799, duration: '60 mins' },
      { name: 'Washing Machine Drum & Motor Diagnostic', price: 299, duration: '30 mins' }
    ],
    priceRangeNotice: 'Fixed upfront tier pricing. Diagnostic fee waived if repair is approved.',
    sparePartsNotice: 'Original compressor capacitor & coolant gas at transparent rates.',
    features: ['High-PSI indoor & outdoor foam jet wash', 'Cooling temperature delta measurement', 'Anti-fungal coil sanitization'],
    rating: 4.9,
    reviewsCount: 46
  },

  // 6. Vehicle Care (Core)
  {
    id: 'car-foam-wash',
    phase: 1,
    category: 'Vehicle Care',
    title: 'Doorstep Snow Foam Wash & Detailing',
    malayalamTitle: 'ഡോർസ്റ്റെപ്പ് കാർ ഫോം വാഷ്',
    tagline: 'High-pressure snow foam jet wash at your home driveway.',
    malayalamTagline: 'വീട്ടുമുറ്റത്തെത്തി പ്രഷർ ജെറ്റ് ഫോം വാഷ് ചെയ്യുന്നു.',
    badge: 'Doorstep Wash',
    icon: 'Car',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: 'Hatchback (Swift, Tiago, i10)', price: 499, duration: '45 mins' },
      { name: 'Sedan / Compact SUV (City, Brezza, Creta)', price: 649, duration: '60 mins' },
      { name: 'Full SUV / MPV (Innova, Harrier, Fortuner)', price: 799, duration: '75 mins' }
    ],
    priceRangeNotice: 'Fixed pricing by vehicle size. Includes water suction vacuuming.',
    features: ['pH-neutral snow foam wash', 'Underbody mud rinse & tyre dressing', 'Interior vacuum & dashboard polish'],
    rating: 4.8,
    reviewsCount: 27
  },

  // 7. Overhead Water Tank & Well Cleaning (Kerala Specific Essential - Item 10)
  {
    id: 'water-tank-cleaning',
    phase: 1,
    category: 'Water Tank Cleaning',
    title: 'Overhead Water Tank & Sump Sanitization',
    malayalamTitle: 'വാട്ടർ ടാങ്ക് & കിണർ ഡീപ് ക്ലീനിംഗ്',
    tagline: 'Algae de-sludging, UV pressure wash & eco-friendly bleaching powder disinfection.',
    malayalamTagline: 'പായൽ നീക്കം ചെയ്യൽ, പ്രഷർ വാഷ്, അണുനശീകരണം.',
    badge: 'Kerala Seasonal Essential',
    icon: 'Droplet',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'tiered',
    tiers: [
      { name: '500L - 1000L Overhead Tank Clean', price: 699, duration: '60 mins' },
      { name: '2000L Overhead Tank or Ground Sump', price: 1199, duration: '90 mins' },
      { name: 'Open Well Sludge Removal & Chlorination', price: 1799, duration: '2.5 hrs' }
    ],
    priceRangeNotice: 'Fixed rate by tank capacity. Certified clean water assurance.',
    features: ['High-PSI sludge extraction', 'Food-grade potassium permanganate treatment', 'Anti-bacterial wall scrubbing'],
    rating: 4.9,
    reviewsCount: 19
  },

  // 8. Pest Control & Termite Care (Kerala Monsoon Essential - Item 10)
  {
    id: 'pest-control',
    phase: 1,
    category: 'Pest Control',
    title: 'Monsoon Pest Control & Termite Treatment',
    malayalamTitle: 'കീട നിയന്ത്രണവും ചിതൽ നശീകരണവും',
    tagline: 'Odorless cockroach gel, termite woodwork injection & mosquito barrier.',
    malayalamTagline: 'പാറ്റ, ചിതൽ, കൊതുക് തുടങ്ങിയവയ്ക്കെതിരെ സുരക്ഷിത ചികിത്സ.',
    badge: 'Seasonal Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    eta: '60 mins',
    isInstant: false,
    priceType: 'tiered',
    tiers: [
      { name: '1-2 BHK Odorless Cockroach & Ant Gel', price: 799, duration: '45 mins' },
      { name: '3-4 BHK Full Villa Pest Protection', price: 1399, duration: '75 mins' },
      { name: 'Doorframe & Woodwork Termite Drilling', price: 1899, duration: '2 hrs' }
    ],
    priceRangeNotice: 'Fixed pricing with 90-day re-service warranty.',
    features: ['Odorless Bayer eco-friendly chemicals', 'Child & pet safe gel baiting', '90-day free re-treatment warranty'],
    rating: 4.8,
    reviewsCount: 14
  },

  // 9. Deep Cleaning & Housekeeping (Other Works)
  {
    id: 'deep-cleaning',
    phase: 1,
    category: 'Deep Cleaning & Housekeeping',
    title: 'Full House Deep Cleaning & Housekeeping',
    malayalamTitle: 'വീട് മുഴുവൻ ഡീപ് ക്ലീനിംഗ്',
    tagline: 'Floor scrubbing, kitchen chimney degrease & bathroom scale removal.',
    malayalamTagline: 'ടൈൽസ് സ്ക്രബ്ബിംഗ്, കിച്ചൺ, ബാത്ത്റൂം ഡീപ് ക്ലീനിംഗ്.',
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
    priceRangeNotice: 'All cleaning chemicals and equipment brought by team.',
    features: ['Single-use eco-friendly solutions', 'Bathroom hard-water tile scrubbing', 'Window glass & furniture dusting'],
    rating: 4.7,
    reviewsCount: 23
  },

  // 10. Monsoon Moss & Interlock Pressure Wash (Kerala Specific Essential)
  {
    id: 'paving-pressure-wash',
    phase: 2,
    category: 'Outdoor & Property Maintenance',
    title: 'Compound Wall & Interlock Pressure Wash',
    malayalamTitle: 'മുറ്റത്തെ ഇന്റർലോക്ക് പ്രഷർ വാഷ്',
    tagline: 'High-PSI water jet cleaning for slippery mossy paving tiles & gates.',
    malayalamTagline: 'മഴക്കാലത്തെ പായൽ മാറ്റാനും മുറ്റം വൃത്തിയാക്കാനും.',
    badge: 'Monsoon Paving Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'quote',
    estPrice: 1299,
    priceRangeNotice: 'Estimated ₹1,000 - ₹1,800 based on driveway square footage.',
    features: ['High-PSI moss & algae removal', 'Slip prevention for elders', 'Compound wall brightening'],
    rating: 4.9,
    reviewsCount: 16
  },

  // 11. Carpenter & Locksmith (Other Works)
  {
    id: 'carpenter-services',
    phase: 1,
    category: 'Carpenter & Locksmith',
    title: 'Doorstep Carpenter & Lock Replacement',
    malayalamTitle: 'കാർപെന്ററും ഡോർ ലോക്ക് മാറ്റലും',
    tagline: 'Door hinge fixes, furniture assembly, Godrej locks & modular kitchen care.',
    malayalamTagline: 'വാതിൽ ലോക്ക് മാറ്റൽ, ഫർണിച്ചർ റിപ്പയർ, കിച്ചൺ കട്ടിള അറ്റകുറ്റപ്പണി.',
    badge: 'Woodwork Care',
    icon: 'Hammer',
    imageUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 149,
    priceRangeNotice: '₹149 visiting charge. Labor estimates: ₹200 - ₹500.',
    features: ['Door lock & handle replacement', 'Modular kitchen hinge realignment', 'Furniture joint tightening'],
    rating: 4.8,
    reviewsCount: 22
  },

  // 12. Painter & Waterproofing (Other Works)
  {
    id: 'painter-waterproofing',
    phase: 2,
    category: 'Painter & Waterproofing',
    title: 'Wall Dampness Treatment & Roof Waterproofing',
    malayalamTitle: 'റൂഫ് വാട്ടർപ്രൂഫിംഗും പെയിന്റിംഗും',
    tagline: 'Monsoon moisture barrier, wall putty touchup & terrace sealants.',
    malayalamTagline: 'മഴവെള്ള ചോർച്ച തടയൽ, വാൾ പുട്ടി, വാട്ടർപ്രൂഫ് പെയിന്റിംഗ്.',
    badge: 'Waterproofing Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'quote',
    estPrice: 499,
    priceRangeNotice: 'Free inspection & square-foot estimate before purchase.',
    features: ['Wall dampness seepage inspection', 'Dr. Fixit polymer coat application', 'Terrace leak sealant'],
    rating: 4.7,
    reviewsCount: 15
  },

  // 13. CCTV & Smart Security (Other Works)
  {
    id: 'cctv-security',
    phase: 1,
    category: 'CCTV & Smart Security',
    title: 'CCTV Installation & Smart Video Doorbell',
    malayalamTitle: 'സിസിടിവി ക്യാമറ ഇൻസ്റ്റാളേഷൻ',
    tagline: 'IP camera setup, mobile live view configuration & WiFi door locks.',
    malayalamTagline: 'ക്യാമറ ഫിറ്റിംഗ്, മൊബൈൽ ലൈവ് വ്യൂ സെറ്റപ്പ്, സ്മാർട്ട് ലോക്കുകൾ.',
    badge: 'Security Care',
    icon: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
    eta: '35 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 299,
    priceRangeNotice: '₹299 diagnostic & cabling check. Hardware charged at dealer rate.',
    features: ['WiFi IP camera installation', 'Phone remote live feed setup', 'Night vision calibration'],
    rating: 4.9,
    reviewsCount: 20
  },

  // 14. Vacant Home Caretaking (Formerly NRI - Refactored per Requirement 14 to avoid burglary profiling)
  {
    id: 'vacant-home-care',
    phase: 2,
    category: 'Vacant Property Stewardship',
    title: 'Vacant Home Maintenance & Caretaking',
    malayalamTitle: 'പൂട്ടിക്കിടക്കുന്ന വീടുകളുടെ പരിചരണം',
    tagline: 'Bi-weekly ventilation, electrical check & video inspection for closed homes.',
    malayalamTagline: 'വീട് വായുസഞ്ചാരത്തിനായി തുറക്കൽ, ഇലക്ട്രിക്കൽ ചെക്കിംഗ്, വീഡിയോ റിപ്പോർട്ട്.',
    badge: 'Home Stewardship',
    icon: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    eta: 'Scheduled',
    isInstant: false,
    priceType: 'subscription',
    estPrice: 1999,
    priceRangeNotice: 'Monthly subscription. Confidential handling with zero public tagging.',
    features: ['Bi-weekly moisture & pest check', 'Water motor dry-run check', 'Encrypted HD video inspection report'],
    rating: 4.9,
    reviewsCount: 11
  },

  // 15. Personal Grooming (Other Works)
  {
    id: 'doorstep-salon-makeup',
    phase: 2,
    category: 'Personal Grooming & At-Home Wellness',
    title: 'Doorstep Salon & Wellness for Women',
    malayalamTitle: 'ഡോർസ്റ്റെപ്പ് സലൂൺ & വെൽനസ്',
    tagline: 'Certified beauticians at home with sanitized single-use kits.',
    malayalamTagline: 'സർട്ടിഫൈഡ് ബ്യൂട്ടീഷ്യൻമാർ വീട്ടിലെത്തി ചെയ്യുന്ന സലൂൺ സേവനങ്ങൾ.',
    badge: 'At-Home Spa',
    icon: 'Scissors',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'quote',
    estPrice: 699,
    priceRangeNotice: 'Transparent package rates with sanitized disposable towels.',
    features: ['Single-use sealed hygiene kits', 'Facials, waxing, pedicure & hair styling', 'Certified female beauticians'],
    rating: 4.9,
    reviewsCount: 28
  },

  // 16. Rental Cars & Taxi (Other Works)
  {
    id: 'rental-cars-taxi',
    phase: 1,
    category: 'Rental Cars & Taxi Services',
    title: 'Chauffeur Airport Transfer & Outstation Taxi',
    malayalamTitle: 'എയർപോർട്ട് ടാക്സിയും ഔട്ട്സ്റ്റേഷൻ സർവീസും',
    tagline: 'Clean sanitized AC sedans and Innovas with verified chauffeur.',
    malayalamTagline: 'നെടുമ്പാശ്ശേരി എയർപോർട്ട് ട്രിപ്പുകൾ, ദീർഘദൂര ടാക്സി.',
    badge: 'Travel Care',
    icon: 'Navigation',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    eta: '20 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: 'Kochi Airport Transfer Sedan (Etios/Dzire)', price: 899, duration: '60 mins' },
      { name: '12-Hour Outstation Innova Taxi', price: 2399, duration: '12 hrs' }
    ],
    priceRangeNotice: 'Fixed fares including toll guidance. Zero hidden driver fees.',
    features: ['PCC checked professional chauffeurs', 'Clean sanitized AC vehicles', 'Luggage assistance'],
    rating: 4.8,
    reviewsCount: 35
  },

  // 17. Device Repair (Other Works)
  {
    id: 'device-repair',
    phase: 1,
    category: 'Laptop and Mobile Phone Repair',
    title: 'Doorstep Mobile & Laptop Repair',
    malayalamTitle: 'മൊബൈൽ & ലാപ്ടോപ്പ് റിപ്പയർ',
    tagline: 'Screen replacement, battery swap & motherboard diagnostics at home.',
    malayalamTagline: 'ഡിസ്പ്ലേ മാറ്റൽ, ബാറ്ററി റീപ്ലേസ്മെന്റ്, ലാപ്ടോപ്പ് സർവീസ്.',
    badge: 'Tech Repair',
    icon: 'Smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 199,
    priceRangeNotice: '₹199 diagnostic fee. 3-month replacement warranty on OEM screens.',
    features: ['Doorstep screen replacement in 30 mins', 'OEM batteries with warranty', 'Full data confidentiality assurance'],
    rating: 4.8,
    reviewsCount: 24
  },

  // 18. Emergency Water Tanker (Other Works)
  {
    id: 'water-supply-tanker',
    phase: 1,
    category: 'Water Supply',
    title: 'Emergency Drinking Water Tanker Delivery',
    malayalamTitle: 'കുടിവെള്ള ടാങ്കർ ഡെലിവറി',
    tagline: '5,000L / 10,000L lab-tested purified drinking water for apartments & homes.',
    malayalamTagline: 'ലാബ് ടെസ്റ്റ് ചെയ്ത ശുദ്ധമായ കുടിവെള്ളം വീടുകളിലും ഫ്ലാറ്റുകളിലും എത്തിക്കുന്നു.',
    badge: 'Water Supply',
    icon: 'Droplet',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    eta: '40 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: '5,000 Liters Purified Water Tanker', price: 899, duration: '45 mins' },
      { name: '10,000 Liters Purified Water Tanker', price: 1599, duration: '60 mins' }
    ],
    priceRangeNotice: 'Fixed price by volume delivered with high-flow pump hose.',
    features: ['Lab-tested potable drinking water', 'High-pressure electric pump included', '24/7 delivery dispatch across Kochi'],
    rating: 4.9,
    reviewsCount: 39
  },

  // 19. Worker-Added Custom Works (Marked with isNewService / realistic counts)
  {
    id: 'solar-inverter-ups-care',
    phase: 1,
    category: 'Other Works',
    title: 'Solar Inverter & Rooftop UPS Technician',
    malayalamTitle: 'സോളാർ ഇൻവെർട്ടർ & യു.പി.എസ് ടെക്നീഷ്യൻ',
    tagline: 'Solar rooftop inverter setup, battery desulfation, UPS backup diagnostics.',
    malayalamTagline: 'സോളാർ പാനൽ വയറിംഗ്, ഇൻവെർട്ടർ ബാറ്ററി ടെസ്റ്റിംഗ്.',
    badge: 'Custom Trade',
    icon: 'Sun',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
    eta: '35 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 299,
    priceRangeNotice: '₹299 diagnostic inspection. Estimates provided before repairs.',
    features: ['Rooftop solar DC/AC cabling check', 'Battery specific gravity testing', 'Pure sine wave inverter diagnostics'],
    rating: 4.9,
    reviewsCount: 12,
    isNewService: false,
    createdByPartnerId: 'p-106',
    createdByPartnerName: 'Sunil Prasad'
  },
  {
    id: 'gardening-lawn-care',
    phase: 1,
    category: 'Other Works',
    title: 'Garden Landscaping & Plant Caretaker',
    malayalamTitle: 'ഗാർഡൻ ലാൻഡ്‌സ്‌കേപ്പിംഗും ഗാർഡനറും',
    tagline: 'Lawn mowing, organic de-weeding, hedge trimming & plant potting.',
    malayalamTagline: 'പുൽത്തകിടി വെട്ടി ഒരുക്കൽ, ചെടികൾ നടൽ, ഗാർഡൻ പരിപാലനം.',
    badge: 'Custom Trade',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 349,
    priceRangeNotice: '₹349 visiting charge. Equipment provided by pro.',
    features: ['Motorized hedge & bush trimming', 'Organic pest repellent spray', 'Lawn edging and garden cleanup'],
    rating: 0,
    reviewsCount: 0,
    isNewService: true
  },
  {
    id: 'smart-iot-automation',
    phase: 1,
    category: 'Other Works',
    title: 'Smart Home IoT & Sensor Automation Specialist',
    malayalamTitle: 'സ്മാർട്ട് ഹോം ഓട്ടോമേഷൻ വിദഗ്ദ്ധൻ',
    tagline: 'Smart switch retrofit, WiFi touch switches, mobile app & Alexa controls.',
    malayalamTagline: 'സ്മാർട്ട് സ്വിച്ചുകൾ, വൈഫൈ ലൈറ്റ്, മൊബൈൽ കൺട്രോൾ സെറ്റപ്പ്.',
    badge: 'Custom Trade',
    icon: 'Cpu',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 399,
    priceRangeNotice: '₹399 diagnostic & WiFi calibration.',
    features: ['WiFi smart switchboard retrofit', 'Google Home / Alexa voice configuration', 'Smart lock door calibration'],
    rating: 0,
    reviewsCount: 0,
    isNewService: true
  }
];

export const MOCK_PARTNERS: GigPartner[] = [
  {
    id: 'p-101',
    name: 'Anand Kumar',
    phone: '+91 98470 11223',
    role: 'Freelance Acting Driver & Mechanic',
    rating: 4.9,
    jobsCompleted: 34,
    reviewsCount: 18,
    isOnline: true,
    isTopRated: true,
    hourlyRateMultiplier: 1.25,
    damageLiabilityAgreed: true,
    currentLocation: { name: 'Kakkanad Metro Station', lat: 10.0165, lng: 76.3425 },
    availableSlots: [
      'Today, 02:00 PM - 04:00 PM',
      'Today, 05:00 PM - 07:00 PM',
      'Tomorrow, 09:00 AM - 12:00 PM',
      'Tomorrow, 02:00 PM - 05:00 PM'
    ],
    targetAchievement: {
      weeklyTarget: 15,
      completedJobsThisWeek: 12,
      bonusAmount: 1500,
      isBonusUnlocked: false,
      tierLevel: 'GOLD_TOP_RATED' as const,
      commissionDiscountPercent: 5
    },
    reviews: [
      {
        id: 'rev-1',
        customerName: 'Mathew Thomas',
        rating: 5,
        comment: 'Extremely polite driver and expert mechanic! Jumpstarted my car within 15 minutes with zero scratches.',
        serviceTitle: 'Doorstep Car & Bike Mechanic',
        createdAt: '2026-10-02'
      },
      {
        id: 'rev-2',
        customerName: 'Sneha George',
        rating: 5,
        comment: 'Drove my family to Nedumbassery Airport during peak rain. Very safe driver, PCC documents checked.',
        serviceTitle: 'Freelance Acting Driver',
        createdAt: '2026-09-28'
      }
    ],
    kyc: {
      aadhaarVerified: true,
      aadhaarNumber: '•••• •••• 9043',
      govtIdType: 'AADHAAR' as const,
      govtIdNumber: '•••• •••• 9043',
      govtIdFileAttached: true,
      dlNumber: 'KL-07-2015-0049281',
      pccStatus: 'VERIFIED' as const,
      pccRefNo: 'KL-PCC-2024-88912',
      pccExpiry: '2027-04-15',
      pccCheckedByFixily: true,
      bankVerified: true,
      damageLiabilityAgreed: true,
      liabilityAgreementTimestamp: '2026-04-15T09:30:00Z'
    },
    vehicle: 'LMV Driver & Mechanic Toolkit',
    walletBalance: 2840,
    escrowBalance: 350,
    withdrawableBalance: 2490,
    todaysEarnings: 1250,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    aadhaarMasked: '•••• •••• 9043'
  },
  {
    id: 'p-102',
    name: 'Suresh Babu',
    phone: '+91 98471 22334',
    role: 'Electrician & Inverter/Wiring Technician',
    rating: 4.8,
    jobsCompleted: 28,
    reviewsCount: 15,
    isOnline: true,
    isTopRated: true,
    hourlyRateMultiplier: 1.20,
    damageLiabilityAgreed: true,
    currentLocation: { name: 'Edappally Toll', lat: 10.0236, lng: 76.3115 },
    availableSlots: [
      'Today, 03:30 PM - 06:00 PM',
      'Tomorrow, 10:00 AM - 01:00 PM',
      'Tomorrow, 03:00 PM - 06:00 PM'
    ],
    targetAchievement: {
      weeklyTarget: 15,
      completedJobsThisWeek: 9,
      bonusAmount: 1500,
      isBonusUnlocked: false,
      tierLevel: 'SILVER_PRO' as const,
      commissionDiscountPercent: 4
    },
    reviews: [
      {
        id: 'rev-3',
        customerName: 'Arun Varma',
        rating: 5,
        comment: 'Diagnosed our main circuit trip problem in 10 mins. Very knowledgeable and clean work.',
        serviceTitle: 'Electrician Consultation & Wiring',
        createdAt: '2026-10-01'
      }
    ],
    kyc: {
      aadhaarVerified: true,
      govtIdType: 'AADHAAR' as const,
      govtIdNumber: '•••• •••• 4419',
      govtIdFileAttached: true,
      pccStatus: 'VERIFIED' as const,
      pccRefNo: 'KL-PCC-2024-55120',
      pccExpiry: '2027-06-20',
      pccCheckedByFixily: true,
      bankVerified: true,
      damageLiabilityAgreed: true,
      liabilityAgreementTimestamp: '2026-06-20T10:00:00Z'
    },
    vehicle: 'Electrical Pro Toolbag & Testing Meter',
    walletBalance: 1950,
    escrowBalance: 250,
    withdrawableBalance: 1700,
    todaysEarnings: 850,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    aadhaarMasked: '•••• •••• 4419'
  },
  {
    id: 'p-106',
    name: 'Sunil Prasad',
    phone: '+91 98475 66778',
    role: 'Solar Inverter & Smart Home IoT Specialist',
    rating: 4.9,
    jobsCompleted: 24,
    reviewsCount: 12,
    isOnline: true,
    isTopRated: true,
    hourlyRateMultiplier: 1.25,
    damageLiabilityAgreed: true,
    currentLocation: { name: 'Kalamassery Startup Village', lat: 10.0450, lng: 76.3250 },
    availableSlots: [
      'Today, 02:00 PM - 04:30 PM',
      'Today, 05:00 PM - 07:30 PM',
      'Tomorrow, 09:30 AM - 12:30 PM',
      'Tomorrow, 02:30 PM - 05:30 PM'
    ],
    targetAchievement: {
      weeklyTarget: 15,
      completedJobsThisWeek: 11,
      bonusAmount: 1500,
      isBonusUnlocked: false,
      tierLevel: 'GOLD_TOP_RATED' as const,
      commissionDiscountPercent: 5
    },
    reviews: [
      {
        id: 'rev-7',
        customerName: 'George Joseph',
        rating: 5,
        comment: 'Sunil installed our solar rooftop backup and automated WiFi lights perfectly. Highly recommended freelancer!',
        serviceTitle: 'Solar Inverter & Rooftop UPS Technician',
        createdAt: '2026-10-03'
      }
    ],
    kyc: {
      aadhaarVerified: true,
      govtIdType: 'AADHAAR' as const,
      govtIdNumber: '•••• •••• 0044',
      govtIdFileAttached: true,
      pccStatus: 'VERIFIED' as const,
      pccRefNo: 'KL-PCC-2024-66381',
      pccExpiry: '2027-11-20',
      pccCheckedByFixily: true,
      bankVerified: true,
      damageLiabilityAgreed: true,
      liabilityAgreementTimestamp: '2026-05-15T10:00:00Z'
    },
    vehicle: 'Solar & Smart Home Toolkit with Multimeter',
    walletBalance: 2900,
    escrowBalance: 300,
    withdrawableBalance: 2600,
    todaysEarnings: 1100,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    aadhaarMasked: '•••• •••• 0044',
    customProfessions: [
      {
        id: 'cp-1',
        title: 'Solar Inverter & Rooftop UPS Technician',
        category: 'Other Works',
        tagline: 'Solar rooftop inverter setup, battery desulfation, UPS backup troubleshooting.',
        priceType: 'flat_diagnostic' as const,
        price: 299,
        eta: '35 mins',
        features: ['Rooftop solar DC/AC cabling check', 'Battery specific gravity testing', 'Pure sine wave inverter diagnostics'],
        equipment: 'Carrying digital multimeter, solar crimping pliers & tester',
        isActive: true
      }
    ]
  }
];

export const MOCK_JOBS: BookingJob[] = [
  {
    id: 'FIX-8849',
    serviceId: 'doorstep-mechanic',
    serviceTitle: 'Doorstep Car & Bike Mechanic',
    tierName: 'Engine Diagnostic & Battery Jumpstart',
    customerName: 'Mathew Thomas',
    customerPhone: '+91 98950 12345',
    location: {
      address: 'Villa 14, Asset Homes Enclave, Kakkanad',
      microMarket: 'Kakkanad',
      lat: 10.0175,
      lng: 76.3450
    },
    maskedAddress: 'Kakkanad near Asset Homes Enclave',
    scheduledTime: 'Today, 03:30 PM',
    targetDate: '2026-10-05',
    targetTimeSlot: '03:00 PM - 05:00 PM',
    preferredPartnerId: 'p-101',
    preferredPartnerName: 'Anand Kumar',
    status: 'IN_PROGRESS',
    assignedPartnerId: 'p-101',
    assignedPartnerName: 'Anand Kumar',
    assignedPartnerPhone: '+91 98470 11223',
    completionOtp: '4892',
    startOtp: '2214',
    pricing: {
      baseFare: 299,
      platformCommission: 45,
      partnerEarnings: 254,
      convenienceFee: 35,
      microInsurance: 19,
      totalPaid: 353
    },
    paymentStatus: 'PAID_UPI',
    paymentMethod: 'UPI',
    vehicleDetails: 'Honda City (KL-07-CC-4091)',
    preServiceChecklist: {
      completedAt: '2026-10-05T10:15:00Z',
      photos: [
        { angle: 'Front Engine Bay', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400', notes: 'Alternator cables intact. Battery voltage low.' }
      ]
    },
    invoiceId: 'INV-KL-2026-8849',
    payoutHoldUntil: '2026-10-06T15:30:00Z',
    payoutStatus: 'IN_ESCROW',
    createdAt: '2026-10-05T09:45:00Z'
  },
  {
    id: 'FIX-8850',
    serviceId: 'acting-driver',
    serviceTitle: 'Freelance Acting Driver ("Drive My Car")',
    tierName: '2-Hour City Drive & Hospital Visit',
    customerName: 'Sneha George',
    customerPhone: '+91 98951 88990',
    location: {
      address: 'Skyline Ivy League, Edappally Toll',
      microMarket: 'Edappally',
      lat: 10.0261,
      lng: 76.3084
    },
    maskedAddress: 'Edappally near Toll Junction',
    scheduledTime: 'Tomorrow, 09:00 AM',
    targetDate: '2026-10-06',
    targetTimeSlot: 'Morning: 09:00 AM - 12:00 PM',
    preferredPartnerId: 'p-101',
    preferredPartnerName: 'Anand Kumar',
    status: 'PROVIDER_ASSIGNED',
    assignedPartnerId: 'p-101',
    assignedPartnerName: 'Anand Kumar',
    assignedPartnerPhone: '+91 98470 11223',
    completionOtp: '9134',
    startOtp: '3381',
    pricing: {
      baseFare: 250,
      platformCommission: 35,
      partnerEarnings: 215,
      convenienceFee: 35,
      microInsurance: 19,
      totalPaid: 304
    },
    paymentStatus: 'PAY_ON_SERVICE',
    paymentMethod: 'PAY_AFTER_SERVICE',
    vehicleDetails: 'Hyundai Creta (KL-07-BZ-5511)',
    invoiceId: 'INV-KL-2026-8850',
    createdAt: '2026-10-05T12:00:00Z'
  }
];
