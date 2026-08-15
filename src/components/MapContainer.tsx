import React, { useEffect, useRef } from 'react';
import {
  MapContainer as LeafletMap,
  TileLayer,
  Circle,
  Polygon,
  Polyline,
  Marker,
  Popup,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { Camera, Volume2, Activity, Zap, Compass, AlertCircle, ShieldAlert } from 'lucide-react';
import { renderToString } from 'react-dom/server';
import {
  ESZMode,
  SensorMarker as SensorTypeMarker,
  AnimalCluster,
  CorridorPathway,
  SensorType
} from '../types';
import {
  KAZIRANGA_CENTER,
  STATIC_10KM_CENTER,
  STATIC_10KM_RADIUS_METERS,
  STATIC_1KM_CENTER,
  STATIC_1KM_RADIUS_METERS
} from '../data/kazirangaData';

interface MapContainerProps {
  eszMode: ESZMode;
  sensors: SensorTypeMarker[];
  clusters: AnimalCluster[];
  corridorPathways: CorridorPathway[];
  amoebaOuterCoords: [number, number][];
  amoebaYellowCoords: [number, number][];
  amoebaRedCoords: [number, number][];
  showActivePathways: boolean;
  showHistoricalPathways: boolean;
  sensorFilter: SensorType | 'all';
  onSensorClick: (sensor: SensorTypeMarker) => void;
  isSimulating?: boolean;
  simulationSpeed?: number;
  onToggleSimulation?: () => void;
  onSetSimulationSpeed?: (speed: number) => void;
  onResetSimulation?: () => void;
  highwayCrossingAlert?: boolean;
  activeCrossingsCount?: number;
}

// Custom White Icon Builder for Leaflet
function createWhiteSensorIcon(type: SensorType, isTriggered: boolean) {
  let iconNode;
  if (type === 'camera_trap') iconNode = <Camera className="w-5 h-5 text-white stroke-[2.5]" />;
  else if (type === 'acoustic_sensor') iconNode = <Volume2 className="w-5 h-5 text-white stroke-[2.5]" />;
  else iconNode = <Activity className="w-5 h-5 text-white stroke-[2.5]" />;

  const htmlString = renderToString(
    <div className={`custom-white-marker ${isTriggered ? 'triggered' : ''} w-9 h-9`}>
      {iconNode}
    </div>
  );

  return L.divIcon({
    html: htmlString,
    className: 'custom-leaflet-icon',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20]
  });
}

function createAnimalIcon(cluster: AnimalCluster, isSimulating: boolean) {
  const isHighRisk = cluster.threatScore > 75 || cluster.status === 'crossing_highway';
  const isCrossing = cluster.status === 'crossing_highway';
  const isElephant = cluster.species === 'Asian Elephant';
  const heading = cluster.movementVector.angle;

  const htmlString = renderToString(
    <div className="herd-marker-wrapper group">
      {/* Expanding Sonar Pulse Waves when moving */}
      {(isSimulating || isCrossing) && (
        <div className={`herd-radar-pulse ${isCrossing || isHighRisk ? 'critical' : ''}`} />
      )}

      {/* Dispersed satellite herd member dots for elephant herds */}
      {isElephant && isSimulating && (
        <>
          <div className="herd-satellite-dot" style={{ top: '4px', left: '6px', animationDelay: '0.2s' }} />
          <div className="herd-satellite-dot" style={{ bottom: '6px', right: '4px', animationDelay: '0.6s' }} />
          <div className="herd-satellite-dot" style={{ top: '10px', right: '6px', animationDelay: '1.1s' }} />
        </>
      )}

      {/* Main Core Animal Marker */}
      <div
        className={`w-11 h-11 flex flex-col items-center justify-center border-2 transition-all relative z-10 ${
          isCrossing
            ? 'bg-red-950/95 border-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.9)] animate-pulse'
            : isHighRisk
            ? 'bg-zinc-950 border-[#00ff41] text-[#00ff41] shadow-[0_0_14px_rgba(0,255,65,0.7)]'
            : 'bg-zinc-950 border-[#00ff41] text-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.4)]'
        }`}
      >
        {/* Dynamic Heading Direction Arrow Pointer */}
        <div
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 transition-transform duration-200"
          style={{
            transform: `translateX(-50%) rotate(${heading}deg)`,
            transformOrigin: 'bottom center'
          }}
        >
          <div className={`w-2.5 h-2.5 ${isCrossing ? 'bg-red-500' : 'bg-[#00ff41]'} clip-triangle shadow-[0_0_6px_currentColor]`}></div>
        </div>

        {/* Species & Headcount */}
        <div className="flex items-center justify-center gap-0.5 leading-none">
          <span className="text-xs font-bold">{isElephant ? '🐘' : cluster.species === 'One-Horned Rhino' ? '🦏' : cluster.species === 'Royal Bengal Tiger' ? '🐅' : '🦌'}</span>
          <span className="font-mono font-black text-[11px] tracking-tight">{cluster.count}</span>
        </div>

        {/* Live Speed Tag */}
        <span className={`text-[8px] font-mono font-bold leading-none mt-0.5 ${isCrossing ? 'text-red-300' : 'text-[#88a888]'}`}>
          {cluster.movementVector.speedKmH}k
        </span>
      </div>

      {/* Floating Status Tag over the Moving Herd */}
      {isSimulating && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-current px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-tight shadow-md z-20 pointer-events-none">
          {isCrossing ? (
            <span className="text-red-400 animate-pulse">⚠️ CROSSING NH-37</span>
          ) : (
            <span className="text-[#00ff41]">{cluster.species.toUpperCase()} ➔ {cluster.corridorName.split(' ')[0]}</span>
          )}
        </div>
      )}
    </div>
  );

  return L.divIcon({
    html: htmlString,
    className: 'custom-leaflet-icon',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -26]
  });
}

// Controller to handle center updates or map bounds
function MapViewController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  return null;
}

export const MapContainer: React.FC<MapContainerProps> = ({
  eszMode,
  sensors,
  clusters,
  corridorPathways,
  amoebaOuterCoords,
  amoebaYellowCoords,
  amoebaRedCoords,
  showActivePathways,
  showHistoricalPathways,
  sensorFilter,
  onSensorClick,
  isSimulating = false,
  simulationSpeed = 1,
  onToggleSimulation,
  onSetSimulationSpeed,
  onResetSimulation,
  highwayCrossingAlert = false,
  activeCrossingsCount = 0
}) => {
  // Filter sensors
  const filteredSensors = sensors.filter(
    (s) => sensorFilter === 'all' || s.type === sensorFilter
  );

  return (
    <div className="relative flex-1 w-full h-full bg-[#040504]">
      {/* Scanner effect line */}
      <div className="absolute top-[45%] left-0 w-full h-[2px] bg-[#00ff41]/30 shadow-[0_0_12px_#00ff41] z-[1000] pointer-events-none animate-pulse"></div>

      {/* Cyber Emerald HUD Coordinates Overlay */}
      <div className="absolute top-5 left-5 z-[1000] pointer-events-none font-mono flex flex-col gap-1.5">
        <div className="bg-black/85 border-l-2 border-[#00ff41] px-3 py-1 text-[11px] text-[#00ff41] font-bold shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          LAT: 26.5828° N
        </div>
        <div className="bg-black/85 border-l-2 border-[#00ff41] px-3 py-1 text-[11px] text-[#00ff41] font-bold shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          LON: 93.1708° E
        </div>
        <div className="bg-black/85 border-l-2 border-[#00ff41] px-3 py-1 text-[11px] text-[#e0f2e0] font-bold shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          GRID_SECTOR: NH-37_CORRIDOR
        </div>
      </div>

      {/* Highway Crossing Warning Banner */}
      {highwayCrossingAlert && (
        <div className="absolute top-5 right-5 z-[1000] font-mono max-w-sm bg-red-950/90 backdrop-blur-md border-2 border-red-600 p-2.5 text-white flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <div className="text-[10px] font-mono leading-tight">
            <strong className="text-red-300 block font-bold uppercase">AUTOMATED HIGHWAY ALERT</strong>
            <span>HERD CROSSING NH-37 // SPEED RESTRICTED TO 20 KM/H</span>
          </div>
        </div>
      )}

      <LeafletMap
        center={KAZIRANGA_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <MapViewController center={KAZIRANGA_CENTER} />

        {/* Solid Black / High Contrast CartoDB Dark Matter Base Tiles */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          maxZoom={18}
        />

        {/* STATE 1: Static 10km Massive Rigid Circle */}
        {eszMode === 'static_10km' && (
          <Circle
            center={STATIC_10KM_CENTER}
            radius={STATIC_10KM_RADIUS_METERS}
            pathOptions={{
              color: '#ff3e3e',
              weight: 4,
              dashArray: '8, 8',
              fillColor: '#ff3e3e',
              fillOpacity: 0.15
            }}
          >
            <Popup>
              <div className="p-2 text-xs font-mono">
                <strong className="text-[#ff3e3e] text-sm block mb-1">Static 10 KM Default ESZ Boundary</strong>
                <p className="text-[#e0f2e0]/80">
                  Massive rigid 314 sq km circle around Kaziranga Park. Inflexible boundary restricting agriculture and human habitation.
                </p>
              </div>
            </Popup>
          </Circle>
        )}

        {/* STATE 2: Static 1km Proposed Tight Circle */}
        {eszMode === 'static_1km' && (
          <Circle
            center={STATIC_1KM_CENTER}
            radius={STATIC_1KM_RADIUS_METERS}
            pathOptions={{
              color: '#a855f7',
              weight: 4,
              dashArray: '6, 6',
              fillColor: '#a855f7',
              fillOpacity: 0.2
            }}
          >
            <Popup>
              <div className="p-2 text-xs font-mono">
                <strong className="text-purple-400 text-sm block mb-1">Static 1 KM Proposed ESZ Boundary</strong>
                <p className="text-[#e0f2e0]/80">
                  Tight 1.5 km rigid circle (7.1 sq km). Fails to protect migratory herds crossing NH-37 during annual floods.
                </p>
              </div>
            </Popup>
          </Circle>
        )}

        {/* STATE 3: Dynamic Corridor Amoeba-like Polygon (D-ESZ) */}
        {eszMode === 'dynamic_amoeba' && (
          <>
            {/* Outer Green Eco-Corridor Boundary */}
            {amoebaOuterCoords.length > 2 && (
              <Polygon
                positions={amoebaOuterCoords}
                pathOptions={{
                  color: '#00ff41',
                  weight: 4,
                  fillColor: '#00ff41',
                  fillOpacity: 0.22,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              >
                <Popup>
                  <div className="p-2 text-xs font-mono">
                    <strong className="text-[#00ff41] text-sm block mb-1">D-ESZ Outer Amoeba Boundary</strong>
                    <p className="text-[#e0f2e0]/80">
                      Dynamic irregular alpha shape hull wrapping active wildlife corridors along NH-37.
                    </p>
                  </div>
                </Popup>
              </Polygon>
            )}

            {/* Warning Yellow Transition Zone */}
            {amoebaYellowCoords.length > 2 && (
              <Polygon
                positions={amoebaYellowCoords}
                pathOptions={{
                  color: '#d4af37',
                  weight: 3,
                  dashArray: '5, 5',
                  fillColor: '#d4af37',
                  fillOpacity: 0.25
                }}
              />
            )}

            {/* Core Red High-Threat Zone */}
            {amoebaRedCoords.length > 2 && (
              <Polygon
                positions={amoebaRedCoords}
                pathOptions={{
                  color: '#ff3e3e',
                  weight: 4,
                  fillColor: '#ff3e3e',
                  fillOpacity: 0.4
                }}
              >
                <Popup>
                  <div className="p-2 text-xs font-mono">
                    <strong className="text-[#ff3e3e] text-sm block mb-1 font-bold">CORE THREAT SECTOR (RED)</strong>
                    <p className="text-[#e0f2e0]/80">
                      Immediate high-density animal presence & active sensor triggers. Speed limit strictly restricted.
                    </p>
                  </div>
                </Popup>
              </Polygon>
            )}
          </>
        )}

        {/* Wildlife Corridor Pathways Overlays */}
        {corridorPathways.map((path) => {
          if (path.isActive && !showActivePathways) return null;
          if (path.isHistorical && !showHistoricalPathways) return null;

          return (
            <Polyline
              key={path.id}
              positions={path.coordinates}
              pathOptions={{
                color: path.isActive ? '#06b6d4' : '#f59e0b',
                weight: path.isActive ? 4 : 3,
                dashArray: path.isActive ? undefined : '6, 6',
                opacity: 0.85
              }}
            >
              <Popup>
                <div className="p-2 text-xs font-sans">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <strong className="text-white text-sm">{path.name}</strong>
                  </div>
                  <p className="text-zinc-300 mb-2">{path.description}</p>
                  <div className="grid grid-cols-2 gap-1 text-[11px] font-mono bg-zinc-900 p-1.5 rounded border border-zinc-800">
                    <span className="text-zinc-400">Criticality:</span>
                    <span className="text-red-400 font-bold">{path.criticality}</span>
                    <span className="text-zinc-400">Monthly Herds:</span>
                    <span className="text-cyan-300 font-bold">{path.avgHerdsPerMonth}</span>
                  </div>
                </div>
              </Popup>
            </Polyline>
          );
        })}

        {/* Dynamic Migration Trail Polylines behind moving herds */}
        {clusters.map((cluster) => {
          if (!cluster.trail || cluster.trail.length < 2) return null;
          const isElephant = cluster.species === 'Asian Elephant';
          const isCrossing = cluster.status === 'crossing_highway';

          return (
            <Polyline
              key={`trail-${cluster.id}`}
              positions={cluster.trail}
              pathOptions={{
                color: isCrossing ? '#ff3e3e' : isElephant ? '#00ff41' : '#06b6d4',
                weight: isElephant ? 4 : 3,
                opacity: 0.8,
                dashArray: '6, 8',
                className: 'migration-trail'
              }}
            />
          );
        })}

        {/* Forward Projected Path when simulation is active */}
        {isSimulating &&
          clusters.map((cluster) => {
            if (!cluster.pathCoordinates || cluster.pathCoordinates.length < 2) return null;
            return (
              <Polyline
                key={`forward-${cluster.id}`}
                positions={cluster.pathCoordinates}
                pathOptions={{
                  color: '#00ff41',
                  weight: 1.5,
                  opacity: 0.3,
                  dashArray: '4, 6'
                }}
              />
            );
          })}

        {/* AI Camera Traps / Acoustic / Seismic Sensor Markers */}
        {filteredSensors.map((sensor) => (
          <Marker
            key={sensor.id}
            position={[sensor.lat, sensor.lng]}
            icon={createWhiteSensorIcon(sensor.type, sensor.status === 'triggered')}
            eventHandlers={{
              click: () => onSensorClick(sensor)
            }}
          >
            <Popup>
              <div className="p-2.5 text-xs font-sans min-w-[220px]">
                <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-2 mb-2">
                  <strong className="text-white text-sm font-bold">{sensor.name}</strong>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                      sensor.status === 'triggered'
                        ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    {sensor.status.toUpperCase()}
                  </span>
                </div>

                <p className="text-zinc-300 text-[11px] mb-2 leading-relaxed">{sensor.description}</p>

                <div className="space-y-1 font-mono text-[11px] bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300 mb-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Corridor:</span>
                    <span className="text-white font-medium">{sensor.corridor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Battery:</span>
                    <span className="text-emerald-400 font-medium">{sensor.battery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Detections:</span>
                    <span className="text-cyan-400 font-medium">{sensor.detectionCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSensorClick(sensor)}
                  className="w-full py-1.5 border border-white bg-white hover:bg-black hover:text-white text-black font-bold text-xs uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Trigger Sensor Event</span>
                </button>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Animal Clusters Markers */}
        {clusters.map((cluster) => (
          <Marker
            key={cluster.id}
            position={[cluster.lat, cluster.lng]}
            icon={createAnimalIcon(cluster, isSimulating)}
          >
            <Popup>
              <div className="p-2.5 text-xs font-sans min-w-[210px]">
                <div className="flex items-center justify-between gap-1.5 mb-2 border-b border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-1.5 text-white font-bold text-sm">
                    <ShieldAlert className="w-4 h-4 text-[#00ff41]" />
                    <span>{cluster.species} Herd</span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                      cluster.status === 'crossing_highway'
                        ? 'bg-red-950 text-red-400 border border-red-700 animate-pulse'
                        : 'bg-zinc-900 text-[#00ff41] border border-[#00ff41]/50'
                    }`}
                  >
                    {cluster.status ? cluster.status.toUpperCase().replace('_', ' ') : 'TRACKING'}
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-[11px] bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Herd Count:</span>
                    <strong className="text-white font-bold">{cluster.count} Animals</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Live Velocity:</span>
                    <strong className="text-cyan-300 font-bold">
                      {cluster.movementVector.speedKmH} km/h ({cluster.movementVector.angle}°)
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Threat Index:</span>
                    <strong className={cluster.threatScore > 75 ? 'text-red-400 font-bold' : 'text-[#00ff41] font-bold'}>
                      {cluster.threatScore}/100
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Corridor Sector:</span>
                    <strong className="text-zinc-200">{cluster.corridorName}</strong>
                  </div>
                </div>

                {cluster.status === 'crossing_highway' && (
                  <div className="mt-2 p-1.5 bg-red-950/80 border border-red-700 text-red-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                    <span>NH-37 HIGHWAY CROSSING IN PROGRESS // SPEED LIMIT 20 KM/H</span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </LeafletMap>

      {/* Floating Map Legend Overlay - Cyber Emerald Bento Box */}
      <div className="absolute bottom-5 right-5 bg-[#0a0f0a] border-2 border-[#1a2e1a] p-3.5 text-xs text-[#e0f2e0] z-[1000] font-mono max-w-xs hidden sm:block shadow-[0_0_15px_rgba(0,0,0,0.8)]">
        <div className="font-bold uppercase tracking-widest text-[11px] text-[#00ff41] mb-2.5 flex items-center justify-between border-b border-[#1a2e1a] pb-1.5">
          <span>GIS_LEGEND</span>
          <span className="text-black bg-[#00ff41] px-1 text-[9px] font-bold">OPERATIONAL</span>
        </div>

        <div className="space-y-2 text-[10px] uppercase font-bold">
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 border-2 border-[#00ff41] bg-black shrink-0"></span>
            <span className="text-[#e0f2e0]">SENSOR_NODE</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 border-2 border-[#ff3e3e] bg-[#ff3e3e] animate-pulse shrink-0"></span>
            <span className="text-[#ff3e3e]">THREAT_ACTIVE</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-2.5 bg-[#00ff41]/20 border-2 border-dashed border-[#00ff41] shrink-0"></span>
            <span className="text-[#00ff41]">D-ESZ_OUTER_AMOEBA</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-2.5 bg-[#ff3e3e]/40 border-2 border-[#ff3e3e] shrink-0"></span>
            <span className="text-[#ff3e3e]">CORE_THREAT_SECTOR</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-1 bg-cyan-400 shrink-0"></span>
            <span className="text-cyan-300">ACTIVE_PASSAGE</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-1 border-b-2 border-dashed border-[#d4af37] shrink-0"></span>
            <span className="text-[#d4af37]">HISTORIC_ROUTE</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-4 h-1 border-b-2 border-dashed border-[#00ff41] shrink-0"></span>
            <span className="text-[#00ff41]">LIVE_HERD_TRAIL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
