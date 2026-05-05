import React from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Globe, 
  ShieldCheck, 
  Smartphone, 
  HelpCircle,
  ChevronRight,
  LogOut
} from 'lucide-react';

const settingSections = [
  {
    title: 'Akun & Profil',
    items: [
      { icon: User, label: 'Informasi Pribadi', detail: 'Edit nama, email, dan foto profil' },
      { icon: Lock, label: 'Keamanan & Sandi', detail: 'Ubah sandi dan autentikasi dua faktor' },
      { icon: Bell, label: 'Preferensi Notifikasi', detail: 'Atur cara Anda menerima pembaruan' },
    ]
  },
  {
    title: 'Tampilan & Sistem',
    items: [
      { icon: Palette, label: 'Tema Aplikasi', detail: 'Pilih antara mode terang, gelap, atau sistem' },
      { icon: Globe, label: 'Bahasa', detail: 'Indonesia (ID)' },
      { icon: Smartphone, label: 'Integrasi Perangkat', detail: 'Kelola perangkat yang terhubung' },
    ]
  },
  {
    title: 'Privasi & Bantuan',
    items: [
      { icon: ShieldCheck, label: 'Kebijakan Privasi', detail: 'Lihat bagaimana data Anda dilindungi' },
      { icon: HelpCircle, label: 'Pusat Bantuan', detail: 'Butuh bantuan? Hubungi tim support kami' },
    ]
  }
];

interface SettingsProps {
  onNavigate?: (screen: any) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-primary">Pengaturan</h1>
        <p className="text-secondary mt-1">Kelola akun, preferensi, dan keamanan aplikasi Anda.</p>
      </header>

      <div className="space-y-8">
        {settingSections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-[0.2em] px-2">{section.title}</h3>
            <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
              <div className="divide-y divide-outline-variant">
                {section.items.map((item, itemIdx) => (
                  <button 
                    key={itemIdx}
                    onClick={() => {
                      if (!onNavigate) return;
                      switch (item.label) {
                        case 'Informasi Pribadi': onNavigate('profile'); break;
                        case 'Keamanan & Sandi': onNavigate('security-settings'); break;
                        case 'Preferensi Notifikasi': onNavigate('notifications'); break;
                        case 'Tema Aplikasi': onNavigate('theme-settings'); break;
                        case 'Bahasa': onNavigate('language-settings'); break;
                        case 'Integrasi Perangkat': onNavigate('device-integration'); break;
                        case 'Kebijakan Privasi': onNavigate('privacy-policy'); break;
                        case 'Pusat Bantuan': onNavigate('help-center'); break;
                        default: alert(`Pengaturan ${item.label} sedang dalam tahap pengembangan.`);
                      }
                    }}
                    className="w-full p-5 flex items-center justify-between hover:bg-surface-container-low transition-all group text-left"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-colors">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary group-hover:text-primary-container transition-colors">{item.label}</h4>
                        <p className="text-xs text-secondary mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-outline group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-outline-variant flex flex-col items-center gap-4">
        <button 
          onClick={() => alert('Sesi Anda di perangkat lain telah berhasil dihentikan.')}
          className="flex items-center gap-2 text-error font-bold text-sm hover:opacity-80 transition-opacity"
        >
          <LogOut size={18} />
          Keluar dari Semua Perangkat
        </button>
        <p className="text-[10px] text-outline font-medium">SmartRundown v1.2.4 • Build 20240428</p>
      </div>
    </div>
  );
}
