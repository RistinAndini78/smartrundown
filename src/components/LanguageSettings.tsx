import React, { useState } from 'react';
import { Globe, Check, ChevronLeft, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface LanguageSettingsProps {
  onBack?: () => void;
}

export default function LanguageSettings({ onBack }: LanguageSettingsProps) {
  const [selectedLang, setSelectedLang] = useState('id');

  const languages = [
    { id: 'id', name: 'Bahasa Indonesia', native: 'Indonesia', flag: '🇮🇩' },
    { id: 'en', name: 'English', native: 'United States', flag: '🇺🇸' },
    { id: 'jp', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
    { id: 'kr', name: 'Korean', native: '한국어', flag: '🇰🇷' },
    { id: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
    { id: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
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
            <Globe className="text-primary-container" size={32} />
            Bahasa
          </h1>
          <p className="text-secondary mt-1">Pilih bahasa pengantar aplikasi yang paling nyaman bagi Anda.</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-4 bg-surface-container/30 border-b border-outline-variant">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Cari bahasa..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
            />
          </div>
        </div>
        <div className="divide-y divide-outline-variant">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id)}
              className="w-full p-5 flex items-center justify-between hover:bg-surface-container-low transition-colors group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{lang.flag}</span>
                <div className="text-left">
                  <p className={`font-bold transition-colors ${selectedLang === lang.id ? 'text-primary-container' : 'text-primary'}`}>
                    {lang.name}
                  </p>
                  <p className="text-xs text-secondary">{lang.native}</p>
                </div>
              </div>
              {selectedLang === lang.id && (
                <div className="w-8 h-8 rounded-full bg-primary-container text-white flex items-center justify-center shadow-lg">
                  <Check size={18} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-secondary-container/10 rounded-3xl border border-secondary-container/20 flex gap-4 items-start">
        <div className="p-2 bg-white rounded-xl shadow-sm text-primary-container">
          <Globe size={20} />
        </div>
        <p className="text-xs text-secondary leading-relaxed">
          Beberapa konten atau instruksi mungkin memerlukan waktu untuk diperbarui setelah Anda mengganti bahasa. Terjemahan otomatis disediakan oleh Google Translate API.
        </p>
      </div>
    </div>
  );
}
