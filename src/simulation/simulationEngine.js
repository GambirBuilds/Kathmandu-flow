/**
 * Kathmandu Flow — Core Simulation Engine
 * Pure JavaScript simulation logic separated from React UI components.
 * Implements traffic flow dynamics, signal state machines, vehicle kinematics,
 * and Dijkstra alternative pathfinding for Kathmandu Valley.
 */

import { KATHMANDU_NODES, KATHMANDU_ROADS } from './networkData.js';

// Vehicle type characteristics in Kathmandu
export const VEHICLE_TYPES = {
  bike: {
    name: 'Motorcycles / Scooters',
    share: 0.60,
    speedFactor: 1.15, // Can filter through tight jams
    length: 5,
    color: '#38BDF8', // Cyan / Sky blue
    icon: 'bike'
  },
  car: {
    name: 'Private Cars / Taxis',
    share: 0.22,
    speedFactor: 1.0,
    length: 8,
    color: '#F8FAFC', // White / Silver
    icon: 'car'
  },
  microbus: {
    name: 'Microbuses & Safa Tempos',
    share: 0.12,
    speedFactor: 0.88,
    length: 10,
    color: '#34D399', // Emerald / Electric green
    icon: 'tempo'
  },
  bus: {
    name: 'Public Buses (Sajha Yatayat)',
    share: 0.06,
    speedFactor: 0.75,
    length: 14,
    color: '#F59E0B', // Amber / Gold
    icon: 'bus'
  }
};

export class SimulationEngine {
  constructor() {
    this.nodes = new Map();
    this.roads = new Map();
    this.vehicles = [];
    this.history = [];
    this.maxHistoryLength = 40;

    // Simulation configuration
    this.config = {
      volumeMultiplier: 1.0,
      capacityMultiplier: 1.0,
      weather: 'clear', // 'clear' | 'monsoon_rain' | 'fog'
      simulationSpeed: 1.0,
      globalSignalDuration: 35,
      isRunning: true
    };

    this.listeners = new Set();
    this.vehicleIdCounter = 1;
    this.lastTickTime = performance.now();

    this.init();
  }

  init() {
    // Initialize nodes
    KATHMANDU_NODES.forEach((node) => {
      this.nodes.set(node.id, {
        ...node,
        signalPhase: node.isSignal ? (Math.random() > 0.5 ? 'green' : 'red') : 'green',
        timer: Math.floor(Math.random() * this.config.globalSignalDuration),
        greenDuration: this.config.globalSignalDuration,
        queueLength: 0,
        delaySeconds: 0
      });
    });

    // Initialize roads
    KATHMANDU_ROADS.forEach((road) => {
      // Calculate realistic initial vehicle baseline proportional to road capacity
      const initialVehicles = Math.round((road.baseCapacity / 3) * (0.45 + Math.random() * 0.25));
      this.roads.set(road.id, {
        ...road,
        isClosed: false,
        closureReason: '',
        customCapacityMultiplier: 1.0,
        currentVehicles: initialVehicles,
        congestionRatio: 0.45,
        currentSpeed: road.speedLimit * 0.85,
        travelTimeMin: (road.lengthKm / (road.speedLimit * 0.85)) * 60
      });
    });

    // Seed animated vehicles along roads
    this.spawnInitialVehicles(380);
    this.calculateTrafficFlow();
    this.recordHistorySnapshot();
  }

  // Pick random vehicle type based on Kathmandu modal split
  getRandomVehicleType() {
    const r = Math.random();
    if (r < 0.60) return 'bike';
    if (r < 0.82) return 'car';
    if (r < 0.94) return 'microbus';
    return 'bus';
  }

  spawnInitialVehicles(targetCount) {
    this.vehicles = [];
    const roadList = Array.from(this.roads.values());

    for (let i = 0; i < targetCount; i++) {
      const road = roadList[Math.floor(Math.random() * roadList.length)];
      if (road.isClosed) continue;

      const typeKey = this.getRandomVehicleType();
      const direction = Math.random() > 0.5 ? 1 : -1;
      const lane = Math.floor(Math.random() * Math.min(3, road.lanes));

      this.vehicles.push({
        id: this.vehicleIdCounter++,
        type: typeKey,
        roadId: road.id,
        progress: Math.random(),
        direction,
        lane,
        speed: road.currentSpeed * VEHICLE_TYPES[typeKey].speedFactor,
        stuckTimer: 0
      });
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  // --- Configuration Mutators ---

  setVolumeMultiplier(val) {
    this.config.volumeMultiplier = Math.max(0.2, Math.min(3.0, Number(val)));
    this.adjustVehicleFleetToVolume();
    this.calculateTrafficFlow();
    this.notify();
  }

  setCapacityMultiplier(val) {
    this.config.capacityMultiplier = Math.max(0.4, Math.min(2.5, Number(val)));
    this.calculateTrafficFlow();
    this.notify();
  }

  setSimulationSpeed(val) {
    this.config.simulationSpeed = Number(val);
    this.notify();
  }

  setWeather(weather) {
    this.config.weather = weather;
    this.calculateTrafficFlow();
    this.notify();
  }

  setSignalDuration(duration) {
    this.config.globalSignalDuration = Math.max(15, Math.min(90, Number(duration)));
    this.nodes.forEach((node) => {
      if (node.isSignal) {
        node.greenDuration = this.config.globalSignalDuration;
      }
    });
    this.notify();
  }

  setRunning(isRunning) {
    this.config.isRunning = isRunning;
    this.notify();
  }

  togglePlayPause() {
    this.config.isRunning = !this.config.isRunning;
    this.notify();
  }

  // Adjust active vehicles on roads to match volume target
  adjustVehicleFleetToVolume() {
    const baseTarget = 380;
    const targetCount = Math.round(baseTarget * this.config.volumeMultiplier);
    const diff = targetCount - this.vehicles.length;

    if (diff > 0) {
      const roadList = Array.from(this.roads.values()).filter((r) => !r.isClosed);
      for (let i = 0; i < diff; i++) {
        if (roadList.length === 0) break;
        const road = roadList[Math.floor(Math.random() * roadList.length)];
        const typeKey = this.getRandomVehicleType();
        this.vehicles.push({
          id: this.vehicleIdCounter++,
          type: typeKey,
          roadId: road.id,
          progress: Math.random(),
          direction: Math.random() > 0.5 ? 1 : -1,
          lane: Math.floor(Math.random() * Math.min(3, road.lanes)),
          speed: road.currentSpeed * VEHICLE_TYPES[typeKey].speedFactor,
          stuckTimer: 0
        });
      }
    } else if (diff < 0) {
      this.vehicles.splice(0, Math.abs(diff));
    }
  }

  toggleRoadClosure(roadId, reason = 'Administrative Road Closure') {
    const road = this.roads.get(roadId);
    if (!road) return;

    road.isClosed = !road.isClosed;
    road.closureReason = road.isClosed ? reason : '';

    if (road.isClosed) {
      // Divert or clear vehicles currently stuck on the closed road
      this.vehicles = this.vehicles.filter((v) => v.roadId !== roadId);
    }

    this.calculateTrafficFlow();
    this.notify();
  }

  toggleSignalPhase(nodeId) {
    const node = this.nodes.get(nodeId);
    if (!node || !node.isSignal) return;

    node.signalPhase = node.signalPhase === 'green' ? 'red' : 'green';
    node.timer = 0;
    this.calculateTrafficFlow();
    this.notify();
  }

  applyScenario(scenario) {
    this.config.volumeMultiplier = scenario.volumeMultiplier || 1.0;
    this.config.capacityMultiplier = scenario.capacityMultiplier || 1.0;
    this.config.weather = scenario.weather || 'clear';
    this.config.simulationSpeed = scenario.simulationSpeed || 1.0;
    if (scenario.signalDuration) {
      this.setSignalDuration(scenario.signalDuration);
    }

    // Reset all road closures first
    this.roads.forEach((road) => {
      road.isClosed = false;
      road.closureReason = '';
    });

    // Apply specific closed roads
    if (scenario.closedRoadIds && Array.isArray(scenario.closedRoadIds)) {
      scenario.closedRoadIds.forEach((id) => {
        const road = this.roads.get(id);
        if (road) {
          road.isClosed = true;
          const incident = scenario.incidents?.find((inc) => inc.roadId === id);
          road.closureReason = incident ? incident.title : 'Scenario Road Closure';
        }
      });
    }

    this.adjustVehicleFleetToVolume();
    this.calculateTrafficFlow();
    this.recordHistorySnapshot();
    this.notify();
  }

  resetSimulation() {
    this.config.volumeMultiplier = 1.0;
    this.config.capacityMultiplier = 1.0;
    this.config.weather = 'clear';
    this.config.simulationSpeed = 1.0;
    this.config.globalSignalDuration = 35;
    this.config.isRunning = true;

    this.roads.forEach((road) => {
      road.isClosed = false;
      road.closureReason = '';
      road.customCapacityMultiplier = 1.0;
    });

    this.nodes.forEach((node) => {
      if (node.isSignal) {
        node.signalPhase = 'green';
        node.timer = 0;
        node.greenDuration = 35;
      }
    });

    this.history = [];
    this.spawnInitialVehicles(380);
    this.calculateTrafficFlow();
    this.recordHistorySnapshot();
    this.notify();
  }

  // --- Mathematical Traffic Flow Calculations ---

  calculateTrafficFlow() {
    const weatherFactor = this.config.weather === 'monsoon_rain' ? 0.65 : (this.config.weather === 'fog' ? 0.85 : 1.0);

    // Count vehicles per road segment
    const vehicleCounts = {};
    this.vehicles.forEach((v) => {
      vehicleCounts[v.roadId] = (vehicleCounts[v.roadId] || 0) + 1;
    });

    this.roads.forEach((road) => {
      if (road.isClosed) {
        road.currentVehicles = 0;
        road.congestionRatio = 1.0;
        road.currentSpeed = 0;
        road.travelTimeMin = 999;
        return;
      }

      // Check destination node signal penalty
      const targetNode = this.nodes.get(road.to);
      let signalPenalty = 1.0;
      if (targetNode && targetNode.isSignal && targetNode.signalPhase === 'red') {
        signalPenalty = 1.35; // Backs up flow near intersection
      }

      // Effective capacity calculation
      const effectiveCapacity = Math.max(
        150,
        (road.baseCapacity / 3) *
          this.config.capacityMultiplier *
          road.customCapacityMultiplier *
          weatherFactor
      );

      // Raw active count scaled with volume multiplier
      const activeVehicles = (vehicleCounts[road.id] || 0) * 1.8 + (road.baseCapacity / 6) * this.config.volumeMultiplier;
      road.currentVehicles = Math.round(activeVehicles);

      // Congestion ratio (0.0 to 1.0+):
      // Ratio = activeVehicles / effectiveCapacity * signalPenalty
      const rawRatio = (activeVehicles / effectiveCapacity) * signalPenalty;
      road.congestionRatio = Math.max(0.05, Math.min(1.2, rawRatio));

      // Speed calculation (BPR-inspired flow speed curve):
      // Speed = FreeFlowSpeed * max(0.12, 1 - (congestion)^1.5)
      const congestionPower = Math.pow(Math.min(1.0, road.congestionRatio), 1.5);
      let calculatedSpeed = road.speedLimit * Math.max(0.12, 1 - congestionPower);

      // Weather speed limit cap
      if (this.config.weather === 'monsoon_rain') {
        calculatedSpeed = Math.min(calculatedSpeed, road.speedLimit * 0.72);
      }

      road.currentSpeed = Math.max(5, Math.round(calculatedSpeed * 10) / 10);
      road.travelTimeMin = Math.round((road.lengthKm / road.currentSpeed) * 60 * 10) / 10;
    });

    // Update node queue delay estimates
    this.nodes.forEach((node) => {
      if (!node.isSignal) {
        node.queueLength = 0;
        node.delaySeconds = 0;
        return;
      }

      // Sum congestion of roads terminating at this node
      let connectedCongestion = 0;
      let count = 0;
      this.roads.forEach((r) => {
        if (r.to === node.id || r.from === node.id) {
          connectedCongestion += r.congestionRatio;
          count++;
        }
      });

      const avgCongestion = count > 0 ? connectedCongestion / count : 0.5;
      const isRed = node.signalPhase === 'red';
      node.queueLength = Math.round(avgCongestion * 18 * (isRed ? 1.8 : 0.6));
      node.delaySeconds = Math.round((node.queueLength * 3.5) + (isRed ? 25 : 5));
    });
  }

  // --- Real-time Animation Tick ---

  tick(currentTime = performance.now()) {
    const rawDelta = Math.min(100, currentTime - this.lastTickTime);
    this.lastTickTime = currentTime;

    if (!this.config.isRunning) return;

    const deltaSeconds = (rawDelta / 1000) * this.config.simulationSpeed;

    // 1. Advance traffic lights
    this.nodes.forEach((node) => {
      if (!node.isSignal) return;
      node.timer += deltaSeconds;

      const phaseDuration = node.signalPhase === 'green' ? node.greenDuration : 4; // amber/red
      if (node.timer >= phaseDuration) {
        node.timer = 0;
        if (node.signalPhase === 'green') {
          node.signalPhase = 'red';
        } else {
          node.signalPhase = 'green';
        }
      }
    });

    // 2. Advance vehicle kinematic positions along road networks
    this.vehicles.forEach((vehicle) => {
      const road = this.roads.get(vehicle.roadId);
      if (!road || road.isClosed) {
        // Re-route onto an open adjacent road
        this.relocateVehicle(vehicle);
        return;
      }

      // Check if arriving near intersection with red light
      const destNodeId = vehicle.direction === 1 ? road.to : road.from;
      const destNode = this.nodes.get(destNodeId);
      const isApproachingSignal = vehicle.direction === 1 ? vehicle.progress > 0.82 : vehicle.progress < 0.18;

      let speedFactor = VEHICLE_TYPES[vehicle.type].speedFactor;
      if (destNode && destNode.isSignal && destNode.signalPhase === 'red' && isApproachingSignal) {
        // Queueing deceleration near red signal
        speedFactor *= 0.18;
      }

      // Normal movement delta
      const currentSegmentSpeed = Math.max(4, road.currentSpeed * speedFactor);
      vehicle.speed = currentSegmentSpeed;

      // Progress increments along segment: (speed in km/h -> km/s) / lengthKm
      const step = (currentSegmentSpeed / (road.lengthKm * 3600)) * deltaSeconds * 28;
      vehicle.progress += vehicle.direction * step;

      // Handle intersection arrival (vehicle reached end of road segment)
      if (vehicle.progress >= 1.0) {
        this.transitionVehicleAtNode(vehicle, road.to);
      } else if (vehicle.progress <= 0.0) {
        this.transitionVehicleAtNode(vehicle, road.from);
      }
    });

    // Periodically re-calculate macroscopic flow parameters
    this.calculateTrafficFlow();
  }

  // Transition vehicle through an intersection onto next road
  transitionVehicleAtNode(vehicle, arrivalNodeId) {
    // Find all roads connected to arrivalNodeId that are NOT closed
    const connectingRoads = [];
    this.roads.forEach((r) => {
      if (r.isClosed) return;
      if (r.from === arrivalNodeId) {
        connectingRoads.push({ road: r, direction: 1, initialProgress: 0.02 });
      } else if (r.to === arrivalNodeId) {
        connectingRoads.push({ road: r, direction: -1, initialProgress: 0.98 });
      }
    });

    if (connectingRoads.length === 0) {
      // Dead end or closed area: turn vehicle around on current road
      vehicle.direction *= -1;
      vehicle.progress = vehicle.direction === 1 ? 0.05 : 0.95;
      return;
    }

    // Pick a connected road, favoring less congested ones
    connectingRoads.sort((a, b) => a.road.congestionRatio - b.road.congestionRatio);
    // Probabilistic selection with slight randomness
    const chosen = Math.random() < 0.7
      ? connectingRoads[0]
      : connectingRoads[Math.floor(Math.random() * connectingRoads.length)];

    vehicle.roadId = chosen.road.id;
    vehicle.direction = chosen.direction;
    vehicle.progress = chosen.initialProgress;
    vehicle.lane = Math.floor(Math.random() * Math.min(3, chosen.road.lanes));
  }

  relocateVehicle(vehicle) {
    const openRoads = Array.from(this.roads.values()).filter((r) => !r.isClosed);
    if (openRoads.length === 0) return;
    const road = openRoads[Math.floor(Math.random() * openRoads.length)];
    vehicle.roadId = road.id;
    vehicle.progress = Math.random();
    vehicle.direction = Math.random() > 0.5 ? 1 : -1;
  }

  recordHistorySnapshot() {
    const summary = this.getSummaryMetrics();
    this.history.push({
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timestamp: Date.now(),
      avgSpeed: summary.avgSpeed,
      congestionIndex: summary.congestionIndex,
      activeVehicles: summary.totalVehicles
    });

    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }
  }

  // --- Aggregate Metrics & Statistics ---

  getSummaryMetrics() {
    let totalSpeed = 0;
    let totalCongestion = 0;
    let totalVehicles = 0;
    let openRoadCount = 0;
    let closedRoadCount = 0;

    const modalCounts = { bike: 0, car: 0, microbus: 0, bus: 0 };
    this.vehicles.forEach((v) => {
      if (modalCounts[v.type] !== undefined) {
        modalCounts[v.type]++;
      }
    });

    this.roads.forEach((road) => {
      if (road.isClosed) {
        closedRoadCount++;
        return;
      }
      openRoadCount++;
      totalSpeed += road.currentSpeed;
      totalCongestion += road.congestionRatio;
      totalVehicles += road.currentVehicles;
    });

    const avgSpeed = openRoadCount > 0 ? Math.round((totalSpeed / openRoadCount) * 10) / 10 : 0;
    const avgCongestion = openRoadCount > 0 ? totalCongestion / openRoadCount : 0;
    const congestionPercent = Math.round(avgCongestion * 100);

    // Qualitative Traffic Level Category
    let trafficLevel = 'Low';
    let trafficLevelColor = '#10B981'; // Green
    if (congestionPercent >= 85) {
      trafficLevel = 'Critical';
      trafficLevelColor = '#EF4444'; // Red
    } else if (congestionPercent >= 68) {
      trafficLevel = 'Heavy';
      trafficLevelColor = '#F97316'; // Orange
    } else if (congestionPercent >= 45) {
      trafficLevel = 'Moderate';
      trafficLevelColor = '#F59E0B'; // Amber
    }

    // Top bottleneck roads
    const bottlenecks = Array.from(this.roads.values())
      .filter((r) => !r.isClosed)
      .sort((a, b) => b.congestionRatio - a.congestionRatio)
      .slice(0, 5);

    // Corridor aggregation
    const corridorMap = {};
    this.roads.forEach((road) => {
      const c = road.corridor || 'Other';
      if (!corridorMap[c]) {
        corridorMap[c] = { name: c, congestionSum: 0, count: 0, speedSum: 0 };
      }
      corridorMap[c].congestionSum += road.isClosed ? 1.0 : road.congestionRatio;
      corridorMap[c].speedSum += road.isClosed ? 0 : road.currentSpeed;
      corridorMap[c].count++;
    });

    const corridorStats = Object.values(corridorMap).map((item) => ({
      name: item.name,
      avgCongestion: Math.round((item.congestionSum / item.count) * 100),
      avgSpeed: Math.round((item.speedSum / item.count) * 10) / 10
    })).sort((a, b) => b.avgCongestion - a.avgCongestion);

    return {
      avgSpeed,
      congestionIndex: congestionPercent,
      trafficLevel,
      trafficLevelColor,
      totalVehicles,
      simulatedVehiclesOnMap: this.vehicles.length,
      openRoads: openRoadCount,
      closedRoads: closedRoadCount,
      modalCounts,
      bottlenecks,
      corridorStats,
      travelTimeIndex: (1 + avgCongestion * 0.9).toFixed(2)
    };
  }

  // --- Pathfinding & Alternative Route Finder (Dijkstra) ---

  findRoutes(originNodeId, destinationNodeId) {
    if (!originNodeId || !destinationNodeId || originNodeId === destinationNodeId) {
      return null;
    }

    // 1. Primary Route: Best current path taking congestion & closures into account
    const primaryRoute = this.runDijkstra(originNodeId, destinationNodeId, { avoidClosed: true, weightKey: 'travelTime' });

    // 2. Alternative Route: Path calculated by penalizing primary route segments or avoiding choke points
    let alternativeRoute = null;
    if (primaryRoute && primaryRoute.pathRoadIds.length > 0) {
      alternativeRoute = this.runDijkstra(originNodeId, destinationNodeId, {
        avoidClosed: true,
        weightKey: 'travelTime',
        penalizedRoadIds: new Set(primaryRoute.pathRoadIds.slice(0, Math.ceil(primaryRoute.pathRoadIds.length / 2)))
      });
    }

    return {
      primary: primaryRoute,
      alternative: alternativeRoute
    };
  }

  runDijkstra(startNodeId, endNodeId, options = {}) {
    const { avoidClosed = true, penalizedRoadIds = new Set() } = options;

    const distances = {};
    const previous = {};
    const roadUsed = {};
    const unvisited = new Set();

    this.nodes.forEach((node) => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      roadUsed[node.id] = null;
      unvisited.add(node.id);
    });

    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
      // Find node with smallest distance
      let currentId = null;
      let minDistance = Infinity;
      unvisited.forEach((id) => {
        if (distances[id] < minDistance) {
          minDistance = distances[id];
          currentId = id;
        }
      });

      if (!currentId || minDistance === Infinity) break;
      if (currentId === endNodeId) break;

      unvisited.delete(currentId);

      // Explore neighbors
      this.roads.forEach((road) => {
        if (avoidClosed && road.isClosed) return;

        let neighborId = null;
        if (road.from === currentId) neighborId = road.to;
        else if (road.to === currentId) neighborId = road.from;

        if (neighborId && unvisited.has(neighborId)) {
          // Weight calculation: travel time + penalty if on detour list
          let weight = road.travelTimeMin;
          if (penalizedRoadIds.has(road.id)) {
            weight *= 2.8; // Encourage alternative detour
          }

          const alt = distances[currentId] + weight;
          if (alt < distances[neighborId]) {
            distances[neighborId] = alt;
            previous[neighborId] = currentId;
            roadUsed[neighborId] = road.id;
          }
        }
      });
    }

    if (distances[endNodeId] === Infinity) {
      return null;
    }

    // Reconstruct path
    const pathNodeIds = [];
    const pathRoadIds = [];
    let curr = endNodeId;

    while (curr) {
      pathNodeIds.unshift(curr);
      const rId = roadUsed[curr];
      if (rId) pathRoadIds.unshift(rId);
      curr = previous[curr];
    }

    // Calculate path statistics
    let totalDistanceKm = 0;
    let totalTravelTimeMin = 0;
    pathRoadIds.forEach((rId) => {
      const road = this.roads.get(rId);
      if (road) {
        totalDistanceKm += road.lengthKm;
        totalTravelTimeMin += road.travelTimeMin;
      }
    });

    const avgSpeed = totalTravelTimeMin > 0 ? (totalDistanceKm / (totalTravelTimeMin / 60)) : 0;

    return {
      pathNodeIds,
      pathRoadIds,
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      totalTravelTimeMin: Math.round(totalTravelTimeMin * 10) / 10,
      avgSpeed: Math.round(avgSpeed * 10) / 10
    };
  }

  // --- Snapshot State for React UI ---

  getState() {
    return {
      config: { ...this.config },
      nodes: Array.from(this.nodes.values()),
      roads: Array.from(this.roads.values()),
      vehicles: this.vehicles,
      summary: this.getSummaryMetrics(),
      history: [...this.history]
    };
  }
}

// Global simulation engine singleton
export const simEngine = new SimulationEngine();
