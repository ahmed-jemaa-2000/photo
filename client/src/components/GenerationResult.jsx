import React, { useState } from 'react';
import { Download, Share2, Sparkles, Link2, Video, Loader2, Play } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const GenerationResult = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoResult, setVideoResult] = useState(null);
  const [videoError, setVideoError] = useState(null);

  if (!result?.imageUrl) return null;

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

  const handleAnimate = async () => {
    if (isVideoGenerating) return;

    setIsVideoGenerating(true);
    setVideoError(null);
    setVideoResult(null);

    try {
      const apiUrl = `${API_BASE}/api/generate-video`;
      console.log('Requesting video generation from:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: result.imageUrl,
          prompt: `Cinematic fashion video of a ${result.gender || 'model'} wearing the garment. ${result.pose || 'standing'}, moving naturally. High fidelity, photorealistic, 4k. CRITICAL: Preserve exact face and garment details from the image. Studio lighting, slow motion.`,
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
            <div className="inline-flex items-center gap-2 self-start bg-black/40 px-3 py-1 rounded-full text-xs">
              <Sparkles className="w-4 h-4 text-primary" />
              {result.meta?.model || 'imagen-pro'}
            </div>
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            Animate Result
          </h3>
          {!videoResult && !isVideoGenerating && (
            <button
              onClick={handleAnimate}
              className="bg-gradient-to-r from-primary to-secondary text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] transition-all flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" /> Generate Video
            </button>
          )}
        </div>

        {isVideoGenerating && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4 bg-white/5 rounded-xl border border-white/10">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-slate-300">Generating video... this may take a minute.</p>
          </div>
        )}

        {videoError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl text-sm text-center">
            {videoError}
          </div>
        )}

        {videoResult && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10">
              <video
                src={videoResult.videoUrl}
                controls
                autoPlay
                loop
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex justify-end">
              <a
                href={videoResult.downloadUrl || videoResult.videoUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Video
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="glass-panel p-4 text-sm space-y-2">
        <div className="flex items-center gap-2 text-slate-300">
          <Link2 className="w-4 h-4 text-primary" />
          <a
            href={downloadHref}
            className="underline text-primary hover:text-primary/80"
            target="_blank"
            rel="noreferrer"
          >
            Open hosted link
          </a>
        </div>
        {result.pose && (
          <p className="text-slate-200">
            Pose: <span className="text-slate-400">{result.pose}</span>
          </p>
        )}
        {result.backdrop && (
          <p className="text-slate-200">
            Background: <span className="text-slate-400">{result.backdrop}</span>
          </p>
        )}
        {result.gender && (
          <p className="text-slate-200">
            Persona: <span className="text-slate-400 capitalize">{result.gender}</span>
          </p>
        )}
        {result.colorHex && (
          <p className="text-slate-200 flex items-center gap-2">
            Color lock:
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: result.colorHex }} />
              <span className="text-slate-400">{result.colorHex}</span>
            </span>
          </p>
        )}
        {result.negative && (
          <p className="text-slate-200">
            Negative: <span className="text-slate-400">{result.negative}</span>
          </p>
        )}
        {result.meta?.statusDesc && (
          <p className="text-slate-400">
            Status: <span className="text-slate-200">{result.meta.statusDesc}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default GenerationResult;
