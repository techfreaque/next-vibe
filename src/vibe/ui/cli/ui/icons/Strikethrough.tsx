import type { IconComponent } from "../../../web/lib/helper";
import { makeCliIcon } from "./make-icon";

const symbol = "S̶"; // eslint-disable-line i18next/no-literal-string
export const Strikethrough: IconComponent = makeCliIcon(symbol);
