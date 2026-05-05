import React from 'react';
import { 
  Settings, 
  Shield, 
  Database, 
  Cloud, 
  Globe, 
  Cpu, 
  Key, 
  Save, 
  RefreshCw,
  AlertTriangle,
  Monitor,
  Moon
} from 'lucide-react';

export default function SystemSettings() {
  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto pb-24">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Pengaturan Sistem</h1>
          <p className="text-secondary mt-1">Konfigurasi parameter teknis, infrastruktur, dan keamanan aplikasi.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-surface-container text-secondary font-bold text-sm rounded-xl border border-outline-variant hover:bg-gray-200 transition-all flex items-center gap-2">
            <RefreshCw size={18} />
            Reset Defaults
          </button>
          <button className="bg-primary-container text-white px-8 py-2.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
            <Save size={18} />
            Simpan Perubahan
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General & Infrastructure */}
        <div className="space-y-8">
          <section className="bg-white rounded-3xl border border-outline-variant p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-primary flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
                <Globe size={18} />
              </div>
              General Configuration
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Nama Aplikasi</label>
                <input type="text" defaultValue="SmartRundown Pro" className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary-container/20 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Base URL</label>
                <input type="text" defaultValue="https://app.smartrundown.pro" className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary-container/20 outline-none" />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-outline-variant/30 pt-6">
                <div>
                   <p className="text-sm font-bold text-primary">Maintenance Mode</p>
                   <p className="text-[10px] text-secondary">Hanya admin yang dapat mengakses aplikasi</p>
                </div>
                <div className="w-12 h-6 bg-surface-container rounded-full relative cursor-pointer border border-outline-variant">
                   <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-outline-variant p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-primary flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <Shield size={18} />
              </div>
              Security & Auth
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-bold text-primary">Two-Factor Authentication</p>
                   <p className="text-[10px] text-secondary">Wajibkan 2FA untuk semua akun admin</p>
                </div>
                <div className="w-12 h-6 bg-success/20 rounded-full relative cursor-pointer border border-success/30">
                   <div className="absolute right-1 top-1 w-4 h-4 bg-success rounded-full shadow-sm"></div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Session Timeout (Menit)</label>
                <input type="number" defaultValue="120" className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none" />
              </div>
            </div>
          </section>
        </div>

        {/* Database & System */}
        <div className="space-y-8">
          <section className="bg-white rounded-3xl border border-outline-variant p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-lg text-primary flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <Database size={18} />
              </div>
              Database & Storage
            </h3>
            <div className="space-y-6">
               <div className="p-4 bg-surface-container rounded-2xl border border-outline-variant/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-primary flex items-center gap-1.5"><Cloud size={14} /> Cloud Storage (S3)</span>
                    <span className="text-[10px] font-bold text-success">CONNECTED</span>
                  </div>
                  <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                     <div className="h-full w-3/4 bg-primary-container rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-secondary mt-2">75.2 GB digunakan dari 100 GB</p>
               </div>
               <div className="flex items-center justify-between">
                <div>
                   <p className="text-sm font-bold text-primary">Auto-Backup</p>
                   <p className="text-[10px] text-secondary">Cadangkan database setiap 24 jam</p>
                </div>
                <div className="w-12 h-6 bg-success/20 rounded-full relative cursor-pointer border border-success/30">
                   <div className="absolute right-1 top-1 w-4 h-4 bg-success rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-primary-container text-white rounded-[2.5rem] p-8 shadow-xl shadow-primary-container/20 relative overflow-hidden">
            <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 mb-2">
                  <Cpu size={32} />
               </div>
               <h3 className="text-xl font-bold">Infrastruktur Server</h3>
               <p className="text-xs text-white/60 leading-relaxed max-w-xs">
                 Monitor performa hardware, alokasi memori, dan beban server secara real-time.
               </p>
               <button className="px-6 py-2.5 bg-white text-primary-container font-black text-xs rounded-xl hover:scale-105 active:scale-95 transition-all">
                  Buka Console Server
               </button>
            </div>
          </section>
        </div>
      </div>

      <div className="bg-error/5 border border-error/10 rounded-3xl p-6 flex items-start gap-4">
        <AlertTriangle className="text-error shrink-0" size={24} />
        <div>
          <h4 className="text-sm font-bold text-error">Danger Zone</h4>
          <p className="text-xs text-error/70 mt-1">Hati-hati dalam mengubah konfigurasi sistem. Perubahan yang salah dapat mengakibatkan aplikasi tidak dapat diakses atau kehilangan data.</p>
        </div>
      </div>
    </div>
  );
}
