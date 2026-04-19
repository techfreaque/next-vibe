/**
 * Derives a full CSS variable palette (light + dark) from a single hex color.
 *
 * The generated values follow the same HSL patterns observed across the 11
 * hand-tuned palettes in design-test/palette-switcher.tsx.  Semantic colors
 * (destructive, success, warning, info) are constants — only hue-derived
 * tokens change.
 */

// ── hex → HSL ────────────────────────────────────────────────────────────────

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// ── helpers ──────────────────────────────────────────────────────────────────

/** Format as the CSS-var value Tailwind expects: "H S% L%" */
function hsl(h: number, s: number, l: number): string {
  return `${h} ${Math.max(0, Math.min(100, s))}% ${Math.max(0, Math.min(100, l))}%`;
}

/** Clamp a number between min and max */
function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

// ── palette generation ───────────────────────────────────────────────────────

interface PaletteMode {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  success: string;
  "success-foreground": string;
  warning: string;
  "warning-foreground": string;
  info: string;
  "info-foreground": string;
  border: string;
  input: string;
  ring: string;
}

export interface GeneratedPalette {
  light: PaletteMode;
  dark: PaletteMode;
}

/**
 * Derive a complete 25-variable palette (light + dark) from a single hex color.
 * The input color becomes `--primary` in light mode.
 */
export function generatePalette(hex: string): GeneratedPalette {
  const { h, s } = hexToHsl(hex);

  // Derived saturation levels — reduced for surfaces, full for primary
  const surfaceSat = clamp(Math.round(s * 0.35), 10, 40);
  const midSat = clamp(Math.round(s * 0.55), 15, 50);

  const light: PaletteMode = {
    // Surfaces — very light tint of the hue
    background: hsl(h, surfaceSat, 97),
    foreground: hsl(h, clamp(Math.round(s * 0.4), 14, 47), 11),
    card: hsl(0, 0, 100),
    "card-foreground": hsl(h, clamp(Math.round(s * 0.4), 14, 47), 11),
    popover: hsl(0, 0, 100),
    "popover-foreground": hsl(h, clamp(Math.round(s * 0.4), 14, 47), 11),

    // Primary — the accent color itself
    primary: hsl(h, s, clamp(Math.round(s > 50 ? 45 : 40), 35, 55)),
    "primary-foreground": "0 0% 100%",

    // Secondary — very light, subtle hue
    secondary: hsl(h, midSat, 94),
    "secondary-foreground": hsl(h, clamp(Math.round(s * 0.3), 10, 25), 18),

    // Muted — even subtler
    muted: hsl(h, clamp(Math.round(s * 0.25), 10, 25), 95),
    "muted-foreground": hsl(h, clamp(Math.round(s * 0.15), 8, 16), 47),

    // Accent — light wash
    accent: hsl(h, clamp(Math.round(s * 0.7), 30, 80), 95),
    "accent-foreground": hsl(h, clamp(Math.round(s * 0.3), 10, 25), 17),

    // Semantic — constants across all palettes
    destructive: "0 72% 51%",
    "destructive-foreground": "0 0% 100%",
    success: "142 71% 45%",
    "success-foreground": "0 0% 100%",
    warning: "37 91% 55%",
    "warning-foreground": "0 0% 100%",
    info: "192 91% 36%",
    "info-foreground": "0 0% 100%",

    // Chrome
    border: hsl(h, clamp(Math.round(s * 0.25), 12, 30), 89),
    input: hsl(h, clamp(Math.round(s * 0.25), 12, 30), 89),
    ring: hsl(h, s, clamp(Math.round(s > 50 ? 45 : 40), 35, 55)),
  };

  // Dark mode — saturated primary, very dark surfaces tinted with hue
  const darkPrimarySat = clamp(Math.round(s * 1.1), 60, 96);
  const darkPrimaryL = clamp(Math.round(s > 50 ? 55 : 50), 48, 60);

  const dark: PaletteMode = {
    background: hsl(h, clamp(Math.round(s * 0.3), 12, 30), 6),
    foreground: hsl(h, surfaceSat, 97),
    card: hsl(h, clamp(Math.round(s * 0.25), 10, 25), 9),
    "card-foreground": hsl(h, surfaceSat, 97),
    popover: hsl(h, clamp(Math.round(s * 0.25), 10, 25), 9),
    "popover-foreground": hsl(h, surfaceSat, 97),

    primary: hsl(h, darkPrimarySat, darkPrimaryL),
    "primary-foreground": hsl(h, clamp(Math.round(s * 0.3), 12, 30), 6),

    secondary: hsl(h, clamp(Math.round(s * 0.2), 10, 22), 14),
    "secondary-foreground": hsl(214, 32, 91),

    muted: hsl(h, clamp(Math.round(s * 0.15), 8, 18), 13),
    "muted-foreground": hsl(h, clamp(Math.round(s * 0.15), 8, 18), 60),

    accent: hsl(h, clamp(Math.round(s * 0.5), 25, 50), 20),
    "accent-foreground": hsl(214, 32, 91),

    destructive: "0 84% 60%",
    "destructive-foreground": hsl(h, surfaceSat, 97),
    success: "152 76% 50%",
    "success-foreground": hsl(h, surfaceSat, 97),
    warning: "38 92% 50%",
    "warning-foreground": hsl(h, clamp(Math.round(s * 0.3), 12, 30), 6),
    info: "199 89% 48%",
    "info-foreground": hsl(h, surfaceSat, 97),

    border: hsl(h, clamp(Math.round(s * 0.15), 8, 18), 18),
    input: hsl(h, clamp(Math.round(s * 0.15), 8, 18), 18),
    ring: hsl(h, darkPrimarySat, darkPrimaryL),
  };

  return { light, dark };
}

// ── scoped style builder ─────────────────────────────────────────────────────

const CSS_VAR_KEYS: readonly (keyof PaletteMode)[] = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  "border",
  "input",
  "ring",
] as const;

/**
 * Build a React `style` object that sets CSS variables for all 25 palette
 * tokens.  Spread this onto a container `<div>` to scope the palette via
 * CSS inheritance — child elements using `hsl(var(--primary))` etc. will
 * resolve to the generated values without touching the global theme.
 */
export function buildScopedPaletteStyle(
  hex: string,
  isDark: boolean,
): Record<string, string> {
  const palette = generatePalette(hex);
  const mode = isDark ? palette.dark : palette.light;
  const style: Record<string, string> = {};
  for (const key of CSS_VAR_KEYS) {
    style[`--${key}`] = mode[key];
  }
  // Sidebar vars to match
  style["--sidebar-primary"] = mode.primary;
  style["--sidebar-primary-foreground"] = mode["primary-foreground"];
  style["--sidebar-ring"] = mode.ring;
  style["--sidebar-background"] = mode.background;
  style["--sidebar-foreground"] = mode.foreground;
  style["--sidebar-accent"] = isDark ? mode.secondary : mode.accent;
  style["--sidebar-accent-foreground"] = mode["accent-foreground"];
  style["--sidebar-border"] = mode.border;
  // Chart vars
  style["--chart-1"] = mode.primary;
  style["--chart-2"] = mode.success;
  style["--chart-3"] = mode.info;
  style["--chart-4"] = mode.warning;
  style["--chart-5"] = "340 80% 63%";
  return style;
}
