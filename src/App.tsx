import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Forensics from './pages/Forensics';
import PetaLive from './pages/PetaLive';
import Notifications from './pages/Notifications';
import Devices from './pages/Devices';
import SettingsPage from './pages/Settings';
import { ShieldAlert, Mountain, Clock, Settings, Map, Home, Bell, MonitorSmartphone, Menu, X } from 'lucide-react';

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
  return (
    <div className="flex bg-[#0f172a] h-[100dvh] w-screen font-sans antialiased overflow-hidden relative">
      <div className="w-full h-full bg-[#0f172a] flex flex-col md:flex-row overflow-hidden relative text-slate-200">
        
        {/* Mobile Top Bar */}
          <div className="md:hidden flex items-center justify-between p-4 bg-[#1e293b] border-b border-slate-700/50 z-30">
            <div className="flex items-center gap-3">
              <Mountain className="w-8 h-8 text-slate-300" strokeWidth={1} />
              <h1 className="text-lg font-bold tracking-widest text-slate-100 m-0 leading-tight">MATA<br/>RINJANI</h1>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-[73px] md:top-0 left-0 w-full md:w-[280px] h-[calc(100%-73px)] md:h-full bg-[#1e293b] flex-col z-50 md:pt-2 border-r border-slate-700/50`}>
            <div className="hidden md:flex p-8 flex-col items-center justify-center mb-2">
              <Mountain className="w-14 h-14 text-slate-300 mb-3" strokeWidth={1} />
              <h1 className="text-2xl font-bold tracking-widest text-slate-100 m-0 leading-tight text-center">MATA<br/>RINJANI</h1>
            </div>

            <div className="flex-1 py-4 px-6 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
              <Link to="/" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${location.pathname === '/' ? 'bg-[#0f172a] text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                <Home className="w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-[15px]">Dashboard</span>
              </Link>
              
              <Link to="/map" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${location.pathname === '/map' ? 'bg-[#0f172a] text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                <Map className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-[15px]">Peta Live</span>
              </Link>

              <Link to="/forensics" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${location.pathname === '/forensics' ? 'bg-[#0f172a] text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                <Clock className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-[15px]">Riwayat</span>
              </Link>

              <Link to="/notifications" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${location.pathname === '/notifications' ? 'bg-[#0f172a] text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                <Bell className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-[15px]">Notifikasi</span>
              </Link>

              <Link to="/devices" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${location.pathname === '/devices' ? 'bg-[#0f172a] text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                <MonitorSmartphone className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-[15px]">Perangkat</span>
              </Link>

              <Link to="/settings" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${location.pathname === '/settings' ? 'bg-[#0f172a] text-slate-100' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}>
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium text-[15px]">Pengaturan</span>
              </Link>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="flex-1 relative h-full bg-[#0f172a] overflow-y-auto custom-scrollbar p-4 sm:p-6">
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


