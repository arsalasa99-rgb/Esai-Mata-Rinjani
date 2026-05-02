import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';

// Utility to generate random fluctuation
const fluctuate = (val: number, range: number) => val + (Math.random() * range * 2 - range);

const initialAnomalies = [
  {
    id: 1,
    location: 'Pos 3 - Sabana',
    lat: -8.4219,
    lng: 116.4578,
    temp: 78.6,
    time: '20 Mei 2024 10:30 WIB',
    area: 2.4, // float
    risk: 'TINGGI',
    status: 'high',
    graphData: [ {time: '06:00', temp: 50}, {time: '09:00', temp: 58}, {time: '10:30', temp: 78.6}, {time: '12:00', temp: 65}, {time: '15:00', temp: 55}, {time: '18:00', temp: 48} ]
  },
  {
    id: 2,
    location: 'Pos 2 - Sabana',
    lat: -8.4410,
    lng: 116.4450,
    temp: 54.2,
    time: '20 Mei 2024 08:15 WIB',
    area: 1.1,
    risk: 'SEDANG',
    status: 'medium',
    graphData: [ {time: '06:00', temp: 40}, {time: '08:15', temp: 54.2}, {time: '10:30', temp: 50}, {time: '12:00', temp: 45}, {time: '15:00', temp: 42}, {time: '18:00', temp: 38} ]
  },
  {
    id: 3,
    location: 'Jalur Senaru',
    lat: -8.3800,
    lng: 116.4200,
    temp: 42.1,
    time: '20 Mei 2024 06:00 WIB',
    area: 0.5,
    risk: 'RENDAH',
    status: 'low',
    graphData: [ {time: '06:00', temp: 42.1}, {time: '09:00', temp: 38}, {time: '10:30', temp: 35}, {time: '12:00', temp: 36}, {time: '15:00', temp: 33}, {time: '18:00', temp: 30} ]
  }
];

// Map Updater Component
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [anomalies, setAnomalies] = useState(initialAnomalies);
  const [selectedId, setSelectedId] = useState(1);
  const [center, setCenter] = useState<[number, number]>([-8.411, 116.45]);
  const [zoom, setZoom] = useState(13);

  // Real-time Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAnomalies(prev => prev.map(a => {
        const newTemp = Math.max(30, fluctuate(a.temp, 2)); // 2 degree fluctuation
        const newArea = Math.max(0.1, a.area + (a.status === 'high' ? Math.random() * 0.05 : a.status === 'medium' ? Math.random() * 0.02 : 0));
        
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        
        let newGraphData = [...a.graphData];
        // every 5 ticks, add a point if we want, or just update the last point to make it feel "live"
        newGraphData[newGraphData.length - 1] = { time: timeStr, temp: parseFloat(newTemp.toFixed(1)) };

        let newStatus = a.status;
        let newRisk = a.risk;
        if (newTemp > 70) { newStatus = 'high'; newRisk = 'TINGGI'; }
        else if (newTemp > 50) { newStatus = 'medium'; newRisk = 'SEDANG'; }
        else { newStatus = 'low'; newRisk = 'RENDAH'; }

        return {
          ...a,
          temp: parseFloat(newTemp.toFixed(1)),
          area: parseFloat(newArea.toFixed(2)),
          time: `Hari ini ${timeStr} WITA`,
          graphData: newGraphData,
          status: newStatus,
          risk: newRisk,
        };
      }));
    }, 2000); // UI updates every 2 seconds for a realistic simulation

    return () => clearInterval(interval);
  }, []);

  const selectedAnomaly = anomalies.find(a => a.id === selectedId) || anomalies[0];

  const handleSelect = (anom: typeof anomalies[0]) => {
    setSelectedId(anom.id);
    setCenter([anom.lat, anom.lng]);
    setZoom(15);
  };

  return (
    <div className="min-h-full md:h-full w-full flex flex-col md:flex-row gap-4 text-slate-200">
      
      {/* Left Column (Map & Notifications) */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        
        {/* Map Section */}
        <div className="h-[400px] md:flex-[1.5] md:h-auto bg-[#1e293b] rounded-xl p-4 flex flex-col shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-slate-700/50">
           <div className="flex justify-between items-center mb-3">
             <h2 className="text-sm font-bold uppercase text-slate-200 tracking-wide flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
               Peta Satelit Radar Titik Panas
             </h2>
             <div className="text-[10px] font-mono bg-slate-800 text-green-400 px-2 py-1 rounded border border-slate-700">LIVE FEED</div>
           </div>
           
           <div className="flex-1 rounded-lg border border-slate-600/50 relative overflow-hidden bg-slate-900 z-10">
             <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', background: '#0f172a' }} zoomControl={false} attributionControl={false}>
               {/* Esri World Imagery TileLayer for Free High-Quality Satellite Map */}
               <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
               <MapUpdater center={center} zoom={zoom} />
               
               {/* Markers */}
               {anomalies.map((anom) => {
                 const isSelected = anom.id === selectedId;
                 const markerColor = anom.status === 'high' ? '#ef4444' : anom.status === 'medium' ? '#f59e0b' : '#3b82f6';
                 
                 return (
                   <React.Fragment key={anom.id}>
                     {/* The glowing / radiating heat pulse effect */}
                     <CircleMarker 
                       center={[anom.lat, anom.lng]} 
                       pathOptions={{ color: markerColor, fillColor: markerColor, fillOpacity: 0.15 + (Math.random() * 0.1), weight: 0 }} 
                       radius={isSelected ? 40 + (Math.random() * 10) : 20} 
                     />
                     <CircleMarker 
                       center={[anom.lat, anom.lng]} 
                       pathOptions={{ color: markerColor, fillColor: markerColor, fillOpacity: 0.4, weight: 1 }} 
                       radius={isSelected ? 15 : 8} 
                       eventHandlers={{
                         click: () => handleSelect(anom)
                       }}
                     >
                       {isSelected && (
                         <Popup className="custom-popup" closeButton={false}>
                           <div className="w-[200px] bg-slate-900 rounded-lg p-3 shadow-2xl text-slate-200 border border-slate-700 font-sans">
                             <h3 className={`font-bold text-xs mb-2 uppercase ${anom.status === 'high' ? 'text-red-400' : anom.status === 'medium' ? 'text-orange-400' : 'text-blue-400'}`}>
                               {anom.risk === 'TINGGI' ? 'ALERT: Titik Panas' : 'Peringatan Titik'} 
                             </h3>
                             <div className="grid grid-cols-[60px_1fr] gap-y-1 text-[10px] mb-3 text-slate-300">
                               <span className="font-semibold text-slate-400">Lokasi</span> <span>{anom.location}</span>
                               <span className="font-semibold text-slate-400">Temp</span> <span className="text-white font-bold font-mono">{anom.temp}°C</span>
                               <span className="font-semibold text-slate-400">Update</span> <span>{anom.time.split(' ')[2]}</span>
                             </div>
                             <button 
                               onClick={() => navigate('/forensics')}
                               className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-1.5 rounded text-[10px] border border-slate-600 transition-colors cursor-pointer text-center block"
                             >
                               ANALISIS FORENSIK
                             </button>
                           </div>
                         </Popup>
                       )}
                     </CircleMarker>
                   </React.Fragment>
                 );
               })}
             </MapContainer>
             
             {/* Reticle / Radar CSS Overlay */}
             <div className="absolute inset-x-0 top-1/2 h-px bg-green-500/10 pointer-events-none z-[400]"></div>
             <div className="absolute inset-y-0 left-1/2 w-px bg-green-500/10 pointer-events-none z-[400]"></div>
             
             {/* Recenter Button */}
             <button 
               onClick={() => { setCenter([-8.411, 116.45]); setZoom(12); }}
               className="absolute top-4 right-4 bg-slate-900/90 border border-slate-700 p-2 rounded-md shadow-lg z-[400] cursor-pointer hover:bg-slate-800 text-slate-300 transition-colors" 
               title="Recenter Map"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l4-4 4 4"/><path d="M9 5v14"/></svg>
             </button>
           </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-[#1e293b] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col border border-slate-700/50 md:flex-1 h-[250px] md:h-auto">
          <div className="flex justify-between items-center mb-3">
             <h2 className="text-sm font-bold uppercase text-slate-200 tracking-wide">Log Sensor Real-Time</h2>
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
            {anomalies.sort((a,b) => b.temp - a.temp).map((anom) => (
              <div 
                key={anom.id}
                onClick={() => handleSelect(anom)}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedId === anom.id 
                    ? 'ring-1 ring-white/50' 
                    : 'hover:bg-slate-800'
                } ${
                  anom.status === 'high' ? 'bg-red-900/40 border-red-500/50' :
                  anom.status === 'medium' ? 'bg-orange-900/30 border-orange-500/40' :
                  'bg-blue-900/20 border-blue-500/30'
                }`}
              >
                <div className="flex flex-col gap-1 w-20">
                  <span className={`text-[10px] font-mono tracking-widest ${anom.status === 'high' ? 'text-red-300' : 'text-slate-400'}`}>{anom.time.split(' ')[2]}</span>
                  <span className={`text-xs font-bold font-mono ${anom.status === 'high' ? 'text-red-400' : anom.status === 'medium' ? 'text-orange-400' : 'text-blue-400'}`}>{anom.temp}°C</span>
                </div>
                <div className={`text-xs flex-1 ml-3 border-l pl-3 truncate font-mono ${anom.status === 'high' ? 'text-slate-200 border-red-500/30' : 'text-slate-300 border-slate-600'}`}>
                  {'['}{anom.id}{']'} Deteksi termal di {anom.location} area {anom.area}Ha
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                  anom.status === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                  anom.status === 'medium' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                }`}>
                  {anom.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Info & Graph) */}
      <div className="w-full md:w-[320px] flex flex-col gap-4 min-h-0 shrink-0">
        
        {/* Information Detail */}
        <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col">
          <h2 className="text-sm font-bold mb-4 uppercase text-slate-200 tracking-wide flex justify-between items-center">
            Telemetri Sensor
            {selectedAnomaly.status === 'high' && <span className="flex w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
          </h2>
          
          <div className="space-y-4 flex-1">
            <div className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
              <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Status Sensor</span>
              <span className={`block text-sm font-bold tracking-widest ${
                selectedAnomaly.status === 'high' ? 'text-red-400 animate-pulse' :
                selectedAnomaly.status === 'medium' ? 'text-orange-400' :
                'text-blue-400'
              }`}>
                {selectedAnomaly.status === 'high' ? 'CRITICAL ALERT' : selectedAnomaly.status === 'medium' ? 'WARNING' : 'NORMAL'}
              </span>
            </div>

            <div className="flex gap-4">
               <div className="flex-1">
                 <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Koordinat</span>
                 <span className="block text-xs font-mono text-slate-300">{selectedAnomaly.lat.toFixed(4)}<br/>{selectedAnomaly.lng.toFixed(4)}</span>
               </div>
               <div className="flex-1">
                 <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Area Terdampak</span>
                 <span className="block text-lg font-mono font-bold text-slate-200">{selectedAnomaly.area.toFixed(2)} Ha</span>
               </div>
            </div>

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-700 relative overflow-hidden">
              {selectedAnomaly.status === 'high' && <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>}
              <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1 relative z-10">Suhu Permukaan (IR)</span>
              <div className="flex items-end gap-2 relative z-10">
                <span className={`block text-4xl font-bold font-mono ${
                   selectedAnomaly.status === 'high' ? 'text-red-400 shadow-red-500/50 drop-shadow-md' : 'text-slate-100'
                }`}>{selectedAnomaly.temp.toFixed(1)}</span>
                <span className="text-lg text-slate-500 font-mono mb-1">°C</span>
              </div>
            </div>
            
            <div className="pt-2">
              <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-500 mb-1">Waktu Update</span>
              <span className="block text-xs font-mono text-slate-300">{selectedAnomaly.time}</span>
            </div>
          </div>
        </div>

        {/* Temperature Graph */}
        <div className="flex-1 min-h-[250px] bg-[#1e293b] rounded-xl p-4 border border-slate-700/50 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col">
          <h2 className="text-sm font-bold mb-4 uppercase text-slate-200 tracking-wide flex justify-between">
            Tren Suhu
            <span className="text-[10px] font-mono tracking-widest text-slate-500">LAST 12H</span>
          </h2>
          <div className="flex-1 w-full min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedAnomaly.graphData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}°`}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  ticks={[30, 40, 50, 60, 70, 80]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#f8fafc' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke={selectedAnomaly.status === 'high' ? '#ef4444' : selectedAnomaly.status === 'medium' ? '#f59e0b' : '#3b82f6'} 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: '#0f172a', strokeWidth: 2 }}
                  isAnimationActive={false} // Disable recharts core animation so it doesn't bounce wildly every 2s
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

