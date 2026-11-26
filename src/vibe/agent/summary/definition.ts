import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { categorySummarySchema } from "next-vibe/unified-ui/_shared/category-summary";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const render = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AiSummaryWidget })),
);
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["vibe", "agent", "summary"],
  aliases: ["ai-admin-summary"],
  title: "title",
  titleShort: "title",
  description: "description",
  scopedTranslation,
  allowedRoles: [UserRole.ADMIN],
  category: "ai",
  icon: "bot",
  tags: ["title"],
  fields: customWidgetObject({
    render,
    usage: { response: true },
    children: {
      summary: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "title",
        schema: categorySummarySchema(
          z.enum([
            "models",
            "providers",
            "skills",
            "conversations",
            "reported",
          ]),
        ),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
  },

  successTypes: { title: "title", description: "description" },
  examples: {
    responses: {
      default: {
        summary: {
          from: "2026-11-19",
          to: "2026-11-25",
          kpis: [
            {
              label: "models",
              format: "number",
              value: 87,
              drill: { alias: "models" },
            },
            {
              label: "providers",
              format: "number",
              value: 9,
              drill: { alias: "models" },
            },
            {
              label: "skills",
              format: "number",
              value: 14,
              drill: { alias: "skills" },
            },
            {
              label: "conversations",
              format: "number",
              value: 37,
              previous: 25,
            },
          ],
          attention: [],
          attentionAvailable: true,
          recent: [],
        },
      },
    },
  },
});
export type AiSummaryOutput = typeof GET.types.ResponseOutput;
export default { GET };
