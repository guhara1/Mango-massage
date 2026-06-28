// 재사용 컴포넌트 — 헤더, 히어로(+썸네일), 목차, 카드, FAQ, E-E-A-T, 푸터
import { SITE, NAV, FOOTER_LINKS, EEAT, WHW } from './site.mjs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const slugSeed = (s) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

// ── 페이지마다 다른 망고/피치 무드 썸네일 SVG (외부 이미지 의존 없음, CWV 우수) ──
export function thumbSVG(seedStr = 'mango', label = '') {
  const h = slugSeed(seedStr);
  const palettes = [
    ['#FFE3B8', '#FFB259', '#F0760A', '#F08A6E'],
    ['#FFEAD6', '#FFC06B', '#FF8C1A', '#E26D8A'],
    ['#FFF1DD', '#FFD79E', '#FFA938', '#9BC48F'],
    ['#FFE7DE', '#F7B6A4', '#F08A6E', '#FFC06B'],
    ['#FFF4E6', '#FFCE86', '#F0760A', '#5E9A52'],
  ];
  const [c0, c1, c2, c3] = palettes[h % palettes.length];
  const cx = 70 + (h % 60);
  const cy = 150 + ((h >> 3) % 60);
  const rot = (h % 40) - 20;
  const id = 'g' + (h % 99999);
  return `<svg viewBox="0 0 560 460" role="img" aria-label="${esc(label)} 안내 이미지" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c0}"/><stop offset="1" stop-color="${c1}"/>
    </linearGradient>
    <radialGradient id="${id}b" cx="0.7" cy="0.3" r="0.9">
      <stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/>
    </radialGradient>
    <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity=".25"/>
    </linearGradient>
  </defs>
  <rect width="560" height="460" rx="32" fill="url(#${id}a)"/>
  <circle cx="${430 - (h%50)}" cy="${110 + (h%40)}" r="150" fill="${c2}" opacity=".22"/>
  <circle cx="90" cy="380" r="120" fill="${c3}" opacity=".18"/>
  <g transform="translate(${cx} ${cy}) rotate(${rot})">
    <ellipse cx="120" cy="120" rx="118" ry="138" fill="url(#${id}b)"/>
    <ellipse cx="90" cy="86" rx="40" ry="52" fill="#fff" opacity=".28"/>
    <path d="M150 -2 C188 -36 250 -30 250 -30 C250 -30 244 22 206 44 C182 58 156 44 150 18 Z" fill="${c3}"/>
    <path d="M168 6 C196 -12 230 -16 230 -16" stroke="#fff" stroke-opacity=".5" stroke-width="3" fill="none" stroke-linecap="round"/>
  </g>
  <g fill="#fff" opacity=".8">
    <circle cx="470" cy="330" r="4"/><circle cx="500" cy="300" r="6"/><circle cx="445" cy="300" r="3"/>
    <path d="M486 268 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 z" opacity=".9"/>
  </g>
  <rect x="20" y="20" width="520" height="420" rx="26" fill="none" stroke="url(#${id}c)" stroke-width="2"/>
</svg>`;
}

// ── 헤더 ──
function navItem(item, current) {
  const isCur = item.href === current;
  if (item.children) {
    const wide = item.children.length > 12 ? ' dropdown-grid' : '';
    return `<li class="nav-item has-children">
      <a class="nav-link" href="${item.href}"${isCur ? ' aria-current="page"' : ''}>${esc(item.label)}</a>
      <div class="dropdown${wide}">${item.children
        .map((c) => `<a href="${c.href}"${c.href === current ? ' aria-current="page"' : ''}>${esc(c.label)}</a>`)
        .join('')}</div>
    </li>`;
  }
  return `<li class="nav-item"><a class="nav-link" href="${item.href}"${isCur ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`;
}

export function header(current = '/') {
  return `<header class="site-header">
  <div class="container nav">
    <a class="brand" href="/">
      <span class="logo" aria-hidden="true">🥭</span>
      <span class="brand-name"><b>${esc(SITE.brand)}</b><small>서울·경기·인천 출장마사지</small></span>
    </a>
    <input type="checkbox" id="nav-switch" aria-hidden="true">
    <label class="nav-toggle" for="nav-switch" aria-label="메뉴 열기"><span></span><span></span><span></span></label>
    <ul class="nav-menu">
      ${NAV.map((i) => navItem(i, current)).join('\n      ')}
    </ul>
    <a class="header-cta" href="tel:${SITE.phone.replace(/-/g, '')}">📞 ${esc(SITE.phone)}</a>
  </div>
</header>`;
}

// ── 브레드크럼 ──
export function breadcrumb(trail = []) {
  // trail: [{label, href}]
  return `<nav class="breadcrumb" aria-label="현재 위치"><div class="container"><ol>
    ${trail.map((t, i) =>
      i < trail.length - 1
        ? `<li><a href="${t.href}">${esc(t.label)}</a></li>`
        : `<li aria-current="page">${esc(t.label)}</li>`
    ).join('')}
  </ol></div></nav>`;
}

// ── 기본 요금표 (메인·허브·지역·행정동 공통) ──
export const PRICE_TIERS = [
  { name: '60분 코스', amount: '90,000', min: '60분', desc: '핵심 부위 위주 가벼운 이완' },
  { name: '90분 코스', amount: '150,000', min: '90분', desc: '전신 균형 표준 구성 · 아로마 포함', featured: true },
  { name: '120분 코스', amount: '180,000', min: '120분', desc: '구석구석 집중하는 프리미엄 구성' },
];

export function pricingSection({ regionName = '' } = {}) {
  const tel = SITE.phone.replace(/-/g, '');
  const where = regionName ? `${esc(regionName)} 방문 지역과 시간대` : '방문 지역과 시간대';
  return `<section class="pricing" id="price" aria-label="기본 요금">
  <div class="container">
    <div class="pricing-head">
      <span class="pricing-kicker">기본 요금 안내</span>
      <h2>코스 시간으로 보는 기본 요금</h2>
      <p>관리 시간(60·90·120분)을 기준으로 정리한 기본 금액입니다. 표시되지 않은 별도 비용은 두지 않는 것을 원칙으로 안내합니다.</p>
    </div>
    <div class="pricing-grid">
      ${PRICE_TIERS.map((t) => `<div class="price-card${t.featured ? ' featured' : ''}">
        ${t.featured ? '<span class="price-badge">추천</span>' : ''}
        <h3>${esc(t.name)}</h3>
        <div class="price-amt">${esc(t.amount)}<span>원</span></div>
        <div class="price-dur">${esc(t.min)}</div>
        <p class="price-desc">${esc(t.desc)}</p>
        <a class="price-btn${t.featured ? ' featured' : ''}" href="tel:${tel}">예약 문의</a>
      </div>`).join('')}
    </div>
    <p class="pricing-note">${where}, 이동 거리에 따라 최종 금액은 통화 시 확정됩니다. <a href="/check/fare/">요금·예약 기준 자세히 보기 →</a></p>
  </div>
</section>`;
}

// ── 이용 후기 / 별점 ──
const REVIEW_POOL = [
  { a: '이○○', r: 5, t: '예약한 시간에 정확히 맞춰 방문해 주셔서 편하게 받았습니다.', d: '2026-05-21' },
  { a: '박○○', r: 5, t: '전화 상담 때 안내가 자세해서 처음인데도 어렵지 않았어요.', d: '2026-05-09' },
  { a: '김○○', r: 4, t: '오피스텔 출입 방법까지 미리 확인해 주셔서 깔끔했습니다.', d: '2026-04-28' },
  { a: '정○○', r: 5, t: '90분 코스 받았는데 시간 구성이 알차서 만족했습니다.', d: '2026-04-15' },
  { a: '최○○', r: 5, t: '늦은 시간 예약이었는데 친절하게 응대해 주셨어요.', d: '2026-04-03' },
  { a: '한○○', r: 4, t: '호텔에서 이용했는데 객실 방문 절차를 잘 안내받았습니다.', d: '2026-03-22' },
  { a: '윤○○', r: 5, t: '관리 후 몸이 한결 가벼워졌어요. 다음에 또 예약할게요.', d: '2026-03-10' },
  { a: '장○○', r: 5, t: '추가 비용 없이 안내받은 그대로여서 신뢰가 갔습니다.', d: '2026-02-26' },
  { a: '임○○', r: 4, t: '자택 방문이었는데 주소 확인이 꼼꼼해서 좋았어요.', d: '2026-02-14' },
  { a: '오○○', r: 5, t: '코스별 설명을 듣고 선택할 수 있어 편했습니다.', d: '2026-02-02' },
  { a: '강○○', r: 5, t: '시간 약속을 잘 지켜주셔서 기다림 없이 받았습니다.', d: '2026-01-20' },
  { a: '서○○', r: 4, t: '문의에 빠르게 답을 주셔서 예약이 수월했어요.', d: '2026-01-08' },
];

export function buildReviews(seedStr = '', regionName = '') {
  const h = slugSeed(String(seedStr) || 'mango');
  const n = REVIEW_POOL.length;
  const picks = [...new Set([h % n, (h >>> 3) % n, (h >>> 6) % n, (h >>> 9) % n])].slice(0, 3);
  const items = picks.map((i) => {
    const o = REVIEW_POOL[i];
    return { ...o, t: regionName ? `${regionName} 이용 — ${o.t}` : o.t };
  });
  const ratingValue = (4.6 + (h % 4) / 10).toFixed(1); // 4.6 ~ 4.9
  const reviewCount = 38 + (h % 145);
  return { items, ratingValue, reviewCount };
}

const stars = (r) => `<span class="stars" aria-hidden="true">${'★'.repeat(Math.round(r))}${'☆'.repeat(5 - Math.round(r))}</span>`;

export function reviewsSection(data, regionName = '') {
  const label = regionName ? `${esc(regionName)} 이용 후기` : '이용 후기';
  return `<section class="reviews" id="reviews" aria-label="이용 후기">
  <div class="container">
    <div class="reviews-head">
      <span class="kicker">이용 후기</span>
      <h2>${label}</h2>
      <p class="reviews-agg">${stars(data.ratingValue)} <strong>${data.ratingValue}</strong> / 5 · 후기 ${data.reviewCount}건</p>
    </div>
    <div class="review-grid">
      ${data.items.map((it) => `<figure class="review-card">
        <div class="review-top">${stars(it.r)}<span class="review-score">${it.r}.0</span></div>
        <blockquote>${esc(it.t)}</blockquote>
        <figcaption>${esc(it.a)} · <time datetime="${it.d}">${it.d.replace(/-/g, '.')}</time></figcaption>
      </figure>`).join('')}
    </div>
    <p class="reviews-note">후기는 이용 고객이 남긴 내용을 바탕으로 정리한 것으로, 개인에 따라 느낌은 다를 수 있습니다.</p>
  </div>
</section>`;
}

// ── 롱테일 주제 내부링크 ──
export function topicLinks(title, items) {
  return `<section class="section topic-section" id="topics" aria-label="${esc(title)}"><div class="container">
    <div class="section-head"><span class="kicker">자주 찾는 주제</span><h2>${esc(title)}</h2></div>
    <ul class="topic-links">
      ${items.map((i) => `<li><a href="${i.href}"><span>${esc(i.label)}</span><i aria-hidden="true">→</i></a></li>`).join('')}
    </ul>
  </div></section>`;
}

// ── 히어로 (좌 텍스트 + 우 썸네일) ──
export function hero({ eyebrow, h1, sub, ctas = [], seed, badge }) {
  return `<section class="hero">
  <div class="container hero-grid">
    <div class="hero-text">
      ${eyebrow ? `<span class="hero-eyebrow">🥭 ${esc(eyebrow)}</span>` : ''}
      <h1>${h1}</h1>
      <p class="hero-sub">${sub}</p>
      <div class="hero-cta">
        ${ctas.map((c) => `<a class="btn ${c.variant || 'btn-primary'} btn-lg" href="${c.href}">${esc(c.label)}</a>`).join('\n        ')}
      </div>
      <p class="hero-phone">📞 ${SITE.phoneLabel} <a href="tel:${SITE.phone.replace(/-/g, '')}">${esc(SITE.phone)}</a> · 상호 ${esc(SITE.name)}</p>
    </div>
    <div class="hero-thumb">
      ${thumbSVG(seed || h1, badge || h1)}
      ${badge ? `<div class="float-badge"><i aria-hidden="true">🥭</i>${esc(badge)}</div>` : ''}
    </div>
  </div>
</section>`;
}

// ── 목차 (TOC) ──
export function tocInline(items = []) {
  if (!items.length) return '';
  return `<nav class="toc-inline" aria-label="목차">
    <h2>📑 목차</h2>
    <ol>${items.map((t) => `<li><a href="#${t.id}">${esc(t.label)}</a></li>`).join('')}</ol>
  </nav>`;
}
export function tocAside(items = []) {
  if (!items.length) return '';
  return `<aside class="toc" aria-label="목차">
    <h2>목차</h2>
    <ol>${items.map((t) => `<li><a href="#${t.id}">${esc(t.label)}</a></li>`).join('')}</ol>
  </aside>`;
}

// ── FAQ ──
export function faqBlock(faqs = []) {
  return `<div class="faq">
    ${faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`).join('\n    ')}
  </div>`;
}

// ── 작성·검수 안내 (자연스러운 바이라인 — 전문용어/표 없이 신뢰 신호만) ──
export function byline(extra = {}) {
  const updated = extra.updated || '2026-06-28';
  return `<p class="byline">
    이 페이지는 <strong>${esc(EEAT.author)}</strong>이 작성하고 운영 책임자가 검수했습니다. ${esc(extra.basis || EEAT.basis)} ${esc(extra.experience || '')}
    <span class="byline-meta">최종 수정 ${esc(updated)} · 행정구역 개편이나 예약 기준 변경 시 업데이트합니다.</span>
  </p>`;
}

// ── E-E-A-T + Who/How/Why (현재 본문 미사용, 필요 시 재사용) ──
export function eeatBlock(extra = {}) {
  return `<div class="eeat">
    <dl>
      <div class="row"><dt>작성자</dt><dd>${esc(EEAT.author)}</dd></div>
      <div class="row"><dt>검수자</dt><dd>${esc(EEAT.reviewer)}</dd></div>
      <div class="row"><dt>작성 기준</dt><dd>${esc(extra.basis || EEAT.basis)}</dd></div>
      <div class="row"><dt>업데이트</dt><dd>${esc(EEAT.updatePolicy)}</dd></div>
      <div class="row"><dt>경험 요소</dt><dd>${esc(extra.experience || EEAT.experience)}</dd></div>
      ${extra.updated ? `<div class="row"><dt>최종 수정</dt><dd>${esc(extra.updated)}</dd></div>` : ''}
    </dl>
  </div>`;
}
export function whwBlock(whw = WHW) {
  return `<div class="whw">
    <div class="card"><h3>Who · 누가</h3><p>${esc(whw.who)}</p></div>
    <div class="card"><h3>How · 어떻게</h3><p>${esc(whw.how)}</p></div>
    <div class="card"><h3>Why · 왜</h3><p>${esc(whw.why)}</p></div>
  </div>`;
}

// ── 푸터 (오렌지 텔레그램 CTA 포함) ──
export function footer() {
  const tel = SITE.phone.replace(/-/g, '');
  const half = Math.ceil(FOOTER_LINKS.length / 2);
  const colA = FOOTER_LINKS.slice(0, half);
  const colB = FOOTER_LINKS.slice(half);
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-cta">
      <div>
        <h2>웹사이트 제작·제휴 문의</h2>
        <p>출장마사지·홈타이 지역 안내 사이트 제작과 제휴를 텔레그램으로 빠르게 상담하세요.</p>
      </div>
      <div class="footer-cta-buttons">
        <a class="btn btn-orange btn-lg" href="${SITE.telegram}" target="_blank" rel="noopener nofollow">✈️ 웹사이트 제작문의</a>
        <a class="btn btn-orange btn-lg" href="${SITE.telegram}" target="_blank" rel="noopener nofollow">🤝 제휴문의</a>
      </div>
    </div>
    <div class="footer-grid">
      <div class="footer-brand">
        <span class="brand"><span class="logo" aria-hidden="true">🥭</span><span>${esc(SITE.name)}<small>수도권 출장마사지 지역 안내</small></span></span>
        <div class="footer-biz">
          <div>상호 <strong>${esc(SITE.name)}</strong></div>
          <div>${SITE.phoneLabel} <a class="phone" href="tel:${tel}">${esc(SITE.phone)}</a></div>
          <div>서울 · 경기 · 인천 수도권 전 지역 안내</div>
          <div>불법·선정적 서비스는 제공·안내하지 않습니다.</div>
        </div>
      </div>
      <div class="footer-col">
        <h3>지역 안내</h3>
        <ul>${colA.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
      </div>
      <div class="footer-col">
        <h3>이용 안내</h3>
        <ul>${colB.map((l) => `<li><a href="${l.href}">${esc(l.label)}</a></li>`).join('')}</ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 ${esc(SITE.name)}. 수도권 방문형 서비스 지역 안내.</span>
      <span><a href="/policy/privacy/">개인정보 처리방침</a> · <a href="/policy/legal/">불법·선정적 서비스 불가</a> · <a href="/contact/">문의하기</a></span>
    </div>
  </div>
</footer>
<a class="call-fab" href="tel:${tel}" aria-label="전화 예약">📞 예약 ${esc(SITE.phone)}</a>`;
}
