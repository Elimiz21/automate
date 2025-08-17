import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FloatingWindow } from './FloatingWindow';
import { TaskHistory } from './TaskHistory';
import { AITaskCreator } from './AITaskCreator';
import { 
  Plus, 
  Monitor, 
  Layers,
  Settings,
  Info,
  Zap
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
    { label: 'Saved Tasks', value: 12, icon: Layers },
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

        {/* Main Controls */}
        <Card className="p-6 bg-glass-bg backdrop-blur-glass border-glass-border shadow-floating">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Control Center</h2>
            <Badge variant="secondary" className="animate-pulse">
              {activeWindows.length} Active
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={createWindow}
              className="h-20 flex flex-col gap-2"
            >
              <Plus className="h-6 w-6" />
              New Window
            </Button>

            <Button 
              variant="secondary"
              onClick={() => setShowHistory(!showHistory)}
              className="h-20 flex flex-col gap-2"
            >
              <Layers className="h-6 w-6" />
              Task History
            </Button>

            <Button 
              variant="secondary"
              className="h-20 flex flex-col gap-2"
            >
              <Settings className="h-6 w-6" />
              Settings
            </Button>

            <Button 
              variant="secondary"
              className="h-20 flex flex-col gap-2"
            >
              <Info className="h-6 w-6" />
              About
            </Button>
          </div>
        </Card>

        {/* AI Task Creator */}
        <AITaskCreator />

        {/* Task History */}
        {showHistory && (
          <div className="animate-fade-in">
            <TaskHistory />
          </div>
        )}

        {/* Instructions */}
        <Card className="p-6 bg-glass-bg backdrop-blur-glass border-glass-border shadow-soft">
          <h3 className="text-lg font-semibold text-foreground mb-4">How to Use</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Recording Mode</h4>
              <ul className="space-y-1">
                <li>• Click "New Window" to create a floating automation panel</li>
                <li>• Press "Record" to start capturing keystrokes</li>
                <li>• Perform your actions (launch apps, approve dialogs)</li>
                <li>• Press "Stop" to save the sequence</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Playback Mode</h4>
              <ul className="space-y-1">
                <li>• Select a saved task from history</li>
                <li>• Click "Play" to execute the automation</li>
                <li>• Use quick launch buttons for common apps</li>
                <li>• Drag windows to any screen for multi-monitor support</li>
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