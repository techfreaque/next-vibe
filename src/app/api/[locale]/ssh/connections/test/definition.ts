/**
 * SSH Connections Test Endpoint Definition
 * POST /ssh/connections/test — Test SSH connectivity
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ConnectionTestContainer } from "./widget";

export const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["ssh", "connections", "test"],
  title: "app.api.ssh.connections.test.post.title",
  description: "app.api.ssh.connections.test.post.description",
  icon: "wifi",
  category: "app.api.ssh.category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["app.api.ssh.type"],

  fields: customWidgetObject({
    render: ConnectionTestContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // REQUEST
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "app.api.ssh.connections.test.post.fields.connectionId.label",
        description:
          "app.api.ssh.connections.test.post.fields.connectionId.description",
        placeholder:
          "app.api.ssh.connections.test.post.fields.connectionId.placeholder",
        schema: z.string().uuid(),
      }),
      acknowledgeNewFingerprint: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label:
          "app.api.ssh.connections.test.post.fields.acknowledgeNewFingerprint.label",
        description:
          "app.api.ssh.connections.test.post.fields.acknowledgeNewFingerprint.description",
        placeholder:
          "app.api.ssh.connections.test.post.fields.acknowledgeNewFingerprint.placeholder",
        schema: z.boolean().optional(),
      }),

      // RESPONSE
      ok: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.connections.test.post.response.ok.title",
        schema: z.boolean(),
      }),
      latencyMs: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.connections.test.post.response.latencyMs.title",
        schema: z.number(),
      }),
      fingerprint: responseField({
        type: WidgetType.TEXT,
        content: "app.api.ssh.connections.test.post.response.fingerprint.title",
        schema: z.string().nullable(),
      }),
      fingerprintChanged: responseField({
        type: WidgetType.TEXT,
        content:
          "app.api.ssh.connections.test.post.response.fingerprintChanged.title",
        schema: z.boolean().optional(),
      }),
    },
  }),

  successTypes: {
    title: "app.api.ssh.connections.test.post.success.title",
    description: "app.api.ssh.connections.test.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.ssh.connections.test.post.errors.validation.title",
      description:
        "app.api.ssh.connections.test.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.ssh.connections.test.post.errors.unauthorized.title",
      description:
        "app.api.ssh.connections.test.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.ssh.connections.test.post.errors.forbidden.title",
      description:
        "app.api.ssh.connections.test.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.ssh.connections.test.post.errors.server.title",
      description:
        "app.api.ssh.connections.test.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.ssh.connections.test.post.errors.notFound.title",
      description:
        "app.api.ssh.connections.test.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.ssh.connections.test.post.errors.unknown.title",
      description:
        "app.api.ssh.connections.test.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.ssh.connections.test.post.errors.unsavedChanges.title",
      description:
        "app.api.ssh.connections.test.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.ssh.connections.test.post.errors.conflict.title",
      description:
        "app.api.ssh.connections.test.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.ssh.connections.test.post.errors.network.title",
      description:
        "app.api.ssh.connections.test.post.errors.network.description",
    },
  },

  examples: {
    requests: {
      default: { connectionId: "00000000-0000-0000-0000-000000000001" },
    },
    responses: {
      default: {
        ok: true,
        latencyMs: 45,
        fingerprint: "SHA256:abcdef...",
        fingerprintChanged: false,
      },
    },
  },
});

export type ConnectionTestRequestOutput = typeof POST.types.RequestOutput;
export type ConnectionTestResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
