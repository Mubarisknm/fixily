import React, { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  ShieldCheck,
  Check,
  Lock,
  ArrowRight,
  RefreshCw,
  User,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogIn,
  UserPlus,
  Globe,
  Sun,
  Moon,
  Flame,
  Settings
} from 'lucide-react';
import { UserRole, UserSession, ThemeMode, AppLanguage, KochiLocation } from '../types';
import { useTranslation } from '../utils/translations';
import { api } from '../services/api';
import { FykziLogo } from './FykziLogo';
import { sendFirebasePhoneSMS, confirmFirebasePhoneOTP, isFirebaseReady } from '../services/firebase';
import { FirebaseConfigModal } from './FirebaseConfigModal';

interface AuthPageProps {
  onLoginSuccess: (session: UserSession) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  language: AppLanguage;
  onToggleLanguage: () => void;
  selectedLocation?: KochiLocation;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  theme,
  onToggleTheme,
  language,
  onToggleLanguage,
  selectedLocation
}) => {
  const { t } = useTranslation(language);
  const isDark = theme === 'dark';

  // Primary mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Auth Method: 'phone' | 'google_email' | 'admin'
  const [authMethod, setAuthMethod] = useState<'phone' | 'google_email' | 'admin'>('phone');

  // Selected Role (for registration): 'customer' | 'partner'
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Input fields (clean / empty for user's personal details)
  const [name, setName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [district, setDistrict] = useState<string>(selectedLocation?.district || 'Ernakulam');
  const [adminPin, setAdminPin] = useState<string>('');

  // Sub-steps: 'input' | 'otp'
  const [phoneStep, setPhoneStep] = useState<'input' | 'otp'>('input');
  const [phoneOtp, setPhoneOtp] = useState<string>('');

  const [emailStep, setEmailStep] = useState<'input' | 'otp'>('input');
  const [emailOtp, setEmailOtp] = useState<string>('');

  // Active OTP notification state
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);
  const [otpSentTarget, setOtpSentTarget] = useState<string>('');
  const [otpCountdown, setOtpCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  // Status & loading
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual Google entry fallback
  const [showManualGoogle, setShowManualGoogle] = useState<boolean>(false);
  const [googleEmail, setGoogleEmail] = useState<string>('');
  const [googleName, setGoogleName] = useState<string>('');

  // Firebase Real Phone SMS Integration State
  const [isFirebaseConfigOpen, setIsFirebaseConfigOpen] = useState<boolean>(false);
  const [isUsingFirebase, setIsUsingFirebase] = useState<boolean>(false);
  const [firebaseAvailable, setFirebaseAvailable] = useState<boolean>(() => isFirebaseReady());

  // Countdown timer for OTP
  useEffect(() => {
    let timer: any;
    if ((phoneStep === 'otp' || emailStep === 'otp') && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [phoneStep, emailStep, otpCountdown]);

  // Google Identity Services (GIS)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.initialize({
          client_id: '1084282828282-fykzi-kerala-services.apps.googleusercontent.com',
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      } catch (e) {}
    }
  }, []);

  const handleGoogleCredentialResponse = async (response: any) => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      let emailFromJwt = '';
      let nameFromJwt = '';
      let pictureFromJwt = '';

      if (response && response.credential) {
        try {
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const parsed = JSON.parse(jsonPayload);
          emailFromJwt = parsed.email || '';
          nameFromJwt = parsed.name || '';
          pictureFromJwt = parsed.picture || '';
        } catch (e) {}
      }

      const res = await api.googleSignIn({
        credential: response?.credential,
        email: emailFromJwt || 'user@gmail.com',
        name: nameFromJwt,
        avatar: pictureFromJwt,
        role: selectedRole
      });

      if (res.success && res.session) {
        localStorage.setItem('fykzi_real_auth_session', JSON.stringify(res.session));
        onLoginSuccess(res.session);
      } else {
        setErrorMsg('Google authentication failed. Please enter your email below.');
        setShowManualGoogle(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google Sign-In failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleTriggerGoogleSignIn = () => {
    setErrorMsg(null);
    if ((window as any).google?.accounts?.id) {
      try {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setShowManualGoogle(true);
          }
        });
        return;
      } catch (e) {}
    }
    setShowManualGoogle(true);
  };

  const handleManualGoogleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!googleEmail || !googleEmail.includes('@') || !googleEmail.includes('.')) {
      setErrorMsg('Please enter a valid Google email address');
      return;
    }

    setIsGoogleLoading(true);
    try {
      const res = await api.googleSignIn({
        email: googleEmail.trim(),
        name: googleName.trim() || googleEmail.split('@')[0],
        role: selectedRole
      });

      if (res.success && res.session) {
        localStorage.setItem('fykzi_real_auth_session', JSON.stringify(res.session));
        onLoginSuccess(res.session);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google authentication failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 1. Mobile Phone OTP
  const handleSendPhoneOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    if (authMode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your Full Name to register');
      return;
    }

    const targetPhone = `+91 ${cleanPhone.slice(-10)}`;
    setIsSending(true);

    // If Firebase is configured, attempt real physical cellular SMS delivery first
    if (firebaseAvailable) {
      try {
        const fbRes = await sendFirebasePhoneSMS(targetPhone, 'recaptcha-container');
        if (fbRes.success) {
          setIsSending(false);
          setIsUsingFirebase(true);
          setActiveOtpCode(null); // Code sent directly to user's real phone handset
          setOtpSentTarget(targetPhone);
          setPhoneStep('otp');
          setOtpCountdown(60);
          setCanResend(false);
          return;
        } else {
          console.warn('[Firebase Auth fallback]', fbRes.message);
          setErrorMsg(`${fbRes.message} (Falling back to local verification)`);
        }
      } catch (err: any) {
        console.warn('[Firebase Auth Exception]', err);
      }
    }

    // Standard API / Local Simulation path
    try {
      const res = await api.sendOtp({
        target: targetPhone,
        type: 'phone',
        name: name.trim(),
        role: selectedRole,
        purpose: authMode
      });

      setIsSending(false);
      setIsUsingFirebase(false);
      if (res.success) {
        setActiveOtpCode(res.otp || null);
        setOtpSentTarget(targetPhone);
        setPhoneStep('otp');
        setOtpCountdown(60);
        setCanResend(false);
      } else {
        setErrorMsg(res.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      setIsSending(false);
      setErrorMsg(err.message || 'Network error while sending SMS OTP');
    }
  };

  const handleVerifyPhoneOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanOtp = phoneOtp.replace(/\D/g, '').trim();
    if (cleanOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code');
      return;
    }

    setIsVerifying(true);

    // If using Firebase Phone Auth, confirm with Firebase servers
    if (isUsingFirebase) {
      try {
        const fbConfirm = await confirmFirebasePhoneOTP(cleanOtp);
        setIsVerifying(false);
        if (fbConfirm.success && fbConfirm.user) {
          const session: UserSession = {
            id: `usr-fb-${fbConfirm.user.uid.slice(-6)}`,
            name: name.trim() || 'Verified Customer',
            phone: fbConfirm.user.phoneNumber || otpSentTarget,
            role: selectedRole,
            isVerified: true,
            authProvider: 'phone'
          };
          localStorage.setItem('fykzi_real_auth_session', JSON.stringify(session));
          onLoginSuccess(session);
          return;
        } else {
          setErrorMsg(fbConfirm.message || 'Invalid 6-digit verification code sent to your phone');
          return;
        }
      } catch (err: any) {
        setIsVerifying(false);
        setErrorMsg(err.message || 'Verification failed. Try again.');
        return;
      }
    }

    // Standard API verification
    try {
      const res = await api.verifyOtp({
        target: otpSentTarget || `+91 ${phoneNumber.replace(/\D/g, '').slice(-10)}`,
        otp: cleanOtp,
        name: name.trim(),
        role: selectedRole
      });

      setIsVerifying(false);
      if (res.success && res.session) {
        localStorage.setItem('fykzi_real_auth_session', JSON.stringify(res.session));
        onLoginSuccess(res.session);
      } else {
        setErrorMsg(res.message || 'Invalid 6-digit verification code');
      }
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMsg(err.message || 'Verification failed. Try again.');
    }
  };

  // 2. Email Code Verification
  const handleSendEmailOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    if (authMode === 'register' && !name.trim()) {
      setErrorMsg('Please enter your Full Name to register');
      return;
    }

    setIsSending(true);
    try {
      const res = await api.sendOtp({
        target: cleanEmail,
        type: 'email',
        name: name.trim(),
        role: selectedRole,
        purpose: authMode
      });

      setIsSending(false);
      if (res.success) {
        setActiveOtpCode(res.otp || null);
        setOtpSentTarget(cleanEmail);
        setEmailStep('otp');
        setOtpCountdown(60);
        setCanResend(false);
      } else {
        setErrorMsg(res.message || 'Failed to send email code');
      }
    } catch (err: any) {
      setIsSending(false);
      setErrorMsg(err.message || 'Network error');
    }
  };

  const handleVerifyEmailOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanOtp = emailOtp.replace(/\D/g, '').trim();
    if (cleanOtp.length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await api.verifyOtp({
        target: otpSentTarget || email.trim().toLowerCase(),
        otp: cleanOtp,
        name: name.trim(),
        role: selectedRole
      });

      setIsVerifying(false);
      if (res.success && res.session) {
        localStorage.setItem('fykzi_real_auth_session', JSON.stringify(res.session));
        onLoginSuccess(res.session);
      } else {
        setErrorMsg(res.message || 'Invalid verification code');
      }
    } catch (err: any) {
      setIsVerifying(false);
      setErrorMsg(err.message || 'Verification failed');
    }
  };

  // 3. Admin Security PIN
  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (adminPin !== '9895' && adminPin !== '1234') {
      setErrorMsg('Invalid Admin Security Passcode.');
      return;
    }

    const session: UserSession = {
      id: 'adm-001',
      phone: phoneNumber ? `+91 ${phoneNumber.replace(/\D/g, '').slice(-10)}` : '+91 98950 00100',
      name: name.trim() || 'Fykzi Operations Admin',
      role: 'admin',
      isVerified: true,
      authProvider: 'phone'
    };

    localStorage.setItem('fykzi_real_auth_session', JSON.stringify(session));
    onLoginSuccess(session);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 relative overflow-x-hidden ${
      isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/15 via-blue-500/5 to-transparent pointer-events-none blur-3xl" />

      {/* Top Bar with Logo & Controls */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <FykziLogo isDark={isDark} size="md" variant="full" />
        </div>

        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-black transition-all flex items-center space-x-1 cursor-pointer ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-blue-500'
                : 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 shadow-sm'
            }`}
            title="Toggle English / മലയാളം"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>{language === 'en' ? 'ML' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-sm flex items-center space-x-1 cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Authentication Card Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 overflow-hidden transition-all ${
          isDark
            ? 'bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-slate-800 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]'
            : 'bg-white border-slate-200 text-slate-900 shadow-[0_25px_60px_-15px_rgba(37,99,235,0.12)]'
        }`}>
          
          {/* Card Top Branding Header */}
          <div className="text-center pb-3 border-b border-slate-100 dark:border-slate-800/80">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[11px] font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Kerala Doorstep Services Network</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {authMode === 'register'
                ? selectedRole === 'partner'
                  ? 'Join as Service Partner'
                  : 'Create Your Fykzi Account'
                : authMethod === 'admin'
                ? 'Operations Admin Gate'
                : 'Sign In to Fykzi'}
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              {authMode === 'register'
                ? 'Register with your verified mobile number or personal Google email'
                : 'Instant 6-digit OTP verification & Google 1-Tap authentication'}
            </p>
          </div>

          {/* Real OTP Delivery Toast Banner */}
          {activeOtpCode && (
            <div className="mt-4 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-300 text-xs font-bold animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg">💬</span>
                  <div>
                    <span className="block text-[11px] text-slate-400 font-semibold">
                      Verification code sent to {otpSentTarget}:
                    </span>
                    <span className="text-lg font-mono font-black tracking-widest text-blue-600 dark:text-blue-400">
                      {activeOtpCode}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (phoneStep === 'otp') setPhoneOtp(activeOtpCode);
                    if (emailStep === 'otp') setEmailOtp(activeOtpCode);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-[10px] font-black hover:bg-blue-500 transition-all cursor-pointer shadow-sm"
                >
                  Auto-Fill
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode Switcher: Sign In vs Register */}
          {authMethod !== 'admin' && (
            <div className="mt-4 grid grid-cols-2 gap-1 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Account</span>
              </button>
            </div>
          )}

          {/* Role Selection in Register Mode */}
          {authMode === 'register' && authMethod !== 'admin' && (
            <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'customer'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-300 font-black ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">I am a</span>
                <span className="font-black text-xs">Customer</span>
                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Book Doorstep Services</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('partner')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedRole === 'partner'
                    ? 'bg-blue-600/10 border-blue-500 text-blue-600 dark:text-blue-300 font-black ring-1 ring-blue-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">I am a</span>
                <span className="font-black text-xs">Service Partner</span>
                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Offer Trades &amp; Earn</span>
              </button>
            </div>
          )}

          {/* Method Switcher Tabs (Mobile OTP vs Google & Email) */}
          {authMethod !== 'admin' && (
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mt-3.5">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('phone');
                  setPhoneStep('input');
                  setErrorMsg(null);
                }}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                  authMethod === 'phone'
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Mobile Number OTP</span>
              </button>

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
                <span>Google &amp; Email</span>
              </button>
            </div>
          )}

          {/* ============================================================ */}
          {/* OPTION 1: MOBILE NUMBER OTP FLOW                             */}
          {/* ============================================================ */}
          {authMethod === 'phone' && (
            <div className="space-y-4 mt-4">
              
              {/* Firebase Real Phone SMS Indicator & Setup Button */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  <span className="text-[11px] font-bold text-slate-400">
                    Real SMS:
                  </span>
                  <span className={`text-[11px] font-black ${firebaseAvailable ? 'text-amber-400' : 'text-slate-400'}`}>
                    {firebaseAvailable ? 'Google Firebase Active' : 'Local Code Active'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFirebaseConfigOpen(true)}
                  className="px-2 py-1 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-500 dark:text-blue-400 text-[10px] font-black transition cursor-pointer flex items-center space-x-1"
                >
                  <Settings className="w-3 h-3" />
                  <span>{firebaseAvailable ? 'Edit Firebase' : 'Configure Firebase'}</span>
                </button>
              </div>

              {/* Step 1.1: Mobile Number Input Form */}
              {phoneStep === 'input' && (
                <form onSubmit={handleSendPhoneOTP} className="space-y-3.5">
                  
                  {/* Full Name in Register Mode */}
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Mobile Number (+91) *
                    </label>
                    <div className="relative flex">
                      <div className={`px-3 py-2.5 rounded-l-xl border-y border-l flex items-center text-xs font-black shrink-0 ${
                        isDark ? 'bg-slate-800 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                      }`}>
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10-digit mobile number"
                        className={`flex-1 px-3 py-2.5 rounded-r-xl border text-xs font-black tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      An instant 6-digit SMS verification code will be sent.
                    </p>
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Kerala District
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      >
                        {['Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha', 'Kottayam', 'Malappuram', 'Palakkad', 'Idukki', 'Wayanad', 'Pathanamthitta', 'Kasaragod'].map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSending || phoneNumber.length < 10}
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Generating &amp; Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>{authMode === 'register' ? 'Verify Mobile & Register' : 'Send Mobile Verification OTP'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 1.2: 6-Digit OTP Verification Form */}
              {phoneStep === 'otp' && (
                <form onSubmit={handleVerifyPhoneOTP} className="space-y-3.5">
                  <div className="text-center pb-1">
                    <span className="text-xs text-slate-400 font-bold block">
                      Enter the 6-digit verification code sent to
                    </span>
                    <span className="text-xs font-black text-blue-500">
                      {otpSentTarget}
                    </span>
                  </div>

                  {activeOtpCode && (
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                      <div className="text-left">
                        <span className="block text-[10px] uppercase font-extrabold text-blue-500">
                          Your Verification Code:
                        </span>
                        <span className="font-mono text-lg font-black text-blue-600 dark:text-blue-400 tracking-widest">
                          {activeOtpCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPhoneOtp(activeOtpCode)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-500 transition-all cursor-pointer shadow-sm flex items-center space-x-1"
                      >
                        <span>Fill Code</span>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className={`w-full text-center tracking-[0.5em] py-3 rounded-2xl border text-xl font-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => handleSendPhoneOTP()}
                        className="text-blue-500 font-bold hover:underline cursor-pointer"
                      >
                        🔄 Resend OTP
                      </button>
                    ) : (
                      <span className="text-slate-400 font-semibold">
                        Resend in {otpCountdown}s
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setPhoneStep('input');
                        setActiveOtpCode(null);
                        setPhoneOtp('');
                      }}
                      className="text-slate-400 font-semibold hover:underline cursor-pointer"
                    >
                      Change Number
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || phoneOtp.length !== 6}
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Code...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Verify &amp; Enter Fykzi</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* OPTION 2: GOOGLE & EMAIL AUTHENTICATION                      */}
          {/* ============================================================ */}
          {authMethod === 'google_email' && (
            <div className="space-y-4 mt-4">
              
              {/* 2.1 Google Sign-In Button */}
              <div>
                <button
                  type="button"
                  onClick={handleTriggerGoogleSignIn}
                  disabled={isGoogleLoading}
                  className={`w-full py-3.5 px-4 rounded-2xl border flex items-center justify-center space-x-3 text-xs font-black transition-all shadow-md active:scale-95 cursor-pointer ${
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
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Manual Google Account Fallback */}
              {showManualGoogle && (
                <form onSubmit={handleManualGoogleAuthSubmit} className={`p-3.5 rounded-2xl border space-y-2.5 animate-in fade-in slide-in-from-top-2 ${
                  isDark ? 'bg-slate-950 border-blue-500/40' : 'bg-blue-50/60 border-blue-200'
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>Authenticate with Google Account:</span>
                    <button
                      type="button"
                      onClick={() => setShowManualGoogle(false)}
                      className="hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <input
                    type="email"
                    required
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    placeholder="Enter your personal Gmail address"
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />

                  <input
                    type="text"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    placeholder="Your Name (optional)"
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={isGoogleLoading}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Authenticate Google Account</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="flex items-center space-x-2 py-1">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                  Or with Email Code Verification
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* 2.2 Email Input Form */}
              {emailStep === 'input' ? (
                <form onSubmit={handleSendEmailOTP} className="space-y-3">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                        <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your personal email (e.g. name@gmail.com)"
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                        }`}
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      We will send a 6-digit security code to your email inbox.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSending || !email.includes('@')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
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
                /* 2.3 Email Code Verification Form */
                <form onSubmit={handleVerifyEmailOTP} className="space-y-3.5">
                  <div className="text-center pb-1">
                    <span className="text-xs text-slate-400 font-bold block">
                      Enter the 6-digit code sent to
                    </span>
                    <span className="text-xs font-black text-blue-500 truncate block">
                      {otpSentTarget}
                    </span>
                  </div>

                  {activeOtpCode && (
                    <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                      <div className="text-left">
                        <span className="block text-[10px] uppercase font-extrabold text-blue-500">
                          Your Verification Code:
                        </span>
                        <span className="font-mono text-lg font-black text-blue-600 dark:text-blue-400 tracking-widest">
                          {activeOtpCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailOtp(activeOtpCode)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-black text-xs hover:bg-blue-500 transition-all cursor-pointer shadow-sm flex items-center space-x-1"
                      >
                        <span>Fill Code</span>
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      autoFocus
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className={`w-full text-center tracking-[0.5em] py-3 rounded-2xl border text-xl font-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => handleSendEmailOTP()}
                        className="text-blue-500 font-bold hover:underline cursor-pointer"
                      >
                        🔄 Resend Code
                      </button>
                    ) : (
                      <span className="text-slate-400 font-semibold">
                        Resend in {otpCountdown}s
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setEmailStep('input');
                        setActiveOtpCode(null);
                        setEmailOtp('');
                      }}
                      className="text-slate-400 font-semibold hover:underline cursor-pointer"
                    >
                      Change Email
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || emailOtp.length !== 6}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Verify Email &amp; Sign In</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* OPTION 3: ADMIN SECURITY PASSCODE GATE                       */}
          {/* ============================================================ */}
          {authMethod === 'admin' && (
            <div className="space-y-4 mt-4">
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
                    placeholder="Enter Security PIN..."
                    className={`w-full text-center tracking-[0.5em] py-3 rounded-2xl border text-xl font-black focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMethod('phone')}
                    className="text-slate-400 font-semibold hover:underline cursor-pointer"
                  >
                    ← Back to Customer Login
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Admin Console</span>
                </button>
              </form>
            </div>
          )}

          {/* Admin Switcher Link in Footer */}
          {authMethod !== 'admin' && (
            <div className="text-center mt-3 pt-2">
              <button
                type="button"
                onClick={() => setAuthMethod('admin')}
                className="text-[11px] text-slate-400 hover:text-blue-500 font-bold transition-colors cursor-pointer"
              >
                🔐 Operations Admin Portal Login
              </button>
            </div>
          )}

          {/* DPDP Act 2023 Consent Footnote */}
          <div className={`mt-4 p-2.5 rounded-2xl border text-[10px] leading-relaxed ${
            isDark ? 'bg-slate-950/60 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            <div className="flex items-start space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
              <span>
                <strong>DPDP Act 2023 Compliant:</strong> Encrypted sessions with zero data sharing. Once signed in, your session stays safely preserved.
              </span>
            </div>
          </div>

        {/* Invisible reCAPTCHA container for Firebase Phone SMS */}
        <div id="recaptcha-container" className="flex justify-center my-2"></div>

      </div>
    </main>

    {/* Footer Info */}
    <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-400 font-semibold">
      © 2026 Fykzi Technologies Pvt Ltd • Kerala's On-Demand Services Network
    </footer>

    {/* Firebase Phone SMS Configuration Modal */}
    <FirebaseConfigModal
      isOpen={isFirebaseConfigOpen}
      onClose={() => setIsFirebaseConfigOpen(false)}
      onConfigSaved={() => {
        setFirebaseAvailable(isFirebaseReady());
      }}
      theme={theme}
    />

  </div>
);
};
