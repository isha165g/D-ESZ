import { AnimalCluster, SensorMarker } from '../types';
import { INITIAL_ANIMAL_CLUSTERS } from '../data/kazirangaData';

export interface SimulationStepResult {
  updatedClusters: AnimalCluster[];
  triggeredSensorIds: string[];
  highwayCrossingAlert: boolean;
  activeCrossingsCount: number;
}

export class HerdSimulationService {
  /**
   * Calculates the bearing in degrees between two points
   */
  public static calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
    const x =
      Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
      Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
  }

  /**
   * Calculates Euclidean/geodesic distance in km
   */
  public static calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Advances all animal clusters along their migration corridors
   */
  public static stepSimulation(
    clusters: AnimalCluster[],
    sensors: SensorMarker[],
    speedMultiplier: number = 1.0
  ): SimulationStepResult {
    const triggeredSensorIds: string[] = [];
    let activeCrossingsCount = 0;

    const updatedClusters = clusters.map((cluster) => {
      const path = cluster.pathCoordinates;
      if (!path || path.length < 2) {
        return cluster;
      }

      let targetIdx = cluster.targetIndex ?? 0;
      let dir = cluster.direction ?? 'southbound';
      let progress = cluster.progress ?? 0;

      // Determine current and next waypoints
      let nextIdx = dir === 'southbound' ? targetIdx + 1 : targetIdx - 1;

      // Check boundaries
      if (nextIdx >= path.length) {
        dir = 'northbound';
        targetIdx = path.length - 1;
        nextIdx = path.length - 2;
        progress = 0;
      } else if (nextIdx < 0) {
        dir = 'southbound';
        targetIdx = 0;
        nextIdx = 1;
        progress = 0;
      }

      const p0 = path[targetIdx];
      const p1 = path[nextIdx];

      // Base step speed proportional to animal speed
      const baseStepSpeed =
        cluster.species === 'Asian Elephant'
          ? 0.04
          : cluster.species === 'Royal Bengal Tiger'
          ? 0.05
          : cluster.species === 'Swamp Deer'
          ? 0.045
          : 0.03;

      const stepIncrement = baseStepSpeed * speedMultiplier;
      progress += stepIncrement;

      if (progress >= 1) {
        targetIdx = nextIdx;
        progress = 0;
      }

      // Safe bounds
      const currentP0 = path[targetIdx];
      const currentNextIdx = dir === 'southbound' ? targetIdx + 1 : targetIdx - 1;
      const safeNextIdx = Math.max(0, Math.min(path.length - 1, currentNextIdx));
      const currentP1 = path[safeNextIdx];

      // Interpolate position with slight micro-jitter for organic herd swaying
      const jitterLat = (Math.sin(Date.now() / 1200 + targetIdx) * 0.0003);
      const jitterLng = (Math.cos(Date.now() / 1400 + targetIdx) * 0.0003);

      const newLat = currentP0[0] + (currentP1[0] - currentP0[0]) * progress + jitterLat;
      const newLng = currentP0[1] + (currentP1[1] - currentP0[1]) * progress + jitterLng;

      // Calculate new heading angle
      const bearing = Math.round(
        this.calculateBearing(currentP0[0], currentP0[1], currentP1[0], currentP1[1])
      );

      // Determine animal status & highway crossing proximity
      // NH-37 highway belt in Kaziranga spans approximately lat 26.54 to 26.61
      let status: 'grazing' | 'migrating' | 'crossing_highway' | 'ascending_hills' = 'migrating';
      let threatScore = cluster.threatScore;

      const isNearHighway =
        (cluster.corridorName.includes('Panbari') && newLat >= 26.598 && newLat <= 26.612) ||
        (cluster.corridorName.includes('Kanchanjuri') && newLat >= 26.532 && newLat <= 26.546) ||
        (cluster.corridorName.includes('Haldibhari') && newLat >= 26.562 && newLat <= 26.574);

      if (isNearHighway) {
        status = 'crossing_highway';
        threatScore = Math.min(99, Math.max(88, threatScore + 1));
        activeCrossingsCount++;
      } else if (newLat < 26.56) {
        status = 'ascending_hills';
        threatScore = Math.max(40, threatScore - 1);
      } else if (newLat > 26.62) {
        status = 'grazing';
        threatScore = Math.max(35, threatScore - 1);
      }

      // Update trail breadcrumbs (keep last 20 coordinates)
      const prevTrail = cluster.trail || [];
      const newTrail: [number, number][] = [
        ...prevTrail.slice(-18),
        [Number(newLat.toFixed(5)), Number(newLng.toFixed(5))]
      ];

      // Check proximity to sensors to trigger
      sensors.forEach((sensor) => {
        const distKm = this.calculateDistanceKm(newLat, newLng, sensor.lat, sensor.lng);
        if (distKm < 0.9) {
          // Inside 900m sensor perimeter
          if (!triggeredSensorIds.includes(sensor.id)) {
            triggeredSensorIds.push(sensor.id);
          }
        }
      });

      // Calculate dynamic speed variation
      const baseSpeed =
        cluster.species === 'Asian Elephant'
          ? 5.2
          : cluster.species === 'Royal Bengal Tiger'
          ? 6.8
          : cluster.species === 'Swamp Deer'
          ? 4.5
          : 3.2;
      const speedKmH = Number(
        (baseSpeed + (isNearHighway ? -1.2 : Math.sin(Date.now() / 2000) * 0.6)).toFixed(1)
      );

      return {
        ...cluster,
        lat: Number(newLat.toFixed(5)),
        lng: Number(newLng.toFixed(5)),
        targetIndex: targetIdx,
        direction: dir,
        progress: Number(progress.toFixed(3)),
        status,
        threatScore,
        trail: newTrail,
        movementVector: {
          angle: bearing,
          speedKmH
        },
        timestamp: 'Live GPS Ping'
      };
    });

    return {
      updatedClusters,
      triggeredSensorIds,
      highwayCrossingAlert: activeCrossingsCount > 0,
      activeCrossingsCount
    };
  }

  /**
   * Resets clusters to their starting positions
   */
  public static resetClusters(): AnimalCluster[] {
    return JSON.parse(JSON.stringify(INITIAL_ANIMAL_CLUSTERS));
  }
}
