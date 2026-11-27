/**
 * TanStack Start - plain CSS variable, no Next.js font optimization.
 * fontsource (globals.css) declares "Inter Variable", the `--font-sans`
 * fallback, so no variable class is needed on <html>.
 */
export const inter = {
  className: "font-sans",
  variable: "",
  style: { fontFamily: "Inter, sans-serif" },
};

/**
 * Hindi glyphs come from the OS Devanagari faces listed in `--font-sans`
 * (Noto Sans Devanagari, Nirmala UI, Kohinoor Devanagari), so no class here.
 */
export const devanagari = {
  className: "",
  variable: "",
  style: { fontFamily: "'Noto Sans Devanagari', sans-serif" },
};
