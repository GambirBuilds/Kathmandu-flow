import React, { useState, useEffect, useRef, useCallback } from 'react';
import { simEngine } from './simulation/simulationEngine.js';
import { DEFAULT_SCENARIOS } from './simulation/scenarioPresets.js';
import Header from './components/Header.jsx';
import MetricsOverview from './components/MetricsOverview.jsx';
import CityMap from './components/CityMap.jsx';
import SimulationControls from './components/SimulationControls.jsx';
import RoadDetailsPanel from './components/RoadDetailsPanel.jsx';
import RoutePlanner from './components/RoutePlanner.jsx';
import TrafficCharts from './components/TrafficCharts.jsx';
import ScenarioManager from './components/ScenarioManager.jsx';
import LegendModal from './components/LegendModal.jsx';
import { Sliders, Compass, BarChart2, MapPin, AlertTriangle } from 'lucide-react';

export default function App() {
  const [simState, setSimState] = useState(() => simEngine.getState());
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'routing' | 'analytics'
  const [selectedRoadId, setSelectedRoadId] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Route Planning State
  const [originNodeId, setOriginNodeId] = useState('kalanki');
  const [destinationNodeId, setDestinationNodeId] = useState('sinamangal');
  const [routesResult, setRoutesResult] = useState(null);

  // Modals
  const [activeScenario, setActiveScenario] = useState(DEFAULT_SCENARIOS[0]);
  const [isScenariosModalOpen, setIsScenariosModalOpen] = useState(false);
  const [isLegendOpen, setIsLegendOpen] = useState(false);

  // Mobile sidebar drawer toggle
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // 1. Subscribe to simulation engine state updates
  useEffect(() => {
    const unsubscribe = simEngine.subscribe((newState) => {
      setSimState(newState);
    });
    return unsubscribe;
  }, []);

  // 2. High-frequency Animation Loop driving simulation physics
  useEffect(() => {
    let animId;
    let lastHistoryRecordTime = performance.now();

    const loop = (currentTime) => {
      simEngine.tick(currentTime);

      // Periodically record snapshot for charts (~every 1.5 seconds)
      if (currentTime - lastHistoryRecordTime > 1500) {
        simEngine.recordHistorySnapshot();
        lastHistoryRecordTime = currentTime;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // 3. Recalculate route whenever origin/destination or closures change
  const recalculateRoutes = useCallback(() => {
    if (originNodeId && destinationNodeId && originNodeId !== destinationNodeId) {
      const result = simEngine.findRoutes(originNodeId, destinationNodeId);
      setRoutesResult(result);
    } else {
      setRoutesResult(null);
    }
  }, [originNodeId, destinationNodeId]);

  useEffect(() => {
    recalculateRoutes();
  }, [originNodeId, destinationNodeId, simState.roads, recalculateRoutes]);

  // Handlers for user interactions
  const handleTogglePlayPause = () => {
    simEngine.togglePlayPause();
  };

  const handleReset = () => {
    simEngine.resetSimulation();
    setActiveScenario(DEFAULT_SCENARIOS[0]);
    setSelectedRoadId(null);
    setSelectedNodeId(null);
  };

  const handleUpdateVolume = (vol) => {
    simEngine.setVolumeMultiplier(vol);
  };

  const handleUpdateCapacity = (cap) => {
    simEngine.setCapacityMultiplier(cap);
  };

  const handleUpdateSpeed = (spd) => {
    simEngine.setSimulationSpeed(spd);
  };

  const handleUpdateSignalDuration = (duration) => {
    simEngine.setSignalDuration(duration);
  };

  const handleUpdateWeather = (weather) => {
    simEngine.setWeather(weather);
  };

  const handleSelectRoad = (roadId) => {
    setSelectedRoadId(roadId);
    setSelectedNodeId(null);
    setMobileDrawerOpen(true);
  };

  const handleSelectNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    setSelectedRoadId(null);
    setMobileDrawerOpen(true);
  };

  const handleToggleClosure = (roadId, reason) => {
    simEngine.toggleRoadClosure(roadId, reason);
  };

  const handleToggleSignalPhase = (nodeId) => {
    simEngine.toggleSignalPhase(nodeId);
  };

  const handleCloseSpecificRoad = (roadId, reason) => {
    const road = simState.roads.find((r) => r.id === roadId);
    if (road && !road.isClosed) {
      simEngine.toggleRoadClosure(roadId, reason);
    }
  };

  const handleReopenAllRoads = () => {
    simState.roads.forEach((r) => {
      if (r.isClosed) {
        simEngine.toggleRoadClosure(r.id);
      }
    });
  };

  const handleApplyScenario = (scenario) => {
    simEngine.applyScenario(scenario);
    setActiveScenario(scenario);
  };

  const selectedRoad = simState.roads.find((r) => r.id === selectedRoadId);
  const selectedNode = simState.nodes.find((n) => n.id === selectedNodeId);

  // Formatted route highlight IDs for map
  const routeHighlights = routesResult
    ? {
        primaryRoadIds: routesResult.primary?.pathRoadIds || [],
        altRoadIds: routesResult.alternative?.pathRoadIds || []
      }
    : null;

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Header (Top Bar Contract Compliant) */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRunning={simState.config.isRunning}
        onTogglePlayPause={handleTogglePlayPause}
        onReset={handleReset}
        onOpenLegend={() => setIsLegendOpen(true)}
        onOpenScenariosModal={() => setIsScenariosModalOpen(true)}
        trafficLevel={simState.summary.trafficLevel}
        trafficLevelColor={simState.summary.trafficLevelColor}
      />

      {/* 2. Real-Time Metrics KPI Bar */}
      <MetricsOverview
        summary={simState.summary}
        config={simState.config}
        activeScenarioName={activeScenario?.name}
      />

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* VIEW A & B: Map is the primary workspace */}
        <div className="flex-1 relative h-full">
          <CityMap
            nodes={simState.nodes}
            roads={simState.roads}
            vehicles={simState.vehicles}
            selectedRoadId={selectedRoadId}
            selectedNodeId={selectedNodeId}
            onSelectRoad={handleSelectRoad}
            onSelectNode={handleSelectNode}
            onToggleSignalPhase={handleToggleSignalPhase}
            highlightedRoute={routeHighlights}
            originNodeId={originNodeId}
            destinationNodeId={destinationNodeId}
          />

          {/* Mobile Drawer Floating Toggle */}
          <div className="md:hidden absolute top-4 left-4 z-20">
            <button
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="py-1.5 px-3 bg-slate-900/90 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 shadow-xl backdrop-blur-md flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>{mobileDrawerOpen ? 'Close Controls' : 'Show Controls'}</span>
            </button>
          </div>
        </div>

        {/* VIEW C: Side Panel / Drawer for Controls, Routing & Analytics */}
        <div
          className={`absolute md:relative z-20 inset-y-0 right-0 w-full sm:w-[420px] lg:w-[450px] bg-slate-950/95 md:bg-slate-900/40 border-l border-slate-800 flex flex-col backdrop-blur-xl transition-transform duration-300 ${
            mobileDrawerOpen
              ? 'translate-x-0'
              : 'translate-x-full md:translate-x-0'
          }`}
        >
          {/* Scrollable Side Deck Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Context Inspector if element selected */}
            {(selectedRoad || selectedNode) && (
              <RoadDetailsPanel
                selectedRoad={selectedRoad}
                selectedNode={selectedNode}
                onClosePanel={() => {
                  setSelectedRoadId(null);
                  setSelectedNodeId(null);
                }}
                onToggleClosure={handleToggleClosure}
                onToggleSignalPhase={handleToggleSignalPhase}
                onSetOrigin={(nodeId) => setOriginNodeId(nodeId)}
                onSetDestination={(nodeId) => setDestinationNodeId(nodeId)}
              />
            )}

            {/* Tab 1: Simulation Controls */}
            {activeTab === 'simulation' && (
              <SimulationControls
                config={simState.config}
                onUpdateVolume={handleUpdateVolume}
                onUpdateCapacity={handleUpdateCapacity}
                onUpdateSpeed={handleUpdateSpeed}
                onUpdateSignalDuration={handleUpdateSignalDuration}
                onUpdateWeather={handleUpdateWeather}
                onTogglePlayPause={handleTogglePlayPause}
                onReset={handleReset}
                onCloseSpecificRoad={handleCloseSpecificRoad}
                onReopenAllRoads={handleReopenAllRoads}
                closedRoadCount={simState.summary.closedRoads}
              />
            )}

            {/* Tab 2: Route & Detour Planner */}
            {activeTab === 'routing' && (
              <RoutePlanner
                nodes={simState.nodes}
                originId={originNodeId}
                destinationId={destinationNodeId}
                onSelectOrigin={(id) => setOriginNodeId(id)}
                onSelectDestination={(id) => setDestinationNodeId(id)}
                routesResult={routesResult}
                onApplyPreset={(orig, dest) => {
                  setOriginNodeId(orig);
                  setDestinationNodeId(dest);
                }}
                onClearRoutes={() => {
                  setOriginNodeId('');
                  setDestinationNodeId('');
                  setRoutesResult(null);
                }}
              />
            )}

            {/* Tab 3: Detailed Charts & Analytics */}
            {activeTab === 'analytics' && (
              <TrafficCharts
                summary={simState.summary}
                history={simState.history}
                corridors={simState.summary.corridorStats}
              />
            )}
          </div>
        </div>
      </div>

      {/* Scenario Manager Modal */}
      <ScenarioManager
        activeScenarioId={activeScenario?.id}
        currentConfig={simState.config}
        currentSummary={simState.summary}
        onApplyScenario={handleApplyScenario}
        isOpen={isScenariosModalOpen}
        onClose={() => setIsScenariosModalOpen(false)}
      />

      {/* Methodology & Formulas Legend Modal */}
      <LegendModal
        isOpen={isLegendOpen}
        onClose={() => setIsLegendOpen(false)}
      />
    </div>
  );
}
