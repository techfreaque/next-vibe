/**
 * InputOTP Component for React Native
 * Simple OTP input implementation using TextInput
 */
import { Minus } from "lucide-react-native";
import React, { createContext, useContext, useState } from "react";
import type { TextInputProps } from "react-native";
import { Text as RNText, TextInput, View } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";

// Import all public types from web version (web is source of truth)
import type {
  InputOTPGroupProps,
  InputOTPProps,
  InputOTPSeparatorProps,
  InputOTPSlotProps,
} from "../../web/ui/input-otp";

interface OTPContextValue {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

const OTPContext = createContext<OTPContextValue | undefined>(undefined);

function useOTP(): OTPContextValue {
  const context = useContext(OTPContext);
  if (!context) {
    // eslint-disable-next-line no-restricted-syntax -- Error handling for context
    throw new Error("OTP components must be used within InputOTP"); // eslint-disable-line i18next/no-literal-string -- Error message
  }
  return context;
}

export const InputOTP = React.forwardRef<
  TextInput,
  InputOTPProps & Omit<TextInputProps, keyof InputOTPProps>
>(
  (
    {
      value: controlledValue,
      onChange,
      maxLength = 6,
      className,
      containerClassName,
      children,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState("");
    const value = controlledValue ?? uncontrolledValue;
    const onChangeValue = onChange ?? setUncontrolledValue;

    return (
      <OTPContext.Provider
        value={{ value, onChange: onChangeValue, maxLength }}
      >
        <View
          className={cn(
            "flex flex-row items-center gap-2 opacity-100",
            containerClassName,
          )}
        >
          {children}
        </View>
        <TextInput
          ref={ref}
          value={value}
          onChangeText={onChangeValue}
          maxLength={maxLength}
          keyboardType="number-pad"
          className={cn("absolute opacity-0 w-0 h-0", className)}
          {...props}
        />
      </OTPContext.Provider>
    );
  },
);

InputOTP.displayName = "InputOTP";

export const InputOTPGroup = React.forwardRef<View, InputOTPGroupProps>(
  ({ className, children }, ref) => (
    <View ref={ref} className={cn("flex flex-row items-center", className)}>
      {children}
    </View>
  ),
);

InputOTPGroup.displayName = "InputOTPGroup";

export const InputOTPSlot = React.forwardRef<View, InputOTPSlotProps>(
  ({ index, className }, ref) => {
    const { value } = useOTP();
    const char = value[index] || "";
    const isActive = index === value.length;

    return (
      <View
        ref={ref}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
          isActive ? "z-10 ring-1 ring-ring" : "",
          className,
        )}
      >
        <RNText className="text-foreground">{char}</RNText>
      </View>
    );
  },
);

InputOTPSlot.displayName = "InputOTPSlot";

export const InputOTPSeparator = React.forwardRef<View, InputOTPSeparatorProps>(
  ({ className }, ref) => (
    <View ref={ref} role="separator" className={className}>
      <Minus size={16} strokeWidth={2} color="#888" />
    </View>
  ),
);

InputOTPSeparator.displayName = "InputOTPSeparator";
