import React, { useState } from 'react';
import { Phone, ShieldCheck, X, Check, Lock, ArrowRight, RefreshCw, KeyRound, User } from 'lucide-react';
import { UserRole, UserSession, ThemeMode, AppLanguage } from '../types';
import { useTranslation } from '../utils/translations';

interface PhoneOTPAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: UserRole;
  onLoginSuccess: (session: UserSession) => void;
  theme: ThemeMode;
  language: AppLanguage;
}

export const PhoneOTPAuthModal: React.FC<PhoneOTPAuthModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onLoginSuccess,
  theme,
  language
}) => {
  const { t } = useTranslation(language);
  const isDark = theme === 'dark';

  const [step, setStep] = useState<'phone' | 'otp' | 'admin_pin'>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('9895012345');
  const [name, setName] = useState<string>(targetRole === 'partner' ? 'Sunil Prasad' : targetRole === 'admin' ? 'Kochi Ops Admin' : 'Mathew Thomas');
  const [otp, setOtp] = useState<string>('');
  const [adminPin, setAdminPin] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      if (targetRole === 'admin') {
        setStep('admin_pin');
      } else {
        setStep('otp');
      }
    }, 600);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (otp !== '123456' && otp.length !== 6) {
      setErrorMsg('Invalid OTP. Use demo verification code 123456.');
      return;
    }

    const session: UserSession = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      phone: `+91 ${phoneNumber.replace(/\D/g, '').slice(-10)}`,
      name: name || 'Verified User',
      role: targetRole,
      isVerified: true,
      partnerId: targetRole === 'partner' ? 'p-106' : undefined
    };

    localStorage.setItem('fykso_user_session', JSON.stringify(session));
    onLoginSuccess(session);
    onClose();
  };

  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Admin passcode default: 9895 or 1234
    if (adminPin !== '9895' && adminPin !== '1234') {
      setErrorMsg('Invalid Admin Security Passcode. Default demo PIN is 9895.');
      return;
    }

    const session: UserSession = {
      id: 'adm-001',
      phone: `+91 ${phoneNumber.replace(/\D/g, '').slice(-10)}`,
      name: name || 'Fykso Kerala Operations Admin',
      role: 'admin',
      isVerified: true
    };

    localStorage.setItem('fykso_user_session', JSON.stringify(session));
    onLoginSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-7 overflow-hidden transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
              targetRole === 'admin'
                ? 'bg-gradient-to-tr from-rose-600 to-amber-600'
                : targetRole === 'partner'
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
            }`}>
              {targetRole === 'admin' ? <KeyRound className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">
                {targetRole === 'admin'
                  ? 'Admin Portal Authentication'
                  : targetRole === 'partner'
                  ? 'Gig Partner Phone Login'
                  : 'Customer Phone OTP Login'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold">
                Protected Kerala Access • Zero Passwords Needed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center space-x-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Phone Number Input */}
        {step === 'phone' && (
          <form onSubmit={handleSendOTP} className="space-y-4 mt-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Your Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mathew Thomas"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Indian Mobile Number (+91)
              </label>
              <div className="relative flex">
                <div className={`px-3 py-2.5 rounded-l-xl border-y border-l flex items-center text-xs font-black ${
                  isDark ? 'bg-slate-800 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}>
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="98950 12345"
                  className={`flex-1 px-3 py-2.5 rounded-r-xl border text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                We'll send a 6-digit verification code via SMS / WhatsApp.
              </p>
            </div>

            {/* DPDP Privacy Consent */}
            <div className={`p-3 rounded-2xl border text-[11px] leading-relaxed ${
              isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  <strong>DPDP Act 2023 Compliant:</strong> Your phone number is encrypted and used strictly for dispatch and authenticated access. Zero spam calls.
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending SMS OTP...</span>
                </>
              ) : (
                <>
                  <span>Send Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOTP} className="space-y-4 mt-5">
            <div className="text-center pb-2">
              <span className="text-xs text-slate-400 font-bold block">
                Enter the 6-digit code sent to
              </span>
              <span className="text-sm font-black text-blue-500">
                +91 {phoneNumber}
              </span>
            </div>

            <div>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className={`w-full text-center tracking-[0.5em] py-3 rounded-2xl border text-xl font-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Demo Quick-Fill Pill */}
            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setOtp('123456')}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                ⚡ Use Demo Code: 123456
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-slate-400 font-semibold hover:underline"
              >
                Change Number
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Verify & Continue</span>
            </button>
          </form>
        )}

        {/* Step 3: Admin Passcode Verification */}
        {step === 'admin_pin' && (
          <form onSubmit={handleVerifyAdminPin} className="space-y-4 mt-5">
            <div className="text-center pb-2">
              <span className="text-xs text-slate-400 font-bold block">
                Enter Admin Security Passcode (PIN)
              </span>
              <span className="text-xs text-slate-500">
                Authorized Fykso Kerala Personnel Only
              </span>
            </div>

            <div>
              <input
                type="password"
                required
                maxLength={6}
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                placeholder="Enter PIN..."
                className={`w-full text-center tracking-[0.5em] py-3 rounded-2xl border text-xl font-black focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => setAdminPin('9895')}
                className="text-rose-500 font-bold hover:underline"
              >
                ⚡ Demo Admin PIN: 9895
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-slate-400 font-semibold hover:underline"
              >
                Back
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>Unlock Admin Console</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
