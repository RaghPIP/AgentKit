'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Copy, Check, Rocket, RefreshCw } from 'lucide-react';
import { MarketReport, VerdictType } from '@/lib/types';

interface VerdictBadgeProps {
  report: MarketReport;
  onReset: () => void;
}

export function VerdictBadge({ report, onReset }: VerdictBadgeProps) {
  const [copied, setCopied] = useState(false);
  const isBuild = report.verdict === 'BUILD';
  const isSkip = report.verdict === 'SKIP';

  const handleCopyMarkdown = () => {
    const md = `
# 📡 Indie Founder Radar Report
**Idea:** ${report.idea}
**Date:** ${new Date(report.timestamp).toLocaleDateString()}

---

### 1. Top 3 Pain Points
${report.painPoints.map((p) => `- ${p}`).join('\n')}

### 2. Competitor Weaknesses
${report.competitorWeaknesses.map((w) => `- ${w}`).join('\n')}

### 3. Target Audience
${report.targetAudience}

### 4. Market Opportunity
${report.marketOpportunity}

### 5. Verdict
**${report.verdict === 'BUILD' ? 'BUILD ✅' : report.verdict === 'SKIP' ? 'SKIP ❌' : 'VERDICT UNCLEAR'}**
${report.verdictReason}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`relative rounded-3xl p-6 sm:p-8 backdrop-blur-2xl border transition-all duration-500 overflow-hidden shadow-2xl ${
        isBuild
          ? 'bg-gradient-to-b from-emerald-950/40 via-neutral-900/90 to-neutral-950 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.2)]'
          : isSkip
          ? 'bg-gradient-to-b from-rose-950/40 via-neutral-900/90 to-neutral-950 border-rose-500/40 shadow-[0_0_50px_rgba(244,63,94,0.2)]'
          : 'bg-gradient-to-b from-amber-950/40 via-neutral-900/90 to-neutral-950 border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.2)]'
      }`}
    >
      {/* Background Decorative Blur */}
      <div
        className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isBuild ? 'bg-emerald-400' : isSkip ? 'bg-rose-400' : 'bg-amber-400'
        }`}
      />

      <div className="flex flex-col items-center text-center space-y-5">
        {/* Section 5 Tag */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-400 tracking-wider uppercase">
            Section 5 • Final Verdict
          </span>
        </div>

        {/* Big Verdict Badge */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl border-2 text-2xl sm:text-4xl font-black tracking-tight shadow-xl ${
              isBuild
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-bounce [animation-duration:3s]'
                : isSkip
                ? 'bg-rose-500/20 text-rose-300 border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.4)]'
                : 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)]'
            }`}
          >
            {isBuild && <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />}
            {isSkip && <XCircle className="w-8 h-8 sm:w-10 sm:h-10 text-rose-400" />}
            {!isBuild && !isSkip && <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />}

            <span>
              {isBuild ? 'BUILD ✅' : isSkip ? 'SKIP ❌' : 'MORE RESEARCH NEEDED ⚠️'}
            </span>
          </div>
        </div>

        {/* Verdict Rationale (2 sentences) */}
        <div className="max-w-2xl bg-black/40 rounded-2xl p-5 border border-white/5 text-neutral-200 text-base sm:text-lg leading-relaxed">
          <p className="font-medium">{report.verdictReason}</p>
        </div>

        {/* Strategic Next Steps */}
        <div className="w-full max-w-2xl text-left bg-neutral-900/60 rounded-xl p-4 border border-neutral-800 text-xs sm:text-sm text-neutral-300 space-y-1.5">
          <div className="font-semibold text-neutral-200 flex items-center gap-1.5">
            <Rocket className="w-4 h-4 text-emerald-400" />
            <span>{isBuild ? 'Recommended Next Steps' : 'Pivot / Alternative Direction'}</span>
          </div>
          <p className="text-neutral-400 text-xs leading-relaxed">
            {isBuild
              ? '1. Create a 1-page waiting list to capture target audience emails. 2. Interview 5 potential users experiencing pain point #1. 3. Scope MVP strictly around competitor weaknesses.'
              : '1. Re-evaluate customer willingness-to-pay. 2. Look for adjacent enterprise niches or high-friction workflows. 3. Test narrower vertical positioning.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Full Report (Markdown)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Validate Another Idea</span>
          </button>
        </div>
      </div>
    </div>
  );
}
