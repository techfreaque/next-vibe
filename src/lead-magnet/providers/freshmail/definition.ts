import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const ALLOWED_ROLES = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["lead-magnet", "providers", "freshmail"],
  title: "providers.freshmail.title" as const,
  titleShort: "providers.freshmail.titleShort" as const,
  description: "providers.freshmail.description" as const,
  icon: "mail",
  category: "leads",
  subCategory: "leadMagnetIntegrations",
  tags: ["providers.shared.saveTag" as const],
  allowedRoles: ALLOWED_ROLES,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "providers.freshmail.title" as const,
    description: "providers.freshmail.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      freshmailApiKey: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "providers.freshmail.freshmailApiKey.label" as const,
        description: "providers.shared.secretKeepExisting" as const,
        placeholder: "providers.freshmail.freshmailApiKey.placeholder" as const,
        schema: z.string().optional(),
      }),
      freshmailApiSecret: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "providers.freshmail.freshmailApiSecret.label" as const,
        description: "providers.shared.secretKeepExisting" as const,
        placeholder:
          "providers.freshmail.freshmailApiSecret.placeholder" as const,
        schema: z.string().optional(),
      }),
      listHash: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.freshmail.listHash.label" as const,
        description: "providers.freshmail.listHash.description" as const,
        placeholder: "providers.freshmail.listHash.placeholder" as const,
        schema: z.string().min(1),
      }),
      listId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.shared.listId.label" as const,
        description: "providers.shared.listId.description" as const,
        placeholder: "providers.shared.listId.placeholder" as const,
        schema: z.string().optional().nullable(),
      }),
      headline: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.shared.headline.label" as const,
        description: "providers.shared.headline.description" as const,
        placeholder: "providers.shared.headline.placeholder" as const,
        schema: z.string().max(200).optional().nullable(),
      }),
      buttonText: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.shared.buttonText.label" as const,
        description: "providers.shared.buttonText.description" as const,
        placeholder: "providers.shared.buttonText.placeholder" as const,
        schema: z.string().max(100).optional().nullable(),
      }),
      isActive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "providers.shared.isActive.label" as const,
        description: "providers.shared.isActive.description" as const,
        schema: z.boolean().optional().default(true),
      }),
      provider: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "providers.shared.response.provider" as const,
        schema: z.string(),
      }),
      isActiveResponse: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "providers.shared.response.isActive" as const,
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "providers.shared.errors.validation.title" as const,
      description: "providers.shared.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "providers.shared.errors.unauthorized.title" as const,
      description: "providers.shared.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "providers.shared.errors.forbidden.title" as const,
      description: "providers.shared.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "providers.shared.errors.notFound.title" as const,
      description: "providers.shared.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "providers.shared.errors.conflict.title" as const,
      description: "providers.shared.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "providers.shared.errors.network.title" as const,
      description: "providers.shared.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "providers.shared.errors.unsavedChanges.title" as const,
      description:
        "providers.shared.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "providers.shared.errors.internal.title" as const,
      description: "providers.shared.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "providers.shared.errors.unknown.title" as const,
      description: "providers.shared.errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "providers.shared.saveSuccess.title" as const,
    description: "providers.shared.saveSuccess.description" as const,
  },
  examples: {
    requests: {
      default: {
        freshmailApiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        freshmailApiSecret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        listHash: "xxxxxxxxxxxx",
        listId: null,
        headline: "Get my AI prompt pack free",
        buttonText: "Get access →",
        isActive: true,
      },
    },
    responses: { default: { provider: "FRESHMAIL", isActiveResponse: true } },
  },
});

const freshmailEndpoints = { POST } as const;
export default freshmailEndpoints;
export type FreshmailConfigPostRequestOutput = typeof POST.types.RequestOutput;
