import React, { useState, useEffect } from 'react';
import { 
  Users, FileText, Clock, TrendingUp, CheckCircle2,
  ChevronRight, Plus, Shield, Activity, AlertCircle
} from 'lucide-react';
import { Rundown, UserRole } from '../types';
import { firestoreGetDocs } from '../lib/firebase';

interface DashboardProps {
  userRole: UserRole;
  userName?: string;
  userEmail?: string;
  onNavigate: (screen: any, projectDataOrTemplateName?: any) => void;
}

export default function Dashboard({ userRole, userName, userEmail, onNavigate }: DashboardProps) {
  const isAdmin = userRole === 'admin';

  // Real stats from Firebase
  const [allRundowns, setAllRundowns] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    firestoreGetDocs('rundowns')
      .then(docs => {
        if (!isAdmin && userEmail) {
          setAllRundowns(docs.filter((d: any) => d.authorEmail === userEmail));
        } else {
          setAllRundowns(docs);
        }
        setLoadingStats(false);
      })
      .catch(() => setLoadingStats(false));
  }, [isAdmin, userEmail]);

  // Compute real stats
  const totalRundowns = allRundowns.length;
  const activeRundowns = allRundowns.filter(r => r.status === 'Aktif').length;
  const draftRundowns = allRundowns.filter(r => r.status === 'Draft').length;
  const doneRundowns = allRundowns.filter(r => r.status === 'Selesai').length;

  const uniqueAuthors = [...new Set(allRundowns.map(r => r.authorEmail).filter(Boolean))];
  const recentRundowns = [...allRundowns]
    .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
    .slice(0, 5);

  const adminStats = [
    { label: 'Total Rundown', value: loadingStats ? '...' : totalRundowns, icon: FileText, color: 'text-primary-container', bg: 'bg-primary-container/10' },
    { label: 'Total User Aktif', value: loadingStats ? '...' : uniqueAuthors.length, icon: Users, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Rundown Aktif', value: loadingStats ? '...' : activeRundowns, icon: Activity, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Draft & Selesai', value: loadingStats ? '...' : `${draftRundowns} / ${doneRundowns}`, icon: CheckCircle2, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  const userStats = [
    { label: 'Rundown Saya', value: loadingStats ? '...' : totalRundowns, icon: FileText, color: 'text-primary-container', bg: 'bg-primary-container/10' },
    { label: 'Sedang Aktif', value: loadingStats ? '...' : activeRundowns, icon: Activity, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Draft', value: loadingStats ? '...' : draftRundowns, icon: Clock, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Selesai', value: loadingStats ? '...' : doneRundowns, icon: CheckCircle2, color: 'text-info', bg: 'bg-info/10' },
  ];

  const stats = isAdmin ? adminStats : userStats;

  const statusColor: Record<string, string> = {
    Aktif: 'bg-primary-container/10 text-primary-container',
    Draft: 'bg-surface-container text-secondary',
    Selesai: 'bg-success/10 text-success',
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
      {/* Welcome Banner */}
      <div className="bg-white p-8 rounded-3xl border border-outline-variant shadow-sm relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-secondary-container/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${isAdmin ? 'bg-primary-container text-white' : 'bg-secondary-container text-primary-container'}`}>
              {isAdmin ? '🛡️ Administration' : '✨ Workspace Personal'}
            </div>
          </div>
          <h1 className="text-4xl font-bold text-primary tracking-tight mb-2">
            Selamat Datang, {userName || (isAdmin ? 'Super Admin' : 'User')} 👋
          </h1>
          <p className="text-secondary font-medium max-w-xl leading-relaxed">
            {isAdmin
              ? `Panel kendali SmartDesigner. Total ${totalRundowns} rundown dari ${uniqueAuthors.length} pengguna terdaftar dalam sistem.`
              : 'Pantau perkembangan jadwal acara Anda dan pastikan setiap sesi berjalan sempurna.'}
          </p>
          {!isAdmin && (
            <button
              onClick={() => onNavigate('new-project')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary-container text-white rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
            >
              <Plus size={18} /> Buat Rundown Baru
            </button>
          )}
        </div>
      </div>

      {/* Real Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-outline-variant hover:shadow-lg transition-all group cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-secondary text-sm font-medium">{stat.label}</p>
            <h3 className="text-3xl font-black text-primary mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Rundowns - Real Data */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold text-primary">
              {isAdmin ? '📋 Rundown Terbaru (Global)' : '📋 Rundown Terbaru Saya'}
            </h2>
            <button onClick={() => onNavigate('my-rundowns')} className="text-sm font-semibold text-primary-container hover:underline">
              Lihat Semua →
            </button>
          </div>

          <div className="space-y-3">
            {loadingStats ? (
              <div className="flex items-center justify-center py-16 bg-white rounded-2xl border border-outline-variant">
                <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentRundowns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border-2 border-dashed border-outline-variant">
                <FileText className="w-12 h-12 text-outline-variant mb-3" />
                <p className="font-bold text-primary">Belum ada rundown</p>
                <p className="text-sm text-secondary mt-1">Data dari database akan muncul di sini</p>
              </div>
            ) : (
              recentRundowns.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate('editor', item)}
                  className="group flex items-center gap-4 bg-white p-4 rounded-2xl border border-outline-variant hover:border-primary-container transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-primary-container" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary/70 bg-surface-container px-2 py-0.5 rounded">
                        {item.category || 'Lainnya'}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${statusColor[item.status] || ''}`}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-primary truncate group-hover:text-primary-container transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-secondary font-medium">
                      {isAdmin && item.authorName && (
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{item.authorName}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.date || 'TBA'}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-outline-variant group-hover:text-primary-container transition-colors" />
                </div>
              ))
            )}

            {!isAdmin && (
              <button
                onClick={() => onNavigate('new-project')}
                className="w-full py-8 border-2 border-dashed border-outline-variant rounded-2xl flex flex-col items-center justify-center gap-2 text-secondary hover:text-primary-container hover:border-primary-container/40 hover:bg-primary-container/5 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-primary">Buat Rundown Baru</p>
                <p className="text-xs text-secondary">Pilih kategori dan kolom sesuai kebutuhan</p>
              </button>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Distribution by Category */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6">
            <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">
              {isAdmin ? 'Distribusi Kategori' : 'Ringkasan Status'}
            </h2>
            <div className="space-y-3">
              {isAdmin ? (
                (() => {
                  const cats: Record<string, number> = {};
                  allRundowns.forEach(r => { const c = r.category || 'Lainnya'; cats[c] = (cats[c] || 0) + 1; });
                  return Object.entries(cats).map(([cat, count]) => (
                    <div key={cat} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-secondary w-24 truncate">{cat}</span>
                      <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary-container rounded-full" style={{ width: `${Math.min((count / Math.max(totalRundowns, 1)) * 100, 100)}%` }} />
                      </div>
                      <span className="text-xs font-black text-primary w-6 text-right">{count}</span>
                    </div>
                  ));
                })()
              ) : (
                [
                  { label: 'Aktif', count: activeRundowns, color: 'bg-primary-container' },
                  { label: 'Draft', count: draftRundowns, color: 'bg-warning' },
                  { label: 'Selesai', count: doneRundowns, color: 'bg-success' },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-secondary w-16">{s.label}</span>
                    <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full`} style={{ width: `${Math.min((s.count / Math.max(totalRundowns, 1)) * 100, 100)}%` }} />
                    </div>
                    <span className="text-xs font-black text-primary w-6 text-right">{s.count}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6">
            <h2 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">Aksi Cepat</h2>
            <div className="space-y-2">
              {(isAdmin ? [
                { label: 'Kelola Semua Rundown', screen: 'my-rundowns', icon: FileText },
                { label: 'Manajemen Pengguna', screen: 'user-management', icon: Users },
              ] : [
                { label: 'Buat Rundown Baru', screen: 'new-project', icon: Plus },
                { label: 'Rundown Saya', screen: 'my-rundowns', icon: FileText },
              ]).map(action => (
                <button
                  key={action.label}
                  onClick={() => onNavigate(action.screen as any)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-white transition-all">
                    <action.icon size={16} />
                  </div>
                  <span className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors">{action.label}</span>
                  <ChevronRight size={14} className="ml-auto text-outline-variant group-hover:text-primary-container transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
