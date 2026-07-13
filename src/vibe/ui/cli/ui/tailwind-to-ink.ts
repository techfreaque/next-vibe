/**
 * Tailwind CSS → Ink prop translation layer.
 *
 * Parses a Tailwind className string and returns Ink-compatible props
 * for <Text> and <Box> components. This is the foundation of the CLI
 * rendering surface - all next-vibe/ui/cli components use this to
 * translate web className strings into terminal output.
 *
 * Design notes:
 * - Only maps classes that have a meaningful terminal equivalent
 * - Ignores decorative classes (shadow, ring, rounded, bg-*) silently
 * - Numeric scale: Tailwind 4px base → ~1 terminal char per 2 units
 * - Colors: maps to the 8 standard ANSI colors Ink supports
 */

// ─── Text props ────────────────────────────────────────────────────────────

export interface InkTextProps {
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  dimColor?: boolean;
  wrap?: "wrap" | "truncate" | "truncate-end" | "truncate-middle";
  inverse?: boolean;
}

// ─── Box props ─────────────────────────────────────────────────────────────

interface InkBoxProps {
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  flexWrap?: "wrap" | "nowrap";
  flexGrow?: number;
  flexShrink?: number;
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  alignSelf?: "flex-start" | "center" | "flex-end" | "auto";
  justifyContent?:
    | "flex-start"
    | "center"
    | "flex-end"
    | "space-between"
    | "space-around";
  gap?: number;
  columnGap?: number;
  rowGap?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  width?: string | number;
  height?: string | number;
  minWidth?: number;
  minHeight?: number;
  overflow?: "hidden" | "visible";
  borderStyle?:
    | "single"
    | "double"
    | "round"
    | "bold"
    | "singleDouble"
    | "doubleSingle"
    | "classic";
  borderColor?: string;
  borderTop?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
  display?: "flex" | "none";
}

// ─── Combined result ────────────────────────────────────────────────────────

interface InkProps {
  text: InkTextProps;
  box: InkBoxProps;
  /** true if a `hidden` class was found - component should return null */
  hidden: boolean;
}

// ─── Color map ──────────────────────────────────────────────────────────────

/**
 * Maps Tailwind color prefixes to ANSI color names supported by Ink.
 * Ink supports: black, red, green, yellow, blue, magenta, cyan, white,
 * gray (alias: grey), plus hex strings like "#ff0000".
 */
const TAILWIND_COLOR_TO_ANSI: Record<string, string> = {
  // Grays
  black: "black",
  white: "white",
  gray: "gray",
  grey: "gray",
  slate: "gray",
  zinc: "gray",
  neutral: "gray",
  stone: "gray",
  // Reds
  red: "red",
  rose: "red",
  pink: "magenta",
  // Oranges / yellows
  orange: "yellow",
  amber: "yellow",
  yellow: "yellow",
  // Greens
  green: "green",
  emerald: "green",
  teal: "cyan",
  lime: "green",
  // Blues
  blue: "blue",
  indigo: "blue",
  sky: "cyan",
  // Purples
  purple: "magenta",
  violet: "magenta",
  fuchsia: "magenta",
  // Cyans
  cyan: "cyan",
};

/** Maps Tailwind semantic foreground tokens to ANSI colors */
const SEMANTIC_FG: Record<string, string | null> = {
  foreground: null, // default terminal color
  "primary-foreground": "white",
  "secondary-foreground": "white",
  "muted-foreground": null, // handled via dimColor
  "accent-foreground": "white",
  "destructive-foreground": "white",
  "success-foreground": "white",
  "warning-foreground": "black",
  "info-foreground": "white",
  primary: "cyan",
  secondary: "gray",
  muted: null, // dimColor
  accent: "cyan",
  destructive: "red",
  success: "green",
  warning: "yellow",
  info: "blue",
};

function resolveColor(token: string): string | null {
  // Semantic token (no dash-number suffix)
  if (token in SEMANTIC_FG) {
    return SEMANTIC_FG[token] ?? null;
  }
  // Tailwind color-scale: "red-500" → "red", "gray-200" → "gray"
  const dashIdx = token.lastIndexOf("-");
  if (dashIdx !== -1) {
    const base = token.slice(0, dashIdx);
    if (base in TAILWIND_COLOR_TO_ANSI) {
      return TAILWIND_COLOR_TO_ANSI[base] ?? null;
    }
  }
  // Bare color name: "red", "cyan", etc.
  if (token in TAILWIND_COLOR_TO_ANSI) {
    return TAILWIND_COLOR_TO_ANSI[token] ?? null;
  }
  return null;
}

// ─── Spacing scale ──────────────────────────────────────────────────────────

/**
 * Maps Tailwind spacing units to terminal character columns.
 * Tailwind uses 4px increments; terminal "columns" are ~8px wide.
 * We map loosely: 1-2 → 1, 3-5 → 2, 6-8 → 3, 9+ → 4
 */
function spacingToChars(value: string): number {
  const n = parseFloat(value);
  if (isNaN(n)) {
    return 0;
  }
  if (n <= 0) {
    return 0;
  }
  if (n <= 2) {
    return 1;
  }
  if (n <= 5) {
    return 2;
  }
  if (n <= 8) {
    return 3;
  }
  return 4;
}

// ─── Main parser ────────────────────────────────────────────────────────────

/**
 * Parse a Tailwind className string into Ink Text + Box props.
 *
 * @example
 * const { text, box } = parseClassesToInkProps("flex flex-col gap-2 text-red-500 font-bold")
 * // text: { color: "red", bold: true }
 * // box:  { flexDirection: "column", gap: 1 }
 */
export function parseClassesToInkProps(className?: string): InkProps {
  const text: InkTextProps = {};
  const box: InkBoxProps = {};
  let hidden = false;

  if (!className) {
    return { text, box, hidden };
  }

  const classes = className.split(/\s+/).filter(Boolean);

  // Track whether an explicit `flex` class was found.
  // In CSS, `display: flex` defaults to row direction.
  // Div component defaults to column (matching block-level div stacking),
  // but when `flex` is explicit, direction should be row unless overridden.
  let hasExplicitFlex = false;
  let hasExplicitDirection = false;
  let hasBgColor: string | null = null;
  let hasRounded = false;

  for (const cls of classes) {
    // Strip responsive / dark-mode / state prefixes: "lg:", "dark:", "hover:", etc.
    const bare = cls.includes(":") ? (cls.split(":").pop() ?? cls) : cls;

    // ── Visibility ─────────────────────────────────────────────────────────
    // Pattern: "hidden sm:flex" means hidden mobile, visible desktop.
    // CLI is wide-format (largest breakpoint), so responsive overrides
    // that show the element must undo a prior `hidden`.
    if (bare === "hidden" || bare === "invisible") {
      hidden = true;
      continue;
    }
    // pointer-events-none / pointer-events-auto — ignored in terminal
    if (bare.startsWith("pointer-events-")) {
      continue;
    }
    if (bare === "visible" || bare === "block" || bare === "inline-block") {
      hidden = false;
      box.display = "flex";
      continue;
    }
    // Explicit flex / inline-flex → show element + CSS default is row direction
    if (bare === "flex" || bare === "inline-flex") {
      hidden = false;
      hasExplicitFlex = true;
      continue;
    }
    if (bare === "inline") {
      hidden = false;
      continue;
    }

    // ── Text color ─────────────────────────────────────────────────────────
    if (bare.startsWith("text-")) {
      const token = bare.slice(5);
      // Size classes - not colors
      if (
        ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl"].includes(
          token,
        )
      ) {
        if (token === "xs" || token === "sm") {
          text.dimColor = true;
        }
        if (
          token === "lg" ||
          token === "xl" ||
          token === "2xl" ||
          token === "3xl" ||
          token === "4xl" ||
          token === "5xl"
        ) {
          text.bold = true;
        }
        continue;
      }
      // Alignment - ignore in CLI
      if (["left", "center", "right", "justify"].includes(token)) {
        continue;
      }
      // Wrapping
      if (token === "truncate") {
        text.wrap = "truncate-end";
        continue;
      }
      if (token === "ellipsis") {
        text.wrap = "truncate-end";
        continue;
      }
      // Muted / dimmed
      if (token === "muted-foreground" || token === "muted") {
        text.dimColor = true;
        continue;
      }
      const color = resolveColor(token);
      if (color) {
        text.color = color;
      }
      continue;
    }

    // ── Background color ──────────────────────────────────────────────────
    // Track bg-* with real colors for bubble detection (rounded + bg → border).
    // Ink Box doesn't support backgroundColor; we use borders instead.
    if (bare.startsWith("bg-")) {
      const token = bare.slice(3);
      // Skip theme-default backgrounds that shouldn't stand out
      if (
        token !== "background" &&
        token !== "card" &&
        token !== "popover" &&
        token !== "transparent" &&
        !token.startsWith("black") &&
        !token.startsWith("white")
      ) {
        const bgColor = resolveColor(token);
        if (bgColor) {
          hasBgColor = bgColor;
        }
      }
      continue;
    }
    // ── Rounded ──────────────────────────────────────────────────────────
    if (bare.startsWith("rounded") && bare !== "rounded-none") {
      hasRounded = true;
      continue;
    }

    // ── Font weight ────────────────────────────────────────────────────────
    if (
      bare === "font-bold" ||
      bare === "font-extrabold" ||
      bare === "font-black" ||
      bare === "font-semibold"
    ) {
      text.bold = true;
      continue;
    }
    if (
      bare === "font-light" ||
      bare === "font-thin" ||
      bare === "font-extralight"
    ) {
      text.dimColor = true;
      continue;
    }

    // ── Font style ─────────────────────────────────────────────────────────
    if (bare === "italic") {
      text.italic = true;
      continue;
    }
    if (bare === "not-italic") {
      text.italic = false;
      continue;
    }

    // ── Text decoration ────────────────────────────────────────────────────
    if (bare === "underline") {
      text.underline = true;
      continue;
    }
    if (bare === "line-through") {
      text.strikethrough = true;
      continue;
    }
    if (bare === "no-underline") {
      text.underline = false;
      continue;
    }

    // ── Opacity ────────────────────────────────────────────────────────────
    if (bare.startsWith("opacity-")) {
      const pct = parseInt(bare.slice(8), 10);
      if (!isNaN(pct)) {
        // opacity-0 is typically used for hover-reveal patterns (invisible
        // until hover/focus). In CLI there is no hover, so we ignore
        // opacity-0 entirely — elements stay visible. Low but non-zero
        // opacity (1-60) gets dimmed.
        if (pct > 0 && pct <= 60) {
          text.dimColor = true;
        }
      }
      continue;
    }

    // ── Text overflow ──────────────────────────────────────────────────────
    if (bare === "truncate" || bare === "overflow-ellipsis") {
      text.wrap = "truncate-end";
      continue;
    }
    if (bare === "overflow-clip") {
      text.wrap = "truncate";
      continue;
    }
    if (bare === "whitespace-nowrap") {
      // Can't prevent wrapping in Ink, approximate with truncate
      text.wrap = "truncate-end";
      continue;
    }

    // ── Grid → column layout in terminal ───────────────────────────────────
    // CSS grid has no terminal equivalent - collapse all grid layouts to column
    if (
      bare === "grid" ||
      bare.startsWith("grid-cols-") ||
      bare.startsWith("grid-rows-") ||
      bare.startsWith("col-span-") ||
      bare.startsWith("row-span-")
    ) {
      box.flexDirection = "column";
      continue;
    }

    // ── Flex direction ─────────────────────────────────────────────────────
    if (bare === "flex-col" || bare === "flex-column") {
      box.flexDirection = "column";
      hasExplicitDirection = true;
      continue;
    }
    if (bare === "flex-row") {
      box.flexDirection = "row";
      hasExplicitDirection = true;
      continue;
    }
    if (bare === "flex-col-reverse") {
      box.flexDirection = "column-reverse";
      hasExplicitDirection = true;
      continue;
    }
    if (bare === "flex-row-reverse") {
      box.flexDirection = "row-reverse";
      hasExplicitDirection = true;
      continue;
    }
    if (bare === "flex-wrap") {
      box.flexWrap = "wrap";
      continue;
    }
    if (bare === "flex-nowrap") {
      box.flexWrap = "nowrap";
      continue;
    }
    if (bare === "flex-1") {
      box.flexGrow = 1;
      box.flexShrink = 1;
      continue;
    }
    if (bare === "flex-none") {
      box.flexGrow = 0;
      box.flexShrink = 0;
      continue;
    }
    if (bare === "grow" || bare === "flex-grow") {
      box.flexGrow = 1;
      continue;
    }
    if (bare === "shrink" || bare === "flex-shrink") {
      box.flexShrink = 1;
      continue;
    }

    // ── Align / justify ────────────────────────────────────────────────────
    if (bare === "items-start") {
      box.alignItems = "flex-start";
      continue;
    }
    if (bare === "items-center") {
      box.alignItems = "center";
      continue;
    }
    if (bare === "items-end") {
      box.alignItems = "flex-end";
      continue;
    }
    if (bare === "items-stretch") {
      box.alignItems = "stretch";
      continue;
    }
    if (bare === "self-start") {
      box.alignSelf = "flex-start";
      continue;
    }
    if (bare === "self-center") {
      box.alignSelf = "center";
      continue;
    }
    if (bare === "self-end") {
      box.alignSelf = "flex-end";
      continue;
    }
    if (bare === "self-auto") {
      box.alignSelf = "auto";
      continue;
    }
    if (bare === "justify-start") {
      box.justifyContent = "flex-start";
      continue;
    }
    if (bare === "justify-center") {
      box.justifyContent = "center";
      continue;
    }
    if (bare === "justify-end") {
      box.justifyContent = "flex-end";
      continue;
    }
    if (bare === "justify-between") {
      box.justifyContent = "space-between";
      continue;
    }
    if (bare === "justify-around") {
      box.justifyContent = "space-around";
      continue;
    }

    // ── Gap ────────────────────────────────────────────────────────────────
    if (bare.startsWith("gap-")) {
      const chars = spacingToChars(bare.slice(4));
      box.gap = chars;
      continue;
    }
    if (bare.startsWith("gap-x-")) {
      box.columnGap = spacingToChars(bare.slice(6));
      continue;
    }
    if (bare.startsWith("gap-y-")) {
      box.rowGap = spacingToChars(bare.slice(6));
      continue;
    }

    // ── Padding ────────────────────────────────────────────────────────────
    if (bare.startsWith("p-")) {
      const v = spacingToChars(bare.slice(2));
      box.paddingLeft = v;
      box.paddingRight = v;
      box.paddingTop = v;
      box.paddingBottom = v;
      continue;
    }
    if (bare.startsWith("px-")) {
      const v = spacingToChars(bare.slice(3));
      box.paddingLeft = v;
      box.paddingRight = v;
      continue;
    }
    if (bare.startsWith("py-")) {
      const v = spacingToChars(bare.slice(3));
      box.paddingTop = v;
      box.paddingBottom = v;
      continue;
    }
    if (bare.startsWith("pt-")) {
      box.paddingTop = spacingToChars(bare.slice(3));
      continue;
    }
    if (bare.startsWith("pb-")) {
      box.paddingBottom = spacingToChars(bare.slice(3));
      continue;
    }
    if (bare.startsWith("pl-")) {
      box.paddingLeft = spacingToChars(bare.slice(3));
      continue;
    }
    if (bare.startsWith("pr-")) {
      box.paddingRight = spacingToChars(bare.slice(3));
      continue;
    }

    // ── Margin auto → align-self ─────────────────────────────────────────
    if (bare === "ml-auto") {
      box.alignSelf = "flex-end";
      continue;
    }
    if (bare === "mr-auto") {
      box.alignSelf = "flex-start";
      continue;
    }
    if (bare === "mx-auto") {
      box.alignSelf = "center";
      continue;
    }

    // ── Margin ─────────────────────────────────────────────────────────────
    if (bare.startsWith("m-")) {
      const v = spacingToChars(bare.slice(2));
      box.marginLeft = v;
      box.marginRight = v;
      box.marginTop = v;
      box.marginBottom = v;
      continue;
    }
    if (bare.startsWith("mx-")) {
      const v = spacingToChars(bare.slice(3));
      box.marginLeft = v;
      box.marginRight = v;
      continue;
    }
    if (bare.startsWith("my-")) {
      const v = spacingToChars(bare.slice(3));
      box.marginTop = v;
      box.marginBottom = v;
      continue;
    }
    if (bare.startsWith("mt-")) {
      box.marginTop = spacingToChars(bare.slice(3));
      continue;
    }
    if (bare.startsWith("mb-")) {
      box.marginBottom = spacingToChars(bare.slice(3));
      continue;
    }
    if (bare.startsWith("ml-")) {
      box.marginLeft = spacingToChars(bare.slice(3));
      continue;
    }
    if (bare.startsWith("mr-")) {
      box.marginRight = spacingToChars(bare.slice(3));
      continue;
    }

    // ── Width / height ─────────────────────────────────────────────────────
    if (bare === "w-full") {
      box.width = "100%";
      continue;
    }
    if (bare === "w-auto") {
      continue;
    } // default
    if (bare.startsWith("w-")) {
      const v = parseInt(bare.slice(2), 10);
      if (!isNaN(v)) {
        box.width = v * 4;
      } // approximate px → chars
      continue;
    }
    if (bare === "h-full") {
      box.height = "100%";
      continue;
    }
    // ── Max-width → width (Ink has no maxWidth, approximate with width) ──
    if (bare.startsWith("max-w-")) {
      const token = bare.slice(6);
      // Arbitrary value: max-w-[75%] → width: "75%"
      if (token.startsWith("[") && token.endsWith("]")) {
        const inner = token.slice(1, -1);
        if (inner.endsWith("%")) {
          box.width = inner;
        }
      }
      // Named sizes → approximate terminal columns (1 col ≈ 8px)
      // These cap width; Ink has no maxWidth, so we set width directly.
      // Only apply when no explicit width is already set.
      else if (!box.width) {
        const named: Record<string, number> = {
          xs: 40, // 320px
          sm: 48, // 384px
          md: 56, // 448px
          lg: 64, // 512px
          xl: 72, // 576px
          "2xl": 84, // 672px
          "3xl": 96, // 768px
          "4xl": 112, // 896px
          "5xl": 128, // 1024px
          "6xl": 144, // 1152px
          "7xl": 160, // 1280px
          full: 0, // 100% - skip
          screen: 0, // 100vw - skip
        };
        const cols = named[token];
        if (cols) {
          box.width = cols;
        }
      }
      continue;
    }
    if (bare.startsWith("min-w-")) {
      const v = parseInt(bare.slice(6), 10);
      if (!isNaN(v)) {
        box.minWidth = v;
      }
      continue;
    }
    if (bare.startsWith("min-h-")) {
      const v = parseInt(bare.slice(6), 10);
      if (!isNaN(v)) {
        box.minHeight = v;
      }
      continue;
    }

    // ── Overflow ───────────────────────────────────────────────────────────
    if (bare === "overflow-hidden") {
      box.overflow = "hidden";
      continue;
    }
    if (bare === "overflow-visible") {
      box.overflow = "visible";
      continue;
    }

    // ── Invert ────────────────────────────────────────────────────────────
    if (bare === "invert") {
      text.inverse = true;
      continue;
    }

    // ── Borders → Ink borderStyle ─────────────────────────────────────────
    // Tailwind: border, border-t, border-b, border-l, border-r
    // Ink: borderStyle + borderTop/borderBottom/borderLeft/borderRight
    if (bare === "border") {
      box.borderStyle = "single";
      continue;
    }
    if (bare === "border-t") {
      box.borderStyle = "single";
      box.borderTop = true;
      box.borderBottom = false;
      box.borderLeft = false;
      box.borderRight = false;
      continue;
    }
    if (bare === "border-b") {
      box.borderStyle = "single";
      box.borderTop = false;
      box.borderBottom = true;
      box.borderLeft = false;
      box.borderRight = false;
      continue;
    }
    if (bare === "border-l") {
      box.borderStyle = "single";
      box.borderTop = false;
      box.borderBottom = false;
      box.borderLeft = true;
      box.borderRight = false;
      continue;
    }
    if (bare === "border-r") {
      box.borderStyle = "single";
      box.borderTop = false;
      box.borderBottom = false;
      box.borderLeft = false;
      box.borderRight = true;
      continue;
    }

    // Everything else (bg-*, border-color-*, rounded-*, shadow-*, ring-*,
    // cursor-*, transition-*, animate-*, z-*, absolute, relative, etc.) - ignored
  }

  // When `flex` is explicit and no direction was set, default to row
  // (matching CSS flex default). Without explicit `flex`, Div component
  // applies its own column default for block-level div stacking.
  if (hasExplicitFlex && !hasExplicitDirection) {
    box.flexDirection = "row";
  }

  // When both rounded + bg-color are present (e.g. message bubbles),
  // add a rounded border for visual containment. On web these elements
  // have a background color; in CLI, borders serve the same purpose.
  if (hasRounded && hasBgColor && !box.borderStyle) {
    box.borderStyle = "round";
    box.borderColor = hasBgColor;
  }

  return { text, box, hidden };
}

/**
 * Convenience: extract only Text props from a className string.
 */
export function parseClassesToTextProps(className?: string): InkTextProps {
  return parseClassesToInkProps(className).text;
}

/**
 * Convenience: extract only Box props from a className string.
 */
export function parseClassesToBoxProps(className?: string): InkBoxProps {
  return parseClassesToInkProps(className).box;
}

/**
 * Merge two InkTextProps objects, later values win.
 */
export function mergeTextProps(
  base: InkTextProps,
  override: InkTextProps,
): InkTextProps {
  return { ...base, ...override };
}
