/**
 * Phone Field Widget Types
 * Phone number input with country code
 */

import type { FieldDataType } from "next-vibe/core/definition/enums";
import type { Countries } from "next-vibe/core/i18n/core/config";
import type { StringWidgetSchema } from "next-vibe/unified-ui/_shared/schema-constraints";
import type { FieldUsageConfig } from "next-vibe/unified-ui/_shared/types";
import type { BaseFormFieldWidgetConfig } from "next-vibe/unified-ui/form-fields/_shared/types";

export interface PhoneFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.TEL;
  defaultCountry?: Countries;
  preferredCountries?: Countries[];
}
