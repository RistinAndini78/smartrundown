import React from 'react';
import { 
  LayoutDashboard, 
  CalendarDays, 
  PlayCircle, 
  Users, 
  Plus, 
  HelpCircle, 
  LogOut,
  Shield,
  FileText,
  Palette,
  Zap,
  Bell,
  Download,
  Settings,
  UserCog,
  Library,
  Layers,
  Share2,
  MessageSquare,
  BarChart3,
  Settings2,
  Home
} from 'lucide-react';
import { Screen, UserRole } from '../types';
import { motion } from 'motion/react';

interface SidebarProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  userRole: UserRole;
  userName?: string;
  onLogout: () => void;
}

export default function Sidebar({ activeScreen, setActiveScreen, userRole, userName, onLogout }: SidebarProps) {
  const isAdmin = userRole === 'admin';
  
  // Specific mapping for roles
  const userNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-rundowns', label: 'Rundown Saya', icon: FileText },
    { id: 'new-project', label: 'Buat Rundown', icon: Plus },
    { id: 'templates', label: 'Template', icon: Palette },
    { id: 'live', label: 'Live Mode', icon: Zap },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  const adminNavigation = [
    { id: 'admin-dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
    { id: 'user-management', label: 'Manajemen User', icon: UserCog },
    { id: 'rundown-management', label: 'Manajemen Rundown', icon: Library },
    { id: 'template-management', label: 'Manajemen Template', icon: Layers },
    { id: 'collaboration-management', label: 'Manajemen Kolaborasi', icon: Share2 },
    { id: 'notification-management', label: 'Manajemen Notifikasi', icon: MessageSquare },
    { id: 'reports', label: 'Laporan', icon: BarChart3 },
    { id: 'system-settings', label: 'Pengaturan Sistem', icon: Settings2 },
  ];

  const navigationItems = isAdmin ? adminNavigation : userNavigation;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#F5F5F5] border-r border-outline-variant flex flex-col pt-16 z-40 transition-colors duration-300">
      <div className="px-6 mb-8 mt-6">
        <div className="p-4 bg-white rounded-2xl border border-outline-variant flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-md">
            {isAdmin ? <Shield size={20} /> : <CalendarDays size={20} />}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-xs uppercase tracking-widest text-primary truncate">
              {isAdmin ? 'System Admin' : 'Workspace'}
            </h4>
            <p className="text-[10px] font-semibold text-secondary truncate">
              {isAdmin ? 'Root Control' : 'Personal Pro'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-thin">
        {navigationItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id as Screen)}
              className={`w-full flex items-center gap-3 px-6 py-3.5 transition-all relative group ${
                isActive 
                  ? 'text-primary bg-white' 
                  : 'text-secondary hover:bg-gray-200/50'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className="absolute left-0 w-1.5 h-6 rounded-r-full bg-primary-container"
                />
              )}
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isActive ? 'text-primary-container' : 'text-secondary'
              }`} />
              <span className={`text-sm tracking-tight ${isActive ? 'font-bold text-primary' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-6 py-6 border-t border-outline-variant">
        {!isAdmin && (
          <button 
            onClick={() => setActiveScreen('new-project')}
            className="w-full bg-primary-container text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm mb-6 active:scale-95"
          >
            <Plus size={16} />
            <span>Buat Rundown Baru</span>
          </button>
        )}

        {isAdmin && (
          <div className="mb-6 p-4 bg-primary-container/5 rounded-xl border border-primary-container/10">
            <p className="text-[10px] font-bold text-primary-container uppercase tracking-widest mb-2">Admin Quick Links</p>
            <div className="space-y-1">
               <button className="w-full text-left text-[11px] font-semibold text-secondary hover:text-primary transition-colors">
                 • View All Logs
               </button>
               <button className="w-full text-left text-[11px] font-semibold text-secondary hover:text-primary transition-colors">
                 • User Permissions
               </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary-container font-bold text-xs">
              {(userName || 'U').charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-primary truncate">{userName || 'User'}</p>
              <p className="text-[9px] font-bold text-secondary uppercase tracking-tight truncate">{isAdmin ? 'Admin' : 'Sahabat Kreatif'}</p>
            </div>
          </div>
          <button className="flex items-center gap-3 text-secondary hover:text-primary transition-all text-sm w-full text-left font-medium">
            <HelpCircle size={18} />
            <span className="text-xs">Bantuan</span>
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 text-error hover:opacity-80 transition-all text-sm w-full text-left font-medium"
          >
            <LogOut size={18} />
            <span className="text-xs">Keluar Akun</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
