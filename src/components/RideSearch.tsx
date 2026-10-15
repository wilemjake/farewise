import React, { useState } from 'react';
import { LocationPoint, VehicleCategory, SortMode, SingaporeTrafficContext } from '../types/ride';
import { SINGAPORE_LOCATIONS } from '../data/singaporeLocations';
import { ArrowUpDown, Search, MapPin, Navigation, Clock, Zap, CloudRain, Sun, ShieldAlert, Sparkles } from 'lucide-react';

interface RideSearchProps {
  origin: LocationPoint;
  destination: LocationPoint;
  onSelectOrigin: (loc: LocationPoint) => void;
  onSelectDestination: (loc: LocationPoint) => void;
  onSwapLocations: () => void;
  selectedCategory: VehicleCategory;
  onCategoryChange: (category: VehicleCategory) => void;
  selectedSort: SortMode;
  onSortChange: (sort: SortMode) => void;
  trafficContext: SingaporeTrafficContext;
  onToggleRain: () => void;
  onRefreshFares: () => void;
  isRefreshing: boolean;
  lastUpdatedSecondsAgo: number;
}

export const RideSearch: React.FC<RideSearchProps> = ({
  origin,
  destination,
  onSelectOrigin,
  onSelectDestination,
  onSwapLocations,
  selectedCategory,
  onCategoryChange,
  selectedSort,
  onSortChange,
  trafficContext,
  onToggleRain,
  onRefreshFares,
  isRefreshing,
  lastUpdatedSecondsAgo,
}) => {
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);

  const filterLocations = (query: string) => {
    if (!query) return SINGAPORE_LOCATIONS;
    const lower = query.toLowerCase();
    return SINGAPORE_LOCATIONS.filter(
      loc =>
        loc.name.toLowerCase().includes(lower) ||
        loc.address.toLowerCase().includes(lower) ||
        loc.postalCode.includes(lower) ||
        loc.region.toLowerCase().includes(lower)
    );
  };

  const categories: { id: VehicleCategory; label: string }[] = [
    { id: 'all', label: 'All Rides' },
    { id: 'standard', label: 'Standard (4-Pax)' },
    { id: 'xl', label: '6-Seater XL' },
    { id: 'premium', label: 'Premium' },
    { id: 'taxi', label: 'Taxis' },
  ];

  const sorts: { id: SortMode; label: string; desc: string }[] = [
    { id: 'cheapest', label: 'Cheapest First', desc: 'Lowest fare' },
    { id: 'fastest', label: 'Fastest Pickup', desc: 'Shortest ETA' },
    { id: 'value', label: 'Best Value', desc: 'Price + ETA + Cashback' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl mb-6">
      {/* Search Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Set Journey Route</h2>
          <div className="text-xs text-slate-400">
            Singapore street addresses, postal codes & pickup points
          </div>
        </div>

        {/* Live Status & Weather Toggle */}
        <div className="flex items-center gap-2">
          {/* Weather Toggle */}
          <button
            onClick={onToggleRain}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              trafficContext.weather === 'Heavy Thunderstorm'
                ? 'bg-sky-950/60 border-sky-600 text-sky-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
            title="Simulate weather surge impact on fares"
          >
            {trafficContext.weather === 'Heavy Thunderstorm' ? (
              <>
                <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                <span>Rain Surge Active (+15%)</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Fair Weather</span>
              </>
            )}
          </button>

          {/* Refresh Button */}
          <button
            onClick={onRefreshFares}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors disabled:opacity-50"
            title="Fetch live quotes"
          >
            <Clock className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Updated {lastUpdatedSecondsAgo}s ago</span>
          </button>
        </div>
      </div>

      {/* Origin & Destination Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center mb-6">
        {/* Origin Field */}
        <div className="lg:col-span-5 relative">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Pick-up Location
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOriginOpen(!isOriginOpen);
                setIsDestOpen(false);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl text-left text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors flex items-center justify-between"
            >
              <div className="truncate">
                <div className="font-semibold text-slate-100 truncate">{origin.name}</div>
                <div className="text-xs text-slate-400 truncate">{origin.address} ({origin.postalCode})</div>
              </div>
            </button>
          </div>

          {/* Dropdown Menu */}
          {isOriginOpen && (
            <div className="absolute z-50 left-0 right-0 mt-2 p-2 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
              <div className="p-2 border-b border-slate-800 sticky top-0 bg-slate-950">
                <input
                  type="text"
                  placeholder="Search landmark, road or 6-digit postal code..."
                  value={originSearch}
                  onChange={(e) => setOriginSearch(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  autoFocus
                />
              </div>
              <div className="divide-y divide-slate-800/60">
                {filterLocations(originSearch).map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onSelectOrigin(loc);
                      setIsOriginOpen(false);
                      setOriginSearch('');
                    }}
                    className={`w-full text-left p-2.5 hover:bg-slate-800/80 rounded-lg transition-colors flex items-start gap-2.5 ${
                      loc.id === origin.id ? 'bg-slate-800/60' : ''
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="font-medium text-xs text-slate-100">{loc.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{loc.address}</div>
                      <div className="text-[10px] text-slate-500">Postal {loc.postalCode} · {loc.region}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Swap Button */}
        <div className="lg:col-span-2 flex justify-center pt-2 lg:pt-5">
          <button
            onClick={onSwapLocations}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all active:rotate-180 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            title="Swap Origin and Destination"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Field */}
        <div className="lg:col-span-5 relative">
          <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
            Drop-off Destination
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Navigation className="w-4 h-4 text-rose-400" />
            </div>
            <button
              type="button"
              onClick={() => {
                setIsDestOpen(!isDestOpen);
                setIsOriginOpen(false);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl text-left text-sm text-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-colors flex items-center justify-between"
            >
              <div className="truncate">
                <div className="font-semibold text-slate-100 truncate">{destination.name}</div>
                <div className="text-xs text-slate-400 truncate">{destination.address} ({destination.postalCode})</div>
              </div>
            </button>
          </div>

          {/* Dropdown Menu */}
          {isDestOpen && (
            <div className="absolute z-50 left-0 right-0 mt-2 p-2 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl max-h-72 overflow-y-auto">
              <div className="p-2 border-b border-slate-800 sticky top-0 bg-slate-950">
                <input
                  type="text"
                  placeholder="Search landmark, road or 6-digit postal code..."
                  value={destSearch}
                  onChange={(e) => setDestSearch(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
                  autoFocus
                />
              </div>
              <div className="divide-y divide-slate-800/60">
                {filterLocations(destSearch).map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onSelectDestination(loc);
                      setIsDestOpen(false);
                      setDestSearch('');
                    }}
                    className={`w-full text-left p-2.5 hover:bg-slate-800/80 rounded-lg transition-colors flex items-start gap-2.5 ${
                      loc.id === destination.id ? 'bg-slate-800/60' : ''
                    }`}
                  >
                    <Navigation className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <div className="font-medium text-xs text-slate-100">{loc.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{loc.address}</div>
                      <div className="text-[10px] text-slate-500">Postal {loc.postalCode} · {loc.region}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Location Shortcuts */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-slate-400 font-medium">Quick Destinations:</span>
        {[
          SINGAPORE_LOCATIONS[1], // Changi Airport
          SINGAPORE_LOCATIONS[0], // MBS
          SINGAPORE_LOCATIONS[3], // ION Orchard
          SINGAPORE_LOCATIONS[2], // Raffles Place
          SINGAPORE_LOCATIONS[7], // Sentosa
          SINGAPORE_LOCATIONS[5], // Jurong East
        ].map((loc) => (
          <button
            key={loc.id}
            onClick={() => onSelectDestination(loc)}
            className={`px-2.5 py-1 text-xs rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
              destination.id === loc.id
                ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Filter and Sort Tabs Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-4 border-t border-slate-800">
        {/* Vehicle Category Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort Modes */}
        <div className="flex items-center gap-1.5 self-end md:self-auto">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Sort:</span>
          {sorts.map((s) => (
            <button
              key={s.id}
              onClick={() => onSortChange(s.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 ${
                selectedSort === s.id
                  ? 'bg-emerald-950/70 border-emerald-500/80 text-emerald-300 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
