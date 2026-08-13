import React from 'react';
import {
  Layers,
  Sliders,
  Compass,
  Camera,
  Volume2,
  Activity,
  Zap,
  Info,
  ChevronRight,
  ShieldAlert,
  MapPin
} from 'lucide-react';
import { ESZMode, SensorType } from '../types';

interface SidebarProps {
  eszMode: ESZMode;
  onSelectESZMode: (mode: ESZMode) => void;
  densityFilter: number;
  onDensityFilterChange: (value: number) => void;
  showActivePathways: boolean;
  onToggleActivePathways: (val: boolean) => void;
  showHistoricalPathways: boolean;
  onToggleHistoricalPathways: (val: boolean) => void;
  sensorFilter: SensorType | 'all';
  onSensorFilterChange: (type: SensorType | 'all') => void;
  onTriggerSensorEvent: (sensorId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  eszMode,
  onSelectESZMode,
  densityFilter,
  onDensityFilterChange,
  showActivePathways,
  onToggleActivePathways,
  showHistoricalPathways,
  onToggleHistoricalPathways,
  sensorFilter,
  onSensorFilterChange,
  onTriggerSensorEvent
}) => {
  return (
    <aside className="w-full md:w-80 bg-[#0a0f0a] border-r-2 border-[#1a2e1a] p-4 text-[#e0f2e0] overflow-y-auto flex flex-col gap-4 z-10 shrink-0 font-mono">
      {/* 1. ESZ State Mode Controls - Cyber Bento Card */}
      <section className="bento-card">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold uppercase tracking-wider text-[#00ff41] border-b border-[#1a2e1a] pb-2">
          <Layers className="w-4 h-4 text-[#00ff41]" />
          <span>SYSTEM_LOGIC_SELECTOR</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Static 10km */}
          <button
            onClick={() => onSelectESZMode('static_10km')}
            className={`p-3 border text-left transition-all relative cursor-pointer ${
              eszMode === 'static_10km'
                ? 'bg-[#00ff41]/10 border-[#00ff41] text-[#00ff41] font-bold'
                : 'bg-black/50 border-[#1a2e1a] text-[#88a888] hover:border-[#00ff41] hover:text-[#e0f2e0]'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wide">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 border border-current bg-[#00ff41]"></span>
                Static 10KM
              </span>
              {eszMode === 'static_10km' && <ChevronRight className="w-4 h-4 text-[#00ff41]" />}
            </div>
            <p className="text-[10px] mt-1.5 leading-snug opacity-80">
              Legacy circular constraint logic (314 sq km).
            </p>
          </button>

          {/* Static 1km */}
          <button
            onClick={() => onSelectESZMode('static_1km')}
            className={`p-3 border text-left transition-all relative cursor-pointer ${
              eszMode === 'static_1km'
                ? 'bg-[#00ff41]/10 border-[#00ff41] text-[#00ff41] font-bold'
                : 'bg-black/50 border-[#1a2e1a] text-[#88a888] hover:border-[#00ff41] hover:text-[#e0f2e0]'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wide">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 border border-current bg-[#00ff41]"></span>
                Static 1KM Proposed
              </span>
              {eszMode === 'static_1km' && <ChevronRight className="w-4 h-4 text-[#00ff41]" />}
            </div>
            <p className="text-[10px] mt-1.5 leading-snug opacity-80">
              Tight 1.5 km circle. Leaves vital NH-37 migratory corridors unprotected.
            </p>
          </button>

          {/* Dynamic Amoeba D-ESZ */}
          <button
            onClick={() => onSelectESZMode('dynamic_amoeba')}
            className={`p-3 border text-left transition-all relative cursor-pointer ${
              eszMode === 'dynamic_amoeba'
                ? 'bg-[#00ff41]/10 border-[#00ff41] text-[#00ff41] font-bold shadow-[0_0_10px_rgba(0,255,65,0.15)]'
                : 'bg-black/50 border-[#1a2e1a] text-[#88a888] hover:border-[#00ff41] hover:text-[#e0f2e0]'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wide">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00ff41] animate-ping"></span>
                D-ESZ Amoeba
              </span>
              {eszMode === 'dynamic_amoeba' && <ChevronRight className="w-4 h-4 text-[#00ff41]" />}
            </div>
            <p className="text-[10px] mt-1.5 leading-snug opacity-80">
              Dynamic hull boundary processing warping in real time.
            </p>
          </button>
        </div>
      </section>

      {/* 2. Boundary Resolution Filter Slider - Cyber Bento Card */}
      <section className="bento-card">
        <div className="flex items-center justify-between mb-2 border-b border-[#1a2e1a] pb-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#00ff41]">
            <Sliders className="w-4 h-4 text-[#00ff41]" />
            <span>BOUNDARY_RESOLUTION</span>
          </div>
          <span className="font-mono font-bold text-xs bg-[#00ff41] text-black px-1.5 py-0.5">
            {densityFilter}%
          </span>
        </div>

        <p className="text-[10px] text-[#88a888] mb-3 leading-tight uppercase font-mono">
          Filter active wildlife clusters and refine hull resolution LOD.
        </p>

        <input
          type="range"
          min="0"
          max="80"
          step="5"
          value={densityFilter}
          onChange={(e) => onDensityFilterChange(Number(e.target.value))}
          className="w-full accent-[#00ff41] bg-[#1a2e1a] h-2 cursor-pointer"
        />

        <div className="flex justify-between text-[9px] text-[#88a888] font-mono mt-2 uppercase">
          <span>LOD_LOW</span>
          <span>LOD_MED</span>
          <span>LOD_ULTRA</span>
        </div>
      </section>

      {/* 3. Wildlife Pathway Toggles - Cyber Bento Card */}
      <section className="bento-card">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold uppercase tracking-wider text-[#00ff41] border-b border-[#1a2e1a] pb-2">
          <Compass className="w-4 h-4 text-[#00ff41]" />
          <span>PATHWAY_CORRIDORS</span>
        </div>

        <div className="flex flex-col gap-2 text-xs uppercase font-mono">
          {/* Active Movement Pathways */}
          <label className="flex items-center justify-between p-2 border border-[#1a2e1a] bg-black hover:border-[#00ff41] cursor-pointer transition-all">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-[#00ff41]"></span>
              <span className="font-bold text-[#e0f2e0]">ACTIVE_PASSAGES</span>
            </div>
            <input
              type="checkbox"
              checked={showActivePathways}
              onChange={(e) => onToggleActivePathways(e.target.checked)}
              className="w-4 h-4 accent-[#00ff41] cursor-pointer"
            />
          </label>

          {/* Historical Movement Pathways */}
          <label className="flex items-center justify-between p-2 border border-[#1a2e1a] bg-black hover:border-[#00ff41] cursor-pointer transition-all">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 border-b-2 border-dashed border-[#d4af37]"></span>
              <span className="font-bold text-[#d4af37]">HISTORIC_ROUTES</span>
            </div>
            <input
              type="checkbox"
              checked={showHistoricalPathways}
              onChange={(e) => onToggleHistoricalPathways(e.target.checked)}
              className="w-4 h-4 accent-[#d4af37] cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* 4. Sensor Marker Type Filters - Cyber Bento Card */}
      <section className="bento-card">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold uppercase tracking-wider text-[#00ff41] border-b border-[#1a2e1a] pb-2">
          <MapPin className="w-4 h-4 text-[#00ff41]" />
          <span>SENSOR_TYPE_FILTERS</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs uppercase font-mono">
          <button
            onClick={() => onSensorFilterChange('all')}
            className={`p-2 border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
              sensorFilter === 'all'
                ? 'bg-[#00ff41] text-black border-[#00ff41]'
                : 'bg-black text-[#e0f2e0] border-[#1a2e1a] hover:border-[#00ff41]'
            }`}
          >
            <span>ALL</span>
          </button>

          <button
            onClick={() => onSensorFilterChange('camera_trap')}
            className={`p-2 border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
              sensorFilter === 'camera_trap'
                ? 'bg-[#00ff41] text-black border-[#00ff41]'
                : 'bg-black text-[#e0f2e0] border-[#1a2e1a] hover:border-[#00ff41]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>CAM</span>
          </button>

          <button
            onClick={() => onSensorFilterChange('acoustic_sensor')}
            className={`p-2 border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
              sensorFilter === 'acoustic_sensor'
                ? 'bg-[#00ff41] text-black border-[#00ff41]'
                : 'bg-black text-[#e0f2e0] border-[#1a2e1a] hover:border-[#00ff41]'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>AUDIO</span>
          </button>

          <button
            onClick={() => onSensorFilterChange('seismic_sensor')}
            className={`p-2 border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
              sensorFilter === 'seismic_sensor'
                ? 'bg-[#00ff41] text-black border-[#00ff41]'
                : 'bg-black text-[#e0f2e0] border-[#1a2e1a] hover:border-[#00ff41]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>SEISMIC</span>
          </button>
        </div>
      </section>

      {/* 5. Manual Threat Triggers - Cyber Bento Card */}
      <section className="bento-card">
        <div className="flex items-center justify-between mb-2 border-b border-[#1a2e1a] pb-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#00ff41]">
            <Zap className="w-4 h-4 text-[#ff3e3e]" />
            <span>MANUAL_THREAT_TRIGGER</span>
          </div>
        </div>

        <p className="text-[10px] text-[#88a888] mb-3 leading-snug uppercase font-mono">
          Simulate live camera/acoustic detection on crossing corridors.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onTriggerSensorEvent('cam-01')}
            className="w-full py-2 px-3 bg-black hover:bg-[#00ff41]/10 border border-[#1a2e1a] hover:border-[#00ff41] text-[#e0f2e0] hover:text-[#00ff41] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-[#ff3e3e]" />
              Panbari Crossing
            </span>
            <span className="text-[9px] bg-[#ff3e3e] text-white px-1.5 py-0.5 font-bold">TRIGGER</span>
          </button>

          <button
            onClick={() => onTriggerSensorEvent('cam-02')}
            className="w-full py-2 px-3 bg-black hover:bg-[#00ff41]/10 border border-[#1a2e1a] hover:border-[#00ff41] text-[#e0f2e0] hover:text-[#00ff41] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-[#ff3e3e]" />
              Kanchanjuri Corridor
            </span>
            <span className="text-[9px] bg-[#ff3e3e] text-white px-1.5 py-0.5 font-bold">TRIGGER</span>
          </button>
        </div>
      </section>

      {/* Legend Info Box */}
      <div className="p-3 border border-[#1a2e1a] bg-[#060806] text-[10px] text-[#88a888] flex items-start gap-2 uppercase font-mono">
        <Info className="w-4 h-4 text-[#00ff41] shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="text-[#00ff41]">NOTE:</strong> CYBER EMERALD STARK BOUNDARIES MAXIMIZE VISIBILITY ON HIGH-RESOLUTION GIS MAPS.
        </p>
      </div>
    </aside>
  );
};

