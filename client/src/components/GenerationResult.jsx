import React, { useState } from 'react';
import { Download, Share2, Video, Loader2, Play, Sparkles, Wind, Zap, Camera, RotateCcw, Hand, Eye, Star, Terminal, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Animation styles for video generation - CATEGORY SPECIFIC
const ANIMATION_STYLES = {
  clothes: [
    {
      id: 'runway_walk',
      name: 'Runway Walk',
      icon: <Wind className="w-5 h-5" />,
      description: 'Professional runway walk with confident stride',
      prompt: 'Smooth runway walk, confident stride, subtle hip movement, fabric flowing naturally, professional lighting consistent, camera follows model smoothly, high-end fashion commercial, 4K cinematic, garment details visible throughout'
    },
    {
      id: 'model_turn',
      name: 'Model Turn',
      icon: <RotateCcw className="w-5 h-5" />,
      description: '360° turn showing all angles',
      prompt: 'Graceful 360-degree turn on spot, fabric movement visible, smooth pivot, showing front, side, and back of garment, professional lighting maintained through rotation, fashion show quality'
    },
    {
      id: 'subtle_pose',
      name: 'Subtle Move',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Gentle pose transitions',
      prompt: 'Minimal elegant movement, gentle weight shift, slight arm adjustment, breathing animation, maintaining fashion pose, professional model micro-movements, high-end lookbook style'
    },
    {
      id: 'fabric_flow',
      name: 'Fabric Flow',
      icon: <Zap className="w-5 h-5" />,
      description: 'Highlight fabric movement',
      prompt: 'Dramatic fabric movement, wind-blown effect, material flowing and draping, showcasing texture and flow, editorial fashion aesthetic, slow motion fabric physics, premium commercial quality'
    }
  ],
  shoes: [
    {
      id: 'walking_feet',
      name: 'Walking Motion',
      icon: <Wind className="w-5 h-5" />,
      description: 'Natural walking from low angle',
      prompt: 'Focus on feet and legs, natural walking motion from low angle, each step clearly visible, shoe flex and movement shown, clean floor reflection, professional footwear commercial, steady tracking shot'
    },
    {
      id: 'shoe_rotation',
      name: '360° Rotation',
      icon: <RotateCcw className="w-5 h-5" />,
      description: 'Orbit around the shoe',
      prompt: 'Smooth 360-degree orbit around the shoe, revealing all angles, focus on design details and craftsmanship, professional product photography in motion, studio lighting, no model visible'
    },
    {
      id: 'step_detail',
      name: 'Step Detail',
      icon: <Camera className="w-5 h-5" />,
      description: 'Close-up stepping motion',
      prompt: 'Close-up shot of foot stepping forward, slow motion, sole flex visible, heel-to-toe motion, showcasing shoe performance and comfort, athletic commercial style'
    },
    {
      id: 'lacing_focus',
      name: 'Detail Zoom',
      icon: <Eye className="w-5 h-5" />,
      description: 'Zoom on lacing and details',
      prompt: 'Camera slowly zooms and pans across shoe details, focusing on lacing, stitching, material texture, tongue, and branding, macro product video style'
    }
  ],
  bags: [
    {
      id: 'carry_walk',
      name: 'Carry & Walk',
      icon: <Wind className="w-5 h-5" />,
      description: 'Model walking with bag',
      prompt: 'Model walking naturally with bag, arm swing with bag visible, lifestyle context, bag moves realistically with body motion, fashion accessory commercial, focus on bag throughout'
    },
    {
      id: 'bag_360',
      name: '360° Display',
      icon: <RotateCcw className="w-5 h-5" />,
      description: 'Full rotation product shot',
      prompt: 'Smooth 360-degree rotation of bag, floating or on display stand, studio lighting, showing all sides, hardware details, interior briefly visible, luxury product commercial'
    },
    {
      id: 'open_close',
      name: 'Open & Close',
      icon: <Hand className="w-5 h-5" />,
      description: 'Show interior and closure',
      prompt: 'Hands opening bag to reveal interior, showing pockets and organization, then closing with click of clasp or zipper, luxury detail shot, close-up hands product video'
    },
    {
      id: 'strap_adjust',
      name: 'Strap Style',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Adjusting shoulder strap',
      prompt: 'Model adjusting bag strap on shoulder, showing strap length and comfort, lifestyle natural movement, casual confident styling, fashion accessory lifestyle video'
    }
  ],
  accessories: [
    {
      id: 'sparkle_reveal',
      name: 'Sparkle Reveal',
      icon: <Star className="w-5 h-5" />,
      description: 'Light catching on jewelry',
      prompt: 'Slow elegant movement, light catching on jewelry surfaces, subtle sparkle effects, rotating to show facets and details, luxury commercial style, dramatic lighting, premium jewelry commercial'
    },
    {
      id: 'wrist_gesture',
      name: 'Wrist Gesture',
      icon: <Hand className="w-5 h-5" />,
      description: 'Natural wrist/hand movement',
      prompt: 'Natural wrist and hand movement, watch or bracelet visible, elegant gestures, checking time or adjusting cuff, lifestyle context, premium accessory commercial'
    },
    {
      id: 'zoom_detail',
      name: 'Detail Zoom',
      icon: <Eye className="w-5 h-5" />,
      description: 'Macro zoom on craftsmanship',
      prompt: 'Camera slowly zooms into product details, extreme close-up on craftsmanship, engravings, gemstones, mechanism, premium macro photography in motion'
    },
    {
      id: 'floating_orbit',
      name: 'Floating Orbit',
      icon: <RotateCcw className="w-5 h-5" />,
      description: 'Product floating with camera orbit',
      prompt: 'Product floating in space with gentle rotation, camera orbiting slowly, dramatic rim lighting, luxury product video, clean dark background, jewelry commercial quality'
    }
  ]
};

// Only show debug features in development
const isDev = import.meta.env?.DEV || false;

const GenerationResult = ({ result, category = 'clothes', onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
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
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-black/20"
                href={downloadHref}
                target="_blank"
                rel="noreferrer"
                download
              >
                <Download className="w-4 h-4" /> Save HD
              </a>

              {onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="bg-primary hover:bg-primary-light text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 text-sm shadow-lg shadow-primary/20"
                >
                  <RefreshCw className="w-4 h-4" /> Try Again
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white font-bold py-2 px-4 rounded-xl transition-all flex items-center gap-2 text-sm"
              >
                <Share2 className="w-4 h-4" /> {copied ? 'Copied' : 'Share'}
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

      {/* Debug Console - ONLY in development */}
      {isDev && (
        <div className="glass-panel overflow-hidden">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="w-full flex items-center justify-between p-4 text-sm font-mono text-slate-500 hover:text-slate-300 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>Prompt Debugger (DEV ONLY)</span>
            </div>
            <span>{showPrompt ? 'Hide' : 'Show'}</span>
          </button>

          {showPrompt && (
            <div className="p-4 bg-black/40 border-t border-white/5 font-mono text-xs text-slate-400 space-y-4">
              <div>
                <span className="text-slate-500 uppercase tracking-wider block mb-1">Final Prompt</span>
                <p className="text-emerald-400/90 leading-relaxed break-words">{result.prompt}</p>
              </div>
              {result.colorHex && (
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block mb-1">Active Color</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: result.colorHex }} />
                    <span>{result.colorHex}</span>
                  </div>
                </div>
              )}
              {result.meta && (
                <div>
                  <span className="text-slate-500 uppercase tracking-wider block mb-1">Metadata</span>
                  <pre className="overflow-x-auto">{JSON.stringify(result.meta, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerationResult;
