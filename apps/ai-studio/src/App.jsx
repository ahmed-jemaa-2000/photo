import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Wand2,
  RotateCcw,
  ArrowLeft,
  ExternalLink,
  Loader2
} from 'lucide-react';

// Code-split large components for faster initial load
const GenerationResult = lazy(() => import('./components/GenerationResult'));
const ReviewPage = lazy(() => import('./components/ReviewPage'));
const ModelSelection = lazy(() => import('./components/ModelSelection'));

// Existing components (small enough to load immediately)
import ImageUpload from './components/ImageUpload';
import ShoeModelSelection from './components/ShoeModelSelection';
import ShoePoseSelection, { SHOE_POSES } from './components/ShoePoseSelection';
import ImageStyleSelection from './components/ImageStyleSelection';
import BodySizeSelection, { BODY_SIZES } from './components/BodySizeSelection';

// New premium components
import CategoryHub, { CATEGORIES } from './components/CategoryHub';
import BagStyleSelection from './components/bags/BagStyleSelection';
import BagDisplayModeSelection from './components/bags/BagDisplayModeSelection';
import BagCameraAngleSelection, { BAG_CAMERA_ANGLES } from './components/bags/BagCameraAngleSelection';
import BagLightingSelection, { BAG_LIGHTING_OPTIONS } from './components/bags/BagLightingSelection';
import AccessoryTypeSelection from './components/accessories/AccessoryTypeSelection';
import AccessoryShotTypeSelection, { ACCESSORY_SHOT_TYPES } from './components/accessories/AccessoryShotTypeSelection';
import AccessoryLightingSelection, { ACCESSORY_LIGHTING_OPTIONS } from './components/accessories/AccessoryLightingSelection';
import AnimatedButton from './components/common/AnimatedButton';
import AspectRatioSelector, { ASPECT_RATIOS } from './components/AspectRatioSelector';

// Enhanced UX components
import GenerationProgressOverlay from './components/GenerationProgressOverlay';
import SuccessCelebration from './components/SuccessCelebration';
import WelcomeOnboarding from './components/WelcomeOnboarding';
import { useSwipeNavigation } from './hooks/useSwipeNavigation';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import CreditBadge from './components/CreditBadge';
import { useCredits } from './hooks/useCredits';
import { useProductFromUrl } from './hooks/useProductFromUrl';
import SaveToProductModal from './components/SaveToProductModal';
import LowCreditsToast from './components/LowCreditsToast';
import ColorOverrideSelector from './components/ColorOverrideSelector';
import SuspenseFallback from './components/SuspenseFallback';

// Config and helpers
import {
  POSE_PROMPTS,
  VARIATION_CUES,
  getCategorySteps,
  STEP_LABELS,
  buildPersonaDescription,
  buildShoePersonaDescription,
  buildBagPrompt,
  buildAccessoryPrompt,
} from './config/appConfig';
import { fetchWithRetry } from './utils/apiUtils';

// Environment URLs
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL ||
  (import.meta.env.PROD ? 'https://dashboard.brandili.shop' : 'http://localhost:3000/dashboard');


// ============================================
// MAIN APP COMPONENT
// ============================================

function App() {
  // === CREDITS ===
  const { credits, loading: creditsLoading, error: creditsError, updateCredits, authToken } = useCredits();

  // === PRODUCT FROM URL (Dashboard Integration) ===
  const { productData, loading: productLoading } = useProductFromUrl();

  // === STATE ===

  // Navigation
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [category, setCategory] = useState(null);

  // Product context (when coming from Dashboard)
  const [sourceProduct, setSourceProduct] = useState(null);

  // File and Generation
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Common Settings
  const [gender, setGender] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [imageStyle, setImageStyle] = useState('ecommerce_clean');
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]); // Default 1:1
  const [colorPalette, setColorPalette] = useState([]);
  const [colorHex, setColorHex] = useState(null);
  const [manualColorOverride, setManualColorOverride] = useState(null); // For user color override
  const [useColorLock, setUseColorLock] = useState(true);
  const [negative, setNegative] = useState('no extra accessories, no text, no logos change, no second person');

  // Clothes-specific
  const [selectedModel, setSelectedModel] = useState(null);
  const [bodySize, setBodySize] = useState('medium'); // S/M/L body size visualization
  const [modelPersona, setModelPersona] = useState({
    gender: 'female', ageRange: 'adult', ethnicity: 'any',
    skinTone: 'medium', hairStyle: 'long', hairColor: 'brown', bodyType: 'average',
  });
  const [pose, setPose] = useState(POSE_PROMPTS[0].prompt);

  // Shoes-specific
  const [selectedShoeModel, setSelectedShoeModel] = useState(null);
  const [selectedShoePose, setSelectedShoePose] = useState(null);

  // Bags-specific
  const [bagStyle, setBagStyle] = useState(null);
  const [bagDisplayMode, setBagDisplayMode] = useState(null);
  const [bagCameraAngle, setBagCameraAngle] = useState(null);
  const [bagLighting, setBagLighting] = useState(null);

  // Accessories-specific
  const [accessoryType, setAccessoryType] = useState(null);
  const [accessorySubtype, setAccessorySubtype] = useState(null);
  const [accessoryShotType, setAccessoryShotType] = useState(null);
  const [accessoryLighting, setAccessoryLighting] = useState(null);

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

  // Pre-fill from URL params (Dashboard integration)
  useEffect(() => {
    if (productData && !productLoading) {
      // Store the source product for save-back functionality
      setSourceProduct(productData);

      // Pre-fill the file if available
      if (productData.file) {
        setSelectedFile(productData.file);
        // Skip to upload step (step 1) since we have a file
        // User still needs to select category first
      }

      console.log('📦 Product loaded from Dashboard:', productData.name, '(ID:', productData.id, ')');
    }
  }, [productData, productLoading]);

  // Reset step index when category changes
  useEffect(() => {
    if (category) {
      setCurrentStepIndex(0); // Go to first step of new category
    }
  }, [category]);

  // Smart defaults for clothes
  useEffect(() => {
    if (category === 'clothes') {
      // Auto-set aspect ratio to 3:4 (Portrait) for clothes as it's best for full body
      const portraitRatio = ASPECT_RATIOS.find(r => r.id === '3:4');
      if (portraitRatio) setAspectRatio(portraitRatio);
    }
  }, [category]);

  // Auto-select recommended defaults for shoes
  useEffect(() => {
    if (category === 'shoes') {
      // Auto-set aspect ratio to 1:1 (Square) for shoes
      const squareRatio = ASPECT_RATIOS.find(r => r.id === '1:1');
      if (squareRatio) setAspectRatio(squareRatio);

      // Pre-select recommended pose for best results
      if (!selectedShoePose) {
        const defaultPose = SHOE_POSES.find(p => p.recommended) || SHOE_POSES[0];
        setSelectedShoePose(defaultPose);
      }
    }
  }, [category]);

  // Auto-select recommended defaults for bags
  useEffect(() => {
    if (category === 'bags') {
      // Auto-set aspect ratio to 1:1 (Square) for bags
      const squareRatio = ASPECT_RATIOS.find(r => r.id === '1:1');
      if (squareRatio) setAspectRatio(squareRatio);

      // Pre-select recommended options
      if (!bagCameraAngle) {
        const defaultAngle = BAG_CAMERA_ANGLES.find(a => a.recommended) || BAG_CAMERA_ANGLES[0];
        setBagCameraAngle(defaultAngle);
      }
      if (!bagLighting) {
        const defaultLighting = BAG_LIGHTING_OPTIONS.find(l => l.recommended) || BAG_LIGHTING_OPTIONS[0];
        setBagLighting(defaultLighting);
      }
    }
  }, [category]);

  // Auto-select recommended defaults for accessories
  useEffect(() => {
    if (category === 'accessories') {
      // Auto-set aspect ratio to 1:1 (Square)
      const squareRatio = ASPECT_RATIOS.find(r => r.id === '1:1');
      if (squareRatio) setAspectRatio(squareRatio);

      // Pre-select recommended options
      if (!accessoryShotType) {
        const defaultShot = ACCESSORY_SHOT_TYPES.find(t => t.recommended) || ACCESSORY_SHOT_TYPES[0];
        setAccessoryShotType(defaultShot);
      }
      if (!accessoryLighting) {
        const defaultLighting = ACCESSORY_LIGHTING_OPTIONS.find(l => l.recommended) || ACCESSORY_LIGHTING_OPTIONS[0];
        setAccessoryLighting(defaultLighting);
      }
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
    // Reset manual override when new image is uploaded
    setManualColorOverride(null);
  };

  // Handle user confirming the detected color is correct
  const handleColorConfirm = (color) => {
    setManualColorOverride(null); // Use detected color
    console.log('[App] Color confirmed by user:', color?.hex);
  };

  // Handle user overriding the color
  const handleColorOverride = (overrideColor) => {
    setManualColorOverride(overrideColor);
    console.log('[App] Color manually overridden to:', overrideColor);
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
      case 'clothes': {
        // Get body size prompt from BODY_SIZES
        const selectedBodySize = BODY_SIZES.find(s => s.id === bodySize);
        const bodySizePrompt = selectedBodySize?.prompt || '';

        personaDescription = `${buildPersonaDescription(modelPersona)} ${bodySizePrompt}`;
        break;
      }
      case 'shoes': {
        // Simplified shoe photography prompt - professional defaults
        const posePrompt = selectedShoePose?.prompt || 'Classic standing pose, natural leg positioning';
        const modelDesc = buildShoePersonaDescription(selectedShoeModel);

        personaDescription = modelDesc;
        categoryPrompt = `${posePrompt}. Professional 3/4 hero angle. Studio lighting with soft shadows`;
        break;
      }
      case 'bags':
        const bagAnglePrompt = bagCameraAngle?.prompt || 'Straight front angle';
        const bagLightPrompt = bagLighting?.prompt || 'Professional studio lighting';
        categoryPrompt = `${buildBagPrompt(bagStyle, bagDisplayMode)}. ${bagAnglePrompt}. ${bagLightPrompt}`;
        personaDescription = gender === 'male' ? 'Male model' : 'Female model';
        break;
      case 'accessories':
        const accShotPrompt = accessoryShotType?.prompt || 'Macro detail shot';
        const accLightPrompt = accessoryLighting?.prompt || 'Soft diffused lighting';
        categoryPrompt = `${buildAccessoryPrompt(accessoryType, accessorySubtype)}. ${accShotPrompt}. ${accLightPrompt}`;
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
      aspectRatio ? `Aspect Ratio: ${aspectRatio.ratio}` : '',
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
        if (selectedShoePose) formData.append('shoePose', selectedShoePose.prompt);
        break;
      case 'bags':
        if (bagStyle) formData.append('bagStyle', bagStyle.id);
        if (bagDisplayMode) formData.append('bagDisplayMode', bagDisplayMode.id);
        if (bagCameraAngle) formData.append('bagCameraAngle', bagCameraAngle.prompt);
        if (bagLighting) formData.append('bagLighting', bagLighting.prompt);
        break;
      case 'accessories':
        if (accessoryType) formData.append('accessoryType', accessoryType.id);
        if (accessorySubtype) formData.append('accessorySubtype', accessorySubtype.id);
        if (accessoryShotType) formData.append('accessoryShotType', accessoryShotType.prompt);
        if (accessoryLighting) formData.append('accessoryLighting', accessoryLighting.prompt);
        break;
    }

    if (selectedBackground) {
      formData.append('backgroundPrompt', selectedBackground.prompt);
    }

    // Add photography style preset
    if (imageStyle) {
      formData.append('imageStyle', imageStyle);
    }

    // Add aspect ratio
    if (aspectRatio) {
      formData.append('aspectRatio', aspectRatio.ratio);
      formData.append('width', aspectRatio.width);
      formData.append('height', aspectRatio.height);
    }

    // Add color data for AI color accuracy
    const activeColorHex = manualColorOverride?.hex || colorHex;
    const activeColorName = manualColorOverride?.name || colorPalette[0]?.name;
    if (activeColorHex) {
      formData.append('colorHex', activeColorHex);
    }
    if (activeColorName) {
      formData.append('colorName', activeColorName);
    }
    if (manualColorOverride?.isManualOverride) {
      formData.append('manualColorHex', manualColorOverride.hex);
    }
    if (colorPalette && colorPalette.length > 0) {
      formData.append('colorPalette', JSON.stringify(colorPalette.slice(0, 3)));
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedResult(null);

    try {
      // Include auth token for credit deduction
      const fetchOptions = {
        method: 'POST',
        body: formData,
        credentials: 'include', // Include cookies for cross-origin auth
      };

      // Send auth token in Authorization header
      if (authToken) {
        fetchOptions.headers = {
          'Authorization': `Bearer ${authToken}`,
        };
      }

      // Use retry logic for network resilience
      const apiCall = fetchWithRetry(`${API_BASE}/api/generate`, fetchOptions, {
        maxRetries: 3,
        baseDelay: 2000,
        retryOn: [500, 502, 503, 504, 429],
      }).then(res => res.json());
      const minWait = new Promise(resolve => setTimeout(resolve, 60000));
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

      // Trigger success celebration
      setShowCelebration(true);

      // Update credits if returned
      if (data.credits?.remaining !== undefined) {
        updateCredits(data.credits.remaining);
      }

      // Auto-show save modal if coming from Dashboard
      if (sourceProduct?.id) {
        setShowSaveModal(true);
      }
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
    setSelectedShoeModel(null);
    setBagStyle(null);
    setBagDisplayMode(null);
    setBagCameraAngle(null);
    setBagLighting(null);
    setBagLighting(null);
    setAccessoryType(null);
    setAccessorySubtype(null);
    setAccessoryShotType(null);
    setAccessoryLighting(null);
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

  // === SWIPE NAVIGATION FOR MOBILE ===
  const { ref: swipeRef, isSwiping } = useSwipeNavigation({
    onSwipeLeft: () => {
      if (!generatedResult && canProceed() && currentStepIndex < totalSteps - 1) {
        nextStep();
      }
    },
    onSwipeRight: () => {
      if (!generatedResult && currentStepIndex > 0) {
        prevStep();
      }
    },
    threshold: 60,
  });

  // === KEYBOARD SHORTCUTS ===
  useKeyboardShortcuts({
    onEscape: () => {
      if (generatedResult) {
        resetWizard();
      } else if (showSaveModal) {
        setShowSaveModal(false);
      }
    },
    onEnter: () => {
      if (!generatedResult && canProceed() && currentStep !== 'review') {
        nextStep();
      }
    },
    onArrowLeft: () => {
      if (!generatedResult && currentStepIndex > 0) {
        prevStep();
      }
    },
    onArrowRight: () => {
      if (!generatedResult && canProceed() && currentStepIndex < totalSteps - 1) {
        nextStep();
      }
    },
    enabled: !isGenerating,
  });

  // === ORIGINAL IMAGE URL FOR COMPARISON ===
  const originalImageUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    return null;
  }, [selectedFile]);

  // Cleanup object URL on unmount or file change
  useEffect(() => {
    return () => {
      if (originalImageUrl) {
        URL.revokeObjectURL(originalImageUrl);
      }
    };
  }, [originalImageUrl]);

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

            {/* Color Override Selector - shows after image is uploaded */}
            {selectedFile && colorHex && (
              <ColorOverrideSelector
                detectedColor={{
                  hex: colorHex,
                  name: colorPalette[0]?.colorName || colorPalette[0]?.name || 'Detected',
                  percentage: colorPalette[0]?.percentage
                }}
                onColorConfirm={handleColorConfirm}
                onColorOverride={handleColorOverride}
                isVisible={true}
              />
            )}
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
            <Suspense fallback={<SuspenseFallback message="Loading models..." />}>
              <ModelSelection
                selectedModel={selectedModel}
                onModelSelect={setSelectedModel}
                gender={gender}
              />
            </Suspense>

            {/* Body Size Selection for Fit Visualization */}
            <div className="mt-10 pt-10 border-t border-white/10">
              <BodySizeSelection
                selectedSize={bodySize}
                onSizeSelect={setBodySize}
              />
            </div>
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
                Choose Your <span className="text-gradient">Style</span>
              </h2>
              <p className="text-slate-400">Select pose and leg style for your footwear photography</p>
            </div>
            <div className="space-y-10">
              {/* 1. Model Pose - How they wear the shoes */}
              <ShoePoseSelection
                selectedPose={selectedShoePose}
                onPoseSelect={setSelectedShoePose}
              />

              {/* 2. Leg Style (optional reference) */}
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
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">
                Photography <span className="text-gradient">Style</span>
              </h2>
              <p className="text-slate-400">Choose the perfect aesthetic for your product shot</p>
            </div>

            {/* Aspect Ratio Selector */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
              <AspectRatioSelector
                selectedRatio={aspectRatio}
                onRatioSelect={setAspectRatio}
              />
            </div>

            {/* Photography Style Selection - includes background in each style */}
            <ImageStyleSelection
              selectedStyle={imageStyle}
              onStyleSelect={setImageStyle}
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
            <Suspense fallback={<SuspenseFallback message="Loading review..." />}>
              <ReviewPage
                selectedFile={selectedFile}
                selectedModel={selectedModel}
                selectedShoeModel={selectedShoeModel}
                selectedBackground={selectedBackground}
                imageStyle={imageStyle}
                category={category}
                gender={gender}
                bagStyle={bagStyle}
                bagDisplayMode={bagDisplayMode}
                accessoryType={accessoryType}
                accessorySubtype={accessorySubtype}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                credits={credits}
              />
            </Suspense>
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

      {/* Full Screen Progress Overlay - Enhanced with phases and tips */}
      <GenerationProgressOverlay
        isGenerating={isGenerating}
        category={category}
        onCancel={() => {
          setIsGenerating(false);
          setError('Generation cancelled.');
        }}
      />

      {/* Low Credits Toast - Shows once per session when credits are low */}
      <LowCreditsToast balance={credits?.balance} threshold={3} />

      {/* Success Celebration - Confetti on generation complete */}
      <SuccessCelebration
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />

      {/* Welcome Onboarding - Shows only for first-time users */}
      <WelcomeOnboarding />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 min-h-screen flex flex-col safe-top">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 sm:mb-8 lg:mb-12 gap-2">
          <div className="flex items-center gap-3">
            {/* Back to Dashboard - Mobile friendly */}
            <motion.a
              href={DASHBOARD_URL}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </motion.a>

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

          {/* Credit Badge */}
          <CreditBadge credits={credits} loading={creditsLoading} error={creditsError} />

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
                    <div className={`w-4 sm:w-8 h-0.5 sm:h-1 mx-1 sm:mx-1.5 rounded-full ${index < currentStepIndex ? 'bg-primary/30' : 'bg-white/5'}`} />
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

        {/* Mobile Step Progress Indicator */}
        {category && !generatedResult && (
          <div className="flex md:hidden items-center justify-center gap-1.5 pb-4">
            {steps.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentStepIndex
                  ? 'w-6 bg-primary'
                  : idx < currentStepIndex
                    ? 'w-2.5 bg-primary/50'
                    : 'w-2 bg-white/20'
                  }`}
                animate={{ scale: idx === currentStepIndex ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: idx === currentStepIndex ? Infinity : 0 }}
              />
            ))}
          </div>
        )}

        {/* Main Content with Swipe Navigation */}
        <main ref={swipeRef} className={`flex-1 relative touch-pan-y ${isSwiping ? 'select-none' : ''}`}>
          <AnimatePresence mode="wait">
            {generatedResult ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex justify-between items-center flex-wrap gap-3">
                  <h2 className="text-2xl font-bold">Generation Result</h2>
                  <div className="flex gap-2">
                    {/* Save to Product - Only shows when coming from Dashboard */}
                    {sourceProduct?.id && (
                      <AnimatedButton
                        onClick={() => setShowSaveModal(true)}
                        variant="primary"
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        💾 Save to Product
                      </AnimatedButton>
                    )}
                    <AnimatedButton onClick={resetWizard} variant="secondary" icon={RotateCcw}>
                      Create Another
                    </AnimatedButton>
                  </div>
                </div>
                <GenerationResult
                  result={generatedResult}
                  category={category}
                  onRegenerate={handleGenerate}
                  originalImage={originalImageUrl}
                />
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

        {/* Navigation Footer - Fixed on mobile */}
        {!generatedResult && currentStep !== 'category' && (
          <motion.footer
            className="fixed bottom-0 left-0 right-0 sm:relative sm:mt-8 pt-4 sm:pt-6 px-4 sm:px-0 pb-4 sm:pb-0 bg-dark-deep/95 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none border-t border-white/10 sm:border-white/5 flex items-center justify-between gap-3 z-50 safe-bottom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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

      {/* Save to Product Modal - Shows when coming from Dashboard */}
      <SaveToProductModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        imageUrl={generatedResult?.imageUrl}
        sourceProduct={sourceProduct}
        onSaveSuccess={() => {
          console.log('✅ Image saved to product successfully!');
        }}
      />
    </div>
  );
}

export default App;
