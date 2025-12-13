import { ChevronRightIcon, DotsHorizontalIcon } from "next-vibe-ui/ui/icons";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

import { useTranslation } from "@/i18n/core/client";

// Breadcrumb
export type BreadcrumbProps = {
  children?: React.ReactNode;
  separator?: React.ReactNode;
} & StyleType;

export function Breadcrumb({
  className,
  style,
  children,
}: BreadcrumbProps): React.JSX.Element {
  return (
    <nav aria-label="breadcrumb" className={className} style={style}>
      {children}
    </nav>
  );
}
Breadcrumb.displayName = "Breadcrumb";

// BreadcrumbList
export type BreadcrumbListProps = {
  children?: React.ReactNode;
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
} & StyleType;

export function BreadcrumbList({
  className,
  style,
  children,
  id,
  role,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}: BreadcrumbListProps): React.JSX.Element {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 wrap-break-word text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      style={style}
      id={id}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
    >
      {children}
    </ol>
  );
}
BreadcrumbList.displayName = "BreadcrumbList";

// BreadcrumbItem
export type BreadcrumbItemProps = {
  children?: React.ReactNode;
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-current"?:
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false"
    | boolean;
} & StyleType;

export function BreadcrumbItem({
  className,
  style,
  children,
  ...props
}: BreadcrumbItemProps): React.JSX.Element {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      style={style}
      {...props}
    >
      {children}
    </li>
  );
}
BreadcrumbItem.displayName = "BreadcrumbItem";

// Cross-platform click event for BreadcrumbLink
export interface BreadcrumbLinkClickEvent {
  preventDefault: () => void;
  stopPropagation: () => void;
}

// BreadcrumbLink
export type BreadcrumbLinkProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
  download?: string | boolean;
  hrefLang?: string;
  ping?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  type?: string;
  onClick?: (e: BreadcrumbLinkClickEvent) => void;
  "aria-label"?: string;
  "aria-current"?:
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false"
    | boolean;
} & StyleType;

export function BreadcrumbLink({
  asChild,
  className,
  style,
  children,
  onClick,
  href,
  target,
  rel,
  download,
  hrefLang,
  ping,
  referrerPolicy,
  type,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
}: BreadcrumbLinkProps): React.JSX.Element {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={cn("transition-colors hover:text-foreground", className)}
      style={style}
      href={href}
      target={target}
      rel={rel}
      download={download}
      hrefLang={hrefLang}
      ping={ping}
      referrerPolicy={referrerPolicy}
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-current={ariaCurrent}
    >
      {children}
    </Comp>
  );
}
BreadcrumbLink.displayName = "BreadcrumbLink";

// BreadcrumbPage
export type BreadcrumbPageProps = {
  children?: React.ReactNode;
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-current"?:
    | "page"
    | "step"
    | "location"
    | "date"
    | "time"
    | "true"
    | "false"
    | boolean;
} & StyleType;

export function BreadcrumbPage({
  className,
  style,
  children,
  "aria-current": ariaCurrent = "page",
  id,
  role,
  "aria-label": ariaLabel,
}: BreadcrumbPageProps): React.JSX.Element {
  const spanProps: {
    "aria-current"?:
      | "page"
      | "step"
      | "location"
      | "date"
      | "time"
      | "true"
      | "false"
      | boolean;
    className: string;
    style?: React.CSSProperties;
    id?: string;
    role?: string;
    "aria-label"?: string;
  } = {
    className: cn("font-normal text-foreground", className),
    style,
    "aria-current": ariaCurrent,
  };

  if (id) {
    spanProps.id = id;
  }
  if (role) {
    spanProps.role = role;
  }
  if (ariaLabel) {
    spanProps["aria-label"] = ariaLabel;
  }

  return <span {...spanProps}>{children}</span>;
}
BreadcrumbPage.displayName = "BreadcrumbPage";

// BreadcrumbSeparator
export type BreadcrumbSeparatorProps = {
  children?: React.ReactNode;
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
} & StyleType;

export function BreadcrumbSeparator({
  children,
  className,
  style,
  role = "presentation",
  "aria-hidden": ariaHidden = "true",
  id,
  "aria-label": ariaLabel,
}: BreadcrumbSeparatorProps): React.JSX.Element {
  return (
    <li
      role={role}
      aria-hidden={ariaHidden}
      className={cn("[&>svg]:size-3.5", className)}
      style={style}
      id={id}
      aria-label={ariaLabel}
    >
      {children ?? <ChevronRightIcon />}
    </li>
  );
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export type BreadcrumbEllipsisProps = {
  id?: string;
  role?: string;
  "aria-label"?: string;
  "aria-hidden"?: boolean | "true" | "false";
} & StyleType;

export function BreadcrumbEllipsis({
  className,
  style,
  role = "presentation",
  "aria-hidden": ariaHidden = "true",
  id,
  "aria-label": ariaLabel,
}: BreadcrumbEllipsisProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <span
      role={role}
      aria-hidden={ariaHidden}
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      style={style}
      id={id}
      aria-label={ariaLabel}
    >
      <DotsHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">
        {t("app.common.accessibility.srOnly.more")}
      </span>
    </span>
  );
}
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
