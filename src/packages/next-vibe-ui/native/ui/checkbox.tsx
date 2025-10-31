import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import * as React from "react";
import { Platform } from "react-native";

import { cn } from "../lib/utils";
import type { WithClassName } from "../lib/types";
import { Check } from "./icons/Check";

// Cross-platform props interface
export interface CheckboxBaseProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  value?: string;
  name?: string;
  required?: boolean;
}

// Native checkbox props that align with web interface
type NativeCheckboxProps = WithClassName<CheckboxBaseProps>;

const Checkbox = React.forwardRef<
  CheckboxPrimitive.RootRef,
  NativeCheckboxProps
>(({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
  const rootClassName = cn(
    "web:peer h-4 w-4 native:h-[20] native:w-[20] shrink-0 rounded-sm native:rounded border border-primary web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    checked && "bg-primary",
    className,
  );

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={rootClassName}
      {...props}
    >
      <CheckboxPrimitive.Indicator className={cn("items-center justify-center h-full w-full")}>
        <Check
          size={12}
          strokeWidth={Platform.OS === "web" ? 2.5 : 3.5}
          className="text-primary-foreground"
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
export type { NativeCheckboxProps as CheckboxProps };
