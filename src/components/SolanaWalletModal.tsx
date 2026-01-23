// src/components/SolanaWalletModal.tsx
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

// Helper to detect if we're in Telegram WebView
const isInTelegramWebView = () => {
  return !!(window as any).Telegram?.WebApp;
};

interface SolanaWalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SolanaWalletModal({ open, onOpenChange }: SolanaWalletModalProps) {
  const { wallets, select, connect, connecting, publicKey, connected, wallet } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  // Filter to only show Phantom, Solflare, and Backpack
  const allowedWallets = wallets.filter(
    wallet => 
      wallet.adapter.name === 'Phantom' || 
      wallet.adapter.name === 'Solflare' || 
      wallet.adapter.name === 'Backpack'
  );

  const handleSelectWallet = async (walletName: string) => {
    try {
      setIsConnecting(true);
      
      console.log('🔗 Connecting to wallet:', walletName);
      console.log('📱 Current URL:', window.location.href);
      console.log('📱 User Agent:', navigator.userAgent);
      
      // If wallet is already selected, just connect
      if (wallet && wallet.adapter.name === walletName && connected) {
        // Already connected, just close modal
        console.log('✅ Wallet already connected');
        setIsConnecting(false);
        onOpenChange(false);
        return;
      }
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isInTelegram = !!(window as any).Telegram?.WebApp;
      
      // On mobile in Telegram, we need to handle connection differently
      // Phantom will open in external app, so we need to ensure proper callback
      if (isMobile && isInTelegram) {
        console.log('📱 Mobile Telegram detected - using special handling');
        
        // Store current origin for callback
        const currentOrigin = window.location.origin;
        sessionStorage.setItem('phantom_callback_origin', currentOrigin);
        
        // Select the wallet first
        console.log('1️⃣ Selecting wallet:', walletName);
        await select(walletName);
        
        // Small delay to ensure wallet adapter is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Connect - this will open Phantom app
        console.log('2️⃣ Connecting to wallet (will open Phantom app)...');
        await connect();
        console.log('3️⃣ Connect call completed - user should be in Phantom app now');
        
        // Close modal immediately as user is redirected to Phantom
        setTimeout(() => {
          setIsConnecting(false);
          onOpenChange(false);
        }, 500);
      } else {
        // Desktop or non-Telegram mobile - standard flow
        console.log('🖥️ Desktop or non-Telegram detected - using standard flow');
        
        // Select the wallet first
        console.log('1️⃣ Selecting wallet:', walletName);
        await select(walletName);
        
        // Small delay to ensure wallet adapter is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Then connect to it (this will trigger the wallet popup or deep link)
        console.log('2️⃣ Connecting to wallet...');
        await connect();
        console.log('3️⃣ Connect call completed');
        
        // Modal will close automatically when connected becomes true
      }
    } catch (error) {
      console.error('❌ Error selecting/connecting wallet:', error);
      setIsConnecting(false);
      // Don't close modal on error, let user try again
    }
  };

  // Close modal when wallet is successfully connected
  useEffect(() => {
    if (connected && publicKey && open && !connecting) {
      setIsConnecting(false);
      // Small delay to ensure state is updated
      setTimeout(() => {
        onOpenChange(false);
      }, 300);
    }
  }, [connected, publicKey, open, connecting, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Wallet</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {allowedWallets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No supported wallets found. Please install Phantom, Solflare, or Backpack.
            </p>
          ) : (
            allowedWallets.map((wallet) => {
              const isInstalled = wallet.readyState === 'Installed' || wallet.readyState === 'Loadable';
              const isConnected = publicKey && wallet.adapter.name === wallet.adapter.name;
              
              return (
                <Button
                  key={wallet.adapter.name}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                  onClick={() => handleSelectWallet(wallet.adapter.name)}
                  disabled={!isInstalled || connecting || isConnecting}
                >
                  <div className="flex items-center gap-3 w-full">
                    {wallet.adapter.icon && (
                      <img
                        src={wallet.adapter.icon}
                        alt={wallet.adapter.name}
                        className="w-6 h-6"
                      />
                    )}
                    <div className="flex-1 text-left">
                      <div className="font-medium">{wallet.adapter.name}</div>
                      {!isInstalled && (
                        <div className="text-xs text-muted-foreground">
                          Not installed
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
