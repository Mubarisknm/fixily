import React, { useState, useRef } from 'react';
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
  Check,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react';
import { GigPartner, ThemeMode } from '../types';
import { api } from '../services/api';

interface PartnerKYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPartner: GigPartner) => void;
  theme: ThemeMode;
}

// Comprehensive Catalog of Freelance & Gig Trades
const FREELANCE_TRADES = [
  { value: 'Freelance Acting Driver ("Drive My Car")', label: '🚗 Freelance Acting Driver ("Drive My Car") - Kerala Police PCC' },
  { value: 'Doorstep Car & Bike Mechanic', label: '🔧 Doorstep Car & Bike Mechanic (20-Min Roadside Rescue)' },
  { value: 'Electrician & Wiring Technician', label: '⚡ Certified Electrician & Inverter/Wiring Technician' },
  { value: 'Plumber & Sanitary Specialist', label: '💧 Licensed Plumber, Leak Detection & Pipeline Specialist' },
  { value: 'AC & Appliance Servicing Technician', label: '❄️ AC, Refrigerator & Washing Machine Servicing' },
  { value: 'Full House Deep Cleaning Specialist', label: '🧹 Full House Deep Cleaning & Sanitization' },
  { value: 'Carpenter & Emergency Locksmith', label: '🔨 Carpenter, Door Locks & Modular Furniture' },
  { value: 'CCTV & Smart Security Installer', label: '📹 CCTV, Smart Video Doorbell & WiFi Setup' },
  { value: 'Painter & Waterproofing Expert', label: '🎨 Painter, Dampness Putty & Terrace Waterproofing' },
  { value: 'At-Home Salon, Hair & Beautician', label: '✂️ At-Home Salon, Hair Stylist & Beautician' },
  { value: 'Doorstep Mobile & Laptop Repair', label: '📱 Doorstep Smartphone, Tablet & Laptop Repair' },
  { value: 'Gardener & Landscape Maintenance', label: '🌿 Gardener, Lawn Mowing & Landscape Maintenance' },
  { value: 'Pest Control & Fumigation Specialist', label: '🐜 Termite, Cockroach & Mosquito Pest Control' },
  { value: 'Packers & Movers Logistics', label: '🚚 Packers & Movers, House Relocation & Loading' },
  { value: 'Solar Panel & Inverter Technician', label: '☀️ Solar Panel Installation & Battery Backup Tech' },
  { value: 'Tile, Marble & Masonry Specialist', label: '🧱 Masonry, Tile Layer & Marble Polishing' },
  { value: 'Private Home Chef & Caterer', label: '🍳 Private Home Chef & Party Catering Assistant' },
  { value: 'Courier, Parcel & Delivery Agent', label: '📦 Local Delivery, Documents & Parcel Courier' },
  { value: 'Pet Care, Dog Walker & Groomer', label: '🐕 Pet Sitter, Dog Walker & Pet Grooming' },
  { value: 'Home Nursing & Elderly Care Attendant', label: '👵 Home Nursing Attendant & Elderly Patient Care' },
  { value: 'Welder & Metal Fabrication Worker', label: '🪚 Arc Welder, Iron Gate & Grill Fabrication' },
  { value: 'Interlock & Compound Pressure Washer', label: '🚿 High-Pressure Interlock & Compound Wall Wash' },
  { value: 'Water Tanker Delivery Driver', label: '🚚 Water Tanker Supply & Sump Water Driver' },
  { value: 'Sofa, Carpet & Mattress Shampooing', label: '🧽 Sofa, Carpet & Car Interior Foam Shampoo' },
  { value: 'Network, WiFi & Optical Fiber Tech', label: '🌐 Home WiFi Router, LAN & Optical Fiber Tech' },
  { value: 'Tailor, Saree Draping & Alterations', label: '🪡 Doorstep Tailor, Saree Draping & Alterations' },
  { value: 'Event Photographer & Videographer', label: '📸 Event Photographer, Videographer & Drone Pilot' },
  { value: 'Septic Tank & Sump Cleaning Specialist', label: '🚽 Septic Tank, Drainage & Sump Cleaning' },
  { value: 'Other', label: '✨ Other (Type your own custom profession / trade)' }
];

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
  const [selectedRole, setSelectedRole] = useState<string>('Freelance Acting Driver ("Drive My Car")');
  const [customRole, setCustomRole] = useState<string>('');
  const [city, setCity] = useState<string>('Kakkanad (InfoPark & Seaport), Kochi');
  const [vehicle, setVehicle] = useState<string>('LMV Commercial Driver (Manual & Auto)');

  // Own Photo Upload State
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  );
  const [isCustomPhoto, setIsCustomPhoto] = useState<boolean>(false);
  const [customPhotoFileName, setCustomPhotoFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Step 2: KYC & Government Verification
  const [govtIdType, setGovtIdType] = useState<'AADHAAR' | 'PAN' | 'VOTER_ID' | 'DRIVING_LICENSE' | 'PASSPORT'>('AADHAAR');
  const [govtIdNumber, setGovtIdNumber] = useState<string>('5489 2210 9043');
  const [aadhaarNumber, setAadhaarNumber] = useState<string>('5489 2210 9043');
  const [govtIdVerified, setGovtIdVerified] = useState<boolean>(true);
  const [isVerifyingGovtId, setIsVerifyingGovtId] = useState<boolean>(false);
  const [govtIdFileAttached, setGovtIdFileAttached] = useState<boolean>(true);
  const [pccRefNo, setPccRefNo] = useState<string>('THUNA-PCC-2024-91204');
  const [pccExpiry, setPccExpiry] = useState<string>('2027-10-15');
  const [pccFileAttached, setPccFileAttached] = useState<boolean>(true);
  const [dlNumber, setDlNumber] = useState<string>('KL-07-2016-0038491');

  // Step 3: Payout Banking & Activation
  const [upiId, setUpiId] = useState<string>('rahul.fixily@okicici');
  const [agreeAllowancePolicy, setAgreeAllowancePolicy] = useState<boolean>(true);
  const [agreeDamageLiability, setAgreeDamageLiability] = useState<boolean>(true);

  if (!isOpen) return null;

  // Handle uploading personal photo from device
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert('Image file size should be less than 8MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          setIsCustomPhoto(true);
          setCustomPhotoFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSimulateGovtIdVerification = () => {
    setIsVerifyingGovtId(true);
    setTimeout(() => {
      setIsVerifyingGovtId(false);
      setGovtIdVerified(true);
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please enter your full name and phone number');
      return;
    }

    const finalRole = selectedRole === 'Other'
      ? customRole.trim()
      : selectedRole;

    if (selectedRole === 'Other' && !finalRole) {
      alert('Please type your specific profession / trade in the custom field');
      setStep(1);
      return;
    }

    if (!govtIdNumber.trim()) {
      alert(`Please enter your valid ${govtIdType} number`);
      setStep(2);
      return;
    }

    if (!agreeDamageLiability) {
      alert('You must accept the Damage Responsibility & Service Liability Agreement to activate your Fixily partner profile');
      setStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      const isDrivingRole = finalRole.toLowerCase().includes('driver') ||
        finalRole.toLowerCase().includes('mechanic') ||
        finalRole.toLowerCase().includes('courier') ||
        finalRole.toLowerCase().includes('delivery');

      const newPartner = await api.registerPartner({
        name: name.trim(),
        phone: phone.trim(),
        role: finalRole,
        city: city.trim(),
        vehicle: vehicle.trim(),
        dlNumber: isDrivingRole || dlNumber.trim() ? dlNumber.trim() : undefined,
        aadhaarNumber: govtIdType === 'AADHAAR' ? govtIdNumber.trim() : aadhaarNumber.trim(),
        govtIdType,
        govtIdNumber: govtIdNumber.trim(),
        damageLiabilityAgreed: true,
        pccRefNo: pccRefNo.trim() || 'THUNA-PCC-SUBMITTED',
        pccExpiry,
        upiId: upiId.trim(),
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
                Partner KYC & Profile Setup
              </h2>
              <p className="text-xs text-slate-900 font-medium">
                Register as a certified Fixily service partner with instant photo upload, custom trade, & Kerala Police Thuna PCC.
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
            <span>2. Govt ID & Thuna PCC</span>
            {step > 2 && <Check className="w-3.5 h-3.5" />}
          </div>
          <div className={`py-3 flex items-center justify-center space-x-1.5 border-b-2 transition-all ${
            step === 3 ? 'border-amber-500 text-amber-500' : 'border-transparent text-slate-400'
          }`}>
            <span>3. Banking & Liability</span>
          </div>
        </div>

        {/* Modal Body / Steps */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          
          {/* STEP 1: Personal & Trade Details */}
          {step === 1 && (
            <div className="space-y-4">
              
              {/* 1. Use Own Photo Upload Card */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5">
                <div className="relative group shrink-0">
                  <img
                    src={photoUrl}
                    alt="Partner Avatar Preview"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400 shadow-lg shadow-amber-500/20"
                  />
                  {isCustomPhoto && (
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow">
                      ✓ Custom Photo
                    </span>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <div className="text-xs font-black flex items-center space-x-1.5">
                      <span>Your Profile Photo</span>
                      <span className="text-[10px] text-amber-500 bg-amber-500/20 px-2 py-0.2 rounded-full font-bold">
                        Customer & PCC Badge
                      </span>
                    </div>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {isCustomPhoto && customPhotoFileName
                        ? `Loaded: "${customPhotoFileName}"`
                        : 'Upload your own clear photo from your phone or PC, or choose a preset.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Native File Input for Own Photo */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center space-x-1.5 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isCustomPhoto ? 'Change Uploaded Photo' : 'Upload Your Photo'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1 ${
                        isDark
                          ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 shadow-sm'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Take Photo</span>
                    </button>

                    {/* Preset Avatars */}
                    <div className="flex items-center space-x-1 pl-2 border-l border-slate-700">
                      <span className="text-[10px] text-slate-400 mr-1 hidden sm:inline">Presets:</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80');
                          setIsCustomPhoto(false);
                          setCustomPhotoFileName('');
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                          !isCustomPhoto && photoUrl.includes('photo-1507003211169')
                            ? 'bg-amber-500 text-slate-950'
                            : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        Male 1
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80');
                          setIsCustomPhoto(false);
                          setCustomPhotoFileName('');
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                          !isCustomPhoto && photoUrl.includes('photo-1500648767791')
                            ? 'bg-amber-500 text-slate-950'
                            : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        Male 2
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoUrl('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80');
                          setIsCustomPhoto(false);
                          setCustomPhotoFileName('');
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                          !isCustomPhoto && photoUrl.includes('photo-1573496359142')
                            ? 'bg-amber-500 text-slate-950'
                            : isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        Female 1
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
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

              {/* Primary Service Role / Trade with Comprehensive Options + Other */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Primary Service Role / Trade *
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-bold ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                >
                  {FREELANCE_TRADES.map((trade) => (
                    <option key={trade.value} value={trade.value} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                      {trade.label}
                    </option>
                  ))}
                </select>

                {/* Dedicated Custom Profession Input when 'Other' is Selected */}
                {selectedRole === 'Other' && (
                  <div className={`p-4 rounded-2xl border-2 space-y-2 transition-all ${
                    isDark
                      ? 'border-amber-500/80 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/20 text-white'
                      : 'border-amber-400 bg-amber-50/80 text-slate-900'
                  }`}>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-amber-500 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Specify Your Custom Profession / Trade *</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      placeholder="e.g. Aquarium Maintenance Specialist, Acoustic Soundproofer, Locksmith..."
                      className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold ${
                        isDark ? 'bg-slate-950 border-amber-500/60 text-white placeholder-slate-500' : 'bg-white border-amber-400 text-slate-900 placeholder-slate-400 shadow-sm'
                      }`}
                      autoFocus
                    />
                    <p className={`text-[10px] ${isDark ? 'text-amber-300/80' : 'text-amber-800'}`}>
                      ✨ Your custom profession will immediately be published under the <strong>"Other Works"</strong> category in the customer main grid for direct client booking!
                    </p>
                  </div>
                )}
              </div>

              {/* City Hub & Vehicle */}
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

          {/* STEP 2: Government & Public Safety KYC */}
          {step === 2 && (
            <div className="space-y-4">
              
              {/* 1. Government ID Verification */}
              <div className={`p-4 rounded-2xl border space-y-3.5 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    <div>
                      <h4 className="text-xs font-black">1. Official Government ID Verification *</h4>
                      <p className="text-[10px] text-slate-400">Choose official photo identity for legal verification & DigiLocker authentication</p>
                    </div>
                  </div>
                  {govtIdVerified && (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Govt Verified</span>
                    </span>
                  )}
                </div>

                {/* ID Type Selection Chips */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Select Government ID Type:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { id: 'AADHAAR', label: 'Aadhaar Card' },
                      { id: 'PAN', label: 'PAN Card' },
                      { id: 'DRIVING_LICENSE', label: 'Driving License' },
                      { id: 'VOTER_ID', label: 'Voter ID' },
                      { id: 'PASSPORT', label: 'Passport' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => {
                          setGovtIdType(type.id as any);
                          setGovtIdVerified(false);
                        }}
                        className={`py-2 px-2 rounded-xl text-[11px] font-black transition-all border text-center ${
                          govtIdType === type.id
                            ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md scale-[1.02]'
                            : isDark
                            ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ID Number input and live verify button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      value={govtIdNumber}
                      onChange={(e) => {
                        setGovtIdNumber(e.target.value);
                        setGovtIdVerified(false);
                      }}
                      placeholder={
                        govtIdType === 'AADHAAR' ? '12-digit Aadhaar Number (XXXX XXXX XXXX)' :
                        govtIdType === 'PAN' ? '10-character PAN (e.g. ABCDE1234F)' :
                        govtIdType === 'DRIVING_LICENSE' ? 'DL Number (e.g. KL-07-2016-0038491)' :
                        govtIdType === 'VOTER_ID' ? 'Voter ID EPIC (e.g. KL/05/032/123456)' :
                        'Passport Number (e.g. Z1234567)'
                      }
                      className={`w-full text-xs p-3 rounded-xl border focus:outline-none focus:border-amber-500 font-mono font-bold ${
                        isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateGovtIdVerification}
                    disabled={isVerifyingGovtId || govtIdVerified}
                    className="px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all shrink-0 disabled:opacity-50 cursor-pointer shadow-md flex items-center justify-center space-x-1.5"
                  >
                    {isVerifyingGovtId ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : govtIdVerified ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>DigiLocker Verified</span>
                      </>
                    ) : (
                      <span>Verify {govtIdType.replace('_', ' ')}</span>
                    )}
                  </button>
                </div>

                {/* Attached Document File Status */}
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-dashed border-amber-500/30 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span className="text-[11px] font-medium text-slate-300">
                      {govtIdFileAttached ? `${govtIdType.toLowerCase()}_front_back_proof.pdf (Uploaded)` : 'Attach Front & Back Photo/PDF'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGovtIdFileAttached(!govtIdFileAttached)}
                    className="text-[10px] font-bold text-amber-500 hover:underline cursor-pointer"
                  >
                    {govtIdFileAttached ? 'Replace Document' : 'Browse File'}
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
                        Official Police Clearance Certificate for zero criminal record verification
                      </p>
                    </div>
                  </div>

                  <a
                    href="https://thuna.keralapolice.gov.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-emerald-500 font-bold hover:underline flex items-center space-x-1 shrink-0"
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
                    <span className="text-[11px] font-medium text-slate-300">
                      {pccFileAttached ? 'kerala_police_thuna_pcc_verified.pdf (Attached)' : 'Attach PCC PDF/Image'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPccFileAttached(!pccFileAttached)}
                    className="text-[10px] font-bold text-emerald-500 hover:underline cursor-pointer"
                  >
                    {pccFileAttached ? 'Change Document' : 'Browse File'}
                  </button>
                </div>
              </div>

              {/* 3. Motor Driving License (If Driver or Roadside) */}
              <div className={`p-4 rounded-2xl border space-y-2 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <Car className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-black">3. Motor Driving License (DL) Number (if driving)</h4>
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

          {/* STEP 3: Payout Banking, Damage Liability Agreement & Activation */}
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
                  <h4 className="text-xs font-black">Instant 1-Tap Daily UPI Payout Handle *</h4>
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

              {/* MANDATORY FREELANCER DAMAGE RESPONSIBILITY & SERVICE QUALITY AGREEMENT */}
              <div className={`p-4 rounded-2xl border-2 space-y-3 ${
                agreeDamageLiability
                  ? isDark ? 'border-amber-500/60 bg-amber-500/5' : 'border-amber-500/50 bg-amber-50/50'
                  : 'border-red-500/60 bg-red-500/5'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-500">
                    <AlertCircle className="w-5 h-5 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      Mandatory Damage Responsibility & Risk Agreement
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                    Required for Activation
                  </span>
                </div>

                <div className={`text-[11px] space-y-1.5 p-3 rounded-xl border ${
                  isDark ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'
                }`}>
                  <p className="font-bold text-amber-400">
                    Service Liability & Product Risk Undertaking:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-[10.5px] leading-relaxed">
                    <li>
                      <strong>100% Operational Risk Assumption:</strong> As an independent freelancer/partner on Fixily, I assume full operational responsibility and care for the customer's property, appliances, materials, and vehicles during service delivery.
                    </li>
                    <li>
                      <strong>Damage Rectification:</strong> In the event of any accidental damage, leakage, breakage, or operational failure caused by negligence or improper workmanship, I agree to rectify the issue or bear the direct cost of repair/replacement.
                    </li>
                    <li>
                      <strong>Fixily Guarantee Deductions:</strong> If Fixily steps in to compensate the customer under the Fixily Trust Guarantee, I authorize the settlement of validated damages against my platform wallet and future payouts.
                    </li>
                    <li>
                      <strong>Platform Integrity:</strong> Accepting offline side-work without Fixily safety logging automatically voids partner insurance coverage and Kerala Police Thuna PCC badge accreditation.
                    </li>
                  </ul>
                </div>

                <label className="flex items-start space-x-2.5 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    required
                    checked={agreeDamageLiability}
                    onChange={(e) => setAgreeDamageLiability(e.target.checked)}
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs font-bold">
                    <span className={agreeDamageLiability ? 'text-emerald-400' : 'text-red-400'}>
                      I acknowledge, agree, and legally accept full damage responsibility and product/service risk as a Fixily Partner *
                    </span>
                    <p className={`text-[10px] font-normal mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Your acceptance timestamp and verified Govt ID ({govtIdType}: {govtIdNumber}) will be recorded upon activation.
                    </p>
                  </div>
                </label>
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
                    className="mt-0.5 rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-extrabold text-indigo-400">Fixily Partner Fair Pay Guarantee:</span>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      I agree to the Fixily code of conduct. I understand that <strong>100% of customer return bus fares and meal batta</strong> are paid directly to me with zero platform deductions.
                    </p>
                  </div>
                </label>
              </div>

            </div>
          )}

          {/* Modal Footer Controls */}
          <div className={`pt-3 border-t flex items-center justify-between ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
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
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black shadow-lg transition-transform hover:scale-105 flex items-center space-x-1 cursor-pointer"
              >
                <span>Continue to Step {step + 1}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !agreeAllowancePolicy || !agreeDamageLiability}
                className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-black shadow-xl transition-transform hover:scale-105 flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer"
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
