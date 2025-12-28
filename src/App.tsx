// src/App.tsx
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import MiniApp from "./pages/MiniApp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Компонент для корневого пути - сразу редиректит на /landing если не Telegram
function RootRedirect() {
  const [isTelegram, setIsTelegram] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = () => {
      const tg = (window as any).Telegram?.WebApp || (window as any).telegram?.WebApp;
      const hasUser = !!tg?.initDataUnsafe?.user;
      const platform = tg?.platform;
      const hasValidPlatform = platform && platform !== 'unknown' && platform !== 'web';
      
      // Проверяем, что это реальный Telegram WebApp
      const isRealTelegram = !!tg && (hasUser || hasValidPlatform);
      
      setIsTelegram(isRealTelegram);
      setChecked(true);
    };

    // Проверяем сразу
    check();
    
    // И еще раз через небольшую задержку на случай асинхронной загрузки SDK
    const timer = setTimeout(check, 100);
    return () => clearTimeout(timer);
  }, []);

  // Пока проверяем, показываем loading только если это может быть Telegram
  if (!checked) {
    const tg = (window as any).Telegram?.WebApp || (window as any).telegram?.WebApp;
    // Если точно не Telegram, сразу редиректим
    if (!tg) {
      return <Navigate to="/landing" replace />;
    }
    // Если может быть Telegram, показываем loading
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // После проверки редиректим или показываем MiniApp
  if (isTelegram) {
    return <MiniApp />;
  } else {
    return <Navigate to="/landing" replace />;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/miniapp" element={<MiniApp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;