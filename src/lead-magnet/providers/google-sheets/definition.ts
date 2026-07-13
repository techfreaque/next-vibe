import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { lazyWidget } from "../../../vibe/unified-ui/_shared/lazy-widget";
import { scopedTranslation } from "../../i18n";

const GoogleSheetsWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.GoogleSheetsWidget })),
);

const ALLOWED_ROLES = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["lead-magnet", "providers", "google-sheets"],
  title: "providers.googleSheets.title" as const,
  titleShort: "providers.googleSheets.titleShort" as const,
  description: "providers.googleSheets.description" as const,
  icon: "table",
  category: "leads",
  subCategory: "leadMagnetIntegrations",
  tags: ["providers.shared.saveTag" as const],
  allowedRoles: ALLOWED_ROLES,

  fields: customWidgetObject({
    render: GoogleSheetsWidget,
    usage: { request: "data", response: true } as const,
    children: {
      spreadsheetId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.googleSheets.spreadsheetId.label" as const,
        description:
          "providers.googleSheets.spreadsheetId.description" as const,
        placeholder:
          "providers.googleSheets.spreadsheetId.placeholder" as const,
        schema: z.string().min(1),
      }),
      sheetTab: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "providers.googleSheets.sheetTab.label" as const,
        description: "providers.googleSheets.sheetTab.description" as const,
        placeholder: "providers.googleSheets.sheetTab.placeholder" as const,
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
        spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
        sheetTab: "Leads",
        headline: "Get my AI prompt pack free",
        buttonText: "Get access →",
        isActive: true,
      },
    },
    responses: {
      default: {
        provider: "GOOGLE_SHEETS",
        isActiveResponse: true,
      },
    },
  },
});

const googleSheetsEndpoints = { POST } as const;
export default googleSheetsEndpoints;

export type GoogleSheetsPostRequestOutput = typeof POST.types.RequestOutput;
export type GoogleSheetsPostResponseOutput = typeof POST.types.ResponseOutput;
