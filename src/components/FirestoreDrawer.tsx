import React, { useState } from 'react';
import { X, Database, ShieldAlert, ListFilter, Code, CheckCircle2 } from 'lucide-react';
import { FirestoreState } from '../types';

interface FirestoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: FirestoreState;
  onClearThreat: (id: string) => void;
}

export const FirestoreDrawer: React.FC<FirestoreDrawerProps> = ({
  isOpen,
  onClose,
  state,
  onClearThreat
}) => {
  const [activeTab, setActiveTab] = useState<'sensor_logs' | 'active_threats' | 'polygon_vertices'>('sensor_logs');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex justify-end bg-black/80 font-mono">
      <div className="w-full max-w-xl bg-black border-l-2 border-white text-white h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b-2 border-white flex items-center justify-between bg-black">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white text-black border border-white">
              <Database className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-widest text-white">
                Cloud Firestore Emulator
              </h2>
              <p className="text-xs text-gray-400">
                Project: <span className="text-white font-bold">d-esz-kaziranga-gis</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border-2 border-white bg-black hover:bg-white hover:text-black text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collection Tabs */}
        <div className="flex border-b-2 border-white bg-black p-2 gap-2 text-xs uppercase font-bold">
          <button
            onClick={() => setActiveTab('sensor_logs')}
            className={`px-3 py-2 border-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sensor_logs'
                ? 'bg-white text-black border-white'
                : 'bg-black text-gray-400 border-white/40 hover:border-white hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>sensor_logs ({state.sensor_logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active_threats')}
            className={`px-3 py-2 border-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'active_threats'
                ? 'bg-white text-black border-white'
                : 'bg-black text-gray-400 border-white/40 hover:border-white hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>active_threats ({state.active_threats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('polygon_vertices')}
            className={`px-3 py-2 border-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'polygon_vertices'
                ? 'bg-white text-black border-white'
                : 'bg-black text-gray-400 border-white/40 hover:border-white hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>polygon_vertices ({state.polygon_vertices.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs">
          {activeTab === 'sensor_logs' && (
            <div className="space-y-3">
              {state.sensor_logs.map((log) => (
                <div key={log.id} className="p-3 bg-black border-2 border-white space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-white font-bold">{log.id}</span>
                    <span className="text-gray-400">{log.timestamp}</span>
                  </div>
                  <div className="text-white font-bold uppercase">{log.detectedObject}</div>
                  <div className="text-gray-300 text-[11px] uppercase">{log.actionTaken}</div>
                  <div className="text-gray-400 text-[10px]">
                    Coordinates: [{log.lat}, {log.lng}] | Confidence: {(log.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'active_threats' && (
            <div className="space-y-3">
              {state.active_threats.length === 0 ? (
                <div className="text-center py-12 text-gray-500 italic uppercase">
                  No active threats logged in Firestore collection.
                </div>
              ) : (
                state.active_threats.map((threat) => (
                  <div key={threat.id} className="p-3.5 bg-black border-2 border-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold uppercase">{threat.species} Herd ({threat.count} count)</span>
                      <span className="px-2 py-0.5 bg-white text-black text-[10px] uppercase font-bold">
                        {threat.status}
                      </span>
                    </div>

                    <p className="text-gray-300 text-xs uppercase">{threat.locationName}</p>

                    <div className="text-[11px] text-gray-400 uppercase">
                      SMS Alert Sent To: <span className="text-white font-bold">{threat.smsDispatchedTo.join(', ')}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/30">
                      <span className="text-white uppercase">Threat Score: <strong>{threat.threatScore}/100</strong></span>
                      <button
                        onClick={() => onClearThreat(threat.id)}
                        className="px-2.5 py-1 bg-white text-black border border-white hover:bg-black hover:text-white text-[11px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve Threat</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'polygon_vertices' && (
            <div className="space-y-2">
              <div className="p-2.5 bg-black border border-white text-gray-200 text-[11px] uppercase">
                Active Amoeba Geofence Polygon ring computed via <strong>AlphaShape (Concave Hull)</strong> algorithm.
              </div>

              <div className="bg-black p-3 border-2 border-white max-h-96 overflow-y-auto">
                <pre className="text-[11px] text-white">
                  {JSON.stringify(state.polygon_vertices, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

