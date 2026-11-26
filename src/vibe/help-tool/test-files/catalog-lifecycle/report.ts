import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { createScopedTranslation } from "next-vibe/core/i18n/core/scoped-translation";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

export const proofAlias = "catalog-lifecycle-saffron-calibration";
export const proofTitle = "Saffron calibration lifecycle report";
export const proofCategory = "catalogLifecycleFixture";

const testTranslations = {
  title: proofTitle,
  description: "Synthetic catalog lifecycle report.",
  result: "Result",
  error: "Synthetic report error",
};
const scopedTranslation = createScopedTranslation({
  en: testTranslations,
  de: testTranslations,
  pl: testTranslations,
  fr: testTranslations,
});
const error = { title: "error", description: "error" } as const;
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "help-tool-proof", "report"],
  aliases: [proofAlias, "catalog-lifecycle-secondary-saffron"],
  title: "title",
  titleShort: "title",
  description: "description",
  category: "account",
  icon: "file-text",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    usage: { response: true },
    children: {
      result: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "result",
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: error,
    [EndpointErrorTypes.VALIDATION_FAILED]: error,
    [EndpointErrorTypes.SERVER_ERROR]: error,
    [EndpointErrorTypes.UNKNOWN_ERROR]: error,
    [EndpointErrorTypes.NETWORK_ERROR]: error,
    [EndpointErrorTypes.FORBIDDEN]: error,
    [EndpointErrorTypes.NOT_FOUND]: error,
    [EndpointErrorTypes.UNSAVED_CHANGES]: error,
    [EndpointErrorTypes.CONFLICT]: error,
  },
  successTypes: { title: "title", description: "description" },
  examples: { responses: { default: { result: true } } },
});

export default { GET };
