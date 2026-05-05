import React, { useState } from 'react';
import { Palette, Sun, Moon, Monitor, Check, ChevronLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface ThemeSettingsProps {
  onBack?: () => void;
}

export default function ThemeSettings({ onBack }: ThemeSettingsProps) {
  const [selectedTheme, setSelectedTheme] = useState('system');

  const themes = [
    { id: 'light', name: 'Terang', icon: Sun, desc: 'Tampilan klasik dengan latar belakang cerah.' },
    { id: 'dark', name: 'Gelap', icon: Moon, desc: 'Lebih nyaman untuk mata di kondisi minim cahaya.' },
    { id: 'system', name: 'Sistem', icon: Monitor, desc: 'Mengikuti pengaturan tema perangkat Anda.' },
  ];

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
            <Palette className="text-primary-container" size={32} />
            Tema Aplikasi
          </h1>
          <p className="text-secondary mt-1">Personalisasikan tampilan aplikasi sesuai kenyamanan Anda.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id)}
            className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center text-center gap-4 group relative ${
              selectedTheme === theme.id 
              ? 'border-primary-container bg-primary-container/5 shadow-lg' 
              : 'border-outline-variant bg-white hover:border-primary-container/30'
            }`}
          >
            {selectedTheme === theme.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-primary-container text-white rounded-full flex items-center justify-center">
                <Check size={14} />
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
              selectedTheme === theme.id ? 'bg-primary-container text-white' : 'bg-surface-container text-secondary group-hover:bg-primary-container/10 group-hover:text-primary-container'
            }`}>
              <theme.icon size={32} />
            </div>
            <div>
              <h3 className="font-bold text-primary">{theme.name}</h3>
              <p className="text-xs text-secondary mt-1">{theme.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-outline-variant p-8 space-y-6">
        <h3 className="font-bold text-primary text-lg">Kustomisasi Lanjut</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-primary">Mode Kontras Tinggi</p>
              <p className="text-xs text-secondary">Tingkatkan visibilitas teks dan ikon.</p>
            </div>
            <div className="w-11 h-6 rounded-full relative cursor-pointer border-2 border-outline-variant bg-white transition-all duration-500">
              <motion.div 
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-4 h-4 bg-outline-variant rounded-full shadow-sm"
              />
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-outline-variant pt-4">
            <div>
              <p className="text-sm font-bold text-primary">Kurangi Efek Animasi</p>
              <p className="text-xs text-secondary">Minimalkan gerakan transisi untuk performa lebih cepat.</p>
            </div>
            <div className="w-11 h-6 rounded-full relative cursor-pointer border-2 border-outline-variant bg-white transition-all duration-500">
              <motion.div 
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-4 h-4 bg-outline-variant rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
