import { Text } from "ink";
import type { JSX } from "react";

import type { IconComponent } from "../../../web/lib/helper";

const symbol = "N"; // eslint-disable-line i18next/no-literal-string
export const SiNextdotjs: IconComponent = (): JSX.Element => (
  <Text>{symbol}</Text>
);
