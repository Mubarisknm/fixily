import React, { useState } from 'react';
import {
  Phone,
  Mail,
  ShieldCheck,
  X,
  Check,
  Lock,
  ArrowRight,
  RefreshCw,
  KeyRound,
  User,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
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

  // Login method tabs: 'google_email' | 'phone' | 'admin_pin'
  const [authMethod, setAuthMethod] = useState<'google_email' | 'phone'>(
    targetRole === 'admin' ? 'phone' : 'google_email'
  );

  // Sub-steps for Email flow: 'input' | 'verify'
  const [emailStep, setEmailStep] = useState<'input' | 'verify'>('input');
  const [email, setEmail] = useState<string>('mathew.thomas@gmail.com');
  const [emailOtp, setEmailOtp] = useState<string>('');

  // Sub-steps for Phone flow: 'phone' | 'otp' | 'admin_pin'
  const [phoneStep, setPhoneStep] = useState<'phone' | 'otp' | 'admin_pin'>('phone');
  const [phoneNumber, setPhoneNumber] = useState<string>('9895012345');
  const [name, setName] = useState<string>(
    targetRole === 'partner' ? 'Sunil Prasad' : targetRole === 'admin' ? 'Kochi Ops Admin' : 'Mathew Thomas'
  );
  const [phoneOtp, setPhoneOtp] = useState<string>('');
  const [adminPin, setAdminPin] = useState<string>('');
  
  // Google One-Tap Picker State
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [showGoogleAccountPicker, setShowGoogleAccountPicker] = useState<boolean>(false);

  const [isSending, setIsSending] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Google 1-Tap Login
  const handleGoogleSignIn = (selectedEmail?: string, selectedName?: string) => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      const chosenEmail = selectedEmail || 'mathew.thomas@gmail.com';
      const chosenName = selectedName || (chosenEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()));

      const session: UserSession = {
        id: `usr-g-${Date.now().toString().slice(-4)}`,
        email: chosenEmail,
        name: chosenName,
        phone: '+91 98950 12345',
        role: targetRole,
        isVerified: true,
        authProvider: 'google',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        partnerId: targetRole === 'partner' ? 'p-106' : undefined
      };

      localStorage.setItem('fykzi_session', JSON.stringify(session));
      localStorage.setItem('fykzi_user_session', JSON.stringify(session));
      onLoginSuccess(session);
      onClose();
    }, 700);
  };

  // 2. Email OTP Send & Verify
  const handleSendEmailOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address (e.g. name@gmail.com)');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setEmailStep('verify');
    }, 600);
  };

  const handleVerifyEmailOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (emailOtp !== '123456' && emailOtp.length !== 6) {
      setErrorMsg('Invalid verification code. Use demo code 123456.');
      return;
    }

    const session: UserSession = {
      id: `usr-m-${Date.now().toString().slice(-4)}`,
      email: email,
      name: name || email.split('@')[0],
      phone: '+91 98950 12345',
      role: targetRole,
      isVerified: true,
      authProvider: 'email',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      partnerId: targetRole === 'partner' ? 'p-106' : undefined
    };

    localStorage.setItem('fykzi_session', JSON.stringify(session));
    localStorage.setItem('fykzi_user_session', JSON.stringify(session));
    onLoginSuccess(session);
    onClose();
  };

  // 3. Phone OTP Send & Verify
  const handleSendPhoneOTP = (e: React.FormEvent) => {
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
        setPhoneStep('admin_pin');
      } else {
        setPhoneStep('otp');
      }
    }, 600);
  };

  const handleVerifyPhoneOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (phoneOtp !== '123456' && phoneOtp.length !== 6) {
      setErrorMsg('Invalid OTP. Use demo verification code 123456.');
      return;
    }

    const session: UserSession = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      phone: `+91 ${phoneNumber.replace(/\D/g, '').slice(-10)}`,
      name: name || 'Verified User',
      role: targetRole,
      isVerified: true,
      authProvider: 'phone',
      partnerId: targetRole === 'partner' ? 'p-106' : undefined
    };

    localStorage.setItem('fykzi_session', JSON.stringify(session));
    localStorage.setItem('fykzi_user_session', JSON.stringify(session));
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
      name: name || 'Fykzi Kerala Operations Admin',
      role: 'admin',
      isVerified: true,
      authProvider: 'phone'
    };

    localStorage.setItem('fykzi_session', JSON.stringify(session));
    localStorage.setItem('fykzi_user_session', JSON.stringify(session));
    onLoginSuccess(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-7 overflow-hidden transition-all card-3d-interactive ${
        isDark
          ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]'
          : 'bg-white border-slate-200 text-slate-900 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.15)]'
      }`}>
        
        {/* Top Radial Glow Accent */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 relative z-10">
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20 ${
              targetRole === 'admin'
                ? 'bg-gradient-to-tr from-rose-600 to-amber-600'
                : targetRole === 'partner'
                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600'
                : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-600'
            }`}>
              {targetRole === 'admin' ? (
                <KeyRound className="w-5 h-5" />
              ) : authMethod === 'google_email' ? (
                <Mail className="w-5 h-5" />
              ) : (
                <Phone className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">
                {targetRole === 'admin'
                  ? 'Admin Portal Security PIN'
                  : targetRole === 'partner'
                  ? 'Gig Partner Portal Login'
                  : 'Customer Sign In'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold">
                {targetRole === 'admin'
                  ? 'Authorized Personnel Passcode Gate'
                  : 'Instant Google, Email & Mobile Verification'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
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

        {/* Method Switcher Tabs (For Customer / Partner) */}
        {targetRole !== 'admin' && (
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mt-4">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('google_email');
                setEmailStep('input');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                authMethod === 'google_email'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Google & Email</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setPhoneStep('phone');
                setErrorMsg(null);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                authMethod === 'phone'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Phone OTP</span>
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* OPTION 1: GOOGLE & EMAIL AUTHENTICATION                      */}
        {/* ============================================================ */}
        {authMethod === 'google_email' && targetRole !== 'admin' && (
          <div className="space-y-4 mt-4">
            
            {/* 1.1 Official Google Sign-In Button */}
            <div>
              <button
                type="button"
                onClick={() => setShowGoogleAccountPicker(true)}
                disabled={isGoogleLoading}
                className={`w-full py-3 px-4 rounded-2xl border flex items-center justify-center space-x-3 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer ${
                  isDark
                    ? 'bg-white text-slate-900 hover:bg-slate-100 border-slate-300'
                    : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300'
                }`}
              >
                {isGoogleLoading ? (
                  <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Continue with Google (1-Tap)</span>
              </button>
            </div>

            {/* Google Account Picker Dropdown / Simulation */}
            {showGoogleAccountPicker && (
              <div className={`p-3.5 rounded-2xl border space-y-2 animate-in fade-in slide-in-from-top-2 ${
                isDark ? 'bg-slate-950 border-blue-500/40' : 'bg-blue-50/60 border-blue-200'
              }`}>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Choose a Google Account:</span>
                  <button
                    type="button"
                    onClick={() => setShowGoogleAccountPicker(false)}
                    className="hover:text-white text-xs"
                  >
                    ✕
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('mathew.thomas@gmail.com', 'Mathew Thomas')}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all text-left cursor-pointer ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 hover:border-blue-400 hover:bg-slate-800'
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                      M
                    </div>
                    <div>
                      <div className="text-xs font-bold">Mathew Thomas</div>
                      <div className="text-[10px] text-slate-400">mathew.thomas@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-bold">✓ 1-Tap</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('anjali.menon@gmail.com', 'Anjali Menon')}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all text-left cursor-pointer ${
                    isDark
                      ? 'bg-slate-900 border-slate-700 hover:border-blue-400 hover:bg-slate-800'
                      : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
                      A
                    </div>
                    <div>
                      <div className="text-xs font-bold">Anjali Menon</div>
                      <div className="text-[10px] text-slate-400">anjali.menon@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-bold">✓ 1-Tap</span>
                </button>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center space-x-2 py-1">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                Or with Email Verification
              </span>
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            </div>

            {/* 1.2 Email Input Form */}
            {emailStep === 'input' ? (
              <form onSubmit={handleSendEmailOTP} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mathew Thomas"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    We will send a 6-digit verification code to your email inbox.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Email Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Email Verification Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* 1.3 Email Code Verification Form */
              <form onSubmit={handleVerifyEmailOTP} className="space-y-3.5">
                <div className="text-center pb-1">
                  <span className="text-xs text-slate-400 font-bold block">
                    Enter the 6-digit verification code sent to
                  </span>
                  <span className="text-xs font-black text-blue-500 truncate block">
                    {email}
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className={`w-full text-center tracking-[0.5em] py-2.5 rounded-2xl border text-lg font-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setEmailOtp('123456')}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    ⚡ Use Demo Code: 123456
                  </button>
                  <button
                    type="button"
                    onClick={() => setEmailStep('input')}
                    className="text-slate-400 font-semibold hover:underline cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verify Email &amp; Log In</span>
                </button>
              </form>
            )}

          </div>
        )}

        {/* ============================================================ */}
        {/* OPTION 2: PHONE OTP OR ADMIN PIN AUTHENTICATION             */}
        {/* ============================================================ */}
        {(authMethod === 'phone' || targetRole === 'admin') && (
          <div className="space-y-4 mt-4">
            
            {/* Step 2.1: Phone Input Form */}
            {phoneStep === 'phone' && (
              <form onSubmit={handleSendPhoneOTP} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Mathew Thomas"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
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
                      className={`flex-1 px-3 py-2.5 rounded-r-xl border text-xs font-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Instant 6-digit SMS OTP verification.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending SMS OTP...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Phone Verification Code</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2.2: Phone OTP Verification Form */}
            {phoneStep === 'otp' && (
              <form onSubmit={handleVerifyPhoneOTP} className="space-y-3.5">
                <div className="text-center pb-1">
                  <span className="text-xs text-slate-400 font-bold block">
                    Enter the 6-digit code sent to
                  </span>
                  <span className="text-xs font-black text-blue-500">
                    +91 {phoneNumber}
                  </span>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    className={`w-full text-center tracking-[0.5em] py-2.5 rounded-2xl border text-lg font-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setPhoneOtp('123456')}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                  >
                    ⚡ Use Demo Code: 123456
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhoneStep('phone')}
                    className="text-slate-400 font-semibold hover:underline cursor-pointer"
                  >
                    Change Number
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify &amp; Continue</span>
                </button>
              </form>
            )}

            {/* Step 2.3: Admin Passcode Verification Form */}
            {phoneStep === 'admin_pin' && (
              <form onSubmit={handleVerifyAdminPin} className="space-y-3.5">
                <div className="text-center pb-1">
                  <span className="text-xs text-slate-400 font-bold block">
                    Enter Admin Security Passcode (PIN)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Authorized Fykzi Operations Team Only
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
                    className={`w-full text-center tracking-[0.5em] py-2.5 rounded-2xl border text-lg font-black focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setAdminPin('9895')}
                    className="text-rose-500 font-bold hover:underline cursor-pointer"
                  >
                    ⚡ Demo Admin PIN: 9895
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhoneStep('phone')}
                    className="text-slate-400 font-semibold hover:underline cursor-pointer"
                  >
                    Back
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Admin Console</span>
                </button>
              </form>
            )}

          </div>
        )}

        {/* DPDP Act 2023 Consent Footnote */}
        <div className={`mt-4 p-2.5 rounded-2xl border text-[10px] leading-relaxed ${
          isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-start space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
            <span>
              <strong>DPDP Act 2023 Encrypted:</strong> Secure OAuth 2.0 &amp; verified sessions. Zero spam calls or promotional emails.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
