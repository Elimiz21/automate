# AutoMate - Complete Project Guide

## Project Overview

AutoMate is a macOS automation platform that allows users to create, record, and playback automation tasks. This document provides a comprehensive guide to the current implementation, backend requirements, and integration instructions.

## Current Frontend Architecture

### Technology Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** with custom design system
- **shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for state management
- **Lucide React** for icons
- **Sonner** for toast notifications

### Design System
The app uses a sophisticated design system defined in:
- `src/index.css` - CSS custom properties and semantic tokens
- `tailwind.config.ts` - Tailwind configuration with HSL color system
- All components use semantic tokens (no direct colors)

### Core Components Architecture

#### 1. Main Application (`src/App.tsx`)
- React Router setup with QueryClient provider
- Toast and tooltip providers
- Routes: Index (/) and NotFound (*)

#### 2. Control Panel (`src/components/ControlPanel.tsx`)
- **State Management**: `activeWindows` array for floating window management
- **Features**:
  - Statistics display (Active Windows, Saved Tasks, Automations Today)
  - Three automation methods: AI Task Creator, Record Mode, Playbook Mode
  - Quick Actions: Settings, Multi-Screen, Help, Analytics
- **Integration Points**: AITaskCreator, AppLauncher, TaskHistory components

#### 3. AI Task Creator (`src/components/AITaskCreator.tsx`)
- **State Management**: 
  - `userInput` - Task description input
  - `isGenerating` - AI processing status
  - `generatedTask` - Structured task object
  - `isEditing` - Edit mode toggle
  - `isRunning` - Task execution status
- **Core Functions**:
  - `generateTask()` - Simulates AI parsing of user input
  - `parseUserInput()` - Text analysis for task extraction
  - `handleApprove()` - Saves to localStorage with toast feedback
  - `runTask()` - Simulates task execution with step-by-step toasts

#### 4. Floating Window (`src/components/FloatingWindow.tsx`)
- **Draggable Interface**: Mouse event handlers for window positioning
- **Recording Simulation**: 5-second timer with action capture
- **Playback Simulation**: Replays recorded actions with toasts
- **Quick Launch Integration**: Terminal, VS Code, Browser shortcuts

#### 5. Task History (`src/components/TaskHistory.tsx`)
- **Local Storage Integration**: Loads and manages saved tasks
- **Filter System**: All, Favorites, Recent views
- **Task Management**: Run, favorite, edit, delete operations
- **Mock Data**: Pre-populated automation examples

#### 6. App Launcher (`src/components/AppLauncher.tsx`)
- **Quick Launch Grid**: 3x3 grid of common applications
- **Launch Simulation**: Toast notifications for app opening
- **App Categories**: Development, productivity, communication tools

### UX/UI Workflows

#### Primary User Flows

1. **AI Task Creation Flow**:
   ```
   User Input → AI Processing → Task Generation → Preview → Edit/Approve → Save to History
   ```

2. **Recording Flow**:
   ```
   Open Floating Window → Start Recording → Capture Actions → Stop Recording → Save/Playback
   ```

3. **Playback Flow**:
   ```
   Select Task from History → Configure Options → Execute → Monitor Progress → Complete
   ```

4. **Quick Launch Flow**:
   ```
   Access Control Panel → Select App → Launch Simulation → Feedback
   ```

### Current Functionality Status

#### ✅ **Fully Functional (Real)**
- **UI Components**: All React components with proper state management
- **Local Storage**: Task persistence and retrieval
- **Form Validation**: Input handling and error states
- **Navigation**: React Router implementation
- **Toast Notifications**: User feedback system
- **Drag & Drop**: Floating window positioning
- **Filter/Search**: Task history management
- **Design System**: Consistent theming and styling

#### 🎭 **Simulated (Mock)**
- **System Automation**: No actual macOS app control
- **Screen Recording**: Timer-based simulation
- **App Launching**: Toast notifications instead of real launches
- **Task Execution**: Step-by-step toast simulation
- **File System Access**: No actual file operations
- **Keyboard/Mouse Control**: No system-level input simulation

## Backend Requirements & Supabase Integration

### Required Supabase Setup

#### Database Schema

```sql
-- Users table (handled by Supabase Auth)
-- No custom users table needed

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'automation',
  triggers JSONB NOT NULL DEFAULT '[]',
  actions JSONB NOT NULL DEFAULT '[]',
  key_sequence TEXT,
  duration INTEGER DEFAULT 0,
  favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);

-- Task executions table
CREATE TABLE task_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  execution_log JSONB DEFAULT '[]',
  error_message TEXT
);

-- User settings table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Users can manage their own tasks" ON tasks
  FOR ALL USING (auth.uid() = user_id);

-- Task executions policies
CREATE POLICY "Users can manage their own executions" ON task_executions
  FOR ALL USING (auth.uid() = user_id);

-- User settings policies
CREATE POLICY "Users can manage their own settings" ON user_settings
  FOR ALL USING (auth.uid() = user_id);
```

#### Required Edge Functions

1. **AI Task Parser** (`/functions/parse-task/`)
2. **Task Executor** (`/functions/execute-task/`)
3. **System Monitor** (`/functions/system-status/`)
4. **App Controller** (`/functions/app-control/`)

### Frontend Integration Points

#### 1. Authentication Integration
Replace mock authentication with Supabase Auth:

```typescript
// src/hooks/useAuth.ts
import { useSupabaseAuth } from '@/lib/supabase'

export const useAuth = () => {
  const { user, signIn, signOut, signUp } = useSupabaseAuth()
  // Implementation details
}
```

#### 2. Task Management Integration
Replace localStorage with Supabase database:

```typescript
// src/hooks/useTasks.ts
import { useSupabaseQuery } from '@/lib/supabase'

export const useTasks = () => {
  const { data: tasks, refetch } = useSupabaseQuery('tasks')
  // Implementation details
}
```

#### 3. Real-time Updates
Add Supabase Realtime for live task execution:

```typescript
// src/hooks/useTaskExecution.ts
import { useSupabaseRealtime } from '@/lib/supabase'

export const useTaskExecution = (taskId: string) => {
  const execution = useSupabaseRealtime('task_executions', taskId)
  // Implementation details
}
```

## AI Coding Agent Instructions

### Prompt for Backend Development

```
You are building the backend for AutoMate, a macOS automation platform. The frontend is already complete in React/TypeScript using Supabase integration.

REQUIREMENTS:
1. Implement Supabase Edge Functions for:
   - AI task parsing from natural language
   - Task execution management
   - System monitoring and status
   - Application control simulation

2. Database operations must use the provided schema
3. All functions must include proper error handling and logging
4. Use TypeScript for all Edge Functions
5. Implement proper security with RLS policies
6. Add rate limiting and validation

EXISTING FRONTEND COMPONENTS TO INTEGRATE:
- AITaskCreator: Needs /parse-task endpoint
- TaskHistory: Needs CRUD operations on tasks table
- FloatingWindow: Needs /execute-task endpoint
- ControlPanel: Needs system status monitoring

AUTHENTICATION:
- Use Supabase Auth (already integrated in frontend)
- All database operations must respect RLS policies
- JWT validation in Edge Functions

TASK EXECUTION FLOW:
1. Parse natural language → structured task
2. Validate task structure and permissions
3. Execute task with real-time status updates
4. Log execution results and errors
5. Update task statistics and usage

INTEGRATION REQUIREMENTS:
- Frontend calls Edge Functions via Supabase client
- Real-time updates using Supabase Realtime
- File storage for task recordings/screenshots
- Error handling with proper HTTP status codes

SECURITY CONSIDERATIONS:
- Validate all inputs thoroughly
- Implement proper CORS policies
- Rate limit API calls
- Sanitize all database queries
- Encrypt sensitive task data

Follow the existing code patterns and use the same design system tokens.
```

### File Structure for Backend

```
supabase/
├── config.toml
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_rls_policies.sql
│   └── 003_functions_and_triggers.sql
└── functions/
    ├── parse-task/
    │   ├── index.ts
    │   └── types.ts
    ├── execute-task/
    │   ├── index.ts
    │   └── types.ts
    ├── system-status/
    │   ├── index.ts
    │   └── types.ts
    └── shared/
        ├── auth.ts
        ├── database.ts
        └── utils.ts
```

## Setup Instructions

### 1. Supabase Integration

**IMPORTANT**: Before implementing any backend functionality, you must connect to Supabase:

1. Click the green **Supabase** button in the top right of the Lovable interface
2. Follow the setup wizard to create/connect your Supabase project
3. This will enable access to:
   - Authentication system
   - PostgreSQL database
   - Edge Functions
   - Realtime subscriptions
   - File storage

### 2. GitHub Repository Setup

After Supabase connection:

1. Click **GitHub** → **Connect to GitHub** in Lovable
2. Authorize the Lovable GitHub App
3. Create repository with current codebase
4. Repository will include:
   - Complete React frontend
   - Supabase configuration
   - Database migrations
   - Edge Functions
   - Documentation

### 3. Development Workflow

1. **Frontend Development**: Continue in Lovable with real-time preview
2. **Backend Development**: Use Supabase CLI or Lovable's integrated tools
3. **Version Control**: Automatic sync between Lovable ↔ GitHub
4. **Deployment**: One-click deployment via Lovable or Supabase

### 4. Production Deployment

1. **Frontend**: Deploy via Lovable (lovable.app subdomain or custom domain)
2. **Backend**: Auto-deployed via Supabase Edge Functions
3. **Database**: Hosted on Supabase with automatic backups
4. **Monitoring**: Supabase Dashboard for logs and analytics

## Next Steps

1. **Connect Supabase** using the green button in Lovable interface
2. **Set up GitHub repository** for version control
3. **Implement backend functionality** using the provided schemas and instructions
4. **Test integration** between frontend and backend
5. **Deploy to production** with custom domain (optional)

## Support Resources

- [Supabase Integration Docs](https://docs.lovable.dev/integrations/supabase/)
- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

---

**Note**: This document will be updated automatically as the project evolves and new features are added.