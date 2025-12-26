# CryptoLottery.today

Decentralized lottery platform with Chainlink VRF - Fair, Transparent, and Secure.

## Features

- 🎰 **Decentralized Lottery** - Powered by Chainlink VRF for provably fair randomness
- 💰 **Telegram Wallet Integration** - Seamless payments via Telegram Wallet
- 🎫 **NFT Tickets** - Unique NFT tickets for each lottery draw
- 📱 **Telegram Mini App** - Native Telegram integration
- 🔐 **Secure** - Built on TON blockchain with Supabase backend

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: shadcn-ui + Tailwind CSS
- **Blockchain**: TON Connect
- **Backend**: Supabase
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Telegram Bot (for mini app)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

Run the SQL migrations in order:

1. `database.sql` - Base schema
2. `database_telegram_migration.sql` - Telegram ID support
3. `database_trigger_lowercase.sql` - Lowercase wallet addresses

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

The project will be available at: `https://crypto-lottery-today.vercel.app`

### Telegram Mini App Setup

1. Create a bot via @BotFather
2. Set up mini app with URL: `https://crypto-lottery-today.vercel.app`
3. Configure TON Connect manifest

See `TELEGRAM_SETUP.md` for detailed instructions.

## Project Structure

```
src/
  ├── components/     # UI components
  ├── pages/          # Page components
  ├── lib/            # Utilities and Supabase client
  └── hooks/          # Custom React hooks
```

## License

MIT
