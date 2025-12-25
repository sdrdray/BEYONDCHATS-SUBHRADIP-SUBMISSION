# BeyondChats Article Enhancer

Node.js script that enhances articles using Google Search and LLM API.

## Features

- Fetches articles from Laravel API
- Searches Google for top-ranking articles on the same topic
- Scrapes content from reference articles
- Uses OpenAI GPT-4 to enhance article content
- Publishes enhanced articles back to Laravel API
- Adds citations to reference articles

## Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**

Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```
LARAVEL_API_URL=http://localhost:8000/api
OPENAI_API_KEY=your_openai_api_key
```

3. **Run the Enhancer**
```bash
npm start
```

## How It Works

1. **Fetch**: Gets the latest article from Laravel API
2. **Search**: Searches Google for the article title
3. **Scrape**: Extracts content from top 2 Google results
4. **Enhance**: Uses GPT-4 to improve article based on reference content
5. **Format**: Adds proper citations and references
6. **Publish**: Creates enhanced article via Laravel API

## Requirements

- Node.js 18+
- OpenAI API key
- Running Laravel API server

## Technologies Used

- **Puppeteer**: For reliable web scraping
- **Cheerio**: For HTML parsing
- **Axios**: For HTTP requests
- **OpenAI API**: For content enhancement
