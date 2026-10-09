import { NotificationPreferences, UserSession, CustomerSavedAddress, BookingJob } from '../types';

const STORAGE_PREFS_KEY = 'fykzi_notification_preferences';

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  whatsapp: true,
  push: true,
  email: true,
  sms: true,
  voice: true,
};

export function getNotificationPreferences(): NotificationPreferences {
  try {
    const saved = localStorage.getItem(STORAGE_PREFS_KEY);
    if (saved) {
      return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load notification preferences:', e);
  }
  return { ...DEFAULT_NOTIFICATION_PREFERENCES };
}

export function saveNotificationPreferences(prefs: NotificationPreferences): void {
  try {
    localStorage.setItem(STORAGE_PREFS_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error('Failed to save notification preferences:', e);
  }
}

export type NotificationPermissionState = 'granted' | 'denied' | 'default' | 'unsupported';

export function getBrowserNotificationPermission(): NotificationPermissionState {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionState;
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermissionState> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Auto-enable push in preferences
      const prefs = getNotificationPreferences();
      prefs.push = true;
      saveNotificationPreferences(prefs);
    }
    return permission as NotificationPermissionState;
  } catch (e) {
    console.error('Error requesting notification permission:', e);
    return 'denied';
  }
}

/**
 * Plays a modern, pleasant Web Audio chime for alerts
 */
export function playNotificationChime(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // Audio autoplay might be restricted before interaction
  }
}

/**
 * Triggers a real browser push notification if permitted and channel is enabled
 */
export function sendPushNotification(
  title: string,
  body: string,
  options?: {
    isOrderRelated?: boolean;
    channel?: keyof NotificationPreferences;
  }
): boolean {
  const prefs = getNotificationPreferences();
  const isOrderRelated = options?.isOrderRelated ?? false;
  const channel = options?.channel ?? 'push';

  // Order-related messages cannot be disabled as per app policy
  if (!isOrderRelated && !prefs[channel]) {
    return false;
  }

  playNotificationChime();

  // Try native Web Notification
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=128&q=80',
        badge: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=128&q=80',
        silent: true // We play our custom chime
      });
      return true;
    } catch (e) {
      console.warn('Native notification instantiation failed:', e);
    }
  }

  return false;
}

/**
 * Exports user account data under India DPDP Act as JSON file download
 */
export function downloadUserDataExport(
  currentUser: UserSession | null,
  savedAddresses: CustomerSavedAddress[],
  jobs: BookingJob[]
): void {
  const userJobs = jobs.filter(j => j.customerPhone === currentUser?.phone || j.customerName === currentUser?.name);

  const exportData = {
    platform: 'Fykzi Kerala On-Demand Services',
    compliance: 'Digital Personal Data Protection (DPDP) Act, 2023 - Right to Data Portability',
    exportedAt: new Date().toISOString(),
    userProfile: currentUser || {
      note: 'Guest / Demo User session'
    },
    savedAddresses,
    bookingsCount: userJobs.length,
    bookingHistory: userJobs.map(j => ({
      id: j.id,
      serviceTitle: j.serviceTitle,
      status: j.status,
      address: j.location?.address || '',
      microMarket: j.location?.microMarket || '',
      scheduledTime: j.scheduledTime,
      pricing: j.pricing,
      paymentStatus: j.paymentStatus,
      createdAt: j.createdAt
    })),
    notificationPreferences: getNotificationPreferences()
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `fykzi_user_data_export_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Completely purges user data under Right to Erasure / Account Deletion
 */
export function deleteUserAccountData(): void {
  try {
    localStorage.removeItem('fykzi_real_auth_session');
    localStorage.removeItem('fykzi_user_session');
    localStorage.removeItem('fykso_user_session');
    localStorage.removeItem('fykzi_user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('user');
    localStorage.removeItem('fykzi_saved_addresses');
    localStorage.removeItem(STORAGE_PREFS_KEY);
    localStorage.removeItem('fykzi_active_jobs');
  } catch (e) {
    console.error('Failed to clear account storage:', e);
  }
}
