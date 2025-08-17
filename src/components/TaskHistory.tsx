import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Edit, 
  Trash2, 
  Clock, 
  Keyboard,
  Star,
  StarOff
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  name: string;
  description: string;
  keySequence: string[];
  duration: number;
  lastUsed: Date;
  favorite: boolean;
  category: 'automation' | 'launch' | 'custom';
}

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'VS Code Launch & Approve',
    description: 'Launch VS Code and auto-approve security dialogs',
    keySequence: ['cmd+space', 'vs code', 'enter', 'cmd+shift+p', 'approve'],
    duration: 5.2,
    lastUsed: new Date('2024-01-15'),
    favorite: true,
    category: 'launch'
  },
  {
    id: '2',
    name: 'Terminal Setup',
    description: 'Open terminal and run development servers',
    keySequence: ['cmd+space', 'terminal', 'enter', 'npm run dev', 'enter'],
    duration: 3.8,
    lastUsed: new Date('2024-01-14'),
    favorite: false,
    category: 'automation'
  },
  {
    id: '3',
    name: 'Claude Code Approval',
    description: 'Auto-approve Claude code editor prompts',
    keySequence: ['tab', 'enter', 'y'],
    duration: 1.5,
    lastUsed: new Date('2024-01-13'),
    favorite: true,
    category: 'automation'
  }
];

export const TaskHistory = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [filter, setFilter] = useState<'all' | 'favorites' | 'recent'>('all');

  const toggleFavorite = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, favorite: !task.favorite } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'favorites') return task.favorite;
    if (filter === 'recent') {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      return task.lastUsed >= threeDaysAgo;
    }
    return true;
  });

  const getCategoryColor = (category: Task['category']) => {
    switch (category) {
      case 'launch': return 'bg-blue-100 text-blue-800';
      case 'automation': return 'bg-green-100 text-green-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-glass-bg backdrop-blur-glass border-glass-border shadow-floating">
      <div className="p-4 border-b border-glass-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Task History</h2>
          <div className="flex gap-2">
            {(['all', 'favorites', 'recent'] as const).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilter(filterType)}
                className="capitalize"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-4 bg-card border-glass-border hover:shadow-soft transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-foreground">{task.name}</h3>
                  <Badge className={cn("text-xs", getCategoryColor(task.category))}>
                    {task.category}
                  </Badge>
                  {task.favorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Keyboard className="h-3 w-3" />
                    {task.keySequence.length} steps
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.duration}s
                  </div>
                  <div>
                    Last used: {task.lastUsed.toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(task.id)}
                    className="h-8 w-8 p-0"
                  >
                    {task.favorite ? 
                      <StarOff className="h-4 w-4" /> : 
                      <Star className="h-4 w-4" />
                    }
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button size="sm" className="w-full">
                  <Play className="h-4 w-4 mr-1" />
                  Run
                </Button>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks found for the selected filter.</p>
          </div>
        )}
      </div>
    </Card>
  );
};