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

### Problem 3: Real-time Updates Not Working
**Issue**: WebSocket connection failed with error: WebSocket is closed before the connection is established

**Cause**: Supabase real-time WebSocket had configuration issues or network restrictions.

**Solution**: Implemented polling-based real-time sync instead of WebSocket:
- Added setInterval to poll for updates every 2 seconds
- This provides cross-tab synchronization without WebSocket dependencies
- More reliable in various network environments

### Problem 4: Input Text Not Visible
**Issue**: Text typed into input fields was hard to see or appeared very light.

**Cause**: Tailwind CSS default text color was too light.

**Solution**: Added text-black class to all input fields to ensure proper text visibility.

### Problem 5: Bookmarks Privacy
**Issue**: Initially, all users could potentially see each others bookmarks.

**Cause**: Missing user filtering in database queries.

**Solution**: 
- Added .eq('user_id', user.id) filter to all bookmark queries
- Ensured Supabase RLS policies enforce user-level data isolation
- Each user now only sees their own bookmarks

## Deployment

The app is deployed on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
4. Deploy!

## Author

Built as part of a web development project - February 2026
