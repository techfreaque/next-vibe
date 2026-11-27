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
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const RecurringToggleWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.RecurringToggleWidget })),
);

const errorTypes = {
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title" as const,
    description: "errors.validation.description" as const,
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title" as const,
    description: "errors.network.description" as const,
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title" as const,
    description: "errors.unauthorized.description" as const,
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title" as const,
    description: "errors.forbidden.description" as const,
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title" as const,
    description: "errors.notFound.description" as const,
  },
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title" as const,
    description: "errors.server.description" as const,
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title" as const,
    description: "errors.unknown.description" as const,
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title" as const,
    description: "errors.unsavedChanges.description" as const,
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title" as const,
    description: "errors.conflict.description" as const,
  },
} as const;

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["payment", "invoice", "recurring", "[scheduleId]", "toggle"],
  aliases: ["recurring-invoice-toggle"],
  title: "recurring.toggleTitle" as const,
  titleShort: "recurring.toggleTitle" as const,
  description: "recurring.toggleDescription" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "refresh-cw" as const,
  tags: ["tags.payment" as const, "tags.recurring" as const],
  allowedRoles: [UserRole.ADMIN] as const,
  fields: customWidgetObject({
    render: RecurringToggleWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      scheduleId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.scheduleId" as const,
        hidden: true,
        schema: z.uuid(),
      }),
      isEnabled: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "fields.isEnabled" as const,
        schema: z.boolean(),
      }),
      endDate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "fields.endDate" as const,
        schema: z.iso.date().nullable().optional(),
      }),
      updated: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "recurring.toggleSuccess" as const,
        schema: z.boolean(),
      }),
    },
  }),
  errorTypes,
  examples: {
    urlPathParams: {
      default: { scheduleId: "00000000-0000-4000-8000-000000000010" },
    },
    requests: { default: { isEnabled: true } },
    responses: { default: { updated: true } },
  },
  successTypes: {
    title: "recurring.toggleSuccess" as const,
    description: "recurring.toggleDescription" as const,
  },
});

export type RecurringTogglePath = typeof POST.types.UrlVariablesOutput;
export type RecurringToggleRequest = typeof POST.types.RequestOutput;
export type RecurringToggleResponse = typeof POST.types.ResponseOutput;

export default { POST };
