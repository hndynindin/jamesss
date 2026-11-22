# 🎓 VeloCheck – PRESENSI SEKOLAH (SMK KARTIKA X-1)

Aplikasi Web Full-Stack Manajemen Kehadiran Siswa Real-time berbasis **React.js, Node.js Express, Tailwind CSS, dan MySQL**, dirancang khusus sebagai produk siap pakai untuk **SMK KARTIKA X-1** (Tugas Akhir Kejuruan Teknik Komputer & Jaringan - TKJ).

---

## ⏰ Jadwal & Aturan Jam Masuk Sekolah

Sistem presensi SMK KARTIKA X-1 menerapkan 2 sesi kehadiran dengan validasi keterlambatan otomatis pada status **HADIR**:

* 🌅 **Sesi Pagi**:
  * **Jadwal Masuk**: `06:30 WIB`
  * **Batas Toleransi Terlambat**: `06:35 WIB`
  * **Jam Pulang**: `11:50 WIB`
  * *Perhitungan Terlambat*: Jika hadir setelah pukul 06:35 WIB, sistem otomatis menandai status keterlambatan dan menghitung selisih menit terlambat.
* ☀️ **Sesi Siang**:
  * **Jadwal Masuk**: `12:30 WIB`
  * **Jam Pulang**: `17:50 WIB`
  * *Perhitungan Terlambat*: Khusus untuk kehadiran setelah pukul 12:35 WIB.

---

## 📌 1. Gambaran Proyek

**VeloCheck** adalah solusi presensi digital sekolah modern yang menggantikan sistem presensi kertas konvensional. Aplikasi ini mengintegrasikan otentikasi multi-peran (*Multi-Role Access Control*), pencatatan kehadiran presisi dengan deteksi keterlambatan, pemindai kartu identitas siswa digital (**QR Code Badge**), dashboard analitik interaktif (**Chart.js**), dan generator cetak laporan resmi berformat **PDF**.

---

## 🚀 2. Teknologi yang Digunakan

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Frontend** | React.js 18 + Vite | Single Page Application (SPA) cepat dan reaktif |
| **Styling** | Tailwind CSS v3 | Desain bertema *Dark Premium Dashboard* |
| **Backend** | Node.js + Express.js | Arsitektur RESTful API modular dan aman |
| **Database** | MySQL 8.x (`mysql2`) | Relasional lengkap dengan Foreign Key & Unique Index |
| **Fallback DB** | Smart Store Adapter | Otomatis aktif saat MySQL offline agar aplikasi selalu dapat diuji |
| **Visualisasi** | Chart.js 4 + react-chartjs-2 | Grafik tren batang mingguan & donat distribusi harian |
| **Dokumen PDF** | jsPDF + jspdf-autotable | Cetak surat rekapitulasi presensi berkop resmi sekolah |
| **Keamanan** | JWT + BcryptJS | Token autentikasi terenkripsi & password hashing |
| **Ikonografi** | Lucide React | Ikon modern dan konsisten |

---

## 🎨 3. Skema Warna (Dark Premium Theme)

Sesuai spesifikasi kebutuhan UI/UX:
- **Background Utama**: Dark Navy (`#0B1120`)
- **Sidebar & Card Container**: Navy (`#111827` & `#1E293B`)
- **Primary / Action**: Electric Blue (`#3B82F6`)
- **Success (Hadir)**: Green (`#22C55E`)
- **Warning (Izin / Terlambat)**: Amber / Yellow (`#EAB308`)
- **Danger (Alpa)**: Red (`#EF4444`)

---

## 🔐 4. Akun Demo untuk Pengujian Langsung

Aplikasi menyediakan tombol **1-Klik Demo Login** di halaman masuk, atau Anda dapat mengetikkan kredensial berikut:

| Peran (Role) | Username / Email | Password | Hak Akses & Kemampuan |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` *(atau `admin@hadirku.sch.id`)* | `password123` | Akses penuh: Dashboard analitik, CRUD Siswa, CRUD Guru, CRUD Kelas, Laporan & Rekap PDF, Scanner QR, Pengaturan. |
| **Guru** | `budi@hadirku.sch.id` *(atau `guru_budi`)* | `password123` | Dashboard Guru, input & edit absensi kelas binaan, statistik kehadiran kelas, unduh rekap PDF kelas, scan QR. |
| **Siswa** | `20240101` *(atau `ahmad@hadirku.sch.id`)* | `password123` | Dashboard Siswa pribadi, status kehadiran hari ini, riwayat presensi pribadi, kartu identitas QR Digital (*Digital Student ID*). |

---

## 📂 5. Struktur Direktori Proyek

```
hadirku/
├── backend/
│   ├── database/
│   │   ├── database.sql       # Script DDL tabel MySQL + Seed Data lengkap
│   │   └── local_data.json    # Store data lokal (auto-sync)
│   ├── src/
│   │   ├── config/db.js       # Driver MySQL pool & Smart Fallback engine
│   │   ├── controllers/       # Controller autentikasi, absensi, CRUD, rekap
│   │   ├── middleware/auth.js # Middleware JWT verifier & Role Guard
│   │   ├── routes/            # Route endpoint REST API
│   │   ├── services/dbService # Abstraksi query database relasional
│   │   ├── utils/seedRunner.js# Script migrasi otomatis ke MySQL
│   │   └── server.js          # Entry point server Express + static SPA server
│   ├── .env                   # Variabel lingkungan database & JWT
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Sidebar, Navbar, StatCard, QRScannerModal, QRBadge
│   │   ├── context/AuthContext# State management login & JWT token
│   │   ├── pages/             # 8 Halaman lengkap (Login, 3 Dashboard, CRUD, Absensi, Laporan)
│   │   ├── services/api.js    # Axios client dengan interceptor token
│   │   ├── utils/pdfGenerator # Generator PDF berkop resmi sekolah
│   │   ├── App.jsx            # Routing & layout utama
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
├── package.json
└── README.md
```

---

## 🗄️ 6. Rancangan Database MySQL (`database.sql`)

Tabel-tabel yang telah dibuat dan terelasi:
1. **`users`**: Akun pengguna, username unik, email unik, role (`admin`, `guru`, `siswa`), password hash bcrypt.
2. **`majors`**: Jurusan kejuruan (`TKJ`, `RPL`, `DKV`).
3. **`academic_years`**: Tahun ajaran & semester aktif.
4. **`teachers`**: Data guru (NIP unik, nama, gelar, mapel, email, nomor HP, relasi ke user).
5. **`classes`**: Rombel kelas (nama kelas, tingkat 10-12, jurusan, wali kelas).
6. **`teacher_classes`**: Pemetaan kelas-kelas yang diajar oleh guru.
7. **`students`**: Data induk siswa (NIS unik, NISN, nama lengkap, gender, kelas, jurusan, tahun masuk, token QR unik).
8. **`attendance`**: Pencatatan presensi siswa:
   - Tanggal (`date`)
   - Jam masuk (`time_in`)
   - Status (`HADIR`, `IZIN`, `SAKIT`, `ALPA`)
   - Indikator terlambat (`is_late`) dan menit keterlambatan (`late_minutes`)
   - Keterangan / Alasan sakit & izin
   - **Unique Constraint**: `UNIQUE KEY (student_id, date)` mencegah pencatatan ganda pada hari yang sama.

---

## ⚡ 7. Cara Menjalankan Aplikasi

### Opsi A: Jalankan Langsung (Sangat Cepat & Praktis)

Backend telah dilengkapi static web server bawaan dan smart database engine.
Cukup buka terminal PowerShell di folder `hadirku`:

```powershell
# 1. Masuk ke direktori backend
cd hadirku\backend

# 2. Jalankan server
node src/server.js
```

Buka browser Anda di:
👉 **`http://localhost:5000`**

Aplikasi langsung tampil lengkap dengan antarmuka frontend, backend REST API, dan data demo siap pakai!

---

### Opsi B: Menjalankan Bersama XAMPP / MySQL Server

1. Buka aplikasi **XAMPP Control Panel** dan klik **Start** pada modul **MySQL**.
2. Buka terminal di `hadirku\backend` lalu jalankan script seed database:
   ```powershell
   npm run seed
   ```
   *Script ini akan otomatis membuat database `hadirku_db` dan mengimpor seluruh tabel serta data contoh.*
3. Jalankan backend:
   ```powershell
   npm start
   ```
4. Jika ingin menjalankan frontend dalam mode pengembang Vite:
   ```powershell
   cd ..\frontend
   npm run dev
   ```
   Buka `http://localhost:3000`.

---

## ✨ 8. Fitur-Fitur Unggulan

1. **Sistem Presensi Kelas Interaktif**:
   - Filter rombel kelas & tanggal presensi.
   - Tombol cepat *"Tandai Semua Hadir"* untuk efisiensi guru piket.
   - Status warna: Hijau (Hadir), Kuning (Izin), Biru (Sakit), Merah (Alpa).
   - Pengaturan jam keterlambatan otomatis.
2. **Kartu Pelajar Digital & QR Code Badge**:
   - Setiap siswa memiliki kartu identitas digital dengan barcode QR unik.
   - Dapat dicetak langsung (*Print*) atau diunduh sebagai gambar PNG.
3. **Pemindai Cepat (Quick QR Scanner)**:
   - Kompatibel dengan alat barcode scanner laser USB, kamera HP, maupun input token langsung.
   - Deteksi keterlambatan otomatis jika siswa absen lewat dari pukul 07:00 WIB.
4. **Laporan & Ekspor PDF / CSV**:
   - Cetak laporan formal berstandar administrasi sekolah SMK.
   - Dilengkapi kop dinas sekolah, ringkasan angka, tabel persentase, dan kolom tanda tangan Kepala Sekolah serta Wali Kelas.
5. **Dashboard Berdasarkan Peran**:
   - **Admin**: Statistik global sekolah, grafik tren, log presensi terkini.
   - **Guru**: Manajemen kelas binaan, statistik kehadiran kelas, cetak laporan kelas 1-klik.
   - **Siswa**: Kehadiran pribadi, rasio persentase kehadiran, unduh kartu QR.

---

## 🏆 Kesiapan Tugas Akhir Kejuruan TKJ

Aplikasi ini memenuhi seluruh standar penilaian Ujian Kompetensi Keahlian (UKK) / Tugas Akhir TKJ:
- Arsitektur Client-Server berbasis REST API standar industri.
- Desain antarmuka Dark Premium responsif untuk Smartphone, Tablet, dan Komputer.
- Validasi data ketat pada sisi klien dan server.
- Integritas data terjamin dengan pencegahan absensi ganda pada tanggal yang sama.
