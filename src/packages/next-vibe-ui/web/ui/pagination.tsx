"use client";
import { cn } from "next-vibe/shared/utils/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "next-vibe-ui/ui/icons";
import * as React from "react";

import { useTranslation } from "@/i18n/core/client";

import type { StyleType } from "../utils/style-type";
import { buttonVariants } from "./button";

// Cross-platform types
export type PaginationProps = {
  children?: React.ReactNode;
} & StyleType;

export type PaginationContentProps = {
  children?: React.ReactNode;
} & StyleType;

export type PaginationItemProps = {
  children?: React.ReactNode;
} & StyleType;

export type PaginationPreviousProps = {
  href?: string;
} & StyleType;

export type PaginationNextProps = {
  href?: string;
} & StyleType;

export type PaginationEllipsisProps = StyleType;

const Pagination = ({
  className,
  style,
  children,
}: PaginationProps): React.JSX.Element => (
  <nav
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    style={style}
  >
    {children}
  </nav>
);
Pagination.displayName = "Pagination";

function PaginationContent({
  className,
  style,
  children,
}: PaginationContentProps): React.JSX.Element {
  return (
    <ul
      className={cn("flex flex-row items-center gap-1", className)}
      style={style}
    >
      {children}
    </ul>
  );
}
PaginationContent.displayName = "PaginationContent";

function PaginationItem({
  className,
  style,
  children,
}: PaginationItemProps): React.JSX.Element {
  return (
    <li className={cn("", className)} style={style}>
      {children}
    </li>
  );
}
PaginationItem.displayName = "PaginationItem";

export interface PaginationLinkProps {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  children,
  ...props
}: PaginationLinkProps): React.JSX.Element => (
  <a
    aria-current={isActive ? "page" : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className,
    )}
    {...props}
  >
    {children}
  </a>
);
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: PaginationLinkProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("app.common.accessibility.srOnly.previousPage")}
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span>{t("app.common.actions.previous")}</span>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: PaginationLinkProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("app.common.accessibility.srOnly.nextPage")}
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>{t("app.common.actions.next")}</span>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  style,
}: PaginationEllipsisProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      style={style}
    >
      <DotsHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">
        {t("app.common.accessibility.srOnly.more")}
      </span>
    </span>
  );
};
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
