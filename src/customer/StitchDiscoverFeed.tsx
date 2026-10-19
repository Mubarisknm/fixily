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
  isCinematicDemo?: boolean;
}

const CINESWIPE_POSTERS: DiscoverItem[] = [
  {
    id: 'cs-1',
    title: 'Neon Pulse',
    category: 'Cyberpunk',
    subtitle: 'Thriller • 2024',
    durationOrYear: '2024',
    badge: 'Trending Now',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDayhRNsfMRQpE2mfI3yecVRvrifRWtmuw-RYSZ9-nifo1gDar4qCuCeODLzJ7UBpNSlqLF5PeI7Gkg9GSi2R8-4Ylq_tc5WyNoLFEZiLCnbMgOTZEEw7ACkHzl3F7nT-n_Q_1zZwLvCzXwFwnXN6OC1Hrs4HJ8KHkUAQH1WSkOUoRtubGWEbt6gespkZzA2xpwZR0cql0-H_WIeYORvKafNeVDJEZtulDR3xLulT_35T4nLYxTq2YHdvmmOt9o1BVdaYslWMx-6ME',
    isCinematicDemo: true
  },
  {
    id: 'cs-2',
    title: 'Shutter Speed',
    category: 'Neo-Noir',
    subtitle: 'Action • 2023',
    durationOrYear: '2023',
    badge: 'Popular',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkt4kkLiPG5d-HLW1w6dh-P92CLbMq0NoVB9d6xuUqHVkRIQSvOAqEcc0EDc8JTDS-wmchGSDWlVLB8ENT3NDM3eZEjujO8fKUvunZKy1VZZUvF2-v-rjX4BzrjjTBJ_pY5l5sl0j8kRT6Wl7Uh7yCC9ryBr7QnAFZ87z7N1J91MQ6Q03VCVqZTSWtxIo0Ssl00ybuzns0iHEnEO7Whr7Lb6pQqA4gEoWTe8FFziJZBUNJ6QElFGBsa7-2Stwpq1mX9gAfhT-m0Mk',
    isCinematicDemo: true
  },
  {
    id: 'cs-3',
    title: 'Rainy Alley',
    category: 'Neo-Noir',
    subtitle: 'Noir • 2024',
    durationOrYear: '2024',
    badge: 'Staff Pick',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBja80OydzDgQ1FIxPjKXoQvl9cQLX7YDLtpDevEaiQy0RbXTJFnrTJ8fA2t31jnUIzIV5Yqut_E72LSvHnz_ptyQmqHJahuERre2KnX4lyPm1FaBpvJp73A3oSUFgo0DIPxF-RlAkG2CHWCyYFGRsqyNUb4AD_S04Kr5Qg9SMbMPiHILIDfsv4Y7lpG6ZX48n3wIclO9h6un2toeKamMCsb6CmTChxlXIgIF9wU8NWMIdHIR3k9rly30aE6N9_IHmpDgXh8J3dbCQ',
    isCinematicDemo: true
  },
  {
    id: 'cs-4',
    title: 'Ghost Shell',
    category: 'Cyberpunk',
    subtitle: 'Sci-Fi • 2024',
    durationOrYear: '2024',
    badge: 'Critically Acclaimed',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyLgciTtUAkpqA3XH8LJdBT4ZuI9JDT5AxyslZHJ6aq7bkkCNiyrx25xOiLyPWXIIDMSd1gjNmDXdiLZ1hcqPujHipEya1WcDAsKRTuHv5Gb7sNRUw-gs0JyEralJSicGR7nJSAzWYuyulQclkVZZ8oMqSDIGwbZfAMSEQ5k9xz0LVXaPZAJYS2m-ZZ_XdhVOlPVZGiTqtIosKW4rmnTmGNXnph6j2HWpcmzTUcq5LeeLNPt0hRxrK3aIc3mUT2dQ0v-oSSUmRJwA',
    isCinematicDemo: true
  }
];

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
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    isCinematicDemo: false
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
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
    isCinematicDemo: false
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
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    isCinematicDemo: false
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
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80',
    isCinematicDemo: false
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
  const [activeTabMode, setActiveTabMode] = useState<'services' | 'cinema'>('services');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [savedItems, setSavedItems] = useState<Record<string, boolean>>({});
  const [isFeedModalOpen, setIsFeedModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const categories = useMemo(() => {
    if (activeTabMode === 'cinema') {
      return ['All', 'Cyberpunk', 'Neo-Noir', 'Psychological', 'Space Opera', 'Retro-Future'];
    }
    return ['All', 'Roadside Rescue', 'Cooling & AC', 'Car Detailing', 'Electrician', 'Plumber', 'Driver'];
  }, [activeTabMode]);

  const displayedPosters = useMemo(() => {
    const list = activeTabMode === 'cinema' ? CINESWIPE_POSTERS : FYKZI_RESCUE_POSTERS;
    let filtered = list;

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
  }, [activeTabMode, activeTag, searchQuery]);

  const handleToggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedItems(prev => {
      const isNowLiked = !prev[id];
      showToast(isNowLiked ? '❤️ Added to your Favorites' : 'Removed from Favorites');
      return { ...prev, [id]: isNowLiked };
    });
  };

  const handleToggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedItems(prev => {
      const isNowSaved = !prev[id];
      showToast(isNowSaved ? '🔖 Saved to your Bookmarks' : 'Removed from Bookmarks');
      return { ...prev, [id]: isNowSaved };
    });
  };

  const handleShare = (title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out ${title} on Fykzi!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      showToast('🔗 Link copied to clipboard!');
    }
  };

  const handleCardClick = (item: DiscoverItem) => {
    if (item.isCinematicDemo) {
      setIsFeedModalOpen(true);
      return;
    }
    // Match to Fykzi service item for direct booking
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
      eta: '20-30 mins',
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
              className="material-symbols-outlined text-[#ffb1c3] text-2xl transition-transform hover:scale-110"
              data-icon={activeTabMode === 'cinema' ? 'movie' : 'bolt'}
            >
              {activeTabMode === 'cinema' ? 'movie' : 'bolt'}
            </span>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-2xl font-bold tracking-tight text-[#e2e2e2]">
                {activeTabMode === 'cinema' ? 'CineSwipe' : 'Fykzi Discover'}
              </h1>
              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ffb1c3]/15 text-[#ffb1c3] border border-[#ffb1c3]/30">
                Stitch AI
              </span>
            </div>
          </div>

          {/* Quick Toggle: Archetype vs Fykzi Live Service */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTabMode(prev => prev === 'cinema' ? 'services' : 'cinema')}
              className="px-3 py-1 rounded-full text-xs font-bold bg-[#2a2a2a] hover:bg-[#353535] text-[#e5bcc4] border border-[#5c3f45]/30 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Switch between CineSwipe Demo and Fykzi Rescue"
            >
              <span className="material-symbols-outlined text-sm text-[#ffb1c3]">
                {activeTabMode === 'cinema' ? 'toggle_on' : 'toggle_off'}
              </span>
              <span>{activeTabMode === 'cinema' ? 'Demo' : 'Fykzi'}</span>
            </button>

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
            placeholder={
              activeTabMode === 'cinema'
                ? "Search for movies, actors, moods..."
                : "Search for battery boost, tyre swap, AC repair, driver..."
            }
            className="w-full bg-[#2a2a2a] border-none rounded-full py-4 pl-12 pr-6 text-[#e2e2e2] placeholder-[#e5bcc4]/40 focus:outline-none focus:ring-2 focus:ring-[#ffb1c3]/40 transition-all text-sm shadow-inner"
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
                    ? 'bg-[#ffb1c3] text-[#66002c] shadow-[0_0_15px_rgba(255,177,195,0.35)] font-bold'
                    : 'bg-[#353535] text-[#e5bcc4] hover:bg-[#2a2a2a]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Section 1: Late Night Thrills / Emergency & Roadside Rescue */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-semibold text-[#e2e2e2]">
              {activeTabMode === 'cinema' ? 'Late Night Thrills' : 'Kerala Emergency Rescue'}
            </h2>
            <button
              onClick={() => {
                if (onNavigateServices) onNavigateServices();
                else setActiveTag('All');
              }}
              className="text-[#ffb1c3] text-sm font-medium hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          {/* Masonry Grid */}
          <div className="masonry-grid">
            {displayedPosters.map((item) => {
              const isLiked = !!likedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="masonry-item relative group rounded-2xl overflow-hidden bg-[#1f1f1f] shadow-2xl cursor-pointer border border-[#5c3f45]/15 hover:border-[#ffb1c3]/40 transition-all duration-300"
                >
                  <div className="overflow-hidden aspect-[4/5] relative">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/20 to-transparent opacity-90" />

                    {/* Quick Like Overlay Button */}
                    <button
                      onClick={(e) => handleToggleLike(item.id, e)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                        isLiked
                          ? 'bg-[#ff4b89] text-white shadow-lg'
                          : 'bg-black/40 text-white/80 hover:bg-black/60'
                      }`}
                    >
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        favorite
                      </span>
                    </button>

                    {/* Price or Badge */}
                    {item.badge && (
                      <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#ffb1c3] border border-[#ffb1c3]/20">
                        {item.badge}
                      </span>
                    )}

                    {/* Text Metadata */}
                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <p className="font-headline text-lg font-bold leading-tight text-[#e2e2e2] group-hover:text-[#ffb1c3] transition-colors">
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
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ffb1c3] text-[#66002c]">
                            Book Now
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Sunday Morning Vibes / Curated Collection */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-2xl font-semibold text-[#e2e2e2]">
              {activeTabMode === 'cinema' ? 'Sunday Morning Vibes' : 'Doorstep Pro Maintenance'}
            </h2>
            <button
              onClick={() => {
                if (onNavigateServices) onNavigateServices();
              }}
              className="text-[#ffb1c3] text-sm font-medium hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Editorial Card */}
            <div
              onClick={() => {
                if (activeTabMode === 'cinema') {
                  setIsFeedModalOpen(true);
                } else {
                  handleCardClick(FYKZI_RESCUE_POSTERS[2]);
                }
              }}
              className="relative h-64 rounded-2xl overflow-hidden group shadow-2xl cursor-pointer border border-[#5c3f45]/20 hover:border-[#ff4b89]/50 transition-all"
            >
              <img
                src={
                  activeTabMode === 'cinema'
                    ? "https://lh3.googleusercontent.com/aida-public/AB6AXuDcPTPuu9G3RqDD8BipCZ_ICujtKmkA1HxvPzW5m0PC6UzgpDO6M-xadIh_tTc4VldxNBRS8Ze56L2zp8yklTkEZ_MMERfPruk1itPOSOWpNriUZTrZP-LRJ0nKa_gFJwswEcr_Z0Pnp4w89mOu-zeCGeq_S1ZCVQkq_E1v5Tj0LU_16WcU7Qnpswp46Ow_gyKDphpHr8zHn_bDlxZlSeF1OsV2ZmmZqxiKqUCnuCwD9h-9BZunywVIXX2OHnozhjau3GxU2coiF2g"
                    : "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80"
                }
                alt="Editorial spotlight"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-center p-8 text-left">
                <span className="text-[#00dbe9] text-xs font-bold uppercase tracking-widest mb-2">
                  Curated Collection
                </span>
                <h3 className="font-headline text-3xl font-bold max-w-[240px] leading-tight mb-4 text-white">
                  {activeTabMode === 'cinema' ? 'Quiet Contemplation' : 'Full Home AC Foam Clean'}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeTabMode === 'cinema') {
                      setIsFeedModalOpen(true);
                    } else {
                      handleCardClick(FYKZI_RESCUE_POSTERS[2]);
                    }
                  }}
                  className="w-fit px-6 py-2.5 rounded-full bg-[#ff4b89] hover:bg-[#bb0058] text-white font-medium text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(255,75,137,0.35)] transition-transform active:scale-95 cursor-pointer"
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {activeTabMode === 'cinema' ? 'play_arrow' : 'flash_on'}
                  </span>
                  <span>{activeTabMode === 'cinema' ? 'Watch Now' : 'Book Specialist'}</span>
                </button>
              </div>
            </div>

            {/* Small Grid for Vibes / Rapid Trades */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => {
                  if (activeTabMode === 'cinema') {
                    showToast('Playing Feel Good playlist');
                  } else {
                    handleCardClick(FYKZI_RESCUE_POSTERS[3]);
                  }
                }}
                className="bg-[#2a2a2a] hover:bg-[#353535] p-5 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all border border-[#5c3f45]/10 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#00dbe9]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#00dbe9]" data-icon="coffee">
                    {activeTabMode === 'cinema' ? 'coffee' : 'local_car_wash'}
                  </span>
                </div>
                <p className="font-headline font-bold text-[#e2e2e2]">
                  {activeTabMode === 'cinema' ? 'Feel Good' : 'Doorstep Car Spa'}
                </p>
                <p className="text-[#e5bcc4] text-xs mt-1">
                  {activeTabMode === 'cinema' ? '12 Movies' : 'Driveway Foam Jet'}
                </p>
              </div>

              <div
                onClick={() => {
                  if (activeTabMode === 'cinema') {
                    showToast('Playing Indie Gold playlist');
                  } else {
                    handleCardClick(FYKZI_RESCUE_POSTERS[0]);
                  }
                }}
                className="bg-[#2a2a2a] hover:bg-[#353535] p-5 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all border border-[#5c3f45]/10 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#ffb1c3]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#ffb1c3]" data-icon="auto_awesome">
                    {activeTabMode === 'cinema' ? 'auto_awesome' : 'car_repair'}
                  </span>
                </div>
                <p className="font-headline font-bold text-[#e2e2e2]">
                  {activeTabMode === 'cinema' ? 'Indie Gold' : 'Roadside Rescue'}
                </p>
                <p className="text-[#e5bcc4] text-xs mt-1">
                  {activeTabMode === 'cinema' ? '8 Movies' : '15-20 Min Arrival'}
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Floating Reaction Bar (Hybrid Contextual) */}
      <div className="fixed right-5 bottom-28 flex flex-col gap-4 z-40">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleToggleLike('feed-global')}
            className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all border border-[#5c3f45]/20 shadow-xl cursor-pointer ${
              likedItems['feed-global']
                ? 'bg-[#ff4b89] text-white shadow-[0_0_20px_rgba(255,75,137,0.4)]'
                : 'bg-[#353535]/85 text-[#e2e2e2] hover:text-[#ffb1c3]'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: likedItems['feed-global'] ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>
          <span className="text-[10px] text-[#e5bcc4] font-medium">Like</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleToggleSave('feed-global')}
            className={`w-12 h-12 rounded-full backdrop-blur-md flex items-center justify-center transition-all border border-[#5c3f45]/20 shadow-xl cursor-pointer ${
              savedItems['feed-global']
                ? 'bg-[#00dbe9] text-[#002f33] font-bold shadow-[0_0_20px_rgba(0,219,233,0.4)]'
                : 'bg-[#353535]/85 text-[#e2e2e2] hover:text-[#ffb1c3]'
            }`}
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: savedItems['feed-global'] ? "'FILL' 1" : "'FILL' 0" }}
            >
              add_to_photos
            </span>
          </button>
          <span className="text-[10px] text-[#e5bcc4] font-medium">Save</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleShare('Fykzi Discover Feed')}
            className="w-12 h-12 rounded-full bg-[#353535]/85 backdrop-blur-md flex items-center justify-center text-[#e2e2e2] hover:text-[#ffb1c3] transition-colors border border-[#5c3f45]/20 shadow-xl cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">share</span>
          </button>
          <span className="text-[10px] text-[#e5bcc4] font-medium">Share</span>
        </div>

        {onOpenEmergency && (
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={onOpenEmergency}
              className="w-12 h-12 rounded-full bg-rose-600/90 text-white backdrop-blur-md flex items-center justify-center hover:bg-rose-500 transition-colors border border-rose-400/40 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse cursor-pointer"
              title="Emergency Roadside Rescue"
            >
              <span className="material-symbols-outlined text-xl">emergency</span>
            </button>
            <span className="text-[10px] text-rose-300 font-bold">SOS</span>
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation Bar (Matching Stitch Discover code.html) */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[#1b1b1b]/80 backdrop-blur-2xl border border-[#5c3f45]/25 rounded-full px-8 py-3.5 z-40 shadow-2xl flex justify-between items-center">
        {/* Feed Tab */}
        <button
          onClick={() => setIsFeedModalOpen(true)}
          className="flex flex-col items-center gap-1 group cursor-pointer transition-transform active:scale-95"
        >
          <span
            className="material-symbols-outlined text-[#e5bcc4] group-hover:text-[#ffb1c3] transition-colors text-2xl"
            data-icon="play_circle"
          >
            play_circle
          </span>
          <span className="text-[10px] font-medium text-[#e5bcc4] group-hover:text-[#ffb1c3] tracking-wide">
            Feed
          </span>
        </button>

        {/* Discover Tab (Active with Glowing Dot) */}
        <button
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 relative cursor-pointer"
        >
          <div className="absolute -top-1 w-1.5 h-1.5 bg-[#ffb1c3] rounded-full shadow-[0_0_10px_#ffb1c3]" />
          <span
            className="material-symbols-outlined text-[#ffb1c3] text-2xl"
            data-icon="explore"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            explore
          </span>
          <span className="text-[10px] font-bold text-[#ffb1c3] tracking-wide">
            Discover
          </span>
        </button>

        {/* Home / Services Tab */}
        <button
          onClick={() => {
            if (onNavigateHome) onNavigateHome();
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer transition-transform active:scale-95"
        >
          <span
            className="material-symbols-outlined text-[#e5bcc4] group-hover:text-[#ffb1c3] transition-colors text-2xl"
            data-icon="home"
          >
            home
          </span>
          <span className="text-[10px] font-medium text-[#e5bcc4] group-hover:text-[#ffb1c3] tracking-wide">
            Home
          </span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => {
            if (onOpenProfileDrawer) onOpenProfileDrawer();
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer transition-transform active:scale-95"
        >
          <span
            className="material-symbols-outlined text-[#e5bcc4] group-hover:text-[#ffb1c3] transition-colors text-2xl"
            data-icon="person"
          >
            person
          </span>
          <span className="text-[10px] font-medium text-[#e5bcc4] group-hover:text-[#ffb1c3] tracking-wide">
            Profile
          </span>
        </button>
      </nav>

      {/* Full-Screen Vertical Swipe Feed Modal (from stitch_vertical_feed/vertical_feed/code.html) */}
      {isFeedModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0e0e0e] text-[#e2e2e2] flex flex-col justify-end animate-in fade-in duration-300">
          
          {/* Background Video / Trailer Mock */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJo5kFl-F9sshg3j98peSjCuXus1ODOk32llARHSb4ZbV3WDDAlRO4zJ9opsMUWuagdzrcBhGlAsv2ep7sPqvM4N5IjxeSWIEDiTA3ri7vWDc-fZS90E2R67bydx7eO7r412LUneQHJSvifJH-7taVYvScB80Jozl-eOBsUCmQ2m81XkY9NvJuo383R5loOOdz2YH__f9MGWTVVsoNda1lxfHkIXccEeWA9_CuKMnN0PYSud1wDDSFHw5h_2lzaiaFIehJ4g39Lkk"
              alt="Cinematic frame"
              className="w-full h-full object-cover"
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/70 to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0e0e0e]/50 to-transparent" />
          </div>

          {/* Top Bar with Close button */}
          <div className="absolute top-0 inset-x-0 h-16 flex justify-between items-center px-6 z-20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffb1c3]">play_circle</span>
              <span className="font-headline font-bold text-sm tracking-wider text-white">Vertical Feed</span>
            </div>
            <button
              onClick={() => setIsFeedModalOpen(false)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/80 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Main Content Reel Canvas */}
          <div className="relative z-10 px-6 pb-28 max-w-md space-y-4">
            {/* Genre Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#00a0aa]/30 border border-[#00dbe9]/30">
              <span className="text-[10px] font-bold tracking-widest text-[#00dbe9] uppercase">
                Sci-Fi Thriller • Vertical Feed
              </span>
            </div>

            {/* Title */}
            <h1 className="font-headline text-5xl md:text-6xl font-bold leading-none tracking-tight text-white">
              NEON<br />DREAMS
            </h1>

            {/* Logline */}
            <p className="text-[#e5bcc4] text-sm leading-relaxed max-w-[85%]">
              In a city that never sleeps, memories are the only currency left. One man discovers a secret that could bankrupt the soul.
            </p>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={() => {
                  showToast('Playing full cinematic stream...');
                }}
                className="bg-gradient-to-br from-[#ffb1c3] to-[#ff4b89] text-[#66002c] font-bold px-8 py-3.5 rounded-full shadow-[0_0_20px_rgba(255,177,195,0.4)] transition-transform active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
                <span>Watch Now</span>
              </button>

              <button
                onClick={() => setIsFeedModalOpen(false)}
                className="bg-[#1f1f1f]/70 backdrop-blur-xl text-white border border-[#5c3f45]/40 px-6 py-3.5 rounded-full font-medium transition-transform active:scale-95 cursor-pointer"
              >
                Back to Discover
              </button>
            </div>
          </div>

          {/* Floating Vertical Reaction Sidebar */}
          <div className="absolute right-4 bottom-32 flex flex-col items-center gap-5 z-20">
            <button
              onClick={() => handleToggleLike('feed-reel')}
              className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl border border-[#5c3f45]/30 ${
                likedItems['feed-reel'] ? 'bg-[#ff4b89] text-white' : 'bg-[#1f1f1f]/60 text-white'
              }`}
            >
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: likedItems['feed-reel'] ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
            <span className="text-[11px] font-medium tracking-wider text-[#e5bcc4]">Like</span>

            <button
              onClick={() => handleToggleSave('feed-reel')}
              className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl bg-[#1f1f1f]/60 border border-[#5c3f45]/30 text-white"
            >
              <span className="material-symbols-outlined text-3xl">add_to_photos</span>
            </button>
            <span className="text-[11px] font-medium tracking-wider text-[#e5bcc4]">Save</span>

            <button
              onClick={() => handleShare('NEON DREAMS')}
              className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-xl bg-[#1f1f1f]/60 border border-[#5c3f45]/30 text-white"
            >
              <span className="material-symbols-outlined text-3xl">share</span>
            </button>
            <span className="text-[11px] font-medium tracking-wider text-[#e5bcc4]">Share</span>
          </div>

        </div>
      )}

    </div>
  );
};
