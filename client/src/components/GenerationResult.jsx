import React, { useState } from 'react';
import { Download, Share2, Video, Loader2, Play, Sparkles, Wind, Zap, Camera } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Animation styles for video generation
const ANIMATION_STYLES = {
  clothes: [
    {
      id: 'runway_walk',
      name: 'Runway Walk',
      icon: <Wind className="w-5 h-5" />,
      description: 'Professional runway walk with confident stride',
      prompt: 'Professional fashion runway walk, model walking confidently towards camera, elegant stride, garment flowing naturally, studio lighting, high fashion editorial style, smooth camera follow'
    },
    {
      id: 'gentle_turn',
      name: 'Gentle Turn',
      icon: <Camera className="w-5 h-5" />,
      description: 'Slow 360° rotation showing all angles',
      prompt: 'Slow elegant 360-degree turn, model rotating smoothly to show garment from all angles, natural graceful movement, studio environment, perfect lighting, cinematic slow motion'
    },
    {
      id: 'pose_transition',
      name: 'Pose Flow',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Smooth transitions between poses',
      prompt: 'Smooth transition between fashion poses, natural elegant movements, model shifting stance gracefully, garment details visible, editorial photography style, sophisticated motion'
    },
    {
      id: 'dynamic_motion',
      name: 'Dynamic',
      icon: <Zap className="w-5 h-5" />,
      description: 'Energetic movement with garment flow',
      prompt: 'Dynamic energetic movement, model moving with energy and style, garment flowing and moving naturally, vibrant fashion shoot atmosphere, dramatic lighting, high-energy editorial'
    }
  ],
  shoes: [
    {
      id: 'walking_steps',
      name: 'Walking Steps',
      icon: <Wind className="w-5 h-5" />,
      description: 'Natural walking motion showcasing shoes',
      prompt: 'Natural walking motion from low angle, legs moving forward with confident stride, shoes clearly visible in motion, dynamic footwork, street style photography, smooth camera tracking'
    },
    {
      id: 'shoe_rotate',
      name: 'Shoe Rotation',
      icon: <Camera className="w-5 h-5" />,
      description: 'Rotating to show shoe from all angles',
      prompt: 'Smooth rotation showcasing shoes from all angles, feet pivoting elegantly, shoe details clearly visible, professional product photography, controlled lighting, cinematic presentation'
    },
    {
      id: 'dynamic_jump',
      name: 'Jump Shot',
      icon: <Zap className="w-5 h-5" />,
      description: 'Athletic jump showcasing shoe design',
      prompt: 'Athletic energetic jump motion, shoes captured mid-air with dynamic movement, sporty action shot style, shoe design prominently featured, high-energy photography, dramatic slow motion'
    },
    {
      id: 'lifestyle_walk',
      name: 'Lifestyle Walk',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Casual lifestyle walking scene',
      prompt: 'Casual lifestyle walking scene, natural relaxed stride, shoes in authentic environment, lifestyle photography style, natural lighting, documentary feel with cinematic quality'
    }
  ]
};

const GenerationResult = ({ result, category = 'clothes' }) => {
  const [copied, setCopied] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState(null);
  const [videoError, setVideoError] = useState(null);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [showAnimationPicker, setShowAnimationPicker] = useState(false);

  if (!result?.imageUrl) return null;

  const animationStyles = ANIMATION_STYLES[category] || ANIMATION_STYLES.clothes;

  const handleCopy = async () => {
    if (!result.imageUrl || !navigator?.clipboard) return;
    try {
      await navigator.clipboard.writeText(result.imageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleAnimate = async (animation) => {
    if (isVideoGenerating) return;

    setIsVideoGenerating(true);
    setVideoError(null);
    setVideoResult(null);
    setSelectedAnimation(animation);
    setShowAnimationPicker(false);

    try {
      const apiUrl = `${API_BASE}/api/generate-video`;
      console.log('Requesting video generation from:', apiUrl);

      // Build enhanced prompt
      const basePrompt = animation.prompt;
      const preservationClause = category === 'shoes'
        ? 'CRITICAL: Preserve exact shoe design, color, logos, and details from the image. Maintain leg outfit style.'
        : 'CRITICAL: Preserve exact face features, garment design, color, and details from the image.';

      const qualityClause = 'Photorealistic, 4K quality, professional cinematography, smooth motion.';

      const finalPrompt = `${basePrompt}. ${preservationClause} ${qualityClause}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: result.imageUrl,
          prompt: finalPrompt,
          category: category,
          animationStyle: animation.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Video generation failed');
      }

      setVideoResult(data);
    } catch (err) {
      console.error(err);
      setVideoError(err.message || 'Failed to generate video');
    } finally {
      setIsVideoGenerating(false);
    }
  };

  const downloadHref = result.downloadUrl || result.imageUrl;

  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
      <div className="glass-panel p-2 overflow-hidden">
        <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden group">
          <img src={result.imageUrl} alt="Generated Model" className="w-full h-full object-cover" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <div className="flex gap-3 justify-center">
              <a
                className="btn-primary flex items-center gap-2 py-2 px-4 text-sm"
                href={downloadHref}
                target="_blank"
                rel="noreferrer"
                download
              >
                <Download className="w-4 h-4" /> Save HD
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" /> {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Generation Section */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-900">
              <Video className="w-5 h-5 text-slate-700" />
              Animate Result
            </h3>
            <p className="text-sm text-slate-500 mt-1">Choose an animation style to bring your image to life</p>
          </div>
        </div>

        {!videoResult && !isVideoGenerating && !showAnimationPicker && (
          <button
            onClick={() => setShowAnimationPicker(true)}
            className="w-full bg-gradient-to-r from-slate-900 to-slate-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" /> Choose Animation Style
          </button>
        )}

        {showAnimationPicker && !isVideoGenerating && !videoResult && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid md:grid-cols-2 gap-3">
              {animationStyles.map((animation) => (
                <button
                  key={animation.id}
                  onClick={() => handleAnimate(animation)}
                  className="relative p-4 rounded-xl border-2 border-slate-200 bg-white hover:border-slate-900 hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-lg bg-slate-100 group-hover:bg-slate-900 transition-colors">
                      {React.cloneElement(animation.icon, {
                        className: 'w-5 h-5 text-slate-700 group-hover:text-white transition-colors'
                      })}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{animation.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{animation.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAnimationPicker(false)}
              className="w-full py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {isVideoGenerating && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-slate-50 rounded-xl border border-slate-200">
            <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">Generating {selectedAnimation?.name}...</p>
              <p className="text-xs text-slate-500 mt-1">This may take 30-60 seconds</p>
            </div>
          </div>
        )}

        {videoError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm text-center">
            {videoError}
            <button
              onClick={() => {
                setVideoError(null);
                setShowAnimationPicker(true);
              }}
              className="block w-full mt-3 text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {videoResult && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl">
              <video
                src={videoResult.videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-2">
                {selectedAnimation && (
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    {React.cloneElement(selectedAnimation.icon, { className: 'w-4 h-4' })}
                    <span className="font-medium">{selectedAnimation.name}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setVideoResult(null);
                    setSelectedAnimation(null);
                    setShowAnimationPicker(true);
                  }}
                  className="text-sm text-slate-600 hover:text-slate-900 font-medium px-3 py-1"
                >
                  New Animation
                </button>
                <a
                  href={videoResult.downloadUrl || videoResult.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="text-sm bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" /> Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationResult;
