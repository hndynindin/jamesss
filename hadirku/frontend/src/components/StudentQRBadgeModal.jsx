import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Printer, ShieldCheck, Sparkles, Download } from 'lucide-react';

const StudentQRBadgeModal = ({ student, isOpen, onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && student && canvasRef.current) {
      const qrData = student.qr_code_token || `QR-${student.nis}-${student.full_name}`;
      QRCode.toCanvas(canvasRef.current, qrData, {
        width: 140,
        margin: 1,
        color: {
          dark: '#0B1120',
          light: '#FFFFFF'
        }
      }, (err) => {
        if (err) console.error('Error generating QR code:', err);
      });
    }
  }, [isOpen, student]);

  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `QR-${student.nis}-${student.full_name.replace(/\s+/g, '_')}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#111827] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#1E293B]/40">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Kartu Pelajar & QR Badge Digital</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Card Container (Printed / Printable) */}
        <div className="p-6 flex flex-col items-center">
          <div 
            id="printable-badge"
            className="w-full rounded-2xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0B1120] border-2 border-blue-500/40 p-5 shadow-2xl relative overflow-hidden"
          >
            {/* Top decorative stripe */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

            {/* School Header */}
            <div className="flex items-center space-x-3 pb-3 border-b border-[#334155]/60">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black tracking-wider text-white uppercase">SMK KARTIKA X-1</h4>
                <p className="text-[10px] text-blue-400 font-semibold">KARTU PRESENSI DIGITAL SISWA</p>
              </div>
            </div>

            {/* Student Info & QR */}
            <div className="mt-4 flex items-center justify-between space-x-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Nama Siswa</span>
                  <p className="text-sm font-extrabold text-white truncate">{student.full_name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">NIS</span>
                    <p className="font-mono font-bold text-blue-400">{student.nis}</p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Kelas</span>
                    <p className="font-bold text-slate-200">{student.class_name || '-'}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Program Keahlian</span>
                  <p className="text-[11px] font-semibold text-emerald-400">{student.major_name || 'Teknik Komputer & Jaringan'}</p>
                </div>
              </div>

              {/* QR Code Canvas */}
              <div className="p-2 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center shrink-0">
                <canvas ref={canvasRef} className="w-[110px] h-[110px]" />
                <span className="text-[8px] font-mono font-bold text-slate-900 mt-0.5">VELOCHECK ID</span>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-4 pt-2.5 border-t border-[#334155]/60 flex items-center justify-between text-[9px] text-slate-400">
              <span>Token: <strong className="font-mono text-slate-300">{student.qr_code_token}</strong></span>
              <span className="text-emerald-400 font-semibold">Status: Aktif</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-[#1E293B] bg-[#1E293B]/20 flex items-center justify-between">
          <button
            onClick={handleDownloadQR}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-xs font-semibold transition-all"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Simpan Gambar QR</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/25 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentQRBadgeModal;
