// src/pages/AuthCallback.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refreshToken = searchParams.get('refreshToken');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!refreshToken) {
      // Если refresh token нет, перенаправляем на главную
      navigate('/', { replace: true });
      return;
    }

    // Обрабатываем refresh token через API, используя fetch вместо прямого редиректа
    // Это избежит блокировки браузером URL с токеном
    const processRefreshToken = async () => {
      try {
        // Используем GET запрос к callback API, но через fetch
        const response = await fetch(`/api/auth/callback?refreshToken=${encodeURIComponent(refreshToken)}`, {
          method: 'GET',
          credentials: 'include', // Важно для передачи cookies
          redirect: 'follow', // Следуем редиректам
        });

        if (response.ok || response.redirected) {
          // Если успешно или был редирект, переходим на главную
          // Cookie уже установлен сервером
          window.location.href = '/';
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          setError(errorData.error || 'Authorization failed');
          // Через 3 секунды редиректим на главную даже при ошибке
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        }
      } catch (err: any) {
        console.error('Error processing refresh token:', err);
        setError(err.message || 'Authorization failed');
        // Через 3 секунды редиректим на главную даже при ошибке
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    processRefreshToken();
  }, [refreshToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <div className="text-red-500 text-lg font-semibold">Ошибка авторизации</div>
            <p className="text-muted-foreground">{error}</p>
            <p className="text-sm text-muted-foreground">Перенаправление на главную страницу...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Авторизация...</p>
          </>
        )}
      </div>
    </div>
  );
}

