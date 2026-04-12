/* eslint-disable oxlint-plugin-i18n/no-literal-string */
"use client";

import { Badge } from "next-vibe-ui/ui/badge";
import { Button } from "next-vibe-ui/ui/button";
import { Div } from "next-vibe-ui/ui/div";
import { P } from "next-vibe-ui/ui/typography";
import { useCallback, useState } from "react";
import type { JSX } from "react";

import { platform } from "@/config/env-client";

interface PaletteColors {
  // Light mode
  light: {
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
  };
  // Dark mode
  dark: {
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
  };
}

interface Palette {
  name: string;
  description: string;
  preview: string; // CSS color for the preview dot
  colors: PaletteColors;
}

const PALETTES: Palette[] = [
  {
    name: "Sapphire",
    description: "Current default — deep blue, blue-tinted surfaces",
    preview: "hsl(224, 71%, 40%)",
    colors: {
      light: {
        background: "217 64% 89%",
        foreground: "224 40% 15%",
        card: "222 70% 94%",
        "card-foreground": "224 40% 15%",
        popover: "222 70% 94%",
        "popover-foreground": "224 40% 15%",
        primary: "224 71% 40%",
        "primary-foreground": "0 0% 100%",
        secondary: "222 50% 90%",
        "secondary-foreground": "224 35% 20%",
        muted: "220 40% 88%",
        "muted-foreground": "224 20% 40%",
        accent: "224 50% 90%",
        "accent-foreground": "224 35% 20%",
        destructive: "0 72% 51%",
        "destructive-foreground": "0 0% 100%",
        success: "142 71% 45%",
        "success-foreground": "0 0% 100%",
        warning: "37 91% 55%",
        "warning-foreground": "0 0% 100%",
        info: "192 91% 36%",
        "info-foreground": "0 0% 100%",
        border: "222 45% 84%",
        input: "222 45% 84%",
        ring: "224 71% 40%",
      },
      dark: {
        background: "225 40% 8%",
        foreground: "210 40% 98%",
        card: "225 35% 10%",
        "card-foreground": "210 40% 98%",
        popover: "225 35% 10%",
        "popover-foreground": "210 40% 98%",
        primary: "221 83% 53%",
        "primary-foreground": "210 40% 98%",
        secondary: "225 28% 16%",
        "secondary-foreground": "214 32% 91%",
        muted: "225 25% 15%",
        "muted-foreground": "218 18% 62%",
        accent: "224 50% 24%",
        "accent-foreground": "214 32% 91%",
        destructive: "0 84% 60%",
        "destructive-foreground": "210 40% 98%",
        success: "142 69% 58%",
        "success-foreground": "210 40% 98%",
        warning: "38 92% 50%",
        "warning-foreground": "225 40% 8%",
        info: "188 94% 43%",
        "info-foreground": "210 40% 98%",
        border: "225 22% 22%",
        input: "225 22% 22%",
        ring: "221 83% 53%",
      },
    },
  },
  {
    name: "Electric Blue",
    description: "Crisp blue — classic SaaS, high trust",
    preview: "hsl(221, 83%, 53%)",
    colors: {
      light: {
        background: "210 40% 98%",
        foreground: "222 47% 11%",
        card: "0 0% 100%",
        "card-foreground": "222 47% 11%",
        popover: "0 0% 100%",
        "popover-foreground": "222 47% 11%",
        primary: "221 83% 53%",
        "primary-foreground": "0 0% 100%",
        secondary: "210 40% 96%",
        "secondary-foreground": "215 25% 17%",
        muted: "210 40% 96%",
        "muted-foreground": "215 16% 47%",
        accent: "214 100% 97%",
        "accent-foreground": "215 25% 17%",
        destructive: "0 72% 51%",
        "destructive-foreground": "0 0% 100%",
        success: "142 71% 45%",
        "success-foreground": "0 0% 100%",
        warning: "37 91% 55%",
        "warning-foreground": "0 0% 100%",
        info: "192 91% 36%",
        "info-foreground": "0 0% 100%",
        border: "214 32% 91%",
        input: "214 32% 91%",
        ring: "221 83% 53%",
      },
      dark: {
        background: "222 47% 5%",
        foreground: "210 40% 98%",
        card: "222 40% 8%",
        "card-foreground": "210 40% 98%",
        popover: "222 40% 8%",
        "popover-foreground": "210 40% 98%",
        primary: "217 91% 60%",
        "primary-foreground": "210 40% 98%",
        secondary: "222 30% 14%",
        "secondary-foreground": "214 32% 91%",
        muted: "222 25% 14%",
        "muted-foreground": "215 16% 60%",
        accent: "217 50% 20%",
        "accent-foreground": "214 32% 91%",
        destructive: "0 84% 60%",
        "destructive-foreground": "210 40% 98%",
        success: "142 69% 58%",
        "success-foreground": "210 40% 98%",
        warning: "43 96% 56%",
        "warning-foreground": "222 47% 5%",
        info: "188 94% 43%",
        "info-foreground": "210 40% 98%",
        border: "222 20% 18%",
        input: "222 20% 18%",
        ring: "217 91% 60%",
      },
    },
  },
  {
    name: "Emerald",
    description: "Fresh green — nature, growth, fintech",
    preview: "hsl(160, 84%, 39%)",
    colors: {
      light: {
        background: "210 40% 98%",
        foreground: "222 47% 11%",
        card: "0 0% 100%",
        "card-foreground": "222 47% 11%",
        popover: "0 0% 100%",
        "popover-foreground": "222 47% 11%",
        primary: "160 84% 39%",
        "primary-foreground": "0 0% 100%",
        secondary: "160 30% 96%",
        "secondary-foreground": "160 25% 17%",
        muted: "160 20% 96%",
        "muted-foreground": "215 16% 47%",
        accent: "160 60% 95%",
        "accent-foreground": "160 25% 17%",
        destructive: "0 72% 51%",
        "destructive-foreground": "0 0% 100%",
        success: "142 71% 45%",
        "success-foreground": "0 0% 100%",
        warning: "37 91% 55%",
        "warning-foreground": "0 0% 100%",
        info: "221 83% 53%",
        "info-foreground": "0 0% 100%",
        border: "214 32% 91%",
        input: "214 32% 91%",
        ring: "160 84% 39%",
      },
      dark: {
        background: "160 25% 4%",
        foreground: "210 40% 98%",
        card: "160 20% 7%",
        "card-foreground": "210 40% 98%",
        popover: "160 20% 7%",
        "popover-foreground": "210 40% 98%",
        primary: "160 84% 45%",
        "primary-foreground": "160 25% 4%",
        secondary: "160 20% 13%",
        "secondary-foreground": "214 32% 91%",
        muted: "160 15% 13%",
        "muted-foreground": "215 16% 60%",
        accent: "160 40% 18%",
        "accent-foreground": "214 32% 91%",
        destructive: "0 84% 60%",
        "destructive-foreground": "210 40% 98%",
        success: "142 69% 58%",
        "success-foreground": "160 25% 4%",
        warning: "43 96% 56%",
        "warning-foreground": "160 25% 4%",
        info: "217 91% 60%",
        "info-foreground": "210 40% 98%",
        border: "160 15% 17%",
        input: "160 15% 17%",
        ring: "160 84% 45%",
      },
    },
  },
  {
    name: "Rose",
    description: "Warm pink — creative, bold, social",
    preview: "hsl(340, 82%, 52%)",
    colors: {
      light: {
        background: "0 0% 99%",
        foreground: "222 47% 11%",
        card: "0 0% 100%",
        "card-foreground": "222 47% 11%",
        popover: "0 0% 100%",
        "popover-foreground": "222 47% 11%",
        primary: "340 82% 52%",
        "primary-foreground": "0 0% 100%",
        secondary: "340 20% 96%",
        "secondary-foreground": "340 25% 17%",
        muted: "340 15% 96%",
        "muted-foreground": "215 16% 47%",
        accent: "340 60% 96%",
        "accent-foreground": "340 25% 17%",
        destructive: "0 72% 51%",
        "destructive-foreground": "0 0% 100%",
        success: "160 84% 39%",
        "success-foreground": "0 0% 100%",
        warning: "37 91% 55%",
        "warning-foreground": "0 0% 100%",
        info: "200 98% 39%",
        "info-foreground": "0 0% 100%",
        border: "340 15% 90%",
        input: "340 15% 90%",
        ring: "340 82% 52%",
      },
      dark: {
        background: "340 20% 5%",
        foreground: "210 40% 98%",
        card: "340 18% 8%",
        "card-foreground": "210 40% 98%",
        popover: "340 18% 8%",
        "popover-foreground": "210 40% 98%",
        primary: "340 82% 60%",
        "primary-foreground": "0 0% 100%",
        secondary: "340 20% 13%",
        "secondary-foreground": "214 32% 91%",
        muted: "340 15% 13%",
        "muted-foreground": "215 16% 60%",
        accent: "340 40% 20%",
        "accent-foreground": "214 32% 91%",
        destructive: "0 84% 60%",
        "destructive-foreground": "210 40% 98%",
        success: "160 84% 45%",
        "success-foreground": "210 40% 98%",
        warning: "43 96% 56%",
        "warning-foreground": "340 20% 5%",
        info: "199 89% 48%",
        "info-foreground": "210 40% 98%",
        border: "340 15% 17%",
        input: "340 15% 17%",
        ring: "340 82% 60%",
      },
    },
  },
  {
    name: "Amber",
    description: "Warm gold — premium, luxury, warm",
    preview: "hsl(37, 91%, 55%)",
    colors: {
      light: {
        background: "40 30% 98%",
        foreground: "20 14% 11%",
        card: "0 0% 100%",
        "card-foreground": "20 14% 11%",
        popover: "0 0% 100%",
        "popover-foreground": "20 14% 11%",
        primary: "37 91% 55%",
        "primary-foreground": "20 14% 11%",
        secondary: "40 30% 95%",
        "secondary-foreground": "20 14% 20%",
        muted: "40 20% 96%",
        "muted-foreground": "20 10% 47%",
        accent: "37 60% 94%",
        "accent-foreground": "20 14% 17%",
        destructive: "0 72% 51%",
        "destructive-foreground": "0 0% 100%",
        success: "160 84% 39%",
        "success-foreground": "0 0% 100%",
        warning: "25 95% 53%",
        "warning-foreground": "0 0% 100%",
        info: "200 98% 39%",
        "info-foreground": "0 0% 100%",
        border: "37 20% 88%",
        input: "37 20% 88%",
        ring: "37 91% 55%",
      },
      dark: {
        background: "20 20% 5%",
        foreground: "40 30% 96%",
        card: "20 18% 8%",
        "card-foreground": "40 30% 96%",
        popover: "20 18% 8%",
        "popover-foreground": "40 30% 96%",
        primary: "43 96% 56%",
        "primary-foreground": "20 20% 5%",
        secondary: "20 15% 14%",
        "secondary-foreground": "40 25% 88%",
        muted: "20 12% 13%",
        "muted-foreground": "40 10% 55%",
        accent: "37 35% 18%",
        "accent-foreground": "40 25% 88%",
        destructive: "0 84% 60%",
        "destructive-foreground": "40 30% 96%",
        success: "160 84% 45%",
        "success-foreground": "40 30% 96%",
        warning: "25 95% 53%",
        "warning-foreground": "20 20% 5%",
        info: "199 89% 48%",
        "info-foreground": "40 30% 96%",
        border: "20 12% 17%",
        input: "20 12% 17%",
        ring: "43 96% 56%",
      },
    },
  },
  {
    name: "Teal",
    description: "Ocean teal — fresh, not another blue SaaS",
    preview: "hsl(173, 80%, 40%)",
    colors: {
      light: {
        background: "180 20% 98%",
        foreground: "222 47% 11%",
        card: "0 0% 100%",
        "card-foreground": "222 47% 11%",
        popover: "0 0% 100%",
        "popover-foreground": "222 47% 11%",
        primary: "173 80% 40%",
        "primary-foreground": "0 0% 100%",
        secondary: "175 25% 95%",
        "secondary-foreground": "175 25% 17%",
        muted: "175 15% 96%",
        "muted-foreground": "215 16% 47%",
        accent: "173 50% 94%",
        "accent-foreground": "175 25% 17%",
        destructive: "0 72% 51%",
        "destructive-foreground": "0 0% 100%",
        success: "142 71% 45%",
        "success-foreground": "0 0% 100%",
        warning: "37 91% 55%",
        "warning-foreground": "0 0% 100%",
        info: "221 83% 53%",
        "info-foreground": "0 0% 100%",
        border: "175 18% 89%",
        input: "175 18% 89%",
        ring: "173 80% 40%",
      },
      dark: {
        background: "175 25% 4%",
        foreground: "210 40% 98%",
        card: "175 20% 7%",
        "card-foreground": "210 40% 98%",
        popover: "175 20% 7%",
        "popover-foreground": "210 40% 98%",
        primary: "170 72% 51%",
        "primary-foreground": "175 25% 4%",
        secondary: "175 20% 13%",
        "secondary-foreground": "214 32% 91%",
        muted: "175 15% 12%",
        "muted-foreground": "215 16% 60%",
        accent: "173 35% 18%",
        "accent-foreground": "214 32% 91%",
        destructive: "0 84% 60%",
        "destructive-foreground": "210 40% 98%",
        success: "142 69% 58%",
        "success-foreground": "175 25% 4%",
        warning: "43 96% 56%",
        "warning-foreground": "175 25% 4%",
        info: "217 91% 60%",
        "info-foreground": "210 40% 98%",
        border: "175 15% 16%",
        input: "175 15% 16%",
        ring: "170 72% 51%",
      },
    },
  },
  {
    name: "Violet Dream",
    description: "Deep violet primary, warm dark mode",
    preview: "hsl(263, 83%, 58%)",
    colors: {
      light: {
        background: "217 64% 89%",
        foreground: "224 40% 15%",
        card: "222 70% 94%",
        "card-foreground": "224 40% 15%",
        popover: "222 70% 94%",
        "popover-foreground": "224 40% 15%",
        primary: "263 83% 58%",
        "primary-foreground": "0 0% 100%",
        secondary: "222 50% 90%",
        "secondary-foreground": "224 35% 20%",
        muted: "220 40% 88%",
        "muted-foreground": "224 20% 40%",
        accent: "263 80% 94%",
        "accent-foreground": "224 35% 20%",
        destructive: "0 72% 51%",
        "destructive-foreground": "0 0% 100%",
        success: "160 84% 39%",
        "success-foreground": "0 0% 100%",
        warning: "32 95% 44%",
        "warning-foreground": "0 0% 100%",
        info: "200 98% 39%",
        "info-foreground": "0 0% 100%",
        border: "222 45% 84%",
        input: "222 45% 84%",
        ring: "263 83% 58%",
      },
      dark: {
        background: "225 40% 8%",
        foreground: "210 40% 98%",
        card: "225 35% 10%",
        "card-foreground": "210 40% 98%",
        popover: "225 35% 10%",
        "popover-foreground": "210 40% 98%",
        primary: "258 90% 66%",
        "primary-foreground": "210 40% 98%",
        secondary: "225 28% 16%",
        "secondary-foreground": "214 32% 91%",
        muted: "225 25% 15%",
        "muted-foreground": "218 18% 62%",
        accent: "263 90% 26%",
        "accent-foreground": "214 32% 91%",
        destructive: "0 84% 60%",
        "destructive-foreground": "210 40% 98%",
        success: "160 84% 45%",
        "success-foreground": "210 40% 98%",
        warning: "38 92% 50%",
        "warning-foreground": "225 40% 8%",
        info: "199 89% 48%",
        "info-foreground": "210 40% 98%",
        border: "225 22% 22%",
        input: "225 22% 22%",
        ring: "258 90% 66%",
      },
    },
  },
  {
    name: "Slate",
    description: "Neutral gray — minimal, zen, content-first",
    preview: "hsl(215, 16%, 47%)",
    colors: {
      light: {
        background: "210 40% 98%",
        foreground: "222 47% 11%",
        card: "0 0% 100%",
        "card-foreground": "222 47% 11%",
        popover: "0 0% 100%",
        "popover-foreground": "222 47% 11%",
        primary: "222 47% 20%",
        "primary-foreground": "0 0% 100%",
        secondary: "210 30% 95%",
        "secondary-foreground": "222 25% 20%",
        muted: "210 25% 96%",
        "muted-foreground": "215 16% 47%",
        accent: "210 40% 94%",
        "accent-foreground": "222 25% 20%",
        destructive: "0 72% 51%",
        "destructive-foreground": "0 0% 100%",
        success: "160 84% 39%",
        "success-foreground": "0 0% 100%",
        warning: "37 91% 55%",
        "warning-foreground": "0 0% 100%",
        info: "200 98% 39%",
        "info-foreground": "0 0% 100%",
        border: "214 32% 91%",
        input: "214 32% 91%",
        ring: "222 47% 20%",
      },
      dark: {
        background: "222 25% 6%",
        foreground: "210 40% 98%",
        card: "222 20% 9%",
        "card-foreground": "210 40% 98%",
        popover: "222 20% 9%",
        "popover-foreground": "210 40% 98%",
        primary: "210 40% 80%",
        "primary-foreground": "222 25% 6%",
        secondary: "222 18% 14%",
        "secondary-foreground": "214 32% 91%",
        muted: "222 15% 13%",
        "muted-foreground": "215 16% 55%",
        accent: "222 20% 18%",
        "accent-foreground": "214 32% 91%",
        destructive: "0 84% 60%",
        "destructive-foreground": "210 40% 98%",
        success: "160 84% 45%",
        "success-foreground": "210 40% 98%",
        warning: "43 96% 56%",
        "warning-foreground": "222 25% 6%",
        info: "199 89% 48%",
        "info-foreground": "210 40% 98%",
        border: "222 15% 17%",
        input: "222 15% 17%",
        ring: "210 40% 80%",
      },
    },
  },
  {
    name: "Crimson",
    description: "Bold red — edgy, media, entertainment",
    preview: "hsl(0, 72%, 51%)",
    colors: {
      light: {
        background: "0 0% 99%",
        foreground: "222 47% 11%",
        card: "0 0% 100%",
        "card-foreground": "222 47% 11%",
        popover: "0 0% 100%",
        "popover-foreground": "222 47% 11%",
        primary: "0 72% 51%",
        "primary-foreground": "0 0% 100%",
        secondary: "0 15% 96%",
        "secondary-foreground": "0 15% 20%",
        muted: "0 10% 96%",
        "muted-foreground": "215 16% 47%",
        accent: "0 50% 96%",
        "accent-foreground": "0 15% 20%",
        destructive: "25 95% 53%",
        "destructive-foreground": "0 0% 100%",
        success: "160 84% 39%",
        "success-foreground": "0 0% 100%",
        warning: "37 91% 55%",
        "warning-foreground": "0 0% 100%",
        info: "200 98% 39%",
        "info-foreground": "0 0% 100%",
        border: "0 10% 90%",
        input: "0 10% 90%",
        ring: "0 72% 51%",
      },
      dark: {
        background: "0 15% 5%",
        foreground: "210 40% 98%",
        card: "0 12% 8%",
        "card-foreground": "210 40% 98%",
        popover: "0 12% 8%",
        "popover-foreground": "210 40% 98%",
        primary: "0 84% 60%",
        "primary-foreground": "0 0% 100%",
        secondary: "0 12% 14%",
        "secondary-foreground": "214 32% 91%",
        muted: "0 10% 13%",
        "muted-foreground": "215 16% 58%",
        accent: "0 30% 18%",
        "accent-foreground": "214 32% 91%",
        destructive: "25 95% 53%",
        "destructive-foreground": "0 0% 100%",
        success: "160 84% 45%",
        "success-foreground": "210 40% 98%",
        warning: "43 96% 56%",
        "warning-foreground": "0 15% 5%",
        info: "199 89% 48%",
        "info-foreground": "210 40% 98%",
        border: "0 10% 16%",
        input: "0 10% 16%",
        ring: "0 84% 60%",
      },
    },
  },
  {
    name: "Indigo",
    description: "Refined indigo — current hue boosted, crisper edges",
    preview: "hsl(239, 84%, 67%)",
    colors: {
      light: {
        background: "210 40% 98%",
        foreground: "222 47% 11%",
        card: "0 0% 100%",
        "card-foreground": "222 47% 11%",
        popover: "0 0% 100%",
        "popover-foreground": "222 47% 11%",
        primary: "239 84% 67%",
        "primary-foreground": "0 0% 100%",
        secondary: "235 30% 96%",
        "secondary-foreground": "235 25% 17%",
        muted: "235 20% 96%",
        "muted-foreground": "215 16% 47%",
        accent: "239 70% 96%",
        "accent-foreground": "235 25% 17%",
        destructive: "0 72% 51%",
        "destructive-foreground": "0 0% 100%",
        success: "160 84% 39%",
        "success-foreground": "0 0% 100%",
        warning: "37 91% 55%",
        "warning-foreground": "0 0% 100%",
        info: "192 91% 36%",
        "info-foreground": "0 0% 100%",
        border: "235 20% 91%",
        input: "235 20% 91%",
        ring: "239 84% 67%",
      },
      dark: {
        background: "239 25% 5%",
        foreground: "210 40% 98%",
        card: "239 20% 8%",
        "card-foreground": "210 40% 98%",
        popover: "239 20% 8%",
        "popover-foreground": "210 40% 98%",
        primary: "234 89% 74%",
        "primary-foreground": "239 25% 5%",
        secondary: "239 22% 14%",
        "secondary-foreground": "214 32% 91%",
        muted: "239 18% 13%",
        "muted-foreground": "215 16% 60%",
        accent: "239 40% 22%",
        "accent-foreground": "214 32% 91%",
        destructive: "0 84% 60%",
        "destructive-foreground": "210 40% 98%",
        success: "160 84% 45%",
        "success-foreground": "210 40% 98%",
        warning: "43 96% 56%",
        "warning-foreground": "239 25% 5%",
        info: "188 94% 43%",
        "info-foreground": "210 40% 98%",
        border: "239 15% 17%",
        input: "239 15% 17%",
        ring: "234 89% 74%",
      },
    },
  },
];

const CSS_VAR_KEYS = [
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

function applyPalette(palette: PaletteColors, isDark: boolean): void {
  if (platform.isReactNative) {
    return;
  }
  const root = document.documentElement;
  const mode = isDark ? palette.dark : palette.light;
  for (const key of CSS_VAR_KEYS) {
    root.style.setProperty(`--${key}`, mode[key]);
  }
  // Also update sidebar vars to match
  root.style.setProperty("--sidebar-primary", mode.primary);
  root.style.setProperty(
    "--sidebar-primary-foreground",
    mode["primary-foreground"],
  );
  root.style.setProperty("--sidebar-ring", mode.ring);
  root.style.setProperty("--sidebar-background", mode.background);
  root.style.setProperty("--sidebar-foreground", mode.foreground);
  root.style.setProperty(
    "--sidebar-accent",
    isDark ? mode.secondary : mode.accent,
  );
  root.style.setProperty(
    "--sidebar-accent-foreground",
    mode["accent-foreground"],
  );
  root.style.setProperty("--sidebar-border", mode.border);
  // Chart colors
  root.style.setProperty("--chart-1", mode.primary);
  root.style.setProperty("--chart-2", mode.success);
  root.style.setProperty("--chart-3", mode.info);
  root.style.setProperty("--chart-4", mode.warning);
  root.style.setProperty("--chart-5", "340 80% 63%");
}

function resetPalette(): void {
  if (platform.isReactNative) {
    return;
  }
  const root = document.documentElement;
  for (const key of CSS_VAR_KEYS) {
    root.style.removeProperty(`--${key}`);
  }
  // Reset sidebar vars
  root.style.removeProperty("--sidebar-primary");
  root.style.removeProperty("--sidebar-primary-foreground");
  root.style.removeProperty("--sidebar-ring");
  root.style.removeProperty("--sidebar-background");
  root.style.removeProperty("--sidebar-foreground");
  root.style.removeProperty("--sidebar-accent");
  root.style.removeProperty("--sidebar-accent-foreground");
  root.style.removeProperty("--sidebar-border");
  root.style.removeProperty("--chart-1");
  root.style.removeProperty("--chart-2");
  root.style.removeProperty("--chart-3");
  root.style.removeProperty("--chart-4");
  root.style.removeProperty("--chart-5");
}

export function PaletteSwitcher(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
    if (index === 0) {
      resetPalette();
      return;
    }
    const palette = PALETTES[index];
    if (!palette) {
      return;
    }
    const isDark =
      !platform.isReactNative &&
      document.documentElement.classList.contains("dark");
    applyPalette(palette.colors, isDark);
  }, []);

  // Re-apply when theme toggles (listen for class changes)
  if (!platform.isReactNative) {
    // Using a simple approach: re-apply on every render if active
    const isDark =
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark");
    if (activeIndex !== 0) {
      const palette = PALETTES[activeIndex];
      if (palette) {
        // Schedule after render to catch theme toggle
        setTimeout(() => applyPalette(palette.colors, isDark), 0);
      }
    }
  }

  return (
    <Div className="flex flex-col gap-3">
      <Div className="flex flex-row flex-wrap gap-2">
        {PALETTES.map((palette, index) => (
          <Button
            key={palette.name}
            variant={activeIndex === index ? "default" : "outline"}
            size="sm"
            className="gap-2 h-auto py-1.5 px-3"
            onClick={() => handleSelect(index)}
          >
            {/* oxlint-disable-next-line oxlint-plugin-jsx-capitalization/jsx-capitalization -- needs both className and style for dynamic color preview */}
            <span
              className="w-4 h-4 rounded-full border border-foreground/20 shrink-0 inline-block"
              style={{ backgroundColor: palette.preview }}
            />
            <Div className="flex flex-col items-start">
              <P className="text-xs font-semibold leading-tight">
                {palette.name}
              </P>
            </Div>
            {activeIndex === index && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                Active
              </Badge>
            )}
          </Button>
        ))}
      </Div>
      <P className="text-xs text-muted-foreground">
        {PALETTES[activeIndex]?.description}
        {activeIndex === 0 ? " — reset to default with first button" : ""}
      </P>
    </Div>
  );
}
