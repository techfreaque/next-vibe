import * as LabelPrimitive from "@rn-primitives/label";
import * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
import type { LabelRootProps } from "../../web/components/label";
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
