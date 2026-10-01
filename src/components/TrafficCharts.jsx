import React from 'react';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  AlertCircle,
  Activity,
  Layers
} from 'lucide-react';
import { VEHICLE_TYPES } from '../simulation/simulationEngine.js';

export default function TrafficCharts({
  summary,
  history = [],
  corridors = []
}) {
  const {
    avgSpeed = 24,
    congestionIndex = 50,
    modalCounts = {},
    bottlenecks = [],
    corridorStats = []
  } = summary || {};

  // Timeline SVG dimensions
  const svgWidth = 520;
  const svgHeight = 160;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };
  const chartW = svgWidth - padding.left - padding.right;
  const chartH = svgHeight - padding.top - padding.bottom;

  // Build SVG path for Speed and Congestion timeline
  const renderTrendChart = () => {
    if (!history || history.length < 2) {
      return (
        <div className="h-36 flex items-center justify-center text-xs text-slate-400">
          Gathering simulation timeline data...
        </div>
      );
    }

    const maxSpeed = 60;
    const speedPoints = history.map((pt, i) => {
      const x = padding.left + (i / (history.length - 1)) * chartW;
      const y = padding.top + chartH - (Math.min(maxSpeed, pt.avgSpeed) / maxSpeed) * chartH;
      return `${x},${y}`;
    }).join(' ');

    const congestionPoints = history.map((pt, i) => {
      const x = padding.left + (i / (history.length - 1)) * chartW;
      const y = padding.top + chartH - (Math.min(100, pt.congestionIndex) / 100) * chartH;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-44 overflow-visible"
      >
        {/* Horizontal gridlines */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = padding.top + chartH - (val / 100) * chartH;
          return (
            <g key={`grid_${val}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={svgWidth - padding.right}
                y2={y}
                stroke="#1E293B"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 8}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] fill-slate-400 font-mono"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Speed Line (Amber) */}
        <polyline
          fill="none"
          stroke="#F59E0B"
          strokeWidth={2}
          points={speedPoints}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Congestion Line (Rose/Cyan) */}
        <polyline
          fill="none"
          stroke="#EF4444"
          strokeWidth={2}
          points={congestionPoints}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Latest dots */}
        {history.length > 0 && (() => {
          const lastIdx = history.length - 1;
          const lastPt = history[lastIdx];
          const lastX = padding.left + chartW;
          const lastSpeedY = padding.top + chartH - (Math.min(maxSpeed, lastPt.avgSpeed) / maxSpeed) * chartH;
          const lastCongY = padding.top + chartH - (Math.min(100, lastPt.congestionIndex) / 100) * chartH;
          return (
            <g>
              <circle cx={lastX} cy={lastSpeedY} r={4} fill="#F59E0B" stroke="#0F172A" strokeWidth={2} />
              <circle cx={lastX} cy={lastCongY} r={4} fill="#EF4444" stroke="#0F172A" strokeWidth={2} />
            </g>
          );
        })()}
      </svg>
    );
  };

  const totalModalVehicles = Object.values(modalCounts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-4">
      {/* Chart 1: Real-time Timeline (Speed vs Congestion) */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Real-Time Dynamic Trend
            </h3>
            <p className="text-[11px] text-slate-400">
              Corridor speed vs network congestion over simulation run
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300 font-medium">Speed (km/h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300 font-medium">Congestion (%)</span>
            </div>
          </div>
        </div>

        <div className="pt-2">{renderTrendChart()}</div>
      </div>

      {/* Grid of Corridor Congestion & Modal Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 2: Major Corridor Congestion Rankings */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                Corridor Congestion Index
              </h3>
              <p className="text-[11px] text-slate-400">
                Key Kathmandu highway segments
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Top Bottlenecks
            </span>
          </div>

          <div className="space-y-2.5 pt-1">
            {corridorStats.slice(0, 7).map((corridor) => {
              const cong = corridor.avgCongestion;
              const color =
                cong >= 85
                  ? 'bg-rose-500'
                  : cong >= 65
                  ? 'bg-orange-500'
                  : cong >= 42
                  ? 'bg-amber-500'
                  : 'bg-emerald-500';

              return (
                <div key={corridor.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-200 font-medium truncate max-w-[220px]">
                      {corridor.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[11px]">
                        {corridor.avgSpeed} km/h
                      </span>
                      <span className="font-mono font-bold text-white text-xs w-9 text-right">
                        {cong}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${color}`}
                      style={{ width: `${Math.min(100, cong)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Kathmandu Vehicle Fleet Modal Split */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-400" />
                Fleet Modal Distribution
              </h3>
              <p className="text-[11px] text-slate-400">
                Authentic Kathmandu vehicle composition
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {totalModalVehicles} active
            </span>
          </div>

          {/* Modal Split Progress Bar */}
          <div className="space-y-3 pt-1">
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex">
              {Object.keys(VEHICLE_TYPES).map((typeKey) => {
                const count = modalCounts[typeKey] || 0;
                const pct = Math.round((count / totalModalVehicles) * 100);
                const typeDef = VEHICLE_TYPES[typeKey];
                return (
                  <div
                    key={typeKey}
                    style={{
                      width: `${pct}%`,
                      backgroundColor: typeDef.color
                    }}
                    title={`${typeDef.name}: ${count} (${pct}%)`}
                  />
                );
              })}
            </div>

            {/* Modal Breakdown Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.keys(VEHICLE_TYPES).map((typeKey) => {
                const count = modalCounts[typeKey] || 0;
                const pct = Math.round((count / totalModalVehicles) * 100);
                const typeDef = VEHICLE_TYPES[typeKey];
                return (
                  <div
                    key={typeKey}
                    className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1"
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: typeDef.color }}
                      />
                      <span className="font-semibold text-slate-200 truncate">
                        {typeDef.name.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-400">
                        {typeDef.name.includes('/') ? typeDef.name.split('/')[1] : ''}
                      </span>
                      <span className="font-mono font-bold text-white text-xs">
                        {count} ({pct}%)
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-2 bg-slate-950/40 border border-slate-800/60 rounded text-[11px] text-slate-400 leading-relaxed">
              💡 Motorcycles and scooters compose ~60% of Kathmandu Valley's active morning fleet, filtering quickly past stalled four-wheelers.
            </div>
          </div>
        </div>
      </div>

      {/* Chart 4: Top Bottlenecks Detail List */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              Critical Choke Points & Queue Delays
            </h3>
            <p className="text-[11px] text-slate-400">
              Highest congestion segments requiring traffic police intervention
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {bottlenecks.map((road, idx) => (
            <div
              key={road.id}
              className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white truncate max-w-[180px]">
                  {idx + 1}. {road.name}
                </span>
                <span className="font-mono text-xs font-bold text-rose-400">
                  {Math.round(road.congestionRatio * 100)}%
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{road.corridor}</div>
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Est. Speed:</span>
                <span className="font-mono font-semibold text-amber-300">
                  {road.currentSpeed} km/h
                </span>
                <span className="text-slate-400">Delay:</span>
                <span className="font-mono text-slate-200">
                  {road.travelTimeMin} min
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
