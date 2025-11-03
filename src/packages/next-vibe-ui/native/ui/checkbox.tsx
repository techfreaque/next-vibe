import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { styled } from "nativewind";
import * as React from "react";
import { Platform } from "react-native";

import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";

import type { CheckboxBaseProps } from "next-vibe-ui/ui/checkbox";

export type CheckboxProps = Omit<
  CheckboxBaseProps,
  "defaultChecked" | "value" | "name" | "required"
>;
const StyledCheckboxRoot = styled(CheckboxPrimitive.Root);
const StyledCheckboxIndicator = styled(CheckboxPrimitive.Indicator);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, checked, onCheckedChange, disabled }, ref) => {
  const isChecked = checked ?? false;
  // oxlint-disable-next-line explicit-function-return-type
  const handleCheckedChange = onCheckedChange ?? (() => undefined);
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
        className={cn("flex items-center justify-center text-current")}
      >
        <Check
          size={Platform.OS === "web" ? 16 : 12}
          className="text-primary-foreground"
        />
      </StyledCheckboxIndicator>
    </StyledCheckboxRoot>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
