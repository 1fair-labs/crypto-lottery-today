-- Миграция: Объединение auth_tokens в users и добавление refresh token системы
-- ВАЖНО: Выполняйте эту миграцию пошагово и проверяйте результаты

-- Шаг 1: Добавляем новые поля в таблицу users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS refresh_token TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS refresh_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS access_token TEXT,
ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_revoked BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE;

-- Шаг 2: Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_users_refresh_token ON users(refresh_token) WHERE refresh_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_access_token ON users(access_token) WHERE access_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id) WHERE telegram_id IS NOT NULL;

-- Шаг 3: Переносим данные из auth_tokens в users
-- Обновляем существующих пользователей данными из auth_tokens
UPDATE users u
SET 
  refresh_token = at.token,
  refresh_expires_at = at.expires_at,
  last_used_at = at.created_at,
  username = at.username,
  first_name = at.first_name,
  is_revoked = false
FROM auth_tokens at
WHERE u.telegram_id = at.user_id 
  AND at.user_id IS NOT NULL
  AND at.expires_at > NOW();

-- Шаг 4: Создаем пользователей для токенов, у которых нет соответствующего пользователя
-- (если такие есть - токены без user_id не переносим, они будут удалены)
INSERT INTO users (telegram_id, refresh_token, refresh_expires_at, last_used_at, username, first_name, created_at, updated_at, is_revoked)
SELECT 
  at.user_id as telegram_id,
  at.token as refresh_token,
  at.expires_at as refresh_expires_at,
  at.created_at as last_used_at,
  at.username,
  at.first_name,
  at.created_at,
  NOW() as updated_at,
  false as is_revoked
FROM auth_tokens at
WHERE at.user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM users u WHERE u.telegram_id = at.user_id
  )
  AND at.expires_at > NOW();

-- Шаг 5: Удаляем старую таблицу auth_tokens
-- ВАЖНО: Убедитесь, что все данные перенесены перед удалением!
DROP TABLE IF EXISTS auth_tokens CASCADE;

-- Шаг 6: Удаляем старые индексы auth_tokens (если они еще существуют)
DROP INDEX IF EXISTS idx_auth_tokens_user_id;
DROP INDEX IF EXISTS idx_auth_tokens_active;

-- Шаг 7: Удаляем функцию cleanup_expired_tokens (больше не нужна)
DROP FUNCTION IF EXISTS cleanup_expired_tokens();

-- Шаг 8: Добавляем комментарии для документации
COMMENT ON COLUMN users.refresh_token IS 'Refresh token for session management';
COMMENT ON COLUMN users.refresh_expires_at IS 'When the refresh token expires';
COMMENT ON COLUMN users.access_token IS 'Access token for API requests';
COMMENT ON COLUMN users.access_expires_at IS 'When the access token expires';
COMMENT ON COLUMN users.last_used_at IS 'Last time the refresh token was used';
COMMENT ON COLUMN users.is_revoked IS 'Whether the refresh token is revoked';
COMMENT ON COLUMN users.last_login_at IS 'Last login timestamp';

-- Шаг 9: Создаем функцию для автоматического обновления last_used_at
CREATE OR REPLACE FUNCTION update_last_used_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_used_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Шаг 10: Создаем триггер для обновления last_used_at при обновлении refresh_token
-- Исправленная версия: не используем updated_at в триггере
CREATE OR REPLACE FUNCTION update_last_used_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Обновляем last_used_at только если обновляется refresh_token
  IF TG_OP = 'UPDATE' AND NEW.refresh_token IS NOT NULL THEN
    NEW.last_used_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_last_used_at
  BEFORE UPDATE OF refresh_token, refresh_expires_at ON users
  FOR EACH ROW
  WHEN (NEW.refresh_token IS NOT NULL)
  EXECUTE FUNCTION update_last_used_at();
