import React, { useState } from 'react';
import { Palette, Check, X, AlertTriangle, Pipette } from 'lucide-react';

/**
 * Common color presets for quick selection
 */
const COLOR_PRESETS = [
    { name: 'White', hex: '#FFFFFF', textColor: '#000' },
    { name: 'Black', hex: '#000000', textColor: '#fff' },
    { name: 'Red', hex: '#DC2626', textColor: '#fff' },
    { name: 'Blue', hex: '#2563EB', textColor: '#fff' },
    { name: 'Navy', hex: '#1E3A8A', textColor: '#fff' },
    { name: 'Green', hex: '#16A34A', textColor: '#fff' },
    { name: 'Yellow', hex: '#EAB308', textColor: '#000' },
    { name: 'Orange', hex: '#EA580C', textColor: '#fff' },
    { name: 'Pink', hex: '#DB2777', textColor: '#fff' },
    { name: 'Purple', hex: '#7C3AED', textColor: '#fff' },
    { name: 'Gray', hex: '#6B7280', textColor: '#fff' },
    { name: 'Brown', hex: '#78350F', textColor: '#fff' },
    { name: 'Beige', hex: '#D4B896', textColor: '#000' },
    { name: 'Cream', hex: '#FFFDD0', textColor: '#000' },
];

/**
 * ColorOverrideSelector - Allows users to confirm or override the detected color
 * 
 * @param {object} detectedColor - The color detected from the image { hex, name, percentage }
 * @param {function} onColorConfirm - Called when user confirms the detected color
 * @param {function} onColorOverride - Called when user selects a different color
 * @param {boolean} isVisible - Whether to show the selector
 */
const ColorOverrideSelector = ({
    detectedColor,
    onColorConfirm,
    onColorOverride,
    isVisible = true
}) => {
    const [showPresets, setShowPresets] = useState(false);
    const [customHex, setCustomHex] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [overrideColor, setOverrideColor] = useState(null);

    if (!isVisible || !detectedColor) return null;

    const handleConfirm = () => {
        setIsConfirmed(true);
        setOverrideColor(null);
        onColorConfirm?.(detectedColor);
    };

    const handlePresetSelect = (preset) => {
        setIsConfirmed(true);
        setOverrideColor(preset);
        setShowPresets(false);
        onColorOverride?.({
            hex: preset.hex,
            name: preset.name,
            isManualOverride: true
        });
    };

    const handleCustomColor = (hex) => {
        if (/^#[A-Fa-f0-9]{6}$/.test(hex)) {
            const color = {
                hex: hex.toUpperCase(),
                name: 'Custom',
                isManualOverride: true
            };
            setIsConfirmed(true);
            setOverrideColor(color);
            onColorOverride?.(color);
        }
    };

    const displayColor = overrideColor || detectedColor;
    const isLightColor = isLight(displayColor?.hex);

    return (
        <div className="glass-panel p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-white">Detected Color</h4>
                </div>
                {isConfirmed && (
                    <span className="text-xs text-green-400 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Confirmed
                    </span>
                )}
            </div>

            {/* Color Preview */}
            <div className="flex items-center gap-4">
                <div
                    className="w-16 h-16 rounded-xl shadow-lg border-2 border-white/20 flex items-center justify-center"
                    style={{ backgroundColor: displayColor?.hex }}
                >
                    {overrideColor && (
                        <span className={`text-xs font-medium ${isLightColor ? 'text-black' : 'text-white'}`}>
                            Override
                        </span>
                    )}
                </div>
                <div className="flex-1">
                    <p className="text-lg font-bold text-white">{displayColor?.name || 'Unknown'}</p>
                    <p className="text-sm text-slate-400 font-mono">{displayColor?.hex}</p>
                    {detectedColor?.percentage && !overrideColor && (
                        <p className="text-xs text-slate-500">{detectedColor.percentage}% of image</p>
                    )}
                </div>
            </div>

            {/* Confirmation Question */}
            {!isConfirmed && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm text-amber-200">Is this the correct product color?</p>
                            <p className="text-xs text-amber-400/70 mt-1">
                                If not, select the correct color below for better AI results.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {!isConfirmed && (
                <div className="flex gap-2">
                    <button
                        onClick={handleConfirm}
                        className="flex-1 py-2 px-4 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Check className="w-4 h-4" /> Yes, correct
                    </button>
                    <button
                        onClick={() => setShowPresets(!showPresets)}
                        className="flex-1 py-2 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" /> No, change it
                    </button>
                </div>
            )}

            {/* Color Presets Grid */}
            {(showPresets || isConfirmed) && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    <p className="text-xs text-slate-400 uppercase tracking-wider">
                        {isConfirmed ? 'Change Color (Optional)' : 'Select Correct Color'}
                    </p>

                    {/* Preset Colors */}
                    <div className="grid grid-cols-7 gap-2">
                        {COLOR_PRESETS.map((preset) => (
                            <button
                                key={preset.hex}
                                onClick={() => handlePresetSelect(preset)}
                                title={preset.name}
                                className={`
                  w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 hover:shadow-lg
                  ${overrideColor?.hex === preset.hex
                                        ? 'border-primary ring-2 ring-primary/50 scale-110'
                                        : 'border-white/20 hover:border-white/40'
                                    }
                `}
                                style={{ backgroundColor: preset.hex }}
                            />
                        ))}
                    </div>

                    {/* Custom Color Picker */}
                    <div className="flex items-center gap-2 mt-3">
                        <Pipette className="w-4 h-4 text-slate-400" />
                        <input
                            type="color"
                            value={customHex || displayColor?.hex || '#808080'}
                            onChange={(e) => {
                                setCustomHex(e.target.value);
                                handleCustomColor(e.target.value);
                            }}
                            className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer"
                        />
                        <input
                            type="text"
                            placeholder="#FFFFFF"
                            value={customHex}
                            onChange={(e) => setCustomHex(e.target.value)}
                            onBlur={() => handleCustomColor(customHex)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white font-mono placeholder:text-slate-500 focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>
            )}

            {/* Reset Button */}
            {overrideColor && (
                <button
                    onClick={() => {
                        setOverrideColor(null);
                        setIsConfirmed(false);
                        setShowPresets(false);
                        onColorConfirm?.(detectedColor);
                    }}
                    className="w-full text-center text-xs text-slate-400 hover:text-white transition-colors py-2"
                >
                    ↩ Reset to detected color
                </button>
            )}
        </div>
    );
};

/**
 * Helper to determine if a color is light (for text contrast)
 */
function isLight(hex) {
    if (!hex) return true;
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

export default ColorOverrideSelector;
