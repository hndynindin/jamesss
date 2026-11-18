# Koleksi Aplikasi Web & Proyek Interaktif (jamesss)

Repositori ini berisi kumpulan aplikasi web interaktif, tool edukasi, dan kalkulator berbasis web modern yang siap di-deploy (mendukung Vercel, Netlify, maupun GitHub Pages).

---

## 🚀 Daftar Aplikasi dalam Repositori

### 1. 🧠 So Syncd — Tes Kepribadian MBTI (`index.html`)
Aplikasi tes kepribadian interaktif berbasis 16 tipe Myers-Briggs Type Indicator (MBTI) dengan antarmuka yang bersih, responsif, dan mudah digunakan.
- **Fitur Utama:**
  - Kuis bertahap dengan indikator progres real-time.
  - Perhitungan akurat untuk 4 spektrum kepribadian:
    - Extraversion (E) vs Introversion (I)
    - Sensing (S) vs Intuition (N)
    - Thinking (T) vs Feeling (F)
    - Judging (J) vs Perceiving (P)
  - Hasil tes mendalam: deskripsi kepribadian, kelebihan & kelemahan, saran karir, dan kompatibilitas relasi.
  - Tampilan modern dengan palet warna yang tenang dan elegan.

---

### 2. 🌱 MoodSpace (`moodspace/`)
Aplikasi journaling dan pelacak suasana hati (mood tracker) yang dirancang untuk mendukung kesehatan mental dan refleksi harian pengguna.
- **Teknologi:** Vite, JavaScript, CSS/HTML.
- **Fitur Utama:**
  - Pencatatan suasana hati harian secara intuitif.
  - Log aktivitas dan catatan refleksi personal.
  - Konfigurasi siap deploy ke Netlify & Vercel (`netlify.toml`, `vercel.json`).

---

### 3. 🎓 SNBP Predictor & Calculator (`snbp/`)
Tool simulasi dan analisis peluang kelolosan Seleksi Nasional Berdasarkan Prestasi (SNBP) untuk calon mahasiswa baru di Indonesia.
- **Teknologi:** HTML5, CSS3 kustom (`styles.css`), Vanilla JavaScript (`app.js`).
- **Fitur Utama:**
  - Input nilai rapor semester 1 sampai 5 untuk berbagai mata pelajaran.
  - Pembobotan nilai dan perbandingan dengan profil jurusan / PTN yang dituju.
  - Analisis tren peningkatan nilai dan skor kelayakan.

---

## 📂 Struktur Repositori

```text
├── index.html              # Aplikasi Utama: So Syncd MBTI Personality Test
├── moodspace/              # Proyek MoodSpace (Vite Web App)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── netlify.toml
│   └── vercel.json
├── snbp/                   # Proyek Kalkulator SNBP
│   ├── index.html
│   ├── app.js
│   ├── styles.css
│   └── vercel.json
├── vercel.json             # Konfigurasi deployment Vercel utama
└── README.md               # Dokumentasi proyek
```

---

## 🛠️ Cara Menjalankan Secara Lokal

1. **Jalankan So Syncd (MBTI) atau SNBP:**
   Cukup buka file `index.html` (di root atau di folder `snbp/`) langsung di browser favorit Anda, atau gunakan Live Server:
   ```bash
   npx serve .
   ```

2. **Jalankan MoodSpace:**
   Masuk ke folder `moodspace`:
   ```bash
   cd moodspace
   npm install
   npm run dev
   ```

---

## 🌐 Deployment
Seluruh modul proyek ini dirancang agar ringan, mandiri, dan dapat langsung di-deploy ke penyedia hosting statis seperti Vercel, Netlify, atau GitHub Pages tanpa konfigurasi rumit.
