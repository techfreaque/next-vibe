import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  objectField,
  requestField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
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
  path: ["corvina", "organizations", "create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "plus-circle",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "post.container.title" as const,
    description: "post.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.name.label" as const,
        description: "post.name.description" as const,
        placeholder: "post.name.placeholder" as const,
        columns: 6,
        schema: z
          .string()
          .min(1)
          .max(120)
          .regex(/^[a-z0-9][a-z0-9_-]*$/),
      }),
      displayName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.displayName.label" as const,
        description: "post.displayName.description" as const,
        placeholder: "post.displayName.placeholder" as const,
        columns: 6,
        schema: z.string().min(1).max(200).optional(),
      }),
      enabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.enabled.label" as const,
        description: "post.enabled.description" as const,
        columns: 12,
        schema: z.boolean().optional().default(true),
      }),
      orgId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.organization.id" as const,
        schema: z.string(),
      }),
      nameResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.organization.name" as const,
        schema: z.string(),
      }),
      displayNameResult: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.organization.displayName" as const,
        schema: z.string().nullable(),
      }),
      enabledResult: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.organization.enabled" as const,
        schema: z.boolean().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        fieldType: FieldDataType.DATETIME,
        content: "post.response.organization.createdAt" as const,
        schema: z.string().nullable(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "plus-circle",
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
    requests: {
      default: {
        name: "acme",
        displayName: "Acme Corp",
        enabled: true,
      },
    },
    responses: {
      default: {
        orgId: "org_abc123",
        nameResult: "acme",
        displayNameResult: "Acme Corp",
        enabledResult: true,
        createdAt: "2025-01-15T09:30:00.000Z",
      },
    },
  },
});

export type CorvinaOrganizationCreateRequestOutput =
  typeof POST.types.RequestOutput;
export type CorvinaOrganizationCreateResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
