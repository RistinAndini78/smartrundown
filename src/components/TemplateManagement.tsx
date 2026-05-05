import React, { useState, useEffect } from 'react';
import { firestoreGetDocs } from '../lib/firebase';
import { 
  Layers, 
  Plus, 
  Search, 
  Star, 
  Settings, 
  Trash2, 
  Edit3, 
  Eye, 
  BarChart3,
  Globe,
  Lock,
  ArrowUpRight
} from 'lucide-react';

export default function TemplateManagement() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    firestoreGetDocs('templates')
      .then(data => {
        setTemplates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manajemen Template</h1>
          <p className="text-secondary mt-1">Kelola daftar template standar yang tersedia untuk seluruh pengguna.</p>
        </div>
        <button className="bg-primary-container text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95">
          <Plus className="w-5 h-5" />
          <span>Buat Template Baru</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-4 border-b border-outline-variant flex items-center bg-surface-container/30 gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Cari template..." 
                  className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all"
                />
              </div>
              <button className="p-2 text-secondary hover:bg-surface-container rounded-lg border border-outline-variant">
                <Settings size={18} />
              </button>
            </div>

            <div className="divide-y divide-outline-variant">
              {loading ? (
                <div className="p-12 text-center text-secondary font-medium">
                  Memuat template dari Cloud...
                </div>
              ) : templates.length === 0 ? (
                <div className="p-12 text-center text-secondary font-medium">
                  Belum ada template di Firestore.
                </div>
              ) : (
                templates.map((tpl) => (
                  <div key={tpl.id} className="p-5 flex items-center justify-between hover:bg-surface-container/20 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary-container/5 text-primary-container flex items-center justify-center border border-primary-container/10">
                        <Layers size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-primary group-hover:text-primary-container transition-colors">{tpl.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-secondary">
                            <BarChart3 size={12} />
                            {tpl.usage || 0} Digunakan
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                            <Star size={12} fill="currentColor" />
                            {tpl.rating || '5.0'}
                          </span>
                          <span className={`flex items-center gap-1 text-[10px] font-bold ${tpl.status === 'Publik' ? 'text-success' : 'text-outline'}`}>
                            {tpl.status === 'Publik' ? <Globe size={12} /> : <Lock size={12} />}
                            {tpl.status || 'Publik'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-secondary hover:text-primary-container hover:bg-surface-container rounded-lg">
                        <Edit3 size={18} />
                      </button>
                      <button className="p-2 text-secondary hover:text-primary-container hover:bg-surface-container rounded-lg">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-secondary hover:text-error hover:bg-error/5 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Analytics */}
        <div className="space-y-6">
          <div className="bg-primary-container text-white rounded-3xl p-8 relative overflow-hidden shadow-xl shadow-primary-container/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60 mb-6">Template Terpopuler</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black">Wedding</p>
                  <p className="text-xs text-white/60 font-medium">Organizer Pro</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">892</p>
                  <p className="text-[10px] text-white/40 uppercase font-black">Total Use</p>
                </div>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-[85%] bg-white rounded-full"></div>
              </div>
            </div>
            <button className="w-full mt-10 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-xs font-bold border border-white/20 flex items-center justify-center gap-2">
              Lihat Statistik Lengkap
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-outline-variant p-6 space-y-4">
             <h3 className="font-bold text-primary flex items-center gap-2">
                <Settings size={18} className="text-secondary" />
                Global Config
             </h3>
             <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <span className="text-xs text-secondary font-medium">Auto-approve user templates</span>
                   <div className="w-10 h-5 bg-success/20 rounded-full relative cursor-pointer border border-success/30">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-success rounded-full shadow-sm"></div>
                   </div>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-xs text-secondary font-medium">Featured templates only</span>
                   <div className="w-10 h-5 bg-surface-container rounded-full relative cursor-pointer border border-outline-variant">
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
