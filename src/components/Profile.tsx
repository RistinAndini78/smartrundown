import React from 'react';
import { User as UserIcon, Mail, Shield, MapPin, Calendar, Edit3, Settings, ChevronLeft } from 'lucide-react';

export default function Profile({ 
  user, 
  onUpdate, 
  onBack,
  onNavigate
}: { 
  user: any, 
  onUpdate: (data: any) => void, 
  onBack?: () => void,
  onNavigate?: (screen: any) => void 
}) {
  const accountSettings = [
    { label: 'Ubah Password', screen: 'security-settings' },
    { label: 'Privasi & Keamanan', screen: 'privacy-policy' },
    { label: 'Bahasa (Indonesia)', screen: 'language-settings' }
  ];
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-bold text-sm"
        >
          <ChevronLeft size={20} />
          Kembali ke Pengaturan
        </button>
      )}
      <div className="bg-white rounded-3xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="h-32 bg-primary-container/10 border-b border-outline-variant relative">
          <div className="absolute -bottom-12 left-8">
            <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center bg-surface-container">
               <UserIcon className="w-12 h-12 text-primary-container/30" />
            </div>
          </div>
        </div>
        
        <div className="pt-16 px-8 pb-8 flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">{user?.name || 'User'}</h1>
            <p className="text-secondary font-medium mt-1 uppercase tracking-widest text-xs">
              {user?.role === 'admin' ? 'Super Admin' : 'Sahabat Kreatif'}
            </p>
            
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Mail className="w-4 h-4" />
                {user?.email || 'email@example.com'}
              </div>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Shield className="w-4 h-4 text-primary-container" />
                <span className="font-bold text-primary">
                  {user?.role === 'admin' ? 'Administrator' : 'Verified Member'}
                </span>
              </div>
            </div>
          </div>
          
          <button className="bg-primary-container text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all">
            Update Profil
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-outline-variant space-y-4">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-container" />
            Statistik Aktivitas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container p-4 rounded-xl">
              <p className="text-[10px] uppercase font-bold text-secondary">Rundown Dibuat</p>
              <p className="text-xl font-bold text-primary">42</p>
            </div>
            <div className="bg-surface-container p-4 rounded-xl">
              <p className="text-[10px] uppercase font-bold text-secondary">Tim Terlibat</p>
              <p className="text-xl font-bold text-primary">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant space-y-4">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary-container" />
            Pengaturan Akun
          </h3>
          <div className="space-y-2">
            {accountSettings.map((item) => (
              <button 
                key={item.label} 
                onClick={() => onNavigate?.(item.screen)}
                className="w-full text-left p-3 rounded-xl hover:bg-surface-container transition-colors text-sm font-medium text-secondary"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
