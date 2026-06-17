/**
 * POS Session Close API Route Definition
 * Closes an open cashier session
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import { scopedTranslation } from "../../i18n";

const PosSessionCloseWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosSessionCloseWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "session", "close"],
  title: "sessionClose.post.title",
  titleShort: "sessionClose.post.titleShort" as const,
  description: "sessionClose.post.description",
  category: "pos",
  subCategory: "POS: Sessions",
  tags: ["tags.pos", "tags.session", "tags.close"],
  allowedRoles: [UserRole.ADMIN],
  icon: "square",

  fields: customWidgetObject({
    render: PosSessionCloseWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      details: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          sessionId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "sessionClose.post.sessionId.label",
            description: "sessionClose.post.sessionId.description",
            schema: z.uuid(),
          }),
          closingFloat: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "sessionClose.post.closingFloat.label",
            description: "sessionClose.post.closingFloat.description",
            placeholder: "sessionClose.post.closingFloat.placeholder",
            schema: z.number().min(0),
          }),
        },
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "sessionClose.post.response.id",
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "sessionClose.post.response.status",
            schema: z.string(),
          }),
          closedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "sessionClose.post.response.closedAt",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date().nullable(),
          }),
          closingFloat: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "sessionClose.post.response.closingFloat",
            schema: z.number().nullable(),
          }),
          expectedFloat: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "sessionClose.post.response.expectedFloat",
            schema: z.number(),
          }),
          cashSalesTotal: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "sessionClose.post.response.cashSalesTotal",
            schema: z.number(),
          }),
          variance: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "sessionClose.post.response.variance",
            schema: z.number(),
          }),
          orderCount: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "sessionClose.post.response.orderCount",
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "sessionClose.post.errors.validation.title",
      description: "sessionClose.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "sessionClose.post.errors.unauthorized.title",
      description: "sessionClose.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "sessionClose.post.errors.forbidden.title",
      description: "sessionClose.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "sessionClose.post.errors.conflict.title",
      description: "sessionClose.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "sessionClose.post.errors.server.title",
      description: "sessionClose.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "sessionClose.post.errors.unknown.title",
      description: "sessionClose.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "sessionClose.post.errors.network.title",
      description: "sessionClose.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "sessionClose.post.errors.notFound.title",
      description: "sessionClose.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "sessionClose.post.errors.unsavedChanges.title",
      description: "sessionClose.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "sessionClose.post.success.title",
    description: "sessionClose.post.success.description",
  },

  examples: {
    requests: {
      default: {
        details: {
          sessionId: "ccddee00-e89b-12d3-a456-426614174002",
          closingFloat: 120.5,
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "ccddee00-e89b-12d3-a456-426614174002",
          status: "CLOSED",
          closedAt: new Date("2024-01-01T18:00:00.000Z"),
          closingFloat: 120.5,
          expectedFloat: 118.75,
          cashSalesTotal: 68.75,
          variance: 1.75,
          orderCount: 12,
        },
      },
    },
  },
});

export type PosSessionClosePostRequestOutput = typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
