import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, Popup } from 'react-leaflet';
import { ShieldAlert, Maximize2, Minimize2, Crosshair, Activity, Radio, AlertTriangle } from 'lucide-react';

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

// Generate realistic fluctuating anomalies
const generateInitialAnomalies = () => [
  { id: 'ANOM-01', lat: -8.4116, lng: 116.4578, temp: 85.4, status: 'high', name: 'Pos 3 - Sabana' },
  { id: 'ANOM-02', lat: -8.3890, lng: 116.4320, temp: 56.1, status: 'medium', name: 'Danau Segara Anak' },
  { id: 'ANOM-03', lat: -8.4350, lng: 116.4700, temp: 42.5, status: 'low', name: 'Pelawangan Sembalun' },
  { id: 'ANOM-04', lat: -8.4021, lng: 116.4812, temp: 92.1, status: 'high', name: 'Puncak Rinjani' },
];

export default function PetaLive() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeStr, setTimeStr] = useState('');
  const [anomalies, setAnomalies] = useState(generateInitialAnomalies());
  const [scanRot, setScanRot] = useState(0);

  // Time & Value Jitter Simulation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${Math.floor(now.getMilliseconds() / 100).toString()}`);
    };
    
    // Fast interval for radar and time
    const fastInterval = setInterval(() => {
      updateTime();
      setScanRot(prev => (prev + 3) % 360);
    }, 50);

    // Slower interval for temp fluctuation
    const slowInterval = setInterval(() => {
      setAnomalies(prev => prev.map(a => {
        let newTemp = a.temp + (Math.random() * 2 - 1);
        if (newTemp < 30) newTemp = 30;
        let newStatus = a.status;
        if (newTemp > 75) newStatus = 'high';
        else if (newTemp > 50) newStatus = 'medium';
        else newStatus = 'low';
        
        return { ...a, temp: newTemp, status: newStatus };
      }));
    }, 1500);

    return () => {
      clearInterval(fastInterval);
      clearInterval(slowInterval);
    }
  }, []);

  return (
    <div className={`h-full w-full flex flex-col gap-4 text-slate-200 ${isFullscreen ? 'fixed inset-0 z-[200] bg-[#0f172a] p-4 sm:p-8' : ''}`}>
      <div className={`flex-1 bg-[#1e293b] rounded-xl p-0 flex flex-col shadow-2xl border border-slate-700/50 relative overflow-hidden ${isFullscreen ? 'h-full border-none' : ''}`}>
        
        {/* TOP COMMAND BAR */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0f172a]/90 to-transparent z-[500] flex justify-between items-start px-4 md:px-6 pt-4 pointer-events-none">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-red-500/20 border border-red-500/50 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]">
               <Radio className="w-5 h-5 text-red-500" />
             </div>
             <div>
               <h2 className="text-sm md:text-base font-bold uppercase text-red-400 tracking-widest drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">SAT-LINK: ACTIVE (LIVE)</h2>
               <p className="text-[10px] font-mono text-green-400 tracking-[0.2em]">{timeStr} UTC+8</p>
             </div>
          </div>
          <div className="pointer-events-auto">
             <button 
               onClick={() => setIsFullscreen(!isFullscreen)}
               className="p-2 bg-slate-900/80 hover:bg-slate-800 rounded-lg transition-colors border border-slate-700 backdrop-blur-md"
               title={isFullscreen ? 'Minimize Viewer' : 'Maximize Viewer'}
             >
               {isFullscreen ? <Minimize2 className="w-5 h-5 text-slate-300" /> : <Maximize2 className="w-5 h-5 text-slate-300" />}
             </button>
          </div>
        </div>

        {/* MAP CONTAINER */}
        <div className="w-full h-full relative bg-[#0f172a]">
          <MapContainer center={[-8.4116, 116.4578]} zoom={12} style={{ height: '100%', width: '100%', background: '#0f172a' }} zoomControl={false} attributionControl={false}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <MapUpdater center={[-8.4116, 116.4578]} zoom={12} />
            
            {anomalies.map((anom) => {
               const color = anom.status === 'high' ? '#ef4444' : anom.status === 'medium' ? '#f59e0b' : '#3b82f6';
               
               return (
                 <React.Fragment key={anom.id}>
                   <CircleMarker 
                     center={[anom.lat, anom.lng]} 
                     pathOptions={{ color: color, fillColor: color, fillOpacity: 0.1 + (Math.random() * 0.1), weight: 0 }} 
                     radius={anom.status === 'high' ? 50 + (Math.random() * 10) : 30 + (Math.random() * 5)} 
                   />
                   <CircleMarker 
                     center={[anom.lat, anom.lng]} 
                     pathOptions={{ color: color, fillColor: color, fillOpacity: Math.random() > 0.5 ? 0.8 : 0.4, weight: 2 }} 
                     radius={anom.status === 'high' ? 15 : 10} 
                   >
                      <Popup className="custom-popup" closeButton={false}>
                        <div className="bg-[#0f172a] border border-slate-700 p-3 rounded shadow-2xl min-w-[180px]">
                           <div className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${anom.status === 'high' ? 'text-red-400' : anom.status === 'medium' ? 'text-orange-400' : 'text-blue-400'}`}>
                             {anom.id}
                           </div>
                           <div className="text-white font-mono text-sm mb-2 truncate">{anom.name}</div>
                           <div className="flex justify-between items-center bg-slate-900 p-2 rounded">
                             <Activity className={`w-4 h-4 ${anom.status === 'high' ? 'text-red-500' : 'text-orange-500'}`} />
                             <span className="font-mono font-bold text-lg text-white">{anom.temp.toFixed(1)}°C</span>
                           </div>
                        </div>
                      </Popup>
                   </CircleMarker>
                 </React.Fragment>
               )
            })}
          </MapContainer>

          {/* STRIPED OVERLAY / CRT SCANLINE */}
          <div className="absolute inset-0 pointer-events-none z-[400] mix-blend-screen opacity-10" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.4) 3px, rgba(34, 197, 94, 0.4) 3px)' }}></div>
          
          <div className="absolute inset-0 pointer-events-none z-[402] overflow-hidden flex items-center justify-center">
            {/* The spinning radar wedge */}
            <div 
              className="w-[150vw] h-[150vw] rounded-full absolute opacity-30 shadow-[0_0_100px_rgba(34,197,94,0.2)_inset] hidden md:block" 
              style={{
                background: 'conic-gradient(from 0deg, transparent 70%, rgba(34, 197, 94, 0.1) 95%, rgba(34, 197, 94, 0.5) 100%)',
                transform: `rotate(${scanRot}deg)`
              }}
            ></div>
            
            {/* Crosshairs & Radar Circles */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-green-500/30 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
            <div className="absolute inset-y-0 left-1/2 w-px bg-green-500/30 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
            
            <div className="w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] border border-green-500/10 rounded-full flex items-center justify-center absolute"></div>
            <div className="w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] border border-green-500/20 rounded-full flex items-center justify-center absolute"></div>
            <div className="w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] border border-green-500/30 rounded-full flex items-center justify-center absolute">
              <div className="w-[20vw] h-[20vw] max-w-[200px] max-h-[200px] border border-green-500/40 rounded-full flex items-center justify-center">
                 <div className="w-4 h-4 text-green-500"><Crosshair className="w-full h-full" /></div>
              </div>
            </div>
          </div>

          {/* HUD CORNERS */}
          <div className="absolute inset-4 pointer-events-none z-[401] border-2 border-slate-700/50 rounded-xl">
             <div className="absolute top-[-2px] left-[-2px] w-6 h-6 border-t-4 border-l-4 border-slate-300/70 rounded-tl-xl"></div>
             <div className="absolute top-[-2px] right-[-2px] w-6 h-6 border-t-4 border-r-4 border-slate-300/70 rounded-tr-xl"></div>
             <div className="absolute bottom-[-2px] left-[-2px] w-6 h-6 border-b-4 border-l-4 border-slate-300/70 rounded-bl-xl"></div>
             <div className="absolute bottom-[-2px] right-[-2px] w-6 h-6 border-b-4 border-r-4 border-slate-300/70 rounded-br-xl"></div>
          </div>

          {/* TELEMETRY HUD (LEFT) */}
          <div className="absolute top-20 left-4 md:left-6 bottom-6 w-52 md:w-64 flex flex-col gap-3 z-[403] pointer-events-none">
            
            <div className="bg-[#0f172a]/80 backdrop-blur-md border border-slate-700/80 rounded-lg p-3 pointer-events-auto">
               <h3 className="text-[10px] font-mono text-slate-400 tracking-widest uppercase mb-2 border-b border-slate-700 pb-1">Telemetry Sensor</h3>
               <div className="flex flex-col gap-2">
                 {anomalies.map(anom => (
                   <div key={anom.id} className="flex justify-between items-center group cursor-pointer hover:bg-slate-800/50 p-1 rounded">
                     <span className={`text-[10px] md:text-xs font-mono truncate mr-2 ${anom.status === 'high' ? 'text-red-400' : anom.status === 'medium' ? 'text-orange-400' : 'text-blue-400'}`}>
                       [{anom.id.split('-')[1]}] {anom.name}
                     </span>
                     <span className={`text-[10px] md:text-xs font-mono font-bold w-10 text-right ${anom.status === 'high' ? 'text-red-500' : 'text-slate-300'}`}>
                       {anom.temp.toFixed(1)}°
                     </span>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-red-900/30 backdrop-blur-md border border-red-500/40 rounded-lg p-3 pointer-events-auto mt-auto shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-[10px] md:text-xs font-bold text-red-400 tracking-widest">CRITICAL TARGETS</span>
              </div>
              <p className="text-[9px] md:text-[10px] font-mono text-red-300/80">
                 {anomalies.filter(a => a.status === 'high').length} ACTIVE HOTSPOTS DETECTED EXCEEDING 75.0°C THRESHOLD. IMMEDIATE INTERVENTION SUGGESTED.
              </p>
            </div>

          </div>

          {/* METRICS HUD (BOTTOM RIGHT) */}
          <div className="hidden md:flex absolute bottom-6 right-6 z-[403] bg-[#0f172a]/80 backdrop-blur-md border border-slate-700/80 rounded-lg p-3 pointer-events-auto flex-col gap-1 items-end min-w-[150px]">
             <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Coordinates</span>
             <span className="text-xs font-mono text-green-400 font-bold tracking-wider">LAT -8.4116</span>
             <span className="text-xs font-mono text-green-400 font-bold tracking-wider">LNG 116.4578</span>
             <div className="h-px w-full bg-slate-700 my-1"></div>
             <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Elevation</span>
             <span className="text-xs font-mono text-slate-300 font-bold tracking-wider">3,726 M</span>
             <div className="h-px w-full bg-slate-700 my-1"></div>
             <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">Coverage</span>
             <span className="text-xs font-mono text-slate-300 font-bold tracking-wider">41,330 HA</span>
          </div>

        </div>
      </div>
    </div>
  );
}
