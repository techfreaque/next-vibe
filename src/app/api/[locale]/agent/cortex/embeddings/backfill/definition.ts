/**
 * Cortex Embedding Backfill Definition
 * POST endpoint for batch-generating missing embeddings
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const CortexBackfillWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CortexBackfillWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "cortex", "embeddings", "backfill"],
  aliases: ["cortex-embed-backfill"] as const,
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "cpu",
  dynamicIcon: () => "cpu" as const,
  statusBadge: {
    loading: {
      label: "post.status.loading" as const,
      color: "bg-purple-500/10 text-purple-500",
    },
    done: {
      label: "post.status.done" as const,
      color: "bg-green-500/10 text-green-500",
    },
  },
  category: "endpointCategories.ai",
  subCategory: "endpointCategories.aiTools",
  tags: ["post.tags.cortex" as const],
  defaultExpanded: false,

  fields: customWidgetObject({
    render: CortexBackfillWidget,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST ===
      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.force.label" as const,
        description: "post.fields.force.description" as const,
        schema: z
          .boolean()
          .optional()
          .default(false)
          .describe(
            "Clear all existing embeddings first and regenerate (use when embedding format changed)",
          ),
      }),

      // === RESPONSE ===
      materialized: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.materialized.text" as const,
        schema: z.number(),
      }),
      processed: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.processed.text" as const,
        schema: z.number(),
      }),
      failed: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.failed.text" as const,
        schema: z.number(),
      }),
      skipped: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "post.response.skipped.text" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      normal: { force: false },
      force: { force: true },
    },
    responses: {
      done: {
        materialized: 150,
        processed: 42,
        failed: 1,
        skipped: 3,
      },
    },
  },
});

export type CortexBackfillResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
