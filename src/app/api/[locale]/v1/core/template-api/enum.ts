/**
 * Template API Enums
 * Defines enumeration values for the template API
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";
import { z } from "zod";

/**
 * Template status enum using createEnumOptions pattern
 */
export const {
  enum: TemplateStatus,
  options: TemplateStatusOptions,
  Value: TemplateStatusValue,
} = createEnumOptions({
  DRAFT: "app.api.v1.core.templateApi.enums.templateStatus.draft",
  PUBLISHED: "app.api.v1.core.templateApi.enums.templateStatus.published",
  ARCHIVED: "app.api.v1.core.templateApi.enums.templateStatus.archived",
});

/**
 * Database enum values (without translation keys)
 */
export const TemplateStatusDB = ["draft", "published", "archived"] as const;

/**
 * Zod schema for template status validation
 */
export const TemplateStatusSchema = z.nativeEnum(TemplateStatus);
