/**
 * Credit Expiration API Definition
 * POST endpoint to expire old subscription credits (called by cron)
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["credits", "expire"],
  title: "app.api.credits.expire.post.title",
  description: "app.api.credits.expire.post.description",
  category: "app.api.payment.category",
  icon: "clock",
  tags: ["app.api.credits.expire.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.credits.expire.post.container.title",
      description: "app.api.credits.expire.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      expiredCount: responseField({
        type: WidgetType.TEXT,
        content: "app.api.credits.expire.post.response.expiredCount",
        schema: z.number(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.credits.expire.post.errors.unauthorized.title",
      description:
        "app.api.credits.expire.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.credits.expire.post.errors.forbidden.title",
      description: "app.api.credits.expire.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.credits.expire.post.errors.server.title",
      description: "app.api.credits.expire.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.credits.expire.post.errors.unknown.title",
      description: "app.api.credits.expire.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.credits.expire.post.errors.validation.title",
      description: "app.api.credits.expire.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.credits.expire.post.errors.unknown.title",
      description: "app.api.credits.expire.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.credits.expire.post.errors.unknown.title",
      description: "app.api.credits.expire.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.credits.expire.post.errors.unknown.title",
      description: "app.api.credits.expire.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.credits.expire.post.errors.unknown.title",
      description: "app.api.credits.expire.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.credits.expire.post.success.title",
    description: "app.api.credits.expire.post.success.description",
  },

  examples: {
    responses: { default: { expiredCount: 0 } },
  },
});

export type CreditsExpirePostRequestOutput = typeof POST.types.RequestOutput;
export type CreditsExpirePostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
