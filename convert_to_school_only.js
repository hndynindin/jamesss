const fs = require('fs');
const vm = require('vm');

let html = fs.readFileSync('presensiku/index.html', 'utf8');

// 1. Header subtitle
html = html.replace(
  '<p class="text-[11px] text-slate-400">Smart Attendance: Sekolah & Perusahaan (PT)</p>',
  '<p class="text-[11px] text-slate-400">Smart School Attendance: Murid & Guru (SMK KARTIKA X-1)</p>'
);

// 2. Navbar active portal indicator
html = html.replace(
  `<span id="navActivePortalName" class="font-bold text-white">SMK KARTIKA X-1</span>`,
  `<span id="navActivePortalName" class="font-bold text-indigo-300">Presensi SMK KARTIKA X-1</span>`
);

// 3. Demo dropdown menu (remove HRD and Karyawan)
const oldDemoDropdown = /<div id="demoDropdown"[\s\S]*?<!-- Dropdown menu -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

// Let's replace the inner demo dropdown specifically
const oldDropdownInner = /<!-- Dropdown menu -->[\s\S]*?<div id="demoDropdown"[\s\S]*?<\/div>\s*<\/div>/;

const newDropdownInner = `<!-- Dropdown menu -->
            <div id="demoDropdown"
              class="hidden absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50">
              <div class="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Login 1-Klik Penguji
              </div>
              <button onclick="loginAs('admin')"
                class="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-slate-800 flex items-center justify-between group">
                <div>
                  <p class="font-bold text-slate-200 group-hover:text-indigo-400">Super Admin</p>
                  <p class="text-[10px] text-slate-400">Akses penuh sistem sekolah</p>
                </div>
                <span class="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">Admin</span>
              </button>
              <button onclick="loginAs('guru')"
                class="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-slate-800 flex items-center justify-between group">
                <div>
                  <p class="font-bold text-slate-200 group-hover:text-indigo-400">Budi Santoso, S.Kom</p>
                  <p class="text-[10px] text-slate-400">Wali Kelas XII TKJ 1 / Guru</p>
                </div>
                <span class="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">Guru</span>
              </button>
              <button onclick="loginAs('siswa')"
                class="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-slate-800 flex items-center justify-between group">
                <div>
                  <p class="font-bold text-slate-200 group-hover:text-indigo-400">Ahmad Fauzi (Siswa)</p>
                  <p class="text-[10px] text-slate-400">Kelas XII TKJ 1</p>
                </div>
                <span class="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">Siswa</span>
              </button>
              <div class="border-t border-slate-800 my-1"></div>
              <button onclick="loginAs('guest')"
                class="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1.5">
                <i data-lucide="zap" class="w-3.5 h-3.5 text-amber-400"></i>
                <span>Tanpa login - langsung pakai</span>
              </button>
              <div class="border-t border-slate-800 my-1"></div>
              <button onclick="openLoginModal()"
                class="w-full py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-bold rounded-lg text-[10px] flex items-center justify-center gap-1 transition">
                <i data-lucide="shield" class="w-3 h-3"></i>
                <span>Buka Form Login & Akun Demo</span>
              </button>
            </div>
          </div>`;

if (oldDropdownInner.test(html)) {
  html = html.replace(oldDropdownInner, newDropdownInner);
  console.log('Successfully updated demo dropdown (removed HRD & Karyawan)');
} else {
  console.warn('oldDropdownInner not matched');
}

// 4. Update Login Modal (remove HRD & Karyawan buttons)
const oldLoginModalContent = /<!-- Header Modal -->[\s\S]*?<p class="text-xs text-slate-400">Sistem Presensi Terpadu Sekolah & Perusahaan<\/p>[\s\S]*?<!-- KOTAK AKUN DEMO UJI COBA \(SESUAI ATURAN MUTLAK\) -->[\s\S]*?<\/div>\s*<\/div>\s*<!-- FORM LOGIN -->/;

const newLoginModalContent = `<!-- Header Modal -->
      <div class="text-center space-y-1">
        <div
          class="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mx-auto mb-2">
          <i data-lucide="shield-check" class="w-6 h-6"></i>
        </div>
        <h3 class="text-lg font-bold text-white">Autentikasi Presensi Sekolah</h3>
        <p class="text-xs text-slate-400">Sistem Presensi SMK KARTIKA X-1 (Murid & Guru)</p>
      </div>

      <!-- KOTAK AKUN DEMO UJI COBA (SESUAI ATURAN MUTLAK) -->
      <div class="bg-slate-950 p-3.5 rounded-2xl border border-indigo-500/30 space-y-2">
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-amber-300 flex items-center gap-1.5">
            <i data-lucide="key" class="w-3.5 h-3.5"></i> Akun Demo Uji Coba:
          </span>
          <span class="text-[10px] text-slate-400">Klik untuk isi otomatis</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px]">
          <button type="button" onclick="fillLoginForm('admin', 'admin123', 'admin')"
            class="text-left px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 text-slate-200 transition">
            👑 <strong>Admin</strong>: admin
          </button>
          <button type="button" onclick="fillLoginForm('guru_budi', 'guru123', 'guru')"
            class="text-left px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 text-slate-200 transition">
            👨‍🏫 <strong>Guru</strong>: guru_budi
          </button>
          <button type="button" onclick="fillLoginForm('20240101', 'siswa123', 'siswa')"
            class="text-left px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 text-slate-200 transition">
            🎓 <strong>Siswa</strong>: 20240101
          </button>
        </div>
      </div>

      <!-- FORM LOGIN -->`;

if (oldLoginModalContent.test(html)) {
  html = html.replace(oldLoginModalContent, newLoginModalContent);
  console.log('Successfully updated Login Modal');
} else {
  console.warn('oldLoginModalContent not matched');
}

// 5. Update #rolePortalModal: Pure School Portal for Murid and Guru only
const oldModalMarkup = /<!-- ================= MODAL PILIHAN AWAL: PORTAL SEKOLAH VS PORTAL PERUSAHAAN ================= -->[\s\S]*?<!-- ================= MODAL KUNCI RUANG GURU ================= -->/;

const newSchoolModalMarkup = `<!-- ================= MODAL PILIHAN AWAL: PORTAL SEKOLAH (MURID & GURU) ================= -->
  <div id="rolePortalModal"
    class="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
    <div
      class="bg-slate-900 border border-indigo-500/50 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 my-auto">

      <!-- Close button -->
      <button onclick="closeRolePortalModal()" class="absolute top-4 right-4 text-slate-400 hover:text-white p-2" title="Tutup Modal">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>

      <!-- Header Selamat Datang -->
      <div class="text-center space-y-2">
        <div
          class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-bold">
          <i data-lucide="graduation-cap" class="w-4 h-4"></i> PRESENSI RESMI SMK KARTIKA X-1
        </div>
        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white">Selamat Datang di PRESENSIKU PRO</h2>
        <p class="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Sistem Absensi Kehadiran Sekolah Berbasis AI Biometrics & Face Scan untuk Murid dan Guru SMK KARTIKA X-1.
        </p>
      </div>

      <!-- Dua Pilihan Ruang Sekolah: Ruang Murid vs Ruang Guru -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">

        <!-- ================= 1. RUANG MURID / SISWA ================= -->
        <div
          class="bg-slate-950 border-2 border-emerald-500/40 hover:border-emerald-400 rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all space-y-5 shadow-xl relative overflow-hidden group">
          <div
            class="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-600/10 rounded-full blur-2xl group-hover:bg-emerald-600/20 transition">
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div
                class="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <i data-lucide="user" class="w-6 h-6"></i>
              </div>
              <span
                class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Akses Terbuka
              </span>
            </div>

            <div>
              <h3 class="text-lg font-black text-white">1. Ruang Murid / Siswa</h3>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                Presensi mandiri murid sesuai rombel kelas. Scan wajah AI kamera, tanda tangan digital, jadwal Shift Pagi (06:30) & Siang (12:30).
              </p>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-800">
            <button type="button" onclick="enterRoomMurid()"
              class="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition active:scale-98">
              <i data-lucide="log-in" class="w-4 h-4"></i>
              <span>Masuk Sebagai Murid</span>
            </button>
          </div>
        </div>

        <!-- ================= 2. RUANG GURU / WALI KELAS ================= -->
        <div
          class="bg-slate-950 border-2 border-amber-500/40 hover:border-amber-400 rounded-3xl p-5 sm:p-6 flex flex-col justify-between transition-all space-y-5 shadow-xl relative overflow-hidden group">
          <div
            class="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl group-hover:bg-amber-600/20 transition">
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div
                class="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <i data-lucide="lock" class="w-6 h-6"></i>
              </div>
              <span
                class="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                Terproteksi Sandi
              </span>
            </div>

            <div>
              <h3 class="text-lg font-black text-white">2. Ruang Guru / Wali Kelas</h3>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">
                Khusus tenaga pendidik & wali kelas untuk presensi tugas mengajar, approval izin sakit/alasan siswa, dan pengesahan rekapitulasi.
              </p>
            </div>

            <!-- Input Kata Sandi Guru (Rahasia, tanpa teks contoh 3322) -->
            <div class="space-y-1.5 pt-2 border-t border-slate-800">
              <label class="text-xs text-slate-300 font-semibold block">Kata Sandi Guru:</label>
              <input type="password" id="inputInitialGuruPass" placeholder="Masukkan kata sandi guru..."
                class="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono tracking-widest focus:outline-none focus:border-amber-500">
              <p id="portalPassErrorMsg" class="text-[11px] text-rose-400 hidden"></p>
            </div>
          </div>

          <div class="pt-2">
            <button type="button" onclick="enterRoomGuru()"
              class="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition active:scale-98">
              <i data-lucide="key" class="w-4 h-4"></i>
              <span>Masuk Sebagai Guru</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>

  <!-- ================= MODAL KUNCI RUANG GURU ================= -->`;

if (oldModalMarkup.test(html)) {
  html = html.replace(oldModalMarkup, newSchoolModalMarkup);
  console.log('Successfully updated #rolePortalModal to Pure School Modal');
} else {
  console.warn('oldModalMarkup not matched');
}

// 6. Update Tab 3 heading and description
html = html.replace(
  '<!-- ================= TAB 3: VERIFIKASI & APPROVAL (Wali Kelas / HRD) ================= -->',
  '<!-- ================= TAB 3: VERIFIKASI & APPROVAL (Wali Kelas & Guru Piket) ================= -->'
);
html = html.replace(
  'Khusus Wali Kelas, Guru Piket, atau HRD / Manager PT untuk menandatangani dan mensahkan rekap absensi.',
  'Khusus Wali Kelas dan Guru Piket untuk memverifikasi, menandatangani, dan mensahkan perizinan & rekap absensi siswa.'
);

// 7. Update Tab 5 / Tab 6 / Tab 7 references
html = html.replace(
  'Pilih Siswa / Karyawan untuk Dicetak:',
  'Pilih Siswa / Guru untuk Dicetak:'
);
html = html.replace(
  '<span>Manajemen Data Master (Siswa, Guru, Karyawan)</span>',
  '<span>Manajemen Data Master (Siswa & Guru)</span>'
);
html = html.replace(
  '<option value="karyawan">Karyawan PT</option>',
  ''
);

// 8. Update Tab 8 guide references
html = html.replace(
  'Nama lengkap, NIS/NISN siswa atau NIK/Employee ID karyawan, dan rombel',
  'Nama lengkap, NIS/NISN siswa atau NIP guru, dan rombel kelas/unit tugas'
);
html = html.replace(
  'koordinat GPS geofence, dan stempel verifikasi Wali Kelas / HRD.',
  'koordinat GPS geofence, dan stempel verifikasi Wali Kelas / Guru Piket.'
);

// 9. Update defaultMasterUsers and JavaScript
const oldStateSection = /let currentMode = 'sekolah';[\s\S]*?const defaultMasterUsers = \[[\s\S]*?\];\s*const defaultUsers = defaultMasterUsers;/;

const newStateSection = `let currentMode = 'sekolah'; // Murni Absensi Sekolah (Siswa & Guru)
    let currentPortal = 'siswa'; // 'siswa' atau 'guru'
    let currentRoom = 'siswa'; // 'siswa' (Ruang Murid) atau 'guru' (Ruang Guru)
    let isGuruUnlocked = false; // true setelah verifikasi sandi 3322
    const GURU_PIN = '3322';

    let currentTab = 'tab-presensi';
    let currentAttendanceType = 'masuk'; // 'masuk' atau 'pulang'
    let currentSelectedStatus = 'H'; // 'H', 'T', 'S', 'I', 'Dinas', 'A'
    let capturedFaceDataUrl = null;
    let webcamStream = null;
    let isWebcamActive = false;
    let currentGpsData = { lat: -6.2088, lng: 106.8456, accuracy: 12, inRadius: true };
    let donutChartInstance = null;
    let barChartInstance = null;

    // Database Master Pengguna Sekolah (Siswa & Guru SMK KARTIKA X-1)
    const defaultMasterUsers = [
      // Siswa
      { id: '20240101', name: 'Ahmad Fauzi', group: 'XII TKJ 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { id: '20240102', name: 'Nabila Azzahra', group: 'XII TKJ 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
      { id: '20240103', name: 'Dimas Setiawan', group: 'XI TKJ 2', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { id: '20240104', name: 'Putri Maharani', group: 'X TKJ 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
      { id: '20240105', name: 'Rizky Pratama', group: 'XII RPL 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
      // Guru & Tenaga Pendidik
      { id: '198205122008011009', name: 'Budi Santoso, S.Kom', group: 'Teknik Komputer & Jaringan', role: 'Wali Kelas / Guru Piket', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
      { id: '197908142005022004', name: 'Dewi Lestari, M.Pd', group: 'Matematika & Produktif', role: 'Guru Pengajar', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
      { id: '196803151994031005', name: 'Drs. H. Suryanto, M.M', group: 'Manajemen Sekolah', role: 'Kepala Sekolah', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' }
    ];
    const defaultUsers = defaultMasterUsers;`;

if (oldStateSection.test(html)) {
  html = html.replace(oldStateSection, newStateSection);
  console.log('Successfully updated defaultMasterUsers and state section');
} else {
  console.warn('oldStateSection not matched, trying fallback replace');
  html = html.replace(/const defaultMasterUsers = \[[\s\S]*?\];/, `const defaultMasterUsers = [
      // Siswa
      { id: '20240101', name: 'Ahmad Fauzi', group: 'XII TKJ 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
      { id: '20240102', name: 'Nabila Azzahra', group: 'XII TKJ 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80' },
      { id: '20240103', name: 'Dimas Setiawan', group: 'XI TKJ 2', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
      { id: '20240104', name: 'Putri Maharani', group: 'X TKJ 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
      { id: '20240105', name: 'Rizky Pratama', group: 'XII RPL 1', role: 'Siswa', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80' },
      // Guru
      { id: '198205122008011009', name: 'Budi Santoso, S.Kom', group: 'Teknik Komputer & Jaringan', role: 'Wali Kelas / Guru Piket', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80' },
      { id: '197908142005022004', name: 'Dewi Lestari, M.Pd', group: 'Matematika & Produktif', role: 'Guru Pengajar', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80' },
      { id: '196803151994031005', name: 'Drs. H. Suryanto, M.M', group: 'Manajemen Sekolah', role: 'Kepala Sekolah', entity: 'sekolah', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' }
    ];
    const defaultUsers = defaultMasterUsers;`);
}

// 10. Write files
fs.writeFileSync('presensiku/index.html', html, 'utf8');
fs.writeFileSync('index.html', html, 'utf8');

// Verify syntax
const scriptMatches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
let valid = true;
scriptMatches.forEach((m, idx) => {
  try {
    new vm.Script(m[1], { filename: 'script_' + idx + '.js' });
    console.log(`Script ${idx} is 100% VALID!`);
  } catch(e) {
    valid = false;
    console.error(`Script ${idx} ERROR:`, e.message);
  }
});

if (valid) {
  console.log('ALL SCRIPTS SYNTACTICALLY VALID WITH ZERO ERRORS!');
}
