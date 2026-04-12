import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";

const ALLOWED_ROLES = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["lead-magnet", "providers", "google-sheets", "sheets-list"],
  title: "sheetsList.title" as const,
  description: "sheetsList.description" as const,
  icon: "list",
  category: "endpointCategories.leadMagnet",
  subCategory: "endpointCategories.leadMagnetIntegrations",
  tags: ["saveTag" as const],
  allowedRoles: ALLOWED_ROLES,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "sheetsList.title" as const,
    description: "sheetsList.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { response: true },
    children: {
      sheets: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "response.sheets" as const,
        schema: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        ),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title" as const,
      description: "errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title" as const,
      description: "errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title" as const,
      description: "errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title" as const,
      description: "errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title" as const,
      description: "errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title" as const,
      description: "errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title" as const,
      description: "errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.internal.title" as const,
      description: "errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title" as const,
      description: "errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "saveSuccess.title" as const,
    description: "saveSuccess.description" as const,
  },
  examples: {
    responses: {
      default: {
        sheets: [
          {
            id: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms",
            name: "Marketing Leads 2026",
          },
        ],
      },
    },
  },
});

const sheetsListEndpoints = { GET } as const;
export default sheetsListEndpoints;

export type SheetsListGetResponseOutput = typeof GET.types.ResponseOutput;
