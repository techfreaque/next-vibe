/**
 * Remote Connection Register API Definition
 * POST — called by a local instance to register itself on the cloud during connect flow.
 * The cloud stores the local instance info (instanceId + localUrl) so it knows
 * which local instances are connected per user.
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  scopedRequestField,
  scopedResponseField,
  scopedWidgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { RemoteRegisterWidget } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "remote-connection", "register"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "server" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tags.remoteConnection" as const],

  fields: customWidgetObject({
    render: RemoteRegisterWidget,
    usage: { request: "data", response: true } as const,
    children: {
      instanceId: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.instanceId.label" as const,
        description: "post.instanceId.description" as const,
        placeholder: "post.instanceId.placeholder" as const,
        columns: 6,
        schema: z
          .string()
          .min(1)
          .max(32)
          .regex(/^[a-z0-9-]+$/, {
            message: "post.instanceId.validation.invalid",
          }),
      }),
      localUrl: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "post.localUrl.label" as const,
        description: "post.localUrl.description" as const,
        placeholder: "post.localUrl.placeholder" as const,
        columns: 6,
        schema: z
          .string()
          .min(1, { message: "post.localUrl.validation.required" })
          .url({ message: "post.localUrl.validation.invalid" })
          .transform((val) => val.replace(/\/+$/, "")),
      }),
      submitButton: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "post.title" as const,
        loadingText: "post.title" as const,
        icon: "server",
        variant: "default",
        size: "default",
        order: 10,
        usage: { request: "data" },
      }),
      registered: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        instanceId: "hermes",
        localUrl: "http://localhost:3000",
      },
    },
    responses: {
      default: {
        registered: true,
      },
    },
  },
});

export type RemoteRegisterPostRequestInput = typeof POST.types.RequestInput;
export type RemoteRegisterPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
