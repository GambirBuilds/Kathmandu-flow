import React from 'react';
import { BookOpen, X, Calculator, Info, ShieldCheck } from 'lucide-react';
import { VEHICLE_TYPES } from '../simulation/simulationEngine.js';

export default function LegendModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Simulation Engine Guide & Methodology
              </h3>
              <p className="text-xs text-slate-400">
                Mathematical modeling behind Kathmandu Flow
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Section 1: Mathematical Logic */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-amber-400" />
              Traffic Congestion & Speed Calculation
            </h4>
            <p className="text-slate-400 leading-relaxed">
              The engine models macroscopic traffic dynamics adapted from the Bureau of Public Roads (BPR) volume-delay functions:
            </p>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2 font-mono text-[11px] text-amber-300">
              <div>// 1. Congestion Index (Density vs Capacity)</div>
              <div className="text-white">
                Congestion = (ActiveVehicles / EffectiveCapacity) × SignalPenalty × WeatherFactor
              </div>
              <div className="pt-1.5">// 2. Dynamic Speed Response</div>
              <div className="text-white">
                Speed = FreeFlowSpeed × max(0.12, 1 - Congestion<sup>1.5</sup>)
              </div>
              <div className="pt-1.5">// 3. Travel Time Estimation</div>
              <div className="text-white">
                TravelTime (minutes) = (SegmentLength / Speed) × 60
              </div>
            </div>
          </div>

          {/* Section 2: Flow Levels */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white">Traffic Level Hierarchy</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-400">Low Congestion (&lt;40%)</div>
                  <div className="text-[11px] text-slate-400">
                    Vehicles travel near maximum speed limits with minimal signal queueing.
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-400">Moderate Flow (40% - 68%)</div>
                  <div className="text-[11px] text-slate-400">
                    Stable arterial flow with short delays at major roundabouts.
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-orange-400">Heavy Traffic (68% - 88%)</div>
                  <div className="text-[11px] text-slate-400">
                    Speeds drop by 40-60%; multi-cycle queues at Koteshwor, Maitighar, Kalanki.
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg flex items-start gap-2.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-400">Critical Gridlock (&gt;88%)</div>
                  <div className="text-[11px] text-slate-400">
                    Severe saturation, crawl speeds (5-8 km/h), diversions strongly advised.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Kathmandu Vehicle Fleet */}
          <div className="space-y-2.5">
            <h4 className="text-sm font-bold text-white">Kathmandu Modal Fleet Composition</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              {Object.entries(VEHICLE_TYPES).map(([k, def]) => (
                <div key={k} className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1">
                  <div
                    className="w-3 h-3 rounded-full mx-auto"
                    style={{ backgroundColor: def.color }}
                  />
                  <div className="font-bold text-white">{def.name.split(' ')[0]}</div>
                  <div className="text-[11px] text-slate-400">{Math.round(def.share * 100)}% of fleet</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Mandatory Disclaimer */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300">Simulation Estimates Notice:</strong> All metrics, travel times, speeds, and queue delays are calculated outputs of an interactive mathematical simulation model based on Kathmandu Valley roadway geometry. They are intended for educational and scenario analysis, not real-time satellite or GPS navigation feeds.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-1.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
