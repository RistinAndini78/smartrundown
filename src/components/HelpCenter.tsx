import React, { useState } from 'react';
import { HelpCircle, Search, MessageCircle, Mail, Phone, ChevronRight, ChevronLeft, PlayCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HelpCenterProps {
  onBack?: () => void;
}

export default function HelpCenter({ onBack }: HelpCenterProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Bagaimana cara mengekspor rundown ke PDF?',
      a: 'Buka rundown yang ingin Anda ekspor, lalu klik tombol "Export" di menu navigasi samping atau di dalam editor. Pilih format "PDF" dan klik download.'
    },
    {
      q: 'Apakah saya bisa menggunakan SmartRundown secara offline?',
      a: 'Ya! Versi desktop dan PWA kami mendukung pengeditan offline. Data akan disinkronkan secara otomatis saat Anda kembali online.'
    },
    {
      q: 'Bagaimana cara menambahkan kolaborator ke proyek saya?',
      a: 'Di dalam editor rundown, klik tombol "Kolaborasi" di pojok kanan atas. Masukkan alamat email rekan tim Anda untuk mengundangnya.'
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 text-primary">
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
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <HelpCircle className="text-primary-container" size={32} />
            Pusat Bantuan
          </h1>
          <p className="text-secondary mt-1">Kami di sini untuk membantu Anda mengoptimalkan penggunaan SmartRundown.</p>
        </div>
      </header>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary-container transition-colors" size={24} />
        <input 
          type="text" 
          placeholder="Apa yang bisa kami bantu hari ini?" 
          className="w-full pl-16 pr-8 py-6 bg-white border-2 border-outline-variant rounded-[2rem] text-lg font-bold shadow-xl shadow-primary-container/5 outline-none focus:border-primary-container transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-primary-container text-white p-8 rounded-[2rem] flex flex-col justify-between h-48 relative overflow-hidden group cursor-pointer shadow-xl shadow-primary-container/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform"></div>
          <PlayCircle size={40} className="relative z-10" />
          <div className="relative z-10">
            <h3 className="text-xl font-bold">Tutorial Video</h3>
            <p className="text-white/60 text-sm mt-1">Belajar cepat melalui panduan visual 2 menit.</p>
          </div>
        </div>
        <div className="bg-white border-2 border-outline-variant p-8 rounded-[2rem] flex flex-col justify-between h-48 hover:border-primary-container transition-all group cursor-pointer shadow-sm">
          <BookOpen size={40} className="text-primary-container" />
          <div>
            <h3 className="text-xl font-bold text-primary">Dokumentasi Lengkap</h3>
            <p className="text-secondary text-sm mt-1">Pelajari setiap fitur secara mendalam melalui teks.</p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-bold px-2">Pertanyaan Populer (FAQ)</h2>
        <div className="bg-white rounded-[2rem] border border-outline-variant shadow-sm overflow-hidden">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-outline-variant last:border-none">
              <button 
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-surface-container/30 transition-colors"
              >
                <span className="font-bold">{faq.q}</span>
                <ChevronRight size={20} className={`text-outline transition-transform ${activeFaq === idx ? 'rotate-90 text-primary-container' : ''}`} />
              </button>
              <AnimatePresence>
                {activeFaq === idx && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-surface-container/50"
                  >
                    <p className="p-6 pt-0 text-sm text-secondary leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-container rounded-[2rem] p-10 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-black">Masih butuh bantuan?</h2>
          <p className="text-secondary text-sm">Tim support kami siap membantu Anda 24/7 untuk setiap kendala teknis.</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <button className="bg-primary-container text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all">
              <MessageCircle size={18} />
              Live Chat
            </button>
            <button className="bg-white text-primary border border-outline-variant px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-container-low transition-all">
              <Mail size={18} />
              Kirim Email
            </button>
          </div>
        </div>
        <div className="w-full md:w-64 aspect-square bg-white rounded-3xl border-4 border-white shadow-2xl flex items-center justify-center relative">
          <div className="absolute inset-4 rounded-2xl bg-primary-container/5 flex flex-col items-center justify-center p-4">
             <Phone size={32} className="text-primary-container mb-4" />
             <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Hotline Darurat</p>
             <p className="text-lg font-black text-primary">0-800-SMART-99</p>
          </div>
        </div>
      </section>
    </div>
  );
}
