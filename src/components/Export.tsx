import React, { useState } from 'react';
import { Download, FileText, Table, FileCode, CheckCircle2, ArrowRight, ShieldCheck, Zap, Loader2, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const formats = [
  {
    id: 'pdf',
    title: 'PDF Document',
    extension: '.pdf',
    icon: FileText,
    color: 'text-red-500',
    bg: 'bg-red-50',
    description: 'Terbaik untuk pencetakan dan distribusi manual ke kru lapangan.'
  },
  {
    id: 'excel',
    title: 'Excel Spreadsheet',
    extension: '.xlsx',
    icon: Table,
    color: 'text-green-600',
    bg: 'bg-green-50',
    description: 'Memungkinkan perhitungan otomatis dan pengeditan data dalam jumlah besar.'
  },
  {
    id: 'txt',
    title: 'Plain Text',
    extension: '.txt',
    icon: FileCode,
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    description: 'Format sederhana tanpa styling, kompatibel dengan hampir semua sistem.'
  },
];

export default function Export() {
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleExport = (id: string) => {
    setExportingId(id);
    setSuccessId(null);
    
    // Simulate export process
    setTimeout(() => {
      setExportingId(null);
      setSuccessId(id);
      
      // Clear success after 3 seconds
      setTimeout(() => setSuccessId(null), 3000);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10">
      <header className="text-center space-y-3">
        <div className="w-16 h-16 bg-primary-container/10 text-primary-container rounded-2xl flex items-center justify-center mx-auto">
          <Download size={32} />
        </div>
        <h1 className="text-3xl font-bold text-primary">Export File</h1>
        <p className="text-secondary max-w-lg mx-auto">
          Pilih format yang sesuai dengan kebutuhan Anda. Semua ekspor menyertakan data rundown terbaru secara otomatis.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {formats.map((format) => {
          const isExporting = exportingId === format.id;
          const isSuccess = successId === format.id;
          
          return (
            <motion.button 
              key={format.id}
              onClick={() => !isExporting && handleExport(format.id)}
              disabled={exportingId !== null}
              whileHover={{ scale: isExporting ? 1 : 1.01 }}
              whileTap={{ scale: isExporting ? 1 : 0.99 }}
              className={`bg-white border rounded-3xl p-6 flex items-center gap-6 group transition-all text-left relative overflow-hidden ${
                isExporting ? 'border-primary-container bg-primary-container/5' : 
                isSuccess ? 'border-success bg-success/5' : 'border-outline-variant hover:border-primary-container/30 hover:shadow-lg'
              } ${exportingId !== null && !isExporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`w-14 h-14 rounded-2xl ${format.bg} ${format.color} flex items-center justify-center shrink-0 transition-all ${isExporting ? 'scale-90 opacity-50' : ''}`}>
                <format.icon size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-primary text-lg">{format.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-surface-container rounded-full text-secondary">
                    {format.extension}
                  </span>
                </div>
                <p className="text-sm text-secondary mt-1">{format.description}</p>
              </div>
              
              <div className="flex items-center justify-center w-10">
                <AnimatePresence mode="wait">
                  {isExporting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Loader2 className="w-6 h-6 text-primary-container animate-spin" />
                    </motion.div>
                  ) : isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="arrow"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-outline group-hover:text-primary-container group-hover:translate-x-1 transition-all"
                    >
                      <ArrowRight size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {isExporting && (
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-primary-container/30"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-outline-variant rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-primary font-bold">
            <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container">
              <ShieldCheck size={18} />
            </div>
            Keamanan Data
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Semua file yang dihasilkan dienkripsi secara aman sebelum diunduh. Data Anda hanya dapat diakses oleh Anda dan anggota tim yang memiliki hak akses.
          </p>
        </div>
        <div className="bg-white border border-outline-variant rounded-3xl p-6 space-y-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 text-primary font-bold">
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <Zap size={18} />
            </div>
            Ekspor Cepat
          </div>
          <p className="text-xs text-secondary leading-relaxed">
            Dapatkan file Anda dalam hitungan detik. Infrastruktur kami memastikan proses konversi data berjalan secepat kilat bahkan untuk rundown yang panjang.
          </p>
        </div>
      </div>

      <footer className="pt-8 border-t border-outline-variant flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 px-6 py-3 bg-surface-container rounded-2xl border border-outline-variant">
           <Share2 size={16} className="text-primary-container" />
           <span className="text-xs font-bold text-primary">Atau bagikan via link publik</span>
           <button className="text-xs font-bold text-primary-container bg-white px-3 py-1 rounded-lg border border-outline-variant hover:shadow-sm transition-all ml-2">Salin Link</button>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest mb-2">Butuh format lain?</p>
          <button className="text-primary-container font-bold text-sm hover:underline">Hubungi kami untuk permintaan khusus</button>
        </div>
      </footer>
    </div>
  );
}
