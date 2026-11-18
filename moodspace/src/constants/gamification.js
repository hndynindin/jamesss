export const JOURNAL_TEMPLATES = [
  {
    id: 'gratitude',
    name: '3 Hal yang Kusyukuri',
    icon: '✨',
    badge: 'Populer',
    desc: 'Melatih otak fokus pada kebaikan kecil di sekitarmu.',
    moodDefault: 'happy',
    content: `🌿 HAL-HAL KECIL YANG MEMBUATKU TERSENYUM HARI INI:
1. 
2. 
3. 

💭 MENGAPA HAL INI BERARTI BAGIKU:
- 

💌 PESAN HANGAT UNTUK DIRI SENDIRI:
- `,
  },
  {
    id: 'braindump',
    name: 'Pelepas Beban (Brain Dump)',
    icon: '🌊',
    badge: 'Anti Stres',
    desc: 'Keluarkan semua kekusutan pikiran tanpa disortir.',
    moodDefault: 'tired',
    content: `🌪️ HAL-HAL YANG MEMENUHI KEPALAKU SAAT INI:
- 

🔍 APA YANG BISA KUKENDALIKAN:
- 

🍃 APA YANG PERLU KULEPASKAN & KUPASRAHKAN:
- 

🎯 SATU LANGKAH KECIL YANG BISA KULAKUKAN SEKARANG:
- `,
  },
  {
    id: 'evening-review',
    name: 'Refleksi Malam Hari',
    icon: '🌙',
    badge: 'Tidur Tenang',
    desc: 'Menutup hari dengan damai sebelum beristirahat.',
    moodDefault: 'calm',
    content: `⭐ PENCAPAIAN ATAU HAL BAIK YANG TERJADI HARI INI:
- 

🧩 PELAJARAN YANG DAPAT KUAMBIL HARI INI:
- 

🙏 MAAF UNTUK DIRI SENDIRI KARENA:
- 

💤 NIAT & DOA KETENANGAN SEBELUM TIDUR:
- Aku melepaskan lelah hari ini dan menyambut tidur yang lelap.`,
  },
  {
    id: 'emotional-check',
    name: 'Mendengar Suara Hati',
    icon: '💖',
    badge: 'Empati Diri',
    desc: 'Validasi perasaan yang sedang berkecamuk.',
    moodDefault: 'anxious',
    content: `🌧️ APA EMOSI UTAMA YANG SEDANG KURASAKAN SEKARANG?
- 

📍 DI BAGIAN TUBUH MANA PERASAAN INI TERASA?
- 

🛡️ APA KEBUTUHAN TERSEMBUNYI DI BALIK EMOSI INI?
- (Misal: butuh istirahat, butuh didengar, butuh kepastian, butuh pelukan)

🤍 KATA-KATA PENGUAT DARI DIRIKU:
- "Perasaanku valid, dan aku mendengarkanmu dengan sabar."`,
  },
];

export const BADGES_LIST = [
  {
    id: 'first_journal',
    title: 'Langkah Pertama',
    desc: 'Menulis jurnal pertama kalinya di MoodSpace.',
    icon: '🌱',
    reqCount: 1,
    category: 'journal',
  },
  {
    id: 'journal_3',
    title: 'Penjelajah Batin',
    desc: 'Telah menulis 3 catatan jurnal pribadi.',
    icon: '📖',
    reqCount: 3,
    category: 'journal',
  },
  {
    id: 'journal_7',
    title: 'Penulis Jiwa Sejati',
    desc: 'Telah menulis 7 catatan jurnal mendalam.',
    icon: '✍️',
    reqCount: 7,
    category: 'journal',
  },
  {
    id: 'streak_3',
    title: 'Konsisten 3 Hari',
    desc: 'Mencatat suasana hati selama 3 hari berturut-turut.',
    icon: '🔥',
    reqStreak: 3,
    category: 'streak',
  },
  {
    id: 'streak_7',
    title: 'Minggu Berkesadaran',
    desc: 'Menjaga streak mood selama 7 hari penuh.',
    icon: '🏆',
    reqStreak: 7,
    category: 'streak',
  },
  {
    id: 'habit_hero',
    title: 'Pejuang Kebiasaan',
    desc: 'Menuntaskan semua kebiasaan harian dalam 1 hari.',
    icon: '⭐',
    category: 'habit',
  },
];

