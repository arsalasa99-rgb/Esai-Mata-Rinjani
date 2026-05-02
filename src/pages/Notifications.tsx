import React, { useState } from 'react';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical', time: '20 Mei 2024 10:30 WIB', title: 'Titik panas terdeteksi di Pos 3 - Sabana', risk: 'TINGGI', read: false },
    { id: 2, type: 'warning', time: '20 Mei 2024 08:15 WIB', title: 'Titik panas terdeteksi di Pos 2 - Sabana', risk: 'SEDANG', read: true },
    { id: 3, type: 'info', time: '19 Mei 2024 14:00 WIB', title: 'Sistem sensor suhu dikalibrasi (Sensor 12)', risk: 'INFO', read: true },
    { id: 4, type: 'success', time: '19 Mei 2024 10:00 WIB', title: 'Titik panas di Jalur Senaru berhasil ditangani', risk: 'AMAN', read: true },
  ]);

  const toggleRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 text-slate-200">
      <div className="flex-1 bg-[#1e293b] rounded-xl p-6 flex flex-col shadow-lg border border-slate-700/50">
        <h2 className="text-xl font-bold mb-6 uppercase text-slate-200 tracking-wide flex items-center gap-3">
          <Bell className="w-6 h-6 text-slate-400" />
          Pusat Notifikasi
        </h2>
        
        <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => toggleRead(notif.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border ${
                notif.read ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-800 border-slate-600'
              } hover:bg-slate-700/50 transition-colors cursor-pointer`}
            >
              <div className="mt-1">
                {notif.type === 'critical' ? <ShieldAlert className="w-5 h-5 text-red-500" /> :
                 notif.type === 'warning' ? <AlertTriangle className="w-5 h-5 text-orange-500" /> :
                 notif.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500" /> :
                 <Bell className="w-5 h-5 text-blue-500" />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-semibold ${notif.read ? 'text-slate-300' : 'text-white'}`}>{notif.title}</h3>
                  <span className="text-xs text-slate-400 font-mono">{notif.time}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded bg-black/30 border ${
                    notif.type === 'critical' ? 'text-red-500 border-red-500/30' :
                    notif.type === 'warning' ? 'text-orange-500 border-orange-500/30' :
                    notif.type === 'success' ? 'text-emerald-500 border-emerald-500/30' :
                    'text-blue-500 border-blue-500/30'
                  }`}>
                    {notif.risk}
                  </span>
                  {!notif.read && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
