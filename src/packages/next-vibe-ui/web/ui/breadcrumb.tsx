import { ChevronRightIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

import { useTranslation } from "@/i18n/core/client";

// Cross-platform types
export interface BreadcrumbProps {
  separator?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export interface BreadcrumbListProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BreadcrumbItemProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BreadcrumbLinkProps {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
  href?: string;
  onPress?: () => void; // Native-specific, optional for web
}

export interface BreadcrumbPageProps {
  className?: string;
  children?: React.ReactNode;
}

export interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  className?: string;
}

export interface BreadcrumbEllipsisProps {
  className?: string;
}

function Breadcrumb({
  ...props
}: React.ComponentPropsWithoutRef<"nav"> & {
  separator?: React.ReactNode;
}): React.JSX.Element {
  return <nav aria-label="breadcrumb" {...props} />;
}
Breadcrumb.displayName = "Breadcrumb";

function BreadcrumbList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"ol">): React.JSX.Element {
  return (
    <ol
      className={cn(
        "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
}
BreadcrumbList.displayName = "BreadcrumbList";

function BreadcrumbItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"li">): React.JSX.Element {
  return (
    <li
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}
BreadcrumbItem.displayName = "BreadcrumbItem";

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & {
  asChild?: boolean;
}): React.JSX.Element {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
}
BreadcrumbLink.displayName = "BreadcrumbLink";

function BreadcrumbPage({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">): React.JSX.Element {
  return (
    <span
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
}
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">): React.JSX.Element => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRightIcon />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <span
      role="presentation"
      aria-hidden="true"
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
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
