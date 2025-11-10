/**
 * Breadcrumb Component for React Native
 * Navigation breadcrumb trail
 */
import * as Slot from "@rn-primitives/slot";
import { ChevronRight } from "lucide-react-native";
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
import { cn } from "next-vibe/shared/utils/utils";

export function Breadcrumb({
  className,
  children,
}: BreadcrumbProps): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <View
      accessibilityLabel={t(
        "packages.nextVibeUi.native.ui.breadcrumb.navigation",
      )}
      className={className}
    >
      {children}
    </View>
  );
}

Breadcrumb.displayName = "Breadcrumb";

export function BreadcrumbList({
  className,
  children,
}: BreadcrumbListProps): React.JSX.Element {
  return (
    <View
      className={cn(
        "flex flex-row flex-wrap items-center gap-1.5 text-sm text-muted-foreground gap-2.5",
        className,
      )}
    >
      {children}
    </View>
  );
}

BreadcrumbList.displayName = "BreadcrumbList";

export function BreadcrumbItem({
  className,
  children,
}: BreadcrumbItemProps): React.JSX.Element {
  return (
    <View className={cn("flex flex-row items-center gap-1.5", className)}>
      {children}
    </View>
  );
}

BreadcrumbItem.displayName = "BreadcrumbItem";

type NativeBreadcrumbLinkProps = BreadcrumbLinkProps & {
  onPress?: () => void;
};

export function BreadcrumbLink({
  asChild,
  className,
  children,
  onPress,
}: NativeBreadcrumbLinkProps): React.JSX.Element {
  const combinedClassName = cn(
    "transition-colors active:text-foreground",
    className,
  );
  const content =
    typeof children === "string" ? (
      <RNText className="text-muted-foreground">{children}</RNText>
    ) : (
      children
    );

  if (asChild) {
    return (
      <Slot.Pressable onPress={onPress} className={combinedClassName}>
        {content}
      </Slot.Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} className={combinedClassName}>
      {content}
    </Pressable>
  );
}

BreadcrumbLink.displayName = "BreadcrumbLink";

export function BreadcrumbPage({
  className,
  children,
}: BreadcrumbPageProps): React.JSX.Element {
  return (
    <RNText
      aria-disabled={true}
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
    >
      {children}
    </RNText>
  );
}

BreadcrumbPage.displayName = "BreadcrumbPage";

export function BreadcrumbSeparator({
  children,
  className,
}: BreadcrumbSeparatorProps): React.JSX.Element {
  return (
    <View
      role="presentation"
      aria-hidden={true}
      className={cn("w-3.5 h-3.5", className)}
    >
      {children ?? <ChevronRight size={14} color="currentColor" />}
    </View>
  );
}

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export function BreadcrumbEllipsis({
  className,
}: BreadcrumbEllipsisProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View
      role="presentation"
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

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
