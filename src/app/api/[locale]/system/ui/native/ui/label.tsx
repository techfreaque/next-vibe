import * as LabelPrimitive from "@rn-primitives/label";
import { cn } from "next-vibe/core/utils/utils";
import { styledNative } from "next-vibe/ui/native/utils/style-converter";
import type { LabelRootProps } from "next-vibe/ui/web/ui/label";
import * as React from "react";

const StyledText = styledNative(LabelPrimitive.Text);

export function Label({
  className,
  children,
  htmlFor,
}: LabelRootProps): React.JSX.Element {
  return (
    <LabelPrimitive.Root>
      <StyledText
        className={cn(
          "text-foreground text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-default",
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
