import React, { useState } from 'react';
import { MonitorSmartphone, Battery, Signal, Wifi, Cpu, Loader2, CheckCircle2 } from 'lucide-react';

export default function Devices() {
  const [devices, setDevices] = useState([
    { id: 'SENS-01', location: 'Pos 1 Sembalun', battery: 98, signal: 'Strong', status: 'Online', lastPing: '1m ago' },
    { id: 'SENS-02', location: 'Pos 2 Sembalun', battery: 85, signal: 'Good', status: 'Online', lastPing: '2m ago' },
    { id: 'SENS-03', location: 'Pos 3 Sabana', battery: 92, signal: 'Excellent', status: 'Online', lastPing: 'Just now' },
    { id: 'SENS-04', location: 'Plawangan Sembalun', battery: 45, signal: 'Weak', status: 'Warning', lastPing: '5m ago' },
    { id: 'SENS-05', location: 'Puncak Rinjani', battery: 12, signal: 'Lost', status: 'Offline', lastPing: '2h ago' },
  ]);

  const [actionState, setActionState] = useState<{id: string, action: string, status: 'loading' | 'success'} | null>(null);

  const handleAction = (id: string, action: string) => {
    setActionState({ id, action, status: 'loading' });
    
    // Simulate action delay
    setTimeout(() => {
      setActionState({ id, action, status: 'success' });
      
      if (action === 'Reboot') {
        // Change status to online to simulate fixed
        setDevices(prev => prev.map(d => d.id === id ? { ...d, status: 'Online', battery: Math.max(d.battery, 50), signal: 'Good', lastPing: 'Just now' } : d));
      }
      
      // Clear success after 2 seconds
      setTimeout(() => {
        setActionState(null);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 text-slate-200">
      <div className="flex-1 bg-[#1e293b] rounded-xl p-6 flex flex-col shadow-lg border border-slate-700/50">
        <h2 className="text-xl font-bold mb-6 uppercase text-slate-200 tracking-wide flex items-center gap-3">
          <MonitorSmartphone className="w-6 h-6 text-slate-400" />
          Status Perangkat Sensor (Edge AI)
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
          {devices.map(device => (
            <div key={device.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-slate-500 transition-colors flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg">{device.id}</h3>
                  <p className="text-sm text-slate-400">{device.location}</p>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                  device.status === 'Online' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  device.status === 'Warning' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {device.status}
                </div>
              </div>
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Battery className={`w-4 h-4 ${device.battery < 20 ? 'text-red-500' : 'text-slate-400'}`} />
                    Baterai
                  </div>
                  <span className={`font-mono text-sm ${device.battery < 20 ? 'text-red-400' : ''}`}>{device.battery}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Signal className="w-4 h-4 text-slate-400" />
                    Sinyal LoRaWAN
                  </div>
                  <span className="font-mono text-sm">{device.signal}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Wifi className="w-4 h-4 text-slate-400" />
                    Last Ping
                  </div>
                  <span className="font-mono text-xs text-slate-400">{device.lastPing}</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-700 flex gap-2">
                <button 
                  onClick={() => handleAction(device.id, 'Diagnostik')}
                  disabled={actionState?.id === device.id}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs font-semibold transition-colors flex justify-center items-center h-8"
                >
                  {actionState?.id === device.id && actionState.action === 'Diagnostik' ? (
                    actionState.status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : 'Diagnostik'}
                </button>
                <button 
                  onClick={() => handleAction(device.id, 'Reboot')}
                  disabled={actionState?.id === device.id || device.status === 'Offline'}
                  className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs font-semibold transition-colors flex justify-center items-center h-8"
                >
                  {actionState?.id === device.id && actionState.action === 'Reboot' ? (
                    actionState.status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin text-blue-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : 'Reboot'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
