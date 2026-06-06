import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type Project = {
  id: string
  user_id: string
  title: string
  description: string
  long_description?: string
  tags: string[]
  image_url?: string
  repo_url?: string
  live_url?: string
  status: 'completed' | 'in-progress' | 'archived'
  featured: boolean
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  username: string
  name: string
  title: string
  bio: string
  email: string
  github_url?: string
  linkedin_url?: string
  location: string
  skills: string[]
  created_at: string
  updated_at: string
}
