// 페이지 셸 + 구조화 데이터(JSON-LD) 조립
import { SITE } from './site.mjs';
import { header, footer, esc, thumbSVG } from './components.mjs';

const abs = (p) => (p.startsWith('http') ? p : SITE.baseUrl + encodeURI(p));

// ── 구조화 데이터 ──
function schemaBlocks({ url, title, description, breadcrumb = [], faqs = [], imageAlt }) {
  const ogImage = abs(url + 'thumb.svg').replace(/\/+thumb/, '/thumb');
  const blocks = [];

  // Organization
  blocks.push({
    '@type': 'Organization',
    '@id': SITE.baseUrl + '/#org',
    name: SITE.name,
    url: SITE.baseUrl + '/',
    telephone: SITE.phone,
    areaServed: ['서울특별시', '경기도', '인천광역시'],
    sameAs: [SITE.telegram],
  });

  // WebPage
  blocks.push({
    '@type': 'WebPage',
    '@id': abs(url) + '#webpage',
    url: abs(url),
    name: title,
    description,
    inLanguage: 'ko-KR',
    isPartOf: { '@id': SITE.baseUrl + '/#website' },
    publisher: { '@id': SITE.baseUrl + '/#org' },
    primaryImageOfPage: { '@id': abs(url) + '#primaryimage' },
  });

  // WebSite
  blocks.push({
    '@type': 'WebSite',
    '@id': SITE.baseUrl + '/#website',
    url: SITE.baseUrl + '/',
    name: SITE.name,
    inLanguage: 'ko-KR',
    publisher: { '@id': SITE.baseUrl + '/#org' },
  });

  // ImageObject (선호 이미지 지정)
  blocks.push({
    '@type': 'ImageObject',
    '@id': abs(url) + '#primaryimage',
    url: ogImage,
    contentUrl: ogImage,
    caption: imageAlt || title,
    width: 560,
    height: 460,
  });

  // BreadcrumbList
  if (breadcrumb.length) {
    blocks.push({
      '@type': 'BreadcrumbList',
      '@id': abs(url) + '#breadcrumb',
      itemListElement: breadcrumb.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.label,
        item: abs(b.href),
      })),
    });
  }

  // FAQPage (실제 FAQ가 있는 페이지에만)
  if (faqs.length) {
    blocks.push({
      '@type': 'FAQPage',
      '@id': abs(url) + '#faq',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') },
      })),
    });
  }

  return JSON.stringify({ '@context': 'https://schema.org', '@graph': blocks });
}

// ── 전체 문서 ──
export function page({
  url,
  title,
  description,
  current,
  breadcrumb = [],
  faqs = [],
  body,
  noindex = false,
  imageAlt,
  seed,
}) {
  // 디스크립션 80자 이내 보장
  let desc = (description || SITE.tagline).trim();
  if (desc.length > 80) desc = desc.slice(0, 79).trimEnd() + '…';

  const canonical = abs(url);
  const ogImage = abs(url) + 'thumb.svg';
  const ld = schemaBlocks({ url, title, description: desc, breadcrumb, faqs, imageAlt });

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<link rel="canonical" href="${canonical}">
<meta name="author" content="수도권 방문형 서비스 지역 안내팀">
<meta name="theme-color" content="#FF8C1A">
<meta name="format-detection" content="telephone=yes">
<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="ko_KR">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="560">
<meta property="og:image:height" content="460">
<meta property="og:image:alt" content="${esc(imageAlt || title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${ogImage}">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/style.css">
<script type="application/ld+json">${ld}</script>
</head>
<body>
<a class="skip-link" href="#main">본문 바로가기</a>
${header(current)}
<main id="main">
${body}
</main>
${footer()}
</body>
</html>`;
}

// 페이지별 썸네일 SVG 파일 콘텐츠
export function thumbFile(seed, label) {
  return thumbSVG(seed, label);
}
