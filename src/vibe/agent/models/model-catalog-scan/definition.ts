/**
 * Model Catalog Scan Endpoint Definition
 * GET  - latest stored scan + history (what a coding session reads to act on)
 * POST - run a scan now (the 5-day cron calls this); stores and mails the report
 * Prod only reports. Code changes always happen in a coding session.
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "./i18n";
import {
  type CatalogReport,
  catalogReportSchema,
  type CatalogScanSummary,
  catalogScanSummarySchema,
} from "./schema";

const ModelCatalogScanWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ModelCatalogScanWidget })),
);
const ModelCatalogScanRunWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ModelCatalogScanRunWidget })),
);

const errorTypes = {
  [EndpointErrorTypes.SERVER_ERROR]: {
    title: "errors.server.title",
    description: "errors.server.description",
  },
  [EndpointErrorTypes.NETWORK_ERROR]: {
    title: "errors.network.title",
    description: "errors.network.description",
  },
  [EndpointErrorTypes.UNKNOWN_ERROR]: {
    title: "errors.unknown.title",
    description: "errors.unknown.description",
  },
  [EndpointErrorTypes.VALIDATION_FAILED]: {
    title: "errors.validation.title",
    description: "errors.validation.description",
  },
  [EndpointErrorTypes.UNAUTHORIZED]: {
    title: "errors.unauthorized.title",
    description: "errors.unauthorized.description",
  },
  [EndpointErrorTypes.FORBIDDEN]: {
    title: "errors.forbidden.title",
    description: "errors.forbidden.description",
  },
  [EndpointErrorTypes.NOT_FOUND]: {
    title: "errors.notFound.title",
    description: "errors.notFound.description",
  },
  [EndpointErrorTypes.CONFLICT]: {
    title: "errors.conflict.title",
    description: "errors.conflict.description",
  },
  [EndpointErrorTypes.UNSAVED_CHANGES]: {
    title: "errors.unsavedChanges.title",
    description: "errors.unsavedChanges.description",
  },
} as const;

const exampleScan: CatalogScanSummary = {
  id: "7d3f9c2e-1b4a-4c8e-9f20-5a6b7c8d9e01",
  scannedAt: "2026-11-13T06:40:00.000Z",
  newModels: 1,
  priceChanges: 1,
  missingUpstream: 1,
  deprecations: 1,
  sourceErrors: 0,
  emailedTo: ["hi@unbottled.ai", "thea@unbottled.ai"],
  emailError: null,
};

const exampleReport: CatalogReport = {
  newSince: "2026-11-07T06:40:00.000Z",
  newModels: [
    {
      source: "openrouter",
      apiProvider: "openrouter",
      providerModel: "google/gemini-4-hydrogen",
      name: "Google: Gemini 4 Hydrogen",
      kind: "chat",
      createdAt: "2026-11-12T00:00:00.000Z",
      inputUsdPer1M: 1.5,
      outputUsdPer1M: 7.5,
      contextWindow: 1048576,
      uncensored: false,
    },
  ],
  priceChanges: [
    {
      modelId: "deepseek-v4.1-flash",
      apiProvider: "openrouter",
      providerModel: "deepseek/deepseek-v4.1-flash",
      field: "inputTokenCost",
      oldValue: 0.038,
      newValue: 0.3,
      changePercent: 689.47,
      suspect: true,
      source: "openrouter-api",
    },
  ],
  missingUpstream: [
    {
      modelId: "claude-opus-5-fast",
      apiProvider: "openrouter",
      providerModel: "anthropic/claude-opus-5-fast",
      legacy: true,
    },
  ],
  deprecations: [
    {
      modelId: "gpt-5-image-mini",
      apiProvider: "openrouter",
      providerModel: "openai/gpt-5-image-mini",
      expiresAt: "2026-12-01",
      legacy: false,
    },
  ],
  sources: [{ source: "openrouter", ok: true, modelCount: 674, error: null }],
};

const exampleReportText =
  "[unbottled] Model catalog scan 2026-11-13: 1 new, 1 price changes, 1 gone";

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["vibe", "agent", "models", "model-catalog-scan"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.models"],
  allowedRoles: [UserRole.ADMIN] as const,
  aliases: ["model-catalog-scan"],
  icon: "search",

  fields: customWidgetObject({
    render: ModelCatalogScanWidget,
    usage: { response: true } as const,
    children: {
      scan: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: catalogScanSummarySchema.nullable(),
      }),
      report: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: catalogReportSchema.nullable(),
      }),
      history: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.array(catalogScanSummarySchema),
      }),
      reportText: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.reportText",
        schema: z.string(),
      }),
    },
  }),

  errorTypes,

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    responses: {
      default: {
        scan: exampleScan,
        report: exampleReport,
        history: [exampleScan],
        reportText: exampleReportText,
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["vibe", "agent", "models", "model-catalog-scan"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "ai",
  subCategory: "Inference",
  tags: ["tags.models"],
  allowedRoles: [UserRole.ADMIN] as const,
  aliases: ["model-catalog-scan-run"],
  icon: "search",

  fields: customWidgetObject({
    render: ModelCatalogScanRunWidget,
    usage: { request: "data", response: true } as const,
    children: {
      force: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.force.label",
        description: "post.fields.force.description",
        columns: 6,
        schema: z.boolean().default(false),
      }),
      sendEmail: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.sendEmail.label",
        description: "post.fields.sendEmail.description",
        columns: 6,
        schema: z.boolean().default(true),
      }),

      skipped: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.skipped",
        schema: z.boolean(),
      }),
      scan: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: catalogScanSummarySchema.nullable(),
      }),
      report: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: catalogReportSchema.nullable(),
      }),
      reportText: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "response.reportText",
        schema: z.string(),
      }),
    },
  }),

  errorTypes,

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: { force: false, sendEmail: true },
    },
    responses: {
      default: {
        skipped: false,
        scan: exampleScan,
        report: exampleReport,
        reportText: exampleReportText,
      },
    },
  },
});

export type ModelCatalogScanGetResponseOutput = typeof GET.types.ResponseOutput;
export type ModelCatalogScanPostRequestOutput = typeof POST.types.RequestOutput;
export type ModelCatalogScanPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { GET, POST } as const;
export default definitions;
