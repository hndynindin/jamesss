import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  School, 
  Search, 
  Save, 
  CheckCheck, 
  RotateCcw, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  Users,
  Sparkles
} from 'lucide-react';
import api from '../services/api';

const AttendancePage = ({ initialClassId }) => {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(initialClassId || '');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [session, setSession] = useState(new Date().getHours() < 12 ? 'pagi' : 'siang');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: 'success' });

  // Load Classes list
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes');
        if (res.success && res.data?.length > 0) {
          setClasses(res.data);
          if (!selectedClassId) {
            setSelectedClassId(res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching classes:', err);
      }
    };
    fetchClasses();
  }, []);

  // Load Attendance data for selected class and date
  useEffect(() => {
    if (!selectedClassId || !selectedDate) return;

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/attendance/class?class_id=${selectedClassId}&date=${selectedDate}`);
        if (res.success && res.data) {
          setStudents(res.data);
          
          // Map existing attendance into local state
          const initialMap = {};
          res.data.forEach(s => {
            initialMap[s.student_id] = {
              status: s.status || '',
              time_in: s.time_in || '06:50:00',
              notes: s.notes || '',
              is_late: s.is_late ? true : false,
              late_minutes: s.late_minutes || 0
            };
          });
          setAttendanceData(initialMap);
        }
      } catch (err) {
        console.error('Error fetching class attendance:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedClassId, selectedDate]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { time_in: '06:50:00', notes: '', is_late: false, late_minutes: 0 }),
        status
      }
    }));
  };

  const handleNoteChange = (studentId, notes) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'HADIR', time_in: '06:50:00', is_late: false, late_minutes: 0 }),
        notes
      }
    }));
  };

  const handleLateToggle = (studentId) => {
    setAttendanceData(prev => {
      const defaultTime = session === 'pagi' ? '06:45:00' : '12:45:00';
      const defaultLateMins = session === 'pagi' ? 10 : 15;
      const current = prev[studentId] || { status: 'HADIR', time_in: defaultTime, notes: '', late_minutes: defaultLateMins };
      const nextIsLate = !current.is_late;
      return {
        ...prev,
        [studentId]: {
          ...current,
          is_late: nextIsLate,
          late_minutes: nextIsLate ? (current.late_minutes || defaultLateMins) : 0,
          notes: nextIsLate && !current.notes ? `Terlambat ${defaultLateMins}m [Sesi ${session === 'pagi' ? 'Pagi' : 'Siang'}]` : current.notes
        }
      };
    });
  };

  const handleMarkAllHadir = () => {
    const updated = { ...attendanceData };
    const defaultTime = session === 'pagi' ? '06:30:00' : '12:30:00';
    const defaultNote = session === 'pagi' ? 'Tepat waktu [Sesi Pagi]' : 'Tepat waktu [Sesi Siang]';

    students.forEach(s => {
      updated[s.student_id] = {
        status: 'HADIR',
        time_in: updated[s.student_id]?.time_in || defaultTime,
        notes: updated[s.student_id]?.notes || defaultNote,
        is_late: false,
        late_minutes: 0
      };
    });
    setAttendanceData(updated);
  };

  const handleResetAttendance = () => {
    const updated = { ...attendanceData };
    students.forEach(s => {
      updated[s.student_id] = {
        status: '',
        time_in: '07:00:00',
        notes: '',
        is_late: false,
        late_minutes: 0
      };
    });
    setAttendanceData(updated);
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    setAlertInfo({ show: false, message: '', type: 'success' });

    try {
      const recordsToSave = Object.keys(attendanceData)
        .map(sId => {
          const rec = attendanceData[sId];
          if (!rec || !rec.status) return null;
          return {
            student_id: Number(sId),
            status: rec.status,
            time_in: rec.time_in || '07:00:00',
            notes: rec.notes || '',
            is_late: rec.is_late ? 1 : 0,
            late_minutes: rec.late_minutes || 0
          };
        })
        .filter(Boolean);

      if (recordsToSave.length === 0) {
        setAlertInfo({
          show: true,
          message: 'Belum ada status siswa yang dipilih untuk disimpan.',
          type: 'error'
        });
        setSaving(false);
        return;
      }

      const res = await api.post('/attendance/save-batch', {
        class_id: Number(selectedClassId),
        date: selectedDate,
        records: recordsToSave
      });

      if (res.success) {
        setAlertInfo({
          show: true,
          message: `Berhasil! Data absensi ${recordsToSave.length} siswa kelas ini berhasil disimpan.`,
          type: 'success'
        });
        setTimeout(() => setAlertInfo({ show: false, message: '', type: 'success' }), 4000);
      }
    } catch (err) {
      setAlertInfo({
        show: true,
        message: err.message || 'Gagal menyimpan data absensi.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Filter students based on search
  const filteredStudents = students.filter(s => 
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nis.includes(searchQuery)
  );

  // Compute live counts
  let countHadir = 0;
  let countIzin = 0;
  let countSakit = 0;
  let countAlpa = 0;
  let countUnmarked = 0;

  students.forEach(s => {
    const st = attendanceData[s.student_id]?.status;
    if (st === 'HADIR') countHadir++;
    else if (st === 'IZIN') countIzin++;
    else if (st === 'SAKIT') countSakit++;
    else if (st === 'ALPA') countAlpa++;
    else countUnmarked++;
  });

  return (
    <div className="space-y-6">
      {/* School Name & Timetable Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/30 via-[#1E293B] to-[#111827] border border-blue-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm lg:text-base font-extrabold text-white flex items-center space-x-2">
            <span>Presensi Sekolah (SMK KARTIKA X-1)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Pencatatan kehadiran siswa digital real-time sesuai jam operasional sekolah
          </p>
        </div>

        {/* School Timetable Pills */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <div className={`px-3 py-1.5 rounded-xl border transition-all ${
            session === 'pagi' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-[#0B1120] text-slate-400 border-[#334155]'
          }`}>
            <span className="font-bold">Sesi Pagi:</span> Masuk 06:30 • Batas Terlambat 06:35 • Pulang 11:50 WIB
          </div>
          <div className={`px-3 py-1.5 rounded-xl border transition-all ${
            session === 'siang' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-[#0B1120] text-slate-400 border-[#334155]'
          }`}>
            <span className="font-bold">Sesi Siang:</span> Masuk 12:30 • Pulang 17:50 WIB
          </div>
        </div>
      </div>

      {/* Top Controls: Class, Date, & Session Selection Bar */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          {/* Class Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Pilih Rombel / Kelas:
            </label>
            <div className="relative">
              <School className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.major_code} - {c.student_count || 0} Siswa)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Tanggal Presensi:
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Session Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Pilih Sesi Sekolah:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => setSession('pagi')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                  session === 'pagi'
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                    : 'bg-[#0B1120] text-slate-400 border-[#334155] hover:text-white'
                }`}
              >
                Pagi (06:30)
              </button>
              <button
                type="button"
                onClick={() => setSession('siang')}
                className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                  session === 'siang'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30'
                    : 'bg-[#0B1120] text-slate-400 border-[#334155] hover:text-white'
                }`}
              >
                Siang (12:30)
              </button>
            </div>
          </div>
        </div>

        {/* Quick Batch Actions & Save Button */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={handleMarkAllHadir}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#0B1120] hover:bg-[#111827] border border-emerald-500/40 text-emerald-400 text-xs font-bold transition-all"
            title="Tandai semua siswa di kelas ini hadir"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Tandai Semua Hadir</span>
          </button>

          <button
            type="button"
            onClick={handleResetAttendance}
            className="p-2 rounded-xl bg-[#0B1120] hover:bg-[#111827] border border-[#334155] text-slate-400 hover:text-white text-xs transition-all"
            title="Reset Pilihan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={saving}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Simpan Presensi'}</span>
          </button>
        </div>
      </div>

      {/* Live Attendance Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Total Siswa</span>
          <span className="text-sm font-bold text-white">{students.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-bold">Hadir</span>
          <span className="text-base font-black text-emerald-400">{countHadir}</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <span className="text-xs text-amber-400 font-bold">Izin</span>
          <span className="text-base font-black text-amber-400">{countIzin}</span>
        </div>
        <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
          <span className="text-xs text-blue-400 font-bold">Sakit</span>
          <span className="text-base font-black text-blue-400">{countSakit}</span>
        </div>
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
          <span className="text-xs text-rose-400 font-bold">Alpa</span>
          <span className="text-base font-black text-rose-400">{countAlpa}</span>
        </div>
      </div>

      {/* Alert Notification */}
      {alertInfo.show && (
        <div className={`p-4 rounded-xl flex items-center space-x-2.5 text-xs font-semibold ${
          alertInfo.type === 'success' ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/15 border border-rose-500/30 text-rose-400'
        }`}>
          {alertInfo.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
          <span>{alertInfo.message}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama siswa atau NIS..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500 placeholder-slate-500"
        />
      </div>

      {/* Main Student Attendance Table */}
      <div className="rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
            <span className="text-xs">Memuat daftar siswa kelas...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Tidak ada siswa ditemukan di kelas ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-bold border-b border-[#334155]">
                <tr>
                  <th className="px-4 py-3.5 w-12 text-center">No</th>
                  <th className="px-4 py-3.5 w-28">NIS</th>
                  <th className="px-4 py-3.5">Nama Lengkap Siswa</th>
                  <th className="px-4 py-3.5 text-center w-64">Status Presensi</th>
                  <th className="px-4 py-3.5 w-36">Keterlambatan</th>
                  <th className="px-4 py-3.5">Keterangan / Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {filteredStudents.map((s, index) => {
                  const studentAtt = attendanceData[s.student_id] || { status: '', notes: '', is_late: false, late_minutes: 0 };
                  const currentStatus = studentAtt.status;

                  return (
                    <tr key={s.student_id} className="hover:bg-[#1E293B]/50 transition-colors">
                      <td className="px-4 py-3 text-center font-mono text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-4 py-3 font-mono font-medium text-blue-400">
                        {s.nis}
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{s.full_name}</div>
                        <div className="text-[10px] text-slate-400">
                          {s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                        </div>
                      </td>

                      {/* Status Selector Buttons */}
                      <td className="px-4 py-3">
                        <div className="grid grid-cols-4 gap-1.5 max-w-[260px] mx-auto">
                          {/* HADIR */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student_id, 'HADIR')}
                            className={`py-1.5 rounded-lg text-[11px] font-black tracking-wide border transition-all ${
                              currentStatus === 'HADIR'
                                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                                : 'bg-[#0B1120] text-slate-400 border-[#334155] hover:border-emerald-500/40 hover:text-emerald-400'
                            }`}
                          >
                            H
                          </button>

                          {/* IZIN */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student_id, 'IZIN')}
                            className={`py-1.5 rounded-lg text-[11px] font-black tracking-wide border transition-all ${
                              currentStatus === 'IZIN'
                                ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30'
                                : 'bg-[#0B1120] text-slate-400 border-[#334155] hover:border-amber-500/40 hover:text-amber-400'
                            }`}
                          >
                            I
                          </button>

                          {/* SAKIT */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student_id, 'SAKIT')}
                            className={`py-1.5 rounded-lg text-[11px] font-black tracking-wide border transition-all ${
                              currentStatus === 'SAKIT'
                                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                                : 'bg-[#0B1120] text-slate-400 border-[#334155] hover:border-blue-500/40 hover:text-blue-400'
                            }`}
                          >
                            S
                          </button>

                          {/* ALPA */}
                          <button
                            type="button"
                            onClick={() => handleStatusChange(s.student_id, 'ALPA')}
                            className={`py-1.5 rounded-lg text-[11px] font-black tracking-wide border transition-all ${
                              currentStatus === 'ALPA'
                                ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30'
                                : 'bg-[#0B1120] text-slate-400 border-[#334155] hover:border-rose-500/40 hover:text-rose-400'
                            }`}
                          >
                            A
                          </button>
                        </div>
                      </td>

                      {/* Late checkbox & minutes */}
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={studentAtt.is_late || false}
                            onChange={() => handleLateToggle(s.student_id)}
                            className="rounded bg-[#0B1120] border-[#334155] text-amber-500 focus:ring-0 cursor-pointer"
                            id={`late-${s.student_id}`}
                          />
                          <label htmlFor={`late-${s.student_id}`} className="text-xs text-slate-300 cursor-pointer">
                            Telat
                          </label>
                          {studentAtt.is_late && (
                            <span className="text-[11px] font-mono text-amber-400 font-bold">
                              ({studentAtt.late_minutes || 15}m)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Notes input */}
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={studentAtt.notes || ''}
                          onChange={(e) => handleNoteChange(s.student_id, e.target.value)}
                          placeholder="Keterangan sakit / izin / catatan..."
                          className="w-full px-2.5 py-1 rounded-lg bg-[#0B1120] border border-[#334155] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/80 backdrop-blur-md border border-[#334155] flex items-center justify-between">
        <div className="text-xs text-slate-400">
          <span className="font-semibold text-white">{students.length - countUnmarked}</span> dari <span className="font-semibold text-white">{students.length}</span> siswa telah ditandai status presensinya.
        </div>
        <button
          onClick={handleSaveAttendance}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Menyimpan Presensi...' : 'Simpan Presensi Kelas'}</span>
        </button>
      </div>
    </div>
  );
};

export default AttendancePage;
