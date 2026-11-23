'use client';

import React, { useMemo, useState } from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import { GitHubAnalyticsData } from '@/types/portfolio';

interface GitHubAnalyticsSectionProps {
  data: GitHubAnalyticsData;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDay = (date: string) => {
  const [, month, day] = date.split('-').map(Number);
  return `${String(day).padStart(2, '0')} ${months[month - 1]}`;
};

export const GitHubAnalyticsSection: React.FC<GitHubAnalyticsSectionProps> = ({ data }) => {
  const initialIndex = Math.max(0, data.series.length - 1);
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const selectedPoint = data.series[selectedIndex];

  const chart = useMemo(() => {
    const width = 720;
    const height = 150;
    const pad = 10;
    const max = Math.max(...data.series.map((point) => point.count), 1);
    const points = data.series.map((point, index) => {
      const x = pad + (index / Math.max(1, data.series.length - 1)) * (width - pad * 2);
      const y = pad + (1 - point.count / max) * (height - pad * 2);
      return { x, y };
    });
    return {
      polyline: points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' '),
      area: `${pad},${height - pad} ${points
        .map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
        .join(' ')} ${width - pad},${height - pad}`,
    };
  }, [data.series]);

  return (
    <section id="github" className="border-t border-ink/10 bg-paper-warm py-24 sm:py-32">
      <div className="section-shell">
        <header
          className="grid gap-8 border-b border-ink/15 pb-10 lg:grid-cols-12 lg:items-end"
          data-reveal
        >
          <div className="lg:col-span-8">
            <p className="eyebrow text-ink/45">07 / Activity</p>
            <h2 className="serif-display mt-5 max-w-3xl text-5xl text-ink sm:text-7xl">
              A record of steady, visible work.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/55 lg:col-span-4 lg:ml-auto">
            A recent 30-day snapshot of commits, public repositories, and competitive programming.
          </p>
        </header>

        <div
          className="grid grid-cols-2 border-b border-ink/15 sm:grid-cols-5"
          data-reveal-group
        >
          {[
            ['30d commits', data.stats.total30d],
            ['Public repos', data.stats.repos],
            ['Stars earned', data.stats.stars],
            ['LeetCode', data.cp.leetcode.solved],
            ['Codeforces', data.cp.codeforces.rating],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-r border-ink/10 py-7 pr-4 last:border-r-0 sm:px-5 sm:first:pl-0"
              data-reveal-item
            >
              <span
                className="block font-mono text-2xl font-medium text-ink sm:text-3xl"
                data-count={value}
              >
                {value}
              </span>
              <span className="eyebrow mt-2 block text-[8px] text-ink/40">{label}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-12 pt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8" data-reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow text-ink/40">Daily commit cadence</p>
                <p className="mt-3 font-mono text-sm text-ink" aria-live="polite">
                  {formatDay(selectedPoint.date)} · {selectedPoint.count} commit
                  {selectedPoint.count === 1 ? '' : 's'}
                </p>
              </div>
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-ink/35">
                Select a day to inspect
              </p>
            </div>

            <div className="mt-8 overflow-hidden">
              <svg
                viewBox="0 0 720 150"
                className="h-32 w-full overflow-visible"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="commit-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#111411" stopOpacity="0.16" />
                    <stop offset="100%" stopColor="#111411" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={chart.area} fill="url(#commit-area)" />
                <polyline
                  data-draw
                  points={chart.polyline}
                  fill="none"
                  stroke="#111411"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <div
              className="mt-4 grid grid-cols-10 gap-1.5"
              role="group"
              aria-label="Daily commit activity"
            >
              {data.series.map((point, index) => {
                const dayLabel = formatDay(point.date);
                const commitLabel = `${point.count} commit${point.count === 1 ? '' : 's'}`;
                const selected = index === selectedIndex;
                const tone =
                  point.count === 0
                    ? 'bg-ink/10'
                    : point.count <= 2
                      ? 'bg-ink/35'
                      : point.count <= 5
                        ? 'bg-ink/65'
                        : 'bg-ink';
                return (
                  <button
                    key={point.date}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    aria-label={`${dayLabel}: ${commitLabel}`}
                    aria-pressed={selected}
                    title={`${dayLabel}: ${commitLabel}`}
                    className={`h-5 rounded-[2px] transition-all sm:h-6 ${tone} ${
                      selected ? 'ring-2 ring-ink ring-offset-2 ring-offset-paper-warm' : 'hover:opacity-70'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-4" data-reveal data-reveal-delay="80">
            <div className="border-t border-ink/20 pt-5">
              <div className="flex items-center justify-between">
                <p className="eyebrow text-ink/40">Repositories</p>
                <a
                  href="https://github.com/BezaleelPaul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/45 hover:text-ink"
                >
                  GitHub
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
              <div className="mt-4">
                {data.topRepos.map((repo) => (
                  <a
                    key={repo.name}
                    href={`https://github.com/BezaleelPaul/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block border-b border-ink/10 py-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-[11px] font-semibold text-ink group-hover:underline">
                        {repo.name}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-[9px] text-ink/40">
                        <Star className="h-3 w-3" />
                        {repo.stars}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink/50">{repo.description}</p>
                    <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.1em] text-ink/35">
                      {repo.language}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
