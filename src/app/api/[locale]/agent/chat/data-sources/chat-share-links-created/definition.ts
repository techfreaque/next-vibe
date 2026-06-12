/**
 * Chat Share Links Created - Endpoint Definition
 * Client+server safe. No server imports.
 */

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  EndpointErrorTypes,
  Methods,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { dataSourceWidget } from "@/app/api/[locale]/system/unified-interface/vibe-sense/shared/fields";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CHAT_SHARE_LINKS_CREATED_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  aliases: [CHAT_SHARE_LINKS_CREATED_ALIAS],
  method: Methods.POST,
  path: ["agent", "chat", "data-sources", "chat-share-links-created"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  icon: "activity",
  category: "analytics",
  subCategory: "chatData",
  tags: ["tags.vibeSense" as const],
  allowedRoles: [UserRole.ADMIN],

  fields: dataSourceWidget(scopedTranslation, {
    resolution: {
      label: "post.fields.resolution.label",
      description: "post.fields.resolution.description",
    },
    range: {
      label: "post.fields.range.label",
      description: "post.fields.range.description",
    },
    lookback: {
      label: "post.fields.lookback.label",
      description: "post.fields.lookback.description",
    },
    result: {
      label: "post.fields.result.label",
      description: "post.fields.result.description",
    },
    meta: {
      label: "post.fields.meta.label",
      description: "post.fields.meta.description",
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
        result: [] as { timestamp: Date; value: number }[],
        meta: {
          actualResolution: "enums.resolution.1d" as const,
          lookbackUsed: 0,
        },
      },
    },
  },
});

const definitions = { POST };
export default definitions;
