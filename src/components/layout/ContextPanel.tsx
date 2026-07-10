import React from 'react';
import type { UserMemory, AccessibilityNeeds, DietaryPreference, NavigationStyle } from '../../types';
import { X, Shield, Users, Eye, Heart } from 'lucide-react';

interface ContextPanelProps {
  isOpen: boolean;
  onClose: () => void;
  memory: UserMemory;
  onUpdateMemory: (updated: Partial<UserMemory>) => void;
  isGuest: boolean;
}

export const ContextPanel: React.FC<ContextPanelProps> = ({
  isOpen,
  onClose,
  memory,
  onUpdateMemory,
  isGuest,
}) => {
  if (!isOpen) return null;

  const handleAccessibilityChange = (acc: AccessibilityNeeds) => {
    let navStyle: NavigationStyle = 'standard';
    if (acc === 'wheelchair' || acc === 'stroller') navStyle = 'stair-free';
    else if (acc === 'sensory') navStyle = 'low-crowd';

    onUpdateMemory({ 
      accessibility: acc,
      navigationStyle: navStyle
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="context-panel-title"
    >
      <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl overflow-y-auto animate-slide-in">
        
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div>
              <h2 id="context-panel-title" className="text-lg font-bold text-white flex items-center gap-1.5 font-fifa">
                <Shield className="w-5 h-5 text-fifa-gold" /> Fan Context Profile
              </h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                {isGuest ? 'Guest Mode (Local Storage Memory)' : 'Google Signed-In (Cloud Memory Sync)'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="Close Context Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preferences Body */}
          <div className="space-y-6">
            
            {/* Language Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Assistant Language
              </label>
              <select
                value={memory.language}
                onChange={(e) => onUpdateMemory({ language: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-sm py-2 px-3 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-fifa-green"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="pt">Português</option>
                <option value="fr">Français</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>

            {/* Accessibility Needs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Accessibility Service Needs
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'none', label: 'None' },
                  { key: 'wheelchair', label: 'Wheelchair' },
                  { key: 'stroller', label: 'Stroller/Elderly' },
                  { key: 'sensory', label: 'Sensory Access' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleAccessibilityChange(item.key as AccessibilityNeeds)}
                    className={`py-2 px-3 rounded-lg border text-xs font-bold text-center transition-all ${
                      memory.accessibility === item.key
                        ? 'bg-fifa-green text-white border-fifa-green shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Group Size */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Attending Group Size
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateMemory({ groupSize: Math.max(1, memory.groupSize - 1) })}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center font-extrabold text-white text-lg focus:outline-none focus:ring-2 focus:ring-fifa-green"
                >
                  -
                </button>
                <div className="w-12 text-center text-lg font-extrabold text-white flex items-center justify-center gap-1">
                  <Users className="w-4 h-4 text-fifa-gold" /> {memory.groupSize}
                </div>
                <button
                  onClick={() => onUpdateMemory({ groupSize: memory.groupSize + 1 })}
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center font-extrabold text-white text-lg focus:outline-none focus:ring-2 focus:ring-fifa-green"
                >
                  +
                </button>
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Dietary Requirements
              </label>
              <select
                value={memory.dietary}
                onChange={(e) => onUpdateMemory({ dietary: e.target.value as DietaryPreference })}
                className="w-full bg-slate-800 border border-slate-700 text-sm py-2 px-3 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-fifa-green"
              >
                <option value="none">Standard Menu (No Restrictions)</option>
                <option value="vegan">Vegan / Vegetarian</option>
                <option value="halal">Halal Certified</option>
                <option value="gluten-free">Gluten-Free</option>
              </select>
            </div>

            {/* Navigation Routing preference */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                AI Navigation Style
              </label>
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-lg">
                <div className="text-xs font-bold text-white capitalize flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-fifa-gold" />
                  {memory.navigationStyle.replace('-', ' ')}
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  {memory.navigationStyle === 'stair-free' 
                    ? 'Routes will highlight ADA ramps, elevator lift systems, and completely bypass stairs.' 
                    : memory.navigationStyle === 'low-crowd' 
                    ? 'Routes will suggest wider corridors and corridors that are currently less congested.' 
                    : 'Routes will follow the default fastest pathways including stairs.'}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Panel Footer */}
        <div className="border-t border-slate-800 pt-4 mt-6">
          <div className="flex gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 text-[10px] text-slate-400">
            <Heart className="w-4 h-4 text-fifa-gold shrink-0 mt-0.5" />
            <span>AI Memory maintains these variables to proactive tailor routes, food recommendations, and chat tone.</span>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-4 py-2.5 bg-fifa-green hover:bg-fifa-green-light text-white font-bold text-xs rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-fifa-green"
          >
            Apply Context Profile
          </button>
        </div>

      </div>
    </div>
  );
};
