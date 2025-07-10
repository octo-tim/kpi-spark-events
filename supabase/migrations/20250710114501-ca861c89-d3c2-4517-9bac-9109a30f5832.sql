-- 이벤트 데이터를 저장할 테이블 생성
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '계획중',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  partner TEXT,
  target_contracts INTEGER DEFAULT 0,
  actual_contracts INTEGER DEFAULT 0,
  target_estimates INTEGER DEFAULT 0,
  actual_estimates INTEGER DEFAULT 0,
  target_sqm INTEGER DEFAULT 0,
  actual_sqm INTEGER DEFAULT 0,
  total_cost BIGINT DEFAULT 0,
  efficiency DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS 정책 활성화
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 인증된 사용자가 이벤트를 조회할 수 있는 정책
CREATE POLICY "Authenticated users can view events" 
ON public.events 
FOR SELECT 
USING (true);

-- 인증된 사용자가 이벤트를 생성할 수 있는 정책
CREATE POLICY "Authenticated users can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (true);

-- 인증된 사용자가 이벤트를 수정할 수 있는 정책
CREATE POLICY "Authenticated users can update events" 
ON public.events 
FOR UPDATE 
USING (true);

-- 인증된 사용자가 이벤트를 삭제할 수 있는 정책
CREATE POLICY "Authenticated users can delete events" 
ON public.events 
FOR DELETE 
USING (true);

-- 업데이트 시간 자동 갱신 트리거
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 샘플 데이터 삽입
INSERT INTO public.events (title, type, status, start_date, end_date, partner, target_contracts, actual_contracts, target_estimates, actual_estimates, target_sqm, actual_sqm, total_cost, efficiency) VALUES
('신혼가구 타겟 라이브 쇼핑', '라이브커머스', '진행중', '2024-07-05', '2024-07-15', '네이버 쇼핑라이브', 50, 32, 120, 95, 1500, 960, 15000000, 82),
('서울 베이비&키즈 페어 2024', '베이비페어', '완료', '2024-06-08', '2024-06-14', '베이비페어 조직위', 80, 95, 200, 215, 2400, 2850, 28500000, 88),
('분당 신도시 입주박람회', '입주박람회', '계획중', '2024-08-01', '2024-08-03', '분당신도시개발', 35, 35, 85, 85, 1200, 1200, 12000000, 75),
('카카오 쇼핑라이브 협업', '라이브커머스', '완료', '2024-05-22', '2024-05-28', '카카오 쇼핑라이브', 40, 38, 100, 92, 1300, 1150, 18000000, 79),
('롯데 베이비페어 참가', '베이비페어', '진행중', '2024-07-29', '2024-08-04', '롯데 베이비페어', 60, 45, 150, 118, 2000, 1580, 22000000, 76),
('인플루언서 협업 프로모션', '인플루언서공구', '완료', '2024-04-05', '2024-04-12', '인플루언서그룹', 25, 27, 65, 72, 800, 750, 9500000, 85),
('여름 시즌 특별 프로모션', '라이브커머스', '완료', '2024-07-10', '2024-07-20', '쿠팡 라이브', 45, 52, 110, 125, 1600, 1750, 20000000, 89),
('가을 신상품 박람회', '입주박람회', '계획중', '2024-09-15', '2024-09-18', '신도시개발공사', 30, 0, 75, 0, 1000, 0, 11000000, 0);