import { createClient } from '@supabase/supabase-js'

// Paste your actual URL and Key here as strings
const supabaseUrl = 'https://ztstfhanjdfezulhuejm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0c3RmaGFuamRmZXp1bGh1ZWptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMDk2MjYsImV4cCI6MjA5MzU4NTYyNn0.G3jLM4eCSU9Dx8Jj60hgduqRON6lfOymldrjHf47WHE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)