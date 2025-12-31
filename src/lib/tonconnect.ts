// src/lib/tonconnect.ts
import { TonConnect } from '@tonconnect/sdk';
import { Address } from '@ton/core';

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

// Convert raw address (0:hex) to user-friendly format (UQ...)
export const toUserFriendlyAddress = (rawAddress: string): string => {
  try {
    const address = Address.parse(rawAddress);
    return address.toString({ urlSafe: true, bounceable: false });
  } catch (error) {
    console.error('Error converting address:', error);
    return rawAddress; // Return original if conversion fails
  }
};

// Get wallet address in user-friendly format
export const getWalletAddress = (): string | null => {
  const wallet = tonConnect.wallet;
  const rawAddress = wallet?.account?.address;
  if (!rawAddress) return null;
  return toUserFriendlyAddress(rawAddress);
};

// Check if wallet is connected
export const isWalletConnected = (): boolean => {
  return tonConnect.wallet !== null;
};

