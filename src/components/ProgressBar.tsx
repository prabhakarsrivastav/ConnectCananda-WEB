import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  showIcon?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
}

export default function ProgressBar({
  progress,
  variant = 'default',
  size = 'md',
  showPercentage = true,
  showIcon = true,
  label,
  animated = true,
  striped = false,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const isComplete = clampedProgress >= 100;

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  const bgClasses = {
    default: 'bg-primary/20',
    success: 'bg-green-500/20',
    warning: 'bg-yellow-500/20',
    error: 'bg-red-500/20',
  };

  return (
    <div className="w-full space-y-2">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && (
            <span className="font-medium text-foreground">{label}</span>
          )}
          {showPercentage && (
            <div className="flex items-center gap-2">
              {isComplete && showIcon && (
                <Check className="w-4 h-4 text-green-500 animate-[scale-bounce_0.3s_ease-out]" />
              )}
              <span className="text-muted-foreground font-medium">
                {clampedProgress.toFixed(0)}%
              </span>
            </div>
          )}
        </div>
      )}

      <div
        className={`
          w-full rounded-full overflow-hidden
          ${sizeClasses[size]}
          ${bgClasses[variant]}
          relative
        `}
        role="progressbar"
        aria-valuenow={clampedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div
          className={`
            h-full rounded-full
            ${variantClasses[variant]}
            ${animated ? 'transition-all duration-500 ease-out' : ''}
            ${striped ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]' : ''}
            relative overflow-hidden
          `}
          style={{ width: `${clampedProgress}%` }}
        >
          {striped && (
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent)',
                backgroundSize: '1rem 1rem',
              }}
            />
          )}
        </div>

        {/* Shimmer effect for loading */}
        {!isComplete && animated && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
          </div>
        )}
      </div>
    </div>
  );
}

// Multi-step progress variant
interface MultiStepProgressProps {
  steps: string[];
  currentStep: number; // 0-based index
  completedSteps?: number[];
}

export function MultiStepProgress({
  steps,
  currentStep,
  completedSteps = [],
}: MultiStepProgressProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index) || index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center gap-2">
                {/* Step circle */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    font-semibold text-sm
                    transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground scale-110 shadow-[0_0_20px_hsl(var(--primary)/0.5)]'
                        : isCurrent
                        ? 'bg-primary/20 text-primary ring-4 ring-primary/30 scale-110'
                        : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`
                    text-xs font-medium text-center max-w-[80px]
                    ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                  `}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 h-1 mx-2 bg-muted rounded-full relative overflow-hidden">
                  <div
                    className={`
                      h-full bg-primary rounded-full
                      transition-all duration-500
                      ${isCompleted ? 'w-full' : 'w-0'}
                    `}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
