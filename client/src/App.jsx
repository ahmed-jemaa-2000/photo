import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import GenerationResult from './components/GenerationResult';
import { Sparkles, Wand2, Clock3, CheckCircle2, Loader2, Palette } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const PRESET_PROMPTS = [
  {
    label: 'Studio clean',
    prompt:
      'High-resolution studio photo on a neutral light-gray backdrop, soft three-point lighting, accurate fabric color, subtle shadow under feet, model facing camera in a relaxed stance, shot on 85mm prime.',
  },
  {
    label: 'Outdoor lifestyle',
    prompt:
      'Natural daylight street-style look with soft overcast light, shallow depth of field, muted urban background blur, candid pose with a casual smile, crisp fabric texture and true color.',
  },
  {
    label: 'Runway drama',
    prompt:
      'Runway-inspired portrait with dramatic rim lighting, bold contrast, confident pose, cinematic shadows, minimal background detail, editorial fashion tone.',
  },
  {
    label: 'E-com white',
    prompt:
      'E-commerce catalog shot on pure white seamless backdrop, even soft lighting, no harsh shadows, model facing forward and slightly angled, fabric texture sharp and color-accurate.',
  },
  {
    label: 'Luxury campaign',
    prompt:
      'Premium fashion campaign look, soft glow lighting, minimal set, confident pose, gentle vignetting, polished skin tone, fabric drape and sheen emphasized.',
  },
  {
    label: 'Sunset street',
    prompt:
      'Golden-hour street vibe with warm sidelighting, blurred urban background, relaxed stance, subtle motion, soft highlights on fabric textures.',
  },
  {
    label: 'Sport active',
    prompt:
      'Athletic action pose on a clean sport backdrop, dynamic stance, crisp lighting that freezes motion, sweat-free skin, accurate garment color and stretch, no extra gear, professional fitness catalog feel.',
  },
  {
    label: 'Bridal elegance',
    prompt:
      'Bridal portrait on a soft neutral backdrop, gentle window light, graceful posture, smooth skin tone, accurate lace/satin detail and dress silhouette, minimal jewelry, clean floor-length framing, calm and elegant mood.',
  },
];

const POSE_PROMPTS = [
  { label: 'Standing', key: 'standing', prompt: 'Full-length standing pose, relaxed weight shift, arms natural, outfit fully visible.' },
  { label: 'Walking', key: 'walking', prompt: 'Mid-step walking pose, gentle arm swing, natural motion blur avoided, outfit centered.' },
  { label: 'Seated/leaning', key: 'seated', prompt: 'Seated or lightly leaning pose with straight posture, garment drape visible.' },
  { label: 'Dynamic', key: 'dynamic', prompt: 'Dynamic half-turn with confident stance, torso rotation, outfit front still clear.' },
];

const BACKDROP_PROMPTS = [
  { label: 'Clean studio', prompt: 'Neutral studio backdrop, soft gradient, minimal props.' },
  { label: 'White seamless', prompt: 'Pure white seamless background, no shadows or props.' },
  { label: 'Urban blur', prompt: 'Softly blurred urban background, muted tones, no readable signs or text.' },
  { label: 'Pastel wash', prompt: 'Pastel gradient backdrop with soft edges, calm and minimal.' },
];

const VARIATION_CUES = [
  'Use a fresh pose variation: slight head tilt, relaxed weight shift, and a subtle hand gesture.',
  'Change the stance: a gentle walk mid-step, natural arm swing, and soft gaze off-camera.',
  'Try a seated or leaning pose with natural posture, keeping the garment fully visible.',
  'Vary the camera: slightly lower angle for presence, medium framing, crisp focus on the outfit.',
  'Add dynamic energy: a light turn of the torso, one foot forward, confident expression.',
];

function App() {
  const [prompt, setPrompt] = useState(PRESET_PROMPTS[0].prompt);
  const [gender, setGender] = useState('female');
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Waiting for upload');
  const [error, setError] = useState(null);
  const [pose, setPose] = useState(POSE_PROMPTS[0].prompt);
  const [backdrop, setBackdrop] = useState(BACKDROP_PROMPTS[0].prompt);
  const [negative, setNegative] = useState('no extra accessories, no text, no logos change, no second person');
  const [colorHex, setColorHex] = useState(null);
  const [useColorLock, setUseColorLock] = useState(true);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setGeneratedResult(null);
    setError(null);
    setStatusMessage('Image ready - add your style prompt and hit generate.');
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setGeneratedResult(null);
    setStatusMessage('Waiting for upload');
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Add a garment photo first.');
      return;
    }

    const effectivePrompt = (prompt || '').trim() || PRESET_PROMPTS[0].prompt;
    const variationCue = VARIATION_CUES[Math.floor(Math.random() * VARIATION_CUES.length)];
    const fidelityGuard = `Use a ${gender === 'female' ? 'female' : 'male'} human model. Match the uploaded garment exactly (shape, silhouette, fit, color, pattern/print, logos). Do not recolor or restyle the garment. Do not add or remove accessories, props, jewelry, text, or extra garments. Keep background consistent with the style. Photorealistic, high resolution, skin-safe lighting.`;
    const colorClause =
      useColorLock && colorHex
        ? `Color lock: use exact garment color ${colorHex}, no hue shift, no saturation change.`
        : '';
    const finalPrompt = [
      effectivePrompt,
      pose,
      backdrop,
      variationCue,
      fidelityGuard,
      colorClause,
      negative ? `Negative: ${negative}` : '',
    ].join(' ');
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('prompt', finalPrompt);
    formData.append('gender', gender);

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
        backdrop,
        negative,
        colorHex: useColorLock ? colorHex : null,
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

  const processSteps = [
    { label: 'Upload', description: 'Clothing photo ready', done: !!selectedFile },
    { label: 'Render', description: 'GeminiGen processing', done: isGenerating || !!generatedResult },
    { label: 'Ready', description: 'Download & share', done: !!generatedResult },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-primary/25 relative overflow-hidden">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[55%] h-[55%] bg-primary/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-5%] w-[45%] h-[45%] bg-secondary/20 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/2 w-[30%] h-[30%] bg-white/5 rounded-full blur-[90px]" />
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col min-h-screen">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-3 bg-white/5 rounded-2xl mb-5 shadow-2xl border border-white/10">
            <Sparkles className="w-8 h-8 text-primary mr-3" />
            <div className="text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">GeminiGen powered</p>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Clothes<span className="text-primary">2</span>Model
              </h1>
            </div>
          </div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Upload a garment photo, guide the style, and get a photoreal model render with studio lighting.
          </p>
        </header>

        <main className="grid md:grid-cols-5 gap-8 flex-1">
          <div className="md:col-span-3 space-y-6">
              <ImageUpload
                onFileSelect={handleFileSelect}
                isGenerating={isGenerating}
                selectedFile={selectedFile}
                onClear={clearSelection}
                onColorDetected={(hex) => setColorHex(hex)}
              />

            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary border border-primary/30">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Style prompt</p>
                  <p className="text-lg font-semibold">Tell the model how to pose & light</p>
                </div>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition"
                rows={3}
                placeholder="Describe mood, lighting, camera angle. Gender lock and garment fidelity are enforced automatically."
              />

              <div className="flex flex-wrap gap-2">
                {PRESET_PROMPTS.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setPrompt(item.prompt)}
                    className={`px-3 py-2 rounded-full text-sm border transition ${
                      prompt === item.prompt
                        ? 'bg-primary/20 border-primary/50 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-primary/40'
                    }`}
                    title={item.prompt}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="text-sm text-slate-300 font-semibold">Model persona (strict):</div>
                {[
                  { value: 'female', label: 'Woman' },
                  { value: 'male', label: 'Man' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGender(option.value)}
                    className={`px-3 py-2 rounded-full text-sm border transition ${
                      gender === option.value
                        ? 'bg-primary/20 border-primary/50 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:border-primary/40'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="pt-4 space-y-3">
                <div className="text-sm text-slate-300 font-semibold">Pose</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {POSE_PROMPTS.map((item) => {
                    const selected = pose === item.prompt;
                    const thumb = new URL(`./assets/pose-${item.key}.svg`, import.meta.url).href;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setPose(item.prompt)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition ${
                          selected
                            ? 'bg-primary/15 border-primary/50 text-white shadow-primary/30 shadow'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-primary/40'
                        }`}
                        title={item.prompt}
                      >
                        <img src={thumb} alt={item.label} className="w-12 h-12 opacity-90" />
                        <span className="text-xs font-semibold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="text-sm text-slate-300 font-semibold">Background</div>
                <div className="flex flex-wrap gap-2">
                  {BACKDROP_PROMPTS.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => setBackdrop(item.prompt)}
                      className={`px-3 py-2 rounded-full text-sm border transition ${
                        backdrop === item.prompt
                          ? 'bg-primary/20 border-primary/50 text-white'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-primary/40'
                      }`}
                      title={item.prompt}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <div className="text-sm text-slate-300 font-semibold">Negative prompt (what to avoid)</div>
                <textarea
                  value={negative}
                  onChange={(e) => setNegative(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30 transition text-sm"
                  rows={2}
                  placeholder="Things to avoid (props, extra people, text, logos changes...)"
                />
              </div>

              {colorHex && (
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="text-sm text-slate-300 font-semibold">Color lock</div>
                  <div className="w-9 h-9 rounded-full border border-white/20 shadow-inner" style={{ background: colorHex }} />
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={useColorLock}
                      onChange={(e) => setUseColorLock(e.target.checked)}
                      className="accent-primary"
                    />
                    Enforce exact hue in render
                  </label>
                  <span className="text-xs text-slate-500">{colorHex}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!selectedFile || isGenerating}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  {isGenerating ? 'Generating...' : 'Generate look'}
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Clock3 className="w-4 h-4" />
                  <span>{statusMessage}</span>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-200 rounded-xl text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="glass-panel p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <p className="text-sm text-slate-300">Process (garment locked, gender locked)</p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {processSteps.map((step) => (
                  <div
                    key={step.label}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      step.done ? 'border-primary/50 bg-primary/10' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        step.done ? 'bg-primary/20 text-primary border border-primary/50' : 'bg-white/5 text-slate-400 border border-white/15'
                      }`}
                    >
                      {step.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock3 className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-semibold">{step.label}</p>
                      <p className="text-xs text-slate-400">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            {isGenerating && !generatedResult && (
              <div className="glass-panel p-8 h-[500px] flex flex-col items-center justify-center text-center">
                <Sparkles className="w-12 h-12 text-primary/60 mb-4 animate-pulse" />
                <p className="text-slate-300 mb-2">AI is crafting your model shot...</p>
                <p className="text-slate-500 text-sm">This usually takes a few seconds.</p>
              </div>
            )}

            <GenerationResult result={generatedResult} />
          </div>
        </main>

        <footer className="mt-10 text-center text-slate-500 text-sm">
          <p>(c) 2024 Clothes2Model AI - powered by GeminiGen</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
