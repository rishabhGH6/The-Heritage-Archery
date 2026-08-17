import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oyxbdgyonyjywycxkszu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95eGJkZ3lvbnlqeXd5Y3hrc3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUyODM4NzIsImV4cCI6MjEwMDg1OTg3Mn0.32dDYVHjVi0SD2seIo5x4sMxxvYi7aFwt8braNpNqYM';

// Singleton Supabase Client Instance with Persistent Session & Token Auto-Refresh
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  global: {
    headers: { 'x-application-name': 'the-heritage-archery' }
  }
});
