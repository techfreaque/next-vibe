import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { styled } from "nativewind";
import * as React from "react";

import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";

import type { CheckboxBaseProps } from "@/packages/next-vibe-ui/web/ui/checkbox";

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
        "peer h-5 w-5 h-5 w-5 shrink-0 rounded-sm rounded border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isChecked && "bg-primary",
        className,
      )}
    >
      <StyledCheckboxIndicator
        className={cn("flex flex-row items-center justify-center text-current")}
      >
        <Check
          size={14}
          className="text-primary-foreground"
        />
      </StyledCheckboxIndicator>
    </StyledCheckboxRoot>
  );
});
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
