import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestUrlPathParamsResponseField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const OrganizationsVpnSyncAsyncJobContainer = lazyWidget(() =>
  import("./widget").then((m) => ({
    default: m.OrganizationsVpnSyncAsyncJobContainer,
  })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "vpn-sync-async", "[jobId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "search",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.organizations" as const],
  aliases: ["corvina_organizations_vpn_sync_async_job"],

  fields: customWidgetObject({
    render: OrganizationsVpnSyncAsyncJobContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      jobId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.jobId.label" as const,
        description: "get.jobId.description" as const,
        schema: z.string().min(1),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.id" as const,
        schema: z.string().nullable(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable(),
      }),
      rootOrgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.rootOrgResourceId" as const,
        schema: z.string().nullable(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.status" as const,
        schema: z.string().nullable(),
      }),
      error: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.error" as const,
        schema: z.string().nullable(),
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
    urlPathParams: { default: { jobId: "job-abc-123" } },
    responses: {
      default: {
        jobId: "job-abc-123",
        id: "job-abc-123",
        orgResourceId: "exorde.connex.connectika",
        rootOrgResourceId: null,
        status: "COMPLETED",
        error: null,
      },
    },
  },
});

export type OrganizationsVpnSyncAsyncJobUrlParamsOutput =
  typeof GET.types.UrlVariablesOutput;
export type OrganizationsVpnSyncAsyncJobResponseOutput =
  typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
