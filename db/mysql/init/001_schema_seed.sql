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
('관리자 테스트', 'root@vul.com', '3d6623bf4e0e098d7139131a5eba7a1f', '010-9000-0001', '서울특별시 강남구 관리자센터', 'ADMIN', 'ACTIVE', NOW()),
('파트너 테스트', 'part@vul.com', '5c7bc719c82e02364aaeaac78362e2c4', '010-9000-0002', '서울특별시 마포구 파트너센터', 'SELLER', 'ACTIVE', NOW()),
('일반 사용자 테스트', 'user@vul.com', '8469d3af7f7adee2fc6d3e60dd59830b', '010-9000-0003', '서울특별시 성동구 고객센터', 'USER', 'ACTIVE', NOW()),
('김민준', 'minjun.kim@vul.com', 'bb73371be26ce565f9ef2b9c84575cc7', '010-1234-5678', '서울특별시 서초구 반포동 101호', 'USER', 'ACTIVE', NOW()),
('이서연', 'seoyeon.lee@vul.com', '90171b6cba83dea3002857476e5a2330', '010-2345-6789', '경기도 성남시 분당구 정자동 202호', 'USER', 'ACTIVE', NOW()),
('박지훈', 'jihoon.park@vul.com', '6c22569371eca177c3b73bcd96a7b335', '010-3456-7890', '서울특별시 강동구 천호동 303호', 'USER', 'ACTIVE', NOW()),
('최수아', 'sua.choi@vul.com', '8e035ea8f58a467440c11000e95baa05', '010-4567-8901', '인천광역시 연수구 송도동 404호', 'USER', 'ACTIVE', NOW()),
('정다은', 'daeun.jung@vul.com', '84976bb5b44f25238820a1ad747e91ca', '010-5678-9012', '경기도 수원시 팔달구 인계동 505호', 'USER', 'ACTIVE', NOW()),
('한승호', 'seungho.han@vul.com', 'bb73371be26ce565f9ef2b9c84575cc7', '010-6789-0123', '부산광역시 해운대구 우동 606호', 'USER', 'SANCTIONED', NOW()),
('오예진', 'yejin.oh@vul.com', '90171b6cba83dea3002857476e5a2330', '010-7890-1234', '대구광역시 수성구 범어동 707호', 'SELLER', 'ACTIVE', NOW());

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
        ELT(1 + MOD(i, 10), '시티', '에센셜', '컴포트', '모던', '데일리', '프리미엄', '릴랙스', '클래식', '소프트', '유틸리티'),
        ' ',
        CASE category_name
          WHEN 'outer' THEN ELT(1 + MOD(i * 3, 10), '나일론', '코튼', '트윌', '라이트 쉘', '워시드', '테크', '울 블렌드', '립스탑', '미니멀', '헤비 코튼')
          WHEN 'top' THEN ELT(1 + MOD(i * 3, 10), '수피마 코튼', '헤비웨이트', '피케', '와플', '브러시드', '프렌치 테리', '옥스포드', '쿨 터치', '소프트 니트', '바이오 워싱')
          WHEN 'pants' THEN ELT(1 + MOD(i * 3, 10), '코튼 트윌', '워시드 데님', '스트레치', '나일론', '코어 스판', '피치 코튼', '테크 원단', '린넨 블렌드', '헤비 캔버스', '소프트 기모')
          ELSE ELT(1 + MOD(i * 3, 10), '레더', '메시', '캔버스', '스웨이드', '러버솔', '니트 어퍼', '트레일', '코트', '러닝 쿠션', '빈티지')
        END,
        ' ',
        CASE category_name
          WHEN 'outer' THEN ELT(1 + MOD(i, 8), '라이트웨이트 블루종', '싱글 트렌치 코트', '니트 집업 가디건', '유틸리티 베스트', '윈드 쉘 재킷', '코튼 필드 재킷', '후드 파카', '워크 재킷')
          WHEN 'top' THEN ELT(1 + MOD(i, 8), '오버핏 셔츠', '후드 스웨트셔츠', '그래픽 티셔츠', '니트 풀오버', '롱슬리브 티셔츠', '카라 티셔츠', '하프 집업 맨투맨', '옥스포드 셔츠')
          WHEN 'pants' THEN ELT(1 + MOD(i, 8), '카고 팬츠', '와이드 데님 팬츠', '크롭 슬랙스', '밴딩 조거 팬츠', '치노 팬츠', '원턱 와이드 팬츠', '워크 데님 팬츠', '나일론 팬츠')
          ELSE ELT(1 + MOD(i, 8), '로우 스니커즈', '러닝 스니커즈', '캔버스 스니커즈', '테크 스니커즈', '레트로 스니커즈', '코트 스니커즈', '트레일 스니커즈', '슬립온 스니커즈')
        END,
        ' ',
        ELT(1 + MOD(i * 5 + category_index, 10), '블랙', '차콜', '네이비', '애쉬 카키', '크림', '스톤 그레이', '더스티 블루', '오트밀', '인디고', '샌드')
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
      (product_id_value, CONCAT('/api/product-images/', product_code_value, '/0.svg'), 'MAIN', 1),
      (product_id_value, CONCAT('/api/product-images/', product_code_value, '/1.svg'), 'DETAIL', 2),
      (product_id_value, CONCAT('/api/product-images/', product_code_value, '/2.svg'), 'DETAIL', 3),
      (product_id_value, CONCAT('/api/product-images/', product_code_value, '/3.svg'), 'DETAIL', 4);

      SET i = i + 1;
    END WHILE;
    SET category_index = category_index + 1;
  END WHILE;
END$$
DELIMITER ;
CALL seed_vul_products();
DROP PROCEDURE seed_vul_products;

INSERT IGNORE INTO partner_applications (company_name, owner_name, email, phone, business_no, sales_category, status, memo, created_at) VALUES
('주식회사 오로라웨어', '김파트너', 'partner@aurora.local', '010-2222-3333', '123-45-67890', 'top', 'PENDING', '상의 중심의 자체 제작 브랜드입니다.', NOW()),
('파트너 테스트 상사', '박파트너', 'part@vul.com', '010-9000-0002', '987-65-43210', 'outer', 'APPROVED', '테스트 파트너 계정용 승인 데이터입니다.', NOW());

INSERT IGNORE INTO seller_product_applications (seller_email, category, brand, name, price, image_url, description, approval_status, created_at) VALUES
('part@vul.com', 'outer', 'AURORA PARTNER', '파트너 싱글 재킷', 89000, '/api/product-images/p-outer-001/0.svg', '입점 판매자 등록 승인 대기 상품입니다.', 'PENDING', NOW());

INSERT IGNORE INTO commerce_records (domain_type, owner_key, record_key, status, payload_json, created_at) VALUES
('COUPON', 'user@vul.com', 'coupon-user-welcome-10', 'ISSUED', '{"couponId":"cp-welcome-10","title":"웰컴 10% 쿠폰","discountRate":10,"minimumOrderAmount":30000,"expiresAt":"2026-06-30","used":false}', NOW()),
('COUPON', 'user@vul.com', 'coupon-user-free-ship', 'ISSUED', '{"couponId":"cp-free-ship","title":"무료배송 쿠폰","discountAmount":3000,"minimumOrderAmount":10000,"expiresAt":"2026-06-15","used":false}', NOW()),
('MILEAGE', 'user@vul.com', 'mileage-user-001', 'EARNED', '{"amount":18400,"reason":"가입 및 구매 적립","balance":18400}', NOW()),
('ORDER', 'user@vul.com', 'ORDER-USER-DELIVERED-001', 'DELIVERED', '{"userEmail":"user@vul.com","receiverName":"일반 사용자 테스트","address":"서울특별시 성동구 고객센터","paymentMethod":"card","registeredCard":"****-****-****-1234","productId":"p-outer-001","productName":"에센셜 코듀로이 집업 가디건 브라운","productImage":"/api/product-images/p-outer-001/0.svg","brand":"AURORA","size":"M","quantity":1,"total":42300,"couponDiscount":4230,"paymentTotal":38070,"chargedAmount":38070,"deliveryCompany":"CJ대한통운","trackingNumber":"5849-1204-7721","status":"DELIVERED"}', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('ORDER', 'user@vul.com', 'ORDER-USER-SHIPPING-001', 'IN_DELIVERY', '{"userEmail":"user@vul.com","receiverName":"일반 사용자 테스트","address":"서울특별시 성동구 고객센터","paymentMethod":"bank","depositConfirmed":true,"productId":"p-sneakers-003","productName":"스탠다드 캔버스 테크 스니커즈 크림","productImage":"/api/product-images/p-sneakers-003/0.svg","brand":"ORDINARY","size":"270","quantity":1,"total":67900,"couponDiscount":0,"paymentTotal":67900,"chargedAmount":67900,"deliveryCompany":"한진택배","trackingNumber":"4331-8820-1350","status":"IN_DELIVERY"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('CS_INQUIRY', 'user@vul.com', 'CS-USER-001', 'PENDING', '{"userEmail":"user@vul.com","title":"무통장 입금 확인 문의","body":"입금 완료 확인을 눌렀는데 주문 상태가 언제 바뀌는지 궁금합니다.","answer":"","category":"payment"}', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
('CS_INQUIRY', 'user@vul.com', 'CS-USER-002', 'ANSWERED', '{"userEmail":"user@vul.com","title":"배송지 변경 가능 여부","body":"상품 준비 전이면 배송지를 변경할 수 있나요?","answer":"상품 준비 단계 전까지 고객센터에서 배송지 변경을 도와드릴 수 있습니다.","category":"delivery"}', DATE_SUB(NOW(), INTERVAL 2 DAY));

INSERT IGNORE INTO commerce_records (domain_type, owner_key, record_key, status, payload_json, created_at) VALUES
('INVENTORY', 'warehouse-main', 'inventory-outer-001', 'LOW_STOCK', '{"productId":"p-outer-001","productName":"에센셜 코듀로이 집업 가디건 브라운","stock":8,"warehouse":"성수 1센터","safeStock":20}', NOW()),
('INVENTORY', 'warehouse-main', 'inventory-top-001', 'ACTIVE', '{"productId":"p-top-001","productName":"모던 수피마 베이직 티셔츠 화이트","stock":142,"warehouse":"성수 1센터","safeStock":30}', NOW()),
('INVENTORY', 'warehouse-sub', 'inventory-sneakers-001', 'ACTIVE', '{"productId":"p-sneakers-003","productName":"스탠다드 캔버스 테크 스니커즈 크림","stock":54,"warehouse":"이천 2센터","safeStock":15}', NOW()),
('EMPLOYEE', 'staff-cs@vul.com', 'employee-cs-001', 'ACTIVE', '{"email":"staff-cs@vul.com","name":"CS 운영자","team":"고객센터","role":"CS_MANAGER"}', NOW()),
('EMPLOYEE', 'staff-ops@vul.com', 'employee-ops-001', 'ACTIVE', '{"email":"staff-ops@vul.com","name":"운영 관리자","team":"운영","role":"OPS_MANAGER"}', NOW()),
('USER_ANALYTICS', 'GLOBAL', 'analytics-user-search-001', 'ACTIVE', '{"metric":"검색 전환","count":328,"period":"2026-05-07","segment":"비로그인"}', NOW()),
('USER_ANALYTICS', 'GLOBAL', 'analytics-user-cart-001', 'ACTIVE', '{"metric":"장바구니 전환","count":74,"period":"2026-05-07","segment":"회원"}', NOW()),
('ROLE_POLICY', 'admin', 'role-policy-admin-001', 'ACTIVE', '{"role":"ADMIN","permissions":["USER_WRITE","PRODUCT_APPROVE","CS_ANSWER","SYSTEM_READ"]}', NOW()),
('ROLE_POLICY', 'admin', 'role-policy-partner-001', 'ACTIVE', '{"role":"SELLER","permissions":["PRODUCT_APPLY","ORDER_STATUS","SETTLEMENT_READ"]}', NOW()),
('SECURITY_SETTING', 'admin', 'security-setting-jwt-001', 'WEAK', '{"key":"JWT_SECRET","value":"vulshop-secret","note":"진단용 유추 가능한 키"}', NOW()),
('SECURITY_SETTING', 'admin', 'security-setting-upload-001', 'WEAK', '{"key":"UPLOAD_VALIDATION","value":"extension-check-disabled","note":"진단용 파일 업로드 약한 검증"}', NOW()),
('SELLER_ORDER', 'part@vul.com', 'seller-order-part-001', 'PAYMENT_COMPLETED', '{"orderNo":"202605070001","productName":"파트너 싱글 재킷","quantity":2,"amount":178000,"deliveryCompany":"CJ대한통운","trackingNumber":"710245902184"}', NOW()),
('SELLER_SETTLEMENT', 'part@vul.com', 'seller-settlement-part-001', 'READY', '{"settlementNo":"SETTLE-202605-001","amount":151300,"fee":26700,"period":"2026-05-01~2026-05-07"}', NOW()),
('EVENT', 'admin', 'partner-notice-202605', 'ACTIVE', '{"title":"파트너 운영 공지","eventType":"PARTNER_NOTICE","reward":"대표 이미지와 재고 수량을 최신 상태로 유지해 주세요.","startAt":"2026-05-07","endAt":"2026-05-31"}', NOW());
