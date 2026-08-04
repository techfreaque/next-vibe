/**
 * Export Production Env API Definition
 * GET: Generate a production-ready .env file with decrypted values
 */

import { z } from "zod";

import { createEndpoint } from "../../../core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "../../../core/definition/enums";
import { UserRole } from "../../../identity/roles/enum";
import { lazyWidget } from "../../../unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "../../../unified-ui/_shared/utils";
import { responseField } from "../../../unified-ui/_shared/utils-i18n";
import { scopedTranslation } from "./i18n";

const ExportEnvWidget = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.ExportEnvWidget,
  })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "env", "settings", "export-env"] as const,
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_OFF,
    UserRole.MCP_OFF,
    UserRole.AI_TOOL_OFF,
    UserRole.PRODUCTION_OFF,
  ] as const,
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "download" as const,
  category: "devTools",
  subCategory: "settingsEnv",
  tags: ["get.tags.exportEnv" as const],

  fields: customWidgetObject({
    render: ExportEnvWidget,
    usage: { response: true } as const,
    children: {
      content: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.content.title" as const,
        schema: z.string(),
      }),
      filename: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.filename.title" as const,
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
        content: ".env.prod",
        filename: ".env.prod",
      },
    },
  },
});

export type ExportEnvResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
