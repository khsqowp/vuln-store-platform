DELETE FROM commerce_records
WHERE owner_key IN ('member@vulshop.local', 'seller@vulshop.local')
   OR record_key IN ('coupon-welcome-10', 'mileage-seed-001', 'ORDER-20260506-001')
   OR (domain_type = 'COUPON' AND owner_key = 'GLOBAL');

DELETE FROM users
WHERE email IN ('member@vulshop.local', 'admin@vulshop.local', 'seller@vulshop.local');

INSERT IGNORE INTO users (name, email, password_hash, phone, address, role, status, created_at) VALUES
('김민준', 'minjun.kim@vul.com', 'bb73371be26ce565f9ef2b9c84575cc7', '010-1234-5678', '서울특별시 서초구 반포동 101호', 'USER', 'ACTIVE', NOW()),
('이서연', 'seoyeon.lee@vul.com', '90171b6cba83dea3002857476e5a2330', '010-2345-6789', '경기도 성남시 분당구 정자동 202호', 'USER', 'ACTIVE', NOW()),
('박지훈', 'jihoon.park@vul.com', '6c22569371eca177c3b73bcd96a7b335', '010-3456-7890', '서울특별시 강동구 천호동 303호', 'USER', 'ACTIVE', NOW()),
('최수아', 'sua.choi@vul.com', '8e035ea8f58a467440c11000e95baa05', '010-4567-8901', '인천광역시 연수구 송도동 404호', 'USER', 'ACTIVE', NOW()),
('정다은', 'daeun.jung@vul.com', '84976bb5b44f25238820a1ad747e91ca', '010-5678-9012', '경기도 수원시 팔달구 인계동 505호', 'USER', 'ACTIVE', NOW()),
('한승호', 'seungho.han@vul.com', 'bb73371be26ce565f9ef2b9c84575cc7', '010-6789-0123', '부산광역시 해운대구 우동 606호', 'USER', 'SANCTIONED', NOW()),
('오예진', 'yejin.oh@vul.com', '90171b6cba83dea3002857476e5a2330', '010-7890-1234', '대구광역시 수성구 범어동 707호', 'SELLER', 'ACTIVE', NOW());

UPDATE seller_product_applications
SET seller_email = 'part@vul.com',
    image_url = '/api/product-images/p-outer-001/0.svg'
WHERE seller_email = 'seller@vulshop.local';

UPDATE product_images pi
JOIN products p ON p.id = pi.product_id
SET pi.image_url = CONCAT('/api/product-images/', p.product_code, '/', pi.sort_order - 1, '.svg');

INSERT IGNORE INTO commerce_records (domain_type, owner_key, record_key, status, payload_json, created_at) VALUES
('COUPON', 'user@vul.com', 'coupon-user-welcome-10', 'ISSUED', '{"couponId":"cp-welcome-10","title":"웰컴 10% 쿠폰","discountRate":10,"minimumOrderAmount":30000,"expiresAt":"2026-06-30","used":false}', NOW()),
('COUPON', 'user@vul.com', 'coupon-user-free-ship', 'ISSUED', '{"couponId":"cp-free-ship","title":"무료배송 쿠폰","discountAmount":3000,"minimumOrderAmount":10000,"expiresAt":"2026-06-15","used":false}', NOW()),
('MILEAGE', 'user@vul.com', 'mileage-user-001', 'EARNED', '{"amount":18400,"reason":"가입 및 구매 적립","balance":18400}', NOW()),
('ORDER', 'user@vul.com', 'ORDER-USER-DELIVERED-001', 'DELIVERED', '{"userEmail":"user@vul.com","receiverName":"일반 사용자 테스트","address":"서울특별시 성동구 고객센터","paymentMethod":"card","registeredCard":"****-****-****-1234","productId":"p-outer-001","productName":"에센셜 코듀로이 집업 가디건 브라운","productImage":"/api/product-images/p-outer-001/0.svg","brand":"AURORA","size":"M","quantity":1,"total":42300,"couponDiscount":4230,"paymentTotal":38070,"chargedAmount":38070,"deliveryCompany":"CJ대한통운","trackingNumber":"5849-1204-7721","status":"DELIVERED"}', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('ORDER', 'user@vul.com', 'ORDER-USER-SHIPPING-001', 'IN_DELIVERY', '{"userEmail":"user@vul.com","receiverName":"일반 사용자 테스트","address":"서울특별시 성동구 고객센터","paymentMethod":"bank","depositConfirmed":true,"productId":"p-sneakers-003","productName":"스탠다드 캔버스 테크 스니커즈 크림","productImage":"/api/product-images/p-sneakers-003/0.svg","brand":"ORDINARY","size":"270","quantity":1,"total":67900,"couponDiscount":0,"paymentTotal":67900,"chargedAmount":67900,"deliveryCompany":"한진택배","trackingNumber":"4331-8820-1350","status":"IN_DELIVERY"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('CS_INQUIRY', 'user@vul.com', 'CS-USER-001', 'PENDING', '{"userEmail":"user@vul.com","title":"무통장 입금 확인 문의","body":"입금 완료 확인을 눌렀는데 주문 상태가 언제 바뀌는지 궁금합니다.","answer":"","category":"payment"}', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
('CS_INQUIRY', 'user@vul.com', 'CS-USER-002', 'ANSWERED', '{"userEmail":"user@vul.com","title":"배송지 변경 가능 여부","body":"상품 준비 전이면 배송지를 변경할 수 있나요?","answer":"상품 준비 단계 전까지 고객센터에서 배송지 변경을 도와드릴 수 있습니다.","category":"delivery"}', DATE_SUB(NOW(), INTERVAL 2 DAY));

DELETE FROM commerce_records
WHERE record_key IN (
  'inventory-outer-001', 'inventory-top-001', 'inventory-sneakers-001',
  'employee-cs-001', 'employee-ops-001',
  'analytics-user-search-001', 'analytics-user-cart-001',
  'role-policy-admin-001', 'role-policy-partner-001',
  'security-setting-jwt-001', 'security-setting-upload-001',
  'seller-order-part-001', 'seller-settlement-part-001',
  'partner-notice-202605'
);

INSERT INTO commerce_records (domain_type, owner_key, record_key, status, payload_json, created_at) VALUES
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
