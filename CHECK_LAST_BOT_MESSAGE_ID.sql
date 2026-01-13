-- Проверка наличия колонки last_bot_message_id в таблице users
-- Выполните этот запрос, чтобы проверить, существует ли колонка

SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND column_name = 'last_bot_message_id';

-- Если запрос вернул пустой результат, выполните миграцию:
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS last_bot_message_id INTEGER;

-- Проверка текущих значений last_bot_message_id
SELECT 
  telegram_id, 
  username, 
  first_name, 
  last_bot_message_id,
  created_at
FROM users 
WHERE last_bot_message_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
