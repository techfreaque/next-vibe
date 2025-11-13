import * as LabelPrimitive from "@rn-primitives/label";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import type { LabelRootProps } from "../../web/ui/label";

export function Label({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  children,
  nativeID,
  // Web-only prop - destructured but not used on native
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  htmlFor,
}: LabelRootProps): React.JSX.Element {
  const textClassName = cn(
    "text-sm text-foreground text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-default",
    className,
  );

  return (
    <LabelPrimitive.Root>
      <LabelPrimitive.Text className={textClassName} nativeID={nativeID}>
        {children}
      </LabelPrimitive.Text>
    </LabelPrimitive.Root>
  );
}
Label.displayName = "Label";
