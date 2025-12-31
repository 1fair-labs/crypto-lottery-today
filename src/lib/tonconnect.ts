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
  if (!rawAddress) return rawAddress;
  
  // If address is already in user-friendly format (starts with UQ, EQ, etc.), return as is
  if (rawAddress.match(/^[A-Za-z0-9_-]{48}$/)) {
    return rawAddress;
  }
  
  try {
    const address = Address.parse(rawAddress);
    return address.toString({ urlSafe: true, bounceable: false });
  } catch (error) {
    // If conversion fails, return original address
    console.warn('Could not convert address to user-friendly format, using original:', rawAddress, error);
    return rawAddress;
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

