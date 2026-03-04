/**
 * Remote Connection Connect API Definition
 * POST — login to remote instance and store session in DB
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  scopedObjectFieldNew,
  scopedRequestField,
  scopedResponseField,
  scopedWidgetField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "remote-connection", "connect"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "link" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tags.remoteConnection" as const],

  fields: scopedObjectFieldNew(scopedTranslation, {
    type: WidgetType.CONTAINER,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
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
          })
          .default("hermes"),
      }),
      friendlyName: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.friendlyName.label" as const,
        description: "post.friendlyName.description" as const,
        placeholder: "post.friendlyName.placeholder" as const,
        columns: 6,
        schema: z.string().min(1).max(64).default("hermes"),
      }),
      remoteUrl: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.URL,
        label: "post.remoteUrl.label" as const,
        description: "post.remoteUrl.description" as const,
        placeholder: "post.remoteUrl.placeholder" as const,
        columns: 12,
        schema: z
          .string({
            error: "post.remoteUrl.validation.required",
          })
          .min(1, { message: "post.remoteUrl.validation.required" })
          .url({ message: "post.remoteUrl.validation.invalid" })
          .transform((val) => val.replace(/\/+$/, "")), // strip trailing slashes
      }),
      email: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "post.email.label" as const,
        description: "post.email.description" as const,
        placeholder: "post.email.placeholder" as const,
        columns: 12,
        schema: z
          .string({
            error: "post.email.validation.required",
          })
          .min(1, { message: "post.email.validation.required" })
          .email({ message: "post.email.validation.invalid" })
          .transform((val) => val.toLowerCase().trim()),
      }),
      password: scopedRequestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "post.password.label" as const,
        description: "post.password.description" as const,
        placeholder: "post.password.placeholder" as const,
        columns: 12,
        schema: z
          .string({
            error: "post.password.validation.required",
          })
          .min(1, { message: "post.password.validation.required" }),
      }),
      formAlert: scopedWidgetField(scopedTranslation, {
        type: WidgetType.FORM_ALERT,
        order: 10,
        usage: { request: "data" },
      }),
      submitButton: scopedWidgetField(scopedTranslation, {
        type: WidgetType.SUBMIT_BUTTON,
        text: "post.actions.submit" as const,
        loadingText: "post.actions.submitting" as const,
        icon: "link",
        variant: "default",
        size: "default",
        order: 11,
        usage: { request: "data" },
      }),
      remoteUrlResult: scopedResponseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.string(),
      }),
      isConnected: scopedResponseField(scopedTranslation, {
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
        friendlyName: "My Laptop",
        remoteUrl: "https://unbottled.ai",
        email: "you@example.com",
        password: "yourpassword",
      },
    },
    responses: {
      default: {
        remoteUrlResult: "https://unbottled.ai",
        isConnected: true,
      },
    },
  },
});

export type RemoteConnectPostRequestInput = typeof POST.types.RequestInput;
export type RemoteConnectPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
