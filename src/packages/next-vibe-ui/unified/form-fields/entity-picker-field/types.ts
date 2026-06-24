/**
 * Entity Picker Field Widget Types
 */

import type { CreateApiEndpointAny } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import type { FieldDataType } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { StringWidgetSchema } from "@/app/api/[locale]/system/unified-interface/shared/widgets/utils/schema-constraints";

import type { FieldUsageConfig } from "../../_shared/types";
import type { BaseFormFieldWidgetConfig } from "../_shared/types";

/**
 * Entity picker field widget configuration.
 *
 * Use in definition.ts for any UUID field that requires picking from a list.
 * The field is hidden when pre-filled by navigation context, and always visible
 * (even after selection) when opened standalone.
 *
 * Example:
 *   id: {
 *     type: WidgetType.FORM_FIELD,
 *     fieldType: FieldDataType.ENTITY_PICKER,
 *     label: "patch.id.label",
 *     schema: z.string().uuid(),
 *     listEndpoint: skillsListDefinitions.GET,
 *     labelField: "name",
 *   }
 */
export interface EntityPickerFieldWidgetConfig<
  out TKey extends string,
  TSchema extends StringWidgetSchema,
  TUsage extends FieldUsageConfig,
> extends BaseFormFieldWidgetConfig<TKey, TUsage, "primitive", TSchema> {
  fieldType: FieldDataType.ENTITY_PICKER;
  /**
   * The list endpoint. Either a direct reference or an async resolver
   * (`() => import("../list/definition").then((m) => m.default.GET)`) so that
   * cross-feature references don't create static import cycles between
   * definition files. Resolved lazily by the widget at render time.
   */
  listEndpoint: () => Promise<CreateApiEndpointAny>;
  /**
   * Field name in each list item used as the display label.
   * Falls back to "name" / "title" / "label" / "id".
   */
  labelField?: string;
}
