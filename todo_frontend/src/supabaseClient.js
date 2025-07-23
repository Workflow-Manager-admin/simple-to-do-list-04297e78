import { createClient } from '@supabase/supabase-js';

// Get Supabase params from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

// PUBLIC_INTERFACE
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
