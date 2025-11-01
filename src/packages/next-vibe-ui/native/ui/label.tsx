/// <reference path="../../../../../nativewind-env.d.ts" />
import * as LabelPrimitive from "@rn-primitives/label";
import * as React from "react";

import { cn } from "../lib/utils";

// Import all public types from web version (web is source of truth)
import type { LabelBaseProps } from "../../web/ui/label";

const Label = React.forwardRef<LabelPrimitive.TextRef, LabelBaseProps>(
  ({ className, children, ...props }, ref) => {
    const textClassName = cn(
      "text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70 web:cursor-default",
      className,
    );

    return (
      <LabelPrimitive.Root>
        <LabelPrimitive.Text ref={ref} className={textClassName} {...props}>
          {children}
        </LabelPrimitive.Text>
      </LabelPrimitive.Root>
    );
  },
);
Label.displayName = "Label";

export { Label };
