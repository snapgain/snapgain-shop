// src/lib/functions.js
import { supabase } from '@/lib/supabaseClient';

const BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const KEY  = import.meta.env.VITE_SUPABASE_ANON_KEY;

export async function fetchFn(
  path,
  { method = 'GET', params, body, headers } = {}
) {
  const qs = params ? `?${new URLSearchParams(params).toString()}` : '';

  // tenta pegar a sessão atual (se não houver, segue anônimo)
  let auth = {};
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      auth = { Authorization: `Bearer ${session.access_token}` };
    }
  } catch (_) { /* ignora */ }

  const res = await fetch(`${BASE}/${path}${qs}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      apikey: KEY,      // obrigatório para Edge Functions públicas
      ...auth,          // envia JWT se logado
      ...(headers || {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  // algumas funções respondem vazio; proteja o parse
  const contentType = res.headers.get('content-type') || '';
  return contentType.includes('application/json') ? res.json() : null;
}