import React from 'react';
import { Shield, Radio, AlertTriangle, Cpu, Database, Play, RefreshCw, Activity } from 'lucide-react';
import { ESZMode } from '../types';

interface ControlHeaderProps {
  eszMode: ESZMode;
  activeThreatsCount: number;
  totalAreaSqKm: number;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetThreats: () => void;
  onOpenFirestore: () => void;
  onOpenAIReport: () => void;
}

export const ControlHeader: React.FC<ControlHeaderProps> = ({
  eszMode,
  activeThreatsCount,
  totalAreaSqKm,
  isSimulating,
  onToggleSimulation,
  onResetThreats,
  onOpenFirestore,
  onOpenAIReport
}) => {
  return (
    <header className="h-auto min-h-[4.5rem] bg-[#0a0f0a] border-b-4 border-[#1a2e1a] px-4 md:px-6 py-3 text-[#e0f2e0] flex flex-col md:flex-row items-center justify-between gap-4 z-20 font-mono">
      {/* Title & Logo */}
      <div className="flex items-center space-x-3">
        <div className="border-2 border-[#00ff41] px-3 py-1 font-header font-bold text-xl text-[#00ff41] bg-black shrink-0 tracking-wider">
          D-ESZ
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg md:text-xl font-header font-bold tracking-wider uppercase text-[#e0f2e0] leading-none">
              Kaziranga-Bokakhat GIS Command
            </h1>
            <div className="bg-[#00ff41]/10 border border-[#00ff41] text-[#00ff41] text-[9px] font-mono px-1.5 py-0.5 uppercase tracking-wider flex items-center gap-1 shrink-0 font-bold">
              <span className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-ping"></span>
              <span>OPERATIONAL</span>
            </div>
          </div>
          <p className="text-[10px] font-mono text-[#00ff41]/70 uppercase tracking-widest mt-1">
            STATUS: ACTIVE // DATA_LINK: ENCRYPTED // SECTOR: NH-37 CORRIDOR
          </p>
        </div>
      </div>

      {/* Real-time HUD Metrics - Cyber Emerald Style */}
      <div className="flex flex-wrap items-center gap-2 border border-[#1a2e1a] p-1.5 text-xs bg-[#060806]">
        {/* Active Threats */}
        <div className="flex items-center space-x-2 px-3 py-1 border-r border-[#1a2e1a]">
          <AlertTriangle className="w-3.5 h-3.5 text-[#ff3e3e]" />
          <div>
            <div className="text-[9px] font-mono uppercase tracking-tighter text-[#88a888]">THREAT_SCAN</div>
            <div className="font-bold font-mono text-xs uppercase text-[#ff3e3e]">
              {activeThreatsCount} CRITICAL
            </div>
          </div>
        </div>

        {/* Dynamic Zone Area */}
        <div className="flex items-center space-x-2 px-3 py-1 border-r border-[#1a2e1a]">
          <Activity className="w-3.5 h-3.5 text-[#00ff41]" />
          <div>
            <div className="text-[9px] font-mono uppercase tracking-tighter text-[#88a888]">BUFFER_FOOTPRINT</div>
            <div className="font-bold font-mono text-xs text-[#00ff41]">
              {eszMode === 'dynamic_amoeba' ? `${totalAreaSqKm} SQ_KM` : eszMode === 'static_10km' ? '314 SQ_KM' : '7.1 SQ_KM'}
            </div>
          </div>
        </div>

        {/* Active State Badge */}
        <div className="flex items-center space-x-2 px-3 py-1">
          <Radio className="w-3.5 h-3.5 text-[#00ff41]" />
          <div>
            <div className="text-[9px] font-mono uppercase tracking-tighter text-[#88a888]">SYSTEM_MODE</div>
            <div className="font-bold font-mono text-xs uppercase text-[#e0f2e0]">
              {eszMode === 'dynamic_amoeba' ? 'D-ESZ AMOEBA' : eszMode === 'static_10km' ? 'STATIC 10KM' : 'STATIC 1KM'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls - Cyber Emerald Buttons */}
      <div className="flex items-center space-x-2">
        {/* Simulation toggle */}
        <button
          onClick={onToggleSimulation}
          className={`px-3 py-1.5 border border-[#00ff41] font-header font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer ${
            isSimulating
              ? 'bg-[#00ff41] text-black'
              : 'bg-black text-[#00ff41] hover:bg-[#00ff41] hover:text-black'
          }`}
          title="Simulate Real-time Elephant Herd Migration"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isSimulating ? 'PAUSE HERD' : 'SIMULATE HERD'}</span>
        </button>

        {/* Reset Threats */}
        <button
          onClick={onResetThreats}
          className="p-1.5 border border-[#1a2e1a] bg-black hover:border-[#00ff41] text-[#00ff41] transition-all cursor-pointer"
          title="Clear Active Threat Triggers"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Firestore DB Inspector */}
        <button
          onClick={onOpenFirestore}
          className="px-3 py-1.5 border border-[#1a2e1a] hover:border-[#00ff41] bg-black text-[#e0f2e0] hover:text-[#00ff41] font-header font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-[#00ff41]" />
          <span>FIRESTORE DB</span>
        </button>

        {/* Gemini AI Policy Report */}
        <button
          onClick={onOpenAIReport}
          className="px-3 py-1.5 bg-[#00ff41] text-black font-header font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-[#00e038] transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,65,0.3)]"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI_GEMINI</span>
        </button>
      </div>
    </header>
  );
};

