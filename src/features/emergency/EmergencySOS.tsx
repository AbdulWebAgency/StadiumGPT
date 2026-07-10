import React, { useEffect, useState } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import { Volume2, VolumeX, X, PhoneCall, AlertOctagon } from 'lucide-react';

interface EmergencySOSProps {
  isOpen: boolean;
  onClose: () => void;
  accessibilityNeeds: string;
}

export const EmergencySOS: React.FC<EmergencySOSProps> = ({
  isOpen,
  onClose,
  accessibilityNeeds,
}) => {
  const { speakText, stopSpeaking, audioHelp, setAudioHelp } = useAccessibility();
  const [speakActive, setSpeakActive] = useState<boolean>(false);

  const emergencyDirectives = [
    "DIRECTIONS: Please remain calm. Standard stadium evacuation is active.",
    accessibilityNeeds === 'wheelchair' || accessibilityNeeds === 'stroller'
      ? "ACCESSIBLE ROUTE: Exit your seating tier and proceed immediately to Gate A (East). Gate A is fully ramped and clear of stair hazards."
      : "STANDARD ROUTE: Proceed down the section stairs to the main concourse level. Head directly to Gate A or Gate B exit portals.",
    "MEDICAL CARE: Paramedics are stationed at Section 101 clinic. Security personnel are wearing fluorescent yellow jackets and can guide you directly.",
    "GATHERING SITE: Assemble outside the stadium gates at East Parking Lot Area 4."
  ];

  // Auto trigger speak if audio assistance is enabled globally or on trigger
  useEffect(() => {
    if (isOpen) {
      // Trigger alarm warning speak
      const fullText = emergencyDirectives.join(' ');
      if (audioHelp || speakActive) {
        speakText(fullText);
      }
    } else {
      stopSpeaking();
    }
    return () => {
      stopSpeaking();
    };
  }, [isOpen, audioHelp, speakActive]);

  if (!isOpen) return null;

  const handleToggleVoice = () => {
    if (speakActive || audioHelp) {
      stopSpeaking();
      setSpeakActive(false);
      setAudioHelp(false);
    } else {
      setSpeakActive(true);
      const fullText = emergencyDirectives.join(' ');
      speakText(fullText);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-all"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="emergency-dialog-title"
    >
      <div className="w-full max-w-lg bg-[#000000] border-4 border-fifa-red rounded-3xl p-6 shadow-2xl flex flex-col justify-between overflow-y-auto max-h-[90vh]">
        
        {/* Top Header warning */}
        <div>
          <div className="flex items-center justify-between border-b-2 border-fifa-red/40 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-8 h-8 text-fifa-red animate-pulse" />
              <div>
                <h2 id="emergency-dialog-title" className="text-xl font-extrabold text-fifa-red tracking-tight font-fifa uppercase">
                  SOS Emergency Portal
                </h2>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-0.5">
                  Evacuation & Medical Assistance
                </p>
              </div>
            </div>
            <button 
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-slate-900 border border-fifa-red/60 text-slate-400 hover:text-white"
              aria-label="Exit Emergency Mode"
            >
              <X className="w-6 h-6 text-fifa-red" />
            </button>
          </div>

          {/* Voice Assistance Button */}
          <button
            onClick={handleToggleVoice}
            className={`w-full py-3.5 px-4 mb-6 rounded-2xl border-2 font-extrabold text-sm uppercase flex items-center justify-center gap-2 transition-all ${
              audioHelp || speakActive
                ? 'bg-fifa-red text-white border-fifa-red shadow-lg'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900'
            }`}
          >
            {audioHelp || speakActive ? (
              <>
                <VolumeX className="w-5 h-5 text-white" />
                <span>Stop Vocal Assist</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 text-fifa-gold animate-bounce" />
                <span>Read Directives Out Loud</span>
              </>
            )}
          </button>

          {/* Directives Body */}
          <div className="space-y-4">
            
            {/* 1. Nearest Exits */}
            <div className="p-4 bg-slate-950 border border-fifa-red/40 rounded-xl space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-fifa-red">Nearest Emergency Exit</span>
              <h3 className="text-lg font-black text-white">Gate A (East Concourse)</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-bold">
                {accessibilityNeeds === 'wheelchair' || accessibilityNeeds === 'stroller'
                  ? 'Follow the solid green pathway to the ramp elevators. Avoid Central Gate B stairs.'
                  : 'Follow the blue signage arrows to the central exits.'}
              </p>
            </div>

            {/* 2. Medical Station */}
            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-1">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">First Aid & Trauma Clinic</span>
              <h3 className="text-sm font-extrabold text-white">Section 101 Medical Station</h3>
              <p className="text-xs text-slate-350 leading-relaxed">
                Direct exit routes linked to Gate A evacuation plaza. Paramedics are active.
              </p>
            </div>

            {/* 3. Evacuation steps */}
            <div className="p-4 bg-slate-950 border border-slate-900 rounded-xl space-y-2">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500">Safety Checklist</span>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal pl-4">
                <li>Follow security personnel in fluorescent yellow jackets.</li>
                <li>Do not stop to collect luggage or heavy bags.</li>
                <li>Assemble outside stadium gates in East Parking Lot Area 4.</li>
              </ol>
            </div>

          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-8 border-t border-slate-900 pt-4 flex flex-col gap-3">
          <a
            href="tel:911"
            className="w-full py-3 bg-[#ffffff] hover:bg-slate-100 text-black font-black text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-300 shadow-sm"
          >
            <PhoneCall className="w-4 h-4 text-fifa-red" />
            <span>Call Stadium Security Services</span>
          </a>
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 text-xs font-bold rounded-xl transition-all"
          >
            Close Emergency Panel
          </button>
        </div>

      </div>
    </div>
  );
};
