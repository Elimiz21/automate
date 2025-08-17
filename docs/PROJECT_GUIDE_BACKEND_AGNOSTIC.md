# AutoMate - Complete Project Guide (Backend Agnostic)

## Project Overview

AutoMate is a macOS automation platform that allows users to create, record, and playback automation tasks. This document provides a comprehensive guide to the current implementation, backend requirements for any backend solution, and integration instructions.

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

## Backend Requirements & API Specifications

### Required Database Schema

```sql
-- Tasks table
CREATE TABLE tasks (
  id STRING PRIMARY KEY,
  user_id STRING NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category STRING NOT NULL DEFAULT 'automation',
  triggers JSON NOT NULL DEFAULT '[]',
  actions JSON NOT NULL DEFAULT '[]',
  key_sequence TEXT,
  duration INTEGER DEFAULT 0,
  favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used TIMESTAMP
);

-- Task executions table
CREATE TABLE task_executions (
  id STRING PRIMARY KEY,
  task_id STRING REFERENCES tasks(id) ON DELETE CASCADE,
  user_id STRING NOT NULL,
  status STRING NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  execution_log JSON DEFAULT '[]',
  error_message TEXT
);

-- User settings table
CREATE TABLE user_settings (
  id STRING PRIMARY KEY,
  user_id STRING NOT NULL UNIQUE,
  preferences JSON NOT NULL DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Required API Endpoints

#### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET /api/auth/me
POST /api/auth/refresh
```

#### Task Management Endpoints
```
GET /api/tasks                    - Get user's tasks
POST /api/tasks                   - Create new task
GET /api/tasks/:id                - Get specific task
PUT /api/tasks/:id                - Update task
DELETE /api/tasks/:id             - Delete task
POST /api/tasks/:id/favorite      - Toggle favorite status
```

#### AI Task Processing
```
POST /api/ai/parse-task           - Parse natural language to structured task
POST /api/ai/generate-steps       - Generate execution steps from task
POST /api/ai/validate-task        - Validate task structure
```

#### Task Execution
```
POST /api/execute/start/:taskId   - Start task execution
GET /api/execute/status/:execId   - Get execution status
POST /api/execute/stop/:execId    - Stop running execution
GET /api/execute/logs/:execId     - Get execution logs
```

#### System Operations
```
GET /api/system/apps              - Get available applications
GET /api/system/status            - Get system status
POST /api/system/screenshot       - Take screenshot
POST /api/system/launch-app       - Launch application
```

#### User Settings
```
GET /api/settings                 - Get user settings
PUT /api/settings                 - Update user settings
GET /api/analytics/stats          - Get user automation stats
```

### Frontend Integration Points

#### 1. API Client Setup
Replace localStorage with HTTP API calls:

```typescript
// src/lib/api.ts
export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Implementation with error handling, auth headers, etc.
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse>
  async register(userData: RegisterData): Promise<AuthResponse>
  async logout(): Promise<void>

  // Task methods
  async getTasks(): Promise<Task[]>
  async createTask(task: CreateTaskRequest): Promise<Task>
  async updateTask(id: string, task: UpdateTaskRequest): Promise<Task>
  async deleteTask(id: string): Promise<void>

  // AI methods
  async parseTask(input: string): Promise<ParsedTask>
  async generateSteps(task: Task): Promise<ExecutionStep[]>

  // Execution methods
  async startExecution(taskId: string): Promise<ExecutionResponse>
  async getExecutionStatus(execId: string): Promise<ExecutionStatus>
  async stopExecution(execId: string): Promise<void>
}
```

#### 2. React Query Integration
Update existing components to use API calls:

```typescript
// src/hooks/useTasks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => apiClient.getTasks(),
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (task: CreateTaskRequest) => apiClient.createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}
```

#### 3. WebSocket Integration for Real-time Updates
```typescript
// src/hooks/useTaskExecution.ts
import { useEffect, useState } from 'react'

export const useTaskExecution = (taskId: string) => {
  const [execution, setExecution] = useState<ExecutionStatus | null>(null)

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws/execution/${taskId}`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setExecution(data)
    }

    return () => ws.close()
  }, [taskId])

  return { execution }
}
```

## AI Coding Agent Instructions

### Prompt for Backend Development

```
You are building the backend for AutoMate, a macOS automation platform. The frontend is already complete in React/TypeScript and needs a REST API backend with real-time capabilities.

REQUIREMENTS:
1. Build a Node.js/Express backend with TypeScript OR Python/FastAPI backend
2. Implement authentication (JWT-based)
3. Create all required API endpoints as specified in the documentation
4. Add WebSocket support for real-time task execution updates
5. Integrate with an AI service (OpenAI GPT) for natural language task parsing
6. Support database of choice (PostgreSQL, MongoDB, or SQLite)
7. Add proper error handling, validation, and logging
8. Implement rate limiting and security middleware

EXISTING FRONTEND COMPONENTS TO INTEGRATE:
- AITaskCreator: Needs /api/ai/parse-task endpoint
- TaskHistory: Needs full CRUD operations on tasks
- FloatingWindow: Needs /api/execute/start endpoint
- ControlPanel: Needs system status monitoring

AUTHENTICATION FLOW:
- JWT-based authentication
- Login/register endpoints
- Protect all task-related endpoints
- Include user ID in all database operations

TASK EXECUTION FLOW:
1. Parse natural language → structured task via AI
2. Validate task structure and user permissions
3. Start execution with WebSocket connection for updates
4. Log all execution steps and results
5. Update task statistics and usage

API RESPONSE FORMATS:
- Use consistent JSON response structure
- Include proper HTTP status codes
- Provide detailed error messages
- Follow RESTful conventions

SECURITY REQUIREMENTS:
- Validate all inputs thoroughly
- Implement proper CORS policies
- Rate limit API endpoints
- Sanitize database queries
- Hash passwords securely
- Validate JWT tokens

DATABASE DESIGN:
- Use the provided schema as reference
- Add proper indexes for performance
- Include audit trails for task executions
- Support pagination for large datasets

REAL-TIME FEATURES:
- WebSocket connections for task execution updates
- Broadcast execution status changes
- Handle connection cleanup properly
- Support multiple concurrent executions

Choose your preferred tech stack and implement all requirements. Provide setup instructions and API documentation.
```

### Recommended Tech Stacks

#### Option 1: Node.js Stack
```
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- Socket.io for WebSockets
- JWT for authentication
- OpenAI API for task parsing
- Redis for caching (optional)
```

#### Option 2: Python Stack
```
- Python + FastAPI
- PostgreSQL + SQLAlchemy
- WebSocket support built-in
- JWT for authentication
- OpenAI API for task parsing
- Redis for caching (optional)
```

#### Option 3: Full-Stack JavaScript
```
- Next.js API routes
- PostgreSQL + Prisma
- WebSocket API routes
- NextAuth for authentication
- OpenAI API integration
```

## File Structure for Backend

### Node.js/Express Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── taskController.ts
│   │   ├── aiController.ts
│   │   └── executionController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── validation.ts
│   │   └── rateLimiting.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Task.ts
│   │   └── Execution.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── tasks.ts
│   │   ├── ai.ts
│   │   └── execute.ts
│   ├── services/
│   │   ├── aiService.ts
│   │   ├── executionService.ts
│   │   └── systemService.ts
│   ├── utils/
│   │   ├── database.ts
│   │   ├── websocket.ts
│   │   └── logger.ts
│   └── app.ts
├── package.json
├── tsconfig.json
└── README.md
```

## Setup Instructions

### 1. Frontend Preparation
The frontend is ready and needs minimal changes:
- Update API base URL in environment variables
- Replace localStorage calls with API calls
- Add authentication token management
- Implement WebSocket connections for real-time updates

### 2. GitHub Repository Setup

1. Click **GitHub** → **Connect to GitHub** in Lovable
2. Authorize the Lovable GitHub App
3. Create repository with current codebase
4. Repository will include:
   - Complete React frontend
   - Documentation
   - Backend starter templates (if requested)

### 3. Backend Development
1. Choose your preferred tech stack from the options above
2. Implement all required API endpoints
3. Set up database schema
4. Add authentication and security
5. Implement real-time WebSocket features
6. Test integration with frontend

### 4. Integration Testing
1. Update frontend API configuration
2. Test all user flows end-to-end
3. Verify real-time features work correctly
4. Test error handling and edge cases

### 5. Production Deployment
1. **Frontend**: Deploy via Lovable or Vercel/Netlify
2. **Backend**: Deploy to Railway, Heroku, or AWS
3. **Database**: Use managed database service
4. **Environment Variables**: Configure production settings

## Environment Variables Required

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_WS_URL=ws://localhost:8080/ws
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/automate
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
CORS_ORIGIN=http://localhost:5173
PORT=8080
```

## Next Steps

1. **Set up GitHub repository** for version control
2. **Choose backend technology** from recommended stacks
3. **Implement backend API** using the provided specifications
4. **Update frontend** to use real API endpoints
5. **Test integration** thoroughly
6. **Deploy to production** with proper environment configuration

## Support Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Express.js Documentation](https://expressjs.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Socket.io Documentation](https://socket.io/docs/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

**Note**: This document provides a backend-agnostic approach to implementing the AutoMate platform. Choose the technology stack that best fits your expertise and requirements.