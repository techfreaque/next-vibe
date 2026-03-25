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
