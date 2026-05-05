export type Screen = 
  // User Screens
  | 'dashboard' | 'my-rundowns' | 'new-project' | 'editor' | 'templates' | 'live' | 'collaboration' | 'notifications' | 'export' | 'settings'
  // Admin Screens
  | 'admin-dashboard' | 'user-management' | 'rundown-management' | 'template-management' | 'collaboration-management' | 'notification-management' | 'reports' | 'system-settings'
  | 'profile' | 'security-settings' | 'theme-settings' | 'language-settings' | 'device-integration' | 'privacy-policy' | 'help-center';
export type UserRole = 'admin' | 'user';

export interface RundownItem {
  id: string;
  startTime: string;
  title: string;
  duration: number; // in minutes
  endTime: string;
  [key: string]: any; // Memungkinkan kolom custom dinamis
}

export interface Rundown {
  id: string;
  title: string;
  category: 'Seminar' | 'Webinar' | 'Event Kampus' | 'Wedding' | 'Workshop' | 'Lainnya';
  status: 'Aktif' | 'Draft' | 'Selesai' | 'Template';
  date: string;
  updatedAt: string;
  progress: number;
  image?: string;
  contributorCount?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Aktif' | 'Offline';
  avatar?: string;
}
