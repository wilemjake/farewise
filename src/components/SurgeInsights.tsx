import React from 'react';
import { SingaporeTrafficContext } from '../types/ride';
import { TrendingUp, AlertTriangle, CloudRain, Clock, ShieldCheck, DollarSign } from 'lucide-react';

interface SurgeInsightsProps {
  trafficContext: SingaporeTrafficContext;
}

export const SurgeInsights: React.FC<SurgeInsightsProps> = ({ trafficContext }) => {
  const hourlyData = [
    { hour: '06:00', multiplier: 1.0, label: 'Off-Peak' },
    { hour: '07:30', multiplier: 1.45, label: 'Morning Peak' },
    { hour: '08:30', multiplier: 1.6, label: 'Morning High Peak' },
    { hour: '10:00', multiplier: 1.1, label: 'Mid-Morning' },
    { hour: '12:30', multiplier: 1.15, label: 'Lunch Rush' },
    { hour: '15:00', multiplier: 1.05, label: 'Mid-Afternoon' },
    { hour: '17:30', multiplier: 1.55, label: 'Evening Peak' },
    { hour: '18:45', multiplier: 1.7, label: 'Evening Peak CBD' },
    { hour: '20:30', multiplier: 1.25, label: 'Dinner / Events' },
    { hour: '22:30', multiplier: 1.15, label: 'Post-Nightlife' },
    { hour: '00:00', multiplier: 1.35, label: 'Late Night Surcharge (Taxi 50%)' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Live Singapore Surge Watch & ERP Intelligence
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitor peak surges, rain weather escalations, and LTA ERP gantries across Singapore
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
              Current Period: {trafficContext.peakType}
            </span>
          </div>
        </div>

        {/* Hourly Trend Bar Graph */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
            <span>Estimated Average Fare Multiplier By Hour of Day (Singapore)</span>
            <span className="text-[11px] text-slate-500 font-mono-nums">Baseline = 1.0x</span>
          </div>

          <div className="grid grid-cols-11 gap-1.5 sm:gap-2 h-36 items-end pt-4 pb-2 px-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {hourlyData.map((d, i) => {
              const heightPct = Math.round(((d.multiplier - 0.9) / 0.9) * 100);
              const isHigh = d.multiplier >= 1.45;

              return (
                <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-800 border border-slate-700 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none shadow-lg">
                    {d.hour} · {d.multiplier.toFixed(2)}x ({d.label})
                  </div>

                  {/* Bar */}
                  <div
                    style={{ height: `${Math.min(100, Math.max(15, heightPct))}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isHigh
                        ? 'bg-rose-500/80 group-hover:bg-rose-400'
                        : 'bg-emerald-500/70 group-hover:bg-emerald-400'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 font-mono-nums shrink-0">
                    {d.hour.slice(0, 2)}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Operator Comparison Matrix & Strategy Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: TADA Zero Commission Edge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
            TADA Platform Architecture
          </div>
          <h3 className="text-base font-bold text-white mb-2">0% Driver Commission</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Because TADA charges zero commission to drivers (only a fixed 50¢ platform fee), drivers take home full earnings without aggressive fare hikes. During sudden rain showers, TADA fares are typically 15–25% lower than competitors.
          </p>
          <div className="text-xs text-slate-400 font-medium">
            Best for: Heavy rain & peak CBD commutes
          </div>
        </div>

        {/* Card 2: Grab & Gojek Dynamic Algorithms */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            Grab & Gojek Density
          </div>
          <h3 className="text-base font-bold text-white mb-2">Largest Fleet Coverage</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Grab and Gojek maintain Singapore's densest driver supply. When you urgently need a ride within 2–3 minutes from residential estates or airport arrivals, their pickup ETAs often beat all other options.
          </p>
          <div className="text-xs text-slate-400 font-medium">
            Best for: Urgent meetings & fast pickups
          </div>
        </div>

        {/* Card 3: Regulated Taxis (ComfortDelGro) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            ComfortDelGro Zig
          </div>
          <h3 className="text-base font-bold text-white mb-2">Metered Predictability</h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Standard metered taxis operate under LTA regulatory caps (standard flag-down S$4.40 + 25% peak rule). When private-hire apps spike to 2.0x, metered taxis become significantly cheaper for long cross-island journeys.
          </p>
          <div className="text-xs text-slate-400 font-medium">
            Best for: Super high peak & expressway bus lanes
          </div>
        </div>
      </div>

      {/* LTA ERP Gantry Schedule Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3">
          Singapore Active Electronic Road Pricing (ERP) Rates
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-medium">Central Expressway (CTE)</div>
            <div className="text-base font-bold font-mono-nums text-white mt-1">S$1.00 – S$3.00</div>
            <div className="text-[11px] text-slate-500">Peak: 07:30 – 09:30, 18:00 – 19:30</div>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-medium">East Coast Parkway (ECP)</div>
            <div className="text-base font-bold font-mono-nums text-white mt-1">S$1.00 – S$2.00</div>
            <div className="text-[11px] text-slate-500">Peak: 08:00 – 09:00 City-bound</div>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-medium">Marina Coastal Expressway (MCE)</div>
            <div className="text-base font-bold font-mono-nums text-white mt-1">S$1.00 – S$2.50</div>
            <div className="text-[11px] text-slate-500">Peak: 08:30 – 09:30 West-bound</div>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-slate-400 font-medium">Ayer Rajah Expressway (AYE)</div>
            <div className="text-base font-bold font-mono-nums text-white mt-1">S$1.00 – S$2.00</div>
            <div className="text-[11px] text-slate-500">Peak: 07:30 – 09:00 City-bound</div>
          </div>
        </div>
      </div>
    </div>
  );
};
