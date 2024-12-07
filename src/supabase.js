import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://iussqunpdvvbffbcecsb.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1c3NxdW5wZHZ2YmZmYmNlY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI4Nzc2NzMsImV4cCI6MjA0ODQ1MzY3M30.dYPVOnvXFVCVe_RARa2Cutt0Gsiug3w3w0oCdezIah0'; // Replace with your Supabase anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
