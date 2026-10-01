import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Gauge,
  Car,
  Sliders,
  MapPin,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function RoadDetailsPanel({
  selectedRoad,
  selectedNode,
  onClosePanel,
  onToggleClosure,
  onToggleSignalPhase,
  onSetOrigin,
  onSetDestination
}) {
  const [customReason, setCustomReason] = useState('Administrative Restriction');

  if (!selectedRoad && !selectedNode) return null;

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-800">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
            {selectedRoad ? 'Road Segment Inspector' : 'Intersection Inspector'}
          </div>
          <h3 className="text-base font-bold text-white">
            {selectedRoad ? selectedRoad.name : selectedNode.name}
          </h3>
          <div className="text-xs text-slate-400">
            {selectedRoad ? selectedRoad.corridor : selectedNode.nepaliName}
          </div>
        </div>

        <button
          onClick={onClosePanel}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ROAD INSPECTOR VIEW */}
      {selectedRoad && (
        <div className="space-y-3.5">
          {/* Status Badge */}
          <div
            className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
              selectedRoad.isClosed
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                : selectedRoad.congestionRatio >= 0.85
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                : selectedRoad.congestionRatio >= 0.65
                ? 'bg-orange-500/10 border-orange-500/20 text-orange-300'
                : selectedRoad.congestionRatio >= 0.4
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {selectedRoad.isClosed ? (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span className="font-semibold">
                {selectedRoad.isClosed
                  ? `CLOSED: ${selectedRoad.closureReason || 'Restricted'}`
                  : `OPERATIONAL (${Math.round(selectedRoad.congestionRatio * 100)}% Congestion)`}
              </span>
            </div>
            <span className="font-mono text-[11px]">
              {selectedRoad.lanes} Lanes
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulated Speed</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold font-mono text-white">
                  {selectedRoad.isClosed ? 0 : selectedRoad.currentSpeed}
                </span>
                <span className="text-slate-400 text-[11px]">
                  / {selectedRoad.speedLimit} km/h
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                <span>Travel Time</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold font-mono text-white">
                  {selectedRoad.isClosed ? 'Blocked' : `${selectedRoad.travelTimeMin} min`}
                </span>
                <span className="text-slate-400 text-[11px]">
                  ({selectedRoad.lengthKm} km)
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Car className="w-3.5 h-3.5 text-sky-400" />
                <span>Active Density</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold font-mono text-white">
                  {selectedRoad.currentVehicles}
                </span>
                <span className="text-slate-400 text-[11px]">vehicles</span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mb-1">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Design Capacity</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold font-mono text-white">
                  {selectedRoad.baseCapacity}
                </span>
                <span className="text-slate-400 text-[11px]">veh/hr</span>
              </div>
            </div>
          </div>

          {/* Closure Reason Selector & Toggle */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            {!selectedRoad.isClosed && (
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">
                  Closure Reason for Simulation:
                </label>
                <select
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="Road Maintenance & Asphalting">Road Maintenance & Asphalting</option>
                  <option value="VIP Motorcade Convoy Movement">VIP Motorcade Convoy Movement</option>
                  <option value="Monsoon Flash Flood Inundation">Monsoon Flash Flood Inundation</option>
                  <option value="Public Gathering & Demonstration">Public Gathering & Demonstration</option>
                  <option value="Water Pipeline / Culvert Repair">Water Pipeline / Culvert Repair</option>
                </select>
              </div>
            )}

            <button
              onClick={() => onToggleClosure(selectedRoad.id, customReason)}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                selectedRoad.isClosed
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-rose-600/90 hover:bg-rose-600 text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>
                {selectedRoad.isClosed ? 'Reopen Road Segment' : 'Simulate Road Closure'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* NODE / JUNCTION INSPECTOR VIEW */}
      {selectedNode && (
        <div className="space-y-3.5">
          <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Intersection Class:</span>
              <span className="font-semibold text-slate-200 capitalize">
                {selectedNode.type.replace('_', ' ')}
              </span>
            </div>

            {selectedNode.isSignal ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Traffic Light State:</span>
                  <span
                    className={`font-bold uppercase flex items-center gap-1.5 ${
                      selectedNode.signalPhase === 'green'
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor:
                          selectedNode.signalPhase === 'green' ? '#10B981' : '#EF4444'
                      }}
                    />
                    {selectedNode.signalPhase} ({Math.round(selectedNode.greenDuration - (selectedNode.timer || 0))}s left)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Estimated Queue Delay:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {selectedNode.delaySeconds} seconds
                  </span>
                </div>
              </>
            ) : (
              <div className="text-slate-400 text-[11px]">
                Unsignalized Roundabout / Free-flow Junction
              </div>
            )}
          </div>

          {/* Action buttons */}
          {selectedNode.isSignal && (
            <button
              onClick={() => onToggleSignalPhase(selectedNode.id)}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>Switch Signal Phase (Green ↔ Red)</span>
            </button>
          )}

          {/* Route Planning Origin/Destination shortcut */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => onSetOrigin(selectedNode.id)}
              className="py-1.5 px-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Set as Start</span>
            </button>
            <button
              onClick={() => onSetDestination(selectedNode.id)}
              className="py-1.5 px-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
              <span>Set as Destination</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
