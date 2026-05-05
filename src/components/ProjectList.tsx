import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Grid, List, Filter, MoreVertical, Calendar,
  Users, CheckCircle2, AlertCircle, FileText, Shield, Eye, Trash2, RefreshCw
} from 'lucide-react';
import { Rundown, UserRole } from '../types';
import { firestoreGetDocs, firestoreSave, firestoreDelete } from '../lib/firebase';

interface ProjectListProps {
  userRole?: UserRole;
  userEmail?: string;
  onEdit?: (rundown: any) => void;
}

export default function ProjectList({ userRole = 'user', userEmail, onEdit }: ProjectListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const isAdmin = userRole === 'admin';

  const fetchProjects = () => {
    setLoading(true);
    firestoreGetDocs('rundowns')
      .then(docs => {
        let filtered = docs;
        // Admin melihat semua, User hanya melihat miliknya
        if (!isAdmin && userEmail) {
          const safeEmail = userEmail.trim().toLowerCase();
          filtered = docs.filter((doc: any) => 
            (doc.authorEmail || '').trim().toLowerCase() === safeEmail
          );
        }
        setProjects(filtered);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, [userEmail, isAdmin]);

  const updateStatus = async (id: string, newStatus: string) => {
    await firestoreSave('rundowns', id, { status: newStatus, updatedAt: new Date().toISOString() });
    fetchProjects();
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('Yakin ingin menghapus rundown ini?')) {
      try {
        await firestoreDelete('rundowns', id);
        fetchProjects();
      } catch (err) {
        alert('Gagal menghapus rundown');
      }
    }
  };

  const displayed = projects.filter(p => {
    const matchSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      || (p.authorName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    'Aktif': 'bg-primary-container text-white',
    'Selesai': 'bg-success text-white',
    'Draft': 'bg-surface-container text-secondary',
    'Nonaktif': 'bg-error/10 text-error',
  };

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {isAdmin ? (
            <>
              <div className="flex items-center gap-3 mb-1">
                <Shield size={22} className="text-primary-container" />
                <h1 className="text-3xl font-bold text-primary">Semua Rundown (Admin)</h1>
              </div>
              <p className="text-secondary mt-1">Tampilan global — semua rundown dari seluruh pengguna.</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-primary">Rundown Saya</h1>
              <p className="text-secondary mt-1">Daftar semua rundown milik Anda yang tersimpan di Cloud.</p>
            </>
          )}
        </div>
        <button
          onClick={fetchProjects}
          className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl text-sm font-bold text-secondary hover:bg-surface-container transition-all"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-outline-variant">
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center bg-surface-container px-4 py-2 rounded-lg gap-2 flex-1 lg:w-96">
            <Search className="text-secondary w-4 h-4" />
            <input 
              type="text" 
              placeholder={isAdmin ? "Cari rundown atau nama user..." : "Cari rundown..."} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            {['Semua', 'Aktif', 'Draft', 'Selesai', 'Nonaktif'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterStatus === s ? 'bg-primary-container text-white' : 'bg-surface-container text-secondary hover:bg-outline-variant/30'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-surface-container p-1 rounded-lg">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-secondary'}`}>
              <Grid className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-secondary'}`}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar (Admin Only) */}
      {isAdmin && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Rundown', value: projects.length, color: 'text-primary-container' },
            { label: 'Aktif', value: projects.filter(p => p.status === 'Aktif').length, color: 'text-success' },
            { label: 'Draft', value: projects.filter(p => p.status === 'Draft').length, color: 'text-secondary' },
            { label: 'Selesai', value: projects.filter(p => p.status === 'Selesai').length, color: 'text-primary' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-outline-variant p-4">
              <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color} mt-1`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-12 h-12 border-4 border-primary-container border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-secondary font-medium uppercase tracking-widest text-xs">Memuat dari Database...</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mb-4">
            <FileText className="w-10 h-10 text-outline-variant" />
          </div>
          <h3 className="text-xl font-bold text-primary">
            {isAdmin ? 'Belum ada rundown di database' : 'Belum ada rundown'}
          </h3>
          <p className="text-secondary max-w-md mx-auto mt-2">
            {isAdmin ? 'User belum menyimpan rundown apapun.' : 'Mulai buat rundown dan klik "Simpan Cloud".'}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {displayed.map((item) => (
                <div key={item.id} className="group bg-white rounded-3xl border border-outline-variant overflow-hidden hover:shadow-xl transition-all hover:border-primary-container flex flex-col">
                  <div className="relative h-40 bg-gradient-to-br from-primary-container/20 to-primary-container/5 flex items-center justify-center">
                    <FileText className="w-12 h-12 text-primary-container/40" />
                    <div className="absolute top-4 left-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${statusColors[item.status] || 'bg-surface-container text-secondary'}`}>
                        {item.status}
                      </span>
                    </div>
                    {isAdmin && item.authorName && (
                      <div className="absolute bottom-3 left-4 flex items-center gap-1.5 bg-black/20 backdrop-blur-md text-white px-2 py-1 rounded-full">
                        <Users size={10} />
                        <span className="text-[10px] font-bold">{item.authorName}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-secondary/60 uppercase tracking-widest mb-2">
                      <span>{item.category || 'Lainnya'}</span>
                      <span>•</span>
                      <span>{item.date || 'TBA'}</span>
                    </div>
                    <h3 className="text-lg font-bold text-primary group-hover:text-primary-container transition-colors mb-4 leading-tight">
                      {item.title}
                    </h3>

                    {/* Admin Status Control */}
                    {isAdmin && (
                      <div className="mt-auto flex flex-wrap gap-2">
                        {['Aktif', 'Selesai', 'Draft', 'Nonaktif'].map(s => (
                          <button
                            key={s}
                            onClick={() => updateStatus(item.id, s)}
                            className={`flex-1 min-w-[60px] py-1.5 rounded-lg text-[10px] font-bold transition-all border ${item.status === s ? 'border-primary-container bg-primary-container/10 text-primary-container' : 'border-outline-variant text-secondary hover:border-primary-container/30'}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}

                  {/* Edit / Open Button */}
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => onEdit?.({ ...item, id: item.id })}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-primary-container/10 text-primary-container hover:bg-primary-container hover:text-white transition-all border border-primary-container/20"
                    >
                      ✏️ Buka
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-error/10 text-error hover:bg-error hover:text-white transition-all border border-error/20"
                      title="Hapus Rundown"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container/50 border-b border-outline-variant">
                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Judul</th>
                    {isAdmin && <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Pembuat</th>}
                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Tanggal</th>
                    {isAdmin && <th className="px-6 py-4 text-xs font-bold text-secondary uppercase tracking-wider">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {displayed.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container/30 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 font-bold text-primary group-hover:text-primary-container transition-colors">{item.title}</td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container text-[10px] font-bold">
                              {(item.authorName || 'G').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-primary">{item.authorName || 'Guest'}</p>
                              <p className="text-[10px] text-secondary">{item.authorEmail || '-'}</p>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-secondary font-medium">{item.category || 'Lainnya'}</td>
                      <td className="px-6 py-4">
                        {isAdmin ? (
                          <select
                            value={item.status}
                            onChange={(e) => updateStatus(item.id, e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-surface-container border border-outline-variant rounded-lg px-2 py-1 text-xs font-bold outline-none"
                          >
                            <option>Aktif</option>
                            <option>Draft</option>
                            <option>Selesai</option>
                            <option>Nonaktif</option>
                          </select>
                        ) : (
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusColors[item.status] || ''}`}>{item.status}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-secondary">{item.date || 'TBA'}</td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => onEdit?.({ ...item, id: item.id })} className="flex items-center gap-1 text-xs text-primary-container font-bold hover:underline">
                              <Eye size={14} /> Edit
                            </button>
                            <button onClick={(e) => handleDelete(item.id, e)} className="flex items-center gap-1 text-xs text-error font-bold hover:underline">
                              <Trash2 size={14} /> Hapus
                            </button>
                          </div>
                        </td>
                      )}
                      {!isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex gap-3">
                            <button onClick={() => onEdit?.({ ...item, id: item.id })} className="flex items-center gap-1 text-xs text-primary-container font-bold hover:underline">
                              <Eye size={14} /> Buka
                            </button>
                            <button onClick={(e) => handleDelete(item.id, e)} className="flex items-center gap-1 text-xs text-error font-bold hover:underline">
                              <Trash2 size={14} /> Hapus
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
