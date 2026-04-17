# Movie Reservation System Frontend

A modern, production-ready React frontend for the Movie Reservation System backend.

## Features

- User authentication with JWT
- Browse and search movies
- Book tickets with seat selection
- View booking history
- Admin dashboard for managing:
  - Movies
  - Cinemas
  - Schedules
  - Seats

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure the API endpoint in `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

3. Start the development server:
```bash
npm run dev
```

## Admin Access

To access the admin dashboard, login with an admin account. The admin dashboard provides full CRUD operations for managing the cinema system.

## Technology Stack

- React 18
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Vite

## API Configuration

The application expects the backend API to be running on `http://localhost:8080` by default. You can change this by modifying the `VITE_API_BASE_URL` environment variable in the `.env` file.
