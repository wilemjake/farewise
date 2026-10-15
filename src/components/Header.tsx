import React from 'react';

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
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 border-b border-slate-800/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-16">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => onTabChange('compare')}
          className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-md"
        >
          <span className="text-xl font-extrabold tracking-tight text-white whitespace-nowrap shrink-0">
            Fare<span className="text-emerald-400">SG</span>
          </span>
          <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
            Singapore
          </span>
        </button>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onTabChange('compare')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'compare' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-white'
            }`}
          >
            Fares
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
          <button
            onClick={() => onTabChange('driver')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeTab === 'driver' ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400' : 'hover:text-white'
            }`}
          >
            Driver Insights
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
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
        </div>
      </div>
    </header>
  );
};
