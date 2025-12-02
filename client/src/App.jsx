import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import GenerationResult from './components/GenerationResult';
import ModelPersonaSelector from './components/ModelPersonaSelector';
import ModelSelection from './components/ModelSelection';
import BackgroundSelection from './components/BackgroundSelection';
import AnimatedProgress from './components/AnimatedProgress';
import { Sparkles, Wand2, Clock3, CheckCircle2, Loader2, ChevronRight, ChevronLeft, User, Shirt, Camera } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const POSE_PROMPTS = [
  { label: 'Standing', key: 'standing', prompt: 'Full-length standing pose, relaxed weight shift, arms natural, outfit fully visible.' },
  { label: 'Walking', key: 'walking', prompt: 'Mid-step walking pose, gentle arm swing, natural motion blur avoided, outfit centered.' },
  { label: 'Seated/leaning', key: 'seated', prompt: 'Seated or lightly leaning pose with straight posture, garment drape visible.' },
  { label: 'Dynamic', key: 'dynamic', prompt: 'Dynamic half-turn with confident stance, torso rotation, outfit front still clear.' },
];

const SHOE_POSE_PROMPTS = [
  { label: 'Low Angle Walking', key: 'shoe_walking', prompt: 'Low angle 30-45 degrees from ground, model walking naturally, shoe sole and upper both visible, professional product photography.' },
  { label: 'Floating/Jump', key: 'shoe_jump', prompt: 'Shoes in mid-air jump pose, dynamic energy, sole visible, clean background, freeze-frame motion.' },
  { label: 'Seated (Feet Focus)', key: 'shoe_seated', prompt: 'Seated position with feet extended forward, shoes as focal point, relaxed pose, direct camera angle on footwear.' },
  { label: 'Top Down', key: 'shoe_topdown', prompt: 'Top-down overhead view, feet together or slightly apart, shoes facing camera, flat lay perspective.' },
];

const VARIATION_CUES = [
  'Use a fresh pose variation: slight head tilt, relaxed weight shift, and a subtle hand gesture.',
  'Change the stance: a gentle walk mid-step, natural arm swing, and soft gaze off-camera.',
  'Try a seated or leaning pose with natural posture, keeping the garment fully visible.',
  'Vary the camera: slightly lower angle for presence, medium framing, crisp focus on the outfit.',
  'Add dynamic energy: a light turn of the torso, one foot forward, confident expression.',
];

/**
 * Build a descriptive model persona string from modelPersona object
 */
function buildPersonaDescription(persona) {
  const parts = [];

  // Gender
  const genderMap = {
    'female': 'female',
    'male': 'male',
    'non-binary': 'non-binary',
  };
  const genderText = genderMap[persona.gender] || 'female';
  parts.push(`Use a ${genderText} model`);

  // Age range
  const ageMap = {
    'young-adult': 'in their 20s',
    'adult': 'in their 30s',
    'mature': 'in their 40s-50s',
    'senior': 'in their 60s or older',
  };
  if (persona.ageRange && ageMap[persona.ageRange]) {
    parts.push(ageMap[persona.ageRange]);
  }

  // Ethnicity (only if not "any")
  const ethnicityMap = {
    'asian': 'East Asian ethnicity',
    'south-asian': 'South Asian ethnicity',
    'black': 'Black ethnicity',
    'caucasian': 'Caucasian ethnicity',
    'hispanic': 'Hispanic/Latino ethnicity',
    'middle-eastern': 'Middle Eastern ethnicity',
    'tunisian': 'Tunisian ethnicity, North African features',
    'mixed': 'mixed ethnicity',

  };
  if (persona.ethnicity && persona.ethnicity !== 'any' && ethnicityMap[persona.ethnicity]) {
    parts.push(`with ${ethnicityMap[persona.ethnicity]}`);
  }

  // Skin tone
  const skinToneMap = {
    'fair': 'fair skin tone',
    'light': 'light skin tone',
    'medium': 'medium skin tone',
    'tan': 'tan skin tone',
    'deep': 'deep skin tone',
    'rich': 'rich skin tone',
  };
  if (persona.skinTone && skinToneMap[persona.skinTone]) {
    parts.push(skinToneMap[persona.skinTone]);
  }

  // Hair style and color
  if (persona.hairStyle && persona.hairColor) {
    parts.push(`${persona.hairStyle} ${persona.hairColor} hair`);
  } else if (persona.hairStyle) {
    parts.push(`${persona.hairStyle} hair`);
  }

  // Body type
  const bodyTypeMap = {
    'slim': 'slim build',
    'athletic': 'athletic build',
    'average': 'average build',
    'curvy': 'curvy build',
    'plus-size': 'plus-size build',
  };
  if (persona.bodyType && bodyTypeMap[persona.bodyType]) {
    parts.push(`and a ${bodyTypeMap[persona.bodyType]}`);
  }

  return parts.join(', ') + '.';
}

function App() {
  // Wizard State
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // App State
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Waiting for upload');
  const [error, setError] = useState(null);

  // Configuration State
  const [category, setCategory] = useState('clothes');
  const [gender, setGender] = useState(null); // Explicit gender selection

  // Model State
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelPersona, setModelPersona] = useState({
    gender: 'female',
    ageRange: 'adult',
    ethnicity: 'any',
    skinTone: 'medium',
    hairStyle: 'long',
    hairColor: 'brown',
    bodyType: 'average',
  });

  // Scene State
  const [pose, setPose] = useState(POSE_PROMPTS[0].prompt);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [colorPalette, setColorPalette] = useState([]);
  const [colorHex, setColorHex] = useState(null);
  const [manualColor, setManualColor] = useState(null); // New: Manual color override
  const [useColorLock, setUseColorLock] = useState(true);
  const [negative, setNegative] = useState('no extra accessories, no text, no logos change, no second person');

  // Sync gender selection with persona
  useEffect(() => {
    if (gender) {
      setModelPersona(prev => ({ ...prev, gender }));
    }
  }, [gender]);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setGeneratedResult(null);
    setError(null);
    setManualColor(null); // Reset manual color on new file
    // Auto advance to next step after short delay if file is valid
    if (file) {
      setTimeout(() => setCurrentStep(2), 500);
    }
  };

  const handleColorDetected = (palette) => {
    if (Array.isArray(palette)) {
      setColorPalette(palette);
      if (palette.length > 0) {
        setColorHex(palette[0].hex);
      }
    } else {
      setColorHex(palette);
      setColorPalette([]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Add a garment photo first.');
      return;
    }

    const variationCue = VARIATION_CUES[Math.floor(Math.random() * VARIATION_CUES.length)];
    const personaDescription = buildPersonaDescription(modelPersona);

    // Improved Fidelity Guard: Only mention background consistency if NO background is selected
    const backgroundGuard = selectedBackground ? '' : 'Keep background consistent with the style.';
    const fidelityGuard = `${personaDescription} Match the uploaded garment exactly (shape, silhouette, fit, color, pattern/print, logos). Do not recolor or restyle the garment. Do not add or remove accessories, props, jewelry, text, or extra garments. ${backgroundGuard} Photorealistic, high resolution, skin-safe lighting.`;

    // Build backdrop clause
    const backdropClause = selectedBackground
      ? `Backdrop: ${selectedBackground.prompt}`
      : 'Neutral studio backdrop, soft gradient, minimal props.';

    // Build color palette context
    const paletteClause =
      colorPalette.length > 0
        ? `Garment color palette: ${colorPalette.map(c => `${c.simpleName || c.name} (${c.hex})`).slice(0, 3).join(', ')}.`
        : '';

    // Use manual color if set, otherwise detected color
    const activeColor = manualColor || colorHex;

    const colorClause =
      useColorLock && activeColor
        ? `Color lock: preserve exact garment color ${activeColor}, no hue shift, no saturation change.`
        : '';

    // Strong color enforcement
    const dominantColorName = manualColor ? 'the selected color' : (colorPalette.length > 0 ? colorPalette[0].name : '');
    const strongColorClause = (useColorLock && activeColor)
      ? `CRITICAL: The garment is ${activeColor}. Maintain this color exactly.`
      : '';

    const finalPrompt = [
      strongColorClause,
      'High-quality professional fashion photography.',
      pose,
      backdropClause,
      paletteClause,
      variationCue,
      fidelityGuard,
      colorClause,
      negative ? `Negative: ${negative}` : '',
    ].join(' ');

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('prompt', finalPrompt);
    formData.append('gender', gender || modelPersona.gender);
    formData.append('modelPersona', JSON.stringify(modelPersona));

    if (selectedModel) {
      formData.append('modelId', selectedModel.id);
    }
    formData.append('category', category);

    if (selectedBackground) {
      formData.append('backgroundPrompt', selectedBackground.prompt);
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedResult(null);
    setStatusMessage('Uploading & starting the render...');

    try {
      const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Generation failed');
      }

      setGeneratedResult({
        imageUrl: data.imageUrl,
        downloadUrl: data.downloadUrl,
        prompt: data.prompt || finalPrompt,
        meta: data.meta,
        gender,
        pose,
        negative,
        colorHex: useColorLock ? activeColor : null,
      });
      setStatusMessage('Render finished - here is your model look.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate image. Please try again.');
      setStatusMessage('Something went wrong.');
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Upload
        return (
          <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Start with your photo</h2>
              <p className="text-slate-400">Upload a clear image of the garment you want to showcase.</p>
            </div>
            <ImageUpload
              onFileSelect={handleFileSelect}
              isGenerating={isGenerating}
              selectedFile={selectedFile}
              onClear={() => setSelectedFile(null)}
              onColorDetected={handleColorDetected}
            />
          </div>
        );
      case 2: // Essentials (Gender & Category)
        return (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Who is this for?</h2>
              <p className="text-slate-400">Select the target audience and product type.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Gender Selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center text-slate-300">Target Model</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setGender('female')}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 ${gender === 'female'
                        ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10'
                      }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${gender === 'female' ? 'bg-primary text-white' : 'bg-white/10 text-slate-400'}`}>
                      <User className="w-8 h-8" />
                    </div>
                    <span className="text-lg font-medium">Woman</span>
                  </button>
                  <button
                    onClick={() => setGender('male')}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 ${gender === 'male'
                        ? 'bg-primary/20 border-primary shadow-lg shadow-primary/20 scale-105'
                        : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10'
                      }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${gender === 'male' ? 'bg-primary text-white' : 'bg-white/10 text-slate-400'}`}>
                      <User className="w-8 h-8" />
                    </div>
                    <span className="text-lg font-medium">Man</span>
                  </button>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-center text-slate-300">Product Type</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCategory('clothes')}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 ${category === 'clothes'
                        ? 'bg-secondary/20 border-secondary shadow-lg shadow-secondary/20 scale-105'
                        : 'bg-white/5 border-white/10 hover:border-secondary/50 hover:bg-white/10'
                      }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category === 'clothes' ? 'bg-secondary text-white' : 'bg-white/10 text-slate-400'}`}>
                      <Shirt className="w-8 h-8" />
                    </div>
                    <span className="text-lg font-medium">Clothes</span>
                  </button>
                  <button
                    onClick={() => setCategory('shoes')}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-4 ${category === 'shoes'
                        ? 'bg-secondary/20 border-secondary shadow-lg shadow-secondary/20 scale-105'
                        : 'bg-white/5 border-white/10 hover:border-secondary/50 hover:bg-white/10'
                      }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${category === 'shoes' ? 'bg-secondary text-white' : 'bg-white/10 text-slate-400'}`}>
                      <div className="rotate-[-45deg]"><Shirt className="w-8 h-8" /></div> {/* Placeholder for Shoe icon */}
                    </div>
                    <span className="text-lg font-medium">Shoes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Model
        return (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">Choose your Model</h2>
              <p className="text-slate-400">Select a professional model or customize the look.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ModelSelection
                  selectedModel={selectedModel}
                  onModelSelect={setSelectedModel}
                  gender={gender}
                />
              </div>
              <div className="space-y-6">
                <div className="glass-panel p-6 border-l-4 border-primary">
                  <h3 className="text-lg font-bold mb-2">Custom Persona</h3>
                  <p className="text-sm text-slate-400 mb-4">Or define specific traits for a unique AI model.</p>
                  <ModelPersonaSelector
                    modelPersona={modelPersona}
                    onChange={setModelPersona}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 4: // Scene
        return (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">Set the Scene</h2>
              <p className="text-slate-400">Choose a background and pose to match your brand.</p>
            </div>

            <div className="space-y-8">
              <BackgroundSelection
                selectedBackground={selectedBackground}
                onBackgroundSelect={setSelectedBackground}
              />

              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Select Pose
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(category === 'shoes' ? SHOE_POSE_PROMPTS : POSE_PROMPTS).map((item) => {
                    const selected = pose === item.prompt;
                    const thumb = new URL(`./assets/pose-${item.key}.svg`, import.meta.url).href;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setPose(item.prompt)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border transition-all ${selected
                          ? 'bg-primary/15 border-primary/50 text-white shadow-primary/30 shadow-lg scale-105'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-primary/40 hover:bg-white/10'
                          }`}
                      >
                        <img
                          src={thumb}
                          alt={item.label}
                          className="w-16 h-16 opacity-90"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <span className="text-sm font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      case 5: // Generate
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Ready to Render</h2>
              <p className="text-slate-400">Review your choices and generate the final image.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-panel p-6 space-y-6">
                <h3 className="text-xl font-semibold border-b border-white/10 pb-4">Summary</h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Target</span>
                    <span className="font-medium capitalize">{gender || 'Not specified'} / {category}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Model</span>
                    <span className="font-medium">
                      {selectedModel
                        ? (typeof selectedModel.name === 'object' ? selectedModel.name.en : selectedModel.name)
                        : 'Custom Persona'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Background</span>
                    <span className="font-medium">
                      {selectedBackground
                        ? (typeof selectedBackground.name === 'object' ? selectedBackground.name.en : selectedBackground.name)
                        : 'Studio Neutral'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Color Lock</span>
                    <span className={`font-medium ${useColorLock ? 'text-green-400' : 'text-slate-500'}`}>{useColorLock ? 'Active' : 'Disabled'}</span>
                  </div>
                </div>

                {/* Color Override Section */}
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-300">Garment Color</p>
                    {manualColor && (
                      <button
                        onClick={() => setManualColor(null)}
                        className="text-xs text-primary hover:text-primary/80"
                      >
                        Reset to detected
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
                    <div className="w-10 h-10 rounded-full border border-white/20 shadow-inner" style={{ background: manualColor || colorHex || '#ccc' }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {manualColor ? 'Manual Override' : 'Detected Color'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {manualColor || colorHex || 'None'}
                      </p>
                    </div>

                    {/* Color Override Dropdown */}
                    <select
                      className="bg-black/40 border border-white/10 rounded-lg text-xs py-1 px-2 text-slate-300 focus:outline-none focus:border-primary"
                      onChange={(e) => setManualColor(e.target.value)}
                      value={manualColor || ''}
                    >
                      <option value="">Wrong color?</option>
                      <option value="White">Force White</option>
                      <option value="Black">Force Black</option>
                      <option value="Red">Force Red</option>
                      <option value="Blue">Force Blue</option>
                      <option value="Green">Force Green</option>
                      <option value="Yellow">Force Yellow</option>
                      <option value="Purple">Force Purple</option>
                      <option value="Pink">Force Pink</option>
                      <option value="Orange">Force Orange</option>
                      <option value="Brown">Force Brown</option>
                      <option value="Gray">Force Gray</option>
                      <option value="Beige">Force Beige</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-6">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full py-6 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isGenerating ? <Loader2 className="w-8 h-8 animate-spin" /> : <Wand2 className="w-8 h-8" />}
                  {isGenerating ? 'Rendering...' : 'Generate Now'}
                </button>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl text-sm text-center">
                    {error}
                  </div>
                )}

                <p className="text-center text-sm text-slate-500">
                  {statusMessage}
                </p>
              </div>
            </div>

            {/* Result Display */}
            <div className="mt-8">
              <AnimatedProgress isGenerating={isGenerating && !generatedResult} />
              <GenerationResult result={generatedResult} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary/25 relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[55%] h-[55%] bg-primary/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[45%] h-[45%] bg-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Clothes<span className="text-primary">2</span>Model <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-slate-400 font-normal ml-2">PRO</span>
            </h1>
          </div>

          {/* Stepper */}
          <div className="hidden md:flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === currentStep
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                      : step < currentStep
                        ? 'bg-primary/20 text-primary'
                        : 'bg-white/5 text-slate-600'
                    }`}
                >
                  {step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step}
                </div>
                {step < 5 && (
                  <div className={`w-8 h-1 mx-2 rounded-full ${step < currentStep ? 'bg-primary/30' : 'bg-white/5'}`} />
                )}
              </div>
            ))}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 relative">
          {renderStepContent()}
        </main>

        {/* Navigation Footer */}
        <footer className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${currentStep === 1
                ? 'opacity-0 pointer-events-none'
                : 'hover:bg-white/5 text-slate-400 hover:text-white'
              }`}
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>

          {currentStep < totalSteps && (
            <button
              onClick={nextStep}
              disabled={currentStep === 1 && !selectedFile} // Block next on step 1 if no file
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

export default App;
