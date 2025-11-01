import * as AvatarPrimitive from "@rn-primitives/avatar";
import * as React from "react";

import { cn } from "../lib/utils";

// Export cross-platform types for web
export interface AvatarProps {
  className?: string;
  alt?: string;
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

const Avatar = React.forwardRef<
  AvatarPrimitive.RootRef,
  AvatarProps
>(({ className, alt, children }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    alt={alt ?? ""}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className,
    )}
  >
    {children}
  </AvatarPrimitive.Root>
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  AvatarPrimitive.ImageRef,
  AvatarImageProps
>(({ className, src }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    src={src}
    className={cn("aspect-square h-full w-full", className)}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  AvatarPrimitive.FallbackRef,
  AvatarFallbackProps
>(({ className, children }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className,
    )}
  >
    {children}
  </AvatarPrimitive.Fallback>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
