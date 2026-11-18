export const MOODS = [
  {
    id: 'happy',
    label: 'Senang',
    emoji: '😊',
    score: 5,
    color: '#F59E0B',
    bgLight: '#FEF3C7',
    bgDark: 'rgba(245, 158, 11, 0.18)',
    border: '#FCD34D',
    description: 'Penuh syukur, ceria, bersemangat, dan merasa puas.',
  },
  {
    id: 'calm',
    label: 'Tenang',
    emoji: '😌',
    score: 4,
    color: '#10B981',
    bgLight: '#D1FAE5',
    bgDark: 'rgba(16, 185, 129, 0.18)',
    border: '#6EE7B7',
    description: 'Damai, seimbang, santai, dan pikiran terasa jernih.',
  },
  {
    id: 'tired',
    label: 'Lelah',
    emoji: '😴',
    score: 3,
    color: '#8D78A9',
    bgLight: '#E7DDF5',
    bgDark: 'rgba(141, 120, 169, 0.22)',
    border: '#C7B1E5',
    description: 'Energi menipis, butuh tidur dan ruang jeda yang tenang.',
  },
  {
    id: 'anxious',
    label: 'Cemas',
    emoji: '😰',
    score: 2,
    color: '#8B5CF6',
    bgLight: '#EDE9FE',
    bgDark: 'rgba(139, 92, 246, 0.18)',
    border: '#C4B5FD',
    description: 'Khawatir, overthinking, gelisah, atau terbebani target.',
  },
  {
    id: 'sad',
    label: 'Sedih',
    emoji: '😢',
    score: 2,
    color: '#3B82F6',
    bgLight: '#DBEAFE',
    bgDark: 'rgba(59, 130, 246, 0.18)',
    border: '#93C5FD',
    description: 'Hati terasa berat, terluka, atau sedang butuh pelukan hangat.',
  },
  {
    id: 'angry',
    label: 'Marah',
    emoji: '😠',
    score: 1,
    color: '#EF4444',
    bgLight: '#FEE2E2',
    bgDark: 'rgba(239, 68, 68, 0.18)',
    border: '#FCA5A5',
    description: 'Frustrasi, kecewa berat, kesal, atau emosi meluap-luap.',
  },
];

export const MOOD_MAP = Object.fromEntries(MOODS.map((m) => [m.id, m]));

export const EMOTION_TAGS = [
  'Pekerjaan',
  'Kuliah & Tugas',
  'Keluarga',
  'Pasangan',
  'Pertemanan',
  'Kesehatan',
  'Keuangan',
  'Cuaca',
  'Hobi',
  'Waktu Sendiri',
  'Pencapaian',
  'Kelelahan',
];

export const INTENSITY_LABELS = {
  1: 'Sangat Ringan (Nyaris tidak mengganggu)',
  2: 'Ringan (Bisa dikelola dengan santai)',
  3: 'Sedang (Cukup terasa di pikiran & tubuh)',
  4: 'Kuat (Mempengaruhi fokus dan energi)',
  5: 'Sangat Kuat (Sangat dominan & memuncak)',
};

export const DAILY_QUOTES = [
  {
    text: 'Perasaanmu valid. Tidak apa-apa untuk berjalan pelan hari ini selama kamu tetap lembut pada dirimu sendiri.',
    author: 'MoodSpace Sanctuary',
  },
  {
    text: 'Menulis adalah cara jiwa berbicara saat kata-kata terlalu berat untuk diucapkan langsung.',
    author: 'Refleksi Jiwa',
  },
  {
    text: 'Kamu tidak harus menyelesaikan semua hal hari ini. Cukup ambil satu napas dalam dan lakukan satu langkah kecil yang bermakna.',
    author: 'Catatan Hening',
  },
  {
    text: 'Ketenangan sejati bukan berarti ketiadaan badai, melainkan kemampuan menemukan ruang teduh di tengah hembusannya.',
    author: 'Kutipan Mindfulness',
  },
  {
    text: 'Merawat kesehatan mental bukanlah kemewahan, melainkan bentuk pertanggungjawaban paling jujur terhadap hidupmu.',
    author: 'Ruang Sadar',
  },
  {
    text: 'Setiap hari adalah kanvas baru. Kamu berhak memaafkan hari kemarin dan memulai lembaran baru dengan penuh welas asih.',
    author: 'MoodSpace Daily',
  },
];

export const AFFIRMATIONS = [
  'Aku layak mendapatkan ketenangan, istirahat cukup, dan hal-hal baik hari ini.',
  'Aku menerima seluruh emosiku saat ini tanpa menghakimi diriku sendiri.',
  'Setiap tarikan napas mengalirkan kedamaian, setiap hembusan melepaskan beban.',
  'Aku bertumbuh dengan ritmeku sendiri, dan langkah kecilku tetap sangat berharga.',
  'Aku cukup tangguh melewati hari yang rumit, dan cukup bijak merayakan hal-hal sederhana.',
  'Pikiran dan ragaku berhak istirahat. Di ruang ini, aku sepenuhnya aman.',
  'Kesalahan bukanlah tanda kegagalan, melainkan guru yang membimbingku lebih dewasa.',
  'Aku memilih untuk menyapa diriku sendiri dengan kata-kata yang lembut dan menyemangati.',
  'Hari ini aku melepaskan hal-hal yang di luar kendaliku dan merawat apa yang ada di depanku.',
  'Kebahagiaan dan ketenangan batinku adalah prioritas yang layak kujaga dengan sehat.',
];

export const AMBIENT_SOUNDS = [
  {
    id: 'rain',
    name: 'Hujan Lembut',
    icon: 'CloudRain',
    freq: 180,
    type: 'pink',
    desc: 'Suara rintik hujan menenangkan yang meredam kebisingan pikiran.',
  },
  {
    id: 'waves',
    name: 'Ombak Pantai',
    icon: 'Waves',
    freq: 120,
    type: 'sine',
    desc: 'Irama deburan ombak laut yang berulang dan mendalam.',
  },
  {
    id: 'forest',
    name: 'Semilir Angin Hutan',
    icon: 'Trees',
    freq: 240,
    type: 'triangle',
    desc: 'Hembusan angin sejuk di antara pepohonan asri.',
  },
  {
    id: 'night',
    name: 'Malam Berbintang',
    icon: 'Sparkles',
    freq: 330,
    type: 'sine',
    desc: 'Frekuensi harmoni 432Hz yang mengantarkan tubuh menuju rileks total.',
  },
];

export const SELF_CARE_TIPS = [
  {
    id: 'tip-1',
    title: 'Aturan 20-20-20 untuk Mata & Fokus',
    category: 'Istirahat Digital',
    duration: '1 menit',
    description:
      'Setiap 20 menit menatap layar, pandang objek sejauh 6 meter selama 20 detik sambil menurunkan bahu yang tegang.',
  },
  {
    id: 'tip-2',
    title: 'Mindful Sip & Hydration',
    category: 'Tubuh & Energi',
    duration: '2 menit',
    description:
      'Minum segelas air hangat perlahan. Rasakan suhunya membasahi tenggorokan sebagai jangkar untuk hadir utuh saat ini.',
  },
  {
    id: 'tip-3',
    title: 'Brain Dump Sebelum Rehat',
    category: 'Emosional',
    duration: '5 menit',
    description:
      'Tuliskan hal-hal yang berputar di kepala tanpa disortir. Saat tertulis di kertas/jurnal, otakmu berhenti cemas.',
  },
  {
    id: 'tip-4',
    title: 'Peregangan Bahu & Rahang',
    category: 'Relaksasi Fisik',
    duration: '3 menit',
    description:
      'Buka rahang sedikit, turunkan lidah dari langit-langit mulut, dan putar bahu ke belakang 5 kali secara perlahan.',
  },
  {
    id: 'tip-5',
    title: 'Matahari Pagi 10 Menit',
    category: 'Kesejahteraan',
    duration: '10 menit',
    description:
      'Keluar ruangan sejenak dan biarkan cahaya matahari pagi menyentuh kulit untuk mengatur ulang ritme sirkadian tubuh.',
  },
];

export const RELAXATION_ACTIVITIES = [
  {
    id: 'act-1',
    title: 'Teknik Grounding 5-4-3-2-1',
    desc: 'Sangat efektif saat pikiran panik atau cemas mendadak.',
    steps: [
      'Sebutkan 5 hal nyata yang bisa kamu lihat saat ini',
      'Sentuh 4 benda dengan tekstur berbeda di sekitarmu',
      'Dengarkan 3 suara yang terdengar di ruangan/luar',
      'Kenali 2 aroma yang tercium di udara',
      'Rasakan 1 hal baik dalam dirimu yang sangat kamu syukuri',
    ],
  },
  {
    id: 'act-2',
    title: 'Refleksi Syukur 3 Hal',
    desc: 'Mengarahkan fokus otak dari kekurangan menuju kelimpahan.',
    steps: [
      'Tarik napas dalam 3 kali sebelum memulai',
      'Tuliskan 1 orang yang kehadirannya membuatmu merasa terbantu',
      'Tuliskan 1 hal sederhana yang berhasil kamu lalui hari ini',
      'Tuliskan 1 apresiasi tulus untuk tubuhmu yang tetap berjuang',
    ],
  },
  {
    id: 'act-3',
    title: 'Detoks Notifikasi Singkat',
    desc: 'Mengistirahatkan sistem saraf dari rangsangan media sosial.',
    steps: [
      'Aktifkan mode Jangan Ganggu (Do Not Disturb) selama 15 menit',
      'Letakkan ponsel di luar jangkauan tanganmu',
      'Duduk tenang, nikmati minuman hangat, atau tatap jendela',
    ],
  },
];

export const PRESET_AVATARS = [
  { id: 'av-1', label: 'Bunga Sakura', bg: '#FCE7F3', emoji: '🌸' },
  { id: 'av-2', label: 'Bulan Sabit', bg: '#EDE9FE', emoji: '🌙' },
  { id: 'av-3', label: 'Daun Mint', bg: '#D1FAE5', emoji: '🌿' },
  { id: 'av-4', label: 'Awan Lembut', bg: '#DBEAFE', emoji: '☁️' },
  { id: 'av-5', label: 'Bintang Terang', bg: '#FEF3C7', emoji: '✨' },
  { id: 'av-6', label: 'Kupu-Kupu Ungu', bg: '#E7DDF5', emoji: '🦋' },
  { id: 'av-7', label: 'Matahari Hangat', bg: '#FFEDD5', emoji: '☀️' },
  { id: 'av-8', label: 'Kucing Tenang', bg: '#F5E8DD', emoji: '🐱' },
];
