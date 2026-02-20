/**
 * DB Health Check API Definition
 * POST endpoint to verify database connectivity (called by cron)
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
  path: ["system", "unified-interface", "tasks", "db-health"],
  title: "app.api.system.unifiedInterface.tasks.dbHealth.post.title",
  description:
    "app.api.system.unifiedInterface.tasks.dbHealth.post.description",
  category: "app.api.system.category",
  icon: "database",
  tags: ["app.api.system.unifiedInterface.tasks.dbHealth.tag"],
  allowedRoles: [UserRole.ADMIN],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.container.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.container.description",
      layoutType: LayoutType.GRID,
      columns: 12,
    },
    { response: true },
    {
      healthy: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.system.unifiedInterface.tasks.dbHealth.post.response.healthy",
        schema: z.boolean(),
      }),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unauthorized.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.forbidden.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.server.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.validation.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.title",
      description:
        "app.api.system.unifiedInterface.tasks.dbHealth.post.errors.unknown.description",
    },
  },

  successTypes: {
    title: "app.api.system.unifiedInterface.tasks.dbHealth.post.success.title",
    description:
      "app.api.system.unifiedInterface.tasks.dbHealth.post.success.description",
  },

  examples: {
    responses: { default: { healthy: true } },
  },
});

export type DbHealthPostRequestOutput = typeof POST.types.RequestOutput;
export type DbHealthPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
