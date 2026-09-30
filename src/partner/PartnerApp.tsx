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
  Award
} from 'lucide-react';
import { GigPartner, BookingJob } from '../types';
import { api } from '../services/api';

interface PartnerAppProps {
  partners: GigPartner[];
  jobs: BookingJob[];
  onRefreshData: () => void;
}

export const PartnerApp: React.FC<PartnerAppProps> = ({
  partners,
  jobs,
  onRefreshData
}) => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0]?.id || 'p-101');
  const [showPrecheckModal, setShowPrecheckModal] = useState<BookingJob | null>(null);
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('anand.driver@okicici');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState<boolean>(false);

  const currentPartner = partners.find(p => p.id === selectedPartnerId) || partners[0];

  const pendingJobs = jobs.filter(j => j.status === 'PENDING');
  const myActiveJobs = jobs.filter(
    j => j.assignedPartnerId === currentPartner?.id && j.status !== 'COMPLETED' && j.status !== 'CANCELLED'
  );

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

  const handleCompleteJob = async (jobId: string) => {
    try {
      await api.completeJob(jobId);
      onRefreshData();
      alert('🎉 Job Completed! Payout has been credited to your Fixily Partner Wallet.');
    } catch (err) {
      alert('Failed to complete job');
    }
  };

  const handleWithdrawal = async () => {
    if (!currentPartner) return;
    const amountNum = parseFloat(withdrawalAmount) || currentPartner.walletBalance;
    if (amountNum <= 0) {
      alert('Please enter a valid withdrawal amount');
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

  if (!currentPartner) return null;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Partner Persona Switcher Bar */}
      <div className="bg-slate-900/90 text-white rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-800 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-300">
            Select Active Partner Persona
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {partners.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPartnerId(p.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedPartnerId === p.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {p.name} ({p.role})
            </button>
          ))}
        </div>
      </div>

      {/* Main Profile & Duty Toggle Card Widget */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Partner Info Widget */}
          <div className="flex items-center space-x-4">
            <img
              src={currentPartner.photoUrl}
              alt={currentPartner.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/80 shadow-lg shadow-amber-500/10"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white">{currentPartner.name}</h2>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  ★ {currentPartner.rating} ({currentPartner.jobsCompleted} Jobs)
                </span>
              </div>
              <p className="text-xs font-semibold text-teal-400 mt-0.5">{currentPartner.role}</p>
              
              {/* Verification Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center space-x-1 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-md font-bold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Aadhaar Verified</span>
                </span>

                <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-md font-bold ${
                  currentPartner.kyc.pccStatus === 'VERIFIED'
                    ? 'bg-teal-950 text-teal-300 border border-teal-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  <span>Kerala Police Thuna PCC: {currentPartner.kyc.pccStatus}</span>
                </span>
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
                      <div className="font-bold text-white">{job.customerName} ({job.customerPhone})</div>
                      <div className="text-slate-400">{job.location.address}</div>
                    </div>
                  </div>

                  {job.vehicleDetails && (
                    <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 text-slate-300">
                      🚗 Vehicle/Details: <strong className="text-white">{job.vehicleDetails}</strong>
                    </div>
                  )}

                  <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-center justify-between text-slate-200">
                    <span>Your Guaranteed Payout</span>
                    <span className="text-emerald-400 font-extrabold text-sm">₹{job.pricing.partnerEarnings}</span>
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
                    onClick={() => handleCompleteJob(job.id)}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 py-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Job Completed & Collect Payout</span>
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
              <span>Incoming Job Radar ({currentPartner.currentLocation.name || 'Active Zone'})</span>
            </h3>
            <p className="text-xs text-slate-400">Live requests ready for immediate dispatch</p>
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
                  <span className="bg-teal-950 text-teal-300 border border-teal-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {job.location.microMarket} • 2.4 km away
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{job.scheduledTime}</span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">{job.serviceTitle}</h4>
                  <p className="text-xs text-slate-400">{job.tierName}</p>
                </div>

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
                    className="flex-1 bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg hover:brightness-110"
                  >
                    Accept Job Now
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
              Fixily Partner Earnings Hub
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
            <div className="text-3xl font-black text-amber-400">₹{currentPartner.walletBalance}</div>
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
              placeholder={`Max ₹${currentPartner.walletBalance}`}
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
              disabled={isProcessingWithdrawal || currentPartner.walletBalance <= 0}
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

    </div>
  );
};
