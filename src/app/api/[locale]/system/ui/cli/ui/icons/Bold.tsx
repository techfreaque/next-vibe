import { Text } from "ink";
import type { IconComponent } from "next-vibe/ui/web/lib/helper";
import type { JSX } from "react";

const symbol = "𝐁"; // eslint-disable-line i18next/no-literal-string
export const Bold: IconComponent = (): JSX.Element => <Text>{symbol}</Text>;
