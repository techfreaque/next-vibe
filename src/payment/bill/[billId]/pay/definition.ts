/**
 * AP Bill Pay Endpoint Definition
 * POST — mark an approved bill as PAID and post the payment journal entry
 */

import { dateSchema } from "next-vibe/core/definition/common.schema";
import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { BillStatus, BillStatusDB, BillStatusOptions } from "../../../enum";
import { scopedTranslation } from "./i18n";

const BillPayWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BillPayWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "bill", "[billId]", "pay"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "credit-card" as const,
  tags: ["tags.payment" as const, "tags.bill" as const, "tags.ap" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: BillPayWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
      billId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/payment/bill/list/definition"))
            .default.GET,
        labelField: "billNumber",
        label: "post.billId.label" as const,
        description: "post.billId.description" as const,
        hidden: true,
        schema: z.uuid(),
      }),

      // REQUEST FIELDS
      accountNodeId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "accountNodeId.label" as const,
        description: "accountNodeId.description" as const,
        columns: 6,
        schema: z.string().uuid().optional(),
        listEndpoint: async () =>
          (
            await import("@/app/api/[locale]/chart-of-accounts/account/list/definition")
          ).default.GET,
        labelField: "name",
      }),

      paidAt: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.DATETIME,
        label: "paidAt.label" as const,
        description: "paidAt.description" as const,
        placeholder: "paidAt.placeholder" as const,
        columns: 6,
        schema: dateSchema.optional(),
      }),

      // RESPONSE FIELDS
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        enumOptions: BillStatusOptions,
        schema: z.enum(BillStatusDB),
      }),

      paidAtResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.paidAt" as const,
        schema: z.coerce.date().nullable(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { billId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        paidAt: "2024-01-31T10:00:00Z",
      },
    },
    responses: {
      default: {
        status: BillStatus.PAID,
        paidAtResponse: new Date("2024-01-31T10:00:00Z"),
      },
    },
  },
});

export type BillPayUrlPathParams = typeof POST.types.UrlVariablesOutput;
export type BillPayRequestOutput = typeof POST.types.RequestOutput;
export type BillPayResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
