/**
 * STUB: slider
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Slider({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Slider');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Slider (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const SliderContent = Slider;
export const SliderHeader = Slider;
export const SliderFooter = Slider;
export const SliderTitle = Slider;
export const SliderDescription = Slider;
export const SliderTrigger = Slider;
export const SliderItem = Slider;
export const SliderLabel = Slider;

export default Slider;
