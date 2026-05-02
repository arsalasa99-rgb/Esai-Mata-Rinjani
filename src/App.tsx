import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Forensics from './pages/Forensics';
import PetaLive from './pages/PetaLive';
import Notifications from './pages/Notifications';
import Devices from './pages/Devices';
import SettingsPage from './pages/Settings';
import { ShieldAlert, Mountain, Clock, Settings, Map, Home, Bell, MonitorSmartphone, Menu, X, Radar } from 'lucide-react';
import { LogoIcon } from './components/LogoIcon';

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <div className="flex bg-[#0f172a] h-[100dvh] w-screen font-sans antialiased overflow-hidden relative">
      <div className="w-full h-full bg-[#0a0f1d] flex flex-col md:flex-row overflow-hidden relative text-slate-200">
        
        {/* Mobile Top Bar */}
          <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0f1d] border-b border-slate-800 z-30">
            <div className="flex items-center gap-3">
              <LogoIcon className="w-8 h-8 text-emerald-500 animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <h1 className="text-xl font-bold tracking-[0.2em] text-slate-200 m-0 leading-tight font-mono">MATA<br/>RINJANI</h1>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-[73px] md:top-0 left-0 w-full md:w-[260px] h-[calc(100%-73px)] md:h-full bg-[#0a0f1d] flex-col z-50 md:pt-4 border-r border-slate-800`}>
            <div className="hidden md:flex p-6 flex-col items-center justify-center mb-4">
              <LogoIcon className="w-16 h-16 text-blue-500 mb-2 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
              <h1 className="text-2xl font-bold tracking-[0.25em] text-slate-200 m-0 leading-tight text-center font-mono relative">
                MATA<br/>RINJANI
                <div className="absolute -right-4 -top-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              </h1>
              <div className="text-[9px] font-mono tracking-widest text-slate-500 mt-2 uppercase border border-slate-800 px-2 py-0.5 rounded">SISTEM PANTAU V3.2</div>
            </div>

            <div className="flex-1 py-4 px-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar font-mono">
              <Link to="/" className={`flex items-center gap-4 px-4 py-3 rounded transition-all tracking-widest uppercase text-xs ${location.pathname === '/' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'}`}>
                <Home className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold">Dasbor</span>
              </Link>
              
              <Link to="/map" className={`flex items-center gap-4 px-4 py-3 rounded transition-all tracking-widest uppercase text-xs ${location.pathname === '/map' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'}`}>
                <Map className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold">Peta Live</span>
              </Link>

              <Link to="/forensics" className={`flex items-center gap-4 px-4 py-3 rounded transition-all tracking-widest uppercase text-xs ${location.pathname === '/forensics' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'}`}>
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold">Riwayat</span>
              </Link>

              <Link to="/notifications" className={`flex items-center gap-4 px-4 py-3 rounded transition-all tracking-widest uppercase text-xs ${location.pathname === '/notifications' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'}`}>
                <Bell className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold">Notifikasi</span>
              </Link>

              <Link to="/devices" className={`flex items-center gap-4 px-4 py-3 rounded transition-all tracking-widest uppercase text-xs ${location.pathname === '/devices' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'}`}>
                <MonitorSmartphone className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold">Detektor</span>
              </Link>

              <Link to="/settings" className={`flex items-center gap-4 px-4 py-3 rounded transition-all tracking-widest uppercase text-xs mt-auto ${location.pathname === '/settings' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900 border border-transparent'}`}>
                <Settings className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold">Pengaturan</span>
              </Link>
            </div>
            
            {/* Connection Status line */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
               <div className="flex items-center gap-2 justify-center text-[9px] font-mono tracking-widest text-emerald-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  KONEKSI AMAN TERHUBUNG
               </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 relative h-full bg-[#0f172a] overflow-y-auto custom-scrollbar p-2 sm:p-4">
            {children}
          </main>

        </div>
      </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/map" element={<PetaLive />} />
          <Route path="/forensics" element={<Forensics />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}


