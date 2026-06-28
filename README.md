# 망고 마사지 · 서울·경기·인천 출장마사지 지역 안내

수도권(서울·경기·인천) 방문형 관리 서비스 **지역 안내** 정적 사이트입니다.
Google 검색 가이드라인(E-E-A-T · Helpful Content · 스팸 정책)을 준수하도록 설계했습니다.

## 빠른 시작

```bash
npm run build     # docs/ 에 정적 사이트 생성
npm run serve     # http://localhost:4321 미리보기
```

GitHub Pages는 `docs/` 폴더를 게시하도록 설정하면 됩니다(`.nojekyll` 포함).

## 구조

```
src/
  site.mjs        사업자 정보·내비게이션·E-E-A-T·권위 외부링크 (단일 소스)
  theme.mjs       프리미엄 망고 디자인 시스템 (Pretendard 토큰 + 컴포넌트 오버레이)
  components.mjs   헤더·히어로(+썸네일 SVG)·목차·푸터(오렌지 텔레그램 CTA)
  layout.mjs      페이지 셸 + 구조화 데이터(JSON-LD)
  blocks.mjs      본문 섹션(체크리스트·운영 기준·E-E-A-T·관련 링크)
  data.mjs        지역 데이터 — 지역마다 고유한 개요/생활권/역/이용 포인트
  pages.mjs       모든 페이지 본문 + 메타 빌더
build.mjs         docs/ 출력 (HTML·CSS·썸네일·sitemap·robots·404)
```

## SEO / 정책 적용

- **상호** 망고 마사지 · **전화예약** 0508-202-4719 (히어로·푸터·문의 전 페이지)
- **디스크립션** 모든 페이지 80자 이내 자동 보장
- **스키마** WebPage · WebSite · BreadcrumbList · Organization · ImageObject · FAQPage
  (LocalBusiness·Review 스키마는 실제 매장/후기가 없으므로 미사용)
- **E-E-A-T / Who·How·Why** 블록을 모든 주요 페이지 하단에 포함
- **목차(TOC)** 각 페이지 상단(인라인) + 좌측(고정) 제공
- **히어로 썸네일** 모든 페이지에 망고 무드 SVG 자동 생성(외부 이미지 의존 없음 → CWV 우수)
- **내부링크 / 롱테일** 지역↔생활권↔역세권↔이용 장소 상호 연결, 권위 기관 외부 링크
- **푸터** 웹사이트 제작문의·제휴문의 오렌지 버튼 → 텔레그램(https://t.me/googleseolab)
- **불법·선정적 서비스 불가 / 개인정보 처리방침**을 전 페이지에서 연결
- 가짜 후기·허위 평점·과장 광고 미사용, 출구별/노선별 대량 페이지 생성 금지

## 확장 (1차-B / 1차-C)

`src/data.mjs`의 `SEOUL` / `GYEONGGI` / `INCHEON` 배열에 지역 객체를 추가하면
동일한 템플릿으로 생활권·역세권·이용 기준이 고유하게 작성된 페이지가 생성됩니다.
번호동은 대표동으로 묶어 입력하고, 출구별·노선별 항목은 추가하지 않습니다.
