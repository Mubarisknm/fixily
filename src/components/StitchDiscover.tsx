import React, { useState, useMemo } from 'react';
import {
  Search,
  Zap,
  Sparkles,
  ShieldCheck,
  Star,
  Clock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Wrench,
  Car,
  Droplets,
  Cpu,
  Moon,
  Coffee,
  Heart
} from 'lucide-react';
import { ServiceItem, KochiLocation } from '../types';
import { sound } from '../utils/soundEffects';

interface StitchDiscoverProps {
  services: ServiceItem[];
  selectedLocation: KochiLocation;
  onSelectService: (service: ServiceItem) => void;
  onSwitchToFeed?: () => void;
}

const DISCOVER_GENRES = [
  { id: 'all', label: 'All Services' },
  { id: 'Mechanic & Roadside Assistance', label: 'Roadside Rescue' },
  { id: 'Car Spa & Detailing', label: 'Car Spa & Detailing' },
  { id: 'Appliance Care & Servicing', label: 'AC & Appliances' },
  { id: 'Electrical Services', label: 'Electricians' },
  { id: 'Plumbing & Water Management', label: 'Plumbers' },
  { id: 'Acting Driver', label: 'Chauffeur On-Demand' },
  { id: 'Home Deep Cleaning', label: 'Home Deep Clean' }
];

export const StitchDiscover: React.FC<StitchDiscoverProps> = ({
  services,
  selectedLocation,
  onSelectService,
  onSwitchToFeed
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchGenre = selectedGenre === 'all' || s.category === selectedGenre;
      const matchSearch =
        searchQuery.trim() === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchGenre && matchSearch;
    });
  }, [services, selectedGenre, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16 text-[#e2e2e2] font-body">
      {/* Top Banner & Search Header */}
      <div className="relative pt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1f1f1f] border border-[#5c3f45]/30 text-xs font-bold text-[#ffb1c3] mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00dbe9] animate-pulse"></span>
              <span>GOOGLE STITCH DISCOVER</span>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl font-black text-white tracking-tight">
              Explore Kerala Services
            </h1>
          </div>

          {onSwitchToFeed && (
            <button
              onClick={() => {
                sound.pop();
                onSwitchToFeed();
              }}
              className="bg-gradient-to-r from-[#ffb1c3] to-[#ff4b89] text-[#66002c] font-black px-4 py-2 sm:px-5 sm:py-2.5 rounded-full neon-glow text-xs sm:text-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-[#66002c]" />
              <span>Watch Reels</span>
            </button>
          )}
        </div>

        {/* Prominent Search Bar (Exact Neon Noir rounded-full) */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 sm:left-5 flex items-center pointer-events-none text-[#e5bcc4]/60">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mechanics, AC repair, car wash, plumbers..."
            className="w-full bg-[#2a2a2a] border-none rounded-full py-4 pl-12 sm:pl-14 pr-6 text-white placeholder-[#e5bcc4]/40 focus:outline-none focus:ring-2 focus:ring-[#ffb1c3]/50 transition-all text-sm sm:text-base shadow-xl"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-xs font-bold text-[#e5bcc4] hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Genre Tags Horizontal Scroll */}
        <div className="flex overflow-x-auto gap-2.5 mb-8 no-scrollbar -mx-2 px-2 py-1">
          {DISCOVER_GENRES.map((genre) => {
            const isActive = selectedGenre === genre.id;
            return (
              <button
                key={genre.id}
                onClick={() => {
                  sound.click();
                  setSelectedGenre(genre.id);
                }}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#ffb1c3] to-[#ff4b89] text-[#66002c] shadow-[0_0_15px_rgba(255,75,137,0.35)] scale-105'
                    : 'bg-[#353535]/70 hover:bg-[#353535] text-[#e5bcc4] hover:text-white'
                }`}
              >
                {genre.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Editorial Card (Sunday Morning Vibes / Rapid Rescue) */}
      <div className="relative h-64 sm:h-72 rounded-3xl overflow-hidden group shadow-2xl border border-white/5">
        <img
          src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1200&q=80"
          alt="Kerala 24/7 Roadside Rescue"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e] via-[#0e0e0e]/75 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col justify-center p-6 sm:p-10 max-w-md">
          <span className="text-[#00dbe9] text-[11px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00dbe9] animate-ping"></span>
            Curated Rescue Collection
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl font-black text-white leading-tight mb-2 drop-shadow">
            24/7 Kerala Roadside Rescue
          </h2>
          <p className="text-[#e5bcc4] text-xs sm:text-sm line-clamp-2 mb-4 font-medium">
            Jumpstart, flat tyre replacement, towing, and key lockout assistance dispatched within 15 minutes across all 14 districts.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.pop();
                setSelectedGenre('Mechanic & Roadside Assistance');
              }}
              className="w-fit px-6 py-2.5 rounded-full bg-[#ff4b89] hover:bg-[#ff4b89]/90 text-white font-black text-xs sm:text-sm flex items-center gap-2 neon-glow transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore Roadside</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Section: Masonry Grid of Services */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h2 className="font-headline text-2xl font-bold text-white">
              {selectedGenre === 'all' ? 'All Doorstep Services' : selectedGenre}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#2a2a2a] text-[#ffb1c3] text-xs font-bold">
              {filteredServices.length}
            </span>
          </div>
          <span className="text-[#00dbe9] text-xs font-bold cursor-pointer hover:underline">
            {selectedLocation.name.split('(')[0]}
          </span>
        </div>

        {/* Masonry Layout */}
        <div className="masonry-grid">
          {filteredServices.map((service) => {
            const displayPrice = service.basePrice || (service.tiers && service.tiers[0]?.price) || 299;
            return (
              <div
                key={service.id}
                onClick={() => {
                  sound.click();
                  onSelectService(service);
                }}
                className="masonry-item relative group rounded-2xl overflow-hidden bg-[#1f1f1f] shadow-xl border border-white/5 hover:border-[#ffb1c3]/40 transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-video sm:aspect-[4/3] overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.title}
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent"></div>

                  {/* Badge */}
                  {service.badge && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#00a0aa]/80 backdrop-blur-md border border-[#00dbe9]/30 text-[10px] font-extrabold text-[#7df4ff] tracking-wider uppercase">
                      {service.badge}
                    </div>
                  )}

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white text-xs font-bold">
                    ★ 4.9
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 space-y-2">
                  <p className="font-headline text-base sm:text-lg font-bold leading-snug text-white group-hover:text-[#ffb1c3] transition-colors">
                    {service.title}
                  </p>
                  <p className="text-[#e5bcc4] text-xs line-clamp-2 leading-relaxed">
                    {service.tagline}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-white/5">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-[#e5bcc4]/70 block font-semibold">
                        Starts At
                      </span>
                      <span className="font-headline text-base font-black text-white">
                        ₹{displayPrice}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-[#00dbe9] bg-[#00dbe9]/10 px-2 py-0.5 rounded-full">
                        ⚡ {service.eta || '15-20m'}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-[#ff4b89] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredServices.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-[#1f1f1f] rounded-3xl border border-white/5">
            <div className="w-14 h-14 rounded-full bg-[#2a2a2a] text-[#ffb1c3] flex items-center justify-center mx-auto text-2xl font-bold">
              🔍
            </div>
            <h3 className="font-headline text-lg font-bold text-white">No services found</h3>
            <p className="text-xs text-[#e5bcc4]">Try searching with a different term or clear filters</p>
            <button
              onClick={() => {
                setSelectedGenre('all');
                setSearchQuery('');
              }}
              className="px-5 py-2 rounded-full bg-[#ff4b89] text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Vibes & Moods Quick Grid (Exact stitch screen 2) */}
      <section className="pt-4">
        <h3 className="font-headline text-xl font-bold text-white mb-4">
          Services By Need & Mood
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div
            onClick={() => {
              sound.click();
              setSelectedGenre('Mechanic & Roadside Assistance');
            }}
            className="bg-[#2a2a2a] hover:bg-[#353535] p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all border border-white/5 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#ff4b89]/20 flex items-center justify-center mb-2.5 text-[#ff4b89] group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <p className="font-headline font-bold text-sm text-white">Emergency SOS</p>
            <p className="text-[#e5bcc4] text-[11px] mt-0.5">Under 15 Mins</p>
          </div>

          <div
            onClick={() => {
              sound.click();
              setSelectedGenre('Car Spa & Detailing');
            }}
            className="bg-[#2a2a2a] hover:bg-[#353535] p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all border border-white/5 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#00dbe9]/20 flex items-center justify-center mb-2.5 text-[#00dbe9] group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <p className="font-headline font-bold text-sm text-white">Sunday Spa</p>
            <p className="text-[#e5bcc4] text-[11px] mt-0.5">Car Deep Clean</p>
          </div>

          <div
            onClick={() => {
              sound.click();
              setSelectedGenre('Appliance Care & Servicing');
            }}
            className="bg-[#2a2a2a] hover:bg-[#353535] p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all border border-white/5 group"
          >
            <div className="w-12 h-12 rounded-full bg-[#ffb1c3]/20 flex items-center justify-center mb-2.5 text-[#ffb1c3] group-hover:scale-110 transition-transform">
              <Coffee className="w-6 h-6" />
            </div>
            <p className="font-headline font-bold text-sm text-white">Home Chill</p>
            <p className="text-[#e5bcc4] text-[11px] mt-0.5">AC & Chill Coil</p>
          </div>

          <div
            onClick={() => {
              sound.click();
              setSelectedGenre('Acting Driver');
            }}
            className="bg-[#2a2a2a] hover:bg-[#353535] p-4 rounded-2xl flex flex-col items-center text-center cursor-pointer transition-all border border-white/5 group"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2.5 text-emerald-400 group-hover:scale-110 transition-transform">
              <Moon className="w-6 h-6" />
            </div>
            <p className="font-headline font-bold text-sm text-white">Night Pilot</p>
            <p className="text-[#e5bcc4] text-[11px] mt-0.5">Safe Chauffeur</p>
          </div>
        </div>
      </section>
    </div>
  );
};
