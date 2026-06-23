/**
 * Chart of Accounts — Period Get Endpoint Definition
 * GET — retrieve a single accounting period by ID
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

const CoaPeriodGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaPeriodGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "period", "[periodId]", "get"],
  aliases: ["coa-period-get"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "periodGet.title",
  titleShort: "periodGet.titleShort",
  description: "periodGet.description",
  icon: "calendar",
  category: "accounting",
  subCategory: "Periods",
  tags: ["tags.ledger" as const],

  fields: customWidgetObject({
    render: CoaPeriodGetWidgetLazy,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      periodId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "periodGet.periodId.label",
        description: "periodGet.periodId.description",
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
            label: "periodGet.response.id",
            hidden: true,
            schema: z.string().uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "periodGet.response.companyId",
            schema: z.string().uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "periodGet.response.name",
            schema: z.string(),
          }),
          startDate: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "periodGet.response.startDate",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          endDate: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "periodGet.response.endDate",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "periodGet.response.status",
            schema: z.string(),
          }),
          closedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "periodGet.response.closedAt",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date().nullable(),
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
    title: "periodGet.success.title",
    description: "periodGet.success.description",
  },

  examples: {
    urlPathParams: {
      default: { periodId: "00000000-0000-0000-0000-000000000002" },
    },
    requests: undefined,
    responses: {
      default: {
        result: {
          id: "00000000-0000-0000-0000-000000000002",
          companyId: "00000000-0000-0000-0000-000000000001",
          name: "January 2024",
          startDate: new Date("2024-01-01"),
          endDate: new Date("2024-01-31"),
          status: "OPEN",
          closedAt: null,
        },
      },
    },
  },
});

export type CoaPeriodGetRequestOutput = typeof GET.types.RequestOutput;
export type CoaPeriodGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
