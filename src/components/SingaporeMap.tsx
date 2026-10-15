import React, { useState, useEffect } from 'react';
import { LocationPoint, RideProvider } from '../types/ride';
import { SINGAPORE_LOCATIONS } from '../data/singaporeLocations';
import { Navigation, MapPin, Zap, RefreshCw, Car } from 'lucide-react';

interface SingaporeMapProps {
  origin: LocationPoint;
  destination: LocationPoint;
  onSelectOrigin: (loc: LocationPoint) => void;
  onSelectDestination: (loc: LocationPoint) => void;
  distanceKm: number;
  durationMinutes: number;
  erpToll: number;
  selectedProvider?: RideProvider | null;
}

interface SimulatedDriver {
  id: string;
  provider: RideProvider;
  x: number; // percentage in SVG coordinate space
  y: number;
  bearing: number;
  label: string;
}

export const SingaporeMap: React.FC<SingaporeMapProps> = ({
  origin,
  destination,
  onSelectOrigin,
  onSelectDestination,
  distanceKm,
  durationMinutes,
  erpToll,
  selectedProvider,
}) => {
  // Convert Lat/Lng to SVG coordinate % (Singapore bounds approx lat: 1.22 to 1.47, lng: 103.60 to 104.04)
  const getCoordinates = (lat: number, lng: number) => {
    const minLat = 1.22;
    const maxLat = 1.47;
    const minLng = 103.62;
    const maxLng = 104.02;

    const x = ((lng - minLng) / (maxLng - minLng)) * 880 + 60;
    const y = 500 - ((lat - minLat) / (maxLat - minLat)) * 420;
    return { x, y };
  };

  const originPos = getCoordinates(origin.lat, origin.lng);
  const destPos = getCoordinates(destination.lat, destination.lng);

  // Simulated live drivers across Singapore
  const [drivers, setDrivers] = useState<SimulatedDriver[]>([
    { id: 'g1', provider: 'grab', x: 540, y: 390, bearing: 45, label: 'GrabCar' },
    { id: 'g2', provider: 'grab', x: 580, y: 360, bearing: 110, label: 'JustGrab' },
    { id: 'g3', provider: 'grab', x: 780, y: 220, bearing: 190, label: 'GrabCar 6' },
    { id: 'gj1', provider: 'gojek', x: 510, y: 375, bearing: 85, label: 'GoCar' },
    { id: 'gj2', provider: 'gojek', x: 320, y: 290, bearing: 240, label: 'GoCar XL' },
    { id: 'td1', provider: 'tada', x: 560, y: 410, bearing: 15, label: 'AnyTADA' },
    { id: 'td2', provider: 'tada', x: 740, y: 240, bearing: 120, label: 'TADA 6' },
    { id: 'tx1', provider: 'taxi', x: 530, y: 395, bearing: 300, label: 'Comfort Taxi' },
    { id: 'tx2', provider: 'taxi', x: 420, y: 150, bearing: 180, label: 'CityCab' },
  ]);

  // Subtle live driver position flutter to simulate real-time fleet movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers(prev =>
        prev.map(d => ({
          ...d,
          x: Math.max(80, Math.min(920, d.x + (Math.random() - 0.5) * 3)),
          y: Math.max(80, Math.min(460, d.y + (Math.random() - 0.5) * 3)),
          bearing: (d.bearing + Math.floor((Math.random() - 0.5) * 20)) % 360,
        }))
      );
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Midpoint for curved polyline routing simulation
  const midX = (originPos.x + destPos.x) / 2 + (destPos.y - originPos.y) * 0.15;
  const midY = (originPos.y + destPos.y) / 2 - (destPos.x - originPos.x) * 0.15;
  const routePath = `M ${originPos.x} ${originPos.y} Q ${midX} ${midY} ${destPos.x} ${destPos.y}`;

  const getProviderColor = (p: RideProvider) => {
    switch (p) {
      case 'grab': return '#22c55e'; // Emerald/Green
      case 'gojek': return '#06b6d4'; // Cyan
      case 'tada': return '#eab308'; // Yellow/Gold
      case 'taxi': return '#3b82f6'; // Blue
    }
  };

  return (
    <div className="relative w-full rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
      {/* Map Control / Header HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <Navigation className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Live Singapore Route Radar</span>
          <span className="text-slate-500">·</span>
          <span>{distanceKm} km</span>
          <span className="text-slate-500">·</span>
          <span>~{durationMinutes} mins</span>
          {erpToll > 0 && (
            <>
              <span className="text-slate-500">·</span>
              <span className="text-amber-400 font-medium">ERP S${erpToll.toFixed(2)} active</span>
            </>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Grab</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Gojek</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <span>TADA</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Taxi (CDG)</span>
          </div>
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-[360px] md:h-[420px] bg-slate-950 overflow-hidden select-none">
        <svg
          viewBox="0 0 1000 520"
          className="w-full h-full object-cover"
          style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))' }}
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Subtle Grid Background */}
          <rect width="1000" height="520" fill="url(#gridPattern)" />

          {/* Water Surrounding (Straits of Malacca & Singapore Strait) */}
          <rect width="1000" height="520" fill="#090d16" opacity="0.6" />

          {/* Singapore Main Island Silhouette (Stylized high-precision polygon) */}
          <path
            d="M 120 280 
               C 160 210, 240 180, 360 170
               C 440 160, 520 180, 620 170
               C 720 160, 840 210, 910 240
               C 930 280, 910 320, 850 330
               C 800 340, 750 320, 700 350
               C 650 380, 600 420, 540 435
               C 480 445, 420 420, 360 410
               C 280 390, 200 410, 150 380
               C 110 350, 100 310, 120 280 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Sentosa Island */}
          <path
            d="M 490 450 C 510 445, 540 450, 535 465 C 520 475, 485 470, 490 450 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.5"
          />

          {/* Jurong Island */}
          <path
            d="M 230 410 C 270 410, 290 430, 260 450 C 220 450, 210 430, 230 410 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1.5"
          />

          {/* Pulau Ubin */}
          <path
            d="M 800 170 C 830 165, 860 175, 840 190 C 810 190, 795 180, 800 170 Z"
            fill="#0f172a"
            stroke="#1e293b"
            strokeWidth="1"
          />

          {/* Major Singapore Expressways: PIE, ECP, CTE, AYE */}
          {/* PIE (Pan Island Expressway): Jurong to Changi */}
          <path
            d="M 180 340 Q 380 280 540 270 T 890 260"
            fill="none"
            stroke="#334155"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />
          <text x="520" y="264" fill="#64748b" fontSize="9" fontWeight="600" letterSpacing="1">
            PIE
          </text>

          {/* AYE (Ayer Rajah Expressway): Tuas to Marina */}
          <path
            d="M 170 380 Q 320 370 480 400 T 560 430"
            fill="none"
            stroke="#334155"
            strokeWidth="2"
          />
          <text x="340" y="380" fill="#64748b" fontSize="9" fontWeight="600" letterSpacing="1">
            AYE
          </text>

          {/* CTE (Central Expressway): AMK to CBD */}
          <path
            d="M 520 180 Q 535 290 545 425"
            fill="none"
            stroke="#334155"
            strokeWidth="2"
          />
          <text x="548" y="230" fill="#64748b" fontSize="9" fontWeight="600" letterSpacing="1">
            CTE
          </text>

          {/* ECP (East Coast Parkway): CBD to Changi Airport */}
          <path
            d="M 560 435 Q 680 410 880 280"
            fill="none"
            stroke="#334155"
            strokeWidth="2"
          />
          <text x="700" y="385" fill="#64748b" fontSize="9" fontWeight="600" letterSpacing="1">
            ECP
          </text>

          {/* ERP Toll Gantry icon near CBD / Central entry */}
          <g transform="translate(545, 385)">
            <rect x="-14" y="-8" width="28" height="16" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
            <text x="0" y="4" textAnchor="middle" fill="#c7d2fe" fontSize="8" fontWeight="700">ERP</text>
          </g>

          {/* Active Trip Polyline between Origin and Destination */}
          <path
            d={routePath}
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
          <path
            d={routePath}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Real-time Fleet Drivers Beacons */}
          {drivers.map(d => {
            const isHighlighted = !selectedProvider || selectedProvider === d.provider;
            const color = getProviderColor(d.provider);

            return (
              <g
                key={d.id}
                transform={`translate(${d.x}, ${d.y})`}
                opacity={isHighlighted ? 0.95 : 0.25}
                className="transition-all duration-1000 ease-linear cursor-pointer"
              >
                {/* Ping wave */}
                <circle r="7" fill={color} opacity="0.25" className="animate-ping" />
                {/* Vehicle dot */}
                <circle r="4" fill={color} stroke="#0f172a" strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Quick Clickable Landmarks Across SG */}
          {SINGAPORE_LOCATIONS.map(loc => {
            const pos = getCoordinates(loc.lat, loc.lng);
            const isOrigin = loc.id === origin.id;
            const isDest = loc.id === destination.id;

            return (
              <g
                key={loc.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer group"
                onClick={() => {
                  if (loc.id !== origin.id) {
                    onSelectDestination(loc);
                  }
                }}
              >
                <circle
                  r={isOrigin || isDest ? "8" : "3.5"}
                  fill={isOrigin ? "#10b981" : isDest ? "#f43f5e" : "#475569"}
                  stroke="#0f172a"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />
                <text
                  x="0"
                  y={isOrigin || isDest ? "-12" : "12"}
                  textAnchor="middle"
                  fill={isOrigin ? "#34d399" : isDest ? "#fb7185" : "#94a3b8"}
                  fontSize={isOrigin || isDest ? "10" : "8"}
                  fontWeight={isOrigin || isDest ? "700" : "500"}
                  className="pointer-events-none drop-shadow"
                >
                  {loc.name.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Origin Pin with Beacon */}
          <g transform={`translate(${originPos.x}, ${originPos.y})`}>
            <circle r="14" fill="#10b981" opacity="0.3" className="animate-ping" />
            <circle r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <circle r="3" fill="#ffffff" />
            <rect x="-35" y="-34" width="70" height="18" rx="4" fill="#064e3b" stroke="#10b981" strokeWidth="1" />
            <text x="0" y="-22" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="700">PICKUP</text>
          </g>

          {/* Destination Pin */}
          <g transform={`translate(${destPos.x}, ${destPos.y})`}>
            <circle r="14" fill="#f43f5e" opacity="0.3" className="animate-ping" />
            <circle r="8" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
            <circle r="3" fill="#ffffff" />
            <rect x="-35" y="-34" width="70" height="18" rx="4" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
            <text x="0" y="-22" textAnchor="middle" fill="#fecdd3" fontSize="9" fontWeight="700">DROPOFF</text>
          </g>
        </svg>

        {/* Floating Quick Route Card Overlay */}
        <div className="absolute bottom-3 left-3 right-3 md:right-auto md:max-w-md p-3 rounded-xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-md text-xs shadow-2xl flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <span className="text-slate-200 font-semibold truncate">{origin.name}</span>
            </div>
            <div className="flex items-center gap-2 truncate text-slate-400">
              <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0"></span>
              <span className="truncate">{destination.name}</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono-nums font-bold text-sm text-white">{distanceKm} km</div>
            <div className="text-slate-400 text-[11px]">~{durationMinutes} mins drive</div>
          </div>
        </div>
      </div>
    </div>
  );
};
