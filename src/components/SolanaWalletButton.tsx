// src/components/SolanaWalletButton.tsx
import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Wallet, Loader2 } from 'lucide-react';
import { SolanaWalletModal } from './SolanaWalletModal';

interface SolanaWalletButtonProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
  loading?: boolean;
}

export function SolanaWalletButton({ onConnect, onDisconnect, loading }: SolanaWalletButtonProps) {
  const { wallet, publicKey, disconnect, connecting } = useWallet();
  const [modalOpen, setModalOpen] = useState(false);

  const handleConnect = () => {
    setModalOpen(true);
  };

  const handleDisconnect = async () => {
    await disconnect();
    onDisconnect?.();
  };

  // Subscribe to wallet connection
  useEffect(() => {
    if (publicKey && onConnect) {
      // Convert PublicKey to string for walletAddress
      const address = publicKey.toString();
      onConnect(address);
      setModalOpen(false);
    }
  }, [publicKey, onConnect]);

  if (publicKey) {
    return (
      <Button
        variant="outline"
        onClick={handleDisconnect}
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Disconnecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </>
        )}
      </Button>
    );
  }

  return (
    <>
      <Button
        onClick={handleConnect}
        disabled={connecting || loading}
        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground font-display font-bold"
      >
        {connecting || loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </>
        )}
      </Button>
      <SolanaWalletModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
