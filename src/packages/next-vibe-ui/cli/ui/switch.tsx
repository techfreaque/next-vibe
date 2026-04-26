import { Text } from "ink";
import type { JSX } from "react";

import { useIsMcp } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/use-widget-context";
import type { SwitchRootProps } from "../../web/ui/switch";

export type { SwitchRootProps } from "../../web/ui/switch";

const ON = "ON";
const OFF = "OFF";

export function Switch({ checked }: SwitchRootProps): JSX.Element {
  const isMcp = useIsMcp();
  const state = checked ? ON : OFF;

  if (isMcp) {
    return <Text>{state}</Text>;
  }

  return (
    <Text color={checked ? "green" : "gray"} bold>
      {state}
    </Text>
  );
}
Switch.displayName = "Switch";
