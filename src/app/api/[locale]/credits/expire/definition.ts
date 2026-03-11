/**
 * Credit Expiration API Definition
 * POST endpoint to expire old subscription credits (called by cron)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["credits", "expire"],
  title: "expire.post.title",
  description: "expire.post.description",
  category: "app.endpointCategories.credits",
  icon: "clock",
  tags: ["expire.post.tag"],
  allowedRoles: [UserRole.ADMIN, UserRole.AI_TOOL_OFF],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "expire.post.container.title",
    description: "expire.post.container.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      expiredCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "expire.post.response.expiredCount",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "expire.post.errors.unauthorized.title",
      description: "expire.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "expire.post.errors.forbidden.title",
      description: "expire.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "expire.post.errors.server.title",
      description: "expire.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "expire.post.errors.unknown.title",
      description: "expire.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "expire.post.errors.validation.title",
      description: "expire.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "expire.post.errors.unknown.title",
      description: "expire.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "expire.post.errors.unknown.title",
      description: "expire.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "expire.post.errors.unknown.title",
      description: "expire.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "expire.post.errors.unknown.title",
      description: "expire.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "expire.post.success.title",
    description: "expire.post.success.description",
  },

  examples: {
    responses: { default: { expiredCount: 0 } },
  },
});

export type CreditsExpirePostRequestOutput = typeof POST.types.RequestOutput;
export type CreditsExpirePostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
