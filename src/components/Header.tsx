import React from 'react';
import logoImg from '../assets/images/farewise_logo_1792052481411.jpg';
import { Car } from 'lucide-react';

interface HeaderProps {
  activeTab: 'compare' | 'map' | 'surge' | 'history' | 'driver';
  onTabChange: (tab: 'compare' | 'map' | 'surge' | 'history' | 'driver') => void;
  onOpenShopbackModal: () => void;
  shopbackBalance: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenShopbackModal,
  shopbackBalance,
}) => {
  const isDriverView = activeTab === 'driver';

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 h-16">
        {/* Zone 1: Brand Wordmark & Logo */}
        <button
          onClick={() => onTabChange('compare')}
          className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg group"
        >
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-700/80 shadow-md group-hover:border-emerald-500/60 transition-colors shrink-0">
            <img
              src={logoImg}
              alt="FareWise Brand Logo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0">
              Fare<span className="text-emerald-400">Wise</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
              SG
            </span>
          </div>
        </button>

        {/* Zone 2: Primary Rider Nav Links (Primary page is STRICTLY for riders) */}
        {!isDriverView ? (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <button
              onClick={() => onTabChange('compare')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'compare' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-white'
              }`}
            >
              Compare Fares
            </button>
            <button
              onClick={() => onTabChange('map')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'map' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-white'
              }`}
            >
              Route Radar
            </button>
            <button
              onClick={() => onTabChange('surge')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'surge' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-white'
              }`}
            >
              Surge Watch
            </button>
            <button
              onClick={() => onTabChange('history')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                activeTab === 'history' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-white'
              }`}
            >
              Trip History
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Separate Portal:</span>
            <span className="text-emerald-400 font-bold">FareWise Driver Partner Network</span>
          </div>
        )}

        {/* Zone 3: Actions - Shopback Rewards + Driver Portal Gateway */}
        <div className="flex items-center gap-2.5 shrink-0">
          {!isDriverView ? (
            <>
              {/* Separate Driver Portal Gateway button */}
              <button
                onClick={() => onTabChange('driver')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
                title="Log in to FareWise Driver Portal"
              >
                <Car className="w-3.5 h-3.5 text-slate-400" />
                <span>Driver Login</span>
              </button>

              {/* Primary Rider Cashback Action */}
              <button
                onClick={onOpenShopbackModal}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 whitespace-nowrap shrink-0"
                title="Earn cashback on every ride"
              >
                <span>Shopback Rewards</span>
                <span className="font-mono-nums font-bold bg-rose-700/80 px-1.5 py-0.5 rounded text-[11px]">
                  S${shopbackBalance.toFixed(2)}
                </span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onTabChange('compare')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              Exit to Rider View
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
