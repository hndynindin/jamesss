import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, User, ArrowRight, Sparkles, AlertCircle, Building2, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [portalMode, setPortalMode] = useState('sekolah'); // 'sekolah' atau 'perusahaan'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Mohon masukkan username/email dan password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await login(identifier.trim(), password);
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali akun Anda.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    setError('');
    if (role === 'admin') {
      setIdentifier('admin');
      setPassword('password123');
    } else if (role === 'guru') {
      setIdentifier('budi@hadirku.sch.id');
      setPassword('password123');
    } else if (role === 'siswa') {
      setIdentifier('20240101');
      setPassword('password123');
    } else if (role === 'hrd') {
      setIdentifier('hrd@informatikaglobal.co.id');
      setPassword('password123');
    } else if (role === 'karyawan') {
      setIdentifier('EMP-9021');
      setPassword('password123');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Portal Switcher Tabs */}
        <div className="flex bg-[#111827]/90 p-1.5 rounded-2xl border border-[#1E293B] mb-5 shadow-lg">
          <button
            type="button"
            onClick={() => setPortalMode('sekolah')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              portalMode === 'sekolah'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Portal Sekolah</span>
          </button>
          <button
            type="button"
            onClick={() => setPortalMode('perusahaan')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              portalMode === 'perusahaan'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Portal Perusahaan (PT)</span>
          </button>
        </div>

        {/* Logo and Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-xl shadow-blue-500/25 mb-3 border border-blue-400/30">
            {portalMode === 'sekolah' ? (
              <ShieldCheck className="w-8 h-8 text-white" />
            ) : (
              <Building2 className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white">
            {portalMode === 'sekolah' ? 'VeloCheck Sekolah' : 'PRESENSIKU Korporat'}
          </h1>
          <p className="text-xs font-semibold text-blue-400 tracking-widest uppercase mt-0.5">
            {portalMode === 'sekolah'
              ? 'Presensi Sekolah (SMK KARTIKA X-1)'
              : 'Presensi PT Informatika Global Tbk'}
          </p>

          <div className="mt-2.5 inline-flex flex-col items-center px-3.5 py-1.5 rounded-xl bg-[#1E293B]/70 border border-[#334155]/60 text-[10px] text-slate-300">
            {portalMode === 'sekolah' ? (
              <>
                <span className="text-emerald-400 font-semibold">Sesi Pagi • Masuk: 06:30 • Batas Terlambat: 06:35 • Pulang: 11:50 WIB</span>
                <span className="text-amber-400 font-semibold mt-0.5">Sesi Siang • Masuk: 12:30 • Pulang: 17:50 WIB</span>
              </>
            ) : (
              <span className="text-emerald-400 font-semibold">Jam Kerja Kantor • Masuk: 08:00 • Batas Terlambat: 08:30 • Pulang: 17:00 WIB</span>
            )}
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#111827]/90 backdrop-blur-xl border border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-2xl relative">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-white">
              {portalMode === 'sekolah' ? 'Masuk Portal Sekolah' : 'Masuk Portal Perusahaan'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Silakan masukkan kredensial akun terdaftar Anda.
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-2.5 text-xs text-rose-400 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Identifier input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {portalMode === 'sekolah' ? 'Username / Email / NISN' : 'Employee ID / NIK / Email Kantor'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={
                    portalMode === 'sekolah'
                      ? 'admin / guru_budi / 20240101'
                      : 'admin / hrd@informatikaglobal.co.id / EMP-9021'
                  }
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password akun..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
            >
              {loading ? (
                <span>Memverifikasi Akun...</span>
              ) : (
                <>
                  <span>Masuk ke {portalMode === 'sekolah' ? 'Portal Sekolah' : 'Portal Perusahaan'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selection */}
          <div className="mt-5 pt-4 border-t border-[#1E293B]">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>Akun Demo Cepat ({portalMode === 'sekolah' ? 'Sekolah' : 'Perusahaan'}):</span>
            </div>

            {portalMode === 'sekolah' ? (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin')}
                  className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-center transition-all group"
                >
                  <div className="text-[11px] font-bold text-blue-400 group-hover:text-blue-300">Admin</div>
                  <div className="text-[9px] text-slate-400">admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('guru')}
                  className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-center transition-all group"
                >
                  <div className="text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300">Guru</div>
                  <div className="text-[9px] text-slate-400">guru_budi</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('siswa')}
                  className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-center transition-all group"
                >
                  <div className="text-[11px] font-bold text-purple-400 group-hover:text-purple-300">Siswa</div>
                  <div className="text-[9px] text-slate-400">20240101</div>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDemoCredentials('admin')}
                  className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-center transition-all group"
                >
                  <div className="text-[11px] font-bold text-blue-400 group-hover:text-blue-300">Super Admin</div>
                  <div className="text-[9px] text-slate-400">admin</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('hrd')}
                  className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-center transition-all group"
                >
                  <div className="text-[11px] font-bold text-purple-400 group-hover:text-purple-300">HRD PT</div>
                  <div className="text-[9px] text-slate-400">hrd_siti</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDemoCredentials('karyawan')}
                  className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-center transition-all group"
                >
                  <div className="text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300">Karyawan</div>
                  <div className="text-[9px] text-slate-400">EMP-9021</div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-500 mt-5">
          Sistem Presensi Terpadu Sekolah & Perusahaan
        </p>
      </div>
    </div>
  );
};

export default LoginPage;