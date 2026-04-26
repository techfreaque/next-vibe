/**
 * SSH Terminal Endpoint Definition
 * GET /ssh/terminal - Widget-only, renders xterm.js browser terminal
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

import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";

const TerminalContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TerminalContainer })),
);

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["ssh", "terminal"],
  title: "get.title",
  description: "get.description",
  icon: "terminal",
  category: "endpointCategories.ssh",
  subCategory: "endpointCategories.sshTerminal",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: TerminalContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // No meaningful server fields - widget manages its own session
      ok: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.ok.title",
        schema: z.boolean(),
      }),
    },
  }),

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
  },

  examples: {
    requests: undefined,
    responses: { default: { ok: true } },
  },
});

export type TerminalRequestOutput = typeof GET.types.RequestOutput;
export type TerminalResponseOutput = typeof GET.types.ResponseOutput;

const endpoints = { GET };
export default endpoints;
