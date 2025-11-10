"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import { useTranslation } from "@/i18n/core/client";

import { buttonVariants } from "./button";

// Cross-platform types
export interface PaginationProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PaginationContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PaginationItemProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PaginationPreviousProps {
  className?: string;
  href?: string;
}

export interface PaginationNextProps {
  className?: string;
  href?: string;
}

export interface PaginationEllipsisProps {
  className?: string;
}

const Pagination = ({
  className,
  ...props
}: React.ComponentProps<"nav">): React.JSX.Element => (
  <nav
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

function PaginationContent({ className, children }: PaginationContentProps): React.JSX.Element {
  return (
    <ul className={cn("flex flex-row items-center gap-1", className)}>
      {children}
    </ul>
  );
}
PaginationContent.displayName = "PaginationContent";

function PaginationItem({ className, children }: PaginationItemProps): React.JSX.Element {
  return (
    <li className={cn("", className)}>
      {children}
    </li>
  );
}
PaginationItem.displayName = "PaginationItem";

export type PaginationLinkProps = {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  href?: string;
} & React.ComponentProps<"a">;

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
}: React.ComponentProps<typeof PaginationLink>): React.JSX.Element => {
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
}: React.ComponentProps<typeof PaginationLink>): React.JSX.Element => {
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
  ...props
}: React.ComponentProps<"span">): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
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
