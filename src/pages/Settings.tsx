import React, { useState } from 'react';
import { Settings, Save, Shield, Database, Users, Loader2, CheckCircle2, Radar } from 'lucide-react';

export default function SettingsPage() {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'success'>('idle');

  const handleSave = () => {
    setSaveState('saving');
    setTimeout(() => {
      setSaveState('success');
      setTimeout(() => {
        setSaveState('idle');
      }, 2000);
    }, 1000);
  };

  return (
    <div className="h-full w-full flex flex-col gap-4 text-slate-200 bg-[#0f172a]">
      <div className="flex-1 bg-[#0a0f1d] rounded-xl p-4 sm:p-6 flex flex-col shadow-2xl border border-slate-700/80 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold uppercase text-slate-200 tracking-widest flex items-center gap-3 font-mono">
            <Settings className="w-6 h-6 text-slate-400" />
            Pengaturan Sistem
          </h2>
          <button 
            onClick={handleSave}
            disabled={saveState !== 'idle'}
            className="px-4 py-2 bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/40 text-blue-400 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 rounded text-xs tracking-widest uppercase font-bold flex items-center justify-center gap-2 transition-colors min-w-[170px]"
          >
            {saveState === 'idle' && <><Save className="w-4 h-4" /> Simpan Pengaturan</>}
            {saveState === 'saving' && <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>}
            {saveState === 'success' && <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tersimpan</>}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* System Config */}
          <div className="space-y-6">
            <div className="p-5 bg-slate-900 rounded border border-slate-800">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-3 font-mono tracking-widest text-slate-300 uppercase">
                <Shield className="w-4 h-4 text-emerald-500" /> Batas Peringatan Bahaya
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs tracking-wider uppercase text-slate-300">Kirim Pesan ke Petugas (SMS/WA)</p>
                    <p className="text-[10px] tracking-widest text-slate-500 font-mono mt-1">Kirim langsung ke ponsel petugas lapangan</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500/50 peer-checked:border-emerald-500 border border-slate-700"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-xs tracking-wider uppercase text-slate-300">Batas Suhu Api</p>
                    <p className="text-[10px] tracking-widest text-slate-500 font-mono mt-1">Suhu minimal untuk memunculkan (BAHAYA)</p>
                  </div>
                  <input type="number" className="w-24 bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 outline-none rounded p-2 text-center font-mono text-blue-400" defaultValue="70" />
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-900 rounded border border-slate-800">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-3 font-mono tracking-widest text-slate-300 uppercase">
                <Database className="w-4 h-4 text-blue-500" /> Keamanan & Server
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] tracking-widest text-slate-500 mb-2 uppercase font-bold">Alamat Server Data Pendaki TNGR</label>
                  <input type="text" className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 outline-none rounded p-2.5 font-mono text-xs text-blue-400" defaultValue="https://api.tngr.id/v1/telemetry/hikers" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest text-slate-500 mb-2 uppercase font-bold">Alamat Satelit Pemantau</label>
                  <input type="text" className="w-full bg-[#0a0f1d] border border-slate-700 focus:border-blue-500 outline-none rounded p-2.5 font-mono text-xs text-slate-400" defaultValue="WSS://OP1.SAT.NET/RLY" />
                </div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="p-5 bg-slate-900 rounded border border-slate-800 h-fit">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-3 font-mono tracking-widest text-slate-300 uppercase">
              <Users className="w-4 h-4 text-orange-500" /> Daftar Petugas
            </h3>
            
            <div className="space-y-2">
              {[
                { name: 'OP_BUDI', role: 'LEVEL_5', lastActive: 'T-2m', auth: 'verified' },
                { name: 'SYS_ADMIN', role: 'ROOT', lastActive: 'T-1h', auth: 'verified' },
                { name: 'STATION_2', role: 'LEVEL_2', lastActive: 'T-5h', auth: 'expired' },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0a0f1d] rounded border border-slate-800 font-mono">
                  <div className="flex gap-3 items-center">
                    <div className={`w-2 h-2 rounded-full ${user.auth === 'verified' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-bold text-xs tracking-wider text-slate-200">{user.name}</p>
                      <p className="text-[10px] text-slate-500">TERAKHIR LOGIN: {user.lastActive}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded border ${
                     user.role === 'ROOT' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 
                     user.role === 'LEVEL_5' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 
                     'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
