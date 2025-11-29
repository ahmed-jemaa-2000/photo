import React, { useState } from 'react';
import { Download, Share2, Sparkles, Link2 } from 'lucide-react';

const GenerationResult = ({ result }) => {
  const [copied, setCopied] = useState(false);

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

  const downloadHref = result.downloadUrl || result.imageUrl;

  return (
    <div className="w-full max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
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

      <div className="mt-4 glass-panel p-4 text-sm space-y-2">
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
        <p className="text-slate-200">
          Prompt: <span className="text-slate-400">{result.prompt}</span>
        </p>
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
