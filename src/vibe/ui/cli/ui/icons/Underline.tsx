import { Text } from "ink";
import type { JSX } from "react";

import type { IconComponent } from "../../../web/lib/helper";

const symbol = "U̲"; // eslint-disable-line i18next/no-literal-string
export const Underline: IconComponent = (): JSX.Element => (
  <Text>{symbol}</Text>
);
