import React, { useState, useMemo } from 'react';
import {
  ServiceItem,
  KochiLocation,
  ThemeMode,
  BookingJob,
  CustomerNavTab
} from '../types';

interface StitchDiscoverFeedProps {
  services: ServiceItem[];
  selectedLocation: KochiLocation;
  onSelectService: (service: any) => void;
  onOpenEmergency?: () => void;
  theme?: ThemeMode;
  onNavigateHome?: () => void;
  onNavigateServices?: () => void;
  onNavigateOrders?: () => void;
  onOpenProfileDrawer?: () => void;
}

interface DiscoverItem {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  imageUrl: string;
  durationOrYear: string;
  badge?: string;
  price?: number;
  rating?: number;
}

const FYKZI_RESCUE_POSTERS: DiscoverItem[] = [
  {
    id: 'fykzi-jumpstart',
    title: 'Jumpstart & Battery Hub',
    category: 'Roadside Rescue',
    subtitle: '15-20 Min Arrival • 12V Boost',
    durationOrYear: 'Instant',
    badge: '⚡ Rapid 15m',
    price: 199,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'fykzi-tyre',
    title: 'Flat Tyre & Wheel Swap',
    category: 'Roadside Rescue',
    subtitle: 'Hydraulic Jack • Puncture Plug',
    durationOrYear: 'On-Demand',
    badge: '🛞 Highway Support',
    price: 249,
    rating: 4.8,
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'fykzi-ac-jet',
    title: 'AC Foam Jet Deep Wash',
    category: 'Cooling & AC',
    subtitle: 'Anti-Fungal Coil • High-PSI Clean',
    durationOrYear: '45 mins',
    badge: '❄️ Bestseller',
    price: 499,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'fykzi-car-spa',
    title: 'Snow Foam Wash & Detail',
    category: 'Car Detailing',
    subtitle: 'Driveway Jet Wash • Interior Vacuum',
    durationOrYear: '50 mins',
    badge: '✨ Driveway Spa',
    price: 499,
    rating: 4.9,
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'fykzi-driver',
    title: 'Freelance Acting Driver',
    category: 'Acting Driver',
    subtitle: 'City & Outstation • Verified License',
    durationOrYear: 'Flexible',
    badge: '👨‍✈️ Top Rated',
    price: 349,
    rating: 4.95,
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'fykzi-electric',
    title: 'Emergency Electrician & MCB',
    category: 'Electrician',
    subtitle: 'Power Cut • Short Circuit • Inverter Fix',
    durationOrYear: '15-20 mins',
    badge: '⚡ Urgent',
    price: 199,
    rating: 4.85,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
  }
];

export const StitchDiscoverFeed: React.FC<StitchDiscoverFeedProps> = ({
  services,
  selectedLocation,
  onSelectService,
  onOpenEmergency,
  onNavigateHome,
  onNavigateServices,
  onNavigateOrders,
  onOpenProfileDrawer
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [isFeedModalOpen, setIsFeedModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const categories = [
    'All',
    'Roadside Rescue',
    'Cooling & AC',
    'Car Detailing',
    'Electrician',
    'Plumber',
    'Acting Driver'
  ];

  const displayedPosters = useMemo(() => {
    let filtered = FYKZI_RESCUE_POSTERS;

    if (activeTag !== 'All') {
      filtered = filtered.filter(item =>
        item.category.toLowerCase().includes(activeTag.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [activeTag, searchQuery]);

  const handleCardClick = (item: DiscoverItem) => {
    const matched = services.find(s =>
      s.title.toLowerCase().includes(item.title.toLowerCase().split(' ')[0]) ||
      s.category.toLowerCase().includes(item.category.toLowerCase().split(' ')[0])
    ) || {
      id: item.id,
      title: item.title,
      category: item.category,
      tagline: item.subtitle,
      priceType: 'flat_diagnostic',
      diagnosticFee: item.price || 199,
      basePrice: item.price || 199,
      eta: '15-25 mins',
      features: ['Upfront transparent pricing', 'Verified specialist dispatched with full equipment', 'Zero damage warranty guarantee'],
      rating: item.rating || 4.9,
      reviewsCount: 38,
      icon: 'Zap',
      imageUrl: item.imageUrl,
      phase: 1,
      isInstant: true
    };
    onSelectService(matched);
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-[#e2e2e2] font-body antialiased pb-32 relative select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1f1f1f] text-[#ffb1c3] border border-[#ffb1c3]/30 px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          {toastMessage}
        </div>
      )}

      {/* TopAppBar (Glassmorphic) */}
      <header className="sticky top-0 z-40 bg-[#131313]/70 backdrop-blur-xl border-b border-[#5c3f45]/20">
        <div className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <span
              className="material-symbols-outlined text-[#00dbe9] text-2xl transition-transform hover:scale-110"
              data-icon="bolt"
            >
              bolt
            </span>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-2xl font-bold tracking-tight text-[#e2e2e2]">
                Fykzi Discover
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00dbe9]/15 text-[#00dbe9] border border-[#00dbe9]/30">
                Live Feed
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {onOpenEmergency && (
              <button
                onClick={onOpenEmergency}
                className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Emergency SOS"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>24/7 SOS</span>
              </button>
            )}

            <button
              onClick={() => {
                const el = document.getElementById('stitch-search-input');
                el?.focus();
              }}
              className="p-2 hover:bg-[#353535] rounded-full transition-colors cursor-pointer text-[#e2e2e2]"
              title="Search"
            >
              <span className="material-symbols-outlined text-lg" data-icon="search">search</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-6 pt-6">

        {/* Location & Micro-banner */}
        <div className="flex items-center justify-between text-xs text-[#e5bcc4]/70 mb-4 px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#00dbe9]">location_on</span>
            <span className="font-medium text-[#e2e2e2]">
              {selectedLocation.name.replace(/^Live:\s*/i, '').split('(')[0].trim()}
            </span>
          </div>
          <span className="text-[10px] text-[#00dbe9] font-bold uppercase tracking-wider">
            ● 24/7 Rapid Response
          </span>
        </div>

        {/* Prominent Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[#e5bcc4]/60 text-xl" data-icon="search">search</span>
          </div>
          <input
            id="stitch-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for battery boost, tyre swap, AC repair, driver..."
            className="w-full bg-[#2a2a2a] border-none rounded-full py-4 pl-12 pr-6 text-[#e2e2e2] placeholder-[#e5bcc4]/40 focus:outline-none focus:ring-2 focus:ring-[#00dbe9]/40 transition-all text-sm shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-[#e5bcc4]/60 hover:text-white"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          )}
        </div>

        {/* Genre Tags Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-2.5 mb-10 no-scrollbar -mx-6 px-6">
          {categories.map((cat) => {
            const isActive = activeTag === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTag(cat)}
                className={`flex-shrink-0 px-6 py-2 rounded-full font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#00dbe9] text-[#00363a] shadow-[0_0_15px_rgba(0,219,233,0.35)] font-bold'
                    : 'bg-[#353535] text-[#e5bcc4] hover:bg-[#2a2a2a]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Section 1: Emergency & Roadside Rescue */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-semibold text-[#e2e2e2]">
              Kerala Emergency Rescue
            </h2>
            <button
              onClick={() => {
                if (onNavigateServices) onNavigateServices();
                else setActiveTag('All');
              }}
              className="text-[#00dbe9] text-sm font-medium hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedPosters.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="relative group rounded-2xl overflow-hidden bg-[#1f1f1f] shadow-2xl cursor-pointer border border-[#5c3f45]/15 hover:border-[#00dbe9]/40 transition-all duration-300"
              >
                <div className="overflow-hidden aspect-[4/3] relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/30 to-transparent opacity-90" />

                  {/* Badge */}
                  {item.badge && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#00dbe9] border border-[#00dbe9]/20">
                      {item.badge}
                    </span>
                  )}

                  {/* Text Metadata */}
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <p className="font-headline text-lg font-bold leading-tight text-[#e2e2e2] group-hover:text-[#00dbe9] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[#e5bcc4] text-xs mt-1">
                      {item.subtitle}
                    </p>
                    {item.price && (
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-black text-[#00dbe9]">
                          ₹{item.price}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#00dbe9] text-[#00363a]">
                          Book Now
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Curated Collection */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-semibold text-[#e2e2e2]">
              Doorstep Pro Maintenance
            </h2>
            <button
              onClick={() => {
                if (onNavigateServices) onNavigateServices();
              }}
              className="text-[#00dbe9] text-sm font-medium hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Spotlight Card */}
            <div
              onClick={() => handleCardClick(FYKZI_RESCUE_POSTERS[2])}
              className="relative h-64 rounded-2xl overflow-hidden group shadow-2xl cursor-pointer border border-[#5c3f45]/20 hover:border-[#00dbe9]/50 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80"
                alt="Editorial spotlight"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-center p-8 text-left">
                <span className="text-[#00dbe9] text-xs font-bold uppercase tracking-widest mb-2">
                  Featured Service
                </span>
                <h3 className="font-headline text-3xl font-bold max-w-[280px] leading-tight mb-4 text-white">
                  Full Home AC Foam Clean
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(FYKZI_RESCUE_POSTERS[2]);
                  }}
                  className="w-fit px-6 py-2.5 rounded-full bg-[#00dbe9] hover:bg-[#00c2cf] text-[#00363a] font-bold text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,219,233,0.35)] transition-transform active:scale-95 cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    flash_on
                  </span>
                  <span>Book Specialist</span>
                </button>
              </div>
            </div>

            {/* Quick Cards for Rapid Trades */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => handleCardClick(FYKZI_RESCUE_POSTERS[3])}
                className="bg-[#2a2a2a] hover:bg-[#353535] p-5 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all border border-[#5c3f45]/10 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#00dbe9]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#00dbe9]" data-icon="local_car_wash">
                    local_car_wash
                  </span>
                </div>
                <p className="font-headline font-bold text-[#e2e2e2]">
                  Doorstep Car Spa
                </p>
                <p className="text-[#e5bcc4] text-xs mt-1">
                  Driveway Foam Jet
                </p>
              </div>

              <div
                onClick={() => handleCardClick(FYKZI_RESCUE_POSTERS[0])}
                className="bg-[#2a2a2a] hover:bg-[#353535] p-5 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all border border-[#5c3f45]/10 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#ffb1c3]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#ffb1c3]" data-icon="car_repair">
                    car_repair
                  </span>
                </div>
                <p className="font-headline font-bold text-[#e2e2e2]">
                  Roadside Rescue
                </p>
                <p className="text-[#e5bcc4] text-xs mt-1">
                  15-20 Min Arrival
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Floating Bottom Navigation Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[#1b1b1b]/80 backdrop-blur-2xl border border-[#5c3f45]/25 rounded-full px-8 py-3.5 z-40 shadow-2xl flex justify-between items-center">
        {/* Home Tab */}
        <button
          onClick={() => {
            if (onNavigateHome) onNavigateHome();
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer transition-transform active:scale-95"
        >
          <span
            className="material-symbols-outlined text-[#e5bcc4] group-hover:text-[#00dbe9] transition-colors text-2xl"
            data-icon="home"
          >
            home
          </span>
          <span className="text-[10px] font-medium text-[#e5bcc4] group-hover:text-[#00dbe9] tracking-wide">
            Home
          </span>
        </button>

        {/* Discover Tab (Active with Glowing Dot) */}
        <button
          className="flex flex-col items-center gap-1 relative cursor-pointer"
        >
          <span
            className="material-symbols-outlined text-[#00dbe9] text-2xl drop-shadow-[0_0_10px_rgba(0,219,233,0.5)]"
            data-icon="explore"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            explore
          </span>
          <span className="text-[10px] font-bold text-[#00dbe9] tracking-wide">
            Discover
          </span>
          <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#00dbe9] shadow-[0_0_8px_#00dbe9]" />
        </button>

        {/* Services Tab */}
        <button
          onClick={() => {
            if (onNavigateServices) onNavigateServices();
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer transition-transform active:scale-95"
        >
          <span
            className="material-symbols-outlined text-[#e5bcc4] group-hover:text-[#00dbe9] transition-colors text-2xl"
            data-icon="handyman"
          >
            handyman
          </span>
          <span className="text-[10px] font-medium text-[#e5bcc4] group-hover:text-[#00dbe9] tracking-wide">
            Services
          </span>
        </button>

        {/* Orders Tab */}
        <button
          onClick={() => {
            if (onNavigateOrders) onNavigateOrders();
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer transition-transform active:scale-95"
        >
          <span
            className="material-symbols-outlined text-[#e5bcc4] group-hover:text-[#00dbe9] transition-colors text-2xl"
            data-icon="receipt_long"
          >
            receipt_long
          </span>
          <span className="text-[10px] font-medium text-[#e5bcc4] group-hover:text-[#00dbe9] tracking-wide">
            Orders
          </span>
        </button>
      </nav>

    </div>
  );
};
