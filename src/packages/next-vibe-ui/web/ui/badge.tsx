import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "next-vibe/shared/utils/utils";
import type * as React from "react";

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
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Cross-platform types - exported for native
export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

// Platform-agnostic props that work on both web and native
export interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean; // Native-specific, optional for web
}

// Web-specific props with full HTML attributes
export interface WebBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({
  className,
  variant,
  ...props
}: WebBadgeProps): React.JSX.Element {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
