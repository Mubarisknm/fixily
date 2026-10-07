import React from 'react';
import { ShieldCheck, X, CheckCircle2, Clock, AlertTriangle, ArrowRight, RefreshCw, FileText } from 'lucide-react';
import { ThemeMode, AppLanguage } from '../types';
import { useTranslation } from '../utils/translations';

interface CancellationPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDispute?: () => void;
  theme: ThemeMode;
  language?: AppLanguage;
}

export const CancellationPolicyModal: React.FC<CancellationPolicyModalProps> = ({
  isOpen,
  onClose,
  onOpenDispute,
  theme,
  language = 'en'
}) => {
  const { t } = useTranslation(language);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg">Fykzi Kerala Trust Charter</h3>
              <p className="text-xs text-slate-400">Cancellation, Refund &amp; Damage Liability Policies</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Policy Highlights */}
        <div className="mt-5 space-y-4 text-xs leading-relaxed">
          
          {/* 1. Cancellation Policy */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black text-sm mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <h4>1. 100% Free Cancellation Before Dispatch</h4>
            </div>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              You can cancel any booking at zero cost at any time before the service professional departs. If you already made an online payment, a 100% refund is initiated instantly.
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              • If cancelled after the provider is en route (&gt;10 mins into transit), a nominal ₹50 travel compensation is deducted to respect the partner's fuel expenses.
            </p>
          </div>

          {/* 2. Refund Timeline */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-black text-sm mb-2">
              <RefreshCw className="w-4 h-4" />
              <h4>2. Instant UPI &amp; Bank Refund Timeline</h4>
            </div>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              UPI payments (Google Pay, PhonePe, Paytm) are credited back to your original VPA within <strong>2 to 4 hours</strong>. Card and NetBanking reversals are processed per RBI guidelines within 2-3 business days.
            </p>
          </div>

          {/* 3. Upfront Pricing & Zero Hidden Charges */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-black text-sm mb-2">
              <Clock className="w-4 h-4" />
              <h4>3. Upfront Price Quotes &amp; Pay-After-Service</h4>
            </div>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              The provider will inspect the problem and give you a written estimate before starting work. If spare parts are needed, they are billed strictly at actual MRP with GST bill. 
              <strong>You only pay after inspecting the completed service.</strong>
            </p>
          </div>

          {/* 4. Damage Liability & Escrow Hold */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-black text-sm mb-2">
              <AlertTriangle className="w-4 h-4" />
              <h4>4. 100% Damage Liability &amp; 24-Hour Dispute Hold</h4>
            </div>
            <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>
              All verified Fykzi gig partners sign a mandatory damage liability contract. Furthermore, partner earnings are placed on a <strong>24-hour safety escrow hold</strong>. If any accidental damage or poor service occurs, report it immediately to pause payouts and request compensation up to ₹10,000.
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onOpenDispute && (
            <button
              onClick={() => {
                onClose();
                onOpenDispute();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-rose-500/40 text-rose-500 hover:bg-rose-500/10 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report a Bad Experience</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-md transition-all cursor-pointer"
          >
            Understood &amp; Close
          </button>
        </div>

      </div>
    </div>
  );
};
