/**
 * Core Types for Dynamic Corridor-Based Eco-Sensitive Zone (D-ESZ)
 */

export type ESZMode = 'static_10km' | 'static_1km' | 'dynamic_amoeba';

export type SensorType = 'camera_trap' | 'acoustic_sensor' | 'seismic_sensor';

export interface SensorMarker {
  id: string;
  name: string;
  type: SensorType;
  lat: number;
  lng: number;
  locationName: string; // e.g. "NH-37 Panbari Crossing"
  corridor: string; // e.g. "Panbari Corridor"
  status: 'active' | 'triggered' | 'maintenance';
  lastTriggered?: string;
  battery: number; // percentage
  detectionCount: number;
  description: string;
}

export interface AnimalCluster {
  id: string;
  species: 'Asian Elephant' | 'One-Horned Rhino' | 'Royal Bengal Tiger' | 'Swamp Deer';
  count: number;
  lat: number;
  lng: number;
  density: number; // 1 - 100
  threatScore: number; // 0 - 100
  movementVector: { angle: number; speedKmH: number }; // direction heading towards NH-37 or Karbi Anglong
  corridorName: string;
  isHistoricalPath: boolean;
  isActivePath: boolean;
  timestamp: string;
}

export interface CorridorPathway {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number][]; // [lat, lng][]
  isActive: boolean;
  isHistorical: boolean;
  criticality: 'High' | 'Severe' | 'Critical';
  avgHerdsPerMonth: number;
}

export interface SensorLog {
  id: string;
  sensorId: string;
  sensorName: string;
  sensorType: SensorType;
  timestamp: string;
  lat: number;
  lng: number;
  threatLevel: 'Green' | 'Yellow' | 'Red';
  confidence: number;
  detectedObject: string;
  actionTaken: string;
}

export interface ActiveThreat {
  id: string;
  sensorId: string;
  locationName: string;
  lat: number;
  lng: number;
  species: string;
  count: number;
  threatScore: number;
  timestamp: string;
  smsDispatchedTo: string[];
  status: 'ACTIVE' | 'RESOLVING' | 'CLEARED';
}

export interface PolygonVertex {
  lat: number;
  lng: number;
  order: number;
  isAmoebaBoundary: boolean;
  zone: 'Red Core' | 'Yellow Transition' | 'Green Eco-Corridor';
}

export interface FirestoreState {
  sensor_logs: SensorLog[];
  active_threats: ActiveThreat[];
  polygon_vertices: PolygonVertex[];
}

export interface AIThreatAssessment {
  threatScore: number;
  riskCategory: 'NORMAL' | 'WARNING' | 'CRITICAL EMERGENCY';
  summary: string;
  recommendedSpeedLimit: string; // e.g. "20 km/h on NH-37"
  impactedVillages: string[];
  suggestedAction: string;
  reasoning: string;
}
