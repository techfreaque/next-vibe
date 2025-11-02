import * as LabelPrimitive from "@rn-primitives/label";
import * as React from "react";

import { cn } from "next-vibe/shared/utils/utils";

// Import all public types from web version (web is source of truth)
import type { LabelBaseProps, LabelProps } from "../../web/ui/label";

// Native label props extend web props with native-specific properties
type NativeLabelProps = LabelProps & {
  nativeID?: string;
};

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Text>,
  NativeLabelProps
>(({ className, ...props }, ref) => {
  const textClassName = cn(
    "text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70 web:cursor-default",
    className,
  );

  return (
    <LabelPrimitive.Root>
      <LabelPrimitive.Text ref={ref} className={textClassName} {...props} />
    </LabelPrimitive.Root>
  );
});
Label.displayName = "Label";

export { Label };
