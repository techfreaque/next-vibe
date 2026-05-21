import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CorvinaAppInstallStatus } from "../enums";
import { scopedTranslation } from "./i18n";

const InstalledAppsContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.InstalledAppsContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "apps", "installed"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "package-check",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.apps" as const],
  aliases: ["corvina_installed_apps", "list_installed_corvina_apps"],

  fields: customWidgetObject({
    render: InstalledAppsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      organizationId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.organizationId.label" as const,
        description: "get.organizationId.description" as const,
        columns: 12,
        schema: z.coerce.number().int().positive(),
      }),
      installs: responseArrayField(scopedTranslation, {
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
              content: "get.response.installs.id" as const,
              schema: z.number(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.installs.status" as const,
              schema: z.enum(CorvinaAppInstallStatus),
            }),
            appKey: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.installs.appKey" as const,
              schema: z.string().nullable(),
            }),
            appName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.installs.appName" as const,
              schema: z.string().nullable(),
            }),
            manifestFrom: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.installs.manifestFrom" as const,
              schema: z.string().nullable(),
            }),
            planId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.installs.planId" as const,
              schema: z.string().nullable(),
            }),
            autoRenewActive: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.installs.autoRenewActive" as const,
              schema: z.boolean(),
            }),
            freeTrial: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.installs.freeTrial" as const,
              schema: z.boolean(),
            }),
            serviceAccountUsername: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.installs.serviceAccountUsername" as const,
              schema: z.string().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.installs.createdAt" as const,
              schema: z.string().nullable(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.installs.updatedAt" as const,
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
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages" as const,
        schema: z.coerce.number(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currentPage" as const,
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
    requests: {
      default: { organizationId: 45511 },
    },
    responses: {
      default: {
        installs: [
          {
            id: 1,
            status: CorvinaAppInstallStatus.INSTALLED,
            appKey: "unbottled-ai",
            appName: "Unbottled AI",
            manifestFrom: "CUSTOM",
            planId: null,
            autoRenewActive: false,
            freeTrial: false,
            serviceAccountUsername: "svc-unbottled-ai",
            createdAt: "2026-05-12T08:00:00Z",
            updatedAt: "2026-05-12T08:01:00Z",
          },
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
});

export type CorvinaAppsInstalledRequestOutput = typeof GET.types.RequestOutput;
export type CorvinaAppsInstalledResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
