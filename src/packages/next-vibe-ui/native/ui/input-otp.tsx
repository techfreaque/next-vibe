/**
 * InputOTP Component for React Native
 * Simple OTP input implementation using TextInput
 */
import { Minus } from "lucide-react-native";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import React, { createContext, useContext, useState } from "react";
import { Text as RNText, TextInput, View } from "react-native";

// Import all public types from web version (web is source of truth)
import type {
  InputOTPGroupProps,
  InputOTPProps,
  InputOTPSeparatorProps,
  InputOTPSlotProps,
  OTPContextValue,
} from "../../web/ui/input-otp";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

const StyledView = styled(View, { className: "style" });
const StyledTextInput = styled(TextInput, { className: "style" });
const StyledText = styled(RNText, { className: "style" });

// Internal context type for implementation (not exported)
type InternalOTPContextValue = OTPContextValue | undefined;

const OTPContext = createContext<InternalOTPContextValue>(undefined);

function useOTP(): OTPContextValue {
  const context = useContext(OTPContext);
  if (!context) {
    // oxlint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Standard React context hook pattern - throw is correct for developer mistakes
    throw new Error("OTP components must be used within InputOTP"); // eslint-disable-line i18next/no-literal-string -- Error message
  }
  return context;
}

function InputOTP({
  className,
  style,
  containerClassName,
  maxLength = 6,
  value: controlledValue,
  onChange,
  children,
}: InputOTPProps): React.JSX.Element {
  const [uncontrolledValue, setUncontrolledValue] = useState("");
  const value = controlledValue ?? uncontrolledValue;
  const onChangeValue = onChange ?? setUncontrolledValue;
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <OTPContext.Provider value={{ value, onChange: onChangeValue, maxLength }}>
      <StyledView
        className={cn(
          "flex flex-row items-center gap-2 opacity-100",
          containerClassName,
        )}
      >
        {children}
      </StyledView>
      <StyledTextInput
        value={value}
        onChangeText={onChangeValue}
        maxLength={maxLength}
        keyboardType="number-pad"
        {...applyStyleType({
          nativeStyle,
          className: cn("absolute opacity-0 w-0 h-0", className),
        })}
      />
    </OTPContext.Provider>
  );
}
InputOTP.displayName = "InputOTP";

function InputOTPGroup({
  className,
  style,
  children,
}: InputOTPGroupProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-row items-center", className),
      })}
    >
      {children}
    </StyledView>
  );
}
InputOTPGroup.displayName = "InputOTPGroup";

function InputOTPSlot({
  index,
  className,
  style,
}: InputOTPSlotProps): React.JSX.Element | null {
  const { value } = useOTP();
  const char = value[index] || "";
  const isActive = index === value.length;
  const hasFakeCaret = isActive;
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
          isActive ? "z-10 ring-1 ring-ring" : "",
          className,
        ),
      })}
    >
      <StyledText className="text-foreground">{char}</StyledText>
      {hasFakeCaret && (
        <StyledView className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <StyledView className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </StyledView>
      )}
    </StyledView>
  );
}
InputOTPSlot.displayName = "InputOTPSlot";

function InputOTPSeparator({
  className,
  style,
}: InputOTPSeparatorProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      role="separator"
      {...applyStyleType({
        nativeStyle,
        className,
      })}
    >
      <Minus size={16} strokeWidth={2} color="#888" />
    </StyledView>
  );
}
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
