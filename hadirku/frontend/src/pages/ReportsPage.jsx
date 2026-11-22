import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  School, 
  Users, 
  Filter, 
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import api from '../services/api';
import { generateAttendancePDF } from '../utils/pdfGenerator';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

const ReportsPage = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('monthly');
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load classes & students for filter
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [resClasses, resStudents] = await Promise.all([
          api.get('/classes'),
          api.get('/students')
        ]);
        if (resClasses.success) setClasses(resClasses.data);
        if (resStudents.success) setStudents(resStudents.data);
      } catch (err) {
        console.error('Error fetching filters:', err);
      }
    };
    fetchFilters();
  }, []);

  const loadReport = async () => {
    setLoading(true);
    try {
      let query = `/reports/recap?period=${period}`;
      if (selectedClass) query += `&class_id=${selectedClass}`;
      if (selectedStudent) query += `&student_id=${selectedStudent}`;
      if (dateFrom) query += `&date_from=${dateFrom}`;
      if (dateTo) query += `&date_to=${dateTo}`;

      const res = await api.get(query);
      if (res.success) {
        setReportData(res.data);
      }
    } catch (err) {
      console.error('Error loading recap report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [period, selectedClass, selectedStudent, dateFrom, dateTo]);

  const handleExportPDF = () => {
    if (!reportData) return;
    const currentClassObj = classes.find(c => String(c.id) === String(selectedClass));
    const className = currentClassObj ? currentClassObj.name : 'Semua Rombel TKJ';

    generateAttendancePDF({
      title: `LAPORAN REKAPITULASI PRESENSI - PERIODE ${period.toUpperCase()}`,
      period: period,
      dateRange: `${reportData.date_from} s/d ${reportData.date_to}`,
      className,
      summary: reportData.summary,
      studentBreakdown: reportData.student_breakdown
    });
  };

  const handleExportCSV = () => {
    if (!reportData?.student_breakdown) return;
    const headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Hadir', 'Izin', 'Sakit', 'Alpa', 'Terlambat', 'Persentase'];
    const rows = reportData.student_breakdown.map((s, idx) => [
      idx + 1,
      s.nis,
      `"${s.student_name}"`,
      s.class_name,
      s.hadir,
      s.izin,
      s.sakit,
      s.alpa,
      s.late || 0,
      `${s.percentage}%`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap-Presensi-${period}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const summary = reportData?.summary || { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0, TOTAL: 0, LATE_COUNT: 0 };
  const attendanceRate = summary.TOTAL > 0 ? ((summary.HADIR / summary.TOTAL) * 100).toFixed(1) : 0;

  // Chart
  const chartData = {
    labels: ['HADIR', 'IZIN', 'SAKIT', 'ALPA', 'TERLAMBAT'],
    datasets: [
      {
        label: 'Total Catatan Presensi',
        data: [summary.HADIR, summary.IZIN, summary.SAKIT, summary.ALPA, summary.LATE_COUNT],
        backgroundColor: ['#22C55E', '#EAB308', '#3B82F6', '#EF4444', '#F97316'],
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } },
      y: { grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Buttons */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Laporan & Rekapitulasi Presensi Digital</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ekspor rekapitulasi kehadiran resmi ke dalam format PDF cetak & file CSV data
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-[#0B1120] hover:bg-[#111827] border border-[#334155] text-slate-300 hover:text-white text-xs font-semibold transition-all"
            title="Download CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Unduh Laporan PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#1E293B]/60 border border-[#334155]/50 space-y-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-300">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Filter Laporan & Periode:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Period selector */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Periode Waktu</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="daily">Harian (Hari Ini)</option>
              <option value="weekly">Mingguan (7 Hari Terakhir)</option>
              <option value="monthly">Bulanan (30 Hari Terakhir)</option>
              <option value="semester">Semester (6 Bulan Terakhir)</option>
            </select>
          </div>

          {/* Class Filter */}
          {user?.role !== 'siswa' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Filter Kelas</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
              >
                <option value="">Semua Rombel / Kelas</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Date from */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Mulai Tanggal</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Date to */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sampai Tanggal</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <StatCard
          title="Total Presensi"
          value={summary.TOTAL}
          subtitle={`Rentang: ${reportData?.date_from || '-'} sd ${reportData?.date_to || '-'}`}
          color="blue"
        />
        <StatCard
          title="Tingkat Hadir"
          value={`${attendanceRate}%`}
          subtitle="Rasio presensi tepat waktu"
          color="green"
        />
        <StatCard
          title="Total Hadir"
          value={summary.HADIR}
          subtitle="Catatan kehadiran"
          color="green"
        />
        <StatCard
          title="Total Izin"
          value={summary.IZIN}
          subtitle="Surat izin terverifikasi"
          color="yellow"
        />
        <StatCard
          title="Total Sakit"
          value={summary.SAKIT}
          subtitle="Keterangan sakit"
          color="blue"
        />
        <StatCard
          title="Total Alpa"
          value={summary.ALPA}
          subtitle="Tanpa keterangan"
          color="red"
        />
      </div>

      {/* Chart Preview */}
      <div className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60">
        <h3 className="text-sm font-bold text-white mb-1">Grafik Perbandingan Status Periode Laporan</h3>
        <p className="text-[11px] text-slate-400 mb-4">Visualisasi distribusi status kehadiran dalam rentang yang dipilih</p>
        <div className="h-48">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Student Breakdown Table */}
      <div className="rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 overflow-hidden">
        <div className="p-4 border-b border-[#334155]/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Tabel Rekapitulasi Individu Siswa</h3>
            <p className="text-[11px] text-slate-400">Total akumulasi kehadiran setiap siswa pada periode ini</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {reportData?.student_breakdown?.length || 0} Siswa
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
            <span className="text-xs">Memuat laporan rekapitulasi...</span>
          </div>
        ) : (reportData?.student_breakdown || []).length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Tidak ada data presensi pada rentang tanggal dan filter ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-bold border-b border-[#334155]">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">No</th>
                  <th className="px-4 py-3">NIS</th>
                  <th className="px-4 py-3">Nama Lengkap</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-3 py-3 text-center text-emerald-400 font-bold">Hadir (H)</th>
                  <th className="px-3 py-3 text-center text-amber-400 font-bold">Izin (I)</th>
                  <th className="px-3 py-3 text-center text-blue-400 font-bold">Sakit (S)</th>
                  <th className="px-3 py-3 text-center text-rose-400 font-bold">Alpa (A)</th>
                  <th className="px-3 py-3 text-center text-orange-400 font-bold">Telat</th>
                  <th className="px-4 py-3 text-center font-bold">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {reportData.student_breakdown.map((s, index) => (
                  <tr key={s.student_id} className="hover:bg-[#1E293B]/50 transition-colors">
                    <td className="px-4 py-2.5 text-center font-mono text-slate-500">{index + 1}</td>
                    <td className="px-4 py-2.5 font-mono font-medium text-blue-400">{s.nis}</td>
                    <td className="px-4 py-2.5 font-semibold text-white">{s.student_name}</td>
                    <td className="px-4 py-2.5 text-slate-300">{s.class_name}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-emerald-400">{s.hadir}</td>
                    <td className="px-3 py-2.5 text-center font-semibold text-amber-400">{s.izin}</td>
                    <td className="px-3 py-2.5 text-center font-semibold text-blue-400">{s.sakit}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-rose-400">{s.alpa}</td>
                    <td className="px-3 py-2.5 text-center font-semibold text-orange-400">{s.late || 0}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        Number(s.percentage) >= 80 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                        Number(s.percentage) >= 60 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      }`}>
                        {s.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
