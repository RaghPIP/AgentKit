'use client';

import React, { useState } from 'react';
import { Search, Loader2, ArrowRight, Lightbulb, Sparkles } from 'lucide-react';

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

const EXAMPLE_IDEAS = [
  {
    title: '🚀 Micro-SaaS Dynamic Pricing',
    idea: 'An AI copilot that monitors Stripe churn and competitor pricing pages to recommend dynamic tier pricing for solo SaaS founders.',
  },
  {
    title: '⚡ Notion-to-Shopify Sync',
    idea: 'A lightweight sync engine that lets digital creators manage product inventory and digital downloads inside Notion and auto-publish to Shopify.',
  },
  {
    title: '🛡️ Solo SOC-2 Compliance',
    idea: 'Automated compliance checklist and screenshot evidence collector tailored for single-founder dev tools selling to enterprise.',
  },
  {
    title: '🎙️ AI Podcast to Newsletter',
    idea: 'An agent that takes YouTube / Spotify podcast episodes and generates deeply researched, editorial-grade Substack newsletters with key timestamps.',
  },
];

export function IdeaInput({ onSubmit, isLoading }: IdeaInputProps) {
  const [inputIdea, setInputIdea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputIdea.trim() || isLoading) return;
    onSubmit(inputIdea.trim());
  };

  const handleSelectExample = (idea: string) => {
    setInputIdea(idea);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative rounded-2xl bg-neutral-900/90 border border-neutral-800 p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 focus-within:border-emerald-500/50 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.15)]">
          <textarea
            value={inputIdea}
            onChange={(e) => setInputIdea(e.target.value)}
            disabled={isLoading}
            placeholder="Enter your startup idea (e.g., A tool that converts Figma designs directly into production-ready React Native components for solo mobile devs)..."
            rows={4}
            className="w-full bg-transparent px-4 py-3 text-neutral-100 placeholder-neutral-500 resize-none outline-none text-base sm:text-lg rounded-xl focus:ring-0 leading-relaxed disabled:opacity-60"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 border-t border-neutral-800/60 mt-1">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Be specific about target user & problem for the sharpest analysis</span>
            </div>

            <button
              type="submit"
              disabled={!inputIdea.trim() || isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 to-teal-600 text-black hover:from-emerald-400 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] active:scale-95 disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Scanning Market...</span>
                </>
              ) : (
                <>
                  <span>Scan Market & Validate</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Example Presets */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium px-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Or try one of these example ideas:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXAMPLE_IDEAS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectExample(item.idea)}
              disabled={isLoading}
              className="text-left p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/80 hover:border-neutral-700 text-xs transition-all duration-150 group cursor-pointer disabled:opacity-50"
            >
              <div className="font-semibold text-neutral-200 group-hover:text-emerald-400 transition-colors">
                {item.title}
              </div>
              <p className="text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                {item.idea}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
