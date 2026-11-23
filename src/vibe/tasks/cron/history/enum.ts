import { createEnumOptions } from "../../../unified-ui/_shared/enum";
import { scopedTranslation } from "./i18n";

export const { enum: TaskHistoryScope, options: TaskHistoryScopeOptions } =
  createEnumOptions(scopedTranslation, {
    ENABLED: "enums.taskScope.enabled",
    ALL: "enums.taskScope.all",
  });
