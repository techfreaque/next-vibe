import type { FieldErrors, FieldValues } from "react-hook-form";

import type { CountryLanguage } from "../../../../core/i18n/core/config";
import type { TranslatedKeyType } from "../../../../core/i18n/core/scoped-translation";
import { scopedTranslation } from "../../../hooks/i18n";

/** Root form error set when submit is blocked by a field the user cannot see. */
export const INVALID_HIDDEN_FIELD_ERROR = "invalid-hidden-field";

/** Localized alert text for a blocked submit, or undefined when none is set. */
export function getRootFormErrorMessage<TValues extends FieldValues>(
  errors: FieldErrors<TValues> | undefined,
  locale: CountryLanguage,
): TranslatedKeyType | undefined {
  const root = errors?.root;
  if (root?.type !== INVALID_HIDDEN_FIELD_ERROR) {
    return undefined;
  }
  const { t } = scopedTranslation.scopedT(locale);
  return root.message
    ? t("widgets.endpointRenderer.hiddenInvalid", { field: root.message })
    : t("widgets.endpointRenderer.fixFields");
}
