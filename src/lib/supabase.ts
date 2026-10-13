import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export interface DBSubcategory {
  id: string;
  name: string;
  macro_pillar: string;
  icon: string;
  monthly_limit: number;
  created_at?: string;
}

export interface DBTransaction {
  id: string;
  title: string;
  notes: string | null;
  amount: number;
  type: string;
  macro_pillar: string | null;
  subcategory_id: string | null;
  subcategory_name: string | null;
  recurrence: string;
  installment_current: number | null;
  installment_total: number | null;
  due_date: string;
  is_paid: boolean;
  paid_at: string | null;
  notify_push: boolean;
  notify_email: boolean;
  created_at?: string;
}

export interface DBUserSettings {
  id: number;
  alert_email: string | null;
  monthly_budget_limit: number;
  emergency_reserve_goal: number;
  emergency_reserve_current: number;
  updated_at?: string;
}
