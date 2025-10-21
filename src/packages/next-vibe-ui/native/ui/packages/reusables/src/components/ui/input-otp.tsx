/**
 * STUB: input-otp
 * Auto-generated placeholder for web-only component
 *
 * This component exists in next-vibe-ui/web/ui but not in native UI.
 * Replace this stub with a proper React Native implementation.
 */
import { View, Text } from 'react-native';
import type { ReactNode } from 'react';

export function InputOtp({ children, ...props }: { children?: ReactNode; [key: string]: any }) {
  console.warn('🔶 Using stub: InputOtp');

  return (
    <View style={{ padding: 8, backgroundColor: '#FEF3C7', marginVertical: 4, borderRadius: 4 }}>
      <Text style={{ fontSize: 12, color: '#92400E', marginBottom: 4 }}>
        InputOtp (stub)
      </Text>
      {children}
    </View>
  );
}

// Re-export any common sub-components as stubs
export const InputOtpContent = InputOtp;
export const InputOtpHeader = InputOtp;
export const InputOtpFooter = InputOtp;
export const InputOtpTitle = InputOtp;
export const InputOtpDescription = InputOtp;
export const InputOtpTrigger = InputOtp;
export const InputOtpItem = InputOtp;
export const InputOtpLabel = InputOtp;

export default InputOtp;
