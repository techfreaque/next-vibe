import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestUrlPathParamsField,
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

const OrgDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrgDeleteContainer })),
);

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "organizations", "[orgId]", "delete"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: OrgDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.orgId.label" as const,
        description: "delete.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.id" as const,
        schema: z.number(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.name" as const,
        schema: z.string(),
      }),
      label: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.label" as const,
        schema: z.string(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.status" as const,
        schema: z.string(),
      }),
      resourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.resourceId" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
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
    urlPathParams: { default: { orgId: 45511 } },
    responses: {
      default: {
        id: 45511,
        name: "connectika",
        label: "Connectika",
        status: "DELETED",
        resourceId: "exorde.connex.connectika",
      },
    },
  },
});

export type CorvinaOrgDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type CorvinaOrgDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { DELETE } as const;
export default definitions;
