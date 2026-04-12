import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import type * as React from "react";

import type { StyleType } from "../utils/style-type";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80 shadow-sm",
        outline: "text-foreground",
        notification:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        success:
          "border-transparent bg-success text-success-foreground shadow hover:bg-success/80",
        warning:
          "border-transparent bg-warning text-warning-foreground shadow hover:bg-warning/80",
        info: "border-transparent bg-info text-info-foreground shadow hover:bg-info/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const badgeTextVariants = cva("text-xs font-semibold", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive-foreground",
      outline: "text-foreground",
      notification: "text-destructive-foreground",
      success: "text-success-foreground",
      warning: "text-warning-foreground",
      info: "text-info-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export type BadgeProps = {
  variant?: BadgeVariant;
  children?: React.ReactNode;
} & StyleType;

function Badge({
  className,
  style,
  variant,
  children,
}: BadgeProps): React.JSX.Element {
  return (
    <div className={cn(badgeVariants({ variant }), className)} style={style}>
      {children}
    </div>
  );
}

export { Badge, badgeTextVariants, badgeVariants };
