import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * AnimatedProgress - Cycling progress steps during generation
 * Shows 4 steps that rotate every 3 seconds to keep user engaged
 */
function AnimatedProgress({ isGenerating }) {
  const [currentStep, setCurrentStep] = useState(0);

  const progressSteps = [
    {
      emoji: '🎨',
      text: 'Analyzing cloth colors and patterns...',
      description: 'Extracting color palette and fabric details'
    },
    {
      emoji: '👗',
      text: 'Fitting the model perfectly...',
      description: 'Positioning garment on model reference'
    },
    {
      emoji: '💡',
      text: 'Adjusting studio lighting...',
      description: 'Setting up professional photography lighting'
    },
    {
      emoji: '✨',
      text: 'Rendering final details...',
      description: 'Generating photorealistic output'
    }
  ];

  useEffect(() => {
    if (!isGenerating) {
      setCurrentStep(0);
      return;
    }

    // Cycle through steps every 3 seconds
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % progressSteps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isGenerating, progressSteps.length]);

  if (!isGenerating) {
    return null;
  }

  const currentStepData = progressSteps[currentStep];

  return (
    <div className="glass-panel p-6 space-y-4">
      {/* Animated spinner */}
      <div className="flex justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>

      {/* Current step */}
      <div className="text-center space-y-2">
        <div className="text-4xl">{currentStepData.emoji}</div>
        <h3 className="text-lg font-semibold text-slate-200">
          {currentStepData.text}
        </h3>
        <p className="text-sm text-slate-400">
          {currentStepData.description}
        </p>
      </div>

      {/* Progress indicator dots */}
      <div className="flex justify-center gap-2">
        {progressSteps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'w-8 bg-primary'
                : 'w-2 bg-slate-600'
            }`}
          />
        ))}
      </div>

      {/* Time estimate */}
      <div className="text-center">
        <p className="text-xs text-slate-500">
          This usually takes 30-60 seconds
        </p>
      </div>
    </div>
  );
}

export default AnimatedProgress;
