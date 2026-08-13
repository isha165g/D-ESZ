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
    <header className="h-auto min-h-[4rem] bg-black border-b-2 border-white px-4 md:px-6 py-3 text-white flex flex-col md:flex-row items-center justify-between gap-4 z-20 font-mono">
      {/* Title & Logo */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 border-2 border-white bg-black flex items-center justify-center font-bold text-white text-sm">
          D
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base md:text-lg tracking-widest font-black uppercase text-white">
              D-ESZ Control Center
            </h1>
            <div className="border border-white px-2 py-0.5 text-[10px] uppercase font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              <span>LIVE GIS</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-tight">
            Sector: Kaziranga-Bokakhat NH-37 Corridor
          </p>
        </div>
      </div>

      {/* Real-time HUD Metrics - Bento Style */}
      <div className="flex flex-wrap items-center gap-2 border border-white p-1.5 text-xs bg-black">
        {/* Active Threats */}
        <div className="flex items-center space-x-2 px-3 py-1 border-r border-white/40">
          <AlertTriangle className="w-3.5 h-3.5 text-white" />
          <div>
            <div className="text-[9px] uppercase tracking-tighter text-gray-400">Threats</div>
            <div className="font-bold text-xs uppercase text-white">
              {activeThreatsCount} Sector{activeThreatsCount !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Dynamic Zone Area */}
        <div className="flex items-center space-x-2 px-3 py-1 border-r border-white/40">
          <Activity className="w-3.5 h-3.5 text-white" />
          <div>
            <div className="text-[9px] uppercase tracking-tighter text-gray-400">Buffer Footprint</div>
            <div className="font-bold text-xs text-white">
              {eszMode === 'dynamic_amoeba' ? `${totalAreaSqKm} sq km` : eszMode === 'static_10km' ? '314 sq km' : '7.1 sq km'}
            </div>
          </div>
        </div>

        {/* Active State Badge */}
        <div className="flex items-center space-x-2 px-3 py-1">
          <Radio className="w-3.5 h-3.5 text-white" />
          <div>
            <div className="text-[9px] uppercase tracking-tighter text-gray-400">Mode</div>
            <div className="font-bold text-xs uppercase text-white">
              {eszMode === 'dynamic_amoeba' ? 'D-ESZ Amoeba' : eszMode === 'static_10km' ? 'Static 10 KM' : 'Static 1 KM'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls - Sharp Bento Buttons */}
      <div className="flex items-center space-x-2">
        {/* Simulation toggle */}
        <button
          onClick={onToggleSimulation}
          className={`px-3 py-1.5 border-2 border-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer ${
            isSimulating
              ? 'bg-white text-black font-black'
              : 'bg-black text-white hover:bg-white hover:text-black'
          }`}
          title="Simulate Real-time Elephant Herd Migration"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isSimulating ? 'Pause Herd' : 'Simulate Herd'}</span>
        </button>

        {/* Reset Threats */}
        <button
          onClick={onResetThreats}
          className="p-1.5 border-2 border-white bg-black hover:bg-white hover:text-black text-white transition-all cursor-pointer"
          title="Clear Active Threat Triggers"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Firestore DB Inspector */}
        <button
          onClick={onOpenFirestore}
          className="px-3 py-1.5 border-2 border-white bg-black hover:bg-white hover:text-black text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Firestore DB</span>
        </button>

        {/* Gemini AI Policy Report */}
        <button
          onClick={onOpenAIReport}
          className="px-3 py-1.5 border-2 border-white bg-white text-black hover:bg-black hover:text-white text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all cursor-pointer"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Gemini AI Policy</span>
        </button>
      </div>
    </header>
  );
};

