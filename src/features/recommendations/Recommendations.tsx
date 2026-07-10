import React, { useState } from 'react';
import type { UserMemory } from '../../types';
import { facilities } from '../../utils/facilitiesData';
import { Utensils, Droplet, Armchair, Shield, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RecommendationsProps {
  memory: UserMemory;
}

export const Recommendations: React.FC<RecommendationsProps> = ({ memory }) => {
  const [filterType, setFilterType] = useState<string>('all');

  // Filter facilities
  const filteredFacilities = facilities.filter(fac => {
    // Type filter
    if (filterType !== 'all') {
      if (filterType === 'food' && fac.type !== 'food') return false;
      if (filterType === 'water' && fac.type !== 'water') return false;
      if (filterType === 'restroom' && fac.type !== 'restroom') return false;
      if (filterType === 'quiet' && fac.type !== 'quiet') return false;
    }
    return true;
  });

  // Calculate personalization details for a facility
  const getPersonalizationVerdict = (fac: any) => {
    const alerts: string[] = [];
    const points: string[] = [];
    let score = 0; // matching points

    // Accessibility check
    if (memory.accessibility === 'wheelchair') {
      if (fac.wheelchairAccessible) {
        points.push('Fits wheelchair/ramp needs');
        score += 2;
      } else {
        alerts.push('Requires stairs access');
      }
    } else if (memory.accessibility === 'stroller') {
      if (fac.strollerFriendly) {
        points.push('Fits stroller clearance');
        score += 2;
      } else {
        alerts.push('No stroller ramps');
      }
    } else if (memory.accessibility === 'sensory') {
      if (fac.sensoryFriendly) {
        points.push('Quiet sensory-friendly area');
        score += 2;
      }
      if (fac.crowdLevel === 'low') {
        points.push('Low crowd density corridor');
        score += 1;
      } else if (fac.crowdLevel === 'high') {
        alerts.push('High-noise crowded queue');
      }
    }

    // Dietary check (only for food stalls)
    if (fac.type === 'food' && memory.dietary !== 'none') {
      const detailsLower = fac.details.toLowerCase();
      if (memory.dietary === 'vegan' && (detailsLower.includes('vegan') || detailsLower.includes('vegetarian'))) {
        points.push('Vegan options available');
        score += 3;
      } else if (memory.dietary === 'halal' && detailsLower.includes('halal')) {
        points.push('Halal menu options');
        score += 3;
      } else if (memory.dietary === 'gluten-free' && (detailsLower.includes('gluten-free') || detailsLower.includes('gluten free'))) {
        points.push('Gluten-Free safe food');
        score += 3;
      } else {
        alerts.push(`No confirmed ${memory.dietary} menu`);
      }
    }

    // Generate reasoning string
    let reasoning = '';
    if (score > 0) {
      reasoning = `Recommended because it matches your active profile settings: ${points.join(', ')}.`;
      if (alerts.length > 0) {
        reasoning += ` Note: ${alerts.join('. ')}.`;
      }
    } else {
      reasoning = `Standard facility available near ${fac.location}.`;
      if (alerts.length > 0) {
        reasoning += ` Caution: ${alerts.join('. ')}.`;
      }
    }

    return {
      score,
      points,
      alerts,
      reasoning,
      isRecommended: score > 0 && alerts.length === 0,
      hasWarning: alerts.length > 0
    };
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'food': return <Utensils className="w-5 h-5 text-fifa-gold" />;
      case 'water': return <Droplet className="w-5 h-5 text-sky-400" />;
      case 'restroom': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      default: return <Armchair className="w-5 h-5 text-purple-400" />;
    }
  };

  // Sort facilities to put recommendations first
  const sortedFacilities = [...filteredFacilities].sort((a, b) => {
    const scoreA = getPersonalizationVerdict(a).score;
    const scoreB = getPersonalizationVerdict(b).score;
    return scoreB - scoreA;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Category filters */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-inner gap-1 overflow-x-auto">
        {[
          { key: 'all', label: 'All Facilities' },
          { key: 'food', label: 'Food & Drinks' },
          { key: 'water', label: 'Hydration Points' },
          { key: 'restroom', label: 'Restrooms' },
          { key: 'quiet', label: 'Quiet Zones' }
        ].map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilterType(btn.key)}
            className={`py-2.5 px-4 rounded-lg text-xs font-bold whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-fifa-green ${
              filterType === btn.key
                ? 'bg-fifa-green text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedFacilities.map((fac) => {
          const verdict = getPersonalizationVerdict(fac);
          return (
            <div
              key={fac.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                verdict.isRecommended 
                  ? 'border-emerald-800/80 ring-2 ring-emerald-900/30' 
                  : verdict.hasWarning 
                  ? 'border-amber-900/50 opacity-80 hover:opacity-100' 
                  : 'border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {getIcon(fac.type)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-tight">{fac.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{fac.location}</p>
                    </div>
                  </div>

                  {/* Top Badge */}
                  {verdict.isRecommended && (
                    <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> Best Match
                    </span>
                  )}
                  {verdict.hasWarning && (
                    <span className="bg-amber-950 border border-amber-900 text-amber-500 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                      <AlertCircle className="w-2.5 h-2.5" /> Mobility Alert
                    </span>
                  )}
                </div>

                {/* Details */}
                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {fac.details}
                </p>

                {/* Attributes Icons row */}
                <div className="flex gap-4 mt-3 border-t border-b border-slate-950 py-2">
                  <div className="text-[10px] font-bold">
                    <span className="text-slate-500 block uppercase">Gate Access</span>
                    <span className="text-slate-300 uppercase">Gate {fac.gate}</span>
                  </div>
                  <div className="text-[10px] font-bold">
                    <span className="text-slate-500 block uppercase">Queue Load</span>
                    <span className={`capitalize ${
                      fac.crowdLevel === 'low' ? 'text-emerald-400' :
                      fac.crowdLevel === 'medium' ? 'text-amber-400' : 'text-fifa-red'
                    }`}>{fac.crowdLevel}</span>
                  </div>
                  <div className="text-[10px] font-bold">
                    <span className="text-slate-500 block uppercase">ADA Ramps</span>
                    <span className={fac.wheelchairAccessible ? 'text-emerald-400' : 'text-slate-500'}>
                      {fac.wheelchairAccessible ? 'Available' : 'None'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Personalized reasoning footer */}
              <div className="mt-4 pt-3 border-t border-slate-950 flex items-start gap-1.5 text-[10px] leading-relaxed text-slate-400">
                <Shield className={`w-4 h-4 shrink-0 mt-0.5 ${verdict.isRecommended ? 'text-emerald-500' : 'text-slate-500'}`} />
                <span>
                  {verdict.reasoning}
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
