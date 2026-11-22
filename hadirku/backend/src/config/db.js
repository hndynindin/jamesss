const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

let pool = null;
let useFallback = false;
let memoryStore = null;

// Initial seed data mirroring database.sql
function createInitialStore() {
  const bcryptHash = '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46'; // 'password123'
  
  // Dynamic past dates relative to current execution date
  const now = new Date();
  const getDateStr = (offsetDays) => {
    const d = new Date(now);
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().split('T')[0];
  };

  const d0 = getDateStr(0); // Hari ini
  const d1 = getDateStr(1); // Kemarin
  const d2 = getDateStr(2);
  const d3 = getDateStr(3);
  const d4 = getDateStr(4);
  const d5 = getDateStr(5);
  const d6 = getDateStr(6);

  return {
    users: [
      { id: 1, username: 'admin', email: 'admin@hadirku.sch.id', password: bcryptHash, role: 'admin', avatar: null },
      { id: 2, username: 'guru_budi', email: 'budi@hadirku.sch.id', password: bcryptHash, role: 'guru', avatar: null },
      { id: 3, username: 'guru_siti', email: 'siti@hadirku.sch.id', password: bcryptHash, role: 'guru', avatar: null },
      { id: 4, username: 'guru_eko', email: 'eko@hadirku.sch.id', password: bcryptHash, role: 'guru', avatar: null },
      { id: 5, username: '20240101', email: 'ahmad@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null },
      { id: 6, username: '20240102', email: 'siti.n@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null },
      { id: 7, username: '20240103', email: 'rizky@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null },
      { id: 8, username: '20240104', email: 'dewi@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null },
      { id: 9, username: '20240105', email: 'farhan@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null },
      { id: 10, username: '20240106', email: 'bayu@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null },
      { id: 11, username: '20240107', email: 'dinda@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null },
      { id: 12, username: '20240108', email: 'aditya@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null },
      { id: 13, username: '20240109', email: 'nabila@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null },
      { id: 14, username: '20240110', email: 'fajar@hadirku.sch.id', password: bcryptHash, role: 'siswa', avatar: null }
    ],
    academic_years: [
      { id: 1, name: '2024/2025 Ganjil', semester: 'Ganjil', is_active: 1, start_date: getDateStr(90), end_date: getDateStr(-90) },
      { id: 2, name: '2024/2025 Genap', semester: 'Genap', is_active: 0, start_date: getDateStr(-91), end_date: getDateStr(-270) }
    ],
    majors: [
      { id: 1, code: 'TKJ', name: 'Teknik Komputer dan Jaringan', description: 'Konsentrasi keahlian perakitan komputer, instalasi jaringan kabel & nirkabel, administrasi server Linux/Windows, mikrotik, dan cyber security dasar.' },
      { id: 2, code: 'RPL', name: 'Rekayasa Perangkat Lunak', description: 'Konsentrasi keahlian pemrograman web, mobile, database, dan software engineering.' },
      { id: 3, code: 'DKV', name: 'Desain Komunikasi Visual', description: 'Konsentrasi keahlian grafis digital, animasi, videografi, dan multimedia.' }
    ],
    teachers: [
      { id: 1, user_id: 2, nip: '198504122010011003', full_name: 'Budi Santoso, S.Kom', email: 'budi@hadirku.sch.id', phone: '081234567890', gender: 'L', subject: 'Administrasi Infrastruktur Jaringan (AIJ)' },
      { id: 2, user_id: 3, nip: '198902152014022005', full_name: 'Siti Rahmawati, S.Pd', email: 'siti@hadirku.sch.id', phone: '081298765432', gender: 'P', subject: 'Administrasi Sistem Jaringan (ASJ)' },
      { id: 3, user_id: 4, nip: '197908202008011002', full_name: 'Eko Prasetyo, M.T', email: 'eko@hadirku.sch.id', phone: '081377889900', gender: 'L', subject: 'Teknologi Layanan Jaringan (TLJ)' }
    ],
    classes: [
      { id: 1, name: 'XII TKJ 1', grade: 12, major_id: 1, academic_year_id: 1, homeroom_teacher_id: 1 },
      { id: 2, name: 'XII TKJ 2', grade: 12, major_id: 1, academic_year_id: 1, homeroom_teacher_id: 3 },
      { id: 3, name: 'XI TKJ 1', grade: 11, major_id: 1, academic_year_id: 1, homeroom_teacher_id: 2 },
      { id: 4, name: 'X TKJ 1', grade: 10, major_id: 1, academic_year_id: 1, homeroom_teacher_id: null },
      { id: 5, name: 'XII RPL 1', grade: 12, major_id: 2, academic_year_id: 1, homeroom_teacher_id: null }
    ],
    teacher_classes: [
      { id: 1, teacher_id: 1, class_id: 1, subject: 'Administrasi Infrastruktur Jaringan' },
      { id: 2, teacher_id: 1, class_id: 2, subject: 'Administrasi Infrastruktur Jaringan' },
      { id: 3, teacher_id: 2, class_id: 1, subject: 'Administrasi Sistem Jaringan' },
      { id: 4, teacher_id: 2, class_id: 3, subject: 'Administrasi Sistem Jaringan' },
      { id: 5, teacher_id: 3, class_id: 2, subject: 'Teknologi Layanan Jaringan' },
      { id: 6, teacher_id: 3, class_id: 3, subject: 'Teknologi Layanan Jaringan' }
    ],
    students: [
      { id: 1, user_id: 5, nis: '20240101', nisn: '0061234567', full_name: 'Ahmad Fauzi', gender: 'L', class_id: 1, major_id: 1, entry_year: 2022, phone: '085200000001', address: 'Jl. Merdeka No. 12, Jakarta', qr_code_token: 'QR-20240101-AHMAD' },
      { id: 2, user_id: 6, nis: '20240102', nisn: '0061234568', full_name: 'Siti Nurhaliza', gender: 'P', class_id: 1, major_id: 1, entry_year: 2022, phone: '085200000002', address: 'Jl. Melati Indah No. 4, Jakarta', qr_code_token: 'QR-20240102-SITI' },
      { id: 3, user_id: 7, nis: '20240103', nisn: '0061234569', full_name: 'Rizky Ramadhan', gender: 'L', class_id: 1, major_id: 1, entry_year: 2022, phone: '085200000003', address: 'Jl. Anggrek No. 8, Jakarta', qr_code_token: 'QR-20240103-RIZKY' },
      { id: 4, user_id: 8, nis: '20240104', nisn: '0061234570', full_name: 'Dewi Anggraini', gender: 'P', class_id: 1, major_id: 1, entry_year: 2022, phone: '085200000004', address: 'Jl. Mawar No. 15, Jakarta', qr_code_token: 'QR-20240104-DEWI' },
      { id: 5, user_id: 9, nis: '20240105', nisn: '0061234571', full_name: 'Muhammad Farhan', gender: 'L', class_id: 1, major_id: 1, entry_year: 2022, phone: '085200000005', address: 'Jl. Flamboyan No. 22, Jakarta', qr_code_token: 'QR-20240105-FARHAN' },
      { id: 6, user_id: 10, nis: '20240106', nisn: '0061234572', full_name: 'Bayu Saputra', gender: 'L', class_id: 2, major_id: 1, entry_year: 2022, phone: '085200000006', address: 'Jl. Kenanga No. 7, Jakarta', qr_code_token: 'QR-20240106-BAYU' },
      { id: 7, user_id: 11, nis: '20240107', nisn: '0061234573', full_name: 'Dinda Putri', gender: 'P', class_id: 2, major_id: 1, entry_year: 2022, phone: '085200000007', address: 'Jl. Cendana No. 9, Jakarta', qr_code_token: 'QR-20240107-DINDA' },
      { id: 8, user_id: 12, nis: '20240108', nisn: '0071234574', full_name: 'Aditya Pratama', gender: 'L', class_id: 3, major_id: 1, entry_year: 2023, phone: '085200000008', address: 'Jl. Dahlia No. 19, Jakarta', qr_code_token: 'QR-20240108-ADITYA' },
      { id: 9, user_id: 13, nis: '20240109', nisn: '0071234575', full_name: 'Nabila Syahira', gender: 'P', class_id: 3, major_id: 1, entry_year: 2023, phone: '085200000009', address: 'Jl. Cempaka No. 3, Jakarta', qr_code_token: 'QR-20240109-NABILA' },
      { id: 10, user_id: 14, nis: '20240110', nisn: '0081234576', full_name: 'Fajar Ramadhan', gender: 'L', class_id: 4, major_id: 1, entry_year: 2024, phone: '085200000010', address: 'Jl. Kebon Sirih No. 1, Jakarta', qr_code_token: 'QR-20240110-FAJAR' }
    ],
    // Dikosongkan agar murni real-time: presensi hanya terisi saat siswa/guru melakukan absensi
    attendance: []
  };
}

// Persist memory store to JSON file so local edits persist between server restarts
const DATA_FILE = path.join(__dirname, '../../database/local_data.json');

function saveStore() {
  if (memoryStore) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
    } catch (e) {
      console.error('[DB-Fallback] Gagal menyimpan local_data.json:', e.message);
    }
  }
}

function loadStore() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      console.warn('[DB-Fallback] Corrupted local_data.json, creating initial store');
    }
  }
  const init = createInitialStore();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(init, null, 2), 'utf8');
  } catch (e) {}
  return init;
}

// Initialize MySQL pool or switch to fallback
async function initDatabase() {
  const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hadirku_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+07:00'
  };

  try {
    const testPool = mysql.createPool(dbConfig);
    const conn = await testPool.getConnection();
    await conn.ping();
    conn.release();
    pool = testPool;
    useFallback = false;
    console.log(`[VELOCHECK] SUCCESS: Terhubung ke MySQL Server (${dbConfig.host}:${dbConfig.port}/${dbConfig.database})`);
  } catch (err) {
    console.warn(`[VELOCHECK] NOTICE: MySQL server tidak aktif di port ${dbConfig.port} (${err.message}).`);
    console.warn(`[VELOCHECK] -> Mengaktifkan Mode Smart Local Database Store agar aplikasi langsung jalan & 100% berfungsi!`);
    useFallback = true;
    memoryStore = loadStore();
  }
}

// Database helper functions that provide uniform interface for controllers
const db = {
  isFallback: () => useFallback,
  getStore: () => memoryStore,
  saveStore,

  // Direct execute query (MySQL or Fallback handler)
  async query(sql, params = []) {
    if (!useFallback && pool) {
      return pool.query(sql, params);
    }
    // If fallback is active, our domain controllers call specialized methods or mock handler
    throw new Error('Using fallback mode, query should route through helper services');
  }
};

module.exports = {
  initDatabase,
  db,
  getStore: () => {
    if (!memoryStore) memoryStore = loadStore();
    return memoryStore;
  },
  saveStore,
  isUsingFallback: () => useFallback,
  getPool: () => pool
};
