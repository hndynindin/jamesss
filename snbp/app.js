const STORAGE_KEY = 'snbp_smartpath_state_v1';

// Katalog Program Studi & PTN Indonesia (Data Simulasi Keketatan & Daya Tampung)
const PTN_CATALOG = [
  { id: 'ui-ilkom', ptn: 'Universitas Indonesia', prodi: 'Ilmu Komputer', jenjang: 'S1', provinsi: 'Jawa Barat', dayaTampung: 75, peminat: 2450, minSkor: 89.5, rumpun: 'RPL / Informatika' },
  { id: 'ui-si', ptn: 'Universitas Indonesia', prodi: 'Sistem Informasi', jenjang: 'S1', provinsi: 'Jawa Barat', dayaTampung: 80, peminat: 2100, minSkor: 88.0, rumpun: 'RPL / Informatika' },
  { id: 'itb-stei', ptn: 'Institut Teknologi Bandung', prodi: 'STEI - Komputasi', jenjang: 'S1', provinsi: 'Jawa Barat', dayaTampung: 95, peminat: 3120, minSkor: 90.2, rumpun: 'RPL / Informatika' },
  { id: 'ugm-ti', ptn: 'Universitas Gadjah Mada', prodi: 'Teknologi Informasi', jenjang: 'S1', provinsi: 'DI Yogyakarta', dayaTampung: 60, peminat: 1980, minSkor: 88.8, rumpun: 'RPL / Informatika' },
  { id: 'ugm-trpl', ptn: 'Universitas Gadjah Mada', prodi: 'Teknologi Rekayasa Perangkat Lunak', jenjang: 'D4', provinsi: 'DI Yogyakarta', dayaTampung: 54, peminat: 1120, minSkor: 84.5, rumpun: 'RPL / Informatika' },
  { id: 'its-if', ptn: 'Institut Teknologi Sepuluh Nopember', prodi: 'Teknik Informatika', jenjang: 'S1', provinsi: 'Jawa Timur', dayaTampung: 90, peminat: 2680, minSkor: 87.9, rumpun: 'RPL / Informatika' },
  { id: 'its-si', ptn: 'Institut Teknologi Sepuluh Nopember', prodi: 'Sistem Informasi', jenjang: 'S1', provinsi: 'Jawa Timur', dayaTampung: 72, peminat: 1640, minSkor: 86.2, rumpun: 'RPL / Informatika' },
  { id: 'ipb-ilkom', ptn: 'IPB University', prodi: 'Ilmu Komputer', jenjang: 'S1', provinsi: 'Jawa Barat', dayaTampung: 65, peminat: 1510, minSkor: 85.8, rumpun: 'RPL / Informatika' },
  { id: 'ipb-trpl', ptn: 'IPB University', prodi: 'Teknologi Rekayasa Perangkat Lunak', jenjang: 'D4', provinsi: 'Jawa Barat', dayaTampung: 70, peminat: 980, minSkor: 82.4, rumpun: 'RPL / Informatika' },
  { id: 'ub-ti', ptn: 'Universitas Brawijaya', prodi: 'Teknik Informatika', jenjang: 'S1', provinsi: 'Jawa Timur', dayaTampung: 110, peminat: 2390, minSkor: 85.0, rumpun: 'RPL / Informatika' },
  { id: 'undip-if', ptn: 'Universitas Diponegoro', prodi: 'Informatika', jenjang: 'S1', provinsi: 'Jawa Tengah', dayaTampung: 85, peminat: 1850, minSkor: 84.8, rumpun: 'RPL / Informatika' },
  { id: 'unpad-if', ptn: 'Universitas Padjadjaran', prodi: 'Teknik Informatika', jenjang: 'S1', provinsi: 'Jawa Barat', dayaTampung: 55, peminat: 1790, minSkor: 86.0, rumpun: 'RPL / Informatika' },
  { id: 'unj-ptik', ptn: 'Universitas Negeri Jakarta', prodi: 'Pendidikan Teknik Informatika & Komputer', jenjang: 'S1', provinsi: 'DKI Jakarta', dayaTampung: 48, peminat: 920, minSkor: 81.5, rumpun: 'RPL / Informatika' },
  { id: 'upnvj-if', ptn: 'UPN Veteran Jakarta', prodi: 'Informatika', jenjang: 'S1', provinsi: 'DKI Jakarta', dayaTampung: 70, peminat: 1580, minSkor: 83.2, rumpun: 'RPL / Informatika' },
  { id: 'pnj-ti', ptn: 'Politeknik Negeri Jakarta', prodi: 'Teknik Informatika', jenjang: 'D4', provinsi: 'Jawa Barat', dayaTampung: 64, peminat: 1050, minSkor: 80.5, rumpun: 'RPL / Informatika' },
  { id: 'polinema-ti', ptn: 'Politeknik Negeri Malang', prodi: 'Teknik Informatika', jenjang: 'D4', provinsi: 'Jawa Timur', dayaTampung: 120, peminat: 1420, minSkor: 79.8, rumpun: 'RPL / Informatika' },
  { id: 'pens-ti', ptn: 'Politeknik Elektronika Negeri Surabaya', prodi: 'Teknik Informatika', jenjang: 'D4', provinsi: 'Jawa Timur', dayaTampung: 75, peminat: 1150, minSkor: 82.8, rumpun: 'RPL / Informatika' },
  { id: 'unair-ak', ptn: 'Universitas Airlangga', prodi: 'Akuntansi', jenjang: 'S1', provinsi: 'Jawa Timur', dayaTampung: 90, peminat: 1760, minSkor: 85.4, rumpun: 'Akuntansi / Bisnis' },
  { id: 'ui-ak', ptn: 'Universitas Indonesia', prodi: 'Akuntansi', jenjang: 'S1', provinsi: 'Jawa Barat', dayaTampung: 105, peminat: 2300, minSkor: 88.9, rumpun: 'Akuntansi / Bisnis' },
  { id: 'ugm-man', ptn: 'Universitas Gadjah Mada', prodi: 'Manajemen', jenjang: 'S1', provinsi: 'DI Yogyakarta', dayaTampung: 80, peminat: 2540, minSkor: 89.0, rumpun: 'IPS / Soshum' },
  { id: 'unnes-si', ptn: 'Universitas Negeri Semarang', prodi: 'Sistem Informasi', jenjang: 'S1', provinsi: 'Jawa Tengah', dayaTampung: 52, peminat: 890, minSkor: 80.2, rumpun: 'RPL / Informatika' },
  { id: 'uns-if', ptn: 'Universitas Sebelas Maret', prodi: 'Informatika', jenjang: 'S1', provinsi: 'Jawa Tengah', dayaTampung: 60, peminat: 1620, minSkor: 84.9, rumpun: 'RPL / Informatika' },
  { id: 'usu-if', ptn: 'Universitas Sumatera Utara', prodi: 'Ilmu Komputer', jenjang: 'S1', provinsi: 'Sumatera Utara', dayaTampung: 72, peminat: 1380, minSkor: 82.0, rumpun: 'RPL / Informatika' },
  { id: 'unhas-if', ptn: 'Universitas Hasanuddin', prodi: 'Teknik Informatika', jenjang: 'S1', provinsi: 'Sulawesi Selatan', dayaTampung: 68, peminat: 1290, minSkor: 81.8, rumpun: 'RPL / Informatika' }
];

const DEFAULT_STATE = {
  role: 'Siswa (Tanpa Login)',
  profile: {
    nama: 'Aulia Rahman',
    sekolah: 'SMKN 1 Jakarta',
    provinsi: 'DKI Jakarta',
    akreditasi: 'A',
    jurusan: 'RPL / Informatika',
    alumni: 82
  },
  subjects: [
    { id: 's1', name: 'Matematika', category: 'Pendukung Utama', scores: [86, 87, 89, 90, 92] },
    { id: 's2', name: 'Bahasa Indonesia', category: 'Wajib Nasional', scores: [84, 85, 86, 88, 89] },
    { id: 's3', name: 'Bahasa Inggris', category: 'Wajib Nasional', scores: [85, 86, 88, 89, 91] },
    { id: 's4', name: 'Pemrograman Web & Perangkat Bergerak', category: 'Kejuruan / Peminatan', scores: [88, 90, 91, 93, 95] },
    { id: 's5', name: 'Basis Data & Algoritma', category: 'Kejuruan / Peminatan', scores: [85, 87, 88, 90, 92] },
    { id: 's6', name: 'Pendidikan Pancasila', category: 'Wajib Nasional', scores: [83, 84, 85, 86, 88] }
  ],
  prestasi: [
    { id: 'p1', nama: 'LKS Web Technologies Tingkat Provinsi', tingkat: 'Provinsi', juara: 'Juara 1', tahun: 2025, poin: 30 },
    { id: 'p2', nama: 'Olimpiade Informatika Nasional (OIN)', tingkat: 'Nasional', juara: 'Finalis', tahun: 2024, poin: 32 }
  ],
  choices: {
    prodi1: 'upnvj-if',
    prodi2: 'pnj-ti'
  },
  totalSiswaJurusan: 30,
  eligibleStudents: [
    { id: 'e1', nisn: '0084129011', nama: 'Aulia Rahman', nilai: 88.23, isSelf: true },
    { id: 'e2', nisn: '0084129012', nama: 'Bima Pratama', nilai: 89.40 },
    { id: 'e3', nisn: '0084129013', nama: 'Citra Dewi Lestari', nilai: 87.85 },
    { id: 'e4', nisn: '0084129014', nama: 'Dimas Saputra', nilai: 86.90 },
    { id: 'e5', nisn: '0084129015', nama: 'Eka Putri Maharani', nilai: 86.10 },
    { id: 'e6', nisn: '0084129016', nama: 'Fajar Nugroho', nilai: 85.45 },
    { id: 'e7', nisn: '0084129017', nama: 'Gita Savitri', nilai: 84.80 },
    { id: 'e8', nisn: '0084129018', nama: 'Hendra Wijaya', nilai: 84.12 },
    { id: 'e9', nisn: '0084129019', nama: 'Intan Permata', nilai: 83.55 },
    { id: 'e10', nisn: '0084129020', nama: 'Joko Susilo', nilai: 82.90 },
    { id: 'e11', nisn: '0084129021', nama: 'Kartika Sari', nilai: 82.15 },
    { id: 'e12', nisn: '0084129022', nama: 'Luthfi Hakim', nilai: 81.40 },
    { id: 'e13', nisn: '0084129023', nama: 'Maya Anggraini', nilai: 80.75 },
    { id: 'e14', nisn: '0084129024', nama: 'Naufal Aziz', nilai: 79.90 }
  ]
};

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Gagal membaca localStorage:', e);
  }
  return structuredClone(DEFAULT_STATE);
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Gagal menyimpan state:', e);
  }
}

function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

// Perhitungan Statistik Rapor
function getRaporStats() {
  const semTotals = [0, 0, 0, 0, 0];
  const count = state.subjects.length || 1;

  state.subjects.forEach((subj) => {
    subj.scores.forEach((val, idx) => {
      semTotals[idx] += Number(val) || 0;
    });
  });

  const semAverages = semTotals.map((t) => t / count);
  const overallAvg = semAverages.reduce((a, b) => a + b, 0) / 5;

  const pendukungSubjs = state.subjects.filter(
    (s) => s.category === 'Pendukung Utama' || s.category === 'Kejuruan / Peminatan'
  );
  let pendukungAvg = overallAvg;
  if (pendukungSubjs.length > 0) {
    const sumP = pendukungSubjs.reduce(
      (acc, s) => acc + s.scores.reduce((a, b) => a + Number(b), 0) / 5,
      0
    );
    pendukungAvg = sumP / pendukungSubjs.length;
  }

  const trendDelta = semAverages[4] - semAverages[0];
  return { semAverages, overallAvg, pendukungAvg, trendDelta };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getPrestasiScore() {
  const top3 = [...state.prestasi].sort((a, b) => b.poin - a.poin).slice(0, 3);
  const total = top3.reduce((sum, p) => sum + p.poin, 0);
  return Math.min(100, total);
}

function getQuotaRatio(akreditasi) {
  if (akreditasi === 'A') return 0.4;
  if (akreditasi === 'B') return 0.25;
  return 0.05;
}

// Mesin SPK (Simple Additive Weighting) Peluang SNBP
function calculateProdiChance(prodi) {
  if (!prodi) return { score: 0, chancePct: 0, label: 'Belum Dipilih', badge: 'badge-info' };
  const { overallAvg, pendukungAvg, trendDelta } = getRaporStats();
  const prestasiScore = getPrestasiScore();
  const akredBonus = state.profile.akreditasi === 'A' ? 95 : state.profile.akreditasi === 'B' ? 82 : 68;
  const alumniScore = Number(state.profile.alumni) || 70;
  const jurusanMatch = prodi.rumpun === state.profile.jurusan ? 100 : 76;

  // Bobot SNBP: Rapor 50%, Pendukung & Linieritas 20%, Prestasi 15%, Sekolah & Alumni 15%
  const compositeScore =
    overallAvg * 0.5 +
    (pendukungAvg * 0.7 + jurusanMatch * 0.3) * 0.2 +
    (prestasiScore * 0.6 + 40) * 0.15 +
    (akredBonus * 0.5 + alumniScore * 0.5) * 0.15;

  const trendBonus = trendDelta > 2 ? 2.2 : trendDelta > 0 ? 1.0 : -1.5;
  const finalIndex = compositeScore + trendBonus;
  const diff = finalIndex - prodi.minSkor;

  let chancePct = Math.round(62 + diff * 5.2);
  chancePct = Math.max(12, Math.min(96, chancePct));

  let label = 'Ketat — Perlu Penguatan';
  let badge = 'badge-danger';
  if (chancePct >= 75) {
    label = 'Peluang Tinggi (Rekomendasi)';
    badge = 'badge-success';
  } else if (chancePct >= 52) {
    label = 'Peluang Sedang (Kompetitif)';
    badge = 'badge-warning';
  }

  return { score: finalIndex, chancePct, label, badge };
}

// Navigasi Tab
function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const titles = {
    dashboard: ['Dashboard & Analisis Kelayakan', 'Ringkasan nilai rapor, indeks prestasi, dan peluang lolos SNBP'],
    panduan: ['Tujuan, Kegunaan & Alur Tes', 'Panduan lengkap penggunaan aplikasi dan langkah memulai simulasi SNBP'],
    rapor: ['Nilai Rapor Semester 1–5', 'Kelola nilai mata pelajaran umum dan kejuruan untuk perhitungan PDSS'],
    prestasi: ['Prestasi & Portofolio', 'Tambahkan sertifikat lomba untuk mendongkrak bobot penilaian SNBP'],
    simulasi: ['Cek Peluang & Simulasi PTN', 'Analisis peluang kelolosan dengan metode SAW dan aturan provinsi'],
    eligible: ['Pemeringkatan Sekolah (PDSS)', 'Simulasi penentuan siswa eligible sesuai kuota akreditasi sekolah']
  };

  function switchTab(tabId) {
    navItems.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabId));
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });
    document.getElementById('pageTitle').textContent = titles[tabId][0];
    document.getElementById('pageSubtitle').textContent = titles[tabId][1];
    document.getElementById('sidebar').classList.remove('open');
    if (tabId === 'dashboard') drawRaporChart();
  }

  navItems.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.dataset.goto));
  });

  document.querySelectorAll('[data-start-test]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.subjects.forEach((s) => {
        s.scores = ['', '', '', '', ''];
      });
      state.prestasi = [];
      state.choices = { prodi1: '', prodi2: '' };
      const selfEntry = state.eligibleStudents.find((s) => s.isSelf);
      if (selfEntry) selfEntry.nilai = 0;
      saveState();
      renderAll();
      switchTab('rapor');
      showToast('Tes baru dimulai (nilai masih kosong). Silakan isi nilai rapor Anda!');
    });
  });

  document.getElementById('menuToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
}

// Gambar Grafik Tren Nilai Rapor (Canvas)
function drawRaporChart() {
  const canvas = document.getElementById('raporChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const { semAverages } = getRaporStats();

  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const pad = { top: 28, right: 32, bottom: 38, left: 46 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const minVal = Math.max(60, Math.floor(Math.min(...semAverages) - 4));
  const maxVal = Math.min(100, Math.ceil(Math.max(...semAverages) + 3));

  // Grid lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.font = '12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#64748b';

  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (plotH * i) / 4;
    const val = (maxVal - ((maxVal - minVal) * i) / 4).toFixed(0);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText(val, 10, y + 4);
  }

  const points = semAverages.map((val, idx) => {
    const x = pad.left + (plotW * idx) / 4;
    const y = pad.top + plotH - ((val - minVal) / (maxVal - minVal || 1)) * plotH;
    return { x, y, val };
  });

  // Area fill
  const grad = ctx.createLinearGradient(0, pad.top, 0, h - pad.bottom);
  grad.addColorStop(0, 'rgba(29, 78, 216, 0.22)');
  grad.addColorStop(1, 'rgba(29, 78, 216, 0.0)');
  ctx.beginPath();
  ctx.moveTo(points[0].x, h - pad.bottom);
  points.forEach((p) => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, h - pad.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Points & Labels
  points.forEach((p, idx) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1d4ed8';
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText(p.val.toFixed(1), p.x - 14, p.y - 12);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Sem ${idx + 1}`, p.x - 16, h - 12);
  });
}

// Render Dashboard & KPI
function renderDashboard() {
  const { overallAvg, trendDelta } = getRaporStats();
  const prestasiScore = getPrestasiScore();
  const prodi1 = PTN_CATALOG.find((p) => p.id === state.choices.prodi1);
  const res1 = calculateProdiChance(prodi1);

  document.getElementById('kpiAvgRapor').textContent = overallAvg.toFixed(2);
  const trendEl = document.getElementById('kpiRaporTrend');
  const trendBadge = document.getElementById('trendBadge');
  if (trendDelta >= 0) {
    trendEl.textContent = `+${trendDelta.toFixed(2)} poin dari Sem 1 ke Sem 5`;
    trendEl.className = 'kpi-trend positive';
    trendBadge.textContent = 'Tren Positif (Naik)';
    trendBadge.className = 'badge badge-success';
  } else {
    trendEl.textContent = `${trendDelta.toFixed(2)} poin dari Sem 1 ke Sem 5`;
    trendEl.className = 'kpi-trend warning';
    trendBadge.textContent = 'Tren Menurun';
    trendBadge.className = 'badge badge-warning';
  }

  document.getElementById('kpiPrestasi').textContent = `${prestasiScore}`;
  document.getElementById('kpiPrestasiCount').textContent = `${state.prestasi.length} sertifikat tercatat`;

  document.getElementById('kpiPeluang1').textContent = `${res1.chancePct}%`;
  document.getElementById('kpiProdi1Name').textContent = prodi1 ? `${prodi1.ptn} — ${prodi1.prodi}` : 'Belum dipilih';

  // Eligible check
  const sorted = [...state.eligibleStudents].sort((a, b) => b.nilai - a.nilai);
  const kuota = Math.max(1, Math.floor(state.totalSiswaJurusan * getQuotaRatio(state.profile.akreditasi)));
  const myIndex = sorted.findIndex((s) => s.nama.toLowerCase() === state.profile.nama.toLowerCase());
  const rank = myIndex >= 0 ? myIndex + 1 : 1;
  const isEligible = rank <= kuota;

  document.getElementById('kpiEligibleStatus').textContent = isEligible ? 'Eligible' : 'Cadangan';
  document.getElementById('kpiEligibleRank').textContent = `Peringkat #${rank} (Kuota ${kuota} siswa)`;

  // Topbar Chip
  const initials = state.profile.nama
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('');
  document.getElementById('avatarInitial').textContent = initials || 'SW';
  document.getElementById('chipName').textContent = state.profile.nama;
  document.getElementById('chipMeta').textContent = `${state.profile.sekolah} • Akreditasi ${state.profile.akreditasi}`;
  document.getElementById('activeRoleBadge').textContent = `Mode: ${state.role}`;

  // Fill profile form
  document.getElementById('inputNama').value = state.profile.nama;
  document.getElementById('inputSekolah').value = state.profile.sekolah;
  document.getElementById('inputProvinsi').value = state.profile.provinsi;
  document.getElementById('inputAkreditasi').value = state.profile.akreditasi;
  document.getElementById('inputJurusan').value = state.profile.jurusan;
  document.getElementById('inputAlumni').value = state.profile.alumni;

  // Recommendation summary
  const summaryBox = document.getElementById('dashboardSummaryBox');
  summaryBox.innerHTML = `
    <div class="rec-item">
      <h4>1. Evaluasi Akademik</h4>
      <p>Rata-rata rapor Anda <strong>${overallAvg.toFixed(2)}</strong> dengan tren <strong>${trendDelta >= 0 ? 'naik' : 'turun'} (${trendDelta.toFixed(2)})</strong>. Pertahankan nilai mapel kejuruan di atas 88.</p>
    </div>
    <div class="rec-item">
      <h4>2. Kekuatan Portofolio</h4>
      <p>Skor prestasi saat ini <strong>${prestasiScore}/100</strong>. ${prestasiScore < 60 ? 'Tambahkan sertifikat tingkat Provinsi/Nasional untuk memperkuat daya saing.' : 'Portofolio Anda sudah sangat kompetitif untuk PTN unggulan.'}</p>
    </div>
    <div class="rec-item">
      <h4>3. Strategi Pilihan PTN</h4>
      <p>Pilihan 1 (${prodi1 ? prodi1.prodi : '-'}) memiliki peluang <strong>${res1.chancePct}%</strong>. Pastikan Pilihan 2 berada di PTN dengan keketatan lebih aman.</p>
    </div>
  `;

  drawRaporChart();
}

// Render Tabel Rapor
function renderRaporTable() {
  const tbody = document.getElementById('raporTableBody');
  tbody.innerHTML = '';

  state.subjects.forEach((subj, idx) => {
    const avg = subj.scores.reduce((a, b) => a + Number(b), 0) / 5;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${escapeHtml(subj.name)}</strong></td>
      <td><span class="badge ${subj.category.includes('Kejuruan') || subj.category.includes('Pendukung') ? 'badge-info' : 'badge-success'}">${escapeHtml(subj.category)}</span></td>
      ${subj.scores
        .map(
          (val, semIdx) =>
            `<td><input type="number" class="score-input" min="0" max="100" placeholder="0-100" value="${val === '' || val === null || val === undefined ? '' : val}" data-subj="${idx}" data-sem="${semIdx}" /></td>`
        )
        .join('')}
      <td><strong>${avg.toFixed(2)}</strong></td>
      <td><button type="button" class="btn btn-danger-ghost" data-del-subj="${idx}">Hapus</button></td>
    `;
    tbody.appendChild(tr);
  });

  const { semAverages, overallAvg } = getRaporStats();
  semAverages.forEach((avg, i) => {
    document.getElementById(`avgSem${i + 1}`).textContent = avg.toFixed(2);
  });
  document.getElementById('avgAllSem').innerHTML = `<strong>${overallAvg.toFixed(2)}</strong>`;

  // Sync student's own score in eligible list
  const selfIdx = state.eligibleStudents.findIndex((s) => s.isSelf);
  if (selfIdx >= 0) {
    state.eligibleStudents[selfIdx].nilai = Number(overallAvg.toFixed(2));
  }

  tbody.querySelectorAll('.score-input').forEach((inp) => {
    inp.addEventListener('change', (e) => {
      const sIdx = Number(e.target.dataset.subj);
      const semIdx = Number(e.target.dataset.sem);
      if (e.target.value.trim() === '') {
        state.subjects[sIdx].scores[semIdx] = '';
      } else {
        let val = Number(e.target.value);
        val = Math.max(0, Math.min(100, isNaN(val) ? 0 : val));
        state.subjects[sIdx].scores[semIdx] = val;
      }
      saveState();
      renderAll();
    });
  });

  tbody.querySelectorAll('[data-del-subj]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      if (state.subjects.length <= 1) {
        showToast('Minimal harus ada 1 mata pelajaran.');
        return;
      }
      state.subjects.splice(Number(e.target.dataset.delSubj), 1);
      saveState();
      renderAll();
      showToast('Mata pelajaran dihapus.');
    });
  });
}

// Render Prestasi
function renderPrestasi() {
  const list = document.getElementById('prestasiList');
  const score = getPrestasiScore();
  document.getElementById('totalPrestasiBadge').textContent = `Skor: ${score} / 100 (Top 3 Terbaik)`;

  if (state.prestasi.length === 0) {
    list.innerHTML = '<p style="color:var(--text-muted);font-size:0.86rem;">Belum ada prestasi tercatat. Tambahkan sertifikat di formulir sebelah kiri.</p>';
    return;
  }

  list.innerHTML = state.prestasi
    .map(
      (p, idx) => `
      <div class="prestasi-item">
        <div>
          <div class="prestasi-title">${escapeHtml(p.nama)}</div>
          <div class="prestasi-meta">${escapeHtml(p.tingkat)} • ${escapeHtml(p.juara)} • Tahun ${p.tahun} • <strong>+${p.poin} Poin</strong></div>
        </div>
        <button type="button" class="btn btn-danger-ghost" data-del-prestasi="${idx}">Hapus</button>
      </div>
    `
    )
    .join('');

  list.querySelectorAll('[data-del-prestasi]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      state.prestasi.splice(Number(e.target.dataset.delPrestasi), 1);
      saveState();
      renderAll();
      showToast('Prestasi dihapus.');
    });
  });
}

// Render Simulasi PTN & Katalog
function renderSimulasi() {
  const s1 = document.getElementById('selectProdi1');
  const s2 = document.getElementById('selectProdi2');

  const optionsHtml = PTN_CATALOG.map(
    (p) => `<option value="${p.id}">${p.ptn} — ${p.prodi} (${p.jenjang}) [${p.provinsi}]</option>`
  ).join('');

  s1.innerHTML = `<option value="">-- Pilih PTN &amp; Program Studi --</option>${optionsHtml}`;
  s2.innerHTML = `<option value="">-- Tidak Memilih Pilihan 2 --</option>${optionsHtml}`;
  s1.value = state.choices.prodi1;
  s2.value = state.choices.prodi2;

  const p1 = PTN_CATALOG.find((p) => p.id === state.choices.prodi1);
  const p2 = PTN_CATALOG.find((p) => p.id === state.choices.prodi2);

  renderProdiBox('resultProdi1', p1);
  renderProdiBox('resultProdi2', p2);

  // Validasi aturan provinsi SNBP
  const alertEl = document.getElementById('provinceRuleAlert');
  if (p1 && p2) {
    const sameProv = p1.provinsi === state.profile.provinsi || p2.provinsi === state.profile.provinsi;
    alertEl.style.display = 'block';
    if (sameProv) {
      alertEl.className = 'alert-box ok';
      alertEl.textContent = `✅ Memenuhi Aturan Provinsi SNBP: Salah satu PTN pilihan berada di provinsi asal sekolah (${state.profile.provinsi}).`;
    } else {
      alertEl.className = 'alert-box error';
      alertEl.textContent = `⚠️ Peringatan Aturan SNBP: Anda memilih 2 prodi di luar provinsi asal (${state.profile.provinsi}). Wajib minimal 1 pilihan PTN berada di provinsi yang sama dengan sekolah asal.`;
    }
  } else {
    alertEl.style.display = 'none';
  }

  renderAltRecommendations();
  renderCatalogTable();
}

function renderAltRecommendations() {
  const box = document.getElementById('altRecommendations');
  if (!box) return;
  const scored = PTN_CATALOG
    .filter((p) => p.id !== state.choices.prodi1 && p.id !== state.choices.prodi2)
    .map((p) => ({
      prodi: p,
      res: calculateProdiChance(p),
      linear: p.rumpun === state.profile.jurusan ? 1 : 0,
      sameProv: p.provinsi === state.profile.provinsi ? 1 : 0
    }))
    .sort((a, b) => (b.linear - a.linear) || (b.sameProv - a.sameProv) || (b.res.chancePct - a.res.chancePct))
    .slice(0, 3);

  box.innerHTML = scored
    .map(
      ({ prodi, res }) => `
      <div class="rec-item">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:4px;">
          <span class="badge badge-info">${prodi.jenjang}</span>
          <span class="badge ${res.badge}">${res.chancePct}%</span>
        </div>
        <h4>${prodi.ptn}</h4>
        <p><strong>${prodi.prodi}</strong> • ${prodi.provinsi} • Daya Tampung ${prodi.dayaTampung}</p>
      </div>
    `
    )
    .join('');
}

function renderProdiBox(elId, prodi) {
  const el = document.getElementById(elId);
  if (!prodi) {
    el.innerHTML = '<p style="font-size:0.84rem;color:var(--text-muted);">Tidak ada program studi dipilih.</p>';
    return;
  }
  const res = calculateProdiChance(prodi);
  const ratio = ((prodi.dayaTampung / prodi.peminat) * 100).toFixed(2);
  const barColor = res.chancePct >= 75 ? '#059669' : res.chancePct >= 52 ? '#d97706' : '#dc2626';

  el.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
      <strong>${prodi.ptn} (${prodi.jenjang})</strong>
      <span class="badge ${res.badge}">${res.label}</span>
    </div>
    <div style="font-size:0.82rem;color:var(--text-muted);">
      Provinsi: <strong>${prodi.provinsi}</strong> • Daya Tampung: <strong>${prodi.dayaTampung}</strong> • Peminat: <strong>${prodi.peminat}</strong> (Keketatan ${ratio}%)
    </div>
    <div style="display:flex;justify-content:space-between;font-size:0.84rem;font-weight:700;">
      <span>Estimasi Peluang Lolos</span>
      <span>${res.chancePct}% (Skor SAW: ${res.score.toFixed(1)})</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width:${res.chancePct}%;background:${barColor};"></div>
    </div>
  `;
}

function renderCatalogTable() {
  const q = document.getElementById('searchProdiInput').value.toLowerCase();
  const jenjang = document.getElementById('filterJenjang').value;
  const tbody = document.getElementById('catalogTableBody');

  const filtered = PTN_CATALOG.filter((p) => {
    const matchText = p.ptn.toLowerCase().includes(q) || p.prodi.toLowerCase().includes(q) || p.provinsi.toLowerCase().includes(q);
    const matchJ = jenjang === 'ALL' || p.jenjang === jenjang;
    return matchText && matchJ;
  });

  tbody.innerHTML = filtered
    .map((p) => {
      const res = calculateProdiChance(p);
      const ratio = ((p.dayaTampung / p.peminat) * 100).toFixed(2);
      return `
        <tr>
          <td><strong>${p.ptn}</strong></td>
          <td>${p.prodi}</td>
          <td><span class="badge badge-info">${p.jenjang}</span></td>
          <td>${p.provinsi}</td>
          <td>${p.dayaTampung}</td>
          <td>${p.peminat}</td>
          <td>${ratio}%</td>
          <td><span class="badge ${res.badge}">${res.chancePct}%</span></td>
        </tr>
      `;
    })
    .join('');
}

// Render Pemeringkatan Eligible
function renderEligible() {
  const ratio = getQuotaRatio(state.profile.akreditasi);
  const kuota = Math.max(1, Math.floor(state.totalSiswaJurusan * ratio));

  document.getElementById('eligAkreditasi').textContent = `${state.profile.akreditasi} (${ratio * 100}%)`;
  document.getElementById('totalSiswaInput').value = state.totalSiswaJurusan;
  document.getElementById('eligKuotaCount').textContent = `${kuota} Siswa`;

  const sorted = [...state.eligibleStudents].sort((a, b) => b.nilai - a.nilai);
  const tbody = document.getElementById('eligibleTableBody');
  tbody.innerHTML = sorted
    .map((s, idx) => {
      const rank = idx + 1;
      const isElig = rank <= kuota;
      return `
        <tr>
          <td><strong>#${rank}</strong></td>
          <td><code>${s.nisn}</code></td>
          <td>${s.nama}</td>
          <td><strong>${Number(s.nilai).toFixed(2)}</strong></td>
          <td><span class="badge ${isElig ? 'badge-success' : 'badge-danger'}">${isElig ? 'Eligible PDSS' : 'Di Luar Kuota'}</span></td>
          <td><button type="button" class="btn btn-danger-ghost" data-del-rank="${s.id}">Hapus</button></td>
        </tr>
      `;
    })
    .join('');

  tbody.querySelectorAll('[data-del-rank]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.delRank;
      state.eligibleStudents = state.eligibleStudents.filter((s) => s.id !== id);
      saveState();
      renderAll();
      showToast('Data siswa dihapus dari pemeringkatan.');
    });
  });
}

function renderAll() {
  renderRaporTable();
  renderPrestasi();
  renderSimulasi();
  renderEligible();
  renderDashboard();
}

// Event Listeners
function initEvents() {
  // Profile Form
  document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    state.profile.nama = document.getElementById('inputNama').value.trim();
    state.profile.sekolah = document.getElementById('inputSekolah').value.trim();
    state.profile.provinsi = document.getElementById('inputProvinsi').value;
    state.profile.akreditasi = document.getElementById('inputAkreditasi').value;
    state.profile.jurusan = document.getElementById('inputJurusan').value;
    state.profile.alumni = Number(document.getElementById('inputAlumni').value) || 70;
    const selfEntry = state.eligibleStudents.find((s) => s.isSelf);
    if (selfEntry) {
      selfEntry.nama = state.profile.nama;
    }
    saveState();
    renderAll();
    showToast('Profil siswa berhasil diperbarui!');
  });

  // Clear & Fill Demo Rapor
  document.getElementById('clearRaporBtn').addEventListener('click', () => {
    state.subjects.forEach((s) => {
      s.scores = ['', '', '', '', ''];
    });
    saveState();
    renderAll();
    showToast('Semua nilai rapor dikosongkan. Silakan isi nilai Anda.');
  });

  document.getElementById('fillDemoRaporBtn').addEventListener('click', () => {
    state.subjects = structuredClone(DEFAULT_STATE.subjects);
    state.prestasi = structuredClone(DEFAULT_STATE.prestasi);
    state.choices = structuredClone(DEFAULT_STATE.choices);
    saveState();
    renderAll();
    showToast('Contoh nilai demo berhasil diisikan.');
  });

  // Add Subject
  document.getElementById('addSubjectBtn').addEventListener('click', () => {
    const name = prompt('Nama Mata Pelajaran Baru:');
    if (!name || !name.trim()) return;
    state.subjects.push({
      id: 's' + Date.now(),
      name: name.trim(),
      category: 'Kejuruan / Peminatan',
      scores: [85, 85, 86, 87, 88]
    });
    saveState();
    renderAll();
    showToast(`Mapel "${name.trim()}" ditambahkan.`);
  });

  document.getElementById('saveRaporBtn').addEventListener('click', () => {
    saveState();
    renderAll();
    showToast('Nilai rapor semester 1–5 tersimpan.');
  });

  // Prestasi Form
  document.getElementById('prestasiForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('prestasiNama').value.trim();
    const tingkat = document.getElementById('prestasiTingkat').value;
    const juara = document.getElementById('prestasiJuara').value;
    const tahun = Number(document.getElementById('prestasiTahun').value);

    const base = tingkat === 'Internasional' ? 40 : tingkat === 'Nasional' ? 30 : tingkat === 'Provinsi' ? 20 : 12;
    const bonus = juara === 'Juara 1' ? 10 : juara === 'Juara 2' ? 7 : juara === 'Juara 3' ? 5 : 2;

    state.prestasi.push({
      id: 'p' + Date.now(),
      nama,
      tingkat,
      juara,
      tahun,
      poin: base + bonus
    });
    e.target.reset();
    document.getElementById('prestasiTahun').value = 2025;
    saveState();
    renderAll();
    showToast('Prestasi berhasil ditambahkan ke portofolio!');
  });

  // Simulasi selects & filters
  document.getElementById('selectProdi1').addEventListener('change', (e) => {
    state.choices.prodi1 = e.target.value;
    saveState();
    renderAll();
  });

  document.getElementById('selectProdi2').addEventListener('change', (e) => {
    state.choices.prodi2 = e.target.value;
    saveState();
    renderAll();
  });

  document.getElementById('searchProdiInput').addEventListener('input', renderCatalogTable);
  document.getElementById('filterJenjang').addEventListener('change', renderCatalogTable);

  // Eligible controls
  document.getElementById('totalSiswaInput').addEventListener('change', (e) => {
    state.totalSiswaJurusan = Math.max(5, Number(e.target.value) || 30);
    saveState();
    renderAll();
  });

  document.getElementById('addStudentRankForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = document.getElementById('rankNamaInput').value.trim();
    const nisn = document.getElementById('rankNisnInput').value.trim();
    const nilai = Number(document.getElementById('rankNilaiInput').value);

    state.eligibleStudents.push({ id: 'e' + Date.now(), nisn, nama, nilai });
    e.target.reset();
    saveState();
    renderAll();
    showToast('Siswa ditambahkan ke daftar pemeringkatan.');
  });

  // Export CSV
  document.getElementById('exportCsvBtn').addEventListener('click', () => {
    const ratio = getQuotaRatio(state.profile.akreditasi);
    const kuota = Math.max(1, Math.floor(state.totalSiswaJurusan * ratio));
    const sorted = [...state.eligibleStudents].sort((a, b) => b.nilai - a.nilai);
    const rows = [['Peringkat', 'NISN', 'Nama Siswa', 'Rata-rata Rapor', 'Status PDSS']];
    sorted.forEach((s, idx) => {
      rows.push([idx + 1, s.nisn, `"${s.nama}"`, s.nilai.toFixed(2), idx + 1 <= kuota ? 'Eligible' : 'Tidak Eligible']);
    });
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pemeringkatan-snbp-pdss.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('File CSV pemeringkatan berhasil diunduh.');
  });

  // Print
  document.getElementById('printReportBtn').addEventListener('click', () => {
    window.print();
  });

  // Reset Demo Data
  document.getElementById('resetDataBtn').addEventListener('click', () => {
    state = structuredClone(DEFAULT_STATE);
    saveState();
    renderAll();
    showToast('Data demo dikembalikan ke pengaturan awal.');
  });

  // Demo Login Modal
  const modal = document.getElementById('demoLoginModal');
  const closeModal = () => modal.classList.remove('open');

  document.getElementById('openDemoLoginBtn').addEventListener('click', () => modal.classList.add('open'));
  const guideLoginBtn = document.getElementById('guideOpenLoginBtn');
  if (guideLoginBtn) {
    guideLoginBtn.addEventListener('click', () => modal.classList.add('open'));
  }
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('guestModeBtn').addEventListener('click', () => {
    state.role = 'Siswa (Tanpa Login)';
    saveState();
    renderAll();
    closeModal();
    showToast('Mode Tanpa Login aktif.');
  });

  document.querySelectorAll('.fill-demo-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.getElementById('loginUsername').value = btn.dataset.user;
      document.getElementById('loginPassword').value = btn.dataset.pass;
    });
  });

  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('loginUsername').value.trim();
    const p = document.getElementById('loginPassword').value.trim();
    const errEl = document.getElementById('loginError');

    if (u === 'siswa@snbp.demo' && p === 'siswa123') {
      state.role = 'Siswa Terautentikasi';
      errEl.style.display = 'none';
      saveState();
      renderAll();
      closeModal();
      showToast('Berhasil masuk sebagai Akun Siswa Demo.');
    } else if (u === 'gurubk@snbp.demo' && p === 'admin123') {
      state.role = 'Guru BK / Admin PDSS';
      errEl.style.display = 'none';
      saveState();
      renderAll();
      closeModal();
      showToast('Berhasil masuk sebagai Akun Guru BK Demo.');
    } else {
      errEl.style.display = 'block';
      errEl.textContent = 'Username atau password tidak cocok dengan akun demo.';
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initEvents();
  renderAll();
});

