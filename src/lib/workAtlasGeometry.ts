export type AtlasPoint = [number, number, number];

const shapes: Array<Array<[number, number]>> = [
  [[-1.7, 0.2], [-0.9, 0.9], [0.1, 0.2], [0.9, 1.2], [1.7, 0.4], [0.8, -0.5]],
  [[-1.8, -0.5], [-0.8, 0.6], [0.2, 0.2], [0.8, -0.7], [1.7, 0.1], [1.0, 1.1]],
  [[-1.7, 0.8], [-0.7, 0.1], [0.2, 0.7], [1.0, 0.1], [1.7, 0.9], [0.7, -0.6], [-0.4, -0.8]],
  [[-1.6, -0.3], [-0.7, 0.8], [0.3, 0.3], [1.1, 1.0], [1.8, -0.2], [0.9, -0.8]],
  [[-1.7, 0.1], [-0.9, -0.9], [0.1, -0.2], [0.8, 0.8], [1.6, 0.2], [0.7, -0.6], [-0.2, 1.0]],
];

const seededRandom = (seedText: string) => {
  let seed = 2166136261;
  for (let index = 0; index < seedText.length; index += 1) {
    seed ^= seedText.charCodeAt(index);
    seed = Math.imul(seed, 16777619);
  }
  return () => {
    seed += 0x6D2B79F5;
    let value = seed;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export interface ConstellationLayout {
  starPositions: AtlasPoint[];
  linePositions: AtlasPoint[];
  labelPosition: AtlasPoint;
}

export const buildConstellationLayout = (
  id: string,
  shapeIndex: number,
  starCount: number,
  anchor: AtlasPoint
): ConstellationLayout => {
  const shape = shapes[shapeIndex % shapes.length];
  const scale = 1.8;
  const random = seededRandom(id);
  const [anchorX, anchorY, anchorZ] = anchor;

  const backbone = shape.map(([x, y], index): AtlasPoint => [
    anchorX + x * scale,
    anchorY + y * scale,
    anchorZ + Math.sin(index * 1.8) * 0.55,
  ]);

  const starPositions: AtlasPoint[] = [];
  for (let index = 0; index < starCount; index += 1) {
    if (index === 0) {
      starPositions.push([...backbone[0]]);
      continue;
    }

    const segmentIndex = (index - 1) % (backbone.length - 1);
    const start = backbone[segmentIndex];
    const end = backbone[segmentIndex + 1];
    const t = 0.18 + random() * 0.64;
    const jitterX = (random() - 0.5) * 0.62;
    const jitterY = (random() - 0.5) * 0.62;
    const jitterZ = (random() - 0.5) * 1.1;

    starPositions.push([
      start[0] + (end[0] - start[0]) * t + jitterX,
      start[1] + (end[1] - start[1]) * t + jitterY,
      start[2] + (end[2] - start[2]) * t + jitterZ,
    ]);
  }

  return {
    starPositions,
    linePositions: backbone,
    labelPosition: [anchorX, anchorY + 3.35, anchorZ],
  };
};
