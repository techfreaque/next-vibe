/**
 * Breadcrumb Component for React Native
 * Navigation breadcrumb trail
 */
import * as Slot from "@rn-primitives/slot";
import { ChevronRight } from "lucide-react-native";
import { styled } from "nativewind";
import { cn } from "next-vibe/shared/utils/utils";
import React from "react";
import { Pressable, Text as RNText, View } from "react-native";

import { useTranslation } from "@/i18n/core/client";
import type {
  BreadcrumbEllipsisProps,
  BreadcrumbItemProps,
  BreadcrumbLinkProps,
  BreadcrumbListProps,
  BreadcrumbPageProps,
  BreadcrumbProps,
  BreadcrumbSeparatorProps,
} from "@/packages/next-vibe-ui/web/ui/breadcrumb";

import { applyStyleType } from "../../web/utils/style-type";
import { styledNative } from "../utils/style-converter";
import { convertCSSToViewStyle } from "../utils/style-converter";

const StyledView = styled(View, { className: "style" });
const StyledPressable = styledNative(Pressable);

export function Breadcrumb({
  className,
  style,
  children,
}: BreadcrumbProps): React.JSX.Element {
  const { t } = useTranslation();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      accessibilityLabel={t(
        "packages.nextVibeUi.native.ui.breadcrumb.navigation",
      )}
      {...applyStyleType({
        nativeStyle,
        className: cn(className),
      })}
    >
      {children}
    </StyledView>
  );
}

Breadcrumb.displayName = "Breadcrumb";

export function BreadcrumbList({
  className,
  style,
  "aria-label": ariaLabel,
  children,
}: BreadcrumbListProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex flex-row flex-wrap items-center gap-1.5 text-sm text-muted-foreground gap-2.5",
          className,
        ),
      })}
      accessibilityLabel={ariaLabel}
    >
      {children}
    </StyledView>
  );
}

BreadcrumbList.displayName = "BreadcrumbList";

export function BreadcrumbItem({
  className,
  style,
  "aria-label": ariaLabel,
  children,
}: BreadcrumbItemProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("flex flex-row items-center gap-1.5", className),
      })}
      accessibilityLabel={ariaLabel}
    >
      {children}
    </StyledView>
  );
}

BreadcrumbItem.displayName = "BreadcrumbItem";

export function BreadcrumbLink({
  asChild,
  className,
  style,
  "aria-label": ariaLabel,
  children,
  onClick,
}: BreadcrumbLinkProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  const handlePress = React.useCallback(() => {
    if (onClick) {
      // Create a cross-platform event object for native
      onClick({
        preventDefault: () => {
          // No-op for native
        },
        stopPropagation: () => {
          // No-op for native
        },
      });
    }
  }, [onClick]);

  const combinedClassName = cn(
    "transition-colors active:text-foreground",
    className,
  );
  const content =
    typeof children === "string" ? (
      <RNText className={cn("text-muted-foreground")}>{children}</RNText>
    ) : (
      children
    );

  if (asChild) {
    return (
      <Slot.Pressable
        onPress={handlePress}
        {...applyStyleType({
          nativeStyle,
          className: cn(combinedClassName),
        })}
        accessibilityLabel={ariaLabel}
      >
        {content}
      </Slot.Pressable>
    );
  }

  return (
    <StyledPressable
      onPress={handlePress}
      {...applyStyleType({
        nativeStyle,
        className: cn(combinedClassName),
      })}
      accessibilityLabel={ariaLabel}
    >
      {content}
    </StyledPressable>
  );
}

BreadcrumbLink.displayName = "BreadcrumbLink";

export function BreadcrumbPage({
  className,
  style,
  "aria-label": ariaLabel,
  children,
}: BreadcrumbPageProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <RNText
      {...applyStyleType({
        nativeStyle,
        className: cn("font-normal text-foreground", className),
      })}
      accessibilityLabel={ariaLabel}
    >
      {children}
    </RNText>
  );
}

BreadcrumbPage.displayName = "BreadcrumbPage";

export function BreadcrumbSeparator({
  children,
  className,
  style,
  "aria-label": ariaLabel,
}: BreadcrumbSeparatorProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("w-3.5 h-3.5", className),
      })}
      accessibilityLabel={ariaLabel}
    >
      {children ?? <ChevronRight size={14} color="currentColor" />}
    </StyledView>
  );
}

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export function BreadcrumbEllipsis({
  className,
  style,
  "aria-label": ariaLabel,
}: BreadcrumbEllipsisProps): React.JSX.Element {
  const { t } = useTranslation();
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledView
      {...applyStyleType({
        nativeStyle,
        className: cn("flex h-9 w-9 items-center justify-center", className),
      })}
      accessibilityLabel={ariaLabel}
    >
      <RNText className={cn("text-muted-foreground")}>...</RNText>
      <RNText className={cn("sr-only")}>
        {t("app.common.accessibility.srOnly.more")}
      </RNText>
    </StyledView>
  );
}

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
