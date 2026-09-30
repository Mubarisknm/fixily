import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  X,
  CheckCircle2,
  AlertCircle,
  Upload,
  Camera,
  FileText,
  CreditCard,
  MapPin,
  Car,
  Wrench,
  Zap,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Phone,
  Check
} from 'lucide-react';
import { GigPartner, ThemeMode } from '../types';
import { api } from '../services/api';

interface PartnerKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPartner: GigPartner) => void;
  theme: ThemeMode;
}

export const PartnerKYCModal: React.FC<PartnerKYCModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  theme
}) => {
  const isDark = theme === 'dark';
  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Step 1: Personal & Trade
  const [name, setName] = useState<string>('Rahul Ramesh');
  const [phone, setPhone] = useState<string>('+91 98472 88990');
  const [role, setRole] = useState<string>('Freelance Acting Driver ("Drive My Car")');
  const [city, setCity] = useState<string>('Kakkanad (InfoPark & Seaport), Kochi');
  const [vehicle, setVehicle] = useState<string>('LMV Commercial Driver (Manual & Auto)');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  );

  // Step 2: KYC & Government Verification
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('5489 2210 9043');
  const [aadhaarVerified, setAadhaarVerified] = useState<boolean>(true);
  const [isVerifyingAadhaar, setIsVerifyingAadhaar] = useState<boolean>(false);
  const [pccRefNo, setPccRefNo] = useState<string>('THUNA-PCC-2024-91204');
  const [pccExpiry, setPccExpiry] = useState<string>('2027-10-15');
  const [pccFileAttached, setPccFileAttached] = useState<boolean>(true);
  const [dlNumber, setDlNumber] = useState<string>('KL-07-2016-0038491');

  // Step 3: Payout Banking & Activation
  const [upiId, setUpiId] = useState<string>('rahul.fixily@okicici');
  const [agreeAllowancePolicy, setAgreeAllowancePolicy] = useState<boolean>(true);

  if (!isOpen) return null;

  const handleSimulateDigiLocker = () => {
    setIsVerifyingAadhaar(true);
    setTimeout(() => {
      setIsVerifyingAadhaar(false);
      setAadhaarVerified(true);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please enter your full name and phone number');
      return;
    }
    if (!aadhaarNumber.trim()) {
      alert('Please enter your 12-digit Aadhaar number');
      return;
    }

    setIsSubmitting(true);
    try {
      const newPartner = await api.registerPartner({
        name,
        phone,
        role,
        city,
        vehicle,
        dlNumber: role.toLowerCase().includes('driver') || role.toLowerCase().includes('mechanic') ? dlNumber : undefined,
        aadhaarNumber,
        pccRefNo: pccRefNo.trim() || 'THUNA-PCC-SUBMITTED',
        pccExpiry,
        upiId,
        photoUrl
      });

      setIsSubmitting(false);
      onSuccess(newPartner);
      onClose();
    } catch (err) {
      setIsSubmitting(false);
      alert('Registration failed. Please verify your details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-auto flex flex-col ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-purple-600 text-slate-950 p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 shadow-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950/20 px-2.5 py-0.5 rounded-full text-slate-950">
                  Gig Partner Onboarding
                </span>
                <span className="text-[10px] bg-slate-950 text-amber-400 px-2 py-0.5 rounded-full font-black">
                  Step {step} of 3
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5 text-slate-950">
                Partner KYC & Police Verification
              </h2>
              <p className="text-xs text-slate-900 font-medium">
                Register as a certified Fixily service partner with instant Aadhaar & Thuna PCC validation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-950/80 hover:text-slate-950 p-1.5 rounded-full hover:bg-slate-950/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        <div className={`grid grid-cols-3 border-b text-center text-xs font-bold ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`py-3 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            step === 1 ? 'border-amber-500 text-amber-500' : step > 1 ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400'
          }`}>
            <span>1. Profile & Trade</span>
            {step > 1 && <Check className="w-3.5 h-3.5" />}
          </div>
          <div className={`py-3 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            step === 2 ? 'border-amber-500 text-amber-500' : step > 2 ? 'border-emerald-500 text-emerald-500' : 'border-transparent text-slate-400'
          }`}>
            <span>2. Aadhaar & Thuna PCC</span>
            {step > 2 && <Check className="w-3.5 h-3.5" />}
          </div>
          <div className={`py-3 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            step === 3 ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400'
          }`}>
            <span>3. Banking & Bonus</span>
          </div>
        </div>

        {/* Modal Body / Steps */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          
          {/* STEP 1: Personal & Trade Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <img
                  src={photoUrl}
                  alt="Partner Avatar"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-md shrink-0"
                />
                <div className="flex-1">
                  <div className="text-xs font-bold">Profile Photo</div>
                  <p className="text-[11px] text-slate-400">
                    High-resolution portrait required for Kerala Police verification badge.
                  </p>
                  <div className="flex gap-2 mt-1.5">
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80')}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                    >
                      Photo 1
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80')}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                    >
                      Photo 2
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')}
                      className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200 hover:bg-slate-700"
                    >
                      Photo 3 (Female)
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Full Legal Name (as per Aadhaar) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Ramesh"
                    className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-semibold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    WhatsApp / Contact Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98470 00000"
                    className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-semibold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Primary Service Role / Trade *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-bold ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  <option value='Freelance Acting Driver ("Drive My Car")'>Freelance Acting Driver ("Drive My Car") - Kerala Police PCC</option>
                  <option value="Doorstep Car & Bike Mechanic">Doorstep Car & Bike Mechanic (20-Min Roadside Rescue)</option>
                  <option value="Electrician & Consultation">Certified Electrician & Wiring Technician</option>
                  <option value="Plumbing & Leak Specialist">Licensed Plumber & Water Pipeline Specialist</option>
                  <option value="AC & Appliance Servicing">AC, Refrigerator & Washing Machine Technician</option>
                  <option value="Full House Deep Cleaning">Housekeeping & Deep Cleaning Specialist</option>
                  <option value="Carpenter & Locksmith">Carpenter & Emergency Locksmith</option>
                  <option value="CCTV & Smart Security">CCTV & Smart Home Security Installer</option>
                  <option value="At-Home Salon & Wellness">At-Home Salon & Personal Wellness Specialist</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Primary Service Hub / Micro-Market *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Kakkanad, Kochi"
                    className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-semibold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Equipment / Vehicle Specification
                  </label>
                  <input
                    type="text"
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g. Commercial LMV Driver + Jumpstart Kit"
                    className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-semibold ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Government & Public Safety KYC (Aadhaar & Kerala Police Thuna PCC) */}
          {step === 2 && (
            <div className="space-y-4">
              
              {/* 1. Aadhaar Card Verification */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-black">1. Government Aadhaar Verification</h4>
                      <p className="text-[10px] text-slate-400">UIDAI / DigiLocker 12-digit identity validation</p>
                    </div>
                  </div>
                  {aadhaarVerified && (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>DigiLocker Verified</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    value={aadhaarNumber}
                    onChange={(e) => {
                      setAadhaarNumber(e.target.value);
                      setAadhaarVerified(false);
                    }}
                    placeholder="12-digit Aadhaar Number (XXXX XXXX XXXX)"
                    className={`flex-1 text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-mono font-bold ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleSimulateDigiLocker}
                    disabled={isVerifyingAadhaar || aadhaarVerified}
                    className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shrink-0 disabled:opacity-50"
                  >
                    {isVerifyingAadhaar ? 'Verifying...' : aadhaarVerified ? 'Verified ✓' : 'Verify UIDAI'}
                  </button>
                </div>
              </div>

              {/* 2. Mandatory Kerala Police Thuna PCC */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-950 border-emerald-900/40' : 'bg-emerald-50/50 border-emerald-200'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs font-black">2. Kerala Police Thuna PCC (Mandatory)</h4>
                        <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-black">
                          Trust Gate
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Official Police Clearance Certificate for zero criminal record check
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://thuna.keralapolice.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-400 font-bold hover:underline flex items-center space-x-1 shrink-0"
                  >
                    <span>Apply on Thuna</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      Thuna PCC Reference / Certificate No. *
                    </label>
                    <input
                      type="text"
                      required
                      value={pccRefNo}
                      onChange={(e) => setPccRefNo(e.target.value)}
                      placeholder="e.g. THUNA-PCC-2024-XXXXX"
                      className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-emerald-500 font-mono font-bold ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">
                      PCC Expiry Date (Valid 3 Years) *
                    </label>
                    <input
                      type="date"
                      required
                      value={pccExpiry}
                      onChange={(e) => setPccExpiry(e.target.value)}
                      className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-emerald-500 font-bold ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-emerald-500/30 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    <span className="text-[11px] font-medium">
                      {pccFileAttached ? 'kerala_police_thuna_pcc_rahul.pdf (Attached)' : 'Attach PCC PDF/Image'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPccFileAttached(!pccFileAttached)}
                    className="text-[10px] font-bold text-emerald-400 hover:underline"
                  >
                    {pccFileAttached ? 'Change Document' : 'Browse File'}
                  </button>
                </div>
              </div>

              {/* 3. Driving License (If Driver or Roadside) */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-black">3. Motor Driving License (DL) Number</h4>
                </div>
                <input
                  type="text"
                  value={dlNumber}
                  onChange={(e) => setDlNumber(e.target.value)}
                  placeholder="e.g. KL-07-2016-0038491 (LMV / Transport)"
                  className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none focus:border-purple-500 font-mono font-bold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

            </div>
          )}

          {/* STEP 3: Payout Banking, Allowance Agreement & Welcome Bonus */}
          {step === 3 && (
            <div className="space-y-4">
              
              {/* Welcome Bonus Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-purple-500/20 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      Welcome Toolkit Credit
                    </div>
                    <div className="text-sm font-black">₹250 Joining Bonus in Your Wallet</div>
                  </div>
                </div>
                <span className="text-xs font-black bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-xl">
                  INSTANT
                </span>
              </div>

              {/* UPI Handle / Bank Account */}
              <div className={`p-4 rounded-2xl border space-y-3 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-black">Instant 1-Tap Daily UPI Payout Handle</h4>
                </div>
                <p className="text-[11px] text-slate-400">
                  Every evening or on-demand, your earnings transfer directly to this UPI address (GPay / PhonePe / Paytm).
                </p>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. name@okaxis or mobile@upi"
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-bold ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Zero-Commission Allowance Policy Agreement */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-950 border-indigo-900/40' : 'bg-indigo-50/50 border-indigo-200'
              }`}>
                <label className="flex items-start space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeAllowancePolicy}
                    onChange={(e) => setAgreeAllowancePolicy(e.target.checked)}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                  />
                  <div className="text-xs">
                    <span className="font-extrabold text-indigo-400">Fixily Partner Fair Pay Guarantee:</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      I agree to the Fixily code of conduct. I understand that <strong>100% of customer return bus fares and meal batta</strong> are paid directly to me with zero platform deductions.
                    </p>
                  </div>
                </label>
              </div>

            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                  isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black shadow-lg transition-transform hover:scale-105 flex items-center space-x-1"
              >
                <span>Continue to Step {step + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !agreeAllowancePolicy}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black shadow-xl transition-transform hover:scale-105 flex items-center space-x-1.5 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? 'Registering & Verifying...' : 'Complete KYC & Activate Partner'}</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
