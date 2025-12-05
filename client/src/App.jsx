import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Wand2,
  RotateCcw
} from 'lucide-react';

// Existing components
import ImageUpload from './components/ImageUpload';
import GenerationResult from './components/GenerationResult';
import ModelSelection from './components/ModelSelection';
import ShoeModelSelection from './components/ShoeModelSelection';
import ShoeCameraAngleSelection from './components/ShoeCameraAngleSelection';
import ShoeLightingSelection from './components/ShoeLightingSelection';
import ShoePoseSelection from './components/ShoePoseSelection';
import BackgroundSelection from './components/BackgroundSelection';
import AnimatedProgress from './components/AnimatedProgress';
import ReviewPage from './components/ReviewPage';

// New premium components
import CategoryHub, { CATEGORIES } from './components/CategoryHub';
import BagStyleSelection from './components/bags/BagStyleSelection';
import BagDisplayModeSelection from './components/bags/BagDisplayModeSelection';
import AccessoryTypeSelection from './components/accessories/AccessoryTypeSelection';
import AnimatedButton from './components/common/AnimatedButton';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// ============================================
// PROMPT CONFIGURATIONS
// ============================================

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

// ============================================
// STEP CONFIGURATIONS BY CATEGORY
// ============================================

const getCategorySteps = (category) => {
  switch (category) {
    case 'clothes':
      return ['upload', 'essentials', 'model', 'scene', 'review'];
    case 'shoes':
      return ['upload', 'essentials', 'shoeModel', 'scene', 'review'];
    case 'bags':
      return ['upload', 'essentials', 'bagStyle', 'scene', 'review'];
    case 'accessories':
      return ['upload', 'essentials', 'accessoryType', 'scene', 'review'];
    default:
      return ['category', 'upload', 'essentials', 'configure', 'review'];
  }
};

const STEP_LABELS = {
  category: 'Category',
  upload: 'Upload',
  essentials: 'Model',
  model: 'Model',
  shoeModel: 'Style',
  bagStyle: 'Style',
  accessoryType: 'Type',
  scene: 'Scene',
  review: 'Generate',
  configure: 'Configure',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function buildPersonaDescription(persona) {
  const parts = [];
  const genderMap = { 'female': 'female', 'male': 'male', 'non-binary': 'non-binary' };
  const genderText = genderMap[persona.gender] || 'female';
  parts.push(`Use a ${genderText} model`);

  const ageMap = {
    'young-adult': 'in their 20s', 'adult': 'in their 30s',
    'mature': 'in their 40s-50s', 'senior': 'in their 60s or older',
  };
  if (persona.ageRange && ageMap[persona.ageRange]) parts.push(ageMap[persona.ageRange]);

  const ethnicityMap = {
    'asian': 'East Asian ethnicity', 'south-asian': 'South Asian ethnicity',
    'black': 'Black ethnicity', 'caucasian': 'Caucasian ethnicity',
    'hispanic': 'Hispanic/Latino ethnicity', 'middle-eastern': 'Middle Eastern ethnicity',
    'tunisian': 'Tunisian ethnicity, North African features', 'mixed': 'mixed ethnicity',
  };
  if (persona.ethnicity && persona.ethnicity !== 'any' && ethnicityMap[persona.ethnicity]) {
    parts.push(`with ${ethnicityMap[persona.ethnicity]}`);
  }

  const skinToneMap = {
    'fair': 'fair skin tone', 'light': 'light skin tone', 'medium': 'medium skin tone',
    'tan': 'tan skin tone', 'deep': 'deep skin tone', 'rich': 'rich skin tone',
  };
  if (persona.skinTone && skinToneMap[persona.skinTone]) parts.push(skinToneMap[persona.skinTone]);

  if (persona.hairStyle && persona.hairColor) {
    parts.push(`${persona.hairStyle} ${persona.hairColor} hair`);
  } else if (persona.hairStyle) {
    parts.push(`${persona.hairStyle} hair`);
  }

  const bodyTypeMap = {
    'slim': 'slim build', 'athletic': 'athletic build', 'average': 'average build',
    'curvy': 'curvy build', 'plus-size': 'plus-size build',
  };
  if (persona.bodyType && bodyTypeMap[persona.bodyType]) parts.push(`and a ${bodyTypeMap[persona.bodyType]}`);

  return parts.join(', ') + '.';
}

function buildShoePersonaDescription(shoeModel) {
  if (!shoeModel) return 'Show shoes on neutral legs, photographed from mid-thigh to feet';
  return shoeModel.description + ', photographed from mid-thigh to feet';
}

function buildBagPrompt(bagStyle, displayMode) {
  const stylePrompt = bagStyle?.prompt || '';
  const modePrompt = displayMode?.prompt || '';
  return `${stylePrompt} ${modePrompt}`.trim();
}

function buildAccessoryPrompt(accessoryType, accessorySubtype) {
  const basePrompt = accessorySubtype?.prompt || accessoryType?.prompt || '';
  return basePrompt;
}

// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  // === STATE ===

  // Navigation
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [category, setCategory] = useState(null);

  // File and Generation
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Common Settings
  const [gender, setGender] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [colorPalette, setColorPalette] = useState([]);
  const [colorHex, setColorHex] = useState(null);
  const [useColorLock, setUseColorLock] = useState(true);
  const [negative, setNegative] = useState('no extra accessories, no text, no logos change, no second person');

  // Clothes-specific
  const [selectedModel, setSelectedModel] = useState(null);
  const [modelPersona, setModelPersona] = useState({
    gender: 'female', ageRange: 'adult', ethnicity: 'any',
    skinTone: 'medium', hairStyle: 'long', hairColor: 'brown', bodyType: 'average',
  });
  const [pose, setPose] = useState(POSE_PROMPTS[0].prompt);

  // Shoes-specific
  const [selectedShoeModel, setSelectedShoeModel] = useState(null);
  const [selectedShoePose, setSelectedShoePose] = useState(null);
  const [selectedCameraAngle, setSelectedCameraAngle] = useState(null);
  const [selectedLighting, setSelectedLighting] = useState(null);

  // Bags-specific
  const [bagStyle, setBagStyle] = useState(null);
  const [bagDisplayMode, setBagDisplayMode] = useState(null);

  // Accessories-specific
  const [accessoryType, setAccessoryType] = useState(null);
  const [accessorySubtype, setAccessorySubtype] = useState(null);

  // === COMPUTED VALUES ===

  const steps = useMemo(() => {
    if (!category) return ['category'];
    return getCategorySteps(category);
  }, [category]);

  const currentStep = steps[currentStepIndex];
  const totalSteps = steps.length;
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  // === EFFECTS ===

  useEffect(() => {
    if (gender) setModelPersona(prev => ({ ...prev, gender }));
  }, [gender]);

  // Reset step index when category changes
  useEffect(() => {
    if (category) {
      setCurrentStepIndex(0); // Go to first step of new category
    }
  }, [category]);

  // === HANDLERS ===

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setGeneratedResult(null);
    setError(null);
  };

  const handleColorDetected = (palette) => {
    if (Array.isArray(palette)) {
      setColorPalette(palette);
      if (palette.length > 0) {
        let bestColor = palette[0];
        const topFive = palette.slice(0, 5);
        const whiteCandidate = topFive.find(c => {
          const avgRGB = c.hex ? (parseInt(c.hex.slice(1, 3), 16) + parseInt(c.hex.slice(3, 5), 16) + parseInt(c.hex.slice(5, 7), 16)) / 3 : 0;
          return c.name === 'White' || c.name === 'Off-White' || c.name === 'Very Light Gray' ||
            (c.name === 'Light Gray' && avgRGB > 200) || avgRGB > 220;
        });
        const primaryIsGray = bestColor.name.includes('Gray') || bestColor.name === 'Charcoal' ||
          (bestColor.s && bestColor.s < 10 && bestColor.l && bestColor.l < 70);
        if (primaryIsGray && whiteCandidate && whiteCandidate.percentage >= 15) {
          bestColor = whiteCandidate;
        }
        setColorHex(bestColor.hex);
      }
    } else {
      setColorHex(palette);
      setColorPalette([]);
    }
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setCurrentStepIndex(1); // Move to upload step
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Add a product photo first.');
      return;
    }

    const variationCue = VARIATION_CUES[Math.floor(Math.random() * VARIATION_CUES.length)];
    let personaDescription = '';
    let categoryPrompt = '';

    // Build category-specific prompts
    switch (category) {
      case 'clothes':
        personaDescription = buildPersonaDescription(modelPersona);
        break;
      case 'shoes': {
        // Build comprehensive shoe photography prompt
        const posePrompt = selectedShoePose?.prompt || 'Classic standing pose, natural leg positioning';
        const anglePrompt = selectedCameraAngle?.prompt || '3/4 hero shot angle';
        const lightingPrompt = selectedLighting?.prompt || 'Professional studio lighting';
        const modelDesc = buildShoePersonaDescription(selectedShoeModel);

        personaDescription = modelDesc;
        categoryPrompt = `${posePrompt}. ${anglePrompt}. ${lightingPrompt}`;
        break;
      }
      case 'bags':
        categoryPrompt = buildBagPrompt(bagStyle, bagDisplayMode);
        personaDescription = gender === 'male' ? 'Male model' : 'Female model';
        break;
      case 'accessories':
        categoryPrompt = buildAccessoryPrompt(accessoryType, accessorySubtype);
        personaDescription = gender === 'male' ? 'Male model' : 'Female model';
        break;
    }

    // Build final prompt
    const backgroundGuard = selectedBackground ? '' : 'Keep background consistent with the style.';
    const backdropClause = selectedBackground
      ? `Backdrop: ${selectedBackground.prompt}`
      : 'Neutral studio backdrop, soft gradient, minimal props.';
    const paletteClause = colorPalette.length > 0
      ? `Product color palette: ${colorPalette.map(c => `${c.simpleName || c.name} (${c.hex})`).slice(0, 3).join(', ')}.`
      : '';
    const activeColor = colorHex;
    const colorClause = useColorLock && activeColor
      ? `Color lock: preserve exact product color ${activeColor}, no hue shift, no saturation change.`
      : '';
    const strongColorClause = (useColorLock && activeColor)
      ? `CRITICAL: The product is ${activeColor}. Maintain this color exactly.`
      : '';

    const baseCategoryPrompts = {
      clothes: 'High-quality professional fashion photography.',
      shoes: 'Professional footwear photography, focus on shoe details.',
      bags: 'Professional bag photography, highlighting design and craftsmanship.',
      accessories: 'Professional accessory photography, macro detail focus.',
    };

    const fidelityGuards = {
      clothes: `${personaDescription} Match the uploaded garment exactly (shape, silhouette, fit, color, pattern/print, logos). Do not recolor or restyle the garment. ${backgroundGuard} Photorealistic, high resolution, skin-safe lighting.`,
      shoes: `${personaDescription} Match the uploaded shoes exactly (shape, design, color, logos, details). Focus on shoe details while maintaining natural leg positioning. ${backgroundGuard} Photorealistic, high resolution.`,
      bags: `${personaDescription} ${categoryPrompt}. Match the uploaded bag exactly (shape, design, color, hardware, material). ${backgroundGuard} Photorealistic, high resolution.`,
      accessories: `${personaDescription} ${categoryPrompt}. Match the uploaded accessory exactly. ${backgroundGuard} Photorealistic, high resolution, macro detail.`,
    };

    const finalPrompt = [
      strongColorClause,
      baseCategoryPrompts[category] || 'Professional product photography.',
      category === 'clothes' ? pose : '',
      categoryPrompt,
      backdropClause,
      paletteClause,
      variationCue,
      fidelityGuards[category] || '',
      colorClause,
      negative ? `Negative: ${negative}` : '',
    ].filter(Boolean).join(' ');

    // Build form data
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('prompt', finalPrompt);
    formData.append('gender', gender || modelPersona.gender);
    formData.append('category', category);

    // Add category-specific data
    switch (category) {
      case 'clothes':
        formData.append('modelPersona', JSON.stringify(modelPersona));
        if (selectedModel) formData.append('modelId', selectedModel.id);
        break;
      case 'shoes':
        if (selectedShoeModel) formData.append('shoeModelId', selectedShoeModel.id);
        if (selectedCameraAngle) formData.append('shoeCameraAngle', selectedCameraAngle.prompt);
        if (selectedLighting) formData.append('shoeLighting', selectedLighting.prompt);
        break;
      case 'bags':
        if (bagStyle) formData.append('bagStyle', bagStyle.id);
        if (bagDisplayMode) formData.append('bagDisplayMode', bagDisplayMode.id);
        break;
      case 'accessories':
        if (accessoryType) formData.append('accessoryType', accessoryType.id);
        if (accessorySubtype) formData.append('accessorySubtype', accessorySubtype.id);
        break;
    }

    if (selectedBackground) {
      formData.append('backgroundPrompt', selectedBackground.prompt);
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedResult(null);

    try {
      const apiCall = fetch(`${API_BASE}/api/generate`, { method: 'POST', body: formData }).then(res => res.json());
      const minWait = new Promise(resolve => setTimeout(resolve, 120000));
      const [data] = await Promise.all([apiCall, minWait]);

      if (data.error) throw new Error(data.error);

      setGeneratedResult({
        imageUrl: data.imageUrl,
        downloadUrl: data.downloadUrl,
        prompt: data.prompt || finalPrompt,
        meta: data.meta,
        gender,
        category,
        colorHex: useColorLock ? activeColor : null,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const resetWizard = () => {
    setCategory(null);
    setCurrentStepIndex(0);
    setSelectedFile(null);
    setGeneratedResult(null);
    setGender(null);
    setSelectedModel(null);
    setSelectedShoeModel(null);
    setBagStyle(null);
    setBagDisplayMode(null);
    setAccessoryType(null);
    setAccessorySubtype(null);
    setSelectedBackground(null);
    setError(null);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'category': return !!category;
      case 'upload': return !!selectedFile;
      case 'essentials': return !!gender;
      case 'model': return true; // Model selection is optional
      case 'shoeModel': return true;
      case 'bagStyle': return !!bagStyle;
      case 'accessoryType': return !!accessoryType;
      case 'scene': return true; // Background is optional
      case 'review': return true;
      default: return true;
    }
  };

  // === RENDER STEP CONTENT ===

  const renderStepContent = () => {
    switch (currentStep) {
      case 'category':
        return (
          <motion.div
            key="category"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto"
          >
            <CategoryHub
              selectedCategory={category}
              onCategorySelect={handleCategorySelect}
            />
          </motion.div>
        );

      case 'upload':
        return (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Upload your {category}</h2>
              <p className="text-slate-400">Add a clear image of your product to get started</p>
            </div>
            <ImageUpload
              onFileSelect={handleFileSelect}
              isGenerating={isGenerating}
              selectedFile={selectedFile}
              onClear={() => setSelectedFile(null)}
              onColorDetected={handleColorDetected}
            />
          </motion.div>
        );

      case 'essentials':
        return (
          <motion.div
            key="essentials"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-12"
          >
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Choose the Model</h2>
              <p className="text-slate-400">Select who will showcase your {category}</p>
            </div>
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              {['female', 'male'].map((g) => (
                <motion.button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`
                    group relative p-8 rounded-3xl border-2 transition-all duration-300
                    flex flex-col items-center gap-6 overflow-hidden
                    ${gender === g
                      ? 'bg-primary/20 border-primary shadow-2xl shadow-primary/20 scale-105'
                      : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/[0.07]'
                    }
                  `}
                  whileHover={{ scale: gender === g ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`
                    w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300
                    ${gender === g ? 'bg-primary text-white' : 'bg-white/10 text-slate-400 group-hover:text-white'}
                  `}>
                    <User className="w-12 h-12" />
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-bold block mb-1">{g === 'female' ? 'Woman' : 'Man'}</span>
                    <span className="text-xs text-slate-400">{g === 'female' ? 'Female Models' : 'Male Models'}</span>
                  </div>
                  {gender === g && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-primary text-white p-1 rounded-full"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'model':
        return (
          <motion.div
            key="model"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">Choose a Model</h2>
              <p className="text-slate-400">Select a professional model for your product</p>
            </div>
            <ModelSelection
              selectedModel={selectedModel}
              onModelSelect={setSelectedModel}
              gender={gender}
            />
          </motion.div>
        );

      case 'shoeModel':
        return (
          <motion.div
            key="shoeModel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto space-y-10"
          >
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">
                Craft Your <span className="text-gradient">Perfect Shot</span>
              </h2>
              <p className="text-slate-400">Choose pose, angle, and lighting for professional footwear photography</p>
            </div>
            <div className="space-y-10">
              {/* 1. Model Pose - How they wear the shoes */}
              <ShoePoseSelection
                selectedPose={selectedShoePose}
                onPoseSelect={setSelectedShoePose}
              />

              {/* 2. Camera Angle - How we frame the shot */}
              <ShoeCameraAngleSelection
                selectedAngle={selectedCameraAngle}
                onAngleSelect={setSelectedCameraAngle}
              />

              {/* 3. Lighting & Mood - The atmosphere */}
              <ShoeLightingSelection
                selectedLighting={selectedLighting}
                onLightingSelect={setSelectedLighting}
              />

              {/* 4. Leg Style (optional reference) */}
              <ShoeModelSelection
                selectedShoeModel={selectedShoeModel}
                onShoeModelSelect={setSelectedShoeModel}
                gender={gender}
              />
            </div>
          </motion.div>
        );

      case 'bagStyle':
        return (
          <motion.div
            key="bagStyle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <BagStyleSelection
              selectedStyle={bagStyle}
              onStyleSelect={setBagStyle}
            />
            {bagStyle && (
              <BagDisplayModeSelection
                selectedMode={bagDisplayMode}
                onModeSelect={setBagDisplayMode}
              />
            )}
          </motion.div>
        );

      case 'accessoryType':
        return (
          <motion.div
            key="accessoryType"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <AccessoryTypeSelection
              selectedType={accessoryType}
              selectedSubtype={accessorySubtype}
              onTypeSelect={setAccessoryType}
              onSubtypeSelect={setAccessorySubtype}
            />
          </motion.div>
        );

      case 'scene':
        return (
          <motion.div
            key="scene"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-6xl mx-auto space-y-8"
          >
            <div className="text-center mb-4">
              <h2 className="text-3xl font-bold mb-2">Set the Scene</h2>
              <p className="text-slate-400">Choose a background to match your brand</p>
            </div>
            <BackgroundSelection
              selectedBackground={selectedBackground}
              onBackgroundSelect={setSelectedBackground}
            />
          </motion.div>
        );

      case 'review':
        return (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ReviewPage
              selectedFile={selectedFile}
              selectedModel={selectedModel}
              selectedShoeModel={selectedShoeModel}
              selectedCameraAngle={selectedCameraAngle}
              selectedLighting={selectedLighting}
              selectedBackground={selectedBackground}
              category={category}
              gender={gender}
              bagStyle={bagStyle}
              bagDisplayMode={bagDisplayMode}
              accessoryType={accessoryType}
              accessorySubtype={accessorySubtype}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </motion.div>
        );

      default:
        return null;
    }
  };

  // === MAIN RENDER ===

  return (
    <div className="min-h-screen bg-dark-deep text-slate-50 selection:bg-primary/25 relative overflow-hidden font-sans">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-30%] left-[-15%] w-[60%] h-[60%] bg-primary/8 rounded-full blur-[150px] animate-float" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/8 rounded-full blur-[130px]" style={{ animationDelay: '1s' }} />
        {category && (
          <motion.div
            className={`absolute top-1/3 right-1/4 w-[40%] h-[40%] rounded-full blur-[120px] opacity-30`}
            style={{
              backgroundColor: category === 'clothes' ? 'rgb(139, 92, 246)' :
                category === 'shoes' ? 'rgb(249, 115, 22)' :
                  category === 'bags' ? 'rgb(236, 72, 153)' :
                    'rgb(20, 184, 166)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1 }}
          />
        )}
      </div>

      {/* Full Screen Progress Overlay */}
      <AnimatedProgress isGenerating={isGenerating} />

      <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 lg:mb-12">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-11 h-11 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Product<span className="text-gradient">Studio</span>
                <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-slate-400 font-normal ml-2">PRO</span>
              </h1>
            </div>
          </div>

          {/* Step Progress */}
          {category && !generatedResult && (
            <div className="hidden md:flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    className={`
                      w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                      ${index === currentStepIndex
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110'
                        : index < currentStepIndex
                          ? 'bg-primary/20 text-primary'
                          : 'bg-white/5 text-slate-600'
                      }
                    `}
                    initial={false}
                    animate={{ scale: index === currentStepIndex ? 1.1 : 1 }}
                  >
                    {index < currentStepIndex ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-1.5 rounded-full ${index < currentStepIndex ? 'bg-primary/30' : 'bg-white/5'}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Reset Button */}
          {category && (
            <motion.button
              onClick={resetWizard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Start Over</span>
            </motion.button>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 relative">
          <AnimatePresence mode="wait">
            {generatedResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Generation Result</h2>
                  <AnimatedButton onClick={resetWizard} variant="secondary" icon={RotateCcw}>
                    Create Another
                  </AnimatedButton>
                </div>
                <GenerationResult result={generatedResult} category={category} />
              </motion.div>
            ) : (
              renderStepContent()
            )}
          </AnimatePresence>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center"
            >
              {error}
            </motion.div>
          )}
        </main>

        {/* Navigation Footer */}
        {!generatedResult && currentStep !== 'category' && (
          <motion.footer
            className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatedButton
              onClick={prevStep}
              disabled={currentStepIndex === 0}
              variant="ghost"
              icon={ChevronLeft}
              className={currentStepIndex === 0 ? 'opacity-0 pointer-events-none' : ''}
            >
              Back
            </AnimatedButton>

            {currentStep !== 'review' && (
              <AnimatedButton
                onClick={nextStep}
                disabled={!canProceed()}
                variant="primary"
                icon={ChevronRight}
                iconPosition="right"
                glow
              >
                {currentStep === 'scene' ? 'Review & Generate' : 'Next Step'}
              </AnimatedButton>
            )}

            {currentStep === 'review' && (
              <AnimatedButton
                onClick={handleGenerate}
                disabled={isGenerating}
                variant={category}
                icon={Wand2}
                size="lg"
                glow
              >
                {isGenerating ? 'Generating...' : 'Generate Magic'}
              </AnimatedButton>
            )}
          </motion.footer>
        )}
      </div>
    </div>
  );
}

export default App;
