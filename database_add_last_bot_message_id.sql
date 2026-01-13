-- Добавление колонки last_bot_message_id в таблицу users
-- Эта колонка хранит ID последнего сообщения бота для каждого пользователя
-- Позволяет удалять предыдущие сообщения перед отправкой нового

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_bot_message_id INTEGER;

-- Комментарий к колонке
COMMENT ON COLUMN users.last_bot_message_id IS 'ID последнего сообщения бота в Telegram для этого пользователя. Используется для удаления предыдущих сообщений перед отправкой нового.';
