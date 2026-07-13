import * as LabelPrimitive from "@rn-primitives/label";
import { cn } from "next-vibe/core/utils/utils";
import * as React from "react";

import { styledNative } from "../../native/utils/style-converter";
import type { LabelRootProps } from "../../web/ui/label";

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
