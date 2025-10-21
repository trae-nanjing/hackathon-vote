import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 数据库类型定义
export interface Team {
  id: string
  name: string
  description: string
  members: string[]
  project_url?: string
  created_at: string
  updated_at: string
  captain_name?: string
  contact_info?: string
  project_description?: string
  is_registered?: boolean
  registration_date?: string
}

export interface Vote {
  id: string
  team_id: string
  device_fingerprint: string
  ip_address: string
  user_agent: string
  created_at: string
}

export interface VoteRecord {
  id: string
  team_id: string
  vote_count: number
  last_updated: string
  teams?: {
    id: string
    name: string
  }
}