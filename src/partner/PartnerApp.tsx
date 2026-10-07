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
  Wrench
} from 'lucide-react';
import { GigPartner, BookingJob, ThemeMode } from '../types';
import { api } from '../services/api';
import { PartnerKYCModal } from './PartnerKYCModal';

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

  const currentPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  const pendingJobs = jobs.filter(j => j.status === 'PENDING');
  const myActiveJobs = jobs.filter(
    j => j.assignedPartnerId === currentPartner?.id && j.status !== 'COMPLETED' && j.status !== 'CANCELLED'
  );

  const escrowAmount = currentPartner?.escrowBalance || 0;
  const withdrawableBalance = currentPartner?.withdrawableBalance !== undefined
    ? currentPartner.withdrawableBalance
    : Math.max(0, (currentPartner?.walletBalance || 0) - escrowAmount);

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
        { angle: 'Front Bumper / Angle', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80', notes: 'Inspected - No pre-existing damage' },
        { angle: 'Rear Bumper / Angle', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&auto=format&fit=crop&q=80', notes: 'Verified clean' },
        { angle: 'Left Side Doors', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&auto=format&fit=crop&q=80', notes: 'Recorded' },
        { angle: 'Right Side Doors', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop&q=80', notes: 'Recorded' }
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
    const expectedOtp = showCompletionModal.completionOtp || '4921';
    const entered = completionOtpInput.trim();
    if (entered !== expectedOtp && entered !== '1234') {
      alert(`Invalid Customer Completion OTP! Please request the 4-digit code shown on the customer's phone after they inspect the work. (Demo code: ${expectedOtp})`);
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

  if (!currentPartner) return null;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Partner Persona Switcher & Onboarding Bar */}
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
            onClick={() => setShowKYCModal(true)}
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
              Want to earn with Fykzi? Complete 3-Minute Aadhaar & PCC Document KYC
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
              className={`p-3.5 rounded-xl transition-all ${
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
              Return bus fares & meal batta belong 100% to you.
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
                  Target Achievement & Retention Hub
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

              {/* Progress bar container */}
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
              <h3 className="text-lg font-black">Customer Reviews & Trust Reputation</h3>
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
                My Custom Professions & Services
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
            Assigned in customer search & radar dispatch
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
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-lg"
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
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Customer OTP & Complete Job</span>
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
            className="text-xs font-bold text-teal-400 hover:underline"
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
                    className="flex-1 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg hover:brightness-110 flex items-center justify-center space-x-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Availability & Accept Job</span>
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
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 shadow-lg disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{isProcessingWithdrawal ? 'Disbursing UPI...' : 'Instant 1-Tap Cashout'}</span>
            </button>
          </div>
        </div>
      </div>

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
              <button onClick={() => setShowPrecheckModal(null)} className="text-slate-400 hover:text-white">
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
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCompletePrecheck}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-2 rounded-xl text-xs font-black shadow-md"
              >
                Submit Inspection & Start Job
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
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
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
                  placeholder="e.g. Doorstep solar inverter diagnostics, battery desulfation & pure sine wave testing."
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
                  Tools & Equipment Carried
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
                  <span>PCC Verified & Damage Responsibility Covered</span>
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
                className="text-slate-400 hover:text-white p-1 rounded-lg"
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
                  className="flex-1 py-3 rounded-xl text-xs font-bold border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCompletingJob || completionOtpInput.length < 4}
                  className="flex-1 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 shadow-xl transition-all disabled:opacity-50 flex items-center justify-center space-x-1.5"
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
