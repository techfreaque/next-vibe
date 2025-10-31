import NextImage from "next/image";

// Cross-platform image props - essential subset that works on both platforms
export interface ImageProps {
  src: string | { uri: string };
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

// Re-export Next.js Image for web
export const Image = NextImage;
