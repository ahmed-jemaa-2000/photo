import React, { useState, useEffect } from 'react';
import ImageUpload from './components/ImageUpload';
import GenerationResult from './components/GenerationResult';
import ModelPersonaSelector from './components/ModelPersonaSelector';
import ModelSelection from './components/ModelSelection';
import ShoeModelSelection from './components/ShoeModelSelection';
import ShoeCameraAngleSelection from './components/ShoeCameraAngleSelection';
import ShoeLightingSelection from './components/ShoeLightingSelection';
import BackgroundSelection from './components/BackgroundSelection';
import AnimatedProgress from './components/AnimatedProgress';
import ReviewPage from './components/ReviewPage';
import { Sparkles, CheckCircle2, ChevronRight, ChevronLeft, User, Shirt, Footprints } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const POSE_PROMPTS = [
  { label: 'Standing', key: 'standing', prompt: 'Full-length standing pose, relaxed weight shift, arms natural, outfit fully visible.' },
  { label: 'Walking', key: 'walking', prompt: 'Mid-step walking pose, gentle arm swing, natural motion blur avoided, outfit centered.' },
  { label: 'Seated/leaning', key: 'seated', prompt: 'Seated or lightly leaning pose with straight posture, garment drape visible.' },
  { label: 'Dynamic', key: 'dynamic', prompt: 'Dynamic half-turn with confident stance, torso rotation, outfit front still clear.' },
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

/**
 * Build a descriptive shoe persona string from shoe model object
 * Simplified approach - just use the description from the shoe model
 */
function buildShoePersonaDescription(shoeModel) {
  if (!shoeModel) {
    return 'Show shoes on neutral legs, photographed from mid-thigh to feet';
  }

  // Use the description from the shoe model configuration
  return shoeModel.description + ', photographed from mid-thigh to feet';
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
  const [category, setCategory] = useState(null); // Force selection
  const [gender, setGender] = useState(null); // Explicit gender selection

  // Model State (for clothes)
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

  // Shoe Model State (for shoes)
  const [selectedShoeModel, setSelectedShoeModel] = useState(null);

  // Shoe Camera Angle and Lighting State (for shoes)
  const [selectedCameraAngle, setSelectedCameraAngle] = useState(null);
  const [selectedLighting, setSelectedLighting] = useState(null);

  // Scene State
  const [pose, setPose] = useState(POSE_PROMPTS[0].prompt);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [colorPalette, setColorPalette] = useState([]);
  const [colorHex, setColorHex] = useState(null);

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

    // Auto advance to next step after short delay if file is valid
    if (file) {
      setTimeout(() => setCurrentStep(2), 500);
    }
  };

  const handleColorDetected = (palette) => {
    if (Array.isArray(palette)) {
      setColorPalette(palette);
      if (palette.length > 0) {
        // Smart Color Selection:
        // If the top color is Gray/Dark Gray, but we have a White/Off-White candidate in the top 5,
        // prefer the lighter color as it's likely the true garment color (ignoring shadows).
        let bestColor = palette[0];

        // Enhanced Smart Override - Check top 5 colors instead of 3
        const topFive = palette.slice(0, 5);

        // Find white candidate with explicit RGB brightness check
        const whiteCandidate = topFive.find(c => {
          const avgRGB = c.hex ? (parseInt(c.hex.slice(1, 3), 16) + parseInt(c.hex.slice(3, 5), 16) + parseInt(c.hex.slice(5, 7), 16)) / 3 : 0;
          return c.name === 'White' ||
            c.name === 'Off-White' ||
            c.name === 'Very Light Gray' ||
            (c.name === 'Light Gray' && avgRGB > 200) ||  // Bright light gray is actually white
            avgRGB > 220;  // Any very bright color
        });

        // Check if primary is gray/desaturated
        const primaryIsGray = bestColor.name.includes('Gray') ||
          bestColor.name === 'Charcoal' ||
          (bestColor.s && bestColor.s < 10 && bestColor.l && bestColor.l < 70);  // Low sat, not bright

        if (primaryIsGray && whiteCandidate && whiteCandidate.percentage >= 15) {
          console.log('✅ Smart Override: Detected gray (#' + bestColor.hex + '), replacing with white candidate:', whiteCandidate);
          bestColor = whiteCandidate;
        }

        setColorHex(bestColor.hex);
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

    // Use appropriate persona builder based on category
    const personaDescription = category === 'shoes'
      ? buildShoePersonaDescription(selectedShoeModel)
      : buildPersonaDescription(modelPersona);

    // Improved Fidelity Guard: Only mention background consistency if NO background is selected
    const backgroundGuard = selectedBackground ? '' : 'Keep background consistent with the style.';

    // Adjust fidelity guard based on category
    const fidelityGuard = category === 'shoes'
      ? `${personaDescription} Match the uploaded shoes exactly (shape, design, color, logos, details). Do not recolor or restyle the shoes. Focus on shoe details while maintaining natural leg positioning. ${backgroundGuard} Photorealistic, high resolution, natural lighting.`
      : `${personaDescription} Match the uploaded garment exactly (shape, silhouette, fit, color, pattern/print, logos). Do not recolor or restyle the garment. Do not add or remove accessories, props, jewelry, text, or extra garments. ${backgroundGuard} Photorealistic, high resolution, skin-safe lighting.`;

    // Build backdrop clause
    const backdropClause = selectedBackground
      ? `Backdrop: ${selectedBackground.prompt}`
      : 'Neutral studio backdrop, soft gradient, minimal props.';

    // Build color palette context
    const paletteClause =
      colorPalette.length > 0
        ? `Garment color palette: ${colorPalette.map(c => `${c.simpleName || c.name} (${c.hex})`).slice(0, 3).join(', ')}.`
        : '';

    // Use detected color
    const activeColor = colorHex;

    const colorClause =
      useColorLock && activeColor
        ? `Color lock: preserve exact garment color ${activeColor}, no hue shift, no saturation change.`
        : '';

    // Strong color enforcement
    const dominantColorName = colorPalette.length > 0 ? colorPalette[0].name : '';
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
    formData.append('category', category);

    // Handle model selection based on category
    if (category === 'shoes') {
      if (selectedShoeModel) {
        formData.append('shoeModelId', selectedShoeModel.id);
      }
      // Add camera angle and lighting for shoes
      if (selectedCameraAngle) {
        formData.append('shoeCameraAngle', selectedCameraAngle.prompt);
      }
      if (selectedLighting) {
        formData.append('shoeLighting', selectedLighting.prompt);
      }
    } else {
      formData.append('modelPersona', JSON.stringify(modelPersona));
      if (selectedModel) {
        formData.append('modelId', selectedModel.id);
      }
    }

    if (selectedBackground) {
      formData.append('backgroundPrompt', selectedBackground.prompt);
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedResult(null);
    setStatusMessage('Uploading & starting the render...');

    try {
      // Create a promise for the API call
      const apiCall = fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        body: formData,
      }).then(res => res.json());

      // Create a promise for the minimum wait time (2 minutes)
      const minWait = new Promise(resolve => setTimeout(resolve, 120000));

      // Wait for both
      const [data] = await Promise.all([apiCall, minWait]);

      if (data.error) {
        throw new Error(data.error);
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
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Refine your Vision</h2>
              <p className="text-slate-400">First, select the product type, then choose your target model.</p>
            </div>

            <div className="space-y-12">
              {/* 1. Category Selection */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-center text-slate-200 flex items-center justify-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">1</span>
                  Select Product Type
                </h3>
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <button
                    onClick={() => setCategory('clothes')}
                    className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-6 overflow-hidden ${category === 'clothes'
                      ? 'bg-secondary/20 border-secondary shadow-2xl shadow-secondary/20 scale-105'
                      : 'bg-white/5 border-white/10 hover:border-secondary/50 hover:bg-white/10 hover:scale-[1.02]'
                      }`}
                  >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${category === 'clothes' ? 'bg-secondary text-white' : 'bg-white/10 text-slate-400'}`}>
                      <Shirt className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold block mb-1">Clothes</span>
                      <span className="text-xs text-slate-400">T-shirts, Dresses, Jackets</span>
                    </div>
                    {category === 'clothes' && (
                      <div className="absolute top-4 right-4 bg-secondary text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setCategory('shoes')}
                    className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-6 overflow-hidden ${category === 'shoes'
                      ? 'bg-secondary/20 border-secondary shadow-2xl shadow-secondary/20 scale-105'
                      : 'bg-white/5 border-white/10 hover:border-secondary/50 hover:bg-white/10 hover:scale-[1.02]'
                      }`}
                  >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${category === 'shoes' ? 'bg-secondary text-white' : 'bg-white/10 text-slate-400'}`}>
                      <Footprints className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold block mb-1">Shoes</span>
                      <span className="text-xs text-slate-400">Sneakers, Boots, Heels</span>
                    </div>
                    {category === 'shoes' && (
                      <div className="absolute top-4 right-4 bg-secondary text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* 2. Gender Selection (Revealed after Category) */}
              <div className={`space-y-6 transition-all duration-700 ${category ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none blur-sm'}`}>
                <h3 className="text-xl font-semibold text-center text-slate-200 flex items-center justify-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">2</span>
                  Select Target Model
                </h3>
                <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <button
                    onClick={() => setGender('female')}
                    className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-6 overflow-hidden ${gender === 'female'
                      ? 'bg-primary/20 border-primary shadow-2xl shadow-primary/20 scale-105'
                      : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10 hover:scale-[1.02]'
                      }`}
                  >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${gender === 'female' ? 'bg-primary text-white' : 'bg-white/10 text-slate-400'}`}>
                      <User className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold block mb-1">Woman</span>
                      <span className="text-xs text-slate-400">Female Models</span>
                    </div>
                    {gender === 'female' && (
                      <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setGender('male')}
                    className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-6 overflow-hidden ${gender === 'male'
                      ? 'bg-primary/20 border-primary shadow-2xl shadow-primary/20 scale-105'
                      : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10 hover:scale-[1.02]'
                      }`}
                  >
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${gender === 'male' ? 'bg-primary text-white' : 'bg-white/10 text-slate-400'}`}>
                      <User className="w-12 h-12" />
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold block mb-1">Man</span>
                      <span className="text-xs text-slate-400">Male Models</span>
                    </div>
                    {gender === 'male' && (
                      <div className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full shadow-lg animate-in zoom-in duration-300">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Model
        return (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">
                {category === 'shoes' ? 'Choose Leg Style' : 'Choose a Model'}
              </h2>
              <p className="text-slate-400">
                {category === 'shoes'
                  ? 'Select outfit style for your shoe photography'
                  : 'Select a professional model for your product'}
              </p>
            </div>

            {category === 'shoes' ? (
              <div className="space-y-8">
                <ShoeModelSelection
                  selectedShoeModel={selectedShoeModel}
                  onShoeModelSelect={setSelectedShoeModel}
                  gender={gender}
                />

                <ShoeCameraAngleSelection
                  selectedAngle={selectedCameraAngle}
                  onAngleSelect={setSelectedCameraAngle}
                />

                <ShoeLightingSelection
                  selectedLighting={selectedLighting}
                  onLightingSelect={setSelectedLighting}
                />
              </div>
            ) : (
              <ModelSelection
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
                gender={gender}
              />
            )}
          </div>
        );
      case 4: // Scene
        return (
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">Set the Scene</h2>
              <p className="text-slate-400">Choose a background to match your brand.</p>
            </div>

            <BackgroundSelection
              selectedBackground={selectedBackground}
              onBackgroundSelect={setSelectedBackground}
            />
          </div>
        );
      case 5: // Generate / Review
        return (
          <ReviewPage
            selectedFile={selectedFile}
            selectedModel={selectedModel}
            selectedShoeModel={selectedShoeModel}
            selectedCameraAngle={selectedCameraAngle}
            selectedLighting={selectedLighting}
            selectedBackground={selectedBackground}
            category={category}
            gender={gender}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
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

      {/* Full Screen Progress Overlay */}
      <AnimatedProgress isGenerating={isGenerating} />

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
          {generatedResult ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Generation Result</h2>
                <button
                  onClick={() => setGeneratedResult(null)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Create Another
                </button>
              </div>
              <GenerationResult result={generatedResult} />
            </div>
          ) : (
            renderStepContent()
          )}
        </main>

        {/* Navigation Footer */}
        {!generatedResult && (
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
                disabled={(currentStep === 1 && !selectedFile) || (currentStep === 2 && (!category || !gender))}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all shadow-lg shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}

export default App;
