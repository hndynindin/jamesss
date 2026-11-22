const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

async function runSeed() {
  const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  };

  console.log(`[SEED] Menghubungkan ke MySQL di ${dbConfig.host}:${dbConfig.port}...`);

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('[SEED] Terhubung ke MySQL server. Membaca database.sql...');

    const sqlPath = path.join(__dirname, '../../database/database.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('[SEED] Menjalankan script database.sql...');
    await connection.query(sqlContent);
    console.log('[SEED] ✅ SUKSES! Database hadirku_db dan seluruh tabel serta data demo berhasil dibuat.');
    await connection.end();
  } catch (err) {
    console.error('[SEED] ❌ GAGAL:', err.message);
    process.exit(1);
  }
}

runSeed();
