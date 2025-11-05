# Tomato 🍅 - Smart Pomodoro + Task Kanban Board

A productivity web app that combines Pomodoro Technique with Kanban task management and AI-powered priority suggestions.

## Features

- **Pomodoro Timer**: 25/5/15 minute work/break cycles with browser notifications
- **Kanban Board**: Drag & drop task management with To Do/Doing/Done columns
- **AI Priority Suggestions**: Rule-based algorithm to calculate task priorities
- **Task Management**: Full CRUD with due dates, estimates, importance/urgency ratings
- **User Authentication**: Secure login/signup with Supabase Auth
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + Realtime)
- **Drag & Drop**: @dnd-kit
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo>
cd tomato
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your keys
3. Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

### 3. Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Priority Algorithm

Tasks are scored 0-100 based on:

- **Importance** (35%): User rating 1-5
- **Urgency** (25%): User rating 1-5  
- **Due Date** (30%): Proximity to deadline
- **Effort Penalty** (10%): More pomodoros = lower priority
- **Blocker Bonus** (+20): Tasks tagged as "blocker"

## Usage

1. **Sign up/Login** at `/login`
2. **Dashboard** shows today's tasks and timer
3. **Board** for full Kanban management
4. **Create tasks** with all attributes
5. **Use AI Suggest** to auto-calculate priorities
6. **Start Pomodoro** timer for focused work

## Database Schema

- `boards` - User task boards
- `columns` - Kanban columns (To Do, Doing, Done)
- `tasks` - Individual tasks with priority data
- `pomodoro_sessions` - Timer session tracking

## Contributing

1. Fork the repo
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - feel free to use for personal/commercial projects!
