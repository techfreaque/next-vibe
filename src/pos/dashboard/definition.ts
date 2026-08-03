/**
 * POS Dashboard API Route Definition
 * Returns KPI overview: terminals, active sessions, today's sales
 */

import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import {
  objectField,
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../i18n";

const PosDashboardWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.PosDashboardWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["pos", "dashboard"],
  aliases: ["pos-dashboard"],
  title: "dashboard.get.title",
  titleShort: "dashboard.get.titleShort" as const,
  description: "dashboard.get.description",
  category: "pos",
  subCategory: "POS: Terminals",
  tags: ["tags.pos", "tags.terminal", "tags.session", "tags.order"],
  allowedRoles: [UserRole.ADMIN],
  defaultWebPinned: [UserRole.ADMIN],
  icon: "shopping-cart",

  fields: customWidgetObject({
    render: PosDashboardWidget,
    usage: { request: "data", response: true },
    children: {
      terminalsTotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.terminalsTotal",
        schema: z.number(),
      }),
      terminalsActive: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.terminalsActive",
        schema: z.number(),
      }),
      openSessionsCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.openSessionsCount",
        schema: z.number(),
      }),
      todayOrderCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.todayOrderCount",
        schema: z.number(),
      }),
      todaySalesTotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.todaySalesTotal",
        schema: z.number(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "dashboard.get.response.currency",
        schema: z.string(),
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
              label: "dashboard.get.response.terminalId",
              hidden: true,
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "dashboard.get.response.terminalName",
              schema: z.string(),
            }),
            location: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "dashboard.get.response.terminalLocation",
              schema: z.string().nullable(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "dashboard.get.response.terminalCurrency",
              schema: z.string(),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "dashboard.get.response.terminalIsActive",
              schema: z.boolean(),
            }),
            hasOpenSession: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "dashboard.get.response.terminalHasOpenSession",
              schema: z.boolean(),
            }),
            openSessionId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "dashboard.get.response.terminalOpenSessionId",
              schema: z.uuid().nullable(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "dashboard.get.errors.validation.title",
      description: "dashboard.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "dashboard.get.errors.unauthorized.title",
      description: "dashboard.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "dashboard.get.errors.forbidden.title",
      description: "dashboard.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "dashboard.get.errors.conflict.title",
      description: "dashboard.get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "dashboard.get.errors.server.title",
      description: "dashboard.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "dashboard.get.errors.unknown.title",
      description: "dashboard.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "dashboard.get.errors.network.title",
      description: "dashboard.get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "dashboard.get.errors.notFound.title",
      description: "dashboard.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "dashboard.get.errors.unsavedChanges.title",
      description: "dashboard.get.errors.unsavedChanges.description",
    },
  },

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 0,
    },
  },

  successTypes: {
    title: "dashboard.get.success.title",
    description: "dashboard.get.success.description",
  },

  examples: {
    responses: {
      default: {
        terminalsTotal: 3,
        terminalsActive: 2,
        openSessionsCount: 1,
        todayOrderCount: 14,
        todaySalesTotal: 487.5,
        currency: "EUR",
        terminals: [
          {
            id: "aabbccdd-e89b-12d3-a456-426614174001",
            name: "Main Register",
            location: "Front desk",
            currency: "EUR",
            isActive: true,
            hasOpenSession: true,
            openSessionId: "bbccddee-e89b-12d3-a456-426614174002",
          },
        ],
      },
    },
  },
});

export type PosDashboardGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
