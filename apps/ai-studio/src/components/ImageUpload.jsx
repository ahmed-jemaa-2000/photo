import React, { useState, useCallback, useEffect } from 'react';
import { Upload, Image as ImageIcon, Loader2, Trash2, CheckCircle2, ScanLine, AlertCircle, AlertTriangle } from 'lucide-react';
import { extractColorPalette } from '../utils/colorExtraction';
import { addColorNames } from '../utils/colorNaming';
import { validateImageFile } from '../utils/validateFile';

const ImageUpload = ({ onFileSelect, isGenerating, selectedFile, onClear, onColorDetected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [detectedColor, setDetectedColor] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [validationWarnings, setValidationWarnings] = useState([]);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      setValidationError(null);
      setValidationWarnings([]);
      setFileInfo(null);
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

  const handleFile = async (file) => {
    // Reset previous state
    setValidationError(null);
    setValidationWarnings([]);
    setFileInfo(null);
    setIsValidating(true);

    // Validate file first
    try {
      const validation = await validateImageFile(file);

      if (!validation.valid) {
        setValidationError(validation.error);
        setIsValidating(false);
        return;
      }

      if (validation.warnings) {
        setValidationWarnings(validation.warnings);
      }

      if (validation.info) {
        setFileInfo(validation.info);
      }
    } catch (err) {
      console.error('Validation failed:', err);
      setValidationError('Failed to validate file. Please try again.');
      setIsValidating(false);
      return;
    }

    setIsValidating(false);

    // File is valid - proceed with preview and upload
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
    onFileSelect?.(file);

    // Extract color palette
    setIsExtracting(true);
    try {
      const palette = await extractColorPalette(file, 5);
      const paletteWithNames = addColorNames(palette);

      // Set the dominant color for backward compatibility
      if (paletteWithNames.length > 0) {
        setDetectedColor(paletteWithNames[0].hex);
      }

      // Pass the full palette to parent
      onColorDetected?.(paletteWithNames);
    } catch (err) {
      console.error('Color extraction failed', err);
      setDetectedColor(null);
      onColorDetected?.(null);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Upload Garment</h3>
          <p className="text-sm text-slate-400">Supported formats: JPG, PNG, WEBP</p>
        </div>
        {selectedFile && (
          <button
            type="button"
            onClick={() => onClear?.()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-200 border border-white/10 hover:border-red-500/50 transition-all text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        )}
      </div>

      <div
        className={`relative group overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${dragActive
          ? 'border-primary bg-primary/10 scale-[1.01] shadow-xl shadow-primary/20'
          : selectedFile
            ? 'border-primary/50 bg-slate-900/50'
            : 'border-white/10 bg-white/5 hover:border-primary/50 hover:bg-white/10'
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{ minHeight: '400px' }}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          onChange={handleChange}
          accept="image/*"
          disabled={isGenerating}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          {preview ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
              />

              {/* Scanning Effect Overlay */}
              {isExtracting && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl">
                  <ScanLine className="w-12 h-12 text-primary animate-pulse mb-4" />
                  <p className="text-white font-medium">Analyzing colors...</p>
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg z-10">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="truncate max-w-[200px]">{selectedFile.name}</span>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6 max-w-sm relative z-10 pointer-events-none">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <Upload className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Drop your image here</h3>
                <p className="text-slate-400">
                  or <span className="text-primary font-medium underline decoration-primary/50 underline-offset-4">browse files</span> from your computer
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-4 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> High Quality
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span>Max 10MB</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Grid */}
      {!selectedFile && !validationError && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Good Lighting", desc: "Ensure even lighting without harsh shadows" },
            { title: "Clear Background", desc: "Simple or plain background works best" },
            { title: "High Resolution", desc: "Use sharp, high-quality images" }
          ].map((tip, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <h4 className="font-semibold text-slate-200 mb-1">{tip.title}</h4>
              <p className="text-xs text-slate-400">{tip.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Validation Error Display */}
      {validationError && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-200 font-medium">{validationError}</p>
            <button
              onClick={() => setValidationError(null)}
              className="mt-2 text-sm text-red-300 hover:text-red-100 underline underline-offset-2"
            >
              Try another file
            </button>
          </div>
        </div>
      )}

      {/* Validation Warnings Display */}
      {validationWarnings.length > 0 && !validationError && (
        <div className="p-4 bg-amber-500/20 border border-amber-500/50 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              {validationWarnings.map((warning, idx) => (
                <p key={idx} className="text-amber-200 text-sm">{warning}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* File Info Display */}
      {fileInfo && selectedFile && !validationError && (
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
          <span className="px-2 py-1 bg-white/5 rounded-md">{fileInfo.type}</span>
          <span className="px-2 py-1 bg-white/5 rounded-md">{fileInfo.dimensions.width} × {fileInfo.dimensions.height}px</span>
          <span className="px-2 py-1 bg-white/5 rounded-md">{fileInfo.size}</span>
        </div>
      )}

      {/* Validating Indicator */}
      {isValidating && (
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Validating image...</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
