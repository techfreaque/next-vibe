"use client";

import type { Route } from "next";
import NextLink from "next/link";
import * as React from "react";

export interface LinkProps<RouteType extends string> {
  children?: React.ReactNode;
  href: Route<RouteType>;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: () => void;
  className?: string;
  download?: string | boolean;
  title?: string;
}

/**
 * Link component for web using Next.js Link
 * Supports asChild pattern for composition
 */
export function Link<RouteType extends string>({
  className,
  children,
  href,
  target,
  rel,
  onClick,
  download,
  title,
}: LinkProps<RouteType>): React.JSX.Element {
  return (
    <NextLink
      className={className}
      href={href}
      target={target}
      rel={rel}
      {...(onClick ? { onClick } : {})}
      download={download}
      title={title}
    >
      {children}
    </NextLink>
  );
}

Link.displayName = "Link";

export interface ExternalLinkProps {
  children?: React.ReactNode;
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  onClick?: () => void;
  className?: string;
  download?: string | boolean;
  title?: string;
  /**
   * Label to show when the surface cannot render a real hyperlink, so the href
   * would otherwise have to be printed inline to stay useful. A terminal without
   * OSC-8 support is the case that needs it: `12:5` is meaningless unlinked,
   * where `src/foo.ts:12:5` still tells you where to look.
   *
   * Ignored on web, which can always render an anchor.
   */
  unlinkedLabel?: string;
}

/**
 * ExternalLink component for external URLs (https://, blob:, data:, mailto:, etc.)
 * Uses a plain <a> tag since external URLs don't go through Next.js router
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
}: ExternalLinkProps): React.JSX.Element {
  return (
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
