# 📱 PRESENSIKU PRO — SISTEM PRESENSI CERDAS SEKOLAH & PERUSAHAAN (AI FACE SCANNER)
### *"Smart Multi-Entity Attendance System: School & Enterprise Edition with Real-time AI Biometric Face Recognition"*

Aplikasi Web Sistem Presensi Digital Terpadu yang dirancang dan disempurnakan secara khusus sesuai seluruh kriteria dan peraturan mutlak **Ujian Akhir Kejuruan / Tugas Mandiri Personal Teknik Komputer & Jaringan (TKJ)**.

---

## 🔒 FITUR KEAMANAN: PEMISAHAN ABSEN GURU & MURID (KATA SANDI: 3322)

Sesuai instruksi khusus, sistem menghadirkan arsitektur keamanan bertingkat (*Role-Based Access Control*):

1. **Pilihan di Awal Saat Memasuki Aplikasi (Portal Selection Screen)**:
   - Saat aplikasi pertama kali dibuka, muncul layar selamat datang interaktif untuk memilih portal:
     - **🎓 Murid / Siswa**: Masuk ke portal murid langsung (*Tanpa sandi — langsung pakai*).
     - **👨‍🏫 Guru / Tenaga Pendidik**: Wajib memasukkan kata sandi khusus Guru: **`3322`** sebelum dapat membuka Ruang Guru.
2. **Pemisahan Ruang & Absensi Siswa vs Guru**:
   - **Ruang Absensi Murid**: Menampilkan formulir presensi siswa (NIS/NISN, Kelas X/XI/XII TKJ, AI Face Scanner siswa, kalkulasi keterlambatan siswa).
   - **Ruang Absensi Guru**: Menampilkan formulir presensi guru pengajar (NIP, Mata Pelajaran, Tugas Binaan, AI Face Scanner guru, jam mengajar).
3. **Aturan Hak Akses Mutlak (*Room Security Policy*)**:
   - **Room Guru TIDAK DAPAT dimasuki oleh siswa**: Jika siswa mencoba mengklik Ruang Guru atau tab Verifikasi/Approval, sistem otomatis memblokir dan meminta kata sandi Guru (**`3322`**).
   - **Guru DAPAT masuk ke Room Siswa**: Guru yang telah memasukkan sandi `3322` memiliki hak istimewa untuk berpindah antara Ruang Guru dan Ruang Siswa kapan saja guna memantau, memeriksa kehadiran, atau mendampingi siswa.
   - **Guru Menggunakan Sandi Sebelum Absen**: Sebelum mengirim presensi guru, sistem memverifikasi validitas kata sandi **`3322`**.

---

## 📌 DATA PENYERAHAN & ATURAN MUTLAK SISWA

| Parameter Ujian | Nilai / Ketentuan Resmi | Keterangan & Lokasi di Aplikasi |
| :--- | :--- | :--- |
| **Nama Aplikasi** | **`PRESENSIKU PRO`** | Terpasang resmi pada Navbar, Header, Kop Surat Berita Acara, ID Pass, dan Lembar Pengesahan. |
| **Kunci PIN 4 Digit Siswa** | **`3322`** *(Tersedia tombol acak PIN)* | Tertera di Header Bar atas & Footer, wajib dicatat saat submit web dan dipakai untuk revisi link karya. |
| **Kata Sandi Masuk Guru** | **`3322`** | Digunakan guru untuk memasuki Ruang Guru, verifikasi approval, dan saat absen guru. |
| **Bentuk Rilis** | **Live Webview HTTPS Publik (GitHub Pages / VPS)** | Siap tayang online dengan protokol `https://` publik via GitHub Pages atau [presensiku-deploy.zip](file:///c:/Users/Asus/OneDrive/Dokumen/aplikasi/presensiku-deploy.zip). |
| **Akun Demo Uji Coba** | **Tercantum Jelas di Form Login & 1-Klik Autofill** | Tersedia di form login dan dropdown: Admin, Guru Piket, HRD PT, Siswa, Karyawan, dan tombol **"Tanpa login - langsung pakai"**. |
| **Larangan Link Lokal** | **Bebas Localhost / 127.0.0.1 / 192.168.x.x** | Sistem otomatis menolak link lokal; aplikasi dirancang langsung online dengan aset CDN & HTTPS. |
| **Batas Waktu Pengumpulan** | **Jumat, 18 Desember 2026** | Memenuhi rubrik nilai 100: Kesiapan Pakai (40%), UI/UX (30%), Teknis Kejuruan (30%). |

---

## 🔐 KREDENSIAL AKUN DEMO PENGUJI (TERTERA PADA FORM LOGIN)

Sesuai aturan mutlak, halaman login menyediakan tombol **"Tanpa login - langsung pakai"** dan tombol 1-klik autofill kredensial demo:

| Peran (Role) | Username / ID | Password / Sandi | Hak Akses & Kemampuan Uji Coba |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` | Akses penuh seluruh tab: Presensi, Approval, Rekap, Analitik, ID Card, dan Master Data. |
| **Guru Piket / Wali Kelas** | `guru_budi` | **`3322`** *(atau `guru123`)* | Khusus Sekolah: Membuka Ruang Guru, memvalidasi rekap siswa, menyetujui izin/sakit, dan masuk ruang siswa. |
| **HRD / Personalia PT** | `hrd_siti` | `hrd123` | Khusus Perusahaan: Memeriksa absensi divisi, memverifikasi keterlambatan, dan ekspor laporan kerja. |
| **Siswa (TKJ)** | `20240101` | `siswa123` | Presensi mandiri murid, scan wajah AI, dan kartu ID digital siswa (terkunci dari ruang guru). |
| **Karyawan PT** | `EMP-9021` | `karyawan123` | Check-in masuk/pulang kantor, tanda tangan digital, dan geolokasi kerja. |
| **Mode Mandiri** | **`Tanpa login - langsung pakai`** | *(Tanpa Password)* | Mode Guest Kiosk mandiri untuk langsung mencoba absensi tanpa repot login. |

---

## 🌐 PANDUAN RILIS: LIVE WEBVIEW (PROTOKOL HTTPS PUBLIK)

Aplikasi memenuhi syarat rilis **Live Webview** aktif dengan protokol `https://` publik. Berikut 2 metode resmi yang dapat digunakan:

### Metode 1: GitHub Pages (Gratis & Langsung Aktif HTTPS)
1. Buka akun GitHub Anda di browser: [https://github.com/new](https://github.com/new).
2. Buat repositori publik baru (misal: `presensiku-tkj`).
3. Unggah file **`index.html`** ke branch `main`.
4. Buka tab **Settings** repositori > pilih menu **Pages** di sidebar kiri.
5. Pada bagian **Build and deployment > Branch**, pilih **`main`** dan folder **`/ (root)`**, lalu klik **Save**.
6. Dalam 1 menit, GitHub Pages akan menerbitkan URL publik HTTPS aktif:
   ```
   https://<username-anda>.github.io/presensiku-tkj/
   ```
7. Masukkan link publik tersebut ke form pengumpulan ujian bersama PIN **`3322`**.

### Metode 2: VPS (Virtual Private Server)
1. Salin file `index.html` ke direktori web server VPS Anda (contoh Nginx / Apache: `/var/www/html/`).
2. Pasang sertifikat SSL publik Let's Encrypt menggunakan Certbot:
   ```bash
   sudo certbot --nginx -d absensi.domain-anda.com
   ```
3. Akses sistem melalui URL berprotokol HTTPS: `https://absensi.domain-anda.com/`.

### Metode 3: Netlify Drop (Instan 10 Detik)
1. Buka [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag & drop file [presensiku-deploy.zip](file:///c:/Users/Asus/OneDrive/Dokumen/aplikasi/presensiku-deploy.zip).
3. URL aktif HTTPS instan langsung diterbitkan (contoh: `https://presensiku-pro.netlify.app`).

---

## 📊 SISTEM PENILAIAN & RUBRIK (BOBOT 0 - 100)

| Kriteria Penilaian | Bobot | Aspek yang Diuji & Dibuktikan di Aplikasi |
| :--- | :---: | :--- |
| **1. Kesiapan Pakai & Fungsionalitas** | **40%** | Aplikasi 100% siap pakai tanpa error, kalkulasi jam masuk/pulang presisi, hitung durasi otomatis, deteksi terlambat otomatis, proteksi sandi guru `3322`, pemisahan ruang siswa vs guru, dan fitur ekspor CSV / Cetak PDF A4 berfungsi penuh. |
| **2. UI/UX & Kerapian Visual** | **30%** | Desain bertema *Dark Premium Glassmorphism*, modal portal pembuka di awal, responsif di HP/Tablet/Desktop, transisi mulus, font rapi (Plus Jakarta Sans), indikator status warna standar, dan kop surat berita acara resmi. |
| **3. Kompleksitas Teknis Kejuruan TKJ** | **30%** | Integrasi AI Face Biometric Scanner via HTML5 MediaDevices kamera langsung, proteksi RBAC (*Role-Based Access Control*) dengan sandi guru, canvas tanda tangan digital sentuh/mouse, geolokasi satelit GPS dengan radius geofencing 150m, generator barcode/QR digital ID card, dan visualisasi grafik Chart.js. |

---

## 🎯 PEMENUHAN 4 REGULASI POKOK ABSENSI

1. **Identitas Dasar**: Nama lengkap, Nomor Induk (NIS/NISN untuk siswa atau NIP untuk guru), dan Rombel Kelas / Mata Pelajaran Binaan.
2. **Waktu & Tanggal**: Jam digital real-time, tanggal otomatis, Check-In & Check-Out, hitung durasi kerja/belajar, dan toleransi keterlambatan (06:35 siswa / 06:30 guru).
3. **Status Kehadiran**: Hadir (H), Terlambat (T), Sakit (S - dengan catatan surat dokter), Izin (I), Alfa (A), dan Dinas Luar (DL).
4. **Validasi & Bukti Autentik**: AI Face Recognition snapshot kamera real-time, sandi proteksi guru `3322`, canvas paraf digital, geolokasi GPS, dan pengesahan resmi Wali Kelas / Guru Piket.

---

## 📁 STRUKTUR DIREKTORI PROJEK

```
aplikasi/
├── presensiku/
│   ├── index.html            # Aplikasi web all-in-one (Portal Awal, Sandi Guru 3322, AI Face, GPS, Signature, Charts, PDF)
│   └── README.md             # Dokumentasi teknis, kredensial demo, PIN 3322 & rubrik nilai 100
├── presensiku-deploy.zip     # Paket ZIP siap drag & drop ke Netlify / Vercel / GitHub
├── index.html                # Salinan root index siap rilis langsung ke GitHub Pages
└── README.md
```
