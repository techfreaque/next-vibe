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
  import("./widget").then((m) => ({ default: m.PublishingSummaryWidget })),
);
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["seo", "summary"],
  aliases: ["publishing-summary"],
  title: "title",
  titleShort: "title",
  description: "description",
  scopedTranslation,
  allowedRoles: [UserRole.ADMIN],
  category: "publishing",
  icon: "book-open",
  tags: ["title"],
  fields: customWidgetObject({
    render,
    usage: { response: true },
    children: {
      summary: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "title",
        schema: categorySummarySchema(z.enum(["threads", "savedUrls"])),
      }),
      newestThreadOn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "newestThread",
        schema: z.iso.date().nullable(),
      }),
      indexingSnapshotOn: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "indexingSnapshot",
        schema: z.iso.date().nullable(),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title" as const,
      description: "errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
  },

  successTypes: { title: "title", description: "description" },
  examples: {
    responses: {
      default: {
        summary: {
          from: "2026-11-25",
          to: "2026-11-25",
          kpis: [
            {
              label: "threads",
              format: "number",
              value: 24,
              drill: { alias: "forum-threads" },
            },
            { label: "savedUrls", format: "number", value: 52 },
          ],
          attentionAvailable: false,
          attention: [],
          recent: [],
        },
        newestThreadOn: "2026-11-23",
        indexingSnapshotOn: "2026-11-25",
      },
    },
  },
});
export type PublishingSummaryOutput = typeof GET.types.ResponseOutput;
export default { GET };
