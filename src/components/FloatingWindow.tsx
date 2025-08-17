import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Square, 
  Circle, 
  MoreHorizontal, 
  X, 
  Minimize2,
  History,
  Settings,
  Terminal,
  Code,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingWindowProps {
  onClose?: () => void;
  onMinimize?: () => void;
}

export const FloatingWindow = ({ onClose, onMinimize }: FloatingWindowProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  if (typeof window !== 'undefined') {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      setIsPlaying(false);
    }
  };

  const togglePlayback = () => {
    if (!isRecording) {
      setIsPlaying(!isPlaying);
    }
  };

  const quickActions = [
    { icon: Terminal, label: 'Terminal', action: () => console.log('Launch Terminal') },
    { icon: Code, label: 'VS Code', action: () => console.log('Launch VS Code') },
    { icon: Globe, label: 'Browser', action: () => console.log('Launch Browser') }
  ];

  return (
    <Card 
      ref={windowRef}
      className="fixed z-50 w-80 bg-glass-bg backdrop-blur-glass border-glass-border shadow-floating animate-fade-in hover:animate-float"
      style={{
        left: position.x,
        top: position.y,
        background: 'var(--gradient-subtle)'
      }}
    >
      {/* Title Bar */}
      <div 
        className="flex items-center justify-between p-3 cursor-move border-b border-glass-border"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            />
            <button
              onClick={onMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            />
            <button className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors" />
          </div>
          <span className="text-sm font-medium text-foreground ml-2">AutoMate</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isRecording ? "bg-recording animate-pulse-recording" : 
              isPlaying ? "bg-success animate-pulse" : "bg-muted"
            )} />
            <span className="text-sm text-muted-foreground">
              {isRecording ? 'Recording...' : isPlaying ? 'Playing...' : 'Ready'}
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Session #1
          </Badge>
        </div>

        {/* Main Controls */}
        <div className="flex gap-2">
          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "default"}
            size="sm"
            className="flex-1"
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            {isRecording ? 'Stop' : 'Record'}
          </Button>
          <Button
            onClick={togglePlayback}
            variant={isPlaying ? "secondary" : "default"}
            size="sm"
            className="flex-1"
            disabled={isRecording}
          >
            <Play className="h-4 w-4" />
            {isPlaying ? 'Stop' : 'Play'}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Quick Launch</span>
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                onClick={action.action}
                className="flex flex-col gap-1 h-auto py-3"
              >
                <action.icon className="h-4 w-4" />
                <span className="text-xs">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-2 pt-2 border-t border-glass-border">
          <Button variant="ghost" size="sm" className="flex-1">
            <History className="h-4 w-4 mr-1" />
            History
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>
    </Card>
  );
};