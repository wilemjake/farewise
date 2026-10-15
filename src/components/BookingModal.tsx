import React, { useState } from 'react';
import { LocationPoint, RideOption } from '../types/ride';
import { X, CheckCircle2, ExternalLink, MapPin, Navigation, Clock, Gift, Shield, Star, Car } from 'lucide-react';

interface BookingModalProps {
  ride: RideOption | null;
  origin: LocationPoint;
  destination: LocationPoint;
  onClose: () => void;
  onConfirmTrip: (ride: RideOption) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  ride,
  origin,
  destination,
  onClose,
  onConfirmTrip,
}) => {
  const [isBooked, setIsBooked] = useState(false);
  const [riderNote, setRiderNote] = useState('');
  const [usePriorityQueue, setUsePriorityQueue] = useState(false);

  if (!ride) return null;

  const handleCompleteBooking = () => {
    setIsBooked(true);
    setTimeout(() => {
      onConfirmTrip(ride);
    }, 1200);
  };

  const getDeepLinkName = (provider: string) => {
    switch (provider) {
      case 'grab': return 'Grab SuperApp';
      case 'gojek': return 'Gojek App';
      case 'tada': return 'TADA Singapore App';
      case 'taxi': return 'ComfortDelGro Zig App';
      default: return 'Partner App';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Direct Provider Hailing
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Confirm {ride.providerName} - {ride.serviceName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isBooked ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Ride Requested Successfully!</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Opening {getDeepLinkName(ride.provider)} with pre-filled pick-up at {origin.name}.
              </p>
            </div>
            <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl max-w-xs mx-auto text-xs text-rose-300">
              S${ride.shopbackCashbackAmount.toFixed(2)} cashback tracking session activated!
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {/* Route Summary */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">{origin.name}</div>
                  <div className="text-slate-400">{origin.pickupBay || origin.address}</div>
                </div>
              </div>

              <div className="border-l-2 border-dashed border-slate-800 ml-2 h-3" />

              <div className="flex items-start gap-2.5">
                <Navigation className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-white">{destination.name}</div>
                  <div className="text-slate-400">{destination.address}</div>
                </div>
              </div>
            </div>

            {/* Price & Cashback Breakdown */}
            <div className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400 font-medium">Estimated Fare (SGD)</div>
                <div className="text-2xl font-bold font-mono-nums text-white">
                  S${ride.estimatedFare.toFixed(2)}
                </div>
                {ride.erpEstimate > 0 && (
                  <div className="text-[11px] text-amber-400">
                    Includes S${ride.erpEstimate.toFixed(2)} estimated ERP
                  </div>
                )}
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400 font-medium">Shopback Cashback</div>
                <div className="text-lg font-bold font-mono-nums text-rose-400">
                  +S${ride.shopbackCashbackAmount.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400">{(ride.shopbackCashbackRate * 100).toFixed(0)}% auto-credited</div>
              </div>
            </div>

            {/* Priority Queue Option if available */}
            {ride.priorityQueueAvailable && (
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/40 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <div className="text-xs">
                    <div className="font-semibold text-white">Priority Dispatch Queue</div>
                    <div className="text-slate-400 text-[11px]">Match with highest rated driver in queue (+S$1.50)</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={usePriorityQueue}
                  onChange={(e) => setUsePriorityQueue(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-400 bg-slate-900"
                />
              </label>
            )}

            {/* Optional Pickup Note */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Driver Landmark / Pickup Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Waiting at Pillar 3 with blue luggage"
                value={riderNote}
                onChange={(e) => setRiderNote(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Zero Cost Guarantee & Driver Commission Notice */}
            <div className="text-[11px] text-slate-500 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/60 leading-relaxed">
              <strong className="text-slate-400">No Extra Fare Guarantee:</strong> FareSG charges zero markup on top of ride operator rates. Fares are directly dispatched to {ride.providerName}.
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteBooking}
                className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Launch {getDeepLinkName(ride.provider)}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
