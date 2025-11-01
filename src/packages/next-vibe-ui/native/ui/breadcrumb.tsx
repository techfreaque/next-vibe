/**
 * Breadcrumb Component for React Native
 * Navigation breadcrumb trail
 */
/// <reference path="../../../../../nativewind-env.d.ts" />

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
} from "next-vibe-ui/ui/breadcrumb";
import { cn } from "../lib/utils";

export const Breadcrumb = React.forwardRef<View, BreadcrumbProps>(
  ({ className, children }, ref) => {
    return (
      <View
        ref={ref}
        accessibilityLabel="breadcrumb navigation"
        className={className}
      >
        {children}
      </View>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";

export const BreadcrumbList = React.forwardRef<View, BreadcrumbListProps>(
  ({ className, children }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "flex flex-row flex-wrap items-center gap-1.5 text-sm text-muted-foreground native:gap-2.5",
          className,
        )}
      >
        {children}
      </View>
    );
  },
);

BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = React.forwardRef<View, BreadcrumbItemProps>(
  ({ className, children }, ref) => {
    return (
      <View
        ref={ref}
        className={cn("flex flex-row items-center gap-1.5", className)}
      >
        {children}
      </View>
    );
  },
);

BreadcrumbItem.displayName = "BreadcrumbItem";

type NativeBreadcrumbLinkProps = BreadcrumbLinkProps & {
  onPress?: () => void;
};

export const BreadcrumbLink = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  NativeBreadcrumbLinkProps
>(({ asChild, className, children, onPress }, ref) => {
  const combinedClassName = cn("transition-colors active:text-foreground", className);
  const content = typeof children === "string" ? (
    <RNText className="text-muted-foreground">{children}</RNText>
  ) : (
    children
  );

  if (asChild) {
    return (
      <Slot.Pressable ref={ref} onPress={onPress} className={combinedClassName}>
        {content}
      </Slot.Pressable>
    );
  }

  return (
    <Pressable ref={ref} onPress={onPress} className={combinedClassName}>
      {content}
    </Pressable>
  );
});

BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbPage = React.forwardRef<RNText, BreadcrumbPageProps>(
  ({ className, children }, ref) => {
    return (
      <RNText
        ref={ref}
        role="link"
        aria-disabled={true}
        aria-current="page"
        className={cn("font-normal text-foreground", className)}
      >
        {children}
      </RNText>
    );
  },
);

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
      {children ?? (
        <ChevronRight size={14} color="currentColor" />
      )}
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
