import * as React from "react";

export type { KeyboardAvoidingViewProps } from "../../web/ui/keyboard-avoiding-view";

import type { KeyboardAvoidingViewProps } from "../../web/ui/keyboard-avoiding-view";

export function KeyboardAvoidingView({
  children,
}: KeyboardAvoidingViewProps): React.JSX.Element | null {
  return <>{children}</>;
}
