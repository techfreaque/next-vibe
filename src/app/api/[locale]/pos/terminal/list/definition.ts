/**
 * POS Terminal List API Route Definition
 * Lists terminals for a company
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
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
import { POS_TERMINALS_ALIAS } from "./constants";

const PosTerminalListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosTerminalListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["pos", "terminal", "list"],
  aliases: [POS_TERMINALS_ALIAS] as const,
  title: "terminalList.get.title",
  titleShort: "terminalList.get.titleShort" as const,
  description: "terminalList.get.description",
  category: "pos",
  subCategory: "POS: Terminals",
  tags: ["tags.pos", "tags.terminal", "tags.list"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],
  icon: "monitor",

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: PosTerminalListWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "terminalList.get.companyId.label",
        description: "terminalList.get.companyId.description",
        schema: z.uuid().optional(),
      }),

      terminals: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "terminalList.get.response.id",
              hidden: true,
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "terminalList.get.response.name",
              schema: z.string(),
            }),
            location: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "terminalList.get.response.location",
              schema: z.string().nullable(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "terminalList.get.response.currency",
              schema: z.string(),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "terminalList.get.response.isActive",
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "terminalList.get.response.createdAt",
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "terminalList.get.errors.validation.title",
      description: "terminalList.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "terminalList.get.errors.unauthorized.title",
      description: "terminalList.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "terminalList.get.errors.forbidden.title",
      description: "terminalList.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "terminalList.get.errors.conflict.title",
      description: "terminalList.get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "terminalList.get.errors.server.title",
      description: "terminalList.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "terminalList.get.errors.unknown.title",
      description: "terminalList.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "terminalList.get.errors.network.title",
      description: "terminalList.get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "terminalList.get.errors.notFound.title",
      description: "terminalList.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "terminalList.get.errors.unsavedChanges.title",
      description: "terminalList.get.errors.unsavedChanges.description",
    },
  },

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  successTypes: {
    title: "terminalList.get.success.title",
    description: "terminalList.get.success.description",
  },

  examples: {
    requests: {
      default: {
        companyId: undefined,
      },
    },
    responses: {
      default: {
        terminals: [
          {
            id: "aabbccdd-e89b-12d3-a456-426614174001",
            name: "Main Register",
            location: "Front desk",
            currency: "EUR",
            isActive: true,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    },
  },
});

export type PosTerminalListGetRequestOutput = typeof GET.types.RequestOutput;
export type PosTerminalListGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
