import React, { useState } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import type { UserMemory, UserPreferences, AccessibilityNeeds, NavigationStyle } from '../../types';
import { signInWithGoogle, continueAsGuest } from '../../services/firebase';
import { Eye, Type, Volume2, Globe, Users, Accessibility, ArrowRight, ShieldAlert, Award } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (user: UserPreferences, memory: UserMemory) => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const { 
    highContrast, 
    setHighContrast, 
    textScale, 
    setTextScale, 
    audioHelp, 
    setAudioHelp, 
    speakText 
  } = useAccessibility();

  const [step, setStep] = useState<number>(0); // 0: Landing, 1: Language, 2: Accessibility, 3: Group, 4: Auth
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Structured Memory state to collect
  const [memory, setMemory] = useState<UserMemory>({
    language: 'en',
    accessibility: 'none',
    groupSize: 1,
    dietary: 'none',
    navigationStyle: 'standard',
    favoriteFoods: [],
  });

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => Math.max(0, prev - 1));
  };

  const handleLanguageSelect = (lang: string) => {
    setMemory(prev => ({ ...prev, language: lang }));
    speakText(lang === 'es' ? 'Idioma seleccionado: Español' : 
              lang === 'pt' ? 'Idioma selecionado: Português' :
              lang === 'fr' ? 'Langue sélectionnée : Français' :
              lang === 'ar' ? 'تم اختيار اللغة العربية' : 'Language selected: English');
    nextStep();
  };

  const handleAccessibilitySelect = (needs: AccessibilityNeeds) => {
    let navStyle: NavigationStyle = 'standard';
    if (needs === 'wheelchair') navStyle = 'stair-free';
    else if (needs === 'stroller') navStyle = 'stair-free';
    else if (needs === 'sensory') navStyle = 'low-crowd';

    setMemory(prev => ({ 
      ...prev, 
      accessibility: needs,
      navigationStyle: navStyle
    }));
    speakText(`Accessibility selection: ${needs}. Route style updated to ${navStyle}.`);
    nextStep();
  };

  const handleGroupSelect = (size: number) => {
    setMemory(prev => ({ ...prev, groupSize: size }));
    speakText(`Group size configured as ${size}.`);
    nextStep();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      onComplete(user, memory);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setLoading(true);
    try {
      const user = continueAsGuest();
      onComplete(user, memory);
    } catch (err: any) {
      setError('Failed to enter as guest.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans">
      
      {/* Top Accessibility Settings Toolbar */}
      <div className="w-full max-w-md mb-6 p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between shadow-lg">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Toolbar Acessível</span>
        <div className="flex gap-2">
          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
              highContrast 
                ? 'bg-fifa-gold text-fifa-blue border-fifa-gold' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle High Contrast Mode"
            aria-pressed={highContrast}
          >
            <Eye className="w-5 h-5" />
            <span className="sr-only">High Contrast</span>
          </button>

          {/* Text Size Cycle */}
          <button
            onClick={() => {
              const scales: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
              const nextIdx = (scales.indexOf(textScale) + 1) % scales.length;
              setTextScale(scales[nextIdx]);
            }}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 flex items-center gap-1"
            title={`Cycle Text Scale (Current: ${textScale.toUpperCase()})`}
          >
            <Type className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">{textScale}</span>
          </button>

          {/* Audio Assistance / Speech Synthesis Toggle */}
          <button
            onClick={() => setAudioHelp(!audioHelp)}
            className={`p-2 rounded-lg border flex items-center justify-center transition-colors ${
              audioHelp 
                ? 'bg-fifa-green text-white border-fifa-green' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle Text-To-Speech Narrator"
            aria-pressed={audioHelp}
          >
            <Volume2 className="w-5 h-5" />
            <span className="sr-only">Screen Narrator</span>
          </button>
        </div>
      </div>

      {/* Main card panel */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 transition-all duration-300">
        
        {/* Step 0: Landing */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center">
            {/* Trophy Branding Icon */}
            <div className="w-16 h-16 bg-fifa-green flex items-center justify-center rounded-full mb-4 ring-4 ring-fifa-green-light">
              <Award className="w-8 h-8 text-fifa-gold" />
            </div>
            
            <h1 className="text-3xl font-extrabold tracking-tight font-fifa text-white">
              Stadium<span className="text-fifa-gold">GPT</span>
            </h1>
            <p className="text-xs font-semibold text-fifa-gold uppercase tracking-widest mt-1 mb-4">
              FIFA World Cup 2026 Companion
            </p>
            
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Welcome to the ultimate match-day helper. Experience personalized, AI-driven stadium support featuring accessible routing, lost & found assistance, multilingual help, and instant emergency SOS guidance.
            </p>

            <div className="w-full space-y-3 mb-6 text-left border-t border-b border-slate-800 py-4">
              <div className="flex items-start gap-3">
                <Accessibility className="w-5 h-5 text-fifa-green mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase">Accessibility-First</h3>
                  <p className="text-xs text-slate-400">Routes tailored for wheelchairs, strollers, and low-crowd paths.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-fifa-green mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase">Multilingual AI</h3>
                  <p className="text-xs text-slate-400">Fluent in English, Spanish, Portuguese, French, and Arabic.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-fifa-red mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase">SOS Exit Guidance</h3>
                  <p className="text-xs text-slate-400">Immediate, high-visibility emergency routing & exit locator.</p>
                </div>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full py-3 px-6 bg-fifa-green hover:bg-fifa-green-light text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform focus:ring-4 focus:ring-fifa-green/50 outline-none"
            >
              Configure Setup
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 1: Language */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold font-fifa text-white mb-2 flex items-center gap-2">
              <Globe className="w-5 h-5 text-fifa-gold" /> Select Your Language
            </h2>
            <p className="text-slate-400 text-xs mb-4">Choose your preferred companion chat language.</p>
            
            <div className="space-y-2">
              {[
                { code: 'en', name: 'English' },
                { code: 'es', name: 'Español' },
                { code: 'pt', name: 'Português' },
                { code: 'fr', name: 'Français' },
                { code: 'ar', name: 'العربية (Arabic)' }
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`w-full py-3 px-4 rounded-xl border text-left font-bold transition-all focus:ring-2 focus:ring-fifa-green outline-none ${
                    memory.language === lang.code
                      ? 'bg-fifa-green text-white border-fifa-green shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
            
            <button
              onClick={prevStep}
              className="w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200"
            >
              Back to Start
            </button>
          </div>
        )}

        {/* Step 2: Accessibility Needs */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold font-fifa text-white mb-2 flex items-center gap-2">
              <Accessibility className="w-5 h-5 text-fifa-gold" /> Accessibility Access
            </h2>
            <p className="text-slate-400 text-xs mb-4">We customize layout and paths based on your needs.</p>
            
            <div className="space-y-2">
              {[
                { key: 'none', label: 'No Special Assistance', desc: 'Standard stairs & escalator navigation.' },
                { key: 'wheelchair', label: 'Wheelchair Access', desc: 'Prioritizes ramps, elevator paths, and ADA gates.' },
                { key: 'stroller', label: 'Stroller & Elderly Care', desc: 'Step-free paths and family restroom locator.' },
                { key: 'sensory', label: 'Sensory Friendly', desc: 'Avoids heavy crowd bottlenecks & points to Quiet Zones.' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleAccessibilitySelect(item.key as AccessibilityNeeds)}
                  className={`w-full p-4 rounded-xl border text-left transition-all focus:ring-2 focus:ring-fifa-green outline-none ${
                    memory.accessibility === item.key
                      ? 'bg-fifa-green text-white border-fifa-green shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-bold">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-300">{item.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={prevStep}
              className="w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200"
            >
              Back
            </button>
          </div>
        )}

        {/* Step 3: Group Size */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold font-fifa text-white mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-fifa-gold" /> Group Size
            </h2>
            <p className="text-slate-400 text-xs mb-4">Helpful to calculate crowd waiting time & facility access.</p>
            
            <div className="space-y-2">
              {[
                { size: 1, label: 'Single Fan', desc: 'Attending solo.' },
                { size: 3, label: 'Small Group (2 - 4)', desc: 'Friends or family attending together.' },
                { size: 6, label: 'Large Group (5+)', desc: 'Large tour groups or big families.' }
              ].map((item) => (
                <button
                  key={item.size}
                  onClick={() => handleGroupSelect(item.size)}
                  className={`w-full p-4 rounded-xl border text-left transition-all focus:ring-2 focus:ring-fifa-green outline-none ${
                    memory.groupSize === item.size
                      ? 'bg-fifa-green text-white border-fifa-green shadow-md'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-bold">{item.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={prevStep}
              className="w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200"
            >
              Back
            </button>
          </div>
        )}

        {/* Step 4: Authentication Choice */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold font-fifa text-white mb-2">Almost Ready!</h2>
            <p className="text-slate-400 text-xs mb-6">Choose how you want to log in. Authenticating via Google allows us to sync preferences and remember you on returning match-days.</p>
            
            {error && (
              <div className="mb-4 p-3 bg-fifa-red/20 border border-fifa-red/40 rounded-lg text-xs text-fifa-red-light font-medium">
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Google Log in */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-200 shadow-sm transition-colors focus:ring-2 focus:ring-slate-400 outline-none disabled:opacity-50"
              >
                {/* Google Simple SVG Icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22-.19-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign In with Google
              </button>

              {/* Guest Log in */}
              <button
                onClick={handleGuestLogin}
                disabled={loading}
                className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-700 shadow-sm transition-colors focus:ring-2 focus:ring-slate-500 outline-none disabled:opacity-50"
              >
                Continue as Guest
              </button>
            </div>

            <button
              onClick={prevStep}
              className="w-full mt-6 py-2 text-xs font-bold text-slate-400 hover:text-slate-200"
            >
              Change Preferences
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
