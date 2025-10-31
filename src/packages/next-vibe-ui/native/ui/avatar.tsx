import * as AvatarPrimitive from "@rn-primitives/avatar";
import * as React from "react";

import type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarProps,
} from "next-vibe-ui/ui/avatar";
import { cn } from "../lib/utils";

const Avatar = React.forwardRef<AvatarPrimitive.RootRef, AvatarProps>(
  ({ className, alt, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      {...({
        alt: alt ?? "",
        className: cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className,
        ),
        ...props,
      } as any)}
    />
  ),
);
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  AvatarPrimitive.ImageRef,
  AvatarImageProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    {...({
      className: cn("aspect-square h-full w-full", className),
      ...props,
    } as any)}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  AvatarPrimitive.FallbackRef,
  AvatarFallbackProps
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    {...({
      className: cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      ),
      ...props,
    } as any)}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
