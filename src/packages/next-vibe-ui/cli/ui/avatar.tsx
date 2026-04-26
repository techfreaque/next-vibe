import { Text } from "ink";
import type { JSX } from "react";

import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
} from "../../web/ui/avatar";

export type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
} from "../../web/ui/avatar";

function getInitials(text: string): string {
  return text
    .split(/\s+/)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Avatar renders as [initials] in CLI - children handled by AvatarFallback
export function Avatar({ children }: AvatarRootProps): JSX.Element {
  return <>{children}</>;
}
Avatar.displayName = "Avatar";

// AvatarImage is a no-op in CLI - terminal cannot display images
export function AvatarImage(): null {
  return null;
}
AvatarImage.displayName = "AvatarImage";

// AvatarFallback renders its text as initials in brackets
export function AvatarFallback({
  children,
  alt,
}: AvatarFallbackProps & { alt?: string }): JSX.Element {
  const raw = typeof children === "string" ? children : (alt ?? "");
  const initials = raw.length > 0 ? getInitials(raw) : "?";
  return <Text>[{initials}]</Text>;
}
AvatarFallback.displayName = "AvatarFallback";
