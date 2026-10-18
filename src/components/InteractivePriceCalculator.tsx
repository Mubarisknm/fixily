import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  HelpCircle,
  Car,
  Droplets,
  Scissors
} from 'lucide-react';
import { ThemeMode, ServiceItem } from '../types';
import { sound } from '../utils/soundEffects';

interface ProblemPreset {
  id: string;
  category: string;
  title: string;
  shortDesc: string;
  icon: string;
  diagnosticFee: number;
  estArrivalMins: string;
  includes: string[];
  vehicleOrItem: string;
}

const PRESET_ISSUES: ProblemPreset[] = [
  {
    id: 'p-battery',
    category: 'Mechanic & Roadside Assistance',
    title: 'Car Battery Jumpstart / Dead',
    shortDesc: 'Heavy-duty 12V/24V booster cables + alternator volt check',
    icon: '⚡',
    diagnosticFee: 199,
    estArrivalMins: '15-20 Mins',
    includes: ['Doorstep alternator voltage test', 'Industrial jumpstart clamp cable', 'Terminal corrosion cleaning'],
    vehicleOrItem: 'Hatchback, Sedan & SUV'
  },
  {
    id: 'p-tyre',
    category: 'Mechanic & Roadside Assistance',
    title: 'Flat Tyre / Stepney Swap',
    shortDesc: 'Hydraulic jack lifting, puncture plug or stepney installation',
    icon: '🛞',
    diagnosticFee: 199,
    estArrivalMins: '15-20 Mins',
    includes: ['Hydraulic jack torque assist', 'Tubeless puncture plug sealing', 'Digital tyre PSI pressure calibration'],
    vehicleOrItem: '2-Wheeler & 4-Wheeler'
  },
  {
    id: 'p-driver',
    category: 'Driver',
    title: 'Private Acting Driver (Hourly)',
    shortDesc: 'Background-verified chauffeur for city traffic, shopping or outstation',
    icon: '👨‍✈️',
    diagnosticFee: 250,
    estArrivalMins: '20-25 Mins',
    includes: ['Manual & Automatic gear expertise', 'Police PCC verified chauffeur', 'Night highway & ghat road driving'],
    vehicleOrItem: 'All Car Models'
  },
  {
    id: 'p-ac',
    category: 'Appliance Care & Servicing',
    title: 'AC Cooling Failure / Gas Check',
    shortDesc: 'Split/Inverter AC refrigerant pressure test, coil cleaning & fan repair',
    icon: '❄️',
    diagnosticFee: 299,
    estArrivalMins: '30 Mins',
    includes: ['Digital manifold gas pressure test', 'Filter & blower jet wash check', 'Capacitor & PCB inspection'],
    vehicleOrItem: '1 Ton to 2.5 Ton AC'
  },
  {
    id: 'p-pipe',
    category: 'Plumbing & Water Management',
    title: 'Emergency Pipe Burst / Blockage',
    shortDesc: 'Underground conduit leak detection, PVC joint welding & pressure motor',
    icon: '🚰',
    diagnosticFee: 249,
    estArrivalMins: '25 Mins',
    includes: ['Concealed pipe leak localization', 'Tap & mixer spindle replacement', 'Zero water wastage repair'],
    vehicleOrItem: 'Kitchen, Bathroom & Tank'
  },
  {
    id: 'p-electrical',
    category: 'Electrical Services',
    title: 'Main MCB Trip / Short Circuit',
    shortDesc: 'Inverter failure, phase missing or burnt fuse diagnostic',
    icon: '🔌',
    diagnosticFee: 199,
    estArrivalMins: '20 Mins',
    includes: ['Phase tester circuit analysis', 'Inverter battery bypass test', 'Fire hazard safety check'],
    vehicleOrItem: 'Single & 3-Phase Home'
  }
];

interface InteractivePriceCalculatorProps {
  theme: ThemeMode;
  onBookIssue: (issue: ProblemPreset) => void;
}

export const InteractivePriceCalculator: React.FC<InteractivePriceCalculatorProps> = ({
  theme,
  onBookIssue
}) => {
  const isDark = theme === 'dark';
  const [selectedIssueId, setSelectedIssueId] = useState<string>('p-battery');

  const currentIssue = PRESET_ISSUES.find((p) => p.id === selectedIssueId) || PRESET_ISSUES[0];

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 border shadow-lg relative overflow-hidden transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.06)]'
      }`}
    >
      {/* Background ambient glow circle */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded-lg bg-teal-500/20 text-teal-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400">
              TRANSPARENT TARIFF ESTIMATOR
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
            Instant Diagnostic Rate & ETA Calculator
          </h3>
        </div>
        <div className="flex items-center space-x-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>₹0 Advance • Pay After Inspection</span>
        </div>
      </div>

      {/* Interactive Issue Selectors (Scrollable Chips) */}
      <div className="relative z-10 mb-5">
        <label className="block text-[11px] font-bold text-slate-400 mb-2">
          Select What Needs Fixing:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {PRESET_ISSUES.map((issue) => {
            const isSelected = issue.id === selectedIssueId;
            return (
              <button
                key={issue.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedIssueId(issue.id);
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#004D40] to-teal-800 text-white border-teal-400 shadow-md scale-[1.02]'
                    : isDark
                    ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{issue.icon}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                  )}
                </div>
                <span className="text-[11px] font-black leading-snug line-clamp-2">
                  {issue.title.split('/')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Calculated Estimate Panel */}
      <div
        className={`relative z-10 rounded-2xl p-4 sm:p-5 border flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 ${
          isDark
            ? 'bg-slate-950/80 border-slate-800/90'
            : 'bg-gradient-to-r from-teal-50/80 via-white to-blue-50/60 border-teal-100'
        }`}
      >
        {/* Left: Summary & Included Specs */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl">{currentIssue.icon}</span>
            <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {currentIssue.title}
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
            {currentIssue.shortDesc}
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {currentIssue.includes.map((inc, i) => (
              <span
                key={i}
                className="inline-flex items-center space-x-1 text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-lg border border-teal-500/20"
              >
                <CheckCircle2 className="w-3 h-3 text-teal-500" />
                <span>{inc}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Price & 1-Click Dispatch Action */}
        <div
          className={`shrink-0 flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l pt-3 md:pt-0 md:pl-5 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          <div className="text-left md:text-right">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Doorstep Diagnosis
            </span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">
                ₹{currentIssue.diagnosticFee}
              </span>
              <span className="text-[11px] font-bold text-slate-400">Flat</span>
            </div>
            <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-500 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>ETA: {currentIssue.estArrivalMins}</span>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playChime();
              onBookIssue(currentIssue);
            }}
            className="mt-0 md:mt-3 px-5 py-2.5 rounded-xl bg-[#004D40] hover:bg-teal-700 text-white font-black text-xs shadow-md flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Book In 60s</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
