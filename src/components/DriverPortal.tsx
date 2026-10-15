import React, { useState } from 'react';
import logoImg from '../assets/images/farewise_logo_1792052481411.jpg';
import { Shield, Lock, ArrowLeft, CheckCircle2, TrendingUp, AlertTriangle, Car, DollarSign, Clock, MapPin, Users, Award } from 'lucide-react';

interface DriverPortalProps {
  onBackToRider: () => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ onBackToRider }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMethod, setAuthMethod] = useState<'singpass' | 'pdvl'>('pdvl');
  const [pdvlNumber, setPdvlNumber] = useState('P1284918X');
  const [phone, setPhone] = useState('+65 9456 7812');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [dailyGross, setDailyGross] = useState(250);

  // Take-home calculation for Singapore private-hire & taxi drivers
  const tadaNet = dailyGross - (12 * 0.50); // 12 trips * 50 cents fee
  const gojekNet = dailyGross * 0.90; // 10% commission
  const grabNet = dailyGross * 0.80; // 20% commission

  const handleDemoLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6">
      {!isLoggedIn ? (
        /* Driver Login Screen */
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Logo & Portal Title */}
          <div className="text-center mb-6">
            <div className="inline-block relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-700 shadow-lg mb-3">
              <img
                src={logoImg}
                alt="FareWise Logo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Driver Partner Portal
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
              FareWise for Drivers
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Separate secure portal for Singapore PDVL / TDVL private-hire and taxi drivers to track multi-platform commissions and live surge hotspots.
            </p>
          </div>

          {/* Login Mode Tabs */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
            <button
              type="button"
              onClick={() => setAuthMethod('pdvl')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                authMethod === 'pdvl'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PDVL / TDVL Licence
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('singpass')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                authMethod === 'singpass'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Singpass Login
            </button>
          </div>

          {authMethod === 'pdvl' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  LTA Vocational Licence No. (PDVL / TDVL)
                </label>
                <input
                  type="text"
                  value={pdvlNumber}
                  onChange={(e) => setPdvlNumber(e.target.value)}
                  placeholder="e.g. P1284918X"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white uppercase font-mono-nums focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Registered Singapore Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+65 9123 4567"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono-nums focus:outline-none focus:border-emerald-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Log In to Driver Dashboard
              </button>
            </form>
          ) : (
            <div className="space-y-4 py-2 text-center">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-sm">
                  sp
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Singpass App Scan</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Log in with your National Digital Identity
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-all"
                >
                  Log In with Singpass App
                </button>
              </div>
            </div>
          )}

          {/* Quick Demo Login Option */}
          <div className="mt-5 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span>Instant Demo Driver Access (Uncle Tan - PDVL P12849X)</span>
            </button>
          </div>

          {/* Return to Rider App */}
          <div className="mt-5 text-center">
            <button
              onClick={onBackToRider}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to FareWise Rider App</span>
            </button>
          </div>
        </div>
      ) : (
        /* Logged In Driver Dashboard */
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Driver Header Profile */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/30">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white tracking-tight">Tan Ah Teck (Uncle Tan)</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                    Verified Driver
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                  <span>PDVL: P1284918X</span>
                  <span>·</span>
                  <span>Toyota Prius Hybrid</span>
                  <span>·</span>
                  <span>Rating: 4.96 ★</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
              >
                Log Out
              </button>
              <button
                onClick={onBackToRider}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-md"
              >
                Switch to Rider View
              </button>
            </div>
          </div>

          {/* Hotspots & Airport Queue Monitor */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Live Demand Hotspots & Airport Holding Queues</h3>
                <p className="text-xs text-slate-400">Current driver queues and estimated dispatch wait times across Singapore</p>
              </div>
              <span className="text-xs text-emerald-400 font-medium font-mono-nums">Updated 30s ago</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">Changi Airport (T1-T4)</span>
                  <span className="text-emerald-400 font-mono-nums text-[11px]">18 mins wait</span>
                </div>
                <div className="text-xs text-slate-400">T3 Arrival flight surges arriving from Tokyo & London</div>
                <div className="text-[11px] text-amber-400 mt-2 font-medium">+S$6.00 Airport surcharge active</div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">Marina Bay Sands</span>
                  <span className="text-rose-400 font-mono-nums text-[11px]">High Demand</span>
                </div>
                <div className="text-xs text-slate-400">Hotel Tower 3 & Convention Centre pickup bay</div>
                <div className="text-[11px] text-emerald-400 mt-2 font-medium">Surge 1.45x active on Grab/Gojek</div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">Singapore Expo / Changi Biz</span>
                  <span className="text-slate-400 font-mono-nums text-[11px]">Moderate</span>
                </div>
                <div className="text-xs text-slate-400">FinTech Conference concluding 18:00</div>
                <div className="text-[11px] text-cyan-400 mt-2 font-medium">Expected surge window: 17:45 - 19:00</div>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white">Woodlands Checkpoint</span>
                  <span className="text-emerald-400 font-mono-nums text-[11px]">Steady</span>
                </div>
                <div className="text-xs text-slate-400">Causeway commuter return flow</div>
                <div className="text-[11px] text-slate-400 mt-2 font-medium">Normal non-surge rates</div>
              </div>
            </div>
          </div>

          {/* Driver Commission Calculator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Commission Transparency & Daily Net Calculator</h3>
                <p className="text-xs text-slate-400">
                  Compare how much you take home across TADA, Gojek, and Grab from the exact same gross fares
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Gross Daily Fares:</span>
                <span className="text-lg font-bold font-mono-nums text-white">S${dailyGross}</span>
              </div>
            </div>

            {/* Slider */}
            <div className="mb-6">
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
                <span>S$100 (Part-time shift)</span>
                <span>S$250 (Full weekday shift)</span>
                <span>S$450 (Weekend peak marathon)</span>
              </div>
            </div>

            {/* 3 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 border border-amber-500/60 rounded-2xl p-5">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  TADA (0% Commission)
                </div>
                <div className="text-3xl font-extrabold font-mono-nums text-white my-2">
                  S${tadaNet.toFixed(2)}
                </div>
                <div className="text-xs text-emerald-400 font-semibold mb-3">
                  +S${(tadaNet - grabNet).toFixed(2)} more take-home vs Grab!
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Commission: <strong className="text-white">0%</strong></div>
                  <div>Platform fee: <strong className="text-white">50¢ flat / trip</strong></div>
                  <div>No penalty for rejecting long-distance trips</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-cyan-500/40 rounded-2xl p-5">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
                  Gojek (10% Commission)
                </div>
                <div className="text-3xl font-extrabold font-mono-nums text-white my-2">
                  S${gojekNet.toFixed(2)}
                </div>
                <div className="text-xs text-cyan-300 font-medium mb-3">
                  Balanced commission with weekly target points
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Commission: <strong className="text-white">10%</strong></div>
                  <div>Take-home: <strong className="text-white">90% of gross</strong></div>
                  <div>Weekly quest incentive payouts</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  Grab (20% Commission)
                </div>
                <div className="text-3xl font-extrabold font-mono-nums text-white my-2">
                  S${grabNet.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 mb-3">
                  Highest customer booking volume in Singapore
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Commission: <strong className="text-white">20%</strong></div>
                  <div>Take-home: <strong className="text-white">80% of gross</strong></div>
                  <div>GrabBenefits fuel & maintenance discounts</div>
                </div>
              </div>
            </div>
          </div>

          {/* Singapore ERP Surcharge Reference */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-2">Driver ERP Gantry Toll Pass-through Reference</h3>
            <p className="text-xs text-slate-400 mb-4">
              Remember to claim official ERP toll pass-through in app when passing gantries with passengers on board:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">CTE (AMK to CBD)</div>
                <div className="text-slate-400 mt-1">07:30 – 09:30: S$1.00 – S$3.00</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">ECP (Fort Road & Marina)</div>
                <div className="text-slate-400 mt-1">08:00 – 09:00: S$1.00 – S$2.00</div>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="font-semibold text-white">AYE (Jurong to City)</div>
                <div className="text-slate-400 mt-1">07:30 – 09:00: S$1.00 – S$2.00</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
