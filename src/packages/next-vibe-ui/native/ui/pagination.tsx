/**
 * Pagination Component for React Native
 * Navigation for paginated content
 */
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import type { ReactNode } from "react";
import React from "react";
import { Pressable, Text as RNText, View } from "react-native";

import { useTranslation } from "@/i18n/core/client";

import { cn } from "../lib/utils";
import { type ButtonProps, buttonVariants } from "./button";

interface PaginationProps {
  children: ReactNode;
  className?: string;
}

export function Pagination({
  className,
  children,
  ...props
}: PaginationProps): React.JSX.Element {
  return (
    <View
      accessible={true}
      accessibilityLabel="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      {children}
    </View>
  );
}

Pagination.displayName = "Pagination";

interface PaginationContentProps {
  children: ReactNode;
  className?: string;
}

export const PaginationContent = React.forwardRef<View, PaginationContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
        {...props}
      >
        {children}
      </View>
    );
  },
);

PaginationContent.displayName = "PaginationContent";

interface PaginationItemProps {
  children: ReactNode;
  className?: string;
}

export const PaginationItem = React.forwardRef<View, PaginationItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View ref={ref} className={cn("", className)} {...props}>
        {children}
      </View>
    );
  },
);

PaginationItem.displayName = "PaginationItem";

interface PaginationLinkProps {
  isActive?: boolean;
  size?: ButtonProps["size"];
  children: ReactNode;
  className?: string;
  onPress?: () => void;
}

export function PaginationLink({
  className,
  isActive,
  size = "icon",
  children,
  onPress,
  ...props
}: PaginationLinkProps): React.JSX.Element {
  return (
    <Pressable
      onPress={onPress}
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
      {typeof children === "string" ? <RNText>{children}</RNText> : children}
    </Pressable>
  );
}

PaginationLink.displayName = "PaginationLink";

interface PaginationPreviousProps {
  className?: string;
  onPress?: () => void;
}

export function PaginationPrevious({
  className,
  onPress,
  ...props
}: PaginationPreviousProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("app.common.accessibility.srOnly.previousPage")}
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      onPress={onPress}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      <RNText>{t("app.common.actions.previous")}</RNText>
    </PaginationLink>
  );
}

PaginationPrevious.displayName = "PaginationPrevious";

interface PaginationNextProps {
  className?: string;
  onPress?: () => void;
}

export function PaginationNext({
  className,
  onPress,
  ...props
}: PaginationNextProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("app.common.accessibility.srOnly.nextPage")}
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      onPress={onPress}
      {...props}
    >
      <RNText>{t("app.common.actions.next")}</RNText>
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  );
}

PaginationNext.displayName = "PaginationNext";

interface PaginationEllipsisProps {
  className?: string;
}

export function PaginationEllipsis({
  className,
  ...props
}: PaginationEllipsisProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View
      aria-hidden={true}
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <RNText className="text-muted-foreground">...</RNText>
      <RNText className="sr-only">
        {t("app.common.accessibility.srOnly.more")}
      </RNText>
    </View>
  );
}

PaginationEllipsis.displayName = "PaginationEllipsis";
