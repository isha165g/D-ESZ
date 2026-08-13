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

function createAnimalIcon(species: string, count: number, threatScore: number) {
  const isHighRisk = threatScore > 75;
  const htmlString = renderToString(
    <div className={`custom-animal-marker w-10 h-10 ${isHighRisk ? 'border-red-500 bg-red-950/90 shadow-[0_0_15px_#ef4444]' : 'border-amber-400 bg-zinc-900 shadow-[0_0_12px_#fbbf24]'}`}>
      <span className="font-mono font-black text-xs text-white">{count}</span>
    </div>
  );

  return L.divIcon({
    html: htmlString,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22]
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
  onSensorClick
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
            icon={createAnimalIcon(cluster.species, cluster.count, cluster.threatScore)}
          >
            <Popup>
              <div className="p-2 text-xs font-sans">
                <div className="flex items-center gap-1.5 mb-1 text-amber-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>{cluster.species} Cluster</span>
                </div>
                <div className="space-y-1 font-mono text-[11px] bg-zinc-950 p-2 rounded border border-zinc-800 text-zinc-300">
                  <div>Count: <strong className="text-white">{cluster.count} animals</strong></div>
                  <div>Density: <strong className="text-emerald-400">{cluster.density}%</strong></div>
                  <div>Threat Score: <strong className="text-red-400">{cluster.threatScore}/100</strong></div>
                  <div>Heading: <strong className="text-cyan-300">{cluster.movementVector.angle}° ({cluster.movementVector.speedKmH} km/h)</strong></div>
                  <div>Location: <strong className="text-zinc-300">{cluster.corridorName}</strong></div>
                </div>
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
        </div>
      </div>
    </div>
  );
};
