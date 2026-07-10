import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AccessibilitySettings, TextScale } from '../types';

interface AccessibilityContextProps extends AccessibilitySettings {
  setHighContrast: (val: boolean) => void;
  setTextScale: (scale: TextScale) => void;
  setAudioHelp: (val: boolean) => void;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextProps | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrastState] = useState<boolean>(() => {
    const saved = localStorage.getItem('accessibility_high_contrast');
    return saved ? JSON.parse(saved) : false;
  });

  const [textScale, setTextScaleState] = useState<TextScale>(() => {
    const saved = localStorage.getItem('accessibility_text_scale');
    return (saved as TextScale) || 'md';
  });

  const [audioHelp, setAudioHelpState] = useState<boolean>(() => {
    const saved = localStorage.getItem('accessibility_audio_help');
    return saved ? JSON.parse(saved) : false;
  });

  // Handle document class modifications for CSS targets
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast class
    if (highContrast) {
      root.classList.add('theme-high-contrast');
    } else {
      root.classList.remove('theme-high-contrast');
    }
    localStorage.setItem('accessibility_high_contrast', JSON.stringify(highContrast));
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    
    // Text scale classes
    root.classList.remove('text-scale-sm', 'text-scale-md', 'text-scale-lg', 'text-scale-xl');
    root.classList.add(`text-scale-${textScale}`);
    localStorage.setItem('accessibility_text_scale', textScale);
  }, [textScale]);

  useEffect(() => {
    localStorage.setItem('accessibility_audio_help', JSON.stringify(audioHelp));
  }, [audioHelp]);

  const setHighContrast = (val: boolean) => setHighContrastState(val);
  const setTextScale = (scale: TextScale) => setTextScaleState(scale);
  const setAudioHelp = (val: boolean) => setAudioHelpState(val);
  
// Text-To-Speech (TTS) helper function for accessibility and panic guidance
const speakText = (text: string) => {
  if (!("speechSynthesis" in window)) {
    alert("Speech synthesis is not supported in this browser.");
    return;
  }

  // Stop any speech already playing
  window.speechSynthesis.cancel();

  // Remove markdown characters
  const cleanText = text.replace(/[*#]/g, "");

  const utterance = new SpeechSynthesisUtterance(cleanText);

  // Voice settings
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Speak
  window.speechSynthesis.speak(utterance);
};

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        textScale,
        audioHelp,
        setHighContrast,
        setTextScale,
        setAudioHelp,
        speakText,
        stopSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
