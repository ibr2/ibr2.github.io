const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', '_posts');
const re = /^2026-01-31-pentest-codex-(\d\d)-.*\.md$/;

const files = fs.readdirSync(dir).filter((f) => re.test(f));

let updated = 0;
for (const f of files) {
  const m = f.match(/^2026-01-31-pentest-codex-(\d\d)-/);
  const codex = m[1];
  const p = path.join(dir, f);
  let s = fs.readFileSync(p, 'utf8');

  if (!s.startsWith('---')) {
    console.error('No front matter:', f);
    continue;
  }

  // Find the closing front matter fence
  const endIdx = s.indexOf('\n---', 3);
  if (endIdx < 0) {
    console.error('Bad front matter:', f);
    continue;
  }

  const fm = s.slice(0, endIdx + 4);
  const body = s.slice(endIdx + 4);

  const fmLines = fm.split(/\r?\n/);

  if (!fmLines.some((l) => /^codex:\s*/.test(l))) {
    // Insert right after opening '---'
    fmLines.splice(1, 0, `codex: ${codex}`);
    s = fmLines.join('\n') + body;
    fs.writeFileSync(p, s, 'utf8');
    updated++;
  }
}

console.log(`Found ${files.length} codex posts; updated ${updated}.`);
