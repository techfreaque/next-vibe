import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  responseArrayField,
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

import { scopedTranslation } from "./i18n";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "building-2",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "get.container.title" as const,
    description: "get.container.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { response: true },
    children: {
      organizations: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.organizations.id" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.organizations.name" as const,
              schema: z.string(),
            }),
            displayName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.organizations.displayName" as const,
              schema: z.string().nullable(),
            }),
            enabled: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.enabled" as const,
              schema: z.boolean().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              fieldType: FieldDataType.DATETIME,
              content: "get.response.organizations.createdAt" as const,
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
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
        organizations: [
          {
            id: "org_abc123",
            name: "acme",
            displayName: "Acme Corp",
            enabled: true,
            createdAt: "2025-01-15T09:30:00.000Z",
          },
        ],
        total: 1,
      },
    },
  },
});

export type CorvinaOrganizationsListResponseInput =
  typeof GET.types.ResponseInput;
export type CorvinaOrganizationsListResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
