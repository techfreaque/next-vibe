import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CorvinaUserOwner } from "../enums";
import { scopedTranslation } from "./i18n";

const UserCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserCreateContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "organizations", "[orgId]", "users", "create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "user-plus",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.users" as const],

  fields: customWidgetObject({
    render: UserCreateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgId.label" as const,
        description: "post.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      username: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.username.label" as const,
        description: "post.username.description" as const,
        placeholder: "post.username.placeholder" as const,
        columns: 6,
        schema: z.string().min(3).max(100),
      }),
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "post.email.label" as const,
        description: "post.email.description" as const,
        placeholder: "post.email.placeholder" as const,
        columns: 6,
        schema: z.string().email(),
      }),
      firstName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.firstName.label" as const,
        description: "post.firstName.description" as const,
        placeholder: "post.firstName.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      lastName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.lastName.label" as const,
        description: "post.lastName.description" as const,
        placeholder: "post.lastName.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      password: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "post.password.label" as const,
        description: "post.password.description" as const,
        placeholder: "post.password.placeholder" as const,
        columns: 12,
        schema: z.string().min(8).optional(),
      }),
      temporaryPassword: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.temporaryPassword.label" as const,
        description: "post.temporaryPassword.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      passwordChangeInvitation: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.passwordChangeInvitation.label" as const,
        description: "post.passwordChangeInvitation.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      serviceAccount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.serviceAccount.label" as const,
        description: "post.serviceAccount.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      emailVerified: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.emailVerified.label" as const,
        description: "post.emailVerified.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number(),
      }),
      usernameResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.username" as const,
        schema: z.string(),
      }),
      emailResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.email" as const,
        schema: z.string(),
      }),
      firstNameResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.firstName" as const,
        schema: z.string().nullable(),
      }),
      lastNameResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.lastName" as const,
        schema: z.string().nullable(),
      }),
      serviceAccountResult: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.serviceAccount" as const,
        schema: z.boolean(),
      }),
      mfaEnabled: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.mfaEnabled" as const,
        schema: z.boolean(),
      }),
      owner: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.owner" as const,
        schema: z.enum(CorvinaUserOwner),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "user-plus",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    urlPathParams: { default: { orgId: 45511 } },
    requests: {
      default: {
        username: "jdoe",
        email: "jdoe@example.com",
        firstName: "John",
        lastName: "Doe",
        temporaryPassword: false,
        passwordChangeInvitation: false,
        serviceAccount: false,
        emailVerified: false,
      },
    },
    responses: {
      default: {
        id: 42,
        usernameResult: "jdoe",
        emailResult: "jdoe@example.com",
        firstNameResult: "John",
        lastNameResult: "Doe",
        serviceAccountResult: false,
        mfaEnabled: false,
        owner: "ORGANIZATION" as const,
      },
    },
  },
});

export type CorvinaUserCreateRequestOutput = typeof POST.types.RequestOutput;
export type CorvinaUserCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
