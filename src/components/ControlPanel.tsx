import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingWindow } from './FloatingWindow';
import { TaskHistory } from './TaskHistory';
import { AITaskCreator } from './AITaskCreator';
import { AIGuidedAutomation } from './AIGuidedAutomation';
import { AppLauncher } from './AppLauncher';
import { 
  Plus, 
  Monitor, 
  Layers,
  Settings,
  Info,
  Zap,
  Brain,
  Video
} from 'lucide-react';

export const ControlPanel = () => {
  const [activeWindows, setActiveWindows] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const createWindow = () => {
    const windowId = `window-${Date.now()}`;
    setActiveWindows([...activeWindows, windowId]);
  };

  const closeWindow = (windowId: string) => {
    setActiveWindows(activeWindows.filter(id => id !== windowId));
  };

  const stats = [
    { label: 'Active Windows', value: activeWindows.length, icon: Monitor },
    { label: 'Saved Tasks', value: JSON.parse(localStorage.getItem('automate-tasks') || '[]').length + 6, icon: Layers },
    { label: 'Automations Today', value: 8, icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">AutoMate</h1>
          <p className="text-muted-foreground">Intelligent Mac automation at your fingertips</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 bg-glass-bg backdrop-blur-glass border-glass-border shadow-soft">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Automation Options */}
        <Card className="p-6 bg-glass-bg backdrop-blur-glass border-glass-border shadow-floating">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">Choose Your Automation Method</h2>
            <p className="text-muted-foreground">Four ways to create and run automation tasks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* AI Task Creator */}
            <div className="text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Task Creator</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Describe what you need in plain English and let AI generate the automation task
                </p>
                <Button 
                  onClick={() => document.getElementById('ai-creator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full"
                  size="sm"
                >
                  Create with AI
                </Button>
              </div>
            </div>

            {/* AI-Guided Automation */}
            <div className="text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI-Guided Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get step-by-step AI guidance while recording your screen for perfect automation
                </p>
                <Button 
                  onClick={() => document.getElementById('ai-guided')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full"
                  size="sm"
                >
                  <Video className="h-4 w-4 mr-1" />
                  Start Guide
                </Button>
              </div>
            </div>

            {/* Record Mode */}
            <div className="text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Record Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Open a floating window and record your keystrokes in real-time
                </p>
                <Button 
                  onClick={createWindow}
                  variant="secondary"
                  className="w-full"
                  size="sm"
                >
                  Start Recording
                </Button>
              </div>
            </div>

            {/* Playback Mode */}
            <div className="text-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                  <Layers className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Playback Mode</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select and run previously created automation tasks
                </p>
                <Button 
                  onClick={() => setShowHistory(!showHistory)}
                  variant="secondary"
                  className="w-full"
                  size="sm"
                >
                  View Tasks
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-glass-bg backdrop-blur-glass border-glass-border shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
            <Badge variant="secondary" className="animate-pulse">
              {activeWindows.length} Active Windows
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline"
              size="sm"
              className="h-16 flex flex-col gap-1"
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs">Settings</span>
            </Button>

            <Button 
              variant="outline"
              size="sm"
              className="h-16 flex flex-col gap-1"
            >
              <Monitor className="h-4 w-4" />
              <span className="text-xs">Multi-Screen</span>
            </Button>

            <Button 
              variant="outline"
              size="sm"
              className="h-16 flex flex-col gap-1"
            >
              <Info className="h-4 w-4" />
              <span className="text-xs">Help</span>
            </Button>

            <Button 
              variant="outline"
              size="sm"
              className="h-16 flex flex-col gap-1"
            >
              <Zap className="h-4 w-4" />
              <span className="text-xs">Analytics</span>
            </Button>
          </div>
        </Card>

        {/* AI Task Creator */}
        <div id="ai-creator">
          <AITaskCreator />
        </div>

        {/* AI-Guided Automation */}
        <div id="ai-guided">
          <AIGuidedAutomation />
        </div>

        {/* App Launcher */}
        <AppLauncher />

        {/* Task History */}
        {showHistory && (
          <div className="animate-fade-in">
            <TaskHistory />
          </div>
        )}

        {/* How It Works */}
        <Card className="p-6 bg-glass-bg backdrop-blur-glass border-glass-border shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">How Each Method Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                <h4 className="font-medium text-foreground">AI Task Creator</h4>
              </div>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Describe your needs in natural language</li>
                <li>• AI analyzes and creates structured tasks</li>
                <li>• Edit and approve before saving</li>
                <li>• Perfect for complex conditional logic</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                <h4 className="font-medium text-foreground">AI-Guided Mode</h4>
              </div>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• AI creates step-by-step instructions</li>
                <li>• Screen recording captures everything</li>
                <li>• Real-time guidance for perfect timing</li>
                <li>• Creates visual proof of automation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                <h4 className="font-medium text-foreground">Record Mode</h4>
              </div>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Open floating automation window</li>
                <li>• Press record and perform actions</li>
                <li>• System captures your keystrokes</li>
                <li>• Great for exact sequence replication</li>
              </ul>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                <h4 className="font-medium text-foreground">Playback Mode</h4>
              </div>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• Browse your saved automation tasks</li>
                <li>• Filter by app, frequency, or tags</li>
                <li>• One-click execution of any task</li>
                <li>• Organize favorites for quick access</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Note about limitations */}
        <Card className="p-4 bg-warning/5 border-warning/20">
          <p className="text-sm text-warning-foreground">
            <strong>Note:</strong> This is a demo interface. In a real implementation, you would need a native Mac app 
            with accessibility permissions to actually control the system and automate keystrokes.
          </p>
        </Card>
      </div>

      {/* Floating Windows */}
      {activeWindows.map((windowId) => (
        <FloatingWindow
          key={windowId}
          onClose={() => closeWindow(windowId)}
          onMinimize={() => console.log('Minimize', windowId)}
        />
      ))}
    </div>
  );
};
