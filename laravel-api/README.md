# BeyondChats Laravel API

## Setup Instructions

### Prerequisites
- PHP 8.1 or higher
- Composer
- MySQL database

### Installation Steps

1. **Install Dependencies**
```bash
cd laravel-api
composer install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` file and configure your database:
```
DB_DATABASE=beyondchats
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

3. **Generate Application Key**
```bash
php artisan key:generate
```

4. **Run Migrations**
```bash
php artisan migrate
```

5. **Scrape Articles from BeyondChats**
```bash
php scraper.php
```

6. **Start the Server**
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Articles CRUD

- **GET** `/api/articles` - List all articles
- **GET** `/api/articles/{id}` - Get specific article
- **POST** `/api/articles` - Create new article
- **PUT** `/api/articles/{id}` - Update article
- **DELETE** `/api/articles/{id}` - Delete article
- **GET** `/api/articles/latest/get` - Get latest article

### Example Requests

**Get all articles:**
```bash
curl http://localhost:8000/api/articles
```

**Create article:**
```bash
curl -X POST http://localhost:8000/api/articles \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Article","content":"Content here"}'
```

**Update article:**
```bash
curl -X PUT http://localhost:8000/api/articles/1 \
  -H "Content-Type: application/json" \
  -d '{"content":"Updated content","is_updated":true}'
```
