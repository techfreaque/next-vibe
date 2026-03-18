import { Inter as NextInter } from "next/font/google";

/**
 * Web (Next.js) implementation — returns the Next.js optimized Inter font.
 */
export const inter = NextInter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
