// api/auth/prepare.ts
// Сохраняет origin для токена авторизации перед переходом к боту
// Использует Supabase Storage для хранения (как аватары)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

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

    // Создаем хеш имени файла из токена для безопасности
    const fileName = `auth_origins/${crypto.createHash('sha256').update(token).digest('hex')}.json`;
    
    // Сохраняем origin в JSON файл в Storage
    const data = {
      origin,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 минут
      createdAt: Date.now()
    };

    const { error } = await supabase.storage
      .from('avatars') // Используем существующий bucket для аватаров
      .upload(fileName, JSON.stringify(data), {
        contentType: 'application/json',
        upsert: true // Перезаписываем если файл существует
      });

    if (error) {
      console.error('Error saving origin to Storage:', error);
      return response.status(500).json({ error: 'Failed to save origin' });
    }

    console.log('=== ORIGIN SAVED TO STORAGE ===');
    console.log('Token (first 10 chars):', token.substring(0, 10));
    console.log('Origin:', origin);
    console.log('File path:', fileName);
    console.log('Expires at:', new Date(data.expiresAt).toISOString());

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
    console.error('Supabase client not available in getOriginForToken');
    return null;
  }

  try {
    // Создаем хеш имени файла из токена
    const fileName = `auth_origins/${crypto.createHash('sha256').update(token).digest('hex')}.json`;
    console.log('=== READING ORIGIN FROM STORAGE ===');
    console.log('Token (first 10 chars):', token.substring(0, 10));
    console.log('File path:', fileName);

    // Получаем файл из Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .download(fileName);

    if (error) {
      console.error('Error downloading file from Storage:', error);
      console.error('Error code:', error.message);
      return null;
    }

    if (!data) {
      console.log('File not found in Storage');
      return null;
    }

    // Читаем JSON из файла
    const text = await data.text();
    console.log('File content (first 100 chars):', text.substring(0, 100));
    const fileData = JSON.parse(text);
    console.log('Parsed data:', { origin: fileData.origin, expiresAt: fileData.expiresAt, now: Date.now() });

    // Проверяем, не истекла ли запись
    if (fileData.expiresAt < Date.now()) {
      console.log('Origin expired, removing file');
      // Удаляем истекший файл
      await supabase.storage.from('avatars').remove([fileName]);
      return null;
    }

    console.log('Origin found and valid:', fileData.origin);
    return fileData.origin;
  } catch (error: any) {
    console.error('Error getting origin from Storage:', error);
    console.error('Error stack:', error.stack);
    return null;
  }
}
