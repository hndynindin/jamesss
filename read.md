# 🌟 Jamesss Web Suite & Interactive Applications

Selamat datang di repositori **Jamesss**! Repositori ini mengintegrasikan kumpulan aplikasi web interaktif modern, instrumen tes psikologi/kepribadian, manajemen kesehatan mental & journaling (*wellness*), serta kalkulator simulasi akademis tingkat lanjut. Seluruh modul didesain dengan pendekatan responsif, performa tinggi, dan *ready-to-deploy* (Vercel, Netlify, Cloudflare Pages, atau GitHub Pages).

---

## 📑 Daftar Isi
- [Ikhtisar Proyek](#-ikhtisar-proyek)
- [Detail Fitur Aplikasi](#-detail-fitur-aplikasi)
  - [1. 🧠 So Syncd — Tes Kepribadian MBTI](#1--so-syncd--tes-kepribadian-mbti-indexhtml)
  - [2. 🌱 MoodSpace — Mental Health & Daily Journal](#2--moodspace-moodspace)
  - [3. 🎓 SNBP Predictor & Calculator](#3--snbp-predictor--calculator-snbp)
- [Struktur Direktori Repositori](#-struktur-direktori-repositori)
- [Instalasi & Panduan Menjalankan Lokal](#-instalasi--panduan-menjalankan-lokal)
- [Konfigurasi Deployment](#-konfigurasi-deployment)
- [Lisensi & Kontribusi](#-lisensi--kontribusi)

---

## 🚀 Ikhtisar Proyek

Repositori ini memadukan tiga pilar utama aplikasi web:
1. **Self-Discovery & Psychology**: Mengukur dan mengeksplorasi spektrum karakter diri melalui tes kepribadian komprehensif.
2. **Mental Wellness & Habit Tracking**: Memelihara kesejahteraan emosional harian melalui tracking suasana hati, gamifikasi kebiasaan baik, dan audio relaksasi.
3. **Academic Analytics & Planning**: Simulasi rasionalisasi nilai siswa dalam seleksi penerimaan perguruan tinggi nasional (SNBP).

---

## 🔍 Detail Fitur Aplikasi

### 1. 🧠 So Syncd — Tes Kepribadian MBTI (`index.html`)
Aplikasi kuis kepribadian adaptif 16 tipe Myers-Briggs Type Indicator (MBTI) yang dilengkapi dengan antarmuka elegan, animasi transisi halus, dan kalkulasi spektrum kepribadian real-time.

* **Spektrum Dimensi Evaluasi:**
  * **Extraversion (E) vs Introversion (I)**: Mengukur sumber fokus energi (sosial/eksternal vs reflektif/internal).
  * **Sensing (S) vs Intuition (N)**: Mengukur cara memproses informasi (faktual konkret vs konseptual/pola abstrak).
  * **Thinking (T) vs Feeling (F)**: Mengukur dasar pengambilan keputusan (logika analitis vs empati & nilai kemanusiaan).
  * **Judging (J) vs Perceiving (P)**: Mengukur orientasi gaya hidup (terstruktur & terencana vs fleksibel & spontan).
* **Fitur Unggulan:**
  * Kuis bertahap (*multi-step wizard*) dengan bar indikator progres interaktif.
  * Halaman hasil (*Result Breakdown*) mendalam mencakup kepribadian umum, daftar kelebihan & tantangan, panduan jalur karir terbaik, dan kecocokan relasi (*relationship compatibility*).
  * Desain responsif di semua perangkat (Desktop, Tablet, Mobile) tanpa dependensi backend eksternal.

---

### 2. 🌱 MoodSpace — Mental Health & Daily Journal (`moodspace/`)
Aplikasi web progresif berbasis React + Vite yang didesain secara khusus untuk mendampingi kesehatan mental harian pengguna melalui pendekatan holistik dan gamifikasi.

* **Stack Teknologi:** React, Vite, Lucide Icons, Supabase (Autentikasi & Database), Tailwind / Modular CSS.
* **Fitur Utama:**
  * **Mood Tracker**: Pencatatan emosi harian dengan ragam palet suasana hati, pemicu stres, dan catatan situasional.
  * **Daily Habit & Self-Care**: Checklist kebiasaan positif (tidur cukup, hidrasi, meditasi, olahraga) yang terhubung dengan sistem gamifikasi avatar/level.
  * **Emotional First Aid**: Panduan intervensi darurat saat mengalami kecemasan atau stres berlebih (teknik pernapasan 4-7-8, *grounding technique* 5-4-3-2-1).
  * **Sound Engine**: Pustaka audio ambient penenang (suara hujan, hutan, deburan ombak, white noise) untuk fokus dan relaksasi.
  * **Analytics Dashboard**: Grafik tren perubahan emosi mingguan/bulanan untuk memantau pola stabilitas mental.

---

### 3. 🎓 SNBP Predictor & Calculator (`snbp/`)
Instrumen perhitungan statistik nilai rapor SMA/sederajat semester 1 hingga semester 5 untuk memetakan peluang kelolosan Seleksi Nasional Berdasarkan Prestasi (SNBP).

* **Stack Teknologi:** Pure HTML5, Modern CSS3 (`styles.css`), Vanilla JavaScript (`app.js`).
* **Fitur Utama:**
  * Input nilai terstruktur untuk mata pelajaran wajib dan mata pelajaran peminatan.
  * Kalkulasi rata-rata per semester dan analisis grafik tren peningkatan nilai (konsistensi rapor).
  * Simulasi pembobotan linieritas mata pelajaran pendukung terhadap program studi PTN impian.
  * Ringkasan rekomendasi strategi pemilihan jurusan guna memaksimalkan peluang lolos.

---

## 📂 Struktur Direktori Repositori

```text
jamesss/
├── index.html                   # Aplikasi Web Utama: So Syncd MBTI Personality Test
├── vercel.json                  # Konfigurasi perutean & optimasi Vercel root
├── read.md                      # Dokumentasi komprehensif repositori
├── README.md                    # Dokumentasi utama GitHub
│
├── moodspace/                   # Web App: MoodSpace Wellness Platform
│   ├── index.html               # Entry HTML Vite
│   ├── package.json             # Dependensi & script Node.js
│   ├── vite.config.js           # Konfigurasi bundling Vite
│   ├── netlify.toml             # Konfigurasi build & hosting Netlify
│   ├── vercel.json              # Konfigurasi routing Vercel untuk SPA
│   ├── supabase/                # Skema migrasi basis data Supabase
│   └── src/
│       ├── main.jsx             # Entry point React
│       ├── App.jsx              # Komponen utama & router
│       ├── components/          # Komponen modular (Habit, Sound, FirstAid, dll.)
│       ├── pages/               # Halaman utama (Dashboard, MoodTracker, Analytics, dll.)
│       └── utils/               # Sound engine & helper utilities
│
└── snbp/                        # Web App: Kalkulator & Prediktor SNBP
    ├── index.html               # Halaman antarmuka kalkulator
    ├── app.js                   # Logika kalkulasi & analisis nilai
    ├── styles.css               # Styling UI antarmuka SNBP
    └── vercel.json              # Konfigurasi deployment SNBP
```

---

## 🛠️ Instalasi & Panduan Menjalankan Lokal

### 1. Menjalankan So Syncd (MBTI) & SNBP
Kedua aplikasi ini dibangun dengan arsitektur *clean web tech* (tanpa build step wajib):
```bash
# Opsi 1: Buka langsung file di browser
start index.html
start snbp/index.html

# Opsi 2: Gunakan static server lokal (misalnya npx serve atau live-server)
npx serve .
```

### 2. Menjalankan MoodSpace (React + Vite)
```bash
# 1. Masuk ke direktori moodspace
cd moodspace

# 2. Pasang dependensi
npm install

# 3. Jalankan server pengembangan lokal
npm run dev
```
Buka URL lokal yang tertera di terminal (biasanya `http://localhost:5173`).

---

## 🌐 Konfigurasi Deployment

Repositori ini telah dilengkapi berkas konfigurasi hosting:
* **Vercel**: Menggunakan `vercel.json` untuk *rewrites* dan *routing*.
* **Netlify**: Menggunakan `netlify.toml` pada folder `moodspace` untuk *build command* dan *publish directory*.
* **GitHub Pages**: Seluruh file statis dapat langsung disajikan melalui tab Settings > Pages pada repositori GitHub.

---

*Dikembangkan dengan dedikasi untuk edukasi, teknologi web interaktif, dan kesehatan mental.* 🚀
