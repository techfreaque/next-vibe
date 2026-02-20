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

import { TerminalContainer } from "./widget";

export const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["ssh", "terminal"],
  title: "app.api.ssh.terminal.get.title",
  description: "app.api.ssh.terminal.get.description",
  icon: "terminal",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: TerminalContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // No meaningful server fields — widget manages its own session
      ok: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.terminal.get.response.ok.title",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.terminal.get.success.title",
    description: "app.api.ssh.terminal.get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.terminal.get.errors.unauthorized.title",
      description: "app.api.ssh.terminal.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.terminal.get.errors.server.title",
      description: "app.api.ssh.terminal.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.terminal.get.errors.unknown.title",
      description: "app.api.ssh.terminal.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.terminal.get.errors.unsavedChanges.title",
      description: "app.api.ssh.terminal.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.terminal.get.errors.notFound.title",
      description: "app.api.ssh.terminal.get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.terminal.get.errors.conflict.title",
      description: "app.api.ssh.terminal.get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.terminal.get.errors.network.title",
      description: "app.api.ssh.terminal.get.errors.network.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.terminal.get.errors.validation.title",
      description: "app.api.ssh.terminal.get.errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.terminal.get.errors.forbidden.title",
      description: "app.api.ssh.terminal.get.errors.forbidden.description",
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
