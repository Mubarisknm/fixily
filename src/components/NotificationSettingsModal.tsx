import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  X,
  Bell,
  Mail,
  MessageSquare,
  PhoneCall,
  ChevronRight,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { ThemeMode, AppLanguage, UserSession, CustomerSavedAddress, BookingJob, NotificationPreferences } from '../types';
import {
  getNotificationPreferences,
  saveNotificationPreferences,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  sendPushNotification,
  downloadUserDataExport,
  deleteUserAccountData,
  NotificationPermissionState
} from '../utils/pushNotifications';
import { sound } from '../utils/soundEffects';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserSession | null;
  savedAddresses?: CustomerSavedAddress[];
  jobs?: BookingJob[];
  onLogout?: () => void;
  theme: ThemeMode;
  language: AppLanguage;
}

// Authentic WhatsApp SVG icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 text-[#25D366]' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.889 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.456h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.486-8.415z" />
  </svg>
);

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  savedAddresses = [],
  jobs = [],
  onLogout,
  theme,
  language
}) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(getNotificationPreferences());
  const [permissionState, setPermissionState] = useState<NotificationPermissionState>(getBrowserNotificationPermission());
  const [showToast, setShowToast] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isRequestingPermission, setIsRequestingPermission] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPreferences(getNotificationPreferences());
      setPermissionState(getBrowserNotificationPermission());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 3500);
  };

  const handleTogglePreference = (key: keyof NotificationPreferences) => {
    const updated = {
      ...preferences,
      [key]: !preferences[key]
    };
    setPreferences(updated);
    saveNotificationPreferences(updated);

    // If user is toggling Push on and browser doesn't have permission yet, request it
    if (key === 'push' && updated.push && permissionState !== 'granted') {
      handleRequestPushPermission();
    }
  };

  const handleRequestPushPermission = async () => {
    setIsRequestingPermission(true);
    try {
      const state = await requestBrowserNotificationPermission();
      setPermissionState(state);
      if (state === 'granted') {
        const updated = { ...preferences, push: true };
        setPreferences(updated);
        saveNotificationPreferences(updated);
        sendPushNotification(
          '🔔 Fykzi Notifications Enabled',
          'You will now receive instant updates on technician arrivals, OTP verification and booking status.',
          { isOrderRelated: true }
        );
        triggerToast('✓ Push notifications successfully enabled!');
      } else if (state === 'denied') {
        triggerToast('⚠️ Notifications are blocked in browser settings. Please allow notifications for this site.');
      }
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleDownloadData = () => {
    try {
      downloadUserDataExport(currentUser, savedAddresses, jobs);
      triggerToast('✓ Your data export has been downloaded successfully (DPDP Act).');
    } catch (e) {
      triggerToast('Failed to export data.');
    }
  };

  const handleDeleteAccount = () => {
    deleteUserAccountData();
    setShowDeleteConfirm(false);
    onClose();
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div
        className={`relative w-full sm:max-w-md h-full sm:h-auto sm:max-h-[92vh] sm:rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all z-10 ${
          isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Header with Back Button and Title */}
        <div className="flex items-center space-x-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <button
            onClick={onClose}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'ml' ? 'ക്രമീകരണങ്ങൾ (Settings)' : 'Settings'}
          </h1>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Section: Notifications & reminders */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
              {language === 'ml' ? 'അറിയിപ്പുകൾ & ഓർമ്മപ്പെടുത്തലുകൾ' : 'Notifications & reminders'}
            </h2>

            {/* Push Notifications Info / Alert Banner */}
            {permissionState === 'granted' ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Push Notifications Active</span>
                  </div>
                  <p className="text-xs text-emerald-700/90 dark:text-emerald-300/80">
                    You will receive real-time technician arrival, dispatch and booking alerts.
                  </p>
                </div>
                <button
                  onClick={() => {
                    sendPushNotification(
                      '🔔 Fykzi Test Notification',
                      'Push notifications are working perfectly on this device!',
                      { isOrderRelated: true }
                    );
                    triggerToast('Test alert sent!');
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-emerald-600 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-all shrink-0 ml-2"
                >
                  Test Alert
                </button>
              </div>
            ) : (
              <div className="bg-[#FEF7EC] dark:bg-amber-950/30 border border-[#FDECD2] dark:border-amber-900/50 rounded-2xl p-4 mb-4">
                <h3 className="font-bold text-slate-900 dark:text-amber-100 text-sm mb-1">
                  Push Notifications
                </h3>
                <p className="text-xs text-slate-600 dark:text-amber-200/80 mb-3 leading-relaxed">
                  {permissionState === 'denied'
                    ? 'Notifications are blocked in your browser site permissions. You can enable them from settings.'
                    : 'Notifications are currently off. You can enable them from settings.'}
                </p>
                <button
                  onClick={handleRequestPushPermission}
                  disabled={isRequestingPermission}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-900 dark:border-slate-300 text-xs font-semibold text-slate-900 dark:text-white hover:bg-slate-900/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  {isRequestingPermission ? 'Requesting...' : 'Go to Settings'}
                </button>
              </div>
            )}

            {/* Notification Channel Toggles */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 border-t border-b border-slate-100 dark:border-slate-800/80">
              {/* 1. WhatsApp */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      WhatsApp
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Booking updates &amp; technician tracking link
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    handleTogglePreference('whatsapp');
                  }}
                  className={`switch-track ${preferences.whatsapp ? 'switch-track-on' : 'switch-track-off'}`}
                  aria-pressed={preferences.whatsapp}
                  title={preferences.whatsapp ? 'Turn off WhatsApp notifications' : 'Turn on WhatsApp notifications'}
                >
                  <span className="switch-thumb" />
                </button>
              </div>

              {/* 2. Push Notifications */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      Push Notifications
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Real-time arrivals, ETA radars &amp; SOS alerts
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    handleTogglePreference('push');
                  }}
                  className={`switch-track ${preferences.push ? 'switch-track-on' : 'switch-track-off'}`}
                  aria-pressed={preferences.push}
                  title={preferences.push ? 'Turn off Push notifications' : 'Turn on Push notifications'}
                >
                  <span className="switch-thumb" />
                </button>
              </div>

              {/* 3. Email */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      Email
                    </span>
                    <span className="text-[11px] text-slate-400">
                      PDF invoices, service summaries &amp; bills
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    handleTogglePreference('email');
                  }}
                  className={`switch-track ${preferences.email ? 'switch-track-on' : 'switch-track-off'}`}
                  aria-pressed={preferences.email}
                  title={preferences.email ? 'Turn off Email notifications' : 'Turn on Email notifications'}
                >
                  <span className="switch-thumb" />
                </button>
              </div>

              {/* 4. SMS */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      SMS
                    </span>
                    <span className="text-[11px] text-slate-400">
                      4-digit completion OTP &amp; verification codes
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    handleTogglePreference('sms');
                  }}
                  className={`switch-track ${preferences.sms ? 'switch-track-on' : 'switch-track-off'}`}
                  aria-pressed={preferences.sms}
                  title={preferences.sms ? 'Turn off SMS notifications' : 'Turn on SMS notifications'}
                >
                  <span className="switch-thumb" />
                </button>
              </div>

              {/* 5. Voice calls */}
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                    <PhoneCall className="w-4 h-4 text-teal-500" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">
                      Voice calls
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Technician doorstep directions &amp; emergency hotline
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    handleTogglePreference('voice');
                  }}
                  className={`switch-track ${preferences.voice ? 'switch-track-on' : 'switch-track-off'}`}
                  aria-pressed={preferences.voice}
                  title={preferences.voice ? 'Turn off Voice call notifications' : 'Turn on Voice call notifications'}
                >
                  <span className="switch-thumb" />
                </button>
              </div>
            </div>

            {/* Order Related Messages Information Card */}
            <div className="bg-slate-100 dark:bg-slate-800/60 rounded-2xl p-4 mt-4">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
                Order related messages
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Order related messages can't be turned off as they are important for service experience
              </p>
            </div>
          </div>

          {/* Section: Privacy & data */}
          <div className="pt-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3">
              Privacy &amp; data
            </h2>

            <div className="space-y-1">
              {/* Download Data */}
              <button
                onClick={handleDownloadData}
                className="w-full py-3 flex items-center justify-between text-left group hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Download data
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>

              {/* Delete Account */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full py-3 flex items-center justify-between text-left group hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  Delete account
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {showToast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-slate-900 text-white dark:bg-slate-800 text-xs font-semibold rounded-full shadow-2xl border border-slate-700 animate-in fade-in flex items-center space-x-2">
            <span>{showToast}</span>
          </div>
        )}

        {/* Delete Account Confirmation Modal Dialog */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 z-40 bg-slate-950/85 backdrop-blur-sm p-6 flex flex-col justify-center items-center text-center animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4 border border-rose-500/20">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white mb-1">
              Delete Account &amp; Data?
            </h3>
            <p className="text-xs text-slate-300 mb-6 max-w-xs leading-relaxed">
              This will permanently erase your login session, saved addresses, and local preferences under the Digital Personal Data Protection (DPDP) Act. This action cannot be undone.
            </p>
            <div className="flex space-x-3 w-full max-w-xs">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-md transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
