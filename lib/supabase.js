import { createClient } from '@supabase/supabase-js'

// ดึงค่าจาก .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ตรวจสอบว่ามี environment variables ไหม
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// สร้าง Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)