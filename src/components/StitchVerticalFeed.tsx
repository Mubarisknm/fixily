import React, { useState, useEffect, useRef } from 'react';
import {
  Heart,
  Bookmark,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Zap,
  ShieldCheck,
  Clock,
  PhoneCall,
  Check,
  ArrowRight,
  Info
} from 'lucide-react';
import { ServiceItem, KochiLocation } from '../types';
import { sound } from '../utils/soundEffects';

interface StitchFeedItem {
  id: string;
  serviceId?: string;
  categoryBadge: string;
  titleTop: string;
  titleBottom: string;
  logline: string;
  priceTag: string;
  eta: string;
  rating: number;
  likes: number;
  verifiedTech: string;
  imageUrl: string;
  videoUrl?: string;
  accentColor?: string;
}

const STITCH_FEED_DATA: StitchFeedItem[] = [
  {
    id: 'reel-1',
    serviceId: 'mech-battery',
    categoryBadge: '24/7 ROADSIDE RESCUE',
    titleTop: 'RAPID',
    titleBottom: 'JUMPSTART',
    logline: 'Stuck on the highway or in your driveway with a dead battery? 15-minute emergency mobile technician with heavy-duty jump booster & alternator diagnostics.',
    priceTag: '₹299',
    eta: '12-15 Mins',
    rating: 4.9,
    likes: 1420,
    verifiedTech: 'Arun V. (Master Mechanic)',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#00dbe9'
  },
  {
    id: 'reel-2',
    serviceId: 'car-wash-foam',
    categoryBadge: 'PREMIUM CAR SPA',
    titleTop: 'NEON FOAM',
    titleBottom: 'JET WASH',
    logline: 'Transform your vehicle at your doorstep. High-pressure German foam bath, micro-fiber scratchless scrub, underbody blast, and hydrophobic ceramic wax coat.',
    priceTag: '₹499',
    eta: '30 Mins',
    rating: 4.95,
    likes: 2180,
    verifiedTech: 'Fykzi Pro Spa Squad #04',
    imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#ff4b89'
  },
  {
    id: 'reel-3',
    serviceId: 'appliance-ac-deep',
    categoryBadge: 'CLIMATE CONTROL',
    titleTop: 'TURBO AC',
    titleBottom: 'CHILL JET',
    logline: 'Breathe pure Himalayan-grade cool air. Jet pump chemical coil wash, microbial disinfection, gas pressure check, and blower fan balancing.',
    priceTag: '₹599',
    eta: '20-25 Mins',
    rating: 4.88,
    likes: 980,
    verifiedTech: 'Suresh Kumar (HVAC Expert)',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#00dbe9'
  },
  {
    id: 'reel-4',
    serviceId: 'mech-tyre',
    categoryBadge: 'EMERGENCY REPAIR',
    titleTop: 'FLAT TYRE',
    titleBottom: 'INSTANT PLUG',
    logline: 'Tubeless puncture plugging and spare tire swap anywhere in Kerala. Onsite high-speed compressor tire inflation and bead sealing.',
    priceTag: '₹249',
    eta: '15 Mins',
    rating: 4.92,
    likes: 1640,
    verifiedTech: 'Vineeth R. (Highway Rescue)',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#ffb1c3'
  },
  {
    id: 'reel-5',
    serviceId: 'elec-short-circuit',
    categoryBadge: 'CERTIFIED VOLTAGE',
    titleTop: 'POWER TRIP',
    titleBottom: 'OVERHAUL',
    logline: 'Sudden blackout or sparking DB board? PCC background-checked certified electricians with thermal cameras and digital multimeters on call 24/7.',
    priceTag: '₹349',
    eta: '18 Mins',
    rating: 4.97,
    likes: 870,
    verifiedTech: 'Mohammed Shafi (Grade A Electrician)',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#00dbe9'
  },
  {
    id: 'reel-6',
    serviceId: 'driver-night',
    categoryBadge: 'VIP CHAUFFEUR',
    titleTop: 'SAFE NIGHT',
    titleBottom: 'CHAUFFEUR',
    logline: 'Tired after a late event or highway drive? Book an experienced, police-verified private driver to pilot your luxury sedan or SUV safely home.',
    priceTag: '₹449',
    eta: '20 Mins',
    rating: 4.96,
    likes: 1250,
    verifiedTech: 'Ramesh Babu (12 Yrs Safe Driving)',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#ff4b89'
  }
];

interface StitchVerticalFeedProps {
  services: ServiceItem[];
  selectedLocation: KochiLocation;
  onSelectService: (service: ServiceItem) => void;
  onQuickBookService?: (serviceId: string) => void;
}

export const StitchVerticalFeed: React.FC<StitchVerticalFeedProps> = ({
  services,
  selectedLocation,
  onSelectService,
  onQuickBookService
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number>(0);

  const currentReel = STITCH_FEED_DATA[currentIndex];

  const handleNext = () => {
    sound.click();
    setCurrentIndex((prev) => (prev + 1) % STITCH_FEED_DATA.length);
  };

  const handlePrev = () => {
    sound.click();
    setCurrentIndex((prev) => (prev - 1 + STITCH_FEED_DATA.length) % STITCH_FEED_DATA.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        handlePrev();
      } else if (e.key === ' ') {
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch Swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Wheel navigation with debounce
  const lastWheelTime = useRef<number>(0);
  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 450) return;
    if (Math.abs(e.deltaY) > 35) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  const toggleLike = (id: string) => {
    sound.pop();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSave = (id: string) => {
    sound.beep();
    setSavedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleShare = async () => {
    sound.pop();
    const shareData = {
      title: `Fykzi Live: ${currentReel.titleTop} ${currentReel.titleBottom}`,
      text: `${currentReel.logline} - Available now at ${selectedLocation.name.split('(')[0]}!`,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        setShareToast('Link copied to clipboard!');
        setTimeout(() => setShareToast(null), 3000);
      } catch (err) {}
    }
  };

  const handleBookNow = () => {
    sound.success();
    // Find matching service item in services list
    const matchedService = services.find(
      (s) => s.id === currentReel.serviceId || s.title.toLowerCase().includes(currentReel.titleBottom.toLowerCase())
    );
    if (matchedService) {
      onSelectService(matchedService);
    } else if (services.length > 0) {
      onSelectService(services[0]);
    }
    if (onQuickBookService && currentReel.serviceId) {
      onQuickBookService(currentReel.serviceId);
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="relative w-full h-[calc(100vh-140px)] min-h-[580px] max-h-[820px] rounded-3xl overflow-hidden bg-[#0e0e0e] text-[#e2e2e2] select-none shadow-[0_20px_60px_rgba(0,0,0,0.85)] border border-[#353535]/30 transition-all"
    >
      {/* Background Image / Reel Visual */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          key={currentReel.id}
          src={currentReel.imageUrl}
          alt={`${currentReel.titleTop} ${currentReel.titleBottom}`}
          className={`w-full h-full object-cover transition-transform duration-1000 ease-out scale-100 ${
            isPlaying ? 'scale-105' : 'scale-100'
          }`}
        />

        {/* Cinematic Neon Noir Overlays */}
        <div className="absolute inset-0 vertical-gradient-overlay opacity-95"></div>
        <div className="absolute inset-y-0 right-0 w-36 side-gradient-overlay opacity-70"></div>
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0e0e0e]/80 via-[#0e0e0e]/30 to-transparent"></div>
      </div>

      {/* Top Floating Mini-Bar: Live Indicator, Sound & Reel Progress */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-6 z-20 flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f1f1f]/80 backdrop-blur-md border border-[#5c3f45]/20 text-xs font-bold tracking-wider text-[#ffb1c3]">
            <span className="w-2 h-2 rounded-full bg-[#ff4b89] animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-[#ff4b89] -ml-3.5"></span>
            <span>FYKZI LIVE REEL</span>
          </div>
          <span className="text-[11px] font-semibold text-[#e5bcc4]/70 hidden sm:inline">
            {selectedLocation.name.split('(')[0]}
          </span>
        </div>

        {/* Controls: Mute, Pause, Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted((m) => !m)}
            className="p-2 rounded-full glass-panel border border-[#5c3f45]/30 text-white hover:text-[#ffb1c3] transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#00dbe9]" />}
          </button>

          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="p-2 rounded-full glass-panel border border-[#5c3f45]/30 text-white hover:text-[#ffb1c3] transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#ffb1c3]" />}
          </button>
        </div>
      </div>

      {/* Story Dots / Progress Bar at top */}
      <div className="absolute top-1.5 inset-x-4 sm:inset-x-6 z-30 flex items-center gap-1.5">
        {STITCH_FEED_DATA.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(idx)}
            className="flex-1 h-1 rounded-full overflow-hidden bg-white/20 hover:bg-white/40 transition-colors"
          >
            <div
              className={`h-full transition-all duration-300 ${
                idx === currentIndex
                  ? 'bg-gradient-to-r from-[#ffb1c3] to-[#ff4b89] w-full shadow-[0_0_8px_#ffb1c3]'
                  : idx < currentIndex
                  ? 'bg-white/60 w-full'
                  : 'w-0'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Up/Down Floating Navigation Arrow Hints */}
      <div className="absolute right-4 top-20 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handlePrev}
          className="p-1.5 rounded-full glass-panel border border-white/10 text-white/60 hover:text-white hover:scale-110 active:scale-95 transition-all"
          title="Previous Reel (Up Arrow)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          className="p-1.5 rounded-full glass-panel border border-white/10 text-white/60 hover:text-white hover:scale-110 active:scale-95 transition-all"
          title="Next Reel (Down Arrow)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Right Vertical Interaction Bar (Exact Neon Noir Layout) */}
      <div className="absolute right-4 sm:right-6 bottom-20 flex flex-col items-center gap-5 z-20 pointer-events-auto">
        {/* Like */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => toggleLike(currentReel.id)}
            className={`glass-panel w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border border-[#5c3f45]/20 transition-all duration-300 active:scale-90 ${
              likedMap[currentReel.id]
                ? 'text-[#ff4b89] shadow-[0_0_20px_rgba(255,75,137,0.5)] border-[#ff4b89]/50 scale-105'
                : 'text-[#e2e2e2] hover:text-[#ffb1c3]'
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-transform ${
                likedMap[currentReel.id] ? 'fill-[#ff4b89] stroke-[#ff4b89] scale-110' : ''
              }`}
            />
          </button>
          <span className="text-[10px] font-bold tracking-wider text-[#e5bcc4]">
            {likedMap[currentReel.id] ? currentReel.likes + 1 : currentReel.likes}
          </span>
        </div>

        {/* Save */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => toggleSave(currentReel.id)}
            className={`glass-panel w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border border-[#5c3f45]/20 transition-all duration-300 active:scale-90 ${
              savedMap[currentReel.id]
                ? 'text-[#00dbe9] shadow-[0_0_20px_rgba(0,219,233,0.5)] border-[#00dbe9]/50 scale-105'
                : 'text-[#e2e2e2] hover:text-[#00dbe9]'
            }`}
          >
            <Bookmark
              className={`w-6 h-6 transition-transform ${
                savedMap[currentReel.id] ? 'fill-[#00dbe9] stroke-[#00dbe9] scale-110' : ''
              }`}
            />
          </button>
          <span className="text-[10px] font-bold tracking-wider text-[#e5bcc4]">
            {savedMap[currentReel.id] ? 'Saved' : 'Save'}
          </span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={handleShare}
            className="glass-panel w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border border-[#5c3f45]/20 text-[#e2e2e2] hover:text-[#ffb1c3] transition-all active:scale-90"
          >
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <span className="text-[10px] font-bold tracking-wider text-[#e5bcc4]">Share</span>
        </div>
      </div>

      {/* Main Content Canvas (Bottom Left Metadata & Action CTA) */}
      <div className="relative z-10 h-full flex flex-col justify-end px-5 sm:px-8 pb-8 sm:pb-10 pointer-events-none">
        <div className="max-w-lg space-y-3 pointer-events-auto">
          {/* Genre / Service Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00a0aa]/20 border border-[#00dbe9]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00dbe9] animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-widest text-[#00dbe9] uppercase">
              {currentReel.categoryBadge}
            </span>
          </div>

          {/* Space Grotesk Big Bold Title */}
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tight text-white drop-shadow-md">
            {currentReel.titleTop}
            <br />
            <span className="bg-gradient-to-r from-white via-[#ffd9e0] to-[#ffb1c3] bg-clip-text text-transparent">
              {currentReel.titleBottom}
            </span>
          </h1>

          {/* Logline */}
          <p className="text-[#e5bcc4] text-xs sm:text-sm leading-relaxed max-w-[85%] sm:max-w-[78%] line-clamp-3 sm:line-clamp-none font-medium drop-shadow">
            {currentReel.logline}
          </p>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 pt-1 text-xs">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-bold">
              <Zap className="w-3.5 h-3.5 text-[#ff4b89]" />
              <span>{currentReel.eta}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-white font-bold">
              <span className="text-[#00dbe9]">⚡</span>
              <span>From {currentReel.priceTag}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#ffd9e0] font-semibold text-[11px] hidden sm:inline-flex">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{currentReel.verifiedTech}</span>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="pt-2 sm:pt-3 flex items-center gap-3">
            <button
              onClick={handleBookNow}
              className="bg-gradient-to-r from-[#ffb1c3] via-[#ff4b89] to-[#bb0058] text-[#3f0019] hover:brightness-110 font-black px-6 sm:px-8 py-3.5 rounded-full neon-glow transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-[0_4px_25px_rgba(255,75,137,0.45)] text-sm sm:text-base"
            >
              <Zap className="w-4 h-4 fill-[#3f0019]" />
              <span>Book In 1 Tap</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <button
              onClick={handleNext}
              className="glass-panel text-[#e2e2e2] hover:text-white border border-[#5c3f45]/40 px-5 sm:px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Next Reel</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#1f1f1f]/95 border border-[#ffb1c3]/40 text-[#ffb1c3] text-xs font-bold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{shareToast}</span>
        </div>
      )}
    </div>
  );
};
