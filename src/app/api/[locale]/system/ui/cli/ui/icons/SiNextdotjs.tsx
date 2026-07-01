import { Text } from "ink";
import type { IconComponent } from "next-vibe/ui/web/lib/helper";
import type { JSX } from "react";

const symbol = "N"; // eslint-disable-line i18next/no-literal-string
export const SiNextdotjs: IconComponent = (): JSX.Element => (
  <Text>{symbol}</Text>
);
