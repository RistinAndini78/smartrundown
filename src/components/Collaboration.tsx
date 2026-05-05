import { Rundown } from '../types';
import { firestoreGetDocs, firestoreSave } from '../lib/firebase';

export default function Collaboration({ userEmail }: { userEmail?: string }) {
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [inviteData, setInviteData] = React.useState({ email: '', role: 'Editor', projectId: '' });
  const [myProjects, setMyProjects] = React.useState<any[]>([]);
  const [collaborators, setCollaborators] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (userEmail) {
      setLoading(true);
      // Fetch user projects
      firestoreGetDocs('rundowns').then(docs => {
        const owned = docs.filter((d: any) => d.authorEmail === userEmail);
        setMyProjects(owned);
        if (owned.length > 0) {
          setInviteData(prev => ({ ...prev, projectId: owned[0].id }));
        }
        setLoading(false);
      });

      // Fetch all collaborators where I am owner or member
      // (Simplified: showing dummy for now but ready for real data)
    }
  }, [userEmail]);

  const handleInvite = async () => {
    if (!inviteData.email || !inviteData.projectId) return alert('Pilih email dan proyek');
    setLoading(true);
    try {
      const project = myProjects.find(p => p.id === inviteData.projectId);
      const currentCollabs = project.collaborators || [];
      
      // Prevent duplicates
      if (currentCollabs.some((c: any) => c.email === inviteData.email)) {
        alert('User ini sudah diundang ke proyek ini');
        setLoading(false);
        return;
      }

      const updatedCollabs = [...currentCollabs, { 
        email: inviteData.email, 
        role: inviteData.role, 
        status: 'Pending',
        invitedAt: new Date().toISOString()
      }];

      await firestoreSave('rundowns', inviteData.projectId, { collaborators: updatedCollabs });
      
      alert(`Berhasil mengundang ${inviteData.email} sebagai ${inviteData.role}!`);
      setShowInviteModal(false);
      setInviteData({ ...inviteData, email: '' });
      
      // Refresh local projects state
      setMyProjects(prev => prev.map(p => p.id === inviteData.projectId ? { ...p, collaborators: updatedCollabs } : p));
    } catch (err) {
      alert('Gagal mengundang anggota');
    } finally {
      setLoading(false);
    }
  };

  const activity = [
    { id: 1, user: 'System', action: 'Fitur kolaborasi cloud aktif', time: 'Baru saja' },
  ];
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary">Kolaborasi Tim</h1>
          <p className="text-secondary mt-1">Kelola anggota tim dan lihat aktivitas kolaborasi secara real-time.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-all shadow-md active:scale-95"
        >
          <UserPlus size={18} />
          <span>Undang Anggota</span>
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Collaborators List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                <Users size={20} className="text-primary-container" />
                Anggota Tim
              </h3>
              <span className="text-xs font-bold px-2 py-1 bg-secondary-container text-secondary rounded-full">
                {collaborators.length} Total
              </span>
            </div>
            <div className="divide-y divide-outline-variant">
              {collaborators.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-container/10 border border-primary-container/20 flex items-center justify-center text-primary-container font-bold text-sm">
                      {user.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-primary">{user.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-secondary">{user.role}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                        <span className={`text-[10px] font-bold uppercase ${user.status === 'Online' ? 'text-green-600' : 'text-gray-400'}`}>
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-secondary hover:text-primary-container transition-colors">
                      <Mail size={18} />
                    </button>
                    <button className="p-2 text-secondary hover:text-primary-container transition-colors">
                      <Settings size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-outline-variant shadow-sm p-8 text-center space-y-4 border-dashed">
            <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto text-secondary/40">
              <MessageSquare size={32} />
            </div>
            <div>
              <h3 className="font-bold text-primary">Forum Diskusi</h3>
              <p className="text-sm text-secondary">Belum ada diskusi aktif dalam tim ini.</p>
            </div>
            <button className="text-primary-container font-bold text-sm hover:underline">Mulai Diskusi Baru</button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-outline-variant shadow-sm p-6">
            <h3 className="font-bold text-lg text-primary mb-6 flex items-center gap-2">
              <Zap size={20} className="text-primary-container" />
              Aktivitas Terbaru
            </h3>
            <div className="space-y-6">
              {activity.map((item) => (
                <div key={item.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-[-24px] before:w-0.5 before:bg-outline-variant last:before:hidden">
                  <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary-container border-2 border-white shadow-sm"></div>
                  <p className="text-sm text-primary leading-relaxed">
                    <span className="font-bold">{item.user}</span> {item.action}
                  </p>
                  <p className="text-[10px] text-secondary font-medium mt-1">{item.time}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-sm font-bold text-secondary border border-outline-variant rounded-xl hover:bg-surface-container transition-colors">
              Lihat Semua Riwayat
            </button>
          </div>

          <div className="bg-primary-container text-white rounded-3xl p-6 shadow-lg shadow-primary-container/20">
            <Shield className="mb-4 opacity-80" size={32} />
            <h3 className="font-bold text-xl mb-2">Keamanan Tim</h3>
            <p className="text-white/70 text-xs leading-relaxed mb-6">
              Pastikan Anda mengelola hak akses anggota dengan bijak untuk menjaga kerahasiaan rundown proyek.
            </p>
            <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-xs font-bold border border-white/20">
              Pengaturan Akses
            </button>
          </div>
        </div>
        {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2rem] w-full max-w-md overflow-hidden shadow-2xl border border-outline-variant">
            <div className="p-8 border-b border-outline-variant bg-surface-container/30">
              <h2 className="text-2xl font-black text-primary">Undang Kolaborator</h2>
              <p className="text-sm text-secondary mt-1">Tambahkan anggota tim ke proyek rundown Anda.</p>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Pilih Proyek</label>
                <select 
                  value={inviteData.projectId}
                  onChange={e => setInviteData({...inviteData, projectId: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container outline-none text-sm transition-all text-primary font-medium"
                >
                  {myProjects.length === 0 ? (
                    <option disabled>Anda belum memiliki proyek di Cloud</option>
                  ) : (
                    myProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))
                  )}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Email Anggota</label>
                <input 
                  type="email" 
                  value={inviteData.email}
                  onChange={e => setInviteData({...inviteData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary-container outline-none text-sm transition-all text-primary font-medium"
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-secondary ml-1">Hak Akses</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Editor', 'Viewer'].map(role => (
                    <button
                      key={role}
                      onClick={() => setInviteData({...inviteData, role})}
                      className={`py-3 rounded-xl text-xs font-bold transition-all border ${inviteData.role === role ? 'bg-primary-container text-white border-primary-container' : 'bg-surface-container text-secondary border-outline-variant hover:border-primary-container/30'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 bg-surface-container/30 border-t border-outline-variant flex gap-3">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-3 border border-outline-variant rounded-xl text-xs font-black uppercase tracking-widest text-secondary hover:bg-white transition-all"
              >
                Batal
              </button>
              <button 
                onClick={handleInvite}
                disabled={loading || myProjects.length === 0}
                className="flex-1 py-3 bg-primary-container text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? 'Mengirim...' : 'Kirim Undangan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
