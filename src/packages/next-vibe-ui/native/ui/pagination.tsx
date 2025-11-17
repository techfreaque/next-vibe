"use client";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
} from "next-vibe-ui/ui/icons";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import { Pressable, Text as RNText, View } from "react-native";

import { useTranslation } from "@/i18n/core/client";

import { buttonVariants } from "./button";
import { applyStyleType } from "../../web/utils/style-type";
import { convertCSSToViewStyle } from "../utils/style-converter";

// Import ALL types from web - ZERO definitions in native
import type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
} from "@/packages/next-vibe-ui/web/ui/pagination";

const Pagination = ({
  className,
  style,
  children,
}: PaginationProps): React.JSX.Element => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      accessible={true}
      // React Native doesn't have accessibilityRole="navigation" but using "none" is semantically acceptable
      accessibilityRole="none"
      accessibilityLabel="pagination"
      {...applyStyleType({
        nativeStyle,
        className: cn("mx-auto flex w-full justify-center", className),
      })}
    >
      {children}
    </View>
  );
};
Pagination.displayName = "Pagination";

function PaginationContent({
  className,
  style,
  children,
  ..._props
}: PaginationContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-row items-center gap-1", className),
      })}
    >
      {children}
    </View>
  );
}
PaginationContent.displayName = "PaginationContent";

function PaginationItem({
  className,
  style,
  children,
  ..._props
}: PaginationItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <View
      {...applyStyleType({
        nativeStyle,
        className: cn("", className),
      })}
    >
      {children}
    </View>
  );
}
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  children,
  onClick,
  ..._props
}: PaginationLinkProps): React.JSX.Element => {
  const handlePress = React.useCallback((): void => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <Pressable
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      onPress={onClick ? handlePress : undefined}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <RNText>{children}</RNText>
      ) : (
        children
      )}
    </Pressable>
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ..._props
}: PaginationPreviousProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("app.common.accessibility.srOnly.previousPage")}
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {..._props}
    >
      <View className="flex flex-row items-center gap-1">
        <ChevronLeftIcon className="h-4 w-4" />
        <RNText>{t("app.common.actions.previous")}</RNText>
      </View>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ..._props
}: PaginationNextProps): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <PaginationLink
      aria-label={t("app.common.accessibility.srOnly.nextPage")}
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {..._props}
    >
      <View className="flex flex-row items-center gap-1">
        <RNText>{t("app.common.actions.next")}</RNText>
        <ChevronRightIcon className="h-4 w-4" />
      </View>
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  style,
  ..._props
}: PaginationEllipsisProps): React.JSX.Element => {
  const { t } = useTranslation();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <View
      accessible={true}
      accessibilityLabel={t("app.common.accessibility.srOnly.more")}
      accessibilityElementsHidden={true}
      {...applyStyleType({
        nativeStyle,
        className: cn("flex h-9 w-9 items-center justify-center", className),
      })}
    >
      <DotsHorizontalIcon className="h-4 w-4" />
    </View>
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
