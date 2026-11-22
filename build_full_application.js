const fs = require('fs');
const vm = require('vm');

let html = fs.readFileSync('extracted_original.html', 'utf8');

// =========================================================================
// 1. TOP NOTICE BANNER: Remove PIN 8924 / 3322 & Demo badge
// =========================================================================
const oldTopNotice = `<div class="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border-b border-indigo-500/30 text-xs py-2 px-4 shadow-lg">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <i data-lucide="check-circle" class="w-3 h-3 mr-1"></i> VERIFIED BUILD
        </span>
        <span class="text-slate-300 font-medium">Ujian Akhir TKJ • Batas: 18 Des 2026 • 1 Siswa = 1 Projek Siap Uji</span>
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
          <i data-lucide="key" class="w-3.5 h-3.5 text-amber-400"></i>
          <span class="text-slate-400">Kunci PIN 4-Digit:</span>
          <span id="pinDisplay" class="font-mono font-bold text-amber-300 tracking-wider">8924</span>
          <button onclick="regeneratePin()" title="Acak PIN Baru" class="text-slate-400 hover:text-white ml-1">
            <i data-lucide="refresh-cw" class="w-3 h-3"></i>
          </button>
        </div>
        <div class="flex items-center gap-1.5 bg-indigo-500/20 px-2.5 py-1 rounded-md border border-indigo-500/30 text-indigo-300">
          <i data-lucide="shield-check" class="w-3.5 h-3.5 text-indigo-400"></i>
          <span>Mode: <strong id="currentUserBadge">Super Admin (Demo)</strong></span>
        </div>
      </div>
    </div>
  </div>`;

const newTopNotice = `<div class="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 border-b border-indigo-500/30 text-xs py-2 px-4 shadow-lg">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
          <i data-lucide="check-circle" class="w-3 h-3 mr-1"></i> VERIFIED BUILD
        </span>
        <span class="text-slate-300 font-medium">Ujian Akhir TKJ • Batas: 18 Des 2026 • 1 Siswa = 1 Projek Siap Uji</span>
      </div>
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-2 text-indigo-300">
          <i data-lucide="graduation-cap" class="w-4 h-4 text-indigo-400"></i>
          <span class="font-bold">SMK KARTIKA X-1</span>
          <span class="text-slate-500">•</span>
          <span class="text-slate-300">Sistem Presensi Sekolah Terpadu</span>
        </div>
      </div>
    </div>
  </div>`;

html = html.replace(oldTopNotice, newTopNotice);

// =========================================================================
// 2. NAVBAR: Replace Entity Switcher Pill (Sekolah vs Perusahaan) with School Indicator
// =========================================================================
html = html.replace(
  /<p class="text-\[11px\] text-slate-400">Smart Attendance: Sekolah & Perusahaan \(PT\)<\/p>/g,
  '<p class="text-[11px] text-slate-400">Sistem Presensi Biometrik AI • SMK KARTIKA X-1</p>'
);

const oldEntityPill = `<div class="hidden md:flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
        <button id="btnModeSekolah" onclick="switchEntityMode('sekolah')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all bg-indigo-600 text-white shadow-md">
          <i data-lucide="graduation-cap" class="w-4 h-4"></i>
          <span>Mode Sekolah (Siswa & Guru)</span>
        </button>
        <button id="btnModePerusahaan" onclick="switchEntityMode('perusahaan')" class="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all text-slate-400 hover:text-white">
          <i data-lucide="building-2" class="w-4 h-4"></i>
          <span>Mode Perusahaan (PT / Karyawan)</span>
        </button>
      </div>`;

const newEntityPill = `<div class="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs">
        <i data-lucide="school" class="w-4 h-4 text-indigo-400"></i>
        <span class="text-slate-400">Portal:</span>
        <span id="navActivePortalName" class="font-bold text-white">SMK KARTIKA X-1</span>
      </div>`;

html = html.replace(oldEntityPill, newEntityPill);

// Also clean mobile switcher if exists
html = html.replace(
  /<div class="md:hidden flex items-center justify-around border-b border-slate-800 py-2 bg-slate-950 text-xs font-medium">[\s\S]*?<\/div>/,
  ''
);

// Demo dropdown: Remove company accounts (Siti HRD & Reza Karyawan)
const oldDemoDropdown = `<div id="demoDropdown" class="hidden absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
            <div class="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pilih Akun Role Demo:</div>
            <button onclick="loginAs('admin')" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200">
              <i data-lucide="shield" class="w-3.5 h-3.5 text-indigo-400"></i>
              <span>Super Admin (Full Akses)</span>
            </button>
            <button onclick="loginAs('guru')" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200">
              <i data-lucide="book-open" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span>Budi Santoso (Guru Piket)</span>
            </button>
            <button onclick="loginAs('siswa')" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200">
              <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-blue-400"></i>
              <span>Ahmad Fauzi (Siswa XII TKJ)</span>
            </button>
            <button onclick="loginAs('hrd')" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200">
              <i data-lucide="briefcase" class="w-3.5 h-3.5 text-purple-400"></i>
              <span>Siti Rahmawati (HRD PT)</span>
            </button>
            <button onclick="loginAs('karyawan')" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200">
              <i data-lucide="user" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Reza Pratama (Staff IT PT)</span>
            </button>
            <div class="border-t border-slate-800 my-1"></div>
            <button onclick="guestLogin()" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-emerald-400 font-semibold">
              <i data-lucide="user-x" class="w-3.5 h-3.5"></i>
              <span>Masuk Tanpa Login (Langsung Pakai)</span>
            </button>
          </div>`;

const newDemoDropdown = `<div id="demoDropdown" class="hidden absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
            <div class="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pilih Akun Sekolah:</div>
            <button onclick="loginAs('admin')" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200">
              <i data-lucide="shield" class="w-3.5 h-3.5 text-indigo-400"></i>
              <span>Super Admin (Full Akses)</span>
            </button>
            <button onclick="loginAs('guru')" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200">
              <i data-lucide="book-open" class="w-3.5 h-3.5 text-amber-400"></i>
              <span>Budi Santoso (Guru Pemantau)</span>
            </button>
            <button onclick="loginAs('siswa')" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200">
              <i data-lucide="graduation-cap" class="w-3.5 h-3.5 text-emerald-400"></i>
              <span>Ahmad Fauzi (Murid XII TKJ)</span>
            </button>
            <div class="border-t border-slate-800 my-1"></div>
            <button onclick="guestLogin()" class="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-emerald-400 font-semibold">
              <i data-lucide="user-x" class="w-3.5 h-3.5"></i>
              <span>Langsung Pakai (Ruang Murid)</span>
            </button>
          </div>`;

html = html.replace(oldDemoDropdown, newDemoDropdown);

// Clean Login Modal quick buttons (remove HRD & Karyawan)
const oldLoginModalButtons = `<button type="button" onclick="fillLoginForm('admin', '123456')" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition">
              <div class="font-bold text-indigo-300">Super Admin</div>
              <div class="text-[10px] text-slate-400">admin / 123456</div>
            </button>
            <button type="button" onclick="fillLoginForm('guru_budi', '123456')" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition">
              <div class="font-bold text-emerald-300">Guru Piket</div>
              <div class="text-[10px] text-slate-400">guru_budi / 123456</div>
            </button>
            <button type="button" onclick="fillLoginForm('hrd_siti', '123456')" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition">
              <div class="font-bold text-purple-300">HRD PT</div>
              <div class="text-[10px] text-slate-400">hrd_siti / 123456</div>
            </button>
            <button type="button" onclick="fillLoginForm('20240101', '123456')" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition">
              <div class="font-bold text-blue-300">Siswa (Ahmad)</div>
              <div class="text-[10px] text-slate-400">20240101 / 123456</div>
            </button>`;

const newLoginModalButtons = `<button type="button" onclick="fillLoginForm('admin', '123456')" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition">
              <div class="font-bold text-indigo-300">Super Admin</div>
              <div class="text-[10px] text-slate-400">admin / 123456</div>
            </button>
            <button type="button" onclick="fillLoginForm('guru_budi', '123456')" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition">
              <div class="font-bold text-amber-300">Guru Pemantau</div>
              <div class="text-[10px] text-slate-400">guru_budi / 123456</div>
            </button>
            <button type="button" onclick="fillLoginForm('20240101', '123456')" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition sm:col-span-2">
              <div class="font-bold text-emerald-300">Murid (Ahmad Fauzi)</div>
              <div class="text-[10px] text-slate-400">20240101 / 123456</div>
            </button>`;

html = html.replace(oldLoginModalButtons, newLoginModalButtons);

// =========================================================================
// 3. TAB-PRESENSI: Insert Room Switcher Bar above Banner
// =========================================================================
const roomSwitcherBarHtml = `<!-- Room Switcher Bar (Pemisahan Ruang Murid & Ruang Guru) -->
      <div class="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button id="btnRoomSiswa" onclick="switchToRoom('siswa')"
            class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow-md">
            <i data-lucide="graduation-cap" class="w-4 h-4"></i>
            <span>Ruang Absensi Murid</span>
          </button>
          <button id="btnRoomGuru" onclick="switchToRoom('guru')"
            class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800">
            <i data-lucide="lock" class="w-4 h-4 text-amber-400" id="iconLockGuru"></i>
            <span>Ruang Guru (Pemantau Murid)</span>
            <span class="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40">Terproteksi Sandi</span>
          </button>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto px-2">
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-slate-400">Portal Aktif:</span>
            <span id="currentPortalBadge" class="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px]">
              Murid (Siswa)
            </span>
          </div>
        </div>
      </div>

      `;

html = html.replace('<div id="tab-presensi" class="tab-content block space-y-6">\n\n      <!-- Banner Status Aturan Jam', '<div id="tab-presensi" class="tab-content block space-y-6">\n\n      ' + roomSwitcherBarHtml + '<!-- Banner Status Aturan Jam');

// Update Schedule Banner
const oldBannerDesc = `<h2 id="targetEntityTitle" class="text-base font-bold text-white">Presensi Sekolah (SMKN 1 TEKNOLOGI)</h2>
              <span id="shiftStatusBadge" class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] px-2 py-0.5 rounded-full font-bold">Shift Pagi Aktif</span>
            </div>
            <p id="targetEntityDesc" class="text-xs text-slate-400 mt-0.5">
              Jadwal Masuk: <span class="text-slate-200 font-semibold">07:00 WIB</span> • Batas Terlambat: <span class="text-amber-400 font-semibold">07:15 WIB</span> • Jam Pulang: <span class="text-slate-200 font-semibold">15:30 WIB</span>
            </p>`;

const newBannerDesc = `<h2 id="targetEntityTitle" class="text-base font-bold text-white">Presensi Sekolah (SMK KARTIKA X-1)</h2>
              <span id="shiftStatusBadge" class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">Shift Pagi Aktif</span>
            </div>
            <p id="targetEntityDesc" class="text-xs text-slate-300 mt-1.5 leading-relaxed break-words">
              Jadwal Masuk: <span class="text-slate-100 font-semibold">06:30 WIB</span> • Toleransi Terlambat: <span class="text-amber-400 font-semibold">06:35 WIB</span> • Jam Pulang: <span class="text-slate-100 font-semibold">11:50 WIB</span> (Pagi)<br>
              Masuk: <span class="text-slate-100 font-semibold">12:30 WIB</span> • Jam Pulang: <span class="text-slate-100 font-semibold">17:50 WIB</span> (Siang)
            </p>`;

html = html.replace(oldBannerDesc, newBannerDesc);

// Update Section 1 titles & labels
html = html.replace(
  '<h3 class="text-sm font-bold text-slate-200 uppercase tracking-wider">1. Identitas Lengkap Peserta</h3>',
  '<h3 id="sectionTitleIdentitas" class="text-sm font-bold text-slate-200 uppercase tracking-wider">1. Identitas Lengkap Murid</h3>'
);

html = html.replace(
  '<label class="block text-xs font-semibold text-slate-300 mb-1.5">Pilih Rujukan Peserta dari Database (Opsional):</label>',
  '<label id="labelUserSelector" class="block text-xs font-semibold text-slate-300 mb-1.5">Pilih Rujukan Murid dari Database (Opsional):</label>'
);

html = html.replace(
  '<label class="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>',
  '<label id="labelNama" class="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap Murid</label>'
);

// Update Status buttons: H, S, I, A for murid
const oldStatusButtonsSection = `<!-- Bagian 2: Status Kehadiran (H, S, I, A, T, Dinas) -->
            <div class="border-t border-slate-800 pt-4 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
                  <h3 class="text-sm font-bold text-slate-200 uppercase tracking-wider">2. Status Kehadiran</h3>
                </div>
                <span id="autoLateIndicator" class="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Tepat Waktu
                </span>
              </div>

              <!-- Pilihan Badge Status -->
              <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <button type="button" onclick="selectStatus('H')" id="btnStatus-H" class="status-choice-btn p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold">
                  <span class="text-base font-black">H</span>
                  <span class="text-[10px]">Hadir</span>
                </button>
                <button type="button" onclick="selectStatus('T')" id="btnStatus-T" class="status-choice-btn p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">T</span>
                  <span class="text-[10px]">Terlambat</span>
                </button>
                <button type="button" onclick="selectStatus('S')" id="btnStatus-S" class="status-choice-btn p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">S</span>
                  <span class="text-[10px]">Sakit</span>
                </button>
                <button type="button" onclick="selectStatus('I')" id="btnStatus-I" class="status-choice-btn p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">I</span>
                  <span class="text-[10px]">Izin</span>
                </button>
                <button type="button" onclick="selectStatus('Dinas')" id="btnStatus-Dinas" class="status-choice-btn p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">DL</span>
                  <span class="text-[10px]">Dinas Luar</span>
                </button>
                <button type="button" onclick="selectStatus('A')" id="btnStatus-A" class="status-choice-btn p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">A</span>
                  <span class="text-[10px]">Alfa</span>
                </button>
              </div>

              <!-- Input Alasan / Keterangan Khusus -->
              <div>
                <label class="block text-xs font-semibold text-slate-300 mb-1">Catatan / Alasan (Opsional untuk Sakit, Izin, atau Dinas)</label>
                <input type="text" id="inputCatatan" placeholder="Contoh: Mengikuti LKS TKJ Nasional / Sakit demam ada surat dokter..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
              </div>
            </div>`;

const newStatusButtonsSection = `<!-- Bagian 2: Status Kehadiran Murid (Khusus Ruang Murid: Hadir, Sakit, Izin, Alfa) -->
            <div id="sectionStatusKehadiran" class="border-t border-slate-800 pt-4 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-400"></i>
                  <h3 class="text-sm font-bold text-slate-200 uppercase tracking-wider">2. Status Kehadiran Murid</h3>
                </div>
                <span id="autoLateIndicator" class="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Tepat Waktu
                </span>
              </div>

              <!-- Pilihan Badge Status: H, S, I, A (Terlambat & Dinas Luar Dihapus) -->
              <div id="statusButtonsGrid" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button type="button" onclick="selectStatus('H')" id="btnStatus-H" class="status-choice-btn p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold">
                  <span class="text-base font-black">H</span>
                  <span class="text-[10px]">Hadir</span>
                </button>
                <button type="button" onclick="selectStatus('T')" id="btnStatus-T" class="status-choice-btn hidden p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">T</span>
                  <span class="text-[10px]">Terlambat</span>
                </button>
                <button type="button" onclick="selectStatus('S')" id="btnStatus-S" class="status-choice-btn p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">S</span>
                  <span class="text-[10px]">Sakit</span>
                </button>
                <button type="button" onclick="selectStatus('I')" id="btnStatus-I" class="status-choice-btn p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">I</span>
                  <span class="text-[10px]">Izin</span>
                </button>
                <button type="button" onclick="selectStatus('Dinas')" id="btnStatus-Dinas" class="status-choice-btn hidden p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">DL</span>
                  <span class="text-[10px]">Dinas Luar</span>
                </button>
                <button type="button" onclick="selectStatus('A')" id="btnStatus-A" class="status-choice-btn p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-400 text-center transition flex flex-col items-center gap-1 font-bold">
                  <span class="text-base font-black">A</span>
                  <span class="text-[10px]">Alfa</span>
                </button>
              </div>

              <!-- Input Alasan / Keterangan Khusus -->
              <div>
                <label id="labelCatatan" class="block text-xs font-semibold text-slate-300 mb-1">Catatan / Alasan (Opsional untuk Sakit atau Izin):</label>
                <input type="text" id="inputCatatan" placeholder="Contoh: Sakit demam ada surat dokter / Izin urusan keluarga..." class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500">
              </div>
            </div>

            <!-- Bagian Khusus Ruang Guru: Informasi & Ringkasan Pemantau Murid -->
            <div id="sectionGuruMonitoringSummary" class="hidden border-t border-amber-500/30 pt-4 space-y-3 bg-amber-500/5 p-4 rounded-xl border">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i data-lucide="shield-check" class="w-4 h-4 text-amber-400"></i>
                  <h3 class="text-xs font-bold text-amber-300 uppercase tracking-wider">Verifikasi Petugas Guru Pemantau</h3>
                </div>
                <span class="text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Pemantau Aktif
                </span>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed">
                Pengisian identitas di atas digunakan sebagai <strong>Verifikasi Resmi Guru</strong> yang bertugas memantau dan memvalidasi seluruh presensi murid hari ini.
              </p>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span class="text-[10px] text-slate-400 block">Murid Hadir</span>
                  <span id="quickStatHadir" class="text-sm font-black text-emerald-400">0</span>
                </div>
                <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span class="text-[10px] text-slate-400 block">Murid Sakit</span>
                  <span id="quickStatSakit" class="text-sm font-black text-blue-400">0</span>
                </div>
                <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span class="text-[10px] text-slate-400 block">Murid Izin</span>
                  <span id="quickStatIzin" class="text-sm font-black text-yellow-400">0</span>
                </div>
                <div class="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span class="text-[10px] text-slate-400 block">Murid Alfa</span>
                  <span id="quickStatAlfa" class="text-sm font-black text-rose-400">0</span>
                </div>
              </div>
            </div>`;

html = html.replace(oldStatusButtonsSection, newStatusButtonsSection);

// Update Scanner card title and submit button in right column
html = html.replace(
  '<h3 class="text-sm font-bold text-white uppercase tracking-wider">AI Face Biometric Scanner</h3>',
  '<h3 id="scannerTitle" class="text-sm font-bold text-white uppercase tracking-wider">AI Face Biometric Scanner Murid</h3>'
);

const oldSubmitBtn = `<!-- TOMBOL SUBMIT ABSENSI UTAMA -->
          <button type="button" onclick="submitAttendance()" id="btnSubmitPresensi" class="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider transition transform active:scale-98">
            <i data-lucide="check-check" class="w-5 h-5"></i>
            <span id="submitBtnLabel">KIRIM PRESENSI RESMI</span>
          </button>`;

const newSubmitBtn = `<!-- TOMBOL SUBMIT ABSENSI UTAMA / VERIFIKASI PEMANTAU -->
          <button type="button" onclick="submitAttendance()" id="btnSubmitPresensi" class="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider transition transform active:scale-98">
            <i data-lucide="check-check" class="w-5 h-5"></i>
            <span id="submitBtnLabel">KIRIM PRESENSI RESMI</span>
          </button>`;

html = html.replace(oldSubmitBtn, newSubmitBtn);

// Append Live Monitoring Table right after the two-column grid inside tab-presensi
const tabPresensiEnd = `        </div>
      </div>
    </div>

    <!-- ================= TAB 2: REKAPITULASI & RIWAYAT ABSENSI ================= -->`;

const newTabPresensiEnd = `        </div>
      </div>

      <!-- PANEL PEMANTAUAN PRESENSI MURID REAL-TIME (TAMPIL DI RUANG GURU) -->
      <div id="panelLiveMonitoringGuru" class="hidden bg-slate-900/90 border border-amber-500/40 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <i data-lucide="eye" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Pusat Pemantau Presensi Murid Real-Time</span>
                <span class="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Live Monitoring</span>
              </h3>
              <p class="text-xs text-slate-400">Daftar kehadiran murid hari ini yang sedang dipantau & diverifikasi guru.</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="approveAllPending()" class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i>
              <span>Sahkan Semua Murid</span>
            </button>
            <button type="button" onclick="switchTab('tab-laporan')" class="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition">
              <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
              <span>Cetak Berita Acara</span>
            </button>
          </div>
        </div>

        <!-- Tabel Monitoring Murid -->
        <div class="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/90 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th class="px-4 py-3">Waktu</th>
                <th class="px-4 py-3">Nama Siswa / NIS</th>
                <th class="px-4 py-3">Kelas (Rombel)</th>
                <th class="px-4 py-3 text-center">Status</th>
                <th class="px-4 py-3 text-center">Foto Scan</th>
                <th class="px-4 py-3 text-center">Verifikasi</th>
                <th class="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody id="liveGuruMonitoringTableBody" class="divide-y divide-slate-800/60 font-medium">
              <!-- Rendered via updateGuruLiveMonitoring() -->
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ================= TAB 2: REKAPITULASI & RIWAYAT ABSENSI ================= -->`;

html = html.replace(tabPresensiEnd, newTabPresensiEnd);

// =========================================================================
// 4. MODAL KUNCI RUANG GURU: Add to end before footer
// =========================================================================
const guruLockModalHtml = `<!-- ================= MODAL KUNCI RUANG GURU ================= -->
  <div id="guruLockModal"
    class="hidden fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
      <button onclick="closeGuruLockModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white" title="Tutup">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <div class="text-center space-y-2">
        <div
          class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
          <i data-lucide="lock" class="w-6 h-6"></i>
        </div>
        <h3 class="text-base font-bold text-white">Ruang Guru (Pemantau Murid) Terproteksi Sandi</h3>
        <p class="text-xs text-slate-400">
          Ruang Guru dikhususkan untuk tenaga pendidik memantau & memvalidasi absensi murid. Masukkan kata sandi guru untuk memverifikasi akses:
        </p>
      </div>

      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Kata Sandi Guru:</label>
          <div class="relative">
            <input type="password" id="inputModalGuruPass" placeholder="Masukkan kata sandi guru..."
              onkeydown="if(event.key==='Enter') submitModalGuruPass()"
              class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-amber-500">
          </div>
          <p id="guruLockErrorMsg" class="text-[10px] text-rose-400 mt-1 hidden"></p>
        </div>

        <button type="button" onclick="submitModalGuruPass()"
          class="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition active:scale-98">
          <i data-lucide="key" class="w-4 h-4"></i>
          <span>Masuk Sebagai Guru</span>
        </button>
      </div>

      <div class="text-center">
        <button type="button" onclick="switchToRoom('siswa'); closeGuruLockModal();"
          class="text-xs text-indigo-400 hover:underline">
          ← Kembali ke Ruang Absensi Murid
        </button>
      </div>
    </div>
  </div>

  `;

html = html.replace('<!-- ================= FOOTER ================= -->', guruLockModalHtml + '<!-- ================= FOOTER ================= -->');

// Clean Footer
html = html.replace(
  /<footer class="border-t border-slate-800\/80 bg-slate-950 text-slate-500 py-6 text-xs text-center">[\s\S]*?<\/footer>/,
  `<footer class="border-t border-slate-800/80 bg-slate-950 text-slate-500 py-6 text-xs text-center">
    <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="font-bold text-slate-300">PRESENSIKU PRO</span>
        <span>•</span>
        <span>Sistem Presensi Sekolah SMK KARTIKA X-1 (AI Biometrics)</span>
      </div>
      <div class="text-[11px]">
        Sistem Terverifikasi • Tugas Mandiri Personal Kejuruan TKJ 2026
      </div>
    </div>
  </footer>`
);

// Update School Kop Surat in Laporan
html = html.replace(
  /<h2 class="font-black text-sm text-slate-900 uppercase tracking-wide leading-snug" id="reportHeaderInstansi">[\s\S]*?<\/h2>/,
  '<h2 class="font-black text-sm text-slate-900 uppercase tracking-wide leading-snug" id="reportHeaderInstansi">PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA<br>DINAS PENDIDIKAN — SMK KARTIKA X-1</h2>'
);

html = html.replace(
  /<p class="text-\[11px\] text-slate-600 mt-1 leading-tight font-medium" id="reportHeaderAddress">[\s\S]*?<\/p>/,
  '<p class="text-[11px] text-slate-600 mt-1 leading-tight font-medium" id="reportHeaderAddress">Jl. Jenderal Sudirman No. 45, Jakarta Pusat 10220 • Telp: (021) 555-3322 • Email: info@smkkartikax1.sch.id</p>'
);

html = html.replace(/SMKN 1 TEKNOLOGI/g, 'SMK KARTIKA X-1');
html = html.replace(/Drs\. H\. Suryanto, M\.M/g, 'Drs. H. Mulyadi, M.Pd');

// =========================================================================
// 5. JAVASCRIPT LOGIC: Complete School Logic (Guru Monitor Only & Murid Presensi)
// =========================================================================
const oldScriptStart = '<script>\n    /* =============================================================\n       STATE MANAGEMENT & CONFIGURATION';

const newScriptLogic = `<script>
    /* =============================================================
       STATE MANAGEMENT & CONFIGURATION
       ============================================================= */
    let currentMode = 'sekolah'; // Mode Sekolah Tunggal
    let currentRoom = 'siswa';   // 'siswa' atau 'guru'
    let currentTab = 'tab-presensi';
    let currentAttendanceType = 'masuk'; // 'masuk' atau 'pulang'
    let currentSelectedStatus = 'H';     // 'H', 'S', 'I', 'A', 'Dinas'
    let isGuruUnlocked = false;          // true setelah verifikasi sandi 3322
    const GURU_PIN = '3322';

    // Data Master Pengguna (Khusus SMK KARTIKA X-1)
    const defaultMasterUsers = [
      // Siswa
      { id: '20240101', name: 'Ahmad Fauzi', group: 'XII TKJ 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { id: '20240102', name: 'Nabila Azzahra', group: 'XII TKJ 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
      { id: '20240103', name: 'Dimas Setiawan', group: 'XI TKJ 2', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { id: '20240104', name: 'Putri Maharani', group: 'X TKJ 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
      { id: '20240105', name: 'Rizky Pratama', group: 'XII RPL 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
      // Guru Pemantau
      { id: '198205122008011009', name: 'Budi Santoso, S.Kom', group: 'Teknik Komputer & Jaringan', role: 'Wali Kelas / Guru Piket', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
      { id: '197908142005022004', name: 'Dewi Lestari, M.Pd', group: 'Matematika & Produktif', role: 'Guru Pengajar', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
      { id: '196803151994031005', name: 'Drs. H. Mulyadi, M.Pd', group: 'Manajemen Sekolah', role: 'Kepala Sekolah', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' }
    ];
    const defaultUsers = defaultMasterUsers;
    const initialAttendanceRecords = [];

    function getStoredUsers() {
      const stored = localStorage.getItem('presensiku_master_users');
      return stored ? JSON.parse(stored) : defaultUsers;
    }
    function saveStoredUsers(users) {
      localStorage.setItem('presensiku_master_users', JSON.stringify(users));
    }
    function getStoredRecords() {
      const stored = localStorage.getItem('presensiku_attendance_records');
      return stored ? JSON.parse(stored) : initialAttendanceRecords;
    }
    function saveStoredRecords(records) {
      localStorage.setItem('presensiku_attendance_records', JSON.stringify(records));
    }

    /* Audio Synthesizer */
    function playBeep(type = 'success') {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        if (type === 'success') {
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
          osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        } else if (type === 'scan') {
          osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.08);
        } else if (type === 'warn') {
          osc.frequency.setValueAtTime(350, audioCtx.currentTime);
          gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.3);
        }
      } catch (e) {}
    }

    /* Live Clock */
    function updateClock() {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const timeStr = \`\${h}:\${m}:\${s}\`;

      const clockEl = document.getElementById('liveClock');
      if (clockEl) clockEl.innerText = timeStr;

      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      const dateStr = \`\${days[now.getDay()]}, \${now.getDate()} \${months[now.getMonth()]} \${now.getFullYear()}\`;

      const dateEl = document.getElementById('liveDate');
      if (dateEl) dateEl.innerText = dateStr;

      const shiftBadge = document.getElementById('shiftStatusBadge');
      if (shiftBadge && currentRoom === 'siswa') {
        const isPagi = now.getHours() < 12;
        shiftBadge.innerText = isPagi ? 'Shift Pagi Aktif' : 'Shift Siang Aktif';
        shiftBadge.className = isPagi
          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0'
          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0';
      }

      checkAutomaticLateStatus(now);
    }

    function checkAutomaticLateStatus(now) {
      if (currentAttendanceType !== 'masuk') return;
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;

      const indicator = document.getElementById('autoLateIndicator');
      if (currentSelectedStatus !== 'H') {
        if (indicator) {
          indicator.innerText = (currentSelectedStatus === 'S') ? 'Status: Sakit' : (currentSelectedStatus === 'I') ? 'Status: Izin' : (currentSelectedStatus === 'Dinas') ? 'Status: Dinas Luar' : 'Status: Alfa';
          indicator.className = 'text-[11px] font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full';
        }
        return;
      }

      const isPagi = hours < 12;
      const lateLimit = isPagi ? (6 * 60 + 35) : (12 * 60 + 35);
      if (totalMinutes > lateLimit) {
        if (indicator) {
          indicator.innerText = \`Lewat Toleransi [\${isPagi ? '06:35 Pagi' : '12:35 Siang'}]\`;
          indicator.className = 'text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full';
        }
      } else {
        if (indicator) {
          indicator.innerText = \`Tepat Waktu (Hadir) [\${isPagi ? 'Sesi Pagi' : 'Sesi Siang'}]\`;
          indicator.className = 'text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full';
        }
      }
    }

    /* Modal Guru Lock & Akses Ruang Guru */
    function openGuruLockModal() {
      const modal = document.getElementById('guruLockModal');
      if (modal) {
        const input = document.getElementById('inputModalGuruPass');
        if (input) input.value = '';
        const err = document.getElementById('guruLockErrorMsg');
        if (err) err.classList.add('hidden');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        if (window.lucide) lucide.createIcons();
        setTimeout(() => { if (input) input.focus(); }, 100);
      }
    }

    function closeGuruLockModal() {
      const modal = document.getElementById('guruLockModal');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    }

    function unlockGuruFeatures() {
      isGuruUnlocked = true;
      const iconLock = document.getElementById('iconLockGuru');
      if (iconLock) iconLock.setAttribute('data-lucide', 'unlock');
      if (window.lucide) lucide.createIcons();
    }

    function submitModalGuruPass() {
      const input = document.getElementById('inputModalGuruPass');
      const entered = input ? input.value.trim() : '';
      const err = document.getElementById('guruLockErrorMsg');

      if (entered === GURU_PIN) {
        if (err) err.classList.add('hidden');
        isGuruUnlocked = true;
        unlockGuruFeatures();
        closeGuruLockModal();

        // Otomatis langsung masuk ke dalam Ruang Guru (Pemantau Murid)
        switchToRoom('guru');
        switchTab('tab-presensi');
        playBeep('success');

        const sel = document.getElementById('userSelector');
        if (sel && sel.options.length > 1) {
          sel.selectedIndex = 1;
          onUserSelectChange();
        }

        alert('Kata sandi benar! Anda otomatis masuk ke Ruang Guru (Pemantau Murid).');
      } else {
        if (err) {
          err.innerText = 'Kata sandi guru salah! Silakan coba lagi.';
          err.classList.remove('hidden');
        }
        playBeep('warn');
        if (input) {
          input.value = '';
          input.focus();
        }
      }
    }

    /* Kontrol Status Buttons per Ruang */
    function updateStatusButtonsForRoom(room) {
      const btnT = document.getElementById('btnStatus-T');
      const btnDinas = document.getElementById('btnStatus-Dinas');
      const grid = document.getElementById('statusButtonsGrid');

      if (room === 'guru') {
        if (btnT) btnT.classList.add('hidden');
        if (btnDinas) btnDinas.classList.remove('hidden');
        if (grid) grid.className = 'grid grid-cols-3 sm:grid-cols-5 gap-2';
        if (currentSelectedStatus === 'T') selectStatus('H');
      } else {
        if (btnT) btnT.classList.add('hidden');
        if (btnDinas) btnDinas.classList.add('hidden');
        if (grid) grid.className = 'grid grid-cols-2 sm:grid-cols-4 gap-2';
        if (currentSelectedStatus === 'T' || currentSelectedStatus === 'Dinas') selectStatus('H');
      }
    }

    /* Perpindahan Ruang: Siswa (Absen Mandiri) vs Guru (Pemantau Murid) */
    function switchToRoom(room) {
      const btnSiswa = document.getElementById('btnRoomSiswa');
      const btnGuru = document.getElementById('btnRoomGuru');

      if (room === 'guru') {
        if (!isGuruUnlocked) {
          openGuruLockModal();
          return;
        }

        currentRoom = 'guru';
        if (btnGuru) btnGuru.className = 'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-amber-600 text-white shadow-lg shadow-amber-600/30';
        if (btnSiswa) btnSiswa.className = 'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800';

        document.getElementById('targetEntityTitle').innerText = 'Ruang Guru — Pemantau Presensi Murid (SMK KARTIKA X-1)';
        document.getElementById('targetEntityDesc').innerHTML = 'Panel Khusus Tenaga Pendidik • Memantau presensi murid secara real-time, verifikasi kehadiran rombel, dan pengesahan berita acara sekolah.';

        const shiftBadge = document.getElementById('shiftStatusBadge');
        if (shiftBadge) {
          shiftBadge.innerText = 'Mode Guru Pemantau';
          shiftBadge.className = 'bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0';
        }

        // Penyesuaian Kolom Identitas (Hanya untuk Verifikasi Guru Pemantau)
        const secTitle = document.getElementById('sectionTitleIdentitas');
        if (secTitle) secTitle.innerText = '1. Verifikasi Identitas Guru Pemantau';
        const labelUserSel = document.getElementById('labelUserSelector');
        if (labelUserSel) labelUserSel.innerText = 'Pilih Identitas Guru Pemantau dari Database (Opsional):';
        const labelNm = document.getElementById('labelNama');
        if (labelNm) labelNm.innerText = 'Nama Lengkap Guru Pemantau';
        document.getElementById('labelNomorInduk').innerText = 'Nomor Induk Pegawai (NIP Guru)';
        document.getElementById('labelGrup').innerText = 'Mata Pelajaran / Unit Tugas';
        document.getElementById('labelJabatan').innerText = 'Peran Pengesah (Guru Piket / Wali Kelas)';
        const labelCat = document.getElementById('labelCatatan');
        if (labelCat) labelCat.innerText = 'Catatan Pengesahan Guru Pemantau (Opsional):';

        // Sembunyikan pilihan status kehadiran siswa saat guru memantau
        const secStatus = document.getElementById('sectionStatusKehadiran');
        if (secStatus) secStatus.classList.add('hidden');

        // Tampilkan ringkasan murid & panel monitoring live untuk guru
        const secGuruSum = document.getElementById('sectionGuruMonitoringSummary');
        if (secGuruSum) secGuruSum.classList.remove('hidden');

        const panelLive = document.getElementById('panelLiveMonitoringGuru');
        if (panelLive) panelLive.classList.remove('hidden');

        // Sesuaikan Judul Kamera & Tombol Aksi Verifikasi
        const scanTitle = document.getElementById('scannerTitle');
        if (scanTitle) scanTitle.innerText = 'Verifikasi Wajah / Foto Guru Pemantau';
        const scanBtnText = document.querySelector('#btnScanFace span');
        if (scanBtnText) scanBtnText.innerText = 'Ambil Foto Verifikasi Guru';
        const faceText = document.getElementById('faceResultText');
        if (faceText) faceText.innerText = 'Verifikasi biometrik guru yang bertugas memantau absensi murid.';

        // Tombol Submit berubah menjadi Pengesahan Verifikasi Guru
        const submitLabel = document.getElementById('submitBtnLabel');
        if (submitLabel) submitLabel.innerText = 'SAHKAN & SIMPAN VERIFIKASI PEMANTAU';
        const submitBtn = document.getElementById('btnSubmitPresensi');
        if (submitBtn) {
          submitBtn.className = 'w-full bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-amber-600/30 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider transition transform active:scale-98';
        }

        const badge = document.getElementById('currentPortalBadge');
        if (badge) {
          badge.innerText = 'Guru Pemantau (Terverifikasi)';
          badge.className = 'font-bold text-amber-300 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 rounded-full text-[11px]';
        }

        updateStatusButtonsForRoom('guru');
        populateUserSelector();
        updateGuruLiveMonitoring();
      } else {
        currentRoom = 'siswa';
        if (btnSiswa) btnSiswa.className = 'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all bg-indigo-600 text-white shadow-md shadow-indigo-600/30';
        if (btnGuru) btnGuru.className = 'flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-400 hover:text-white bg-slate-950/60 border border-slate-800';

        document.getElementById('targetEntityTitle').innerText = 'Ruang Absensi Murid (SMK KARTIKA X-1)';
        document.getElementById('targetEntityDesc').innerHTML = 'Jadwal Masuk: <span class="text-slate-100 font-semibold">06:30 WIB</span> • Toleransi Terlambat: <span class="text-amber-400 font-semibold">06:35 WIB</span> • Jam Pulang: <span class="text-slate-100 font-semibold">11:50 WIB</span> (Pagi)<br>Masuk: <span class="text-slate-100 font-semibold">12:30 WIB</span> • Jam Pulang: <span class="text-slate-100 font-semibold">17:50 WIB</span> (Siang)';

        const shiftBadge = document.getElementById('shiftStatusBadge');
        if (shiftBadge) {
          const isPagi = new Date().getHours() < 12;
          shiftBadge.innerText = isPagi ? 'Shift Pagi Aktif' : 'Shift Siang Aktif';
          shiftBadge.className = isPagi
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0'
            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0';
        }

        // Kembalikan Kolom Identitas untuk Murid
        const secTitle = document.getElementById('sectionTitleIdentitas');
        if (secTitle) secTitle.innerText = '1. Identitas Lengkap Murid';
        const labelUserSel = document.getElementById('labelUserSelector');
        if (labelUserSel) labelUserSel.innerText = 'Pilih Rujukan Murid dari Database (Opsional):';
        const labelNm = document.getElementById('labelNama');
        if (labelNm) labelNm.innerText = 'Nama Lengkap Murid';
        document.getElementById('labelNomorInduk').innerText = 'Nomor Induk Siswa (NIS / NISN)';
        document.getElementById('labelGrup').innerText = 'Kelas / Jurusan (Rombel)';
        document.getElementById('labelJabatan').innerText = 'Status Siswa';
        const labelCat = document.getElementById('labelCatatan');
        if (labelCat) labelCat.innerText = 'Catatan / Alasan (Opsional untuk Sakit atau Izin):';

        const secStatus = document.getElementById('sectionStatusKehadiran');
        if (secStatus) secStatus.classList.remove('hidden');

        const secGuruSum = document.getElementById('sectionGuruMonitoringSummary');
        if (secGuruSum) secGuruSum.classList.add('hidden');

        const panelLive = document.getElementById('panelLiveMonitoringGuru');
        if (panelLive) panelLive.classList.add('hidden');

        const scanTitle = document.getElementById('scannerTitle');
        if (scanTitle) scanTitle.innerText = 'AI Face Biometric Scanner Murid';
        const scanBtnText = document.querySelector('#btnScanFace span');
        if (scanBtnText) scanBtnText.innerText = 'Pindai Wajah & Ambil Bukti';
        const faceText = document.getElementById('faceResultText');
        if (faceText) faceText.innerText = 'Arahkan pandangan ke lensa kamera untuk verifikasi biometric.';

        const submitLabel = document.getElementById('submitBtnLabel');
        if (submitLabel) submitLabel.innerText = 'KIRIM PRESENSI RESMI';
        const submitBtn = document.getElementById('btnSubmitPresensi');
        if (submitBtn) {
          submitBtn.className = 'w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 text-sm uppercase tracking-wider transition transform active:scale-98';
        }

        const badge = document.getElementById('currentPortalBadge');
        if (badge) {
          badge.innerText = 'Murid (Siswa)';
          badge.className = 'font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px]';
        }

        updateStatusButtonsForRoom('siswa');
        populateUserSelector();
      }
      lucide.createIcons();
    }

    /* Live Monitoring Real-Time Murid */
    function updateGuruLiveMonitoring() {
      const records = getStoredRecords();
      let hadirCount = 0, sakitCount = 0, izinCount = 0, alfaCount = 0;

      records.forEach(r => {
        if (r.status === 'H') hadirCount++;
        else if (r.status === 'S') sakitCount++;
        else if (r.status === 'I') izinCount++;
        else if (r.status === 'A') alfaCount++;
      });

      const qH = document.getElementById('quickStatHadir');
      if (qH) qH.innerText = hadirCount;
      const qS = document.getElementById('quickStatSakit');
      if (qS) qS.innerText = sakitCount;
      const qI = document.getElementById('quickStatIzin');
      if (qI) qI.innerText = izinCount;
      const qA = document.getElementById('quickStatAlfa');
      if (qA) qA.innerText = alfaCount;

      const tbody = document.getElementById('liveGuruMonitoringTableBody');
      if (!tbody) return;

      if (records.length === 0) {
        tbody.innerHTML = \`<tr>
          <td colspan="7" class="text-center py-6 text-slate-500">
            <i data-lucide="inbox" class="w-6 h-6 mx-auto mb-1 opacity-50"></i>
            Belum ada murid yang melakukan presensi hari ini.
          </td>
        </tr>\`;
        if (window.lucide) lucide.createIcons();
        return;
      }

      tbody.innerHTML = records.slice(0, 15).map(r => {
        let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
        let label = 'Hadir (H)';
        if (r.status === 'S') { badgeColor = 'bg-blue-500/20 text-blue-300 border-blue-500/40'; label = 'Sakit (S)'; }
        else if (r.status === 'I') { badgeColor = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'; label = 'Izin (I)'; }
        else if (r.status === 'A') { badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/40'; label = 'Alfa (A)'; }

        const verifiedBadge = r.isVerified
          ? '<span class="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">Terverifikasi</span>'
          : '<span class="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">Menunggu</span>';

        const photoImg = r.photo
          ? \`<img src="\${r.photo}" class="w-7 h-7 rounded-full object-cover mx-auto border border-indigo-400">\`
          : '<span class="text-slate-600">-</span>';

        return \`<tr class="hover:bg-slate-900/60 transition">
          <td class="px-4 py-2.5 font-mono text-slate-400">\${r.timeIn || '-'}</td>
          <td class="px-4 py-2.5">
            <div class="font-bold text-white">\${r.name}</div>
            <div class="text-[10px] text-slate-500 font-mono">NIS: \${r.userNumber || '-'}</div>
          </td>
          <td class="px-4 py-2.5 text-slate-300">\${r.group || '-'}</td>
          <td class="px-4 py-2.5 text-center">
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-full border \${badgeColor}">\${label}</span>
          </td>
          <td class="px-4 py-2.5 text-center">\${photoImg}</td>
          <td class="px-4 py-2.5 text-center">\${verifiedBadge}</td>
          <td class="px-4 py-2.5 text-right">
            \${!r.isVerified ? \`<button onclick="approveSingle('\${r.id}')" class="px-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded border border-emerald-500/40 text-[10px] font-bold transition">Sahkan</button>\` : '<span class="text-[10px] text-slate-500">Selesai</span>'}
          </td>
        </tr>\`;
      }).join('');

      if (window.lucide) lucide.createIcons();
    }

    function switchEntityMode(mode) {
      currentMode = 'sekolah';
      const navActiveName = document.getElementById('navActivePortalName');
      if (navActiveName) navActiveName.innerText = 'SMK KARTIKA X-1';

      const repHeader = document.getElementById('reportHeaderInstansi');
      if (repHeader) repHeader.innerHTML = 'PEMERINTAH PROVINSI DAERAH KHUSUS IBUKOTA JAKARTA<br>DINAS PENDIDIKAN — SMK KARTIKA X-1';
      const repAddr = document.getElementById('reportHeaderAddress');
      if (repAddr) repAddr.innerText = 'Jl. Jenderal Sudirman No. 45, Jakarta Pusat 10220 • Telp: (021) 555-3322 • Email: info@smkkartikax1.sch.id';
      const repLogo = document.getElementById('reportLogoText');
      if (repLogo) repLogo.innerText = 'SMK';
      const signL = document.getElementById('signLabelLeft');
      if (signL) signL.innerText = 'Wali Kelas / Guru Piket';
      const signNL = document.getElementById('signNameLeft');
      if (signNL) signNL.innerText = 'Budi Santoso, S.Kom';
      const signR = document.getElementById('signLabelRight');
      if (signR) signR.innerText = 'Kepala SMK KARTIKA X-1';
      const signNR = document.getElementById('signNameRight');
      if (signNR) signNR.innerText = 'Drs. H. Mulyadi, M.Pd';

      if (currentRoom === 'guru' && isGuruUnlocked) {
        switchToRoom('guru');
      } else {
        switchToRoom('siswa');
      }

      populateUserSelector();
      renderAttendanceTable();
      renderApprovalCards();
      updateDashboardAnalytics();
      renderMasterUsersTable();
      renderIdCardPreview();
      if (window.lucide) lucide.createIcons();
    }

    /* Tab Switcher */
    function switchTab(tabId) {
      if (tabId === 'tab-approval' && !isGuruUnlocked) {
        alert('Pusat Verifikasi & Approval hanya dapat diakses oleh Guru.');
        openGuruLockModal();
        return;
      }

      currentTab = tabId;
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
        tab.classList.remove('block');
      });

      const activeTabEl = document.getElementById(tabId);
      if (activeTabEl) {
        activeTabEl.classList.remove('hidden');
        activeTabEl.classList.add('block');
      }

      const navButtons = document.querySelectorAll('button[id^="nav-tab-"]');
      navButtons.forEach(btn => {
        btn.classList.remove('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/30');
        btn.classList.add('text-slate-400', 'hover:text-white', 'bg-slate-900/60');
      });

      const activeNavBtn = document.getElementById(\`nav-\${tabId}\`);
      if (activeNavBtn) {
        activeNavBtn.classList.remove('text-slate-400', 'hover:text-white', 'bg-slate-900/60');
        activeNavBtn.classList.add('bg-indigo-600', 'text-white', 'shadow-md', 'shadow-indigo-600/30');
      }

      if (tabId === 'tab-rekap') renderAttendanceTable();
      else if (tabId === 'tab-approval') renderApprovalCards();
      else if (tabId === 'tab-analitik') updateCharts();
      else if (tabId === 'tab-idcard') renderIdCardPreview();
      else if (tabId === 'tab-laporan') renderOfficialReport();
      else if (tabId === 'tab-master') renderMasterUsersTable();

      window.scrollTo({ top: 0, behavior: 'smooth' });
      lucide.createIcons();
    }
`;

// Replace from oldScriptStart to function switchTab(tabId) definition
const oldScriptHead = html.substring(
  html.indexOf(oldScriptStart),
  html.indexOf('/* -------------------------------------------------------------\n       KONTROL STATUS KEHADIRAN')
);

html = html.replace(oldScriptHead, newScriptLogic + '\n    ');

// Update submitAttendance in JS:
const oldSubmitFunc = html.substring(
  html.indexOf('function submitAttendance() {'),
  html.indexOf('function calculateDuration(timeIn, timeOut) {')
);

const newSubmitFunc = `function submitAttendance() {
      // -------------------------------------------------------------
      // RUANG GURU: Mengisi identitas hanya untuk verifikasi guru pemantau murid
      // -------------------------------------------------------------
      if (currentRoom === 'guru') {
        const namaGuru = document.getElementById('inputNama').value.trim();
        const nipGuru = document.getElementById('inputNomorInduk').value.trim();
        const mapel = document.getElementById('inputGrup').value.trim();
        const jabatan = document.getElementById('inputJabatan').value.trim();
        const catatan = document.getElementById('inputCatatan').value.trim();

        if (!namaGuru || !nipGuru) {
          alert('Mohon pilih atau lengkapi Nama Lengkap dan NIP Guru Pemantau terlebih dahulu!');
          playBeep('warn');
          if (!namaGuru) document.getElementById('inputNama').focus();
          else document.getElementById('inputNomorInduk').focus();
          return;
        }

        const fotoGuru = capturedFaceDataUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80';

        const guruPemantau = {
          name: namaGuru,
          nip: nipGuru,
          group: mapel || 'Tenaga Pendidik',
          role: jabatan || 'Wali Kelas / Guru Piket Pemantau',
          photo: fotoGuru,
          note: catatan,
          verifiedAt: new Date().toISOString()
        };
        localStorage.setItem('presensiku_guru_pemantau', JSON.stringify(guruPemantau));

        const signLeft = document.getElementById('signLabelLeft');
        if (signLeft) signLeft.innerText = jabatan || 'Wali Kelas / Guru Piket Pemantau';
        const signNameL = document.getElementById('signNameLeft');
        if (signNameL) signNameL.innerText = namaGuru;

        const records = getStoredRecords();
        let approvedCount = 0;
        records.forEach(r => {
          if (!r.isVerified) {
            r.isVerified = true;
            r.verifiedBy = namaGuru;
            approvedCount++;
          }
        });
        saveStoredRecords(records);

        playBeep('success');
        alert(\`Verifikasi Guru Berhasil!\\n\\n\${namaGuru} resmi terdaftar sebagai Guru Pemantau absensi murid.\\nSebanyak \${approvedCount} presensi murid hari ini telah disahkan resmi dalam berita acara.\`);

        renderApprovalCards();
        renderAttendanceTable();
        renderOfficialReport();
        updateDashboardAnalytics();
        updateGuruLiveMonitoring();
        return;
      }

      // -------------------------------------------------------------
      // RUANG MURID: Alur Pengisian Presensi Mandiri Siswa
      // -------------------------------------------------------------
      const nama = document.getElementById('inputNama').value.trim();
      const nomorInduk = document.getElementById('inputNomorInduk').value.trim();
      const grup = document.getElementById('inputGrup').value.trim();
      const jabatan = document.getElementById('inputJabatan').value.trim();
      const catatan = document.getElementById('inputCatatan').value.trim();

      if (!nama || !nomorInduk || !grup || !jabatan) {
        alert('Mohon lengkapi seluruh data identitas murid (Nama Lengkap, Nomor Induk/NIS, Kelas, dan Status) terlebih dahulu!');
        playBeep('warn');
        if (!nama) document.getElementById('inputNama').focus();
        else if (!nomorInduk) document.getElementById('inputNomorInduk').focus();
        else if (!grup) document.getElementById('inputGrup').focus();
        else if (!jabatan) document.getElementById('inputJabatan').focus();
        return;
      }

      if (!capturedFaceDataUrl) {
        useSimulatedFace();
      }

      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const currentTime = \`\${h}:\${m}:\${s}\`;
      const currentDate = \`\${now.getFullYear()}-\${String(now.getMonth() + 1).padStart(2, '0')}-\${String(now.getDate()).padStart(2, '0')}\`;

      const records = getStoredRecords();
      let existingRecord = records.find(r => r.userId === nomorInduk && r.date === currentDate);

      if (currentAttendanceType === 'masuk') {
        if (existingRecord) {
          alert(\`Murid [\${nama}] sudah melakukan Absen Masuk hari ini pada pukul \${existingRecord.timeIn}!\`);
          playBeep('warn');
          return;
        }

        const newRecord = {
          id: 'ATT-' + Date.now().toString().slice(-6),
          userId: nomorInduk,
          name: nama,
          userNumber: nomorInduk,
          group: grup,
          role: jabatan,
          date: currentDate,
          timeIn: currentTime,
          timeOut: '-',
          duration: '-',
          status: currentSelectedStatus,
          note: catatan,
          gps: 'Dalam Radius (12 Meter)',
          photo: capturedFaceDataUrl,
          signature: getSignatureDataUrl(),
          isVerified: false,
          verifiedBy: '-'
        };

        records.unshift(newRecord);
        saveStoredRecords(records);
        playBeep('success');
        showSuccessNotification('Murid', nama, currentTime, 'Masuk');
      } else {
        if (!existingRecord) {
          existingRecord = {
            id: 'ATT-' + Date.now().toString().slice(-6),
            userId: nomorInduk,
            name: nama,
            userNumber: nomorInduk,
            group: grup,
            role: jabatan,
            date: currentDate,
            timeIn: '06:30:00',
            timeOut: currentTime,
            duration: '-',
            status: currentSelectedStatus,
            note: catatan,
            gps: 'Dalam Radius (12 Meter)',
            photo: capturedFaceDataUrl,
            signature: getSignatureDataUrl(),
            isVerified: false,
            verifiedBy: '-'
          };
          existingRecord.duration = calculateDuration(existingRecord.timeIn, currentTime);
          records.unshift(existingRecord);
          saveStoredRecords(records);
          playBeep('success');
          showSuccessNotification('Murid', nama, currentTime, 'Pulang');
        } else {
          existingRecord.timeOut = currentTime;
          existingRecord.duration = calculateDuration(existingRecord.timeIn, currentTime);
          saveStoredRecords(records);
          playBeep('success');
          showSuccessNotification('Murid', nama, currentTime, 'Pulang');
        }
      }

      clearIdentityInputs();
      retakeFacePhoto();
      clearSignature();
      renderAttendanceTable();
      renderApprovalCards();
      updateDashboardAnalytics();
      updateGuruLiveMonitoring();
    }
`;

html = html.replace(oldSubmitFunc, newSubmitFunc);

// Update populateUserSelector to properly filter between students and teachers
const oldPopulateUser = html.substring(
  html.indexOf('function populateUserSelector() {'),
  html.indexOf('function onUserSelectChange() {')
);

const newPopulateUser = `function populateUserSelector() {
      const select = document.getElementById('userSelector');
      const cardSelect = document.getElementById('idCardUserSelect');
      if (!select) return;

      let users = getStoredUsers();
      if (currentRoom === 'guru') {
        users = users.filter(u => (u.role && (u.role.toLowerCase().includes('guru') || u.role.toLowerCase().includes('wali') || u.role.toLowerCase().includes('kepala'))));
      } else {
        users = users.filter(u => (u.role && u.role.toLowerCase().includes('siswa')));
      }

      const roleLabel = (currentRoom === 'guru') ? 'Guru Pemantau' : 'Murid / Siswa';
      select.innerHTML = \`<option value="">-- Pilih Nama \${roleLabel} --</option>\` +
        users.map(u => \`<option value="\${u.id}">\${u.name} (\${u.id} - \${u.group})</option>\`).join('');

      if (cardSelect) {
        cardSelect.innerHTML = \`<option value="">-- Pilih Anggota Cetak Kartu --</option>\` +
          users.map(u => \`<option value="\${u.id}">\${u.name} [\${u.role || u.group}]</option>\`).join('');
      }
    }
`;

html = html.replace(oldPopulateUser, newPopulateUser);

// Update DOMContentLoaded to ensure immediate direct entrance to Ruang Murid without popups
const oldDomLoaded = html.substring(
  html.indexOf("window.addEventListener('DOMContentLoaded', () => {"),
  html.indexOf("</script>\n</body>")
);

const newDomLoaded = `window.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();

      updateClock();
      setInterval(updateClock, 1000);

      initSignaturePad();
      startWebcam();
      refreshGPS();

      // Langsung masuk ke Ruang Murid untuk pengisian absen tanpa modal penghalang
      switchEntityMode('sekolah');
      switchToRoom('siswa');
      switchTab('tab-presensi');
      clearIdentityInputs();
    });
  `;

html = html.replace(oldDomLoaded, newDomLoaded);

// Save to both presensiku/index.html and index.html
fs.writeFileSync('presensiku/index.html', html, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully written complete presensiku/index.html and index.html');

// Validate all scripts
const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match, count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  if (match[1].trim().length > 0) {
    try {
      new vm.Script(match[1]);
      console.log('Script ' + count + ' is 100% VALID!');
    } catch (e) {
      console.error('Script ' + count + ' ERROR:', e.message);
      process.exit(1);
    }
  }
  count++;
}
console.log('ALL SCRIPTS SYNTACTICALLY VALID WITH ZERO ERRORS!');
