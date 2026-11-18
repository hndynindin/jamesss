import React, { useState } from 'react';
import {
  User,
  Lock,
  Sun,
  Moon,
  LogOut,
  Upload,
  Check,
  Loader2,
  Database,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PRESET_AVATARS } from '../constants/moods';
import { isSupabaseConfigured } from '../lib/supabase';
import AvatarDisplay from '../components/AvatarDisplay';

export default function ProfilePage() {
  const {
    user,
    settings,
    updateProfile,
    changePassword,
    updateSettings,
    logout,
    showToast,
  } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || 'preset:av-1');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const isDark = settings.theme === 'dark';

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      showToast('Ukuran foto maksimal 1 MB.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      showToast('Nama minimal 2 karakter.', 'error');
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile({ name, avatar });
    } catch (err) {
      showToast(err.message || 'Gagal memperbarui profil.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    if (!currentPassword) {
      setPasswordError('Masukkan kata sandi saat ini.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Gagal mengubah kata sandi.');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold">Profil & Pengaturan</h2>
        <p className="text-sm text-[#8D78A9] dark:text-[#B4A7CC]">
          Kelola identitas akun, tampilan aplikasi, dan keamanan pribadimu.
        </p>
      </div>

      {/* Profile Section */}
      <section className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
        <h3 className="text-base font-bold flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-[#8D78A9]" />
          Informasi Profil
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <AvatarDisplay avatar={avatar} name={name} size="lg" />
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-[#8D78A9]">
                Pilih avatar atau unggah foto profil
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_AVATARS.map((p) => {
                  const key = `preset:${p.id}`;
                  const active = avatar === key;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setAvatar(key)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-base border-2 transition cursor-pointer ${
                        active
                          ? 'border-[#8D78A9] scale-110'
                          : 'border-transparent hover:border-[#C7B1E5]'
                      }`}
                      style={{ backgroundColor: p.bg }}
                      title={p.label}
                    >
                      {p.emoji}
                    </button>
                  );
                })}

                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F3FC] dark:bg-[#2B243D] border border-[#E7DDF5] dark:border-[#3A3250] text-xs font-semibold cursor-pointer hover:border-[#C7B1E5] transition">
                  <Upload className="w-3.5 h-3.5 text-[#8D78A9]" />
                  Unggah Foto
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">Nama Tampilan</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Email Akun</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F3FC]/60 dark:bg-[#191523]/60 border border-[#E7DDF5] dark:border-[#312A42] text-sm opacity-70 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 rounded-2xl bg-[#8D78A9] hover:bg-[#7A6596] text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
            >
              {savingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Simpan Profil
            </button>
          </div>
        </form>
      </section>

      {/* Appearance & Storage */}
      <section className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm space-y-4">
        <h3 className="text-base font-bold">Preferensi Tampilan</h3>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523]">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="w-5 h-5 text-[#C7B1E5]" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500" />
            )}
            <div>
              <p className="text-sm font-bold">Tema Aplikasi</p>
              <p className="text-xs text-[#8D78A9]">
                Saat ini menggunakan {isDark ? 'Mode Gelap' : 'Mode Terang'}
              </p>
            </div>
          </div>

          <button
            onClick={() => updateSettings({ theme: isDark ? 'light' : 'dark' })}
            className="px-4 py-2 rounded-xl bg-[#8D78A9] text-white text-xs font-semibold cursor-pointer"
          >
            Ganti ke {isDark ? 'Terang' : 'Gelap'}
          </button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF9F1] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42]">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-[#8D78A9]" />
            <div>
              <p className="text-sm font-bold">Penyimpanan Data</p>
              <p className="text-xs text-[#8D78A9]">
                {isSupabaseConfigured
                  ? 'Terhubung dengan Supabase Cloud'
                  : 'Mode Lokal (localStorage) — siap dihubungkan ke Supabase'}
              </p>
            </div>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full bg-[#E7DDF5] dark:bg-[#312945] font-bold text-[#8D78A9] dark:text-[#C7B1E5]">
            {isSupabaseConfigured ? 'Cloud' : 'Lokal'}
          </span>
        </div>
      </section>

      {/* Change Password */}
      <section className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
        <h3 className="text-base font-bold flex items-center gap-2 mb-4">
          <Lock className="w-4 h-4 text-[#8D78A9]" />
          Ubah Kata Sandi
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1.5">Kata Sandi Saat Ini</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">Kata Sandi Baru</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1.5">Konfirmasi Baru</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
              />
            </div>
          </div>

          {passwordError && <p className="text-xs text-red-500">{passwordError}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={savingPassword}
              className="px-5 py-2.5 rounded-2xl bg-[#E7DDF5] dark:bg-[#312945] hover:bg-[#C7B1E5]/60 text-[#393343] dark:text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
            >
              {savingPassword && <Loader2 className="w-4 h-4 animate-spin" />}
              Perbarui Kata Sandi
            </button>
          </div>
        </form>
      </section>

      {/* Logout */}
      <div className="flex justify-end">
        <button
          onClick={logout}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 dark:text-red-300 text-sm font-semibold transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}

