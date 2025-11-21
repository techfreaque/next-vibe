import NextLink from "next/link";
import * as React from "react";

export interface LinkProps {
  children?: React.ReactNode;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Link component for web using Next.js Link
 * Supports asChild pattern for composition
 */
export function Link({
  className,
  children,
  href,
  target,
  rel,
  onClick,
}: LinkProps): React.JSX.Element {
  return (
    <NextLink
      className={className}
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
    >
      {children}
    </NextLink>
  );
}

Link.displayName = "Link";
