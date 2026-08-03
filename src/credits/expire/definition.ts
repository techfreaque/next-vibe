/**
 * Credit Expiration API Definition
 * POST endpoint to expire old subscription credits (called by cron)
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["credits", "expire"],
  title: "expire.post.title" as const,
  titleShort: "expire.post.titleShort" as const,
  description: "expire.post.description" as const,
  category: "credits" as const,
  subCategory: "Management" as const,
  icon: "clock" as const,
  tags: ["expire.post.tag" as const],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "expire.post.container.title" as const,
    description: "expire.post.container.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      expiredCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "expire.post.response.expiredCount" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "expire.post.errors.unauthorized.title" as const,
      description: "expire.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "expire.post.errors.forbidden.title" as const,
      description: "expire.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "expire.post.errors.server.title" as const,
      description: "expire.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "expire.post.errors.unknown.title" as const,
      description: "expire.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "expire.post.errors.validation.title" as const,
      description: "expire.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "expire.post.errors.unknown.title" as const,
      description: "expire.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "expire.post.errors.unknown.title" as const,
      description: "expire.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "expire.post.errors.unknown.title" as const,
      description: "expire.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "expire.post.errors.unknown.title" as const,
      description: "expire.post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "expire.post.success.title" as const,
    description: "expire.post.success.description" as const,
  },

  examples: {
    responses: { default: { expiredCount: 0 } },
  },
});

export type CreditsExpirePostRequestOutput = typeof POST.types.RequestOutput;
export type CreditsExpirePostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
