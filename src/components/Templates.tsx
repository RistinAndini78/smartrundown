import React from 'react';
import { Palette, Search, Filter, Star, Clock, ArrowRight, Layout, Music, Heart, Mic2 } from 'lucide-react';
import { motion } from 'motion/react';

const templates = [
  {
    id: 1,
    title: 'Konser Musik Pro',
    category: 'Musik',
    icon: Music,
    color: 'bg-purple-100 text-purple-600',
    description: 'Template lengkap untuk manajemen panggung, lighting, dan soundcheck.',
    duration: '4-8 Jam'
  },
  {
    id: 2,
    title: 'Wedding Organizer',
    category: 'Event',
    icon: Heart,
    color: 'bg-rose-100 text-rose-600',
    description: 'Rincian menit-ke-menit untuk prosesi akad hingga resepsi pernikahan.',
    duration: '6-12 Jam'
  },
  {
    id: 3,
    title: 'Podcast / Talkshow',
    category: 'Media',
    icon: Mic2,
    color: 'bg-blue-100 text-blue-600',
    description: 'Struktur segmen untuk rekaman podcast atau siaran radio profesional.',
    duration: '1-2 Jam'
  },
  {
    id: 4,
    title: 'Corporate Webinar',
    category: 'Bisnis',
    icon: Layout,
    color: 'bg-emerald-100 text-emerald-600',
    description: 'Alur presentasi, sesi tanya jawab, dan transisi untuk acara online.',
    duration: '2-4 Jam'
  },
];

interface TemplatesProps {
  onSelect: (templateName: string) => void;
}

export default function Templates({ onSelect }: TemplatesProps) {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Palette size={32} className="text-primary-container" />
            Template Rundown
          </h1>
          <p className="text-secondary mt-2">
            Mulai lebih cepat dengan template yang dirancang khusus oleh profesional. 
            Setiap template dapat disesuaikan sepenuhnya dengan kebutuhan acara Anda.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Cari template..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-outline-variant rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 w-64 transition-all"
            />
          </div>
          <button className="p-2.5 text-secondary hover:bg-surface-container rounded-xl transition-colors border border-outline-variant">
            <Filter size={20} />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <motion.div 
            key={tpl.id}
            whileHover={{ y: -4 }}
            onClick={() => onSelect(tpl.title)}
            className="bg-white rounded-3xl border border-outline-variant p-6 flex gap-6 hover:shadow-xl hover:shadow-primary-container/5 transition-all group cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-2xl ${tpl.color} flex items-center justify-center shrink-0 shadow-inner`}>
              <tpl.icon size={32} />
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-secondary opacity-60 mb-1 block">
                    {tpl.category}
                  </span>
                  <h3 className="font-bold text-xl text-primary group-hover:text-primary-container transition-colors">
                    {tpl.title}
                  </h3>
                </div>
                <button className="text-outline hover:text-amber-500 transition-colors">
                  <Star size={18} />
                </button>
              </div>
              <p className="text-sm text-secondary leading-relaxed line-clamp-2">
                {tpl.description}
              </p>
              <div className="pt-4 flex items-center justify-between border-t border-outline-variant/50">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-secondary">
                  <Clock size={14} />
                  Est. {tpl.duration}
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-primary-container opacity-0 group-hover:opacity-100 transition-all">
                  Gunakan Template
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary-container text-white rounded-[2rem] p-12 text-center space-y-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
        
        <h2 className="text-2xl md:text-3xl font-bold max-w-lg mx-auto leading-tight">
          Punya template rundown keren yang ingin dibagikan?
        </h2>
        <p className="text-white/70 max-w-md mx-auto text-sm">
          Kontribusi template Anda ke komunitas SmartRundown dan bantu ribuan pengguna lainnya.
        </p>
        <button className="bg-white text-primary-container px-8 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-black/10 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2">
          Daftar Menjadi Kontributor
        </button>
      </div>
    </div>
  );
}
