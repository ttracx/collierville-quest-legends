-- Supabase migration for Collierville Quest Legends
-- Creates tables for game saves and leaderboard

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Game saves table
CREATE TABLE IF NOT EXISTS game_saves (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL,
  game_state JSONB NOT NULL,
  scores JSONB NOT NULL DEFAULT '{
    "basketball": 0,
    "swimming": 0,
    "yoga": 0,
    "cardio": 0,
    "frontDesk": 0,
    "workout": 0,
    "smoothie": 0
  }'::jsonb,
  total_score INTEGER DEFAULT 0,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  game_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_game_saves_user_id ON game_saves(user_id);
CREATE INDEX idx_leaderboard_total_score ON leaderboard(total_score DESC);
CREATE INDEX idx_leaderboard_created_at ON leaderboard(created_at DESC);

-- Row Level Security (RLS)
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Policies for game_saves
-- Users can only read/write their own game saves
CREATE POLICY "Users can view own game saves" ON game_saves
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own game saves" ON game_saves
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own game saves" ON game_saves
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for leaderboard
-- Anyone can read the leaderboard
CREATE POLICY "Anyone can view leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- Authenticated users can add to leaderboard
CREATE POLICY "Authenticated users can add to leaderboard" ON leaderboard
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_game_saves_updated_at BEFORE UPDATE ON game_saves
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();