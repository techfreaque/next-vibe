"use client";
import { useTranslation } from "../../../core/i18n/core/client";
import { cn } from "../../../unified-ui/_shared/cn";
import * as React from "react";
import { Pressable, Text as RNText, View } from "react-native";

import { convertCSSToViewStyle, styledNative } from "../utils/style-converter";
import { uiScopedTranslation } from "../../web/i18n";
import { ChevronLeftIcon } from "../../web/ui/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "../../web/ui/icons/ChevronRightIcon";
import { DotsHorizontalIcon } from "../../web/ui/icons/DotsHorizontalIcon";
import { applyStyleType } from "../../web/utils/style-type";
import { buttonVariants } from "./button";

const StyledView = styledNative(View);
const StyledPressable = styledNative(Pressable);
const StyledText = styledNative(RNText);

// Import ALL types from web - ZERO definitions in native
import type {
  PaginationContentProps,
  PaginationEllipsisProps,
  PaginationItemProps,
  PaginationLinkProps,
  PaginationNextProps,
  PaginationPreviousProps,
  PaginationProps,
} from "../../web/ui/pagination";

const Pagination = ({
  className,
  style,
  children,
}: PaginationProps): React.JSX.Element => {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
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
    </StyledView>
  );
};
Pagination.displayName = "Pagination";

function PaginationContent({
  className,
  style,
  children,
}: PaginationContentProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-row items-center gap-1", className),
      })}
    >
      {children}
    </StyledView>
  );
}
PaginationContent.displayName = "PaginationContent";

function PaginationItem({
  className,
  style,
  children,
}: PaginationItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;
  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("", className),
      })}
    >
      {children}
    </StyledView>
  );
}
PaginationItem.displayName = "PaginationItem";

const PaginationLink = ({
  className,
  isActive,
  size = "icon",
  children,
  onClick,
}: PaginationLinkProps): React.JSX.Element => {
  const handlePress = React.useCallback((): void => {
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  return (
    <StyledPressable
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ selected: !!isActive }}
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
        <StyledText>{children}</StyledText>
      ) : (
        children
      )}
    </StyledPressable>
  );
};
PaginationLink.displayName = "PaginationLink";

const PaginationPrevious = ({
  className,
  ...props
}: PaginationPreviousProps): React.JSX.Element => {
  const { locale } = useTranslation();
  const { t } = uiScopedTranslation.scopedT(locale);

  return (
    <PaginationLink
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <StyledView className="flex flex-row items-center gap-1">
        <ChevronLeftIcon className="h-4 w-4" />
        <StyledText>{t("common.actions.previous")}</StyledText>
      </StyledView>
    </PaginationLink>
  );
};
PaginationPrevious.displayName = "PaginationPrevious";

const PaginationNext = ({
  className,
  ...props
}: PaginationNextProps): React.JSX.Element => {
  const { locale } = useTranslation();
  const { t } = uiScopedTranslation.scopedT(locale);

  return (
    <PaginationLink
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <StyledView className="flex flex-row items-center gap-1">
        <StyledText>{t("common.actions.next")}</StyledText>
        <ChevronRightIcon className="h-4 w-4" />
      </StyledView>
    </PaginationLink>
  );
};
PaginationNext.displayName = "PaginationNext";

const PaginationEllipsis = ({
  className,
  style,
}: PaginationEllipsisProps): React.JSX.Element => {
  const { locale } = useTranslation();
  const { t } = uiScopedTranslation.scopedT(locale);
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      accessible={true}
      accessibilityLabel={t("common.accessibility.srOnly.more")}
      accessibilityElementsHidden={true}
      {...applyStyleType({
        nativeStyle,
        className: cn("flex h-9 w-9 items-center justify-center", className),
      })}
    >
      <DotsHorizontalIcon className="h-4 w-4" />
    </StyledView>
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
