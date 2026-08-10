import * as AvatarPrimitive from "@rn-primitives/avatar";
import * as React from "react";

import { cn } from "../../../unified-ui/_shared/cn";
// Import ALL types from web version (web is source of truth)
import type {
  AvatarFallbackProps,
  AvatarImageProps,
  AvatarRootProps,
} from "../../web/components/avatar";
import { styledNative } from "../utils/style-converter";

// Re-export types for consistency
export type { AvatarFallbackProps, AvatarImageProps, AvatarRootProps };

const StyledAvatarRoot = styledNative(AvatarPrimitive.Root);
const StyledAvatarImage = styledNative(AvatarPrimitive.Image);
const StyledAvatarFallback = styledNative(AvatarPrimitive.Fallback);

function Avatar({
  className,
  children,
  ...props
}: AvatarRootProps): React.JSX.Element {
  return (
    <StyledAvatarRoot
      alt=""
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </StyledAvatarRoot>
  );
}
Avatar.displayName = AvatarPrimitive.Root.displayName;

function AvatarImage({
  className,
  src,
  alt,
}: AvatarImageProps): React.JSX.Element {
  return (
    <StyledAvatarImage
      src={src}
      className={cn("aspect-square h-full w-full", className)}
      accessibilityLabel={alt}
    />
  );
}
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps): React.JSX.Element {
  return (
    <StyledAvatarFallback
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </StyledAvatarFallback>
  );
}
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarFallback, AvatarImage };
