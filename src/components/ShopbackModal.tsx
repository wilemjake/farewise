import React, { useState } from 'react';
import { X, Gift, CheckCircle2, CreditCard, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface ShopbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onRedeem: (amount: number) => void;
}

export const ShopbackModal: React.FC<ShopbackModalProps> = ({
  isOpen,
  onClose,
  balance,
  onRedeem,
}) => {
  const [phone, setPhone] = useState('+65 9123 4567');
  const [isLinked, setIsLinked] = useState(true);
  const [redeemSuccess, setRedeemSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRedeem = () => {
    if (balance <= 0) return;
    onRedeem(balance);
    setRedeemSuccess(true);
    setTimeout(() => {
      setRedeemSuccess(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-extrabold text-xs">
              SB
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Shopback Travel Cashback</h3>
              <p className="text-xs text-slate-400">Earn automatic rebates on every Grab, Gojek, TADA & Taxi booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="my-5 p-5 rounded-xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-slate-950 border border-rose-900/50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-rose-300">
              Withdrawable Cashback Balance
            </div>
            <div className="text-3xl font-extrabold font-mono-nums text-white mt-1">
              S${balance.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {isLinked ? `Linked to Singapore Mobile ${phone}` : 'Account not linked'}
            </div>
          </div>

          <button
            onClick={handleRedeem}
            disabled={balance <= 0}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
          >
            {redeemSuccess ? 'Transferred to PayNow!' : 'Withdraw to PayNow'}
          </button>
        </div>

        {redeemSuccess && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Success! S${balance.toFixed(2)} transferred to your linked PayNow account.</span>
          </div>
        )}

        {/* Partner Rebate Rates */}
        <div className="space-y-3 mb-5">
          <div className="text-xs font-semibold text-slate-300">Active Ride Cashback Rates</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <div className="font-semibold text-amber-400">TADA</div>
              <div className="text-lg font-bold font-mono-nums text-white mt-0.5">5.0%</div>
              <div className="text-[10px] text-slate-500">Highest return</div>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <div className="font-semibold text-cyan-400">Gojek</div>
              <div className="text-lg font-bold font-mono-nums text-white mt-0.5">4.5%</div>
              <div className="text-[10px] text-slate-500">Auto credited</div>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <div className="font-semibold text-emerald-400">Grab</div>
              <div className="text-lg font-bold font-mono-nums text-white mt-0.5">4.0%</div>
              <div className="text-[10px] text-slate-500">+ GrabRewards</div>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 text-center">
              <div className="font-semibold text-blue-400">Taxi (CDG)</div>
              <div className="text-lg font-bold font-mono-nums text-white mt-0.5">3.0%</div>
              <div className="text-[10px] text-slate-500">Zig points eligible</div>
            </div>
          </div>
        </div>

        {/* Credit Card Stacking Commission Perk */}
        <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Singapore Credit Card Stacking Perk</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Stack an extra 5%–8% cashback using <strong className="text-slate-300">DBS Live Fresh</strong>, <strong className="text-slate-300">OCBC 365</strong>, or <strong className="text-slate-300">Citi Cash Back</strong> when paying directly in Grab, Gojek, TADA, or CDG Zig.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
