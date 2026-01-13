-- Временное отключение триггера update_users_last_used_at
-- Триггер вызывает ошибку, так как пытается использовать updated_at, которого нет

-- Вариант 1: Отключить триггер (можно включить обратно позже)
ALTER TABLE users DISABLE TRIGGER update_users_last_used_at;

-- Вариант 2: Удалить триггер полностью (если не нужен)
-- DROP TRIGGER IF EXISTS update_users_last_used_at ON users;

-- Вариант 3: Исправить функцию триггера (рекомендуется)
-- Выполните database_fix_trigger.sql для исправления функции
