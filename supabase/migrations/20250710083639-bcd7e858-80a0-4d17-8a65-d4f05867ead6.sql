-- 이벤트 담당자 테이블 생성
CREATE TABLE public.event_managers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text UNIQUE,
  phone text,
  department text,
  position text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS 활성화
ALTER TABLE public.event_managers ENABLE ROW LEVEL SECURITY;

-- 모든 인증된 사용자가 담당자 목록을 볼 수 있도록 정책 생성
CREATE POLICY "All authenticated users can view event managers"
ON public.event_managers
FOR SELECT
TO authenticated
USING (true);

-- 인증된 사용자가 담당자를 추가할 수 있도록 정책 생성
CREATE POLICY "Authenticated users can insert event managers"
ON public.event_managers
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 인증된 사용자가 담당자 정보를 수정할 수 있도록 정책 생성
CREATE POLICY "Authenticated users can update event managers"
ON public.event_managers
FOR UPDATE
TO authenticated
USING (true);

-- 업데이트 시간 자동 갱신 함수 생성
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 담당자 테이블에 업데이트 트리거 추가
CREATE TRIGGER update_event_managers_updated_at
    BEFORE UPDATE ON public.event_managers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 샘플 담당자 데이터 추가
INSERT INTO public.event_managers (name, email, phone, department, position) VALUES
('김영업', 'kim@company.com', '010-1234-5678', '영업팀', '팀장'),
('박마케팅', 'park@company.com', '010-2345-6789', '마케팅팀', '대리'),
('이기획', 'lee@company.com', '010-3456-7890', '기획팀', '과장');