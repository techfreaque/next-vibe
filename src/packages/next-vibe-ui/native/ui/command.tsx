/**
 * STUB: command
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Command({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Command');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Command (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const CommandContent = Command;
export const CommandHeader = Command;
export const CommandFooter = Command;
export const CommandTitle = Command;
export const CommandDescription = Command;
export const CommandTrigger = Command;
export const CommandItem = Command;
export const CommandLabel = Command;

export default Command;
