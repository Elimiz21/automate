import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  Terminal,
  Code,
  Globe,
  Folder,
  Mail,
  MessageSquare
} from 'lucide-react';

const apps = [
  { name: 'Terminal', icon: Terminal, command: 'Terminal', color: 'bg-slate-500' },
  { name: 'VS Code', icon: Code, command: 'Visual Studio Code', color: 'bg-blue-500' },
  { name: 'Browser', icon: Globe, command: 'Safari', color: 'bg-orange-500' },
  { name: 'Finder', icon: Folder, command: 'Finder', color: 'bg-gray-500' },
  { name: 'Mail', icon: Mail, command: 'Mail', color: 'bg-blue-600' },
  { name: 'Messages', icon: MessageSquare, command: 'Messages', color: 'bg-green-500' },
];

export const AppLauncher = () => {
  const launchApp = (app: typeof apps[0]) => {
    toast({
      title: "Launching Application",
      description: `Opening ${app.name}...`
    });

    // Simulate app launch
    setTimeout(() => {
      toast({
        title: "Application Launched",
        description: `${app.name} is now running.`
      });
    }, 1500);
  };

  return (
    <Card className="p-4 bg-glass-bg backdrop-blur-glass border-glass-border shadow-floating">
      <h3 className="text-sm font-medium text-foreground mb-3">Quick Launch</h3>
      <div className="grid grid-cols-3 gap-2">
        {apps.map((app) => {
          const IconComponent = app.icon;
          return (
            <Button
              key={app.name}
              variant="ghost"
              size="sm"
              onClick={() => launchApp(app)}
              className="h-16 flex flex-col gap-1 hover:bg-accent/50"
            >
              <div className={`p-2 rounded-lg ${app.color}`}>
                <IconComponent className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-muted-foreground">{app.name}</span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
};