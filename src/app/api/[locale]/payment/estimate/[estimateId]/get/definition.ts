/**
 * Get Estimate Endpoint
 * GET — retrieve a single estimate with all its line items
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestUrlPathParamsField,
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

import estimateListDefinitions from "../../list/definition";
import { scopedTranslation } from "./i18n";

const EstimateGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.EstimateGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["payment", "estimate", "[estimateId]", "get"],
  aliases: ["payment-estimate-get"],
  title: "post.title" as const,
  titleShort: "post.titleShort" as const,
  description: "post.description" as const,
  category: "payments",
  subCategory: "Transactions",
  icon: "file-text" as const,
  tags: ["tags.payment" as const, "tags.estimate" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: EstimateGetWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      estimateId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "estimateId.label" as const,
        description: "estimateId.description" as const,
        schema: z.uuid(),
        hidden: true,
        listEndpoint: estimateListDefinitions.GET,
        labelField: "estimateNumber",
      }),

      // RESPONSE FIELDS
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string(),
      }),
      companyId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.message" as const,
        schema: z.string(),
      }),
      estimateNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string(),
      }),
      customerId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string().nullable(),
      }),
      customerEmail: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string().nullable(),
      }),
      customerName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string().nullable(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string(),
      }),
      validUntil: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string().nullable(),
      }),
      title: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string().nullable(),
      }),
      notes: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string().nullable(),
      }),
      terms: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string().nullable(),
      }),
      subtotal: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.number(),
      }),
      taxAmount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.number(),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.number(),
      }),
      invoiceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string().nullable(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "post.response.success" as const,
        schema: z.string(),
      }),

      lines: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.success" as const,
              schema: z.string(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.success" as const,
              schema: z.string(),
            }),
            productId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.success" as const,
              schema: z.string().nullable(),
            }),
            quantity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.success" as const,
              schema: z.number(),
            }),
            unitPrice: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.success" as const,
              schema: z.number(),
            }),
            taxRate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.success" as const,
              schema: z.number(),
            }),
            taxAmount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.success" as const,
              schema: z.number(),
            }),
            lineTotal: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.success" as const,
              schema: z.number(),
            }),
            sortOrder: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "post.response.success" as const,
              schema: z.number().nullable(),
            }),
          },
        }),
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

  examples: {
    urlPathParams: {
      default: { estimateId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    responses: {
      default: {
        id: "456e7890-e89b-12d3-a456-426614174000",
        companyId: "00000000-0000-0000-0000-000000000001",
        estimateNumber: "EST-2024-0001",
        status: "DRAFT",
        customerId: null,
        customerEmail: null,
        customerName: null,
        currency: "EUR",
        validUntil: null,
        title: null,
        notes: null,
        terms: null,
        subtotal: 0,
        taxAmount: 0,
        total: 0,
        invoiceId: null,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        lines: [],
      },
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },
});

export type EstimateGetUrlPathParams = typeof GET.types.UrlVariablesOutput;
export type EstimateGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
