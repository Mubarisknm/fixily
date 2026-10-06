import React from 'react';
import { FileText, X, Printer, Share2, Download, ShieldCheck, CheckCircle2, MessageSquare } from 'lucide-react';
import { BookingJob, ThemeMode } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: BookingJob;
  theme: ThemeMode;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  job,
  theme
}) => {
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const invoiceNumber = job.invoiceId || `INV-KL-2026-${job.id.replace(/\D/g, '').padStart(4, '0')}`;
  const invoiceDate = new Date(job.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = `*Fykso Kerala Service Invoice - ${invoiceNumber}*%0A*Service:* ${job.serviceTitle}%0A*Total Amount:* ₹${job.pricing.totalPaid}%0A*Status:* Completed & Verified%0A*Provider:* ${job.assignedPartnerName || 'Fykso Verified Pro'}%0A%0AThank you for choosing Fykso!`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className={`relative w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 overflow-y-auto max-h-[90vh] transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Actions bar at top */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 print:hidden">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-lg">
              Official Tax Receipt
            </span>
            <span className="text-xs font-bold text-slate-400">#{invoiceNumber}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center space-x-1"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1"
              title="Share on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document */}
        <div className="mt-6 space-y-6 text-xs" id="printable-invoice">
          
          {/* Company & Invoice Meta */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black text-blue-600">Fykso</span>
                <span className="text-xs font-extrabold uppercase text-slate-400">Kerala</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Fykso On-Demand Technologies Pvt Ltd<br />
                Carnival Infopark Phase II, Kakkanad<br />
                Kochi, Kerala — 682030<br />
                GSTIN: 32AABCF8912K1Z9
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="text-base font-black">INVOICE &amp; RECEIPT</div>
              <div className="text-slate-400">Invoice No: <strong>{invoiceNumber}</strong></div>
              <div className="text-slate-400">Date: <strong>{invoiceDate}</strong></div>
              <div className="text-slate-400">Payment: <strong>{job.paymentStatus === 'PAID_UPI' ? 'Paid via UPI' : 'Paid in Cash / COD'}</strong></div>
            </div>
          </div>

          {/* Billed To & Service Pro Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                Customer Details
              </span>
              <div className="font-extrabold text-sm">{job.customerName}</div>
              <div className="text-slate-400 mt-0.5">{job.customerPhone}</div>
              <div className="text-slate-400 mt-0.5 line-clamp-1">{job.location.address}</div>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">
                Service Professional
              </span>
              <div className="font-extrabold text-sm flex items-center space-x-1">
                <span>{job.assignedPartnerName || 'Fykso Certified Freelance Pro'}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-blue-600 dark:text-blue-400 font-semibold text-[11px] mt-0.5">
                ✓ PCC Document Checked by Fykso
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                Completion OTP: <strong>Verified</strong>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-[11px] font-black text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-3">Service Description</th>
                  <th className="p-3 text-right">Rate</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr>
                  <td className="p-3">
                    <div className="font-bold">{job.serviceTitle}</div>
                    <div className="text-[10px] text-slate-400">Tier: {job.tierName} • Doorstep visit</div>
                  </td>
                  <td className="p-3 text-right">₹{job.pricing.baseFare}</td>
                  <td className="p-3 text-right font-bold">₹{job.pricing.baseFare}</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <div className="font-medium text-slate-500 dark:text-slate-400">Platform Convenience &amp; GPS Dispatch Fee</div>
                  </td>
                  <td className="p-3 text-right text-slate-400">₹{job.pricing.convenienceFee}</td>
                  <td className="p-3 text-right font-medium">₹{job.pricing.convenienceFee}</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <div className="font-medium text-slate-500 dark:text-slate-400">
                      ₹10,000 Micro-Insurance &amp; Damage Liability Shield
                    </div>
                  </td>
                  <td className="p-3 text-right text-slate-400">₹{job.pricing.microInsurance}</td>
                  <td className="p-3 text-right font-medium">₹{job.pricing.microInsurance}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-64 space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span>₹{job.pricing.totalPaid}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Applicable GST (18% inclusive):</span>
                <span>₹{(job.pricing.totalPaid * 0.18 / 1.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-black text-sm pt-2 border-t border-slate-200 dark:border-slate-800 text-blue-600 dark:text-blue-400">
                <span>Total Amount Paid:</span>
                <span>₹{job.pricing.totalPaid}</span>
              </div>
            </div>
          </div>

          {/* Trust Footer Note */}
          <div className="text-[11px] text-slate-400 text-center pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Customer Satisfaction Confirmed • 100% Damage Liability Guaranteed</span>
            </div>
            <p>
              This is a digitally generated tax invoice from Fykso Technologies Pvt Ltd. For dispute queries or warranty claims, contact grievance@fykso.in or call +91 484 290 1234.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
