import type { VercelRequest, VercelResponse } from '@vercel/node';
import { userAuthStore } from '../lib/user-auth-store.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Разрешаем CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Credentials', 'true');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Получаем refresh token из cookie или body
    let refreshToken: string | null = null;

    // Пробуем получить из cookie
    const cookies = request.headers.cookie || '';
    const sessionCookie = cookies
      .split(';')
      .find(c => c.trim().startsWith('telegram_session='));

    if (sessionCookie) {
      try {
        const sessionValue = sessionCookie.split('=')[1];
        const sessionData = JSON.parse(
          Buffer.from(sessionValue, 'base64').toString()
        );
        refreshToken = sessionData.refreshToken;
      } catch (e) {
        console.warn('Could not parse session cookie:', e);
      }
    }

    // Если не нашли в cookie, пробуем из body
    if (!refreshToken && request.body) {
      refreshToken = request.body.refreshToken;
    }

    // Отзываем refresh token если он есть
    if (refreshToken) {
      const revoked = await userAuthStore.revokeRefreshToken(refreshToken);
      if (revoked) {
        console.log('Refresh token revoked:', refreshToken.substring(0, 10) + '...');
      } else {
        console.warn('Failed to revoke refresh token');
      }
    }

    // Удаляем cookie с сессией, устанавливая его с истекшим временем
    response.setHeader(
      'Set-Cookie',
      'telegram_session=; Path=/; HttpOnly; SameSite=None; Max-Age=0; Secure'
    );

    console.log('User logged out, session cookie cleared and refresh token revoked');

    return response.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('Error in logout:', error);
    return response.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
