# Тестовое задание

## Описание
Все настройки можно найти в файлах:
- compose.yaml
- dockerfile
- package.json
- tsconfig.json
- src/config/env/env.ts
- src/config/knex/knexfile.ts

## Инструкция по запуску:

1. при первом запуке через докер не забыть прописать в .env файле POSTGRES_HOST=postgres вместо localhost
2. json для соединнения с гугл апи таблицами сделал через base64 в env указываем GOOGLE_SERVICE_KEY_BASE64, если захотите добавить свое, то придется
  кодировать, сделал так, чтобы в обще никакими данными из этого json в проекте не светить
3. ссылку на env файл сразу прикладываю https://disk.yandex.ru/i/0jrYu0_fu3QBvA
4. если хотим добавить таблицы, то прописываем в env SPREADSHEET_IDS и прогоняем миграции, либо руками в таблицу
5. в остальном все команды которые были в шаблоне исправно работают и запускают как локально так и через докер
6. менять время запуска тарифов здесь src/constants/jobs.ts
7. ссылки на таблицы для просмотра https://docs.google.com/spreadsheets/d/157mO6atNjyVMt0J65Lu2grOJletU-ZxFQ5xXFuXXQBw/edit?usp=sharing
  https://docs.google.com/spreadsheets/d/1C7Xnq2wL2BiSUZvfIfRqtZcAYQ44fM5oZGwkpNqgMs8/edit?usp=sharing

## Команды:

Запуск базы данных:
```bash
docker compose up -d --build postgres
```

Для выполнения миграций и сидов не из контейнера:
```bash
npm run knex:dev migrate latest
```

```bash
npm run knex:dev seed run
```
Также можно использовать и остальные команды (`migrate make <name>`,`migrate up`, `migrate down` и т.д.)

Для запуска приложения в режиме разработки:
```bash
npm run dev
```

Запуск проверки самого приложения:
```bash
docker compose up -d --build app
```

Для финальной проверки рекомендую:
```bash
docker compose down --rmi local --volumes
docker compose up --build
```

PS: С наилучшими пожеланиями!
