import React, { useState } from 'react';
import { Search, Filter, Shield, Activity, Users, X, Database, Radar, ChevronRight } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';

const mockLogs = [
  { id: 'INC-2023-014', date: '2023-08-14 14:02:01.452 WITA', lat: -8.4116, lng: 116.4578, temp: 450.2, dur: '4j 12m', status: 'Sedang Dicek', area: '2.4 Ha' },
  { id: 'INC-2023-011', date: '2023-08-01 09:15:33.100 WITA', lat: -8.4000, lng: 116.4600, temp: 85.1, dur: '12m', status: 'Selesai', area: '0.2 Ha' },
  { id: 'INC-2023-009', date: '2023-07-28 16:45:00.000 WITA', lat: -8.3800, lng: 116.4200, temp: 120.8, dur: '45m', status: 'Arsip', area: '0.8 Ha' },
];

function MiniMap({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  map.setView([lat, lng], 14);
  return null;
}

export default function Forensics() {
  const [selectedIncident, setSelectedIncident] = useState<typeof mockLogs[0] | null>(null);

  return (
    <div className="h-full w-full flex flex-col gap-4 text-slate-200">
      
      <div className="flex-1 bg-[#1e293b] rounded-xl p-0 flex flex-col shadow-2xl border border-slate-700/50 overflow-hidden relative">
        <header className="p-6 border-b border-slate-700/80 bg-slate-900/50 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white m-0 flex items-center gap-3">
            <Database className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Riwayat Deteksi & Analisis</span>
          </h2>
          <span className="text-xs text-slate-500 tracking-[0.2em] font-mono uppercase mt-2 block flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            Tersambung ke Database Taman Nasional
          </span>
        </header>

        {/* Search & Filter Bar */}
        <div className="p-6 pb-2">
          <div className="bg-[#0f172a]/80 backdrop-blur-md p-2 rounded-xl flex flex-col sm:flex-row gap-2 border border-slate-700 shadow-inner">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Cari ID atau Lokasi..." 
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 font-mono placeholder:text-slate-600 rounded-lg"
              />
            </div>
            <div className="h-px w-full sm:h-auto sm:w-px bg-slate-700"></div>
            <button className="px-6 py-2.5 bg-slate-800 border border-slate-600/50 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors shadow-md">
              <Filter className="w-4 h-4 text-blue-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-slate-300">Filter Data</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="px-6 pb-6 flex-1 flex flex-col min-h-0">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden flex-1 flex flex-col shadow-[0_0_20px_rgba(0,0,0,0.5)_inset]">
            <div className="overflow-auto custom-scrollbar flex-1">
              <table className="w-full text-left font-mono text-xs whitespace-nowrap">
                <thead className="bg-slate-800/80 border-b border-slate-700 text-slate-400 uppercase tracking-widest sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 font-semibold">ID Deteksi</th>
                    <th className="px-6 py-4 font-semibold">Waktu (WITA)</th>
                    <th className="px-6 py-4 font-semibold">Koordinat Lokasi</th>
                    <th className="px-6 py-4 font-semibold">Suhu Tertinggi</th>
                    <th className="px-6 py-4 font-semibold">Lama Kejadian</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {mockLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      onClick={() => setSelectedIncident(log)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4 font-bold text-blue-400 group-hover:text-blue-300">{log.id}</td>
                      <td className="px-6 py-4 text-slate-300">{log.date}</td>
                      <td className="px-6 py-4 text-slate-400">{log.lat.toFixed(4)}, {log.lng.toFixed(4)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 bg-slate-900 rounded border ${log.temp > 200 ? 'border-red-500/50 text-red-400' : 'border-orange-500/50 text-orange-400'}`}>
                          {log.temp}°C
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">{log.dur}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-2 px-2 py-1 rounded inline-block text-[10px] uppercase tracking-widest font-bold ${
                          log.status === 'Sedang Dicek' ? 'text-orange-400' : 
                          log.status === 'Selesai' ? 'text-emerald-400' : 
                          'text-slate-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                             log.status === 'Sedang Dicek' ? 'bg-orange-500' : 
                             log.status === 'Selesai' ? 'bg-emerald-500' : 
                             'bg-slate-500'
                          }`}></span>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight className="w-4 h-4 text-slate-600 block group-hover:text-blue-400" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6 bg-[#0f172a]/90 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-5xl h-[85vh] rounded-2xl flex flex-col overflow-hidden border border-slate-600 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-700 bg-slate-900 flex justify-between items-center z-10 shadow-md">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-3 font-mono">
                  <Radar className="w-5 h-5 text-blue-500" /> 
                  <span className="text-blue-400 uppercase tracking-wider">{selectedIncident.id}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-300 text-sm">ANALISIS MENDALAM</span>
                </h3>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="p-2 bg-slate-800 hover:bg-red-500/20 border border-slate-700 hover:border-red-500/50 rounded transition-colors text-slate-400 hover:text-red-400 group"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0f172a]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                
                {/* Left Col: Target Area & Chronology */}
                <div className="space-y-6 flex flex-col h-full">
                  <div className="bg-slate-900 border border-slate-700 p-4 flex flex-col h-1/2 relative overflow-hidden rounded-xl">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2 z-10">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Data Peta Lokasi
                    </h4>
                    
                    <div className="flex-1 rounded-lg border border-slate-700 relative overflow-hidden bg-slate-950 z-10 p-1">
                      <div className="w-full h-full rounded border border-slate-800 overflow-hidden relative">
                        <MapContainer center={[selectedIncident.lat, selectedIncident.lng]} zoom={14} style={{ height: '100%', width: '100%', background: '#0f172a' }} zoomControl={false} attributionControl={false}>
                          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                          <MiniMap lat={selectedIncident.lat} lng={selectedIncident.lng} />
                          <CircleMarker 
                            center={[selectedIncident.lat, selectedIncident.lng]} 
                            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.3, weight: 1 }} 
                            radius={40} 
                          />
                           <CircleMarker 
                            center={[selectedIncident.lat, selectedIncident.lng]} 
                            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8, weight: 0 }} 
                            radius={5} 
                          />
                        </MapContainer>
                        
                        <div className="absolute inset-0 border-2 border-red-500/30 rounded pointer-events-none z-[400] mix-blend-screen bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>
                        <div className="absolute top-2 left-2 bg-slate-900/80 px-2 py-1 rounded text-[10px] font-mono border border-slate-700 text-slate-300 z-[400] backdrop-blur-sm">
                           LAT: {selectedIncident.lat}<br/>LNG: {selectedIncident.lng}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex-1 flex flex-col">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span> Catatan Waktu Kejadian
                    </h4>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                      
                      <div className="relative pl-6 border-l border-slate-700 pb-2">
                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                        <span className="text-[10px] font-mono text-slate-500 block mb-1">T+00:00:00</span>
                        <div className="text-sm font-mono text-slate-300 bg-slate-800 p-2 rounded border border-slate-700">
                          Titik panas terdeteksi oleh satelit. Pembacaan Suhu: <strong className="text-red-400">{selectedIncident.temp}°C</strong>.
                        </div>
                      </div>
                      
                      <div className="relative pl-6 border-l border-slate-700 pb-2">
                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-orange-500 border-2 border-slate-900"></div>
                        <span className="text-[10px] font-mono text-slate-500 block mb-1">T+00:05:22</span>
                        <div className="text-sm font-mono text-slate-300 bg-slate-800 p-2 rounded border border-slate-700">
                          Perkiraan arah rambatan panas: 0.12Ha/menit. Status naik menjadi 'BAHAYA'.
                        </div>
                      </div>

                      <div className="relative pl-6 border-l border-slate-700 pb-2">
                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500 border-2 border-slate-900"></div>
                        <span className="text-[10px] font-mono text-slate-500 block mb-1">T+00:08:45</span>
                        <div className="text-sm font-mono text-slate-300 bg-slate-800 p-2 rounded border border-slate-700 flex flex-col gap-2">
                          <span>Pesan darurat dikirim ke petugas TNGR.</span>
                          <span className="text-xs text-blue-400 border border-blue-500/30 bg-blue-500/10 px-2 py-1 rounded inline-block w-max">
                             PETUGAS BERANGKAT
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Right Col: Hiker Correlation Data */}
                <div className="space-y-6 flex flex-col h-full">
                  <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl flex-1 flex flex-col shadow-inner">
                    <h4 className="font-mono text-sm uppercase tracking-widest text-slate-200 mb-2 flex items-center gap-3 border-b border-slate-700 pb-4">
                      <Users className="w-5 h-5 text-orange-400" />
                      Data Pendaki Terdekat
                    </h4>
                    
                    <p className="text-xs font-mono text-slate-400 leading-relaxed mb-6 mt-2">
                      Mencari data pendaki di sekitar lokasi (-8.4116, 116.4578) berdasarkan jam kejadian (+/- 120 menit). Akurasi kecocokan data: <strong className="text-green-400">94.2%</strong>.
                    </p>
                    
                    <div className="bg-[#0f172a] border border-orange-500/30 rounded-lg p-5 space-y-4 shadow-[0_0_30px_rgba(249,115,22,0.05)_inset]">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-orange-500 uppercase tracking-widest block mb-1">Rombongan Pendaki Ditemukan</span>
                          <strong className="text-slate-100 text-xl font-mono tracking-wider">GROUP_ID: RNJ-998A</strong>
                        </div>
                        <span className="px-3 py-1.5 bg-red-900/40 text-red-400 text-[10px] uppercase tracking-widest font-bold rounded flex items-center gap-2 border border-red-500/30">
                          <Activity className="w-3 h-3" /> COCOK
                        </span>
                      </div>
                      
                      <div className="font-mono text-sm text-slate-300 bg-slate-900/80 rounded p-4 border border-slate-700/50">
                        <table className="w-full">
                          <tbody>
                            <tr>
                               <td className="py-2 border-b border-slate-800 text-slate-500">Ketua Rombongan</td>
                               <td className="py-2 border-b border-slate-800 text-white font-bold text-right">Budi Santoso</td>
                            </tr>
                            <tr>
                               <td className="py-2 border-b border-slate-800 text-slate-500">Nomor Telepon</td>
                               <td className="py-2 border-b border-slate-800 text-white font-bold text-right tracking-wide">+62 812-3456-7890</td>
                            </tr>
                            <tr>
                               <td className="py-2 border-b border-slate-800 text-slate-500">Pos Lapor Terakhir</td>
                               <td className="py-2 border-b border-slate-800 text-white font-bold text-right">Pos 2 (12:45 WITA)</td>
                            </tr>
                            <tr>
                               <td className="py-2 text-slate-500">Jarak dari Titik Api</td>
                               <td className="py-2 text-white font-bold text-right text-red-400">0.8 km (Sangat Dekat)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      <div className="pt-4 grid grid-cols-2 gap-3">
                        <button className="py-3 bg-blue-600 hover:bg-blue-500 border-none rounded text-[10px] font-bold uppercase tracking-widest text-white transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                          Perintah Evakuasi
                        </button>
                        <button className="py-3 bg-red-900/30 hover:bg-red-900/50 border border-red-500/50 rounded text-[10px] font-bold uppercase tracking-widest text-red-400 transition-colors shadow-inner">
                          Kirim Peringatan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

