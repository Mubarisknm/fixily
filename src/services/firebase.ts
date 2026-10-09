import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
  UserCredential
} from 'firebase/auth';

// Configuration interface
export interface FirebaseAuthConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

// Load Firebase configuration from environment or localStorage
export function getFirebaseConfig(): FirebaseAuthConfig | null {
  try {
    // 1. Check localStorage override first
    const local = localStorage.getItem('fykzi_firebase_config');
    if (local) {
      const parsed = JSON.parse(local);
      if (parsed?.apiKey && parsed?.projectId) {
        return parsed;
      }
    }

    // 2. Check Vite environment variables
    const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const envAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
    const envAppId = import.meta.env.VITE_FIREBASE_APP_ID;

    if (envApiKey && envProjectId) {
      return {
        apiKey: envApiKey,
        authDomain: envAuthDomain || `${envProjectId}.firebaseapp.com`,
        projectId: envProjectId,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${envProjectId}.appspot.com`,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
        appId: envAppId || ''
      };
    }
  } catch (e) {
    console.error('Error loading Firebase config:', e);
  }
  return null;
}

// Save Firebase config into localStorage
export function saveFirebaseConfig(config: FirebaseAuthConfig) {
  try {
    localStorage.setItem('fykzi_firebase_config', JSON.stringify(config));
  } catch (e) {}
}

let firebaseApp: FirebaseApp | null = null;
let firebaseAuth: Auth | null = null;
let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

// Initialize or retrieve Firebase Auth instance
export function getFirebaseAuth(): Auth | null {
  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    if (!firebaseApp) {
      const apps = getApps();
      firebaseApp = apps.length > 0 ? getApp() : initializeApp(config);
    }
    if (!firebaseAuth) {
      firebaseAuth = getAuth(firebaseApp);
      // Ensure language is set for SMS localization
      firebaseAuth.useDeviceLanguage();
    }
    return firebaseAuth;
  } catch (err) {
    console.error('Failed to initialize Firebase Auth:', err);
    return null;
  }
}

export function isFirebaseReady(): boolean {
  return getFirebaseConfig() !== null;
}

// Initialize reCAPTCHA verifier for Phone Auth
export function initRecaptchaVerifier(containerId: string): RecaptchaVerifier | null {
  const auth = getFirebaseAuth();
  if (!auth) return null;

  try {
    // Clear any previous verifier
    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (e) {}
      recaptchaVerifier = null;
    }

    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        console.log('[Firebase Phone Auth] reCAPTCHA verified successfully');
      },
      'expired-callback': () => {
        console.warn('[Firebase Phone Auth] reCAPTCHA expired. User may retry.');
      }
    });

    return recaptchaVerifier;
  } catch (err) {
    console.error('Error creating reCAPTCHA verifier:', err);
    return null;
  }
}

// Send real SMS OTP to phone number using Firebase
export async function sendFirebasePhoneSMS(
  phoneNumberE164: string,
  containerId: string = 'recaptcha-container'
): Promise<{ success: boolean; message?: string }> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return {
      success: false,
      message: 'Firebase is not yet configured with your project API keys.'
    };
  }

  try {
    // Ensure phone number is E.164 format (+91xxxxxxxxxx)
    const cleanDigits = phoneNumberE164.replace(/\D/g, '');
    const formattedPhone = phoneNumberE164.startsWith('+')
      ? phoneNumberE164
      : `+91${cleanDigits.slice(-10)}`;

    const verifier = initRecaptchaVerifier(containerId);
    if (!verifier) {
      return {
        success: false,
        message: 'Could not initialize reCAPTCHA verifier for Phone Auth.'
      };
    }

    console.log(`[Firebase Phone Auth] 🚀 Sending real SMS to ${formattedPhone}...`);
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
    console.log(`[Firebase Phone Auth] ✅ SMS dispatched by Google Firebase to ${formattedPhone}!`);

    return {
      success: true,
      message: `Real SMS OTP sent to ${formattedPhone}`
    };
  } catch (err: any) {
    console.error('[Firebase Phone Auth Error]', err);
    let msg = err.message || 'Firebase Phone Auth error';
    if (err.code === 'auth/invalid-phone-number') {
      msg = 'The provided phone number is invalid. Please check the 10-digit number.';
    } else if (err.code === 'auth/quota-exceeded') {
      msg = 'Firebase SMS quota exceeded for this project.';
    } else if (err.code === 'auth/too-many-requests') {
      msg = 'Too many requests from this device. Please try again later.';
    } else if (err.code === 'auth/captcha-check-failed') {
      msg = 'reCAPTCHA verification failed. Please refresh the page and try again.';
    }
    return { success: false, message: msg };
  }
}

// Verify the SMS OTP code received on physical phone
export async function confirmFirebasePhoneOTP(
  otpCode: string
): Promise<{ success: boolean; user?: any; message?: string }> {
  if (!confirmationResult) {
    return {
      success: false,
      message: 'No active Firebase SMS verification in progress. Please request a code first.'
    };
  }

  try {
    const cleanCode = otpCode.trim();
    const result: UserCredential = await confirmationResult.confirm(cleanCode);
    console.log('[Firebase Phone Auth] ✅ User verified successfully with Firebase UID:', result.user.uid);
    return {
      success: true,
      user: result.user
    };
  } catch (err: any) {
    console.error('[Firebase Phone Auth Verification Error]', err);
    let msg = 'Incorrect 6-digit SMS verification code. Please check your phone messages.';
    if (err.code === 'auth/invalid-verification-code') {
      msg = 'Invalid 6-digit code. Please enter the exact code received on your phone.';
    } else if (err.code === 'auth/code-expired') {
      msg = 'The verification code has expired. Please request a new SMS OTP.';
    }
    return {
      success: false,
      message: msg
    };
  }
}
