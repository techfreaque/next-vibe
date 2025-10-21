/**
 * STUB: sonner
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Sonner({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Sonner');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Sonner (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const SonnerContent = Sonner;
export const SonnerHeader = Sonner;
export const SonnerFooter = Sonner;
export const SonnerTitle = Sonner;
export const SonnerDescription = Sonner;
export const SonnerTrigger = Sonner;
export const SonnerItem = Sonner;
export const SonnerLabel = Sonner;

export default Sonner;
