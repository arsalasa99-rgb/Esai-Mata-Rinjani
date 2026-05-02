import React, { useState } from 'react';
import { Search, Filter, Shield, Activity, Users, X } from 'lucide-react';

const mockLogs = [
  { id: 'INC-2023-014', date: '2023-08-14 14:02:01.452 WITA', lat: -8.412, lng: 116.457, temp: 450, dur: '4h 12m', status: 'Under Investigation' },
  { id: 'INC-2023-011', date: '2023-08-01 09:15:33.100 WITA', lat: -8.400, lng: 116.460, temp: 85, dur: '12m', status: 'Resolved' },
  { id: 'INC-2023-009', date: '2023-07-28 16:45:00.000 WITA', lat: -8.380, lng: 116.420, temp: 120, dur: '45m', status: 'Archived' },
];

export default function Forensics() {
  const [selectedIncident, setSelectedIncident] = useState<typeof mockLogs[0] | null>(null);

  return (
    <div className="h-full w-full flex flex-col gap-4 text-slate-200">
      
      <div className="flex-1 bg-[#1e293b] rounded-xl p-4 sm:p-6 flex flex-col shadow-lg border border-slate-700/50">
        <header className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white m-0 flex items-center gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            Log Forensik Insiden
          </h2>
          <span className="text-xs text-slate-500 tracking-[0.2em] font-mono uppercase mt-2 block">Juridical Context & Historical Data</span>
        </header>

        {/* Search & Filter Bar */}
        <div className="bg-slate-800 p-4 rounded-xl flex flex-col sm:flex-row gap-4 mb-6 border border-slate-700">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by ID, Location..." 
              className="w-full pl-10 pr-4 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
          <button className="px-4 py-2 bg-[#0f172a] border border-slate-600 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
            <Filter className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-xs uppercase tracking-widest text-slate-300">Filter</span>
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left font-mono text-xs whitespace-nowrap">
              <thead className="bg-[#0f172a] border-b border-slate-700 text-slate-400 uppercase tracking-widest">
                <tr>
                  <th className="px-4 sm:px-6 py-4">Incident ID</th>
                  <th className="px-4 sm:px-6 py-4">Detection Time</th>
                  <th className="px-4 sm:px-6 py-4">Coordinates</th>
                  <th className="px-4 sm:px-6 py-4">Initial Temp</th>
                  <th className="px-4 sm:px-6 py-4">Duration</th>
                  <th className="px-4 sm:px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedIncident(log)}
                    className="border-b border-slate-700 hover:bg-slate-700/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 sm:px-6 py-4 font-bold text-blue-400 group-hover:underline">{log.id}</td>
                    <td className="px-4 sm:px-6 py-4 text-slate-300">{log.date}</td>
                    <td className="px-4 sm:px-6 py-4 text-slate-300">{log.lat}, {log.lng}</td>
                    <td className="px-4 sm:px-6 py-4 text-orange-400">{log.temp}°C</td>
                    <td className="px-4 sm:px-6 py-4 text-slate-300">{log.dur}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className={`px-2 py-1 rounded inline-block text-[10px] uppercase tracking-widest font-bold ${
                        log.status === 'Under Investigation' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 
                        log.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 
                        'bg-slate-700 text-slate-300 border border-slate-600'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0f172a]/80 backdrop-blur-sm">
          <div className="bg-[#1e293b] w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col overflow-hidden border border-slate-600 shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-700 flex justify-between items-center bg-[#0f172a]">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2 sm:gap-3">
                  <Shield className="w-5 h-5 text-blue-400" /> 
                  {selectedIncident.id}
                </h3>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1 block">Forensic Dossier</span>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Col: Thermal Chronology */}
              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-widest text-blue-400 flex items-center gap-2 border-b border-slate-700 pb-2">
                  <Activity className="w-4 h-4" /> Thermal Chronology
                </h4>
                <div className="bg-[#0f172a] border border-slate-700 rounded-xl aspect-video relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=-8.412,116.457&zoom=14&size=600x300&maptype=satellite&key=')] opacity-30 grayscale mix-blend-luminosity"></div>
                  <div className="text-center z-10 transition-transform hover:scale-110 duration-500">
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-2">Thermal Map Gen</p>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-red-500/40 rounded-full filter blur-xl animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[10px] sm:text-xs font-mono text-slate-400 bg-[#0f172a]/80 px-2 py-1 rounded">
                    <span>T+00:00</span>
                    <span>Peak: {selectedIncident.temp}°C</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm text-slate-400 flex gap-4"><span className="text-slate-200 w-16 font-mono">14:02:01</span> <span>Initial anomaly detected at 450°C.</span></div>
                  <div className="text-xs sm:text-sm text-slate-400 flex gap-4"><span className="text-slate-200 w-16 font-mono">14:05:00</span> <span>Expansion rate 2m/s Eastward.</span></div>
                  <div className="text-xs sm:text-sm text-slate-400 flex gap-4"><span className="text-slate-200 w-16 font-mono">14:10:00</span> <span>Ranger team dispatched.</span></div>
                </div>
              </div>

              {/* Right Col: Hiker Correlation Data */}
              <div className="space-y-4">
                <h4 className="font-mono text-xs uppercase tracking-widest text-orange-400 flex items-center gap-2 border-b border-slate-700 pb-2">
                  <Users className="w-4 h-4" /> Hiker Correlation Data (TNGR)
                </h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Automated correlation with TNGR Booking System for coordinates {selectedIncident.lat}, {selectedIncident.lng} (+/- 1 Hour).
                </p>
                
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block mb-1">Primary Party of Interest</span>
                      <strong className="text-slate-100 text-sm sm:text-base">Group ID: RNJ-998</strong>
                    </div>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-[10px] uppercase tracking-widest font-bold rounded border border-red-500/30">High Match</span>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-slate-300 space-y-2 mt-2">
                    <div className="flex justify-between border-b border-slate-700/50 pb-1"><span>Leader:</span> <span className="text-white">Budi Santoso</span></div>
                    <div className="flex justify-between border-b border-slate-700/50 pb-1"><span>Phone:</span> <span className="text-white">+62 812-3456-7890</span></div>
                    <div className="flex justify-between border-b border-slate-700/50 pb-1"><span>Check-in:</span> <span className="text-white">Pos 2 (12:45 WITA)</span></div>
                    <div className="flex justify-between"><span>Last GPS:</span> <span className="text-white">1km from Epicenter</span></div>
                  </div>
                  <button className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded text-[10px] font-bold uppercase tracking-widest text-slate-300 transition-colors">
                    Request Investigation Subpoena
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
