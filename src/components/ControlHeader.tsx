import React from 'react';
import { Shield, Radio, AlertTriangle, Cpu, Database, Play, Pause, RefreshCw, Activity } from 'lucide-react';
import { ESZMode } from '../types';

interface ControlHeaderProps {
  eszMode: ESZMode;
  activeThreatsCount: number;
  totalAreaSqKm: number;
  isSimulating: boolean;
  simulationSpeed: number;
  onToggleSimulation: () => void;
  onSetSimulationSpeed: (speed: number) => void;
  onResetThreats: () => void;
  onOpenFirestore: () => void;
  onOpenAIReport: () => void;
}

export const ControlHeader: React.FC<ControlHeaderProps> = ({
  eszMode,
  activeThreatsCount,
  totalAreaSqKm,
  isSimulating,
  simulationSpeed,
  onToggleSimulation,
  onSetSimulationSpeed,
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
        {/* Simulation toggle & Speed controls */}
        <div className="flex flex-col items-stretch gap-1">
          <button
            onClick={onToggleSimulation}
            className={`px-3 py-1.5 border border-[#00ff41] font-header font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all cursor-pointer w-full ${
              isSimulating
                ? 'bg-[#00ff41] text-black shadow-[0_0_12px_rgba(0,255,65,0.6)] animate-pulse'
                : 'bg-black text-[#00ff41] hover:bg-[#00ff41] hover:text-black'
            }`}
            title="Simulate Real-time Elephant Herd Migration"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'PAUSE HERD' : 'SIMULATE HERD'}</span>
          </button>

          {/* Speed Toggles under Simulate Herd */}
          <div className="flex items-center justify-between gap-1 bg-black/90 px-1 py-0.5 border border-[#1a2e1a]">
            <span className="text-[8px] font-mono text-[#88a888] uppercase tracking-tighter mr-0.5">SPD:</span>
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => onSetSimulationSpeed(spd)}
                className={`px-1.5 py-0.5 text-[8px] font-mono font-bold border transition-all cursor-pointer ${
                  simulationSpeed === spd
                    ? 'bg-[#00ff41] text-black border-[#00ff41] font-black'
                    : 'bg-black text-[#88a888] border-[#1a2e1a] hover:border-[#00ff41] hover:text-[#00ff41]'
                }`}
                title={`Set simulation speed to ${spd}x`}
              >
                {spd}X
              </button>
            ))}
          </div>
        </div>

        {/* Reset Threats */}
        <button
          onClick={onResetThreats}
          className="p-1.5 border border-[#1a2e1a] bg-black hover:border-[#00ff41] text-[#00ff41] transition-all cursor-pointer self-start h-[31px] flex items-center justify-center"
          title="Reset Herd Positions & Active Threat Triggers"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Firestore DB Inspector */}
        <button
          onClick={onOpenFirestore}
          className="px-3 py-1.5 border border-[#1a2e1a] hover:border-[#00ff41] bg-black text-[#e0f2e0] hover:text-[#00ff41] font-header font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer self-start h-[31px]"
        >
          <Database className="w-3.5 h-3.5 text-[#00ff41]" />
          <span>FIRESTORE DB</span>
        </button>

        {/* Gemini AI Policy Report */}
        <button
          onClick={onOpenAIReport}
          className="px-3 py-1.5 bg-[#00ff41] text-black font-header font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 hover:bg-[#00e038] transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,65,0.3)] self-start h-[31px]"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>AI_GEMINI</span>
        </button>
      </div>
    </header>
  );
};

