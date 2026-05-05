import React from 'react';
import { 
  Bell, 
  Send, 
  Mail, 
  MessageSquare, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Clock,
  ChevronRight,
  Filter,
  Eye
} from 'lucide-react';

const history = [
  { id: '1', title: 'System Update v1.2.4', target: 'Semua User', status: 'Sent', time: '2 jam yang lalu' },
  { id: '2', title: 'Maintenance Schedule', target: 'Admin & Editor', status: 'Pending', time: '12 jam mendatang' },
  { id: '3', title: 'Security Alert', target: 'Specific Users', status: 'Sent', time: '1 hari yang lalu' },
];

export default function NotificationManagement() {
  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manajemen Notifikasi</h1>
          <p className="text-secondary mt-1">Kelola pengiriman pengumuman sistem dan konfigurasi otomatisasi notifikasi.</p>
        </div>
        <button className="bg-primary-container text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95">
          <Send size={18} />
          <span>Kirim Broadcast</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Broadcast Channels */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'In-App Notifications', icon: Bell, active: true },
              { label: 'Email Notifications', icon: Mail, active: true },
              { label: 'Push Notifications', icon: Info, active: false },
            ].map((channel, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm flex flex-col items-center gap-4 text-center">
                <div className={`p-4 rounded-2xl ${channel.active ? 'bg-primary-container/10 text-primary-container' : 'bg-surface-container text-outline'}`}>
                  <channel.icon size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-primary text-sm">{channel.label}</h4>
                  <p className={`text-[10px] font-bold uppercase mt-1 ${channel.active ? 'text-success' : 'text-outline'}`}>
                    {channel.active ? 'Aktif' : 'Nonaktif'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-5 border-b border-outline-variant bg-surface-container/30 flex justify-between items-center">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <Clock size={20} className="text-primary-container" />
                Riwayat Broadcast
              </h3>
              <div className="flex gap-2">
                <button className="p-2 text-secondary hover:bg-surface-container rounded-lg border border-outline-variant">
                  <Filter size={18} />
                </button>
              </div>
            </div>
            <div className="divide-y divide-outline-variant">
              {history.map((log) => (
                <div key={log.id} className="p-5 flex items-center justify-between hover:bg-surface-container/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${log.status === 'Sent' ? 'bg-success/10 text-success' : 'bg-amber-100 text-amber-600'}`}>
                      {log.status === 'Sent' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">{log.title}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-secondary">
                         <span>Target: {log.target}</span>
                         <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                         <span>{log.time}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-primary-container font-bold text-xs hover:underline flex items-center gap-1">
                    Detail <ChevronRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Templates & Rules */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-outline-variant p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <Settings size={20} className="text-primary-container" />
                Template Otomatis
              </h3>
              <button className="text-outline hover:text-primary transition-colors">
                <Eye size={18} />
              </button>
            </div>
            <div className="space-y-4">
               {[
                 { label: 'Welcome Email', type: 'Email' },
                 { label: 'Reset Password', type: 'System' },
                 { label: 'Rundown Shared', type: 'In-App' },
                 { label: 'Deadline Reminder', type: 'Push' },
               ].map((tpl, i) => (
                 <button key={i} className="w-full p-4 bg-surface-container rounded-2xl flex items-center justify-between hover:border-primary-container border border-transparent transition-all group">
                   <div className="text-left">
                     <p className="text-xs font-bold text-primary">{tpl.label}</p>
                     <p className="text-[10px] text-secondary mt-0.5">{tpl.type}</p>
                   </div>
                   <Settings size={14} className="text-outline group-hover:rotate-90 transition-transform" />
                 </button>
               ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6">
            <div className="flex items-center gap-3 text-amber-800 font-bold mb-3">
              <AlertTriangle size={20} />
              Peringatan Spam
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Pastikan pengiriman broadcast tidak mengganggu kenyamanan pengguna. Sistem akan otomatis membatasi frekuensi notifikasi jika terdeteksi indikasi spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
