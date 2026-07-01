import { Text } from "ink";
import type { IconComponent } from "next-vibe/ui/web/lib/helper";
import type { JSX } from "react";

const symbol = "G"; // eslint-disable-line i18next/no-literal-string
export const SiGoogle: IconComponent = (): JSX.Element => <Text>{symbol}</Text>;
