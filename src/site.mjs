// 사이트 전역 설정 · 사업자 정보 · 내비게이션 · E-E-A-T 정보
// 모든 페이지가 이 단일 소스를 참조합니다.

export const SITE = {
  name: '망고 마사지',
  brand: '망고 마사지',
  legalName: '망고 마사지',
  tagline: '서울·경기·인천 출장마사지 · 수도권 지역별 예약 안내',
  // 실제 운영 도메인으로 교체하세요.
  baseUrl: 'https://mango-massage.example',
  locale: 'ko_KR',
  lang: 'ko',
  phone: '0508-202-4719',
  phoneLabel: '전화예약',
  // 외부 문의/제휴 채널
  telegram: 'https://t.me/googleseolab',
  // 권위 있는 외부 참고 링크 (E-E-A-T · 외부 인용)
  authority: {
    hira: { label: '건강보험심사평가원', url: 'https://www.hira.or.kr' },
    kca: { label: '한국소비자원', url: 'https://www.kca.go.kr' },
    privacy: { label: '개인정보보호위원회', url: 'https://www.pipc.go.kr' },
    police: { label: '경찰청 안전 신고', url: 'https://www.police.go.kr' },
    seoulData: { label: '서울 열린데이터광장', url: 'https://data.seoul.go.kr' },
    googleSearch: { label: 'Google 검색 센터', url: 'https://developers.google.com/search' },
  },
};

// E-E-A-T · 작성자/검수자 정보 (모든 주요 페이지 하단)
export const EEAT = {
  author: '수도권 방문형 서비스 지역 안내팀',
  reviewer: '운영 책임자 · 콘텐츠 검수 담당자',
  basis:
    '공식 행정구역, 실제 생활권, 지하철역, 이용 장소별 예약 기준을 근거로 작성합니다.',
  updatePolicy:
    '행정구역 개편, 지하철역 변화, 예약 기준 변경, 사용자 문의 데이터를 반영해 수정합니다.',
  experience:
    '지역별 이용 환경, 생활권 차이, 외곽 이동 여부, 숙소·오피스텔·자택 이용 시 확인해야 할 실제 기준을 반영합니다.',
};

// Who / How / Why (모든 허브·지역 페이지)
export const WHW = {
  who:
    '이 페이지는 수도권 지역 안내 콘텐츠 담당자가 작성하고 운영 책임자가 검수합니다.',
  how:
    '공식 행정구역, 생활권 분류, 주요 역세권, 예약 전 확인사항, 이용 장소별 기준을 바탕으로 구성합니다.',
  why:
    '서울·경기·인천에서 방문형 서비스를 찾는 사용자가 지역, 이용 장소, 추가 확인사항을 안전하게 비교할 수 있도록 돕기 위해 작성합니다.',
};

// 상단 메뉴 + 드롭다운 (메뉴명에 "출장마사지" 반복 금지)
import { SEOUL } from './regions/seoul.mjs';
import { GYEONGGI } from './regions/gyeonggi.mjs';
import { INCHEON } from './regions/incheon.mjs';

// 구/시군 전체를 드롭다운에 자동 포함
const regionChildren = (base, regions, extras) => [
  { label: `${extras.homeLabel}`, href: base },
  ...regions.map((r) => ({ label: r.name, href: `${base}${r.slug}/` })),
  ...extras.tail,
];

export const NAV = [
  { label: '수도권 홈', href: '/' },
  {
    label: '서울',
    href: '/seoul/',
    children: regionChildren('/seoul/', SEOUL, {
      homeLabel: '서울 홈',
      tail: [
        { label: '서울 생활권', href: '/seoul/life/' },
        { label: '서울 지하철역', href: '/seoul/station/' },
        { label: '이용 장소', href: '/use/' },
      ],
    }),
  },
  {
    label: '경기',
    href: '/gyeonggi/',
    children: regionChildren('/gyeonggi/', GYEONGGI, {
      homeLabel: '경기 홈',
      tail: [
        { label: '경기 생활권', href: '/gyeonggi/life/' },
        { label: '경기 지하철역', href: '/gyeonggi/station/' },
        { label: '외곽 지역 안내', href: '/gyeonggi/outskirts/' },
      ],
    }),
  },
  {
    label: '인천',
    href: '/incheon/',
    children: regionChildren('/incheon/', INCHEON, {
      homeLabel: '인천 홈',
      tail: [
        { label: '인천 생활권', href: '/incheon/life/' },
        { label: '인천 지하철역', href: '/incheon/station/' },
        { label: '공항·도서 지역 안내', href: '/incheon/airport-islands/' },
      ],
    }),
  },
  {
    label: '생활권',
    href: '/life/',
    children: [
      { label: '서울 생활권', href: '/seoul/life/' },
      { label: '경기 생활권', href: '/gyeonggi/life/' },
      { label: '인천 생활권', href: '/incheon/life/' },
      { label: '업무지구 생활권', href: '/use/business/' },
      { label: '신도시 생활권', href: '/life/' },
      { label: '숙소 인접 생활권', href: '/use/hotel/' },
      { label: '외곽 이동 생활권', href: '/use/outskirts/' },
      { label: '공항·도서 생활권', href: '/use/airport-islands/' },
    ],
  },
  {
    label: '지하철역',
    href: '/station/',
    children: [
      { label: '서울 주요역', href: '/seoul/station/' },
      { label: '경기 주요역', href: '/gyeonggi/station/' },
      { label: '인천 주요역', href: '/incheon/station/' },
      { label: '역세권 이용 기준', href: '/use/station-area/' },
    ],
  },
  {
    label: '이용 장소',
    href: '/use/',
    children: [
      { label: '자택 이용', href: '/use/home/' },
      { label: '호텔·숙소 이용', href: '/use/hotel/' },
      { label: '오피스텔 이용', href: '/use/officetel/' },
      { label: '업무지구 이용', href: '/use/business/' },
      { label: '역세권 이용', href: '/use/station-area/' },
      { label: '야간 예약', href: '/use/night/' },
      { label: '외곽 지역 이용', href: '/use/outskirts/' },
      { label: '공항·도서 지역 이용', href: '/use/airport-islands/' },
    ],
  },
  {
    label: '예약 전 확인',
    href: '/check/',
    children: [
      { label: '방문 주소 확인', href: '/check/address/' },
      { label: '건물 출입 방식', href: '/check/entrance/' },
      { label: '추가 이동비 기준', href: '/check/fare/' },
      { label: '예약 가능 시간', href: '/check/time/' },
      { label: '예약 변경 기준', href: '/check/change/' },
      { label: '개인정보 처리 기준', href: '/policy/privacy/' },
      { label: '불법·선정적 서비스 불가', href: '/policy/legal/' },
      { label: '고객 유의사항', href: '/check/notice/' },
    ],
  },
  { label: '문의하기', href: '/contact/' },
];

// 푸터 빠른 링크
export const FOOTER_LINKS = [
  { label: '서울 출장마사지', href: '/seoul/' },
  { label: '경기 출장마사지', href: '/gyeonggi/' },
  { label: '인천 출장마사지', href: '/incheon/' },
  { label: '생활권 안내', href: '/life/' },
  { label: '지하철역 안내', href: '/station/' },
  { label: '이용 장소', href: '/use/' },
  { label: '예약 전 확인', href: '/check/' },
  { label: '운영 기준', href: '/policy/' },
  { label: '개인정보 처리방침', href: '/policy/privacy/' },
  { label: '불법·선정적 서비스 불가', href: '/policy/legal/' },
];
