'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';
import { 
  Radio, 
  Linkedin, 
  ExternalLink, 
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { spaceAudio } from '@/lib/audio';

const XLogo = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const SocialFeedSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'x' | 'linkedin'>('x');

  // Reload Twitter widgets if switching tabs
  useEffect(() => {
    if (activeTab === 'x' && typeof window !== 'undefined' && (window as any).twttr?.widgets) {
      (window as any).twttr.widgets.load();
    }
  }, [activeTab]);

  return (
    <section id="social-feed" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#070b14] border-t border-slate-800 relative z-10">
      {/* Official Twitter Widget Script */}
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).twttr?.widgets) {
            (window as any).twttr.widgets.load();
          }
        }}
      />

      <div className="max-w-5xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider shadow-sm">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Recent Posts & Social Updates</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Live Feed from My Profiles
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
            Recent updates, project milestones, and tech thoughts from my personal accounts on X and LinkedIn.
          </p>

          {/* Social Tabs */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setActiveTab('x');
                spaceAudio.playTelemetryBeep(1100);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md ${
                activeTab === 'x'
                  ? 'bg-white text-slate-950 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <XLogo className="w-4 h-4" />
              <span>X (Twitter) Feed: @BezaleelPaul1</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('linkedin');
                spaceAudio.playTelemetryBeep(1200);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all shadow-md ${
                activeTab === 'linkedin'
                  ? 'bg-[#0a66c2] text-white shadow-[0_0_20px_rgba(10,102,194,0.5)]'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn Profile: in/bezaleel-pauln</span>
            </button>
          </div>
        </div>

        {/* TAB 1: Live X (Twitter) Timeline Feed */}
        {activeTab === 'x' && (
          <div className="bg-[#0b0f19] border-2 border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center text-white">
                  <XLogo className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base flex items-center gap-1.5">
                    Bezaleel Paul N <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </h3>
                  <a
                    href="https://x.com/BezaleelPaul1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:underline"
                  >
                    @BezaleelPaul1
                  </a>
                </div>
              </div>

              <a
                href="https://x.com/BezaleelPaul1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => spaceAudio.playTelemetryBeep(1150)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 font-mono text-xs font-bold transition-all shadow"
              >
                <span>Follow on X</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Live Timeline Container */}
            <div className="overflow-y-auto max-h-[650px] rounded-xl border border-slate-800/80 p-2 bg-slate-950/60">
              <a
                className="twitter-timeline"
                data-theme="dark"
                data-height="650"
                data-chrome="noheader nofooter noborders transparent"
                href="https://twitter.com/BezaleelPaul1?ref_src=twsrc%5Etfw"
              >
                Loading live tweets from @BezaleelPaul1...
              </a>
            </div>

            <div className="text-center pt-2">
              <a
                href="https://x.com/BezaleelPaul1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <span>Open full profile and replies on X</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: LinkedIn Activity Feed & Profile Badge */}
        {activeTab === 'linkedin' && (
          <div className="bg-[#0b0f19] border-2 border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a66c2] flex items-center justify-center text-white shadow-md">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base flex items-center gap-1.5">
                    Bezaleel Paul N <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </h3>
                  <a
                    href="https://www.linkedin.com/in/bezaleel-pauln/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-cyan-400 hover:underline"
                  >
                    in/bezaleel-pauln
                  </a>
                </div>
              </div>

              <a
                href="https://www.linkedin.com/in/bezaleel-pauln/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => spaceAudio.playTelemetryBeep(1150)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white font-mono text-xs font-bold transition-all shadow"
              >
                <span>Connect on LinkedIn</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Direct Activity & Dispatches Card */}
            <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-6 space-y-5 text-left">
              <div className="flex items-start gap-3">
                <Linkedin className="w-6 h-6 text-[#0a66c2] shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="text-white font-bold text-base">
                    Live LinkedIn Dispatches & Recent Activity
                  </h4>
                  <p className="text-sm text-slate-300 font-sans leading-relaxed">
                    LinkedIn restricts public anonymous API access and requires authentication to stream private member activity. You can directly browse all my latest articles, professional announcements, project highlights, and peer interactions on LinkedIn:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="https://www.linkedin.com/in/bezaleel-pauln/recent-activity/all/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span className="text-xs font-mono font-bold">All Recent Posts & Activity</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
                </a>

                <a
                  href="https://www.linkedin.com/in/bezaleel-pauln/recent-activity/articles/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-mono font-bold">Published Articles & Papers</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href="https://www.linkedin.com/in/bezaleel-pauln/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <span>Visit full LinkedIn Profile</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
