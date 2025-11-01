import { Image as RNImage } from "react-native";

// Import all public types from web version (web is source of truth)
import type { ImageProps } from "../../web/ui/image";

// Re-export React Native Image for native
export const Image = RNImage;

// Re-export types for convenience
export type { ImageProps };
