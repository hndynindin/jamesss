import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AttendancePage from './pages/AttendancePage';
import StudentsPage from './pages/StudentsPage';
import TeachersPage from './pages/TeachersPage';
import ClassesPage from './pages/ClassesPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import QRScannerModal from './components/QRScannerModal';
import StudentQRBadgeModal from './components/StudentQRBadgeModal';

function App() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [attendanceClassId, setAttendanceClassId] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 animate-pulse flex items-center justify-center text-white font-extrabold text-xl shadow-xl shadow-blue-600/30">
            V
          </div>
          <p className="text-xs font-semibold text-slate-400 tracking-wider">Memuat Sistem VeloCheck...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleSelectClassForAttendance = (classId) => {
    setAttendanceClassId(classId);
    setActiveTab('attendance');
  };

  const handleTabChange = (tabId) => {
    if (tabId === 'scanner') {
      setIsScannerOpen(true);
    } else {
      setActiveTab(tabId);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user?.role === 'admin') {
          return <AdminDashboard setActiveTab={setActiveTab} onOpenScanner={() => setIsScannerOpen(true)} />;
        } else if (user?.role === 'guru') {
          return <TeacherDashboard setActiveTab={setActiveTab} onSelectClassForAttendance={handleSelectClassForAttendance} />;
        } else {
          return <StudentDashboard />;
        }

      case 'attendance':
        return <AttendancePage initialClassId={attendanceClassId} />;

      case 'students':
        return <StudentsPage />;

      case 'teachers':
        return <TeachersPage />;

      case 'classes':
        return <ClassesPage />;

      case 'reports':
        return <ReportsPage />;

      case 'qr_badge':
        return <StudentDashboard />;

      case 'settings':
        return <SettingsPage />;

      default:
        return <AdminDashboard setActiveTab={setActiveTab} onOpenScanner={() => setIsScannerOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex flex-row">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          activeTab={activeTab}
          setMobileOpen={setMobileOpen}
          onOpenScanner={() => setIsScannerOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto animate-fadeIn">
          {renderContent()}
        </main>
      </div>

      {/* Global QR Scanner Modal */}
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAttendanceRecorded={(data) => {
          // If on attendance page, can trigger re-fetch if needed
        }}
      />
    </div>
  );
}

export default App;
