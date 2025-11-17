import * as AvatarPrimitive from "@rn-primitives/avatar";
import * as React from "react";
import { styled } from "nativewind";

import { cn } from "next-vibe/shared/utils/utils";
import { convertCSSToViewStyle } from "../utils/style-converter";
import { applyStyleType } from "../../web/utils/style-type";

// Import ALL types from web version (web is source of truth)
import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
} from "@/packages/next-vibe-ui/web/ui/avatar";

// Re-export types for consistency
export type { AvatarRootProps, AvatarImageProps, AvatarFallbackProps };

const StyledAvatarRoot = styled(AvatarPrimitive.Root, { className: "style" });
const StyledAvatarImage = styled(AvatarPrimitive.Image, { className: "style" });
const StyledAvatarFallback = styled(AvatarPrimitive.Fallback, {
  className: "style",
});

function Avatar({
  className,
  style,
  children,
  ...props
}: AvatarRootProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledAvatarRoot
      alt=""
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          className,
        ),
      })}
      {...props}
    >
      {children}
    </StyledAvatarRoot>
  );
}
Avatar.displayName = AvatarPrimitive.Root.displayName;

function AvatarImage({
  className,
  style: _style,
  src,
  ...props
}: AvatarImageProps): React.JSX.Element {
  // Note: style prop is not passed due to StyleType discriminated union
  // Native uses className for styling via NativeWind (either style OR className, not both)
  return (
    <StyledAvatarImage
      src={src}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
    />
  );
}
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

function AvatarFallback({
  className,
  style,
  children,
  ...props
}: AvatarFallbackProps): React.JSX.Element {
  const nativeStyle = style ? convertCSSToViewStyle(style) : undefined;

  return (
    <StyledAvatarFallback
      {...applyStyleType({
        nativeStyle,
        className: cn(
          "flex h-full w-full items-center justify-center rounded-full bg-muted",
          className,
        ),
      })}
      {...props}
    >
      {children}
    </StyledAvatarFallback>
  );
}
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
