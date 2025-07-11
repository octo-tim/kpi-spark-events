// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gueetjiruyscetsoblct.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1ZWV0amlydXlzY2V0c29ibGN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMjY0NDEsImV4cCI6MjA2NzcwMjQ0MX0.3eYA8BoJFDZgOJatVemDlHlBENNkscYPHDk6Uv4-npI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});