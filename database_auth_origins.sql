-- Создание таблицы для временного хранения origin для токенов авторизации
-- Выполните этот SQL в Supabase SQL Editor

CREATE TABLE IF NOT EXISTS auth_origins (
  token TEXT PRIMARY KEY,
  origin TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Создаем индекс для быстрого поиска по токену
CREATE INDEX IF NOT EXISTS idx_auth_origins_token ON auth_origins(token);

-- Создаем индекс для очистки истекших записей
CREATE INDEX IF NOT EXISTS idx_auth_origins_expires_at ON auth_origins(expires_at);

-- Функция для автоматической очистки истекших записей (опционально)
-- Можно настроить как cron job в Supabase
CREATE OR REPLACE FUNCTION cleanup_expired_auth_origins()
RETURNS void AS $$
BEGIN
  DELETE FROM auth_origins WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Комментарии к таблице
COMMENT ON TABLE auth_origins IS 'Временное хранилище origin для токенов авторизации перед переходом к Telegram боту';
COMMENT ON COLUMN auth_origins.token IS 'Токен авторизации (первичный ключ)';
COMMENT ON COLUMN auth_origins.origin IS 'Origin URL, с которого пользователь начал авторизацию';
COMMENT ON COLUMN auth_origins.expires_at IS 'Время истечения записи (обычно 10 минут)';
COMMENT ON COLUMN auth_origins.created_at IS 'Время создания записи';
