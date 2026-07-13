import { Text } from "ink";
import type { JSX } from "react";

import type { IconComponent } from "../../../web/lib/helper";

const symbol = "↺"; // eslint-disable-line i18next/no-literal-string
export const RotateCcw: IconComponent = (): JSX.Element => (
  <Text>{symbol}</Text>
);
