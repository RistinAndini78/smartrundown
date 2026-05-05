import React, { useState, useEffect } from 'react';
import { firestoreGetDocs, firestoreSave, firestoreDelete } from '../lib/firebase';
import { 
  FileText, Search, Filter, MoreVertical, User, Calendar, 
  CheckCircle2, Clock, AlertCircle, Archive, Eye, Trash2, RefreshCw
} from 'lucide-react';

interface RundownManagementProps {
  onView?: (rundown: any) => void;
}

export default function RundownManagement({ onView }: RundownManagementProps) {
  const [rundowns, setRundowns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');

  const fetchData = () => {
    setLoading(true);
    firestoreGetDocs('rundowns')
      .then(data => { setRundowns(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    await firestoreSave('rundowns', id, { status: newStatus, updatedAt: new Date().toISOString() });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Yakin ingin menghapus rundown ini?')) {
      try {
        await firestoreDelete('rundowns', id);
        fetchData();
      } catch (err) {
        alert('Gagal menghapus rundown');
      }
    }
  };

  const displayed = rundowns.filter(r => {
    const matchSearch = (r.title || '').toLowerCase().includes(searchQuery.toLowerCase())
      || (r.authorName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'Semua Status' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalActive = rundowns.filter(r => r.status === 'Aktif').length;
  const totalDraft = rundowns.filter(r => r.status === 'Draft').length;
  const totalDone = rundowns.filter(r => r.status === 'Selesai').length;

  const statusStyle: Record<string, string> = {
    Aktif: 'bg-primary-container/10 text-primary-container',
    Draft: 'bg-warning/10 text-warning',
    Selesai: 'bg-success/10 text-success',
    Nonaktif: 'bg-error/10 text-error',
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manajemen Rundown</h1>
          <p className="text-secondary mt-1">Pantau dan kelola seluruh rundown dari semua pengguna.</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl text-sm font-bold text-secondary hover:bg-surface-container transition-all">
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      {/* Real Stats from DB */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Rundown', value: loading ? '...' : rundowns.length, icon: FileText, color: 'text-primary-container' },
          { label: 'Aktif', value: loading ? '...' : totalActive, icon: CheckCircle2, color: 'text-success' },
          { label: 'Draft', value: loading ? '...' : totalDraft, icon: Clock, color: 'text-warning' },
          { label: 'Selesai', value: loading ? '...' : totalDone, icon: AlertCircle, color: 'text-info' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-outline-variant">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-surface-container rounded-xl">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-secondary text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-primary">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center bg-surface-container px-4 py-2.5 rounded-xl gap-3 w-full md:w-96 border border-outline-variant/50">
            <Search className="text-secondary w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari judul atau nama pembuat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-surface-container border border-outline-variant text-sm font-bold text-secondary px-4 py-2.5 rounded-xl outline-none"
          >
            <option>Semua Status</option>
            <option>Aktif</option>
            <option>Draft</option>
            <option>Selesai</option>
            <option>Nonaktif</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container/30 border-b border-outline-variant">
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider">Judul Rundown</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider">Pembuat</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-secondary font-medium">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-container border-t-transparent rounded-full animate-spin"></div>
                    Memuat data dari Cloud...
                  </div>
                </td></tr>
              ) : displayed.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-secondary font-medium">
                  {rundowns.length === 0 ? 'Belum ada rundown di database.' : 'Tidak ada hasil yang cocok.'}
                </td></tr>
              ) : (
                displayed.map((rd) => (
                  <tr key={rd.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary">{rd.title}</div>
                      <div className="text-[10px] text-secondary flex items-center gap-1 mt-1">
                        <Calendar size={10} /> {rd.date || 'Tanpa Tanggal'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container text-[10px] font-bold">
                          {(rd.authorName || 'G').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-primary">{rd.authorName || 'Guest'}</p>
                          <p className="text-[10px] text-secondary">{rd.authorEmail || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-secondary">{rd.category || 'Lainnya'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={rd.status || 'Aktif'}
                        onChange={(e) => updateStatus(rd.id, e.target.value)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border-none outline-none cursor-pointer ${statusStyle[rd.status] || 'bg-surface-container text-secondary'}`}
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Draft">Draft</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Nonaktif">Nonaktif</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-secondary">{rd.date || '-'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => onView && onView(rd)} className="p-2 text-secondary hover:text-primary-container hover:bg-surface-container rounded-lg transition-all" title="Lihat">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => handleDelete(rd.id)} className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-lg transition-all" title="Hapus">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-surface-container/10 border-t border-outline-variant flex justify-between items-center">
          <p className="text-xs text-secondary font-medium">
            Menampilkan {displayed.length} dari {rundowns.length} rundown
          </p>
        </div>
      </div>
    </div>
  );
}
