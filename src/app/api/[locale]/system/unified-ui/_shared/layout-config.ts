/**
 * Layout Configuration
 * Shared across multiple widgets to avoid circular dependencies
 */

import type { LayoutType, SpacingSize } from "../types/enums";

/**
 * Layout configuration for containers and widgets
 */
export interface LayoutConfig {
  type: LayoutType;
  columns?: number;
  rows?: number;
  gap?: SpacingSize;
  padding?: SpacingSize;
  margin?: SpacingSize;
  spacing?: "compact" | "normal" | "relaxed"; // Added for consistent spacing control
  responsive?: {
    sm?: Partial<LayoutConfig>;
    md?: Partial<LayoutConfig>;
    lg?: Partial<LayoutConfig>;
    xl?: Partial<LayoutConfig>;
  };
}
