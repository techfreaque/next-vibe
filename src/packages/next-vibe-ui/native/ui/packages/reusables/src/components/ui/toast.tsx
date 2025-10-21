/**
 * STUB: toast
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function Toast({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: Toast');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        Toast (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const ToastContent = Toast;
export const ToastHeader = Toast;
export const ToastFooter = Toast;
export const ToastTitle = Toast;
export const ToastDescription = Toast;
export const ToastTrigger = Toast;
export const ToastItem = Toast;
export const ToastLabel = Toast;

export default Toast;
