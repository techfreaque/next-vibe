import { Text } from "ink";
import type { JSX } from "react";

import type { IconComponent } from "../../../web/lib/helper";

const symbol = "☑"; // eslint-disable-line i18next/no-literal-string
export const CheckSquare: IconComponent = (): JSX.Element => (
  <Text>{symbol}</Text>
);
