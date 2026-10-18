import React from 'react';
import { Siren, Shield, Radio, Navigation, PhoneCall, Zap, Compass, MapPin } from 'lucide-react';
import { ThemeMode, KochiLocation } from '../types';
import { sound } from '../utils/soundEffects';

interface LiveFleetRadarProps {
  theme: ThemeMode;
  selectedLocation: KochiLocation;
  onOpenEmergency: () => void;
  activeSpecialistsCount?: number;
}

export const LiveFleetRadar: React.FC<LiveFleetRadarProps> = ({
  theme,
  selectedLocation,
  onOpenEmergency,
  activeSpecialistsCount = 18
}) => {
  const isDark = theme === 'dark';
  const cleanLocName = selectedLocation.name.replace(/^Live:\s*/i, '').replace(/\s*Area$/i, '').split('(')[0].trim();

  return (
    <div
      className={`rounded-3xl p-5 sm:p-6 border shadow-lg relative overflow-hidden transition-all ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-slate-800 text-white'
          : 'bg-gradient-to-br from-slate-900 via-slate-850 to-teal-950 text-white border-slate-700 shadow-xl'
      }`}
    >
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Live Radar Visual */}
        <div className="flex items-center space-x-5 w-full md:w-auto">
          <div
            onClick={() => sound.playRadarPing()}
            title="Click to ping active specialists"
            className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center cursor-pointer group"
          >
            {/* Outer rings */}
            <div className="absolute inset-0 rounded-full border border-teal-500/30 group-hover:border-teal-400 transition-colors" />
            <div className="absolute inset-2 rounded-full border border-teal-500/20" />
            <div className="absolute inset-6 rounded-full border border-teal-500/20" />

            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-teal-500/20" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-teal-500/20" />

            {/* Rotating Radar Sweep Beam */}
            <div className="absolute inset-0 rounded-full overflow-hidden animate-radar-sweep pointer-events-none">
              <div
                className="w-1/2 h-1/2 origin-bottom-right"
                style={{
                  background: 'linear-gradient(45deg, rgba(20, 184, 166, 0.45), transparent)'
                }}
              />
            </div>

            {/* Radar Center Pin */}
            <div className="relative z-10 w-3 h-3 rounded-full bg-teal-400 shadow-[0_0_12px_#2dd4bf] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            {/* Pinging Specialist Blips */}
            <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-80" />
            <div className="absolute top-4 left-6 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />

            <div className="absolute bottom-5 right-5 w-2 h-2 rounded-full bg-blue-400 animate-ping opacity-75" />
            <div className="absolute bottom-5 right-5 w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />

            <div className="absolute bottom-7 left-5 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
            <div className="absolute top-6 right-7 w-1.5 h-1.5 rounded-full bg-teal-300 shadow-[0_0_6px_#5eead4]" />
          </div>

          {/* Radar Info Text */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 flex items-center space-x-1">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>KERALA RAPID FLEET RADAR</span>
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
              {activeSpecialistsCount} Verified Specialists Active
            </h4>
            <p className="text-xs text-slate-300 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
              <span>Patrolling near <strong>{cleanLocName}</strong> (~14 min avg ETA)</span>
            </p>
          </div>
        </div>

        {/* Right: Quick SOS Emergency Dispatch Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
          <div className="text-left sm:text-right hidden sm:block">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              24/7 Breakdown Dispatch
            </span>
            <span className="text-xs font-black text-amber-300">
              Zero Advance Required
            </span>
          </div>

          <button
            onClick={() => {
              sound.playSosAlert();
              onOpenEmergency();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs shadow-lg shadow-red-900/40 flex items-center justify-center space-x-2 transition-all hover:scale-105 active:scale-95 cursor-pointer animate-sos-ring"
          >
            <Siren className="w-4 h-4 animate-bounce" />
            <span>1-TAP EMERGENCY SOS</span>
          </button>
        </div>
      </div>
    </div>
  );
};
