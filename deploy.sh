#!/bin/bash

# Сборка проекта
echo "Сборка проекта..."
npm run build

# Создание ZIP архива для Netlify
echo "Создание архива для Netlify..."
zip -r ../12union-netlify.zip dist netlify.toml

echo "Готово! Архив 12union-netlify.zip создан и готов к загрузке на Netlify."
echo "Для деплоя на Netlify:"
echo "1. Зайдите на https://app.netlify.com"
echo "2. Нажмите 'Add new site' > 'Deploy manually'"
echo "3. Перетащите файл 12union-netlify.zip"
