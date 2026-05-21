import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { CorvinaOrgStatus } from "../enums";
import { scopedTranslation } from "./i18n";

const OrgListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.OrgListContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "building",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],
  aliases: ["corvina_list"],
  fields: customWidgetObject({
    render: OrgListContainer,
    usage: { response: true } as const,
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
              schema: z.number(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.organizations.name" as const,
              schema: z.string(),
            }),
            label: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.organizations.label" as const,
              schema: z.string(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.status" as const,
              schema: z.enum(CorvinaOrgStatus),
            }),
            resourceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.organizations.resourceId" as const,
              schema: z.string(),
            }),
            dataEnabled: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.dataEnabled" as const,
              schema: z.boolean(),
            }),
            vpnEnabled: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.vpnEnabled" as const,
              schema: z.boolean(),
            }),
            privateAccess: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.privateAccess" as const,
              schema: z.boolean(),
            }),
            allowDisablePrivateAccess: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content:
                "get.response.organizations.allowDisablePrivateAccess" as const,
              schema: z.boolean(),
            }),
            hostname: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.organizations.hostname" as const,
              schema: z.string().nullable(),
            }),
            hostnameAllowed: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.hostnameAllowed" as const,
              schema: z.boolean(),
            }),
            vpnPairingMode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.organizations.vpnPairingMode" as const,
              schema: z.string().nullable(),
            }),
            vpnOtpRequired: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.vpnOtpRequired" as const,
              schema: z.boolean(),
            }),
            ipAddressesWhitelist: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "get.response.organizations.ipAddressesWhitelist" as const,
              schema: z.array(z.string()),
            }),
            userCanAccess: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.userCanAccess" as const,
              schema: z.boolean(),
            }),
            storeEnabled: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.storeEnabled" as const,
              schema: z.boolean(),
            }),
            dataTemporarilyDisabled: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content:
                "get.response.organizations.dataTemporarilyDisabled" as const,
              schema: z.boolean(),
            }),
            mfaRequired: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.organizations.mfaRequired" as const,
              schema: z.boolean(),
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
    responses: {
      default: {
        organizations: [
          {
            id: 45511,
            name: "connectika",
            label: "Connectika",
            status: CorvinaOrgStatus.DONE,
            resourceId: "exorde.connex.connectika",
            dataEnabled: true,
            vpnEnabled: true,
            privateAccess: false,
            allowDisablePrivateAccess: false,
            hostname: null,
            hostnameAllowed: false,
            vpnPairingMode: null,
            vpnOtpRequired: false,
            ipAddressesWhitelist: [],
            userCanAccess: true,
            storeEnabled: false,
            dataTemporarilyDisabled: false,
            mfaRequired: false,
          },
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
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
