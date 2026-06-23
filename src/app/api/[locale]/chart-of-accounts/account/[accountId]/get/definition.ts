/**
 * Chart of Accounts — Account Get Endpoint Definition
 * GET — retrieve a single account node by ID
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestUrlPathParamsField,
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

import { scopedTranslation } from "../../../i18n";
import listDef0 from "../../list/definition";

const CoaAccountGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaAccountGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "account", "[accountId]", "get"],
  aliases: ["coa-account-get"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "accountGet.title",
  titleShort: "accountGet.titleShort",
  description: "accountGet.description",
  icon: "book",
  category: "accounting",
  subCategory: "Accounts",
  tags: ["tags.ledger" as const],

  fields: customWidgetObject({
    render: CoaAccountGetWidgetLazy,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      accountId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "accountGet.accountId.label",
        description: "accountGet.accountId.description",
        schema: z.string().uuid(),
        listEndpoint: listDef0.GET,
        labelField: "name",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.id",
            hidden: true,
            schema: z.string().uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.companyId",
            schema: z.string().uuid(),
          }),
          code: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.code",
            schema: z.string(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.name",
            schema: z.string(),
          }),
          type: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.type",
            schema: z.string(),
          }),
          subtype: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.subtype",
            schema: z.string(),
          }),
          parentId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.parentId",
            schema: z.string().uuid().nullable(),
          }),
          isPostable: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.isPostable",
            schema: z.boolean(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.isActive",
            schema: z.boolean(),
          }),
          isSystem: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.isSystem",
            schema: z.boolean(),
          }),
          description: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.description",
            schema: z.string().nullable(),
          }),
          sortOrder: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "accountGet.response.sortOrder",
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "errors.unauthorized.title",
      description: "errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "errors.validation.title",
      description: "errors.validation.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "errors.forbidden.title",
      description: "errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "errors.server.title",
      description: "errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "errors.unknown.title",
      description: "errors.unknown.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "errors.conflict.title",
      description: "errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "errors.network.title",
      description: "errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "errors.notFound.title",
      description: "errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "errors.unsavedChanges.title",
      description: "errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "accountGet.success.title",
    description: "accountGet.success.description",
  },

  examples: {
    urlPathParams: {
      default: { accountId: "00000000-0000-0000-0000-000000000001" },
    },
    responses: {
      default: {
        result: {
          id: "00000000-0000-0000-0000-000000000001",
          companyId: "00000000-0000-0000-0000-000000000001",
          code: "1000",
          name: "Cash",
          type: "ASSET",
          subtype: "CASH",
          parentId: null,
          isPostable: true,
          isActive: true,
          isSystem: false,
          description: null,
          sortOrder: 10,
        },
      },
    },
  },
});

export type CoaAccountGetRequestOutput = typeof GET.types.RequestOutput;
export type CoaAccountGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
