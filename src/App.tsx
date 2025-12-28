// src/App.tsx
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import MiniApp from "./pages/MiniApp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  const [checked, setChecked] = useState(false);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    const check = () => {
      const tg = (window as any).Telegram?.WebApp || (window as any).telegram?.WebApp;
      setIsTelegram(!!tg);
      setChecked(true);
    };

    check();
    const timer = setTimeout(check, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!checked) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={isTelegram ? <MiniApp /> : <Navigate to="/landing" replace />} />
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