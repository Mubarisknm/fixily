import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, CheckCircle2, MessageSquare, Phone, ArrowRight, Camera } from 'lucide-react';
import { BookingJob, DisputeReport, ThemeMode, AppLanguage } from '../types';

interface DisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  job?: BookingJob | null;
  onSubmitDispute?: (report: DisputeReport) => void;
  onDisputeSubmitted?: () => void;
  theme: ThemeMode;
  language?: AppLanguage;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  isOpen,
  onClose,
  job,
  onSubmitDispute,
  onDisputeSubmitted,
  theme,
  language = 'en'
}) => {
  const isDark = theme === 'dark';

  const [issueType, setIssueType] = useState<DisputeReport['issueType']>('damage');
  const [description, setDescription] = useState<string>('');
  const [phone, setPhone] = useState<string>(job?.customerPhone || '+91 98950 12345');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketId = `DISP-KL-${Math.floor(1000 + Math.random() * 9000)}`;
    const report: DisputeReport = {
      id: ticketId,
      jobId: job?.id || 'DIRECT_COMPLAINT',
      serviceTitle: job?.serviceTitle || 'General Service Experience',
      customerPhone: phone,
      partnerName: job?.assignedPartnerName || 'Unassigned / Platform Pro',
      issueType,
      description,
      status: 'OPEN',
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedTicket(ticketId);
      if (onSubmitDispute) onSubmitDispute(report);
      if (onDisputeSubmitted) onDisputeSubmitted();
    }, 600);
  };

  const handleWhatsAppEscalation = () => {
    const text = `*Fykso Kerala Dispute Escalate - Ticket ${submittedTicket}*%0A%0A*Customer Phone:* ${phone}%0A*Issue Type:* ${issueType}%0A*Description:* ${encodeURIComponent(description)}%0A%0APlease hold partner payout and contact me for inspection.`;
    window.open(`https://wa.me/919895000112?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-lg">Report a Bad Experience / Dispute</h3>
              <p className="text-xs text-slate-400">100% Damage Liability &amp; Immediate Escrow Freeze</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmittedTicket(null);
              onClose();
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedTicket ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            
            <div>
              <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                Partner Escrow Hold Active
              </span>
              <h4 className="text-xl font-black mt-2">Dispute Ticket Filed: {submittedTicket}</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                We have registered your complaint. The partner's earnings for this job have been <strong>temporarily frozen in escrow</strong> pending review.
              </p>
            </div>

            <div className={`p-4 rounded-2xl border text-left text-xs space-y-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between">
                <span className="text-slate-400">Grievance Helpline:</span>
                <span className="font-black">+91 484 290 1234 (Kochi HQ)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Response SLA:</span>
                <span className="font-bold text-emerald-500">&lt; 2 Hours Resolution Call</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppEscalation}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Track on WhatsApp Helpline</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmittedTicket(null);
                  onClose();
                }}
                className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            
            {job && (
              <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between ${
                isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-blue-50/50 border-blue-200'
              }`}>
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Related Order:</span>
                  <strong className="text-blue-600 dark:text-blue-400">{job.serviceTitle} (#{job.id})</strong>
                </div>
                {job.assignedPartnerName && (
                  <span className="text-right text-[11px] font-semibold text-slate-400">
                    Pro: {job.assignedPartnerName}
                  </span>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Issue Category
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className={`w-full p-3 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value="damage">🛠️ Property or Vehicle Damage (Accidental)</option>
                <option value="overcharging">💰 Overcharging / Demanded Unagreed Cash</option>
                <option value="quality">⚠️ Incomplete or Substandard Workmanship</option>
                <option value="unprofessional">🚫 Rude, Disrespectful or Late Conduct</option>
                <option value="no_show">⏰ Provider Never Arrived (No-Show)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Explain What Happened
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the damage, fee discrepancy, or behavior so our Kochi trust officer can investigate..."
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Callback Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full p-3 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className={`p-3 rounded-2xl border text-[11px] leading-relaxed flex items-start space-x-2 ${
              isDark ? 'bg-rose-950/20 border-rose-900/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Fykso Escrow Protection:</strong> Submitting this dispute places a 24-hour administrative hold on the partner's payout and routes this ticket to our senior operations desk in Kochi.
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>{isSubmitting ? 'Submitting & Freezing Escrow...' : 'Submit Official Dispute & Escrow Hold'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
