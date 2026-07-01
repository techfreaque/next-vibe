/**
 * Chart of Accounts — Period List Endpoint Definition
 * GET — list accounting periods for a company
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { PeriodStatusOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

const CoaPeriodListWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CoaPeriodListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["chart-of-accounts", "period", "list"],
  aliases: ["coa-period-list"],
  allowedRoles: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN, UserRole.PARTNER_ADMIN] as const,

  title: "get.title" as const,
  titleShort: "get.titleShort" as const,
  description: "get.description" as const,
  icon: "calendar",
  category: "accounting",
  subCategory: "Periods",
  tags: ["tag" as const],

  fields: customWidgetObject({
    render: CoaPeriodListWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.companyId.label" as const,
        description: "get.companyId.description" as const,
        placeholder: "get.companyId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid().optional(),
      }),
      periods: responseArrayField(scopedTranslation, {
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
              label: "get.response.id" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "get.response.name" as const,
              schema: z.string(),
            }),
            startDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              fieldType: FieldDataType.DATETIME,
              label: "get.response.startDate" as const,
              schema: z.coerce.date(),
            }),
            endDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              fieldType: FieldDataType.DATETIME,
              label: "get.response.endDate" as const,
              schema: z.coerce.date(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "get.response.status" as const,
              options: PeriodStatusOptions,
              schema: z.string(),
            }),
            closedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              fieldType: FieldDataType.DATETIME,
              label: "get.response.closedAt" as const,
              schema: z.coerce.date().nullable(),
            }),
          },
        }),
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
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: {
      default: {},
    },
    responses: { default: { periods: [] } },
  },
});

export type CoaPeriodListRequestInput = typeof GET.types.RequestInput;
export type CoaPeriodListRequestOutput = typeof GET.types.RequestOutput;
export type CoaPeriodListResponseInput = typeof GET.types.ResponseInput;
export type CoaPeriodListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
