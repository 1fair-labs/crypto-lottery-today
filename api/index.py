from fastapi import FastAPI, Request
from fastapi.responses import Response
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Импортируем бота только при первом запросе (ленивая инициализация)
tgbot = None

def get_bot():
    global tgbot
    if tgbot is None:
        try:
            from tgbot.main import TGBot
            from tgbot.handlers import router
            tgbot = TGBot(router)
            logger.info("Bot initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing bot: {e}", exc_info=True)
            raise
    return tgbot

@app.post('/api/bot')
async def tgbot_webhook_route(request: Request):
    try:
        update_dict = await request.json()
        logger.info(f"Received update: {update_dict.get('update_id')}")
        bot = get_bot()
        await bot.update_bot(update_dict)
        logger.info("Update processed successfully")
        return Response(content='', status_code=200)
    except Exception as e:
        logger.error(f"Error processing update: {e}", exc_info=True)
        return Response(content='', status_code=200)  # Всегда возвращаем 200 для Telegram

@app.get('/api/bot')
async def webhook_check():
    return {'status': 'ok'}

