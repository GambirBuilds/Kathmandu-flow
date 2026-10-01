import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye,
  Sliders,
  AlertOctagon,
  Navigation,
  MapPin
} from 'lucide-react';
import { VEHICLE_TYPES } from '../simulation/simulationEngine.js';
import { KATHMANDU_LANDMARKS } from '../simulation/networkData.js';

export default function CityMap({
  nodes = [],
  roads = [],
  vehicles = [],
  selectedRoadId,
  selectedNodeId,
  onSelectRoad,
  onSelectNode,
  onToggleSignalPhase,
  highlightedRoute = null, // { primaryRoadIds: [], altRoadIds: [] }
  originNodeId = null,
  destinationNodeId = null
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Viewport transform (Pan & Zoom) - Centered to fit Kathmandu, Lalitpur and Bhaktapur
  const [transform, setTransform] = useState({ x: -20, y: -10, scale: 0.74 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Layer visibility toggles
  const [showVehicles, setShowVehicles] = useState(true);
  const [showSignals, setShowSignals] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showRivers, setShowRivers] = useState(true);
  const [showLabels, setShowLabels] = useState(true);

  // Hover state for tooltip
  const [hoveredItem, setHoveredItem] = useState(null); // { type: 'road'|'node'|'landmark', data, x, y }

  // Node coordinate lookup map
  const nodeMap = useRef(new Map());
  useEffect(() => {
    const map = new Map();
    nodes.forEach((n) => map.set(n.id, n));
    nodeMap.current = map;
  }, [nodes]);

  // Road lookup map
  const roadMap = useRef(new Map());
  useEffect(() => {
    const map = new Map();
    roads.forEach((r) => map.set(r.id, r));
    roadMap.current = map;
  }, [roads]);

  // Handle Canvas Zoom via mouse wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform((prev) => {
      const newScale = Math.min(2.5, Math.max(0.5, prev.scale * zoomFactor));
      // Zoom towards cursor
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const newX = mouseX - (mouseX - prev.x) * (newScale / prev.scale);
      const newY = mouseY - (mouseY - prev.y) * (newScale / prev.scale);
      return { x: newX, y: newY, scale: newScale };
    });
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click drags
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setTransform({ x: -20, y: -10, scale: 0.74 });
  };

  const focusCity = (cityName) => {
    if (cityName === 'Kathmandu') {
      setTransform({ x: -140, y: -60, scale: 1.05 });
    } else if (cityName === 'Lalitpur') {
      setTransform({ x: -120, y: -360, scale: 1.15 });
    } else if (cityName === 'Bhaktapur') {
      setTransform({ x: -680, y: -260, scale: 1.05 });
    } else {
      resetView();
    }
  };

  const zoomIn = () => {
    setTransform((prev) => ({ ...prev, scale: Math.min(2.5, prev.scale * 1.2) }));
  };

  const zoomOut = () => {
    setTransform((prev) => ({ ...prev, scale: Math.max(0.4, prev.scale / 1.2) }));
  };

  // --- Canvas High Performance Rendering Loop ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      // Handle DPI
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.scale, transform.scale);

      // Subtle City Area Watermarks on Canvas
      drawCityRegions(ctx);

      // 1. Draw subtle background topography & river corridors
      if (showRivers) {
        drawRivers(ctx);
      }

      // 2. Draw road network segments
      drawRoads(ctx, roads, nodeMap.current, selectedRoadId, highlightedRoute);

      // 3. Draw animated vehicle fleet
      if (showVehicles) {
        drawVehicles(ctx, vehicles, roadMap.current, nodeMap.current);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [transform, roads, vehicles, selectedRoadId, highlightedRoute, showVehicles, showRivers]);

  // Helper: Draw subtle city region boundaries & watermarks
  const drawCityRegions = (ctx) => {
    ctx.save();
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.12)'; // Soft slate watermark

    // Kathmandu watermark
    ctx.fillText('KATHMANDU METROPOLIS', 540, 240);

    // Lalitpur watermark
    ctx.fillText('LALITPUR (PATAN)', 540, 890);

    // Bhaktapur watermark
    ctx.fillText('BHAKTAPUR (BHADGAON)', 1280, 780);
    ctx.restore();
  };

  // Helper: Draw Kathmandu & Bhaktapur River Corridors
  const drawRivers = (ctx) => {
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.22)'; // Deep Cyan / River blue

    // 1. Bagmati River curve: Gokarna -> Gaushala -> Shankhamul -> Thapathali -> Teku -> Balkhu -> Chobhar
    ctx.beginPath();
    ctx.moveTo(1020, 220);
    ctx.bezierCurveTo(980, 360, 890, 480, 820, 620);
    ctx.bezierCurveTo(760, 680, 680, 670, 630, 660);
    ctx.bezierCurveTo(550, 640, 480, 630, 440, 660);
    ctx.bezierCurveTo(390, 700, 340, 770, 300, 850);
    ctx.stroke();

    // 2. Bishnumati River curve: Tokha -> Balaju -> Teku Dobhan
    ctx.beginPath();
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.18)';
    ctx.moveTo(430, 160);
    ctx.bezierCurveTo(380, 260, 330, 380, 380, 510);
    ctx.bezierCurveTo(400, 560, 430, 590, 460, 610);
    ctx.stroke();

    // 3. Dhobikhola River Corridor: Budhanilkantha -> Chabahil -> Bijuli Bazar
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.16)';
    ctx.moveTo(880, 180);
    ctx.bezierCurveTo(860, 320, 840, 460, 770, 580);
    ctx.stroke();

    // 4. Manohara River (boundary between Kathmandu & Bhaktapur, flowing past Airport & Sanothimi to Shankhamul)
    ctx.beginPath();
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.19)';
    ctx.moveTo(1120, 300);
    ctx.bezierCurveTo(1160, 420, 1110, 580, 1020, 690);
    ctx.lineTo(820, 670);
    ctx.stroke();

    // 5. Hanumante River (Bhaktapur: Kamalbinayak -> Bhaktapur Durbar -> Sallaghari -> Thimi -> meets Manohara)
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = 'rgba(14, 116, 144, 0.17)';
    ctx.moveTo(1560, 690);
    ctx.bezierCurveTo(1480, 700, 1410, 740, 1340, 745);
    ctx.bezierCurveTo(1240, 750, 1150, 740, 1060, 715);
    ctx.stroke();
  };

  // Helper: Draw Road Segments
  const drawRoads = (ctx, roadList, nMap, selRoadId, route) => {
    roadList.forEach((road) => {
      const fromNode = nMap.get(road.from);
      const toNode = nMap.get(road.to);
      if (!fromNode || !toNode) return;

      const isSelected = road.id === selRoadId;
      const isPrimaryRoute = route?.primaryRoadIds?.includes(road.id);
      const isAltRoute = route?.altRoadIds?.includes(road.id);

      // Base line width based on road lanes (8-lane vs 4-lane vs 2-lane)
      const baseWidth = Math.max(5, road.lanes * 1.5);

      // 1. Road bed casing (dark border)
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.lineWidth = baseWidth + 4;
      ctx.lineCap = 'round';
      ctx.strokeStyle = isSelected
        ? '#38BDF8'
        : isPrimaryRoute
        ? '#06B6D4'
        : isAltRoute
        ? '#F59E0B'
        : '#0F172A';
      ctx.stroke();

      // 2. Road surface fill (Traffic Level colored)
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.lineWidth = baseWidth;

      if (road.isClosed) {
        // Striped / Dashed closure appearance
        ctx.strokeStyle = '#DC2626';
        ctx.setLineDash([8, 6]);
      } else {
        ctx.setLineDash([]);
        // Color based on congestion ratio
        if (road.congestionRatio >= 0.88) {
          ctx.strokeStyle = '#EF4444'; // Red (Critical)
        } else if (road.congestionRatio >= 0.68) {
          ctx.strokeStyle = '#F97316'; // Orange (Heavy)
        } else if (road.congestionRatio >= 0.42) {
          ctx.strokeStyle = '#F59E0B'; // Amber (Moderate)
        } else {
          ctx.strokeStyle = '#10B981'; // Green (Low)
        }
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Highlighted route glow overlay
      if (isPrimaryRoute) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.lineWidth = baseWidth + 6;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.stroke();
        ctx.restore();
      } else if (isAltRoute) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.lineWidth = baseWidth + 4;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
        ctx.setLineDash([6, 6]);
        ctx.stroke();
        ctx.restore();
      }
    });
  };

  // Helper: Draw Moving Vehicles
  const drawVehicles = (ctx, vehicleList, rMap, nMap) => {
    vehicleList.forEach((v) => {
      const road = rMap.get(v.roadId);
      if (!road || road.isClosed) return;

      const fromNode = nMap.get(road.from);
      const toNode = nMap.get(road.to);
      if (!fromNode || !toNode) return;

      // Calculate position along segment based on progress
      const dx = toNode.x - fromNode.x;
      const dy = toNode.y - fromNode.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      if (length === 0) return;

      const uX = dx / length;
      const uY = dy / length;
      const perpX = -uY;
      const perpY = uX;

      // Lane offset perpendicular to road line
      const laneOffsetDistance = (v.direction * 3) + ((v.lane - 1) * 2.2);

      const posX = fromNode.x + dx * v.progress + perpX * laneOffsetDistance;
      const posY = fromNode.y + dy * v.progress + perpY * laneOffsetDistance;

      // Vehicle appearance
      const typeDef = VEHICLE_TYPES[v.type] || VEHICLE_TYPES.car;
      const size = v.type === 'bike' ? 2.5 : v.type === 'bus' ? 5.5 : 4;

      ctx.save();
      ctx.translate(posX, posY);
      // Angle vehicle towards travel direction
      const angle = Math.atan2(dy * v.direction, dx * v.direction);
      ctx.rotate(angle);

      // Draw vehicle body
      ctx.fillStyle = typeDef.color;
      if (v.type === 'bus') {
        ctx.fillRect(-size * 1.5, -size * 0.7, size * 3, size * 1.4);
      } else if (v.type === 'bike') {
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Car or tempo
        ctx.fillRect(-size, -size * 0.6, size * 2, size * 1.2);
      }

      ctx.restore();
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-slate-950 overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 1. Underlying High-DPI HTML5 Canvas for road & vehicle animation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* 2. Interactive SVG Overlay for click targets, signals, and markers */}
      <svg
        className="absolute inset-0 w-full h-full overflow-visible"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
        {/* Invisible wider road click targets for reliable selection */}
        {roads.map((road) => {
          const fromNode = nodeMap.current.get(road.from);
          const toNode = nodeMap.current.get(road.to);
          if (!fromNode || !toNode) return null;

          return (
            <g key={`click_${road.id}`}>
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="transparent"
                strokeWidth={20}
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRoad(road.id);
                }}
                onMouseEnter={(e) => {
                  setHoveredItem({
                    type: 'road',
                    data: road,
                    x: (fromNode.x + toNode.x) / 2,
                    y: (fromNode.y + toNode.y) / 2
                  });
                }}
                onMouseLeave={() => setHoveredItem(null)}
              />

              {/* Road closure hazard emblem if closed */}
              {road.isClosed && (
                <g
                  transform={`translate(${(fromNode.x + toNode.x) / 2}, ${(fromNode.y + toNode.y) / 2})`}
                  className="pointer-events-none"
                >
                  <circle r={11} fill="#DC2626" stroke="#FFFFFF" strokeWidth={2} />
                  <line x1={-6} y1={-6} x2={6} y2={6} stroke="#FFFFFF" strokeWidth={2.5} />
                </g>
              )}
            </g>
          );
        })}

        {/* Junction Nodes & Traffic Signals */}
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const isOrigin = node.id === originNodeId;
          const isDest = node.id === destinationNodeId;

          return (
            <g
              key={node.id}
              transform={`translate(${node.x}, ${node.y})`}
              className="cursor-pointer group"
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node.id);
              }}
              onMouseEnter={() => {
                setHoveredItem({
                  type: 'node',
                  data: node,
                  x: node.x,
                  y: node.y
                });
              }}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Origin / Destination special marker */}
              {(isOrigin || isDest) && (
                <circle
                  r={18}
                  fill="none"
                  stroke={isOrigin ? '#10B981' : '#F43F5E'}
                  strokeWidth={2.5}
                  strokeDasharray="4 2"
                  className="animate-spin"
                  style={{ animationDuration: '6s' }}
                />
              )}

              {/* Node core hub circle */}
              <circle
                r={isSelected ? 9 : node.type === 'ring_road' ? 7 : 5.5}
                fill={
                  isSelected
                    ? '#38BDF8'
                    : isOrigin
                    ? '#10B981'
                    : isDest
                    ? '#F43F5E'
                    : '#1E293B'
                }
                stroke={isSelected ? '#FFFFFF' : '#475569'}
                strokeWidth={isSelected ? 2.5 : 1.5}
              />

              {/* Traffic Light Head Indicator */}
              {showSignals && node.isSignal && (
                <g transform="translate(10, -10)">
                  <circle
                    r={5}
                    fill={node.signalPhase === 'green' ? '#10B981' : '#EF4444'}
                    stroke="#0F172A"
                    strokeWidth={1.5}
                    className="cursor-pointer filter drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSignalPhase(node.id);
                    }}
                  />
                </g>
              )}

              {/* Junction Text Label */}
              {showLabels && (
                <text
                  y={node.isSignal ? 17 : 14}
                  textAnchor="middle"
                  className={`text-[10px] font-semibold pointer-events-none select-none transition-all ${
                    isSelected
                      ? 'fill-amber-300 font-bold'
                      : isOrigin
                      ? 'fill-emerald-400 font-bold'
                      : isDest
                      ? 'fill-rose-400 font-bold'
                      : 'fill-slate-300'
                  }`}
                  style={{
                    textShadow: '0 1px 3px rgba(0,0,0,0.9), 0 0 6px rgba(0,0,0,0.8)'
                  }}
                >
                  {node.name.split(' ')[0]}
                </text>
              )}
            </g>
          );
        })}

        {/* Landmarks */}
        {showLandmarks &&
          KATHMANDU_LANDMARKS.map((lm) => (
            <g
              key={lm.id}
              transform={`translate(${lm.x}, ${lm.y})`}
              className="pointer-events-none opacity-85"
            >
              <circle r={12} fill="rgba(245, 158, 11, 0.15)" stroke="rgba(245, 158, 11, 0.4)" strokeWidth={1} />
              <text
                textAnchor="middle"
                y={3}
                fontSize={10}
                className="fill-amber-400 font-bold select-none"
              >
                ★
              </text>
              <text
                y={-14}
                textAnchor="middle"
                className="text-[9px] font-semibold fill-amber-200/90 select-none"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
              >
                {lm.name}
              </text>
            </g>
          ))}
      </svg>

      {/* 3. Floating Tooltip on Hover */}
      {hoveredItem && (
        <div
          className="absolute z-20 pointer-events-none bg-slate-900/95 border border-slate-700 rounded-lg p-2.5 shadow-xl text-xs backdrop-blur-sm min-w-[180px]"
          style={{
            left: `${hoveredItem.x * transform.scale + transform.x + 15}px`,
            top: `${hoveredItem.y * transform.scale + transform.y - 15}px`
          }}
        >
          {hoveredItem.type === 'road' && (
            <div>
              <div className="font-bold text-white mb-0.5">{hoveredItem.data.name}</div>
              <div className="text-[11px] text-slate-400 mb-1.5">{hoveredItem.data.corridor}</div>
              {hoveredItem.data.isClosed ? (
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  <span>CLOSED: {hoveredItem.data.closureReason || 'Restricted'}</span>
                </div>
              ) : (
                <div className="space-y-0.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Congestion:</span>
                    <span className="font-mono font-semibold">
                      {Math.round(hoveredItem.data.congestionRatio * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current Speed:</span>
                    <span className="font-mono font-semibold text-amber-400">
                      {hoveredItem.data.currentSpeed} km/h
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Est. Travel Time:</span>
                    <span className="font-mono">{hoveredItem.data.travelTimeMin} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sim. Vehicles:</span>
                    <span className="font-mono">{hoveredItem.data.currentVehicles}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {hoveredItem.type === 'node' && (
            <div>
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-bold text-white truncate">{hoveredItem.data.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-amber-300 rounded font-medium shrink-0">
                  {hoveredItem.data.city || 'Kathmandu'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mb-1">{hoveredItem.data.nepaliName}</div>
              {hoveredItem.data.isSignal ? (
                <div className="space-y-0.5 text-slate-300 pt-1 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Signal Phase:</span>
                    <span
                      className={`font-bold uppercase ${
                        hoveredItem.data.signalPhase === 'green'
                          ? 'text-emerald-400'
                          : 'text-rose-400'
                      }`}
                    >
                      ● {hoveredItem.data.signalPhase}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Queue Delay:</span>
                    <span className="font-mono">{hoveredItem.data.delaySeconds}s</span>
                  </div>
                  <div className="text-[10px] text-amber-300/80 pt-1">
                    Click signal dot to switch phase manually
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-400">Unsignalized Roundabout/Hub</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. Map Control Toolbars (Zoom, Reset, Layers, and City Focus) */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
        {/* City Focus Navigator */}
        <div className="bg-slate-900/95 border border-slate-800 rounded-lg p-1 shadow-lg backdrop-blur-md flex flex-col gap-0.5 text-[11px]">
          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 text-center">
            City Focus
          </div>
          <button
            onClick={() => focusCity('all')}
            className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-left font-medium transition-colors"
          >
            All Valley
          </button>
          <button
            onClick={() => focusCity('Kathmandu')}
            className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-left font-medium transition-colors"
          >
            Kathmandu
          </button>
          <button
            onClick={() => focusCity('Lalitpur')}
            className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-left font-medium transition-colors"
          >
            Lalitpur (Patan)
          </button>
          <button
            onClick={() => focusCity('Bhaktapur')}
            className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded text-left font-medium transition-colors"
          >
            Bhaktapur
          </button>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-1 flex flex-col gap-1 shadow-lg backdrop-blur-sm">
          <button
            onClick={zoomIn}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
            title="Recenter Map"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Visibility Toggles */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-1 flex flex-col gap-1 shadow-lg backdrop-blur-sm">
          <button
            onClick={() => setShowVehicles(!showVehicles)}
            className={`p-2 rounded-md transition-colors ${
              showVehicles ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Moving Vehicles"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowSignals(!showSignals)}
            className={`p-2 rounded-md transition-colors ${
              showSignals ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Traffic Lights"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`p-2 rounded-md transition-colors ${
              showLandmarks ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Toggle Landmarks"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Clean Bottom Legend Overlay */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800/90 rounded-lg px-3 py-2 text-xs backdrop-blur-sm flex flex-wrap items-center gap-3 shadow-lg pointer-events-auto">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Flow Levels:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-300">Low (&lt;40%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-300">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-slate-300">Heavy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-300">Critical (&gt;88%)</span>
        </div>
        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-white" />
          <span className="text-rose-400 font-medium">Closed</span>
        </div>
      </div>

      {/* Simulation Disclaimer Tag */}
      <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-slate-950/80 px-2 py-1 rounded border border-slate-800/60 pointer-events-none">
        Simulation Estimates · Kathmandu Valley Network
      </div>
    </div>
  );
}
