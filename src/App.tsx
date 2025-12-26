import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Типы для window.telegram уже определены в Index.tsx

const App = () => {
  // Инициализация Telegram WebApp при загрузке приложения
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let resizeHandler: (() => void) | null = null;
    let viewportHandler: (() => void) | null = null;
    let retryCount = 0;
    const MAX_RETRIES = 50; // Максимум 50 попыток (5 секунд)
    
    // Функция инициализации Telegram WebApp
    const initTelegramWebApp = () => {
      if (typeof window === 'undefined') return false;
      
      // Проверяем наличие Telegram WebApp SDK
      if (!window.telegram?.WebApp) {
        retryCount++;
        if (retryCount > MAX_RETRIES) {
          console.warn('Telegram WebApp SDK not loaded after maximum retries');
          return false;
        }
        console.log(`Telegram WebApp SDK not loaded yet, retrying... (${retryCount}/${MAX_RETRIES})`);
        // Повторяем попытку через 100ms
        timeoutId = setTimeout(initTelegramWebApp, 100);
        return false;
      }

      const tg = window.telegram.WebApp;
      
      // Проверяем, что методы доступны
      if (!tg.ready || !tg.expand || !tg.disableVerticalSwipes) {
        retryCount++;
        if (retryCount > MAX_RETRIES) {
          console.warn('Telegram WebApp methods not available after maximum retries');
          return false;
        }
        console.log(`Telegram WebApp methods not available yet, retrying... (${retryCount}/${MAX_RETRIES})`);
        timeoutId = setTimeout(initTelegramWebApp, 100);
        return false;
      }
      
      // Сбрасываем счетчик при успешной инициализации
      retryCount = 0;

      console.log('Initializing Telegram WebApp...');
      
      try {
        // ВАЖНО: ready() должен быть вызван первым
        tg.ready();
        
        // Настраиваем полноэкранный режим
        tg.expand(); // Разворачиваем приложение на весь экран
        console.log('Telegram WebApp expanded');
        
        // Отключаем сворачивание приложения свайпом вниз
        tg.disableVerticalSwipes(); // Отключаем вертикальные свайпы
        console.log('Vertical swipes disabled');
        
        // Настраиваем внешний вид для Telegram WebApp
        tg.setHeaderColor('#0a0a0a'); // Темный фон для шапки
        tg.setBackgroundColor('#0a0a0a'); // Темный фон для приложения
        tg.enableClosingConfirmation(); // Подтверждение закрытия
        console.log('Telegram WebApp appearance configured');
        
        // Обработчик изменения viewport для поддержания полноэкранного режима
        viewportHandler = () => {
          console.log('Viewport changed, expanding...');
          if (tg.expand) {
            tg.expand();
          }
        };
        
        if (tg.onEvent && viewportHandler) {
          tg.onEvent('viewportChanged', viewportHandler);
        }
        
        // Также обрабатываем событие изменения размера окна
        resizeHandler = () => {
          setTimeout(() => {
            if (tg.expand) {
              tg.expand();
            }
          }, 100);
        };
        window.addEventListener('resize', resizeHandler);
        
        return true;
      } catch (error) {
        console.error('Error initializing Telegram WebApp:', error);
        return false;
      }
    };

    // Пробуем инициализировать сразу
    initTelegramWebApp();
    
    // Также пробуем после полной загрузки страницы
    const domContentLoadedHandler = () => {
      initTelegramWebApp();
    };
    
    const loadHandler = () => {
      initTelegramWebApp();
    };
    
    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', domContentLoadedHandler);
    } else {
      // Если DOM уже загружен, пробуем сразу
      initTelegramWebApp();
    }
    
    // Также пробуем после полной загрузки всех ресурсов
    window.addEventListener('load', loadHandler);
    
    // Cleanup: удаляем обработчики событий при размонтировании
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (resizeHandler) {
        window.removeEventListener('resize', resizeHandler);
      }
      if (viewportHandler && window.telegram?.WebApp?.offEvent) {
        window.telegram.WebApp.offEvent('viewportChanged', viewportHandler);
      }
      window.removeEventListener('DOMContentLoaded', domContentLoadedHandler);
      window.removeEventListener('load', loadHandler);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
