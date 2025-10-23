import * as LabelPrimitive from "@rn-primitives/label";
import * as React from "react";

import { cn } from "../lib/utils";

const Label = React.forwardRef<
  LabelPrimitive.TextRef,
  Omit<LabelPrimitive.RootProps, "children"> & LabelPrimitive.TextProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root className="web:cursor-default" {...props}>
    <LabelPrimitive.Text
      ref={ref}
      className={cn(
        "text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70",
        className,
      )}
    />
  </LabelPrimitive.Root>
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
