import React, { useState } from 'react';
import { 
  Plus, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Type, 
  Tag, 
  Users, 
  ChevronRight,
  Palette,
  Sparkles,
  Zap,
  Globe,
  Columns,
  X
} from 'lucide-react';
import { motion } from 'motion/react';

interface NewProjectProps {
  onCancel: () => void;
  onCreate: (data: any) => void;
}

export default function NewProject({ onCancel, onCreate }: NewProjectProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    category: 'Keorganisasian',
    teamSize: '1',
    template: 'Blank',
    customColumns: ['Waktu', 'Kegiatan', 'Durasi', 'Keterangan / PIC']
  });

  const categories = [
    'Keorganisasian', 
    'Perusahaan / Corporate', 
    'Pernikahan', 
    'Pendidikan / Kampus', 
    'Konser & Festival', 
    'Media & TV', 
    'Olahraga', 
    'Sosial & Komunitas', 
    'Lainnya'
  ];
  const templates = [
    { name: 'Blank', desc: 'Mulai dari awal', icon: Type },
    { name: 'Professional', desc: 'Struktur standar industri', icon: Zap },
    { name: 'Quick Event', desc: 'Alur cepat 1-2 jam', icon: Clock },
    { name: 'Global Summit', desc: 'Skala besar multi-bahasa', icon: Globe },
  ];

  const handleNext = () => {
    if (step === 2) {
      if (!formData.date) {
        alert('Silakan pilih tanggal acara terlebih dahulu.');
        return;
      }
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        alert('Tidak dapat membuat jadwal di tanggal yang sudah terlewat.');
        return;
      }
    }
    setStep(step + 1);
  };
  const handleBack = () => setStep(step - 1);
  const [newColumnName, setNewColumnName] = useState('');

  return (
    <div className="min-h-[calc(100vh-64px)] bg-surface flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-primary-container/10 border border-outline-variant overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Left Side: Progress & Info */}
        <div className="w-full md:w-80 bg-primary-container p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <Plus size={24} />
            </div>
            <h2 className="text-3xl font-bold leading-tight mb-4">Buat Rundown Baru</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Lengkapi detail acara Anda untuk memulai penyusunan rundown yang sempurna.
            </p>
          </div>

          <div className="space-y-6 relative z-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-4 group">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-white text-primary-container shadow-lg' : 'bg-white/10 text-white/40 border border-white/20'}`}>
                  {s}
                </div>
                <div className={`transition-all ${step >= s ? 'opacity-100' : 'opacity-40'}`}>
                  <p className="text-[10px] font-bold uppercase tracking-widest leading-none mb-1">Step {s}</p>
                  <p className="text-xs font-semibold">
                    {s === 1 ? 'Informasi Dasar' : s === 2 ? 'Detail Acara' : 'Konfigurasi Kolom'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 p-10 md:p-16 flex flex-col">
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Type size={14} /> Nama Acara
                </label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Contoh: Wedding Sarah & Kevin"
                  className="w-full text-2xl font-bold text-primary placeholder:text-outline-variant border-b-2 border-outline-variant focus:border-primary-container outline-none py-2 transition-all bg-transparent"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Tag size={14} /> Kategori
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button 
                      key={cat}
                      onClick={() => setFormData({...formData, category: cat})}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${formData.category === cat ? 'bg-primary-container text-white border-primary-container shadow-md' : 'bg-white text-secondary border-outline-variant hover:border-primary-container/40'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8 flex-1"
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={14} /> Tanggal Acara
                  </label>
                  <input 
                    type="date" 
                    min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full text-sm font-bold text-primary border border-outline-variant rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none px-4 py-3.5 transition-all bg-surface-container/50 hover:bg-surface-container"
                  />
                  <p className="text-[10px] text-secondary/70">Kapan acara ini akan diselenggarakan?</p>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                    <Clock size={14} /> Waktu Mulai
                  </label>
                  <input 
                    type="time" 
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full text-sm font-bold text-primary border border-outline-variant rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 outline-none px-4 py-3.5 transition-all bg-surface-container/50 hover:bg-surface-container"
                  />
                  <p className="text-[10px] text-secondary/70">Jam berapa rangkaian acara dimulai?</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Users size={14} /> Jumlah Anggota Tim (Panitia)
                </label>
                <div className="flex items-center gap-3">
                  <input 
                    type="number" 
                    min="1"
                    value={formData.teamSize}
                    onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
                    placeholder="Contoh: 5"
                    className="w-32 px-4 py-3.5 bg-surface-container/50 border border-outline-variant rounded-xl text-sm font-bold text-primary outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all text-center hover:bg-surface-container"
                  />
                  <span className="text-sm font-bold text-secondary">Orang</span>
                </div>
                <p className="text-[10px] text-secondary/70">Ketikkan jumlah estimasi orang yang terlibat sebagai panitia.</p>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 flex-1"
            >
              <div className="space-y-2">
                 <label className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2">
                  <Columns size={14} /> Kolom Rundown
                </label>
                <p className="text-sm text-secondary mb-4">
                  Tentukan kolom apa saja yang akan ada di tabel rundown Anda. <br/>
                  <span className="italic">Contoh: jika Anda mengetik "Durasi", Anda bisa mengisi durasi kegiatan seperti "30 menit" pada tabel, dan kolom lainnya akan menyesuaikan.</span>
                </p>
                
                <div className="flex gap-2 mb-6">
                  <input 
                    type="text" 
                    value={newColumnName}
                    onChange={(e) => setNewColumnName(e.target.value)}
                    placeholder="Ketik nama kolom baru (contoh: PIC, Lokasi)..."
                    className="flex-1 bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary-container/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newColumnName.trim()) {
                         setFormData(prev => ({ ...prev, customColumns: [...prev.customColumns, newColumnName.trim()] }));
                         setNewColumnName('');
                      }
                    }}
                  />
                  <button 
                    onClick={() => {
                      if (newColumnName.trim()) {
                         setFormData(prev => ({ ...prev, customColumns: [...prev.customColumns, newColumnName.trim()] }));
                         setNewColumnName('');
                      }
                    }}
                    className="bg-primary-container text-white px-6 rounded-xl font-bold text-sm hover:opacity-90 transition-all"
                  >
                    Tambah Kolom
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {formData.customColumns.map((col, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-primary-container/10 border border-primary-container/20 text-primary-container px-4 py-2 rounded-xl text-sm font-bold shadow-sm">
                      {col}
                      {['Waktu', 'Kegiatan', 'Durasi'].includes(col) ? null : (
                        <button 
                          onClick={() => setFormData(prev => ({ ...prev, customColumns: prev.customColumns.filter((_, i) => i !== idx) }))}
                          className="hover:text-error transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div className="pt-10 flex justify-between items-center">
            {step > 1 ? (
              <button 
                onClick={handleBack}
                className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center gap-2"
              >
                Kembali
              </button>
            ) : (
              <button 
                onClick={onCancel}
                className="text-sm font-bold text-secondary hover:text-primary transition-colors"
              >
                Batalkan
              </button>
            )}
            
            {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={step === 1 && !formData.title}
                className="bg-primary-container text-white px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                <span>Lanjut</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={() => onCreate(formData)}
                className="bg-primary-container text-white px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-lg active:scale-95"
              >
                <span>Selesaikan & Buat</span>
                <Sparkles size={18} />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
