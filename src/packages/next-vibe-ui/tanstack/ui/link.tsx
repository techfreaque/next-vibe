import { Link as TanstackLink } from "@tanstack/react-router";
import type { JSX, ReactNode } from "react";

export interface LinkProps {
  children?: ReactNode;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: () => void;
  className?: string;
  download?: string | boolean;
  title?: string;
}

/**
 * TanStack Start implementation of Link — uses @tanstack/react-router Link.
 */
export function Link({
  className,
  children,
  href,
  target,
  rel,
  onClick,
  title,
}: LinkProps): JSX.Element {
  return (
    <TanstackLink
      to={href}
      className={className}
      target={target}
      rel={rel}
      {...(onClick ? { onClick } : {})}
      title={title}
    >
      {children}
    </TanstackLink>
  );
}

Link.displayName = "Link";

export default Link;
