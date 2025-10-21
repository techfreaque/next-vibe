/**
 * STUB: carousel
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Carousel({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Carousel');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Carousel (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const CarouselContent = Carousel;
export const CarouselHeader = Carousel;
export const CarouselFooter = Carousel;
export const CarouselTitle = Carousel;
export const CarouselDescription = Carousel;
export const CarouselTrigger = Carousel;
export const CarouselItem = Carousel;
export const CarouselLabel = Carousel;

export default Carousel;
