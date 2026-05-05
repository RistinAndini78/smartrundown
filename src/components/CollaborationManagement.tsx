import React from 'react';
import { 
  Share2, 
  Users, 
  Lock, 
  Globe, 
  MessageSquare, 
  ShieldCheck, 
  Eye, 
  MoreVertical,
  Activity,
  History
} from 'lucide-react';

const teams = [
  { id: '1', name: 'Production Team A', members: 12, projects: 5, visibility: 'Private' },
  { id: '2', name: 'Wedding Planners Corp', members: 8, projects: 24, visibility: 'Shared' },
  { id: '3', name: 'Event Music Collective', members: 15, projects: 3, visibility: 'Public' },
];

export default function CollaborationManagement() {
  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-primary">Manajemen Kolaborasi</h1>
        <p className="text-secondary mt-1">Atur kebijakan berbagi, struktur tim, dan audit interaksi antar pengguna.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Teams */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant bg-surface-container/30 flex justify-between items-center">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <Users size={20} className="text-primary-container" />
                Struktur Tim Aktif
              </h3>
              <button className="text-xs font-bold text-primary-container hover:underline">Lihat Semua Tim</button>
            </div>
            <div className="divide-y divide-outline-variant">
              {teams.map((team) => (
                <div key={team.id} className="p-5 flex items-center justify-between hover:bg-surface-container/20 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-secondary border border-outline-variant group-hover:bg-primary-container group-hover:text-white group-hover:border-primary-container transition-all">
                      <Share2 size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">{team.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-secondary uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Users size={12} /> {team.members} Members</span>
                        <span className="flex items-center gap-1"><ShieldCheck size={12} /> {team.projects} Projects</span>
                        <span className={`flex items-center gap-1 ${team.visibility === 'Public' ? 'text-success' : 'text-outline'}`}>
                          {team.visibility === 'Public' ? <Globe size={12} /> : <Lock size={12} />}
                          {team.visibility}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-secondary hover:bg-surface-container rounded-lg">
                    <MoreVertical size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-outline-variant shadow-sm p-8 flex flex-col items-center text-center space-y-4 border-dashed">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center text-secondary/40">
              <History size={32} />
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">Audit Log Kolaborasi</h3>
              <p className="text-sm text-secondary max-w-sm">Pantau setiap perubahan hak akses dan interaksi sensitif antar anggota tim secara mendalam.</p>
            </div>
            <button className="bg-primary-container text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all">
              Buka Audit Log
            </button>
          </div>
        </div>

        {/* Global Permissions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-outline-variant p-8 shadow-sm">
            <h3 className="font-bold text-primary mb-6 flex items-center gap-2">
              <ShieldCheck size={20} className="text-primary-container" />
              Kebijakan Global
            </h3>
            <div className="space-y-6">
               {[
                 { label: 'Izinkan Berbagi Publik', desc: 'User dapat membuat link rundown publik', active: true },
                 { label: 'Komentar Real-time', desc: 'Aktifkan fitur chat dan komentar', active: true },
                 { label: 'Enkripsi Pihak Ketiga', desc: 'Proteksi ekstra untuk kolaborasi eksternal', active: false },
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-start gap-4">
                   <div className="min-w-0">
                     <p className="text-sm font-bold text-primary">{item.label}</p>
                     <p className="text-[10px] text-secondary mt-1 leading-relaxed">{item.desc}</p>
                   </div>
                    <div 
                      onClick={() => {}} 
                      className={`w-11 h-6 rounded-full relative cursor-pointer border-2 transition-all duration-500 ${item.active ? 'bg-success border-success' : 'bg-white border-outline-variant'}`}
                    >
                       <motion.div 
                         animate={{ x: item.active ? 20 : 0 }}
                         transition={{ type: "spring", stiffness: 400, damping: 30 }}
                         className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-colors duration-500 ${item.active ? 'bg-white' : 'bg-outline-variant shadow-sm'}`}
                       />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-secondary-container/30 border border-secondary-container/50 rounded-3xl p-6">
            <div className="flex items-center gap-3 text-primary-container font-bold mb-3">
              <MessageSquare size={20} />
              Info Kolaborasi
            </div>
            <p className="text-[11px] text-secondary leading-relaxed">
              Setiap aktivitas kolaborasi dicatat untuk keperluan audit. Anda dapat mengatur masa simpan log aktivitas (retention policy) di halaman pengaturan sistem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
