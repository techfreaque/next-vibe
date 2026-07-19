import { Text } from "ink";
import type { JSX } from "react";

import type { IconComponent } from "../../../web/lib/helper";

const symbol = "H₂"; // eslint-disable-line i18next/no-literal-string
export const Heading2: IconComponent = (): JSX.Element => <Text>{symbol}</Text>;
