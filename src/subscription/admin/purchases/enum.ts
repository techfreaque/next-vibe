import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";

import { scopedTranslation } from "./i18n";

/** Credits-left filter for credit packs. */
export const {
  enum: PackRemainingFilter,
  options: PackRemainingFilterOptions,
  Value: PackRemainingFilterValue,
} = createEnumOptions(scopedTranslation, {
  LEFT: "enums.remaining.left",
  USED_UP: "enums.remaining.usedUp",
});
