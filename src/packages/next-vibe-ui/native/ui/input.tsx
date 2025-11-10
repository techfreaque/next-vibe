import type { TextInputProps } from "react-native";
import { TextInput, View } from "react-native";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";

// Import all public types from web version (web is source of truth)
import type { InputProps as WebInputProps } from "@/packages/next-vibe-ui/web/ui/input";

// Styled View for NativeWind - TextInput cannot be styled (animations not supported)
const StyledView = styled(View);

// Native input props combine web interface with native TextInput props
// Exclude conflicting event handlers - onKeyPress has different signatures on web/native
type NativeInputProps = Omit<WebInputProps, "onKeyPress"> &
  Omit<TextInputProps, "className" | "disabled" | "onKeyPress"> & {
    onKeyPress?: TextInputProps["onKeyPress"]; // Use native signature
  };

export function Input({
  className,
  onChangeText,
  disabled,
  editable,
  ...props
}: NativeInputProps): React.JSX.Element {
  return (
    <StyledView
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background shadow-sm",
        disabled && "opacity-50",
        className,
      )}
    >
      <TextInput
        className="flex-1 px-3 text-sm text-foreground"
        placeholderTextColor="hsl(var(--muted-foreground))"
        onChangeText={onChangeText}
        editable={editable ?? !disabled}
        scrollEnabled={false}
        multiline={false}
        {...props}
      />
    </StyledView>
  );
}
