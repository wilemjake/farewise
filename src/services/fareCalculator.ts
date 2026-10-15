import { LocationPoint, RideOption, SingaporeTrafficContext } from '../types/ride';

// Haversine distance in km
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightDistance = R * c;
  
  // Real Singapore roads have intersections, expressways (PIE/ECP/AYE), detour factor ~1.28
  return Math.max(1.8, Math.round(straightDistance * 1.28 * 10) / 10);
}

// Estimate trip duration in minutes
export function calculateTripDurationMinutes(distanceKm: number, trafficContext: SingaporeTrafficContext): number {
  const baseSpeedKmh = trafficContext.averageSpeedKmh;
  const hours = distanceKm / baseSpeedKmh;
  const minutes = Math.round(hours * 60) + 3; // +3 mins for traffic lights / boarding
  return Math.max(6, minutes);
}

// Check ERP toll estimate based on destination and region
export function estimateErpToll(origin: LocationPoint, destination: LocationPoint, trafficContext: SingaporeTrafficContext): number {
  const reachesCbd = destination.region === 'Central' || origin.region === 'Central';
  if (!reachesCbd) return 0;
  
  if (trafficContext.peakType.includes('Rush')) {
    return 2.00;
  }
  return 1.00;
}

// Generate realistic live comparison options
export function calculateRideOptions(
  origin: LocationPoint,
  destination: LocationPoint,
  trafficContext: SingaporeTrafficContext,
  randomJitter: number = 0
): { options: RideOption[]; distanceKm: number; tripDurationMinutes: number; erpToll: number } {
  const distanceKm = calculateDistanceKm(origin.lat, origin.lng, destination.lat, destination.lng);
  const tripDurationMinutes = calculateTripDurationMinutes(distanceKm, trafficContext);
  const erpToll = estimateErpToll(origin, destination, trafficContext);

  const rainMultiplier = trafficContext.rainSurgeFactor;
  const isPeak = trafficContext.peakType.includes('Rush');

  // Base surges per operator
  // Grab usually experiences highest surge during peak/rain in SG
  const grabSurge = Math.min(2.0, Math.max(1.0, 1.0 + (isPeak ? 0.35 : 0.05) + (rainMultiplier - 1.0) * 1.2 + randomJitter * 0.05));
  // Gojek surge
  const gojekSurge = Math.min(1.85, Math.max(1.0, 1.0 + (isPeak ? 0.25 : 0.03) + (rainMultiplier - 1.0) * 1.0 + (randomJitter * -0.04)));
  // TADA has 0% commission on drivers, so base fares surge significantly less!
  const tadaSurge = Math.min(1.4, Math.max(1.0, 1.0 + (isPeak ? 0.12 : 0.0) + (rainMultiplier - 1.0) * 0.5));
  // Taxi is regulated metered / flat fare with 25% peak surcharge + location surcharge if airport
  const airportSurcharge = (origin.region === 'Airport' || destination.region === 'Airport') ? 6.00 : 0.00;

  // Base rates in Singapore Dollars (SGD)
  // 1. Grab - JustGrab
  const grabBase = (3.80 + distanceKm * 0.72 + tripDurationMinutes * 0.22) * grabSurge + 0.50 + erpToll + airportSurcharge;
  // 2. Gojek - GoCar
  const gojekBase = (3.50 + distanceKm * 0.70 + tripDurationMinutes * 0.20) * gojekSurge + 0.55 + erpToll + airportSurcharge;
  // 3. TADA - AnyTADA (driver gets 100% fare, steady pricing)
  const tadaBase = (3.40 + distanceKm * 0.68 + tripDurationMinutes * 0.20) * tadaSurge + 0.50 + erpToll + airportSurcharge;
  // 4. Taxi - Standard Meter Taxi (ComfortDelGro)
  const taxiMeterBase = (4.40 + (distanceKm > 10 ? 10 * 0.65 + (distanceKm - 10) * 0.70 : distanceKm * 0.65)) * (isPeak ? 1.25 : 1.0) + erpToll + airportSurcharge;

  // Pickup ETAs in minutes based on location density
  const originIsCentral = origin.region === 'Central';
  const etaOffset = originIsCentral ? 0 : 2;

  const rawOptions: Omit<RideOption, 'isCheapest' | 'isFastest' | 'isBestValue'>[] = [
    {
      id: 'grab-justgrab',
      provider: 'grab',
      providerName: 'Grab',
      serviceName: 'JustGrab',
      category: 'standard',
      capacity: 4,
      baseFare: 3.80,
      surgeMultiplier: Math.round(grabSurge * 100) / 100,
      estimatedFare: Math.round(grabBase * 10) / 10,
      pickupEtaMinutes: Math.max(2, 3 + etaOffset + Math.floor(Math.random() * 2)),
      tripDurationMinutes,
      shopbackCashbackRate: 0.04, // 4%
      shopbackCashbackAmount: Math.round((grabBase * 0.04) * 100) / 100,
      priorityQueueAvailable: true,
      erpEstimate: erpToll,
      commissionNote: 'Standard Grab 20% driver commission',
      features: ['Nearest Taxi or Car', 'GrabPay & Points', 'Priority Queue Option'],
    },
    {
      id: 'tada-anytada',
      provider: 'tada',
      providerName: 'TADA',
      serviceName: 'AnyTADA',
      category: 'standard',
      capacity: 4,
      baseFare: 3.40,
      surgeMultiplier: Math.round(tadaSurge * 100) / 100,
      estimatedFare: Math.round(tadaBase * 10) / 10,
      pickupEtaMinutes: Math.max(3, 4 + etaOffset + Math.floor(Math.random() * 2)),
      tripDurationMinutes,
      shopbackCashbackRate: 0.05, // 5%
      shopbackCashbackAmount: Math.round((tadaBase * 0.05) * 100) / 100,
      priorityQueueAvailable: false,
      erpEstimate: erpToll,
      commissionNote: 'Zero 0% platform commission on drivers! More fare goes to driver',
      features: ['Zero driver commission', 'Lowest rain peak surge', 'Best driver retention'],
    },
    {
      id: 'gojek-gocar',
      provider: 'gojek',
      providerName: 'Gojek',
      serviceName: 'GoCar',
      category: 'standard',
      capacity: 4,
      baseFare: 3.50,
      surgeMultiplier: Math.round(gojekSurge * 100) / 100,
      estimatedFare: Math.round(gojekBase * 10) / 10,
      pickupEtaMinutes: Math.max(2, 3 + etaOffset + Math.floor(Math.random() * 2)),
      tripDurationMinutes,
      shopbackCashbackRate: 0.045, // 4.5%
      shopbackCashbackAmount: Math.round((gojekBase * 0.045) * 100) / 100,
      priorityQueueAvailable: true,
      erpEstimate: erpToll,
      commissionNote: 'Gojek 10% driver commission structure',
      features: ['Fixed upfront pricing', 'GoPay & Credit Card', 'Driver priority matching'],
    },
    {
      id: 'taxi-cdg-standard',
      provider: 'taxi',
      providerName: 'ComfortDelGro Zig',
      serviceName: 'Standard Taxi (Metered)',
      category: 'taxi',
      capacity: 4,
      baseFare: 4.40,
      surgeMultiplier: isPeak ? 1.25 : 1.0,
      estimatedFare: Math.round(taxiMeterBase * 10) / 10,
      fareMin: Math.round((taxiMeterBase * 0.95) * 10) / 10,
      fareMax: Math.round((taxiMeterBase * 1.15) * 10) / 10,
      pickupEtaMinutes: Math.max(2, 2 + etaOffset),
      tripDurationMinutes,
      shopbackCashbackRate: 0.03, // 3%
      shopbackCashbackAmount: Math.round((taxiMeterBase * 0.03) * 100) / 100,
      priorityQueueAvailable: true,
      erpEstimate: erpToll,
      commissionNote: 'Traditional LTA regulated meter rate + 25% peak rule',
      features: ['Bus lane privileges in peak', 'Experienced taxi uncles', 'Taxi stand priority'],
    },
    // XL / 6-Seater Options
    {
      id: 'grab-grabcar6',
      provider: 'grab',
      providerName: 'Grab',
      serviceName: 'GrabCar 6-Seater',
      category: 'xl',
      capacity: 6,
      baseFare: 6.50,
      surgeMultiplier: Math.round(grabSurge * 100) / 100,
      estimatedFare: Math.round((grabBase * 1.48) * 10) / 10,
      pickupEtaMinutes: Math.max(4, 5 + etaOffset),
      tripDurationMinutes,
      shopbackCashbackRate: 0.04,
      shopbackCashbackAmount: Math.round((grabBase * 1.48 * 0.04) * 100) / 100,
      priorityQueueAvailable: false,
      erpEstimate: erpToll,
      commissionNote: 'Standard Grab 20% commission',
      features: ['Spacious 6-passenger MPV', 'Large luggage capacity', 'Family friendly'],
    },
    {
      id: 'tada-tada6',
      provider: 'tada',
      providerName: 'TADA',
      serviceName: 'TADA 6-Seater',
      category: 'xl',
      capacity: 6,
      baseFare: 6.00,
      surgeMultiplier: Math.round(tadaSurge * 100) / 100,
      estimatedFare: Math.round((tadaBase * 1.40) * 10) / 10,
      pickupEtaMinutes: Math.max(4, 6 + etaOffset),
      tripDurationMinutes,
      shopbackCashbackRate: 0.05,
      shopbackCashbackAmount: Math.round((tadaBase * 1.40 * 0.05) * 100) / 100,
      priorityQueueAvailable: false,
      erpEstimate: erpToll,
      commissionNote: 'Zero driver commission MPV',
      features: ['Zero driver commission', 'Spacious Toyota Alphard/Noah', 'Low peak multiplier'],
    },
    {
      id: 'gojek-gocarxl',
      provider: 'gojek',
      providerName: 'Gojek',
      serviceName: 'GoCar XL (6-Seater)',
      category: 'xl',
      capacity: 6,
      baseFare: 6.20,
      surgeMultiplier: Math.round(gojekSurge * 100) / 100,
      estimatedFare: Math.round((gojekBase * 1.42) * 10) / 10,
      pickupEtaMinutes: Math.max(3, 5 + etaOffset),
      tripDurationMinutes,
      shopbackCashbackRate: 0.045,
      shopbackCashbackAmount: Math.round((gojekBase * 1.42 * 0.045) * 100) / 100,
      priorityQueueAvailable: true,
      erpEstimate: erpToll,
      commissionNote: 'Gojek 10% commission',
      features: ['Room for 6 + bags', 'Confirmed upfront quote', 'Free cancellation < 5 mins'],
    },
    // Premium options
    {
      id: 'grab-premium',
      provider: 'grab',
      providerName: 'Grab',
      serviceName: 'GrabCar Premium',
      category: 'premium',
      capacity: 4,
      baseFare: 9.00,
      surgeMultiplier: Math.round(grabSurge * 100) / 100,
      estimatedFare: Math.round((grabBase * 1.85) * 10) / 10,
      pickupEtaMinutes: Math.max(4, 5 + etaOffset),
      tripDurationMinutes,
      shopbackCashbackRate: 0.04,
      shopbackCashbackAmount: Math.round((grabBase * 1.85 * 0.04) * 100) / 100,
      priorityQueueAvailable: true,
      erpEstimate: erpToll,
      commissionNote: 'Executive fleet (Mercedes, BMW, Lexus)',
      features: ['Top-rated executive drivers', 'Quiet ride option', 'Phone charging & water'],
    }
  ];

  // Determine cheapest and fastest
  const minFare = Math.min(...rawOptions.map(o => o.estimatedFare));
  const minEta = Math.min(...rawOptions.map(o => o.pickupEtaMinutes));

  // Compute best value score: weighted (price 60%, eta 25%, cashback 15%)
  const maxFare = Math.max(...rawOptions.map(o => o.estimatedFare));
  const maxEta = Math.max(...rawOptions.map(o => o.pickupEtaMinutes));

  let bestValueId = '';
  let highestValueScore = -999;

  rawOptions.forEach(opt => {
    // Normalise: lower price is better (0 to 1), lower eta is better (0 to 1), higher cashback is better (0 to 1)
    const priceScore = 1 - (opt.estimatedFare - minFare) / (maxFare - minFare || 1);
    const etaScore = 1 - (opt.pickupEtaMinutes - minEta) / (maxEta - minEta || 1);
    const cashbackScore = opt.shopbackCashbackAmount / (opt.estimatedFare * 0.05 || 1);
    const totalScore = priceScore * 0.55 + etaScore * 0.30 + cashbackScore * 0.15;
    
    if (totalScore > highestValueScore) {
      highestValueScore = totalScore;
      bestValueId = opt.id;
    }
  });

  const options: RideOption[] = rawOptions.map(opt => ({
    ...opt,
    isCheapest: opt.estimatedFare === minFare,
    isFastest: opt.pickupEtaMinutes === minEta,
    isBestValue: opt.id === bestValueId,
  }));

  return { options, distanceKm, tripDurationMinutes, erpToll };
}
