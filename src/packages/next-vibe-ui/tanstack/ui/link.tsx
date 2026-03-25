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
 * TanStack Start implementation of Link - uses @tanstack/react-router Link.
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

export interface ExternalLinkProps {
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
 * ExternalLink for TanStack — uses plain <a> for external URLs
 */
export function ExternalLink({
  className,
  children,
  href,
  target,
  rel,
  onClick,
  download,
  title,
}: ExternalLinkProps): JSX.Element {
  return (
    // eslint-disable-next-line jsx-capitalization/jsx-capitalization
    <a
      className={className}
      href={href}
      target={target}
      rel={rel}
      {...(onClick ? { onClick } : {})}
      download={download}
      title={title}
    >
      {children}
    </a>
  );
}

ExternalLink.displayName = "ExternalLink";

export default Link;
