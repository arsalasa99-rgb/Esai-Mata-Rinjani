import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Radar, Activity, Target } from 'lucide-react';

const fluctuate = (val: number, range: number) => val + (Math.random() * range * 2 - range);

const initialAnomalies = [
  {
    id: 1,
    location: 'Pos 3 - Sabana',
    lat: -8.4219,
    lng: 116.4578,
    temp: 78.6,
    time: '10:30:11.231',
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
    time: '08:15:02.110',
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
    time: '06:00:00.000',
    area: 0.5,
    risk: 'RENDAH',
    status: 'low',
    graphData: [ {time: '06:00', temp: 42.1}, {time: '09:00', temp: 38}, {time: '10:30', temp: 35}, {time: '12:00', temp: 36}, {time: '15:00', temp: 33}, {time: '18:00', temp: 30} ]
  }
];

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
  const [center, setCenter] = useState<[number, number]>([-8.4116, 116.4578]);
  const [zoom, setZoom] = useState(12);
  const [scanRot, setScanRot] = useState(0);

  useEffect(() => {
    const fastInterval = setInterval(() => {
      setScanRot(prev => (prev + 3) % 360);
    }, 50);

    const interval = setInterval(() => {
      setAnomalies(prev => prev.map(a => {
        const newTemp = Math.max(30, fluctuate(a.temp, 2));
        const newArea = Math.max(0.1, a.area + (a.status === 'high' ? Math.random() * 0.05 : a.status === 'medium' ? Math.random() * 0.02 : 0));
        
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${Math.floor(now.getMilliseconds() / 100).toString()}`;
        
        let newGraphData = [...a.graphData];
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
          timeStr: timeStr,
          graphData: newGraphData,
          status: newStatus,
          risk: newRisk,
        };
      }));
    }, 1500);

    return () => {
      clearInterval(interval);
      clearInterval(fastInterval);
    }
  }, []);

  const selectedAnomaly = anomalies.find(a => a.id === selectedId) || anomalies[0];

  const handleSelect = (anom: typeof anomalies[0]) => {
    setSelectedId(anom.id);
    setCenter([anom.lat, anom.lng]);
    setZoom(15);
  };

  return (
    <div className="min-h-full md:h-full w-full flex flex-col md:flex-row gap-4 text-slate-200 bg-[#0f172a]">
      
      {/* Left Column (Map & Notifications) */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        
        {/* Map Section */}
        <div className="h-[400px] md:flex-[1.5] md:h-auto bg-[#0a0f1d] rounded-xl p-0 flex flex-col shadow-2xl border border-slate-700/80 relative overflow-hidden">
           
           {/* Top Bar */}
           <div className="absolute top-0 inset-x-0 h-14 bg-gradient-to-b from-[#0f172a]/90 to-transparent z-[500] px-4 flex justify-between items-center pointer-events-none">
             <h2 className="text-sm font-bold uppercase text-blue-400 tracking-widest flex items-center gap-2 font-mono drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">
               <Radar className="w-5 h-5 text-blue-500 animate-pulse" />
               Peta Pemantauan
             </h2>
             <div className="text-[10px] font-mono font-bold text-green-400 tracking-[0.2em] border border-green-500/50 bg-green-500/10 px-2 py-1 rounded">LANGSUNG</div>
           </div>
           
           {/* Map Container */}
           <div className="flex-1 relative overflow-hidden bg-[#0f172a] z-10 w-full h-full">
             <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', background: '#0f172a' }} zoomControl={false} attributionControl={false}>
               <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
               <MapUpdater center={center} zoom={zoom} />
               
               {/* Markers */}
               {anomalies.map((anom) => {
                 const isSelected = anom.id === selectedId;
                 const markerColor = anom.status === 'high' ? '#ef4444' : anom.status === 'medium' ? '#f59e0b' : '#3b82f6';
                 
                 return (
                   <React.Fragment key={anom.id}>
                     <CircleMarker 
                       center={[anom.lat, anom.lng]} 
                       pathOptions={{ color: markerColor, fillColor: markerColor, fillOpacity: 0.2 + (Math.random() * 0.1), weight: 0 }} 
                       radius={isSelected ? 50 + (Math.random() * 10) : 30} 
                     />
                     <CircleMarker 
                       center={[anom.lat, anom.lng]} 
                       pathOptions={{ color: markerColor, fillColor: markerColor, fillOpacity: 0.8, weight: 1 }} 
                       radius={isSelected ? 15 : 8} 
                       eventHandlers={{ click: () => handleSelect(anom) }}
                     >
                       {isSelected && (
                         <Popup className="custom-popup" closeButton={false}>
                           <div className="w-[180px] bg-[#0f172a] border border-slate-700 rounded p-3 shadow-2xl text-slate-200 font-mono">
                             <h3 className={`font-bold text-[10px] tracking-widest mb-2 uppercase ${anom.status === 'high' ? 'text-red-400' : anom.status === 'medium' ? 'text-orange-400' : 'text-blue-400'}`}>
                               {anom.risk === 'TINGGI' ? 'TITIK KRITIS' : 'TITIK WASPADA'} 
                             </h3>
                             <div className="space-y-1 text-[10px] mb-3 text-slate-400">
                               <div className="flex justify-between"><span>LOKASI:</span> <span className="text-white truncate max-w-[90px]">{anom.location}</span></div>
                               <div className="flex justify-between"><span>SUHU:</span> <span className="text-white font-bold">{anom.temp}°C</span></div>
                               <div className="flex justify-between"><span>WAKTU:</span> <span>{anom.timeStr || anom.time}</span></div>
                             </div>
                             <button 
                               onClick={() => navigate('/forensics')}
                               className="w-full bg-slate-800 hover:bg-slate-700 text-blue-400 font-bold py-1.5 rounded text-[9px] border border-slate-600 transition-colors cursor-pointer text-center tracking-widest uppercase block shadow-[0_0_10px_rgba(37,99,235,0.2)]"
                             >
                               LIHAT DETAIL [{'>'}]
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
             <div className="absolute inset-0 pointer-events-none z-[400] mix-blend-screen opacity-20" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.4) 3px, rgba(34, 197, 94, 0.4) 3px)' }}></div>
             <div className="absolute inset-y-0 left-1/2 w-px bg-green-500/20 pointer-events-none z-[400] shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
             <div className="absolute inset-x-0 top-1/2 h-px bg-green-500/20 pointer-events-none z-[400] shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
             
             {/* Scan Wipe */}
             <div className="absolute inset-0 z-[401] pointer-events-none overflow-hidden flex items-center justify-center">
                 <div 
                  className="w-[150vw] h-[150vw] rounded-full absolute opacity-20 hidden md:block" 
                  style={{
                    background: 'conic-gradient(from 0deg, transparent 70%, rgba(34, 197, 94, 0.1) 95%, rgba(34, 197, 94, 0.4) 100%)',
                    transform: `rotate(${scanRot}deg)`
                  }}
                 ></div>
             </div>
             
             {/* Recenter Button */}
             <button 
               onClick={() => { setCenter([-8.4116, 116.4578]); setZoom(12); }}
               className="absolute top-16 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-2 rounded shadow-lg z-[400] cursor-pointer hover:bg-slate-800 text-slate-300 transition-colors" 
               title="Pusatkan Peta"
             >
               <Target className="w-5 h-5 text-slate-400" />
             </button>
           </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-[#0a0f1d] rounded-xl p-0 shadow-2xl flex flex-col border border-slate-700/80 md:flex-1 h-[250px] md:h-auto overflow-hidden">
          <div className="bg-slate-900 border-b border-slate-700 p-4">
             <h2 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-widest">Deteksi Terbaru</h2>
          </div>
          <div className="flex flex-col gap-1 overflow-y-auto pr-2 p-4 custom-scrollbar">
            {anomalies.sort((a,b) => b.temp - a.temp).map((anom) => (
              <div 
                key={anom.id}
                onClick={() => handleSelect(anom)}
                className={`flex justify-between items-center p-2.5 rounded border cursor-pointer transition-all font-mono ${
                  selectedId === anom.id 
                    ? 'bg-slate-800 border-slate-500' 
                    : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                   <div className="w-12 text-[10px] text-slate-500">[{anom.timeStr || anom.time}]</div>
                   <div className={`font-bold text-xs w-10 text-right ${anom.status === 'high' ? 'text-red-400' : anom.status === 'medium' ? 'text-orange-400' : 'text-blue-400'}`}>{anom.temp}°</div>
                   <div className="text-[10px] text-slate-300 pl-2 border-l border-slate-700 md:w-48 truncate">{anom.location}</div>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] text-slate-400 hidden md:inline-block">{anom.area} Ha</span>
                   <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${
                     anom.status === 'high' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                     anom.status === 'medium' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' :
                     'bg-blue-500/10 text-blue-500 border-blue-500/30'
                   }`}>
                     {anom.risk}
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Info & Graph) */}
      <div className="w-full md:w-[320px] lg:w-[380px] flex flex-col gap-4 min-h-0 shrink-0">
        
        {/* Information Detail */}
        <div className="bg-[#0a0f1d] rounded-xl p-0 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden">
          
          <div className="bg-slate-900 border-b border-slate-700 p-4">
             <h2 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-widest flex items-center gap-2">
               <Activity className="w-4 h-4 text-slate-400" />
               Detail Lokasi
             </h2>
          </div>
          
          <div className="p-4 space-y-4 flex-1 font-mono">
            
            <div className="bg-slate-900 border border-slate-800 p-3 rounded flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Status Bahaya</span>
              <span className={`text-sm tracking-widest font-bold ${
                selectedAnomaly.status === 'high' ? 'text-red-500 animate-pulse' :
                selectedAnomaly.status === 'medium' ? 'text-orange-500' :
                'text-blue-500'
              }`}>
                {selectedAnomaly.status === 'high' ? 'BAHAYA' : selectedAnomaly.status === 'medium' ? 'WASPADA' : 'AMAN'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 border-b border-slate-800 pb-1">Garis Lintang</span>
                 <span className="block text-xs text-slate-300">{selectedAnomaly.lat.toFixed(4)}</span>
               </div>
               <div>
                 <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1 border-b border-slate-800 pb-1">Garis Bujur</span>
                 <span className="block text-xs text-slate-300">{selectedAnomaly.lng.toFixed(4)}</span>
               </div>
            </div>

            <div className="p-5 bg-slate-900 rounded-lg border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center min-h-[120px]">
              {selectedAnomaly.status === 'high' && <div className="absolute inset-0 bg-red-900/20 animate-pulse"></div>}
              
              <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2 relative z-10">Suhu Permukaan</span>
              
              <div className="flex items-end gap-1 relative z-10 transition-all font-sans tracking-tighter">
                <span className={`text-5xl font-bold ${
                   selectedAnomaly.status === 'high' ? 'text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 
                   selectedAnomaly.status === 'medium' ? 'text-orange-500' : 'text-slate-100'
                }`}>{selectedAnomaly.temp.toFixed(1)}</span>
                <span className="text-xl text-slate-600 mb-2 font-mono">°C</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-2">
               <div>
                 <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Luas Area</span>
                 <span className="block text-sm font-bold text-slate-300">{selectedAnomaly.area.toFixed(2)} Ha</span>
               </div>
               <div className="text-right">
                 <span className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1">Update Terakhir</span>
                 <span className="block text-[10px] text-slate-300">{selectedAnomaly.timeStr || selectedAnomaly.time}</span>
               </div>
            </div>

          </div>
        </div>

        {/* Temperature Graph */}
        <div className="flex-1 min-h-[250px] bg-[#0a0f1d] rounded-xl p-0 border border-slate-700/80 shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-slate-900 border-b border-slate-700 p-3 flex justify-between items-center">
             <h2 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-widest">Grafik Suhu</h2>
             <span className="text-[9px] font-mono tracking-widest text-slate-500">12 JAM TERAKHIR</span>
          </div>
          <div className="flex-1 w-full min-h-0 relative p-4 pl-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedAnomaly.graphData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#475569" 
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  fontFamily="monospace"
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}°`}
                  domain={['dataMin - 10', 'dataMax + 10']}
                  fontFamily="monospace"
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '4px', fontSize: '10px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#64748b', marginBottom: '2px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke={selectedAnomaly.status === 'high' ? '#ef4444' : selectedAnomaly.status === 'medium' ? '#f59e0b' : '#3b82f6'} 
                  strokeWidth={2}
                  dot={{ r: 2, fill: '#0f172a', strokeWidth: 1 }}
                  activeDot={{ r: 4, stroke: '#0f172a', strokeWidth: 2 }}
                  isAnimationActive={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

