import { createClient } from '@supabase/supabase-js'

export const supabaseProjectId  = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const supabaseUrl = `https://${supabaseProjectId}.supabase.co`;
const subabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, subabasePublishableKey);