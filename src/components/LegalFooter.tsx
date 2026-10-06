import React, { useState } from 'react';
import { ShieldCheck, Phone, Mail, MapPin, MessageSquare, Lock, Heart, FileText, CheckCircle2, X } from 'lucide-react';
import { ThemeMode, AppLanguage } from '../types';
import { useTranslation } from '../utils/translations';

interface LegalFooterProps {
  theme: ThemeMode;
  language: AppLanguage;
  onOpenCancellationPolicy: () => void;
  onOpenPartnerLogin: () => void;
  onOpenAdminLogin: () => void;
}

export const LegalFooter: React.FC<LegalFooterProps> = ({
  theme,
  language,
  onOpenCancellationPolicy,
  onOpenPartnerLogin,
  onOpenAdminLogin
}) => {
  const { t } = useTranslation(language);
  const isDark = theme === 'dark';

  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | null>(null);

  return (
    <>
      <footer className={`border-t py-12 transition-colors duration-200 ${
        isDark ? 'bg-slate-950 border-slate-900 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Main Footer Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Col 1: Brand & Kerala Trust */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black text-blue-600">Fykso</span>
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Kerala
                </span>
              </div>
              <p className="text-xs leading-relaxed">
                Kerala's premier doorstep service platform. Certified freelance specialists with police clearance (PCC) documents checked by Fykso and 100% damage liability guarantee.
              </p>
              <div className="flex items-center space-x-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>DPDP Act 2023 Compliant Platform</span>
              </div>
            </div>

            {/* Col 2: Consumer Protection & Policies */}
            <div className="space-y-3">
              <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Consumer Protection
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={onOpenCancellationPolicy}
                    className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                  >
                    • Cancellation &amp; Refund Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('terms')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                  >
                    • Terms of Service &amp; Damage Liability
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('privacy')}
                    className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                  >
                    • Privacy Policy (DPDP &amp; Aadhaar Masking)
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenCancellationPolicy}
                    className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                  >
                    • 24-Hour Dispute Hold &amp; Escrow
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Contact & Grievance Redressal */}
            <div className="space-y-3">
              <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Contact &amp; Grievance
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Phase II, Carnival Infopark, Kakkanad, Kochi, Kerala — 682030</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                  <a href="tel:+914842901234" className="hover:underline font-bold">
                    +91 484 290 1234 (Kochi HQ)
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <a href="https://wa.me/919895000112" target="_blank" rel="noreferrer" className="hover:underline font-bold text-emerald-600 dark:text-emerald-400">
                    WhatsApp: +91 98950 00112
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>grievance@fykso.in (Grievance Officer: Deepa Nair)</span>
                </div>
              </div>
            </div>

            {/* Col 4: Portals & Access Control */}
            <div className="space-y-3">
              <h4 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Professional Portals
              </h4>
              <p className="text-[11px] leading-relaxed">
                Protected role-based workspaces for certified partners and Kerala operations.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  onClick={onOpenPartnerLogin}
                  className="w-full py-2 px-3 rounded-xl border border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 font-bold text-xs transition-colors flex items-center justify-between"
                >
                  <span>Gig Partner Portal</span>
                  <Lock className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={onOpenAdminLogin}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 font-bold text-xs transition-colors flex items-center justify-between"
                >
                  <span>Admin Operations</span>
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} Fykso Technologies Pvt Ltd. All rights reserved. • Built for Kerala.
            </div>

            <div className="flex items-center space-x-4 text-[11px]">
              <span>GSTIN: 32AABCF8912K1Z9</span>
              <span>•</span>
              <span>Kerala Police PCC Checked</span>
              <span>•</span>
              <span>RBI DPDP Compliant</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-lg">Fykso Privacy Policy &amp; DPDP Act Compliance</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300 dark:text-slate-300">
              <h4 className="font-bold text-white text-sm">1. Digital Personal Data Protection (DPDP) Act 2023</h4>
              <p>
                Fykso strictly operates as a Data Fiduciary under India's DPDP Act 2023. We collect only minimal customer data required to dispatch and complete doorstep services.
              </p>

              <h4 className="font-bold text-white text-sm">2. Mandatory Aadhaar Masking</h4>
              <p>
                In compliance with UIDAI regulations and the DPDP Act, Fykso never stores raw Aadhaar numbers. All partner Aadhaar documents are masked (showing only the last 4 digits: e.g. •••• •••• 9012) and stored in encrypted vaults.
              </p>

              <h4 className="font-bold text-white text-sm">3. Customer Privacy &amp; Anti-Burglary Protection</h4>
              <p>
                To protect customer safety, unaccepted jobs in the Partner App never display full customer names, vehicle registration numbers, or exact house numbers. Furthermore, homes are never labeled as "vacant" or "NRI" to eliminate burglary risks.
              </p>

              <h4 className="font-bold text-white text-sm">4. Masked Calling &amp; Data Deletion</h4>
              <p>
                Phone numbers are connected through masked relays. You may request permanent deletion of your account and service records at any time by emailing grievance@fykso.in.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-lg">Terms of Service &amp; 100% Damage Liability</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300 dark:text-slate-300">
              <h4 className="font-bold text-white text-sm">1. Service Provider Relationship</h4>
              <p>
                Fykso connects independent freelance service professionals with customers across Kerala. All registered professionals undergo Police Clearance Certificate (PCC) verification checks and skill validation.
              </p>

              <h4 className="font-bold text-white text-sm">2. 100% Damage Liability Guarantee</h4>
              <p>
                All providers contractually agree to full liability for accidental damage caused during service execution. Fykso holds partner earnings in a 24-hour safety escrow and provides damage claims coverage up to ₹10,000.
              </p>

              <h4 className="font-bold text-white text-sm">3. Customer Completion OTP Protection</h4>
              <p>
                A service is only marked complete when the customer shares their 4-digit Completion OTP after inspecting the finished work. Never share your OTP if you are unsatisfied.
              </p>

              <h4 className="font-bold text-white text-sm">4. Jurisdiction</h4>
              <p>
                Any legal disputes shall be subject to the exclusive jurisdiction of the competent courts in Ernakulam/Kochi, Kerala.
              </p>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
