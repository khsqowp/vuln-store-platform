import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Circle,
  Heart,
  LockKeyhole,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Truck,
  UserRound,
} from 'lucide-react';
import './styles.css';

const categories = [
  { label: '추천', path: '/recommend', key: 'recommend' },
  { label: '랭킹', path: '/ranking', key: 'ranking' },
  { label: '아우터', path: '/category/outer', key: 'outer' },
  { label: '상의', path: '/category/top', key: 'top' },
  { label: '팬츠', path: '/category/pants', key: 'pants' },
  { label: '스니커즈', path: '/category/sneakers', key: 'sneakers' },
  { label: '세일', path: '/sale', key: 'sale' },
  { label: '이벤트', path: '/event', key: 'event' },
];

const baseProducts = [
  {
    id: 'p-1001',
    category: 'outer',
    brand: 'NOMADIC',
    name: '시티 라이트웨이트 블루종',
    price: 89000,
    originalPrice: 124000,
    discount: 28,
    rating: 4.8,
    reviews: 312,
    rank: 7,
    tags: ['recommend', 'sale'],
    description: '가볍고 탄탄한 나일론 소재의 데일리 블루종입니다. 간절기 출퇴근과 주말 외출에 모두 어울립니다.',
  },
  {
    id: 'p-1002',
    category: 'top',
    brand: 'AURORA',
    name: '소프트 코튼 오버핏 셔츠',
    price: 42900,
    originalPrice: 52900,
    discount: 19,
    rating: 4.7,
    reviews: 184,
    rank: 10,
    tags: ['recommend'],
    description: '부드러운 코튼 터치와 여유 있는 실루엣으로 단독 또는 이너로 활용하기 좋은 셔츠입니다.',
  },
  {
    id: 'p-1003',
    category: 'pants',
    brand: 'GROUND',
    name: '워크 테이퍼드 카고 팬츠',
    price: 63000,
    originalPrice: 97000,
    discount: 35,
    rating: 4.9,
    reviews: 521,
    rank: 4,
    tags: ['recommend', 'sale'],
    description: '수납감 있는 포켓과 안정적인 테이퍼드 핏이 특징인 워크웨어 무드의 팬츠입니다.',
  },
  {
    id: 'p-1004',
    category: 'top',
    brand: 'ORDINARY',
    name: '오버핏 후드 스웨트셔츠',
    price: 32900,
    originalPrice: 45900,
    discount: 28,
    rating: 4.8,
    reviews: 12841,
    rank: 1,
    tags: ['ranking', 'sale'],
    description: '탄탄한 기모감과 안정적인 후드 패턴으로 매일 입기 좋은 스웨트셔츠입니다.',
  },
  {
    id: 'p-1005',
    category: 'pants',
    brand: 'DENIM LAB',
    name: '와이드 데님 팬츠 라이트 인디고',
    price: 49900,
    originalPrice: 69000,
    discount: 28,
    rating: 4.8,
    reviews: 9206,
    rank: 2,
    tags: ['ranking'],
    description: '밝은 인디고 워싱과 넓은 실루엣으로 계절감 있게 착용하는 데님 팬츠입니다.',
  },
  {
    id: 'p-1006',
    category: 'sneakers',
    brand: 'WALKER',
    name: '데일리 로우 스니커즈',
    price: 69000,
    originalPrice: 89000,
    discount: 22,
    rating: 4.6,
    reviews: 6391,
    rank: 3,
    tags: ['ranking', 'recommend'],
    description: '군더더기 없는 로우 프로파일과 편안한 쿠셔닝을 갖춘 데일리 스니커즈입니다.',
  },
  {
    id: 'p-1007',
    category: 'outer',
    brand: 'SEASON',
    name: '미니멀 싱글 트렌치 코트',
    price: 139000,
    originalPrice: 179000,
    discount: 22,
    rating: 4.7,
    reviews: 433,
    rank: 13,
    tags: ['recommend'],
    description: '깔끔한 싱글 여밈과 차분한 컬러감으로 오래 입기 좋은 트렌치 코트입니다.',
  },
  {
    id: 'p-1008',
    category: 'top',
    brand: 'SEASON',
    name: '워시드 그래픽 티셔츠',
    price: 31000,
    originalPrice: 39000,
    discount: 21,
    rating: 4.5,
    reviews: 219,
    rank: 15,
    tags: ['sale'],
    description: '빈티지한 워싱과 그래픽 포인트가 돋보이는 반팔 티셔츠입니다.',
  },
  {
    id: 'p-1009',
    category: 'outer',
    brand: 'FRAME',
    name: '릴랙스 니트 집업 가디건',
    price: 59000,
    originalPrice: 79000,
    discount: 25,
    rating: 4.8,
    reviews: 803,
    rank: 5,
    tags: ['ranking', 'sale'],
    description: '적당한 두께감의 니트 조직과 여유로운 핏으로 계절 전환기에 좋은 집업 가디건입니다.',
  },
  {
    id: 'p-1010',
    category: 'pants',
    brand: 'NOMADIC',
    name: '크롭 슬랙스 블랙',
    price: 54000,
    originalPrice: 68000,
    discount: 21,
    rating: 4.7,
    reviews: 1022,
    rank: 8,
    tags: ['recommend'],
    description: '발목이 깔끔하게 드러나는 크롭 기장과 구김 적은 소재가 장점인 슬랙스입니다.',
  },
  {
    id: 'p-1011',
    category: 'sneakers',
    brand: 'RUNNER',
    name: '에어 메시 러닝 스니커즈',
    price: 79000,
    originalPrice: 119000,
    discount: 34,
    rating: 4.9,
    reviews: 1480,
    rank: 6,
    tags: ['ranking', 'sale'],
    description: '통기성 좋은 메시 어퍼와 가벼운 미드솔로 장시간 착화에 적합한 러닝 스니커즈입니다.',
  },
  {
    id: 'p-1012',
    category: 'outer',
    brand: 'AURORA',
    name: '유틸리티 포켓 베스트',
    price: 48000,
    originalPrice: 62000,
    discount: 23,
    rating: 4.6,
    reviews: 367,
    rank: 12,
    tags: ['event'],
    description: '레이어드에 적합한 유틸리티 베스트로 가벼운 수납과 스타일 포인트를 제공합니다.',
  },
  {
    id: 'p-1013',
    category: 'top',
    brand: 'COTTON WORKS',
    name: '릴랙스 니트 풀오버',
    price: 39900,
    originalPrice: 55900,
    discount: 29,
    rating: 4.8,
    reviews: 5803,
    rank: 9,
    tags: ['ranking', 'event'],
    description: '목선과 소매가 편안한 기본 니트 풀오버입니다. 단정한 데일리룩에 잘 어울립니다.',
  },
  {
    id: 'p-1014',
    category: 'pants',
    brand: 'GROUND',
    name: '이지 밴딩 조거 팬츠',
    price: 43000,
    originalPrice: 53000,
    discount: 19,
    rating: 4.5,
    reviews: 741,
    rank: 14,
    tags: ['event'],
    description: '허리 밴딩과 안정적인 밑단 처리로 활동성이 좋은 조거 팬츠입니다.',
  },
  {
    id: 'p-1015',
    category: 'sneakers',
    brand: 'STREET',
    name: '클래식 캔버스 스니커즈',
    price: 39000,
    originalPrice: 49000,
    discount: 20,
    rating: 4.4,
    reviews: 954,
    rank: 11,
    tags: ['sale', 'event'],
    description: '가볍고 캐주얼한 캔버스 소재의 클래식 스니커즈입니다.',
  },
  {
    id: 'p-1016',
    category: 'top',
    brand: 'MINUTE',
    name: '베이직 롱슬리브 티셔츠',
    price: 24000,
    originalPrice: 30000,
    discount: 20,
    rating: 4.6,
    reviews: 1105,
    rank: 16,
    tags: ['recommend', 'event'],
    description: '단독과 이너 모두 활용하기 좋은 긴팔 티셔츠입니다. 안정적인 넥라인과 부드러운 촉감이 특징입니다.',
  },
];

const categoryNameParts = {
  outer: ['라이트웨이트 블루종', '싱글 트렌치 코트', '니트 집업 가디건', '유틸리티 베스트', '윈드 쉘 재킷', '코튼 필드 재킷', '스탠드 칼라 점퍼', '후드 파카', '워크 재킷', '숏 맥코트'],
  top: ['오버핏 셔츠', '후드 스웨트셔츠', '그래픽 티셔츠', '니트 풀오버', '롱슬리브 티셔츠', '코튼 카라 티셔츠', '하프 집업 맨투맨', '와플 티셔츠', '옥스포드 셔츠', '모크넥 니트'],
  pants: ['카고 팬츠', '와이드 데님 팬츠', '크롭 슬랙스', '밴딩 조거 팬츠', '치노 팬츠', '원턱 와이드 팬츠', '워크 데님 팬츠', '스트레이트 슬랙스', '나일론 팬츠', '테이퍼드 코튼 팬츠'],
  sneakers: ['로우 스니커즈', '러닝 스니커즈', '캔버스 스니커즈', '테크 스니커즈', '레트로 스니커즈', '코트 스니커즈', '트레일 스니커즈', '벌크업 스니커즈', '스웨이드 스니커즈', '슬립온 스니커즈'],
};

const categoryBrands = ['NOMADIC', 'AURORA', 'GROUND', 'ORDINARY', 'SEASON', 'FRAME', 'RUNNER', 'STREET', 'MINUTE', 'COTTON WORKS'];


function remoteFashionImage(category, index, variant = 0, width = 900, height = 1125) {
  const keywords = {
    outer: 'jacket,outerwear',
    top: 'shirt,top',
    pants: 'pants,trousers',
    sneakers: 'sneakers,shoes',
  };
  const kw = keywords[category] || 'fashion';
  // Use a unique seed for each product and its variants
  const seed = (index + 1) * 20 + variant;
  return `https://loremflickr.com/${width}/${height}/${kw},fashion?lock=${seed}`;
}

function generatedFashionImage(category, label, index, variant = 0) {
  const palettes = [
    ['#111318', '#f4f7fb', '#0064ff'],
    ['#263238', '#eef8f3', '#11a36a'],
    ['#4a2f23', '#fff7ed', '#ff7a1a'],
    ['#2f3440', '#f2f0ff', '#6c5ce7'],
    ['#1f2937', '#f8fafc', '#ef4444'],
    ['#0f172a', '#ecfeff', '#0891b2'],
  ];
  const [dark, light, accent] = palettes[(index + variant) % palettes.length];
  const categoryShape = {
    outer: `<path d="M255 285 L330 220 H570 L645 285 L595 430 V805 H305 V430 Z" fill="${dark}"/><path d="M390 235 L450 350 L510 235" fill="${light}" opacity=".9"/>`,
    top: `<path d="M285 275 L370 220 H530 L615 275 L575 385 L530 360 V805 H370 V360 L325 385 Z" fill="${dark}"/><rect x="390" y="300" width="120" height="240" rx="24" fill="${accent}" opacity=".24"/>`,
    pants: `<path d="M350 230 H550 L585 805 H490 L450 430 L410 805 H315 Z" fill="${dark}"/><path d="M450 250 V805" stroke="${light}" stroke-width="12" opacity=".6"/>`,
    sneakers: `<path d="M230 610 C360 580 450 615 545 555 C610 620 690 650 760 665 L735 735 H250 C210 730 200 650 230 610 Z" fill="${dark}"/><path d="M320 640 H610" stroke="${accent}" stroke-width="18" stroke-linecap="round"/>`,
  }[category];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125"><rect width="900" height="1125" fill="${light}"/><circle cx="730" cy="190" r="${70 + variant * 10}" fill="${accent}" opacity=".16"/><rect x="95" y="120" width="710" height="885" rx="34" fill="#fff"/><g>${categoryShape}</g><text x="450" y="910" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="800" fill="${dark}">${label}</text><text x="450" y="958" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#697386">VUL SHOP ${String(index + 1).padStart(3, '0')}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function withDetailImages(product, index) {
  const seed = index ?? product.rank ?? product.id?.length ?? 1;
  const image = product.image || remoteFashionImage(product.category, seed, 0);
  return {
    ...product,
    image,
    detailImages: product.detailImages || [
      remoteFashionImage(product.category, seed, 1),
      remoteFashionImage(product.category, seed, 2),
      remoteFashionImage(product.category, seed, 3),
      remoteFashionImage(product.category, seed, 4),
    ],
  };
}

function createGeneratedProduct(category, index, rankOffset) {
  const names = categoryNameParts[category];
  const price = 24000 + ((index * 7300) % 118000);
  const discount = 10 + ((index * 7) % 31);
  return withDetailImages({
    id: `p-${category}-${String(index + 1).padStart(3, '0')}`,
    category,
    brand: categoryBrands[index % categoryBrands.length],
    name: `${names[index % names.length]} ${String(index + 1).padStart(2, '0')}`,
    price,
    originalPrice: Math.round(price / (1 - discount / 100) / 1000) * 1000,
    discount,
    rating: Number((4.3 + ((index % 7) * 0.1)).toFixed(1)),
    reviews: 120 + ((index * 137) % 9300),
    rank: rankOffset + index,
    tags: index % 3 === 0 ? ['recommend', 'sale'] : index % 3 === 1 ? ['ranking'] : ['event'],
    description: `${names[index % names.length]} 특유의 안정적인 핏과 데일리 활용도를 갖춘 상품입니다. 카테고리별 추천 상품으로 상세 이미지와 함께 확인할 수 있습니다.`,
    image: remoteFashionImage(category, index, 0),
    detailImages: [
      remoteFashionImage(category, index, 1),
      remoteFashionImage(category, index, 2),
      remoteFashionImage(category, index, 3),
      remoteFashionImage(category, index, 4),
    ],
  }, index);
}

function buildProducts() {
  const categoriesToFill = ['outer', 'top', 'pants', 'sneakers'];
  const seeded = baseProducts.map(withDetailImages);
  const generated = [];

  categoriesToFill.forEach((category, categoryIndex) => {
    const currentCount = seeded.filter((product) => product.category === category).length;
    for (let index = 0; index < 50 - currentCount; index += 1) {
      generated.push(createGeneratedProduct(category, index, 100 + categoryIndex * 60 + index));
    }
  });

  return [...seeded, ...generated];
}

function withRankingSignals(product, index) {
  const currentViews = product.reviews * 3 + ((product.rank + index) * 127);
  const previousViews = Math.max(1, currentViews - (((index % 9) - 4) * 83) - 210);
  const viewDelta = currentViews - previousViews;
  const trend = viewDelta > 0 ? 'up' : viewDelta < 0 ? 'down' : 'same';
  const trendScore = currentViews + product.discount * 80 + product.rating * 1200;
  return {
    ...product,
    currentViews,
    previousViews,
    viewDelta,
    viewDeltaRate: Math.round((viewDelta / previousViews) * 1000) / 10,
    trend,
    trendScore,
  };
}

function applyLiveRanks(items) {
  return [...items]
    .map(withRankingSignals)
    .sort((a, b) => b.trendScore - a.trendScore)
    .map((product, index) => ({ ...product, liveRank: index + 1, rankChange: product.rank - (index + 1) }))
    .sort((a, b) => a.rank - b.rank);
}

const products = applyLiveRanks(buildProducts());

const benefitItems = [
  '신규 회원 15% 쿠폰',
  '오늘 출발 상품 모아보기',
  '무료 반품 대상 상품',
  '주말 특가 기획전',
  '리뷰 높은 상품',
  '마일리지 2배 적립',
];

const couponCatalog = [
  { id: 'cp-new-15', title: '신규 회원 15% 할인', detail: '첫 구매 5만원 이상 사용 가능', discount: '15%', status: 'available' },
  { id: 'cp-free-ship', title: '무료배송 쿠폰', detail: '전 상품 배송비 무료', discount: '배송비', status: 'available' },
  { id: 'cp-weekend-10', title: '주말 특가 10% 할인', detail: '세일 상품 중복 적용 가능', discount: '10%', status: 'available' },
  { id: 'cp-ranking-7', title: '랭킹 상품 7% 할인', detail: '랭킹 100위 내 상품 적용', discount: '7%', status: 'available' },
  { id: 'cp-mileage', title: '마일리지 2배 적립권', detail: '주문 완료 시 자동 적립', discount: '2배', status: 'available' },
];

const communityTopics = [
  '오늘 출근룩 이 정도면 무난?',
  '블루종 사이즈 고민 중인데 조언 좀',
  '와이드 데님에 어울리는 신발 추천해줘',
  '주말에 입을 셔츠 골라봤는데 어때',
  '요즘 트렌치 코트 아직 입어도 되나',
  '러닝화 데일리로 신어본 사람?',
  '후드 색상 그레이랑 네이비 중에 뭐가 나아',
  '세일 상품 중에 이건 진짜 괜찮아 보임',
  '기본 긴팔티 핏 좋은 브랜드 찾았다',
  '카고 팬츠 처음 사보는데 코디 어렵네',
  '비 오는 날 신을 스니커즈 골라봤어',
  '니트 집업 살까 말까 계속 고민 중',
  '흰 셔츠 안 비치는 제품 추천 받아',
  '조거 팬츠 핏 봐줄 사람',
  '면접룩 너무 딱딱해 보이나?',
];
const communityBodies = [
  '사진으로 볼 땐 괜찮은데 실제로 입으면 느낌 다를까 봐 고민됨. 비슷한 핏 입어본 사람 후기 좀.',
  '상의는 넉넉하게 가는 편인데 이번엔 너무 커 보일까 봐 망설이는 중. 한 사이즈 다운이 맞나?',
  '요즘 편한 코디만 찾게 돼서 데일리로 돌려입을 조합 찾고 있음. 색 조합 괜찮으면 바로 살 듯.',
  '후기 보니까 원단은 좋아 보이는데 계절감이 애매하다는 말도 있더라. 지금 사도 뽕 뽑을 수 있을까?',
  '가격 내려갔길래 장바구니 넣어놨는데 마지막으로 커뮤니티 의견 듣고 결제하려고.',
  '실착 사진이 생각보다 적어서 여기 올려봄. 무난한지 아니면 너무 튀는지 말해줘.',
  '친구는 괜찮다는데 내 눈에는 살짝 과한 느낌이라 객관적인 의견 필요함.',
];
const communityImages = [
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=901&q=80',
  'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1506629905607-d9c297d5f5f8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80',
];
const communityNicknames = [
  '핏감연구소', '셔츠덕후', '데님수집가', '신발장만렙', '오늘도블랙', '미니멀러버', '아우터고민러', '출근룩장인', '주말코디러', '세일탐정',
  '후드좋아함', '니트입문자', '스니커즈헌터', '카고처음', '트렌치러버', '무채색성애자', '실착요정', '사이즈고민중', '핏체크부탁', '데일리민수',
  '코튼홀릭', '러닝화러버', '와이드팬츠러', '가디건좋아', '옷잘알되고싶다', '간절기준비', '기본템수집', '레이어드초보', '후기읽는사람', '청바지찾는중',
  '모노톤러', '스트릿입문', '단정한코디', '컬러매치중', '장바구니폭주', '오늘뭐입지', '실패없는코디', '신상구경러', '쿠폰기다림', '반품고민러',
  '사이즈업할까', '오버핏좋아', '미드솔관찰자', '면접룩준비', '편한옷최고', '날씨보고입음', '봄아우터찾음', '코디저장소', '룩북보는중', '패션초보탈출',
];

function relativePostTime(index) {
  const minutes = 7 + index * 19;
  if (minutes < 60) return `${minutes}분 전`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}시간 ${minutes % 60}분 전`;
  return `${Math.floor(minutes / 1440)}일 ${Math.floor((minutes % 1440) / 60)}시간 전`;
}

const communityPostsSeed = communityNicknames.flatMap((author, authorIndex) => (
  Array.from({ length: 1 + (authorIndex % 3) }, (_, postIndex) => {
    const index = authorIndex * 3 + postIndex;
    return {
      id: `c-${index + 1}`,
      title: communityTopics[index % communityTopics.length],
      body: communityBodies[(index + authorIndex) % communityBodies.length],
      author,
      image: communityImages[index % communityImages.length],
      likes: 12 + ((index * 7) % 230),
      comments: 1 + ((index * 3) % 48),
      createdAt: relativePostTime(index),
      replies: [
        '핏 괜찮아 보이는데 신발만 밝은 걸로 가도 좋을 듯!',
        '이 조합이면 데일리로 충분함. 나였으면 바로 입고 나감.',
        '상의 살짝 넣어 입으면 비율 더 좋아 보일 것 같아.',
      ].slice(0, 1 + (index % 3)),
    };
  })
));

const formatPrice = (value) => `${value.toLocaleString('ko-KR')}원`;

const reviewNickPrefixes = [
  '핏체크', '데님러', '셔츠러버', '스니커즈팬', '미니멀핏', '출근룩', '주말룩', '사이즈고민', '원단중요', '컬러매치',
  '후기탐정', '실착러', '간절기룩', '기본템러', '세일헌터', '리뷰장인', '옷장업뎃', '데일리웨어', '무채색러', '핏좋음',
];
const reviewFitWords = ['정사이즈', '살짝 여유', '오버핏', '깔끔한 핏', '편한 실루엣', '단정한 라인'];
const reviewColorWords = ['화면과 거의 같음', '실물이 조금 더 차분함', '자연광에서 더 예쁨', '코디하기 쉬운 색', '톤이 안정적임'];
const reviewTextureWords = ['원단이 탄탄함', '촉감이 부드러움', '가볍게 입기 좋음', '구김이 적은 편', '마감이 깔끔함'];
const reviewUseWords = ['출근룩에 좋음', '주말에 자주 입음', '여행 갈 때 챙기기 좋음', '기본템으로 괜찮음', '데일리로 손이 자주 감'];

function createProductReviews(product, limit = 12) {
  const count = product.reviews;
  const visibleCount = Math.min(count, limit);
  return Array.from({ length: visibleCount }, (_, index) => {
    const serial = `${product.id.replace(/\W/g, '')}-${String(index + 1).padStart(5, '0')}`;
    const fit = reviewFitWords[(index + product.rank) % reviewFitWords.length];
    const color = reviewColorWords[(index * 2 + product.rank) % reviewColorWords.length];
    const texture = reviewTextureWords[(index * 3 + product.rank) % reviewTextureWords.length];
    const use = reviewUseWords[(index * 5 + product.rank) % reviewUseWords.length];
    return {
      id: `rv-${serial}`,
      nickname: `${reviewNickPrefixes[index % reviewNickPrefixes.length]}${serial}`,
      rating: Number((4.3 + ((index + product.rank) % 7) * 0.1).toFixed(1)),
      body: `${product.name} ${index + 1}번째 실착 후기입니다. ${fit}이고 ${color}. ${texture}이라 ${use}. 주문번호 기준 리뷰라 내용이 반복되지 않게 기록했습니다.`,
      image: remoteFashionImage(product.category, product.rank + index, (index % 5) + 5),
      createdAt: `${1 + ((index + product.rank) % 28)}일 전`,
    };
  });
}

const fallbackImage = (label) => {
  const safeLabel = encodeURIComponent(label);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='1125' viewBox='0 0 900 1125'%3E%3Crect width='900' height='1125' fill='%23eef1f5'/%3E%3Crect x='90' y='120' width='720' height='885' rx='28' fill='%23ffffff'/%3E%3Ctext x='450' y='530' text-anchor='middle' font-family='Arial' font-size='42' font-weight='700' fill='%23111318'%3EVUL SHOP%3C/text%3E%3Ctext x='450' y='595' text-anchor='middle' font-family='Arial' font-size='28' fill='%23697386'%3E${safeLabel}%3C/text%3E%3C/svg%3E`;
};

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

const safeJson = (value) => {
  try {
    return JSON.parse(value || '{}');
  } catch {
    return {};
  }
};

const authHeaders = () => {
  const token = localStorage.getItem('vulshop.jwt');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const adminHeaders = () => ({
  Authorization: `Bearer ${safeJson(localStorage.getItem('vulshop.admin')).token || localStorage.getItem('vulshop.jwt') || ''}`,
});

const loadStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('vulshop.user') || 'null');
  } catch {
    return null;
  }
};

const loadStoredAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem('vulshop.admin') || 'null');
  } catch {
    return null;
  }
};

async function requestAuth(path, body) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || '인증 요청에 실패했습니다.');
  }
  return payload?.data?.sample?.accessToken || payload?.data?.accessToken || '';
}

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [query, setQuery] = useState(new URLSearchParams(window.location.search).get('q') || '');
  const [keyword, setKeyword] = useState(query);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(loadStoredUser);
  const [admin, setAdmin] = useState(loadStoredAdmin);
  const [sellerApproved, setSellerApproved] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userCoupons, setUserCoupons] = useState([couponCatalog[1]]);
  const [loginRedirect, setLoginRedirect] = useState('/mypage');
  const [lastOrderKey, setLastOrderKey] = useState(localStorage.getItem('vulshop.lastOrderKey') || '');

  React.useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
      const nextQuery = new URLSearchParams(window.location.search).get('q') || '';
      setQuery(nextQuery);
      setKeyword(nextQuery);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  React.useEffect(() => {
    if (!user?.email) {
      setSellerApproved(false);
      return;
    }
    fetch(`/api/seller/status?email=${encodeURIComponent(user.email)}`, { headers: authHeaders() })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => setSellerApproved(Boolean(payload?.data?.seller || user.role === 'SELLER')))
      .catch(() => setSellerApproved(user.role === 'SELLER'));
  }, [user]);

  React.useEffect(() => {
    fetch('/api/products')
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (payload?.data?.length) {
          setCatalogProducts(applyLiveRanks(payload.data.map((product, index) => ({
            ...product,
            id: product.id || product.productCode || `api-${index}`,
            discount: product.discount ?? product.discountRate ?? 0,
            reviews: product.reviews ?? product.reviewCount ?? 0,
            rank: product.rank ?? product.ranking ?? index + 1,
            detailImages: product.detailImages?.length ? product.detailImages : [product.image].filter(Boolean),
            tags: product.tags || ['recommend'],
          }))));
        }
      })
      .catch(() => {});
  }, []);

  React.useEffect(() => {
    fetch('/api/community/posts')
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (payload?.data?.length) {
          setCommunityPosts(payload.data);
        }
      })
      .catch(() => {});
  }, []);

  const navigate = (to) => {
    window.history.pushState({}, '', to);
    setPath(window.location.pathname);
    const nextQuery = new URLSearchParams(window.location.search).get('q') || '';
    setQuery(nextQuery);
    setKeyword(nextQuery);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitSearch = (event) => {
    event.preventDefault();
    const value = keyword.trim();
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
  };

  const requireLogin = (redirectTo = '/mypage', message = '로그인 후 이용할 수 있는 기능입니다.') => {
    window.alert(`${message}\n로그인 또는 회원가입 페이지로 이동합니다.`);
    setLoginRedirect(redirectTo);
    navigate('/login');
    return false;
  };

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      requireLogin(path.startsWith('/products/') ? path : '/cart', '상품 구매와 장바구니 담기는 회원만 이용할 수 있습니다.');
      return;
    }
    setCart((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      if (existing) {
        return items.map((item) => (
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        ));
      }
      return [...items, { product, quantity }];
    });
    navigate('/cart');
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((items) => items
      .map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0));
  };

  const toggleWishlist = (product) => {
    if (!user) {
      requireLogin(path.startsWith('/products/') ? path : '/wishlist', '찜 기능은 회원만 이용할 수 있습니다.');
      return;
    }
    setWishlist((items) => (
      items.some((item) => item.id === product.id)
        ? items.filter((item) => item.id !== product.id)
        : [...items, product]
    ));
  };

  const issueCoupon = (coupon) => {
    setUserCoupons((items) => (
      items.some((item) => item.id === coupon.id) ? items : [...items, coupon]
    ));
  };

  const persistUser = (nextUser, token = '') => {
    setUser(nextUser);
    localStorage.setItem('vulshop.user', JSON.stringify(nextUser));
    if (token) {
      localStorage.setItem('vulshop.jwt', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vulshop.user');
    localStorage.removeItem('vulshop.jwt');
    navigate('/');
  };

  const adminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('vulshop.admin');
    navigate('/root/login');
  };

  if (path.startsWith('/root')) {
    if (path === '/root/login') {
      return <AdminLoginPage navigate={navigate} setAdmin={setAdmin} />;
    }
    return admin?.role === 'ADMIN'
      ? <AdminEntry navigate={navigate} path={path} admin={admin} logout={adminLogout} />
      : <AdminLoginPage navigate={navigate} setAdmin={setAdmin} redirectTo={path} />;
  }

  return (
    <div className="app">
      <Header
        keyword={keyword}
        setKeyword={setKeyword}
        submitSearch={submitSearch}
        navigate={navigate}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        wishlistCount={wishlist.length}
        user={user}
        requireLogin={requireLogin}
        openMenu={() => setMenuOpen(true)}
      />
      {menuOpen && <MenuDrawer navigate={navigate} closeMenu={() => setMenuOpen(false)} />}
      <CategoryNav path={path} navigate={navigate} />
      <main>
        <RouteView
          path={path}
          query={query}
          navigate={navigate}
          catalogProducts={catalogProducts}
          cart={cart}
          wishlist={wishlist}
          user={user}
          setUser={persistUser}
          logout={logout}
          loginRedirect={loginRedirect}
          setLoginRedirect={setLoginRedirect}
          requireLogin={requireLogin}
          addToCart={addToCart}
          updateCartQuantity={updateCartQuantity}
          toggleWishlist={toggleWishlist}
          communityPosts={communityPosts}
          setCommunityPosts={setCommunityPosts}
          userCoupons={userCoupons}
          issueCoupon={issueCoupon}
          lastOrderKey={lastOrderKey}
          setLastOrderKey={setLastOrderKey}
          sellerApproved={sellerApproved}
        />
      </main>
      <Footer navigate={navigate} sellerApproved={sellerApproved} />
    </div>
  );
}

function Header({ keyword, setKeyword, submitSearch, navigate, cartCount, wishlistCount, user, requireLogin, openMenu }) {
  return (
    <header className="topbar">
      <button className="iconButton" aria-label="메뉴" onClick={openMenu}>
        <Menu size={22} />
      </button>
      <button className="brand linkButton" onClick={() => navigate('/')}>
        VUL Shop
      </button>
      <form className="searchBox" onSubmit={submitSearch}>
        <Search size={18} />
        <input
          aria-label="상품 검색"
          placeholder="브랜드, 상품명, 카테고리 검색"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </form>
      <nav className="quickNav" aria-label="빠른 메뉴">
        <button onClick={() => navigate('/ranking')}>랭킹</button>
        <button onClick={() => navigate('/event')}>이벤트</button>
        <button onClick={() => navigate('/community')}>커뮤니티</button>
        <button onClick={() => navigate('/search')}>검색</button>
      </nav>
      <div className="headerActions">
        <button className="iconButton" aria-label="알림">
          <Bell size={20} />
        </button>
        <button className="iconButton" aria-label="찜" onClick={() => navigate('/wishlist')}>
          {wishlistCount > 0 && <span className="countBadge">{wishlistCount}</span>}
          <Heart size={20} />
        </button>
        <button className="iconButton" aria-label="장바구니" onClick={() => navigate('/cart')}>
          {cartCount > 0 && <span className="countBadge">{cartCount}</span>}
          <ShoppingBag size={20} />
        </button>
        <button className="iconButton" aria-label="마이페이지" onClick={() => (user ? navigate('/mypage') : requireLogin('/mypage', '마이페이지는 회원만 이용할 수 있습니다.'))}>
          <UserRound size={20} />
        </button>
      </div>
    </header>
  );
}

function MenuDrawer({ navigate, closeMenu }) {
  const move = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <div className="drawerOverlay" onClick={closeMenu}>
      <aside className="menuDrawer" onClick={(event) => event.stopPropagation()}>
        <div className="drawerHeader">
          <strong>VUL Shop</strong>
          <button onClick={closeMenu}>닫기</button>
        </div>
        <nav>
          {categories.map((category) => (
            <button key={category.key} onClick={() => move(category.path)}>{category.label}</button>
          ))}
          <button onClick={() => move('/community')}>커뮤니티</button>
          <button onClick={() => move('/reviews')}>리뷰</button>
          <button onClick={() => move('/coupons')}>쿠폰</button>
          <button onClick={() => move('/cs')}>고객센터</button>
          <button onClick={() => move('/cart')}>장바구니</button>
          <button onClick={() => move('/wishlist')}>찜</button>
          <button onClick={() => move('/login')}>로그인</button>
          <button onClick={() => move('/privacy')}>개인정보처리방침</button>
        </nav>
      </aside>
    </div>
  );
}

function CategoryNav({ path, navigate }) {
  return (
    <nav className="categoryBar" aria-label="카테고리">
      {categories.map((category) => (
        <button
          className={isActiveCategory(path, category) ? 'active' : ''}
          key={category.key}
          onClick={() => navigate(category.path)}
        >
          {category.label}
        </button>
      ))}
    </nav>
  );
}

function Footer({ navigate, sellerApproved = false }) {
  const companyPhones = ['02-6412-9038', '02-783-4126', '070-8845-1209', '02-517-6628'];
  const supportPhones = ['1544-2861', '1644-9072', '1800-4319', '1588-6204'];
  const companyPhone = companyPhones[2];
  const supportPhone = supportPhones[1];

  return (
    <footer className="siteFooter">
      <div className="footerTop">
        <div>
          <strong>VUL Shop</strong>
          <p>취약점 진단 실습을 위한 커머스 MVP 서비스입니다.</p>
        </div>
        <nav aria-label="푸터 링크">
          <button onClick={() => navigate('/cs')}>고객센터</button>
          <button onClick={() => navigate('/privacy')}>개인정보처리방침</button>
          <button onClick={() => navigate('/terms')}>이용약관</button>
          <button onClick={() => navigate('/partners/apply')}>파트너 입점 신청</button>
          {sellerApproved && <button onClick={() => navigate('/part')}>파트너 센터</button>}
          <a href="https://www.instagram.com/khsqowp1/" target="_blank" rel="noreferrer">Instagram</a>
          <a href="https://github.com/khsqowp" target="_blank" rel="noreferrer">GitHub</a>
        </nav>
      </div>
      <div className="footerInfoGrid">
        <section>
          <h2>회사 정보</h2>
          <p>상호명 주식회사 VUL Commerce · 대표 김현수</p>
          <p>주소 서울특별시 강남구 테헤란로 123, 12층 VUL Shop 운영센터</p>
          <p>대표전화 {companyPhone} · 고객센터 {supportPhone}</p>
        </section>
        <section>
          <h2>사업자 정보</h2>
          <p>사업자등록번호 214-88-73951</p>
          <p>통신판매업신고번호 제2026-서울강남-0521호</p>
          <p>개인정보보호책임자 security@vulshop.local</p>
        </section>
        <section>
          <h2>운영 및 위탁</h2>
          <p>물류 위탁사 VUL Fulfillment Korea · 결제대행 VUL Payments</p>
          <p>고객상담 위탁 VUL CS Center · 데이터 보관 VUL Cloud Lab</p>
          <p>분쟁 해결 기준 전자상거래 등에서의 소비자보호에 관한 법률 및 공정거래위원회 고시를 따릅니다.</p>
        </section>
        <section>
          <h2>인증 및 고지</h2>
          <p>ISMS-P 모의 인증 준비 · ISO/IEC 27001 모의 인증 준비</p>
          <p>SSL 보안서버 적용 · 에스크로 결제 보호 모의 적용</p>
          <p>본 서비스의 회사/인증/사업자 정보는 보안 진단 실습용 더미 데이터입니다.</p>
        </section>
      </div>
      <p className="footerNotice">Copyright 2026 VUL Shop. All rights reserved.</p>
    </footer>
  );
}

function isActiveCategory(path, category) {
  if (category.path === '/recommend') {
    return path === '/' || path === '/recommend';
  }
  return path === category.path;
}

function RouteView({ path, query, navigate, catalogProducts, cart, wishlist, user, setUser, logout, loginRedirect, setLoginRedirect, requireLogin, addToCart, updateCartQuantity, toggleWishlist, communityPosts, setCommunityPosts, userCoupons, issueCoupon, lastOrderKey, setLastOrderKey, sellerApproved }) {
  if (path.startsWith('/products/')) {
    const product = catalogProducts.find((item) => item.id === path.split('/').pop());
    return product ? (
      <ProductDetail
        product={product}
        catalogProducts={catalogProducts}
        navigate={navigate}
        addToCart={addToCart}
        toggleWishlist={toggleWishlist}
        wished={wishlist.some((item) => item.id === product.id)}
        requireLogin={requireLogin}
        user={user}
      />
    ) : <NotFound navigate={navigate} />;
  }

  if (path === '/cart') {
    return user ? <CartPage cart={cart} navigate={navigate} updateCartQuantity={updateCartQuantity} /> : <LoginRequiredPage title="장바구니는 로그인 후 확인할 수 있습니다" navigate={navigate} redirectTo="/cart" setLoginRedirect={setLoginRedirect} />;
  }

  if (path === '/wishlist') {
    return user ? <WishlistPage wishlist={wishlist} navigate={navigate} toggleWishlist={toggleWishlist} /> : <LoginRequiredPage title="찜한 상품은 로그인 후 확인할 수 있습니다" navigate={navigate} redirectTo="/wishlist" setLoginRedirect={setLoginRedirect} />;
  }

  if (path === '/mypage') {
    return user ? <MyPage user={user} cart={cart} wishlist={wishlist} coupons={userCoupons} navigate={navigate} logout={logout} /> : <LoginRequiredPage title="마이페이지는 회원 전용입니다" navigate={navigate} redirectTo="/mypage" setLoginRedirect={setLoginRedirect} />;
  }

  if (path === '/coupons') {
    return user ? <CouponPage userCoupons={userCoupons} issueCoupon={issueCoupon} navigate={navigate} /> : <LoginRequiredPage title="쿠폰함은 로그인 후 이용할 수 있습니다" navigate={navigate} redirectTo="/coupons" setLoginRedirect={setLoginRedirect} />;
  }

  if (path === '/mileage') {
    return user ? <MileagePage navigate={navigate} user={user} /> : <LoginRequiredPage title="마일리지는 로그인 후 확인할 수 있습니다" navigate={navigate} redirectTo="/mileage" setLoginRedirect={setLoginRedirect} />;
  }

  if (path === '/likes') {
    return user ? <LikesPage navigate={navigate} posts={communityPosts} /> : <LoginRequiredPage title="좋아요 목록은 로그인 후 확인할 수 있습니다" navigate={navigate} redirectTo="/likes" setLoginRedirect={setLoginRedirect} />;
  }

  if (path === '/reviews') {
    return <ReviewPage navigate={navigate} />;
  }

  if (path === '/privacy') {
    return <PrivacyPage navigate={navigate} />;
  }

  if (path === '/terms') {
    return <TermsPage navigate={navigate} />;
  }

  if (path === '/robots.txt') {
    return <RobotsProgressPage />;
  }

  if (path === '/partners/apply') {
    return <PartnerApplyPage navigate={navigate} />;
  }

  if (path === '/seller/products') {
    if (!user) return <LoginRequiredPage title="판매자 상품 등록은 승인된 파트너만 이용할 수 있습니다" navigate={navigate} redirectTo="/seller/products" setLoginRedirect={setLoginRedirect} />;
    return sellerApproved ? <SellerProductPage navigate={navigate} user={user} /> : <PartnerRequiredPage navigate={navigate} />;
  }

  if (path.startsWith('/part')) {
    if (!user) return <LoginRequiredPage title="파트너 센터는 로그인 후 이용할 수 있습니다" navigate={navigate} redirectTo="/part" setLoginRedirect={setLoginRedirect} />;
    return sellerApproved ? <PartnerCenterPage navigate={navigate} path={path} user={user} /> : <PartnerRequiredPage navigate={navigate} />;
  }

  if (path === '/cs') {
    return user ? <CsPage navigate={navigate} user={user} /> : <LoginRequiredPage title="고객센터 문의는 로그인 후 등록할 수 있습니다" navigate={navigate} redirectTo="/cs" setLoginRedirect={setLoginRedirect} />;
  }

  if (path === '/cs/my') {
    return user ? <MyInquiryPage navigate={navigate} user={user} /> : <LoginRequiredPage title="내 문의 내역은 로그인 후 확인할 수 있습니다" navigate={navigate} redirectTo="/cs/my" setLoginRedirect={setLoginRedirect} />;
  }

  if (path === '/checkout') {
    if (!user) return <LoginRequiredPage title="결제는 로그인 후 진행할 수 있습니다" navigate={navigate} redirectTo="/checkout" setLoginRedirect={setLoginRedirect} />;
    return cart.length > 0 ? <CheckoutPage cart={cart} navigate={navigate} user={user} setLastOrderKey={setLastOrderKey} /> : <EmptyState title="결제할 상품이 없습니다" action="상품 보러가기" onClick={() => navigate('/recommend')} />;
  }

  if (path === '/delivery') {
    return user ? <DeliveryPage navigate={navigate} lastOrderKey={lastOrderKey} /> : <LoginRequiredPage title="배송조회는 로그인 후 확인할 수 있습니다" navigate={navigate} redirectTo="/delivery" setLoginRedirect={setLoginRedirect} />;
  }

  if (path === '/login') {
    return <LoginPage navigate={navigate} setUser={setUser} redirectTo={loginRedirect} onDone={() => setLoginRedirect('/mypage')} />;
  }

  if (path === '/register') {
    return <RegisterPage navigate={navigate} setUser={setUser} />;
  }

  if (path === '/community') {
    return <CommunityPage posts={communityPosts} navigate={navigate} user={user} requireLogin={requireLogin} />;
  }

  if (path === '/community/write') {
    return user
      ? <CommunityWritePage setCommunityPosts={setCommunityPosts} navigate={navigate} user={user} />
      : <LoginRequiredPage title="커뮤니티 글쓰기는 로그인 후 이용할 수 있습니다" navigate={navigate} redirectTo="/community/write" setLoginRedirect={setLoginRedirect} />;
  }

  if (path.startsWith('/community/')) {
    const post = communityPosts.find((item) => item.id === path.split('/').pop());
    return post ? <CommunityDetailPage post={post} navigate={navigate} user={user} requireLogin={requireLogin} /> : <NotFound navigate={navigate} />;
  }

  if (path === '/ranking') {
    return <ListingPage title="랭킹" subtitle="지금 가장 많이 보는 상품" products={rankedProducts(catalogProducts)} navigate={navigate} ranked />;
  }

  if (path.startsWith('/category/')) {
    const key = path.split('/').pop();
    const category = categories.find((item) => item.key === key);
    return (
      <ListingPage
        title={category?.label || '카테고리'}
        subtitle="카테고리별 추천 상품"
        products={catalogProducts.filter((product) => product.category === key)}
        navigate={navigate}
      />
    );
  }

  if (path === '/sale') {
    return <ListingPage title="세일" subtitle="할인율이 높은 상품" products={[...catalogProducts].sort((a, b) => b.discount - a.discount)} navigate={navigate} />;
  }

  if (path === '/event') {
    return <EventPage navigate={navigate} products={catalogProducts} />;
  }

  if (path === '/search') {
    const normalized = query.trim().toLowerCase();
    const result = normalized
      ? catalogProducts.filter((product) => `${product.brand} ${product.name} ${product.category}`.toLowerCase().includes(normalized))
      : catalogProducts;
    return <ListingPage title="검색" subtitle="상품명을 검색해보세요" rawSubtitle={normalized ? `"${query}" 검색 결과 ${result.length}개` : ''} products={result} navigate={navigate} />;
  }

  return <HomePage navigate={navigate} products={catalogProducts} />;
}

function HomePage({ navigate, products: homeProducts }) {
  const [homeFilter, setHomeFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [conditions, setConditions] = useState({ price: 'all', rating: false, sale: false });
  const filteredHomeProducts = useMemo(() => {
    let nextProducts = homeProducts;
    if (homeFilter === 'sale') {
      nextProducts = [...homeProducts].sort((a, b) => b.discount - a.discount);
    } else if (homeFilter !== 'all') {
      nextProducts = homeProducts.filter((product) => product.category === homeFilter);
    }
    if (conditions.price === 'under50000') {
      nextProducts = nextProducts.filter((product) => product.price < 50000);
    }
    if (conditions.price === '50000to100000') {
      nextProducts = nextProducts.filter((product) => product.price >= 50000 && product.price <= 100000);
    }
    if (conditions.price === 'over100000') {
      nextProducts = nextProducts.filter((product) => product.price > 100000);
    }
    if (conditions.rating) {
      nextProducts = nextProducts.filter((product) => product.rating >= 4.7);
    }
    if (conditions.sale) {
      nextProducts = nextProducts.filter((product) => product.discount >= 25);
    }
    return nextProducts;
  }, [conditions, homeFilter, homeProducts]);
  const homeTabs = [
    ['all', '전체'],
    ['outer', '아우터'],
    ['top', '상의'],
    ['sale', '세일'],
  ];

  return (
    <>
      <section className="hero">
        <div className="heroCopy">
          <div className="eyebrow">5월 스타일 위크</div>
          <h1>VUL Shop</h1>
          <p>
            지금 가장 많이 찾는 데일리웨어와 시즌 아이템을 한눈에 확인하세요.
            랭킹, 신상품, 특가 혜택을 빠르게 둘러볼 수 있습니다.
          </p>
          <div className="heroActions">
            <button className="primaryButton" onClick={() => navigate('/recommend')}>
              추천 상품 보기
              <ChevronRight size={18} />
            </button>
            <button className="secondaryButton" onClick={() => navigate('/event')}>
              이벤트 확인
            </button>
          </div>
        </div>

        <div className="heroGrid" aria-label="추천 상품">
          {homeProducts.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} large />
          ))}
        </div>
      </section>

      <section className="controlBand">
        <div className="tabGroup" aria-label="추천 필터">
          {homeTabs.map(([key, label]) => (
            <button className={homeFilter === key ? 'active' : ''} key={key} onClick={() => setHomeFilter(key)}>
              {label}
            </button>
          ))}
        </div>
        <button className={`filterButton ${filterOpen ? 'active' : ''}`} onClick={() => setFilterOpen((open) => !open)}>
          <SlidersHorizontal size={17} />
          필터 {filteredHomeProducts.length}
        </button>
      </section>

      {filterOpen && (
        <section className="homeFilterPanel">
          <label>
            가격대
            <select value={conditions.price} onChange={(event) => setConditions((current) => ({ ...current, price: event.target.value }))}>
              <option value="all">전체 가격</option>
              <option value="under50000">5만원 미만</option>
              <option value="50000to100000">5만원~10만원</option>
              <option value="over100000">10만원 초과</option>
            </select>
          </label>
          <label className="checkLine">
            <input type="checkbox" checked={conditions.rating} onChange={(event) => setConditions((current) => ({ ...current, rating: event.target.checked }))} />
            평점 4.7 이상
          </label>
          <label className="checkLine">
            <input type="checkbox" checked={conditions.sale} onChange={(event) => setConditions((current) => ({ ...current, sale: event.target.checked }))} />
            할인율 25% 이상
          </label>
          <button className="secondaryButton" onClick={() => setConditions({ price: 'all', rating: false, sale: false })}>초기화</button>
        </section>
      )}

      <section className="contentGrid">
        <div className="rankingPanel">
          <div className="sectionTitle">
            <h2>실시간 랭킹</h2>
            <button onClick={() => navigate('/ranking')}>전체보기</button>
          </div>
          <ol className="rankingList">
            {[...filteredHomeProducts].sort((a, b) => a.liveRank - b.liveRank).slice(0, 5).map((product) => (
              <li key={product.id} onClick={() => navigate(`/products/${product.id}`)}>
                <span className="rank">{product.liveRank}</span>
                <div>
                  <strong>{product.name}</strong>
                  <small>{product.currentViews.toLocaleString('ko-KR')}명이 보는 중 · {product.viewDeltaRate > 0 ? '+' : ''}{product.viewDeltaRate}%</small>
                </div>
                <em className={`trendBadge ${product.trend}`}>
                  {product.rankChange > 0 ? `▲${product.rankChange}` : product.rankChange < 0 ? `▼${Math.abs(product.rankChange)}` : '-'}
                </em>
                <b>{formatPrice(product.price)}</b>
              </li>
            ))}
          </ol>
        </div>

        <div className="benefitPanel">
          <div className="sectionTitle">
            <h2>오늘의 혜택</h2>
            <button onClick={() => navigate('/event')}>전체보기</button>
          </div>
          <div className="benefitGrid">
            {benefitItems.map((item, index) => (
              <span key={item}>
                {String(index + 1).padStart(2, '0')} {item}
              </span>
            ))}
          </div>
          <div className="benefitSummary">
            <ShoppingBag size={18} />
            <p>장바구니 쿠폰과 무료배송 혜택은 주문서에서 자동으로 확인할 수 있습니다.</p>
          </div>
        </div>
      </section>

      <section className="newArrivals">
        <div className="sectionTitle">
          <h2>신상품</h2>
          <button onClick={() => navigate('/recommend')}>더보기</button>
        </div>
        <div className="arrivalGrid">
          {filteredHomeProducts.slice(4, 12).map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      </section>
    </>
  );
}

function ListingPage({ title, subtitle, rawSubtitle = '', products: items, navigate, ranked = false }) {
  const [sort, setSort] = useState('recommended');
  const sortedItems = useMemo(() => {
    const nextItems = [...items];
    if (sort === 'newest') return nextItems.reverse();
    if (sort === 'lowPrice') return nextItems.sort((a, b) => a.price - b.price);
    if (sort === 'discount') return nextItems.sort((a, b) => b.discount - a.discount);
    return nextItems.sort((a, b) => a.liveRank - b.liveRank);
  }, [items, sort]);
  const sortOptions = [
    ['recommended', '추천순'],
    ['newest', '신상품순'],
    ['lowPrice', '낮은 가격순'],
    ['discount', '할인율순'],
  ];

  return (
    <section className="listingPage">
      <div className="pageHeader">
        <div>
          <h1>{title}</h1>
          {rawSubtitle ? <p dangerouslySetInnerHTML={{ __html: rawSubtitle }} /> : <p>{subtitle}</p>}
        </div>
        <span>{items.length}개 상품</span>
      </div>
      <div className="sortBar">
        {sortOptions.map(([key, label]) => (
          <button className={sort === key ? 'active' : ''} key={key} onClick={() => setSort(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="productGrid">
        {sortedItems.map((product, index) => (
          <ProductCard key={product.id} product={product} navigate={navigate} badge={ranked ? `${index + 1}위` : undefined} showTrend={ranked} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, navigate, large = false, badge, showTrend = false }) {
  return (
    <article className={`productCard ${large ? 'large' : ''}`} onClick={() => navigate(`/products/${product.id}`)}>
      <div className="imageWrap">
        <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage(product.name); }} />
        {product.discount > 0 && <span className="discount">{product.discount}%</span>}
        {badge && <span className="rankBadge">{badge}</span>}
        {showTrend && <span className={`cardTrend ${product.trend}`}>{product.rankChange > 0 ? `▲ ${product.rankChange}` : product.rankChange < 0 ? `▼ ${Math.abs(product.rankChange)}` : '유지'}</span>}
      </div>
      <div className="productMeta">
        <strong>{product.brand}</strong>
        <span>{product.name}</span>
        <b>{formatPrice(product.price)}</b>
        <small>
          <Star size={14} fill="currentColor" />
          {product.rating} 리뷰 {product.reviews.toLocaleString('ko-KR')}
        </small>
        {showTrend && <small>조회 {product.currentViews.toLocaleString('ko-KR')} · {product.viewDeltaRate > 0 ? '+' : ''}{product.viewDeltaRate}%</small>}
      </div>
    </article>
  );
}

function ProductDetail({ product, catalogProducts = products, navigate, addToCart, toggleWishlist, wished, requireLogin, user }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('info');
  const [inquiry, setInquiry] = useState('');
  const [inquiries, setInquiries] = useState([
    '사이즈 교환은 수령 후 7일 안에 가능할까요?',
    '상세 이미지 색상이 실물과 가장 비슷한가요?',
  ]);
  const total = useMemo(() => product.price * quantity, [product.price, quantity]);
  const previewHtml = useMemo(() => new URLSearchParams(window.location.search).get('previewHtml') || '', [product.id]);

  const submitInquiry = (event) => {
    event.preventDefault();
    if (!user) {
      requireLogin(`/products/${product.id}`, '제품 문의 작성은 회원만 이용할 수 있습니다.');
      return;
    }
    if (!inquiry.trim()) return;
    setInquiries((items) => [inquiry.trim(), ...items]);
    setInquiry('');
  };

  return (
    <>
      <section className="detailPage">
        <div className="detailGallery">
          <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage(product.name); }} />
          <div className="detailMoreImages">
            {product.detailImages.map((image, index) => (
              <img src={image} alt={`${product.name} 상세 ${index + 1}`} key={image} onError={(event) => { event.currentTarget.src = fallbackImage(product.name); }} />
            ))}
          </div>
        </div>
        <aside className="purchasePanel">
          <button className="backButton" onClick={() => navigate('/recommend')}>목록으로</button>
          <strong className="detailBrand">{product.brand}</strong>
          <h1>{product.name}</h1>
          <div className="detailRating">
            <Star size={16} fill="currentColor" />
            {product.rating} · 리뷰 {product.reviews.toLocaleString('ko-KR')}개
          </div>
          <div className="priceBox">
            <span>{product.discount}%</span>
            <b>{formatPrice(product.price)}</b>
            <del>{formatPrice(product.originalPrice)}</del>
          </div>
          <p className="detailDescription">{product.description}</p>
          {previewHtml && <div className="diagnosticPreview" dangerouslySetInnerHTML={{ __html: previewHtml }} />}
          <div className="deliveryBox">
            <Truck size={18} />
            <div>
              <strong>오늘 출발</strong>
              <span>오후 2시 전 결제 시 내일 도착 예정</span>
            </div>
          </div>
          <label className="optionLabel">
            사이즈
            <select>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </label>
          <div className="quantityControl">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="수량 감소">
              <Minus size={16} />
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} aria-label="수량 증가">
              <Plus size={16} />
            </button>
          </div>
          <div className="totalRow">
            <span>총 결제금액</span>
            <b>{formatPrice(total)}</b>
          </div>
          <div className="purchaseActions">
            <button className="secondaryButton" onClick={() => toggleWishlist(product)}>
              <Heart size={18} />
              {wished ? '찜 해제' : '찜'}
            </button>
            <button className="secondaryButton" onClick={() => addToCart(product, quantity)}>장바구니</button>
            <button className="primaryButton" onClick={() => addToCart(product, quantity)}>바로 구매</button>
          </div>
        </aside>
      </section>
      <ProductDetailTabs
        product={product}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inquiry={inquiry}
        setInquiry={setInquiry}
        inquiries={inquiries}
        submitInquiry={submitInquiry}
        requireLogin={requireLogin}
        user={user}
        navigate={navigate}
        catalogProducts={catalogProducts}
      />
    </>
  );
}

function ProductDetailTabs({ product, activeTab, setActiveTab, inquiry, setInquiry, inquiries, submitInquiry, requireLogin, user, navigate, catalogProducts = products }) {
  const fallbackReviews = useMemo(() => createProductReviews(product, 16), [product]);
  const [reviews, setReviews] = useState(fallbackReviews);
  React.useEffect(() => {
    let active = true;
    fetch(`/api/products/${product.id}/reviews`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('review api failed')))
      .then((payload) => {
        if (!active) return;
        const rows = Array.isArray(payload.data) && payload.data.length > 0 ? payload.data : fallbackReviews;
        setReviews(rows);
      })
      .catch(() => {
        if (active) setReviews(fallbackReviews);
      });
    return () => {
      active = false;
    };
  }, [product.id, fallbackReviews]);
  const recommendations = catalogProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 10);
  const tabs = [
    ['info', '정보', null],
    ['recommend', '추천', recommendations.length],
    ['review', '스냅·후기', product.reviews],
    ['inquiry', '문의', inquiries.length],
  ];

  return (
    <section className="detailTabSection">
      <div className="contentsTabs" aria-label="상품 상세 탭">
        {tabs.map(([key, label, count]) => (
          <button className={activeTab === key ? 'active' : ''} type="button" key={key} onClick={() => setActiveTab(key)}>
            {label}{count !== null && <span>{count.toLocaleString('ko-KR')}</span>}
          </button>
        ))}
      </div>
      {activeTab === 'info' && <ProductInfoTab product={product} />}
      {activeTab === 'recommend' && (
        <div className="productGrid">
          {recommendations.map((item) => (
            <ProductCard key={item.id} product={item} navigate={navigate} />
          ))}
        </div>
      )}
      {activeTab === 'review' && <ProductReviewSection product={product} reviews={reviews} />}
      {activeTab === 'inquiry' && (
        <form className="detailSubPanel inquiryBox" onSubmit={submitInquiry}>
          <h2>제품 문의</h2>
          <div>
            <input
              value={inquiry}
              onFocus={() => !user && requireLogin?.(`/products/${product.id}`, '제품 문의 작성은 회원만 이용할 수 있습니다.')}
              onChange={(event) => setInquiry(event.target.value)}
              placeholder="상품, 배송, 사이즈를 문의하세요"
            />
            <button className="secondaryButton" type="submit">문의</button>
          </div>
          <div className="inquiryList">
            {inquiries.map((item, index) => (
              <p key={`${item}-${index}`}>Q. {item}<span>답변 대기</span></p>
            ))}
          </div>
        </form>
      )}
    </section>
  );
}

function ProductInfoTab({ product }) {
  return (
    <div className="productInfoTab">
      <section className="detailSubPanel">
        <h2>상품 정보</h2>
        <p>{product.description}</p>
        <dl>
          <div><dt>브랜드</dt><dd>{product.brand}</dd></div>
          <div><dt>카테고리</dt><dd>{product.category}</dd></div>
          <div><dt>배송</dt><dd>오늘 출발 · 무료배송</dd></div>
          <div><dt>교환/반품</dt><dd>수령 후 7일 이내 접수 가능</dd></div>
        </dl>
      </section>
      <section className="detailSubPanel">
        <h2>상세 이미지</h2>
        <div className="infoImageStack">
          {product.detailImages.map((image, index) => (
            <img src={image} alt={`${product.name} 정보 이미지 ${index + 1}`} key={image} onError={(event) => { event.currentTarget.src = fallbackImage(product.name); }} />
          ))}
        </div>
      </section>
      <section className="detailSubPanel">
        <h2>판매자 정보</h2>
        <p>{product.brand} 공식 파트너 · 평균 응답 18분 · 반품 주소 서울시 성동구 VUL 물류센터</p>
      </section>
    </div>
  );
}

function ProductReviewSection({ product, reviews: initialReviews = createProductReviews(product, 16) }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [body, setBody] = useState('');
  const [nickname, setNickname] = useState('리뷰어');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  React.useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);
  const photoReviews = reviews.slice(0, 8);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!body.trim()) return;
    try {
      let response;
      if (file) {
        const formData = new FormData();
        formData.append('nickname', nickname);
        formData.append('rating', '5');
        formData.append('body', body);
        formData.append('file', file);
        response = await fetch(`/api/products/${product.id}/reviews`, {
          method: 'POST',
          headers: authHeaders(),
          body: formData,
        });
      } else {
        response = await fetch(`/api/products/${product.id}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname,
            rating: 5,
            body,
            imageUrl: product.image,
          }),
        });
      }
      const payload = await response.json();
      setReviews((items) => [payload.data, ...items]);
      setBody('');
      setFile(null);
      setMessage('리뷰가 등록되었습니다.');
    } catch (error) {
      setMessage(`리뷰 등록 실패: ${error.message}`);
    }
  };

  return (
    <section className="productReviewSection">
      <div className="pageHeader">
        <div>
          <h1>사진 리뷰</h1>
          <p>{product.name} 구매자가 남긴 리뷰 {product.reviews.toLocaleString('ko-KR')}개 중 대표 후기를 보여드립니다.</p>
        </div>
        <span><Star size={16} fill="currentColor" /> {product.rating}</span>
      </div>
      <div className="photoReviewGrid">
        {photoReviews.map((review) => (
          <article key={review.id}>
            <img src={review.image || product.image} alt={`${review.nickname} 사진 리뷰`} />
            <div>
              <strong>{review.nickname}</strong>
              <small>{review.rating} · {review.createdAt}</small>
            </div>
          </article>
        ))}
      </div>
      <form className="reviewWriteBox" onSubmit={submitReview}>
        <div>
          <input value={nickname} onChange={(event) => setNickname(event.target.value)} aria-label="리뷰 닉네임" />
          <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="구매 후기를 남겨주세요" />
          <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </div>
        <button className="secondaryButton" type="submit">리뷰 등록</button>
        {message && <small>{message}</small>}
      </form>
      <div className="textReviewList">
        {reviews.map((review) => (
          <article key={review.id}>
            <div>
              <strong>{review.nickname}</strong>
              <span><Star size={14} fill="currentColor" /> {review.rating} · {review.createdAt}</span>
            </div>
            <p dangerouslySetInnerHTML={{ __html: review.body }} />
          </article>
        ))}
      </div>
    </section>
  );
}

function CartPage({ cart, navigate, updateCartQuantity }) {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>장바구니</h1>
          <p>담아둔 상품과 수량을 확인하세요.</p>
        </div>
        <span>{cart.length}개 상품</span>
      </div>
      {cart.length === 0 ? (
        <EmptyState title="장바구니가 비어 있습니다" action="상품 보러가기" onClick={() => navigate('/recommend')} />
      ) : (
        <div className="cartLayout">
          <div className="lineItemList">
            {cart.map((item) => (
              <article className="lineItem" key={item.product.id}>
                <img src={item.product.image} alt={item.product.name} />
                <div>
                  <strong>{item.product.brand}</strong>
                  <h2>{item.product.name}</h2>
                  <b>{formatPrice(item.product.price)}</b>
                </div>
                <div className="quantityControl compact">
                  <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} aria-label="수량 감소">
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} aria-label="수량 증가">
                    <Plus size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
          <aside className="summaryPanel">
            <span>상품 금액</span>
            <b>{formatPrice(total)}</b>
            <span>배송비</span>
            <b>무료</b>
            <div className="totalRow">
              <span>결제 예정 금액</span>
              <b>{formatPrice(total)}</b>
            </div>
            <button className="primaryButton" onClick={() => navigate('/checkout')}>주문하기</button>
          </aside>
        </div>
      )}
    </section>
  );
}

function WishlistPage({ wishlist, navigate, toggleWishlist }) {
  return (
    <section className="listingPage">
      <div className="pageHeader">
        <div>
          <h1>찜</h1>
          <p>관심 있는 상품을 모아봤습니다.</p>
        </div>
        <span>{wishlist.length}개 상품</span>
      </div>
      {wishlist.length === 0 ? (
        <EmptyState title="찜한 상품이 없습니다" action="상품 보러가기" onClick={() => navigate('/recommend')} />
      ) : (
        <div className="productGrid">
          {wishlist.map((product) => (
            <div className="wishlistItem" key={product.id}>
              <ProductCard product={product} navigate={navigate} />
              <button onClick={() => toggleWishlist(product)}>삭제</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MyPage({ user, cart, wishlist, coupons, navigate, logout }) {
  const purchaseItems = [
    {
      id: 'VUL-20260506-001',
      product: products[0],
      size: 'L',
      quantity: 1,
      status: '배송 중',
      delivery: 'CJ대한통운 5849-1204-7721',
      orderedAt: '2026.05.06',
    },
    {
      id: 'VUL-20260502-014',
      product: products[5],
      size: '270',
      quantity: 1,
      status: '배송 완료',
      delivery: '한진택배 4331-8820-1350',
      orderedAt: '2026.05.02',
    },
  ];

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>마이페이지</h1>
          <p>{user.name}님의 쇼핑 활동을 확인하세요.</p>
        </div>
      </div>
      <div className="myGrid">
        <article>
          <span>이메일</span>
          <strong>{user.email}</strong>
        </article>
        <article>
          <span>장바구니</span>
          <strong>{cart.reduce((sum, item) => sum + item.quantity, 0)}개</strong>
        </article>
        <article>
          <span>찜</span>
          <strong>{wishlist.length}개</strong>
        </article>
        <article>
          <span>보유 쿠폰</span>
          <strong>{coupons.length}장</strong>
        </article>
        <article>
          <span>마일리지</span>
          <strong>18,400P</strong>
        </article>
      </div>
      <div className="mypageActions">
        <button className="secondaryButton" onClick={() => navigate('/cart')}>장바구니</button>
        <button className="secondaryButton" onClick={() => navigate('/wishlist')}>찜 보기</button>
        <button className="secondaryButton" onClick={() => navigate('/coupons')}>쿠폰함</button>
        <button className="secondaryButton" onClick={() => navigate('/mileage')}>마일리지</button>
        <button className="secondaryButton" onClick={() => navigate('/delivery')}>배송조회</button>
        <button className="primaryButton" onClick={() => navigate('/recommend')}>쇼핑 계속하기</button>
        <button className="textButton" onClick={logout}>로그아웃</button>
      </div>
      <section className="purchaseHistoryBox">
        <div className="sectionTitle">
          <h2>구매내역</h2>
          <button onClick={() => navigate('/delivery')}>배송조회</button>
        </div>
        {purchaseItems.map((order) => (
          <article className="orderHistoryCard" key={order.id}>
            <img src={order.product.image} alt={order.product.name} onError={(event) => { event.currentTarget.src = fallbackImage(order.product.name); }} />
            <div>
              <span>{order.orderedAt} · 주문번호 {order.id}</span>
              <h3>{order.product.name}</h3>
              <p>사이즈 {order.size} · {order.quantity}개 · {formatPrice(order.product.price * order.quantity)}</p>
              <strong>{order.status}</strong>
              <small>{order.delivery}</small>
            </div>
            <button className="secondaryButton" onClick={() => navigate('/delivery')}>상세조회</button>
          </article>
        ))}
      </section>
    </section>
  );
}

function CouponPage({ userCoupons, issueCoupon, navigate }) {
  const availableCoupons = couponCatalog.filter((coupon) => !userCoupons.some((owned) => owned.id === coupon.id));

  return (
    <section className="couponPage">
      <div className="pageHeader">
        <div>
          <h1>쿠폰</h1>
          <p>보유 쿠폰과 발급 가능한 쿠폰을 확인하세요.</p>
        </div>
        <button className="secondaryButton" onClick={() => navigate('/mypage')}>마이페이지</button>
      </div>
      <div className="couponLayout">
        <section className="couponPanel">
          <div className="sectionTitle">
            <h2>보유 쿠폰</h2>
            <span>{userCoupons.length}장</span>
          </div>
          <div className="couponList">
            {userCoupons.map((coupon) => (
              <article className="couponCard owned" key={coupon.id}>
                <strong>{coupon.discount}</strong>
                <div>
                  <h3>{coupon.title}</h3>
                  <p>{coupon.detail}</p>
                </div>
                <span>보유중</span>
              </article>
            ))}
          </div>
        </section>
        <section className="couponPanel">
          <div className="sectionTitle">
            <h2>발급 가능한 쿠폰</h2>
            <span>{availableCoupons.length}장</span>
          </div>
          <div className="couponList">
            {availableCoupons.map((coupon) => (
              <article className="couponCard" key={coupon.id}>
                <strong>{coupon.discount}</strong>
                <div>
                  <h3>{coupon.title}</h3>
                  <p>{coupon.detail}</p>
                </div>
                <button onClick={() => issueCoupon(coupon)}>발급</button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function MileagePage({ navigate, user }) {
  const histories = [
    ['상품 구매 적립', '+2,900P', '2026.05.05'],
    ['출석체크 보너스', '+500P', '2026.05.04'],
    ['리뷰 작성 적립', '+1,000P', '2026.05.02'],
    ['주문 사용', '-6,000P', '2026.04.28'],
  ];

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>마일리지</h1>
          <p>{user?.name || '회원'}님의 적립과 사용 내역입니다.</p>
        </div>
        <strong>18,400P</strong>
      </div>
      <div className="infoGrid">
        <article><span>이번 달 적립</span><strong>4,400P</strong></article>
        <article><span>사용 가능</span><strong>18,400P</strong></article>
        <article><span>소멸 예정</span><strong>1,200P</strong></article>
      </div>
      <div className="dataPanel">
        {histories.map(([title, amount, date]) => (
          <div className="dataRow" key={`${title}-${date}`}>
            <span>{title}</span>
            <strong>{amount}</strong>
            <em>{date}</em>
          </div>
        ))}
      </div>
      <button className="secondaryButton inlineAction" onClick={() => navigate('/mypage')}>마이페이지로</button>
    </section>
  );
}

function LikesPage({ navigate, posts }) {
  const likedPosts = posts.slice(0, 12);

  return (
    <section className="communityPage">
      <div className="pageHeader">
        <div>
          <h1>좋아요</h1>
          <p>관심 있게 본 커뮤니티 글과 스타일을 모았습니다.</p>
        </div>
        <span>{likedPosts.length}개</span>
      </div>
      <div className="communityGrid">
        {likedPosts.map((post) => (
          <article className="communityCard" key={post.id} onClick={() => navigate(`/community/${post.id}`)}>
            <img src={post.image} alt={post.title} onError={(event) => { event.currentTarget.src = fallbackImage(post.title); }} />
            <div>
              <span>{post.author} · {post.createdAt}</span>
              <h2>{post.title}</h2>
              <small>좋아요 {post.likes}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewPage({ navigate }) {
  const reviews = products.slice(0, 12).map((product, index) => ({
    product,
    text: [
      '핏이 안정적이고 사진보다 실물이 더 깔끔합니다. 데일리로 자주 입게 돼요.',
      '배송 빠르고 포장도 괜찮았습니다. 사이즈는 정사이즈에 가까워요.',
      '할인할 때 사면 만족도 높습니다. 원단감도 가격 대비 탄탄한 편입니다.',
    ][index % 3],
  }));

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>리뷰</h1>
          <p>구매자가 남긴 착용감과 사이즈 후기를 확인하세요.</p>
        </div>
        <span>{reviews.length}개 리뷰</span>
      </div>
      <div className="reviewGrid">
        {reviews.map(({ product, text }) => (
          <article key={product.id} onClick={() => navigate(`/products/${product.id}`)}>
            <img src={product.image} alt={product.name} onError={(event) => { event.currentTarget.src = fallbackImage(product.name); }} />
            <div>
              <strong>{product.brand}</strong>
              <h2>{product.name}</h2>
              <p>{text}</p>
              <small><Star size={14} fill="currentColor" /> {product.rating} · 리뷰 {product.reviews.toLocaleString('ko-KR')}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PrivacyPage({ navigate }) {
  const tables = [
    {
      title: '개인정보 수집·이용',
      columns: ['구분', '수집 항목', '이용 목적', '보유 기간'],
      rows: [
        ['통합회원', '이름, 이메일, 비밀번호, 휴대폰번호, 주소', '회원 식별, 로그인 유지, 주문/배송, 쿠폰·마일리지 제공', '탈퇴 요청 5일 후 파기'],
        ['주문/결제', '구매자 정보, 수령인 정보, 배송지, 결제수단, 결제금액, 승인번호', '주문 처리, 결제 승인, 배송, 환불, 분쟁 대응', '전자상거래법 기준 5년'],
        ['커뮤니티', '닉네임, 게시글, 댓글, 이미지, 좋아요 내역', '게시글 노출, 커뮤니티 운영, 신고 및 제재 처리', '삭제 또는 탈퇴 요청 시 파기'],
        ['고객센터', '문의 제목, 내용, 첨부파일, 답변, 상담 처리 이력', '1:1 문의 처리, QNA 답변, 분쟁 대응', '소비자 불만 처리 기록 3년'],
        ['입점업체', '회사명, 대표자명, 사업자번호, 담당자 연락처, 판매 카테고리', '입점 상담, 파트너 승인, 정산 및 상품 운영', '상담 완료 또는 계약 종료 후 파기'],
      ],
    },
    {
      title: '제3자 제공 및 처리위탁',
      columns: ['제공/위탁 대상', '업무', '제공 항목', '보유 기간'],
      rows: [
        ['판매 파트너', '상품 배송, 반품, 고객 상담', '주문자명, 연락처, 배송지, 상품 구매 정보', '배송/반품 완료 후 180일'],
        ['VUL Payments', '카드·무통장 결제 대행, 환불 처리', '결제금액, 결제수단, 승인번호, 환불계좌', '관계 법령에 따른 기간'],
        ['VUL Fulfillment Korea', '물류, 출고, 배송추적', '수령인명, 연락처, 주소, 운송장 번호', '배송 완료 후 180일'],
        ['VUL CS Center', '상담 시스템 운영 및 알림 발송', '회원 식별정보, 문의 내용, 답변 이력', '상담 완료 후 3년'],
        ['VUL Cloud Lab', '클라우드 인프라, 로그 보관, 백업', '서비스 로그, 접근기록, 감사 로그', '위탁계약 종료 시 파기'],
      ],
    },
    {
      title: '법령에 따른 보존',
      columns: ['법적 근거', '보존 항목', '보존 기간', '비고'],
      rows: [
        ['전자상거래법', '계약 또는 청약철회 기록', '5년', '주문 취소와 반품 분쟁 대응'],
        ['전자상거래법', '대금결제 및 재화 공급 기록', '5년', '결제, 배송, 정산 검증'],
        ['전자상거래법', '소비자 불만 또는 분쟁 처리 기록', '3년', '고객센터 문의 포함'],
        ['통신비밀보호법', '접속 로그, IP, 접속 일시', '3개월', '보안 사고 대응'],
        ['내부 방침', '부정 이용 및 보안 진단 기록', '1년', '중복 가입, 권한 우회, 실습 진행도 확인'],
      ],
    },
  ];
  const sections = [
    ['총칙', 'VUL Shop은 회원의 개인정보를 중요하게 생각하며 개인정보 보호 관련 법령과 전자상거래 서비스 운영 기준을 준수합니다. 본 방침은 회원가입, 상품 구매, 커뮤니티, 고객센터, 판매자 입점 신청, 취약점 진단 실습 과정에서 처리되는 개인정보의 항목, 목적, 보관 기간, 위탁 및 권리 행사 방법을 설명합니다.'],
    ['수집 항목', '회원가입 시 이름, 이메일, 비밀번호, 전화번호, 주소를 수집합니다. 상품 구매 시 수령인, 배송지, 주문 상품, 결제 수단, 결제 승인 상태, 쿠폰 및 마일리지 사용 내역, 배송 상태, 운송장 번호를 처리합니다. 커뮤니티 이용 시 닉네임, 게시글, 댓글, 업로드 이미지, 좋아요 기록을 처리할 수 있습니다. 고객센터 이용 시 문의 제목, 문의 내용, 첨부파일, 답변 내역이 저장됩니다. 판매자 입점 신청 시 회사명, 대표자명, 담당자 이메일, 연락처, 사업자등록번호, 판매 카테고리, 입점 소개를 수집합니다.'],
    ['자동 수집 항목', '서비스 이용 과정에서 접속 일시, 요청 URL, 브라우저 정보, IP 주소, 기기 식별 정보, 인증 토큰, 오류 로그, 관리자 처리 이력, 보안 진단 진행 기록이 자동으로 생성될 수 있습니다. 쿠키 또는 로컬 스토리지는 로그인 유지, 장바구니 상태, 최근 주문 확인, 취약점 진행도 표시를 위해 사용될 수 있습니다.'],
    ['이용 목적', '수집한 정보는 회원 식별과 로그인 유지, 상품 주문과 배송, 결제 확인, 환불 및 반품 처리, 쿠폰과 마일리지 제공, 고객 문의 답변, 커뮤니티 운영, 판매자 입점 심사, 상품 승인, 서비스 부정 이용 방지, 보안 사고 대응, 취약점 진단 시나리오 재현과 이행조치 검증을 위해 사용합니다.'],
    ['보관 기간', '회원 정보는 회원 탈퇴 또는 실습 데이터 초기화 요청 시 삭제합니다. 다만 주문, 결제, 배송, 정산, 환불, 분쟁 처리에 필요한 정보는 전자상거래 및 회계 관련 기준에 따라 일정 기간 분리 보관할 수 있습니다. 고객 문의와 CS 답변 내역은 분쟁 대응과 서비스 품질 관리를 위해 보관할 수 있으며, 보안 로그와 감사 로그는 접근 통제 및 침해사고 분석 목적으로 별도 보관할 수 있습니다.'],
    ['파기 절차', '보관 목적이 달성된 개인정보는 복구하기 어려운 방식으로 삭제합니다. 전자 파일은 재생할 수 없는 기술적 방법으로 삭제하고, 출력물은 분쇄 또는 파쇄합니다. 실습용 Docker 환경에서는 볼륨 삭제 또는 초기화 스크립트 실행으로 테스트 데이터를 제거할 수 있습니다.'],
    ['위탁처리 고지', '배송 업무는 VUL Fulfillment Korea, 결제 처리는 VUL Payments, 고객상담은 VUL CS Center, 클라우드 및 로그 보관은 VUL Cloud Lab에 위탁할 수 있습니다. 위탁사는 계약된 목적 범위 안에서만 개인정보를 처리하며, VUL Shop은 위탁 업무 수행 여부와 보호 조치를 점검합니다.'],
    ['제3자 제공', 'VUL Shop은 회원 동의, 법령상 의무, 배송 수행, 결제 승인, 분쟁 해결, 수사기관의 적법한 요청 등 필요한 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다. 제공이 필요한 경우 제공받는 자, 제공 목적, 제공 항목, 보유 기간을 사전에 고지합니다.'],
    ['국외 이전', '현재 기본 실습 환경에서는 개인정보를 국외로 이전하지 않습니다. 향후 AWS 등 외부 클라우드 리전을 사용할 경우 이전 국가, 이전 일시와 방법, 이전받는 자, 이용 목적, 보관 기간을 별도로 고지합니다.'],
    ['회원 권리', '회원은 자신의 개인정보 열람, 정정, 삭제, 처리 정지, 동의 철회를 요청할 수 있습니다. 요청은 마이페이지 또는 고객센터를 통해 접수할 수 있으며, 본인 확인 후 지체 없이 처리합니다. 단, 법령상 보관이 필요한 정보는 삭제가 제한될 수 있습니다.'],
    ['아동 개인정보', 'VUL Shop은 만 14세 미만 아동의 회원가입을 기본적으로 허용하지 않습니다. 관련 정보가 수집된 사실을 확인한 경우 법정대리인 확인 절차를 거쳐 삭제 또는 처리 정지를 진행합니다.'],
    ['안전성 확보 조치', '접근 권한 관리, 관리자 권한 분리, 감사 로그 기록, 전송 구간 암호화, 비밀번호 해시 저장, 파일 업로드 제한, 중요 설정의 환경변수 분리, 데이터베이스 접근 통제, 백업 데이터 보호를 적용합니다. 다만 본 프로젝트는 취약점 진단 실습을 위해 일부 약한 설정과 진단용 API를 포함할 수 있으며, 운영 배포 시 이행조치가 필요합니다.'],
    ['개인정보보호책임자', '개인정보보호책임자는 VUL Shop Security Manager이며, 문의는 security@vulshop.local 또는 고객센터 1644-9072로 접수할 수 있습니다. 개인정보 침해 신고, 분쟁 조정, 권리 행사와 관련한 요청은 고객센터 페이지를 통해 처리합니다.'],
    ['방침 변경', '본 개인정보처리방침은 서비스 구조, 법령, 위탁사, 보안 정책 변경에 따라 수정될 수 있습니다. 중요한 변경이 있는 경우 서비스 공지사항 또는 이메일을 통해 사전에 안내합니다. 시행일은 2026년 5월 6일입니다.'],
  ];

  return (
    <section className="policyPage">
      <PolicyHero
        navigate={navigate}
        title="개인정보처리방침 (전문)"
        description="VUL Shop은 전자상거래, 커뮤니티, 판매자 입점, 고객센터, 보안 진단 실습 서비스를 제공하며 정보주체의 개인정보와 권리를 보호하기 위해 개인정보 처리 기준을 공개합니다."
        actionLabel="홈"
        actionPath="/"
        meta={[
          ['고지일자', '2026년 05월 06일'],
          ['시행일자', '2026년 05월 06일'],
          ['보호책임자', 'VUL Shop Security Manager'],
          ['고객센터', '1644-9072 · security@vulshop.local'],
        ]}
      />
      <PolicyTables tables={tables} />
      <PolicyDocument sections={sections} />
    </section>
  );
}

function TermsPage({ navigate }) {
  const tables = [
    {
      title: '주문 라이프사이클',
      columns: ['단계', '상태', '처리 주체', '회원 확인 항목'],
      rows: [
        ['1', '주문접수', '회원/시스템', '상품명, 옵션, 수량, 배송지, 쿠폰 사용 여부'],
        ['2', '결제완료', '결제대행사/회사', '결제수단, 결제금액, 승인번호, 입금 확인'],
        ['3', '상품준비', '판매자', '재고 확인, 출고 예정일, 송장 준비'],
        ['4', '출고완료', '판매자/물류사', '운송장 번호, 택배사, 출고 시간'],
        ['5', '배송중/배송완료', '택배사', '배송 현황, 수령지, 배송 완료 시간'],
        ['6', '구매확정/반품', '회원/회사/판매자', '확정, 교환, 반품, 환불 처리 내역'],
      ],
    },
    {
      title: '교환·반품·환불 기준',
      columns: ['구분', '신청 가능 기간', '배송비 부담', '제한 사유'],
      rows: [
        ['단순 변심', '수령 후 7일 이내', '회원 부담', '사용 흔적, 세탁, 훼손, 구성품 누락'],
        ['상품 불량', '수령 후 3개월 또는 인지 후 30일 이내', '회사 또는 판매자 부담', '고의 훼손, 착용 후 오염'],
        ['오배송', '수령 후 7일 이내', '회사 또는 판매자 부담', '상품 훼손, 구성품 누락'],
        ['환불', '회수 및 검수 완료 후', '결제수단별 처리', '입금자명 불일치, 환불계좌 오류'],
      ],
    },
    {
      title: '서비스 이용 제한 기준',
      columns: ['유형', '예시', '조치', '기록 보관'],
      rows: [
        ['계정 부정 이용', '타인 계정 사용, 허위 가입, 인증 우회', '로그인 제한, 회원 제재', '감사 로그 1년'],
        ['결제/쿠폰 조작', '금액 변조, 쿠폰 중복 사용, 마일리지 부정 적립', '주문 취소, 혜택 회수', '거래 기록 5년'],
        ['커뮤니티 위반', '욕설, 개인정보 노출, 스크립트 삽입, 광고성 게시글', '게시글 삭제, 이용 제한', '처리 기록 3년'],
        ['진단 범위 초과', '허용 환경 외 공격, 외부 인프라 공격', '서비스 차단, 관리자 검토', '보안 로그 1년'],
      ],
    },
  ];
  const sections = [
    ['제1조 목적', '본 약관은 VUL Shop이 제공하는 쇼핑몰, 커뮤니티, 쿠폰, 마일리지, 고객센터, 판매자 입점, 보안 진단 실습 서비스의 이용 조건과 절차, 회원과 회사의 권리·의무 및 책임 사항을 정하는 것을 목적으로 합니다.'],
    ['제2조 용어의 정의', '회원은 본 약관에 동의하고 서비스를 이용하는 자를 말합니다. 판매자는 입점 신청 후 관리자 승인을 받아 상품을 등록하는 사업자를 말합니다. 주문은 회원이 상품 구매를 신청하고 결제 절차를 진행하는 행위를 말합니다. 취약점 진단 기능은 보안 학습과 검증을 위해 제공되는 실습용 기능을 의미합니다.'],
    ['제3조 약관의 게시와 변경', '회사는 본 약관을 서비스 하단 또는 별도 정책 페이지에 게시합니다. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 중요한 변경이 있는 경우 적용일 7일 전부터 공지합니다. 회원에게 불리하거나 중대한 변경은 30일 전부터 고지할 수 있습니다.'],
    ['제4조 회원가입과 계정 관리', '회원은 이름, 이메일, 비밀번호, 전화번호, 주소를 입력하여 가입할 수 있습니다. 회원은 자신의 계정 정보를 최신 상태로 유지해야 하며, 계정과 비밀번호 관리 책임은 회원에게 있습니다. 계정 도용 또는 무단 사용을 확인한 경우 즉시 고객센터에 알려야 합니다.'],
    ['제5조 서비스 이용', '회원은 상품 조회, 검색, 장바구니, 찜, 주문, 결제, 리뷰, 커뮤니티, 쿠폰, 마일리지, 고객센터 기능을 이용할 수 있습니다. 구매, 찜, 글쓰기, 판매자 상품 등록, 마이페이지, 배송조회 등 일부 기능은 로그인 후 이용할 수 있습니다.'],
    ['제6조 상품 정보와 가격', '상품명, 이미지, 상세 설명, 가격, 할인율, 재고, 배송 정보는 판매자 또는 회사가 등록한 정보를 기준으로 표시됩니다. 표시 오류, 시스템 장애, 가격 입력 오류가 확인된 경우 회사는 주문을 취소하거나 정정 안내를 할 수 있습니다.'],
    ['제7조 주문과 결제', '회원은 상품, 옵션, 수량, 배송지, 쿠폰, 마일리지, 결제 수단을 확인한 뒤 주문할 수 있습니다. 결제 수단은 카드, 무통장 입금, 마일리지 결제를 지원합니다. 주문은 주문접수, 결제완료, 상품준비, 출고완료, 배송중, 배송완료, 구매확정 또는 반품 단계로 관리됩니다.'],
    ['제8조 카드 결제', '카드 결제 시 카드사, 카드번호, 유효기간, CVC 등 결제에 필요한 정보를 입력할 수 있습니다. 결제 승인 실패, 한도 초과, 카드사 장애가 발생한 경우 주문이 완료되지 않을 수 있습니다. 카드 정보 저장 기능은 회원의 동의가 있는 경우에만 제공됩니다.'],
    ['제9조 무통장 입금', '무통장 입금은 회사가 안내한 계좌로 주문 금액을 입금해야 하며, 입금자명과 주문자명이 다른 경우 확인이 지연될 수 있습니다. 지정된 기간 안에 입금이 확인되지 않으면 주문은 자동 취소될 수 있습니다.'],
    ['제10조 쿠폰과 마일리지', '쿠폰과 마일리지는 발급 조건, 사용 기간, 최소 주문 금액, 중복 사용 가능 여부에 따라 제한될 수 있습니다. 부정한 방법으로 쿠폰 또는 마일리지를 취득하거나 결제 금액을 조작한 경우 회사는 주문 취소, 혜택 회수, 이용 제한을 할 수 있습니다.'],
    ['제11조 배송정책', '배송은 주문 상품의 판매자, 물류 상태, 지역, 택배사 사정에 따라 달라질 수 있습니다. 기본 배송비는 상품 정책에 따라 무료 또는 유료로 표시됩니다. 배송조회는 주문번호와 운송장 번호를 기준으로 제공되며, 외부 택배사 상태 반영에는 지연이 있을 수 있습니다.'],
    ['제12조 청약철회', '회원은 상품 수령 후 7일 이내 청약철회를 신청할 수 있습니다. 다만 사용 흔적, 세탁, 훼손, 구성품 누락, 시간 경과로 재판매가 어려운 상품, 맞춤 제작 상품, 위생상 반품이 제한되는 상품은 청약철회가 제한될 수 있습니다.'],
    ['제13조 교환·반품·환불', '교환 또는 반품은 마이페이지 또는 고객센터를 통해 신청할 수 있습니다. 단순 변심 반품은 왕복 배송비가 부과될 수 있으며, 상품 불량 또는 오배송은 회사 또는 판매자가 배송비를 부담합니다. 환불은 회수 및 검수 완료 후 결제 수단별 기준에 따라 처리됩니다.'],
    ['제14조 리뷰와 커뮤니티', '회원은 구매 상품에 대한 리뷰를 작성하거나 커뮤니티에 게시글과 이미지를 등록할 수 있습니다. 욕설, 명예훼손, 광고, 저작권 침해, 개인정보 노출, 악성 스크립트 삽입 등 부적절한 콘텐츠는 사전 통보 없이 삭제되거나 이용 제한될 수 있습니다.'],
    ['제15조 판매자 입점', '판매자는 입점 신청서를 제출하고 관리자 승인을 받은 뒤 상품 등록을 요청할 수 있습니다. 상품은 승인 절차를 거쳐 전시되며, 회사는 상품 정보, 이미지, 가격, 재고, 배송 정책이 기준에 맞지 않는 경우 승인을 보류하거나 반려할 수 있습니다.'],
    ['제16조 관리자 운영', '회사는 회원 관리, 파트너 승인, 상품 승인, 주문 상태 변경, 정산 처리, 쿠폰 발급, 이벤트 운영, CS 답변, 감사 로그 확인 등 서비스 운영에 필요한 관리 기능을 수행할 수 있습니다. 운영 처리 내역은 감사와 분쟁 대응을 위해 기록될 수 있습니다.'],
    ['제17조 금지행위', '회원은 타인의 계정 도용, 결제 정보 조작, 쿠폰·마일리지 부정 사용, 비정상적인 요청 자동화, 서비스 장애 유발, 관리자 권한 우회, 취약점 진단 범위를 넘어선 공격 행위, 개인정보 수집 또는 외부 유출을 해서는 안 됩니다.'],
    ['제18조 취약점 진단 실습', '본 서비스는 보안 학습을 위한 취약점 진단 시나리오를 포함할 수 있습니다. 진단은 허용된 로컬 또는 지정 Docker 환경에서만 수행해야 하며, 실제 제3자 서비스, 외부 사용자, 외부 인프라를 대상으로 한 공격 행위는 금지됩니다.'],
    ['제19조 서비스 제한과 중단', '회사는 시스템 점검, 장애 대응, 보안 사고, 법령상 요구, 부정 이용 확인, 운영상 필요가 있는 경우 서비스의 전부 또는 일부를 제한하거나 중단할 수 있습니다. 긴급한 경우 사후 공지할 수 있습니다.'],
    ['제20조 책임 제한', '회사는 천재지변, 네트워크 장애, 회원 귀책 사유, 판매자 귀책 사유, 외부 결제사 또는 택배사 장애로 발생한 손해에 대해 관련 법령이 허용하는 범위 안에서 책임을 제한할 수 있습니다.'],
    ['제21조 분쟁 해결', '분쟁 발생 시 회원은 고객센터를 통해 문의할 수 있으며, 회사는 주문 내역, 결제 내역, 배송 내역, 상담 기록을 검토해 처리합니다. 필요한 경우 전자상거래 소비자분쟁해결기준, 소비자보호원, 관할 기관의 조정 절차를 따릅니다.'],
    ['제22조 준거법과 관할', '본 약관은 대한민국 법령을 기준으로 해석하며, 서비스 이용과 관련한 소송은 민사소송법상 관할 법원에 제기합니다. 본 약관의 시행일은 2026년 5월 6일입니다.'],
  ];

  return (
    <section className="policyPage">
      <PolicyHero
        navigate={navigate}
        title="이용약관 (전문)"
        description="본 약관은 VUL Shop 쇼핑몰, 커뮤니티, 판매자 입점, 고객센터, 결제·배송, 취약점 진단 실습 서비스의 이용 조건과 운영 기준을 정합니다."
        actionLabel="고객센터"
        actionPath="/cs"
        meta={[
          ['시행일자', '2026년 05월 06일'],
          ['서비스', '쇼핑몰 · 커뮤니티 · 파트너센터'],
          ['분쟁 기준', '전자상거래 소비자분쟁해결기준'],
          ['문의', '1644-9072 · support@vulshop.local'],
        ]}
      />
      <PolicyTables tables={tables} />
      <PolicyDocument sections={sections} />
    </section>
  );
}

function PolicyHero({ navigate, title, description, actionLabel, actionPath, meta }) {
  return (
    <section className="policyHero">
      <button className="backButton" onClick={() => window.history.length > 1 ? window.history.back() : navigate('/')}>이전 페이지로 이동</button>
      <div>
        <span>VUL Shop</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="policyMetaGrid">
        {meta.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <button className="secondaryButton" onClick={() => navigate(actionPath)}>{actionLabel}</button>
    </section>
  );
}

function PolicyTables({ tables }) {
  return (
    <div className="policyTableStack">
      {tables.map((table) => (
        <section className="policyTableCard" key={table.title}>
          <h2>{table.title}</h2>
          <div className="policyTable" style={{ '--policy-columns': `repeat(${table.columns.length}, minmax(150px, 1fr))` }}>
            <div className="policyTableHeader">
              {table.columns.map((column) => <strong key={column}>{column}</strong>)}
            </div>
            {table.rows.map((row) => (
              <div className="policyTableRow" key={row.join('-')}>
                {row.map((cell, index) => <span key={`${cell}-${index}`}>{cell}</span>)}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function PolicyDocument({ sections }) {
  return (
    <div className="policyLayout">
      <aside>
        {sections.map(([title], index) => (
          <a href={`#policy-${index}`} key={title}>{title}</a>
        ))}
      </aside>
      <article>
        {sections.map(([title, body], index) => (
          <section id={`policy-${index}`} key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
      </article>
    </div>
  );
}

function PartnerApplyPage({ navigate }) {
  const [form, setForm] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessNo: '',
    salesCategory: 'outer',
    memo: '',
  });
  const [submitted, setSubmitted] = useState(null);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: key === 'phone' ? formatPhone(value) : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/partners/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const payload = await response.json();
    setSubmitted(payload.data || form);
  };

  return (
    <section className="authPage">
      <form className="authCard wide" onSubmit={submit}>
        <h1>파트너 입점 신청</h1>
        <label>회사명<input value={form.companyName} onChange={(event) => update('companyName', event.target.value)} placeholder="주식회사 VUL Partner" /></label>
        <label>대표자명<input value={form.ownerName} onChange={(event) => update('ownerName', event.target.value)} placeholder="홍길동" /></label>
        <label>담당자 이메일<input value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="seller@example.com" /></label>
        <label>연락처<input value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="010-1234-5678" /></label>
        <label>사업자등록번호<input value={form.businessNo} onChange={(event) => update('businessNo', event.target.value)} placeholder="123-45-67890" /></label>
        <label>판매 카테고리<select value={form.salesCategory} onChange={(event) => update('salesCategory', event.target.value)}><option value="outer">아우터</option><option value="top">상의</option><option value="pants">팬츠</option><option value="sneakers">스니커즈</option></select></label>
        <label>입점 소개<textarea value={form.memo} onChange={(event) => update('memo', event.target.value)} placeholder="브랜드 소개, 주요 상품, 물류 가능 범위를 입력하세요." /></label>
        {submitted && <p className="formSuccess">입점 신청이 접수되었습니다. 관리자가 `/root/partners`에서 승인할 수 있습니다.</p>}
        <button className="primaryButton" type="submit">입점 신청</button>
        <button className="secondaryButton" type="button" onClick={() => navigate('/')}>홈으로</button>
      </form>
    </section>
  );
}

function PartnerRequiredPage({ navigate }) {
  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>판매자 권한 필요</h1>
          <p>파트너 입점 신청이 관리자에게 승인된 계정만 상품을 등록할 수 있습니다.</p>
        </div>
        <button className="primaryButton" onClick={() => navigate('/partners/apply')}>입점 신청</button>
      </div>
      <div className="dataPanel">
        <h2>권한 승인 절차</h2>
        <p>1. 파트너 입점 신청서를 제출합니다.</p>
        <p>2. 관리자가 `/root/partners`에서 신청 정보를 검토하고 승인합니다.</p>
        <p>3. 승인된 이메일 계정으로 다시 로그인하면 판매자 상품 등록 메뉴가 노출됩니다.</p>
      </div>
    </section>
  );
}

function SellerProductPage({ navigate, user }) {
  const emptyForm = {
    sellerEmail: user.email,
    category: 'outer',
    brand: '',
    name: '',
    price: '',
    imageUrl: '',
    description: '',
  };
  const [form, setForm] = useState({
    sellerEmail: user.email,
    category: 'outer',
    brand: '',
    name: '',
    price: '',
    imageUrl: '',
    description: '',
  });
  const [submittedItems, setSubmittedItems] = useState([]);
  const [message, setMessage] = useState('');

  const loadProducts = React.useCallback(async () => {
    const response = await fetch(`/api/seller/products?sellerEmail=${encodeURIComponent(user.email)}`, { headers: authHeaders() });
    const payload = await response.json();
    setSubmittedItems(payload.data || []);
  }, [user.email]);

  React.useEffect(() => {
    loadProducts().catch(() => {});
  }, [loadProducts]);

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/seller/products', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const payload = await response.json();
    setSubmittedItems((items) => [payload.data || form, ...items]);
    setForm(emptyForm);
    setMessage('상품 등록 신청이 접수되었습니다. 관리자 승인 후 전시됩니다.');
    loadProducts().catch(() => {});
  };

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>판매자 상품 등록</h1>
          <p>등록한 상품은 관리자 승인 후 전시됩니다.</p>
        </div>
        <button className="secondaryButton" onClick={() => navigate('/part')}>파트너 홈</button>
      </div>
      <div className="checkoutLayout">
        <form className="formPanel" onSubmit={submit}>
          <h2>상품 정보</h2>
          <label>판매자 이메일<input value={form.sellerEmail} onChange={(event) => update('sellerEmail', event.target.value)} /></label>
          <label>카테고리<select value={form.category} onChange={(event) => update('category', event.target.value)}><option value="outer">아우터</option><option value="top">상의</option><option value="pants">팬츠</option><option value="sneakers">스니커즈</option></select></label>
          <label>브랜드<input value={form.brand} onChange={(event) => update('brand', event.target.value)} placeholder="브랜드명" /></label>
          <label>상품명<input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="상품명" /></label>
          <label>판매가<input value={form.price} onChange={(event) => update('price', event.target.value.replace(/\D/g, ''))} placeholder="89000" /></label>
          <label>대표 이미지 URL<input value={form.imageUrl} onChange={(event) => update('imageUrl', event.target.value)} placeholder="https://..." /></label>
          <label>상품 설명<textarea value={form.description} onChange={(event) => update('description', event.target.value)} /></label>
          {message && <p className="formSuccess">{message}</p>}
          <button className="primaryButton" type="submit">승인 요청</button>
        </form>
        <aside className="dataPanel">
          <h2>등록 요청 내역</h2>
          {submittedItems.length === 0 ? <p>아직 요청한 상품이 없습니다.</p> : submittedItems.map((item, index) => (
            <div className="dataRow" key={`${item.name}-${index}`}>
              <span>{item.brand} {item.name}</span>
              <strong>{item.approvalStatus || 'PENDING'}</strong>
              <em>{item.price ? formatPrice(Number(item.price)) : '-'}</em>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}

function PartnerCenterPage({ navigate, path, user }) {
  const section = path.split('/')[2] || 'dashboard';
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settlements, setSettlements] = useState([]);

  const load = React.useCallback(async () => {
    const params = `sellerEmail=${encodeURIComponent(user.email)}`;
    const [productResponse, orderResponse, settlementResponse] = await Promise.all([
      fetch(`/api/seller/products?${params}`, { headers: authHeaders() }),
      fetch(`/api/seller/orders?${params}`, { headers: authHeaders() }),
      fetch(`/api/seller/settlements?${params}`, { headers: authHeaders() }),
    ]);
    const [productPayload, orderPayload, settlementPayload] = await Promise.all([
      productResponse.json(),
      orderResponse.json(),
      settlementResponse.json(),
    ]);
    setProducts(productPayload.data || []);
    setOrders(orderPayload.data || []);
    setSettlements(settlementPayload.data || []);
  }, [user.email]);

  React.useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const updateOrder = async (row, status) => {
    await fetch(`/api/seller/orders/${row.recordKey}/status`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const confirmSettlement = async (row) => {
    await fetch(`/api/seller/settlements/${row.recordKey}/confirm`, {
      method: 'POST',
      headers: authHeaders(),
    });
    load();
  };

  const menu = [
    ['dashboard', '대시보드'],
    ['products', '상품 관리'],
    ['orders', '주문 관리'],
    ['settlements', '정산'],
    ['support', '문의/공지'],
  ];

  const stats = [
    ['승인 요청 상품', `${products.length}개`],
    ['처리 주문', `${orders.length}건`],
    ['정산 예정', `${settlements.length}건`],
    ['파트너 상태', 'APPROVED'],
  ];

  return (
    <section className="partnerShell">
      <aside className="partnerSidebar">
        <strong>Partner Center</strong>
        <p>{user.email}</p>
        <nav>
          {menu.map(([key, label]) => (
            <button className={section === key ? 'active' : ''} key={key} onClick={() => navigate(key === 'dashboard' ? '/part' : `/part/${key}`)}>
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="partnerMain">
        <div className="pageHeader">
          <div>
            <h1>{menu.find(([key]) => key === section)?.[1] || '파트너 센터'}</h1>
            <p>승인된 파트너가 상품 등록, 주문 처리, 정산 현황을 관리하는 공간입니다.</p>
          </div>
          <button className="secondaryButton" onClick={() => navigate('/')}>쇼핑몰로</button>
        </div>
        {section === 'products' ? (
          <SellerProductPage navigate={navigate} user={user} />
        ) : section === 'orders' ? (
          <PartnerDataPanel title="주문 관리" rows={orders} empty="아직 배정된 주문이 없습니다." actionLabel="배송 준비 처리" onAction={(row) => updateOrder(row, 'PREPARING_PRODUCT')} />
        ) : section === 'settlements' ? (
          <PartnerDataPanel title="정산 관리" rows={settlements} empty="정산 예정 내역이 없습니다." actionLabel="정산 확인" onAction={confirmSettlement} />
        ) : section === 'support' ? (
          <div className="partnerGrid">
            <article className="dataPanel">
              <h2>파트너 공지</h2>
              <p>5월 정산 마감일은 2026.05.31 18:00입니다.</p>
              <p>대표 이미지에는 상품 단독 컷과 착용 컷을 함께 등록해 주세요.</p>
            </article>
            <article className="dataPanel">
              <h2>운영 문의</h2>
              <textarea placeholder="상품 승인, 정산, 배송 이슈를 문의하세요." />
              <button className="primaryButton">문의 등록</button>
            </article>
          </div>
        ) : (
          <>
            <div className="myGrid">
              {stats.map(([label, value]) => (
                <article key={label}><span>{label}</span><strong>{value}</strong></article>
              ))}
            </div>
            <div className="partnerGrid">
              <PartnerDataPanel title="최근 상품 승인 요청" rows={products.slice(0, 5)} empty="상품 승인 요청이 없습니다." />
              <PartnerDataPanel title="최근 주문" rows={orders.slice(0, 5)} empty="최근 주문이 없습니다." />
            </div>
          </>
        )}
      </main>
    </section>
  );
}

function PartnerDataPanel({ title, rows, empty, actionLabel, onAction }) {
  return (
    <article className="dataPanel">
      <h2>{title}</h2>
      {rows.length === 0 ? <p>{empty}</p> : rows.map((row, index) => {
        const payload = safeJson(row.payloadJson);
        const label = row.name || row.recordKey || payload.orderNo || payload.productName || `${title}-${index + 1}`;
        return (
          <div className="dataRow" key={row.id || `${label}-${index}`}>
            <span>{label}</span>
            <strong>{row.approvalStatus || row.status || payload.status || 'PENDING'}</strong>
            <em>{payload.amount ? formatPrice(Number(payload.amount)) : row.price ? formatPrice(Number(row.price)) : '상세'}</em>
            {actionLabel && <button className="secondaryButton" onClick={() => onAction?.(row)}>{actionLabel}</button>}
          </div>
        );
      })}
    </article>
  );
}

function CsPage({ navigate, user }) {
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ title: '', body: '' });
  const [openFaq, setOpenFaq] = useState(0);
  const faqs = [
    ['배송은 보통 얼마나 걸리나요?', '결제 완료 후 상품 준비가 시작되며 일반 상품은 평균 1~2영업일 안에 출고됩니다. 도서산간 지역, 판매자 직배송 상품, 예약 배송 상품은 더 오래 걸릴 수 있습니다.'],
    ['무통장 입금은 언제 확인되나요?', '입금자명과 주문자명이 같으면 평균 10분 안에 자동 확인됩니다. 이름이 다르거나 금액이 다르면 고객센터에서 수동 확인이 필요합니다.'],
    ['교환/반품은 언제까지 가능한가요?', '상품 수령 후 7일 이내 신청할 수 있습니다. 착용 흔적, 세탁, 훼손, 구성품 누락, 재판매 불가 상태인 경우 제한될 수 있습니다.'],
    ['쿠폰과 마일리지를 같이 사용할 수 있나요?', '상품별 정책에 따라 다릅니다. 주문서에서 적용 가능한 쿠폰과 마일리지가 자동으로 표시되며, 일부 이벤트 쿠폰은 중복 사용이 제한됩니다.'],
    ['리뷰 이미지를 수정하거나 삭제할 수 있나요?', '마이페이지의 리뷰 내역에서 수정/삭제할 수 있습니다. 부적절한 이미지, 개인정보 노출, 저작권 침해 이미지는 관리자에 의해 숨김 처리될 수 있습니다.'],
    ['판매자 입점 신청 후 언제 승인되나요?', '관리자가 사업자 정보, 판매 카테고리, 상품 운영 가능 여부를 검토합니다. 승인되면 해당 이메일 계정에 판매자 상품 등록 권한이 부여됩니다.'],
    ['배송조회 상태가 멈춰 있어요.', '택배사 연동 지연으로 실제 이동보다 늦게 반영될 수 있습니다. 24시간 이상 상태가 변하지 않으면 고객센터로 주문번호를 남겨주세요.'],
    ['결제 금액이 다르게 보입니다.', '쿠폰, 마일리지, 배송비, 즉시 할인 적용 여부에 따라 최종 결제 금액이 달라질 수 있습니다. 주문 전 결제 페이지의 최종 금액을 기준으로 확인해주세요.'],
  ];

  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    const record = {
      recordKey: `CS-${Date.now()}`,
      status: 'PENDING',
      title: form.title,
      body: form.body,
      answer: '',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const stored = JSON.parse(localStorage.getItem(`vulshop.cs.${user.email}`) || '[]');
    localStorage.setItem(`vulshop.cs.${user.email}`, JSON.stringify([record, ...stored]));
    const payload = new FormData();
    payload.append('userEmail', user.email);
    payload.append('title', form.title);
    payload.append('body', form.body);
    await fetch('/api/cs/inquiries', { method: 'POST', headers: authHeaders(), body: payload }).catch(() => {});
    setMessage('문의가 접수되었습니다.');
    setForm({ title: '', body: '' });
    navigate('/cs/my');
  };

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>고객센터</h1>
          <p>1:1 문의, QNA, 공지사항을 한 곳에서 확인하세요.</p>
        </div>
        <button className="secondaryButton" onClick={() => navigate('/cs/my')}>내 문의</button>
      </div>
      <div className="csLayout">
        <article className="dataPanel">
          <h2>자주 묻는 질문</h2>
          <div className="faqList">
            {faqs.map(([question, answer], index) => (
              <section className={openFaq === index ? 'open' : ''} key={question}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <strong>Q. {question}</strong>
                  <span>{openFaq === index ? '닫기' : '보기'}</span>
                </button>
                {openFaq === index && <p>A. {answer}</p>}
              </section>
            ))}
          </div>
        </article>
        <form className="formPanel" onSubmit={submit}>
          <h2>1:1 문의</h2>
          <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="문의 제목" />
          <textarea value={form.body} onChange={(event) => setForm((current) => ({ ...current, body: event.target.value }))} placeholder="문의 내용을 입력하세요" />
          {message && <p className="formSuccess">{message}</p>}
          <button className="primaryButton" type="submit">문의 등록</button>
        </form>
      </div>
    </section>
  );
}

function MyInquiryPage({ navigate, user }) {
  const defaultItems = [
    {
      recordKey: 'CS-20260506-001',
      status: 'ANSWERED',
      title: '무통장 입금 확인 문의',
      body: '입금 완료 체크를 했는데 배송 준비로 넘어가는지 궁금합니다.',
      answer: '입금 확인 후 평균 10분 안에 결제완료 상태로 전환됩니다. 지연 시 고객센터에서 수동 확인합니다.',
      createdAt: '2026.05.06',
    },
    {
      recordKey: 'CS-20260504-008',
      status: 'PENDING',
      title: '사이즈 교환 가능 여부',
      body: '스니커즈 270에서 280으로 교환하고 싶습니다.',
      answer: '',
      createdAt: '2026.05.04',
    },
  ];
  const [items, setItems] = useState(() => [
    ...JSON.parse(localStorage.getItem(`vulshop.cs.${user.email}`) || '[]'),
    ...defaultItems,
  ]);

  React.useEffect(() => {
    fetch(`/api/cs/inquiries?userEmail=${encodeURIComponent(user.email)}`, { headers: authHeaders() })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (Array.isArray(payload?.data)) {
          const localItems = JSON.parse(localStorage.getItem(`vulshop.cs.${user.email}`) || '[]');
          const remoteItems = payload.data.map((record) => {
            const parsed = safeJson(record.payloadJson);
            return {
              recordKey: record.recordKey,
              status: record.status,
              title: parsed.title || record.recordKey,
              body: parsed.body || record.payloadJson,
              answer: record.status === 'ANSWERED' ? (parsed.answer || '관리자가 답변을 등록했습니다.') : '',
              createdAt: record.createdAt?.slice(0, 10) || '',
            };
          });
          setItems([...localItems, ...remoteItems, ...defaultItems]);
        }
      })
      .catch(() => {});
  }, [user.email]);

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>내 문의</h1>
          <p>{user.name}님의 1:1 문의와 답변 내역입니다.</p>
        </div>
        <button className="secondaryButton" onClick={() => navigate('/cs')}>문의하기</button>
      </div>
      <div className="inquiryHistoryList">
        {items.map((item) => (
          <article key={item.recordKey}>
            <div>
              <span>{item.createdAt} · {item.recordKey}</span>
              <strong>{item.title}</strong>
              <em>{item.status === 'ANSWERED' ? '답변완료' : '답변대기'}</em>
            </div>
            <p>{item.body}</p>
            <section>
              <b>답변</b>
              <p>{item.answer || '아직 등록된 답변이 없습니다.'}</p>
            </section>
          </article>
        ))}
      </div>
    </section>
  );
}

function CheckoutPage({ cart, navigate, user, setLastOrderKey }) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedCoupon, setSelectedCoupon] = useState('cp-new-15');
  const [depositConfirmed, setDepositConfirmed] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const couponDiscount = selectedCoupon ? Math.round(total * 0.1) : 0;
  const paymentTotal = Math.max(0, total - couponDiscount);

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>결제</h1>
          <p>주문 상품, 배송지, 결제 정보를 확인하세요.</p>
        </div>
        <strong>{formatPrice(paymentTotal)}</strong>
      </div>
      <div className="checkoutLayout">
        <div className="dataPanel">
          <h2>주문 상품</h2>
          {cart.map((item) => (
            <article className="checkoutItem" key={item.product.id}>
              <img src={item.product.image} alt={item.product.name} onError={(event) => { event.currentTarget.src = fallbackImage(item.product.name); }} />
              <div>
                <strong>{item.product.brand}</strong>
                <h3>{item.product.name}</h3>
                <p>사이즈 M · {item.quantity}개</p>
              </div>
              <b>{formatPrice(item.product.price * item.quantity)}</b>
            </article>
          ))}
          <div className="checkoutCoupon">
            <label>
              쿠폰 사용
              <select value={selectedCoupon} onChange={(event) => setSelectedCoupon(event.target.value)}>
                <option value="">사용 안 함</option>
                <option value="cp-new-15">신규/주문 쿠폰 10% 할인</option>
                <option value="cp-free-ship">무료배송 쿠폰</option>
              </select>
            </label>
            <div>
              <span>상품 금액</span><b>{formatPrice(total)}</b>
              <span>쿠폰 할인</span><b>-{formatPrice(couponDiscount)}</b>
              <strong>최종 결제</strong><strong>{formatPrice(paymentTotal)}</strong>
            </div>
          </div>
        </div>
        <aside className="formPanel">
          <h2>배송/결제</h2>
          <label>사용자명<input defaultValue={user?.name || ''} placeholder="받는 사람" /></label>
          <label>주소<input defaultValue={user?.address || ''} placeholder="배송지" /></label>
          <label>
            결제 수단
            <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="card">카드 결제</option>
              <option value="bank">무통장 입금</option>
              <option value="point">마일리지 결제</option>
            </select>
          </label>
          {paymentMethod === 'card' && (
            <div className="paymentDetailBox">
              <label>카드 은행사<select defaultValue="shinhan"><option value="shinhan">신한카드</option><option value="kb">KB국민카드</option><option value="hyundai">현대카드</option><option value="lotte">롯데카드</option></select></label>
              <label>카드번호<input inputMode="numeric" placeholder="1234-5678-9012-3456" /></label>
              <label>유효기간<input placeholder="MM/YY" /></label>
              <label>CVC<input inputMode="numeric" placeholder="123" /></label>
              <button className="secondaryButton" type="button">카드등록</button>
            </div>
          )}
          {paymentMethod === 'bank' && (
            <div className="paymentDetailBox bankBox">
              <strong>입금 계좌</strong>
              <p>VUL Commerce · 우리은행 1005-804-202605</p>
              <p>입금자명은 주문자명과 동일해야 자동 확인됩니다.</p>
              <label className="checkLine"><input type="checkbox" checked={depositConfirmed} onChange={(event) => setDepositConfirmed(event.target.checked)} /> 입금 완료 확인</label>
            </div>
          )}
          {paymentMethod === 'point' && (
            <div className="paymentDetailBox">
              <p>보유 마일리지 18,400P 중 결제 가능 금액을 사용합니다.</p>
              <input defaultValue="18400" />
            </div>
          )}
          <div className="checkoutTotal">
            <span>결제 예정 금액</span>
            <strong>{formatPrice(paymentTotal)}</strong>
          </div>
          <button
            className="primaryButton"
            onClick={async () => {
              const response = await fetch('/api/orders/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders() },
                body: JSON.stringify({
                  userEmail: user.email,
                  receiverName: user.name,
                  address: user.address,
                  paymentMethod,
                  couponId: selectedCoupon,
                  total,
                  couponDiscount,
                  paymentTotal,
                  items: cart.map((item) => `${item.product.id}:${item.quantity}`).join(','),
                }),
              });
              const payload = await response.json();
              const recordKey = payload?.data?.recordKey || '';
              if (recordKey) {
                localStorage.setItem('vulshop.lastOrderKey', recordKey);
                setLastOrderKey(recordKey);
              }
              navigate(recordKey ? `/delivery?order=${encodeURIComponent(recordKey)}` : '/delivery');
            }}
            disabled={paymentMethod === 'bank' && !depositConfirmed}
          >
            {paymentMethod === 'bank' && !depositConfirmed ? '입금 확인 필요' : '결제하기'}
          </button>
        </aside>
      </div>
    </section>
  );
}

function DeliveryPage({ navigate, lastOrderKey }) {
  const orderKey = new URLSearchParams(window.location.search).get('order') || lastOrderKey;
  const steps = ['ORDER_RECEIVED', 'PAYMENT_COMPLETED', 'PREPARING', 'SHIPPED', 'IN_DELIVERY', 'DELIVERED', 'CONFIRMED'];
  const labels = ['주문 접수', '결제 완료', '상품 준비', '출고 완료', '배송 중', '배송 완료', '구매확정'];
  const [status, setStatus] = useState('ORDER_RECEIVED');
  const activeIndex = Math.max(0, steps.indexOf(status));

  React.useEffect(() => {
    if (!orderKey) return;
    fetch(`/api/orders/${encodeURIComponent(orderKey)}/delivery`, { headers: authHeaders() })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (payload?.data?.status) setStatus(payload.data.status);
      })
      .catch(() => {});
  }, [orderKey]);

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>배송조회</h1>
          <p>주문 {orderKey || 'VUL-20260506-001'}의 배송 상태입니다.</p>
        </div>
        <span>{labels[activeIndex]}</span>
      </div>
      <div className="deliveryTimeline">
        {labels.map((step, index) => (
          <article className={index <= activeIndex ? 'active' : ''} key={step}>
            <strong>{step}</strong>
            <p>{index <= activeIndex ? '처리 완료' : '대기 중'}</p>
          </article>
        ))}
      </div>
      <button className="secondaryButton inlineAction" onClick={() => navigate('/mypage')}>마이페이지로</button>
    </section>
  );
}

function LoginPage({ navigate, setUser, redirectTo = '/mypage', onDone }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    const nextEmail = email || 'member@vulshop.local';
    const next = String(new FormData(event.currentTarget).get('next') || redirectTo);
    try {
      const token = await requestAuth('/api/auth/login', { email: nextEmail, password, next });
      const role = nextEmail.includes('root') ? 'ADMIN' : nextEmail.includes('part') ? 'SELLER' : 'USER';
      setUser({ name: role === 'ADMIN' ? '관리자' : role === 'SELLER' ? '파트너' : 'VUL 회원', email: nextEmail, phone: '', address: '', token, role }, token);
      onDone?.();
      if (/^https?:\/\//i.test(next)) {
        window.location.href = next;
      } else {
        navigate(role === 'SELLER' && next === '/mypage' ? '/part' : next);
      }
    } catch (authError) {
      setError(authError.message);
    }
  };

  return (
    <section className="authPage">
      <form className="authCard" onSubmit={submit}>
        <h1>로그인</h1>
        <input type="hidden" name="next" defaultValue={redirectTo} />
        <label>이메일<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="formError">{error}</p>}
        <button className="primaryButton" type="submit">로그인</button>
        <button className="textButton" type="button" onClick={() => navigate('/register')}>회원가입</button>
      </form>
    </section>
  );
}

function LoginRequiredPage({ title, navigate, redirectTo = '/mypage', setLoginRedirect }) {
  const goLogin = () => {
    setLoginRedirect?.(redirectTo);
    navigate('/login');
  };

  const goRegister = () => {
    setLoginRedirect?.(redirectTo);
    navigate('/register');
  };

  return (
    <section className="loginRequiredPage">
      <div className="loginRequiredCard">
        <LockKeyhole size={32} />
        <h1>{title}</h1>
        <p>비로그인 상태에서는 상품 조회, 검색, 이벤트, 커뮤니티 게시글 읽기만 이용할 수 있습니다.</p>
        <div>
          <button className="primaryButton" onClick={goLogin}>로그인</button>
          <button className="secondaryButton" onClick={goRegister}>회원가입</button>
        </div>
      </div>
    </section>
  );
}

function RegisterPage({ navigate, setUser }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '', address: '' });
  const rules = [
    ['length', '8자 이상', form.password.length >= 8],
    ['upper', '대문자 포함', /[A-Z]/.test(form.password)],
    ['lower', '소문자 포함', /[a-z]/.test(form.password)],
    ['number', '숫자 포함', /\d/.test(form.password)],
    ['special', '특수문자 포함', /[^A-Za-z0-9]/.test(form.password)],
    ['match', '비밀번호 확인 일치', form.password.length > 0 && form.password === form.confirm],
  ];
  const valid = form.name && form.email && form.address && rules.every(([, , passed]) => passed);

  const update = (key, value) => {
    const nextValue = key === 'phone' ? formatPhone(value) : value;
    setForm((current) => ({ ...current, [key]: nextValue }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!valid) return;
    try {
      const token = await requestAuth('/api/auth/register', form);
      setUser({ name: form.name, email: form.email, phone: form.phone, address: form.address, token }, token);
      navigate('/mypage');
    } catch {
      setUser({ name: form.name, email: form.email, phone: form.phone, address: form.address });
      navigate('/mypage');
    }
  };

  return (
    <section className="authPage">
      <form className="authCard wide" onSubmit={submit}>
        <h1>회원가입</h1>
        <label>이름<input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="홍길동" /></label>
        <label>이메일<input value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="email@example.com" /></label>
        <label>비밀번호<input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} /></label>
        <label>비밀번호 확인<input type="password" value={form.confirm} onChange={(event) => update('confirm', event.target.value)} /></label>
        <div className="passwordRules">
          {rules.map(([key, label, passed]) => (
            <span className={passed ? 'passed' : ''} key={key}>
              {passed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
              {label}
            </span>
          ))}
        </div>
        <label>전화번호<input value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="010-1234-5678" maxLength={13} /></label>
        <label>주소<input value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="서울시 강남구 ..." /></label>
        <button className="primaryButton" type="submit" disabled={!valid}>가입하기</button>
        <button className="textButton" type="button" onClick={() => navigate('/login')}>이미 계정이 있어요</button>
      </form>
    </section>
  );
}

function CommunityPage({ posts, navigate, user, requireLogin }) {
  return (
    <section className="communityPage">
      <div className="pageHeader">
        <div>
          <h1>커뮤니티</h1>
          <p>데일리룩, 사이즈, 코디 고민을 편하게 나눠보세요.</p>
        </div>
        <button className="primaryButton" onClick={() => (user ? navigate('/community/write') : requireLogin('/community/write', '커뮤니티 글쓰기는 회원만 이용할 수 있습니다.'))}>글쓰기</button>
      </div>
      <div className="communityGrid">
        {posts.map((post) => (
          <article className="communityCard" key={post.id} onClick={() => navigate(`/community/${post.id}`)}>
            <img src={post.image} alt={post.title} onError={(event) => { event.currentTarget.src = fallbackImage(post.title); }} />
            <div>
              <span>{post.author} · {post.createdAt}</span>
              <h2>{post.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: post.body }}></p>
              <small>좋아요 {post.likes} · 댓글 {post.comments}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CommunityDetailPage({ post, navigate, user, requireLogin }) {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.replies);

  const submit = (event) => {
    event.preventDefault();
    if (!user) {
      requireLogin(`/community/${post.id}`, '댓글 작성은 회원만 이용할 수 있습니다.');
      return;
    }
    if (!comment.trim()) return;
    const body = comment.trim();
    fetch(`/api/community/posts/${post.numericId || String(post.id).replace('c-db-', '')}/comments`, {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: user.name, body }),
    })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => setComments(payload?.data?.replies || [body, ...comments]))
      .catch(() => setComments((items) => [body, ...items]));
    setComment('');
  };

  return (
    <section className="communityDetail">
      <button className="backButton" onClick={() => navigate('/community')}>커뮤니티로</button>
      <article className="communityPost">
        <img src={post.image} alt={post.title} onError={(event) => { event.currentTarget.src = fallbackImage(post.title); }} />
        <div>
          <span>{post.author} · {post.createdAt}</span>
          <h1>{post.title}</h1>
          <p dangerouslySetInnerHTML={{ __html: post.body }}></p>
          <small>좋아요 {post.likes} · 댓글 {comments.length}</small>
        </div>
      </article>
      <section className="commentPanel">
        <h2>댓글</h2>
        <form onSubmit={submit}>
          <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder={user ? '댓글을 입력해줘' : '로그인 후 댓글을 작성할 수 있어요'} />
          <button className="primaryButton" type="submit">등록</button>
        </form>
        <div className="commentList">
          {comments.map((item, index) => (
            <article key={`${item}-${index}`}>
              <strong>{index === 0 && item === comment ? '나' : `핏친구${index + 1}`}</strong>
              <p dangerouslySetInnerHTML={{ __html: item }}></p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function CommunityWritePage({ setCommunityPosts, navigate, user }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [preview, setPreview] = useState('');

  const upload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append('file', file);
      formData.append('usage', 'community');
      formData.append('userEmail', user.email);
      fetch('/api/files/upload', {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      }).catch(() => {});
    }
  };

  const submit = (event) => {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const nextPost = {
      title,
      body,
      author: user.name,
      image: preview || 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
      likes: 0,
      comments: 0,
      createdAt: '방금 전',
    };
    fetch('/api/community/posts', {
      method: 'POST',
      headers: { ...authHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(nextPost),
    })
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        setCommunityPosts((posts) => [payload?.data || { ...nextPost, id: `c-new-${Date.now()}`, replies: [] }, ...posts]);
        setTitle('');
        setBody('');
        setPreview('');
        navigate('/community');
      })
      .catch(() => {
        setCommunityPosts((posts) => [{ ...nextPost, id: `c-new-${Date.now()}`, replies: [] }, ...posts]);
        navigate('/community');
      });
  };

  return (
    <section className="authPage">
      <form className="authCard wide" onSubmit={submit}>
        <h1>커뮤니티 글쓰기</h1>
        <label>제목<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="오늘 코디 봐줘" /></label>
        <label>내용<textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="편하게 말하듯이 적어주세요." /></label>
        <label>이미지<input type="file" accept="image/*" onChange={upload} /></label>
        {preview && <img className="uploadPreview" src={preview} alt="업로드 미리보기" />}
        <button className="primaryButton" type="submit">등록하기</button>
      </form>
    </section>
  );
}

function EventPage({ navigate, products: eventProducts = [] }) {
  const eventCards = [
    ['STYLE WEEK', '최대 35% 시즌 특가', '인기 아우터와 팬츠를 이번 주 한정 가격으로 만나보세요.', '/sale'],
    ['CHECK-IN', '7일 출석 쿠폰팩', '매일 방문하면 장바구니 쿠폰과 마일리지가 쌓입니다.', '/event'],
    ['NEW MEMBER', '신규 회원 첫 구매 혜택', '가입 즉시 15% 쿠폰과 무료배송 혜택을 받을 수 있습니다.', '/register'],
    ['RANKING DEAL', '랭킹 상품 하루 특가', '오늘 많이 본 상품만 골라 특별가로 제안합니다.', '/ranking'],
  ];

  return (
    <section className="eventPage">
      <div className="eventHero">
        <div>
          <span>VUL SHOP EVENT</span>
          <h1>이번 주 혜택을 놓치지 마세요</h1>
          <p>쿠폰, 출석체크, 시즌 특가, 랭킹 딜을 한 번에 확인하고 바로 쇼핑할 수 있습니다.</p>
        </div>
        <button className="primaryButton" onClick={() => navigate('/sale')}>특가 상품 보기</button>
      </div>
      <div className="eventGrid">
        {eventCards.map(([label, title, body, path]) => (
          <article key={title}>
            <span>{label}</span>
            <h2>{title}</h2>
            <p>{body}</p>
            <button onClick={() => navigate(path)}>참여하기</button>
          </article>
        ))}
      </div>
      <div className="eventProducts">
        <div className="sectionTitle">
          <h2>이벤트 추천 상품</h2>
          <button onClick={() => navigate('/sale')}>전체보기</button>
        </div>
        <div className="productGrid">
          {[...eventProducts].sort((a, b) => b.discount - a.discount).slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
}

function NotFound({ navigate }) {
  return (
    <section className="notFound">
      <h1>상품을 찾을 수 없습니다</h1>
      <button className="primaryButton" onClick={() => navigate('/')}>홈으로 이동</button>
    </section>
  );
}

function EmptyState({ title, action, onClick }) {
  return (
    <div className="emptyState">
      <h2>{title}</h2>
      <button className="primaryButton" onClick={onClick}>{action}</button>
    </div>
  );
}

function RobotsProgressPage() {
  const [progress, setProgress] = useState(null);

  React.useEffect(() => {
    fetch('/api/easter-egg/progress')
      .then((response) => response.json())
      .then((payload) => setProgress(payload.data))
      .catch(() => setProgress({ found: 0, total: 50, buckets: [] }));
  }, []);

  return (
    <section className="commercePage">
      <div className="pageHeader">
        <div>
          <h1>robots.txt</h1>
          <p>취약점 진단 진행도입니다. 위치 정보는 공개하지 않고 유형별 발견 현황만 표시합니다.</p>
        </div>
        <strong>{progress ? `${progress.found}/${progress.total}` : '0/50'}</strong>
      </div>
      <div className="progressGrid">
        {(progress?.buckets || []).map((bucket) => (
          <article key={bucket.key}>
            <div>
              <strong>{bucket.label}</strong>
              <span>{bucket.found}/{bucket.total}</span>
            </div>
            <progress max={bucket.total} value={bucket.found}></progress>
          </article>
        ))}
      </div>
    </section>
  );
}

function rankedProducts(items = []) {
  return [...items].sort((a, b) => a.liveRank - b.liveRank);
}

function AdminLoginPage({ navigate, setAdmin, redirectTo = '/root' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    if (email !== 'root@vul.com' || password !== 'Rootroot1!') {
      setError('관리자 테스트 계정으로만 접근할 수 있습니다.');
      return;
    }
    try {
      const token = await requestAuth('/api/auth/login', { email, password });
      const nextAdmin = { email, name: '관리자', role: 'ADMIN', token };
      localStorage.setItem('vulshop.admin', JSON.stringify(nextAdmin));
      setAdmin(nextAdmin);
      navigate(redirectTo);
    } catch (authError) {
      setError(authError.message);
    }
  };

  return (
    <section className="adminLoginPage">
      <form className="authCard" onSubmit={submit}>
        <span>VUL Admin</span>
        <h1>관리자 로그인</h1>
        <p>관리자 페이지는 별도 인증 후 접근할 수 있습니다.</p>
        <label>이메일<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>비밀번호<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <p className="formError">{error}</p>}
        <button className="primaryButton" type="submit">관리자 로그인</button>
        <button className="textButton" type="button" onClick={() => navigate('/')}>쇼핑몰로 돌아가기</button>
      </form>
    </section>
  );
}

function AdminEntry({ navigate, path, admin, logout }) {
  const section = path.split('/')[2] || 'dashboard';
  const menu = [
    ['dashboard', '대시보드'],
    ['users', '회원 관리'],
    ['partners', '파트너 관리'],
    ['products', '상품 관리'],
    ['community', '커뮤니티 관리'],
    ['employees', '직원 관리'],
    ['orders', '주문 관리'],
    ['cs', 'CS 관리'],
    ['promotions', '프로모션'],
    ['analytics', '통계'],
    ['system', '시스템/보안'],
  ];
  const metrics = [
    ['오늘 매출', '12,840,000원', '+18.4%', '정상'],
    ['신규 주문', '128건', '+12건', '처리중'],
    ['승인 대기', '17개', '상품 검수', '주의'],
    ['미처리 문의', '9건', '평균 14분', '확인'],
  ];
  const queues = [
    ['상품 승인', '오버핏 후드 스웨트셔츠 옵션 이미지 검수', '높음'],
    ['배송 이슈', '주문 VUL-20260505-018 배송지 확인 필요', '중간'],
    ['커뮤니티 신고', '게시글 이미지 저작권 확인 요청', '낮음'],
    ['정산 확인', '파트너 RUNNER 주간 정산 검토', '중간'],
  ];
  const activities = [
    '관리자 root가 상품 p-1003 가격을 수정했습니다.',
    '신규 파트너 AURORA가 입점 신청을 제출했습니다.',
    '쿠폰 STYLE-WEEK-15가 326회 사용되었습니다.',
    '회원 핏감연구소의 1:1 문의가 접수되었습니다.',
  ];
  const adminSections = {
    users: {
      title: '회원 관리',
      desc: '회원 상태, 권한, 로그인 이력, 보유 쿠폰과 마일리지를 관리합니다.',
      rows: ['휴면 전환 대상 18명', '비밀번호 재설정 요청 7건', '신규 가입 회원 42명'],
    },
    partners: {
      title: '파트너 관리',
      desc: '입점 신청, 판매자 정보, 정산 계좌와 파트너 등급을 검수합니다.',
      rows: ['입점 신청 5건', '정산 계좌 재검증 2건', '파트너 등급 조정 4건'],
    },
    products: {
      title: '상품 관리',
      desc: '상품 등록/편집, 카테고리 전시, 재고, 창고, 승인 프로세스를 처리합니다.',
      rows: ['상품 승인 대기 17개', '품절 임박 SKU 36개', '전시 카테고리 변경 예약 8건'],
    },
    community: {
      title: '커뮤니티 관리',
      desc: '게시글, 댓글, 이미지 신고, 좋아요 이상 패턴을 모니터링합니다.',
      rows: ['이미지 신고 6건', '댓글 블라인드 요청 3건', '인기 게시글 24개'],
    },
    employees: {
      title: '직원 관리',
      desc: '운영자 계정, 직무, 근무 상태, 접근 권한을 관리합니다.',
      rows: ['신규 운영자 초대 2건', '권한 변경 요청 4건', '퇴사자 계정 잠금 1건'],
    },
    orders: {
      title: '주문 정산 관리',
      desc: '주문 라이프 사이클, 정산 시스템, 배송/물류 트래킹을 관리합니다.',
      rows: ['배송 지연 주문 12건', '정산 보류 3건', '환불 승인 대기 9건'],
    },
    cs: {
      title: 'CS 관리',
      desc: '1:1 문의, QNA, 교환/반품 요청을 처리합니다.',
      rows: ['미처리 1:1 문의 9건', '상품 QNA 답변 대기 14건', '반품 수거 예약 11건'],
    },
    promotions: {
      title: '마케팅 및 프로모션',
      desc: '쿠폰, 할인, 이벤트, 기획전, 광고 운영 상태를 관리합니다.',
      rows: ['발급 가능 쿠폰 5종', '진행 이벤트 4개', '광고 소재 심사 6건'],
    },
    analytics: {
      title: '데이터 분석 및 통계',
      desc: '매출 리포트, 사용자 행동 분석, 운영 대시보드를 확인합니다.',
      rows: ['전환율 3.8%', '장바구니 이탈률 41%', '오늘 매출 12,840,000원'],
    },
    system: {
      title: '시스템 관리 및 보안',
      desc: '권한 관리, 감사 로그, 보안 환경 설정, 시스템 설정을 관리합니다.',
      rows: ['감사 로그 2,184건', 'JWT 시크릿 환경변수 사용', 'MySQL 13306 포트 매핑'],
    },
  };

  const goHome = () => {
    if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <div>
          <button className="brand linkButton" onClick={() => navigate?.('/root')}>
            VUL Admin
          </button>
          <p>Commerce Control</p>
        </div>
        <nav aria-label="관리자 메뉴">
          {menu.map(([key, label]) => (
            <button className={section === key ? 'active' : ''} key={key} onClick={() => navigate?.(key === 'dashboard' ? '/root' : `/root/${key}`)}>
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="adminMain">
        <header className="adminHeader">
          <div>
            <p>오늘의 운영 현황</p>
            <h1>{section === 'dashboard' ? '커머스 대시보드' : adminSections[section]?.title || '관리자'}</h1>
          </div>
          <div className="adminHeaderActions">
            <span className="adminAccount">{admin?.email}</span>
            <button className="secondaryButton" onClick={() => navigate('/root/analytics')}>리포트</button>
            <button className="secondaryButton" onClick={logout}>로그아웃</button>
            <button className="primaryButton" onClick={goHome}>쇼핑몰로 이동</button>
          </div>
        </header>
        {section === 'partners' ? (
          <AdminApprovalPanel title="파트너 승인 관리" endpoint="/api/admin/partners" approvePath={(item) => `/api/admin/partners/${item.id}/approve`} revokePath={(item) => `/api/admin/partners/${item.id}/revoke`} label={(item) => `${item.companyName} · ${item.ownerName}`} />
        ) : section === 'products' ? (
          <AdminApprovalPanel title="판매자 상품 승인 관리" endpoint="/api/admin/products" approvePath={(item) => `/api/admin/products/${item.id}/approve`} revokePath={(item) => `/api/admin/products/${item.id}/revoke`} label={(item) => `${item.brand} · ${item.name}`} />
        ) : section !== 'dashboard' && adminSections[section] ? (
          <AdminSectionPanel sectionKey={section} section={adminSections[section]} />
        ) : (
          <>
          <section className="adminMetricGrid">
            {metrics.map(([label, value, delta, status]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <div>
                  <small>{delta}</small>
                  <em>{status}</em>
                </div>
              </article>
            ))}
          </section>
          <section className="adminWorkGrid">
          <article className="adminPanel wide">
            <div className="sectionTitle">
              <h2>운영 처리 큐</h2>
              <button onClick={() => navigate('/root/orders')}>전체보기</button>
            </div>
            <div className="adminQueue">
              {queues.map(([title, body, level]) => (
                <button key={body}>
                  <div>
                    <strong>{title}</strong>
                    <span>{body}</span>
                  </div>
                  <em>{level}</em>
                </button>
              ))}
            </div>
          </article>
          <article className="adminPanel">
            <div className="sectionTitle">
              <h2>시스템 상태</h2>
            </div>
            <div className="systemList">
              <span><b></b>API 8100 정상</span>
              <span><b></b>Frontend 3100 정상</span>
              <span><b></b>MySQL 13306 정상</span>
              <span><b></b>진단 시나리오 50개</span>
            </div>
          </article>
          <article className="adminPanel">
            <div className="sectionTitle">
              <h2>최근 활동</h2>
            </div>
            <div className="activityList">
              {activities.map((activity) => (
                <p key={activity}>{activity}</p>
              ))}
            </div>
          </article>
          <article className="adminPanel chartPanel">
            <div className="sectionTitle">
              <h2>시간대별 주문</h2>
            </div>
            <div className="barChart" aria-label="시간대별 주문 차트">
              {[42, 64, 38, 72, 88, 54, 93, 70].map((height, index) => (
                <span style={{ height: `${height}%` }} key={index}></span>
              ))}
            </div>
          </article>
          </section>
          </>
        )}
      </main>
    </div>
  );
}

function AdminApprovalPanel({ title, endpoint, approvePath, revokePath, label }) {
  const [items, setItems] = useState([]);

  const load = React.useCallback(async () => {
    const response = await fetch(endpoint, { headers: adminHeaders() });
    const payload = await response.json();
    setItems(payload.data || []);
  }, [endpoint]);

  React.useEffect(() => {
    load();
  }, [load]);

  const run = async (path) => {
    await fetch(path, { method: 'POST', headers: adminHeaders() });
    load();
  };

  return (
    <section className="adminSectionPage single">
      <article className="adminPanel wide">
        <div className="sectionTitle">
          <h2>{title}</h2>
          <button onClick={load}>새로고침</button>
        </div>
        <div className="adminTable">
          {items.length === 0 ? <p>항목이 없습니다.</p> : items.map((item, index) => (
            <div className="adminTableRow" key={item.id || index}>
              <strong>{String(index + 1).padStart(2, '0')} · {label(item)}</strong>
              <em>{item.status || item.approvalStatus || 'PENDING'}</em>
              <span>{item.email || item.sellerEmail || item.memo || item.description || '승인 상태를 관리합니다.'}</span>
              <div>
                <button className="secondaryButton" onClick={() => run(approvePath(item))}>승인</button>
                {revokePath && <button className="secondaryButton" onClick={() => run(revokePath(item))}>철회</button>}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

const adminOperationConfig = {
  users: {
    endpoint: '/api/admin/users',
    empty: '회원 데이터가 없습니다.',
    columns: ['대상', '상태', '상세'],
    label: (item) => `${item.name || '회원'} · ${item.email}`,
    status: (item) => item.status || 'ACTIVE',
    detail: (item) => `권한 ${item.role} · ${item.phone || '-'} · ${item.address || '-'}`,
    actions: [
      { label: '회원 제재', method: 'PUT', path: (item) => `/api/admin/users/${item.id || 1}`, body: () => ({ status: 'SANCTIONED', reason: '운영자 수동 제재' }) },
      { label: '정상 전환', method: 'PUT', path: (item) => `/api/admin/users/${item.id || 1}`, body: () => ({ status: 'ACTIVE', reason: '운영자 해제' }) },
    ],
  },
  community: {
    endpoint: '/api/admin/community/posts',
    empty: '커뮤니티 게시글이 없습니다.',
    columns: ['항목', '상태', '상세'],
    label: (item) => `${item.title || '게시글'} · ${item.author || '-'}`,
    status: (item) => `댓글 ${item.comments || 0}`,
    detail: (item) => item.body || '게시글 내용 없음',
    actions: [],
  },
  employees: {
    endpoint: '/api/admin/employees',
    empty: '직원 권한 변경 요청이 없습니다.',
    columns: ['직원', '상태', '상세'],
    label: (item) => item.recordKey || item.domain || 'employee-role',
    status: (item) => item.status || 'PENDING',
    detail: (item) => item.payloadJson || '운영자 권한 관리',
    createActions: [
      { label: '직원 계정 생성', path: '/api/admin/employees', body: (memo) => ({ email: `staff-${Date.now()}@vul.com`, team: '운영', role: 'CS_MANAGER', memo }) },
    ],
    actions: [
      { label: '정지', method: 'POST', path: (item) => `/api/admin/employees/${item.recordKey}/status`, body: () => ({ status: 'SUSPENDED', action: 'suspend' }) },
      { label: '승급', method: 'POST', path: (item) => `/api/admin/employees/${item.recordKey}/status`, body: () => ({ status: 'PROMOTED', role: 'MANAGER' }) },
      { label: '삭제', method: 'POST', path: (item) => `/api/admin/employees/${item.recordKey}/status`, body: () => ({ status: 'DELETED', action: 'delete' }) },
    ],
  },
  orders: {
    endpoint: '/api/admin/orders',
    empty: '주문 기록이 없습니다.',
    columns: ['주문번호', '상태', '상세'],
    label: (item) => item.recordKey || `order-${item.id}`,
    status: (item) => item.status,
    detail: (item) => item.payloadJson,
    actions: [
      { label: '결제완료', when: (item) => item.domainType === 'ORDER', method: 'POST', path: (item) => `/api/admin/orders/${item.recordKey}/status`, body: () => ({ status: 'PAYMENT_COMPLETED' }) },
      { label: '상품준비', when: (item) => item.domainType === 'ORDER', method: 'POST', path: (item) => `/api/admin/orders/${item.recordKey}/status`, body: () => ({ status: 'PREPARING_PRODUCT' }) },
      { label: '배송중', when: (item) => item.domainType === 'ORDER', method: 'POST', path: (item) => `/api/admin/orders/${item.recordKey}/status`, body: () => ({ status: 'SHIPPING' }) },
      { label: '배송완료', when: (item) => item.domainType === 'ORDER', method: 'POST', path: (item) => `/api/admin/orders/${item.recordKey}/status`, body: () => ({ status: 'DELIVERED' }) },
      { label: '구매확정', when: (item) => item.domainType === 'ORDER', method: 'POST', path: (item) => `/api/admin/orders/${item.recordKey}/status`, body: () => ({ status: 'CONFIRMED' }) },
      { label: '반품접수', when: (item) => item.domainType === 'ORDER', method: 'POST', path: (item) => `/api/admin/orders/${item.recordKey}/status`, body: () => ({ status: 'RETURN_REQUESTED' }) },
      { label: '정산확정', when: (item) => item.domainType === 'SETTLEMENT', method: 'POST', path: () => '/api/admin/settlements/confirm', body: (memo, item) => ({ recordKey: item.recordKey, amount: safeJson(item.payloadJson).amount, memo }) },
    ],
  },
  cs: {
    endpoint: '/api/admin/cs/inquiries',
    empty: '미처리 문의가 없습니다.',
    columns: ['문의번호', '상태', '상세'],
    label: (item) => item.recordKey || `cs-${item.id}`,
    status: (item) => item.status,
    detail: (item) => {
      const payload = safeJson(item.payloadJson);
      const title = payload.title || payload.subject || item.recordKey || '1:1 문의';
      const body = payload.body || payload.content || item.payloadJson || '';
      // VULN-007: attachmentName을 HTML 이스케이프 없이 렌더링 → 악의적 파일명으로 XSS 발동
      const attachment = payload.attachmentName || '';
      return `<strong>${title}</strong><br />${body}${attachment ? `<br />첨부파일: ${attachment}` : ''}`;
    },
    rawDetail: true,
    actions: [
      { label: '답변 등록', method: 'POST', path: (item) => `/api/admin/cs/inquiries/${item.recordKey}/answer`, body: (memo) => ({ answer: memo || '확인 후 안내드립니다.', answeredBy: 'root@vul.com' }) },
    ],
  },
  promotions: {
    endpoint: '/api/admin/promotions/coupons',
    empty: '발급된 쿠폰 기록이 없습니다.',
    columns: ['쿠폰', '상태', '상세'],
    label: (item) => item.recordKey || `coupon-${item.id}`,
    status: (item) => item.status || 'ISSUED',
    detail: (item) => item.payloadJson || '쿠폰 발급 기록',
    createActions: [
      { label: '전회원 쿠폰 발급', path: '/api/admin/promotions/coupons', body: (memo) => ({ userEmail: 'GLOBAL', title: '관리자 발급 쿠폰', discount: '15%', memo }) },
      { label: '이벤트 생성', path: '/api/admin/promotions/events', body: (memo) => ({ title: '관리자 생성 이벤트', reward: '출석 쿠폰팩', memo }) },
    ],
    actions: [],
  },
  analytics: {
    endpoint: '/api/admin/analytics/sales',
    empty: '분석할 주문 데이터가 없습니다.',
    columns: ['지표', '상태', '상세'],
    label: (item) => item.recordKey || `sales-${item.id}`,
    status: (item) => item.status,
    detail: (item) => item.payloadJson,
    actions: [],
  },
  system: {
    endpoint: '/api/admin/system/audit-logs',
    empty: '감사 로그 API가 준비되었습니다.',
    columns: ['로그', '상태', '상세'],
    label: (item) => item.recordKey || item.domain || 'audit-log',
    status: (item) => item.status || 'READY',
    detail: (item) => item.payloadJson || '권한/보안 설정과 감사 로그 확인',
    actions: [],
  },
};

function AdminSectionPanel({ sectionKey, section }) {
  const config = adminOperationConfig[sectionKey];
  const [items, setItems] = useState([]);
  const [memo, setMemo] = useState('');
  const [message, setMessage] = useState('');

  const load = React.useCallback(async () => {
    if (!config?.endpoint) return;
    try {
      const response = await fetch(config.endpoint, { headers: adminHeaders() });
      const payload = await response.json();
      const data = payload.data;
      if (Array.isArray(data)) {
        setItems(data);
      } else if (data) {
        setItems([data]);
      } else {
        setItems([]);
      }
      setMessage(payload.message || '관리 데이터를 불러왔습니다.');
    } catch (error) {
      setMessage(`관리 API 요청 실패: ${error.message}`);
    }
  }, [config]);

  React.useEffect(() => {
    load();
  }, [load]);

  const runAction = async (action, item = {}) => {
    try {
      const response = await fetch(action.path(item), {
        method: action.method || 'POST',
        headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(action.body?.(memo, item) || {}),
      });
      const payload = await response.json();
      setMessage(payload.message || `${action.label} 처리 완료`);
      setMemo('');
      load();
    } catch (error) {
      setMessage(`${action.label} 실패: ${error.message}`);
    }
  };

  const runCreateAction = async (action) => {
    try {
      const response = await fetch(action.path, {
        method: 'POST',
        headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(action.body(memo)),
      });
      const payload = await response.json();
      setMessage(payload.message || `${action.label} 처리 완료`);
      setMemo('');
      load();
    } catch (error) {
      setMessage(`${action.label} 실패: ${error.message}`);
    }
  };

  return (
    <section className="adminSectionPage">
      <article className="adminPanel wide">
        <div className="sectionTitle">
          <h2>{section.title}</h2>
          <button onClick={load}>새로고침</button>
        </div>
        <p>{section.desc}</p>
        {message && <p className="adminMessage">{message}</p>}
        <div className="adminTable">
          {items.length === 0 ? (
            section.rows.map((row, index) => (
              <button key={row}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{row}</strong>
                <em>{index === 0 ? '긴급' : '확인'}</em>
              </button>
            ))
          ) : (
            <>
              <div className="adminTableHead">
                {(config?.columns || ['대상', '상태', '상세']).map((column) => <strong key={column}>{column}</strong>)}
                <strong>작업</strong>
              </div>
              {items.map((item, index) => (
                <div className="adminTableRow" key={item.id || item.recordKey || index}>
                  <strong>{config.label(item)}</strong>
                  <em>{config.status(item)}</em>
                  {config.rawDetail ? <span dangerouslySetInnerHTML={{ __html: config.detail(item) }} /> : <span>{config.detail(item)}</span>}
                  <div>
                    {(config.actions || []).filter((action) => !action.when || action.when(item)).map((action) => (
                      <button className="secondaryButton" key={action.label} onClick={() => runAction(action, item)}>{action.label}</button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </article>
      <article className="adminPanel">
        <div className="sectionTitle">
          <h2>운영 액션</h2>
        </div>
        <textarea value={memo} onChange={(event) => setMemo(event.target.value)} placeholder={`${section.title} 처리 메모 또는 답변 내용을 입력하세요.`}></textarea>
        {(config?.createActions || []).map((action) => (
          <button className="primaryButton" key={action.label} onClick={() => runCreateAction(action)}>{action.label}</button>
        ))}
        {(!config?.createActions?.length && !config?.actions?.length) && <button className="primaryButton" onClick={load}>운영 데이터 갱신</button>}
      </article>
    </section>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
