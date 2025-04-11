# Базовый образ с конкретной версией Node.js
FROM node:22.14.0 AS builder

# Установка PNPM глобально
RUN npm install -g pnpm

# Установка рабочей директории
WORKDIR /app

# Копирование файлов конфигурации PNPM и package.json
COPY package.json pnpm-lock.yaml ./

# Установка зависимостей через PNPM
RUN pnpm install --frozen-lockfile

# Копирование остального кода
COPY . .

# Сборка приложения (NestJS использует TypeScript)
RUN pnpm run build

# Финальный этап (оптимизация образа)
FROM node:22.14.0 AS production

# Установка PNPM в финальном образе
RUN npm install -g pnpm

# Установка рабочей директории
WORKDIR /app

# Копирование только необходимых файлов из builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

# Установка только продакшен-зависимостей
RUN pnpm install --prod --frozen-lockfile

# Указание команды для запуска
CMD ["node", "dist/main"]