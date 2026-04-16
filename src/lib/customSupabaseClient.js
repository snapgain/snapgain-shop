import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://auhtwkvwbgvekvwctcaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1aHR3a3Z3Ymd2ZWt2d2N0Y2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDY0MjIsImV4cCI6MjA3MjkyMjQyMn0.uJifWx65COLPz5xwI_6bXrHgH7QDaSDiKn7ocsNhg30';

const customSupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default customSupabaseClient;

export { 
    customSupabaseClient,
    customSupabaseClient as supabase,
};
