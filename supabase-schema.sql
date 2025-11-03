-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create boards table
CREATE TABLE boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create columns table
CREATE TABLE columns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  column_id UUID REFERENCES columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  estimate_pomodori INTEGER DEFAULT 1,
  importance INTEGER DEFAULT 3 CHECK (importance >= 1 AND importance <= 5),
  urgency INTEGER DEFAULT 3 CHECK (urgency >= 1 AND urgency <= 5),
  labels TEXT[] DEFAULT '{}',
  priority_score INTEGER DEFAULT 0,
  priority_label TEXT DEFAULT 'Medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pomodoro_sessions table
CREATE TABLE pomodoro_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'interrupted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own boards" ON boards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own boards" ON boards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own boards" ON boards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own boards" ON boards FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view columns of own boards" ON columns FOR SELECT USING (
  EXISTS (SELECT 1 FROM boards WHERE boards.id = columns.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can insert columns to own boards" ON columns FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM boards WHERE boards.id = columns.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can update columns of own boards" ON columns FOR UPDATE USING (
  EXISTS (SELECT 1 FROM boards WHERE boards.id = columns.board_id AND boards.user_id = auth.uid())
);
CREATE POLICY "Users can delete columns of own boards" ON columns FOR DELETE USING (
  EXISTS (SELECT 1 FROM boards WHERE boards.id = columns.board_id AND boards.user_id = auth.uid())
);

CREATE POLICY "Users can view tasks in own boards" ON tasks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM columns 
    JOIN boards ON boards.id = columns.board_id 
    WHERE columns.id = tasks.column_id AND boards.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert tasks to own boards" ON tasks FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM columns 
    JOIN boards ON boards.id = columns.board_id 
    WHERE columns.id = tasks.column_id AND boards.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update tasks in own boards" ON tasks FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM columns 
    JOIN boards ON boards.id = columns.board_id 
    WHERE columns.id = tasks.column_id AND boards.user_id = auth.uid()
  )
);
CREATE POLICY "Users can delete tasks in own boards" ON tasks FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM columns 
    JOIN boards ON boards.id = columns.board_id 
    WHERE columns.id = tasks.column_id AND boards.user_id = auth.uid()
  )
);

CREATE POLICY "Users can view own pomodoro sessions" ON pomodoro_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pomodoro sessions" ON pomodoro_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pomodoro sessions" ON pomodoro_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pomodoro sessions" ON pomodoro_sessions FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_columns_board_id ON columns(board_id);
CREATE INDEX idx_tasks_column_id ON tasks(column_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_priority_score ON tasks(priority_score);
CREATE INDEX idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX idx_pomodoro_sessions_task_id ON pomodoro_sessions(task_id);
