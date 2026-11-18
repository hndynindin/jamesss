import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import AppLayout from './components/AppLayout';
import Toast from './components/Toast';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MoodTrackerPage from './pages/MoodTrackerPage';
import JournalPage from './pages/JournalPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SelfCarePage from './pages/SelfCarePage';
import ProfilePage from './pages/ProfilePage';

const VALID_PAGES = ['dashboard', 'mood', 'journal', 'analytics', 'selfcare', 'profile'];

function getHashPage() {
  const raw = window.location.hash.replace('#', '').trim();
  return VALID_PAGES.includes(raw) ? raw : 'dashboard';
}

function MoodSpaceRouter() {
  const { user, initializing } = useApp();
  const [currentPage, setCurrentPage] = useState(getHashPage);

  useEffect(() => {
    const onHashChange = () => setCurrentPage(getHashPage());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (page) => {
    if (!VALID_PAGES.includes(page)) return;
    window.location.hash = page;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F3FC] dark:bg-[#17141F] text-[#393343] dark:text-[#F3EEF9]">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8D78A9] to-[#C7B1E5] flex items-center justify-center text-white shadow-lg animate-float-slow">
          <Sparkles className="w-7 h-7" />
        </div>
        <p className="mt-4 text-sm font-semibold text-[#8D78A9]">Menyiapkan MoodSpace...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <AuthPage />
        <Toast />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'mood':
        return <MoodTrackerPage />;
      case 'journal':
        return <JournalPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'selfcare':
        return <SelfCarePage />;
      case 'profile':
        return <ProfilePage />;
      case 'dashboard':
      default:
        return <DashboardPage onNavigate={navigate} />;
    }
  };

  return (
    <>
      <AppLayout currentPage={currentPage} onNavigate={navigate}>
        {renderPage()}
      </AppLayout>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MoodSpaceRouter />
    </AppProvider>
  );
}

