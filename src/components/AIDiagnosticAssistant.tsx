import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Flame,
  Check,
  X,
  PhoneCall
} from 'lucide-react';
import { ThemeMode } from '../types';
import { sound } from '../utils/soundEffects';

interface AIProblemQuizProps {
  theme: ThemeMode;
  onBookService: (serviceCategory: string, tierName?: string) => void;
  onOpenSOS?: () => void;
}

interface DiagnosisResult {
  title: string;
  category: string;
  serviceKeyword: string;
  severity: 'EMERGENCY' | 'URGENT' | 'STANDARD';
  urgencyDesc: string;
  typicalCost: number;
  eta: string;
  causes: string[];
  recommendedFix: string;
}

const COMMON_ISSUES = [
  { id: 'battery', icon: '⚡', label: 'Car Won’t Start / Clicking Sound', tag: 'Automotive' },
  { id: 'tyre', icon: '🛞', label: 'Flat Tyre / Highway Puncture', tag: 'Roadside' },
  { id: 'ac', icon: '❄️', label: 'AC Blowing Warm Air / Bad Odor', tag: 'Cooling' },
  { id: 'driver', icon: '👨‍✈️', label: 'Need Chauffeur / Driver Right Now', tag: 'Mobility' },
  { id: 'pipe', icon: '🚰', label: 'Water Pipe Burst / Pump Tripping', tag: 'Plumbing' },
  { id: 'mcb', icon: '🔌', label: 'Main MCB / Inverter Sparking', tag: 'Electrical' },
  { id: 'drain', icon: '🧹', label: 'Drainage Clogged / Tank Cleaning', tag: 'Sanitation' },
  { id: 'washer', icon: '🧺', label: 'Washing Machine Drum Not Spinning', tag: 'Appliance' }
];

export const AIDiagnosticAssistant: React.FC<AIProblemQuizProps> = ({
  theme,
  onBookService,
  onOpenSOS
}) => {
  const isDark = theme === 'dark';
  const [selectedIssueId, setSelectedIssueId] = useState<string>('battery');
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<'prompt' | 'result'>('result');

  const getDiagnosis = (id: string): DiagnosisResult => {
    switch (id) {
      case 'battery':
        return {
          title: 'Car Battery Discharge or Alternator Relay Failure',
          category: 'Mechanic & Roadside Assistance',
          serviceKeyword: 'Mechanic',
          severity: 'URGENT',
          urgencyDesc: '15-20 Min Doorstep Jumpstart with Alternator Health Calibration',
          typicalCost: 199,
          eta: '18 Mins',
          causes: [
            'Headlights or dashcam left on overnight',
            'Sub-11.8V battery terminal oxidation',
            'Alternator diode circuit degradation'
          ],
          recommendedFix: 'Doorstep 12V Heavy Booster Clamp Jumpstart + Digital Voltmeter Test'
        };
      case 'tyre':
        return {
          title: 'Tubeless Tyre Penetration / Valve Stem Blowout',
          category: 'Mechanic & Roadside Assistance',
          serviceKeyword: 'Mechanic',
          severity: 'EMERGENCY',
          urgencyDesc: 'Immediate Highway Rescue with Hydraulic 2-Ton Lift',
          typicalCost: 199,
          eta: '15 Mins',
          causes: [
            'Road debris / nail puncture in tread groove',
            'Alloy rim bead seal leak',
            'Cracked rubber Schrader valve'
          ],
          recommendedFix: 'Onsite Hydraulic Jack Lift + Mushroom Plug Vulcanization'
        };
      case 'ac':
        return {
          title: 'Refrigerant Depletion or Condenser Fin Clogging',
          category: 'Appliance Care & Servicing',
          serviceKeyword: 'AC Repair',
          severity: 'STANDARD',
          urgencyDesc: 'High-Pressure Antibacterial Foam Jet Service',
          typicalCost: 499,
          eta: '35 Mins',
          causes: [
            'Monsoon moisture accumulation on cooling coil',
            'R32/R410A micro copper pipe flare nut leak',
            'Blower wheel motor capacitor weakness'
          ],
          recommendedFix: 'Foam Jet Deep Washing + Manifold Pressure Check'
        };
      case 'driver':
        return {
          title: 'Immediate Chauffeur / Acting Driver Dispatch',
          category: 'Driver',
          serviceKeyword: 'Driver',
          severity: 'URGENT',
          urgencyDesc: 'Police-Verified 5-Star LMV Chauffeur for Manual & Auto Cars',
          typicalCost: 250,
          eta: '20 Mins',
          causes: [
            'Fatigue, medical checkup or hospital transit',
            'Night highway driving / party commute',
            'Outstation Kerala trip or airport run'
          ],
          recommendedFix: 'Hourly Acting Chauffeur with 100% Damage Responsibility'
        };
      case 'pipe':
        return {
          title: 'Concealed Pipeline Joint Rupture or Pressure Surge',
          category: 'Plumbing & Water Management',
          serviceKeyword: 'Plumber',
          severity: 'EMERGENCY',
          urgencyDesc: 'Zero-Wastage Acoustic Leak Locator Dispatch',
          typicalCost: 249,
          eta: '25 Mins',
          causes: [
            'Overhead tank automatic float switch failure',
            'CPVC threaded brass elbow crack',
            'High hydraulic motor water hammer'
          ],
          recommendedFix: 'Emergency Water Isolation + Solvent Cement Joint Re-weld'
        };
      case 'mcb':
        return {
          title: 'Short Circuit Neutral Fault or Inverter Overload',
          category: 'Electrical Services',
          serviceKeyword: 'Electrician',
          severity: 'EMERGENCY',
          urgencyDesc: 'Monsoon Earth Leakage Inspection & Bypassing',
          typicalCost: 199,
          eta: '20 Mins',
          causes: [
            'Monsoon dampness inside outdoor junction box',
            'Burnt copper connector on C-curve MCB',
            'Pure sine wave inverter battery terminal sulfation'
          ],
          recommendedFix: 'Phase Load Balancing + Diagnostic Visor Replacement'
        };
      case 'drain':
        return {
          title: 'Drainage Conduit Siltation & Grease Sediment',
          category: 'Deep Cleaning & Housekeeping',
          serviceKeyword: 'Cleaning',
          severity: 'STANDARD',
          urgencyDesc: 'Rotary Drain Cable Unclogging & Bio-Enzymatic Flush',
          typicalCost: 399,
          eta: '40 Mins',
          causes: [
            'Solidified grease trap buildup',
            'Sump trap hair & lint obstruction',
            'Tree root intrusion in PVC exit line'
          ],
          recommendedFix: 'Electric Drain Auger Rotary Clearance + Sump Degrease'
        };
      case 'washer':
      default:
        return {
          title: 'Motor Drive Belt Slippage or Drum Bearing Jam',
          category: 'Appliance Care & Servicing',
          serviceKeyword: 'Washing Machine',
          severity: 'STANDARD',
          urgencyDesc: 'Onsite Motor Torque & Drain Pump Inspection',
          typicalCost: 299,
          eta: '30 Mins',
          causes: [
            'Broken rubber V-belt under pulley',
            'Foreign coin jammed inside drainage impeller',
            'Main control PCB door latch error'
          ],
          recommendedFix: 'Doorstep Diagnostic + Genuine Manufacturer Spares Replacement'
        };
    }
  };

  const handleSelectIssue = (id: string) => {
    sound.playClick();
    setSelectedIssueId(id);
    setIsDiagnosing(true);
    setTimeout(() => {
      setIsDiagnosing(false);
      setActiveStep('result');
    }, 450);
  };

  const diagnosis = getDiagnosis(selectedIssueId);

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 border shadow-xl relative overflow-hidden transition-all ${
        isDark
          ? 'bg-gradient-to-br from-slate-900 via-slate-950 to-[#002820] border-teal-500/30 text-white'
          : 'bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/60 border-teal-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Background ambient decorative glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#004D40] text-teal-300 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
                AI SMART TRIAGE &amp; COST ESTIMATOR
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30">
                Instant Diagnosis
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight mt-0.5">
              What seems to be the problem?
            </h3>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-bold hidden sm:block">
          Select symptom • Get causes, pricing &amp; 15-min ETA
        </div>
      </div>

      {/* Interactive Symptom Carousel Pills */}
      <div className="pt-4 space-y-3">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none select-none">
          {COMMON_ISSUES.map((issue) => {
            const isSelected = selectedIssueId === issue.id;
            return (
              <button
                key={issue.id}
                onClick={() => handleSelectIssue(issue.id)}
                className={`px-3.5 py-2 rounded-2xl border text-xs font-black shrink-0 transition-all flex items-center space-x-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#004D40] text-white border-[#004D40] shadow-md shadow-teal-900/30 scale-[1.03]'
                    : isDark
                    ? 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-teal-500/40 hover:bg-slate-800'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50/50 shadow-xs'
                }`}
              >
                <span className="text-base">{issue.icon}</span>
                <span className="truncate max-w-[200px] sm:max-w-none">{issue.label}</span>
              </button>
            );
          })}
        </div>

        {/* Diagnosis Output Card */}
        {isDiagnosing ? (
          <div className="p-8 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col items-center justify-center space-y-3 animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
            <p className="text-xs font-bold text-teal-400">Analyzing symptoms &amp; matching verified pros...</p>
          </div>
        ) : (
          <div
            className={`p-4 sm:p-5 rounded-2xl border space-y-4 transition-all ${
              isDark
                ? 'bg-slate-950/70 border-slate-800'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            {/* Top Bar of Diagnosis */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    diagnosis.severity === 'EMERGENCY'
                      ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                      : diagnosis.severity === 'URGENT'
                      ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                      : 'bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/30'
                  }`}>
                    {diagnosis.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Category: <strong className="text-slate-700 dark:text-slate-200">{diagnosis.category}</strong>
                  </span>
                </div>
                <h4 className="text-base font-black mt-1 text-slate-900 dark:text-white">
                  {diagnosis.title}
                </h4>
              </div>

              {/* Price & ETA Badges */}
              <div className="flex items-center space-x-2 shrink-0">
                <div className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-300 text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Inspection Fee</span>
                  <span className="text-sm font-black">₹{diagnosis.typicalCost}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Arrival</span>
                  <span className="text-sm font-black">⚡ {diagnosis.eta}</span>
                </div>
              </div>
            </div>

            {/* Root Causes Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Likely Root Causes
                </span>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  {diagnosis.causes.map((c, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-teal-500 font-bold shrink-0">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Recommended Solution
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 space-y-1">
                  <p className="font-bold flex items-center space-x-1 text-teal-600 dark:text-teal-400">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{diagnosis.recommendedFix}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    100% damage responsibility guaranteed. Full 4-angle pre-inspection photos before pro touches anything.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>₹0 advance payment • Pay via UPI/Cash only after work inspection</span>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                {diagnosis.severity === 'EMERGENCY' && onOpenSOS && (
                  <button
                    onClick={() => {
                      sound.playChime();
                      onOpenSOS();
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>SOS Dispatch</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    sound.playClick();
                    onBookService(diagnosis.category, diagnosis.title);
                  }}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-[#004D40] hover:bg-teal-700 text-white text-xs font-black shadow-md flex items-center justify-center space-x-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>Book {diagnosis.serviceKeyword} Fix</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
