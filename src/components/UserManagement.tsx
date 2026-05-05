import React, { useState, useEffect } from 'react';
import { firestoreGetDocs } from '../lib/firebase';
import { 
  Users, UserPlus, Search, MoreVertical, Mail, Shield, 
  Activity, CheckCircle2, Clock, RefreshCw
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [rundowns, setRundowns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user', password: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      firestoreGetDocs('users'),
      firestoreGetDocs('rundowns')
    ]).then(([usersData, rundownsData]) => {
      setUsers(usersData);
      setRundowns(rundownsData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => { fetchData(); }, []);

  // Count rundowns per user
  const rundownCountByEmail = (email: string) =>
    rundowns.filter(r => r.authorEmail === email).length;

  const displayedUsers = users.filter(u =>
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manajemen User</h1>
          <p className="text-secondary mt-1">Kelola seluruh pengguna terdaftar dari Firebase.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-6 py-2.5 bg-primary-container text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all">
            <UserPlus size={18} /> Tambah User
          </button>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-xl text-sm font-bold text-secondary hover:bg-surface-container transition-all">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Real Stats from DB */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total User Terdaftar', value: loading ? '...' : users.length, icon: Users, color: 'text-primary-container' },
          { label: 'Total Rundown Dibuat', value: loading ? '...' : rundowns.length, icon: Activity, color: 'text-success' },
          { label: 'Kategori Aktif', value: loading ? '...' : [...new Set(rundowns.map(r => r.category).filter(Boolean))].length, icon: Clock, color: 'text-warning' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-outline-variant flex items-center justify-between">
            <div>
              <p className="text-secondary text-sm font-medium">{stat.label}</p>
              <h3 className="text-3xl font-black text-primary mt-1">{stat.value}</h3>
            </div>
            <div className="p-4 bg-surface-container rounded-xl">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden">
        <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center bg-surface-container px-4 py-2 rounded-lg gap-2 w-full md:w-96">
            <Search className="text-secondary w-4 h-4" />
            <input 
              type="text" 
              placeholder="Cari nama atau email user..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
            />
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container/50 border-b border-outline-variant">
              <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider">Anggota</th>
              <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-wider">Rundown Dibuat</th>
              <th className="px-6 py-4 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-secondary font-medium">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-container border-t-transparent rounded-full animate-spin"></div>
                  Memuat daftar pengguna dari Firebase...
                </div>
              </td></tr>
            ) : displayedUsers.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-secondary font-medium">
                {users.length === 0 ? 'Belum ada user terdaftar.' : 'Tidak ada user yang cocok.'}
              </td></tr>
            ) : (
              displayedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container font-bold border border-outline-variant text-sm">
                        {(user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-primary">{user.name || 'User'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${user.role === 'admin' ? 'bg-primary-container/10 border-primary-container/20 text-primary-container' : 'bg-surface-container border-outline-variant text-secondary'}`}>
                      <Shield className="w-3 h-3" />
                      {user.role || 'user'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-primary">{rundownCountByEmail(user.email)}</span>
                      <span className="text-xs text-secondary">rundown</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-surface-container rounded-lg text-secondary transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="p-4 bg-surface-container/10 border-t border-outline-variant">
          <p className="text-xs text-secondary font-medium">
            Total {users.length} user terdaftar • {rundowns.length} rundown dibuat
          </p>
        </div>
      </div>
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-outline-variant">
            <div className="p-8 border-b border-outline-variant bg-surface-container/30">
              <h2 className="text-2xl font-black text-primary">Tambah User Baru</h2>
              <p className="text-sm text-secondary mt-1">Daftarkan anggota tim secara manual.</p>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={e => setNewUser({...newUser, name: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container outline-none text-sm transition-all text-primary font-medium"
                  placeholder="Contoh: John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Alamat Email</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={e => setNewUser({...newUser, email: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container outline-none text-sm transition-all text-primary font-medium"
                  placeholder="user@example.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Role</label>
                  <select 
                    value={newUser.role}
                    onChange={e => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container outline-none text-sm transition-all text-primary font-medium"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Password</label>
                  <input 
                    type="password" 
                    value={newUser.password}
                    onChange={e => setNewUser({...newUser, password: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container outline-none text-sm transition-all text-primary font-medium"
                    placeholder="Minimal 6 karakter"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 bg-surface-container/30 border-t border-outline-variant flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 border border-outline-variant rounded-xl text-xs font-black uppercase tracking-widest text-secondary hover:bg-white transition-all"
              >
                Batal
              </button>
              <button 
                onClick={async () => {
                  if (!newUser.email || !newUser.password) return alert('Email dan Password wajib diisi');
                  setSaving(true);
                  try {
                    // Panggil API Backend untuk membuat user di Firebase Auth & Firestore
                    const response = await fetch('/api/admin/create-user', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newUser)
                    });
                    
                    const data = await response.json();
                    
                    if (!response.ok) throw new Error(data.message);

                    setShowAddModal(false);
                    setNewUser({ name: '', email: '', role: 'user', password: '' });
                    fetchData();
                    alert('User berhasil dibuat di Firebase Authentication!');
                  } catch (err: any) {
                    alert('Gagal menambah user: ' + err.message);
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="flex-1 py-3 bg-primary-container text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
