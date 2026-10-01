import React from 'react';
import { Play, Pause, RotateCcw, SlidersHorizontal, BookOpen, Layers, Compass } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  isRunning,
  onTogglePlayPause,
  onReset,
  onOpenLegend,
  onOpenScenariosModal,
  trafficLevel,
  trafficLevelColor
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 sticky top-0">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-bold text-base">
            K
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white truncate flex items-center gap-2">
              Kathmandu Flow
              <span className="text-xs font-normal text-slate-400 hidden lg:inline">
                Kathmandu · Lalitpur · Bhaktapur
              </span>
            </h1>
          </div>
        </div>

        {/* Traffic Level Status Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-800 text-xs text-slate-400">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: trafficLevelColor }}
          />
          <span className="font-medium text-slate-200">{trafficLevel} Traffic</span>
          <span className="text-slate-500 hidden md:inline">· Simulation Model</span>
        </div>
      </div>

      {/* Zone 2: Navigation & Mode Tabs */}
      <nav className="flex items-center gap-1 p-1 bg-slate-950/60 border border-slate-800/80 rounded-lg">
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'simulation'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Interactive Map</span>
        </button>

        <button
          onClick={() => setActiveTab('routing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'routing'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Route & Detours</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Corridor Stats</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenScenariosModal}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-lg transition-colors"
          title="Choose or compare scenarios"
        >
          <span>Scenarios</span>
        </button>

        <button
          onClick={onOpenLegend}
          className="p-1.5 text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
          title="Simulation Legend & Formulas"
        >
          <BookOpen className="w-4 h-4" />
        </button>

        <button
          onClick={onReset}
          className="p-1.5 text-slate-400 hover:text-amber-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-colors"
          title="Reset Simulation State"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onTogglePlayPause}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap ${
            isRunning
              ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Resume</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
