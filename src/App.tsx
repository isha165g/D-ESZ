import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ESZMode,
  SensorMarker,
  AnimalCluster,
  SensorType,
  FirestoreState,
  AIThreatAssessment
} from './types';
import {
  INITIAL_SENSORS,
  INITIAL_ANIMAL_CLUSTERS,
  CORRIDOR_PATHWAYS
} from './data/kazirangaData';
import { FirebaseService } from './services/FirebaseService';
import { AIService, ToastAlert } from './services/AIService';
import { AlphaShapeService } from './services/AlphaShapeService';
import { HerdSimulationService } from './services/HerdSimulationService';

import { ControlHeader } from './components/ControlHeader';
import { Sidebar } from './components/Sidebar';
import { MapContainer } from './components/MapContainer';
import { FirestoreDrawer } from './components/FirestoreDrawer';
import { AIReportModal } from './components/AIReportModal';
import { ToastNotification } from './components/ToastNotification';

export default function App() {
  // 1. Core State
  const [eszMode, setEszMode] = useState<ESZMode>('dynamic_amoeba');
  const [densityFilter, setDensityFilter] = useState<number>(15);
  const [showActivePathways, setShowActivePathways] = useState<boolean>(true);
  const [showHistoricalPathways, setShowHistoricalPathways] = useState<boolean>(true);
  const [sensorFilter, setSensorFilter] = useState<SensorType | 'all'>('all');

  // Sensors & Animal Clusters
  const [sensors, setSensors] = useState<SensorMarker[]>(INITIAL_SENSORS);
  const [clusters, setClusters] = useState<AnimalCluster[]>(INITIAL_ANIMAL_CLUSTERS);

  // Firestore & Toast & Modal States
  const [firestoreState, setFirestoreState] = useState<FirestoreState>({
    sensor_logs: [],
    active_threats: [],
    polygon_vertices: []
  });
  const [isFirestoreOpen, setIsFirestoreOpen] = useState<boolean>(false);

  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [aiAssessment, setAiAssessment] = useState<AIThreatAssessment | null>(null);
  const [isAILoading, setIsAILoading] = useState<boolean>(false);

  const [toast, setToast] = useState<ToastAlert | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1);
  const [highwayCrossingAlert, setHighwayCrossingAlert] = useState<boolean>(false);
  const [activeCrossingsCount, setActiveCrossingsCount] = useState<number>(0);
  const sensorTriggerCooldownRef = useRef<Record<string, number>>({});

  // 2. Subscribe to FirebaseService
  useEffect(() => {
    const firebase = FirebaseService.getInstance();
    const unsubscribe = firebase.subscribe((state) => {
      setFirestoreState(state);
    });
    return () => unsubscribe();
  }, []);

  // 3. Compute Dynamic Amoeba Polygon (Alpha Shape)
  const amoebaResult = useMemo(() => {
    return AlphaShapeService.calculateDynamicAmoebaZone(sensors, clusters, densityFilter);
  }, [sensors, clusters, densityFilter]);

  // Sync computed polygon vertices to Firestore collection
  useEffect(() => {
    FirebaseService.getInstance().updatePolygonVertices(amoebaResult.polygonVertices);
  }, [amoebaResult.polygonVertices]);

  // 4. Handle Sensor Trigger Event
  const handleTriggerSensorEvent = useCallback((sensorId: string) => {
    setSensors((prev) =>
      prev.map((s) =>
        s.id === sensorId
          ? { ...s, status: 'triggered', detectionCount: s.detectionCount + 1 }
          : s
      )
    );

    const triggeredSensor = sensors.find((s) => s.id === sensorId) || sensors[0];

    // Log to FirebaseService
    FirebaseService.getInstance().logSensorTrigger(triggeredSensor, 'Elephant Herd', 18);

    // Trigger SMS Notification Toast
    const newToast = AIService.generateVillageSMSNotification(triggeredSensor, 'Elephant Herd', 18);
    setToast(newToast);

    // Auto dismiss toast after 6 seconds
    setTimeout(() => {
      setToast((curr) => (curr?.id === newToast.id ? null : curr));
    }, 6000);
  }, [sensors]);

  // 5. Automated Real-time Elephant Herd Migration Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setClusters((prevClusters) => {
        const stepResult = HerdSimulationService.stepSimulation(
          prevClusters,
          sensors,
          simulationSpeed
        );

        setHighwayCrossingAlert(stepResult.highwayCrossingAlert);
        setActiveCrossingsCount(stepResult.activeCrossingsCount);

        // Check and trigger proximity sensors
        const now = Date.now();
        stepResult.triggeredSensorIds.forEach((sensorId) => {
          const lastTime = sensorTriggerCooldownRef.current[sensorId] || 0;
          if (now - lastTime > 12000) {
            sensorTriggerCooldownRef.current[sensorId] = now;
            handleTriggerSensorEvent(sensorId);
          }
        });

        return stepResult.updatedClusters;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isSimulating, sensors, simulationSpeed, handleTriggerSensorEvent]);

  // 6. Gemini AI Policy Evaluation Trigger
  const handleEvaluateAIPolicy = async () => {
    setIsAIModalOpen(true);
    setIsAILoading(true);

    const report = await AIService.generateGeminiPolicyReport(
      firestoreState.active_threats,
      sensors,
      clusters,
      amoebaResult.totalAreaSqKm
    );

    setAiAssessment(report);
    setIsAILoading(false);
  };

  // 7. Reset Threats & Reset Herd Migration Positions
  const handleResetThreats = () => {
    setSensors(INITIAL_SENSORS);
    setClusters(HerdSimulationService.resetClusters());
    setHighwayCrossingAlert(false);
    setActiveCrossingsCount(0);
    sensorTriggerCooldownRef.current = {};
    FirebaseService.getInstance().resetAll();
    setToast(null);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white overflow-hidden font-sans">
      {/* Top HUD Header */}
      <ControlHeader
        eszMode={eszMode}
        activeThreatsCount={firestoreState.active_threats.length}
        totalAreaSqKm={amoebaResult.totalAreaSqKm}
        isSimulating={isSimulating}
        simulationSpeed={simulationSpeed}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        onSetSimulationSpeed={setSimulationSpeed}
        onResetThreats={handleResetThreats}
        onOpenFirestore={() => setIsFirestoreOpen(true)}
        onOpenAIReport={handleEvaluateAIPolicy}
      />

      {/* Main Workspace: Sidebar Controls + Interactive Map */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden relative">
        <Sidebar
          eszMode={eszMode}
          onSelectESZMode={setEszMode}
          densityFilter={densityFilter}
          onDensityFilterChange={setDensityFilter}
          showActivePathways={showActivePathways}
          onToggleActivePathways={setShowActivePathways}
          showHistoricalPathways={showHistoricalPathways}
          onToggleHistoricalPathways={setShowHistoricalPathways}
          sensorFilter={sensorFilter}
          onSensorFilterChange={setSensorFilter}
          onTriggerSensorEvent={handleTriggerSensorEvent}
        />

        <MapContainer
          eszMode={eszMode}
          sensors={sensors}
          clusters={clusters}
          corridorPathways={CORRIDOR_PATHWAYS}
          amoebaOuterCoords={amoebaResult.outerBoundary}
          amoebaYellowCoords={amoebaResult.warningYellowBoundary}
          amoebaRedCoords={amoebaResult.coreRedBoundary}
          showActivePathways={showActivePathways}
          showHistoricalPathways={showHistoricalPathways}
          sensorFilter={sensorFilter}
          onSensorClick={(sensor) => handleTriggerSensorEvent(sensor.id)}
          isSimulating={isSimulating}
          simulationSpeed={simulationSpeed}
          onToggleSimulation={() => setIsSimulating(!isSimulating)}
          onSetSimulationSpeed={setSimulationSpeed}
          onResetSimulation={handleResetThreats}
          highwayCrossingAlert={highwayCrossingAlert}
          activeCrossingsCount={activeCrossingsCount}
        />
      </div>

      {/* Slide-over Firestore Collection Inspector Drawer */}
      <FirestoreDrawer
        isOpen={isFirestoreOpen}
        onClose={() => setIsFirestoreOpen(false)}
        state={firestoreState}
        onClearThreat={(id) => FirebaseService.getInstance().clearThreat(id)}
      />

      {/* Gemini AI Policy Assessment Modal */}
      <AIReportModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        assessment={aiAssessment}
        isLoading={isAILoading}
        onRefresh={handleEvaluateAIPolicy}
      />

      {/* Automated Village Early Warning SMS Toast */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
