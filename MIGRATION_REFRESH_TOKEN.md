# Миграция на Refresh Token систему

## Обзор изменений

Система авторизации была переработана для использования refresh token вместо временных токенов авторизации. Теперь:

1. **Таблица `auth_tokens` удалена** - все данные перенесены в `users`
2. **Добавлены поля в `users`**:
   - `refresh_token` (TEXT) - уникальный токен для обновления сессии
   - `refresh_expires_at` (TIMESTAMPTZ) - срок действия refresh token (30 дней)
   - `last_used_at` (TIMESTAMPTZ) - последнее использование
   - `is_revoked` (BOOLEAN) - отозван ли токен
   - `last_login_at` (TIMESTAMPTZ) - последний вход
   - `username` (TEXT) - имя пользователя из Telegram
   - `first_name` (TEXT) - имя из Telegram

3. **Новые API endpoints**:
   - `POST /api/auth/login` - логин через Telegram (создает/обновляет пользователя, выдает refresh token)
   - `POST /api/auth/refresh` - обновление access token через refresh token
   - `GET /api/auth/callback?refreshToken=...` - обработка callback с refresh token
   - `POST /api/auth/logout` - отзыв refresh token

4. **Удалены/изменены**:
   - `GET /api/auth/generate-token` - больше не используется (можно удалить)
   - `POST /api/auth/verify-token` - больше не используется (можно удалить)

## Шаги миграции

### 1. Выполните SQL миграцию

Откройте SQL Editor в Supabase и выполните содержимое файла `database_refresh_token_migration.sql`.

**ВАЖНО**: Перед выполнением убедитесь, что:
- У вас есть резервная копия базы данных
- Все данные из `auth_tokens` будут перенесены в `users`
- Таблица `auth_tokens` будет удалена

### 2. Обновите переменные окружения

Убедитесь, что в Vercel установлены:
- `VITE_SUPABASE_URL` или `SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` или `SUPABASE_ANON_KEY`
- `WEB_APP_URL` (опционально, по умолчанию `https://giftdraw.today`)

### 3. Деплой изменений

После выполнения миграции SQL, задеплойте обновленный код на Vercel.

### 4. Проверка работы

1. Откройте сайт и нажмите "Connect via Telegram"
2. Бот должен открыться без параметров
3. Нажмите `/start` или кнопку "Authorize" в боте
4. Должна произойти авторизация и редирект на сайт
5. Проверьте, что пользователь авторизован (отображается аватар и имя)

## Как работает новая система

### Логин через Telegram

1. Пользователь нажимает "Connect via Telegram" на сайте
2. Открывается бот Telegram
3. Пользователь нажимает `/start` или кнопку "Authorize"
4. Бот вызывает `POST /api/auth/login` с `telegramId`, `username`, `firstName`
5. API создает/обновляет пользователя в `users` и генерирует:
   - `refresh_token` (действителен 30 дней)
   - `access_token` (действителен 15 минут)
6. Бот отправляет пользователю ссылку с `refreshToken`
7. Пользователь переходит по ссылке → `/auth?refreshToken=...`
8. Frontend вызывает `GET /api/auth/callback?refreshToken=...`
9. Backend проверяет refresh token и устанавливает cookie с сессией
10. Пользователь перенаправляется на главную страницу

### Обновление access token

1. Frontend может вызывать `POST /api/auth/refresh` с `refreshToken`
2. Backend проверяет:
   - Токен существует
   - Токен не отозван (`is_revoked = false`)
   - Токен не истек (`refresh_expires_at > NOW()`)
3. Если все ОК, выдается новый `access_token`
4. Опционально: можно включить rotation refresh token (в `user-auth-store.ts`)

### Logout

1. Frontend вызывает `POST /api/auth/logout`
2. Backend:
   - Находит refresh token в cookie или body
   - Устанавливает `is_revoked = true` для этого токена
   - Удаляет cookie с сессией
3. Пользователь разлогинен

## Преимущества новой системы

1. **Безопасность**: Refresh token можно отозвать, access token короткоживущий
2. **Многодевайсность**: Один refresh token можно использовать с разных устройств
3. **Простота**: Не нужно генерировать временные токены на сайте
4. **Надежность**: Данные хранятся в одной таблице `users`

## Обратная совместимость

Старые токены из `auth_tokens` будут автоматически перенесены в `users.refresh_token` при миграции. После миграции старые токены больше не будут работать, так как таблица `auth_tokens` удалена.

## Удаление старых файлов (опционально)

После успешной миграции можно удалить:
- `api/lib/supabase-token-store.ts` (заменен на `user-auth-store.ts`)
- `api/auth/generate-token.ts` (больше не используется)
- `api/auth/verify-token.ts` (больше не используется)
- `database_auth_tokens.sql` (таблица удалена)
