# Исправление ошибки 307 Temporary Redirect в Webhook

## Проблема
Telegram получает ошибку `307 Temporary Redirect` вместо ответа от webhook.

## Решение

### Шаг 1: Убедитесь, что используется HTTPS
Webhook URL должен быть с HTTPS:
```
https://giftdraw.today/api/telegram-webhook
```

### Шаг 2: Удалите старый webhook и установите заново

**Удалить webhook:**
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook
```

**Установить заново:**
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://giftdraw.today/api/telegram-webhook
```

### Шаг 3: Проверьте webhook
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

**Ожидаемый ответ (без ошибок):**
```json
{
  "ok": true,
  "result": {
    "url": "https://giftdraw.today/api/telegram-webhook",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "last_error_date": 0,
    "last_error_message": ""
  }
}
```

### Шаг 4: Обработайте pending updates

Если есть `pending_update_count > 0`, после исправления webhook Telegram автоматически отправит их заново.

Или можно вручную получить обновления:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

### Шаг 5: Проверьте настройки домена в Vercel

1. Откройте Vercel Dashboard → Settings → Domains
2. Убедитесь, что `giftdraw.today` настроен правильно
3. Проверьте, что нет редиректов с www на non-www или наоборот

### Шаг 6: Проверьте endpoint напрямую

Откройте в браузере:
```
https://giftdraw.today/api/telegram-webhook
```

Должен вернуться:
```json
{"status":"ok"}
```

## Если проблема сохраняется

1. Проверьте логи в Vercel: Functions → telegram-webhook → View Logs
2. Убедитесь, что деплой завершен
3. Попробуйте временно использовать Vercel домен для теста:
   ```
   https://crypto-lottery-today.vercel.app/api/telegram-webhook
   ```

## Примечание

307 редирект обычно возникает из-за:
- Автоматического редиректа HTTP → HTTPS (но мы используем HTTPS)
- Редиректа www → non-www или наоборот
- Проблем с конфигурацией домена в Vercel

После исправления и переустановки webhook, проблема должна исчезнуть.
