import { useState } from 'react';
import { 
  Bus, 
  Video, 
  Send, 
  Cloud, 
  MapPin, 
  Play, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { workflowSteps } from '@/data/mockData';

interface WorkflowCardProps {
  onComplete: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  bus: Bus,
  camera: Video,
  send: Send,
  cloud: Cloud,
  map: MapPin,
};

export function WorkflowCard({ onComplete }: WorkflowCardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const runWorkflow = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCompletedSteps([]);

    for (let i = 0; i < workflowSteps.length; i++) {
      setCurrentStep(i + 1);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setCompletedSteps(prev => [...prev, i + 1]);
    }

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsRunning(false);
    onComplete();
  };

  const resetWorkflow = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
    setIsRunning(false);
  };

  return (
    <div className="card-elevated p-6" style={{ 
      background: 'linear-gradient(135deg, var(--color-card) 0%, var(--color-secondary) 100%)'
    }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl icon-glow icon-glow-blue" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
            <Bus className="w-7 h-7 text-blue-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold gradient-text">
              Capture and Processing Workflow
            </h2>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={runWorkflow}
            disabled={isRunning}
            className="gap-2 btn-primary-glow px-6 py-2.5 text-sm font-semibold shadow-lg shadow-blue-500/30"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Simulate Workflow
              </>
            )}
          </Button>
          {completedSteps.length > 0 && !isRunning && (
            <Button variant="outline" onClick={resetWorkflow} className="px-5 py-2.5 text-sm font-semibold">
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2">
        {workflowSteps.map((step, index) => {
          const Icon = iconMap[step.icon];
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStep === step.id && isRunning;
          const isPending = step.id > currentStep;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className="workflow-step flex flex-col items-center p-4 rounded-xl min-w-[140px] transition-all duration-300"
                style={{
                  backgroundColor: isActive 
                    ? 'rgba(59, 130, 246, 0.2)' 
                    : isCompleted 
                      ? 'rgba(59, 130, 246, 0.12)' 
                      : 'var(--color-background)',
                  opacity: isPending && !isActive ? 0.5 : 1,
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive 
                    ? '0 4px 20px rgba(59, 130, 246, 0.3), inset 0 0 0 1px rgba(59, 130, 246, 0.3)' 
                    : isCompleted 
                      ? '0 4px 12px rgba(59, 130, 246, 0.15), inset 0 0 0 1px rgba(59, 130, 246, 0.2)'
                      : 'inset 0 0 0 1px var(--color-border)',
                }}
              >
                <div
                  className="p-3 rounded-xl mb-3 transition-all duration-300"
                  style={{
                    backgroundColor: isActive 
                      ? 'var(--color-primary)' 
                      : isCompleted 
                        ? '#22c55e' 
                        : 'var(--color-secondary)',
                    color: isActive || isCompleted ? 'white' : 'var(--color-muted-foreground)',
                    boxShadow: isActive 
                      ? '0 4px 12px rgba(59, 130, 246, 0.5)' 
                      : isCompleted 
                        ? '0 4px 12px rgba(34, 197, 94, 0.4)'
                        : 'none',
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : isActive ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>
                <span className="text-sm font-semibold text-center">
                  {step.title}
                </span>
                <span className="text-xs text-center mt-1 font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
                  {step.description}
                </span>
              </div>
              {index < workflowSteps.length - 1 && (
                <div
                  className="w-10 h-1 mx-2 rounded-full transition-colors duration-300"
                  style={{
                    backgroundColor: isCompleted ? '#3b82f6' : 'var(--color-secondary)',
                    boxShadow: isCompleted ? '0 0 8px rgba(59, 130, 246, 0.5)' : 'none',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
