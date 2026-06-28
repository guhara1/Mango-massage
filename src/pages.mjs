// 모든 페이지 본문 + 메타데이터 빌더
import { SITE } from './site.mjs';
import { hero, breadcrumb, esc, pricingSection } from './components.mjs';
import {
  article, COMMON_FAQ, RESERVE_CHECKLIST, checklistHtml,
  operatingBlock, trustBlock, relatedBlock,
} from './blocks.mjs';
import { SEOUL, GYEONGGI, INCHEON, USE_CASES, CHECKS } from './data.mjs';

const A = SITE.authority;
const crumbHome = { label: '수도권 홈', href: '/' };

const PROVINCE = {
  seoul: { name: '서울', href: '/seoul/', regions: SEOUL, label: '구', sib: '구' },
  gyeonggi: { name: '경기', href: '/gyeonggi/', regions: GYEONGGI, label: '시', sib: '시군' },
  incheon: { name: '인천', href: '/incheon/', regions: INCHEON, label: '구', sib: '구군' },
};

// 번호동을 대표 1개로 통합 + 중복 제거 (모듈 공용)
const normDongList = (list) =>
  [...new Set((list || []).map((d) => d.replace(/^([가-힣]+?)\d+동$/, '$1동')))];

// ─────────────────────────────────────────────────────────
// 지역(구/시군) 상세 페이지
// ─────────────────────────────────────────────────────────
function regionPage(provKey, r) {
  const prov = PROVINCE[provKey];
  const url = `${prov.href}${r.slug}/`;
  const title = `${r.name} 출장마사지 · 생활권별 예약 안내｜${SITE.name}`;
  const description = `${r.name} 출장마사지·홈타이 예약 전 생활권, 지하철역, 자택·호텔·오피스텔 이용 기준을 안내합니다.`;
  const siblings = prov.regions.filter((x) => x.slug !== r.slug).slice(0, 6);

  const toc = [
    { id: 'overview', label: `${r.name} 개요` },
    { id: 'price', label: '기본 요금' },
    { id: 'life', label: '대표 생활권' },
    { id: 'dong', label: '행정동 전체' },
    { id: 'stations', label: '가까운 지하철역' },
    { id: 'use', label: '이용 장소별 기준' },
    { id: 'reserve', label: '예약 전 체크리스트' },
    { id: 'operating', label: '운영 기준' },
    { id: 'faq', label: '자주 묻는 질문' },
    { id: 'trust', label: '작성·검수 안내' },
    { id: 'related', label: '관련 지역' },
  ];

  // 번호동 안전 통합: '가양1동'·'동탄2동' 등 → 대표 1개. ('종로1가동' 등 가동 형태는 보존)
  const normDongs = (list) => [...new Set((list || []).map((d) => d.replace(/^([가-힣]+?)\d+동$/, '$1동')))];
  // 행정동 칩을 클릭 가능한 링크로 (개별 행정동 페이지로 연결)
  const dongChips = (base, list) =>
    `<div class="chips" style="margin-bottom:1em">${normDongs(list)
      .map((d) => `<a class="chip" href="${base}${encodeURI(d)}/">${esc(d)}</a>`).join('')}</div>`;

  // 일반구가 있으면 구 페이지로 링크 + 구별 행정동, 없으면 동 목록
  const hasGu = r.districts && r.districts.length;
  const dongBody = hasGu
    ? r.districts.map((d) => {
        const guBase = `${url}${encodeURI(d.name)}/`;
        return `<h3><a href="${guBase}">${esc(d.name)} 안내 →</a></h3>${dongChips(guBase, d.dongs)}`;
      }).join('')
    : dongChips(url, r.dongs || []);

  const dongCount = hasGu
    ? r.districts.reduce((n, d) => n + normDongs(d.dongs).length, 0)
    : normDongs(r.dongs).length;

  const inner = `
    <h2 id="overview">${r.name} 출장마사지 지역 개요</h2>
    <p>${esc(r.overview)}</p>
    <p><strong>${esc(r.name)}의 특징</strong> — ${esc(r.character)} 대표 권역은 ${esc(r.landmarks)} 일대로, 같은 ${r.name} 안에서도 행정동과 이용 장소에 따라 확인할 내용이 달라집니다. ${r.name} 출장마사지·홈타이 예약 전에는 방문 지역의 생활권과 가까운 역, 건물 형태를 먼저 확인하는 것이 좋습니다.</p>

    <h2 id="life">${r.name} 대표 생활권</h2>
    <p>${r.name}은 아래 생활권을 중심으로 안내합니다. 생활권마다 건물 형태와 출입 방식이 다르므로, 가까운 생활권을 먼저 확인한 뒤 예약하는 것을 권장합니다.</p>
    <div class="chips" style="margin-bottom:1em">
      ${r.lifeAreas.map((l) => `<span class="chip">${esc(l)}</span>`).join('')}
    </div>
    <p>각 생활권은 <a href="${prov.href}life/">${prov.name} 생활권 안내</a>에서 더 자세히 비교할 수 있습니다.</p>

    <h2 id="dong">${r.name} 행정동 전체 안내</h2>
    <p>${r.name}의 행정동을 대표 지역명 기준으로 정리했습니다(총 ${dongCount}곳). ${hasGu ? '<strong>일반구 이름</strong>을 누르면 해당 구 안내로, <strong>동 이름</strong>을 누르면 행정동별 안내로 이동합니다. ' : '<strong>동 이름</strong>을 누르면 해당 행정동 안내로 이동합니다. '}같은 이름의 번호동(예: ○○1동·○○2동)은 대표 동 하나로 묶어 안내하며, 출구별·번호동별 페이지는 따로 만들지 않습니다. 방문 예약 시에는 아래 동 이름과 함께 정확한 도로명 주소·동·호수를 알려주시면 안내가 빠릅니다.</p>
    ${dongBody}
    <p>각 동은 인접 생활권·역세권과 함께 확인하는 것이 좋습니다. ${r.name}의 생활권은 <a href="${prov.href}life/">${prov.name} 생활권 안내</a>, 가까운 역은 <a href="${prov.href}station/">${prov.name} 지하철역 안내</a>, 이용 장소별 기준은 <a href="/use/">이용 장소 안내</a>에서 확인하세요.</p>

    <h2 id="stations">가까운 지하철역</h2>
    <p>${r.name}의 주요 역세권은 다음과 같습니다. 출구 번호보다 정확한 건물명과 도로명 주소로 안내하면 방문이 원활합니다.</p>
    <div class="chips" style="margin-bottom:1em">
      ${r.stations.map((s) => `<span class="chip">🚉 ${esc(s)}</span>`).join('')}
    </div>
    <p>역세권 이용 기준은 <a href="/use/station-area/">역세권 이용 안내</a>에서 확인하세요.</p>

    <h2 id="use">이용 장소별 확인 기준</h2>
    <p>${esc(r.useFlavor)}</p>
    <ul>
      <li><strong>자택</strong> — 도로명 주소·동·호수와 공동현관 출입 방식을 확인합니다. <a href="/use/home/">자택 이용 안내</a></li>
      <li><strong>호텔·숙소</strong> — 숙소의 외부인 객실 방문 정책을 먼저 확인합니다. <a href="/use/hotel/">호텔·숙소 이용 안내</a></li>
      <li><strong>오피스텔</strong> — 공동현관·관리 규정·방문 가능 시간대를 확인합니다. <a href="/use/officetel/">오피스텔 이용 안내</a></li>
      <li><strong>업무지구</strong> — 로비 방문 등록과 야간 출입 통제를 확인합니다. <a href="/use/business/">업무지구 이용 안내</a></li>
      ${r.outskirts ? `<li><strong>외곽 이동</strong> — ${esc(r.outskirts)} <a href="/use/outskirts/">외곽 지역 이용 안내</a></li>` : ''}
    </ul>

    <h2 id="reserve">예약 전 체크리스트</h2>
    <p>${r.name} 방문 예약 전 아래 내용을 확인하면 방문이 원활합니다.</p>
    ${checklistHtml(RESERVE_CHECKLIST)}
    <p style="margin-top:1em">항목별 자세한 기준은 <a href="/check/">예약 전 확인</a>에서 볼 수 있습니다. 더 궁금한 점은 <a href="tel:${SITE.phone.replace(/-/g, '')}">${SITE.phone}</a>로 문의하세요.</p>

    ${operatingBlock()}

    <h2 id="faq">${r.name} 자주 묻는 질문</h2>
    ${faqHtml(COMMON_FAQ)}

    ${trustBlock({ experience: `${r.name}의 생활권 차이, 외곽 이동 여부, 자택·숙소·오피스텔 이용 시 확인 기준을 반영합니다.` })}

    ${relatedBlock(`${prov.name} 관련 지역 바로가기`, [
      { label: `${prov.name} 전체`, href: prov.href },
      ...siblings.map((s) => ({ label: s.name, href: `${prov.href}${s.slug}/` })),
      { label: `${prov.name} 생활권`, href: `${prov.href}life/` },
      { label: '예약 전 확인', href: '/check/' },
    ])}
    <p style="margin-top:1em;color:var(--ink-500);font-size:14px">참고: ${A.privacy.label}(<a href="${A.privacy.url}" target="_blank" rel="noopener nofollow">개인정보 보호</a>), ${A.kca.label}(<a href="${A.kca.url}" target="_blank" rel="noopener nofollow">소비자 안내</a>)</p>
  `;

  return {
    url, title, description, current: prov.href, noindex: false,
    imageAlt: `${r.name} 생활권 방문형 관리 안내 이미지`,
    breadcrumb: [crumbHome, { label: prov.name, href: prov.href }, { label: r.name, href: url }],
    faqs: COMMON_FAQ,
    body:
      breadcrumb([crumbHome, { label: prov.name, href: prov.href }, { label: r.name, href: url }]) +
      hero({
        eyebrow: `${prov.name} · ${r.focus}`,
        h1: `${r.name} 출장마사지 · 생활권별 예약 안내`,
        sub: `${esc(r.character)} 자택·호텔·오피스텔·업무지구 이용 기준과 예약 전 확인사항을 한 곳에서 확인하세요.`,
        ctas: [
          { label: '전화 예약', href: `tel:${SITE.phone.replace(/-/g, '')}`, variant: 'btn-primary' },
          { label: '예약 전 확인', href: '/check/', variant: 'btn-ghost' },
        ],
        seed: r.slug + provKey,
        badge: `${r.name} 안내`,
      }) +
      pricingSection({ regionName: r.name }) +
      article({ toc, inner }),
  };
}

// FAQ HTML (blocks의 faqBlock 재사용 대신 인라인)
function faqHtml(faqs) {
  return `<div class="faq">${faqs
    .map((f) => `<details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`)
    .join('')}</div>`;
}

const dongChipsLinked = (base, list) =>
  `<div class="chips" style="margin-bottom:1em">${normDongList(list)
    .map((d) => `<a class="chip" href="${base}${encodeURI(d)}/">${esc(d)}</a>`).join('')}</div>`;

// ─────────────────────────────────────────────────────────
// 일반구 페이지 (경기 행정구: 수원 장안구 등)
// ─────────────────────────────────────────────────────────
function generalGuPage(provKey, city, district) {
  const prov = PROVINCE[provKey];
  const cityUrl = `${prov.href}${city.slug}/`;
  const url = `${cityUrl}${district.name}/`;
  const dongs = normDongList(district.dongs);
  const siblingGu = city.districts.filter((d) => d.name !== district.name);
  const toc = [
    { id: 'overview', label: `${district.name} 개요` },
    { id: 'price', label: '기본 요금' },
    { id: 'dong', label: '행정동 안내' },
    { id: 'use', label: '이용 장소별 기준' },
    { id: 'reserve', label: '예약 전 체크리스트' },
    { id: 'operating', label: '운영 기준' },
    { id: 'faq', label: '자주 묻는 질문' },
    { id: 'trust', label: '작성·검수 안내' },
    { id: 'related', label: '관련 지역' },
  ];
  const inner = `
    <h2 id="overview">${city.name} ${district.name} 지역 개요</h2>
    <p>${district.name}은 ${city.name}에 속한 행정구입니다. ${esc(city.character)} ${district.name} 일대도 같은 ${city.name} 생활권 안에서 행정동과 이용 장소에 따라 방문 전 확인할 내용이 달라집니다.</p>
    <p>${city.name} ${district.name} 출장마사지·홈타이 예약 전에는 방문할 행정동, 가까운 역, 건물 형태(자택·오피스텔·숙소)를 먼저 확인하면 안내가 빠릅니다. ${city.name} 전체 안내는 <a href="${cityUrl}">${city.name} 안내</a>에서 볼 수 있습니다.</p>

    <h2 id="dong">${district.name} 행정동 안내</h2>
    <p>${district.name}의 행정동을 대표 지역명 기준으로 정리했습니다(총 ${dongs.length}곳). 동 이름을 누르면 해당 행정동 안내로 이동합니다. 번호동은 대표 동 하나로 묶어 안내합니다.</p>
    ${dongChipsLinked(url, district.dongs)}
    <p>가까운 생활권은 <a href="${prov.href}life/">${prov.name} 생활권 안내</a>, 가까운 역은 <a href="${prov.href}station/">${prov.name} 지하철역 안내</a>에서 확인하세요.</p>

    <h2 id="use">이용 장소별 확인 기준</h2>
    <p>${esc(city.useFlavor)}</p>
    <ul>
      <li><strong>자택</strong> — 도로명 주소·동·호수와 공동현관 출입 방식 확인. <a href="/use/home/">자택 이용 안내</a></li>
      <li><strong>호텔·숙소</strong> — 숙소의 외부인 객실 방문 정책 확인. <a href="/use/hotel/">호텔·숙소 이용 안내</a></li>
      <li><strong>오피스텔</strong> — 공동현관·관리 규정·방문 시간대 확인. <a href="/use/officetel/">오피스텔 이용 안내</a></li>
      ${city.outskirts ? `<li><strong>외곽 이동</strong> — ${esc(city.outskirts)} <a href="/use/outskirts/">외곽 지역 이용 안내</a></li>` : ''}
    </ul>

    <h2 id="reserve">예약 전 체크리스트</h2>
    ${checklistHtml(RESERVE_CHECKLIST)}
    <p style="margin-top:1em">전화 예약·문의 <a href="tel:${SITE.phone.replace(/-/g, '')}">${SITE.phone}</a></p>

    ${operatingBlock()}

    <h2 id="faq">${district.name} 자주 묻는 질문</h2>
    ${faqHtml(COMMON_FAQ)}

    ${trustBlock({ experience: `${city.name} ${district.name}의 생활권 차이와 자택·숙소·오피스텔 이용 시 확인 기준을 반영합니다.` })}

    ${relatedBlock(`${city.name} 관련 지역`, [
      { label: `${city.name} 전체`, href: cityUrl },
      ...siblingGu.map((d) => ({ label: d.name, href: `${cityUrl}${d.name}/` })),
      { label: `${prov.name} 생활권`, href: `${prov.href}life/` },
      { label: '예약 전 확인', href: '/check/' },
    ])}
  `;
  return {
    url, current: prov.href, noindex: false,
    title: `${city.name} ${district.name} 출장마사지 · 예약 안내｜${SITE.name}`,
    description: `${city.name} ${district.name} 출장마사지·홈타이 예약 전 행정동과 이용 기준을 안내합니다.`,
    imageAlt: `${city.name} ${district.name} 방문형 관리 안내 이미지`,
    breadcrumb: [crumbHome, { label: prov.name, href: prov.href }, { label: city.name, href: cityUrl }, { label: district.name, href: url }],
    faqs: COMMON_FAQ,
    body:
      breadcrumb([crumbHome, { label: prov.name, href: prov.href }, { label: city.name, href: cityUrl }, { label: district.name, href: url }]) +
      hero({
        eyebrow: `${prov.name} ${city.name} · 행정구`,
        h1: `${district.name} 출장마사지 · 예약 안내`,
        sub: `${city.name} ${district.name}의 행정동, 가까운 역, 자택·오피스텔·숙소 이용 기준을 확인하세요.`,
        ctas: [{ label: '전화 예약', href: `tel:${SITE.phone.replace(/-/g, '')}` }, { label: '예약 전 확인', href: '/check/', variant: 'btn-ghost' }],
        seed: city.slug + district.name, badge: `${district.name} 안내`,
      }) +
      pricingSection({ regionName: `${city.name} ${district.name}` }) +
      article({ toc, inner }),
  };
}

// ─────────────────────────────────────────────────────────
// 행정동 페이지 (개별 동 — 클릭 가능, noindex)
// ─────────────────────────────────────────────────────────
function dongPage(provKey, region, dongName, parentLabel, base, siblingDongs) {
  const prov = PROVINCE[provKey];
  const url = `${base}${dongName}/`;
  const parentUrl = base; // 상위(구/시 또는 일반구) URL
  const where = parentLabel ? `${region.name} ${parentLabel}` : region.name;
  const sibs = normDongList(siblingDongs).filter((d) => d !== dongName).slice(0, 14);
  const toc = [
    { id: 'overview', label: `${dongName} 개요` },
    { id: 'price', label: '기본 요금' },
    { id: 'area', label: '생활권·가까운 역' },
    { id: 'use', label: '이용 장소별 기준' },
    { id: 'reserve', label: '예약 전 체크리스트' },
    { id: 'operating', label: '운영 기준' },
    { id: 'faq', label: '자주 묻는 질문' },
    { id: 'trust', label: '작성·검수 안내' },
    { id: 'related', label: '관련 지역' },
  ];
  const inner = `
    <h2 id="overview">${dongName} 출장마사지 지역 개요</h2>
    <p>${dongName}은 ${where}에 속한 행정동입니다. ${esc(region.character)} ${dongName}에서 방문 예약을 진행할 때도 정확한 도로명 주소와 동·호수, 공동현관 출입 방식을 먼저 확인하면 안내가 빠릅니다.</p>
    <p>${dongName} 출장마사지·홈타이는 자택, 오피스텔, 호텔·숙소 등 이용 장소에 따라 확인할 내용이 다릅니다. ${region.name} 전체 안내는 <a href="${prov.href}${region.slug}/">${region.name} 안내</a>${parentLabel ? `, ${parentLabel} 안내는 <a href="${parentUrl}">${parentLabel} 안내</a>` : ''}에서 볼 수 있습니다.</p>

    <h2 id="area">${dongName} 생활권·가까운 역</h2>
    <p>${dongName}과 인접한 ${region.name}의 대표 생활권과 주요 역은 다음과 같습니다. 가까운 생활권을 기준으로 방문 동선을 확인하세요.</p>
    <div class="chips" style="margin-bottom:1em">
      ${region.lifeAreas.map((l) => `<span class="chip">${esc(l)}</span>`).join('')}
      ${region.stations.map((s) => `<span class="chip">🚉 ${esc(s)}</span>`).join('')}
    </div>
    <p>생활권 비교는 <a href="${prov.href}life/">${prov.name} 생활권 안내</a>, 역세권 기준은 <a href="/use/station-area/">역세권 이용 안내</a>를 참고하세요.</p>

    <h2 id="use">${dongName} 이용 장소별 기준</h2>
    <p>${esc(region.useFlavor)}</p>
    <ul>
      <li><strong>자택</strong> — <a href="/use/home/">자택 이용 안내</a></li>
      <li><strong>호텔·숙소</strong> — <a href="/use/hotel/">호텔·숙소 이용 안내</a></li>
      <li><strong>오피스텔</strong> — <a href="/use/officetel/">오피스텔 이용 안내</a></li>
      <li><strong>업무지구·역세권</strong> — <a href="/use/business/">업무지구 이용</a> · <a href="/use/station-area/">역세권 이용</a></li>
    </ul>

    <h2 id="reserve">예약 전 체크리스트</h2>
    ${checklistHtml(RESERVE_CHECKLIST)}
    <p style="margin-top:1em">전화 예약·문의 <a href="tel:${SITE.phone.replace(/-/g, '')}">${SITE.phone}</a></p>

    ${operatingBlock()}

    <h2 id="faq">${dongName} 자주 묻는 질문</h2>
    ${faqHtml(COMMON_FAQ)}

    ${trustBlock({ experience: `${where} ${dongName}의 이용 환경과 자택·숙소·오피스텔 방문 시 확인 기준을 반영합니다.` })}

    <h2 id="related">${where} 인근 행정동</h2>
    <div class="related"><div class="chips">
      <a class="chip" href="${parentUrl}">${esc(parentLabel || region.name)} 전체</a>
      ${sibs.map((d) => `<a class="chip" href="${base}${encodeURI(d)}/">${esc(d)}</a>`).join('')}
    </div></div>
  `;
  return {
    url, current: prov.href, noindex: true, // 개별 행정동은 색인 부담 방지를 위해 noindex(팔로우)
    title: `${dongName} 출장마사지 · ${region.name} 예약 안내｜${SITE.name}`,
    description: `${dongName}(${where}) 출장마사지·홈타이 예약 전 확인사항과 이용 기준 안내.`,
    imageAlt: `${dongName} 방문형 관리 안내 이미지`,
    breadcrumb: [crumbHome, { label: prov.name, href: prov.href }, { label: region.name, href: `${prov.href}${region.slug}/` }, { label: dongName, href: url }],
    faqs: COMMON_FAQ,
    body:
      breadcrumb([crumbHome, { label: prov.name, href: prov.href }, { label: region.name, href: `${prov.href}${region.slug}/` }, { label: dongName, href: url }]) +
      hero({
        eyebrow: `${where} · 행정동`,
        h1: `${dongName} 출장마사지 · 예약 안내`,
        sub: `${dongName}에서 방문형 관리를 찾을 때 확인할 생활권, 가까운 역, 이용 장소 기준을 안내합니다.`,
        ctas: [{ label: '전화 예약', href: `tel:${SITE.phone.replace(/-/g, '')}` }, { label: '예약 전 확인', href: '/check/', variant: 'btn-ghost' }],
        seed: region.slug + dongName, badge: `${dongName}`,
      }) +
      pricingSection({ regionName: dongName }) +
      article({ toc, inner }),
  };
}

// ─────────────────────────────────────────────────────────
// 시/도 허브 페이지
// ─────────────────────────────────────────────────────────
function provinceHub(provKey, opts) {
  const prov = PROVINCE[provKey];
  const url = prov.href;
  const toc = [
    { id: 'intro', label: `${prov.name} 안내` },
    { id: 'regions', label: `${prov.name} ${prov.sib} 바로가기` },
    { id: 'life', label: '대표 생활권' },
    { id: 'use', label: '이용 장소별 안내' },
    { id: 'reserve', label: '예약 전 체크리스트' },
    { id: 'operating', label: '운영 기준' },
    { id: 'faq', label: '자주 묻는 질문' },
    { id: 'trust', label: '작성·검수 안내' },
    { id: 'related', label: '관련 안내' },
  ];

  const regionCards = prov.regions.map((r) =>
    `<a class="card" href="${prov.href}${r.slug}/">
      <div class="ic" aria-hidden="true">📍</div>
      <h3>${esc(r.name)}</h3>
      <p>${esc(r.focus)} · ${esc(r.lifeAreas.slice(0, 3).join(', '))}</p>
      <div class="more">자세히 보기 →</div>
    </a>`).join('');

  const inner = `
    <h2 id="intro">${prov.name} 출장마사지 안내</h2>
    <p>${opts.intro}</p>
    <p>${opts.intro2}</p>

    <h2 id="regions">${prov.name} ${prov.sib} 바로가기</h2>
    <p>${prov.name}의 주요 ${prov.label}별 안내 페이지입니다. 각 ${prov.label}는 생활권, 역세권, 이용 장소별 기준을 따로 정리했습니다.</p>
    <div class="grid cols-3" style="margin:1em 0">${regionCards}</div>

    <h2 id="life">${prov.name} 대표 생활권</h2>
    <p>${opts.lifeIntro}</p>
    <div class="chips" style="margin:1em 0">
      ${opts.lifeAreas.map((l) => `<span class="chip">${esc(l)}</span>`).join('')}
    </div>
    <p>생활권별 비교는 <a href="${prov.href}life/">${prov.name} 생활권 안내</a>, 역세권은 <a href="${prov.href}station/">${prov.name} 지하철역 안내</a>에서 확인하세요.</p>

    <h2 id="use">이용 장소별 안내</h2>
    <p>같은 ${prov.name}이라도 자택·호텔·오피스텔·업무지구에 따라 확인할 내용이 다릅니다.</p>
    <div class="grid cols-4" style="margin:1em 0">
      ${USE_CASES.slice(0, 8).map((u) =>
        `<a class="card" href="/use/${u.slug}/"><div class="ic" aria-hidden="true">${u.icon}</div><h3>${esc(u.name)}</h3></a>`).join('')}
    </div>

    <h2 id="reserve">예약 전 체크리스트</h2>
    ${checklistHtml(RESERVE_CHECKLIST)}
    <p style="margin-top:1em">전화 예약은 <a href="tel:${SITE.phone.replace(/-/g, '')}">${SITE.phone}</a>로 가능합니다.</p>

    ${operatingBlock()}

    <h2 id="faq">${prov.name} 자주 묻는 질문</h2>
    ${faqHtml(COMMON_FAQ)}

    ${trustBlock({ experience: opts.experience })}

    ${relatedBlock('관련 안내 바로가기', [
      { label: '수도권 홈', href: '/' },
      { label: '서울', href: '/seoul/' },
      { label: '경기', href: '/gyeonggi/' },
      { label: '인천', href: '/incheon/' },
      { label: '이용 장소', href: '/use/' },
      { label: '예약 전 확인', href: '/check/' },
    ])}
  `;

  return {
    url,
    title: `${prov.name} 출장마사지 · ${prov.sib}별 예약 안내｜${SITE.name}`,
    description: opts.desc,
    current: prov.href,
    imageAlt: `${prov.name} 수도권 방문형 관리 지역 안내 이미지`,
    breadcrumb: [crumbHome, { label: prov.name, href: prov.href }],
    faqs: COMMON_FAQ,
    body:
      breadcrumb([crumbHome, { label: prov.name, href: prov.href }]) +
      hero({
        eyebrow: `수도권 · ${prov.name}`,
        h1: opts.h1,
        sub: opts.heroSub,
        ctas: [
          { label: '전화 예약', href: `tel:${SITE.phone.replace(/-/g, '')}`, variant: 'btn-primary' },
          { label: `${prov.name} ${prov.sib} 보기`, href: '#regions', variant: 'btn-ghost' },
        ],
        seed: provKey + 'hub',
        badge: `${prov.name} 지역 안내`,
      }) +
      pricingSection({ regionName: prov.name }) +
      article({ toc, inner }),
  };
}

// ─────────────────────────────────────────────────────────
// 빌드 매니페스트 생성
// ─────────────────────────────────────────────────────────
export function buildManifest() {
  const pages = [];

  // 지역 상세: 시/구(행정시·자치구) → 일반구(행정구) → 행정동
  ['seoul', 'gyeonggi', 'incheon'].forEach((pk) => {
    const base = PROVINCE[pk].href;
    PROVINCE[pk].regions.forEach((r) => {
      pages.push(regionPage(pk, r));
      if (r.districts && r.districts.length) {
        r.districts.forEach((d) => {
          pages.push(generalGuPage(pk, r, d));
          const guBase = `${base}${r.slug}/${d.name}/`;
          normDongList(d.dongs).forEach((dn) =>
            pages.push(dongPage(pk, r, dn, d.name, guBase, d.dongs)));
        });
      } else {
        const regBase = `${base}${r.slug}/`;
        normDongList(r.dongs).forEach((dn) =>
          pages.push(dongPage(pk, r, dn, null, regBase, r.dongs)));
      }
    });
  });

  // 허브
  pages.push(provinceHub('seoul', {
    h1: '서울 출장마사지 · 구별·생활권별 예약 안내',
    desc: '서울 출장마사지·홈타이 예약 전 강남·잠실·홍대·여의도 등 구별·생활권별 확인사항 안내.',
    heroSub: '강남, 잠실, 홍대, 여의도, 성수, 용산 등 서울 주요 구와 생활권, 역세권, 이용 장소 기준을 확인하세요.',
    intro: '서울은 25개 구와 촘촘한 지하철망으로 생활권이 빠르게 연결되는 도시입니다. 이 페이지는 구별로 대표 생활권, 가까운 역, 이용 장소별 확인사항을 정리해 실제 방문에 필요한 정보를 안내합니다.',
    intro2: '지역명만 나열하지 않고, 강남은 업무지구·오피스텔 중심, 잠실·송파는 주거·상권 중심, 홍대·합정은 숙소·상권 중심으로 생활권의 성격이 다르게 작성되어 있습니다.',
    lifeIntro: '서울에서 문의가 많은 대표 생활권은 다음과 같습니다. 같은 구 안에서도 업무·주거·상권 성격이 달라 확인사항이 갈립니다.',
    lifeAreas: ['강남역·역삼', '삼성·선릉', '청담·압구정', '잠실·송파', '홍대·합정', '여의도·영등포', '성수·왕십리', '용산·서울역'],
    experience: '서울 구별 생활권 차이와 업무·주거·상권 성격, 오피스텔·호텔 이용 기준을 반영합니다.',
  }));

  pages.push(provinceHub('gyeonggi', {
    h1: '경기 출장마사지 · 시군별·생활권별 예약 안내',
    desc: '경기 출장마사지·홈타이 예약 전 수원·분당·용인·부천 등 시군별 확인사항 안내.',
    heroSub: '수원, 성남, 용인, 고양, 부천, 안산, 안양 등 경기 주요 시군과 생활권, 외곽 이동 기준을 확인하세요.',
    intro: '경기는 시군 면적이 넓어 같은 도시 안에서도 도심과 신도시, 외곽의 이동 기준이 크게 다릅니다. 이 페이지는 시군별 대표 생활권과 외곽 이동 여부, 추가 이동비 확인 포인트를 정리합니다.',
    intro2: '수원역·인계동 도심권과 광교 신도시, 분당 주거권과 판교 업무권처럼 같은 시 안에서도 성격이 다른 생활권을 구분해 안내합니다.',
    lifeIntro: '경기에서 문의가 많은 대표 생활권입니다. 신도시·업무지구·외곽에 따라 이동 기준이 달라집니다.',
    lifeAreas: ['수원역·인계동', '광교·영통', '분당·판교', '죽전·수지', '동탄신도시', '부천역·상동', '안양·범계·평촌', '일산·킨텍스'],
    experience: '경기 시군의 넓은 면적, 신도시·외곽 이동 거리, 추가 이동비 확인 기준을 반영합니다.',
  }));

  pages.push(provinceHub('incheon', {
    h1: '인천 출장마사지 · 구군별·생활권별 예약 안내',
    desc: '인천 출장마사지·홈타이 예약 전 송도·부평·구월·청라 등 구군별 확인사항 안내.',
    heroSub: '송도, 부평, 구월, 주안, 청라, 검단, 영종 등 인천 주요 구군과 생활권, 공항·도서 이동 기준을 확인하세요.',
    intro: '인천은 원도심, 신도시, 공항, 도서 지역이 함께 있어 같은 시 안에서도 환경이 크게 다릅니다. 이 페이지는 구군별 대표 생활권과 신도시·원도심 여부, 공항·도서 이동 기준을 안내합니다.',
    intro2: '송도 국제업무권, 부평 환승 상권, 구월 행정 중심, 청라·검단 신도시처럼 성격이 다른 생활권을 구분해 정리합니다. 2026년 구 개편 대응 페이지는 개편 이후 단계적으로 공개합니다.',
    lifeIntro: '인천에서 문의가 많은 대표 생활권입니다. 신도시·원도심·공항권에 따라 확인사항이 다릅니다.',
    lifeAreas: ['송도국제도시', '구월·인천시청', '부평역·부평시장', '주안·도화', '청라국제도시', '검단신도시', '영종·운서', '인천공항'],
    experience: '인천의 원도심·신도시·공항·도서 환경 차이와 사전 예약·이동 기준을 반영합니다.',
  }));

  // 이용 장소
  USE_CASES.forEach((u) => pages.push(useCasePage(u)));
  // 예약 전 확인
  CHECKS.forEach((c) => pages.push(checkPage(c)));

  // 정적 단일 페이지
  pages.push(mainPage());
  pages.push(lifeHub());
  pages.push(stationHub());
  pages.push(provinceListPage('seoul', 'life'));
  pages.push(provinceListPage('gyeonggi', 'life'));
  pages.push(provinceListPage('incheon', 'life'));
  pages.push(provinceListPage('seoul', 'station'));
  pages.push(provinceListPage('gyeonggi', 'station'));
  pages.push(provinceListPage('incheon', 'station'));
  pages.push(outskirtsPage('gyeonggi'));
  pages.push(airportIslandsPage());
  pages.push(policyHub());
  pages.push(privacyPage());
  pages.push(legalPage());
  pages.push(checkHub());
  pages.push(useHub());
  pages.push(contactPage());

  return pages;
}

// ─────────────────────────────────────────────────────────
// 이용 장소 페이지
// ─────────────────────────────────────────────────────────
function useCasePage(u) {
  const url = `/use/${u.slug}/`;
  const toc = [
    { id: 'intro', label: '개요' },
    { id: 'check', label: '확인 포인트' },
    { id: 'region', label: '지역별 참고' },
    { id: 'reserve', label: '예약 전 체크리스트' },
    { id: 'operating', label: '운영 기준' },
    { id: 'faq', label: '자주 묻는 질문' },
    { id: 'trust', label: '작성·검수 안내' },
  ];
  const inner = `
    <h2 id="intro">${u.name} 안내</h2>
    <p>${esc(u.overview)}</p>
    <h2 id="check">${u.name} 확인 포인트</h2>
    ${checklistHtml(u.points)}
    <h2 id="region">지역별 참고</h2>
    <p>${u.name}은 지역에 따라 환경이 다릅니다. 서울 업무지구, 경기 신도시, 인천 국제도시 등 생활권 성격에 맞춰 확인하세요.</p>
    <div class="chips" style="margin:1em 0">
      <a class="chip" href="/seoul/">서울 안내</a>
      <a class="chip" href="/gyeonggi/">경기 안내</a>
      <a class="chip" href="/incheon/">인천 안내</a>
      <a class="chip" href="/use/">이용 장소 전체</a>
    </div>
    <h2 id="reserve">예약 전 체크리스트</h2>
    ${checklistHtml(RESERVE_CHECKLIST)}
    ${operatingBlock()}
    <h2 id="faq">자주 묻는 질문</h2>
    ${faqHtml(COMMON_FAQ)}
    ${trustBlock({ experience: `${u.name} 시 실제로 확인해야 할 출입·이동·시간 기준을 반영합니다.` })}
    ${relatedBlock('다른 이용 장소', USE_CASES.filter((x) => x.slug !== u.slug).map((x) => ({ label: x.name, href: `/use/${x.slug}/` })))}
  `;
  return {
    url,
    title: `${u.name} 출장마사지 안내｜${SITE.name}`,
    description: `${u.name} 출장마사지·홈타이 예약 전 확인 포인트와 지역별 이용 기준 안내.`,
    current: '/use/',
    imageAlt: `${u.name} 방문형 관리 안내 이미지`,
    breadcrumb: [crumbHome, { label: '이용 장소', href: '/use/' }, { label: u.name, href: url }],
    faqs: COMMON_FAQ,
    body:
      breadcrumb([crumbHome, { label: '이용 장소', href: '/use/' }, { label: u.name, href: url }]) +
      hero({ eyebrow: '이용 장소', h1: `${u.name} · 방문 전 확인 안내`, sub: esc(u.overview),
        ctas: [{ label: '전화 예약', href: `tel:${SITE.phone.replace(/-/g, '')}` }, { label: '예약 전 확인', href: '/check/', variant: 'btn-ghost' }],
        seed: 'use' + u.slug, badge: u.name }) +
      article({ toc, inner }),
  };
}

// ─────────────────────────────────────────────────────────
// 예약 전 확인 페이지
// ─────────────────────────────────────────────────────────
function checkPage(c) {
  const url = `/check/${c.slug}/`;
  const toc = [
    { id: 'intro', label: '개요' },
    { id: 'point', label: '확인 항목' },
    { id: 'reserve', label: '예약 전 체크리스트' },
    { id: 'operating', label: '운영 기준' },
    { id: 'trust', label: '작성·검수 안내' },
  ];
  const inner = `
    <h2 id="intro">${c.name}</h2>
    <p>${esc(c.overview)}</p>
    <h2 id="point">확인 항목</h2>
    ${checklistHtml(c.points)}
    <h2 id="reserve">예약 전 체크리스트</h2>
    ${checklistHtml(RESERVE_CHECKLIST)}
    <p style="margin-top:1em">전화 예약·문의 <a href="tel:${SITE.phone.replace(/-/g, '')}">${SITE.phone}</a></p>
    ${operatingBlock()}
    ${trustBlock({ experience: `${c.name} 관련 실제 방문 시 발생하는 확인 사항을 반영합니다.` })}
    ${relatedBlock('다른 확인 항목', CHECKS.filter((x) => x.slug !== c.slug).map((x) => ({ label: x.name, href: `/check/${x.slug}/` })).concat([{ label: '개인정보 처리방침', href: '/policy/privacy/' }, { label: '불법·선정적 서비스 불가', href: '/policy/legal/' }]))}
  `;
  return {
    url,
    title: `${c.name}｜예약 전 확인 · ${SITE.name}`,
    description: `${c.name} — 출장마사지 예약 전 확인할 항목과 기준을 안내합니다.`,
    current: '/check/',
    imageAlt: `${c.name} 안내 이미지`,
    breadcrumb: [crumbHome, { label: '예약 전 확인', href: '/check/' }, { label: c.name, href: url }],
    body:
      breadcrumb([crumbHome, { label: '예약 전 확인', href: '/check/' }, { label: c.name, href: url }]) +
      hero({ eyebrow: '예약 전 확인', h1: c.name, sub: esc(c.overview),
        ctas: [{ label: '전화 예약', href: `tel:${SITE.phone.replace(/-/g, '')}` }],
        seed: 'check' + c.slug, badge: c.name }) +
      article({ toc, inner }),
  };
}

// ─────────────────────────────────────────────────────────
// 메인 페이지
// ─────────────────────────────────────────────────────────
function mainPage() {
  const toc = [
    { id: 'diff', label: '수도권은 지역별 기준이 다릅니다' },
    { id: 'price', label: '기본 요금' },
    { id: 'regions', label: '지역별 바로가기' },
    { id: 'life', label: '생활권별 안내' },
    { id: 'use', label: '이용 장소별 안내' },
    { id: 'reserve', label: '예약 전 체크리스트' },
    { id: 'operating', label: '운영 기준' },
    { id: 'faq', label: '자주 묻는 질문' },
    { id: 'trust', label: '작성·검수 안내' },
  ];
  const inner = `
    <h2 id="diff">서울·경기·인천은 같은 수도권이라도 이용 기준이 다릅니다</h2>
    <p>서울은 지하철역과 생활권이 촘촘하게 연결되어 있고, 경기는 시군 면적이 넓어 같은 도시 안에서도 이동 기준과 생활권이 다릅니다. 인천은 원도심, 신도시, 공항, 도서 지역이 함께 있어 사전 확인이 특히 중요합니다.</p>
    <p>${SITE.name}는 지역명만 나열하지 않고, 실제 방문 주소, 가까운 역, 생활권, 이용 장소, 예약 전 확인사항을 기준으로 안내합니다.</p>

    <h2 id="regions">서울·경기·인천 지역별 안내</h2>
    <div class="grid cols-3" style="margin:1em 0">
      <a class="card" href="/seoul/"><div class="ic" aria-hidden="true">🏙️</div><h3>서울</h3><p>강남, 잠실, 홍대, 여의도, 성수, 용산 등 서울 주요 생활권 중심 안내</p><div class="more">서울 보기 →</div></a>
      <a class="card" href="/gyeonggi/"><div class="ic" aria-hidden="true">🌆</div><h3>경기</h3><p>수원, 분당, 용인, 부천, 안산, 안양, 일산 등 경기 시군·생활권 안내</p><div class="more">경기 보기 →</div></a>
      <a class="card" href="/incheon/"><div class="ic" aria-hidden="true">🌉</div><h3>인천</h3><p>송도, 부평, 구월, 주안, 청라, 검단, 영종 등 인천 구군·생활권 안내</p><div class="more">인천 보기 →</div></a>
    </div>

    <h2 id="life">수도권 주요 생활권</h2>
    <p>생활권은 행정구역과 역세권을 연결하는 기준입니다. 같은 지역이라도 업무·주거·상권 성격에 따라 확인사항이 다릅니다.</p>
    <div class="chips" style="margin:1em 0">
      ${['강남역·역삼', '잠실·송파', '홍대·합정', '여의도·영등포', '분당·판교', '광교·영통', '동탄신도시', '송도국제도시', '부평역·부평시장', '청라국제도시']
        .map((l) => `<span class="chip">${esc(l)}</span>`).join('')}
    </div>
    <p>생활권별 비교는 <a href="/life/">생활권 안내</a>에서 확인하세요.</p>

    <h2 id="use">이용 장소에 따라 확인할 내용이 다릅니다</h2>
    <div class="grid cols-4" style="margin:1em 0">
      ${USE_CASES.map((u) => `<a class="card" href="/use/${u.slug}/"><div class="ic" aria-hidden="true">${u.icon}</div><h3>${esc(u.name.replace(' 이용', ''))}</h3></a>`).join('')}
    </div>

    <h2 id="reserve">예약 전 확인하면 좋은 내용</h2>
    ${checklistHtml(RESERVE_CHECKLIST.concat(['공항·도서 지역 사전 예약이 필요한가요?', '불법·선정적 서비스 불가 안내를 확인했나요?']))}
    <p style="margin-top:1em">전화 예약은 <a href="tel:${SITE.phone.replace(/-/g, '')}"><strong>${SITE.phone}</strong></a>로 가능합니다.</p>

    ${operatingBlock()}

    <h2 id="faq">자주 묻는 질문</h2>
    ${faqHtml(COMMON_FAQ)}

    ${trustBlock({ experience: '수도권 전 지역의 생활권 차이, 외곽 이동 여부, 자택·숙소·오피스텔 이용 기준을 반영합니다.' })}

    ${relatedBlock('수도권 안내 바로가기', [
      { label: '서울', href: '/seoul/' }, { label: '경기', href: '/gyeonggi/' }, { label: '인천', href: '/incheon/' },
      { label: '생활권', href: '/life/' }, { label: '지하철역', href: '/station/' }, { label: '이용 장소', href: '/use/' },
      { label: '예약 전 확인', href: '/check/' }, { label: '운영 기준', href: '/policy/' }, { label: '문의하기', href: '/contact/' },
    ])}
  `;
  return {
    url: '/',
    title: `서울·경기·인천 출장마사지｜수도권 지역별 홈타이 예약 안내 · ${SITE.name}`,
    description: '서울·경기·인천 출장마사지·홈타이 예약 전 수도권 주요 지역과 이용 장소별 확인사항 안내.',
    current: '/',
    imageAlt: '수도권 서울·경기·인천 방문형 관리 지역 안내 이미지',
    breadcrumb: [crumbHome],
    faqs: COMMON_FAQ,
    body:
      hero({
        eyebrow: '서울 · 경기 · 인천 수도권 전 지역',
        h1: '서울·경기·인천 출장마사지<br>수도권 지역별 예약 안내',
        sub: '서울, 경기, 인천 주요 지역과 생활권, 지하철역, 자택·호텔·오피스텔 이용 기준을 한 번에 확인할 수 있습니다.',
        ctas: [
          { label: '서울 보기', href: '/seoul/', variant: 'btn-primary' },
          { label: '경기 보기', href: '/gyeonggi/', variant: 'btn-ghost' },
          { label: '인천 보기', href: '/incheon/', variant: 'btn-ghost' },
        ],
        seed: 'mango-main',
        badge: `예약 ${SITE.phone}`,
      }) +
      pricingSection({}) +
      article({ toc, inner }),
  };
}

// ─────────────────────────────────────────────────────────
// 생활권 / 역세권 허브 + 시도별 목록
// ─────────────────────────────────────────────────────────
function simpleHub({ url, current, title, description, h1, eyebrow, heroSub, seed, badge, breadcrumbTrail, toc, inner, faqs }) {
  return {
    url, current, title, description, faqs,
    imageAlt: `${badge} 안내 이미지`,
    breadcrumb: breadcrumbTrail,
    body: breadcrumb(breadcrumbTrail) +
      hero({ eyebrow, h1, sub: heroSub, ctas: [{ label: '전화 예약', href: `tel:${SITE.phone.replace(/-/g, '')}` }, { label: '예약 전 확인', href: '/check/', variant: 'btn-ghost' }], seed, badge }) +
      article({ toc, inner }),
  };
}

function lifeHub() {
  const all = [
    ['서울 생활권', '/seoul/life/'], ['경기 생활권', '/gyeonggi/life/'], ['인천 생활권', '/incheon/life/'],
  ];
  const inner = `
    <h2 id="intro">수도권 생활권 안내</h2>
    <p>생활권은 행정구역과 역세권을 연결해, 실제 방문 환경을 기준으로 묶은 단위입니다. 같은 구·시 안에서도 업무지구, 신도시, 주거지, 숙소 인접 지역은 확인사항이 다릅니다.</p>
    <div class="grid cols-3" style="margin:1em 0">
      ${all.map(([n, h]) => `<a class="card" href="${h}"><div class="ic" aria-hidden="true">🗺️</div><h3>${esc(n)}</h3><p>지역별 생활권 비교 보기</p><div class="more">자세히 →</div></a>`).join('')}
    </div>
    <h2 id="type">생활권 유형</h2>
    <div class="chips" style="margin:1em 0">
      <a class="chip" href="/use/business/">업무지구 생활권</a>
      <a class="chip" href="/life/">신도시 생활권</a>
      <a class="chip" href="/use/hotel/">숙소 인접 생활권</a>
      <a class="chip" href="/use/outskirts/">외곽 이동 생활권</a>
      <a class="chip" href="/use/airport-islands/">공항·도서 생활권</a>
    </div>
    ${operatingBlock()}
    ${trustBlock({})}
    ${relatedBlock('관련 안내', [{ label: '서울', href: '/seoul/' }, { label: '경기', href: '/gyeonggi/' }, { label: '인천', href: '/incheon/' }, { label: '지하철역', href: '/station/' }, { label: '이용 장소', href: '/use/' }])}
  `;
  return simpleHub({
    url: '/life/', current: '/life/',
    title: `수도권 생활권 안내｜서울·경기·인천 · ${SITE.name}`,
    description: '서울·경기·인천 생활권별 출장마사지 이용 기준과 확인사항을 안내합니다.',
    h1: '수도권 생활권 안내', eyebrow: '생활권', heroSub: '서울·경기·인천의 업무지구, 신도시, 주거지, 숙소 인접 생활권을 비교해 확인하세요.',
    seed: 'life-hub', badge: '생활권 안내',
    breadcrumbTrail: [crumbHome, { label: '생활권', href: '/life/' }],
    toc: [{ id: 'intro', label: '생활권 안내' }, { id: 'type', label: '생활권 유형' }, { id: 'operating', label: '운영 기준' }, { id: 'trust', label: '작성·검수 안내' }, { id: 'related', label: '관련 안내' }],
    inner,
  });
}

function stationHub() {
  const inner = `
    <h2 id="intro">수도권 지하철역 안내</h2>
    <p>역세권 페이지는 역명 기준으로 안내합니다. 출구별, 노선별로 페이지를 나누지 않으며, 정확한 건물명과 도로명 주소로 방문하는 것을 권장합니다.</p>
    <div class="grid cols-3" style="margin:1em 0">
      <a class="card" href="/seoul/station/"><div class="ic" aria-hidden="true">🚇</div><h3>서울 주요역</h3><p>강남·잠실·홍대입구·여의도 등</p></a>
      <a class="card" href="/gyeonggi/station/"><div class="ic" aria-hidden="true">🚉</div><h3>경기 주요역</h3><p>수원·서현·부천·범계 등</p></a>
      <a class="card" href="/incheon/station/"><div class="ic" aria-hidden="true">🚆</div><h3>인천 주요역</h3><p>부평·인천시청·센트럴파크 등</p></a>
    </div>
    <h2 id="rule">역세권 이용 기준</h2>
    <p>역세권은 접근성이 좋지만 건물 위치가 헷갈리기 쉽습니다. 출구 번호는 참고로만 사용하고, 정확한 건물 주소와 공동현관 방식을 확인하세요. 자세한 내용은 <a href="/use/station-area/">역세권 이용 안내</a>를 참고하세요.</p>
    ${operatingBlock()}
    ${trustBlock({})}
    ${relatedBlock('관련 안내', [{ label: '생활권', href: '/life/' }, { label: '이용 장소', href: '/use/' }, { label: '예약 전 확인', href: '/check/' }])}
  `;
  return simpleHub({
    url: '/station/', current: '/station/',
    title: `수도권 지하철역 안내｜역세권 예약 · ${SITE.name}`,
    description: '서울·경기·인천 주요 지하철역 역세권 출장마사지 이용 기준을 안내합니다.',
    h1: '수도권 지하철역 안내', eyebrow: '지하철역', heroSub: '서울·경기·인천 주요 역세권의 이용 기준을 역명 기준으로 안내합니다. 출구별 페이지는 만들지 않습니다.',
    seed: 'station-hub', badge: '역세권 안내',
    breadcrumbTrail: [crumbHome, { label: '지하철역', href: '/station/' }],
    toc: [{ id: 'intro', label: '지하철역 안내' }, { id: 'rule', label: '역세권 이용 기준' }, { id: 'operating', label: '운영 기준' }, { id: 'trust', label: '작성·검수 안내' }, { id: 'related', label: '관련 안내' }],
    inner,
  });
}

function provinceListPage(provKey, kind) {
  const prov = PROVINCE[provKey];
  const isLife = kind === 'life';
  const url = `${prov.href}${kind}/`;
  const areas = prov.regions.flatMap((r) => isLife ? r.lifeAreas : r.stations);
  const uniq = [...new Set(areas)];
  const title = isLife
    ? `${prov.name} 생활권 안내｜${SITE.name}`
    : `${prov.name} 지하철역 안내｜${SITE.name}`;
  const inner = `
    <h2 id="intro">${prov.name} ${isLife ? '생활권' : '지하철역'} 안내</h2>
    <p>${prov.name}의 ${isLife ? '대표 생활권' : '주요 역세권'} 목록입니다. ${isLife ? '같은 지역이라도 업무·주거·상권 성격에 따라 확인사항이 다릅니다.' : '출구 번호보다 정확한 건물명과 도로명 주소로 안내하면 방문이 원활합니다.'}</p>
    <div class="chips" style="margin:1em 0">
      ${uniq.map((a) => `<span class="chip">${isLife ? '' : '🚉 '}${esc(a)}</span>`).join('')}
    </div>
    <h2 id="region">${prov.name} ${prov.sib} 바로가기</h2>
    <div class="chips" style="margin:1em 0">
      ${prov.regions.map((r) => `<a class="chip" href="${prov.href}${r.slug}/">${esc(r.name)}</a>`).join('')}
    </div>
    ${operatingBlock()}
    ${trustBlock({})}
    ${relatedBlock('관련 안내', [{ label: `${prov.name} 홈`, href: prov.href }, { label: isLife ? `${prov.name} 지하철역` : `${prov.name} 생활권`, href: `${prov.href}${isLife ? 'station' : 'life'}/` }, { label: '이용 장소', href: '/use/' }, { label: '예약 전 확인', href: '/check/' }])}
  `;
  return simpleHub({
    url, current: `/${kind}/`,
    title,
    description: `${prov.name} ${isLife ? '생활권별' : '역세권'} 출장마사지 이용 기준과 확인사항 안내.`,
    h1: `${prov.name} ${isLife ? '생활권' : '지하철역'} 안내`, eyebrow: prov.name,
    heroSub: `${prov.name}의 ${isLife ? '대표 생활권' : '주요 역세권'}을 한눈에 비교하고 이용 기준을 확인하세요.`,
    seed: provKey + kind, badge: `${prov.name} ${isLife ? '생활권' : '역'}`,
    breadcrumbTrail: [crumbHome, { label: prov.name, href: prov.href }, { label: isLife ? '생활권' : '지하철역', href: url }],
    toc: [{ id: 'intro', label: `${isLife ? '생활권' : '지하철역'} 안내` }, { id: 'region', label: `${prov.sib} 바로가기` }, { id: 'operating', label: '운영 기준' }, { id: 'trust', label: '작성·검수 안내' }, { id: 'related', label: '관련 안내' }],
    inner,
  });
}

function outskirtsPage() {
  const inner = `
    <h2 id="intro">경기 외곽 지역 안내</h2>
    <p>경기 외곽은 이동 시간이 길어 추가 이동비와 예약 가능 시간을 사전에 확인해야 합니다. 정확한 도로명 주소와 인근 랜드마크를 함께 안내하면 방문이 원활합니다.</p>
    <h2 id="point">외곽 이용 확인 포인트</h2>
    ${checklistHtml(['정확한 도로명 주소와 좌표', '추가 이동비 기준 사전 확인', '예약 가능 시간 여유 확보', '야간 이동 가능 여부', '인근 랜드마크 안내'])}
    <h2 id="area">외곽 권역 예시</h2>
    <div class="chips" style="margin:1em 0">
      ${['용인 처인 외곽', '광주·이천·여주', '양평·가평', '포천·동두천·연천', '안성·평택 외곽', '김포·파주 북부'].map((a) => `<span class="chip">${esc(a)}</span>`).join('')}
    </div>
    ${operatingBlock()}
    ${trustBlock({})}
    ${relatedBlock('관련 안내', [{ label: '경기 홈', href: '/gyeonggi/' }, { label: '외곽 지역 이용', href: '/use/outskirts/' }, { label: '추가 이동비 기준', href: '/check/fare/' }])}
  `;
  return simpleHub({
    url: '/gyeonggi/outskirts/', current: '/gyeonggi/',
    title: `경기 외곽 지역 안내｜${SITE.name}`,
    description: '경기 외곽 출장마사지 이용 시 추가 이동비와 예약 시간 확인 기준 안내.',
    h1: '경기 외곽 지역 안내', eyebrow: '경기 · 외곽', heroSub: '경기 외곽 지역의 추가 이동비, 예약 가능 시간, 도로명 주소 확인 기준을 안내합니다.',
    seed: 'gyeonggi-outskirts', badge: '외곽 안내',
    breadcrumbTrail: [crumbHome, { label: '경기', href: '/gyeonggi/' }, { label: '외곽 지역 안내', href: '/gyeonggi/outskirts/' }],
    toc: [{ id: 'intro', label: '외곽 안내' }, { id: 'point', label: '확인 포인트' }, { id: 'area', label: '외곽 권역' }, { id: 'operating', label: '운영 기준' }, { id: 'trust', label: '작성·검수 안내' }, { id: 'related', label: '관련 안내' }],
    inner,
  });
}

function airportIslandsPage() {
  const inner = `
    <h2 id="intro">공항·도서 지역 안내</h2>
    <p>인천공항, 영종·용유, 강화·옹진 도서 지역은 사전 예약과 이동 계획이 필수입니다. 교통편과 이동 시간을 미리 확인하고, 추가 이동비 기준을 함께 확인하세요.</p>
    <h2 id="point">공항·도서 확인 포인트</h2>
    ${checklistHtml(['사전 예약 필수 여부', '공항 인근 호텔 객실 방문 정책', '도서 지역 교통편과 이동 시간', '추가 이동비 사전 확인', '예약 가능 시간 여유 확보'])}
    <h2 id="area">대상 권역</h2>
    <div class="chips" style="margin:1em 0">
      ${['인천공항', '영종·운서', '용유·무의', '강화', '옹진 도서'].map((a) => `<span class="chip">${esc(a)}</span>`).join('')}
    </div>
    ${operatingBlock()}
    ${trustBlock({})}
    ${relatedBlock('관련 안내', [{ label: '인천 홈', href: '/incheon/' }, { label: '공항·도서 지역 이용', href: '/use/airport-islands/' }, { label: '추가 이동비 기준', href: '/check/fare/' }])}
  `;
  return simpleHub({
    url: '/incheon/airport-islands/', current: '/incheon/',
    title: `인천 공항·도서 지역 안내｜${SITE.name}`,
    description: '인천공항·영종·강화·옹진 도서 출장마사지 사전 예약과 이동 기준 안내.',
    h1: '공항·도서 지역 안내', eyebrow: '인천 · 공항·도서', heroSub: '인천공항, 영종, 강화, 옹진 도서 지역의 사전 예약과 이동 기준을 안내합니다.',
    seed: 'incheon-airport', badge: '공항·도서',
    breadcrumbTrail: [crumbHome, { label: '인천', href: '/incheon/' }, { label: '공항·도서 지역 안내', href: '/incheon/airport-islands/' }],
    toc: [{ id: 'intro', label: '공항·도서 안내' }, { id: 'point', label: '확인 포인트' }, { id: 'area', label: '대상 권역' }, { id: 'operating', label: '운영 기준' }, { id: 'trust', label: '작성·검수 안내' }, { id: 'related', label: '관련 안내' }],
    inner,
  });
}

// ─────────────────────────────────────────────────────────
// 이용 장소 / 예약 전 확인 허브
// ─────────────────────────────────────────────────────────
function useHub() {
  const inner = `
    <h2 id="intro">이용 장소별 안내</h2>
    <p>같은 지역이라도 자택, 호텔·숙소, 오피스텔, 업무지구에 따라 확인할 내용이 다릅니다. 이용 장소를 먼저 정하고 그에 맞는 확인사항을 살펴보세요.</p>
    <div class="grid cols-4" style="margin:1em 0">
      ${USE_CASES.map((u) => `<a class="card" href="/use/${u.slug}/"><div class="ic" aria-hidden="true">${u.icon}</div><h3>${esc(u.name.replace(' 이용', ''))}</h3><p>${esc(u.overview.slice(0, 38))}…</p></a>`).join('')}
    </div>
    ${operatingBlock()}
    ${trustBlock({})}
    ${relatedBlock('관련 안내', [{ label: '서울', href: '/seoul/' }, { label: '경기', href: '/gyeonggi/' }, { label: '인천', href: '/incheon/' }, { label: '예약 전 확인', href: '/check/' }])}
  `;
  return simpleHub({
    url: '/use/', current: '/use/',
    title: `이용 장소별 안내｜자택·호텔·오피스텔 · ${SITE.name}`,
    description: '자택·호텔·오피스텔·업무지구 등 이용 장소별 출장마사지 확인사항 안내.',
    h1: '이용 장소별 안내', eyebrow: '이용 장소', heroSub: '자택, 호텔·숙소, 오피스텔, 업무지구, 역세권, 야간, 외곽, 공항·도서 이용 기준을 확인하세요.',
    seed: 'use-hub', badge: '이용 장소',
    breadcrumbTrail: [crumbHome, { label: '이용 장소', href: '/use/' }],
    toc: [{ id: 'intro', label: '이용 장소 안내' }, { id: 'operating', label: '운영 기준' }, { id: 'trust', label: '작성·검수 안내' }, { id: 'related', label: '관련 안내' }],
    inner,
  });
}

function checkHub() {
  const inner = `
    <h2 id="intro">예약 전 확인</h2>
    <p>방문이 원활하려면 주소, 건물 출입 방식, 이동비, 예약 시간 등을 미리 확인하는 것이 좋습니다. 항목별 기준을 정리했습니다.</p>
    <div class="grid cols-3" style="margin:1em 0">
      ${CHECKS.map((c) => `<a class="card" href="/check/${c.slug}/"><div class="ic" aria-hidden="true">${c.icon}</div><h3>${esc(c.name)}</h3><p>${esc(c.overview.slice(0, 40))}…</p></a>`).join('')}
      <a class="card" href="/policy/privacy/"><div class="ic" aria-hidden="true">🔒</div><h3>개인정보 처리 기준</h3><p>최소 정보 수집 원칙 안내</p></a>
      <a class="card" href="/policy/legal/"><div class="ic" aria-hidden="true">🚫</div><h3>불법·선정적 서비스 불가</h3><p>정상 방문형 관리만 안내</p></a>
    </div>
    <h2 id="reserve">예약 전 체크리스트</h2>
    ${checklistHtml(RESERVE_CHECKLIST)}
    ${operatingBlock()}
    ${trustBlock({})}
  `;
  return simpleHub({
    url: '/check/', current: '/check/',
    title: `예약 전 확인 안내｜${SITE.name}`,
    description: '출장마사지 예약 전 주소·출입·이동비·시간 등 확인 항목을 안내합니다.',
    h1: '예약 전 확인', eyebrow: '예약 전 확인', heroSub: '방문 주소, 건물 출입 방식, 추가 이동비, 예약 시간 등 예약 전 확인할 항목을 정리했습니다.',
    seed: 'check-hub', badge: '예약 전 확인',
    breadcrumbTrail: [crumbHome, { label: '예약 전 확인', href: '/check/' }],
    toc: [{ id: 'intro', label: '예약 전 확인' }, { id: 'reserve', label: '체크리스트' }, { id: 'operating', label: '운영 기준' }, { id: 'trust', label: '작성·검수 안내' }],
    inner,
  });
}

// ─────────────────────────────────────────────────────────
// 정책 페이지
// ─────────────────────────────────────────────────────────
function policyHub() {
  const inner = `
    <h2 id="intro">운영 기준</h2>
    <p>${SITE.name}는 안전하고 신뢰할 수 있는 지역 안내를 위해 다음 기준을 따릅니다.</p>
    <ul>
      <li>불법·선정적 서비스를 제공하거나 안내하지 않습니다.</li>
      <li>허위 후기, 가짜 평점, 과장된 할인 문구를 사용하지 않습니다.</li>
      <li>개인정보는 예약 확인과 연락 목적의 최소 범위만 안내합니다.</li>
      <li>모든 지역 페이지는 생활권·역세권·이용 장소·예약 전 확인사항을 다르게 구성합니다.</li>
    </ul>
    <div class="grid cols-2" style="margin:1em 0">
      <a class="card" href="/policy/privacy/"><div class="ic" aria-hidden="true">🔒</div><h3>개인정보 처리방침</h3><p>수집 항목과 처리 기준</p></a>
      <a class="card" href="/policy/legal/"><div class="ic" aria-hidden="true">🚫</div><h3>불법·선정적 서비스 불가 안내</h3><p>제공·안내 불가 기준</p></a>
    </div>
    ${trustBlock({})}
  `;
  return simpleHub({
    url: '/policy/', current: '/check/',
    title: `운영 기준｜${SITE.name}`,
    description: '망고 마사지 운영 기준 · 개인정보 처리와 불법·선정적 서비스 불가 안내.',
    h1: '운영 기준', eyebrow: '운영 기준', heroSub: '안전한 이용을 위한 운영 기준과 개인정보, 불법·선정적 서비스 불가 안내입니다.',
    seed: 'policy-hub', badge: '운영 기준',
    breadcrumbTrail: [crumbHome, { label: '운영 기준', href: '/policy/' }],
    toc: [{ id: 'intro', label: '운영 기준' }, { id: 'trust', label: '작성·검수 안내' }],
    inner,
  });
}

function privacyPage() {
  const inner = `
    <h2 id="intro">개인정보 처리방침</h2>
    <p>${SITE.name}는 예약 확인과 연락에 필요한 최소한의 정보만 안내·이용합니다. 마케팅 목적의 무분별한 수집을 하지 않습니다.</p>
    <h2 id="collect">수집·이용 항목</h2>
    ${checklistHtml(['예약 확인을 위한 연락처', '방문 지역과 주소(예약 진행 시)', '예약 일시·요청 사항'])}
    <h2 id="use2">이용 목적</h2>
    <p>수집한 정보는 예약 확인, 방문 안내, 변경·취소 응대 목적에만 사용하며, 목적이 끝나면 관련 법령에 따라 지체 없이 파기합니다.</p>
    <h2 id="right">이용자 권리</h2>
    <p>이용자는 본인 정보의 열람·정정·삭제를 요청할 수 있습니다. 개인정보 보호 관련 자세한 기준은 <a href="${A.privacy.url}" target="_blank" rel="noopener nofollow">${A.privacy.label}</a>의 안내를 참고할 수 있습니다.</p>
    <div class="callout"><p>문의: <a href="tel:${SITE.phone.replace(/-/g, '')}">${SITE.phone}</a> · <a href="${SITE.telegram}" target="_blank" rel="noopener nofollow">텔레그램</a></p></div>
    ${trustBlock({})}
  `;
  return simpleHub({
    url: '/policy/privacy/', current: '/check/',
    title: `개인정보 처리방침｜${SITE.name}`,
    description: '망고 마사지 개인정보 처리방침 · 예약 확인 목적의 최소 정보만 수집합니다.',
    h1: '개인정보 처리방침', eyebrow: '개인정보', heroSub: '예약 확인과 연락에 필요한 최소 정보만 수집·이용하며, 목적 달성 후 지체 없이 파기합니다.',
    seed: 'privacy', badge: '개인정보',
    breadcrumbTrail: [crumbHome, { label: '운영 기준', href: '/policy/' }, { label: '개인정보 처리방침', href: '/policy/privacy/' }],
    toc: [{ id: 'intro', label: '개요' }, { id: 'collect', label: '수집 항목' }, { id: 'use2', label: '이용 목적' }, { id: 'right', label: '이용자 권리' }, { id: 'trust', label: '작성·검수 안내' }],
    inner,
  });
}

function legalPage() {
  const inner = `
    <h2 id="intro">불법·선정적 서비스 불가 안내</h2>
    <p>${SITE.name}는 정상적인 방문형 관리 안내만 제공합니다. 불법·선정적 서비스는 제공하지 않으며, 그러한 요청은 안내하지 않습니다.</p>
    <h2 id="rule">기본 원칙</h2>
    ${checklistHtml(['정상 방문형 관리 안내만 제공', '불법·선정적 요청 안내·제공 불가', '성매매 등 불법 행위 일절 불가', '상호 존중과 안전을 최우선'])}
    <h2 id="report">신고 안내</h2>
    <p>불법 행위는 관련 기관에 신고할 수 있습니다. 자세한 내용은 <a href="${A.police.url}" target="_blank" rel="noopener nofollow">${A.police.label}</a>를 참고하세요. 소비자 권익 관련 안내는 <a href="${A.kca.url}" target="_blank" rel="noopener nofollow">${A.kca.label}</a>에서 확인할 수 있습니다.</p>
    <div class="callout warn"><p>본 사이트의 모든 안내는 합법적이고 정상적인 방문형 관리 서비스에 한정됩니다.</p></div>
    ${trustBlock({})}
  `;
  return simpleHub({
    url: '/policy/legal/', current: '/check/',
    title: `불법·선정적 서비스 불가 안내｜${SITE.name}`,
    description: '망고 마사지는 정상 방문형 관리만 안내하며 불법·선정적 서비스는 제공하지 않습니다.',
    h1: '불법·선정적 서비스 불가 안내', eyebrow: '운영 원칙', heroSub: '본 사이트는 합법적이고 정상적인 방문형 관리 안내만 제공합니다.',
    seed: 'legal', badge: '운영 원칙',
    breadcrumbTrail: [crumbHome, { label: '운영 기준', href: '/policy/' }, { label: '불법·선정적 서비스 불가', href: '/policy/legal/' }],
    toc: [{ id: 'intro', label: '개요' }, { id: 'rule', label: '기본 원칙' }, { id: 'report', label: '신고 안내' }, { id: 'trust', label: '작성·검수 안내' }],
    inner,
  });
}

function contactPage() {
  const inner = `
    <h2 id="intro">문의하기</h2>
    <p>예약과 지역 확인은 전화로, 웹사이트 제작·제휴 문의는 텔레그램으로 안내합니다.</p>
    <div class="grid cols-2" style="margin:1em 0">
      <div class="card"><div class="ic" aria-hidden="true">📞</div><h3>전화 예약</h3><p style="font-size:22px;font-weight:900;color:var(--mango-700)"><a href="tel:${SITE.phone.replace(/-/g, '')}">${SITE.phone}</a></p><p>상호 ${esc(SITE.name)}</p></div>
      <div class="card"><div class="ic" aria-hidden="true">✈️</div><h3>제작·제휴 문의</h3><p><a class="btn btn-orange" href="${SITE.telegram}" target="_blank" rel="noopener nofollow">텔레그램으로 문의</a></p><p>웹사이트 제작문의 · 제휴문의</p></div>
    </div>
    <h2 id="area">안내 지역</h2>
    <p>서울·경기·인천 수도권 전 지역의 생활권, 역세권, 이용 장소별 확인사항을 안내합니다.</p>
    <div class="chips" style="margin:1em 0"><a class="chip" href="/seoul/">서울</a><a class="chip" href="/gyeonggi/">경기</a><a class="chip" href="/incheon/">인천</a></div>
    ${operatingBlock()}
    ${trustBlock({})}
  `;
  return simpleHub({
    url: '/contact/', current: '/contact/',
    title: `문의하기｜전화예약 ${SITE.phone} · ${SITE.name}`,
    description: `망고 마사지 문의 · 전화예약 ${SITE.phone}, 제작·제휴는 텔레그램으로 안내합니다.`,
    h1: '문의하기', eyebrow: '문의', heroSub: `예약은 전화 ${SITE.phone}, 웹사이트 제작·제휴 문의는 텔레그램으로 빠르게 안내합니다.`,
    seed: 'contact', badge: `예약 ${SITE.phone}`,
    breadcrumbTrail: [crumbHome, { label: '문의하기', href: '/contact/' }],
    toc: [{ id: 'intro', label: '문의 안내' }, { id: 'area', label: '안내 지역' }, { id: 'operating', label: '운영 기준' }, { id: 'trust', label: '작성·검수 안내' }],
    inner,
  });
}
