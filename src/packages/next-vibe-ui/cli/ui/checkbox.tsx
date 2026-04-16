import { Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { CheckboxRootProps } from "../../web/ui/checkbox";

export type {
  CheckboxRootProps,
  CheckboxIndicatorProps,
} from "../../web/ui/checkbox";

const CHECKED_CLI = "\u2713";
const UNCHECKED_CLI = "\u25A1";
const BRACKET_OPEN = "\u005B";
const BRACKET_CLOSE = "\u005D";
const SPACE = "\u0020";
const CHECKED_MCP = "checked";
const UNCHECKED_MCP = "unchecked";
const COLON = "\u003A";

export function Checkbox({
  checked,
  children,
}: CheckboxRootProps): JSX.Element {
  const isMcp = useIsMcp();

  if (isMcp) {
    const state = checked ? CHECKED_MCP : UNCHECKED_MCP;
    return (
      <Text>
        {state}
        {COLON}
        {SPACE}
        {children}
      </Text>
    );
  }

  const icon = checked ? CHECKED_CLI : UNCHECKED_CLI;
  return (
    <Text>
      {BRACKET_OPEN}
      {icon}
      {BRACKET_CLOSE}
      {SPACE}
      {children}
    </Text>
  );
}
Checkbox.displayName = "Checkbox";

export function CheckboxIndicator({
  children,
}: {
  children?: React.ReactNode;
}): JSX.Element | null {
  void children;
  return null;
}
CheckboxIndicator.displayName = "CheckboxIndicator";
