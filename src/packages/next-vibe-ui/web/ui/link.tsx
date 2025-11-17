import NextLink from "next/link";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

export type LinkProps = {
  children?: React.ReactNode;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: () => void;
} & StyleType;

/**
 * Link component for web using Next.js Link
 * Supports asChild pattern for composition
 */
export function Link({
  className,
  style,
  children,
  href,
}: LinkProps): React.JSX.Element {
  return (
    <NextLink
      className={cn(
        "text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      style={style}
      href={href}
    >
      {children}
    </NextLink>
  );
}

Link.displayName = "Link";
