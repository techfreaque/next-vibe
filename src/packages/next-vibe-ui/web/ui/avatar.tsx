"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "next-vibe/shared/utils/utils";
import * as React from "react";

// Cross-platform types
export interface AvatarRootProps {
  className?: string;
  children?: React.ReactNode;
}

export interface AvatarImageProps {
  className?: string;
  src?: string;
  alt?: string;
}

export interface AvatarFallbackProps {
  className?: string;
  children?: React.ReactNode;
}

export function Avatar({
  className,
  children,
  ...props
}: AvatarRootProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Root>
  );
}
Avatar.displayName = AvatarPrimitive.Root.displayName;

export function AvatarImage({
  className,
  ...props
}: AvatarImageProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
}
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

export function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps): React.JSX.Element {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
}
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
