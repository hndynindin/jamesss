import React, { useState, useEffect } from 'react';
import { Menu, QrCode, Clock, Bell, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ activeTab, setMobileOpen, onOpenScanner }) => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = (tab) => {
    switch (tab) {
      case 'dashboard':
        return user?.role === 'siswa' ? 'Dashboard Siswa' : user?.role === 'guru' ? 'Dashboard Guru' : 'Dashboard Utama Admin';
      case 'attendance':
        return 'Sistem Presensi & Input Kehadiran Siswa';
      case 'students':
        return 'Manajemen Data Siswa SMK';
      case 'teachers':
        return 'Manajemen Tenaga Pendidik (Guru)';
      case 'classes':
        return 'Manajemen Kelas & Jurusan TKJ';
      case 'reports':
        return 'Laporan & Rekapitulasi Presensi';
      case 'scanner':
        return 'Pemindai Presensi Cepat QR Code';
      case 'qr_badge':
        return 'Digital Student Card & QR Badge';
      case 'settings':
        return 'Pengaturan & Konfigurasi Sistem';
      default:
        return 'VeloCheck';
    }
  };

  const formattedDate = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <header className="h-16 bg-[#111827]/80 backdrop-blur-md border-b border-[#1E293B] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left section: Hamburger & Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-[#1E293B] text-slate-300 hover:text-white lg:hidden border border-[#334155]"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm lg:text-base font-bold text-white tracking-wide">
            {getPageTitle(activeTab)}
          </h1>
          <p className="text-[11px] text-blue-400 font-medium hidden sm:block">
            Presensi Sekolah (SMK KARTIKA X-1) • TP 2024/2025
          </p>
        </div>
      </div>

      {/* Center/Schedule indicator */}
      <div className="hidden xl:flex items-center space-x-2 px-3 py-1 rounded-xl bg-[#0B1120] border border-[#334155]/60 text-[10px]">
        <span className="font-bold text-emerald-400">Pagi: 06:30 (Telat: 06:35) - 11:50</span>
        <span className="text-slate-600">•</span>
        <span className="font-bold text-amber-400">Siang: 12:30 - 17:50 WIB</span>
      </div>

      {/* Right section: Quick Actions, Clock, User Status */}
      <div className="flex items-center space-x-3">
        {/* Quick QR Scanner Button (Only visible for admin & guru) */}
        {user?.role !== 'siswa' && onOpenScanner && (
          <button
            onClick={onOpenScanner}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>
        )}

        {/* Live Clock */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#1E293B] border border-[#334155]/60 text-xs">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-300 font-medium">{formattedDate}</span>
          <span className="text-slate-500">•</span>
          <span className="font-mono text-blue-400 font-bold">{formattedTime}</span>
        </div>

        {/* Online Status Pill */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Server Aktif</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
