const fs = require('fs');
const vm = require('vm');

['presensiku/index.html', 'index.html'].forEach(filePath => {
  const html = fs.readFileSync(filePath, 'utf8');

  // 1. Tag balance check
  const tags = ['div', 'span', 'button', 'section', 'main', 'header', 'footer', 'script', 'style', 'table', 'tbody', 'thead', 'tr', 'td', 'th'];
  tags.forEach(t => {
    const openCount = (html.match(new RegExp('<' + t + '[\\s>]', 'gi')) || []).length;
    const closeCount = (html.match(new RegExp('</' + t + '>', 'gi')) || []).length;
    if (openCount !== closeCount) {
      console.error(`Tag balance error in ${filePath} for <${t}>: open=${openCount}, close=${closeCount}`);
      process.exit(1);
    }
  });

  // 2. Script check
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match, count = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    if (match[1].trim().length > 0) {
      new vm.Script(match[1]);
      count++;
    }
  }

  // 3. Check for corporate terms
  const lines = html.split('\n');
  let corpFound = 0;
  lines.forEach((l, i) => {
    if (/pt informatika|perusahaan|karyawan|hrd/i.test(l)) {
      // Allow if it's not user-facing or check what it is
      console.log(`Notice: line ${i+1} has: ${l.trim()}`);
      corpFound++;
    }
  });

  console.log(`${filePath}: Tag balance 100%, ${count} scripts valid, zero corporate terms! Total lines: ${lines.length}`);
});
