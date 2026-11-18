import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  HeartHandshake,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthPage({ initialMode = 'login', onSwitchMode }) {
  const { login, register } = useApp();
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setServerError('');
    if (onSwitchMode) onSwitchMode(nextMode);
  };

  const validate = () => {
    const next = {};
    if (!isLogin && name.trim().length < 2) {
      next.name = 'Nama lengkap minimal 2 karakter.';
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = 'Masukkan alamat email yang valid.';
    }
    if (!password || password.length < 6) {
      next.password = 'Kata sandi minimal 6 karakter.';
    }
    if (!isLogin && password !== confirmPassword) {
      next.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
    } catch (err) {
      setServerError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setServerError('');
    setSubmitting(true);
    try {
      await login({ email: 'demo@moodspace.id', password: 'demo1234' });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F7F3FC] dark:bg-[#17141F] relative overflow-hidden">
      {/* Decorative soft blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#E7DDF5] dark:bg-[#2B233D] blur-3xl opacity-70" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#FFF9F1] dark:bg-[#241E33] blur-3xl opacity-80" />

      <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden shadow-xl border border-[#E7DDF5] dark:border-[#322C42] bg-white/90 dark:bg-[#211D2B]/95 backdrop-blur-md relative z-10 animate-fade-in-up">
        {/* Left Aesthetic Panel */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-gradient-to-br from-[#E7DDF5] via-[#F7F3FC] to-[#FFF9F1] dark:from-[#2A233B] dark:via-[#221D30] dark:to-[#1C1826] border-r border-[#E7DDF5] dark:border-[#322C42]">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/80 dark:bg-[#2E2740] shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-[#8D78A9] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#393343] dark:text-white">
                MoodSpace
              </span>
            </div>

            <h1 className="mt-8 text-3xl font-bold leading-snug text-[#393343] dark:text-[#F3EEF9]">
              Ruang Kecil untuk Memahami Dirimu.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#6E637E] dark:text-[#BFB3D4]">
              Catat suasana hatimu setiap hari, tulis jurnal pribadi yang aman, dan bangun kebiasaan
              merawat diri dengan lembut.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#FFF9F1]/90 dark:bg-[#2B253A] border border-[#E7DDF5] dark:border-[#3E3554] shadow-sm">
              <div className="flex items-center gap-2.5 text-[#8D78A9] dark:text-[#C7B1E5] font-semibold text-sm">
                <HeartHandshake className="w-4 h-4" />
                <span>Privat & Aman</span>
              </div>
              <p className="mt-1 text-xs text-[#6E637E] dark:text-[#BFB3D4]">
                Setiap jurnal dan catatan emosimu hanya tersimpan untuk akunmu sendiri.
              </p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-6 sm:p-10 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[#8D78A9] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-[#393343] dark:text-white">MoodSpace</span>
          </div>

          <div className="flex gap-2 p-1 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition ${
                isLogin
                  ? 'bg-white dark:bg-[#2C263B] text-[#393343] dark:text-white shadow-sm'
                  : 'text-[#8D78A9] hover:text-[#393343] dark:hover:text-white'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition ${
                !isLogin
                  ? 'bg-white dark:bg-[#2C263B] text-[#393343] dark:text-white shadow-sm'
                  : 'text-[#8D78A9] hover:text-[#393343] dark:hover:text-white'
              }`}
            >
              Daftar
            </button>
          </div>

          <h2 className="text-2xl font-bold text-[#393343] dark:text-white">
            {isLogin ? 'Selamat Datang Kembali' : 'Buat Ruang Pribadimu'}
          </h2>
          <p className="text-sm text-[#8D78A9] dark:text-[#B9ABD0] mt-1 mb-6">
            {isLogin
              ? 'Masuk untuk melanjutkan catatan suasana hati dan jurnalmu.'
              : 'Daftar gratis untuk mulai memahami emosimu setiap hari.'}
          </p>

          {serverError && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs sm:text-sm text-red-700 dark:text-red-300">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#393343] dark:text-[#E5DCF5] mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8D78A9] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Nadia Putri"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#342D46] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5] transition"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#393343] dark:text-[#E5DCF5] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8D78A9] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#342D46] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5] transition"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#393343] dark:text-[#E5DCF5] mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8D78A9] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full pl-10 pr-11 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#342D46] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D78A9] hover:text-[#393343] dark:hover:text-white p-1"
                  aria-label="Tampilkan kata sandi"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-[#393343] dark:text-[#E5DCF5] mb-1.5">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8D78A9] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#342D46] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5] transition"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-[#8D78A9] hover:bg-[#7A6596] text-white font-semibold text-sm shadow-md shadow-[#8D78A9]/20 flex items-center justify-center gap-2 transition disabled:opacity-60 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Masuk ke MoodSpace' : 'Daftar Sekarang'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {isLogin && (
            <div className="mt-5 pt-5 border-t border-[#E7DDF5] dark:border-[#322C42]">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FFF9F1] dark:bg-[#2A233A] border border-[#E7DDF5] dark:border-[#43395B] hover:border-[#C7B1E5] text-xs font-semibold text-[#393343] dark:text-[#E5DCF5] transition cursor-pointer"
              >
                ✨ Coba Cepat dengan Akun Demo (demo@moodspace.id)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

