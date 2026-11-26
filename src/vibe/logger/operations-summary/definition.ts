import { createEndpoint } from "next-vibe/core/definition/create-i18n";
import {
  EndpointErrorTypes,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import { customWidgetObject } from "next-vibe/unified-ui/_shared/utils";
import { responseField } from "next-vibe/unified-ui/_shared/utils-i18n";

import { scopedTranslation } from "./i18n";
import { operationSummarySchema } from "./summary";

const render = lazyWidget(() =>
  import("./widget").then(({ OperationsSummaryWidget }) => ({
    default: OperationsSummaryWidget,
  })),
);
const unavailable = {
  title: "unavailable",
  description: "unavailable",
} as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "logger", "operations-summary"],
  aliases: ["operations-summary"],
  title: "title",
  titleShort: "title",
  description: "description",
  allowedRoles: [UserRole.ADMIN],
  category: "serviceHealth",
  icon: "activity",
  tags: ["title"],
  fields: customWidgetObject({
    render,
    usage: { response: true },
    children: {
      summary: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "title",
        schema: operationSummarySchema,
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: unavailable,
    [EndpointErrorTypes.VALIDATION_FAILED]: unavailable,
    [EndpointErrorTypes.SERVER_ERROR]: unavailable,
    [EndpointErrorTypes.UNKNOWN_ERROR]: unavailable,
    [EndpointErrorTypes.NETWORK_ERROR]: unavailable,
    [EndpointErrorTypes.FORBIDDEN]: unavailable,
    [EndpointErrorTypes.NOT_FOUND]: unavailable,
    [EndpointErrorTypes.UNSAVED_CHANGES]: unavailable,
    [EndpointErrorTypes.CONFLICT]: unavailable,
  },
  successTypes: { title: "title", description: "description" },
  examples: {
    responses: {
      default: {
        summary: {
          from: "2026-11-25",
          to: "2026-11-25",
          kpis: [],
          attentionAvailable: true,
          attention: [],
          recent: [],
        },
      },
    },
  },
});

export default { GET };
