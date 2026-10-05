# ADULTERA — Smart Food Adulteration Detection & Evidence System

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the project:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   ```
   http://localhost:5173
   ```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts backend (:3001) + frontend (:5173) together |
| `npm run server` | Starts only the backend API server |
| `npm run build` | Builds the frontend for production |
| `npm run preview` | Preview the production build |

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Map:** Leaflet + MapTiler
- **Fonts:** Space Grotesk + JetBrains Mono

## Project Structure

```
├── public/assets/        # Static assets (hero video)
├── src/
│   ├── components/       # Shared components (Layout, Preloader, etc.)
│   ├── pages/            # Page components
│   ├── data/             # Sample data
│   └── api.js            # API client
├── server/               # Backend API
└── dist/                 # Production build output
```

## Notes

- The backend server runs on port 3001
- The frontend dev server runs on port 5173
- API requests are proxied from frontend to backend
- Demo data is built-in; no database required
