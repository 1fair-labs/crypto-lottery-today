import type { VercelRequest, VercelResponse } from '@vercel/node';
import { userAuthStore } from '../lib/user-auth-store.js';

// API для обновления access token через refresh token
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Разрешаем CORS
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('=== REFRESH API CALLED ===');
    const { refreshToken } = request.body;
    console.log('Refresh token:', refreshToken ? refreshToken.substring(0, 10) + '...' : 'MISSING');

    if (!refreshToken || typeof refreshToken !== 'string') {
      console.error('Missing refreshToken');
      return response.status(400).json({ error: 'refreshToken is required' });
    }

    // Обновляем access token
    console.log('Refreshing access token...');
    const tokens = await userAuthStore.refreshAccessToken(refreshToken);
    
    if (!tokens) {
      console.error('Failed to refresh token - invalid, expired, or revoked');
      return response.status(401).json({ 
        error: 'Invalid or expired refresh token',
        message: 'Please login again'
      });
    }
    
    console.log('Access token refreshed successfully');

    return response.status(200).json({
      success: true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || refreshToken, // Возвращаем новый refresh token если был rotation
    });
  } catch (error: any) {
    console.error('Error in refresh:', error);
    return response.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
}
