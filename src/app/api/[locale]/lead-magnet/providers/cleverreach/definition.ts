import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

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
  path: ["lead-magnet", "providers", "cleverreach"],
  title: "providers.cleverreach.title" as const,
  description: "providers.cleverreach.description" as const,
  icon: "mail",
  category: "endpointCategories.leads",
  tags: ["providers.shared.saveTag" as const],
  allowedRoles: ALLOWED_ROLES,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "providers.cleverreach.title" as const,
    description: "providers.cleverreach.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      cleverreachClientId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.cleverreach.cleverreachClientId.label" as const,
        description:
          "providers.cleverreach.cleverreachClientId.description" as const,
        placeholder:
          "providers.cleverreach.cleverreachClientId.placeholder" as const,
        schema: z.string().min(1),
      }),
      cleverreachClientSecret: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "providers.cleverreach.cleverreachClientSecret.label" as const,
        description:
          "providers.cleverreach.cleverreachClientSecret.description" as const,
        placeholder:
          "providers.cleverreach.cleverreachClientSecret.placeholder" as const,
        schema: z.string().min(1),
      }),
      cleverreachListId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.cleverreach.cleverreachListId.label" as const,
        description:
          "providers.cleverreach.cleverreachListId.description" as const,
        placeholder:
          "providers.cleverreach.cleverreachListId.placeholder" as const,
        schema: z.string().min(1),
      }),
      cleverreachFormId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.cleverreach.cleverreachFormId.label" as const,
        description:
          "providers.cleverreach.cleverreachFormId.description" as const,
        placeholder:
          "providers.cleverreach.cleverreachFormId.placeholder" as const,
        schema: z.string().optional().nullable(),
      }),
      cleverreachSource: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.cleverreach.cleverreachSource.label" as const,
        description:
          "providers.cleverreach.cleverreachSource.description" as const,
        placeholder:
          "providers.cleverreach.cleverreachSource.placeholder" as const,
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
        content: "providers.shared.response.provider" as const,
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
        cleverreachClientId: "xxxxxxxx",
        cleverreachClientSecret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        cleverreachListId: "123456",
        cleverreachFormId: null,
        cleverreachSource: null,
        headline: "Get my AI prompt pack free",
        buttonText: "Get access →",
        isActive: true,
      },
    },
    responses: { default: { provider: "CLEVERREACH", isActiveResponse: true } },
  },
});

const cleverreachEndpoints = { POST } as const;
export default cleverreachEndpoints;
export type CleverReachConfigPostRequestOutput =
  typeof POST.types.RequestOutput;
