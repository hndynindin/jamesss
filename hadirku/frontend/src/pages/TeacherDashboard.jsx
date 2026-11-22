import React, { useState, useEffect } from 'react';
import { 
  School, 
  Users, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  FileDown, 
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { generateAttendancePDF } from '../utils/pdfGenerator';

const TeacherDashboard = ({ setActiveTab, onSelectClassForAttendance }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTeacherDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/guru');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error loading teacher dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeacherDashboard();
  }, []);

  const handleStartAttendance = (classId) => {
    if (onSelectClassForAttendance) {
      onSelectClassForAttendance(classId);
    }
    setActiveTab('attendance');
  };

  const handleDownloadClassReport = async (cls) => {
    try {
      const res = await api.get(`/reports/recap?period=monthly&class_id=${cls.id}`);
      if (res.success && res.data) {
        generateAttendancePDF({
          title: `REKAPITULASI KEHADIRAN KELAS ${cls.name}`,
          period: 'BULANAN',
          dateRange: `${res.data.date_from} s/d ${res.data.date_to}`,
          className: cls.name,
          summary: res.data.summary,
          studentBreakdown: res.data.student_breakdown
        });
      }
    } catch (err) {
      alert('Gagal mengunduh laporan kelas: ' + err.message);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
      </div>
    );
  }

  const teacher = data?.teacher;
  const todayStats = data?.today_stats || { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0 };
  const totalRecorded = todayStats.HADIR + todayStats.IZIN + todayStats.SAKIT + todayStats.ALPA;

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#1E293B] to-[#111827] border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-emerald-500/20">
            {teacher?.full_name?.charAt(0) || 'G'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg lg:text-xl font-extrabold text-white">{teacher?.full_name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Pendidik
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              NIP: <span className="font-mono text-emerald-400">{teacher?.nip}</span> • Mata Pelajaran: <span className="text-white">{teacher?.subject}</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Presensi Sekolah (SMK KARTIKA X-1) • Email: {teacher?.email} • Telp: {teacher?.phone || '-'}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
              <span className="px-2 py-0.5 rounded bg-[#0B1120] text-emerald-300 border border-emerald-500/30">
                Pagi: 06:30 (Batas: 06:35) - 11:50 WIB
              </span>
              <span className="px-2 py-0.5 rounded bg-[#0B1120] text-amber-300 border border-amber-500/30">
                Siang: 12:30 - 17:50 WIB
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('attendance')}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all self-start md:self-auto"
        >
          <UserCheck className="w-4 h-4" />
          <span>Isi Presensi Sekarang</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Kelas Diampu"
          value={data?.total_classes || 0}
          subtitle="Kelas binaan & ajar"
          icon={School}
          color="blue"
        />
        <StatCard
          title="Total Siswa"
          value={data?.total_students || 0}
          subtitle="Siswa dalam kelas diampu"
          icon={Users}
          color="purple"
        />
        <StatCard
          title="Siswa Hadir Hari Ini"
          value={todayStats.HADIR}
          subtitle={`Dari total ${totalRecorded} terabsen`}
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Perlu Konfirmasi"
          value={todayStats.IZIN + todayStats.SAKIT + todayStats.ALPA}
          subtitle={`${todayStats.IZIN} Izin, ${todayStats.SAKIT} Sakit, ${todayStats.ALPA} Alpa`}
          icon={Clock}
          color="yellow"
        />
      </div>

      {/* List of Managed Classes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Daftar Kelas yang Diampu</h3>
            <p className="text-[11px] text-slate-400">Pilih kelas untuk mulai input absensi atau unduh laporan</p>
          </div>
          <button
            onClick={() => setActiveTab('reports')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Lihat Rekap Lengkap
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.classes || []).map((cls) => {
            const isHomeroom = cls.homeroom_teacher_id === teacher?.id;

            return (
              <div 
                key={cls.id}
                className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-base font-extrabold text-white">{cls.name}</span>
                    {isHomeroom && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        Wali Kelas
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">{cls.major_name}</p>
                  <p className="text-xs text-slate-400 mt-2 flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span><strong>{cls.student_count || 0}</strong> Siswa Terdaftar</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-[#334155]/40 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDownloadClassReport(cls)}
                    className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0B1120] hover:bg-[#111827] border border-[#334155] text-slate-300 hover:text-white text-xs font-medium transition-all"
                    title="Unduh Rekap PDF Kelas Ini"
                  >
                    <FileDown className="w-3.5 h-3.5 text-blue-400" />
                    <span>Unduh PDF</span>
                  </button>

                  <button
                    onClick={() => handleStartAttendance(cls.id)}
                    className="flex-1 flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Absensi</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Class Attendance Feed */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60">
        <h3 className="text-sm font-bold text-white mb-1">Aktivitas Presensi Kelas Terakhir</h3>
        <p className="text-[11px] text-slate-400 mb-4">Catatan kehadiran siswa pada kelas yang Anda ampu</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-bold border-b border-[#334155]">
              <tr>
                <th className="px-4 py-2.5 rounded-l-xl">Tanggal & Jam</th>
                <th className="px-4 py-2.5">Nama Siswa</th>
                <th className="px-4 py-2.5">Kelas</th>
                <th className="px-4 py-2.5 text-center">Status</th>
                <th className="px-4 py-2.5 rounded-r-xl">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {(data?.recent_attendance || []).length > 0 ? (
                data.recent_attendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#1E293B]/60">
                    <td className="px-4 py-2.5 text-slate-300 font-mono">
                      {rec.date} <span className="text-slate-500 text-[10px]">({rec.time_in})</span>
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-white">{rec.student_name}</td>
                    <td className="px-4 py-2.5 text-slate-300">{rec.class_name}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'HADIR' ? 'badge-hadir' :
                        rec.status === 'IZIN' ? 'badge-izin' :
                        rec.status === 'SAKIT' ? 'badge-sakit' : 'badge-alpa'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">
                      {rec.is_late ? (
                        <span className="text-amber-400">Terlambat ({rec.late_minutes}m)</span>
                      ) : (
                        rec.notes || '-'
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    Belum ada riwayat absensi kelas hari ini.
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

export default TeacherDashboard;
