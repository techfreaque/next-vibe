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
  path: ["lead-magnet", "providers", "emarsys"],
  title: "providers.emarsys.title" as const,
  description: "providers.emarsys.description" as const,
  icon: "mail",
  category: "endpointCategories.leadMagnet",
  subCategory: "endpointCategories.leadMagnetIntegrations",
  tags: ["providers.shared.saveTag" as const],
  allowedRoles: ALLOWED_ROLES,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "providers.emarsys.title" as const,
    description: "providers.emarsys.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      emarsysUserName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.emarsys.emarsysUserName.label" as const,
        description: "providers.emarsys.emarsysUserName.description" as const,
        placeholder: "providers.emarsys.emarsysUserName.placeholder" as const,
        schema: z.string().min(1),
      }),
      emarsysApiKey: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.PASSWORD,
        label: "providers.emarsys.emarsysApiKey.label" as const,
        description: "providers.shared.secretKeepExisting" as const,
        placeholder: "providers.emarsys.emarsysApiKey.placeholder" as const,
        schema: z.string().optional(),
      }),
      emarsysSubDomain: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.emarsys.emarsysSubDomain.label" as const,
        description: "providers.emarsys.emarsysSubDomain.description" as const,
        placeholder: "providers.emarsys.emarsysSubDomain.placeholder" as const,
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
        emarsysUserName: "account123",
        emarsysApiKey: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        emarsysSubDomain: "suite.emarsys.net",
        listId: "1",
        headline: "Get my AI prompt pack free",
        buttonText: "Get access →",
        isActive: true,
      },
    },
    responses: { default: { provider: "EMARSYS", isActiveResponse: true } },
  },
});

const emarsysEndpoints = { POST } as const;
export default emarsysEndpoints;
export type EmarsysConfigPostRequestOutput = typeof POST.types.RequestOutput;
