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
    <aside className="w-full md:w-80 bg-black border-r-2 border-white p-4 text-white overflow-y-auto flex flex-col gap-4 z-10 shrink-0 font-mono">
      {/* 1. ESZ State Mode Controls - Bento Box */}
      <section className="bg-black border-2 border-white p-3.5">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-white border-b border-white/30 pb-2">
          <Layers className="w-4 h-4 text-white" />
          <span>1. ESZ State Selector</span>
        </div>

        <div className="flex flex-col gap-2">
          {/* Static 10km */}
          <button
            onClick={() => onSelectESZMode('static_10km')}
            className={`p-3 border text-left transition-all relative ${
              eszMode === 'static_10km'
                ? 'bg-white text-black border-2 border-white font-bold'
                : 'bg-black border-white/50 text-gray-300 hover:border-white hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wide">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 border border-current bg-white"></span>
                Static 10 km Default
              </span>
              {eszMode === 'static_10km' && <ChevronRight className="w-4 h-4" />}
            </div>
            <p className={`text-[10px] mt-1.5 leading-snug ${eszMode === 'static_10km' ? 'text-black/80' : 'text-gray-400'}`}>
              Rigid 10 km circular boundary (314 sq km). Restricts village agriculture regardless of animal presence.
            </p>
          </button>

          {/* Static 1km */}
          <button
            onClick={() => onSelectESZMode('static_1km')}
            className={`p-3 border text-left transition-all relative ${
              eszMode === 'static_1km'
                ? 'bg-white text-black border-2 border-white font-bold'
                : 'bg-black border-white/50 text-gray-300 hover:border-white hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wide">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 border border-current bg-white"></span>
                Static 1 km Proposed
              </span>
              {eszMode === 'static_1km' && <ChevronRight className="w-4 h-4" />}
            </div>
            <p className={`text-[10px] mt-1.5 leading-snug ${eszMode === 'static_1km' ? 'text-black/80' : 'text-gray-400'}`}>
              Tight 1.5 km circle. Leaves vital NH-37 migratory corridors completely unprotected during flood migrations.
            </p>
          </button>

          {/* Dynamic Amoeba D-ESZ */}
          <button
            onClick={() => onSelectESZMode('dynamic_amoeba')}
            className={`p-3 border text-left transition-all relative ${
              eszMode === 'dynamic_amoeba'
                ? 'bg-white text-black border-2 border-white font-bold'
                : 'bg-black border-white/50 text-gray-300 hover:border-white hover:text-white'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-xs uppercase tracking-wide">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-black animate-ping"></span>
                Dynamic Corridor (D-ESZ)
              </span>
              {eszMode === 'dynamic_amoeba' && <ChevronRight className="w-4 h-4" />}
            </div>
            <p className={`text-[10px] mt-1.5 leading-snug ${eszMode === 'dynamic_amoeba' ? 'text-black/80' : 'text-gray-400'}`}>
              Amoeba-like Concave Hull boundary warping in real time to envelop active animal herds along NH-37 corridors.
            </p>
          </button>
        </div>
      </section>

      {/* 2. Animal Activity Density Filter Slider - Bento Box */}
      <section className="bg-black border-2 border-white p-3.5">
        <div className="flex items-center justify-between mb-2 border-b border-white/30 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <Sliders className="w-4 h-4 text-white" />
            <span>Density Filter</span>
          </div>
          <span className="font-mono font-bold text-xs bg-white text-black px-1.5 py-0.5">
            {densityFilter}%
          </span>
        </div>

        <p className="text-[10px] text-gray-400 mb-3 leading-tight uppercase">
          Filter active wildlife clusters and refine boundary resolution threshold.
        </p>

        <input
          type="range"
          min="0"
          max="80"
          step="5"
          value={densityFilter}
          onChange={(e) => onDensityFilterChange(Number(e.target.value))}
          className="w-full accent-white bg-gray-800 h-2 cursor-pointer"
        />

        <div className="flex justify-between text-[9px] text-gray-400 font-mono mt-2 uppercase">
          <span>0% (All)</span>
          <span>40% (Med)</span>
          <span>80% (Critical)</span>
        </div>
      </section>

      {/* 3. Wildlife Pathway Toggles - Bento Box */}
      <section className="bg-black border-2 border-white p-3.5">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-white border-b border-white/30 pb-2">
          <Compass className="w-4 h-4 text-white" />
          <span>Corridor Pathways</span>
        </div>

        <div className="flex flex-col gap-2 text-xs uppercase">
          {/* Active Movement Pathways */}
          <label className="flex items-center justify-between p-2 border border-white/60 bg-black hover:border-white cursor-pointer transition-all">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 bg-white"></span>
              <span className="font-bold text-gray-200">Active Passages</span>
            </div>
            <input
              type="checkbox"
              checked={showActivePathways}
              onChange={(e) => onToggleActivePathways(e.target.checked)}
              className="w-4 h-4 accent-white cursor-pointer"
            />
          </label>

          {/* Historical Movement Pathways */}
          <label className="flex items-center justify-between p-2 border border-white/60 bg-black hover:border-white cursor-pointer transition-all">
            <div className="flex items-center gap-2">
              <span className="w-3 h-1 border-b-2 border-dashed border-white"></span>
              <span className="font-bold text-gray-200">Historical Routes</span>
            </div>
            <input
              type="checkbox"
              checked={showHistoricalPathways}
              onChange={(e) => onToggleHistoricalPathways(e.target.checked)}
              className="w-4 h-4 accent-white cursor-pointer"
            />
          </label>
        </div>
      </section>

      {/* 4. Sensor Marker Type Filters - Bento Box */}
      <section className="bg-black border-2 border-white p-3.5">
        <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-white border-b border-white/30 pb-2">
          <MapPin className="w-4 h-4 text-white" />
          <span>AI Sensor Filters</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs uppercase">
          <button
            onClick={() => onSensorFilterChange('all')}
            className={`p-2 border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
              sensorFilter === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-black text-white border-white/50 hover:border-white'
            }`}
          >
            <span>All</span>
          </button>

          <button
            onClick={() => onSensorFilterChange('camera_trap')}
            className={`p-2 border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
              sensorFilter === 'camera_trap'
                ? 'bg-white text-black border-white'
                : 'bg-black text-white border-white/50 hover:border-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Cam</span>
          </button>

          <button
            onClick={() => onSensorFilterChange('acoustic_sensor')}
            className={`p-2 border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
              sensorFilter === 'acoustic_sensor'
                ? 'bg-white text-black border-white'
                : 'bg-black text-white border-white/50 hover:border-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Sound</span>
          </button>

          <button
            onClick={() => onSensorFilterChange('seismic_sensor')}
            className={`p-2 border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
              sensorFilter === 'seismic_sensor'
                ? 'bg-white text-black border-white'
                : 'bg-black text-white border-white/50 hover:border-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Seismic</span>
          </button>
        </div>
      </section>

      {/* 5. Quick Test Event Triggers - Bento Box */}
      <section className="bg-black border-2 border-white p-3.5">
        <div className="flex items-center justify-between mb-2 border-b border-white/30 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
            <Zap className="w-4 h-4 text-white" />
            <span>Manual Threat Trigger</span>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 mb-3 leading-snug uppercase">
          Simulate live camera / acoustic detection on NH-37 crossing corridors.
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onTriggerSensorEvent('cam-01')}
            className="w-full py-2 px-3 bg-black hover:bg-white hover:text-black border border-white text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Panbari Crossing
            </span>
            <span className="text-[9px] bg-white text-black px-1 py-0.5 font-bold">TRIGGER</span>
          </button>

          <button
            onClick={() => onTriggerSensorEvent('cam-02')}
            className="w-full py-2 px-3 bg-black hover:bg-white hover:text-black border border-white text-white text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Kanchanjuri Corridor
            </span>
            <span className="text-[9px] bg-white text-black px-1 py-0.5 font-bold">TRIGGER</span>
          </button>
        </div>
      </section>

      {/* Legend Info Box */}
      <div className="p-3 border border-white/40 bg-black text-[10px] text-gray-300 flex items-start gap-2 uppercase">
        <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong className="text-white">Note:</strong> Stark white boundaries maximize visibility on high-resolution GIS satellite maps.
        </p>
      </div>
    </aside>
  );
};

