import React from 'react';
import { Gauge, Activity, Car, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function MetricsOverview({ summary, config, activeScenarioName }) {
  const {
    avgSpeed = 24,
    congestionIndex = 50,
    trafficLevel = 'Moderate',
    trafficLevelColor = '#F59E0B',
    totalVehicles = 1200,
    simulatedVehiclesOnMap = 380,
    closedRoads = 0,
    travelTimeIndex = '1.25'
  } = summary || {};

  return (
    <div className="bg-slate-900/80 border-b border-slate-800 px-4 sm:px-6 py-2.5">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 items-center">
        {/* Metric 1: Average Speed */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-amber-400 shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Avg Valley Speed
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono tabular-nums text-white">
                {avgSpeed}
              </span>
              <span className="text-xs text-slate-400">km/h</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Congestion Index */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
            style={{
              backgroundColor: `${trafficLevelColor}15`,
              borderColor: `${trafficLevelColor}40`,
              color: trafficLevelColor
            }}
          >
            <Activity className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Congestion Index</span>
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: trafficLevelColor }}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold font-mono tabular-nums text-white">
                {congestionIndex}%
              </span>
              <span
                className="text-xs font-semibold"
                style={{ color: trafficLevelColor }}
              >
                {trafficLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Vehicles */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-sky-400 shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Simulated Fleet
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono tabular-nums text-white">
                {totalVehicles.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">
                ({simulatedVehiclesOnMap} on map)
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Travel Time Delay Multiplier */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-rose-400 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Travel Delay Factor
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold font-mono tabular-nums text-white">
                {travelTimeIndex}x
              </span>
              <span className="text-xs text-slate-400">baseline time</span>
            </div>
          </div>
        </div>

        {/* Metric 5: Active Incident / Closures (Desktop 5th column or hidden on narrow) */}
        <div className="hidden lg:flex items-center gap-3 border-l border-slate-800 pl-4">
          <div
            className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${
              closedRoads > 0
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
            }`}
          >
            {closedRoads > 0 ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider truncate">
              {activeScenarioName || 'Corridor Status'}
            </div>
            <div className="text-xs font-medium text-slate-200 truncate">
              {closedRoads > 0
                ? `${closedRoads} Road Segments Closed`
                : 'All Arterials Open'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
