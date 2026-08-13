import {
  SensorMarker,
  AnimalCluster,
  ActiveThreat,
  AIThreatAssessment
} from '../types';
import { LOCAL_VILLAGES } from '../data/kazirangaData';

export interface ToastAlert {
  id: string;
  title: string;
  message: string;
  villageTarget: string;
  speedLimit: string;
  type: 'emergency' | 'warning' | 'info';
  timestamp: string;
}

export class AIService {
  /**
   * Recalculates threat score based on array of triggered sensors and active animal clusters
   */
  public static calculateThreatScore(
    sensors: SensorMarker[],
    clusters: AnimalCluster[]
  ): number {
    const triggeredSensorsCount = sensors.filter((s) => s.status === 'triggered').length;
    const maxClusterThreat = clusters.reduce((max, c) => Math.max(max, c.threatScore), 30);

    const baseScore = maxClusterThreat * 0.6 + triggeredSensorsCount * 12;
    return Math.min(99, Math.max(15, Math.round(baseScore)));
  }

  /**
   * Triggers village-level SMS early warning toast notifications when a threat occurs
   */
  public static generateVillageSMSNotification(
    sensor: SensorMarker,
    species: string = 'Asian Elephant Herd',
    count: number = 18
  ): ToastAlert {
    const village =
      LOCAL_VILLAGES[Math.floor(Math.random() * LOCAL_VILLAGES.length)];
    const speedLimit = count > 10 ? '20 km/h' : '30 km/h';

    return {
      id: `toast-${Date.now()}`,
      title: `🚨 SMS WARNING: ${sensor.corridor.toUpperCase()}`,
      message: `ALERT: ${species} (${count} animals) active near ${sensor.locationName}. D-ESZ Amoeba boundary expanded!`,
      villageTarget: village,
      speedLimit,
      type: 'emergency',
      timestamp: new Date().toLocaleTimeString()
    };
  }

  /**
   * Generates comprehensive AI Risk & Policy Evaluation report via Gemini API (with robust local fallback)
   */
  public static async generateGeminiPolicyReport(
    threats: ActiveThreat[],
    sensors: SensorMarker[],
    clusters: AnimalCluster[],
    amoebaAreaSqKm: number
  ): Promise<AIThreatAssessment> {
    const maxThreat = threats.reduce((m, t) => Math.max(m, t.threatScore), 45);

    try {
      const response = await fetch('/api/gemini/evaluate-esz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activeThreats: threats,
          sensorCount: sensors.length,
          triggeredSensors: sensors.filter((s) => s.status === 'triggered'),
          amoebaAreaSqKm,
          animalClusters: clusters
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.assessment) {
          return data.assessment;
        }
      }
    } catch (e) {
      console.warn('Backend Gemini endpoint unavailable, generating intelligent dynamic analysis locally:', e);
    }

    // High quality dynamic fallback analysis
    const isCritical = maxThreat > 75 || threats.length > 1;
    const villages = LOCAL_VILLAGES.slice(0, isCritical ? 4 : 2);

    return {
      threatScore: maxThreat,
      riskCategory: isCritical ? 'CRITICAL EMERGENCY' : maxThreat > 50 ? 'WARNING' : 'NORMAL',
      summary: isCritical
        ? `High risk detected along NH-37 corridor! ${clusters[0]?.species || 'Elephant'} movement detected across active crossing zones.`
        : `Normal activity monitoring along Kaziranga-Bokakhat wildlife buffer.`,
      recommendedSpeedLimit: isCritical ? '20 km/h Enforced on NH-37' : '40 km/h Standard',
      impactedVillages: villages,
      suggestedAction: isCritical
        ? 'Deploy Automated Speed Barrier Cameras & Activate Village Acoustic Alarm System in Panbari & Haldibhari.'
        : 'Maintain passive seismic monitoring and automated camera surveillance.',
      reasoning: `D-ESZ Amoeba geofence automatically warped to encompass ${amoebaAreaSqKm} sq km, protecting vital wildlife corridors while keeping ${Math.round(
        314 - amoebaAreaSqKm
      )} sq km of non-sensitive agricultural land open to local communities compared to a rigid 10km static ESZ.`
    };
  }
}
