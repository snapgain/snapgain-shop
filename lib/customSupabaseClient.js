// This file is deprecated. Please use src/lib/supabaseClient.js instead.
// Re-exporting from the main client to maintain compatibility during migration.
import { supabase } from '@/lib/supabaseClient';

export default supabase;

export { 
    supabase as customSupabaseClient,
    supabase,
};