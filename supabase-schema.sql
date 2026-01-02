-- Supabase에서 실행할 SQL
-- 타로 결과 저장 테이블 생성

CREATE TABLE IF NOT EXISTS tarot_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,
  reading_type TEXT NOT NULL,
  selected_cards JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_tarot_readings_share_id ON tarot_readings(share_id);
CREATE INDEX IF NOT EXISTS idx_tarot_readings_created_at ON tarot_readings(created_at);

-- RLS (Row Level Security) 활성화
ALTER TABLE tarot_readings ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽을 수 있도록 정책 설정
CREATE POLICY "Anyone can read tarot readings"
  ON tarot_readings
  FOR SELECT
  USING (true);

-- 모든 사용자가 생성할 수 있도록 정책 설정  
CREATE POLICY "Anyone can create tarot readings"
  ON tarot_readings
  FOR INSERT
  WITH CHECK (true);

