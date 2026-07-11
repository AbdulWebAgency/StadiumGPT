import React, { useState, useEffect } from 'react';
import type { LostFoundReport } from '../../types';
import { createLostFoundReport, getLostFoundReports } from '../../services/firebase';
import { PackageOpen, FileText, CheckCircle2, Sparkles, Inbox } from 'lucide-react';
import { findMatchingReport } from "../../utils/matching";

interface LostFoundProps {
  userId: string;
}

export const LostFound: React.FC<LostFoundProps> = ({ userId }) => {
  const [reports, setReports] = useState<LostFoundReport[]>([]);
  const [itemType, setItemType] = useState<string>('backpack');
  const [color, setColor] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [potentialMatch, setPotentialMatch] = useState<LostFoundReport | null>(null);

  const [activeTab, setActiveTab] = useState<'lost' | 'found'>('found');

  // Load reports
  const fetchReports = async () => {
    try {
      const data = await getLostFoundReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!color.trim() || !location.trim() || !description.trim()) return;

    setLoading(true);
    setSubmitSuccess(false);
    setPotentialMatch(null);

    try {
      await createLostFoundReport({
        type: 'lost',
        item: itemType,
        color: color.trim(),
        location: location.trim(),
        description: description.trim(),
        reportedBy: userId
      });

      // Refetch reports to show in active listings
      await fetchReports();

      // Check matching logic
      const match = checkPotentialMatch(itemType, color);
      if (match) {
        setPotentialMatch(match);
      }

      setSubmitSuccess(true);
      
      // Reset form
      setColor('');
      setLocation('');
      setDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Keyword intersection matching algorithm
  const checkPotentialMatch = (
  type: string,
  colorQuery: string
): LostFoundReport | null => {
  return findMatchingReport(
    reports,
    type.toLowerCase(),
    colorQuery.toLowerCase()
  );
};

  const filteredListings = reports.filter(r => r.type === activeTab);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Potential Match Alert Card */}
      {potentialMatch && (
        <div className="bg-emerald-950 border-2 border-emerald-500 rounded-2xl p-5 flex flex-col md:flex-row items-start justify-between gap-4 shadow-lg animate-bounce-short">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-emerald-900 rounded-xl text-emerald-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase text-white tracking-wide">Potential Match Found!</h3>
              <p className="text-xs text-slate-350 mt-1">
                A matching <strong>{potentialMatch.color} {potentialMatch.item}</strong> was turned in recently.
              </p>
              <div className="mt-3 p-3 bg-slate-950/80 rounded-xl text-xs space-y-1">
                <div><span className="text-slate-500">Location Found:</span> <span className="text-slate-200">{potentialMatch.location}</span></div>
                <div><span className="text-slate-500">Description:</span> <span className="text-slate-200">{potentialMatch.description}</span></div>
                <div><span className="text-slate-500">Turned In At:</span> <span className="text-fifa-gold font-bold">Gate C Security Office</span></div>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setPotentialMatch(null)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 py-1.5 px-3 bg-slate-900 border border-emerald-800 rounded-lg shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Form (2/5 size) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg h-fit">
          <h2 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2 font-fifa mb-1">
            <PackageOpen className="w-5 h-5 text-fifa-gold" /> File a Lost Report
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
            Match-day Item Registration
          </p>

          {submitSuccess && (
            <div className="mb-4 p-3 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
              <span>Report filed successfully! Matching engine checked.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Item Category</label>
              <select
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="w-full bg-slate-850 border border-slate-700 rounded-lg text-xs font-bold py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fifa-green text-white"
              >
                <option value="backpack">Backpack / Bag</option>
                <option value="keys">Keys</option>
                <option value="phone">Phone / Tablet</option>
                <option value="wallet">Wallet / Cards</option>
                <option value="clothing">Scarf / Hat / Coat</option>
                <option value="other">Other Item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Item Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Blue, Black, Silver"
                required
                className="w-full bg-slate-850 border border-slate-700 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fifa-green text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Estimated Lost Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Section 112 Row D, Gate B plaza"
                required
                className="w-full bg-slate-850 border border-slate-700 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fifa-green text-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Item Details & Scratches</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="e.g. iPhone in a red silicon case. Wallet has driver credentials."
                required
                className="w-full bg-slate-850 border border-slate-700 rounded-lg text-xs py-2 px-3 focus:outline-none focus:ring-2 focus:ring-fifa-green text-slate-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-fifa-green hover:bg-fifa-green-light text-white font-bold text-xs rounded-lg transition-colors focus:ring-2 focus:ring-fifa-green outline-none"
            >
              {loading ? 'Searching Match...' : 'Submit & Match Report'}
            </button>
          </form>
        </div>

        {/* Right Column: Active listings (3/5 size) */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col min-h-[300px]">
          
          {/* Header tabs */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-fifa-gold" /> Stadium Items Board
            </h3>
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('found')}
                className={`py-1 px-3 rounded-md text-[10px] font-bold transition-all ${
                  activeTab === 'found' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                Found Items
              </button>
              <button
                onClick={() => setActiveTab('lost')}
                className={`py-1 px-3 rounded-md text-[10px] font-bold transition-all ${
                  activeTab === 'lost' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                Lost Items
              </button>
            </div>
          </div>

          {/* List display */}
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px]">
            {filteredListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                <Inbox className="w-10 h-10 stroke-1 mb-2" />
                <p className="text-xs font-medium">No items registered under this category.</p>
              </div>
            ) : (
              filteredListings.map((r) => (
                <div 
                  key={r.id}
                  className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl space-y-2 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-white capitalize">{r.color} {r.item}</span>
                    <span className="text-[9px] text-slate-500 font-medium">
                      {new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {r.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-[10px] pt-1.5 border-t border-slate-900 text-slate-500">
                    <div>
                      <span className="font-bold">Location:</span> <span className="text-slate-400">{r.location}</span>
                    </div>
                    {r.type === 'found' && (
                      <span className="bg-slate-905 border border-slate-800 text-fifa-gold px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase">
                        Gate C Office
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
