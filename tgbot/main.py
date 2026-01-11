import asyncio
import os
from aiogram import Bot, Dispatcher, Router
from tgbot.handlers import router

def config(key: str, default: str = None) -> str:
    """Получение переменной окружения"""
    return os.getenv(key, default)

class TGBot:
    def __init__(self, router: Router) -> None:
        token = config('TELEGRAM_BOT_TOKEN')
        if not token:
            raise ValueError("TELEGRAM_BOT_TOKEN environment variable is required")
        
        self.bot = Bot(token)
        self.dp = Dispatcher()
        self.dp.include_router(router)
        
        # НЕ устанавливаем webhook при инициализации на Vercel
        # Webhook должен быть установлен вручную через Telegram API

    async def update_bot(self, update: dict) -> None:
        """Обработка обновления от Telegram"""
        try:
            await self.dp.feed_raw_update(self.bot, update)
        finally:
            await self.bot.session.close()

    async def set_webhook(self):
        """Установка webhook"""
        webhook_url = config('WEBHOOK_URL')
        if webhook_url:
            try:
                await self.bot.set_webhook(webhook_url)
                print(f"Webhook set to: {webhook_url}")
            except Exception as e:
                print(f"Error setting webhook: {e}")
        await self.bot.session.close()

    async def set_commands(self):
        """Установка команд бота"""
        try:
            from aiogram.types import BotCommand
            commands = [
                BotCommand(command="start", description="Начать работу с ботом"),
            ]
            await self.bot.set_my_commands(commands)
            print("Bot commands set")
        except Exception as e:
            print(f"Error setting commands: {e}")
        finally:
            await self.bot.session.close()

# Создаем экземпляр бота
tgbot = TGBot(router)

