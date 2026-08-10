import type { IconComponent } from "../../../web/lib/helper";
import { makeCliIcon } from "./make-icon";

// Apple's glyph has no portable terminal representation — render nothing rather
// than a tofu box, but keep it an inline icon so surrounding layout is unchanged.
export const SiApple: IconComponent = makeCliIcon("");
