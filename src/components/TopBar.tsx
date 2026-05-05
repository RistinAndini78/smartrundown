import React from 'react';
import { Search, Bell, Settings, User as UserIcon, Shield, User as UserSmall } from 'lucide-react';
import { UserRole } from '../types';

interface TopBarProps {
  userRole: UserRole;
  userName?: string;
  onNavigate?: (screen: any) => void;
  onProfileClick: () => void;
}

export default function TopBar({ userRole, userName, onNavigate, onProfileClick }: TopBarProps) {
  const isAdmin = userRole === 'admin';

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-outline-variant flex justify-between items-center px-6 z-50 transition-colors duration-300">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tight text-primary">
          Smart<span className="text-primary-container">Rundown</span>
        </span>
      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2 border-r border-outline-variant pr-4">
          <button onClick={() => onNavigate?.('notifications')} className="p-2 hover:bg-surface-container rounded-lg transition-colors relative">
            <Bell className="text-secondary w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          <button onClick={() => onNavigate?.('settings')} className="p-2 hover:bg-surface-container rounded-lg transition-colors">
            <Settings className="text-secondary w-5 h-5" />
          </button>
        </div>
        
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 pl-2 cursor-pointer group"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-primary group-hover:text-primary-container transition-colors">
              {userName || 'User'}
            </p>
            <p className="text-[10px] uppercase font-bold text-secondary tracking-widest leading-tight">
              {isAdmin ? 'Super Admin' : 'Sahabat Kreatif'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center text-primary-container overflow-hidden group-hover:ring-2 ring-primary-container transition-all">
             <UserIcon size={20} />
          </div>
        </div>
      </div>
    </header>
  );
}
