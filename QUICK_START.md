# Быстрый старт: Создание нового репозитория

## 1. Создайте репозиторий на GitHub

Откройте: https://github.com/new

- **Repository name**: `crypto-lottery-today`
- **Description**: `Decentralized lottery platform with Telegram integration`
- **Public** или **Private** (на ваш выбор)
- **НЕ** создавайте README, .gitignore, license (они уже есть)

Нажмите **"Create repository"**

## 2. Подключите новый репозиторий

Выполните эти команды в терминале (замените `YOUR_USERNAME` на ваш GitHub username):

```bash
# Перейдите в директорию проекта
cd "C:\Users\Admin\Desktop\CryptoLottery_today\Cursor AI\russian-modem-guide"

# Замените URL remote на новый репозиторий
git remote set-url origin https://github.com/YOUR_USERNAME/crypto-lottery-today.git

# Проверьте, что remote настроен правильно
git remote -v

# Отправьте код в новый репозиторий
git push -u origin main
```

## 3. Деплой в Vercel

1. Откройте: https://vercel.com/new
2. Нажмите **"Import Git Repository"**
3. Выберите `crypto-lottery-today`
4. Настройте:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Добавьте Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Нажмите **"Deploy"**

После деплоя проект будет доступен по адресу:
**https://crypto-lottery-today.vercel.app**

## 4. Обновите Telegram бота

В @BotFather обновите URL мини-приложения на:
`https://crypto-lottery-today.vercel.app`

---

Подробные инструкции см. в `NEW_REPOSITORY_SETUP.md`

