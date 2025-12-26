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
    if (typeof window !== 'undefined' && window.telegram?.WebApp) {
      const tg = window.telegram.WebApp;
      tg.ready();
      
      // Настраиваем полноэкранный режим
      tg.expand(); // Разворачиваем приложение на весь экран
      
      // Отключаем сворачивание приложения свайпом вниз
      tg.disableVerticalSwipes(); // Отключаем вертикальные свайпы
      
      // Настраиваем внешний вид для Telegram WebApp
      tg.setHeaderColor('#0a0a0a'); // Темный фон для шапки
      tg.setBackgroundColor('#0a0a0a'); // Темный фон для приложения
      tg.enableClosingConfirmation(); // Подтверждение закрытия
      
      // Обработчик изменения viewport для поддержания полноэкранного режима
      const handleViewportChanged = () => {
        tg.expand(); // Всегда разворачиваем приложение
      };
      tg.onEvent('viewportChanged', handleViewportChanged);
      
      // Cleanup: удаляем обработчик события при размонтировании
      return () => {
        if (tg.offEvent) {
          tg.offEvent('viewportChanged', handleViewportChanged);
        }
      };
    }
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
