/**
 * POS Session Open API Route Definition
 * Opens a new cashier session on a terminal
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";
import { POS_SESSION_OPEN_ALIAS } from "./constants";

const PosSessionOpenWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosSessionOpenWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "session", "open"],
  aliases: [POS_SESSION_OPEN_ALIAS] as const,
  title: "sessionOpen.post.title",
  titleShort: "sessionOpen.post.titleShort" as const,
  description: "sessionOpen.post.description",
  category: "pos",
  subCategory: "POS: Sessions",
  tags: ["tags.pos", "tags.session", "tags.open"],
  allowedRoles: [UserRole.ADMIN],
  icon: "play",

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: PosSessionOpenWidget,
    children: {
      details: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          terminalId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "sessionOpen.post.terminalId.label",
            description: "sessionOpen.post.terminalId.description",
            schema: z.uuid(),
          }),
          openingFloat: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.NUMBER,
            label: "sessionOpen.post.openingFloat.label",
            description: "sessionOpen.post.openingFloat.description",
            placeholder: "sessionOpen.post.openingFloat.placeholder",
            schema: z.number().min(0).optional(),
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
            label: "sessionOpen.post.response.id",
            schema: z.uuid(),
          }),
          terminalId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionOpen.post.response.terminalId",
            schema: z.uuid(),
          }),
          openedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionOpen.post.response.openedAt",
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          status: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionOpen.post.response.status",
            schema: z.string(),
          }),
          openingFloat: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "sessionOpen.post.response.openingFloat",
            schema: z.number(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "sessionOpen.post.errors.validation.title",
      description: "sessionOpen.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "sessionOpen.post.errors.unauthorized.title",
      description: "sessionOpen.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "sessionOpen.post.errors.forbidden.title",
      description: "sessionOpen.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "sessionOpen.post.errors.conflict.title",
      description: "sessionOpen.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "sessionOpen.post.errors.server.title",
      description: "sessionOpen.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "sessionOpen.post.errors.unknown.title",
      description: "sessionOpen.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "sessionOpen.post.errors.network.title",
      description: "sessionOpen.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "sessionOpen.post.errors.notFound.title",
      description: "sessionOpen.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "sessionOpen.post.errors.unsavedChanges.title",
      description: "sessionOpen.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "sessionOpen.post.success.title",
    description: "sessionOpen.post.success.description",
  },

  examples: {
    requests: {
      default: {
        details: {
          terminalId: "aabbccdd-e89b-12d3-a456-426614174001",
          openingFloat: 100.0,
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "ccddee00-e89b-12d3-a456-426614174002",
          terminalId: "aabbccdd-e89b-12d3-a456-426614174001",
          openedAt: new Date("2024-01-01T08:00:00.000Z"),
          status: "OPEN",
          openingFloat: 100.0,
        },
      },
    },
  },
});

export type PosSessionOpenPostRequestOutput = typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
