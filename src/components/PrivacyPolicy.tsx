import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, ChevronLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PrivacyPolicyProps {
  onBack?: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  const sections = [
    {
      icon: Eye,
      title: 'Data yang Kami Kumpulkan',
      content: 'Kami hanya mengumpulkan informasi yang Anda berikan secara sadar, seperti nama, email, dan data rundown yang Anda buat. Kami juga mengumpulkan metadata teknis seperti alamat IP untuk keamanan akun.'
    },
    {
      icon: Lock,
      title: 'Keamanan Data Anda',
      content: 'Setiap data yang Anda simpan di cloud dienkripsi menggunakan standar AES-256. Kami melakukan audit keamanan berkala untuk memastikan infrastruktur kami aman dari serangan siber.'
    },
    {
      icon: ShieldCheck,
      title: 'Penggunaan Data',
      content: 'Data Anda tidak akan pernah dijual atau dibagikan kepada pihak ketiga untuk keperluan iklan. Data hanya digunakan untuk menyediakan layanan utama SmartRundown kepada Anda.'
    }
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
            <ShieldCheck className="text-primary-container" size={32} />
            Kebijakan Privasi
          </h1>
          <p className="text-secondary mt-1">Komitmen kami dalam melindungi data dan privasi Anda.</p>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden p-8 space-y-10">
        <div className="prose prose-sm max-w-none">
          <p className="text-secondary leading-relaxed">
            Terakhir diperbarui: 28 April 2024. <br /><br />
            Selamat datang di SmartRundown. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda menggunakan aplikasi kami. Keamanan data Anda adalah prioritas utama bagi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-container/10 text-primary-container flex items-center justify-center">
                <section.icon size={24} />
              </div>
              <h3 className="font-bold text-primary">{section.title}</h3>
              <p className="text-xs text-secondary leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="p-6 bg-surface-container rounded-2xl border border-outline-variant">
          <h4 className="font-bold text-primary mb-2 flex items-center gap-2">
            <FileText size={18} className="text-secondary" />
            Ketentuan Layanan
          </h4>
          <p className="text-xs text-secondary leading-relaxed mb-4">
            Dengan menggunakan SmartRundown, Anda menyetujui seluruh syarat dan ketentuan yang berlaku. Pastikan Anda membaca dokumen lengkap untuk memahami hak dan kewajiban Anda.
          </p>
          <button className="text-sm font-bold text-primary-container flex items-center gap-2 hover:underline">
            Baca Ketentuan Layanan Lengkap
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
