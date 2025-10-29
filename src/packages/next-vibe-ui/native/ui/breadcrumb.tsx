/**
 * Breadcrumb Component for React Native
 * Navigation breadcrumb trail
 */
import * as Slot from "@rn-primitives/slot";
import { ChevronRight } from "lucide-react-native";
import type { ReactNode } from "react";
import React from "react";
import { Pressable, Text as RNText, View } from "react-native";

import { useTranslation } from "@/i18n/core/client";

import { cn } from "../lib/utils";

interface BreadcrumbProps {
  children: ReactNode;
  className?: string;
  separator?: ReactNode;
}

export const Breadcrumb = React.forwardRef<View, BreadcrumbProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        accessibilityLabel="breadcrumb navigation"
        className={className}
        {...props}
      >
        {children}
      </View>
    );
  },
);

Breadcrumb.displayName = "Breadcrumb";

interface BreadcrumbListProps {
  children: ReactNode;
  className?: string;
}

export const BreadcrumbList = React.forwardRef<View, BreadcrumbListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "flex flex-row flex-wrap items-center gap-1.5 text-sm text-muted-foreground native:gap-2.5",
          className,
        )}
        {...props}
      >
        {children}
      </View>
    );
  },
);

BreadcrumbList.displayName = "BreadcrumbList";

interface BreadcrumbItemProps {
  children: ReactNode;
  className?: string;
}

export const BreadcrumbItem = React.forwardRef<View, BreadcrumbItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn("flex flex-row items-center gap-1.5", className)}
        {...props}
      >
        {children}
      </View>
    );
  },
);

BreadcrumbItem.displayName = "BreadcrumbItem";

interface BreadcrumbLinkProps {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
  onPress?: () => void;
}

export const BreadcrumbLink = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  BreadcrumbLinkProps
>(({ asChild, className, children, onPress, ...props }, ref) => {
  const Component = asChild ? Slot.Pressable : Pressable;

  return (
    <Component
      ref={ref}
      onPress={onPress}
      className={cn("transition-colors active:text-foreground", className)}
      {...props}
    >
      {typeof children === "string" ? (
        <RNText className="text-muted-foreground">{children}</RNText>
      ) : (
        children
      )}
    </Component>
  );
});

BreadcrumbLink.displayName = "BreadcrumbLink";

interface BreadcrumbPageProps {
  children: ReactNode;
  className?: string;
}

export const BreadcrumbPage = React.forwardRef<RNText, BreadcrumbPageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <RNText
        ref={ref}
        role="link"
        aria-disabled={true}
        aria-current="page"
        className={cn("font-normal text-foreground", className)}
        {...props}
      >
        {children}
      </RNText>
    );
  },
);

BreadcrumbPage.displayName = "BreadcrumbPage";

interface BreadcrumbSeparatorProps {
  children?: ReactNode;
  className?: string;
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: BreadcrumbSeparatorProps): React.JSX.Element {
  return (
    <View
      role="presentation"
      aria-hidden={true}
      className={cn("w-3.5 h-3.5", className)}
      {...props}
    >
      {children ?? (
        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
      )}
    </View>
  );
}

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

interface BreadcrumbEllipsisProps {
  className?: string;
}

export function BreadcrumbEllipsis({
  className,
  ...props
}: BreadcrumbEllipsisProps): React.JSX.Element {
  const { t } = useTranslation();

  return (
    <View
      role="presentation"
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

BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";
