import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Monitor,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Wifi,
  Signal,
  BatteryCharging,
  Sparkles,
  ChevronDown,
  Info
} from 'lucide-react';
import { ThemeMode, AppLanguage } from '../types';

export type DeviceModel = 'iphone16pro' | 'galaxys24' | 'pixel9pro' | 'compact';

interface DeviceSpec {
  id: DeviceModel;
  name: string;
  width: number;
  height: number;
  bezelRadius: string;
  screenRadius: string;
  notchType: 'island' | 'punchhole' | 'compact';
}

const DEVICE_SPECS: Record<DeviceModel, DeviceSpec> = {
  iphone16pro: {
    id: 'iphone16pro',
    name: 'iPhone 16 Pro',
    width: 393,
    height: 852,
    bezelRadius: 'rounded-[52px]',
    screenRadius: 'rounded-[44px]',
    notchType: 'island'
  },
  galaxys24: {
    id: 'galaxys24',
    name: 'Galaxy S24',
    width: 384,
    height: 832,
    bezelRadius: 'rounded-[46px]',
    screenRadius: 'rounded-[38px]',
    notchType: 'punchhole'
  },
  pixel9pro: {
    id: 'pixel9pro',
    name: 'Pixel 9 Pro',
    width: 412,
    height: 892,
    bezelRadius: 'rounded-[48px]',
    screenRadius: 'rounded-[40px]',
    notchType: 'punchhole'
  },
  compact: {
    id: 'compact',
    name: 'Compact SE',
    width: 375,
    height: 667,
    bezelRadius: 'rounded-[40px]',
    screenRadius: 'rounded-[32px]',
    notchType: 'compact'
  }
};

interface MobilePhoneSimulatorProps {
  children: React.ReactNode;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  theme: ThemeMode;
  language: AppLanguage;
}

export const MobilePhoneSimulator: React.FC<MobilePhoneSimulatorProps> = ({
  children,
  isEnabled,
  onToggleEnabled,
  theme,
  language
}) => {
  const isDark = theme === 'dark';
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel>('iphone16pro');
  const [zoomScale, setZoomScale] = useState<number>(0.92);
  const [currentTime, setCurrentTime] = useState<string>('9:41');
  const [islandExpanded, setIslandExpanded] = useState<boolean>(false);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth <= 768 : false;
  });

  // Keep track of real viewport size
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update clock every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours % 12 || 12}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  // If phone view is disabled OR we are already on a mobile screen, render children normally
  if (!isEnabled || isMobileScreen) {
    return <>{children}</>;
  }

  const spec = DEVICE_SPECS[selectedDevice];

  return (
    <div className={`min-h-screen py-6 px-4 flex flex-col items-center justify-start transition-colors duration-300 ${
      isDark
        ? 'bg-slate-950 text-white'
        : 'bg-slate-200/80 text-slate-900'
    }`}>
      
      {/* 1. Studio Floating Control Bar */}
      <div className={`w-full max-w-4xl mb-6 p-2.5 sm:px-4 rounded-2xl border shadow-xl flex flex-wrap items-center justify-between gap-3 backdrop-blur-md transition-all ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-white'
          : 'bg-white/95 border-slate-300/80 text-slate-800'
      }`}>
        
        {/* Left: Device Info Badge */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black flex items-center space-x-1.5">
              <span>Mobile Phone Simulator</span>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded-full font-bold">
                Active
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {spec.width} × {spec.height}px • Kerala Viewport
            </div>
          </div>
        </div>

        {/* Center: Device Preset Selector */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
          {(Object.keys(DEVICE_SPECS) as DeviceModel[]).map((devKey) => {
            const dev = DEVICE_SPECS[devKey];
            const isActive = selectedDevice === devKey;
            return (
              <button
                key={devKey}
                onClick={() => setSelectedDevice(devKey)}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {dev.name}
              </button>
            );
          })}
        </div>

        {/* Right: Scale & Exit Controls */}
        <div className="flex items-center space-x-2">
          {/* Zoom Scale Selector */}
          <div className="flex items-center space-x-1 px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold">
            <button
              onClick={() => setZoomScale(s => Math.max(0.75, +(s - 0.05).toFixed(2)))}
              className="px-1.5 hover:text-blue-500"
              title="Zoom Out"
            >
              -
            </button>
            <span className="text-[11px] px-1">{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={() => setZoomScale(s => Math.min(1.05, +(s + 0.05).toFixed(2)))}
              className="px-1.5 hover:text-blue-500"
              title="Zoom In"
            >
              +
            </button>
          </div>

          {/* Switch to Fullscreen Desktop View */}
          <button
            onClick={onToggleEnabled}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold shadow-md transition-all active:scale-95"
            title="Switch back to Fullscreen Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>
        </div>

      </div>

      {/* 2. Realistic Smartphone Device Frame */}
      <div
        className="relative transition-all duration-300 origin-top flex items-center justify-center select-none"
        style={{
          transform: `scale(${zoomScale})`,
          marginBottom: `${(1 - zoomScale) * -80}px`
        }}
      >
        
        {/* Hardware Frame Shell (Outer Metallic Chassis & Shadow) */}
        <div
          className={`relative p-3 bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 ${spec.bezelRadius} shadow-[0_30px_90px_rgba(0,0,0,0.65)] ring-1 ring-slate-600/50`}
          style={{
            width: spec.width + 24,
            height: spec.height + 24
          }}
        >
          
          {/* Left Edge Hardware Buttons (Volume Up/Down) */}
          <div className="absolute -left-1.5 top-28 w-1 h-12 bg-slate-700 rounded-l-md shadow-inner" />
          <div className="absolute -left-1.5 top-44 w-1 h-12 bg-slate-700 rounded-l-md shadow-inner" />

          {/* Right Edge Hardware Button (Power / Lock) */}
          <div className="absolute -right-1.5 top-32 w-1 h-16 bg-slate-700 rounded-r-md shadow-inner" />

          {/* Device Screen Bezel Inner Container */}
          <div
            className={`relative w-full h-full overflow-hidden bg-black ${spec.screenRadius} border-2 border-slate-900 shadow-inner flex flex-col`}
          >
            
            {/* Top Speaker Ear-piece Slit */}
            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-800 rounded-full z-50" />

            {/* Mobile Status Bar */}
            <div className="relative w-full h-11 px-6 flex items-center justify-between text-white text-xs font-bold z-40 bg-black/40 backdrop-blur-sm select-none">
              
              {/* Left: Clock */}
              <div className="font-semibold text-[13px] tracking-tight pl-1">
                {currentTime}
              </div>

              {/* Center: Dynamic Island / Punch Hole */}
              {spec.notchType === 'island' ? (
                <div
                  onClick={() => setIslandExpanded(!islandExpanded)}
                  className={`transition-all duration-300 bg-black border border-slate-800/80 rounded-full flex items-center justify-between px-2 cursor-pointer shadow-md ${
                    islandExpanded
                      ? 'w-48 h-8'
                      : 'w-24 h-6 hover:scale-105'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full bg-slate-950 ring-1 ring-slate-800 shrink-0" />
                  {islandExpanded ? (
                    <span className="text-[10px] text-blue-400 font-extrabold truncate px-1">
                      Fykso Pro • Active
                    </span>
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500/80" />
                  )}
                  <div className="w-2 h-2 rounded-full bg-slate-900 ring-1 ring-slate-800 shrink-0" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-black ring-1 ring-slate-800 shrink-0" />
              )}

              {/* Right: Network & Battery Indicators */}
              <div className="flex items-center space-x-1.5 pr-1">
                <Signal className="w-3.5 h-3.5 stroke-[2.5]" />
                <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
                <div className="flex items-center space-x-0.5">
                  <span className="text-[10px] font-mono">100%</span>
                  <div className="w-5 h-2.5 rounded-sm border border-white/80 p-0.5 flex items-center">
                    <div className="w-full h-full bg-emerald-400 rounded-xs" />
                  </div>
                </div>
              </div>

            </div>

            {/* Scrollable Screen Viewport */}
            <div
              className={`flex-1 overflow-y-auto phone-screen-scroll select-text ${
                isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
              }`}
              style={{
                width: '100%',
                maxHeight: spec.height - 44
              }}
            >
              {children}
            </div>

            {/* Bottom iOS Home Indicator Pill */}
            <div className="relative w-full h-5 bg-black/60 backdrop-blur-sm flex items-center justify-center shrink-0 z-40">
              <div className="w-32 h-1 bg-white/70 rounded-full" />
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
