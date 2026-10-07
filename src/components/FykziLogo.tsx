import React from 'react';

interface FykziLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full';
  showBadge?: boolean;
  isDark?: boolean;
  className?: string;
}

export const FykziLogo: React.FC<FykziLogoProps> = ({
  size = 'md',
  variant = 'full',
  showBadge = true,
  isDark = true,
  className = ''
}) => {
  const iconDimensions = {
    sm: { box: 32, icon: 20 },
    md: { box: 40, icon: 24 },
    lg: { box: 48, icon: 30 },
    xl: { box: 56, icon: 36 }
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  }[size];

  return (
    <div className={`flex items-center space-x-2 sm:space-x-2.5 select-none ${className}`}>
      {/* Dynamic F + Precision Verification Glyph */}
      <div
        style={{ width: iconDimensions.box, height: iconDimensions.box }}
        className="relative rounded-2xl p-0.5 bg-gradient-to-tr from-blue-600 via-blue-500 to-emerald-400 shadow-md transition-transform duration-200 shrink-0 group-hover:scale-105"
      >
        <div className="w-full h-full bg-[#0F172A] rounded-[14px] flex items-center justify-center p-1.5 overflow-hidden">
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Dark Navy Background Accent Radial Glow */}
            <circle cx="20" cy="20" r="16" fill="#2563EB" fillOpacity="0.15" />
            
            {/* Vertical Stem of 'F' in Electric Blue (#2563EB) */}
            <path
              d="M10 9C10 7.89543 10.8954 7 12 7H16C17.1046 7 18 7.89543 18 9V31C18 32.1046 17.1046 33 16 33H12C10.8954 33 10 32.1046 10 31V9Z"
              fill="#2563EB"
            />

            {/* Top Crossbar of 'F' in Electric Blue with sleek rounded terminal */}
            <path
              d="M16 7H29C30.6569 7 32 8.34315 32 10C32 11.6569 30.6569 13 29 13H16V7Z"
              fill="#3B82F6"
            />

            {/* Middle Bar: Precision Verification Spark & Checkmark in Emerald Green (#22C55E) */}
            <path
              d="M16 19C16 18.4477 16.4477 18 17 18H25.5C26.3284 18 27 18.6716 27 19.5C27 20.3284 26.3284 21 25.5 21H18V25C18 25.5523 17.5523 26 17 26C16.4477 26 16 25.5523 16 25V19Z"
              fill="#22C55E"
            />

            {/* Verified Spark Accent Diamond at the tip */}
            <polygon
              points="28,20 32,16 30,22 34,22"
              fill="#22C55E"
              opacity="0.95"
            />
          </svg>
        </div>
      </div>

      {/* Brand Typography (Wordmark) */}
      {variant === 'full' && (
        <div className="leading-tight">
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <span
              className={`font-black tracking-tight font-sans ${textSizes} ${
                isDark ? 'text-white' : 'text-[#0F172A]'
              }`}
            >
              Fykzi
            </span>
            {showBadge && (
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full border border-blue-500/20">
                Kerala
              </span>
            )}
          </div>
          <span className="text-[9px] text-slate-400 font-bold hidden sm:inline-block">
            ഫിക്സി • Doorstep Services
          </span>
        </div>
      )}
    </div>
  );
};

// Backwards compatibility export
export const FyksoLogo = FykziLogo;
