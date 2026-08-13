import concaveman from 'concaveman';
import { SensorMarker, AnimalCluster, PolygonVertex } from '../types';

export interface DynamicAmoebaResult {
  outerBoundary: [number, number][]; // [lat, lng][] array for leafet
  coreRedBoundary: [number, number][];
  warningYellowBoundary: [number, number][];
  polygonVertices: PolygonVertex[];
  totalAreaSqKm: number;
  perimeterKm: number;
  activePointsCount: number;
  maxThreatScore: number;
}

/**
 * Service to compute dynamic amoeba-like irregular Concave Hull (Alpha Shape)
 * polygons based on real-time sensor triggers and animal presence clusters.
 */
export class AlphaShapeService {
  /**
   * Generates the dynamic amoeba geofence coordinates
   */
  public static calculateDynamicAmoebaZone(
    sensors: SensorMarker[],
    clusters: AnimalCluster[],
    minDensityFilter: number
  ): DynamicAmoebaResult {
    // 1. Collect points from active/triggered sensors and animal clusters above density filter
    const samplePoints: { lat: number; lng: number; weight: number }[] = [];

    // Filter clusters by density slider
    const filteredClusters = clusters.filter((c) => c.density >= minDensityFilter);

    filteredClusters.forEach((c) => {
      // Add cluster center
      samplePoints.push({ lat: c.lat, lng: c.lng, weight: c.threatScore / 100 });

      // Generate surrounding points based on herd count & movement vector to simulate cluster envelope
      const radiusDeg = 0.008 + (c.count / 30) * 0.012; // ~1-2 km envelope
      const steps = 6;
      for (let i = 0; i < steps; i++) {
        const angle = (i * 2 * Math.PI) / steps;
        // Stretch in movement direction if active
        const stretch = c.isActivePath ? 1.4 : 1.0;
        const pLat = c.lat + Math.sin(angle) * radiusDeg * stretch;
        const pLng = c.lng + Math.cos(angle) * radiusDeg;
        samplePoints.push({ lat: pLat, lng: pLng, weight: c.threatScore / 100 });
      }
    });

    // Add triggered or active sensors
    sensors.forEach((s) => {
      if (s.status === 'triggered' || s.detectionCount > 100) {
        samplePoints.push({ lat: s.lat, lng: s.lng, weight: s.status === 'triggered' ? 1.0 : 0.6 });

        // Add buffer halo points around triggered sensor
        const bufferRadius = s.status === 'triggered' ? 0.018 : 0.01; // ~1.8km or 1km
        for (let i = 0; i < 5; i++) {
          const a = (i * 2 * Math.PI) / 5;
          samplePoints.push({
            lat: s.lat + Math.sin(a) * bufferRadius,
            lng: s.lng + Math.cos(a) * bufferRadius,
            weight: 0.8
          });
        }
      }
    });

    // If too few points, add default corridor anchor points along NH-37 to form baseline envelope
    if (samplePoints.length < 4) {
      const defaultAnchors = [
        { lat: 26.612, lng: 93.475 },
        { lat: 26.588, lng: 93.410 },
        { lat: 26.568, lng: 93.310 },
        { lat: 26.540, lng: 93.220 },
        { lat: 26.620, lng: 93.570 },
        { lat: 26.545, lng: 93.180 }
      ];
      defaultAnchors.forEach((pt) => samplePoints.push({ ...pt, weight: 0.5 }));
    }

    // 2. Convert points to [lng, lat] for Concaveman algorithm
    const pointArray: [number, number][] = samplePoints.map((pt) => [pt.lng, pt.lat]);

    // Concaveman calculation (concavity = 1.8 for tight amoeba contour, lengthThreshold = 0)
    let rawHull: number[][];
    try {
      rawHull = concaveman(pointArray, 1.8, 0.001);
    } catch {
      // Fallback if concaveman fails
      rawHull = pointArray;
    }

    // Ensure hull format is [lat, lng] for Leaflet
    const outerBoundary: [number, number][] = rawHull.map((coord) => [coord[1], coord[0]]);

    // Calculate core Red zone (shrunk scale ~0.65)
    const centerLat = outerBoundary.reduce((sum, p) => sum + p[0], 0) / outerBoundary.length;
    const centerLng = outerBoundary.reduce((sum, p) => sum + p[1], 0) / outerBoundary.length;

    const coreRedBoundary: [number, number][] = outerBoundary.map(([lat, lng]) => [
      centerLat + (lat - centerLat) * 0.55,
      centerLng + (lng - centerLng) * 0.55
    ]);

    const warningYellowBoundary: [number, number][] = outerBoundary.map(([lat, lng]) => [
      centerLat + (lat - centerLat) * 0.8,
      centerLng + (lng - centerLng) * 0.8
    ]);

    // 3. Format Firestore polygon vertices structure
    const polygonVertices: PolygonVertex[] = outerBoundary.map(([lat, lng], idx) => ({
      lat,
      lng,
      order: idx,
      isAmoebaBoundary: true,
      zone: idx % 3 === 0 ? 'Red Core' : idx % 2 === 0 ? 'Yellow Transition' : 'Green Eco-Corridor'
    }));

    // 4. Calculate approximate area & metrics
    const totalAreaSqKm = this.calculatePolygonAreaSqKm(outerBoundary);
    const perimeterKm = this.calculatePerimeterKm(outerBoundary);
    const maxThreatScore = filteredClusters.reduce((max, c) => Math.max(max, c.threatScore), 60);

    return {
      outerBoundary,
      coreRedBoundary,
      warningYellowBoundary,
      polygonVertices,
      totalAreaSqKm: Math.round(totalAreaSqKm * 10) / 10,
      perimeterKm: Math.round(perimeterKm * 10) / 10,
      activePointsCount: samplePoints.length,
      maxThreatScore
    };
  }

  /**
   * Approximate geodesic area of polygon in sq km
   */
  private static calculatePolygonAreaSqKm(coords: [number, number][]): number {
    if (coords.length < 3) return 12.5;
    let total = 0;
    const R = 6371; // Earth radius in km

    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      const lat1 = (coords[i][0] * Math.PI) / 180;
      const lat2 = (coords[j][0] * Math.PI) / 180;
      const lon1 = (coords[i][1] * Math.PI) / 180;
      const lon2 = (coords[j][1] * Math.PI) / 180;

      total += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    total = (Math.abs(total) * R * R) / 2;
    return total;
  }

  /**
   * Calculates perimeter in kilometers
   */
  private static calculatePerimeterKm(coords: [number, number][]): number {
    let dist = 0;
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      dist += this.haversineKm(coords[i][0], coords[i][1], coords[j][0], coords[j][1]);
    }
    return dist;
  }

  private static haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
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
}
