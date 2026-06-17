/**
 * POS Terminal Create API Route Definition
 * Defines endpoint for creating a new POS terminal
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

import { scopedTranslation } from "../../i18n";

const PosTerminalCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosTerminalCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["pos", "terminal", "create"],
  title: "terminalCreate.post.title",
  titleShort: "terminalCreate.post.titleShort" as const,
  description: "terminalCreate.post.description",
  category: "pos",
  subCategory: "POS: Terminals",
  tags: ["tags.pos", "tags.terminal", "tags.create"],
  allowedRoles: [UserRole.ADMIN] as const,
  icon: "monitor",

  fields: customWidgetObject({
    render: PosTerminalCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      details: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          companyId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "terminalCreate.post.companyId.label",
            description: "terminalCreate.post.companyId.description",
            schema: z.uuid(),
          }),
          name: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "terminalCreate.post.name.label",
            description: "terminalCreate.post.name.description",
            placeholder: "terminalCreate.post.name.placeholder",
            schema: z.string().min(1).max(255),
          }),
          location: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "terminalCreate.post.location.label",
            description: "terminalCreate.post.location.description",
            placeholder: "terminalCreate.post.location.placeholder",
            schema: z.string().max(255).optional(),
          }),
          currency: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "terminalCreate.post.currency.label",
            description: "terminalCreate.post.currency.description",
            placeholder: "terminalCreate.post.currency.placeholder",
            schema: z.string().length(3).optional(),
          }),
          cashAccountNodeId: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "terminalCreate.post.cashAccountNodeId.label",
            description: "terminalCreate.post.cashAccountNodeId.description",
            schema: z.uuid().optional(),
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
            content: "terminalCreate.post.response.id",
            schema: z.uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "terminalCreate.post.response.name",
            schema: z.string(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "terminalCreate.post.response.companyId",
            schema: z.uuid(),
          }),
          currency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "terminalCreate.post.response.currency",
            schema: z.string(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "terminalCreate.post.response.isActive",
            schema: z.boolean(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "terminalCreate.post.errors.validation.title",
      description: "terminalCreate.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "terminalCreate.post.errors.unauthorized.title",
      description: "terminalCreate.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "terminalCreate.post.errors.forbidden.title",
      description: "terminalCreate.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "terminalCreate.post.errors.conflict.title",
      description: "terminalCreate.post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "terminalCreate.post.errors.server.title",
      description: "terminalCreate.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "terminalCreate.post.errors.unknown.title",
      description: "terminalCreate.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "terminalCreate.post.errors.network.title",
      description: "terminalCreate.post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "terminalCreate.post.errors.notFound.title",
      description: "terminalCreate.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "terminalCreate.post.errors.unsavedChanges.title",
      description: "terminalCreate.post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "terminalCreate.post.success.title",
    description: "terminalCreate.post.success.description",
  },

  examples: {
    requests: {
      default: {
        details: {
          companyId: "123e4567-e89b-12d3-a456-426614174000",
          name: "Main Register",
          location: "Front desk",
          currency: "EUR",
          cashAccountNodeId: undefined,
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "aabbccdd-e89b-12d3-a456-426614174001",
          name: "Main Register",
          companyId: "123e4567-e89b-12d3-a456-426614174000",
          currency: "EUR",
          isActive: true,
        },
      },
    },
  },
});

export type PosTerminalCreatePostRequestOutput =
  typeof POST.types.RequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
