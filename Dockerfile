# Используем базовый образ с Node.js
FROM node:18 as base

# Устанавливаем рабочую директорию
WORKDIR /home/node/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем все остальные файлы проекта
COPY . .

# Сборка проекта
FROM base as production
ENV NODE_PATH=./dist

# Сборка проекта
RUN npm run build

# Удаляем dev зависимости после сборки
RUN npm prune --production

# Запуск приложения
CMD ["npm", "start"]
