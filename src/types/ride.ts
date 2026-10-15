export type RideProvider = 'grab' | 'gojek' | 'tada' | 'taxi';

export type VehicleCategory = 'all' | 'standard' | 'xl' | 'premium' | 'taxi';

export type SortMode = 'cheapest' | 'fastest' | 'value';

export interface LocationPoint {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  region: 'Central' | 'East' | 'West' | 'North' | 'North-East' | 'Airport';
  lat: number;
  lng: number;
  landmark?: string;
  pickupBay?: string;
}

export interface RideOption {
  id: string;
  provider: RideProvider;
  providerName: string;
  serviceName: string;
  category: VehicleCategory;
  capacity: number;
  baseFare: number;
  surgeMultiplier: number;
  estimatedFare: number;
  fareMin?: number;
  fareMax?: number;
  pickupEtaMinutes: number;
  tripDurationMinutes: number;
  shopbackCashbackRate: number; // e.g. 0.04 for 4%
  shopbackCashbackAmount: number; // S$
  priorityQueueAvailable: boolean;
  erpEstimate: number; // Singapore ERP toll in S$
  commissionNote: string;
  features: string[];
  isCheapest?: boolean;
  isFastest?: boolean;
  isBestValue?: boolean;
}

export interface TripHistoryItem {
  id: string;
  timestamp: string;
  dateStr: string;
  origin: LocationPoint;
  destination: LocationPoint;
  provider: RideProvider;
  serviceName: string;
  farePaid: number;
  cashbackEarned: number;
  rating?: number;
  feedback?: string;
}

export interface SingaporeTrafficContext {
  weather: 'Fair & Sunny' | 'Passing Showers' | 'Heavy Thunderstorm' | 'Cloudy';
  peakType: 'Morning Rush (7:30 - 9:30 AM)' | 'Off-Peak' | 'Evening Rush (5:30 - 8:00 PM)' | 'Late Night (12:00 - 6:00 AM)';
  erpStatusText: string;
  averageSpeedKmh: number;
  rainSurgeFactor: number;
}
