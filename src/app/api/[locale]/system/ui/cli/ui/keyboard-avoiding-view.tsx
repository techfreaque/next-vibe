import * as React from "react";

export type { KeyboardAvoidingViewProps } from "next-vibe/ui/web/ui/keyboard-avoiding-view";

import type { KeyboardAvoidingViewProps } from "next-vibe/ui/web/ui/keyboard-avoiding-view";

export function KeyboardAvoidingView({
  children,
}: KeyboardAvoidingViewProps): React.JSX.Element | null {
  return <>{children}</>;
}
