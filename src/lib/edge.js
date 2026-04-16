import { supabase } from "@/lib/supabaseClient";

export async function callEdge(functionName, body = {}) {
  // If we have a session, get the access token to pass explicitly
  // Although supabase-js handles this automatically if configured, 
  // sometimes explicit Authorization header ensures the Edge Function sees the user.
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers = {};
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }

  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
    headers
  });

  if (error) {
    console.error(`Edge '${functionName}' error:`, error);
    throw error;
  }
  return data;
}