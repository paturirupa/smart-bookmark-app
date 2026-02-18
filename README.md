# Smart Bookmark App

A modern bookmark manager built with Next.js, Supabase, and Tailwind CSS that allows users to save, organize, and manage their favorite links with real-time synchronization.

## Features

1. **Google OAuth Authentication** - Secure sign-in using Google accounts (no email/password required)
2. **Add Bookmarks** - Save bookmarks with custom titles and URLs
3. **Private Bookmarks** - Each user can only see their own bookmarks (secured by Supabase RLS)
4. **Real-time Sync** - Bookmarks update across multiple tabs without page refresh
5. **Delete Bookmarks** - Remove unwanted bookmarks easily
6. **Responsive Design** - Beautiful UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Backend**: Supabase (Authentication, Database, Real-time)
- **Deployment**: Vercel
- **Language**: JavaScript/TypeScript

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with your Supabase credentials
4. Run the development server: `npm run dev`
5. Open http://localhost:3000

## Database Setup (RLS)

Run the SQL in [supabase/rls.sql](supabase/rls.sql) inside the Supabase SQL editor to enable Row Level Security and restrict access to each user's own bookmarks.

Note: This also sets replica identity to FULL so delete events include row data for Realtime filters.

## Problems Encountered and Solutions

### Problem 1: Bookmarks is not defined Error
**Issue**: The app crashed with ReferenceError: Bookmarks is not defined on the home page.

**Cause**: The Bookmarks component was used in page.js but not imported.

**Solution**: Added the missing import statement:
`javascript
import Bookmarks from '@/components/Bookmarks'
`

### Problem 2: Bookmarks Not Adding/Deleting
**Issue**: When clicking Add or Delete, nothing happened in the UI.

**Cause**: Multiple issues:
1. Missing fetchBookmarks() call after insert/delete operations
2. The useEffect dependency array was empty, so it only ran once
3. fetchBookmarks function wasn't memoized

**Solution**: 
- Added await fetchBookmarks() after successful operations
- Added user.id to the useEffect dependency array
- Wrapped fetchBookmarks with useCallback
- Added error handling with console logging and user alerts

### Problem 3: Real-time Updates & User Privacy
**Issue**: 
1. WebSocket connection failed with error: "WebSocket is closed before the connection is established"
2. Realtime connection times out (`TIMED_OUT` / `CHANNEL_ERROR` status)
3. Initially, all users could potentially see each other's bookmarks

**Cause**: 
1. Multiple WebSocket/Realtime issues:
   - RLS policies initially blocking realtime access
   - Realtime table publication not configured
   - Replica identity not FULL for delete events
   - Network/VPN/proxy blocking WebSocket connections
   - Session/auth not properly set before subscribing
2. Missing user filtering in database queries for privacy

**Solutions Implemented**:

*Privacy & RLS*:
- Added .eq('user_id', user.id) filter to all bookmark queries
- Enabled RLS with proper SELECT/INSERT/UPDATE/DELETE policies for auth.uid()
- Set replica identity to FULL for delete events: `alter table public.bookmarks replica identity full`
- Each user now only sees their own bookmarks

*Real-time WebSocket (Attempted)*:
- Added bookmarks to supabase_realtime publication
- Called supabase.auth.getSession() and supabase.realtime.setAuth(token) before subscribing
- Added realtime status logging to console
- Tested on different networks (hotspot and incognito)
- Disabled VPN/proxy and browser extensions
- Verified project realtime enabled in settings

**Result**: WebSocket connections remain in TIMED_OUT state despite all checks. This appears to be a network or Supabase service-level issue outside the app code.

**Workaround**: Currently relying on local state updates (fetchBookmarks() after insert/delete in same tab). Cross-tab sync via polling fallback is an alternative if needed.

## Deployment

The app is deployed on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy!

## Author

Built as part of a web development project - February 2026
