import React, { useState } from 'react';
import { DollarSign, ShieldCheck, HeartHandshake, Award, Info } from 'lucide-react';

export const DriverPartnerInsight: React.FC = () => {
  const [dailyGross, setDailyGross] = useState<number>(240);

  // Take-home calculation for Singapore private-hire & taxi drivers
  const tadaNet = dailyGross - (12 * 0.50); // 12 trips * 50 cents fee
  const gojekNet = dailyGross * 0.90; // 10% commission
  const grabNet = dailyGross * 0.80; // 20% commission

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            Singapore Driver & Rider Fairness Initiative
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Commission Transparency & Driver Net Earnings
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            In Singapore's ride-hailing ecosystem, platform commission structures directly affect driver take-home pay and passenger surge pricing. Here is how Singapore's top operators compare.
          </p>
        </div>
      </div>

      {/* Driver Net Take-Home Interactive Calculator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Daily Driver Earnings Calculator</h3>
            <p className="text-xs text-slate-400">
              Drag to simulate daily gross trip revenue and compare driver take-home across platforms
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Gross Daily Fares:</span>
            <span className="text-lg font-bold font-mono-nums text-white">S${dailyGross}</span>
          </div>
        </div>

        {/* Slider */}
        <div className="mb-8">
          <input
            type="range"
            min="100"
            max="450"
            step="10"
            value={dailyGross}
            onChange={(e) => setDailyGross(Number(e.target.value))}
            className="w-full accent-emerald-400 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono-nums mt-1">
            <span>S$100 (Part-time)</span>
            <span>S$240 (Standard shift)</span>
            <span>S$450 (Full peak weekend)</span>
          </div>
        </div>

        {/* 3 Operator Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* TADA */}
          <div className="bg-slate-950 border border-amber-500/50 rounded-2xl p-5 relative overflow-hidden">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              TADA (Zero Commission)
            </div>
            <div className="text-3xl font-extrabold font-mono-nums text-white my-2">
              S${tadaNet.toFixed(2)}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mb-3">
              +S${(tadaNet - grabNet).toFixed(2)} vs Grab daily
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Commission: <strong className="text-slate-200">0%</strong></div>
              <div>Platform Fee: <strong className="text-slate-200">50¢ flat / trip</strong></div>
              <div>Driver keeps 97.5% of total gross</div>
            </div>
          </div>

          {/* Gojek */}
          <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              Gojek
            </div>
            <div className="text-3xl font-extrabold font-mono-nums text-white my-2">
              S${gojekNet.toFixed(2)}
            </div>
            <div className="text-xs text-cyan-300 font-medium mb-3">
              Balanced fleet incentives
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Commission: <strong className="text-slate-200">10%</strong></div>
              <div>Take home: <strong className="text-slate-200">90% of fare</strong></div>
              <div>Consistent weekly quest bonuses</div>
            </div>
          </div>

          {/* Grab */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Grab
            </div>
            <div className="text-3xl font-extrabold font-mono-nums text-white my-2">
              S${grabNet.toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 mb-3">
              Highest trip volume & density
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <div>Commission: <strong className="text-slate-200">20%</strong></div>
              <div>Take home: <strong className="text-slate-200">80% of fare</strong></div>
              <div>Largest passenger demand base</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Guarantees from CSV */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-3.5">
          <HeartHandshake className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-white text-sm mb-1">Zero Passenger Markup</h4>
            <p className="text-slate-400 leading-relaxed">
              FareSG never charges any booking fee or hidden surcharge. You pay the exact official price directly to the ride provider.
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-start gap-3.5">
          <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-bold text-white text-sm mb-1">Shopback Travel Partner Cashback</h4>
            <p className="text-slate-400 leading-relaxed">
              Instead of paying platform fees, commuters earn real cash rebates on their rides via our Shopback and payment provider partnerships.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
