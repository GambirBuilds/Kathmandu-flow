import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  Trash2,
  Download,
  Check,
  Plus,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  FolderOpen,
  X
} from 'lucide-react';
import { DEFAULT_SCENARIOS } from '../simulation/scenarioPresets.js';
import {
  getCustomScenarios,
  saveCustomScenario,
  deleteCustomScenario,
  exportScenariosAsJSON
} from '../simulation/storageService.js';
import kathmanduBannerImg from '../assets/images/kathmandu_transit_overview_1790817567698.jpg';

export default function ScenarioManager({
  activeScenarioId,
  currentConfig,
  currentSummary,
  onApplyScenario,
  isOpen,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' | 'comparison' | 'custom'
  const [customList, setCustomList] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveDesc, setSaveDesc] = useState('');

  // Load custom scenarios on open
  useEffect(() => {
    if (isOpen) {
      setCustomList(getCustomScenarios());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveScenario = (e) => {
    e.preventDefault();
    if (!saveName.trim()) return;

    const newScen = {
      name: saveName.trim(),
      nepaliName: 'प्रयोगकर्ताको अनुकूलित परिदृश्य',
      description: saveDesc.trim() || 'Custom simulation parameter state',
      volumeMultiplier: currentConfig.volumeMultiplier,
      capacityMultiplier: currentConfig.capacityMultiplier,
      weather: currentConfig.weather,
      simulationSpeed: currentConfig.simulationSpeed,
      signalDuration: currentConfig.globalSignalDuration,
      closedRoadIds: [],
      incidents: []
    };

    saveCustomScenario(newScen);
    setCustomList(getCustomScenarios());
    setShowSaveModal(false);
    setSaveName('');
    setSaveDesc('');
  };

  const handleDeleteScenario = (id) => {
    if (confirm('Delete this saved scenario?')) {
      deleteCustomScenario(id);
      setCustomList(getCustomScenarios());
    }
  };

  const handleExport = () => {
    exportScenariosAsJSON([...DEFAULT_SCENARIOS, ...customList]);
  };

  // Baseline comparison mock/standard values
  const baseline = {
    avgSpeed: 28.5,
    congestionIndex: 45,
    travelDelay: 1.25,
    closedRoads: 0
  };

  const currentSpeed = currentSummary?.avgSpeed || 24;
  const currentCong = currentSummary?.congestionIndex || 50;
  const currentDelay = parseFloat(currentSummary?.travelTimeIndex || '1.3');
  const currentClosed = currentSummary?.closedRoads || 0;

  const speedDelta = Math.round((currentSpeed - baseline.avgSpeed) * 10) / 10;
  const congDelta = currentCong - baseline.congestionIndex;
  const delayDelta = (currentDelay - baseline.travelDelay).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Banner with Kathmandu cartographic image */}
        <div className="relative h-28 w-full bg-slate-950 overflow-hidden border-b border-slate-800">
          <img
            src={kathmanduBannerImg}
            alt="Kathmandu Valley Transit Illustration"
            className="w-full h-full object-cover opacity-35 filter saturate-150"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

          <div className="absolute bottom-3 left-6 right-6 flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                Kathmandu Traffic Lab
              </div>
              <h2 className="text-xl font-bold text-white">
                Scenario Management & Impact Comparison
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-6 pt-3 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('presets')}
              className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'presets'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Valley Presets ({DEFAULT_SCENARIOS.length})
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'comparison'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Impact Comparison (vs Normal)
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              className={`pb-2.5 px-2 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'custom'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Custom Scenarios ({customList.length})
            </button>
          </div>

          <button
            onClick={() => setShowSaveModal(true)}
            className="mb-2 flex items-center gap-1.5 py-1 px-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Current State</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: PRESET SCENARIOS */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEFAULT_SCENARIOS.map((scen) => {
                const isActive = scen.id === activeScenarioId;
                return (
                  <div
                    key={scen.id}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                    onClick={() => {
                      onApplyScenario(scen);
                      onClose();
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          {scen.category}
                        </span>
                        {isActive && (
                          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Active
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white mb-0.5">
                        {scen.name}
                      </h4>
                      <div className="text-[11px] text-amber-300/80 mb-1.5">
                        {scen.nepaliName}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        {scen.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <span>Vol: {Math.round(scen.volumeMultiplier * 100)}%</span>
                      <span>Cap: {Math.round(scen.capacityMultiplier * 100)}%</span>
                      <span className="capitalize">{scen.weather.replace('_', ' ')}</span>
                      <span className="font-semibold text-amber-400">Apply →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: IMPACT COMPARISON (Baseline vs Current) */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300">
                Comparing current simulation conditions against standard <strong>Normal Midday Flow baseline</strong>.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Metric A: Speed */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-slate-400">
                    Average Speed Impact
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold font-mono text-white">
                        {currentSpeed}
                      </span>
                      <span className="text-xs text-slate-400 ml-1">km/h</span>
                    </div>
                    <div
                      className={`flex items-center text-xs font-bold ${
                        speedDelta < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {speedDelta < 0 ? (
                        <TrendingDown className="w-4 h-4 mr-0.5" />
                      ) : (
                        <TrendingUp className="w-4 h-4 mr-0.5" />
                      )}
                      <span>{speedDelta > 0 ? `+${speedDelta}` : speedDelta} km/h</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Normal baseline: {baseline.avgSpeed} km/h
                  </div>
                </div>

                {/* Metric B: Congestion */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-slate-400">
                    Congestion Index Delta
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold font-mono text-white">
                        {currentCong}%
                      </span>
                    </div>
                    <div
                      className={`flex items-center text-xs font-bold ${
                        congDelta > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      <span>{congDelta > 0 ? `+${congDelta}%` : `${congDelta}%`}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Normal baseline: {baseline.congestionIndex}%
                  </div>
                </div>

                {/* Metric C: Delay Multiplier */}
                <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-xs font-semibold text-slate-400">
                    Trip Travel Time Index
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-bold font-mono text-white">
                        {currentDelay}x
                      </span>
                    </div>
                    <div
                      className={`flex items-center text-xs font-bold ${
                        delayDelta > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      <span>{delayDelta > 0 ? `+${delayDelta}x` : `${delayDelta}x`}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Normal baseline: {baseline.travelDelay}x
                  </div>
                </div>
              </div>

              {/* Summary Conclusion Box */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Traffic Engineer Evaluation
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {congDelta > 20
                    ? `Current parameters create heavy gridlock across Ring Road and central arterials. A commuter travelling Kalanki to Koteshwor will experience approximately ${Math.round(congDelta * 0.8)} additional minutes of queue delay compared to standard midday conditions.`
                    : congDelta < -10
                    ? 'Current simulation represents optimal transit efficiency with minimal junction queue times and above-average vehicle throughput.'
                    : 'Current flow dynamics remain within normal operational capacity thresholds across Kathmandu Valley.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM SAVED SCENARIOS */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  Custom user configurations persisted in browser localStorage
                </div>
                {customList.length > 0 && (
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-1.5 py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                )}
              </div>

              {customList.length === 0 ? (
                <div className="p-8 text-center bg-slate-950/40 border border-slate-800 rounded-xl space-y-2">
                  <FolderOpen className="w-8 h-8 text-slate-600 mx-auto" />
                  <div className="text-sm font-semibold text-slate-300">
                    No custom scenarios saved yet
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Tune vehicle volume, road closures, and signal timers in the controls, then click "Save Current State" above.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {customList.map((scen) => (
                    <div
                      key={scen.id}
                      className="p-3.5 rounded-xl border bg-slate-950/60 border-slate-800 hover:border-slate-700 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">
                            Custom Preset
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteScenario(scen.id);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Delete Scenario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">
                          {scen.name}
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                          {scen.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>Vol: {Math.round(scen.volumeMultiplier * 100)}%</span>
                        <span>Cap: {Math.round(scen.capacityMultiplier * 100)}%</span>
                        <button
                          onClick={() => {
                            onApplyScenario(scen);
                            onClose();
                          }}
                          className="font-bold text-amber-400 hover:underline"
                        >
                          Load & Run →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Kathmandu Flow Engine · Mathematical Flow Estimates
          </div>
          <button
            onClick={onClose}
            className="py-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>

      {/* Save Scenario Modal Dialog */}
      {showSaveModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
          <form
            onSubmit={handleSaveScenario}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-md space-y-3.5 shadow-2xl"
          >
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Save className="w-4 h-4 text-amber-400" />
              Save Current Scenario to LocalStorage
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Scenario Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Kalanki Flyover Maintenance & Rain"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Description / Notes
              </label>
              <textarea
                rows={3}
                placeholder="Describe road closures, volume level, and traffic behavior..."
                value={saveDesc}
                onChange={(e) => setSaveDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-2.5 bg-slate-950/60 rounded text-[11px] text-slate-400 space-y-1">
              <div>Volume: {Math.round(currentConfig.volumeMultiplier * 100)}%</div>
              <div>Capacity: {Math.round(currentConfig.capacityMultiplier * 100)}%</div>
              <div>Weather: {currentConfig.weather}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="py-1.5 px-3 text-xs text-slate-400 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                Save Scenario
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
