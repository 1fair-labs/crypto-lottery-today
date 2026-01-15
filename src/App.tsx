// src/App.tsx
import { useEffect, useState, useMemo, useCallback } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { BackpackWalletAdapter } from '@solana/wallet-adapter-backpack';
import { GlowWalletAdapter } from '@solana/wallet-adapter-glow';
import { TorusWalletAdapter } from '@solana/wallet-adapter-torus';
import { LedgerWalletAdapter } from '@solana/wallet-adapter-ledger';
import { MathWalletAdapter } from '@solana/wallet-adapter-mathwallet';
import { CoinbaseWalletAdapter } from '@solana/wallet-adapter-coinbase';
import { TrustWalletAdapter } from '@solana/wallet-adapter-trust';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';
import { isInTelegramWebApp } from '@/lib/telegram';
import Landing from "./pages/Landing";
import MiniApp from "./pages/MiniApp";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

// Компонент для корневого пути - сразу редиректит на /landing если не Telegram
function RootRedirect() {
  const [isTelegram, setIsTelegram] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const check = () => {
      // СТРОГАЯ проверка: только если Telegram SDK реально загружен
      // НЕ создаем window.telegram.WebApp искусственно!
      const tg = (window as any).Telegram?.WebApp || (window as any).telegram?.WebApp;
      
      // Если объекта нет вообще - точно не Telegram
      if (!tg) {
        setIsTelegram(false);
        setChecked(true);
        return;
      }
      
      // Дополнительные проверки для реального Telegram WebApp:
      // 1. Должен быть initDataUnsafe с user (данные пользователя)
      // 2. ИЛИ platform должен быть валидным (не 'unknown', не 'web')
      // 3. Должен быть метод ready (признак реального SDK)
      const hasUser = !!tg?.initDataUnsafe?.user;
      const platform = tg?.platform;
      const hasValidPlatform = platform && 
        platform !== 'unknown' && 
        platform !== 'web' && 
        (platform === 'ios' || platform === 'android' || platform === 'tdesktop' || platform === 'desktop' || platform === 'macos' || platform === 'windows' || platform === 'linux');
      const hasReadyMethod = typeof tg?.ready === 'function';
      
      // Только если есть пользователь ИЛИ валидная платформа И метод ready
      const isRealTelegram = hasReadyMethod && (hasUser || hasValidPlatform);
      
      setIsTelegram(isRealTelegram);
      setChecked(true);
    };

    // Проверяем сразу
    check();
    
    // И еще раз через небольшую задержку на случай асинхронной загрузки SDK
    const timer = setTimeout(check, 300);
    return () => clearTimeout(timer);
  }, []);

  // Пока проверяем, показываем loading
  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Показываем MiniApp на корневом пути (редирект отключен)
  return <MiniApp />;
}

function App() {
  const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;
  
  // Solana network configuration
  const network = WalletAdapterNetwork.Devnet; // Testnet для тестирования
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  // Supported wallets
  // Исключаем Solflare в Telegram WebApp из-за CSP (Content Security Policy) ограничений
  const isInTelegram = isInTelegramWebApp();
  const wallets = useMemo(
    () => {
      const walletList = [
        new PhantomWalletAdapter(),
        new BackpackWalletAdapter(),
        new GlowWalletAdapter(),
        new TorusWalletAdapter(),
        new LedgerWalletAdapter(),
        new MathWalletAdapter(),
        new CoinbaseWalletAdapter(),
        new TrustWalletAdapter(),
      ];
      
      // Solflare не работает в Telegram WebApp из-за CSP, добавляем только вне Telegram
      if (!isInTelegram) {
        walletList.splice(1, 0, new SolflareWalletAdapter()); // Вставляем после Phantom
      }
      
      return walletList;
    },
    [isInTelegram]
  );

  // Обработчик ошибок кошелька
  const onError = useCallback((error: any) => {
    console.error('Wallet error:', error);
    
    // Определяем название кошелька из ошибки
    const walletName = error?.wallet?.name || error?.name || 'wallet';
    const errorMessage = error?.message || '';
    const errorName = error?.name || '';
    
    // Проверяем ошибки CSP (Content Security Policy) - особенно для Solflare в Telegram
    const isCSPError = 
      errorMessage.toLowerCase().includes('content security policy') ||
      errorMessage.toLowerCase().includes('frame-src') ||
      errorMessage.toLowerCase().includes('violates') ||
      errorMessage.toLowerCase().includes('connect.solflare.com');
    
    if (isCSPError) {
      alert('This wallet cannot be used in Telegram WebApp due to security restrictions. Please use another wallet like Phantom, Backpack, or Glow.');
      return;
    }
    
    // Проверяем, является ли ошибка "кошелек не найден"
    const isWalletNotFound = 
      errorName === 'WalletNotFoundError' ||
      errorName === 'WalletNotInstalledError' ||
      errorMessage.toLowerCase().includes('not found') ||
      errorMessage.toLowerCase().includes('not installed') ||
      errorMessage.toLowerCase().includes('not available');
    
    if (isWalletNotFound) {
      // URL для установки кошельков
      const installUrls: Record<string, string> = {
        'Phantom': 'https://phantom.app/',
        'Solflare': 'https://solflare.com/',
        'Backpack': 'https://www.backpack.app/',
        'Glow': 'https://glow.app/',
        'Torus': 'https://tor.us/',
        'MathWallet': 'https://mathwallet.org/',
        'Coinbase Wallet': 'https://www.coinbase.com/wallet',
        'Trust Wallet': 'https://trustwallet.com/',
      };
      
      const installUrl = installUrls[walletName] || 'https://solana.com/ecosystem/explore?categories=wallet';
      
      // Показываем диалог и открываем страницу установки
      if (confirm(`${walletName} is not installed. Would you like to open the installation page?`)) {
        window.open(installUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      // Для других ошибок показываем сообщение
      const userMessage = errorMessage || 'Unknown error occurred';
      alert(`Wallet error: ${userMessage}`);
    }
  }, []);
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect onError={onError}>
        <WalletModalProvider>
          <TonConnectUIProvider manifestUrl={manifestUrl}>
            <QueryClientProvider client={queryClient}>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<RootRedirect />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/miniapp" element={<MiniApp />} />
                    <Route path="/auth" element={<AuthCallback />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
            </QueryClientProvider>
          </TonConnectUIProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;