import { Text } from "ink";
import type { IconComponent } from "next-vibe/ui/web/lib/helper";
import type { JSX } from "react";

const symbol = "🤖"; // eslint-disable-line i18next/no-literal-string
export const TayLogo: IconComponent = (): JSX.Element => <Text>{symbol}</Text>;
