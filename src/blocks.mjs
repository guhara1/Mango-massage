// 본문 섹션 빌더 — 지역/허브/이용 페이지 공통 구조
import { SITE } from './site.mjs';
import { tocAside, tocInline, faqBlock, eeatBlock, whwBlock, esc } from './components.mjs';

export const COMMON_FAQ = [
  { q: '이 지역도 방문 가능한가요?', a: '실제 방문 주소, 가까운 생활권, 예약 가능 시간, 이동 기준을 확인한 뒤 안내합니다. 전화 예약 시 정확한 위치를 알려주세요.' },
  { q: '호텔이나 숙소에서도 이용할 수 있나요?', a: '숙소 정책과 객실 출입 가능 여부를 먼저 확인해야 합니다. 시설마다 외부인 방문 규정이 다릅니다.' },
  { q: '오피스텔은 어떤 점을 확인해야 하나요?', a: '공동현관, 엘리베이터, 관리 규정, 방문 가능 시간대를 확인해야 합니다. 관리실 방문 등록이 필요한 경우도 있습니다.' },
  { q: '추가 이동비가 있나요?', a: '외곽 지역, 공항, 도서 지역은 이동 거리에 따라 추가 이동비가 있을 수 있어 사전 확인이 필요합니다.' },
  { q: '개인정보는 어떻게 처리하나요?', a: '예약 확인과 연락에 필요한 최소 정보만 안내하며, 자세한 내용은 <a href="/policy/privacy/">개인정보 처리방침</a>에서 확인할 수 있습니다.' },
  { q: '불법·선정적 서비스도 가능한가요?', a: '불법·선정적 서비스는 제공하거나 안내하지 않습니다. 정상적인 방문형 관리 안내만 제공합니다.' },
];

// 표준 본문 article 래퍼: 좌측 TOC + 우측 prose
export function article({ toc = [], inner }) {
  return `<section class="section"><div class="container content-wrap">
    ${tocAside(toc)}
    <div class="prose">
      ${tocInline(toc)}
      ${inner}
    </div>
  </div></section>`;
}

// 예약 전 체크리스트 (공통)
export const RESERVE_CHECKLIST = [
  '방문 주소를 정확히 확인했나요?',
  '공동현관 또는 건물 출입 방식이 있나요?',
  '호텔·숙소 이용 가능 여부를 확인했나요?',
  '오피스텔 관리 규정이 있나요?',
  '주차 또는 차량 이동이 필요한 지역인가요?',
  '외곽 지역 추가 이동비가 있나요?',
  '예약 변경 기준을 확인했나요?',
  '개인정보 처리 기준을 확인했나요?',
];

export function checklistHtml(items) {
  return `<ul class="checklist">${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
}

// 운영 기준 + 개인정보 + 불법 서비스 불가 (모든 주요 페이지 연결)
export function operatingBlock() {
  return `<h2 id="operating">안전한 이용을 위한 운영 기준</h2>
    <div class="callout warn">
      <p>이 사이트는 <strong>불법·선정적 서비스를 제공하거나 안내하지 않습니다.</strong> 허위 후기, 가짜 평점, 과장된 할인 문구를 사용하지 않으며, 개인정보는 예약 확인과 연락 목적의 최소 범위만 안내합니다.</p>
    </div>
    <p style="margin-top:14px">자세한 기준은 <a href="/policy/legal/">불법·선정적 서비스 불가 안내</a>와 <a href="/policy/privacy/">개인정보 처리방침</a>에서 확인할 수 있습니다.</p>`;
}

// E-E-A-T + WHW 묶음 (모든 주요 페이지 하단)
export function trustBlock(extra) {
  return `<h2 id="trust">작성·검수 기준 (E-E-A-T)</h2>
    ${eeatBlock(extra)}
    <h3 style="margin-top:1.6em">Who · How · Why</h3>
    ${whwBlock()}`;
}

// 관련 지역/내부링크 블록
export function relatedBlock(title, links) {
  return `<h2 id="related">${esc(title)}</h2>
    <div class="related"><div class="chips">
      ${links.map((l) => `<a class="chip" href="${l.href}">${esc(l.label)}</a>`).join('')}
    </div></div>`;
}
