
# PixelPlex Test Task

## Установка и запуск проекта

1. **Создайте файл `.env`**:
    ```bash
    cp .env.example .env
    ```

2. **Установите зависимости для сборки**
   ```bash 
   npm i
   ```
   
3. **Запустите сервис базы данных (MySQL) отдельно**:
    ```bash
    docker-compose -f 'docker-compose.yml' up -d --build 'db'
    ```
    Это необходимо для прогонки миграций базы данных.

4. **Запустите весь проект с Docker Compose**:
    ```bash
    docker-compose up
    ```
    Это поднимет все сервисы, включая бэкенд, базу данных и Redis.

5. **Откройте Swagger для документации**:
    Перейдите по адресу: [http://localhost:3000/api-docs](http://localhost:3000/api-docs), чтобы увидеть полную документацию и тестировать API.

---

## Структура API

### 1. **Регистрация пользователя** (`POST /api/auth/register`):
- **Параметры в теле запроса**:
  - `username` (строка, от 3 до 20 символов)
  - `password` (строка, от 6 до 20 символов)

### 2. **Вход пользователя** (`POST /api/auth/login`):
- **Параметры в теле запроса**:
  - `username` (строка, от 3 до 20 символов)
  - `password` (строка, от 6 до 20 символов)

### 3. **Выход пользователя** (`POST /api/auth/logout`):
- **Авторизация через сессии**, требуется наличие активной сессии.

### 4. **Загрузка файла** (`POST /api/files/upload`):
- **Параметры в теле запроса**:
  - `file` (файл в формате `multipart/form-data`)

### 5. **Получение списка файлов** (`GET /api/files`):
- **Параметры запроса (query)**:
  - `statuses` (необязательный, массив строк, каждая строка — это одно из значений перечисления `FileStatusEnum`)

### 6. **Получение информации о конкретном файле** (`GET /api/files/{fileId}`):
- **Параметры в URL**:
  - `fileId` (строка с целым числом)

---

## Правила валидации

- **username**:
  - Должен быть строкой.
  - Длина должна быть от 3 до 20 символов.

- **password**:
  - Должен быть строкой.
  - Длина должна быть от 6 до 20 символов.

- **statuses** (при фильтрации файлов):
  - Необязательный параметр.
  - Если передан, должен быть массивом строк.
  - Каждая строка в массиве должна быть значением из перечисления `FileStatusEnum`.

- **fileId** (для получения информации о файле):
  - Должен быть строкой
