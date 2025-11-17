import * as CheckboxPrimitive from "@rn-primitives/checkbox";
import { styled } from "nativewind";
import * as React from "react";

import { cn } from "next-vibe/shared/utils/utils";
import { Check } from "./icons/Check";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

import type {
  CheckboxRootProps,
  CheckboxIndicatorProps,
} from "@/packages/next-vibe-ui/web/ui/checkbox";

const StyledCheckboxRoot = styled(CheckboxPrimitive.Root, {
  className: "style",
});
const StyledCheckboxIndicator = styled(CheckboxPrimitive.Indicator, {
  className: "style",
});

export function Checkbox({
  className,
  style,
  checked,
  onCheckedChange,
  disabled,
  children,
}: CheckboxRootProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledCheckboxRoot
      checked={checked ?? false}
      onCheckedChange={onCheckedChange ?? ((): void => undefined)}
      disabled={disabled ?? false}
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          checked && "bg-primary",
          className,
        ),
      })}
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
  style,
  children,
}: CheckboxIndicatorProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledCheckboxIndicator
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex flex-row items-center justify-center text-current",
          className,
        ),
      })}
    >
      {children ?? <Check size={14} className="text-primary-foreground" />}
    </StyledCheckboxIndicator>
  );
}
CheckboxIndicator.displayName = CheckboxPrimitive.Indicator.displayName;
