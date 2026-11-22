import React from 'react';
import {
  LayoutDashboard,
  UserCheck,
  Users,
  GraduationCap,
  School,
  FileText,
  QrCode,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    if (user?.role === 'admin') {
      return [
        { id: 'dashboard', label: 'Dashboard Admin', icon: LayoutDashboard },
        { id: 'attendance', label: 'Sistem Absensi', icon: UserCheck, badge: 'Inti' },
        { id: 'students', label: 'Data Siswa', icon: Users },
        { id: 'teachers', label: 'Data Guru', icon: GraduationCap },
        { id: 'classes', label: 'Data Kelas', icon: School },
        { id: 'reports', label: 'Laporan & Rekap', icon: FileText },
        { id: 'scanner', label: 'Scan Presensi QR', icon: QrCode },
        { id: 'settings', label: 'Pengaturan Sistem', icon: Settings },
      ];
    } else if (user?.role === 'guru') {
      return [
        { id: 'dashboard', label: 'Dashboard Guru', icon: LayoutDashboard },
        { id: 'attendance', label: 'Input Absensi Kelas', icon: UserCheck, badge: 'Input' },
        { id: 'students', label: 'Daftar Siswa', icon: Users },
        { id: 'reports', label: 'Rekap Presensi', icon: FileText },
        { id: 'scanner', label: 'Scan Presensi QR', icon: QrCode },
        { id: 'settings', label: 'Profil Saya', icon: Settings },
      ];
    } else {
      // Siswa
      return [
        { id: 'dashboard', label: 'Dashboard Siswa', icon: LayoutDashboard },
        { id: 'reports', label: 'Riwayat Presensi', icon: FileText },
        { id: 'qr_badge', label: 'QR Card Siswa', icon: QrCode, badge: 'Digital ID' },
        { id: 'settings', label: 'Profil Saya', icon: Settings },
      ];
    }
  };

  const menuItems = getMenuItems();

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case 'admin':
        return { label: 'Administrator', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'guru':
        return { label: 'Guru Pengampu', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'siswa':
        return { label: 'Siswa / Siswi', bg: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Pengguna', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 bg-[#111827] border-r border-[#1E293B] flex flex-col transition-transform duration-300 ease-in-out ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* App Logo & Header */}
        <div className="p-5 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-wider text-white">VeloCheck</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30">PRO</span>
              </div>
              <p className="text-[11px] text-blue-400 font-medium">SMK KARTIKA X-1</p>
            </div>
          </div>
        </div>

        {/* User Card in Sidebar */}
        <div className="px-4 py-3 mx-3 my-3 rounded-xl bg-[#1E293B]/70 border border-[#334155]/60 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-400/30 flex items-center justify-center font-bold text-white text-sm">
            {user?.profile?.full_name?.charAt(0) || user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user?.profile?.full_name || user?.username}
            </p>
            <span className={`inline-block text-[10px] px-1.5 py-0.2 rounded font-medium border ${roleInfo.bg}`}>
              {roleInfo.label}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Menu Utama
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25 font-semibold'
                    : 'text-slate-300 hover:bg-[#1E293B] hover:text-white'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-blue-900/40 text-blue-300 border border-blue-500/30'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer with Logout */}
        <div className="p-3 border-t border-[#1E293B]">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all hover:border-red-500/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
