UPDATE products
SET
  name = CONCAT(
    ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED), 10),
      '시티', '에센셜', '컴포트', '스탠다드', '모던', '데일리', '유틸리티', '소프트', '릴랙스', '프리미엄'),
    ' ',
    CASE category
      WHEN 'outer' THEN ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED) * 3, 10),
        '나일론', '코튼', '울 블렌드', '코듀로이', '트윌', '테크', '워시드', '헤비웨이트', '라이트', '리버시블')
      WHEN 'top' THEN ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED) * 3, 10),
        '피마 코튼', '오가닉', '와플', '헤비 코튼', '쿨터치', '링클프리', '소프트 니트', '프렌치 테리', '슬럽', '기모')
      WHEN 'pants' THEN ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED) * 3, 10),
        '코튼', '스트레치', '데님', '나일론', '트윌', '린넨 블렌드', '워시드', '테크', '울 블렌드', '피치')
      ELSE ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED) * 3, 10),
        '레더', '스웨이드', '메쉬', '캔버스', '니트', '러버솔', '빈티지', '러닝', '코트', '트레일')
    END,
    ' ',
    CASE category
      WHEN 'outer' THEN ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED), 12),
        '트렌치 코트', '집업 가디건', '유틸리티 베스트', '윈드 재킷', '필드 재킷', '후드 파카', '워크 재킷', '라이트 블루종', '셔츠 재킷', '더플 코트', '레인 점퍼', '하프 코트')
      WHEN 'top' THEN ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED), 12),
        '오버핏 티셔츠', '카라 니트', '그래픽 스웨트셔츠', '옥스포드 셔츠', '후드 스웨트', '모크넥 니트', '럭비 셔츠', '피케 티셔츠', '크루넥 니트', '스트라이프 티셔츠', '반집업 스웨트', '롱슬리브 티셔츠')
      WHEN 'pants' THEN ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED), 12),
        '테이퍼드 팬츠', '와이드 데님', '카고 팬츠', '치노 팬츠', '조거 팬츠', '슬랙스', '버뮤다 쇼츠', '워크 팬츠', '트랙 팬츠', '이지 팬츠', '코튼 쇼츠', '플리츠 팬츠')
      ELSE ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED), 12),
        '러너 스니커즈', '코트 스니커즈', '트레일 슈즈', '캔버스 스니커즈', '레더 스니커즈', '하이탑 스니커즈', '슬립온', '더비 스니커즈', '플랫폼 슈즈', '워크 스니커즈', '러닝 슈즈', '스케이트 슈즈')
    END,
    ' ',
    ELT(1 + MOD(CAST(SUBSTRING_INDEX(product_code, '-', -1) AS UNSIGNED) * 5 +
      CASE category WHEN 'outer' THEN 1 WHEN 'top' THEN 2 WHEN 'pants' THEN 3 ELSE 4 END, 10),
      '블랙', '네이비', '차콜', '그레이', '아이보리', '카키', '브라운', '블루', '올리브', '크림')
  ),
  description = CONCAT(brand, '의 ', category, ' 카테고리 상품입니다. 계절감, 착용감, 실제 코디 활용도를 기준으로 구성한 테스트 쇼핑몰 데이터입니다.')
WHERE product_code LIKE 'p-%-%';

UPDATE product_images pi
JOIN products p ON p.id = pi.product_id
SET pi.image_url = CONCAT('/api/product-images/', p.product_code, '/', pi.sort_order - 1, '.svg');
