/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import ProjectList from './components/ProjectList';
import RundownEditor from './components/RundownEditor';
import LiveMode from './components/LiveMode';
import UserManagement from './components/UserManagement';
import Profile from './components/Profile';
import Login from './components/Login';
import Collaboration from './components/Collaboration';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Templates from './components/Templates';
import Export from './components/Export';
import NewProject from './components/NewProject';
import RundownManagement from './components/RundownManagement';
import TemplateManagement from './components/TemplateManagement';
import Reports from './components/Reports';
import CollaborationManagement from './components/CollaborationManagement';
import NotificationManagement from './components/NotificationManagement';
import SystemSettings from './components/SystemSettings';
import SecuritySettings from './components/SecuritySettings';
import ThemeSettings from './components/ThemeSettings';
import LanguageSettings from './components/LanguageSettings';
import DeviceIntegration from './components/DeviceIntegration';
import PrivacyPolicy from './components/PrivacyPolicy';
import HelpCenter from './components/HelpCenter';
import { Screen, UserRole } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Archive as ArchiveIcon, CheckCircle2, Zap, X } from 'lucide-react';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>(() => {
    return (localStorage.getItem('smart_screen') as Screen) || 'dashboard';
  });
  
  const [selectedProjectData, setSelectedProjectData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('smart_project_data');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(() => {
    return localStorage.getItem('smart_selected_template');
  });

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('smart_screen', activeScreen);
  }, [activeScreen]);

  useEffect(() => {
    if (selectedProjectData) {
      localStorage.setItem('smart_project_data', JSON.stringify(selectedProjectData));
    } else {
      localStorage.removeItem('smart_project_data');
    }
  }, [selectedProjectData]);

  useEffect(() => {
    if (selectedTemplate) {
      localStorage.setItem('smart_selected_template', selectedTemplate);
    } else {
      localStorage.removeItem('smart_selected_template');
    }
  }, [selectedTemplate]);

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('smart_auth') === 'true';
  });
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('smart_role') as UserRole) || 'user';
  });
  const [userData, setUserData] = useState<{ name: string, email: string } | null>(() => {
    const saved = localStorage.getItem('smart_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [wsNotifications, setWsNotifications] = useState<{id: string, message: string, type: string}[]>([]);

  const handleLogin = (role: UserRole, name: string, email: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserData({ name, email });
    localStorage.setItem('smart_auth', 'true');
    localStorage.setItem('smart_role', role);
    localStorage.setItem('smart_user', JSON.stringify({ name, email }));
    setActiveScreen(role === 'admin' ? 'admin-dashboard' : 'dashboard');
  };

  useEffect(() => {
    // Detect Invite Link
    const params = new URLSearchParams(window.location.search);
    const inviteId = params.get('invite');
    if (inviteId && isAuthenticated) {
      import('./lib/firebase').then(({ firestoreGetDoc }) => {
        firestoreGetDoc('rundowns', inviteId).then(doc => {
          if (doc) {
            setSelectedProjectData({ ...doc, id: inviteId });
            setActiveScreen('editor');
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            alert(`📂 Bergabung ke proyek: ${doc.title}`);
          }
        });
      });
    }

    // WebSocket hanya untuk development (localhost), skip di production
    if (!window.location.hostname.includes('localhost')) return;
    try {
      const ws = new WebSocket('ws://localhost:3000');
      ws.onerror = () => {}; // Silent fail
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const newNotif = {
            id: Math.random().toString(36).substr(2, 9),
            message: data.message,
            type: data.type
          };
          setWsNotifications(prev => [newNotif, ...prev].slice(0, 3));
          setTimeout(() => {
            setWsNotifications(prev => prev.filter(n => n.id !== newNotif.id));
          }, 5000);
        } catch {}
      };
      return () => ws.close();
    } catch {}
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    setActiveScreen('dashboard');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard': return (
        <Dashboard 
          userRole={userRole} 
          userName={userData?.name}
          userEmail={userData?.email}
          onNavigate={(screen, payload) => {
            if (screen === 'editor' && payload && typeof payload === 'object') {
              setSelectedProjectData(payload);
            } else if (payload && typeof payload === 'string') {
              setSelectedTemplate(payload);
            }
            setActiveScreen(screen);
          }} 
        />
      );
      case 'my-rundowns': return <ProjectList userRole={userRole} userEmail={userData?.email} onEdit={(rundown) => { setSelectedProjectData(rundown); setActiveScreen('editor'); }} />;
      case 'new-project': return <NewProject onCancel={() => setActiveScreen('dashboard')} onCreate={(data) => {
        setSelectedProjectData(data);
        setActiveScreen('editor');
      }} />;
      case 'editor': return <RundownEditor projectData={selectedProjectData} currentUser={userData} onSaved={() => { /* optionally navigate */ }} />;
      case 'templates': return <Templates onSelect={(name) => {
        setSelectedTemplate(name);
        setActiveScreen('editor');
      }} />;
      case 'live': return <LiveMode onExit={() => setActiveScreen('dashboard')} />;
      case 'collaboration': return <Collaboration userEmail={userData?.email} />;
      case 'notifications': return <Notifications onBack={() => setActiveScreen('settings')} />;
      case 'export': return <Export />;
      case 'settings': return <Settings onNavigate={(screen) => setActiveScreen(screen)} />;
      case 'admin-dashboard': return (
        <Dashboard 
          userRole={userRole} 
          userName={userData?.name}
          userEmail={userData?.email}
          onNavigate={(screen, payload) => {
            if (screen === 'editor' && payload && typeof payload === 'object') {
              setSelectedProjectData(payload);
            } else if (payload && typeof payload === 'string') {
              setSelectedTemplate(payload);
            }
            setActiveScreen(screen);
          }} 
        />
      );
      case 'user-management': return <UserManagement />;
      case 'rundown-management': return <RundownManagement onView={(rundown) => { setSelectedProjectData(rundown); setActiveScreen('editor'); }} />;
      case 'template-management': return <TemplateManagement />;
      case 'collaboration-management': return <CollaborationManagement />;
      case 'notification-management': return <NotificationManagement />;
      case 'reports': return <Reports />;
      case 'system-settings': return <SystemSettings />;
      case 'profile': return <Profile user={userData} onUpdate={(newData) => setUserData({ ...userData!, ...newData })} onBack={() => setActiveScreen('settings')} onNavigate={(screen) => setActiveScreen(screen)} />;
      case 'security-settings': return <SecuritySettings userEmail={userData?.email} onBack={() => setActiveScreen('settings')} />;
      case 'theme-settings': return <ThemeSettings userEmail={userData?.email} onBack={() => setActiveScreen('settings')} />;
      case 'language-settings': return <LanguageSettings userEmail={userData?.email} onBack={() => setActiveScreen('settings')} />;
      case 'device-integration': return <DeviceIntegration userEmail={userData?.email} onBack={() => setActiveScreen('settings')} />;
      case 'privacy-policy': return <PrivacyPolicy onBack={() => setActiveScreen('settings')} />;
      case 'help-center': return <HelpCenter onBack={() => setActiveScreen('settings')} />;
      default: return (
        <Dashboard 
          userRole={userRole} 
          userName={userData?.name} 
          userEmail={userData?.email}
          onNavigate={(screen) => setActiveScreen(screen)} 
        />
      );
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-surface">
      {activeScreen !== 'live' && (
        <TopBar 
          userRole={userRole} 
          userName={userData?.name}
          onNavigate={(screen) => setActiveScreen(screen)} 
          onProfileClick={() => setActiveScreen('profile')}
        />
      )}
      <div className={`flex ${activeScreen !== 'live' ? 'pt-16' : ''}`}>
        {activeScreen !== 'live' && (
          <Sidebar 
            activeScreen={activeScreen} 
            setActiveScreen={setActiveScreen} 
            userRole={userRole}
            userName={userData?.name}
            onLogout={handleLogout}
          />
        )}
        <main className={`flex-1 transition-all duration-300 ${activeScreen === 'live' ? 'ml-0' : 'ml-64'} min-h-screen overflow-x-hidden`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Real-time Notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {wsNotifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="bg-white border border-outline-variant shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[320px] pointer-events-auto"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                notif.type === 'SYSTEM_NOTIFICATION' ? 'bg-success/10 text-success' : 'bg-primary-container/10 text-primary-container'
              }`}>
                {notif.type === 'SYSTEM_NOTIFICATION' ? <CheckCircle2 size={20} /> : <Zap size={20} />}
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                  {notif.type === 'SYSTEM_NOTIFICATION' ? 'Sistem' : 'Real-time Event'}
                </p>
                <p className="text-sm font-bold text-primary">{notif.message}</p>
              </div>
              <button 
                onClick={() => setWsNotifications(prev => prev.filter(n => n.id !== notif.id))}
                className="text-outline hover:text-secondary transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
