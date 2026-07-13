/**
 * AP Bill Approve Endpoint Definition
 * POST — advance bill status DRAFT→RECEIVED→APPROVED and post journal entry on APPROVED
 */

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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { BillStatus, BillStatusDB, BillStatusOptions } from "../../../enum";
import { scopedTranslation } from "./i18n";

const BillApproveWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.BillApproveWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "bill", "[billId]", "approve"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "check-circle" as const,
  tags: ["tags.payment" as const, "tags.bill" as const, "tags.ap" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: BillApproveWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      // URL PATH PARAMS
      billId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "post.billId.label" as const,
        description: "post.billId.description" as const,
        hidden: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("../../list/definition")).default.GET,
        labelField: "billNumber",
      }),

      // RESPONSE FIELDS
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        enumOptions: BillStatusOptions,
        schema: z.enum(BillStatusDB),
      }),

      journalEntryId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.journalEntryId" as const,
        schema: z.uuid().nullable(),
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
    responses: {
      default: {
        status: BillStatus.APPROVED,
        journalEntryId: "789e0123-e89b-12d3-a456-426614174000",
      },
    },
  },
});

export type BillApproveUrlPathParams = typeof POST.types.UrlVariablesOutput;
export type BillApproveResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
