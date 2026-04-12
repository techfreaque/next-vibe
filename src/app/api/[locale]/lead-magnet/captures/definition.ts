import { lazy } from "react";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const LeadMagnetCapturesWidget = lazy(() =>
  import("./widget").then((m) => ({ default: m.LeadMagnetCapturesWidget })),
);

const ALLOWED_ROLES = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

const captureItemSchema = z.object({
  id: z.uuid(),
  email: z.string(),
  firstName: z.string(),
  status: z.string(),
  errorMessage: z.string().nullable(),
  createdAt: z.string(),
});

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["lead-magnet", "captures"],
  title: "list.title" as const,
  description: "list.description" as const,
  icon: "users",
  category: "endpointCategories.leadMagnet",
  subCategory: "endpointCategories.leadMagnetCapture",
  tags: ["list.tag" as const],
  allowedRoles: ALLOWED_ROLES,

  fields: customWidgetObject({
    render: LeadMagnetCapturesWidget,
    usage: { response: true } as const,
    children: {
      items: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: z.array(captureItemSchema),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list.response.total" as const,
        schema: z.number(),
      }),
      page: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list.response.page" as const,
        schema: z.number(),
      }),
      pageSize: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "list.response.pageSize" as const,
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list.errors.validation.title" as const,
      description: "list.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list.errors.unauthorized.title" as const,
      description: "list.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list.errors.forbidden.title" as const,
      description: "list.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list.errors.notFound.title" as const,
      description: "list.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list.errors.conflict.title" as const,
      description: "list.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list.errors.network.title" as const,
      description: "list.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list.errors.unsavedChanges.title" as const,
      description: "list.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list.errors.internal.title" as const,
      description: "list.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list.errors.unknown.title" as const,
      description: "list.errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "list.success.title" as const,
    description: "list.success.description" as const,
  },
  examples: {
    responses: {
      default: {
        items: [
          {
            id: "550e8400-e29b-41d4-a716-446655440000",
            email: "alex@example.com",
            firstName: "Alex",
            status: "SUCCESS",
            errorMessage: null,
            createdAt: "2026-04-08T10:00:00.000Z",
          },
        ],
        total: 1,
        page: 1,
        pageSize: 50,
      },
    },
  },
});

const capturesEndpoints = { GET } as const;
export default capturesEndpoints;

export type CapturesListResponseOutput = typeof GET.types.ResponseOutput;
