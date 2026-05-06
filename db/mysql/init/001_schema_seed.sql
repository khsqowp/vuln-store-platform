SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_code VARCHAR(60) NOT NULL,
  category VARCHAR(40) NOT NULL,
  brand VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  price INT NOT NULL,
  original_price INT NULL,
  discount_rate INT NULL,
  rating DOUBLE NULL,
  review_count INT NULL,
  ranking INT NULL,
  description VARCHAR(1000) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_products_product_code (product_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_images (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  image_url VARCHAR(1000) NOT NULL,
  image_type VARCHAR(30) NOT NULL,
  sort_order INT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_product_images_product_id (product_id),
  CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT NOT NULL AUTO_INCREMENT,
  product_id BIGINT NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  rating DOUBLE NOT NULL,
  body VARCHAR(1200) NOT NULL,
  image_url VARCHAR(1000) NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_reviews_product_id (product_id),
  CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(30) NULL,
  address VARCHAR(255) NULL,
  role VARCHAR(30) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_posts (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  body VARCHAR(4000) NOT NULL,
  author_nickname VARCHAR(80) NOT NULL,
  image_url VARCHAR(1000) NULL,
  like_count INT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS community_comments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  post_id BIGINT NOT NULL,
  author_nickname VARCHAR(80) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_community_comments_post_id (post_id),
  CONSTRAINT fk_community_comments_post FOREIGN KEY (post_id) REFERENCES community_posts(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS partner_applications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  company_name VARCHAR(120) NOT NULL,
  owner_name VARCHAR(80) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(40) NOT NULL,
  business_no VARCHAR(60) NOT NULL,
  sales_category VARCHAR(80) NOT NULL,
  status VARCHAR(30) NOT NULL,
  memo VARCHAR(1000) NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS seller_product_applications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  seller_email VARCHAR(160) NOT NULL,
  category VARCHAR(40) NOT NULL,
  brand VARCHAR(80) NOT NULL,
  name VARCHAR(160) NOT NULL,
  price INT NOT NULL,
  image_url VARCHAR(1000) NULL,
  description VARCHAR(1000) NULL,
  approval_status VARCHAR(30) NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS commerce_records (
  id BIGINT NOT NULL AUTO_INCREMENT,
  domain_type VARCHAR(50) NOT NULL,
  owner_key VARCHAR(160) NOT NULL,
  record_key VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL,
  payload_json LONGTEXT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  KEY idx_commerce_domain_owner (domain_type, owner_key),
  KEY idx_commerce_record_key (record_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_no VARCHAR(60) NOT NULL,
  user_email VARCHAR(160) NOT NULL,
  receiver_name VARCHAR(80) NOT NULL,
  address VARCHAR(255) NOT NULL,
  order_status VARCHAR(40) NOT NULL,
  delivery_status VARCHAR(40) NOT NULL,
  courier VARCHAR(80) NULL,
  tracking_no VARCHAR(80) NULL,
  total_amount INT NOT NULL,
  ordered_at DATETIME NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_orders_order_no (order_no)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  product_code VARCHAR(60) NOT NULL,
  product_name VARCHAR(160) NOT NULL,
  product_image VARCHAR(1000) NULL,
  size VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  unit_price INT NOT NULL,
  PRIMARY KEY (id),
  KEY idx_order_items_order_id (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO users (name, email, password_hash, phone, address, role, status, created_at) VALUES
('VUL 회원', 'member@vulshop.local', 'password123!', '010-1234-5678', '서울특별시 강남구 테헤란로 123', 'USER', 'ACTIVE', NOW()),
('관리자', 'admin@vulshop.local', 'admin123!', '010-0000-0001', '서울특별시 성동구 운영센터', 'ADMIN', 'ACTIVE', NOW()),
('판매자', 'seller@vulshop.local', 'seller123!', '010-0000-0002', '서울특별시 마포구 파트너센터', 'SELLER', 'ACTIVE', NOW()),
('관리자 테스트', 'root@vul.com', '3d6623bf4e0e098d7139131a5eba7a1f', '010-9000-0001', '서울특별시 강남구 관리자센터', 'ADMIN', 'ACTIVE', NOW()),
('파트너 테스트', 'part@vul.com', '5c7bc719c82e02364aaeaac78362e2c4', '010-9000-0002', '서울특별시 마포구 파트너센터', 'SELLER', 'ACTIVE', NOW()),
('일반 사용자 테스트', 'user@vul.com', '8469d3af7f7adee2fc6d3e60dd59830b', '010-9000-0003', '서울특별시 성동구 고객센터', 'USER', 'ACTIVE', NOW());

DROP PROCEDURE IF EXISTS seed_vul_products;
DELIMITER $$
CREATE PROCEDURE seed_vul_products()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE category_name VARCHAR(40);
  DECLARE product_code_value VARCHAR(60);
  DECLARE product_id_value BIGINT;
  DECLARE brand_name VARCHAR(80);
  DECLARE product_name_value VARCHAR(160);
  DECLARE product_price INT;
  DECLARE product_discount INT;
  DECLARE category_index INT DEFAULT 1;

  WHILE category_index <= 4 DO
    SET i = 1;
    SET category_name = CASE category_index WHEN 1 THEN 'outer' WHEN 2 THEN 'top' WHEN 3 THEN 'pants' ELSE 'sneakers' END;
    WHILE i <= 50 DO
      SET product_code_value = CONCAT('p-', category_name, '-', LPAD(i, 3, '0'));
      SET brand_name = ELT(1 + MOD(i, 10), 'NOMADIC', 'AURORA', 'GROUND', 'ORDINARY', 'SEASON', 'FRAME', 'RUNNER', 'STREET', 'MINUTE', 'COTTON WORKS');
      SET product_name_value = CONCAT(
        CASE category_name
          WHEN 'outer' THEN ELT(1 + MOD(i, 8), '라이트웨이트 블루종', '싱글 트렌치 코트', '니트 집업 가디건', '유틸리티 베스트', '윈드 쉘 재킷', '코튼 필드 재킷', '후드 파카', '워크 재킷')
          WHEN 'top' THEN ELT(1 + MOD(i, 8), '오버핏 셔츠', '후드 스웨트셔츠', '그래픽 티셔츠', '니트 풀오버', '롱슬리브 티셔츠', '카라 티셔츠', '하프 집업 맨투맨', '옥스포드 셔츠')
          WHEN 'pants' THEN ELT(1 + MOD(i, 8), '카고 팬츠', '와이드 데님 팬츠', '크롭 슬랙스', '밴딩 조거 팬츠', '치노 팬츠', '원턱 와이드 팬츠', '워크 데님 팬츠', '나일론 팬츠')
          ELSE ELT(1 + MOD(i, 8), '로우 스니커즈', '러닝 스니커즈', '캔버스 스니커즈', '테크 스니커즈', '레트로 스니커즈', '코트 스니커즈', '트레일 스니커즈', '슬립온 스니커즈')
        END,
        ' ', LPAD(i, 2, '0')
      );
      SET product_price = 24000 + MOD(i * 7300 + category_index * 11000, 118000);
      SET product_discount = 10 + MOD(i * 7 + category_index, 31);

      INSERT IGNORE INTO products (
        product_code, category, brand, name, price, original_price, discount_rate, rating, review_count, ranking, description
      ) VALUES (
        product_code_value,
        category_name,
        brand_name,
        product_name_value,
        product_price,
        ROUND(product_price / (1 - product_discount / 100) / 1000) * 1000,
        product_discount,
        4.3 + MOD(i, 7) / 10,
        120 + MOD(i * 137, 9300),
        (category_index - 1) * 50 + i,
        CONCAT(product_name_value, ' 상품입니다. Docker 초기 진단 환경에서 DB 기반으로 조회되는 시드 데이터입니다.')
      );

      SELECT id INTO product_id_value FROM products WHERE product_code = product_code_value LIMIT 1;

      INSERT IGNORE INTO product_images (product_id, image_url, image_type, sort_order) VALUES
      (product_id_value, CONCAT('https://loremflickr.com/900/1125/', CASE category_name WHEN 'outer' THEN 'jacket' WHEN 'top' THEN 'shirt' WHEN 'pants' THEN 'pants' ELSE 'sneakers' END, ',fashion?lock=', (category_index * 100 + i * 4 + 1)), 'MAIN', 1),
      (product_id_value, CONCAT('https://loremflickr.com/900/1125/', CASE category_name WHEN 'outer' THEN 'jacket' WHEN 'top' THEN 'shirt' WHEN 'pants' THEN 'pants' ELSE 'sneakers' END, ',fashion?lock=', (category_index * 100 + i * 4 + 2)), 'DETAIL', 2),
      (product_id_value, CONCAT('https://loremflickr.com/900/1125/', CASE category_name WHEN 'outer' THEN 'jacket' WHEN 'top' THEN 'shirt' WHEN 'pants' THEN 'pants' ELSE 'sneakers' END, ',fashion?lock=', (category_index * 100 + i * 4 + 3)), 'DETAIL', 3),
      (product_id_value, CONCAT('https://loremflickr.com/900/1125/', CASE category_name WHEN 'outer' THEN 'jacket' WHEN 'top' THEN 'shirt' WHEN 'pants' THEN 'pants' ELSE 'sneakers' END, ',fashion?lock=', (category_index * 100 + i * 4 + 4)), 'DETAIL', 4);

      INSERT IGNORE INTO reviews (product_id, nickname, rating, body, image_url, created_at) VALUES
      (product_id_value, CONCAT('핏체크', product_code_value, '-001'), 4.8, CONCAT(product_name_value, ' 실착감이 좋고 데일리로 입기 편합니다.'), CONCAT('https://loremflickr.com/800/800/fashion,person?lock=', (category_index * 1000 + i * 3 + 1)), DATE_SUB(NOW(), INTERVAL i DAY)),
      (product_id_value, CONCAT('리뷰장인', product_code_value, '-002'), 4.7, CONCAT(product_name_value, ' 색감이 안정적이고 사이즈도 예상과 비슷합니다.'), CONCAT('https://loremflickr.com/800/800/fashion,person?lock=', (category_index * 1000 + i * 3 + 2)), DATE_SUB(NOW(), INTERVAL i + 1 DAY)),
      (product_id_value, CONCAT('실착러', product_code_value, '-003'), 4.6, CONCAT(product_name_value, ' 가격 대비 마감이 괜찮아서 만족합니다.'), CONCAT('https://loremflickr.com/800/800/fashion,person?lock=', (category_index * 1000 + i * 3 + 3)), DATE_SUB(NOW(), INTERVAL i + 2 DAY));

      SET i = i + 1;
    END WHILE;
    SET category_index = category_index + 1;
  END WHILE;
END$$
DELIMITER ;
CALL seed_vul_products();
DROP PROCEDURE seed_vul_products;

INSERT IGNORE INTO community_posts (id, title, body, author_nickname, image_url, like_count, created_at) VALUES
(1, '오늘 출근룩 이 정도면 무난?', '블루종에 와이드 팬츠 조합인데 너무 편해 보이지만 않으면 좋겠음.', '핏감연구소', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80&sig=community-1', 42, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, '러닝화 데일리로 신어본 사람?', '쿠션 좋은 건 알겠는데 청바지에도 괜찮은지 궁금함.', '스니커즈헌터', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80&sig=community-2', 31, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(3, '트렌치 코트 아직 입어도 되나', '저녁에는 쌀쌀해서 괜찮은데 낮에는 살짝 더워 보일까 고민 중.', '간절기준비', 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80&sig=community-3', 27, DATE_SUB(NOW(), INTERVAL 1 DAY));

INSERT IGNORE INTO community_comments (post_id, author_nickname, body, created_at) VALUES
(1, '출근룩장인', '신발만 밝은 톤으로 가면 더 좋아 보일 듯.', DATE_SUB(NOW(), INTERVAL 90 MINUTE)),
(1, '미니멀러버', '전체적으로 무난하고 깔끔함.', DATE_SUB(NOW(), INTERVAL 80 MINUTE)),
(2, '러닝화러버', '슬림한 청바지만 아니면 생각보다 잘 맞아.', DATE_SUB(NOW(), INTERVAL 3 HOUR));

INSERT IGNORE INTO partner_applications (company_name, owner_name, email, phone, business_no, sales_category, status, memo, created_at) VALUES
('주식회사 오로라웨어', '김파트너', 'partner@aurora.local', '010-2222-3333', '123-45-67890', 'top', 'PENDING', '상의 중심의 자체 제작 브랜드입니다.', NOW()),
('파트너 테스트 상사', '박파트너', 'part@vul.com', '010-9000-0002', '987-65-43210', 'outer', 'APPROVED', '테스트 파트너 계정용 승인 데이터입니다.', NOW());

INSERT IGNORE INTO seller_product_applications (seller_email, category, brand, name, price, image_url, description, approval_status, created_at) VALUES
('seller@vulshop.local', 'outer', 'AURORA PARTNER', '파트너 싱글 재킷', 89000, 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=900&q=85&sig=seller-1', '입점 판매자 등록 승인 대기 상품입니다.', 'PENDING', NOW());

INSERT IGNORE INTO commerce_records (domain_type, owner_key, record_key, status, payload_json, created_at) VALUES
('COUPON', 'GLOBAL', 'coupon-welcome-10', 'ISSUED', '{"title":"웰컴 10% 쿠폰","discount":"10%"}', NOW()),
('MILEAGE', 'member@vulshop.local', 'mileage-seed-001', 'EARNED', '{"amount":18400,"reason":"초기 적립"}', NOW()),
('ORDER', 'member@vulshop.local', 'ORDER-20260506-001', 'IN_DELIVERY', '{"total":89000,"items":"p-outer-001:1"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('VULN_DISCOVERY', 'GLOBAL', 'xss:seed-001', 'FOUND', '{"bucket":"xss"}', NOW()),
('VULN_DISCOVERY', 'GLOBAL', 'jwt-auth:seed-001', 'FOUND', '{"bucket":"jwt-auth"}', NOW());
