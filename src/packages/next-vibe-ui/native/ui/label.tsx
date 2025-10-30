import * as LabelPrimitive from "@rn-primitives/label";
import * as React from "react";

import { cn } from "../lib/utils";

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Text> {
  className?: string;
  onPress?: () => void;
  nativeID?: string;
  htmlFor?: string;
  asChild?: boolean;
}

const Label = React.forwardRef<
  LabelPrimitive.TextRef,
  LabelProps
>(({ className, children, onPress, nativeID, htmlFor, asChild, ...props }, ref) => {
  const textClassName = cn(
    "text-sm text-foreground native:text-base font-medium leading-none web:peer-disabled:cursor-not-allowed web:peer-disabled:opacity-70 web:cursor-default",
    className,
  );

  return (
    <LabelPrimitive.Root {...({ onPress } as any)}>
      <LabelPrimitive.Text
        ref={ref}
        {...({
          nativeID,
          htmlFor,
          asChild,
          className: textClassName,
          ...props,
        } as any)}
      >
        {children}
      </LabelPrimitive.Text>
    </LabelPrimitive.Root>
  );
});
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
