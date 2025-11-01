import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import * as React from "react";
import { Platform } from "react-native";

import type { WithClassName } from "../lib/types";
import { cn } from "../lib/utils";
import { Check } from "./icons/Check";

// Import cross-platform props interface from web
export type { CheckboxBaseProps } from "next-vibe-ui/ui/checkbox";
import type { CheckboxBaseProps } from "next-vibe-ui/ui/checkbox";

// Native checkbox props that align with web interface
export type CheckboxProps = CheckboxBaseProps;

// Type-safe wrappers for primitives with className support
const StyledCheckboxRoot = CheckboxPrimitive.Root as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>> &
    React.RefAttributes<React.ElementRef<typeof CheckboxPrimitive.Root>>
>;

const StyledCheckboxIndicator = CheckboxPrimitive.Indicator as React.ForwardRefExoticComponent<
  WithClassName<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>> &
    React.RefAttributes<React.ElementRef<typeof CheckboxPrimitive.Indicator>>
>;

const Checkbox = React.forwardRef<
  CheckboxPrimitive.RootRef,
  CheckboxProps
>(({ className, checked, onCheckedChange, disabled, defaultChecked, value, name, required }, ref) => {
  const isChecked = checked ?? false;
  const handleCheckedChange = onCheckedChange ?? (() => {});
  const isDisabled = disabled ?? false;

  return (
    <StyledCheckboxRoot
      ref={ref}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      disabled={isDisabled}
      className={cn(
        "web:peer h-4 w-4 native:h-[20] native:w-[20] shrink-0 rounded-sm native:rounded border border-primary web:ring-offset-background web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isChecked && "bg-primary",
        className,
      )}
    >
      <StyledCheckboxIndicator
        className={cn("items-center justify-center h-full w-full")}
      >
        <Check
          size={12}
          strokeWidth={Platform.OS === "web" ? 2.5 : 3.5}
          color="currentColor"
        />
      </StyledCheckboxIndicator>
    </StyledCheckboxRoot>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
