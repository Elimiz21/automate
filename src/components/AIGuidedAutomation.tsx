
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { 
  Brain,
  Video,
  Play,
  Square,
  Pause,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Eye,
  Keyboard,
  Clock
} from 'lucide-react';

interface AIInstruction {
  id: string;
  step: number;
  title: string;
  description: string;
  action: 'screen_recording' | 'keystroke' | 'wait' | 'observe';
  duration?: number;
  keySequence?: string;
  completed: boolean;
}

export const AIGuidedAutomation = () => {
  const [taskGoal, setTaskGoal] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [instructions, setInstructions] = useState<AIInstruction[]>([]);
  const [recordingBlob, setRecordingBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const generateInstructions = (goal: string): AIInstruction[] => {
    // AI simulation - in real app, this would call an actual AI service
    const lowerGoal = goal.toLowerCase();
    const baseInstructions: AIInstruction[] = [];

    if (lowerGoal.includes('claude') || lowerGoal.includes('code')) {
      baseInstructions.push(
        {
          id: '1',
          step: 1,
          title: 'Start Screen Recording',
          description: 'Begin recording your screen to capture the Claude Code interaction',
          action: 'screen_recording',
          completed: false
        },
        {
          id: '2',
          step: 2,
          title: 'Wait for Approval Dialog',
          description: 'Observe the screen until Claude Code shows an approval dialog',
          action: 'observe',
          duration: 30,
          completed: false
        },
        {
          id: '3',
          step: 3,
          title: 'Press Enter Key',
          description: 'When the approval dialog appears, press Enter to accept',
          action: 'keystroke',
          keySequence: 'Enter',
          completed: false
        }
      );
    } else if (lowerGoal.includes('form') || lowerGoal.includes('fill')) {
      baseInstructions.push(
        {
          id: '1',
          step: 1,
          title: 'Start Screen Recording',
          description: 'Begin recording to capture form filling process',
          action: 'screen_recording',
          completed: false
        },
        {
          id: '2',
          step: 2,
          title: 'Navigate to Form',
          description: 'Click on the form or navigate to the target form',
          action: 'observe',
          duration: 10,
          completed: false
        },
        {
          id: '3',
          step: 3,
          title: 'Fill Form Fields',
          description: 'Tab through fields and enter the required information',
          action: 'keystroke',
          keySequence: 'Tab, Type, Tab, Type',
          completed: false
        }
      );
    } else {
      // Generic automation
      baseInstructions.push(
        {
          id: '1',
          step: 1,
          title: 'Start Screen Recording',
          description: 'Begin recording your screen to capture the automation process',
          action: 'screen_recording',
          completed: false
        },
        {
          id: '2',
          step: 2,
          title: 'Perform Target Action',
          description: 'Execute the main action you want to automate',
          action: 'observe',
          duration: 15,
          completed: false
        },
        {
          id: '3',
          step: 3,
          title: 'Complete Task',
          description: 'Finish the automation sequence',
          action: 'keystroke',
          keySequence: 'Enter',
          completed: false
        }
      );
    }

    return baseInstructions;
  };

  const startGuidedAutomation = () => {
    if (!taskGoal.trim()) {
      toast({
        title: "Task Goal Required",
        description: "Please describe what you want to automate.",
        variant: "destructive"
      });
      return;
    }

    const generatedInstructions = generateInstructions(taskGoal);
    setInstructions(generatedInstructions);
    setIsActive(true);
    setCurrentStep(0);

    toast({
      title: "AI Guide Started",
      description: "Follow the step-by-step instructions to complete your automation."
    });
  };

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordingBlob(blob);
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Complete the screen recording step
      completeCurrentStep();
      
      toast({
        title: "Screen Recording Started",
        description: "Your screen is now being recorded. Continue to the next step."
      });
      
    } catch (error) {
      toast({
        title: "Recording Failed",
        description: "Could not start screen recording. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopScreenRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const completeCurrentStep = () => {
    setInstructions(prev => 
      prev.map((instruction, index) => 
        index === currentStep 
          ? { ...instruction, completed: true }
          : instruction
      )
    );
    
    if (currentStep < instructions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // All steps completed
      finishAutomation();
    }
  };

  const executeKeystroke = (keySequence: string) => {
    toast({
      title: "Keystroke Executed",
      description: `Simulated: ${keySequence}`,
    });
    
    setTimeout(() => {
      completeCurrentStep();
    }, 1000);
  };

  const finishAutomation = () => {
    stopScreenRecording();
    
    const completedTask = {
      id: Date.now().toString(),
      name: `AI Guided: ${taskGoal}`,
      description: taskGoal,
      steps: instructions.map(instruction => ({
        type: 'action',
        description: instruction.description,
        action: instruction.action,
        parameters: {
          keySequence: instruction.keySequence,
          duration: instruction.duration
        }
      })),
      created: new Date().toISOString(),
      recording: recordingBlob ? URL.createObjectURL(recordingBlob) : null
    };
    
    // Save to localStorage
    const savedTasks = JSON.parse(localStorage.getItem('automate-tasks') || '[]');
    savedTasks.push(completedTask);
    localStorage.setItem('automate-tasks', JSON.stringify(savedTasks));
    
    toast({
      title: "Automation Complete!",
      description: "Your guided automation has been saved with screen recording."
    });
    
    // Reset state
    setIsActive(false);
    setCurrentStep(0);
    setInstructions([]);
    setTaskGoal('');
    setRecordingBlob(null);
  };

  const resetAutomation = () => {
    stopScreenRecording();
    setIsActive(false);
    setCurrentStep(0);
    setInstructions([]);
    setRecordingBlob(null);
  };

  const currentInstruction = instructions[currentStep];
  const progress = instructions.length > 0 ? ((currentStep + (currentInstruction?.completed ? 1 : 0)) / instructions.length) * 100 : 0;

  return (
    <Card className="p-6 bg-glass-bg backdrop-blur-glass border-glass-border shadow-floating">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">AI-Guided Automation</h3>
        <Badge variant="secondary" className="ml-auto">
          <Video className="h-3 w-3 mr-1" />
          With Recording
        </Badge>
      </div>

      {!isActive ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="task-goal" className="text-sm font-medium text-foreground mb-2 block">
              What do you want to learn to automate?
            </Label>
            <Input
              id="task-goal"
              placeholder="Example: I want to automate approving Claude Code suggestions automatically"
              value={taskGoal}
              onChange={(e) => setTaskGoal(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Button 
            onClick={startGuidedAutomation}
            disabled={!taskGoal.trim()}
            className="w-full"
          >
            <Brain className="h-4 w-4 mr-2" />
            Start AI-Guided Setup
          </Button>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2">How AI-Guided Automation Works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• AI analyzes your goal and creates step-by-step instructions</li>
              <li>• Screen recording captures everything you do</li>
              <li>• Real-time guidance tells you exactly when to act</li>
              <li>• Creates a complete automation with visual proof</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Task: {taskGoal}</h4>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {instructions.length}
              </p>
            </div>
            <Badge variant={isRecording ? "destructive" : "secondary"}>
              {isRecording ? (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
                  Recording
                </>
              ) : (
                <>
                  <Video className="h-3 w-3 mr-1" />
                  Ready
                </>
              )}
            </Badge>
          </div>

          <Progress value={progress} className="w-full" />

          {currentInstruction && (
            <Card className="p-4 border-primary/20 bg-primary/5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {currentInstruction.action === 'screen_recording' && <Video className="h-5 w-5 text-primary" />}
                  {currentInstruction.action === 'keystroke' && <Keyboard className="h-5 w-5 text-primary" />}
                  {currentInstruction.action === 'observe' && <Eye className="h-5 w-5 text-primary" />}
                  {currentInstruction.action === 'wait' && <Clock className="h-5 w-5 text-primary" />}
                </div>
                
                <div className="flex-grow">
                  <h5 className="font-medium text-foreground mb-1">
                    {currentInstruction.title}
                  </h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    {currentInstruction.description}
                  </p>
                  
                  {currentInstruction.keySequence && (
                    <div className="mb-3">
                      <Badge className="bg-primary text-primary-foreground font-mono">
                        {currentInstruction.keySequence}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {currentInstruction.action === 'screen_recording' && !isRecording && (
                      <Button onClick={startScreenRecording} size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Start Recording
                      </Button>
                    )}
                    
                    {currentInstruction.action === 'keystroke' && (
                      <Button 
                        onClick={() => executeKeystroke(currentInstruction.keySequence || '')} 
                        size="sm"
                      >
                        <Keyboard className="h-4 w-4 mr-2" />
                        Execute
                      </Button>
                    )}
                    
                    {(currentInstruction.action === 'observe' || currentInstruction.action === 'wait') && (
                      <Button onClick={completeCurrentStep} size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Done
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={resetAutomation}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            {isRecording && (
              <Button variant="destructive" onClick={stopScreenRecording}>
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>

          {instructions.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-medium text-foreground">All Steps:</h5>
              {instructions.map((instruction, index) => (
                <div 
                  key={instruction.id}
                  className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                    instruction.completed 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : index === currentStep
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-muted/50 text-muted-foreground'
                  }`}
                >
                  {instruction.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : index === currentStep ? (
                    <ArrowRight className="h-4 w-4" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span>{instruction.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
