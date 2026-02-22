/**
 * SSH Terminal Endpoint Definition
 * GET /ssh/terminal — Widget-only, renders xterm.js browser terminal
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";
import { TerminalContainer } from "./widget";

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "terminal"],
  title: "terminal.get.title",
  description: "terminal.get.description",
  icon: "terminal",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: TerminalContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // No meaningful server fields — widget manages its own session
      ok: responseField({
        type: WidgetType.TEXT,
        content: "terminal.get.response.ok.title",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "terminal.get.success.title",
    description: "terminal.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "terminal.get.errors.unauthorized.title",
      description: "terminal.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "terminal.get.errors.server.title",
      description: "terminal.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "terminal.get.errors.unknown.title",
      description: "terminal.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "terminal.get.errors.unsavedChanges.title",
      description: "terminal.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "terminal.get.errors.notFound.title",
      description: "terminal.get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "terminal.get.errors.conflict.title",
      description: "terminal.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "terminal.get.errors.network.title",
      description: "terminal.get.errors.network.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "terminal.get.errors.validation.title",
      description: "terminal.get.errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "terminal.get.errors.forbidden.title",
      description: "terminal.get.errors.forbidden.description",
    },
  },

  examples: {
    requests: { default: {} },
    responses: { default: { ok: true } },
  },
});

export type TerminalRequestOutput = typeof GET.types.RequestOutput;
export type TerminalResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
