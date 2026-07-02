import { Text } from "ink";
import type { JSX } from "react";

import type { IconComponent } from "../../../web/lib/helper";

const symbol = "𝐁"; // eslint-disable-line i18next/no-literal-string
export const Bold: IconComponent = (): JSX.Element => <Text>{symbol}</Text>;
