import {
  EndpointErrorTypes,
  FieldDataType,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { requestField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const error = { title: "listError", description: "detail" } as const;
export const accountingErrors = {
  [EndpointErrorTypes.VALIDATION_FAILED]: error,
  [EndpointErrorTypes.NETWORK_ERROR]: error,
  [EndpointErrorTypes.UNAUTHORIZED]: error,
  [EndpointErrorTypes.FORBIDDEN]: error,
  [EndpointErrorTypes.NOT_FOUND]: error,
  [EndpointErrorTypes.SERVER_ERROR]: error,
  [EndpointErrorTypes.UNKNOWN_ERROR]: error,
  [EndpointErrorTypes.CONFLICT]: error,
  [EndpointErrorTypes.UNSAVED_CHANGES]: error,
};

export const accountingCompany = requestField(scopedTranslation, {
  type: WidgetType.FORM_FIELD,
  fieldType: FieldDataType.ENTITY_PICKER,
  label: "company",
  schema: z.uuid(),
  listEndpoint: async () =>
    (await import("@/companies/list/definition")).default.GET,
  labelField: "name",
});
