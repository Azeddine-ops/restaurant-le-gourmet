import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fbhfqdokntglphvynqjo.supabase.co';
const supabaseKey = 'sb_publishable_dPWjq3eCFb7Uxy2xcuflzg_H0OutqSd';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) {
      console.warn('[Supabase] Connection failed:', error.message);
      return false;
    }
    console.log('[Supabase] ✅ Connected to SQL database');
    return true;
  } catch (e) {
    console.warn('[Supabase] Connection error:', e);
    return false;
  }
}
