// src/pages/MiniApp.tsx
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolanaBalances } from '@/hooks/useSolanaBalances';
import HomeScreen from './miniapp/HomeScreen';
import TicketsScreen from './miniapp/TicketsScreen';
import ProfileScreen from './miniapp/ProfileScreen';

type Screen = 'home' | 'tickets' | 'profile';

export default function MiniApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const { publicKey } = useWallet();
  const { solBalance, usdtBalance, giftBalance, loading: balancesLoading } = useSolanaBalances();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isBalanceVisible, setIsBalanceVisible] = useState(() => {
    const saved = localStorage.getItem('balance_visible');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toString());
    } else {
      setWalletAddress(null);
    }
  }, [publicKey]);

  const handleConnectWallet = (address: string) => {
    setWalletAddress(address);
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
  };

  const handleToggleBalanceVisibility = () => {
    const newValue = !isBalanceVisible;
    setIsBalanceVisible(newValue);
    localStorage.setItem('balance_visible', String(newValue));
  };

  const handleBuyTicket = () => {
    console.log('Buy ticket clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 backdrop-blur-xl bg-background/50 z-50">
        <div className="flex items-center justify-around px-4 py-3">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <span>Home</span>
          </button>
          <button
            onClick={() => setCurrentScreen('tickets')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'tickets' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <span>Tickets</span>
          </button>
          <button
            onClick={() => setCurrentScreen('profile')}
            className={`flex flex-col items-center gap-1 ${currentScreen === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <span>Profile</span>
          </button>
        </div>
      </nav>

      <div className="pb-20">
        {currentScreen === 'home' && (
          <HomeScreen
            currentDraw={null}
            onEnterDraw={() => setCurrentScreen('tickets')}
          />
        )}
        {currentScreen === 'tickets' && (
          <TicketsScreen
            tickets={[]}
            onEnterDraw={() => {}}
            onBuyTicket={handleBuyTicket}
            loading={false}
          />
        )}
        {currentScreen === 'profile' && (
          <ProfileScreen
            telegramUser={null}
            user={null}
            walletAddress={walletAddress}
            giftBalance={giftBalance}
            usdtBalance={usdtBalance}
            solBalance={solBalance}
            isBalanceVisible={isBalanceVisible}
            onToggleBalanceVisibility={handleToggleBalanceVisibility}
            onConnectWallet={handleConnectWallet}
            onBuyTicket={handleBuyTicket}
            loading={balancesLoading}
          />
        )}
      </div>
    </div>
  );
}
