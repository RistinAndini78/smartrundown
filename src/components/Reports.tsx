import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  Download, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  { label: 'Pengguna Baru', value: '+428', trend: 'up', percentage: '12%', detail: '7 hari terakhir' },
  { label: 'Rundown Dibuat', value: '1,502', trend: 'up', percentage: '24%', detail: 'Bulan ini' },
  { label: 'Avg. Engagement', value: '82%', trend: 'down', percentage: '3%', detail: 'Per rundown' },
  { label: 'Total Ekspor', value: '3,842', trend: 'up', percentage: '18%', detail: 'Seluruh waktu' },
];

export default function Reports() {
  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Laporan & Statistik</h1>
          <p className="text-secondary mt-1">Analisis mendalam mengenai penggunaan dan performa platform.</p>
        </div>
        <button className="bg-white border border-outline-variant text-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-surface-container transition-all">
          <Download size={18} />
          Unduh Laporan PDF
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-outline-variant shadow-sm">
            <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-primary">{stat.value}</h3>
              <div className={`flex items-center gap-0.5 text-xs font-bold ${stat.trend === 'up' ? 'text-success' : 'text-error'}`}>
                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.percentage}
              </div>
            </div>
            <p className="text-[10px] text-secondary/60 font-medium mt-4 border-t border-outline-variant/50 pt-3 italic">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Simulation */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-outline-variant p-8 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
              <Activity size={20} className="text-primary-container" />
              Aktivitas Pengguna (30 Hari)
            </h3>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                <div className="w-2 h-2 rounded-full bg-primary-container"></div>
                Aktif
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                <div className="w-2 h-2 rounded-full bg-secondary-container"></div>
                Baru
              </span>
            </div>
          </div>
          
          <div className="h-64 w-full flex items-end justify-between gap-2 pt-4">
             {[40, 60, 30, 80, 50, 90, 45, 70, 85, 40, 60, 100, 75, 55, 80].map((h, i) => (
               <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="flex-1 bg-primary-container/20 rounded-t-lg relative group"
               >
                 <div className="absolute inset-0 bg-primary-container opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg"></div>
               </motion.div>
             ))}
          </div>
          
          <div className="flex justify-between text-[10px] font-bold text-secondary/40 px-2">
             <span>01 MEI</span>
             <span>10 MEI</span>
             <span>20 MEI</span>
             <span>30 MEI</span>
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-white rounded-[2.5rem] border border-outline-variant p-8 space-y-8">
          <h3 className="font-bold text-lg text-primary flex items-center gap-2">
            <PieChart size={20} className="text-primary-container" />
            Kategori Teratas
          </h3>
          <div className="space-y-6">
             {[
               { label: 'Wedding', color: 'bg-rose-500', value: '45%' },
               { label: 'Corporate', color: 'bg-blue-500', value: '30%' },
               { label: 'Music', color: 'bg-purple-500', value: '15%' },
               { label: 'Others', color: 'bg-gray-400', value: '10%' },
             ].map((cat, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-primary">{cat.label}</span>
                    <span className="text-secondary">{cat.value}</span>
                 </div>
                 <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color}`} style={{ width: cat.value }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
