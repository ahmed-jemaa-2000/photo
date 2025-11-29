import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, Trash2, CheckCircle2 } from 'lucide-react';

const ImageUpload = ({ onFileSelect, isGenerating, selectedFile, onClear, onColorDetected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [detectedColor, setDetectedColor] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
    }
  }, [selectedFile]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [],
  );

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      extractAverageColor(reader.result);
    };
    reader.readAsDataURL(file);
    onFileSelect?.(file);
  };

  const extractAverageColor = (dataUrl) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 50, 50);
        const { data } = ctx.getImageData(0, 0, 50, 50);
        let r = 0;
        let g = 0;
        let b = 0;
        const total = data.length / 4;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        r = Math.round(r / total);
        g = Math.round(g / total);
        b = Math.round(b / total);
        const hex = `#${[r, g, b]
          .map((v) => v.toString(16).padStart(2, '0'))
          .join('')
          .toUpperCase()}`;
        setDetectedColor(hex);
        onColorDetected?.(hex);
      } catch (err) {
        console.error('Color extraction failed', err);
        setDetectedColor(null);
        onColorDetected?.(null);
      }
    };
    img.src = dataUrl;
  };

  return (
    <div className="glass-panel p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Input</p>
          <p className="text-lg font-semibold">Upload a garment photo</p>
        </div>
        {selectedFile && (
          <button
            type="button"
            onClick={() => onClear?.()}
            className="text-xs flex items-center gap-1 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-primary/50 transition"
          >
            <Trash2 className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      <div
        className={`relative p-6 rounded-2xl border border-dashed transition-all duration-300 group ${
          dragActive ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-white/20 bg-white/5'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleChange}
          accept="image/*"
          disabled={isGenerating}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {preview ? (
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              {isGenerating && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mb-2" />
                  <p className="text-white font-medium animate-pulse">Generating...</p>
                </div>
              )}
              <div className="absolute top-3 left-3 bg-black/50 text-xs px-3 py-1 rounded-full flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                {selectedFile?.name}
              </div>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors">
                <Upload className="w-10 h-10 text-primary/80" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-1">Drag & drop or click</h3>
                <p className="text-slate-400 text-sm">Use a clear front-facing photo of the clothing item.</p>
              </div>
              <div className="text-xs text-slate-500 mt-4 bg-white/5 px-3 py-1 rounded-full flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                JPG, PNG, or WEBP - 3:4 works best
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 text-sm text-slate-400">
        <div className="p-3 rounded-xl border border-white/10 bg-white/5">Keep the clothing centered.</div>
        <div className="p-3 rounded-xl border border-white/10 bg-white/5">Avoid cluttered backgrounds.</div>
        <div className="p-3 rounded-xl border border-white/10 bg-white/5">Good lighting makes textures pop.</div>
      </div>

      {detectedColor && (
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span>Detected dominant color:</span>
          <div className="w-8 h-8 rounded-full border border-white/20" style={{ background: detectedColor }} />
          <span className="text-slate-500">{detectedColor}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
