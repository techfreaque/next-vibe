import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { styled } from "nativewind";
import * as React from "react";

import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";

import type {
  CheckboxRootProps,
  CheckboxIndicatorProps,
} from "@/packages/next-vibe-ui/web/ui/checkbox";

const StyledCheckboxRoot = styled(CheckboxPrimitive.Root, { className: "style" });
const StyledCheckboxIndicator = styled(CheckboxPrimitive.Indicator, { className: "style" });

export function Checkbox({
  className,
  checked,
  onCheckedChange,
  disabled,
  children,
}: CheckboxRootProps): React.JSX.Element {
  return (
    <StyledCheckboxRoot
      checked={checked ?? false}
      onCheckedChange={onCheckedChange ?? ((): void => undefined)}
      disabled={disabled ?? false}
      className={cn(
        "peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        checked && "bg-primary",
        className,
      )}
    >
      {children ?? (
        <StyledCheckboxIndicator
          className={cn(
            "flex flex-row items-center justify-center text-current",
          )}
        >
          <Check size={14} className="text-primary-foreground" />
        </StyledCheckboxIndicator>
      )}
    </StyledCheckboxRoot>
  );
}
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export function CheckboxIndicator({
  className,
  children,
}: CheckboxIndicatorProps): React.JSX.Element {
  return (
    <StyledCheckboxIndicator
      className={cn(
        "flex flex-row items-center justify-center text-current",
        className,
      )}
    >
      {children ?? <Check size={14} className="text-primary-foreground" />}
    </StyledCheckboxIndicator>
  );
}
CheckboxIndicator.displayName = CheckboxPrimitive.Indicator.displayName;
