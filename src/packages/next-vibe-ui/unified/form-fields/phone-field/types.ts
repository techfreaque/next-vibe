/**
 * Phone Field Widget Types
 * Phone number input with country code
 */

import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";
import type { Countries } from "@/i18n/core/config";

import type { FieldUsageConfig } from "../../_shared/types";
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
