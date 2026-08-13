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
      <div className="w-full max-w-xl bg-[#0a0f0a] border-l-2 border-[#00ff41] text-[#e0f2e0] h-full flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="p-4 border-b-2 border-[#1a2e1a] flex items-center justify-between bg-[#060806]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-[#00ff41] text-black border border-[#00ff41]">
              <Database className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold uppercase tracking-widest text-[#00ff41]">
                Cloud Firestore Inspector
              </h2>
              <p className="text-xs text-[#88a888]">
                Project: <span className="text-[#e0f2e0] font-bold">desz-control-center</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-[#1a2e1a] bg-black hover:border-[#00ff41] hover:text-[#00ff41] text-[#e0f2e0] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collection Tabs */}
        <div className="flex border-b-2 border-[#1a2e1a] bg-[#060806] p-2 gap-2 text-xs uppercase font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('sensor_logs')}
            className={`px-3 py-2 border transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'sensor_logs'
                ? 'bg-[#00ff41] text-black border-[#00ff41]'
                : 'bg-black text-[#88a888] border-[#1a2e1a] hover:border-[#00ff41] hover:text-[#e0f2e0]'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>sensor_logs ({state.sensor_logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('active_threats')}
            className={`px-3 py-2 border transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'active_threats'
                ? 'bg-[#00ff41] text-black border-[#00ff41]'
                : 'bg-black text-[#88a888] border-[#1a2e1a] hover:border-[#00ff41] hover:text-[#e0f2e0]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>active_threats ({state.active_threats.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('polygon_vertices')}
            className={`px-3 py-2 border transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'polygon_vertices'
                ? 'bg-[#00ff41] text-black border-[#00ff41]'
                : 'bg-black text-[#88a888] border-[#1a2e1a] hover:border-[#00ff41] hover:text-[#e0f2e0]'
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
                <div key={log.id} className="p-3 bg-black border border-[#1a2e1a] hover:border-[#00ff41]/50 space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#00ff41] font-bold">{log.id}</span>
                    <span className="text-[#88a888]">{log.timestamp}</span>
                  </div>
                  <div className="text-[#e0f2e0] font-bold uppercase">{log.detectedObject}</div>
                  <div className="text-[#88a888] text-[11px] uppercase">{log.actionTaken}</div>
                  <div className="text-[#88a888]/80 text-[10px]">
                    Coordinates: [{log.lat}, {log.lng}] | Confidence: {(log.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'active_threats' && (
            <div className="space-y-3">
              {state.active_threats.length === 0 ? (
                <div className="text-center py-12 text-[#88a888] italic uppercase">
                  No active threats logged in Firestore collection.
                </div>
              ) : (
                state.active_threats.map((threat) => (
                  <div key={threat.id} className="p-3.5 bg-black border border-[#ff3e3e]/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[#e0f2e0] font-bold uppercase">{threat.species} Herd ({threat.count} count)</span>
                      <span className="px-2 py-0.5 bg-[#ff3e3e] text-white text-[10px] uppercase font-bold">
                        {threat.status}
                      </span>
                    </div>

                    <p className="text-[#88a888] text-xs uppercase">{threat.locationName}</p>

                    <div className="text-[11px] text-[#88a888] uppercase">
                      SMS Alert Sent To: <span className="text-[#00ff41] font-bold">{threat.smsDispatchedTo.join(', ')}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#1a2e1a]">
                      <span className="text-[#e0f2e0] uppercase">Threat Score: <strong className="text-[#ff3e3e]">{threat.threatScore}/100</strong></span>
                      <button
                        onClick={() => onClearThreat(threat.id)}
                        className="px-2.5 py-1 bg-[#00ff41] text-black border border-[#00ff41] hover:bg-black hover:text-[#00ff41] text-[11px] uppercase font-bold flex items-center gap-1 cursor-pointer transition-all"
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
              <div className="p-2.5 bg-black border border-[#1a2e1a] text-[#88a888] text-[11px] uppercase">
                Active Amoeba Geofence Polygon ring computed via <strong className="text-[#00ff41]">AlphaShape (Concave Hull)</strong> algorithm.
              </div>

              <div className="bg-black p-3 border border-[#1a2e1a] max-h-96 overflow-y-auto">
                <pre className="text-[11px] text-[#00ff41]">
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

