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

import { scopedTranslation } from "../../i18n";
import { ConnectionTestContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "connections", "test"],
  title: "connections.test.post.title",
  description: "connections.test.post.description",
  icon: "wifi",
  category: "category",
  allowedRoles: [UserRole.ADMIN],
  tags: ["type"],

  fields: customWidgetObject({
    render: ConnectionTestContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // REQUEST
      connectionId: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "connections.test.post.fields.connectionId.label",
        description: "connections.test.post.fields.connectionId.description",
        placeholder: "connections.test.post.fields.connectionId.placeholder",
        schema: z.string().uuid(),
      }),
      acknowledgeNewFingerprint: requestField({
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "connections.test.post.fields.acknowledgeNewFingerprint.label",
        description:
          "connections.test.post.fields.acknowledgeNewFingerprint.description",
        placeholder:
          "connections.test.post.fields.acknowledgeNewFingerprint.placeholder",
        schema: z.boolean().optional(),
      }),

      // RESPONSE
      ok: responseField({
        type: WidgetType.TEXT,
        content: "connections.test.post.response.ok.title",
        schema: z.boolean(),
      }),
      latencyMs: responseField({
        type: WidgetType.TEXT,
        content: "connections.test.post.response.latencyMs.title",
        schema: z.number(),
      }),
      fingerprint: responseField({
        type: WidgetType.TEXT,
        content: "connections.test.post.response.fingerprint.title",
        schema: z.string().nullable(),
      }),
      fingerprintChanged: responseField({
        type: WidgetType.TEXT,
        content: "connections.test.post.response.fingerprintChanged.title",
        schema: z.boolean().optional(),
      }),
    },
  }),

  successTypes: {
    title: "connections.test.post.success.title",
    description: "connections.test.post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "connections.test.post.errors.validation.title",
      description: "connections.test.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "connections.test.post.errors.unauthorized.title",
      description: "connections.test.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "connections.test.post.errors.forbidden.title",
      description: "connections.test.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "connections.test.post.errors.server.title",
      description: "connections.test.post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "connections.test.post.errors.notFound.title",
      description: "connections.test.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "connections.test.post.errors.unknown.title",
      description: "connections.test.post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "connections.test.post.errors.unsavedChanges.title",
      description: "connections.test.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "connections.test.post.errors.conflict.title",
      description: "connections.test.post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "connections.test.post.errors.network.title",
      description: "connections.test.post.errors.network.description",
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
