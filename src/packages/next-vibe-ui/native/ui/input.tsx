import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";

// Import all public types from web version (web is source of truth)
import type { InputProps as WebInputProps } from "@/packages/next-vibe-ui/web/ui/input";
import { Div } from "./div";

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
    <Div
      className={cn(
        // Wrapper handles: border, background, padding, rounded corners
        "flex h-10 native:h-12 w-full rounded-md border border-input bg-background px-3 py-2",
        disabled && "opacity-50",
        className,
      )}
    >
      <TextInput
        className={cn(
          // Input handles: text color, size, flex - NO border/background (wrapper handles that)
          "flex-1 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground border-0",
        )}
        style={{ outlineWidth: 0 }} // Remove any default outline/border
        placeholderTextColor="rgb(var(--muted-foreground))"
        onChangeText={onChangeText}
        editable={editable ?? !disabled}
        {...props}
      />
    </Div>
  );
}
