import React from 'react';
import { Zap, ShieldCheck, Clock, MapPin, Activity, Flame, AlertTriangle } from 'lucide-react';
import { ThemeMode } from '../types';

interface LiveDispatchTickerProps {
  theme: ThemeMode;
  currentDistrict?: string;
  onSelectService?: (serviceKeyword: string) => void;
}

const LIVE_DISPATCHES = [
  {
    id: 'd1',
    area: 'Edappally Toll',
    service: 'Car Battery Jumpstart',
    time: '8m ago',
    badge: '14 Min ETA',
    icon: '⚡',
    specialist: 'Vineeth K. (Auto Electrician)'
  },
  {
    id: 'd2',
    area: 'Kakkanad InfoPark',
    service: 'Night Acting Driver',
    time: '12m ago',
    badge: 'Verified Chauffeur',
    icon: '👨‍✈️',
    specialist: 'Anoop R. (5-Star Driver)'
  },
  {
    id: 'd3',
    area: 'Vyttila Mobility Hub',
    service: 'High-Pressure Pipe Leakage',
    time: '15m ago',
    badge: 'Emergency Repair',
    icon: '🚰',
    specialist: 'Manoj P. (Licensed Plumber)'
  },
  {
    id: 'd4',
    area: 'Fort Kochi Beach Rd',
    service: 'Bike Chain & Puncture Rescue',
    time: '19m ago',
    badge: 'Spot Rescue',
    icon: '🏍️',
    specialist: 'Shaji M. (Mobile Mechanic)'
  },
  {
    id: 'd5',
    area: 'Palarivattom Bypass',
    service: 'Inverter AC Jet Foam Cleaning',
    time: '24m ago',
    badge: 'Same-Day Service',
    icon: '❄️',
    specialist: 'Nikhil T. (HVAC Specialist)'
  },
  {
    id: 'd6',
    area: 'Aluva Metro Corridor',
    service: 'Distribution Board MCB Trip Fix',
    time: '28m ago',
    badge: 'PCC Verified Pro',
    icon: '⚡',
    specialist: 'Suresh Kumar (Electrician)'
  }
];

export const LiveDispatchTicker: React.FC<LiveDispatchTickerProps> = ({
  theme,
  currentDistrict = 'Ernakulam',
  onSelectService
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border backdrop-blur-md select-none transition-all ${
        isDark
          ? 'bg-slate-950/80 border-slate-800/80 text-slate-200'
          : 'bg-white/90 border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <div className="flex items-center">
        {/* Left Status Badge Pill */}
        <div
          className={`shrink-0 z-10 px-3 py-2 flex items-center space-x-1.5 border-r font-black text-[10px] uppercase tracking-wider ${
            isDark
              ? 'bg-emerald-950/60 border-slate-800 text-emerald-400'
              : 'bg-emerald-50 border-slate-200 text-emerald-700'
          }`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline">KERALA LIVE DISPATCH</span>
          <span className="sm:hidden">LIVE</span>
        </div>

        {/* Marquee Content */}
        <div className="overflow-hidden flex-1 relative py-1.5">
          <div className="animate-ticker-marquee flex items-center space-x-8 text-xs font-semibold whitespace-nowrap pl-4">
            {/* Duplicated list to create infinite marquee effect */}
            {[...LIVE_DISPATCHES, ...LIVE_DISPATCHES].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                onClick={() => onSelectService && onSelectService(item.service)}
                className="flex items-center space-x-2 shrink-0 cursor-pointer hover:text-teal-400 transition-colors group"
                title={`Click to find ${item.service} specialist`}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="font-black text-slate-900 dark:text-white group-hover:underline">
                  {item.area}:
                </span>
                <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  {item.service}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isDark
                      ? 'bg-teal-950/80 border border-teal-800/60 text-teal-300'
                      : 'bg-teal-50 border border-teal-200 text-teal-700'
                  }`}
                >
                  {item.badge}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">({item.time})</span>
                <span className="text-slate-500 text-[10px] mx-1">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
