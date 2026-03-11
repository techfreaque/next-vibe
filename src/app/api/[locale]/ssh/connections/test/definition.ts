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
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { ConnectionTestContainer } from "./widget";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["ssh", "connections", "test"],
  title: "post.title",
  description: "post.description",
  icon: "wifi",
  category: "app.endpointCategories.ssh",
  allowedRoles: [UserRole.ADMIN],
  tags: ["category" as const],

  fields: customWidgetObject({
    render: ConnectionTestContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // REQUEST
      connectionId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.connectionId.label",
        description: "post.fields.connectionId.description",
        placeholder: "post.fields.connectionId.placeholder",
        schema: z.string().uuid(),
      }),
      acknowledgeNewFingerprint: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.acknowledgeNewFingerprint.label",
        description: "post.fields.acknowledgeNewFingerprint.description",
        placeholder: "post.fields.acknowledgeNewFingerprint.placeholder",
        schema: z.boolean().optional(),
      }),

      // RESPONSE
      ok: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.ok.title",
        schema: z.boolean(),
      }),
      latencyMs: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.latencyMs.title",
        schema: z.number(),
      }),
      fingerprint: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fingerprint.title",
        schema: z.string().nullable(),
      }),
      fingerprintChanged: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.fingerprintChanged.title",
        schema: z.boolean().optional(),
      }),
    },
  }),

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
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
