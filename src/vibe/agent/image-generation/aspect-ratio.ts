/**
 * Aspect ratio handling for image generation (pure, server + client safe).
 *
 * The AI asks for a ratio ("16:9"). Every provider gets the closest ratio it
 * can actually produce: ratio-native providers (OpenRouter) get the
 * ratio itself (snapped to the model's supported list when the model has
 * one), size-based providers (Venice, OpenAI, fal, Replicate) get the nearest
 * size preset. The tool result then reports the real pixel size of the file,
 * so nobody announces 16:9 for a square image.
 */

import { ImageSize, type ImageSizeValue } from "./enum";

/** Ratios the generate_image tool accepts (AI, MCP, CLI, web). */
export const IMAGE_ASPECT_RATIOS = [
  "1:1",
  "16:9",
  "9:16",
  "4:3",
  "3:4",
  "3:2",
  "2:3",
  "21:9",
] as const;

export type ImageAspectRatio = (typeof IMAGE_ASPECT_RATIOS)[number];

/** "16:9" → 1.777…, null for anything that is not `W:H` with positive numbers. */
export function parseAspectRatio(ratio: string): number | null {
  const match = /^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/.exec(ratio.trim());
  if (!match?.[1] || !match[2]) {
    return null;
  }
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (!(width > 0) || !(height > 0)) {
    return null;
  }
  return width / height;
}

/** Distance of two ratios on a log scale (2:1 and 1:2 are equally far from 1:1). */
function ratioDistance(a: number, b: number): number {
  return Math.abs(Math.log(a) - Math.log(b));
}

/** ModelsLab v6 image requests accept 256–1024 pixels in multiples of eight. */
export function modelsLabImageDimensions(
  aspectRatio: string | undefined,
): { width: number; height: number } | undefined {
  const ratio = aspectRatio ? parseAspectRatio(aspectRatio) : null;
  if (ratio === null) {
    return undefined;
  }
  const shortSide = Math.max(
    256,
    Math.round(128 * Math.min(ratio, 1 / ratio)) * 8,
  );
  return ratio >= 1
    ? { width: 1024, height: shortSide }
    : { width: shortSide, height: 1024 };
}

/**
 * The supported ratio closest to `requested`. An empty or missing list means
 * the model takes any ratio: `requested` is returned unchanged. Unparseable
 * entries in the list are ignored.
 */
export function snapAspectRatio(
  requested: string,
  supported: readonly string[] | undefined,
): string {
  const target = parseAspectRatio(requested);
  if (target === null || !supported || supported.length === 0) {
    return requested;
  }
  if (supported.includes(requested)) {
    return requested;
  }
  let best: string | undefined;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const candidate of supported) {
    const value = parseAspectRatio(candidate);
    if (value === null) {
      continue;
    }
    const distance = ratioDistance(value, target);
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
    }
  }
  return best ?? requested;
}

/** Pixel ratio of each size preset. */
const SIZE_RATIOS: ReadonlyArray<{
  size: typeof ImageSizeValue;
  ratio: number;
}> = [
  { size: ImageSize.SQUARE_1024, ratio: 1 },
  { size: ImageSize.LANDSCAPE_1792, ratio: 1792 / 1024 },
  { size: ImageSize.PORTRAIT_1792, ratio: 1024 / 1792 },
];

/**
 * Nearest size preset for a ratio, for providers that take a size instead of
 * a ratio. `allowed` (the model's supportedSizes) restricts the candidates
 * when non-empty.
 */
export function aspectRatioToImageSize(
  ratio: string,
  allowed?: readonly string[],
): typeof ImageSizeValue {
  const target = parseAspectRatio(ratio);
  const candidates =
    allowed && allowed.length > 0
      ? SIZE_RATIOS.filter((entry) => allowed.includes(entry.size))
      : SIZE_RATIOS;
  if (target === null || candidates.length === 0) {
    return ImageSize.SQUARE_1024;
  }
  let best = candidates[0];
  for (const entry of candidates) {
    if (
      best &&
      ratioDistance(entry.ratio, target) < ratioDistance(best.ratio, target)
    ) {
      best = entry;
    }
  }
  return best?.size ?? ImageSize.SQUARE_1024;
}

/**
 * `W:H` label of a real pixel size: the named ratio within 1 % when there is
 * one (2048x1152 → "16:9", 1792x1024 → "7:4"), else the reduced fraction.
 */
export function describeAspectRatio(width: number, height: number): string {
  const w = Math.round(width);
  const h = Math.round(height);
  if (!(w > 0) || !(h > 0)) {
    return "1:1";
  }
  const actual = w / h;
  for (const named of [...IMAGE_ASPECT_RATIOS, "7:4", "4:7", "5:4", "4:5"]) {
    const value = parseAspectRatio(named);
    if (value !== null && ratioDistance(value, actual) < 0.01) {
      return named;
    }
  }
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(w, h) || 1;
  return `${String(w / divisor)}:${String(h / divisor)}`;
}

/** Narrow a model's ratio list entry to a ratio the tool accepts. */
export function isImageAspectRatio(ratio: string): ratio is ImageAspectRatio {
  return IMAGE_ASPECT_RATIOS.some((entry) => entry === ratio);
}
