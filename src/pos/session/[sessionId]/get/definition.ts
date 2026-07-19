/**
 * POS Session Get API Route Definition
 * Retrieves details for a specific session
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
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const PosSessionGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosSessionGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["pos", "session", "[sessionId]", "get"],
  title: "sessionGet.get.title",
  titleShort: "sessionGet.get.titleShort" as const,
  description: "sessionGet.get.description",
  category: "pos",
  subCategory: "POS: Sessions",
  tags: ["tags.pos", "tags.session", "tags.get"],
  allowedRoles: [UserRole.ADMIN],
  icon: "file-text",

  fields: customWidgetObject({
    render: PosSessionGetWidgetLazy,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      sessionId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "sessionGet.get.sessionId.label",
        description: "sessionGet.get.sessionId.description",
        schema: z.uuid(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionGet.get.response.id",
            hidden: true,
            schema: z.uuid(),
          }),
          terminalId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionGet.get.response.terminalId",
            schema: z.uuid(),
          }),
          cashierUserId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionGet.get.response.cashierUserId",
            schema: z.uuid(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionGet.get.response.status",
            schema: z.string(),
          }),
          openedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionGet.get.response.openedAt",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          closedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionGet.get.response.closedAt",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date().nullable(),
          }),
          openingFloat: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionGet.get.response.openingFloat",
            schema: z.number(),
          }),
          closingFloat: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionGet.get.response.closingFloat",
            schema: z.number().nullable(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "sessionGet.get.errors.validation.title",
      description: "sessionGet.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "sessionGet.get.errors.unauthorized.title",
      description: "sessionGet.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "sessionGet.get.errors.forbidden.title",
      description: "sessionGet.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "sessionGet.get.errors.conflict.title",
      description: "sessionGet.get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "sessionGet.get.errors.server.title",
      description: "sessionGet.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "sessionGet.get.errors.unknown.title",
      description: "sessionGet.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "sessionGet.get.errors.network.title",
      description: "sessionGet.get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "sessionGet.get.errors.notFound.title",
      description: "sessionGet.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "sessionGet.get.errors.unsavedChanges.title",
      description: "sessionGet.get.errors.unsavedChanges.description",
    },
  },

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  successTypes: {
    title: "sessionGet.get.success.title",
    description: "sessionGet.get.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        sessionId: "ccddee00-e89b-12d3-a456-426614174002",
      },
    },
    requests: undefined,
    responses: {
      default: {
        result: {
          id: "ccddee00-e89b-12d3-a456-426614174002",
          terminalId: "aabbccdd-e89b-12d3-a456-426614174001",
          cashierUserId: "11223344-e89b-12d3-a456-426614174000",
          status: "OPEN",
          openedAt: new Date("2024-01-01T08:00:00.000Z"),
          closedAt: null,
          openingFloat: 100.0,
          closingFloat: null,
        },
      },
    },
  },
});

export type PosSessionGetRequestOutput = typeof GET.types.RequestOutput;

const definitions = {
  GET,
} as const;
export default definitions;
