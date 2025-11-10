/**
 * SafeAreaLayout Components for Web
 * Passthrough components - web doesn't need safe area handling
 */
import type { ReactNode } from "react";

export interface SafeAreaLayoutProps {
  children: ReactNode;
  className?: string;
}

export interface ScrollableSafeAreaLayoutProps {
  children: ReactNode;
  className?: string;
  scrollEnabled?: boolean;
}

/**
 * SafeAreaLayout - Web passthrough (no safe area needed)
 */
export function SafeAreaLayout({
  children,
}: SafeAreaLayoutProps): React.JSX.Element {
  return <>{children}</>;
}

SafeAreaLayout.displayName = "SafeAreaLayout";

/**
 * ScrollableSafeAreaLayout - Web passthrough (no safe area needed)
 */
export function ScrollableSafeAreaLayout({
  children,
}: ScrollableSafeAreaLayoutProps): React.JSX.Element {
  return <>{children}</>;
}

ScrollableSafeAreaLayout.displayName = "ScrollableSafeAreaLayout";

