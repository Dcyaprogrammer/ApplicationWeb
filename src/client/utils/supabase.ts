import { createClient } from '@supabase/supabase-js'
import { sanitizeEnvValue } from '../../shared/env'

// These values will be populated from your .env file
const supabaseUrl = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_URL) || 'https://placeholder.supabase.co'
const supabaseAnonKey = sanitizeEnvValue(import.meta.env.VITE_SUPABASE_ANON_KEY) || 'placeholder-key'

// Initialize the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
