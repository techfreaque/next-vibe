import { Text } from "ink";
import type { JSX } from "react";

import type { IconComponent } from "../../../web/lib/helper";

const symbol = "阿"; // eslint-disable-line i18next/no-literal-string
export const SiAlibabadotcom: IconComponent = (): JSX.Element => (
  <Text>{symbol}</Text>
);
