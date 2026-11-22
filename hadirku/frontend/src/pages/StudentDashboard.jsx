import React, { useState, useEffect } from 'react';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  QrCode, 
  Percent, 
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import StatCard from '../components/StatCard';
import StudentQRBadgeModal from '../components/StudentQRBadgeModal';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  const loadStudentDashboard = async () => {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/siswa');
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error loading student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentDashboard();
  }, []);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500" />
      </div>
    );
  }

  const student = data?.student;
  const percentage = data?.percentage || 0;
  const todayStatus = data?.today_status || 'BELUM ABSEN';
  const todayAttendance = data?.today_attendance;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'HADIR':
        return { text: 'HADIR (Tepat Waktu)', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
      case 'IZIN':
        return { text: 'IZIN', class: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      case 'SAKIT':
        return { text: 'SAKIT', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
      case 'ALPA':
        return { text: 'ALPA (Tanpa Keterangan)', class: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
      default:
        return { text: 'BELUM MELAKUKAN PRESENSI', class: 'bg-slate-700/50 text-slate-400 border-slate-600' };
    }
  };

  const statusBadgeInfo = getStatusBadge(todayStatus);

  return (
    <div className="space-y-6">
      {/* Student Profile Card & Status Today Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-[#1E293B] to-[#111827] border border-purple-500/25 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-purple-500/25">
            {student?.full_name?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-white">{student?.full_name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                Siswa
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              NIS: <strong className="font-mono text-purple-400">{student?.nis}</strong> • Kelas: <strong className="text-white">{student?.class_name}</strong>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Presensi Sekolah (SMK KARTIKA X-1) • {student?.major_name} ({student?.major_code})
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

        {/* Today Status Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-[#0B1120] border border-[#334155] space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Status Presensi Hari Ini
            </span>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${statusBadgeInfo.class}`}>
                {statusBadgeInfo.text}
              </span>
              {todayAttendance?.time_in && (
                <span className="text-xs font-mono text-slate-300">
                  pkl {todayAttendance.time_in} WIB
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Lihat Kartu QR</span>
          </button>
        </div>
      </div>

      {/* 5 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Tingkat Kehadiran"
          value={`${percentage}%`}
          subtitle={`Dari total ${data?.total_days || 0} hari`}
          icon={Percent}
          color="green"
        />
        <StatCard
          title="Total Hadir"
          value={data?.hadir || 0}
          subtitle="Presensi tepat waktu"
          icon={CheckCircle2}
          color="blue"
        />
        <StatCard
          title="Total Izin"
          value={data?.izin || 0}
          subtitle="Izin surat terverifikasi"
          icon={Clock}
          color="yellow"
        />
        <StatCard
          title="Total Sakit"
          value={data?.sakit || 0}
          subtitle="Keterangan sakit dokter"
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Total Alpa"
          value={data?.alpa || 0}
          subtitle="Tanpa keterangan"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Attendance History Table */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Riwayat Presensi Pribadi Anda</span>
            </h3>
            <p className="text-[11px] text-slate-400">Catatan lengkap kehadiran pada semester ini</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {data?.history?.length || 0} Catatan Terdaftar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-bold border-b border-[#334155]">
              <tr>
                <th className="px-4 py-3 rounded-l-xl">No</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Jam Masuk</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3">Keterlambatan</th>
                <th className="px-4 py-3 rounded-r-xl">Catatan / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]">
              {(data?.history || []).length > 0 ? (
                data.history.map((rec, index) => (
                  <tr key={rec.id} className="hover:bg-[#1E293B]/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-500">{index + 1}</td>
                    <td className="px-4 py-3 font-semibold text-white">
                      {new Date(rec.date).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">{rec.time_in} WIB</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        rec.status === 'HADIR' ? 'badge-hadir' :
                        rec.status === 'IZIN' ? 'badge-izin' :
                        rec.status === 'SAKIT' ? 'badge-sakit' : 'badge-alpa'
                      }`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {rec.is_late ? (
                        <span className="text-amber-400 font-medium">Terlambat ({rec.late_minutes} menit)</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">Tepat Waktu</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-400">{rec.notes || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Belum ada riwayat kehadiran tercatat.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student QR Badge Modal */}
      <StudentQRBadgeModal
        student={student}
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  );
};

export default StudentDashboard;
