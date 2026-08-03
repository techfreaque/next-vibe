/**
 * Phone Field Widget Types
 * Phone number input with country code
 */

import type { FieldDataType } from "../../../../core/definition/enums";
import type { Countries } from "../../../../core/i18n/core/config";
import type { StringWidgetSchema } from "../../../_shared/schema-constraints";
import type { FieldUsageConfig } from "../../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

export interface PhoneFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.TEL;
  defaultCountry?: Countries;
  preferredCountries?: Countries[];
}
