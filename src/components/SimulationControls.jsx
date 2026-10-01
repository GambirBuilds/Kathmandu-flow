import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  CloudRain,
  Sun,
  CloudFog,
  ShieldAlert,
  Plus,
  Minus,
  CheckCircle2,
  Sliders,
  Gauge,
  Clock
} from 'lucide-react';

export default function SimulationControls({
  config,
  onUpdateVolume,
  onUpdateCapacity,
  onUpdateSpeed,
  onUpdateSignalDuration,
  onUpdateWeather,
  onTogglePlayPause,
  onReset,
  onCloseSpecificRoad,
  onReopenAllRoads,
  closedRoadCount = 0
}) {
  const {
    volumeMultiplier = 1.0,
    capacityMultiplier = 1.0,
    simulationSpeed = 1.0,
    globalSignalDuration = 35,
    weather = 'clear',
    isRunning = true
  } = config || {};

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 space-y-4">
      {/* Title & Playback Row */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Simulation Parameters
          </h3>
          <p className="text-[11px] text-slate-400">
            Dynamically adjust flow, capacity, and timing
          </p>
        </div>

        {/* Speed Multiplier Segmented Tabs */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950 border border-slate-800 rounded-lg">
          {[0.5, 1.0, 2.0, 4.0].map((spd) => (
            <button
              key={spd}
              onClick={() => onUpdateSpeed(spd)}
              className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
                simulationSpeed === spd
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Control 1: Vehicle Volume */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-sky-400" />
            Traffic Fleet Volume
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono tabular-nums font-bold text-sky-300">
              {Math.round(volumeMultiplier * 100)}%
            </span>
            <span className="text-[11px] text-slate-500">
              ({volumeMultiplier > 1 ? `+${Math.round((volumeMultiplier - 1) * 100)}%` : `${Math.round((volumeMultiplier - 1) * 100)}%`})
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0.2"
          max="3.0"
          step="0.05"
          value={volumeMultiplier}
          onChange={(e) => onUpdateVolume(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
        />

        {/* Quick volume presets */}
        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => onUpdateVolume(Math.max(0.2, volumeMultiplier - 0.25))}
            className="flex-1 py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded border border-slate-700/60 transition-colors flex items-center justify-center gap-1"
          >
            <Minus className="w-3 h-3" />
            <span>-25%</span>
          </button>
          <button
            onClick={() => onUpdateVolume(1.0)}
            className="flex-1 py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded border border-slate-700/60 transition-colors"
          >
            Normal (100%)
          </button>
          <button
            onClick={() => onUpdateVolume(Math.min(3.0, volumeMultiplier + 0.25))}
            className="flex-1 py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded border border-slate-700/60 transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3 h-3" />
            <span>+25%</span>
          </button>
          <button
            onClick={() => onUpdateVolume(1.65)}
            className="flex-1 py-1 px-2 text-[11px] bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded border border-amber-500/30 transition-colors"
          >
            Rush (165%)
          </button>
        </div>
      </div>

      {/* Control 2: Road Capacity Multiplier */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-200">
            Roadway Capacity Modifier
          </label>
          <span className="font-mono tabular-nums font-bold text-amber-300">
            {Math.round(capacityMultiplier * 100)}%
          </span>
        </div>

        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.05"
          value={capacityMultiplier}
          onChange={(e) => onUpdateCapacity(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />

        <div className="flex items-center gap-1.5 pt-1">
          <button
            onClick={() => onUpdateCapacity(0.7)}
            className="flex-1 py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded border border-slate-700/60 transition-colors"
          >
            Constricted (70%)
          </button>
          <button
            onClick={() => onUpdateCapacity(1.0)}
            className="flex-1 py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded border border-slate-700/60 transition-colors"
          >
            Standard (100%)
          </button>
          <button
            onClick={() => onUpdateCapacity(1.4)}
            className="flex-1 py-1 px-2 text-[11px] bg-slate-800 hover:bg-slate-700/80 text-slate-300 rounded border border-slate-700/60 transition-colors"
          >
            Expanded (140%)
          </button>
        </div>
      </div>

      {/* Control 3: Traffic Light Timing */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            Signal Phase Timing
          </label>
          <span className="font-mono tabular-nums font-bold text-emerald-300">
            {globalSignalDuration}s per cycle
          </span>
        </div>

        <input
          type="range"
          min="15"
          max="80"
          step="5"
          value={globalSignalDuration}
          onChange={(e) => onUpdateSignalDuration(parseInt(e.target.value, 10))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
        />
      </div>

      {/* Control 4: Weather Conditions */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-semibold text-slate-200 block">
          Environmental Condition
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => onUpdateWeather('clear')}
            className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
              weather === 'clear'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <button
            onClick={() => onUpdateWeather('monsoon_rain')}
            className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
              weather === 'monsoon_rain'
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Monsoon</span>
          </button>

          <button
            onClick={() => onUpdateWeather('fog')}
            className={`py-1.5 px-2 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
              weather === 'fog'
                ? 'bg-slate-700/40 border-slate-600 text-slate-200'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudFog className="w-3.5 h-3.5" />
            <span>Fog</span>
          </button>
        </div>
      </div>

      {/* Control 5: Road Closures Simulation Trigger */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-200 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Simulate Road Closures
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {closedRoadCount} closed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onCloseSpecificRoad('road_dhobikhola_maitighar', 'Maitighar Assembly Closure')}
            className="py-1.5 px-2 text-[11px] text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition-colors truncate"
            title="Close Maitighar Corridor"
          >
            ⛔ Close Maitighar
          </button>
          <button
            onClick={() => onCloseSpecificRoad('road_koteshwor_lokanthali', 'Arniko Express Highway Diversion')}
            className="py-1.5 px-2 text-[11px] text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition-colors truncate"
            title="Close Koteshwor ↔ Lokanthali"
          >
            ⛔ Close Bhaktapur Gateway
          </button>
          <button
            onClick={() => onCloseSpecificRoad('road_thapathali_kupondole', 'Thapathali Bridge Repair')}
            className="py-1.5 px-2 text-[11px] text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition-colors truncate"
            title="Close Thapathali ↔ Lalitpur Bridge"
          >
            ⛔ Close Lalitpur Bridge
          </button>
          <button
            onClick={() => onCloseSpecificRoad('road_sallaghari_bhaktapur_durbar', 'Biska Jatra Chariot Route')}
            className="py-1.5 px-2 text-[11px] text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition-colors truncate"
            title="Close Bhaktapur Durbar Entrance"
          >
            ⛔ Close Bhaktapur Core
          </button>
          <button
            onClick={() => onCloseSpecificRoad('road_singha_putalisadak', 'Putalisadak Drainage Maintenance')}
            className="py-1.5 px-2 text-[11px] text-left bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg transition-colors truncate"
            title="Close Putalisadak"
          >
            ⛔ Close Putalisadak
          </button>
          <button
            onClick={onReopenAllRoads}
            disabled={closedRoadCount === 0}
            className="py-1.5 px-2 text-[11px] text-center bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 font-semibold"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Re-open All</span>
          </button>
        </div>
      </div>

      {/* Model Notice */}
      <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-[10px] text-slate-400 leading-relaxed">
        <strong className="text-slate-300">Simulation Principle:</strong> More vehicles + lower road capacity → higher congestion. Results are theoretical estimates, not live CCTV/satellite telemetry.
      </div>
    </div>
  );
}
