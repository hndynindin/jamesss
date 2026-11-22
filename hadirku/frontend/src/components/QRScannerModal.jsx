import React, { useState, useEffect, useRef } from 'react';
import { X, QrCode, CheckCircle2, AlertTriangle, UserCheck, Clock, Camera, Sparkles } from 'lucide-react';
import api from '../services/api';

const QRScannerModal = ({ isOpen, onClose, onAttendanceRecorded }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [status, setStatus] = useState('HADIR');
  const [session, setSession] = useState(new Date().getHours() < 12 ? 'pagi' : 'siang');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastScanned, setLastScanned] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [recentScans, setRecentScans] = useState([]);
  const inputRef = useRef(null);

  // Sample student list for 1-click test scanning
  const demoTokens = [
    { name: 'Ahmad Fauzi (XII TKJ 1)', nis: '20240101', token: 'QR-20240101-AHMAD' },
    { name: 'Siti Nurhaliza (XII TKJ 1)', nis: '20240102', token: 'QR-20240102-SITI' },
    { name: 'Rizky Ramadhan (XII TKJ 1)', nis: '20240103', token: 'QR-20240103-RIZKY' },
    { name: 'Bayu Saputra (XII TKJ 2)', nis: '20240106', token: 'QR-20240106-BAYU' }
  ];

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScanSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/attendance/quick-scan', {
        qr_token: tokenInput.trim(),
        status,
        session,
        notes
      });

      if (res.success) {
        setLastScanned(res.data);
        setRecentScans(prev => [res.data, ...prev.slice(0, 4)]);
        setTokenInput('');
        setNotes('');
        if (onAttendanceRecorded) onAttendanceRecorded(res.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memproses QR Code siswa.');
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleQuickDemoClick = (token) => {
    setTokenInput(token);
    setTimeout(() => {
      // Auto-trigger scan
      api.post('/attendance/quick-scan', {
        qr_token: token,
        status,
        session,
        notes
      }).then(res => {
        if (res.success) {
          setLastScanned(res.data);
          setRecentScans(prev => [res.data, ...prev.slice(0, 4)]);
          setTokenInput('');
          if (onAttendanceRecorded) onAttendanceRecorded(res.data);
        }
      }).catch(err => {
        setErrorMsg(err.message || 'Gagal memproses demo scan.');
      });
    }, 50);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-[#111827] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#1E293B]/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Presensi Sekolah (SMK KARTIKA X-1)</h3>
              <p className="text-[11px] text-slate-400">Pemindai QR Code Digital Presensi Real-Time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* School Schedule Info Card */}
          <div className="p-3 rounded-xl bg-[#0B1120] border border-[#334155] text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Jadwal Operasional Presensi:</span>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setSession('pagi')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    session === 'pagi' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-[#1E293B] text-slate-400 border-[#334155]'
                  }`}
                >
                  Sesi Pagi
                </button>
                <button
                  type="button"
                  onClick={() => setSession('siang')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                    session === 'siang' ? 'bg-amber-600 text-white border-amber-500' : 'bg-[#1E293B] text-slate-400 border-[#334155]'
                  }`}
                >
                  Sesi Siang
                </button>
              </div>
            </div>
            {session === 'pagi' ? (
              <p className="text-emerald-400 font-medium">
                Jadwal Masuk: 06:30 WIB • Batas Terlambat: 06:35 WIB • Jam Pulang: 11:50 WIB
              </p>
            ) : (
              <p className="text-amber-400 font-medium">
                Jadwal Masuk: 12:30 WIB • Jam Pulang: 17:50 WIB
              </p>
            )}
          </div>
          {/* Status selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Status Presensi Default Saat Dipindai:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'HADIR', label: 'HADIR', active: 'bg-emerald-600 text-white border-emerald-500' },
                { id: 'IZIN', label: 'IZIN', active: 'bg-amber-600 text-white border-amber-500' },
                { id: 'SAKIT', label: 'SAKIT', active: 'bg-blue-600 text-white border-blue-500' },
                { id: 'ALPA', label: 'ALPA', active: 'bg-rose-600 text-white border-rose-500' }
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    status === s.id ? s.active : 'bg-[#1E293B] text-slate-400 border-[#334155] hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input Barcode Scanner Field */}
          <form onSubmit={handleScanSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Input QR Token / Nomor Induk Siswa (NIS):
              </label>
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Contoh: QR-20240101-AHMAD atau 20240101"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500 pr-24 font-mono"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !tokenInput.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  {loading ? 'Memproses...' : 'Proses'}
                </button>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Keterangan opsional (misal: Izin UKS, Surat terlampir)"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0B1120] border border-[#334155] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </form>

          {/* Quick Click Demo Badges */}
          <div className="p-3 rounded-xl bg-[#1E293B]/40 border border-[#334155]/50">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Simulasi Cepat (Klik Kartu Siswa untuk Tes Scan Langsung):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoTokens.map(dt => (
                <button
                  key={dt.token}
                  type="button"
                  onClick={() => handleQuickDemoClick(dt.token)}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#111827] border border-[#334155] hover:border-blue-500/60 text-left transition-all group"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate group-hover:text-blue-400">{dt.name}</p>
                    <p className="text-[10px] font-mono text-slate-400">{dt.token}</p>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold shrink-0">
                    Scan
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-2 text-rose-400 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Last Successfully Scanned Alert */}
          {lastScanned && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 animate-scaleUp">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Presensi Berhasil Dicatat!</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {lastScanned.attendance?.time_in} WIB
                </span>
              </div>
              <p className="text-sm font-bold text-white">
                {lastScanned.student?.full_name} <span className="text-slate-400 font-normal">({lastScanned.student?.nis})</span>
              </p>
              <div className="flex items-center space-x-3 text-xs text-slate-300">
                <span>Kelas: <strong className="text-white">{lastScanned.student?.class_name}</strong></span>
                <span>Status: <strong className="text-emerald-400 font-bold">{lastScanned.attendance?.status}</strong></span>
                {lastScanned.attendance?.is_late ? (
                  <span className="text-rose-400 font-medium">(Terlambat {lastScanned.attendance?.late_minutes} menit)</span>
                ) : (
                  <span className="text-emerald-400 font-medium">(Tepat Waktu)</span>
                )}
              </div>
            </div>
          )}

          {/* Recent Scans in Session */}
          {recentScans.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Riwayat Pemindaian Sesi Ini:
              </h4>
              <div className="space-y-1.5">
                {recentScans.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1E293B]/50 border border-[#334155]/40 text-xs">
                    <div>
                      <span className="font-semibold text-white">{item.student?.full_name}</span>
                      <span className="text-slate-400 text-[11px] ml-2">({item.student?.class_name})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-slate-400 text-[11px]">{item.attendance?.time_in}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {item.attendance?.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#1E293B] bg-[#1E293B]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition-all"
          >
            Selesai & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
