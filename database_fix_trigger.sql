-- Исправление триггера update_last_used_at
-- Проблема: триггер пытался использовать NEW.updated_at, которого нет в UPDATE запросе
-- Решение: убрать использование updated_at из триггера

-- Сначала удаляем старый триггер
DROP TRIGGER IF EXISTS update_users_last_used_at ON users;

-- Пересоздаем функцию без использования updated_at
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

-- Создаем триггер заново
CREATE TRIGGER update_users_last_used_at
  BEFORE UPDATE OF refresh_token, refresh_expires_at ON users
  FOR EACH ROW
  WHEN (NEW.refresh_token IS NOT NULL)
  EXECUTE FUNCTION update_last_used_at();
