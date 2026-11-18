import React from 'react';
import {
  LayoutDashboard,
  SmilePlus,
  BookHeart,
  BarChart3,
  HeartHandshake,
  Settings,
  LogOut,
  Sparkles,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AvatarDisplay from './AvatarDisplay';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Beranda', icon: LayoutDashboard },
  { id: 'mood', label: 'Catat Mood', icon: SmilePlus },
  { id: 'journal', label: 'Jurnal Saya', icon: BookHeart },
  { id: 'analytics', label: 'Analitik', icon: BarChart3 },
  { id: 'selfcare', label: 'Self-Care', icon: HeartHandshake },
  { id: 'profile', label: 'Profil', icon: Settings },
];

export default function AppLayout({ currentPage, onNavigate, children }) {
  const { user, settings, updateSettings, logout } = useApp();
  const isDark = settings.theme === 'dark';

  const toggleTheme = () => {
    updateSettings({ theme: isDark ? 'light' : 'dark' });
  };

  return (
    <div className="min-h-screen bg-[#F7F3FC] dark:bg-[#17141F] text-[#393343] dark:text-[#F3EEF9] flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-white/90 dark:bg-[#1F1B29]/95 backdrop-blur-md border-r border-[#E7DDF5] dark:border-[#312A42] p-6 justify-between z-30">
        <div>
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8D78A9] to-[#C7B1E5] flex items-center justify-center text-white shadow-md shadow-[#8D78A9]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none tracking-tight">MoodSpace</h1>
              <p className="text-[11px] text-[#8D78A9] dark:text-[#B9ABD0] mt-1">
                Ruang Memahami Diri
              </p>
            </div>
          </div>

          <nav className="space-y-1.5" aria-label="Navigasi utama">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#E7DDF5] dark:bg-[#312945] text-[#393343] dark:text-white shadow-sm'
                      : 'text-[#6E637E] dark:text-[#B4A7CC] hover:bg-[#F7F3FC] dark:hover:bg-[#272136]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active ? 'text-[#8D78A9] dark:text-[#C7B1E5]' : ''
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#E7DDF5] dark:border-[#312A42]">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-[#FFF9F1] dark:bg-[#282238] border border-[#E7DDF5] dark:border-[#3A3250] text-xs font-semibold hover:border-[#C7B1E5] transition cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {isDark ? <Moon className="w-4 h-4 text-[#C7B1E5]" /> : <Sun className="w-4 h-4 text-amber-500" />}
              {isDark ? 'Mode Gelap' : 'Mode Terang'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#E7DDF5] dark:bg-[#393050] text-[#8D78A9] dark:text-[#C7B1E5]">
              Ubah
            </span>
          </button>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#262033]">
            <AvatarDisplay avatar={user?.avatar} name={user?.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold truncate">{user?.name}</p>
              <p className="text-[11px] text-[#8D78A9] dark:text-[#B4A7CC] truncate">
                {user?.email}
              </p>
            </div>
            <button
              onClick={logout}
              title="Keluar"
              aria-label="Keluar"
              className="p-2 rounded-xl text-[#8D78A9] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-[#1F1B29]/95 backdrop-blur-md border-b border-[#E7DDF5] dark:border-[#312A42] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8D78A9] to-[#C7B1E5] flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-bold text-base">MoodSpace</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Ubah tema"
            className="p-2 rounded-xl bg-[#F7F3FC] dark:bg-[#2A233A] text-[#8D78A9] dark:text-[#C7B1E5]"
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
          </button>
          <button onClick={() => onNavigate('profile')} aria-label="Profil">
            <AvatarDisplay avatar={user?.avatar} name={user?.name} size="sm" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:pl-72 pb-24 md:pb-12">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8 animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#1F1B29]/95 backdrop-blur-md border-t border-[#E7DDF5] dark:border-[#312A42] px-2 py-1.5 flex justify-around items-center"
        aria-label="Navigasi seluler"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition ${
                active
                  ? 'text-[#8D78A9] dark:text-[#C7B1E5] bg-[#E7DDF5]/60 dark:bg-[#312945]'
                  : 'text-[#8D78A9]/70 dark:text-[#9D8FB5]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

