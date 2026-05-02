import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, AlertTriangle, Info, CheckCircle, ChevronRight, X } from 'lucide-react';

export default function Notifications() {
  const [logs, setLogs] = useState([
    { id: 1, type: 'critical', time: '10:30:11.231', trace: 'SYS-CORE', msg: 'SUHU PANAS TERDETEKSI DI SABANA. MENCAPAI 85°C.', risk: 'BAHAYA', read: false },
    { id: 2, type: 'warning', time: '08:15:02.110', trace: 'SENS-04', msg: 'SENSOR TIDAK NORMAL. SUHU NAIK 42°C. BIASANYA 15°C.', risk: 'WASPADA', read: true },
    { id: 3, type: 'info', time: '07:00:00.000', trace: 'AUTO-CALIB', msg: 'PENGECEKAN RUTIN SELESAI. SEMUA SENSOR NORMAL.', risk: 'INFO', read: true },
    { id: 4, type: 'success', time: 'KEMARIN', trace: 'ADMIN-ACT', msg: 'MASALAH #291 SELESAI. PETUGAS KEMBALI KE POS.', risk: 'AMAN', read: true },
  ]);

  const toggleRead = (id: number) => {
    setLogs(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const clearAll = () => setLogs(prev => prev.map(n => ({...n, read: true})));

  return (
    <div className="h-full w-full flex flex-col gap-4 text-slate-200">
      <div className="flex-1 bg-[#0f172a] rounded-xl p-0 flex flex-col shadow-2xl border border-slate-700/80 overflow-hidden relative">
        
        {/* Terminal Header */}
        <div className="bg-slate-900 border-b border-slate-700 p-4 flex justify-between items-center z-10 shadow-md">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded bg-slate-800 border border-slate-600 flex items-center justify-center">
               <Terminal className="w-5 h-5 text-slate-400" />
             </div>
             <div>
               <h2 className="text-sm font-bold uppercase text-slate-200 tracking-widest font-mono">
                 Catatan Sistem
               </h2>
               <p className="text-[10px] text-slate-500 font-mono">Daftar pemberitahuan terbaru</p>
             </div>
          </div>
          <button 
            onClick={clearAll}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-600 transition-colors text-[10px] font-mono uppercase tracking-widest text-slate-300"
          >
            <CheckCircle className="w-3 h-3" /> Tandai Sudah Dibaca
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0a0f1d] font-mono text-sm relative">
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="space-y-1 relative z-10 flex flex-col gap-0.5">
            {logs.map((log) => (
              <div 
                key={log.id}
                onClick={() => toggleRead(log.id)}
                className={`py-2 px-3 rounded flex items-start gap-4 cursor-pointer transition-all border-l-2 ${
                  log.read ? 'opacity-60 border-slate-800 hover:bg-slate-800/30' : 'bg-slate-800/40 hover:bg-slate-800/60'
                } ${
                  !log.read && log.type === 'critical' ? 'border-red-500' :
                  !log.read && log.type === 'warning' ? 'border-orange-500' :
                  !log.read ? 'border-blue-500' : ''
                }`}
              >
                <div className="w-24 shrink-0 text-slate-500 text-[10px] pt-1">
                  [{log.time}]
                </div>
                
                <div className="w-20 shrink-0 text-[10px] pt-1 text-slate-400 font-bold overflow-hidden text-ellipsis">
                  {log.trace}
                </div>

                <div className={`flex-1 flex flex-col gap-1 ${
                    log.type === 'critical' ? 'text-red-400' :
                    log.type === 'warning' ? 'text-orange-400' :
                    log.type === 'success' ? 'text-emerald-400' :
                    'text-slate-300'
                }`}>
                  <span className="leading-snug flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 shrink-0" />
                    {log.msg}
                  </span>
                </div>
                
                <div className="shrink-0 pt-0.5">
                   <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${
                      log.type === 'critical' ? 'text-red-500/80 border-red-500/30 bg-red-500/10' :
                      log.type === 'warning' ? 'text-orange-500/80 border-orange-500/30 bg-orange-500/10' :
                      log.type === 'success' ? 'text-emerald-500/80 border-emerald-500/30 bg-emerald-500/10' :
                      'text-blue-500/80 border-blue-500/30 bg-blue-500/10'
                    }`}>
                      {log.risk}
                    </span>
                </div>
              </div>
            ))}
            
            {/* Blinking Cursor */}
            <div className="pt-4 pl-[7.5rem] flex items-center">
              <span className="w-2 h-4 bg-slate-500 animate-[pulse_1s_step-start_infinite]"></span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
