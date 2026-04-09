/**
 * Lead Magnet Config API Definition
 * GET: fetch current config
 * DELETE: remove config
 * POST (save) is handled per-provider under providers/<name>/
 */

import { lazy } from "react";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
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

import { LeadMagnetProviderDB } from "../enum";
import { scopedTranslation } from "./i18n";

const LeadMagnetConfigContainer = lazy(() =>
  import("./widget").then((m) => ({ default: m.LeadMagnetConfigContainer })),
);

const ALLOWED_ROLES = [
  UserRole.CUSTOMER,
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

const configSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  provider: z.enum(LeadMagnetProviderDB),
  listId: z.string().nullable(),
  headline: z.string().nullable(),
  buttonText: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["lead-magnet", "config"],
  title: "get.title" as const,
  description: "get.description" as const,
  icon: "settings",
  category: "endpointCategories.leads",
  tags: ["get.tag" as const],
  allowedRoles: ALLOWED_ROLES,

  fields: customWidgetObject({
    render: LeadMagnetConfigContainer,
    usage: { response: true } as const,
    children: {
      exists: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "get.response.exists" as const,
        schema: z.boolean(),
      }),
      config: responseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.OBJECT,
        schema: configSchema.nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.internal.title" as const,
      description: "get.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },
  examples: {
    responses: {
      default: {
        exists: true,
        config: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          userId: "550e8400-e29b-41d4-a716-446655440001",
          provider: "KLAVIYO",
          listId: "abc123",
          headline: "Get my AI prompt pack free",
          buttonText: "Get access →",
          isActive: true,
          createdAt: "2024-01-15T10:00:00.000Z",
          updatedAt: "2024-01-15T10:00:00.000Z",
        },
      },
    },
  },
});

export const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["lead-magnet", "config"],
  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "endpointCategories.leads",
  tags: ["delete.tag" as const],
  allowedRoles: ALLOWED_ROLES,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.title" as const,
    description: "delete.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { response: true },
    children: {
      deleted: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "delete.response.deleted" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.internal.title" as const,
      description: "delete.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },
  examples: {
    responses: {
      default: { deleted: true },
    },
  },
});

const leadMagnetConfigEndpoints = { GET, DELETE } as const;
export default leadMagnetConfigEndpoints;

export type LeadMagnetConfigGetResponseOutput = typeof GET.types.ResponseOutput;
