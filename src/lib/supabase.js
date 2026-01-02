import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://fxvbfvzvgtwpqfjwkoqs.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4dmJmdnp2Z3R3cHFmandrb3FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4OTUxMDMsImV4cCI6MjA4MjQ3MTEwM30.AqAAfSKLPdqlCajw9tgcdjd2VJi64LvfCk_IoK31vvI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타로 결과 저장
export async function saveReading(readingData) {
  const { data, error } = await supabase
    .from('tarot_readings')
    .insert([readingData])
    .select()
    .single();
  
  if (error) {
    console.error('Error saving reading:', error);
    throw error;
  }
  
  return data;
}

// 공유 ID로 타로 결과 가져오기
export async function getReading(shareId) {
  const { data, error } = await supabase
    .from('tarot_readings')
    .select('*')
    .eq('share_id', shareId)
    .single();
  
  if (error) {
    console.error('Error fetching reading:', error);
    throw error;
  }
  
  return data;
}

