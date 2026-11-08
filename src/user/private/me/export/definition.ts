/**
 * Export My Data API Definition (GDPR data portability)
 * GET: Collect everything the caller owns into a downloadable archive
 * (full JSON + human-readable Markdown summary).
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

export const USER_EXPORT_ALIAS = "user-export" as const;

const ExportMyDataWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ExportMyDataWidget })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "private", "me", "export"] as const,
  aliases: [USER_EXPORT_ALIAS] as const,
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,
  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "download" as const,
  category: "account",
  tags: ["get.tags.export" as const],

  fields: customWidgetObject({
    render: ExportMyDataWidget,
    usage: { response: true } as const,
    children: {
      json: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.json.title" as const,
        schema: z.string(),
      }),
      jsonFilename: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.jsonFilename.title" as const,
        schema: z.string(),
      }),
      markdown: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.markdown.title" as const,
        schema: z.string(),
      }),
      markdownFilename: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "get.response.markdownFilename.title" as const,
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
        json: "{}",
        jsonFilename: "my-data.json",
        markdown: "# My data",
        markdownFilename: "my-data.md",
      },
    },
  },
});

export type ExportMyDataResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
