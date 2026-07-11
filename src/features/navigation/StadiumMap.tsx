import React, { useState, useEffect } from 'react';
import type { UserMemory } from '../../types';
import { Info, MapPin } from 'lucide-react';
import { getNavigationStyle } from "../../utils/navigation";

interface StadiumMapProps {
  memory: UserMemory;
}

export const StadiumMap: React.FC<StadiumMapProps> = ({ memory }) => {
  const [destination, setDestination] = useState<string>('gate_a');
  const [activePathStyle, setActivePathStyle] = useState<string>('standard');

  // Sync navigation style from user memory accessibility preference
  useEffect(() => {
  setActivePathStyle(getNavigationStyle(memory.accessibility));
}, [memory.accessibility]);

  // Description builder for routes based on preference
  const getRouteDescription = () => {
    const destName = destination === 'gate_a' ? 'Gate A (East)' : 
                     destination === 'gate_b' ? 'Gate B (North)' :
                     destination === 'gate_c' ? 'Gate C (West)' :
                     destination === 'gate_d' ? 'Gate D (South)' :
                     destination === 'medical' ? 'Section 101 Medical Center' : 'Section 140 Sensory Room';

    if (activePathStyle === 'stair-free') {
      return {
        title: "Stair-Free / Accessible Route Active",
        color: "text-emerald-400 border-emerald-800 bg-emerald-950/20",
        steps: [
          "Leave seating row towards elevator shaft EL-3 behind Section 110.",
          "Descend to Concourse level; follow the solid green tactile indicators.",
          "Pass the wide corridor near Section 104 ADA restrooms.",
          `Arrive safely at your destination: ${destName} via the wheelchair ramp.`
        ],
        reason: "Bypasses all staircases and escalators to suit limited-mobility, wheelchair, or stroller users."
      };
    } else if (activePathStyle === 'low-crowd') {
      return {
        title: "Sensory / Low-Crowd Route Active",
        color: "text-amber-400 border-amber-800 bg-amber-950/20",
        steps: [
          "Leave seating row and head right towards Outer Ring Concourse corridor.",
          "Follow the wider, low-congestion pathway behind Section 120.",
          "Bypass the crowded Gate B central food plaza.",
          `Arrive safely at your destination: ${destName} through the quiet outer hallway.`
        ],
        reason: "Avoids high-congestion chokepoints and noisy concession stands to minimize sensory overload."
      };
    } else {
      return {
        title: "Standard Route Active",
        color: "text-sky-400 border-sky-850 bg-sky-950/20",
        steps: [
          "Head down the central stairs to the Concourse level.",
          "Follow the blue signs along the inner concourse ring.",
          `Walk straight to your destination: ${destName}.`
        ],
        reason: "Fastest standard walking route; utilizes stairs and main congested corridors."
      };
    }
  };

  const route = getRouteDescription();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Options Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-1.5 font-fifa">
            Interactive Stadium Route Finder
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Toggle destinations and compare route options based on accessibility.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Destination Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Select Destination</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-bold text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-fifa-green"
            >
              <option value="gate_a">Gate A (East - Ramps)</option>
              <option value="gate_b">Gate B (North - Stairs)</option>
              <option value="gate_c">Gate C (West - Lifts)</option>
              <option value="gate_d">Gate D (South - Escalators)</option>
              <option value="medical">Section 101 Medical Center</option>
              <option value="sensory">Section 140 Sensory Room</option>
            </select>
          </div>

          {/* Route Style Toggler */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Navigation Preference</label>
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              {[
                { key: 'standard', label: 'Standard' },
                { key: 'stair-free', label: 'Stair-Free' },
                { key: 'low-crowd', label: 'Low-Crowd' }
              ].map((style) => (
                <button
                  key={style.key}
                  onClick={() => setActivePathStyle(style.key)}
                  className={`px-2.5 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                    activePathStyle === style.key
                      ? 'bg-fifa-green text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Map Container (2/3 columns) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[350px] relative shadow-lg">
          
          {/* Compass / Key overlay */}
          <div className="absolute top-4 left-4 bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-[10px] text-slate-300 space-y-1.5 z-10 font-bold">
            <span className="block border-b border-slate-800 pb-1 text-slate-400 font-extrabold uppercase tracking-wider">Map Legend</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-fifa-gold"></span>
              <span>Seats (Section 110 Start)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-sky-500 rounded-sm"></span>
              <span>Standard Route</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-500 rounded-sm"></span>
              <span>Stair-Free (ADA Ramps)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-amber-500 rounded-sm"></span>
              <span>Quiet Route (Low-Crowd)</span>
            </div>
          </div>

          {/* Interactive SVG Stadium Vector */}
          <svg 
            viewBox="0 0 500 500" 
            className="w-full max-w-[400px] h-auto drop-shadow-lg"
            aria-label="Stadium Map Diagram"
          >
            {/* Base grid / Pitch */}
            <rect x="180" y="200" width="140" height="100" rx="6" fill="#1b5e20" stroke="#388e3c" strokeWidth="2" />
            <line x1="250" y1="200" x2="250" y2="300" stroke="#81c784" strokeWidth="2" />
            <circle cx="250" cy="250" r="30" fill="none" stroke="#81c784" strokeWidth="2" />

            {/* Seating Tiers Outer Bowl (Concourse Ring) */}
            <circle cx="250" cy="250" r="180" fill="none" stroke="#1e293b" strokeWidth="20" />
            <circle cx="250" cy="250" r="210" fill="none" stroke="#0f172a" strokeWidth="16" />

            {/* Gates Labeling (Locations) */}
            {/* Gate B: North (Top) */}
            <rect x="230" y="10" width="40" height="24" rx="4" fill="#020617" stroke="#334155" strokeWidth="1.5" />
            <text x="250" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Gate B</text>

            {/* Gate A: East (Right) */}
            <rect x="440" y="238" width="40" height="24" rx="4" fill="#020617" stroke="#334155" strokeWidth="1.5" />
            <text x="460" y="254" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Gate A</text>

            {/* Gate D: South (Bottom) */}
            <rect x="230" y="466" width="40" height="24" rx="4" fill="#020617" stroke="#334155" strokeWidth="1.5" />
            <text x="250" y="482" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Gate D</text>

            {/* Gate C: West (Left) */}
            <rect x="20" y="238" width="40" height="24" rx="4" fill="#020617" stroke="#334155" strokeWidth="1.5" />
            <text x="40" y="254" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold">Gate C</text>

            {/* Special Facilities Markers */}
            {/* Section 101 Medical (Near Gate A top-right) */}
            <circle cx="390" cy="140" r="12" fill="#D1193E" />
            <text x="390" y="143" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">+</text>

            {/* Section 140 Sensory Room (Near Gate C bottom-left) */}
            <circle cx="110" cy="360" r="12" fill="#006B3F" />
            <text x="110" y="363" textAnchor="middle" fill="#FFB800" fontSize="9" fontWeight="bold">S</text>

            {/* Starting Seats Mark (Section 110) */}
            <circle cx="250" cy="390" r="8" fill="#FFB800" className="animate-ping" />
            <circle cx="250" cy="390" r="6" fill="#FFB800" />
            <text x="250" y="412" textAnchor="middle" fill="#FFB800" fontSize="9" fontWeight="extrabold">YOUR SEATS</text>

            {/* ----------------------------------------------------
                DYNAMIC PATHWAYS (Standard, Stair-Free, Quiet)
                ---------------------------------------------------- */}

            {/* 1. PATH TO GATE A */}
            {destination === 'gate_a' && (
              <>
                {/* Standard Route to Gate A: goes through inner bowl stairs */}
                <path 
                  d="M 250 390 Q 360 390 410 320 Q 420 280 440 250" 
                  fill="none" 
                  stroke="#0284c7" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'standard' ? 'none' : '4,4'} 
                  opacity={activePathStyle === 'standard' ? 1 : 0.25}
                  className="transition-all duration-300"
                />

                {/* Stair-Free Route to Gate A: passes through concourse ramps */}
                <path 
                  d="M 250 390 Q 330 430 400 390 Q 440 330 440 250" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="4" 
                  strokeDasharray={activePathStyle === 'stair-free' ? 'none' : '6,6'}
                  opacity={activePathStyle === 'stair-free' ? 1 : 0.25}
                  className="transition-all duration-300"
                />

                {/* Low-Crowd Route to Gate A: utilizes outer ring */}
                <path 
                  d="M 250 390 Q 380 450 440 350 Q 460 300 440 250" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'low-crowd' ? 'none' : '5,5'}
                  opacity={activePathStyle === 'low-crowd' ? 1 : 0.25}
                  className="transition-all duration-300"
                />
              </>
            )}

            {/* 2. PATH TO GATE B */}
            {destination === 'gate_b' && (
              <>
                <path 
                  d="M 250 390 Q 150 350 120 250 Q 150 150 250 34" 
                  fill="none" 
                  stroke="#0284c7" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'standard' ? 'none' : '4,4'} 
                  opacity={activePathStyle === 'standard' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 360 410 410 250 Q 360 90 250 34" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="4" 
                  strokeDasharray={activePathStyle === 'stair-free' ? 'none' : '6,6'}
                  opacity={activePathStyle === 'stair-free' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 390 350 430 250 Q 390 150 250 34" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'low-crowd' ? 'none' : '5,5'}
                  opacity={activePathStyle === 'low-crowd' ? 1 : 0.25}
                />
              </>
            )}

            {/* 3. PATH TO GATE C */}
            {destination === 'gate_c' && (
              <>
                <path 
                  d="M 250 390 Q 140 390 90 320 Q 80 280 60 250" 
                  fill="none" 
                  stroke="#0284c7" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'standard' ? 'none' : '4,4'} 
                  opacity={activePathStyle === 'standard' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 170 430 100 390 Q 60 330 60 250" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="4" 
                  strokeDasharray={activePathStyle === 'stair-free' ? 'none' : '6,6'}
                  opacity={activePathStyle === 'stair-free' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 120 450 60 350 Q 40 300 60 250" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'low-crowd' ? 'none' : '5,5'}
                  opacity={activePathStyle === 'low-crowd' ? 1 : 0.25}
                />
              </>
            )}

            {/* 4. PATH TO GATE D */}
            {destination === 'gate_d' && (
              <>
                <path 
                  d="M 250 390 Q 250 430 250 466" 
                  fill="none" 
                  stroke="#0284c7" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'standard' ? 'none' : '4,4'} 
                  opacity={activePathStyle === 'standard' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 280 430 250 466" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="4" 
                  strokeDasharray={activePathStyle === 'stair-free' ? 'none' : '6,6'}
                  opacity={activePathStyle === 'stair-free' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 220 430 250 466" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'low-crowd' ? 'none' : '5,5'}
                  opacity={activePathStyle === 'low-crowd' ? 1 : 0.25}
                />
              </>
            )}

            {/* 5. PATH TO MEDICAL */}
            {destination === 'medical' && (
              <>
                <path 
                  d="M 250 390 Q 360 390 390 152" 
                  fill="none" 
                  stroke="#0284c7" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'standard' ? 'none' : '4,4'} 
                  opacity={activePathStyle === 'standard' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 420 390 390 152" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="4" 
                  strokeDasharray={activePathStyle === 'stair-free' ? 'none' : '6,6'}
                  opacity={activePathStyle === 'stair-free' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 320 340 390 152" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'low-crowd' ? 'none' : '5,5'}
                  opacity={activePathStyle === 'low-crowd' ? 1 : 0.25}
                />
              </>
            )}

            {/* 6. PATH TO SENSORY */}
            {destination === 'sensory' && (
              <>
                <path 
                  d="M 250 390 Q 180 390 122 360" 
                  fill="none" 
                  stroke="#0284c7" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'standard' ? 'none' : '4,4'} 
                  opacity={activePathStyle === 'standard' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 200 420 122 360" 
                  fill="none" 
                  stroke="#10b981" 
                  strokeWidth="4" 
                  strokeDasharray={activePathStyle === 'stair-free' ? 'none' : '6,6'}
                  opacity={activePathStyle === 'stair-free' ? 1 : 0.25}
                />
                <path 
                  d="M 250 390 Q 150 340 122 360" 
                  fill="none" 
                  stroke="#f59e0b" 
                  strokeWidth="3" 
                  strokeDasharray={activePathStyle === 'low-crowd' ? 'none' : '5,5'}
                  opacity={activePathStyle === 'low-crowd' ? 1 : 0.25}
                />
              </>
            )}

          </svg>
        </div>

        {/* Route Details Panel (1/3 columns) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Header / Active Style */}
            <div className={`p-3 rounded-xl border font-bold ${route.color}`}>
              <div className="text-xs uppercase tracking-wider font-extrabold flex items-center gap-1.5">
                <MapPin className="w-4 h-4 shrink-0" />
                {route.title}
              </div>
              <p className="text-[10px] mt-1 opacity-90 leading-relaxed">
                {route.reason}
              </p>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Navigation Steps</h3>
              <ol className="space-y-2.5">
                {route.steps.map((stepText, idx) => (
                  <li key={idx} className="flex gap-2 text-xs text-slate-300 leading-relaxed">
                    <span className="w-5 h-5 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-extrabold text-[10px] text-fifa-gold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{stepText}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

          {/* Footer warning */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex gap-2 text-[10px] text-slate-400">
            <Info className="w-4 h-4 text-fifa-gold shrink-0" />
            <span>Map path utilizes MetLife Stadium Concourse Level layout. In case of emergency evacuation, ignore standard routes and look for highlighted green arrows leading directly to fire doors.</span>
          </div>

        </div>

      </div>

    </div>
  );
};
