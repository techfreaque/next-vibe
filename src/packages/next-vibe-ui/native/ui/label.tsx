import * as LabelPrimitive from "@rn-primitives/label";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { styled } from "nativewind";

import type { LabelRootProps } from "../../web/ui/label";

const StyledText = styled(LabelPrimitive.Text, { className: "style" });

export function Label({
  className,
  children,
  htmlFor,
}: LabelRootProps): React.JSX.Element {
  return (
    <LabelPrimitive.Root>
      <StyledText
        className={cn(
          "text-sm text-foreground text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-default",
          className,
        )}
        nativeID={htmlFor}
      >
        {children}
      </StyledText>
    </LabelPrimitive.Root>
  );
}
Label.displayName = "Label";
