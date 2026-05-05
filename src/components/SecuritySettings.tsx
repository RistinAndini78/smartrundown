import React, { useState } from 'react';
import { Shield, Key, Smartphone, AlertTriangle, CheckCircle2, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface SecuritySettingsProps {
  userEmail?: string;
  onBack?: () => void;
}

export default function SecuritySettings({ userEmail, onBack }: SecuritySettingsProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-bold text-sm mb-4"
        >
          <ChevronLeft size={20} />
          Kembali ke Pengaturan
        </button>
      )}
      <header className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Shield className="text-primary-container" size={32} />
            Keamanan & Sandi
          </h1>
          <p className="text-secondary mt-1">Kelola kata sandi dan amankan akun Anda dengan autentikasi ganda.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden p-8">
            <h3 className="font-bold text-primary text-lg flex items-center gap-2 mb-6">
              <Key size={20} className="text-secondary" />
              Ubah Kata Sandi
            </h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary-container/20"
                    placeholder="Masukkan sandi saat ini"
                  />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary">
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-widest">Kata Sandi Baru</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm font-bold text-primary outline-none focus:ring-2 focus:ring-primary-container/20"
                    placeholder="Masukkan sandi baru"
                  />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[10px] text-secondary">Sandi harus terdiri dari minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.</p>
              </div>
              <button className="bg-primary-container text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md active:scale-95">
                Perbarui Sandi
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl border border-outline-variant shadow-sm overflow-hidden p-8">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="font-bold text-primary text-lg flex items-center gap-2 mb-2">
                  <Smartphone size={20} className="text-secondary" />
                  Autentikasi Dua Faktor (2FA)
                </h3>
                <p className="text-sm text-secondary leading-relaxed">
                  Tambahkan lapisan keamanan ekstra ke akun Anda. Setelah diaktifkan, Anda akan diminta memasukkan kode unik yang dikirimkan ke perangkat Anda setiap kali login.
                </p>
              </div>
              <div 
                onClick={async () => {
                  const newState = !twoFactorEnabled;
                  setTwoFactorEnabled(newState);
                  
                  if (userEmail) {
                    try {
                      await fetch('/api/user', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          email: userEmail, 
                          updates: { two_factor_enabled: newState } 
                        })
                      });
                    } catch (err) {
                      console.error("Gagal sinkronisasi database", err);
                    }
                  }
                }}
                className={`w-11 h-6 rounded-full relative cursor-pointer border-2 transition-all duration-500 ${twoFactorEnabled ? 'bg-success border-success' : 'bg-white border-outline-variant'}`}
              >
                <motion.div 
                  animate={{ x: twoFactorEnabled ? 20 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-colors duration-500 ${twoFactorEnabled ? 'bg-white' : 'bg-outline-variant shadow-sm'}`}
                />
              </div>
            </div>
            
            {twoFactorEnabled && (
              <div className="mt-6 p-4 bg-primary-container/5 border border-primary-container/20 rounded-xl flex gap-4">
                <AlertTriangle size={24} className="text-primary-container shrink-0" />
                <div>
                  <p className="text-sm font-bold text-primary-container">2FA Sedang Aktif</p>
                  <p className="text-xs text-secondary mt-1">Kami menggunakan aplikasi Google Authenticator untuk mengamankan akun Anda.</p>
                  <button className="mt-3 text-xs font-bold text-primary-container hover:underline">Konfigurasi Ulang 2FA</button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="bg-secondary-container/20 rounded-3xl p-6 border border-secondary-container/30">
            <h4 className="font-bold text-primary mb-2">Saran Keamanan</h4>
            <ul className="text-xs text-secondary space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                Ganti kata sandi Anda setiap 3 bulan sekali.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                Jangan pernah membagikan kode OTP atau 2FA ke orang lain.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                Gunakan kombinasi sandi yang unik dan tidak mudah ditebak.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
