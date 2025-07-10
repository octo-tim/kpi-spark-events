-- 이벤트 테이블에 상세 정보 필드들 추가
ALTER TABLE public.events 
ADD COLUMN promotion_info jsonb,
ADD COLUMN previous_improvements text,
ADD COLUMN execution_plan text,
ADD COLUMN customer_feedback text,
ADD COLUMN event_review text,
ADD COLUMN future_improvements text;

-- 인덱스 추가로 검색 성능 향상
CREATE INDEX idx_events_promotion_info ON public.events USING GIN(promotion_info);

-- 기존 이벤트들에 기본값 설정
UPDATE public.events 
SET 
  promotion_info = '{
    "discounts": {"base_price": "100000", "additional_discount": "3000", "condition": "30장 이상 계약시"},
    "construction": {"price": "23000", "free_condition": "50장 이상 무료시공"},
    "estimate_gift": "기본 사은품 세트",
    "construction_gift": "프리미엄 사은품",
    "event_description": "현장 참여 이벤트 및 다양한 혜택 제공"
  }'::jsonb,
  previous_improvements = '전회차 피드백을 바탕으로 개선된 운영 방식을 적용하였습니다.',
  execution_plan = '체계적인 사전 준비, 효율적인 현장 운영, 철저한 사후 관리 단계로 구성된 실행 계획을 수립하였습니다.',
  customer_feedback = '전반적으로 긍정적인 고객 반응을 얻었으며, 제품 품질과 서비스에 대한 만족도가 높았습니다.',
  event_review = '목표 달성률과 고객 만족도 측면에서 성공적인 이벤트로 평가됩니다.',
  future_improvements = '고객 피드백을 바탕으로 서비스 품질 향상과 프로세스 개선을 지속적으로 추진할 예정입니다.'
WHERE promotion_info IS NULL;