import React from 'react';
import { RideOption } from '../types/ride';
import { Clock, Users, ShieldCheck, ExternalLink, Zap, Gift, CheckCircle2 } from 'lucide-react';

interface RideComparisonListProps {
  options: RideOption[];
  onBookRide: (option: RideOption) => void;
  onHoverProvider: (provider: any) => void;
  onLeaveProvider: () => void;
}

export const RideComparisonList: React.FC<RideComparisonListProps> = ({
  options,
  onBookRide,
  onHoverProvider,
  onLeaveProvider,
}) => {
  if (options.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        No ride options found matching your filter criteria. Try selecting "All Rides".
      </div>
    );
  }

  const getProviderBadge = (provider: string) => {
    switch (provider) {
      case 'grab':
        return {
          bg: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
          dot: 'bg-emerald-400',
          accent: 'emerald',
          btnBg: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
          tag: 'Grab Official',
        };
      case 'gojek':
        return {
          bg: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
          dot: 'bg-cyan-400',
          accent: 'cyan',
          btnBg: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950',
          tag: 'Gojek Official',
        };
      case 'tada':
        return {
          bg: 'bg-amber-950/60 border-amber-500/40 text-amber-300',
          dot: 'bg-amber-400',
          accent: 'amber',
          btnBg: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
          tag: '0% Driver Fee',
        };
      case 'taxi':
      default:
        return {
          bg: 'bg-blue-950/60 border-blue-500/40 text-blue-300',
          dot: 'bg-blue-400',
          accent: 'blue',
          btnBg: 'bg-blue-500 hover:bg-blue-400 text-white',
          tag: 'Meter / Flat',
        };
    }
  };

  return (
    <div className="space-y-3.5 mb-8">
      {options.map((ride) => {
        const badge = getProviderBadge(ride.provider);

        return (
          <div
            key={ride.id}
            onMouseEnter={() => onHoverProvider(ride.provider)}
            onMouseLeave={onLeaveProvider}
            className={`relative bg-slate-900 border transition-all duration-200 rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl ${
              ride.isCheapest
                ? 'border-emerald-500/60 ring-1 ring-emerald-500/30'
                : ride.isBestValue
                ? 'border-cyan-500/60 ring-1 ring-cyan-500/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Top highlight banners */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${badge.bg}`}>
                  {ride.providerName}
                </span>

                <span className="text-xs text-slate-400 font-medium">
                  {ride.category === 'xl' ? '6-Seater MPV' : ride.category === 'premium' ? 'Executive' : 'Standard 4-Pax'}
                </span>

                {ride.surgeMultiplier > 1.05 && (
                  <span className="text-xs text-amber-400 font-mono-nums font-semibold">
                    {ride.surgeMultiplier.toFixed(2)}x Surge
                  </span>
                )}
              </div>

              {/* Value Tags */}
              <div className="flex items-center gap-2">
                {ride.isCheapest && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
                    Lowest Price
                  </span>
                )}
                {ride.isFastest && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/50">
                    Fastest ETA
                  </span>
                )}
                {ride.isBestValue && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/50">
                    Best Value
                  </span>
                )}
              </div>
            </div>

            {/* Main Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Service & Features */}
              <div className="md:col-span-5 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {ride.serviceName}
                  </h3>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{ride.capacity}</span>
                  </span>
                </div>

                <div className="text-xs text-slate-400 line-clamp-1">
                  {ride.commissionNote}
                </div>

                {/* Features (clean unboxed text with separators) */}
                <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
                  {ride.features.slice(0, 2).map((feat, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span aria-hidden="true">·</span>}
                      <span className="truncate">{feat}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Pickup ETA & Trip Time */}
              <div className="md:col-span-3 flex md:flex-col justify-between md:justify-center items-start gap-1 py-1 md:py-0 border-y md:border-y-0 md:border-x border-slate-800/80 md:px-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Pickup in <strong className="text-white font-mono-nums">{ride.pickupEtaMinutes} mins</strong>
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Journey: <span className="font-mono-nums text-slate-300">~{ride.tripDurationMinutes} mins</span>
                </div>
              </div>

              {/* Fare & Shopback Cashback & CTA */}
              <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-4">
                <div className="text-left md:text-right">
                  <div className="flex items-baseline md:justify-end gap-1">
                    <span className="text-xs text-slate-400 font-semibold">S$</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-nums tracking-tight">
                      {ride.estimatedFare.toFixed(2)}
                    </span>
                  </div>

                  {/* Shopback Cashback highlight */}
                  <div className="flex items-center md:justify-end gap-1 text-xs text-rose-400 font-medium">
                    <Gift className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>
                      Earn <strong className="font-mono-nums">S${ride.shopbackCashbackAmount.toFixed(2)}</strong> back
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onBookRide(ride)}
                  className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight shadow-md transition-all active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${badge.btnBg}`}
                >
                  <span>Book {ride.providerName}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
