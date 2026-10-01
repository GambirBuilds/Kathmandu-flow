import React from 'react';
import {
  Compass,
  ArrowRight,
  Clock,
  Gauge,
  Navigation,
  CheckCircle2,
  Sparkles,
  MapPin,
  X
} from 'lucide-react';

export default function RoutePlanner({
  nodes = [],
  originId,
  destinationId,
  onSelectOrigin,
  onSelectDestination,
  routesResult,
  onApplyPreset,
  onClearRoutes
}) {
  const PRESETS = [
    { name: 'Kalanki ↔ Bhaktapur (Full Valley)', from: 'kalanki', to: 'suryabinayak' },
    { name: 'Lalitpur Pulchowk ↔ Bhaktapur Durbar', from: 'pulchowk', to: 'bhaktapur_durbar' },
    { name: 'Patan Jawalakhel ↔ Maharajgunj', from: 'jawalakhel', to: 'maharajgunj' },
    { name: 'Koteshwor ↔ Thamel', from: 'koteshwor', to: 'thamel' },
    { name: 'Kalanki ↔ Airport Terminal', from: 'kalanki', to: 'airport_terminal' },
    { name: 'Chabahil ↔ Singha Durbar', from: 'chabahil', to: 'singha_durbar' }
  ];

  const primary = routesResult?.primary;
  const alt = routesResult?.alternative;

  // Group nodes by city
  const cities = ['Kathmandu', 'Lalitpur', 'Bhaktapur'];
  const nodesByCity = {
    Kathmandu: nodes.filter((n) => !n.city || n.city === 'Kathmandu'),
    Lalitpur: nodes.filter((n) => n.city === 'Lalitpur'),
    Bhaktapur: nodes.filter((n) => n.city === 'Bhaktapur')
  };

  // Compute time difference between routes
  const timeDiff =
    primary && alt
      ? Math.round((alt.totalTravelTimeMin - primary.totalTravelTimeMin) * 10) / 10
      : null;

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            Tri-City Route & Detour Planner
          </h3>
          <p className="text-[11px] text-slate-400">
            Kathmandu, Lalitpur & Bhaktapur inter-city corridors
          </p>
        </div>

        {(originId || destinationId) && (
          <button
            onClick={onClearRoutes}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Clear Route"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Origin / Destination Pickers */}
      <div className="space-y-2.5">
        <div>
          <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Origin Intersection (Start)
          </label>
          <select
            value={originId || ''}
            onChange={(e) => onSelectOrigin(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select starting junction...</option>
            {cities.map((city) => (
              <optgroup key={`orig_group_${city}`} label={`── ${city} ──`}>
                {nodesByCity[city].map((n) => (
                  <option key={`orig_${n.id}`} value={n.id}>
                    {n.name} ({n.nepaliName})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            Destination Intersection (End)
          </label>
          <select
            value={destinationId || ''}
            onChange={(e) => onSelectDestination(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="">Select destination junction...</option>
            {cities.map((city) => (
              <optgroup key={`dest_group_${city}`} label={`── ${city} ──`}>
                {nodesByCity[city].map((n) => (
                  <option key={`dest_${n.id}`} value={n.id}>
                    {n.name} ({n.nepaliName})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Presets */}
      <div>
        <div className="text-[11px] font-semibold text-slate-400 mb-1.5">
          Major Tri-City Commuter Corridors:
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => onApplyPreset(p.from, p.to)}
              className="py-1 px-2 text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 text-slate-300 rounded-md transition-colors text-left truncate"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Route Results Comparison Card */}
      {primary ? (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          {/* 1. Primary Route */}
          <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-bold text-cyan-200">
                  Primary Shortest Path
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-cyan-300">
                {primary.totalTravelTimeMin} min
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Distance:</span>
                <span className="font-mono font-semibold">{primary.totalDistanceKm} km</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Avg Speed:</span>
                <span className="font-mono font-semibold">{primary.avgSpeed} km/h</span>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 truncate">
              Via {primary.pathRoadIds.length} segments ({primary.pathNodeIds.length} junctions)
            </div>
          </div>

          {/* 2. Alternative Detour Route */}
          {alt ? (
            <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-xs font-bold text-amber-200">
                    Alternative Bypass Detour
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-300">
                  {alt.totalTravelTimeMin} min
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Distance:</span>
                  <span className="font-mono font-semibold">{alt.totalDistanceKm} km</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Avg Speed:</span>
                  <span className="font-mono font-semibold">{alt.avgSpeed} km/h</span>
                </div>
              </div>

              {/* Detour Recommendation Note */}
              <div className="p-2 bg-slate-950/60 rounded text-[11px] text-slate-300 border border-slate-800">
                {timeDiff <= 0 ? (
                  <span className="text-emerald-400 font-medium">
                    ⚡ Detour saves {Math.abs(timeDiff)} min by avoiding arterial bottleneck!
                  </span>
                ) : (
                  <span className="text-amber-300/90">
                    Detour adds {timeDiff} min (+{(alt.totalDistanceKm - primary.totalDistanceKm).toFixed(1)} km) but avoids main gridlocks.
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-slate-950/40 rounded-lg text-xs text-slate-400 text-center">
              No feasible alternative route found for this pair.
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-xl text-center space-y-1">
          <Navigation className="w-5 h-5 text-slate-500 mx-auto" />
          <div className="text-xs text-slate-300 font-medium">
            Select origin and destination
          </div>
          <div className="text-[11px] text-slate-400">
            Click on map intersections or pick from dropdowns above
          </div>
        </div>
      )}
    </div>
  );
}
