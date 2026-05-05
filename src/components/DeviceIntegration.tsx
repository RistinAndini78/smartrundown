import React from 'react';
import { Smartphone, Laptop, Tablet, Monitor, LogOut, ChevronLeft, ShieldCheck, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface DeviceIntegrationProps {
  onBack?: () => void;
}

export default function DeviceIntegration({ onBack }: DeviceIntegrationProps) {
  const devices = [
    { id: '1', name: 'MacBook Pro 14"', type: 'laptop', location: 'Jakarta, ID', time: 'Aktif Sekarang', isCurrent: true },
    { id: '2', name: 'iPhone 15 Pro', type: 'phone', location: 'Bandung, ID', time: '2 jam yang lalu', isCurrent: false },
    { id: '3', name: 'Windows Desktop', type: 'desktop', location: 'Jakarta, ID', time: 'Kemarin, 14:20', isCurrent: false },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'laptop': return <Laptop size={24} />;
      case 'phone': return <Smartphone size={24} />;
      case 'desktop': return <Monitor size={24} />;
      default: return <Tablet size={24} />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-bold text-sm mb-4"
        >
          <ChevronLeft size={20} />
          Kembali ke Pengaturan
        </button>
      )}
      <header className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Smartphone className="text-primary-container" size={32} />
            Integrasi Perangkat
          </h1>
          <p className="text-secondary mt-1">Kelola perangkat yang terhubung dan sesi aktif akun Anda.</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-6 border-b border-outline-variant bg-surface-container/30">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <ShieldCheck size={20} className="text-success" />
            Sesi Login Aktif
          </h3>
        </div>
        <div className="divide-y divide-outline-variant">
          {devices.map((device) => (
            <div key={device.id} className="p-6 flex items-center justify-between hover:bg-surface-container-low transition-colors">
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${
                  device.isCurrent ? 'bg-primary-container text-white border-primary-container' : 'bg-surface-container text-secondary border-outline-variant'
                }`}>
                  {getIcon(device.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-primary">{device.name}</h4>
                    {device.isCurrent && (
                      <span className="text-[10px] font-black bg-success text-white px-2 py-0.5 rounded-full uppercase tracking-tighter">
                        Perangkat Ini
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-secondary flex items-center gap-1 font-medium">
                      {device.location}
                    </span>
                    <span className="text-xs text-outline">•</span>
                    <span className="text-xs text-secondary flex items-center gap-1 font-medium">
                      <Clock size={12} />
                      {device.time}
                    </span>
                  </div>
                </div>
              </div>
              {!device.isCurrent && (
                <button className="p-2.5 text-error hover:bg-error/10 rounded-xl transition-all group" title="Logout dari perangkat ini">
                  <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-outline-variant p-8 space-y-4">
          <h3 className="font-bold text-primary">Sinkronisasi Cloud</h3>
          <p className="text-xs text-secondary leading-relaxed">
            Aktifkan fitur ini untuk memastikan data rundown Anda selalu terbaru di semua perangkat yang Anda gunakan secara real-time.
          </p>
          <div className="flex justify-between items-center bg-surface-container/50 p-4 rounded-2xl border border-outline-variant/50">
            <span className="text-sm font-bold text-primary">Auto-Sync Data</span>
            <div className="w-11 h-6 rounded-full relative cursor-pointer border-2 border-success bg-success shadow-sm shadow-success/20 transition-all duration-500">
              <motion.div 
                animate={{ x: 20 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>
        <div className="bg-primary-container text-white rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <h3 className="font-bold mb-2">Gunakan di Desktop</h3>
          <p className="text-xs text-white/60 leading-relaxed mb-6">
            Dapatkan pengalaman terbaik dengan menginstall SmartRundown di Windows atau macOS untuk fitur offline yang lebih lengkap.
          </p>
          <button className="bg-white text-primary-container px-6 py-2.5 rounded-xl text-xs font-black shadow-lg hover:opacity-90 transition-all">
            DOWNLOAD DESKTOP APP
          </button>
        </div>
      </div>
    </div>
  );
}
