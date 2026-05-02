import React, { useState } from 'react';
import { Network, Battery, Signal, Wifi, Cpu, Loader2, CheckCircle2, Activity, Server } from 'lucide-react';

export default function Devices() {
  const [devices, setDevices] = useState([
    { id: 'SENS-01', mac: '00:1B:44:11:3A:B7', location: 'Pos 1 Sembalun', battery: 98, signal: '-65dBm', status: 'AKTIF', lastPing: '1m yang lalu', temp: 24.5 },
    { id: 'SENS-02', mac: '00:1B:44:11:3A:C2', location: 'Pos 2 Sembalun', battery: 85, signal: '-72dBm', status: 'AKTIF', lastPing: '2m yang lalu', temp: 21.0 },
    { id: 'SENS-03', mac: '00:1B:44:11:3B:14', location: 'Pos 3 Sabana', battery: 92, signal: '-50dBm', status: 'AKTIF', lastPing: 'Baru saja', temp: 85.4 },
    { id: 'SENS-04', mac: '00:1B:44:11:3B:88', location: 'Plawangan Sembalun', battery: 15, signal: '-98dBm', status: 'WASPADA', lastPing: '5m yang lalu', temp: 15.2 },
    { id: 'SENS-05', mac: '00:1B:44:11:3C:01', location: 'Puncak Rinjani', battery: 0, signal: 'HILANG', status: 'MATI', lastPing: '2 jam yang lalu', temp: null },
  ]);

  const [actionState, setActionState] = useState<{id: string, action: string, status: 'loading' | 'success'} | null>(null);

  const handleAction = (id: string, action: string) => {
    setActionState({ id, action, status: 'loading' });
    setTimeout(() => {
      setActionState({ id, action, status: 'success' });
      if (action === 'Restart') {
        setDevices(prev => prev.map(d => d.id === id ? { ...d, status: 'AKTIF', battery: Math.max(d.battery, 50), signal: '-60dBm', lastPing: 'Baru saja' } : d));
      }
      setTimeout(() => setActionState(null), 2000);
    }, 1500);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 text-slate-200">
      <div className="flex-1 bg-[#0f172a] rounded-xl p-6 flex flex-col shadow-2xl border border-slate-700/80">
        
        <header className="mb-6 flex justify-between items-end border-b border-slate-700 pb-4">
          <div>
            <h2 className="text-xl font-bold uppercase text-slate-200 tracking-wider flex items-center gap-3">
              <Network className="w-6 h-6 text-blue-500" />
              Status Sensor LoRa
            </h2>
            <p className="text-xs text-slate-500 font-mono tracking-widest mt-1">DIAGNOSTIK JARINGAN LORA</p>
          </div>
          <div className="flex gap-4 font-mono text-xs text-slate-400">
             <div className="flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> {devices.filter(d => d.status === 'AKTIF').length} AKTIF</div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 bg-orange-500 rounded-full"></span> {devices.filter(d => d.status === 'WASPADA').length} WASPADA</div>
             <div className="flex items-center gap-2"><span className="w-2 h-2 bg-slate-600 rounded-full"></span> {devices.filter(d => d.status === 'MATI').length} MATI</div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pr-2 pb-4">
          {devices.map(device => (
            <div key={device.id} className="bg-slate-900 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors flex flex-col shadow-lg overflow-hidden relative group">
              
              {/* Card Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Server className={`w-5 h-5 ${device.status === 'AKTIF' ? 'text-emerald-400' : device.status === 'WASPADA' ? 'text-orange-400' : 'text-slate-500'}`} />
                  <div>
                    <h3 className="font-bold text-white tracking-wider font-mono text-sm">{device.id}</h3>
                    <p className="text-[10px] text-slate-500 font-mono">{device.mac}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest border flex items-center justify-center min-w-[60px] ${
                  device.status === 'AKTIF' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                  device.status === 'WASPADA' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                  'bg-slate-800 text-slate-500 border-slate-700'
                }`}>
                  {device.status}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-4 space-y-4 flex-1">
                
                <div className="flex justify-between items-end border-b border-slate-800 pb-3">
                   <div>
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 block">Lokasi Pemasangan</span>
                      <span className="text-sm font-semibold text-slate-300">{device.location}</span>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] uppercase tracking-widest text-slate-500 block">Suhu Udara</span>
                      <span className={`text-lg font-mono font-bold ${device.temp && device.temp > 70 ? 'text-red-400' : 'text-slate-300'}`}>
                        {device.temp ? `${device.temp}°C` : '--'}
                      </span>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Battery */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                       <Battery className={`w-4 h-4 ${device.battery < 20 ? 'text-red-500' : 'text-slate-500'}`} />
                       <span className={`font-mono text-xs ${device.battery < 20 ? 'text-red-400' : 'text-slate-300'}`}>{device.battery}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full ${device.battery < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{width: `${device.battery}%`}}></div>
                    </div>
                  </div>

                  {/* Signal */}
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between items-center mb-2">
                       <Signal className="w-4 h-4 text-slate-500" />
                       <span className={`font-mono text-xs ${device.signal === 'HILANG' || parseInt(device.signal) < -85 ? 'text-orange-400' : 'text-emerald-400'}`}>{device.signal}</span>
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono">RSSI (LoRaWAN)</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <Activity className="w-3 h-3" />
                    UPDATE TERAKHIR
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 flex items-center gap-2">
                    {device.lastPing}
                    {device.status !== 'MATI' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>}
                  </span>
                </div>
              </div>
              
              {/* Card Actions */}
              <div className="p-4 pt-0 flex gap-3">
                <button 
                  onClick={() => handleAction(device.id, 'Diagnostik')}
                  disabled={actionState?.id === device.id}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 disabled:border-slate-700 text-blue-400 disabled:opacity-50 rounded text-[10px] font-bold tracking-widest uppercase transition-all flex justify-center items-center h-8"
                >
                  {actionState?.id === device.id && actionState.action === 'Diagnostik' ? (
                    actionState.status === 'loading' ? <Loader2 className="w-3 h-3 animate-spin text-blue-400" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : 'CEK'}
                </button>
                <button 
                  onClick={() => handleAction(device.id, 'Restart')}
                  disabled={actionState?.id === device.id || device.status === 'MATI'}
                  className="flex-1 py-2 bg-slate-800 hover:bg-red-900/30 border border-slate-700 hover:border-red-500/50 disabled:border-slate-700 text-slate-300 hover:text-red-400 disabled:opacity-50 rounded text-[10px] font-bold tracking-widest uppercase transition-all flex justify-center items-center h-8"
                >
                  {actionState?.id === device.id && actionState.action === 'Restart' ? (
                    actionState.status === 'loading' ? <Loader2 className="w-3 h-3 animate-spin text-red-400" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : 'RESTART'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
