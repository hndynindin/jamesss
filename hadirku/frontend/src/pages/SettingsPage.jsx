import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  ShieldCheck, 
  Database,
  Server
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [academicYears, setAcademicYears] = useState([]);
  const [profileMsg, setProfileMsg] = useState({ show: false, text: '', isError: false });
  const [saving, setSaving] = useState(false);
  const [healthInfo, setHealthInfo] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [resMaster, resHealth] = await Promise.all([
          api.get('/reports/master'),
          api.get('/health')
        ]);
        if (resMaster.success) setAcademicYears(resMaster.data.academic_years);
        if (resHealth) setHealthInfo(resHealth);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg({ show: false, text: '', isError: false });

    if (profileForm.new_password) {
      if (profileForm.new_password !== profileForm.confirm_password) {
        setProfileMsg({ show: true, text: 'Konfirmasi password baru tidak cocok.', isError: true });
        return;
      }
      if (!profileForm.old_password) {
        setProfileMsg({ show: true, text: 'Password lama diperlukan untuk mengganti password.', isError: true });
        return;
      }
    }

    setSaving(true);
    try {
      const res = await api.put('/auth/profile', {
        username: profileForm.username,
        email: profileForm.email,
        old_password: profileForm.old_password || undefined,
        new_password: profileForm.new_password || undefined
      });

      if (res.success) {
        updateUser(res.user);
        setProfileMsg({ show: true, text: 'Profil dan kredensial Anda berhasil diperbarui.', isError: false });
        setProfileForm(prev => ({ ...prev, old_password: '', new_password: '', confirm_password: '' }));
      }
    } catch (err) {
      setProfileMsg({ show: true, text: err.message || 'Gagal memperbarui profil.', isError: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 flex items-center justify-between">
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-white flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-400" />
            <span>Pengaturan Akun & Konfigurasi Sistem</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola profil pengguna, keamanan kata sandi, dan status operasional sistem
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs font-semibold text-blue-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="uppercase">Role: {user?.role}</span>
        </div>
      </div>

      {/* Profile & Password Settings Form */}
      <div className="p-6 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 space-y-5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <span>Profil Pengguna & Keamanan Akun</span>
          </h3>
          <p className="text-xs text-slate-400">Perbarui informasi nama pengguna, email, dan kata sandi</p>
        </div>

        {profileMsg.show && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold flex items-center space-x-2.5 ${
            profileMsg.isError ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400' : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
          }`}>
            {profileMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
            <span>{profileMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Username</label>
              <input
                type="text"
                required
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#334155]/50">
            <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Ganti Kata Sandi (Kosongkan jika tidak ingin mengubah):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Password Lama</label>
                <input
                  type="password"
                  value={profileForm.old_password}
                  onChange={(e) => setProfileForm({ ...profileForm, old_password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Password Baru</label>
                <input
                  type="password"
                  value={profileForm.new_password}
                  onChange={(e) => setProfileForm({ ...profileForm, new_password: e.target.value })}
                  placeholder="Minimal 6 karakter"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Ulangi Password Baru</label>
                <input
                  type="password"
                  value={profileForm.confirm_password}
                  onChange={(e) => setProfileForm({ ...profileForm, confirm_password: e.target.value })}
                  placeholder="Konfirmasi password"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              {saving ? 'Menyimpan Perubahan...' : 'Simpan Perubahan Profil'}
            </button>
          </div>
        </form>
      </div>

      {/* Academic Year Information */}
      <div className="p-6 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 space-y-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Tahun Ajaran & Semester Aktif</span>
          </h3>
          <p className="text-xs text-slate-400">Periode kalender akademik yang berlaku pada sistem</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {academicYears.map(ay => (
            <div 
              key={ay.id} 
              className={`p-3.5 rounded-xl border flex items-center justify-between ${
                ay.is_active ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#0B1120] border-[#334155]'
              }`}
            >
              <div>
                <h4 className="text-xs font-bold text-white">{ay.name}</h4>
                <p className="text-[11px] text-slate-400">
                  Semester {ay.semester} ({ay.start_date} sd {ay.end_date})
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                ay.is_active ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-700/50 text-slate-400'
              }`}>
                {ay.is_active ? 'Aktif Saat Ini' : 'Arsip'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* System Technical Specs & Architecture Box */}
      <div className="p-5 rounded-2xl bg-[#111827] border border-[#1E293B] space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
          <Server className="w-3.5 h-3.5 text-blue-400" />
          <span>Informasi Teknis & Spesifikasi Sistem VeloCheck</span>
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#1E293B]/50 border border-[#334155]/40">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Backend Engine</span>
            <p className="font-mono font-bold text-white mt-0.5">Node.js + Express</p>
          </div>
          <div className="p-3 rounded-xl bg-[#1E293B]/50 border border-[#334155]/40">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Database Driver</span>
            <p className="font-mono font-bold text-white mt-0.5">MySQL 8 (mysql2)</p>
          </div>
          <div className="p-3 rounded-xl bg-[#1E293B]/50 border border-[#334155]/40">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Frontend Engine</span>
            <p className="font-mono font-bold text-white mt-0.5">React.js + Tailwind</p>
          </div>
          <div className="p-3 rounded-xl bg-[#1E293B]/50 border border-[#334155]/40">
            <span className="text-[10px] text-slate-500 uppercase font-semibold">Status Operasional</span>
            <p className="font-mono font-bold text-emerald-400 mt-0.5">{healthInfo?.mode || 'ONLINE'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
