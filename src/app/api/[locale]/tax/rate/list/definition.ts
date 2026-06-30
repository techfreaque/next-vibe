/**
 * Tax Rate List API Route Definition
 * GET endpoint to list all active tax rates for a company
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
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

import { TaxType, TaxTypeDB, TaxTypeOptions } from "../../enum";
import { scopedTranslation } from "../../i18n";
import { TAX_RATE_LIST_ALIAS } from "./constants";

const TaxRateListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TaxRateListWidget })),
);

const ALLOWED_ROLES = [
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["tax", "rate", "list"],
  aliases: [TAX_RATE_LIST_ALIAS] as const,
  title: "rate.list.title" as const,
  titleShort: "rate.list.titleShort" as const,
  description: "rate.list.description" as const,
  category: "tax" as const,
  subCategory: "Tax Rates" as const,
  tags: ["tags.tax" as const, "tags.rate" as const, "tags.list" as const],
  allowedRoles: ALLOWED_ROLES,
  defaultWebPinned: ALLOWED_ROLES,
  icon: "list",

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: TaxRateListWidget,
    children: {
      // === REQUEST FIELDS ===
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
        label: "rate.list.companyId.label" as const,
        description: "rate.list.companyId.description" as const,
        placeholder: "rate.list.companyId.placeholder" as const,
        schema: z.string().uuid().optional(),
      }),
      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "rate.list.country.label" as const,
        description: "rate.list.country.description" as const,
        placeholder: "rate.list.country.placeholder" as const,
        schema: z.string().max(10).optional(),
      }),
      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "rate.list.type.label" as const,
        description: "rate.list.type.description" as const,
        placeholder: "rate.list.type.placeholder" as const,
        options: TaxTypeOptions,
        schema: z.enum(TaxTypeDB).optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "rate.list.page.label" as const,
        description: "rate.list.page.description" as const,
        schema: z.number().int().min(1).optional(),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "rate.list.pageSize.label" as const,
        description: "rate.list.pageSize.description" as const,
        schema: z.number().int().min(1).max(100).optional(),
      }),

      // === RESPONSE FIELDS ===
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "rate.list.response.total" as const,
        schema: z.number(),
      }),
      rates: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "rate.list.response.rate.id" as const,
              schema: z.string().uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "rate.list.response.rate.name" as const,
              schema: z.string(),
            }),
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "rate.list.response.rate.code" as const,
              schema: z.string(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "rate.list.response.rate.type" as const,
              schema: z.enum(TaxTypeDB),
            }),
            rate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "rate.list.response.rate.rate" as const,
              schema: z.number(),
            }),
            country: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "rate.list.response.rate.country" as const,
              schema: z.string().nullable(),
            }),
            region: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "rate.list.response.rate.region" as const,
              schema: z.string().nullable(),
            }),
            isDefault: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "rate.list.response.rate.isDefault" as const,
              schema: z.boolean(),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "rate.list.response.rate.isActive" as const,
              schema: z.boolean(),
            }),
            isCompound: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "rate.list.response.rate.isCompound" as const,
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "rate.list.response.rate.createdAt" as const,
              schema: dateSchema,
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "rate.list.response.rate.updatedAt" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "rate.list.errors.validation.title" as const,
      description: "rate.list.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "rate.list.errors.unauthorized.title" as const,
      description: "rate.list.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "rate.list.errors.forbidden.title" as const,
      description: "rate.list.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "rate.list.errors.notFound.title" as const,
      description: "rate.list.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "rate.list.errors.conflict.title" as const,
      description: "rate.list.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "rate.list.errors.server.title" as const,
      description: "rate.list.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "rate.list.errors.network.title" as const,
      description: "rate.list.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "rate.list.errors.unknown.title" as const,
      description: "rate.list.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "rate.list.errors.unsavedChanges.title" as const,
      description: "rate.list.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "rate.list.success.title" as const,
    description: "rate.list.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "550e8400-e29b-41d4-a716-446655440000",
        country: undefined,
        type: undefined,
        page: 1,
        pageSize: 20,
      },
    },
    responses: {
      default: {
        total: 1,
        rates: [
          {
            id: "550e8400-e29b-41d4-a716-446655440001",
            name: "VAT 20%",
            code: "AT-VAT20",
            type: TaxType.VAT,
            rate: 0.2,
            country: "AT",
            region: null,
            isDefault: true,
            isActive: true,
            isCompound: false,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
          },
        ],
      },
    },
  },
});

export type TaxRateListRequestOutput = typeof GET.types.RequestOutput;
export type TaxRateListRequestInput = typeof GET.types.RequestInput;
export type TaxRateListResponseOutput = typeof GET.types.ResponseOutput;
export type TaxRateListItem = TaxRateListResponseOutput["rates"][number];

const definitions = { GET } as const;
export default definitions;
