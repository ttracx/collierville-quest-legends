# Supabase Setup Instructions

## Prerequisites
- A Supabase account (create one at https://supabase.com)
- A Supabase project

## Setup Steps

### 1. Get Your Supabase Credentials
1. Go to https://app.supabase.com
2. Select your project (or create a new one)
3. Go to Settings → API
4. Copy:
   - Project URL → paste into `VITE_SUPABASE_URL` in `.env.local`
   - Anon/public key → paste into `VITE_SUPABASE_ANON_KEY` in `.env.local`

### 2. Run Database Migration
1. Go to the SQL Editor in your Supabase dashboard
2. Open the file `supabase/migrations/001_initial_schema.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click "Run" to execute the migration

### 3. Enable Anonymous Authentication
1. Go to Authentication → Settings
2. Under "Auth Providers", enable "Anonymous Sign-ins"
3. Save the changes

### 4. Verify Setup
1. Check that the tables were created:
   - `game_saves` table
   - `leaderboard` table
2. Check that Row Level Security (RLS) is enabled on both tables
3. Test the app's save/load functionality

## What the Migration Creates

### Tables
- **game_saves**: Stores player game progress and scores
- **leaderboard**: Stores high scores and player names

### Security
- Row Level Security (RLS) ensures users can only access their own saves
- Anonymous authentication allows gameplay without creating accounts
- Leaderboard is publicly readable but write-protected

## Troubleshooting

### "Permission denied" errors
- Make sure RLS is enabled on the tables
- Verify anonymous authentication is enabled
- Check that the anon key is correctly set in `.env.local`

### Tables not found
- Ensure the migration ran successfully
- Check for any error messages in the SQL editor
- Verify you're connected to the correct project

### Save/Load not working
- Check browser console for errors
- Verify environment variables are loaded (no spaces, correct format)
- Ensure Supabase project is not paused (free tier pauses after inactivity)