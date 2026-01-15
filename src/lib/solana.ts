// src/lib/solana.ts
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Solana network configuration
export const SOLANA_NETWORK = WalletAdapterNetwork.Mainnet; // или WalletAdapterNetwork.Devnet для тестирования
export const SOLANA_RPC_URL = process.env.VITE_SOLANA_RPC_URL || clusterApiUrl(SOLANA_NETWORK);

// Create connection
export const solanaConnection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Token mint addresses (нужно будет заменить на реальные адреса)
export const USDT_MINT = new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'); // USDT на Solana
export const GIFT_MINT = new PublicKey('YOUR_GIFT_TOKEN_MINT_ADDRESS'); // Замените на реальный адрес GIFT токена

/**
 * Get USDT balance for a wallet
 */
export async function getUSDTBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const tokenAccount = await getAssociatedTokenAddress(USDT_MINT, publicKey);
    
    try {
      const accountInfo = await getAccount(solanaConnection, tokenAccount);
      // USDT has 6 decimals
      return Number(accountInfo.amount) / 1_000_000;
    } catch (error) {
      // Token account doesn't exist, balance is 0
      return 0;
    }
  } catch (error) {
    console.error('Error getting USDT balance:', error);
    return 0;
  }
}

/**
 * Get GIFT token balance for a wallet
 */
export async function getGIFTBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const tokenAccount = await getAssociatedTokenAddress(GIFT_MINT, publicKey);
    
    try {
      const accountInfo = await getAccount(solanaConnection, tokenAccount);
      // Assuming GIFT has 9 decimals (adjust if different)
      return Number(accountInfo.amount) / 1_000_000_000;
    } catch (error) {
      // Token account doesn't exist, balance is 0
      return 0;
    }
  } catch (error) {
    console.error('Error getting GIFT balance:', error);
    return 0;
  }
}

/**
 * Get SOL balance for a wallet
 */
export async function getSOLBalance(walletAddress: string): Promise<number> {
  try {
    const publicKey = new PublicKey(walletAddress);
    const balance = await solanaConnection.getBalance(publicKey);
    // SOL has 9 decimals
    return balance / 1_000_000_000;
  } catch (error) {
    console.error('Error getting SOL balance:', error);
    return 0;
  }
}

/**
 * Create a transfer transaction for purchasing a ticket
 * @param fromWallet - Public key of the sender
 * @param toWallet - Public key of the recipient (lottery wallet)
 * @param amount - Amount in USDT (will be converted to token units)
 * @returns Transaction object
 */
export async function createPurchaseTransaction(
  fromWallet: PublicKey,
  toWallet: PublicKey,
  amount: number
) {
  const { Transaction } = await import('@solana/web3.js');
  const { createTransferInstruction } = await import('@solana/spl-token');
  
  const transaction = new Transaction();
  
  // Get associated token addresses
  const fromTokenAccount = await getAssociatedTokenAddress(USDT_MINT, fromWallet);
  const toTokenAccount = await getAssociatedTokenAddress(USDT_MINT, toWallet);
  
  // Amount in token units (USDT has 6 decimals)
  const amountInUnits = Math.floor(amount * 1_000_000);
  
  // Create transfer instruction
  const transferInstruction = createTransferInstruction(
    fromTokenAccount,
    toTokenAccount,
    fromWallet,
    amountInUnits
  );
  
  transaction.add(transferInstruction);
  
  // Get recent blockhash
  const { blockhash } = await solanaConnection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromWallet;
  
  return transaction;
}
