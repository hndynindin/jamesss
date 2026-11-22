import React, { useState, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  School,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  Calendar,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import api from '../services/api';
import StatCard from '../components/StatCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminDashboard = ({ setActiveTab, onOpenScanner }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const loadDashboard = async (date) => {
    setLoading(true);
    try {
      const res = await api.get(`/dashboard/admin?date=${date || selectedDate}`);
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard(selectedDate);
  }, [selectedDate]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Bar Chart Configuration (7-Day Attendance Trend)
  const trendLabels = (stats?.trend || []).map(t => {
    const d = new Date(t.date);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  });

  const barChartData = {
    labels: trendLabels.length ? trendLabels : ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
    datasets: [
      {
        label: 'Hadir',
        data: (stats?.trend || []).map(t => t.hadir),
        backgroundColor: '#22C55E',
        borderRadius: 6
      },
      {
        label: 'Izin',
        data: (stats?.trend || []).map(t => t.izin),
        backgroundColor: '#EAB308',
        borderRadius: 6
      },
      {
        label: 'Sakit',
        data: (stats?.trend || []).map(t => t.sakit),
        backgroundColor: '#3B82F6',
        borderRadius: 6
      },
      {
        label: 'Alpa',
        data: (stats?.trend || []).map(t => t.alpa),
        backgroundColor: '#EF4444',
        borderRadius: 6
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94A3B8', font: { size: 11, family: 'sans-serif' } }
      },
      tooltip: {
        backgroundColor: '#1E293B',
        titleColor: '#FFFFFF',
        bodyColor: '#CBD5E1',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: '#1E293B' },
        ticks: { color: '#94A3B8', font: { size: 11 } }
      },
      y: {
        grid: { color: '#1E293B' },
        ticks: { color: '#94A3B8', font: { size: 11 } }
      }
    }
  };

  // Doughnut Chart Configuration (Today Status Distribution)
  const doughnutData = {
    labels: ['Hadir', 'Izin', 'Sakit', 'Alpa'],
    datasets: [
      {
        data: [stats?.hadir || 0, stats?.izin || 0, stats?.sakit || 0, stats?.alpa || 0],
        backgroundColor: ['#22C55E', '#EAB308', '#3B82F6', '#EF4444'],
        borderColor: '#0B1120',
        borderWidth: 3
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94A3B8', font: { size: 11 }, padding: 14 }
      }
    },
    cutout: '72%'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Date Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-[#1E293B] to-[#111827] border border-blue-500/20">
        <div>
          <h2 className="text-lg lg:text-xl font-extrabold text-white">
            Selamat Datang, Administrator
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Presensi Sekolah (SMK KARTIKA X-1) • Real-time Monitoring Kehadiran
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
              Sesi Pagi: 06:30 WIB (Batas Terlambat: 06:35 WIB) • Pulang: 11:50 WIB
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
              Sesi Siang: 12:30 WIB • Pulang: 17:50 WIB
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#0B1120] border border-[#334155]">
            <Calendar className="w-4 h-4 text-blue-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={() => setActiveTab('attendance')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline">Input Absensi</span>
          </button>
        </div>
      </div>

      {/* Main 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Siswa"
          value={stats?.total_students || 0}
          subtitle="Siswa terdaftar aktif"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Guru"
          value={stats?.total_teachers || 0}
          subtitle="Tenaga pendidik terdaftar"
          icon={GraduationCap}
          color="purple"
        />
        <StatCard
          title="Total Kelas"
          value={stats?.total_classes || 0}
          subtitle="Rombongan belajar TKJ"
          icon={School}
          color="yellow"
        />
        <StatCard
          title="Kehadiran Hari Ini"
          value={`${stats?.attendance_rate || 0}%`}
          subtitle={`${stats?.hadir || 0} dari ${stats?.total_students || 0} siswa`}
          icon={CheckCircle2}
          color="green"
          badge="Live"
        />
      </div>

      {/* Attendance Status Today (Hadir, Izin, Sakit, Alpa) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-400 tracking-wider">HADIR</span>
            <h4 className="text-xl font-black text-white mt-0.5">{stats?.hadir || 0}</h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            H
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-400 tracking-wider">IZIN</span>
            <h4 className="text-xl font-black text-white mt-0.5">{stats?.izin || 0}</h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
            I
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-blue-400 tracking-wider">SAKIT</span>
            <h4 className="text-xl font-black text-white mt-0.5">{stats?.sakit || 0}</h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
            S
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-400 tracking-wider">ALPA</span>
            <h4 className="text-xl font-black text-white mt-0.5">{stats?.alpa || 0}</h4>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
            A
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart (2 Cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span>Tren Kehadiran 7 Hari Terakhir</span>
              </h3>
              <p className="text-[11px] text-slate-400">Grafik perbandingan status kehadiran harian</p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
            >
              <span>Lihat Rekap</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="h-64">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart (1 Col) */}
        <div className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 flex flex-col">
          <div className="mb-2">
            <h3 className="text-sm font-bold text-white">Distribusi Hari Ini</h3>
            <p className="text-[11px] text-slate-400">Proporsi status presensi tanggal {selectedDate}</p>
          </div>
          <div className="h-56 relative flex items-center justify-center my-auto">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-2xl font-black text-white">{stats?.attendance_rate || 0}%</span>
              <span className="text-[10px] text-slate-400">Kehadiran</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attendance Activity List */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Aktivitas Absensi Terbaru</h3>
            <p className="text-[11px] text-slate-400">Log pencatatan presensi siswa yang masuk ke sistem</p>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300"
          >
            Buka Form Absensi
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-bold border-b border-[#334155]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">Waktu / Tanggal</th>
                <th className="px-4 py-3">NIS</th>
                <th className="px-4 py-3">Nama Siswa</th>
                <th className="px-4 py-3">Kelas</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 rounded-r-xl">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {stats?.recent_activities?.length > 0 ? (
                stats.recent_activities.map((act) => (
                  <tr key={act.id} className="hover:bg-[#1E293B]/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-300">
                      <div>{act.date}</div>
                      <div className="text-[10px] text-slate-500">{act.time_in} WIB</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-blue-400">{act.nis}</td>
                    <td className="px-4 py-3 font-semibold text-white">{act.student_name}</td>
                    <td className="px-4 py-3 text-slate-300">{act.class_name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${act.status === 'HADIR' ? 'badge-hadir' :
                          act.status === 'IZIN' ? 'badge-izin' :
                            act.status === 'SAKIT' ? 'badge-sakit' : 'badge-alpa'
                        }`}>
                        {act.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs truncate">
                      {act.is_late ? (
                        <span className="text-amber-400 font-medium">Terlambat ({act.late_minutes}m) - {act.notes || 'Tanpa alasan'}</span>
                      ) : (
                        act.notes || '-'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Belum ada data presensi untuk tanggal ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
