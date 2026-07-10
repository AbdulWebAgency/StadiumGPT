import React, { useState } from 'react';
import { runTests } from '../../utils/testRunner';
import { Play, ClipboardCheck, CheckCircle2, AlertOctagon, RefreshCw } from 'lucide-react';

export const TestPanel: React.FC = () => {
  const testCases = runTests();
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [hasRun, setHasRun] = useState<boolean>(false);

  const executeAllTests = () => {
    const nextResults: Record<string, { success: boolean; message: string }> = {};
    testCases.forEach((tc) => {
      nextResults[tc.name] = tc.run();
    });
    setResults(nextResults);
    setHasRun(true);
  };

  const getStats = () => {
    let passed = 0;
    let failed = 0;
    testCases.forEach((tc) => {
      const res = results[tc.name];
      if (res) {
        if (res.success) passed++;
        else failed++;
      }
    });
    return { passed, failed, total: testCases.length };
  };

  const stats = getStats();

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-1.5 font-fifa">
            <ClipboardCheck className="w-5 h-5 text-fifa-gold" /> StadiumGPT Verification Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Execute unit assertions to verify memory sync, matching engines, and layout states.
          </p>
        </div>
        <button
          onClick={executeAllTests}
          className="py-2.5 px-4 bg-fifa-green hover:bg-fifa-green-light text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md focus:outline-none focus:ring-2 focus:ring-fifa-green"
        >
          {hasRun ? <RefreshCw className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{hasRun ? 'Re-Run Assertions' : 'Run Unit Tests'}</span>
        </button>
      </div>

      {/* Test Stats Banner */}
      {hasRun && (
        <div className={`p-4 rounded-xl border flex items-center justify-between ${
          stats.failed > 0 
            ? 'bg-fifa-red/10 border-fifa-red/30 text-fifa-red-light' 
            : 'bg-emerald-950/30 border-emerald-800 text-emerald-400'
        }`}>
          <div className="text-xs font-bold space-x-4">
            <span>Total Assertions: {stats.total}</span>
            <span>Passed: {stats.passed}</span>
            <span>Failed: {stats.failed}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider py-1 px-2.5 bg-slate-950 rounded-md border border-slate-800">
            {stats.failed > 0 ? 'Verification Failed' : 'All Asserts Passed'}
          </span>
        </div>
      )}

      {/* Test Case Cards */}
      <div className="space-y-3">
        {testCases.map((tc) => {
          const outcome = results[tc.name];
          return (
            <div
              key={tc.name}
              className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex items-start justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded text-[8px] font-black uppercase">
                    {tc.category}
                  </span>
                  <h3 className="font-extrabold text-white">{tc.name}</h3>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {outcome ? outcome.message : 'Click "Run Unit Tests" to execute assertions.'}
                </p>
              </div>

              {/* Status Indicator */}
              {outcome && (
                <div className="shrink-0 mt-0.5">
                  {outcome.success ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[9px] bg-emerald-950/40 border border-emerald-900 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-fifa-red font-bold uppercase text-[9px] bg-fifa-red/10 border border-fifa-red/30 px-2 py-0.5 rounded-full">
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Fail</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
