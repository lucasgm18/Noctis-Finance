import { createClient } from '@supabase/supabase-js';

// Fallback padrão do projeto Noctis (permite que o app funcione mesmo se a Vercel não receber as variáveis no momento do build)
const FALLBACK_SUPABASE_URL = 'https://rbrzlvjtgjujawjeexuz.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJicnpsdmp0Z2p1amF3amVleHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5MjAyMDksImV4cCI6MjEwNzQ5NjIwOX0.11Dld0Qd8vRZA9ZAmtKtmm7HHv6I1GWY28UPm5ofKfA';

function extractValidUrl(raw?: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  // Caso tenha sido colado como link markdown: [https://...](https://...)
  const match = trimmed.match(/https?:\/\/[^\s)\]]+/);
  if (match) return match[0];
  return trimmed;
}

const envUrl = extractValidUrl(import.meta.env.VITE_SUPABASE_URL);
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const supabaseUrl = (envUrl && envUrl.startsWith('http')) ? envUrl : FALLBACK_SUPABASE_URL;
const supabaseAnonKey = envKey || FALLBACK_SUPABASE_ANON_KEY;

function initSupabase() {
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
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
  } catch (err) {
    console.error('⚠️ Falha ao instanciar cliente Supabase primário, usando fallback:', err);
    return createClient(FALLBACK_SUPABASE_URL, FALLBACK_SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
}

export const supabase = initSupabase();

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
