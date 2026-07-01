import { translatedValueSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { scopedTranslation } from "next-vibe/server/server/headless-client/i18n";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { HEADLESS_CLIENT_ALIASES } from "./constants";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["system", "server", "server", "headless-client"],
  aliases: HEADLESS_CLIENT_ALIASES,
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "devTools",
  subCategory: "serverManagement",
  tags: [],
  icon: "radio",
  allowedRoles: [
    UserRole.ADMIN,
    UserRole.CLI_AUTH_BYPASS,
    UserRole.AI_TOOL_OFF,
    UserRole.WEB_OFF,
  ],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.form.title",
    description: "post.form.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      computerName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.computerName.title",
        description: "post.fields.computerName.description",
        columns: 12,
        schema: z.string().min(1).optional(),
      }),
      remoteUrl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.remoteUrl.title",
        description: "post.fields.remoteUrl.description",
        columns: 12,
        schema: z.string().url(),
      }),
      leadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.leadId.title",
        description: "post.fields.leadId.description",
        columns: 12,
        schema: z.string().uuid(),
      }),
      token: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.token.title",
        description: "post.fields.token.description",
        columns: 12,
        schema: z.string().min(1),
      }),
      responseMessage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.fields.output.title",
        schema: translatedValueSchema,
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        computerName: "my-laptop",
        remoteUrl: "https://unbottled.ai",
        leadId: "00000000-0000-0000-0000-000000000001",
        token: "your-connection-token",
      },
    },
    responses: {
      default: {
        responseMessage: "post.fields.output.title",
      },
    },
  },
});

export type HeadlessClientRequestOutput = typeof POST.types.RequestOutput;
export type HeadlessClientResponseOutput = typeof POST.types.ResponseOutput;

const headlessClientDefinition = { POST };
export default headlessClientDefinition;
