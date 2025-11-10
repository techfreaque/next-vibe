import * as AvatarPrimitive from "@rn-primitives/avatar";
import * as React from "react";

import { cn } from "next-vibe/shared/utils/utils";

// Import ALL types from web - ZERO definitions here
import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
} from "@/packages/next-vibe-ui/web/ui/avatar";


// Local styled components - use direct primitives to avoid type instantiation issues
const StyledAvatarRoot = AvatarPrimitive.Root;
const StyledAvatarImage = AvatarPrimitive.Image;
const StyledAvatarFallback = AvatarPrimitive.Fallback;

function Avatar({ className, children, ...props }: AvatarRootProps): React.JSX.Element {
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

function AvatarImage({ className, src, ...props }: AvatarImageProps): React.JSX.Element {
  return (
    <StyledAvatarImage
      src={src}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
}
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

function AvatarFallback({ className, children, ...props }: AvatarFallbackProps): React.JSX.Element {
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

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
};
