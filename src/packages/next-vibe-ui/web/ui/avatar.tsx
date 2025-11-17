"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";
import type { StyleType } from "../utils/style-type";

// Cross-platform types
export type AvatarRootProps = {
  children?: React.ReactNode;
} & StyleType;

export type AvatarImageProps = {
  src?: string;
  alt?: string;
} & StyleType;

export type AvatarFallbackProps = {
  children?: React.ReactNode;
} & StyleType;

export function Avatar({
  className,
  style,
  children,
  ...props
}: AvatarRootProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </AvatarPrimitive.Root>
  );
}
Avatar.displayName = AvatarPrimitive.Root.displayName;

export function AvatarImage({
  className,
  style,
  ...props
}: AvatarImageProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square h-full w-full", className)}
      style={style}
      {...props}
    />
  );
}
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

export function AvatarFallback({
  className,
  style,
  children,
  ...props
}: AvatarFallbackProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
}
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
