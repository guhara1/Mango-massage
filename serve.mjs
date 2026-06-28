// 간단 미리보기 서버: node serve.mjs → http://localhost:4321
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = 'docs';
const PORT = 4321;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.js': 'text/javascript' };

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    let file = join(ROOT, p);
    let data;
    try { data = await readFile(file); }
    catch { file = join(ROOT, '404.html'); data = await readFile(file); res.statusCode = 404; }
    res.setHeader('Content-Type', TYPES[extname(file)] || 'application/octet-stream');
    res.end(data);
  } catch (e) { res.statusCode = 500; res.end(String(e)); }
}).listen(PORT, () => console.log(`▶ http://localhost:${PORT}`));
