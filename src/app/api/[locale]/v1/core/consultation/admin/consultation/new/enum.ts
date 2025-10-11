/**
 * Admin Consultation Creation Enums
 * Enums for admin consultation creation functionality
 */

import { createEnumOptions } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/enum-helpers";

/**
 * Selection type for consultation creation
 */
export const {
  enum: SelectionType,
  options: SelectionTypeOptions,
  Value: SelectionTypeValue,
} = createEnumOptions({
  CREATE_NEW_LEAD:
    "app.api.v1.core.consultation.admin.consultation.new.form.selectionType.new",
  USER: "app.api.v1.core.consultation.admin.consultation.new.form.selectionType.user",
  LEAD: "app.api.v1.core.consultation.admin.consultation.new.form.selectionType.lead",
});

/**
 * Consultation priority levels using enum utility
 */
export const {
  enum: ConsultationPriority,
  options: ConsultationPriorityOptions,
  Value: ConsultationPriorityValue,
} = createEnumOptions({
  LOW: "app.api.v1.core.consultation.admin.consultation.new.form.priority.options.low",
  NORMAL:
    "app.api.v1.core.consultation.admin.consultation.new.form.priority.options.normal",
  HIGH: "app.api.v1.core.consultation.admin.consultation.new.form.priority.options.high",
});
