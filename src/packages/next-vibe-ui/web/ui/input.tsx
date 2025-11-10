import { cn } from "next-vibe/shared/utils/utils";
import type { InputHTMLAttributes } from "react";
import * as React from "react";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "autoCapitalize"
> & {
  // Native-specific props (optional for web)
  onChangeText?: (text: string) => void;
  autoCorrect?: boolean | string;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  editable?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      onChange,
      onChangeText,
      autoCorrect: _autoCorrect,
      autoCapitalize: _autoCapitalize,
      secureTextEntry: _secureTextEntry,
      keyboardType: _keyboardType,
      ...props
    },
    ref,
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      onChange?.(e);
      onChangeText?.(e.target.value);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background text-foreground px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
