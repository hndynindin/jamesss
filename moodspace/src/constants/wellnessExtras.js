export const INITIAL_HABITS = [
  { id: 'h-water', title: 'Minum 2 Liter Air', icon: '💧', category: 'Fisik' },
  { id: 'h-meditate', title: '5 Menit Hening & Napas', icon: '🧘', category: 'Mental' },
  { id: 'h-journal', title: 'Menulis Jurnal Syukur', icon: '📖', category: 'Emosi' },
  { id: 'h-walk', title: 'Jalan Santai 15 Menit', icon: '🌿', category: 'Aktivitas' },
  { id: 'h-sleep', title: 'Tidur Sebelum Pukul 23:00', icon: '🌙', category: 'Istirahat' },
  { id: 'h-screenfree', title: 'Tanpa Gadget Saat Sarapan', icon: '📵', category: 'Fokus' },
];

export const EMOTIONAL_FIRST_AID = [
  {
    id: 'efa-anxious',
    title: 'Pertolongan Saat Cemas atau Panik',
    mood: 'anxious',
    emoji: '😰',
    color: '#8B5CF6',
    bg: '#EDE9FE',
    steps: [
      { step: 'Katakan pada diri', desc: '"Ini hanyalah respons saraf tubuhku. Aku sedang aman saat ini dan badai ini akan mereda."' },
      { step: 'Basuh wajah dengan air dingin', desc: 'Rangsang refleks vagal untuk segera memperlambat detak jantung yang berdegup kencang.' },
      { step: 'Tekan kedua telapak kaki ke lantai', desc: 'Rasakan bumi menopang berat badanmu dengan kokoh (Grounding).' },
      { step: 'Gunakan napas 4-4-6', desc: 'Hembuskan napas dua detik lebih panjang daripada saat menghirup.' },
    ],
  },
  {
    id: 'efa-angry',
    title: 'Pereda Amarah & Frustrasi Luapan',
    mood: 'angry',
    emoji: '😠',
    color: '#EF4444',
    bg: '#FEE2E2',
    steps: [
      { step: 'Jeda 10 detik tanpa bicara', desc: 'Jangan kirim pesan atau mengambil keputusan saat hormon adrenalinmu sedang berada di puncaknya.' },
      { step: 'Keluarkan energi fisik secara aman', desc: 'Remas bantal empuk, jalan cepat berkeliling ruangan, atau cuci tangan dengan air hangat.' },
      { step: 'Tulis kemarahan tanpa filter di kertas', desc: 'Lalu sobek kertas tersebut menjadi serpihan kecil sebagai simbol melepaskan racun batin.' },
      { step: 'Tanyakan kebutuhan aslimu', desc: '"Apakah aku sebenarnya merasa tidak dihargai, lelah, atau kecewa?"' },
    ],
  },
  {
    id: 'efa-sad',
    title: 'Pelukan Hangat Saat Terluka & Sedih',
    mood: 'sad',
    emoji: '😢',
    color: '#3B82F6',
    bg: '#DBEAFE',
    steps: [
      { step: 'Izinkan air mata menetes', desc: 'Air mata emosional mengandung hormon stres yang memang perlu dikeluarkan oleh tubuh.' },
      { step: 'Peluk dirimu sendiri (Butterfly Hug)', desc: 'Silangkan kedua tangan di dada dan tepuk pundak kiri-kanan bergantian dengan ritme pelan.' },
      { step: 'Seduh minuman hangat', desc: 'Sensasi kehangatan fisik di tangan terbukti mengirim sinyal kenyamanan ke otak emosi.' },
      { step: 'Putar suara hujan atau ombak', desc: 'Dengarkan suara alam di fitur Audio Ambien MoodSpace untuk menenangkan ruang jiwamu.' },
    ],
  },
  {
    id: 'efa-tired',
    title: 'Pemulihan Saat Lelah Mental (Burnout)',
    mood: 'tired',
    emoji: '😴',
    color: '#8D78A9',
    bg: '#E7DDF5',
    steps: [
      { step: 'Beri izin bersalah nol persen', desc: 'Katakan: "Aku berhak tidak produktif sekarang tanpa harus merasa bersalah."' },
      { step: 'Kurangi beban sensorik', desc: 'Redupkan lampu ruangan, matikan semua notifikasi ponsel selama 30 menit.' },
      { step: 'Baringkan punggung di tempat datar', desc: 'Tutup mata tanpa target tidur, biarkan otot-otot tulang belakang beristirahat.' },
      { step: 'Minum air hangat berelektrolit', desc: 'Kelelahan otak sering kali dipicu oleh dehidrasi ringan yang tidak disadari.' },
    ],
  },
];

