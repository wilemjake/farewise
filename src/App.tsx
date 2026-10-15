import React, { useState, useEffect, useMemo } from 'react';
import { LocationPoint, VehicleCategory, SortMode, SingaporeTrafficContext, RideOption, TripHistoryItem, RideProvider } from './types/ride';
import { SINGAPORE_LOCATIONS, INITIAL_TRIP_HISTORY } from './data/singaporeLocations';
import { calculateRideOptions } from './services/fareCalculator';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { RideSearch } from './components/RideSearch';
import { RideComparisonList } from './components/RideComparisonList';
import { SingaporeMap } from './components/SingaporeMap';
import { SurgeInsights } from './components/SurgeInsights';
import { TripHistory } from './components/TripHistory';
import { DriverPartnerInsight } from './components/DriverPartnerInsight';
import { BookingModal } from './components/BookingModal';
import { ShopbackModal } from './components/ShopbackModal';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'compare' | 'map' | 'surge' | 'history' | 'driver'>('compare');

  // Route points
  const [origin, setOrigin] = useState<LocationPoint>(SINGAPORE_LOCATIONS[0]); // MBS
  const [destination, setDestination] = useState<LocationPoint>(SINGAPORE_LOCATIONS[1]); // Changi Airport T3

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState<VehicleCategory>('all');
  const [selectedSort, setSelectedSort] = useState<SortMode>('cheapest');

  // Traffic & weather context (simulating Singapore peak and weather conditions)
  const [trafficContext, setTrafficContext] = useState<SingaporeTrafficContext>({
    weather: 'Fair & Sunny',
    peakType: 'Evening Rush (5:30 - 8:00 PM)',
    erpStatusText: 'Active in CBD / CTE',
    averageSpeedKmh: 42,
    rainSurgeFactor: 1.0,
  });

  // Simulated live jitter to show realistic dynamic prices
  const [jitter, setJitter] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdatedSecondsAgo, setLastUpdatedSecondsAgo] = useState(4);

  // Hovered provider from card to highlight on map
  const [hoveredProvider, setHoveredProvider] = useState<RideProvider | null>(null);

  // Modals
  const [selectedRideForBooking, setSelectedRideForBooking] = useState<RideOption | null>(null);
  const [isShopbackOpen, setIsShopbackOpen] = useState(false);
  const [shopbackBalance, setShopbackBalance] = useState<number>(34.80);

  // Trip history
  const [trips, setTrips] = useState<TripHistoryItem[]>(INITIAL_TRIP_HISTORY);

  // Auto-refresh seconds counter
  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdatedSecondsAgo((prev) => (prev >= 60 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshFares = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setJitter((prev) => prev + (Math.random() - 0.5) * 0.4);
      setLastUpdatedSecondsAgo(0);
      setIsRefreshing(false);
    }, 400);
  };

  const handleToggleRain = () => {
    setTrafficContext((prev) => {
      const isRain = prev.weather === 'Heavy Thunderstorm';
      return {
        ...prev,
        weather: isRain ? 'Fair & Sunny' : 'Heavy Thunderstorm',
        averageSpeedKmh: isRain ? 42 : 32,
        rainSurgeFactor: isRain ? 1.0 : 1.25,
      };
    });
    setLastUpdatedSecondsAgo(0);
  };

  const handleSwapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
    setLastUpdatedSecondsAgo(0);
  };

  // Compute fares and route metrics
  const { options: rawOptions, distanceKm, tripDurationMinutes, erpToll } = useMemo(() => {
    return calculateRideOptions(origin, destination, trafficContext, jitter);
  }, [origin, destination, trafficContext, jitter]);

  // Filter and sort options
  const filteredOptions = useMemo(() => {
    let list = [...rawOptions];

    // Filter by vehicle category
    if (selectedCategory !== 'all') {
      list = list.filter((opt) => opt.category === selectedCategory);
    }

    // Sort by mode
    if (selectedSort === 'cheapest') {
      list.sort((a, b) => a.estimatedFare - b.estimatedFare);
    } else if (selectedSort === 'fastest') {
      list.sort((a, b) => a.pickupEtaMinutes - b.pickupEtaMinutes);
    } else if (selectedSort === 'value') {
      list.sort((a, b) => {
        if (a.isBestValue) return -1;
        if (b.isBestValue) return 1;
        return a.estimatedFare - b.estimatedFare;
      });
    }

    return list;
  }, [rawOptions, selectedCategory, selectedSort]);

  // When user books a ride
  const handleConfirmTrip = (ride: RideOption) => {
    const newTrip: TripHistoryItem = {
      id: `trip-${Date.now()}`,
      timestamp: new Date().toISOString(),
      dateStr: 'Just now',
      origin,
      destination,
      provider: ride.provider,
      serviceName: ride.serviceName,
      farePaid: ride.estimatedFare,
      cashbackEarned: ride.shopbackCashbackAmount,
    };

    setTrips([newTrip, ...trips]);
    setShopbackBalance((prev) => prev + ride.shopbackCashbackAmount);
    setSelectedRideForBooking(null);
  };

  const handleReorderRoute = (newOrigin: LocationPoint, newDest: LocationPoint) => {
    setOrigin(newOrigin);
    setDestination(newDest);
    setActiveTab('compare');
    handleRefreshFares();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateFeedback = (tripId: string, rating: number, feedback: string) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, rating, feedback } : t))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header complying with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenShopbackModal={() => setIsShopbackOpen(true)}
        shopbackBalance={shopbackBalance}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Main Compare View */}
        {activeTab === 'compare' && (
          <div>
            <HeroBanner
              onQuickExplore={() => {
                const searchEl = document.getElementById('search-panel');
                searchEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenDriverInsight={() => setActiveTab('driver')}
            />

            <div id="search-panel">
              <RideSearch
                origin={origin}
                destination={destination}
                onSelectOrigin={setOrigin}
                onSelectDestination={setDestination}
                onSwapLocations={handleSwapLocations}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedSort={selectedSort}
                onSortChange={setSelectedSort}
                trafficContext={trafficContext}
                onToggleRain={handleToggleRain}
                onRefreshFares={handleRefreshFares}
                isRefreshing={isRefreshing}
                lastUpdatedSecondsAgo={lastUpdatedSecondsAgo}
              />
            </div>

            {/* Split Grid: Left = Live Comparison Cards, Right = Singapore Map & Traffic Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Ride Options */}
              <div className="lg:col-span-7">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="text-xs text-slate-400 font-medium">
                    Showing <strong className="text-white">{filteredOptions.length}</strong> available options in Singapore
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">
                    Lowest fare: S${Math.min(...filteredOptions.map((o) => o.estimatedFare)).toFixed(2)}
                  </div>
                </div>

                <RideComparisonList
                  options={filteredOptions}
                  onBookRide={(ride) => setSelectedRideForBooking(ride)}
                  onHoverProvider={setHoveredProvider}
                  onLeaveProvider={() => setHoveredProvider(null)}
                />
              </div>

              {/* Right Column: Singapore Radar Map */}
              <div className="lg:col-span-5 sticky top-20 space-y-4">
                <SingaporeMap
                  origin={origin}
                  destination={destination}
                  onSelectOrigin={setOrigin}
                  onSelectDestination={setDestination}
                  distanceKm={distanceKm}
                  durationMinutes={tripDurationMinutes}
                  erpToll={erpToll}
                  selectedProvider={hoveredProvider}
                />

                {/* Quick Info Box on Savings */}
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-300 font-semibold">
                    <span>Fare Spread on this Journey:</span>
                    <span className="font-mono-nums text-emerald-400">
                      Save up to S$
                      {(
                        Math.max(...filteredOptions.map((o) => o.estimatedFare)) -
                        Math.min(...filteredOptions.map((o) => o.estimatedFare))
                      ).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    By comparing across Grab, Gojek, TADA, and metered taxis before booking, Singapore commuters save an average of S$4.20 per trip.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Route Radar Full Map View */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Singapore Route & Driver Radar</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Live fleet positions across Grab, Gojek, TADA & ComfortDelGro taxis on Singapore expressways
                </p>
              </div>

              <button
                onClick={() => setActiveTab('compare')}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                Back to Comparison
              </button>
            </div>

            <SingaporeMap
              origin={origin}
              destination={destination}
              onSelectOrigin={setOrigin}
              onSelectDestination={setDestination}
              distanceKm={distanceKm}
              durationMinutes={tripDurationMinutes}
              erpToll={erpToll}
              selectedProvider={hoveredProvider}
            />

            <RideSearch
              origin={origin}
              destination={destination}
              onSelectOrigin={setOrigin}
              onSelectDestination={setDestination}
              onSwapLocations={handleSwapLocations}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedSort={selectedSort}
              onSortChange={setSelectedSort}
              trafficContext={trafficContext}
              onToggleRain={handleToggleRain}
              onRefreshFares={handleRefreshFares}
              isRefreshing={isRefreshing}
              lastUpdatedSecondsAgo={lastUpdatedSecondsAgo}
            />
          </div>
        )}

        {/* Surge Watch View */}
        {activeTab === 'surge' && (
          <SurgeInsights trafficContext={trafficContext} />
        )}

        {/* Trip History View */}
        {activeTab === 'history' && (
          <TripHistory
            trips={trips}
            onReorderRoute={handleReorderRoute}
            onUpdateFeedback={handleUpdateFeedback}
          />
        )}

        {/* Driver Partner Insights View */}
        {activeTab === 'driver' && (
          <DriverPartnerInsight />
        )}
      </main>

      {/* Booking Confirmation / Deep Link Simulation Modal */}
      <BookingModal
        ride={selectedRideForBooking}
        origin={origin}
        destination={destination}
        onClose={() => setSelectedRideForBooking(null)}
        onConfirmTrip={handleConfirmTrip}
      />

      {/* Shopback Cashback Modal */}
      <ShopbackModal
        isOpen={isShopbackOpen}
        onClose={() => setIsShopbackOpen(false)}
        balance={shopbackBalance}
        onRedeem={(amt) => setShopbackBalance(0)}
      />

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-400">FareSG</span> · Singapore Ride Comparison Engine
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Official Operator Rates</span>
            <span aria-hidden="true">·</span>
            <span>Shopback Travel Partner</span>
            <span aria-hidden="true">·</span>
            <span>LTA ERP Grounded</span>
          </div>

          <div>
            Built with zero markup for riders & drivers
          </div>
        </div>
      </footer>
    </div>
  );
}
