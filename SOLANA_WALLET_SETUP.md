# Настройка Solana Wallet Integration

## Что было сделано

1. ✅ Установлены необходимые пакеты для работы с Solana wallet adapter
2. ✅ Создан провайдер `SolanaWalletProvider` с поддержкой только Phantom, Solflare и Backpack
3. ✅ Созданы утилиты для получения балансов SOL, USDT и GIFT (SPL токены)
4. ✅ Интегрирован Solana wallet adapter с кнопкой подключения в ProfileScreen
5. ✅ Обновлен ProfileScreen для отображения балансов SOL, USDT и GIFT
6. ✅ Создана функция для отправки транзакции на покупку билета

## Что нужно настроить

### 1. Адрес токена GIFT

В файле `src/lib/solana.ts` нужно указать адрес токена GIFT:

```typescript
export const GIFT_MINT_ADDRESS = ''; // TODO: Добавьте адрес токена GIFT
```

### 2. Адрес кошелька лотереи

В файле `src/lib/solana.ts` нужно указать адрес кошелька, куда будут отправляться платежи:

```typescript
export const LOTTERY_WALLET_ADDRESS = ''; // TODO: Добавьте адрес кошелька лотереи
```

### 3. RPC Endpoint (опционально)

По умолчанию используется публичный RPC endpoint. Для продакшена рекомендуется использовать собственный RPC:

```typescript
export const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com'; // Или ваш кастомный RPC
```

## Использование

### Подключение кошелька

Компонент `SolanaWalletButton` автоматически показывает модальное окно с выбором кошелька (Phantom, Solflare, Backpack) при нажатии на кнопку "Connect Wallet".

### Получение балансов

Используйте хук `useSolanaBalances` для получения балансов:

```typescript
import { useSolanaBalances } from '@/hooks/useSolanaBalances';

const { solBalance, usdtBalance, giftBalance, loading, refresh } = useSolanaBalances();
```

### Покупка билета

Используйте функцию `purchaseTicket` для отправки транзакции:

```typescript
import { usePurchaseTicket } from '@/lib/solana-transactions';

const { purchase, wallet } = usePurchaseTicket();

// При покупке билета
const signature = await purchase(1.0); // 1.0 USDT
```

## Структура файлов

- `src/lib/solana.ts` - Утилиты для работы с Solana (балансы, транзакции)
- `src/lib/solana-wallet-provider.tsx` - Провайдер для Solana wallet adapter
- `src/lib/solana-transactions.ts` - Функции для отправки транзакций
- `src/components/SolanaWalletButton.tsx` - Кнопка подключения кошелька
- `src/components/SolanaWalletModal.tsx` - Модальное окно выбора кошелька
- `src/hooks/useSolanaBalances.ts` - Хук для получения балансов
- `src/pages/miniapp/ProfileScreen.tsx` - Обновленный экран профиля с Solana интеграцией

## Поддерживаемые кошельки

- ✅ Phantom
- ✅ Solflare
- ✅ Backpack

## Важные замечания

1. **Сеть**: По умолчанию используется Mainnet. Для тестирования измените `SOLANA_NETWORK` на `WalletAdapterNetwork.Devnet` в `src/lib/solana.ts`

2. **Десятичные знаки**: 
   - USDT имеет 6 десятичных знаков
   - GIFT по умолчанию использует 9 десятичных знаков (можно изменить в функции `getTokenBalance`)

3. **Комиссии**: Все транзакции требуют SOL для оплаты комиссий. Убедитесь, что у пользователя достаточно SOL на балансе.

4. **Мобильные кошельки**: Все три поддерживаемых кошелька имеют мобильные версии и будут работать на мобильных устройствах.
