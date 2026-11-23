import React from 'react';
import { AtlasConstellation } from '@/data/workAtlas';
import { buildConstellationLayout } from '@/lib/workAtlasGeometry';

interface AtlasFallbackMapProps {
  constellations: AtlasConstellation[];
  selectedId: string | null;
  reveal: number;
}

export const AtlasFallbackMap: React.FC<AtlasFallbackMapProps> = ({
  constellations,
  selectedId,
  reveal,
}) => {
  return (
    <svg
      viewBox="-13 -9 26 18"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="atlas-fallback-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d9ff63" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#d9ff63" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="0" cy="0" rx="12" ry="8" fill="url(#atlas-fallback-glow)" opacity="0.35" />

      {constellations.map((constellation) => {
        const isSelected = selectedId === constellation.project.id;
        const isDimmed = Boolean(selectedId && !isSelected);
        const layout = buildConstellationLayout(
          constellation.project.id,
          constellation.shape,
          constellation.commits.length + 1,
          constellation.anchor
        );
        const dates = [
          new Date(constellation.createdAt).getTime(),
          ...constellation.commits.map((commit) => new Date(commit.date).getTime()),
        ];
        const visible = dates.map((date) => date <= reveal);
        const hasVisibleStars = visible.some(Boolean);
        const color = isSelected ? '#d9ff63' : '#f1efe7';
        const opacity = isDimmed ? 0.12 : hasVisibleStars ? 1 : 0.16;

        return (
          <g key={constellation.project.id} opacity={opacity}>
            <polyline
              points={layout.linePositions.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="none"
              stroke={color}
              strokeOpacity={isSelected ? 0.5 : 0.2}
              strokeWidth={0.035}
              strokeLinejoin="round"
            />
            {layout.starPositions.map(([x, y], index) => (
              visible[index] ? (
                <circle
                  key={`${constellation.project.id}-${index}`}
                  cx={x}
                  cy={y}
                  r={index === 0 ? 0.11 : 0.055}
                  fill={color}
                />
              ) : null
            ))}
            <text
              x={layout.labelPosition[0]}
              y={layout.labelPosition[1]}
              textAnchor="middle"
              fill={color}
              fillOpacity={isDimmed ? 0.3 : 0.75}
              fontSize="0.46"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.08"
            >
              {constellation.shortTitle.toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};
