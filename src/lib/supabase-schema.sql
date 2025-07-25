-- Supabase Database Schema for Gemini Framework
-- Run these SQL commands in your Supabase SQL editor

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  session_id TEXT NOT NULL,
  title TEXT,
  model_used TEXT NOT NULL,
  total_tokens INTEGER DEFAULT 0,
  total_cost DECIMAL(10, 8) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER DEFAULT 0,
  model_used TEXT,
  cost DECIMAL(10, 8) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message ratings table
CREATE TABLE IF NOT EXISTS message_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('thumbs_up', 'thumbs_down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id)
);

-- User memory table for storing conversation memory
CREATE TABLE IF NOT EXISTS user_memory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  memory_key TEXT NOT NULL,
  memory_value JSONB NOT NULL,
  memory_type TEXT NOT NULL DEFAULT 'context',
  confidence_score DECIMAL(3, 2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, memory_key)
);

-- Analytics table for tracking usage patterns
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT 'anonymous',
  event_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_memory_user_id ON user_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);

-- RLS Policies (Row Level Security)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for demo purposes
CREATE POLICY "Allow anonymous access" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON messages FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON message_ratings FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON user_memory FOR ALL USING (true);
CREATE POLICY "Allow anonymous access" ON analytics FOR ALL USING (true);

-- Functions for easy table creation via RPC calls
CREATE OR REPLACE FUNCTION create_conversations_table()
RETURNS void AS $$
BEGIN
  -- Table already exists, this is a no-op
  NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_messages_table()
RETURNS void AS $$
BEGIN
  -- Table already exists, this is a no-op
  NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_message_ratings_table()
RETURNS void AS $$
BEGIN
  -- Table already exists, this is a no-op
  NULL;
END;
$$ LANGUAGE plpgsql;