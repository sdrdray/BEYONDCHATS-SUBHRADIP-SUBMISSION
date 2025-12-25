# BeyondChats Frontend

Professional React-based frontend for displaying articles from the BeyondChats API.

## Features

- 📱 Responsive design that works on all devices
- 🎨 Clean, professional UI
- 🔍 Filter articles by type (All, Original, Enhanced)
- 📖 Modal view for reading full articles
- ✨ Visual distinction between original and enhanced articles
- 📚 Display references for enhanced articles
- 🔄 Compare original and enhanced content

## Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Configuration**

The `.env` file is already configured with:
```
REACT_APP_API_URL=http://localhost:8000/api
```

3. **Start Development Server**
```bash
npm start
```

The app will open at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Features Overview

### Article Cards
- Display article title, excerpt, and metadata
- Visual badges for Original vs Enhanced articles
- Reference count for enhanced articles
- Hover effects and smooth transitions

### Article Modal
- Full article content with Markdown support
- References section with links
- Collapsible original content view
- Keyboard navigation (ESC to close)

### Filters
- View all articles
- Filter by original articles only
- Filter by enhanced articles only
- Real-time filtering

## Technologies Used

- React 18
- React Markdown for content rendering
- Axios for API calls
- CSS3 with custom properties
- Responsive Grid layout
