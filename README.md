# BeyondChats Article Management System

A full-stack application for scraping, enhancing, and managing articles from beyondchats.com. Built with Laravel, Node.js, and React.

## Project Structure

```
BEYONDCHATS_SUBHRADIP/
├── laravel-api/        # Laravel backend API
├── nodejs-enhancer/    # Article enhancement service
└── react-frontend/     # React frontend application
```

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- MySQL 5.7+
- OpenAI API key

## Local Setup Instructions

### 1. Clone and Navigate

```bash
git clone <your-repo-url>
cd BEYONDCHATS_SUBHRADIP
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE beyondchats;
```

### 3. Laravel API Setup

```bash
cd laravel-api
composer install
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_DATABASE=beyondchats
DB_USERNAME=root
DB_PASSWORD=your_password
```

Run migrations and scrape initial data:

```bash
php artisan migrate
php scraper.php
php artisan serve
```

The API will be available at `http://localhost:8000`

### 4. Node.js Enhancement Service Setup

```bash
cd nodejs-enhancer
npm install
cp .env.example .env
```

Edit `.env` file with your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key
LARAVEL_API_URL=http://localhost:8000/api
```

Run the enhancer:

```bash
npm start
```

### 5. React Frontend Setup

```bash
cd react-frontend
npm install
```

Edit `src/services/api.js` if your Laravel API runs on a different port:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

Start the frontend:

```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## System Architecture

### Data Flow

```
1. Web Scraping (PHP)
   scraper.php → beyondchats.com → Laravel Database

2. Article Enhancement (Node.js)
   Laravel API → Google Search → OpenAI GPT → Enhanced Article → Laravel API

3. Frontend Display (React)
   React App → Laravel API → Display Articles (Original & Enhanced)
```

### Component Interaction

```
┌─────────────────┐
│  React Frontend │ (Port 3000)
│   (View Layer)  │
└────────┬────────┘
         │ HTTP Requests
         ▼
┌─────────────────┐
│   Laravel API   │ (Port 8000)
│  (Data Layer)   │
│   MySQL Database│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Node.js Enhancer│
│ (Processing)    │
│  - Google API   │
│  - OpenAI API   │
└─────────────────┘
```

### Key Features

**Laravel API:**
- RESTful API for article CRUD operations
- Web scraper for fetching articles from beyondchats.com
- MySQL database storage

**Node.js Enhancer:**
- Fetches latest article from Laravel API
- Searches Google for related content
- Uses OpenAI GPT to enhance article with additional context
- Updates article in database via Laravel API

**React Frontend:**
- Displays all articles in a responsive grid
- Modal view for reading full articles
- Shows both original and AI-enhanced versions
- Clean, professional UI

## API Endpoints

- `GET /api/articles` - Get all articles
- `GET /api/articles/{id}` - Get specific article
- `GET /api/articles/latest/get` - Get latest article
- `POST /api/articles` - Create new article
- `PUT /api/articles/{id}` - Update article
- `DELETE /api/articles/{id}` - Delete article

## Live Demo

**GitHub Repository:** https://github.com/sdrdray/BEYONDCHATS-SUBHRADIP-SUBMISSION

**Frontend (Netlify):** https://beyondchats-subhradip.netlify.app/

**Backend API (Railway):** https://beyondchats-subhradip-submission-production.up.railway.app/

### Testing the Live Application

- Visit the frontend URL to view and interact with articles
- API endpoints are available at the backend URL (e.g., `/api/articles`)
- The system automatically scrapes articles from beyondchats.com

## Development Notes

This project demonstrates:
- Full-stack development across Laravel, Node.js, and React
- Integration with third-party APIs (Google Search, OpenAI)
- RESTful API design and consumption
- Modern frontend development with React hooks
- Database design and migrations
- Web scraping techniques

## Troubleshooting

**CORS Issues:** If you encounter CORS errors, ensure `laravel-api/app/Http/Kernel.php` has CORS middleware configured.

**Port Conflicts:** Change ports in respective configuration files if 3000 or 8000 are already in use.

**Database Connection:** Verify MySQL is running and credentials in `.env` are correct.

## License

This project was created as part of the BeyondChats technical assessment.
