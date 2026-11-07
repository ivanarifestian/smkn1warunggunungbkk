import React, { useState } from 'react';
import { db } from '../services/db';
import { verifyPassword } from '../utils/crypto';
import { Lock, User as UserIcon, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('VAN64');
  const [password, setPassword] = useState('VANJAZZ64');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const schoolSettings = db.getSettings();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const trimmedUser = username.trim();
      const user = db.getUserByUsername(trimmedUser);

      if (!user) {
        setError('Username tidak ditemukan dalam sistem database.');
        setIsLoading(false);
        return;
      }

      // Check password using SHA-256 hash
      const isValid = await verifyPassword(password, user.passwordHash);
      
      // Also allow direct initial match if database was refreshed
      const isInitialMatch = (trimmedUser.toUpperCase() === 'VAN64' && password === 'VANJAZZ64');

      if (isValid || isInitialMatch) {
        db.setSession(user, rememberMe);
        onLoginSuccess();
      } else {
        setError('Password salah. Pastikan menggunakan password yang benar.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Terjadi kendala autentikasi. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setUsername('VAN64');
    setPassword('VANJAZZ64');
    setError(null);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Futuristic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden p-8">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-7">
            <div className="relative mb-3 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-blue-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-300" />
              <img
                src={schoolSettings.logoUrl}
                alt="Logo SMKN 1 Warunggunung"
                className="relative w-24 h-24 rounded-2xl object-contain p-1.5 bg-white border-2 border-amber-400/90 shadow-md"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <span className="text-[10px] font-semibold tracking-widest uppercase text-amber-400 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full mb-2">
              PORTAL ADMINISTRATOR BKK
            </span>
            <h1 className="text-xl font-bold tracking-tight text-white leading-tight">
              BURSA KERJA KHUSUS
            </h1>
            <p className="text-xs font-semibold text-blue-300 tracking-wider">
              SMK NEGERI 1 WARUNGGUNUNG
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs italic">
              "{schoolSettings.tagline}"
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username Administrator
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <UserIcon className="w-4 h-4 text-blue-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-amber-500/50"
                />
                <span>Ingat Sesi Saya</span>
              </label>
              <button
                type="button"
                onClick={fillDefaultCredentials}
                className="text-amber-400 hover:text-amber-300 transition underline underline-offset-2 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Isi Kredensial Default
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-gradient-to-r from-blue-700 via-blue-600 to-amber-600 hover:from-blue-600 hover:via-blue-500 hover:to-amber-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition duration-200 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Masuk ke Dashboard BKK</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Credentials Info Badge */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400">
              <span className="text-slate-400">Akun Resmi:</span>
              <span className="font-mono text-amber-300 font-semibold">VAN64</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono text-blue-300 font-semibold">VANJAZZ64</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              Sistem Keamanan Sandi Hashing SHA-256 Terenkripsi
            </p>
          </div>
        </div>

        {/* School Footer Note */}
        <p className="text-center text-xs text-slate-500 mt-5">
          &copy; {new Date().getFullYear()} BKK SMK Negeri 1 Warunggunung. All Rights Reserved.
        </p>
      </div>
    </div>
  );
};
