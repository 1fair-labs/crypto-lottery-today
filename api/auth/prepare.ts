// api/auth/prepare.ts
// Сохраняет origin для токена авторизации перед переходом к боту

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Создаем Supabase клиент
function getSupabaseClient() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                      process.env.VITE_SUPABASE_ANON_KEY || 
                      process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, origin } = request.body;

    if (!token || !origin) {
      return response.status(400).json({ error: 'Token and origin are required' });
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      console.error('Supabase client not available');
      return response.status(500).json({ error: 'Database not configured' });
    }

    // Сохраняем origin в Supabase (таблица auth_origins)
    // Если таблицы нет, она будет создана автоматически при первом запросе
    // Или можно использовать upsert в существующую таблицу
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 минут

    const { error } = await supabase
      .from('auth_origins')
      .upsert({
        token,
        origin,
        expires_at: expiresAt,
        created_at: new Date().toISOString()
      }, {
        onConflict: 'token'
      });

    if (error) {
      console.error('Error saving origin to Supabase:', error);
      // Если таблицы нет, создаем запись через insert (без upsert)
      const { error: insertError } = await supabase
        .from('auth_origins')
        .insert({
          token,
          origin,
          expires_at: expiresAt,
          created_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Error inserting origin:', insertError);
        return response.status(500).json({ error: 'Failed to save origin' });
      }
    }

    console.log('Origin saved for token:', token.substring(0, 10), 'origin:', origin);

    return response.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error in prepare endpoint:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}

// Экспортируем функцию для получения origin по токену (для использования в telegram-webhook.ts)
export async function getOriginForToken(token: string): Promise<string | null> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('auth_origins')
      .select('origin, expires_at')
      .eq('token', token)
      .single();

    if (error || !data) {
      return null;
    }

    // Проверяем, не истекла ли запись
    if (new Date(data.expires_at) < new Date()) {
      // Удаляем истекшую запись
      await supabase.from('auth_origins').delete().eq('token', token);
      return null;
    }

    return data.origin;
  } catch (error: any) {
    console.error('Error getting origin from Supabase:', error);
    return null;
  }
}
