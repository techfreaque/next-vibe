import { Slot } from "@radix-ui/react-slot";
import NextLink from "next/link";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform base props interface
export interface LinkBaseProps {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Web-specific props interface that extends Next.js Link
export interface LinkProps
  extends React.ComponentPropsWithoutRef<typeof NextLink> {
  asChild?: boolean;
  className?: string;
}

/**
 * Link component for web using Next.js Link
 * Supports asChild pattern for composition
 */
const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ asChild = false, className, children, ...props }, ref) => {
    const Comp = asChild ? Slot : NextLink;

    return (
      <Comp
        ref={ref}
        className={cn(
          "text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);

Link.displayName = "Link";

export { Link };
