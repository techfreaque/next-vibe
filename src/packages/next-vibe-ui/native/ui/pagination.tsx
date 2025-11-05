/**
 * Pagination Component for React Native
 * Navigation for paginated content
 */
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { Pressable, Text as RNText, View } from "react-native";

import { useTranslation } from "@/i18n/core/client";

import { cn } from "next-vibe/shared/utils/utils";

// Import all types from web (web is source of truth)
import type {
  PaginationProps,
  PaginationContentProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationPreviousProps,
  PaginationNextProps,
  PaginationEllipsisProps,
} from "@/packages/next-vibe-ui/web/ui/pagination";

import { buttonVariants } from "./button";

export function Pagination({
  className,
  children,
}: PaginationProps): React.JSX.Element {
  return (
    <View
      accessible={true}
      accessibilityLabel="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      {children}
    </View>
  );
}

Pagination.displayName = "Pagination";

export const PaginationContent = React.forwardRef<View, PaginationContentProps>(
  ({ className, children }, ref) => {
    return (
      <View
        ref={ref}
        className={cn("flex flex-row items-center gap-1", className)}
      >
        {children}
      </View>
    );
  },
);

PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<View, PaginationItemProps>(
  ({ className, children }, ref) => {
    return (
      <View ref={ref} className={cn("", className)}>
        {children}
      </View>
    );
  },
);

PaginationItem.displayName = "PaginationItem";

export function PaginationLink({
  className,
  isActive,
  size = "icon",
  children,
  onPress,
}: PaginationLinkProps & { onPress?: () => void }): React.JSX.Element {
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
    >
      {typeof children === "string" ? <RNText>{children}</RNText> : children}
    </Pressable>
  );
}

PaginationLink.displayName = "PaginationLink";

export function PaginationPrevious({
  className,
  onPress,
}: PaginationPreviousProps & { onPress?: () => void }): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("app.common.accessibility.srOnly.previousPage")}
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      onPress={onPress}
    >
      <ChevronLeft size={16} color="#000" />
      <RNText>{t("app.common.actions.previous")}</RNText>
    </PaginationLink>
  );
}

PaginationPrevious.displayName = "PaginationPrevious";

export function PaginationNext({
  className,
  onPress,
}: PaginationNextProps & { onPress?: () => void }): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("app.common.accessibility.srOnly.nextPage")}
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      onPress={onPress}
    >
      <RNText>{t("app.common.actions.next")}</RNText>
      <ChevronRight size={16} color="#000" />
    </PaginationLink>
  );
}

PaginationNext.displayName = "PaginationNext";

export function PaginationEllipsis({
  className,
}: PaginationEllipsisProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View
      aria-hidden={true}
      className={cn("flex h-9 w-9 items-center justify-center", className)}
    >
      <RNText className="text-muted-foreground">...</RNText>
      <RNText className="sr-only">
        {t("app.common.accessibility.srOnly.more")}
      </RNText>
    </View>
  );
}

PaginationEllipsis.displayName = "PaginationEllipsis";
