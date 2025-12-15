import * as LabelPrimitive from "@rn-primitives/label";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { LabelRootProps } from "../../web/ui/label";
import { styledNative } from "../utils/style-converter";

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
