-- 이벤트 테이블에 장당비용 목표값 컬럼 추가
ALTER TABLE public.events 
ADD COLUMN target_cost_per_sqm INTEGER DEFAULT 0;