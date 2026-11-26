import type { z } from "zod";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { scopedTranslation } from "./i18n";

type FormErrorMap = NonNullable<
  NonNullable<Parameters<z.ZodType["safeParse"]>[1]>["error"]
>;

/**
 * Per-form zod error map: says what to do ("Enter a value") instead of
 * schema text ("Too small: expected string to have >=1 characters").
 * Messages declared on a schema still win over this map.
 */
export function createFormErrorMap(locale: CountryLanguage): FormErrorMap {
  const { t } = scopedTranslation.scopedT(locale);
  return (issue) => {
    switch (issue.code) {
      case "invalid_type":
        return issue.input === undefined ||
          issue.input === null ||
          issue.input === ""
          ? t("formErrors.required")
          : t("formErrors.invalid");
      case "too_small":
        if (issue.origin === "string") {
          return Number(issue.minimum) <= 1
            ? t("formErrors.required")
            : t("formErrors.minLength", { min: String(issue.minimum) });
        }
        if (issue.origin === "number") {
          return t("formErrors.minNumber", { min: String(issue.minimum) });
        }
        if (issue.origin === "array" || issue.origin === "set") {
          return t("formErrors.minItems", { min: String(issue.minimum) });
        }
        return undefined;
      case "too_big":
        if (issue.origin === "string") {
          return t("formErrors.maxLength", { max: String(issue.maximum) });
        }
        if (issue.origin === "number") {
          return t("formErrors.maxNumber", { max: String(issue.maximum) });
        }
        return undefined;
      case "invalid_format":
        if (issue.format === "email") {
          return t("formErrors.email");
        }
        if (issue.format === "url") {
          return t("formErrors.url");
        }
        if (issue.format === "uuid" || issue.format === "guid") {
          return t("formErrors.choose");
        }
        return t("formErrors.invalid");
      case "invalid_value":
        return t("formErrors.choose");
      default:
        return undefined;
    }
  };
}
