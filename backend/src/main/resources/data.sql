-- VulShop 초기 데이터 시딩 (vul-web branch)
-- Spring Boot 시작 시 H2 / MySQL 환경에서 자동으로 실행됩니다.

-- =====================================
-- 1. 사용자 (password: Test1234! -> BCrypt)
-- =====================================
INSERT INTO users (email, password, name, phone, role, is_active, mileage, created_at, updated_at)
VALUES
  ('admin@vulshop.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lzmW', '관리자', '010-0000-0001', 'ROLE_ADMIN',  true, 0, NOW(), NOW()),
  ('user1@vulshop.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lzmW', '김민준', '010-1234-5678', 'ROLE_USER',   true, 5000, NOW(), NOW()),
  ('user2@vulshop.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lzmW', '이서연', '010-9876-5432', 'ROLE_USER',   true, 0, NOW(), NOW()),
  ('seller1@vulshop.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lzmW', '브랜드A운영자', '010-1111-2222', 'ROLE_SELLER', true, 0, NOW(), NOW());

-- =====================================
-- 2. 상품 (진단용 다양한 카테고리)
-- =====================================
INSERT INTO products (name, description, price, category, image_url, stock, created_at, updated_at)
VALUES
  ('오버사이즈 워싱 데님 자켓', '빈티지 워싱 처리로 자연스러운 멋을 연출한 오버핏 데님 자켓', 89000, 'outer',
   'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600', 50, NOW(), NOW()),
  ('프리미엄 코튼 화이트 티셔츠', '300g 두꺼운 코튼으로 만든 고급 베이직 티셔츠', 35000, 'top',
   'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 200, NOW(), NOW()),
  ('슬림핏 치노 팬츠', '스트레치 소재로 편안하고 깔끔한 슬림핏 치노 팬츠', 59000, 'bottom',
   'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600', 80, NOW(), NOW()),
  ('에어쿠션 러닝화', '고탄력 에어쿠션 밑창의 경량 러닝화', 129000, 'shoes',
   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 30, NOW(), NOW()),
  ('캔버스 토트백', '심플한 디자인의 데일리 캔버스 토트백', 45000, 'bag',
   'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600', 100, NOW(), NOW()),
  ('레더 크로스백', '고급 인조가죽 소재의 미니 크로스백', 75000, 'bag',
   'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600', 45, NOW(), NOW()),
  ('후드 집업 집퍼', '기모 안감의 따뜻한 후드 집업', 69000, 'outer',
   'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=600', 60, NOW(), NOW()),
  ('플리스 하프집업', '소프트 플리스 소재의 하프 집업 풀오버', 55000, 'top',
   'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600', 90, NOW(), NOW()),
  ('와이드 데님 팬츠', '편안한 와이드 핏의 스트레이트 데님 팬츠', 65000, 'bottom',
   'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', 70, NOW(), NOW()),
  ('첼시 부츠', '클래식한 첼시 부츠 스타일의 앵클 부츠', 99000, 'shoes',
   'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600', 25, NOW(), NOW());

-- =====================================
-- 3. 쿠폰
-- =====================================
INSERT INTO coupons (code, name, discount_amount, min_order_amount, is_active)
VALUES
  ('WELCOME10', '신규가입 1만원 할인', 10000, 30000, true),
  ('SALE-5000',  '5천원 할인 쿠폰',    5000,  20000, true),
  ('VIP-2026',   'VIP 2만원 할인',     20000, 100000, true),
  ('USED-TEST',  '이미 사용된 쿠폰',   10000, 10000,  false);

-- =====================================
-- 4. 커뮤니티 게시글 (Stored XSS 데모용 포함)
-- =====================================
INSERT INTO posts (title, content, author_id, created_at, updated_at)
VALUES
  ('스타일링 꿀팁 공유합니다', '<p>안녕하세요! 오늘 제가 즐겨 쓰는 스타일링 꿀팁을 공유할게요.</p><p>오버핏 자켓에 슬림 팬츠를 매치하면 균형잡힌 실루엣이 완성됩니다.</p>', 2, NOW(), NOW()),
  ('<img src=x onerror=alert(document.cookie)>', '<p>이 게시글의 제목에 XSS 페이로드가 삽입되어 있습니다. (Stored XSS 데모)</p><script>document.body.style.background="red"</script>', 2, NOW(), NOW()),
  ('요즘 핫한 무신사 셀러 추천', '<p>최근에 발견한 신생 브랜드들을 소개합니다. 가성비가 훌륭하네요!</p>', 3, NOW(), NOW());

-- =====================================
-- 5. 이벤트 (Race Condition 테스트용)
-- =====================================
INSERT INTO events (title, description, reward_mileage, max_participants, current_participants, created_at)
VALUES
  ('선착순 100명 5,000M 즉시 지급!', '동시성 취약점을 통해 100명을 초과하여 마일리지를 무한정 획득할 수 있습니다.', 5000, 100, 0, NOW());
