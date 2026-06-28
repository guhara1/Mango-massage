// 정적 사이트 빌드 — docs/ 출력 (GitHub Pages 호환)
import { writeFile, mkdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { CSS } from './src/theme.mjs';
import { page, thumbFile } from './src/layout.mjs';
import { buildManifest } from './src/pages.mjs';
import { SITE } from './src/site.mjs';

const OUT = 'docs';

async function emit(relPath, content) {
  const full = join(OUT, relPath);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, content, 'utf8');
}

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFA938"/><stop offset="1" stop-color="#F0760A"/></linearGradient></defs>
<rect width="64" height="64" rx="16" fill="url(#g)"/>
<ellipse cx="30" cy="36" rx="17" ry="20" fill="#fff" opacity=".95"/>
<path d="M40 14 c8 -6 16 -5 16 -5 c0 0 -1 11 -9 16 c-5 3 -11 1 -13 -4 z" fill="#5E9A52"/>
</svg>`;

async function main() {
  await rm(OUT, { recursive: true, force: true });

  // 에셋
  await emit('assets/style.css', CSS);
  await emit('assets/favicon.svg', FAVICON);
  await emit('.nojekyll', '');
  // 실제 도메인 연결 시 docs/CNAME 파일을 추가하세요.

  const pages = buildManifest();
  const seen = new Set();
  const urls = [];

  for (const p of pages) {
    if (seen.has(p.url)) { console.warn('중복 URL:', p.url); continue; }
    seen.add(p.url);

    const dir = p.url === '/' ? '' : p.url.replace(/^\/|\/$/g, '');
    const htmlPath = dir ? `${dir}/index.html` : 'index.html';
    const html = page(p);
    await emit(htmlPath, html);

    // 페이지별 썸네일 (og:image / schema ImageObject)
    const thumbPath = dir ? `${dir}/thumb.svg` : 'thumb.svg';
    await emit(thumbPath, thumbFile(p.url, p.imageAlt || p.title));

    if (!p.noindex) urls.push(p.url);
  }

  // sitemap.xml
  const today = '2026-06-28';
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map((u) => `  <url>
    <loc>${SITE.baseUrl}${encodeURI(u)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${u === '/' ? '1.0' : '0.7'}</priority>
    <image:image><image:loc>${SITE.baseUrl}${encodeURI(u)}thumb.svg</image:loc></image:image>
  </url>`).join('\n')}
</urlset>`.replace('sitemap.org/schemas/sitemap', 'sitemaps.org/schemas/sitemap');
  await emit('sitemap.xml', sitemap);

  // robots.txt
  await emit('robots.txt', `User-agent: *
Allow: /
Sitemap: ${SITE.baseUrl}/sitemap.xml
`);

  // 404
  await emit('404.html', page({
    url: '/404/', title: `페이지를 찾을 수 없습니다｜${SITE.name}`,
    description: '요청하신 페이지를 찾을 수 없습니다. 수도권 지역 안내로 이동하세요.',
    current: '/', noindex: true, imageAlt: '404',
    breadcrumb: [{ label: '수도권 홈', href: '/' }],
    body: `<section class="section"><div class="container" style="text-align:center;padding-block:60px">
      <h1>페이지를 찾을 수 없습니다</h1>
      <p class="lead">요청하신 페이지가 이동되었거나 존재하지 않습니다.</p>
      <p><a class="btn btn-primary btn-lg" href="/">수도권 홈으로</a></p>
    </div></section>`,
  }));

  console.log(`✅ 빌드 완료: ${seen.size} 페이지, 색인 ${urls.length}개 → ${OUT}/`);
}

main().catch((e) => { console.error(e); process.exit(1); });
