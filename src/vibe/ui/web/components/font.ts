import { Inter as NextInter } from "next/font/google";

/**
 * Web (Next.js) implementation - returns the Next.js optimized Inter font.
 *
 * Apply `inter.variable` on <html>: `--font-sans` is declared on :root as
 * `var(--font-inter, "Inter Variable")` and resolves there, so without the
 * variable on the root element every `font-sans` element fell back to the
 * fontsource copy and each page downloaded Inter twice (~48 kB each).
 */
export const inter = NextInter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
