import React, { useState } from 'react';
import { Settings, Save, Shield, Database, Users, Loader2, CheckCircle2 } from 'lucide-react';

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
    <div className="h-full w-full flex flex-col gap-4 text-slate-200">
      <div className="flex-1 bg-[#1e293b] rounded-xl p-4 sm:p-6 flex flex-col shadow-lg border border-slate-700/50 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-bold uppercase text-slate-200 tracking-wide flex items-center gap-3">
            <Settings className="w-6 h-6 text-slate-400" />
            Pengaturan Sistem
          </h2>
          <button 
            onClick={handleSave}
            disabled={saveState !== 'idle'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors min-w-[170px]"
          >
            {saveState === 'idle' && <><Save className="w-4 h-4" /> Simpan Perubahan</>}
            {saveState === 'saving' && <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>}
            {saveState === 'success' && <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tersimpan!</>}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          
          {/* System Config */}
          <div className="space-y-6">
            <div className="p-5 bg-slate-800 rounded-xl border border-slate-700">
              <h3 className="text-md font-bold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Konfigurasi Notifikasi
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Notifikasi SMS / WhatsApp (Ranger)</p>
                    <p className="text-xs text-slate-400">Kirim peringatan langsung ke grup ranger.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Ambang Batas Suhu Kritis</p>
                    <p className="text-xs text-slate-400">Minimal suhu (Celcius) sebelum peringatan merah.</p>
                  </div>
                  <input type="number" className="w-20 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-center font-mono" defaultValue="60" />
                </div>
              </div>
            </div>

            <div className="p-5 bg-slate-800 rounded-xl border border-slate-700">
              <h3 className="text-md font-bold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
                <Database className="w-4 h-4 text-blue-400" /> Integrasi API
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">TNGR Booking API Endpoint</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 font-mono text-sm" defaultValue="https://api.tngr.id/v1/hikers" />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Google Maps API Key</label>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('google_maps_api_key');
                      window.location.reload();
                    }}
                    className="mt-1 px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 rounded text-xs font-bold uppercase transition-colors"
                  >
                    Reset & Hapus API Key
                  </button>
                  <p className="mt-1 text-[10px] text-slate-500">Klik ini jika terjadi Error InvalidKeyMapError.</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="p-5 bg-slate-800 rounded-xl border border-slate-700">
            <h3 className="text-md font-bold mb-4 flex items-center gap-2 border-b border-slate-700 pb-2">
              <Users className="w-4 h-4 text-orange-400" /> Manajemen Akses
            </h3>
            
            <div className="space-y-3">
              {[
                { name: 'Budi Santoso', role: 'Chief Ranger', lastActive: '2 mins ago' },
                { name: 'Admin Pusat', role: 'System Admin', lastActive: '1 hr ago' },
                { name: 'Pos Pantau 2', role: 'Monitor', lastActive: '5 hrs ago' },
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-700">
                  <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-slate-400">Active: {user.lastActive}</p>
                  </div>
                  <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${
                    user.role === 'System Admin' ? 'bg-purple-500/20 text-purple-400' : 
                    user.role === 'Chief Ranger' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-700 text-slate-300'
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
