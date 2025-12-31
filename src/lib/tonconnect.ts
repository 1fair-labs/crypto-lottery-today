// src/lib/tonconnect.ts
import { TonConnect } from '@tonconnect/sdk';

const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;

export const tonConnect = new TonConnect({
  manifestUrl,
});

// Initialize TON Connect
export const initTonConnect = async () => {
  try {
    await tonConnect.restoreConnection();
    return tonConnect;
  } catch (error) {
    console.error('Error initializing TON Connect:', error);
    return tonConnect;
  }
};

// Get wallet address
export const getWalletAddress = (): string | null => {
  const wallet = tonConnect.wallet;
  return wallet?.account?.address || null;
};

// Check if wallet is connected
export const isWalletConnected = (): boolean => {
  return tonConnect.wallet !== null;
};

