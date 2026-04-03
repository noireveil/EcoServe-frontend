# API Configuration Guide

## Environment Variables

1. Copy `.env.local` and update the API URL if needed:
   ```
   NEXT_PUBLIC_API_URL=https://ecoserve-api.onrender.com
   ```

2. For local backend development, change to:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

## Common Issues & Solutions

### "Failed to fetch" Error

**Possible Causes:**
- API server is down or unreachable
- CORS not configured on the backend
- Network connectivity issues
- Missing environment variables

**Solutions:**

1. **Check if the API is running:**
   - For remote: Try accessing `https://ecoserve-api.onrender.com/health` in your browser
   - For local: Make sure your backend is running on the specified port

2. **Restart the development server:**
   ```bash
   # Stop the current dev server (Ctrl+C)
   npm run dev
   ```

3. **Clear browser cache and localStorage:**
   - Open DevTools (F12)
   - Go to Application tab
   - Clear localStorage for the domain

4. **Check CORS settings on backend:**
   Make sure your backend allows requests from `http://localhost:3000`

5. **Verify environment variables:**
   ```bash
   # Check if .env.local exists and has the correct variable
   cat .env.local
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open `http://localhost:3000` in your browser

## API Proxy

In development, Next.js rewrites API requests to avoid CORS issues:
- `/api/*` → `{NEXT_PUBLIC_API_URL}/api/*`
- `/health` → `{NEXT_PUBLIC_API_URL}/health`

This means you can use relative paths in your code during development.
