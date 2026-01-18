-- Миграция: Добавление поля для отслеживания file_id аватара
-- Это позволяет определять, изменился ли аватар пользователя в Telegram

-- Добавляем поле для хранения file_id текущего аватара
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_file_id TEXT;

-- Создаем индекс для быстрого поиска (опционально)
CREATE INDEX IF NOT EXISTS idx_users_avatar_file_id ON users(avatar_file_id) WHERE avatar_file_id IS NOT NULL;

-- Комментарий для документации
COMMENT ON COLUMN users.avatar_file_id IS 'Telegram file_id of the current avatar photo, used to detect avatar changes';
