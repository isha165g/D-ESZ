import {
  FirestoreState,
  SensorLog,
  ActiveThreat,
  PolygonVertex,
  SensorMarker,
  AnimalCluster
} from '../types';
import { INITIAL_SENSORS, INITIAL_ANIMAL_CLUSTERS } from '../data/kazirangaData';

type Subscriber = (state: FirestoreState) => void;

/**
 * Service simulating real-time Cloud Firestore collections:
 * - `sensor_logs`
 * - `active_threats`
 * - `polygon_vertices`
 */
export class FirebaseService {
  private static instance: FirebaseService;
  private state: FirestoreState;
  private subscribers: Set<Subscriber> = new Set();

  private constructor() {
    this.state = {
      sensor_logs: [
        {
          id: 'log-101',
          sensorId: 'cam-01',
          sensorName: 'NH37-Panbari Cam 01',
          sensorType: 'camera_trap',
          timestamp: new Date(Date.now() - 1000 * 60 * 4).toLocaleTimeString(),
          lat: 26.606,
          lng: 93.473,
          threatLevel: 'Red',
          confidence: 0.96,
          detectedObject: 'Asian Elephant Herd (18 individuals)',
          actionTaken: 'Triggered Amoeba Expansion & Village SMS Alert'
        },
        {
          id: 'log-102',
          sensorId: 'seis-01',
          sensorName: 'Seismic-Haldibhari 01',
          sensorType: 'seismic_sensor',
          timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
          lat: 26.568,
          lng: 93.310,
          threatLevel: 'Yellow',
          confidence: 0.88,
          detectedObject: 'Heavy Mammal Seismic Resonance',
          actionTaken: 'High Frequency Corridor Buffer Logging'
        },
        {
          id: 'log-103',
          sensorId: 'acou-01',
          sensorName: 'Acoustic-Panbari 02',
          sensorType: 'acoustic_sensor',
          timestamp: new Date(Date.now() - 1000 * 60 * 18).toLocaleTimeString(),
          lat: 26.612,
          lng: 93.482,
          threatLevel: 'Red',
          confidence: 0.94,
          detectedObject: 'Low Frequency Elephant Infrasound Trumpet',
          actionTaken: 'Panbari Village Ward Warning Sent'
        }
      ],
      active_threats: [
        {
          id: 'threat-panbari-01',
          sensorId: 'cam-01',
          locationName: 'Panbari Wildlife Crossing (NH-37)',
          lat: 26.606,
          lng: 93.473,
          species: 'Asian Elephant',
          count: 18,
          threatScore: 88,
          timestamp: 'Just now',
          smsDispatchedTo: ['Panbari Village Panchayat', 'Bokakhat Ward 4', 'Kohora Complex'],
          status: 'ACTIVE'
        },
        {
          id: 'threat-kanchanjuri-02',
          sensorId: 'cam-02',
          locationName: 'Kanchanjuri Highway Crossing',
          lat: 26.538,
          lng: 93.220,
          species: 'Asian Elephant Herd',
          count: 24,
          threatScore: 92,
          timestamp: '3 mins ago',
          smsDispatchedTo: ['Kanchanjuri Foothills', 'Kuthori Rural Sector'],
          status: 'ACTIVE'
        }
      ],
      polygon_vertices: []
    };
  }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  public getState(): FirestoreState {
    return { ...this.state };
  }

  public subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback);
    callback(this.state);
    return () => this.subscribers.delete(callback);
  }

  private notify() {
    this.subscribers.forEach((cb) => cb({ ...this.state }));
  }

  /**
   * Log a sensor trigger event into Firestore `sensor_logs` and `active_threats`
   */
  public logSensorTrigger(
    sensor: SensorMarker,
    species: string = 'Wildlife Herd',
    count: number = 12
  ): ActiveThreat {
    const logId = `log-${Date.now()}`;
    const threatId = `threat-${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString();

    const newLog: SensorLog = {
      id: logId,
      sensorId: sensor.id,
      sensorName: sensor.name,
      sensorType: sensor.type,
      timestamp: timeStr,
      lat: sensor.lat,
      lng: sensor.lng,
      threatLevel: 'Red',
      confidence: 0.95,
      detectedObject: `${species} (${count} count) detected near ${sensor.locationName}`,
      actionTaken: 'Amoeba Geofence Warped; Village Alert SMS Dispatched'
    };

    const newThreat: ActiveThreat = {
      id: threatId,
      sensorId: sensor.id,
      locationName: sensor.locationName,
      lat: sensor.lat,
      lng: sensor.lng,
      species,
      count,
      threatScore: 90,
      timestamp: 'Just now',
      smsDispatchedTo: [sensor.corridor, 'Panbari Village', 'Bokakhat Ward 4'],
      status: 'ACTIVE'
    };

    this.state.sensor_logs = [newLog, ...this.state.sensor_logs.slice(0, 25)];
    this.state.active_threats = [
      newThreat,
      ...this.state.active_threats.filter((t) => t.sensorId !== sensor.id)
    ];

    this.notify();
    return newThreat;
  }

  /**
   * Update live polygon vertices collection
   */
  public updatePolygonVertices(vertices: PolygonVertex[]) {
    this.state.polygon_vertices = vertices;
    this.notify();
  }

  /**
   * Clear or resolve active threat
   */
  public clearThreat(threatId: string) {
    this.state.active_threats = this.state.active_threats.filter((t) => t.id !== threatId);
    this.notify();
  }

  /**
   * Reset threat logs
   */
  public resetAll() {
    this.state.active_threats = [];
    this.notify();
  }
}
