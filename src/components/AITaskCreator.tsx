import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Edit, 
  Check, 
  X, 
  RefreshCw,
  Wand2
} from 'lucide-react';

interface GeneratedTask {
  name: string;
  description: string;
  triggers: string[];
  actions: { key: string; condition: string }[];
}

export const AITaskCreator = () => {
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTask, setGeneratedTask] = useState<GeneratedTask | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const generateTask = async () => {
    if (!userInput.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Parse the user input and generate a structured task
    const task = parseUserInput(userInput);
    setGeneratedTask(task);
    setIsGenerating(false);
  };

  const parseUserInput = (input: string): GeneratedTask => {
    // Simple AI simulation - in real app, this would call an actual AI service
    const lowerInput = input.toLowerCase();
    
    let name = "Custom Automation";
    let description = input;
    let triggers: string[] = [];
    let actions: { key: string; condition: string }[] = [];

    // Detect common patterns
    if (lowerInput.includes('claude') || lowerInput.includes('code')) {
      name = "Claude Code Automation";
      triggers.push("Claude Code approval dialog");
    }
    
    if (lowerInput.includes('approval')) {
      triggers.push("Approval dialog detected");
    }
    
    if (lowerInput.includes('press enter') || lowerInput.includes('enter')) {
      actions.push({ key: "Enter", condition: "On approval dialog" });
    }
    
    if (lowerInput.includes('press 2') || lowerInput.includes('option 2')) {
      actions.push({ key: "2", condition: "When multiple options available" });
    }
    
    if (lowerInput.includes('press 1') || lowerInput.includes('option 1')) {
      actions.push({ key: "1", condition: "When multiple options available" });
    }
    
    if (lowerInput.includes('press 3') || lowerInput.includes('option 3')) {
      actions.push({ key: "3", condition: "When multiple options available" });
    }

    // Default fallbacks
    if (triggers.length === 0) {
      triggers.push("Text prompt detected");
    }
    
    if (actions.length === 0) {
      actions.push({ key: "Enter", condition: "Default action" });
    }

    return { name, description, triggers, actions };
  };

  const handleApprove = () => {
    if (generatedTask) {
      console.log('Task approved:', generatedTask);
      // In a real app, save to task history
      setGeneratedTask(null);
      setUserInput('');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const handleRegenerate = () => {
    generateTask();
  };

  return (
    <Card className="p-6 bg-glass-bg backdrop-blur-glass border-glass-border shadow-floating">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
          <Wand2 className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">AI Task Creator</h3>
        <Badge variant="secondary" className="ml-auto">
          <Sparkles className="h-3 w-3 mr-1" />
          Beta
        </Badge>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="task-description" className="text-sm font-medium text-foreground mb-2 block">
            Describe what you need automated
          </Label>
          <Textarea
            id="task-description"
            placeholder="Example: Every time Claude Code asks for approval, press Enter. If it asks for approval between options 1, 2, 3, press 2"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <Button 
          onClick={generateTask}
          disabled={!userInput.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Task
            </>
          )}
        </Button>

        {generatedTask && (
          <div className="space-y-4 animate-fade-in">
            <div className="border-t border-border pt-4">
              <h4 className="font-medium text-foreground mb-3">Generated Task</h4>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Task Name</Label>
                  {isEditing ? (
                    <Input
                      value={generatedTask.name}
                      onChange={(e) => setGeneratedTask({
                        ...generatedTask,
                        name: e.target.value
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{generatedTask.name}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  {isEditing ? (
                    <Textarea
                      value={generatedTask.description}
                      onChange={(e) => setGeneratedTask({
                        ...generatedTask,
                        description: e.target.value
                      })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-foreground">{generatedTask.description}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Triggers</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {generatedTask.triggers.map((trigger, index) => (
                      <Badge key={index} variant="outline">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Actions</Label>
                  <div className="space-y-2 mt-1">
                    {generatedTask.actions.map((action, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                        <Badge className="bg-primary text-primary-foreground font-mono">
                          {action.key}
                        </Badge>
                        <span className="text-sm text-muted-foreground">→</span>
                        <span className="text-sm text-foreground">{action.condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveEdit} size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={handleApprove} size="sm">
                      <Check className="h-4 w-4 mr-2" />
                      Approve & Save
                    </Button>
                    <Button variant="outline" onClick={handleEdit} size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" onClick={handleRegenerate} size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button variant="outline" onClick={() => setGeneratedTask(null)} size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Discard
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};