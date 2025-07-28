import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aytvmuytvgucsestsnut.supabase.co'; // your actual Project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5dHZtdXl0dmd1Y3Nlc3RzbnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1MzY4ODYsImV4cCI6MjA2NTExMjg4Nn0.02vWxdrstU0i1oEnUyFxWsnysAgvhdgxP12pyMVkiWs'; // your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
