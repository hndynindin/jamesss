const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqUrl = decodeURI(req.url.split('?')[0]);

  // Route: /portal (Halaman navigasi ketiga aplikasi)
  if (reqUrl === '/portal') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Portal Web Apps - Jamesss</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
    h1 { color: #38bdf8; margin-bottom: 8px; }
    p { color: #94a3b8; margin-bottom: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; max-width: 900px; width: 100%; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-decoration: none; color: inherit; transition: all 0.2s; display: flex; flex-direction: column; justify-content: space-between; }
    .card:hover { transform: translateY(-4px); border-color: #38bdf8; box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.2); }
    .title { font-size: 1.25rem; font-weight: bold; margin-bottom: 8px; color: #f1f5f9; }
    .desc { font-size: 0.9rem; color: #94a3b8; line-height: 1.5; margin-bottom: 20px; }
    .btn { align-self: flex-start; padding: 8px 16px; background: #0284c7; color: white; border-radius: 6px; font-weight: 500; font-size: 0.85rem; }
  </style>
</head>
<body>
  <h1>🌐 Jamesss Web Portal</h1>
  <p>Pilih aplikasi web yang ingin kamu buka di bawah ini:</p>
  <div class="grid">
    <a href="/" class="card">
      <div>
        <div class="title">🧠 So Syncd (MBTI Test)</div>
        <div class="desc">Aplikasi tes kepribadian 16 tipe Myers-Briggs dengan visual interaktif, kalkulasi akurat, dan panduan karir/relasi.</div>
      </div>
      <span class="btn">Buka MBTI Test &rarr;</span>
    </a>
    <a href="/moodspace/" class="card">
      <div>
        <div class="title">🌱 MoodSpace</div>
        <div class="desc">Platform kesehatan mental harian, pelacak suasana hati, daily habit, sound engine relaksasi, dan journaling.</div>
      </div>
      <span class="btn">Buka MoodSpace &rarr;</span>
    </a>
    <a href="/snbp/" class="card">
      <div>
        <div class="title">🎓 SNBP Predictor</div>
        <div class="desc">Kalkulator dan simulator peluang kelolosan SNBP berdasarkan konsistensi nilai rapor semester 1-5.</div>
      </div>
      <span class="btn">Buka SNBP Predictor &rarr;</span>
    </a>
  </div>
</body>
</html>`);
    return;
  }

  let filePath = '';

  // Mapping moodspace to moodspace/dist
  if (reqUrl.startsWith('/moodspace')) {
    let subPath = reqUrl.replace('/moodspace', '');
    if (!subPath || subPath === '/') {
      filePath = path.join(ROOT, 'moodspace', 'dist', 'index.html');
    } else {
      filePath = path.join(ROOT, 'moodspace', 'dist', subPath);
    }
    // Fallback for SPA in moodspace
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      } else {
        filePath = path.join(ROOT, 'moodspace', 'dist', 'index.html');
      }
    }
  } else if (reqUrl.startsWith('/snbp')) {
    let subPath = reqUrl.replace('/snbp', '');
    if (!subPath || subPath === '/') {
      filePath = path.join(ROOT, 'snbp', 'index.html');
    } else {
      filePath = path.join(ROOT, 'snbp', subPath);
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } else {
    // Root serves index.html (MBTI)
    if (reqUrl === '/') {
      filePath = path.join(ROOT, 'index.html');
    } else {
      filePath = path.join(ROOT, reqUrl);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Portal navigation: http://localhost:${PORT}/portal`);
});
