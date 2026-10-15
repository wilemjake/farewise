import React from 'react';
import heroImg from '../assets/images/singapore_mobility_hero_1792051812100.jpg';

interface HeroBannerProps {
  onQuickExplore: () => void;
  onOpenDriverInsight: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onQuickExplore,
  onOpenDriverInsight,
}) => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl mb-8">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImg}
          alt="Singapore Marina Bay illuminated expressway traffic"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 max-w-3xl">
        <div className="text-xs font-semibold tracking-wider uppercase text-emerald-400 mb-3">
          Singapore Unified Mobility Aggregator
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4 text-balance">
          Compare Live Fares Across Grab, Gojek, TADA & Taxi in One Place
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 max-w-2xl">
          Save time and money every trip. Real-time pricing, instant pickup estimates, and Shopback cashback on every ride — zero markup for riders, zero hidden deductions for drivers.
        </p>

        {/* Value Prop Badges (Clean metadata format with separators) */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-3 text-xs text-slate-300 mb-6 font-medium">
          <span className="text-emerald-300">Grab · Gojek · TADA · CDG Zig</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span>Up to 5% Shopback Cashback</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span>Real-time ERP & Peak Surge</span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span>100% Free Public Tool</span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onQuickExplore}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            Compare Fares Now
          </button>
          <button
            onClick={onOpenDriverInsight}
            className="px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500"
          >
            Driver Commission Transparency
          </button>
        </div>
      </div>
    </div>
  );
};
