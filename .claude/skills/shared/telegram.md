# Telegram notifications — shared reference

The `add-saint`, `update-saint`, and `create-cloth-scheme` skills notify Diego on Telegram when
they finish. The bot credentials live **outside the repo** in
`~/.config/saintseiyacloths/telegram.env` — this repository is public on GitHub, so never
hardcode the token in a skill file, a script, or anything that could be committed.

```bash
source ~/.config/saintseiyacloths/telegram.env   # TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
```

If the file is missing, say so in the final report instead of failing the whole task — the data
work is still valid without the notification.

## Send a text message

```bash
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_CHAT_ID}" \
  --data-urlencode text="<message>"
```

## Send a photo with caption

```bash
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto" \
  -F chat_id="${TELEGRAM_CHAT_ID}" \
  -F photo=@"<path/to/image.jpg>" \
  -F caption="<caption text>"
```

Captions are limited to 1024 characters — keep them tight. Check the JSON response contains
`"ok":true`; if not, report the error text to the user rather than retrying blindly.
