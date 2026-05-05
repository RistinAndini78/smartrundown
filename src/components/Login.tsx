
import React, { useState } from 'react';
import { Shield, CalendarDays, ArrowRight, Mail, Lock, User as UserIcon } from 'lucide-react';
import { UserRole } from '../types';
import { motion } from 'motion/react';
import { firebaseLogin, firebaseRegister, firestoreSave, firestoreGetDoc } from '../lib/firebase';
import { signInWithGoogle } from '../lib/firebase-sdk';

interface LoginProps {
  onLogin: (role: UserRole, name: string, email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        const authData = await firebaseRegister(email, password);
        await firestoreSave('users', authData.localId, {
          name: name,
          email: email,
          role: selectedRole
        });
        onLogin(selectedRole, name, email);
      } else {
        if (selectedRole === 'admin' && email !== 'admin@smartdesigner.com') {
          throw new Error('Akses ditolak: Hanya kredensial admin yang diizinkan');
        }
        
        const authData = await firebaseLogin(email, password);
        // Ambil data profil dari Firestore
        const profile = await firestoreGetDoc('users', authData.localId);
        const userRole = profile?.role || (email.includes('admin') ? 'admin' : 'user');
        const userName = profile?.name || 'User';

        if (selectedRole === 'user' && userRole === 'admin') {
          throw new Error('Silakan gunakan tab System Admin untuk login');
        }

        onLogin(userRole as UserRole, userName, email);
      }
    } catch (err: any) {
      let errorMessage = err.message || 'Terjadi kesalahan pada sistem';
      
      // Translate common Firebase errors
      if (errorMessage.includes('EMAIL_EXISTS')) {
        errorMessage = 'Email ini sudah terdaftar. Silakan masuk (login) atau gunakan email lain.';
      } else if (errorMessage.includes('INVALID_LOGIN_CREDENTIALS') || errorMessage.includes('INVALID_PASSWORD')) {
        errorMessage = 'Email atau password salah. Silakan periksa kembali.';
      } else if (errorMessage.includes('USER_NOT_FOUND')) {
        errorMessage = 'Akun tidak ditemukan. Silakan daftar terlebih dahulu.';
      } else if (errorMessage.includes('WEAK_PASSWORD')) {
        errorMessage = 'Password terlalu lemah (minimal 6 karakter).';
      } else if (errorMessage.includes('INVALID_EMAIL')) {
        errorMessage = 'Format email tidak valid.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-700 ${
          selectedRole === 'admin' ? 'bg-indigo-500' : 'bg-teal-500'
        }`}></div>
        <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-700 ${
          selectedRole === 'admin' ? 'bg-indigo-600' : 'bg-teal-600'
        }`}></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white rounded-[2.5rem] border border-outline-variant shadow-2xl relative z-10 overflow-hidden"
      >
        {/* Role Selector Header */}
        <div className="flex border-b border-outline-variant">
          <button 
            onClick={() => setSelectedRole('user')}
            className={`flex-1 py-6 flex flex-col items-center gap-2 transition-all ${
              selectedRole === 'user' ? 'bg-teal-50 text-teal-900' : 'text-secondary hover:bg-surface-container'
            }`}
          >
            <CalendarDays size={20} className={selectedRole === 'user' ? 'text-teal-600' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest">Sahabat Kreatif</span>
          </button>
          <button 
            onClick={() => {
              setSelectedRole('admin');
              setIsRegistering(false);
            }}
            className={`flex-1 py-6 flex flex-col items-center gap-2 transition-all ${
              selectedRole === 'admin' ? 'bg-slate-900 text-white' : 'text-secondary hover:bg-surface-container'
            }`}
          >
            <Shield size={20} className={selectedRole === 'admin' ? 'text-indigo-400' : ''} />
            <span className="text-[10px] font-black uppercase tracking-widest">System Admin</span>
          </button>
        </div>

        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-primary tracking-tight">
              {isRegistering ? 'Buat Akun' : 'Selamat Datang'}
            </h2>
            <p className="text-secondary text-sm font-medium mt-2">
              {selectedRole === 'admin' 
                ? 'Akses Root SmartRundown Engine' 
                : 'Mulai susun momen berharga Anda'}
            </p>
          </div>

          <div className="space-y-6">
            {selectedRole !== 'admin' && (
              <button 
                type="button"
                onClick={async () => {
                  setError('');
                  setLoading(true);
                  try {
                    const userData = await signInWithGoogle();
                    onLogin(userData.role as UserRole, userData.name || 'User', userData.email || '');
                  } catch (err: any) {
                    setError('Gagal login Google. Pastikan Anda telah mengaktifkan Google Provider di Firebase Console.');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full py-4 rounded-2xl bg-white border-2 border-outline-variant font-bold text-sm text-primary flex items-center justify-center gap-3 hover:bg-surface-container hover:border-primary-container transition-all active:scale-[0.98] shadow-sm"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                Masuk dengan Akun Google
              </button>
            )}

            {selectedRole !== 'admin' && (
              <div className="flex items-center gap-4">
                <div className="h-px bg-outline-variant flex-1"></div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Atau gunakan email</span>
                <div className="h-px bg-outline-variant flex-1"></div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-error/10 border border-error/20 text-error text-[11px] font-bold py-3 px-4 rounded-xl mb-4 text-center">
                  {error}
                </div>
              )}

              {isRegistering && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Nama Lengkap" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-surface-container border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary-container outline-none text-sm transition-all text-primary font-medium"
                    required
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary-container outline-none text-sm transition-all text-primary font-medium"
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary w-4 h-4" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-container border border-outline-variant rounded-2xl focus:ring-2 focus:ring-primary-container outline-none text-sm transition-all text-primary font-medium"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] mt-4 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                } ${
                  selectedRole === 'admin' 
                    ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800' 
                    : 'bg-teal-600 text-white shadow-teal-900/20 hover:bg-teal-700'
                }`}
              >
                {loading ? 'Processing...' : (isRegistering ? 'Daftar Sekarang' : 'Masuk Dashboard')}
                {!loading && <ArrowRight size={16} strokeWidth={3} />}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            {selectedRole !== 'admin' && (
              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-xs font-bold text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {isRegistering 
                  ? 'Sudah punya akun? Masuk di sini' 
                  : 'Belum punya akun? Daftar gratis'}
              </button>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-surface-container p-4 text-center">
          <p className="text-[10px] font-bold text-secondary/50 uppercase tracking-tighter">
            SmartRundown v2.0 • Pro Integrated Environment
          </p>
        </div>
      </motion.div>
    </div>
  );
}
