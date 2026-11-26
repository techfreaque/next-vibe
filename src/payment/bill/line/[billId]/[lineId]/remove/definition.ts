/**
 * Remove Bill Line Endpoint
 * Removes a line item from a draft bill and recalculates totals
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

const BillLineRemoveWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BillLineRemoveWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "bill", "line", "[billId]", "[lineId]", "remove"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "trash" as const,
  tags: ["tags.payment" as const, "tags.bill" as const, "tags.lines" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  options: {
    mutationOptions: {
      onSuccess: async (data) => {
        const { refreshBillDocuments } =
          await import("@/finance/document-cache");
        await refreshBillDocuments(data.logger, data.pathParams.billId);
      },
    },
  },

  fields: customWidgetObject({
    render: BillLineRemoveWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
      billId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "billId.label",
        description: "billId.description",
        schema: z.uuid(),
        hidden: true,
      }),
      lineId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "lineId.label" as const,
        description: "lineId.description" as const,
        schema: z.uuid(),
        hidden: true,
      }),

      // RESPONSE FIELDS
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.boolean(),
      }),

      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.message" as const,
        schema: z.string().nullable(),
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

  examples: {
    urlPathParams: {
      default: {
        billId: "123e4567-e89b-12d3-a456-426614174000",
        lineId: "789e0123-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        success: true,
        message: null,
      },
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

export type BillLineRemoveUrlPathParams = typeof POST.types.UrlVariablesOutput;
export type BillLineRemoveRequestInput = typeof POST.types.RequestInput;
export type BillLineRemoveRequestOutput = typeof POST.types.RequestOutput;
export type BillLineRemoveResponseInput = typeof POST.types.ResponseInput;
export type BillLineRemoveResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
