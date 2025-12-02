import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

/**
 * AnimatedProgress - Full screen progress overlay with 2-minute timer
 */
function AnimatedProgress({ isGenerating }) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analyzing garment structure...",
    "Mapping 3D body pose...",
    "Adjusting lighting and shadows...",
    "Rendering high-fidelity details...",
    "Finalizing composition..."
  ];

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setTimeLeft(120);
      setCurrentStep(0);
      return;
    }

    const duration = 120 * 1000; // 2 minutes in ms
    const intervalTime = 100; // Update every 100ms
    const stepsCount = duration / intervalTime;
    const increment = 100 / stepsCount;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + increment;
      });

      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 0.1;
      });
    }, intervalTime);

    // Cycle text steps
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length);
    }, 24000); // Change text every 24 seconds (120/5)

    return () => {
      clearInterval(timer);
      clearInterval(stepInterval);
    };
  }, [isGenerating]);

  if (!isGenerating) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md">
      <div className="w-full max-w-md px-6 text-center space-y-8">
        {/* Icon Animation */}
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-16 h-16 text-primary animate-pulse" />
          </div>
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-800"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary transition-all duration-300 ease-linear"
              strokeDasharray={2 * Math.PI * 60}
              strokeDashoffset={2 * Math.PI * 60 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Text Info */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Creating Magic
          </h2>
          <p className="text-xl text-slate-300 font-medium min-h-[2rem]">
            {steps[currentStep]}
          </p>
          <div className="text-4xl font-mono font-bold text-primary">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
          <p className="text-sm text-slate-500">
            Please wait while we generate your professional photo.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnimatedProgress;
