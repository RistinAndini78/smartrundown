import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, Calendar, Filter, Settings, Trash2, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Rundown Berhasil Diekspor',
    message: 'Rundown "Konser Amal 2024" telah berhasil diekspor ke format PDF.',
    time: '5 menit yang lalu',
    isNew: true,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Perubahan Terdeteksi',
    message: 'Siti Aminah mengubah jadwal pada sesi "Opening Ceremony".',
    time: '1 jam yang lalu',
    isNew: true,
  },
  {
    id: 3,
    type: 'info',
    title: 'Pengingat Acara',
    message: 'Acara "Wedding Anniversary A&B" akan dimulai dalam 24 jam.',
    time: '3 jam yang lalu',
    isNew: false,
  },
  {
    id: 4,
    type: 'error',
    title: 'Gagal Menyimpan',
    message: 'Gagal mensinkronisasi perubahan pada "Gathering Kantor". Periksa koneksi internet Anda.',
    time: '1 hari yang lalu',
    isNew: false,
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'success': return <CheckCircle2 className="text-green-500" size={20} />;
    case 'warning': return <AlertCircle className="text-amber-500" size={20} />;
    case 'error': return <AlertCircle className="text-red-500" size={20} />;
    default: return <Info className="text-blue-500" size={20} />;
  }
};

export default function Notifications({ onBack }: { onBack?: () => void }) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-bold text-sm"
        >
          <ChevronLeft size={20} />
          Kembali ke Pengaturan
        </button>
      )}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            Pusat Notifikasi
            <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-container text-white text-[10px] font-bold rounded-full">2</span>
          </h1>
          <p className="text-secondary mt-1">Pantau semua aktivitas dan pembaruan penting di akun Anda.</p>
        </div>
        <div className="flex gap-3">
          <button className="p-2.5 text-secondary hover:bg-surface-container rounded-xl transition-colors border border-outline-variant">
            <Filter size={20} />
          </button>
          <button className="p-2.5 text-secondary hover:bg-surface-container rounded-xl transition-colors border border-outline-variant">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-4 bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center">
          <div className="flex gap-4">
            <button className="text-sm font-bold text-primary-container border-b-2 border-primary-container pb-2 px-1">Semua</button>
            <button className="text-sm font-medium text-secondary hover:text-primary pb-2 px-1 transition-colors">Belum Dibaca</button>
            <button className="text-sm font-medium text-secondary hover:text-primary pb-2 px-1 transition-colors">Penting</button>
          </div>
          <button className="text-xs font-bold text-secondary hover:text-error transition-colors flex items-center gap-1.5">
            <Trash2 size={14} />
            Hapus Semua
          </button>
        </div>

        <div className="divide-y divide-outline-variant">
          {notifications.map((notif) => (
            <motion.div 
              key={notif.id}
              whileHover={{ backgroundColor: 'rgba(var(--color-surface-container-low), 0.5)' }}
              className={`p-6 flex gap-5 transition-colors relative ${notif.isNew ? 'bg-primary-container/5' : ''}`}
            >
              {notif.isNew && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-container"></div>
              )}
              <div className="shrink-0 w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center">
                {getTypeIcon(notif.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-4">
                  <h4 className={`font-bold text-primary ${notif.isNew ? 'text-lg' : 'text-base'}`}>{notif.title}</h4>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1 shrink-0">
                    <Calendar size={12} />
                    {notif.time}
                  </span>
                </div>
                <p className="text-secondary text-sm mt-1 leading-relaxed">{notif.message}</p>
                <div className="flex gap-4 mt-4">
                  <button className="text-xs font-bold text-primary-container hover:underline">Lihat Detail</button>
                  <button className="text-xs font-bold text-secondary hover:text-primary">Tandai sudah dibaca</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 text-center border-t border-outline-variant bg-surface-container-lowest">
          <button className="text-sm font-bold text-secondary hover:text-primary transition-colors">Lihat notifikasi lama</button>
        </div>
      </div>
    </div>
  );
}
