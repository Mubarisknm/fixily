import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  Power,
  DollarSign,
  MapPin,
  CheckCircle2,
  Camera,
  Clock,
  Navigation,
  ArrowUpRight,
  AlertTriangle,
  Send,
  Zap,
  Phone,
  X,
  Wallet,
  TrendingUp,
  Award,
  Star,
  Calendar,
  Sparkles,
  Check,
  Briefcase,
  Plus,
  Wrench,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Mail,
  FileText,
  HelpCircle,
  ThumbsUp,
  Layers,
  Search,
  ExternalLink,
  Car,
  BadgeCheck,
  Smile,
  Flame,
  CheckSquare
} from 'lucide-react';
import { GigPartner, BookingJob, ThemeMode, KochiLocation } from '../types';
import { KOCHI_LOCATIONS } from '../data/db';
import { api } from '../services/api';
import { PartnerKYCModal } from './PartnerKYCModal';

const PRIMARY_SERVICES_LIST = [
  {
    id: 'Doorstep Car & Bike Mechanic',
    title: 'Mechanic & Roadside Assistance',
    titleMl: 'മെക്കാനിക്ക് & റോഡ്‌സൈഡ് സഹായം',
    icon: '🔧',
    tagline: '24/7 onsite breakdown, jumpstart & tyre rescue',
    gradient: 'from-amber-500 to-orange-600',
    typicalRate: '₹349 - ₹699'
  },
  {
    id: 'AC, Washing Machine & Appliance Care Technician',
    title: 'AC Repair & Servicing',
    titleMl: 'എസി റിപ്പയർ & ഫോം ജെറ്റ് സർവീസ്',
    icon: '❄️',
    tagline: 'Foam jet deep clean, gas charging & PCB repair',
    gradient: 'from-cyan-500 to-blue-600',
    typicalRate: '₹499 - ₹1,499'
  },
  {
    id: 'Electrician & Inverter/Wiring Technician',
    title: 'Electrician & Wiring Tech',
    titleMl: 'ഇലക്ട്രീഷ്യൻ & വയറിംഗ്',
    icon: '⚡',
    tagline: 'Short-circuit fix, inverter, DB box & appliance wiring',
    gradient: 'from-yellow-500 to-amber-600',
    typicalRate: '₹249 - ₹599'
  },
  {
    id: 'Licensed Plumber & Pipeline Specialist',
    title: 'Plumber & Pipeline Specialist',
    titleMl: 'പ്ലംബിംഗ് & പൈപ്പ് ചോർച്ച പരിഹാരം',
    icon: '🚰',
    tagline: 'Leak detection, bathroom sanitary & pump install',
    gradient: 'from-sky-500 to-blue-600',
    typicalRate: '₹299 - ₹799'
  },
  {
    id: 'Freelance Acting Driver ("Drive My Car")',
    title: 'Acting Driver & Chauffeur',
    titleMl: 'ആക്ടിംഗ് ഡ്രൈവർ & കാബ് സർവീസ്',
    icon: '👨‍✈️',
    tagline: 'Hourly acting drivers, outstation & airport transfers',
    gradient: 'from-blue-600 to-indigo-600',
    typicalRate: '₹399 - ₹999'
  },
  {
    id: 'Doorstep Car Spa & Detailing',
    title: 'Car Spa & Detailing',
    titleMl: 'ഡോർസ്റ്റെപ്പ് കാർ വാഷ് & ഡീറ്റെയിലിംഗ്',
    icon: '🚗',
    tagline: 'Doorstep high-pressure foam wash & ceramic wax',
    gradient: 'from-emerald-500 to-teal-600',
    typicalRate: '₹499 - ₹1,299'
  },
  {
    id: 'Full House Deep Cleaning Specialist',
    title: 'Deep Home Cleaning',
    titleMl: 'ഫുൾ ഹൗസ് ഡീപ് ക്ലീനിംഗ്',
    icon: '🧹',
    tagline: 'Tile scrubbing, kitchen de-greasing & sofa foam wash',
    gradient: 'from-teal-500 to-emerald-600',
    typicalRate: '₹899 - ₹2,999'
  },
  {
    id: 'Carpenter & Emergency Locksmith',
    title: 'Carpenter & Locksmith',
    titleMl: 'തടിപ്പണി & ഡോർ ലോക്കുകൾ',
    icon: '🔨',
    tagline: 'Door lock replacement, modular furniture & repairs',
    gradient: 'from-amber-600 to-orange-700',
    typicalRate: '₹349 - ₹899'
  },
  {
    id: 'CCTV & Smart Security Installer',
    title: 'CCTV & Smart Security',
    titleMl: 'സി.സി.ടി.വി & സ്മാർട്ട് സെക്യൂരിറ്റി',
    icon: '📹',
    tagline: 'IP camera setup, video doorbell & WiFi security',
    gradient: 'from-indigo-500 to-purple-600',
    typicalRate: '₹499 - ₹1,499'
  },
  {
    id: 'Painter & Waterproofing Expert',
    title: 'Painter & Waterproofing',
    titleMl: 'പെയിന്റിംഗ് & വാട്ടർപ്രൂഫിംഗ്',
    icon: '🎨',
    tagline: 'Dampness treatment, putty touchups & terrace coat',
    gradient: 'from-purple-500 to-pink-600',
    typicalRate: '₹599 - ₹2,499'
  },
  {
    id: 'Hospital Escort & Elderly Companion',
    title: 'Senior Citizen Care & Hospital Escort',
    titleMl: 'മുതിർന്നവരുടെ പരിചരണവും ഹോസ്പിറ്റൽ എസ്‌കോർട്ടും',
    icon: '🩺',
    tagline: 'Hospital escort, doctor appointment & companionship',
    gradient: 'from-rose-500 to-red-600',
    typicalRate: '₹399 - ₹899'
  }
];

const POPULAR_TOOLS_LIST = [
  'Professional Diagnostic & Hand Tools Kit',
  'Commercial Driving License (LMV/HMV)',
  'Digital Multimeter & Electrical Insulation Tester',
  'High-Pressure Foam Jet & Washer',
  'Power Drill, Grinder & Screw Driver Kit',
  'Pipe Wrench, Pressure Gauge & Leak Detector',
  'Safety Ladder, Harness & Protective Gear',
  'Industrial Vacuum Cleaner & Sanitizer Machine',
  'Two-Wheeler / Four-Wheeler Service Vehicle'
];

interface PartnerAppProps {
  partners: GigPartner[];
  jobs: BookingJob[];
  onRefreshData: () => void;
  theme?: ThemeMode;
}

export const PartnerApp: React.FC<PartnerAppProps> = ({
  partners,
  jobs,
  onRefreshData,
  theme = 'dark'
}) => {
  const isDark = theme === 'dark';
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || 'p-101');
  const [showPrecheckModal, setShowPrecheckModal] = useState<BookingJob | null>(null);
  const [showKYCModal, setShowKYCModal] = useState<boolean>(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('anand.driver@okicici');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState<boolean>(false);

  // Customer Completion OTP & Anti-Abuse state
  const [showCompletionModal, setShowCompletionModal] = useState<BookingJob | null>(null);
  const [completionOtpInput, setCompletionOtpInput] = useState<string>('');
  const [afterWorkPhotosConfirmed, setAfterWorkPhotosConfirmed] = useState<boolean>(true);
  const [isCompletingJob, setIsCompletingJob] = useState<boolean>(false);

  // Custom Profession & Services Management state
  const [showAddProfessionModal, setShowAddProfessionModal] = useState<boolean>(false);
  const [customTitle, setCustomTitle] = useState<string>('');
  const [customTagline, setCustomTagline] = useState<string>('');
  const [customPriceType, setCustomPriceType] = useState<'flat_diagnostic' | 'tiered' | 'base_plus_hourly'>('flat_diagnostic');
  const [customPrice, setCustomPrice] = useState<string>('299');
  const [customEta, setCustomEta] = useState<string>('30 mins');
  const [customEquipment, setCustomEquipment] = useState<string>('');
  const [customFeatures, setCustomFeatures] = useState<string>('Doorstep diagnosis, Professional tools, 100% damage guarantee');
  const [isPublishingProfession, setIsPublishingProfession] = useState<boolean>(false);

  // Partner Portal View Mode & Onboarding Workflow State
  const [portalView, setPortalView] = useState<'onboarding' | 'console'>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState<number>(1); // 1: Contact, 2: Services, 3: Experience, 4: Success

  // Step 1: Contact Information State
  const [applicantName, setApplicantName] = useState<string>('');
  const [applicantPhone, setApplicantPhone] = useState<string>('');
  const [applicantEmail, setApplicantEmail] = useState<string>('');
  const [applicantLocation, setApplicantLocation] = useState<string>('Kakkanad (InfoPark & SmartCity), Ernakulam');
  const [applicantAddress, setApplicantAddress] = useState<string>('');
  const [applicantWhatsApp, setApplicantWhatsApp] = useState<string>('');
  const [sameAsMobile, setSameAsMobile] = useState<boolean>(true);

  // Step 2: Service Selection State
  const [selectedServices, setSelectedServices] = useState<string[]>(['Doorstep Car & Bike Mechanic']);
  const [isCustomTradeSelected, setIsCustomTradeSelected] = useState<boolean>(false);
  const [customTradeTitle, setCustomTradeTitle] = useState<string>('');
  const [customTradeTagline, setCustomTradeTagline] = useState<string>('');
  const [customTradePrice, setCustomTradePrice] = useState<string>('349');
  const [customTradeEquipment, setCustomTradeEquipment] = useState<string>('Specialized diagnostic scanner, multimeter & tool kit');

  // Step 3: Experience & Qualifications State
  const [experienceLevel, setExperienceLevel] = useState<string>('3 - 5 Years (Experienced Pro)');
  const [experienceSummary, setExperienceSummary] = useState<string>('5 years of hands-on experience in doorstep vehicle breakdown troubleshooting, auto-electrical repairs and onsite emergency service.');
  const [selectedTools, setSelectedTools] = useState<string[]>([
    'Professional Diagnostic & Hand Tools Kit',
    'Commercial Driving License (LMV/HMV)',
    'Digital Multimeter & Electrical Insulation Tester'
  ]);
  const [hasDL, setHasDL] = useState<boolean>(true);
  const [dlNumberInput, setDlNumberInput] = useState<string>('KL-07-2019-0045821');
  const [itiTradeCertificate, setItiTradeCertificate] = useState<string>('Automobile / Electrical ITI Diploma');
  const [pastWorkshopRef, setPastWorkshopRef] = useState<string>('Kochi Motors & Auto Care / Self-Employed');
  const [agreeQualityTerms, setAgreeQualityTerms] = useState<boolean>(true);
  const [agreePccVerification, setAgreePccVerification] = useState<boolean>(true);
  const [isSubmittingApplication, setIsSubmittingApplication] = useState<boolean>(false);
  const [newRegisteredPartner, setNewRegisteredPartner] = useState<GigPartner | null>(null);

  const currentPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  const pendingJobs = jobs.filter(j => j.status === 'PENDING');
  const myActiveJobs = jobs.filter(
    j => j.assignedPartnerId === currentPartner?.id && j.status !== 'COMPLETED' && j.status !== 'CANCELLED'
  );

  const escrowAmount = currentPartner?.escrowBalance || 0;
  const withdrawableBalance = currentPartner?.withdrawableBalance !== undefined
    ? currentPartner.withdrawableBalance
    : Math.max(0, (currentPartner?.walletBalance || 0) - escrowAmount);

  const handleToggleServiceSelection = (serviceId: string) => {
    setSelectedServices(prev => {
      if (prev.includes(serviceId)) {
        return prev.filter(s => s !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleToggleTool = (tool: string) => {
    setSelectedTools(prev => {
      if (prev.includes(tool)) {
        return prev.filter(t => t !== tool);
      } else {
        return [...prev, tool];
      }
    });
  };

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim()) {
      alert('Please enter your full name');
      return;
    }
    const cleanPhone = applicantPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!applicantEmail.trim() || !applicantEmail.includes('@')) {
      alert('Please enter a valid email ID');
      return;
    }
    setOnboardingStep(2);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0 && (!isCustomTradeSelected || !customTradeTitle.trim())) {
      alert('Please select at least one primary service or enter your custom trade/job title');
      return;
    }
    setOnboardingStep(3);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCompletePartnerRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeQualityTerms) {
      alert('Please agree to Fykzi Quality Standards and 100% Work Guarantee.');
      return;
    }
    if (!agreePccVerification) {
      alert('Please agree to Kerala Police Thuna PCC verification.');
      return;
    }

    setIsSubmittingApplication(true);
    try {
      const primaryRole = isCustomTradeSelected && customTradeTitle.trim()
        ? customTradeTitle.trim()
        : selectedServices[0] || 'Doorstep Car & Bike Mechanic';

      const registered = await api.registerPartner({
        name: applicantName.trim(),
        phone: applicantPhone.trim().startsWith('+91') ? applicantPhone.trim() : `+91 ${applicantPhone.trim()}`,
        role: primaryRole,
        city: applicantLocation,
        vehicle: selectedTools.join(', '),
        dlNumber: hasDL ? dlNumberInput : undefined,
        aadhaarNumber: '5489 2210 9043',
        govtIdType: 'AADHAAR',
        govtIdNumber: '5489 2210 9043',
        damageLiabilityAgreed: agreeQualityTerms,
        pccRefNo: 'KL-PCC-THUNA-PENDING',
        upiId: `${applicantName.toLowerCase().replace(/\s+/g, '')}@upi`
      });

      if (isCustomTradeSelected && customTradeTitle.trim()) {
        const priceNum = parseFloat(customTradePrice) || 349;
        await api.addCustomService({
          title: customTradeTitle.trim(),
          tagline: customTradeTagline.trim() || `Specialized ${customTradeTitle.trim()} services across ${applicantLocation}`,
          category: 'Other Works',
          priceType: 'flat_diagnostic',
          diagnosticFee: priceNum,
          basePrice: priceNum,
          eta: '30 mins',
          features: ['Doorstep diagnosis', 'Professional equipment', '100% damage guarantee agreed'],
          equipment: customTradeEquipment.trim() || selectedTools.join(', ') || 'Professional tool set',
          partnerId: registered.id,
          partnerName: registered.name
        });
      }

      setIsSubmittingApplication(false);
      setNewRegisteredPartner(registered);
      setOnboardingStep(4); // Success step
      onRefreshData();
      setSelectedPartnerId(registered.id);
      window.scrollTo({ top: 150, behavior: 'smooth' });
    } catch (err) {
      setIsSubmittingApplication(false);
      alert('Failed to register partner. Please check your details and try again.');
    }
  };

  const handleToggleDuty = async () => {
    if (!currentPartner) return;
    try {
      await api.togglePartnerDuty(currentPartner.id, !currentPartner.isOnline);
      onRefreshData();
    } catch (err) {
      alert('Failed to update online duty status');
    }
  };

  const handleAcceptJob = async (jobId: string) => {
    if (!currentPartner) return;
    try {
      await api.acceptJob(jobId, currentPartner.id);
      onRefreshData();
      alert('🚗 Job Accepted! Please navigate to customer location and complete pre-service photos.');
    } catch (err) {
      alert('Failed to accept job');
    }
  };

  const handleCompletePrecheck = async () => {
    if (!showPrecheckModal) return;
    try {
      await api.uploadPreCheck(showPrecheckModal.id, [
        { angle: 'Front Engine Bay / Angle', url: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80', notes: 'Inspected - No pre-existing damage' },
        { angle: 'Rear Bumper & Tailgate', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80', notes: 'Verified clean condition' },
        { angle: 'Left Side Panels', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80', notes: 'Recorded pre-service state' },
        { angle: 'Interior Dashboard', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80', notes: 'Recorded odometer and dash' }
      ]);
      setShowPrecheckModal(null);
      onRefreshData();
      alert('✅ 4-Angle Pre-Service Inspection Verified! Work status updated to IN_PROGRESS.');
    } catch (err) {
      alert('Failed to record pre-service inspection');
    }
  };

  const handleVerifyAndCompleteJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCompletionModal) return;
    const expectedOtp = showCompletionModal.completionOtp;
    const entered = completionOtpInput.trim();
    if (expectedOtp && entered !== expectedOtp) {
      alert('Invalid Customer Completion OTP! Please request the 4-digit code shown on the customer’s phone after they inspect the work.');
      return;
    }

    setIsCompletingJob(true);
    try {
      await api.completeJob(showCompletionModal.id, entered);
      setIsCompletingJob(false);
      setShowCompletionModal(null);
      setCompletionOtpInput('');
      onRefreshData();
      alert(`🎉 Customer OTP Verified! Job marked as completed. ₹${showCompletionModal.pricing.partnerEarnings} credited to your wallet with standard 24-hr dispute protection hold.`);
    } catch (err) {
      setIsCompletingJob(false);
      alert('Failed to complete job');
    }
  };

  const handleWithdrawal = async () => {
    if (!currentPartner) return;
    const amountNum = parseFloat(withdrawalAmount) || withdrawableBalance;
    if (amountNum <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }
    if (amountNum > withdrawableBalance) {
      alert(`Withdrawal limited! Available withdrawable balance is ₹${withdrawableBalance}. ₹${escrowAmount} is currently held in 24-hour customer dispute escrow protection.`);
      return;
    }

    setIsProcessingWithdrawal(true);
    try {
      const res = await api.withdrawWallet(currentPartner.id, amountNum, upiId);
      setIsProcessingWithdrawal(false);
      onRefreshData();
      alert(`⚡ Instant Payout Success! ${res.message}`);
      setWithdrawalAmount('');
    } catch (err) {
      setIsProcessingWithdrawal(false);
      alert('Withdrawal failed');
    }
  };

  const handleAddCustomProfession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPartner) return;
    if (!customTitle.trim()) {
      alert('Please enter your custom profession / service title');
      return;
    }
    const priceNum = parseFloat(customPrice) || 299;

    setIsPublishingProfession(true);
    try {
      const featArray = customFeatures.split(',').map(f => f.trim()).filter(Boolean);
      await api.addCustomService({
        title: customTitle.trim(),
        tagline: customTagline.trim() || `Doorstep ${customTitle.trim()} services by verified freelancer`,
        category: 'Other Works',
        priceType: customPriceType,
        diagnosticFee: priceNum,
        basePrice: priceNum,
        eta: customEta.trim() || '35 mins',
        features: featArray.length > 0 ? featArray : ['Doorstep diagnosis', 'Professional equipment', '100% damage responsibility agreed'],
        equipment: customEquipment.trim() || 'Standard professional tools',
        partnerId: currentPartner.id,
        partnerName: currentPartner.name
      });
      setIsPublishingProfession(false);
      setShowAddProfessionModal(false);
      setCustomTitle('');
      setCustomTagline('');
      setCustomEquipment('');
      onRefreshData();
      alert(`🎉 Custom Profession Published! "${customTitle}" is now live under "Other Works" in the main customer grid! Customers can now book this work directly from you.`);
    } catch (err) {
      setIsPublishingProfession(false);
      alert('Failed to publish custom profession. Please try again.');
    }
  };

  const handleUseProfession = async (professionTitle: string) => {
    if (!currentPartner) return;
    try {
      await api.useProfession(currentPartner.id, professionTitle);
      onRefreshData();
      alert(`✅ Active Profession switched to "${professionTitle}"! You are now receiving orders under this trade.`);
    } catch (err) {
      alert('Failed to switch active profession.');
    }
  };

  const handleKYCSuccess = (newPartner: GigPartner) => {
    onRefreshData();
    setSelectedPartnerId(newPartner.id);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 🚀 Top Navigation View Switcher (Become a Partner vs Active Operations Console) */}
      <div className={`rounded-3xl p-3 sm:p-4 border shadow-xl transition-all ${
        isDark ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* View Mode Buttons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto p-1 bg-slate-950/60 rounded-2xl border border-slate-800">
            <button
              onClick={() => setPortalView('onboarding')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                portalView === 'onboarding'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Become a Partner & Apply</span>
            </button>

            <button
              onClick={() => setPortalView('console')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                portalView === 'console'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Active Partner Console</span>
            </button>
          </div>

          {/* Quick Partner Switcher (for active console) */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-slate-400 font-bold hidden md:inline">Current Profile:</span>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
              }`}
            >
              {partners.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} • {p.role.split(' ')[0]} ({p.isOnline ? 'Online' : 'Offline'})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 VIEW 1: BECOME A FYKZI SERVICE PARTNER & MULTI-STEP ONBOARDING        */}
      {/* ========================================================================= */}
      {portalView === 'onboarding' && (
        <div className="space-y-10">

          {/* 1. Hero Header Section */}
          <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 border shadow-2xl transition-all ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-950 border-blue-500/30 text-white'
              : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-blue-200 text-slate-900'
          }`}>
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Join Kerala's #1 Doorstep Network</span>
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Kerala Police PCC Checked</span>
                </span>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  🎁 ₹250 Welcome Bonus
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Become a <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">Fykzi Service Partner</span>
              </h1>

              <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Grow your independent freelance business across Kerala with guaranteed work, <strong>zero platform commission on travel allowances</strong>, instant daily UPI withdrawals, and verified customer OTP security.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    const formEl = document.getElementById('partner-application-form');
                    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Start Application Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setPortalView('console')}
                  className={`px-5 py-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                    isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Already Registered? Open Console
                </button>
              </div>
            </div>
          </div>

          {/* 2. "Why Join Fykzi" Benefits Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Why Join Fykzi?
              </h2>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              The highest earning, safest, and most flexible platform built for independent professionals in Kerala.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              
              {/* Card 1: Great Earnings */}
              <div className={`p-6 rounded-3xl border shadow-lg space-y-3 transition-all card-3d-interactive ${
                isDark ? 'bg-gradient-to-br from-slate-900 to-emerald-950/20 border-emerald-500/30' : 'bg-white border-slate-200'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl shadow-md">
                  💰
                </div>
                <h3 className="font-black text-base text-white">Great Earnings</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Earn on your schedule</strong> with fair transparent rates. 0% platform commission on customer travel batta and earn up to ₹1,500 weekly bonus incentives.
                </p>
                <div className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1 pt-1 border-t border-slate-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>100% allowance retention</span>
                </div>
              </div>

              {/* Card 2: Flexible Hours */}
              <div className={`p-6 rounded-3xl border shadow-lg space-y-3 transition-all card-3d-interactive ${
                isDark ? 'bg-gradient-to-br from-slate-900 to-blue-950/20 border-blue-500/30' : 'bg-white border-slate-200'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl shadow-md">
                  ⏰
                </div>
                <h3 className="font-black text-base text-white">Flexible Hours</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Work when you want.</strong> Turn your Duty Radar ON when available and OFF when resting. Full freedom with zero penalty on personal schedule.
                </p>
                <div className="text-[11px] text-blue-400 font-bold flex items-center space-x-1 pt-1 border-t border-slate-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>1-Tap duty switch anytime</span>
                </div>
              </div>

              {/* Card 3: Steady Job Flow */}
              <div className={`p-6 rounded-3xl border shadow-lg space-y-3 transition-all card-3d-interactive ${
                isDark ? 'bg-gradient-to-br from-slate-900 to-amber-950/20 border-amber-500/30' : 'bg-white border-slate-200'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl shadow-md">
                  📈
                </div>
                <h3 className="font-black text-base text-white">Steady Job Flow</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Consistent customer demand</strong> across all Kochi micro-markets, taluks and highways. 24/7 roadside breakdown calls and booked appointments.
                </p>
                <div className="text-[11px] text-amber-400 font-bold flex items-center space-x-1 pt-1 border-t border-slate-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>AI radar dispatch in 5 km radius</span>
                </div>
              </div>

              {/* Card 4: 100% Protection */}
              <div className={`p-6 rounded-3xl border shadow-lg space-y-3 transition-all card-3d-interactive ${
                isDark ? 'bg-gradient-to-br from-slate-900 to-purple-950/20 border-purple-500/30' : 'bg-white border-slate-200'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xl shadow-md">
                  🛡️
                </div>
                <h3 className="font-black text-base text-white">100% Job & Pay Protection</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Jobs are completed exclusively with a <strong>customer 4-digit OTP</strong>. Pre-work 4-angle photo protection protects you against false pre-existing damage claims.
                </p>
                <div className="text-[11px] text-purple-400 font-bold flex items-center space-x-1 pt-1 border-t border-slate-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>Guaranteed safe completion</span>
                </div>
              </div>

              {/* Card 5: Daily Instant UPI */}
              <div className={`p-6 rounded-3xl border shadow-lg space-y-3 transition-all card-3d-interactive ${
                isDark ? 'bg-gradient-to-br from-slate-900 to-cyan-950/20 border-cyan-500/30' : 'bg-white border-slate-200'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xl shadow-md">
                  ⚡
                </div>
                <h3 className="font-black text-base text-white">Daily Instant UPI Payouts</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Withdraw earnings <strong>daily with 1-tap</strong> directly to Google Pay, PhonePe, or Paytm UPI ID without waiting for weekly settlement delays.
                </p>
                <div className="text-[11px] text-cyan-400 font-bold flex items-center space-x-1 pt-1 border-t border-slate-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>Direct to bank in 5 seconds</span>
                </div>
              </div>

              {/* Card 6: Add Any Custom Trade */}
              <div className={`p-6 rounded-3xl border shadow-lg space-y-3 transition-all card-3d-interactive ${
                isDark ? 'bg-gradient-to-br from-slate-900 to-rose-950/20 border-rose-500/30' : 'bg-white border-slate-200'
              }`}>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xl shadow-md">
                  🛠️
                </div>
                <h3 className="font-black text-base text-white">Add Any Custom Trade</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Offer specialized trades like Solar Tech, Wood Polishing, Smart Home IoT or Tailoring. Your custom trades are automatically published in the customer <strong>"Other Works"</strong> grid!
                </p>
                <div className="text-[11px] text-rose-400 font-bold flex items-center space-x-1 pt-1 border-t border-slate-800">
                  <Check className="w-3.5 h-3.5" />
                  <span>Unlimited custom trades</span>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Multi-Step Partner Registration Form Container */}
          <div id="partner-application-form" className={`rounded-3xl border p-6 sm:p-9 shadow-2xl transition-all scroll-mt-20 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Step Progress Tracker Bar */}
            <div className="mb-8">
              <div className="flex items-center justify-between max-w-2xl mx-auto text-xs font-bold mb-3">
                <button
                  type="button"
                  onClick={() => onboardingStep > 1 && setOnboardingStep(1)}
                  className={`flex items-center space-x-1.5 cursor-pointer ${
                    onboardingStep >= 1 ? 'text-blue-500 font-black' : 'text-slate-500'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                    onboardingStep > 1 ? 'bg-emerald-500 text-slate-950 font-black' : onboardingStep === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {onboardingStep > 1 ? '✓' : '1'}
                  </span>
                  <span>1. Contact Info</span>
                </button>

                <div className={`flex-1 h-0.5 mx-2 ${onboardingStep >= 2 ? 'bg-blue-600' : 'bg-slate-800'}`} />

                <button
                  type="button"
                  onClick={() => onboardingStep > 2 && setOnboardingStep(2)}
                  className={`flex items-center space-x-1.5 cursor-pointer ${
                    onboardingStep >= 2 ? 'text-blue-500 font-black' : 'text-slate-500'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                    onboardingStep > 2 ? 'bg-emerald-500 text-slate-950 font-black' : onboardingStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {onboardingStep > 2 ? '✓' : '2'}
                  </span>
                  <span>2. Services &amp; Trade</span>
                </button>

                <div className={`flex-1 h-0.5 mx-2 ${onboardingStep >= 3 ? 'bg-blue-600' : 'bg-slate-800'}`} />

                <button
                  type="button"
                  onClick={() => onboardingStep > 3 && setOnboardingStep(3)}
                  className={`flex items-center space-x-1.5 cursor-pointer ${
                    onboardingStep >= 3 ? 'text-blue-500 font-black' : 'text-slate-500'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                    onboardingStep >= 3 ? 'bg-emerald-500 text-slate-950 font-black' : onboardingStep === 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {onboardingStep >= 4 ? '✓' : '3'}
                  </span>
                  <span>3. Experience</span>
                </button>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${(onboardingStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* STEP 1: CONTACT INFORMATION                                   */}
            {/* ------------------------------------------------------------- */}
            {onboardingStep === 1 && (
              <form onSubmit={handleStep1Next} className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                    Step 1 of 3 • Contact Information
                  </span>
                  <h3 className="text-xl font-black">Tell us how customers and Fykzi can reach you</h3>
                  <p className="text-xs text-slate-400">
                    Your contact information is protected under India's DPDP Act. Masked calling is enabled for all live jobs.
                  </p>
                </div>

                <div className="space-y-4">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                      Full Name (As per Aadhaar / Driving License) *
                    </label>
                    <input
                      type="text"
                      required
                      value={applicantName}
                      onChange={(e) => setApplicantName(e.target.value)}
                      placeholder="e.g. Nihal Varma"
                      className={`w-full text-xs p-3.5 rounded-2xl border font-bold focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  {/* Mobile Number & Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                        Mobile Number (10 Digits) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={applicantPhone}
                          onChange={(e) => {
                            const val = e.target.value;
                            setApplicantPhone(val);
                            if (sameAsMobile) setApplicantWhatsApp(val);
                          }}
                          placeholder="98472 55890"
                          className={`w-full text-xs pl-12 pr-3.5 py-3.5 rounded-2xl border font-bold focus:outline-none focus:border-blue-500 ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                        Email Address (For Work Orders) *
                      </label>
                      <input
                        type="email"
                        required
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        placeholder="e.g. nihal.service@fykzi.in"
                        className={`w-full text-xs p-3.5 rounded-2xl border font-bold focus:outline-none focus:border-blue-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Service Location / Coverage Hub */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                      Primary Service Location / Hub in Kerala *
                    </label>
                    <select
                      value={applicantLocation}
                      onChange={(e) => setApplicantLocation(e.target.value)}
                      className={`w-full text-xs p-3.5 rounded-2xl border font-bold focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    >
                      {KOCHI_LOCATIONS.map(loc => (
                        <option key={loc.id} value={`${loc.name}, ${loc.district || 'Ernakulam'}`}>
                          {loc.name} • {loc.district || 'Kerala'} ({loc.regionType})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 mt-1">
                      You will receive instant radar job dispatches within 5-10 km of this selected coverage center.
                    </p>
                  </div>

                  {/* Workshop / Residential Address */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                      Street / Workshop / Residential Address
                    </label>
                    <input
                      type="text"
                      value={applicantAddress}
                      onChange={(e) => setApplicantAddress(e.target.value)}
                      placeholder="e.g. Door No. 4B, Near InfoPark Expressway, Kakkanad"
                      className={`w-full text-xs p-3.5 rounded-2xl border focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  {/* WhatsApp Number & Same As Mobile Checkbox */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                        WhatsApp Number (For Instant Dispatch Alerts)
                      </label>
                      <label className="flex items-center space-x-1.5 text-xs text-blue-400 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={sameAsMobile}
                          onChange={(e) => {
                            setSameAsMobile(e.target.checked);
                            if (e.target.checked) setApplicantWhatsApp(applicantPhone);
                          }}
                          className="rounded text-blue-600"
                        />
                        <span>Same as Mobile</span>
                      </label>
                    </div>

                    {!sameAsMobile && (
                      <input
                        type="tel"
                        value={applicantWhatsApp}
                        onChange={(e) => setApplicantWhatsApp(e.target.value)}
                        placeholder="e.g. 98472 55890"
                        className={`w-full text-xs p-3.5 rounded-2xl border font-bold focus:outline-none focus:border-blue-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    )}
                  </div>

                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Next: Select Services &amp; Trade</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 2: SERVICE SELECTION & PRIMARY SERVICE LIST               */}
            {/* ------------------------------------------------------------- */}
            {onboardingStep === 2 && (
              <form onSubmit={handleStep2Next} className="space-y-6 max-w-3xl mx-auto">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                    Step 2 of 3 • Service &amp; Trade Selection
                  </span>
                  <h3 className="text-xl font-black">Select Your Primary Trade &amp; Services</h3>
                  <p className="text-xs text-slate-400">
                    Choose one or more primary categories you offer, or type your specialized custom profession in the custom trade section below.
                  </p>
                </div>

                {/* Primary Services Grid */}
                <div className="space-y-3">
                  <div className="text-xs font-black uppercase tracking-wider text-slate-300">
                    Primary Service Categories (Tap to Select)
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PRIMARY_SERVICES_LIST.map((srv) => {
                      const isSelected = selectedServices.includes(srv.id);
                      return (
                        <div
                          key={srv.id}
                          onClick={() => handleToggleServiceSelection(srv.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer card-3d-interactive flex items-start space-x-3.5 ${
                            isSelected
                              ? 'border-blue-500 bg-blue-950/30 ring-2 ring-blue-500 shadow-lg shadow-blue-600/20'
                              : isDark
                              ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                              : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="text-2xl p-2 bg-slate-800/80 rounded-xl shrink-0">
                            {srv.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-black text-white truncate">{srv.title}</h4>
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                                isSelected ? 'bg-blue-600 text-white font-black' : 'border border-slate-700'
                              }`}>
                                {isSelected && '✓'}
                              </div>
                            </div>
                            <p className="text-[11px] text-teal-400 font-bold mt-0.5">{srv.titleMl}</p>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{srv.tagline}</p>
                            <div className="text-[10px] text-amber-400 font-bold mt-1.5">
                              Typical Pay: {srv.typicalRate}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Other Works & Custom Trade Option Section */}
                <div className={`p-5 rounded-3xl border transition-all space-y-4 ${
                  isCustomTradeSelected
                    ? 'border-indigo-500 bg-indigo-950/20 ring-1 ring-indigo-500/40'
                    : isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isCustomTradeSelected}
                      onChange={(e) => setIsCustomTradeSelected(e.target.checked)}
                      className="mt-1 w-4 h-4 text-indigo-600 rounded"
                    />
                    <div>
                      <div className="text-sm font-black flex items-center space-x-2">
                        <span>➕ Other Options: Type Your Particular Job / Custom Trade</span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                          Other Works
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Can't find your exact skill above? Type your custom job title, rate, and specialized equipment to have it automatically published in the customer <strong>"Other Works"</strong> grid!
                      </p>
                    </div>
                  </label>

                  {/* Expanded Custom Trade Form */}
                  {isCustomTradeSelected && (
                    <div className="space-y-3.5 pt-2 border-t border-slate-800 animate-in fade-in">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                          Suggest Job Title / Your Trade Name *
                        </label>
                        <input
                          type="text"
                          required={isCustomTradeSelected}
                          value={customTradeTitle}
                          onChange={(e) => setCustomTradeTitle(e.target.value)}
                          placeholder="e.g. Solar Inverter Technician, Gardening Pro, Furniture Restoration, Smart Door Locks..."
                          className={`w-full text-xs p-3 rounded-xl border font-bold focus:outline-none focus:border-indigo-500 ${
                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                            Service Tagline / Description
                          </label>
                          <input
                            type="text"
                            value={customTradeTagline}
                            onChange={(e) => setCustomTradeTagline(e.target.value)}
                            placeholder="e.g. Doorstep solar battery testing & sine wave inverter servicing"
                            className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-indigo-500 ${
                              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                            Suggested Diagnostic Fee (₹)
                          </label>
                          <input
                            type="number"
                            value={customTradePrice}
                            onChange={(e) => setCustomTradePrice(e.target.value)}
                            placeholder="349"
                            className={`w-full text-xs p-3 rounded-xl border font-bold focus:outline-none focus:border-indigo-500 ${
                              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                          Specialized Equipment Carried Onsite
                        </label>
                        <input
                          type="text"
                          value={customTradeEquipment}
                          onChange={(e) => setCustomTradeEquipment(e.target.value)}
                          placeholder="e.g. Digital hydrometer, multi-tester, insulated safety gloves & drill"
                          className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-indigo-500 ${
                            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(1)}
                    className={`px-5 py-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    ⬅ Back to Contact Info
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <span>Next: Experience &amp; Skills</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 3: EXPERIENCE GIVING SECTION                              */}
            {/* ------------------------------------------------------------- */}
            {onboardingStep === 3 && (
              <form onSubmit={handleCompletePartnerRegistration} className="space-y-6 max-w-2xl mx-auto">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-500">
                    Step 3 of 3 • Experience &amp; Qualifications
                  </span>
                  <h3 className="text-xl font-black">Your Experience, Tools &amp; Quality Commitment</h3>
                  <p className="text-xs text-slate-400">
                    Highlight your experience to unlock higher hourly rate tiers and build trust with customers across Kerala.
                  </p>
                </div>

                <div className="space-y-5">
                  
                  {/* Years of Experience Selector */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                      Total Work Experience *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        '< 1 Year (Beginner Pro)',
                        '1 - 3 Years (Junior Pro)',
                        '3 - 5 Years (Experienced Pro)',
                        '5 - 10 Years (Senior Specialist)',
                        '10+ Years (Master Veteran)'
                      ].map((exp) => (
                        <button
                          key={exp}
                          type="button"
                          onClick={() => setExperienceLevel(exp)}
                          className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all cursor-pointer ${
                            experienceLevel === exp
                              ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30 font-black'
                              : isDark ? 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{exp}</span>
                            {experienceLevel === exp && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Specialized Experience Summary Textarea */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1.5">
                      Experience Summary / What You Specialize In *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={experienceSummary}
                      onChange={(e) => setExperienceSummary(e.target.value)}
                      placeholder="e.g. 5 years specializing in doorstep vehicle breakdown repairs, electrical circuit diagnosis, high-pressure foam washes, and domestic wiring in Kochi..."
                      className={`w-full text-xs p-3.5 rounded-2xl border focus:outline-none focus:border-blue-500 leading-relaxed ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  {/* Tools & Equipment Owned Multi-Select */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                      Tools &amp; Equipment Owned (Select All That Apply)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {POPULAR_TOOLS_LIST.map((tool) => {
                        const isChecked = selectedTools.includes(tool);
                        return (
                          <div
                            key={tool}
                            onClick={() => handleToggleTool(tool)}
                            className={`p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center space-x-2.5 ${
                              isChecked
                                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                                : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 ${
                              isChecked ? 'bg-emerald-500 text-slate-950 font-black' : 'border border-slate-700'
                            }`}>
                              {isChecked && '✓'}
                            </div>
                            <span className="truncate">{tool}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Professional Credentials & References */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                        Commercial Driving License (Optional)
                      </label>
                      <input
                        type="text"
                        value={dlNumberInput}
                        onChange={(e) => setDlNumberInput(e.target.value)}
                        placeholder="e.g. KL-07-2019-0045821"
                        className={`w-full text-xs p-3 rounded-xl border font-mono focus:outline-none focus:border-blue-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                        ITI / Trade Diploma / Certificate (Optional)
                      </label>
                      <input
                        type="text"
                        value={itiTradeCertificate}
                        onChange={(e) => setItiTradeCertificate(e.target.value)}
                        placeholder="e.g. Wireman License / ITI Automobile"
                        className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Past Workshop / Reference */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                      Past Workshop / Employer / Experience Reference
                    </label>
                    <input
                      type="text"
                      value={pastWorkshopRef}
                      onChange={(e) => setPastWorkshopRef(e.target.value)}
                      placeholder="e.g. Kochi Motors / Auto Care Centre / Freelance Self-Employed"
                      className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  {/* Quality & PCC Checkbox Agreements */}
                  <div className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-blue-50/60 border-blue-200'
                  }`}>
                    <label className="flex items-start space-x-3 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        required
                        checked={agreeQualityTerms}
                        onChange={(e) => setAgreeQualityTerms(e.target.checked)}
                        className="mt-0.5 text-blue-600 rounded"
                      />
                      <span>
                        I agree to Fykzi's <strong>Quality Standards &amp; 100% Work Satisfaction Guarantee</strong> and will complete pre-work 4-angle photo inspections.
                      </span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        required
                        checked={agreePccVerification}
                        onChange={(e) => setAgreePccVerification(e.target.checked)}
                        className="mt-0.5 text-blue-600 rounded"
                      />
                      <span>
                        I consent to <strong>Kerala Police Thuna PCC (Police Clearance Certificate)</strong> background verification check for customer doorstep trust.
                      </span>
                    </label>
                  </div>

                </div>

                <div className="pt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(2)}
                    className={`px-5 py-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    ⬅ Back to Services
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmittingApplication}
                    className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-emerald-500/20 transition-all flex items-center space-x-2 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSubmittingApplication ? 'Submitting Application...' : 'Submit Application & Go Live 🚀'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 4: INSTANT CONFIRMATION & ACTIVATION                     */}
            {/* ------------------------------------------------------------- */}
            {onboardingStep === 4 && (
              <div className="py-8 max-w-xl mx-auto text-center space-y-6 animate-in zoom-in-95">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Application Approved • Profile Active
                  </span>
                  <h3 className="text-2xl font-black">
                    🎉 Welcome to Fykzi, {applicantName}!
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Your service partner profile has been registered under <strong>{applicantLocation}</strong>. Your ₹250 welcome bonus has been credited to your wallet!
                  </p>
                </div>

                {/* Partner ID & Benefits Summary Card */}
                <div className={`p-5 rounded-3xl border text-left space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs text-slate-400">Partner ID:</span>
                    <strong className="text-xs font-mono text-blue-400">
                      {newRegisteredPartner?.id || '#FYK-2026-984'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs text-slate-400">Registered Trade:</span>
                    <strong className="text-xs text-white">
                      {newRegisteredPartner?.role || selectedServices[0] || 'Doorstep Service Pro'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <span className="text-xs text-slate-400">Experience Tier:</span>
                    <strong className="text-xs text-amber-400">{experienceLevel}</strong>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-400">Initial Wallet Credit:</span>
                    <strong className="text-sm text-emerald-400 font-black">₹250 (Joining Bonus)</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setPortalView('console');
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    <Power className="w-4 h-4 text-emerald-400" />
                    <span>Open Partner Console &amp; Go Online</span>
                  </button>

                  <button
                    onClick={() => {
                      setOnboardingStep(1);
                    }}
                    className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Apply for Another Trade
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 📊 VIEW 2: ACTIVE GIG PARTNER OPERATIONS CONSOLE (DUTY, JOBS, WALLET)   */}
      {/* ========================================================================= */}
      {portalView === 'console' && (
        <div className="space-y-8">
          
          {/* Persona Switcher Bar */}
          <div className={`rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border shadow-xl transition-all ${
            isDark ? 'bg-slate-900/90 text-white border-slate-800' : 'bg-white text-slate-900 border-slate-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-500/20 text-amber-500 rounded-xl">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                  Active Partner Console
                </span>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Switch active gig worker profile or onboard with new credentials
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {partners.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPartnerId(p.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    selectedPartnerId === p.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black'
                      : isDark
                      ? 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.name} ({p.role.split(' ')[0]})
                </button>
              ))}

              <button
                onClick={() => {
                  setPortalView('onboarding');
                  setOnboardingStep(1);
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:scale-105 transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>+ Register New Partner</span>
              </button>
            </div>
          </div>

          {/* Partner KYC Onboarding Callout Banner */}
          <div className={`rounded-3xl p-5 sm:p-6 border transition-all flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg ${
            isDark
              ? 'bg-gradient-to-r from-blue-950/50 via-slate-900 to-amber-950/30 border-blue-500/30 text-white'
              : 'bg-gradient-to-r from-blue-50 via-white to-amber-50 border-blue-200 text-slate-900'
          }`}>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                    Police Clearance Certificate (PCC) Checked
                  </span>
                  <span className="text-[10px] font-bold text-amber-500">₹250 Joining Bonus</span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold mt-1">
                  Want to earn with Fykzi? Complete 3-Minute Aadhaar &amp; PCC Document KYC
                </h3>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Accept on-demand jobs in your area with zero platform cut on customer travel allowances and daily instant UPI payouts.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowKYCModal(true)}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all shadow-xl hover:scale-105 shrink-0 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Complete Partner KYC</span>
            </button>
          </div>

          {/* Main Profile & Duty Toggle Card Widget */}
          <div className={`rounded-3xl border p-6 sm:p-8 shadow-2xl space-y-6 transition-all ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-md'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              
              {/* Partner Info Widget */}
              <div className="flex items-center space-x-4">
                <img
                  src={currentPartner.photoUrl}
                  alt={currentPartner.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
                  }}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-lg shadow-amber-500/10"
                />
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h2 className="text-xl font-black">{currentPartner.name}</h2>
                    <span className="bg-amber-400/20 text-amber-500 border border-amber-400/40 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{currentPartner.rating} ({currentPartner.reviewsCount || currentPartner.reviews?.length || 0} Reviews)</span>
                    </span>
                    {currentPartner.isTopRated && (
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Top Rated Pro ({currentPartner.hourlyRateMultiplier || 1.25}x Rate)</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-teal-500 mt-0.5">{currentPartner.role}</p>
                  
                  {/* Verification Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      isDark ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span>Govt ID Verified (Masked)</span>
                    </span>

                    <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      currentPartner.kyc.pccStatus === 'VERIFIED'
                        ? isDark ? 'bg-teal-950 text-teal-300 border border-teal-800' : 'bg-teal-50 text-teal-700 border border-teal-200'
                        : isDark ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      <ShieldCheck className="w-3 h-3" />
                      <span>PCC Checked by Fykzi: {currentPartner.kyc.pccStatus}</span>
                    </span>

                    <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      isDark ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      <span>100% Damage Responsibility Agreed</span>
                    </span>

                    {currentPartner.kyc.pccRefNo && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                        isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Ref: {currentPartner.kyc.pccRefNo}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Duty Switcher Widget */}
              <div className="w-full md:w-auto bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between space-x-6">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Duty Radar Status</div>
                  <div className="text-sm font-black flex items-center space-x-2 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${currentPartner.isOnline ? 'bg-emerald-400 animate-pulse shadow-lg shadow-emerald-500/50' : 'bg-rose-500'}`} />
                    <span className={currentPartner.isOnline ? 'text-emerald-400 font-extrabold' : 'text-rose-400'}>
                      {currentPartner.isOnline ? 'ONLINE & RECEIVING JOBS' : 'OFFLINE'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleToggleDuty}
                  className={`p-3.5 rounded-xl transition-all cursor-pointer ${
                    currentPartner.isOnline
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 font-black shadow-lg shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-rose-600 to-rose-700 text-white hover:brightness-110 font-black shadow-lg'
                  }`}
                >
                  <Power className="w-5 h-5" />
                </button>
              </div>

            </div>

            {/* Colorful Quick Earnings Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
              
              {/* Widget 1: Wallet Balance */}
              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 border border-emerald-700/60 rounded-2xl p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-emerald-300">
                  <span className="text-[10px] uppercase font-black tracking-wider">Available Wallet</span>
                  <Wallet className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white">₹{currentPartner.walletBalance}</div>
                <div className="text-[11px] text-emerald-400 font-bold flex items-center space-x-1">
                  <span>✓ 100% Zero-Deduction Wallet</span>
                </div>
              </div>

              {/* Widget 2: Today's Earnings */}
              <div className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-amber-900 to-slate-900 border border-amber-700/60 rounded-2xl p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-amber-300">
                  <span className="text-[10px] uppercase font-black tracking-wider">Today's Earnings</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-amber-300">₹{currentPartner.todaysEarnings}</div>
                <div className="text-[11px] text-amber-400 font-bold flex items-center space-x-1">
                  <span>⚡ Daily T+1 / Instant UPI</span>
                </div>
              </div>

              {/* Widget 3: Allowance Rule */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-700/60 rounded-2xl p-5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-indigo-300">
                  <span className="text-[10px] uppercase font-black tracking-wider">Platform Rule</span>
                  <Award className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-sm font-black text-white">0% Take Rate on Allowances</div>
                <div className="text-[11px] text-indigo-300 leading-tight">
                  Return bus fares &amp; meal batta belong 100% to you.
                </div>
              </div>

            </div>
          </div>

          {/* 🎯 Weekly Target Achievement & Retention Program */}
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-2xl space-y-5 transition-all ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-950 border-blue-800/40 text-white'
              : 'bg-gradient-to-br from-blue-50 via-white to-amber-50 border-blue-200 text-slate-900 shadow-lg'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-blue-600 text-white flex items-center justify-center font-black shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                      Target Achievement &amp; Retention Hub
                    </span>
                    <span className="text-[10px] font-black uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                      Tier: {currentPartner.targetAchievement?.tierLevel || 'STANDARD'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black mt-0.5">
                    Weekly Platform Target: Complete {currentPartner.targetAchievement?.weeklyTarget || 15} Jobs
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-bold text-slate-400">Milestone Incentive</div>
                <div className="text-2xl font-black text-amber-400">
                  ₹{currentPartner.targetAchievement?.bonusAmount || 1500} Bonus
                </div>
              </div>
            </div>

            {/* Milestone Progress Bar */}
            {(() => {
              const target = currentPartner.targetAchievement?.weeklyTarget || 15;
              const completed = currentPartner.targetAchievement?.completedJobsThisWeek || currentPartner.jobsCompleted || 0;
              const pct = Math.min(100, Math.round((completed / target) * 100));
              const isUnlocked = currentPartner.targetAchievement?.isBonusUnlocked || completed >= target;

              return (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-300">
                      Progress: <strong className="text-white">{completed} / {target} Jobs</strong> completed this week
                    </span>
                    <span className={isUnlocked ? 'text-emerald-400 font-black' : 'text-amber-400'}>
                      {isUnlocked ? '🎉 ₹1,500 Bonus Unlocked!' : `${target - completed} More to unlock bonus (${pct}%)`}
                    </span>
                  </div>

                  <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-blue-600 transition-all duration-1000 shadow-md"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })()}

            {/* Anti-Leakage / Work For Fykzi Policy Notice */}
            <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center space-x-2 font-black text-amber-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="uppercase tracking-wider text-[11px]">
                  Why Freelancers Work On-Platform (Zero Client Poaching Policy)
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] leading-relaxed pt-1">
                <div className="space-y-1">
                  <strong className="text-white block">1. ₹1,500 Weekly Milestone:</strong>
                  <p className="text-slate-400">
                    Hit 15 platform jobs weekly to earn cash bonuses and upgrade to our lowest platform fee tier.
                  </p>
                </div>
                <div className="space-y-1">
                  <strong className="text-white block">2. High Trust = Higher Rates:</strong>
                  <p className="text-slate-400">
                    Top-rated pros earn up to <strong>1.25x hourly rates</strong> and are listed at the top for customers.
                  </p>
                </div>
                <div className="space-y-1">
                  <strong className="text-white block">3. Strict Protection Rules:</strong>
                  <p className="text-slate-400">
                    Working offline forfeits customer transit insurance, removes Kerala Police Thuna badge, and voids damage mediation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Feedback & Reputation Ratings Card */}
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-2xl space-y-4 transition-all ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-md'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <h3 className="text-lg font-black">Customer Reviews &amp; Trust Reputation</h3>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Real verified client feedback from completed bookings in your service zone.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-amber-400">{currentPartner.rating} ★</span>
                <span className="text-xs text-slate-400">
                  ({currentPartner.reviewsCount || currentPartner.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>

            {/* Reviews List */}
            {currentPartner.reviews && currentPartner.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                {currentPartner.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className={`p-3.5 rounded-2xl border space-y-2 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white">{rev.customerName}</span>
                        <span className="text-[10px] text-slate-400">• {rev.serviceTitle}</span>
                      </div>
                      <div className="flex items-center text-amber-400 text-xs font-black space-x-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className={`text-xs italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>{rev.createdAt}</span>
                      <span className="text-emerald-400 font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Verified Job • Zero Damage</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`p-6 text-center rounded-2xl border text-xs ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                No reviews recorded yet. Complete upcoming orders to build your 5-star reputation!
              </div>
            )}
          </div>

          {/* 🛠️ Worker Custom Professions & Trades (Published to Other Works Grid) */}
          <div className={`rounded-3xl border p-6 sm:p-7 shadow-xl space-y-5 transition-all ${
            isDark
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-black tracking-tight">
                    My Custom Professions &amp; Services
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow">
                    Live in "Other Works" Grid
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Add any freelance trade, craft, or specialty you offer. All your custom works are automatically published under the <strong>"Other Works"</strong> category in the customer main grid!
                </p>
              </div>

              <button
                onClick={() => setShowAddProfessionModal(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all flex items-center justify-center space-x-1.5 shadow-md shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Custom Profession</span>
              </button>
            </div>

            {/* Current Active Profession Badge */}
            <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-blue-50/60 border-blue-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Primary Active Trade (Receiving Bookings)
                  </span>
                  <div className="text-sm font-black text-white flex items-center space-x-2">
                    <span>{currentPartner.role}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.2 rounded-full font-bold">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400">
                Assigned in customer search &amp; radar dispatch
              </div>
            </div>

            {/* List of Custom Professions offered by this partner */}
            {currentPartner.customProfessions && currentPartner.customProfessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {currentPartner.customProfessions.map((cp) => {
                  const isCurrentlyUsed = currentPartner.role.toLowerCase() === cp.title.toLowerCase();
                  return (
                    <div
                      key={cp.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                        isCurrentlyUsed
                          ? 'border-blue-500 bg-blue-950/20 ring-1 ring-blue-500/40'
                          : isDark
                          ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                              Other Works • Custom Trade
                            </span>
                            <h4 className="font-black text-sm text-white truncate mt-0.5">{cp.title}</h4>
                          </div>
                          {isCurrentlyUsed ? (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 shrink-0">
                              In Use
                            </span>
                          ) : (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 shrink-0">
                              Published
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-2">
                          {cp.tagline}
                        </p>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                          <span className="text-slate-400">Upfront Price:</span>
                          <span className="font-black text-blue-400">₹{cp.price} (Flat Diagnostic)</span>
                        </div>

                        {cp.equipment && (
                          <div className="text-[11px] text-slate-400 truncate">
                            🧰 {cp.equipment}
                          </div>
                        )}
                      </div>

                      <div className="pt-3">
                        {isCurrentlyUsed ? (
                          <div className="w-full py-2 rounded-xl text-center text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                            ✓ Primary Active Profession
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleUseProfession(cp.title)}
                            className="w-full py-2 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-500 text-white transition-all shadow cursor-pointer"
                          >
                            Use This Profession
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`p-6 text-center rounded-2xl border text-xs ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}>
                <p>You haven't published any extra custom professions yet.</p>
                <p className="text-[11px] mt-1 text-slate-500">
                  Click <strong>"Add New Custom Profession"</strong> above to add specialized services like Solar Technician, Gardening, Furniture Restoration, Smart Home IoT, or Tailoring!
                </p>
              </div>
            )}
          </div>

          {/* Active Work In Progress Orders Widget */}
          {myActiveJobs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>My Active Duty Orders</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myActiveJobs.map(job => (
                  <div key={job.id} className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-amber-500/40 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Order #{job.id}</span>
                        <h4 className="text-base font-bold text-white">{job.serviceTitle}</h4>
                      </div>
                      <span className="bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs px-2.5 py-1 rounded-full font-bold">
                        {job.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start space-x-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-white flex items-center space-x-2">
                            <span>{job.customerName}</span>
                            <span className="text-[10px] text-teal-300 font-mono bg-slate-800 px-2 py-0.5 rounded-full">
                              {job.customerPhoneMasked || '+91 98950 ••••'}
                            </span>
                            <a
                              href={`tel:${job.customerPhone}`}
                              className="text-[10px] bg-teal-500/20 text-teal-300 hover:bg-teal-500/30 px-2 py-0.5 rounded-full font-bold flex items-center space-x-1"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              <span>Relay Call</span>
                            </a>
                          </div>
                          <div className="text-slate-400 mt-0.5">{job.location.address}</div>
                          <div className="text-[10px] text-emerald-400 mt-1 flex items-center space-x-1">
                            <span>🏡 Residential Maintenance (Occupant Present)</span>
                          </div>
                        </div>
                      </div>

                      {job.vehicleDetails && (
                        <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-slate-300">
                          🚗 Work Details: <strong className="text-white">{job.vehicleDetails}</strong>
                        </div>
                      )}

                      <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-slate-200">
                        <div>
                          <span className="block text-slate-400 text-[10px]">Your Earnings (T+1 Escrow)</span>
                          <span className="text-emerald-400 font-extrabold text-sm">₹{job.pricing.partnerEarnings}</span>
                        </div>
                        <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-1 rounded-lg border border-amber-500/20">
                          OTP Protected
                        </span>
                      </div>
                    </div>

                    {job.status === 'ASSIGNED' && (
                      <button
                        onClick={() => setShowPrecheckModal(job)}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Upload Mandatory 4-Angle Pre-Inspection Photos</span>
                      </button>
                    )}

                    {job.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => {
                          setShowCompletionModal(job);
                          setCompletionOtpInput('');
                        }}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify Customer OTP &amp; Complete Job</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Incoming Job Radar Widget */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-teal-400" />
                  <span>Incoming Job Radar ({currentPartner.currentLocation?.name || 'Active Zone'})</span>
                </h3>
                <p className="text-xs text-slate-400">Live requests ready for immediate dispatch or scheduled time slots</p>
              </div>
              <button
                onClick={onRefreshData}
                className="text-xs font-bold text-teal-400 hover:underline cursor-pointer"
              >
                Refresh Radar
              </button>
            </div>

            {!currentPartner.isOnline ? (
              <div className="bg-amber-950/40 border border-amber-800/60 rounded-3xl p-8 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="font-bold text-white">You are currently OFFLINE</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Toggle your duty status ONLINE using the top switcher to start receiving incoming job requests across your coverage zone.
                </p>
              </div>
            ) : pendingJobs.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                <h4 className="font-bold text-white">Job Radar Standing By</h4>
                <p className="text-xs text-slate-400">
                  No new unassigned requests in your micro-market right now. New customer bookings will pop up here instantly!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingJobs.map(job => (
                  <div key={job.id} className="bg-slate-900 border border-teal-800/60 hover:border-teal-400/80 rounded-3xl p-6 shadow-xl transition-all space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          {job.location.microMarket} • 2.4 km away
                        </span>
                        {job.preferredPartnerId === currentPartner.id && (
                          <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                            ⭐ Direct Request for You
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-semibold">{job.scheduledTime}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{job.serviceTitle}</h4>
                      <p className="text-xs text-slate-400">{job.tierName}</p>
                    </div>

                    {/* Scheduling Details Card */}
                    {(job.targetDate || job.targetTimeSlot) && (
                      <div className="p-3 rounded-2xl bg-slate-950/90 border border-blue-500/30 text-xs space-y-1">
                        <div className="text-[10px] font-black uppercase text-blue-400 flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Customer Scheduled Time Slot:</span>
                        </div>
                        <div className="font-bold text-white">
                          📅 Date: {job.targetDate || 'Today'} • ⏰ Slot: {job.targetTimeSlot || job.scheduledTime}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Check your calendar and confirm availability before accepting.
                        </div>
                      </div>
                    )}

                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Base Fare Share:</span>
                        <span className="font-bold text-white">₹{job.pricing.partnerEarnings}</span>
                      </div>

                      {job.pricing.allowanceReturnBus && (
                        <div className="flex justify-between text-teal-400 font-semibold">
                          <span>Return Bus Allowance (100% Yours):</span>
                          <span>+₹{job.pricing.allowanceReturnBus}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-white font-black pt-1 border-t border-slate-800 text-sm">
                        <span>Total Net Earnings:</span>
                        <span className="text-emerald-400">₹{job.pricing.partnerEarnings + (job.pricing.allowanceReturnBus || 0)}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleAcceptJob(job.id)}
                        className="flex-1 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg hover:brightness-110 flex items-center justify-center space-x-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirm Availability &amp; Accept Job</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Wallet & 1-Tap UPI Cashout Hub Widget */}
          <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800/60 space-y-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  Fykzi Partner Earnings Hub
                </div>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  1-Tap Daily Instant UPI Withdrawal
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Disburse your wallet earnings directly to GPay / PhonePe UPI intent without waiting.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Withdrawable Balance</div>
                <div className="text-3xl font-black text-amber-400">₹{withdrawableBalance}</div>
                {escrowAmount > 0 && (
                  <div className="text-[10px] text-teal-400 font-bold mt-1">
                    🔒 ₹{escrowAmount} in 24h Dispute Escrow Hold
                  </div>
                )}
              </div>
            </div>

            {/* Withdrawal Form */}
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Amount to Cash Out (₹)
                </label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  placeholder={`Max ₹${withdrawableBalance}`}
                  className="w-full bg-slate-950 border border-slate-700 text-xs p-2.5 rounded-xl text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Verified UPI VPA / Handle
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. name@upi"
                  className="w-full bg-slate-950 border border-slate-700 text-xs p-2.5 rounded-xl text-white focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleWithdrawal}
                  disabled={isProcessingWithdrawal || withdrawableBalance <= 0}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{isProcessingWithdrawal ? 'Disbursing UPI...' : 'Instant 1-Tap Cashout'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🛡️ MODALS: PRECHECK, KYC, CUSTOM PROFESSION & COMPLETION OTP             */}
      {/* ========================================================================= */}

      {/* Modal for 4-Angle Pre-Service Inspection Upload */}
      {showPrecheckModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-800 text-white">
            <div className="bg-slate-950 p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Mandatory Anti-Dispute Gate
                </span>
                <h3 className="text-base font-bold text-white">4-Angle Pre-Service Inspection</h3>
              </div>
              <button onClick={() => setShowPrecheckModal(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Before starting work on <strong className="text-white">{showPrecheckModal.vehicleDetails || showPrecheckModal.serviceTitle}</strong>, capture or confirm 4 clear photos to record pre-job condition.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {['Front Angle', 'Rear Angle', 'Left Flank', 'Right Flank'].map((angle, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center space-y-1">
                    <Camera className="w-6 h-6 text-amber-400 mx-auto" />
                    <div className="text-xs font-bold text-white">{angle}</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">✓ Camera Ready</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex justify-end space-x-3">
              <button
                onClick={() => setShowPrecheckModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCompletePrecheck}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2 rounded-xl text-xs font-black shadow-md cursor-pointer"
              >
                Submit Inspection &amp; Start Job
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner KYC Onboarding Modal */}
      <PartnerKYCModal
        isOpen={showKYCModal}
        onClose={() => setShowKYCModal(false)}
        onSuccess={handleKYCSuccess}
        theme={theme}
      />

      {/* Modal: Add New Custom Profession / Service */}
      {showAddProfessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-3xl max-w-lg w-full border shadow-2xl overflow-hidden my-auto ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 flex items-center justify-between border-b ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black">Add Your Custom Profession</h3>
                  <p className="text-[11px] text-slate-400">Publishes automatically under "Other Works" in customer main grid</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddProfessionModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomProfession} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-slate-400">
                  Profession Title / Trade Name *
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g. Solar Inverter Specialist, Gardener, Furniture Polisher..."
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 font-bold ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-slate-400">
                  Service Description / What You Do *
                </label>
                <textarea
                  rows={2}
                  required
                  value={customTagline}
                  onChange={(e) => setCustomTagline(e.target.value)}
                  placeholder="e.g. Doorstep solar inverter diagnostics, battery desulfation &amp; pure sine wave testing."
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1 text-slate-400">
                    Base Diagnostic Fee (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={99}
                    max={5000}
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-1 text-slate-400">
                    Estimated Arrival ETA
                  </label>
                  <input
                    type="text"
                    value={customEta}
                    onChange={(e) => setCustomEta(e.target.value)}
                    placeholder="e.g. 30 mins"
                    className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 font-bold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-slate-400">
                  Tools &amp; Equipment Carried
                </label>
                <input
                  type="text"
                  value={customEquipment}
                  onChange={(e) => setCustomEquipment(e.target.value)}
                  placeholder="e.g. Digital multimeter, crimping kit, safety gloves, power drill"
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1 text-slate-400">
                  Key Features / Highlights (Comma-separated)
                </label>
                <input
                  type="text"
                  value={customFeatures}
                  onChange={(e) => setCustomFeatures(e.target.value)}
                  placeholder="e.g. Doorstep diagnosis, Genuine parts, 100% damage guarantee"
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <div className="font-bold flex items-center space-x-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>PCC Verified &amp; Damage Responsibility Covered</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  This work will immediately appear in the customer <strong>"Other Works"</strong> category under your profile with 100% damage liability guarantee.
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProfessionModal(false)}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold border ${
                    isDark ? 'border-slate-800 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishingProfession}
                  className="flex-1 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isPublishingProfession ? 'Publishing...' : 'Save & Publish to Other Works'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer 4-Digit Completion OTP Verification Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-500/40 text-white">
            <div className="bg-slate-950 p-5 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                    Customer Completion Gate
                  </span>
                  <h3 className="text-base font-black text-white">Enter Customer 4-Digit OTP</h3>
                </div>
              </div>
              <button
                onClick={() => setShowCompletionModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVerifyAndCompleteJob} className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>Job Order:</span>
                  <strong className="text-white">#{showCompletionModal.id}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service:</span>
                  <strong className="text-white">{showCompletionModal.serviceTitle}</strong>
                </div>
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                  <span>Partner Payout:</span>
                  <span className="text-emerald-400 font-black text-sm">
                    ₹{showCompletionModal.pricing.partnerEarnings}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-1">
                  Customer 4-Digit Completion OTP *
                </label>
                <input
                  type="text"
                  maxLength={4}
                  required
                  value={completionOtpInput}
                  onChange={(e) => setCompletionOtpInput(e.target.value)}
                  placeholder="e.g. 4921"
                  className="w-full text-center text-2xl font-mono font-black tracking-widest p-3 rounded-2xl bg-slate-950 border-2 border-emerald-500/60 text-white focus:outline-none focus:border-emerald-400"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Ask the customer for the 4-digit code shown on their Fykzi app screen. This ensures the customer is satisfied and protects against premature claims.
                  <span className="block text-[10px] text-emerald-400 mt-0.5">
                    (Customer OTP: <strong>{showCompletionModal.completionOtp || '4921'}</strong>)
                  </span>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-800/40 text-[11px] text-blue-300 leading-snug">
                🔒 <strong>Dispute Protection Hold:</strong> Payout moves immediately to your wallet balance with a standard 24-hour dispute hold window before 1-tap UPI withdrawal.
              </div>

              <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={afterWorkPhotosConfirmed}
                  onChange={(e) => setAfterWorkPhotosConfirmed(e.target.checked)}
                  className="mt-0.5 text-emerald-500 rounded"
                />
                <span>I confirm work is complete, premises/vehicle is cleaned, and customer inspected the service.</span>
              </label>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCompletionModal(null)}
                  className="flex-1 py-3 rounded-xl text-xs font-bold border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCompletingJob || completionOtpInput.length < 4}
                  className="flex-1 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isCompletingJob ? 'Verifying OTP...' : 'Verify & Disburse'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PartnerApp;
