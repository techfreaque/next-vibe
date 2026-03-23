/**
 * Chat Downvotes Total - Endpoint Definition
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import { objectField } from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import {
  lookbackRequestField,
  nodeMetaResponseField,
  rangeRequestField,
  resolutionRequestField,
  timeSeriesResponseField,
} from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CHAT_DOWNVOTES_TOTAL_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "chat", "data-sources", "chat-downvotes-total"],
  title: "post.title",
  description: "post.description",
  icon: "activity",
  category: "app.endpointCategories.analyticsDataSources",
  tags: ["tags.vibeSense" as const],
  aliases: [CHAT_DOWNVOTES_TOTAL_ALIAS],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      resolution: resolutionRequestField(scopedTranslation, {
        label: "post.fields.resolution.label",
        description: "post.fields.resolution.description",
      }),
      range: rangeRequestField(scopedTranslation, {
        label: "post.fields.range.label",
        description: "post.fields.range.description",
      }),
      lookback: lookbackRequestField(scopedTranslation, {
        label: "post.fields.lookback.label",
        description: "post.fields.lookback.description",
      }),
      result: timeSeriesResponseField(scopedTranslation, {
        label: "post.fields.result.label",
        description: "post.fields.result.description",
      }),
      meta: nodeMetaResponseField(scopedTranslation, {
        label: "post.fields.meta.label",
        description: "post.fields.meta.description",
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },
  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  examples: {
    requests: {
      default: {
        range: { from: new Date("2024-01-01"), to: new Date("2024-01-31") },
      },
    },
    responses: {
      default: {
        result: [],
        meta: { actualResolution: "enums.resolution.1d", lookbackUsed: 0 },
      },
    },
  },
});

const definitions = { POST };
export default definitions;
