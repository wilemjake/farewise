import React, { useState } from 'react';
import { TripHistoryItem, LocationPoint } from '../types/ride';
import { RotateCcw, Star, MapPin, Navigation, Calendar, Gift, MessageSquare } from 'lucide-react';

interface TripHistoryProps {
  trips: TripHistoryItem[];
  onReorderRoute: (origin: LocationPoint, destination: LocationPoint) => void;
  onUpdateFeedback: (tripId: string, rating: number, feedback: string) => void;
}

export const TripHistory: React.FC<TripHistoryProps> = ({
  trips,
  onReorderRoute,
  onUpdateFeedback,
}) => {
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [tempRating, setTempRating] = useState<number>(5);
  const [tempFeedback, setTempFeedback] = useState<string>('');

  const handleStartReview = (trip: TripHistoryItem) => {
    setEditingTripId(trip.id);
    setTempRating(trip.rating || 5);
    setTempFeedback(trip.feedback || '');
  };

  const handleSaveReview = (tripId: string) => {
    onUpdateFeedback(tripId, tempRating, tempFeedback);
    setEditingTripId(null);
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'grab': return 'text-emerald-400 bg-emerald-950/50 border-emerald-500/40';
      case 'gojek': return 'text-cyan-400 bg-cyan-950/50 border-cyan-500/40';
      case 'tada': return 'text-amber-400 bg-amber-950/50 border-amber-500/40';
      case 'taxi': return 'text-blue-400 bg-blue-950/50 border-blue-500/40';
      default: return 'text-slate-400 bg-slate-900 border-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Commute & Booking History</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            1-Click re-order for your frequent Singapore routes, past ratings & cashback earned
          </p>
        </div>

        <div className="text-xs text-slate-400 font-medium bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          {trips.length} Saved Journeys
        </div>
      </div>

      <div className="space-y-3">
        {trips.map((trip) => {
          const isReviewing = editingTripId === trip.id;
          const badgeClass = getProviderColor(trip.provider);

          return (
            <div
              key={trip.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3 transition-colors hover:border-slate-700"
            >
              {/* Top metadata line */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[11px] border ${badgeClass}`}>
                    {trip.provider.toUpperCase()}
                  </span>
                  <span className="text-slate-300 font-medium">{trip.serviceName}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{trip.dateStr}</span>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Paid: </span>
                    <strong className="text-sm font-mono-nums text-white">S${trip.farePaid.toFixed(2)}</strong>
                  </div>
                  <div className="text-right text-rose-400 flex items-center gap-1 text-xs">
                    <Gift className="w-3.5 h-3.5" />
                    <span className="font-mono-nums font-semibold">+S${trip.cashbackEarned.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Journey Route */}
              <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200 font-medium">{trip.origin.name}</span>
                    <span className="text-[11px] text-slate-500 truncate hidden sm:inline">({trip.origin.postalCode})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="text-slate-200 font-medium">{trip.destination.name}</span>
                    <span className="text-[11px] text-slate-500 truncate hidden sm:inline">({trip.destination.postalCode})</span>
                  </div>
                </div>

                {/* 1-Click Re-order Action */}
                <button
                  onClick={() => onReorderRoute(trip.origin, trip.destination)}
                  className="px-3.5 py-2 text-xs font-bold text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 rounded-xl transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Re-order & Check Live Price</span>
                </button>
              </div>

              {/* Ratings and Feedback Section */}
              {isReviewing ? (
                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-300 font-semibold">Rate your ride:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setTempRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= tempRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder="Share quick feedback (e.g. driver arrived fast, clean car, route efficiency)..."
                    value={tempFeedback}
                    onChange={(e) => setTempFeedback(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingTripId(null)}
                      className="px-3 py-1 text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveReview(trip.id)}
                      className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg"
                    >
                      Save Review
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    {trip.rating ? (
                      <div className="flex items-center gap-1 text-amber-400 font-medium">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{trip.rating} / 5</span>
                        {trip.feedback && (
                          <span className="text-slate-400 font-normal italic ml-2">"{trip.feedback}"</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">No feedback added yet</span>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartReview(trip)}
                    className="text-slate-400 hover:text-emerald-400 text-[11px] font-medium flex items-center gap-1"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>{trip.rating ? 'Edit Review' : 'Add Driver Feedback'}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
