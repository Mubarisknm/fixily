import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Gift,
  HelpCircle,
  PhoneCall,
  Check,
  Star
} from 'lucide-react';
import { ThemeMode } from '../types';
import { sound } from '../utils/soundEffects';

interface InteractiveFykziPerksProps {
  theme: ThemeMode;
  onExploreServices: () => void;
}

export const InteractiveFykziPerks: React.FC<InteractiveFykziPerksProps> = ({
  theme,
  onExploreServices
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'guarantee' | 'insurance' | 'pcc'>('guarantee');

  const handleTabClick = (tab: 'guarantee' | 'insurance' | 'pcc') => {
    sound.playClick();
    setActiveTab(tab);
  };

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 border shadow-sm space-y-4 transition-all ${
        isDark
          ? 'bg-slate-900/80 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-black">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black">
              Why 45,000+ Kerala Homes Trust Fykzi
            </h4>
            <p className="text-[11px] text-slate-400">
              Zero upfront risk • Transparent doorstep pricing • Police verified technicians
            </p>
          </div>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center space-x-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
          {[
            { id: 'guarantee', label: '100% Satisfaction' },
            { id: 'insurance', label: 'Dispute Free' },
            { id: 'pcc', label: 'PCC Police Verified' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabClick(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-[#004D40] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Tab Body */}
      {activeTab === 'guarantee' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xl">💰</span>
            <h5 className="font-black text-xs">₹0 Advance Deposit</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              No prepayment, card binding or deposit required. You only pay after job completion and physical test.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xl">🔐</span>
            <h5 className="font-black text-xs">4-Digit Security OTP</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Technician cannot mark job finished until you hand over the confidential 4-digit OTP from your screen.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xl">🔄</span>
            <h5 className="font-black text-xs">Free Rework Policy</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              If an unresolved issue recurs within 7 days, our verified supervisor revisits at zero consultation fee.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'insurance' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xl">📸</span>
            <h5 className="font-black text-xs">4-Angle Pre-Check</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Specialist photographs all 4 angles before starting to eliminate pre-existing damage blame games.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xl">🛡️</span>
            <h5 className="font-black text-xs">₹10,000 Damage Cover</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Comprehensive accidental transit and doorstep property protection backed by Fykzi resolution pool.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xl">⚖️</span>
            <h5 className="font-black text-xs">Neutral Mediation</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Escrow funds are held safely until disputes are investigated and verified by Kerala ops administrators.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'pcc' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xl">👮‍♂️</span>
            <h5 className="font-black text-xs">Kerala Police Thuna PCC</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every driver and mechanic uploads authentic Kerala Police Clearances renewed regularly.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xl">🪪</span>
            <h5 className="font-black text-xs">UIDAI Aadhaar Verified</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Identity, residential address and driving licenses are audited to keep your family safe.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xl">⭐</span>
            <h5 className="font-black text-xs">Minimum 4.7★ Rating</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Partners who drop below standards are temporarily suspended for mandatory skill retraining.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
