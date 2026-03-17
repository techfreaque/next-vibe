/**
 * Export Production Env API Definition
 * GET: Generate a production-ready .env file with decrypted values
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { ExportEnvWidget } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["system", "settings", "export-env"] as const,
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_OFF,
    UserRole.MCP_OFF,
    UserRole.AI_TOOL_OFF,
  ] as const,
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "download" as const,
  category: "app.endpointCategories.systemTasks",
  tags: ["get.tags.exportEnv" as const],

  fields: customWidgetObject({
    render: ExportEnvWidget,
    usage: { response: true } as const,
    children: {
      content: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.content.title" as const,
        schema: z.string(),
      }),
      filename: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.filename.title" as const,
        schema: z.string(),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
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
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
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

  examples: {
    responses: {
      default: {
        content:
          "# PRODUCTION ENV\nNODE_ENV=production\nDATABASE_URL=postgres://user:pass@host/db\n",
        filename: ".env.prod",
      },
    },
  },
});

export type ExportEnvResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
