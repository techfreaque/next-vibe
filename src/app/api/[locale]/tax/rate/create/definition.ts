/**
 * Tax Rate Create API Route Definition
 * POST endpoint to add a new tax rate to a company
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TaxType, TaxTypeDB, TaxTypeOptions } from "../../enum";
import { scopedTranslation } from "../../i18n";

const ALLOWED_ROLES = [
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

const TaxRateCreateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TaxRateCreateWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["tax", "rate", "create"],
  title: "rate.create.title" as const,
  titleShort: "rate.create.titleShort" as const,
  description: "rate.create.description" as const,
  category: "tax" as const,
  subCategory: "Tax Rates" as const,
  tags: ["tags.tax" as const, "tags.rate" as const, "tags.create" as const],
  allowedRoles: ALLOWED_ROLES,
  icon: "receipt",

  fields: customWidgetObject({
    render: TaxRateCreateWidgetLazy,
    usage: { request: "data", response: true },
    children: {
      // === REQUEST FIELDS ===
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
        label: "rate.create.companyId.label" as const,
        description: "rate.create.companyId.description" as const,
        placeholder: "rate.create.companyId.placeholder" as const,
        schema: z.string().uuid(),
      }),
      taxName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "rate.create.name.label" as const,
        description: "rate.create.name.description" as const,
        placeholder: "rate.create.name.placeholder" as const,
        schema: z.string().min(1).max(255),
      }),
      taxCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "rate.create.code.label" as const,
        description: "rate.create.code.description" as const,
        placeholder: "rate.create.code.placeholder" as const,
        schema: z.string().min(1).max(50),
      }),
      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "rate.create.type.label" as const,
        description: "rate.create.type.description" as const,
        placeholder: "rate.create.type.placeholder" as const,
        options: TaxTypeOptions,
        schema: z.enum(TaxTypeDB),
      }),
      rate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "rate.create.rate.label" as const,
        description: "rate.create.rate.description" as const,
        placeholder: "rate.create.rate.placeholder" as const,
        schema: z.number().min(0).max(1),
      }),
      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "rate.create.country.label" as const,
        description: "rate.create.country.description" as const,
        placeholder: "rate.create.country.placeholder" as const,
        schema: z.string().max(10).optional(),
      }),
      region: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "rate.create.region.label" as const,
        description: "rate.create.region.description" as const,
        placeholder: "rate.create.region.placeholder" as const,
        schema: z.string().max(100).optional(),
      }),
      isDefault: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "rate.create.isDefault.label" as const,
        description: "rate.create.isDefault.description" as const,
        schema: z.boolean().optional().default(false),
      }),

      // === RESPONSE FIELDS ===
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "rate.create.response.id" as const,
        schema: z.string().uuid(),
      }),
      resultCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "rate.create.response.code" as const,
        schema: z.string(),
      }),
      resultName: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "rate.create.response.name" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "rate.create.errors.validation.title" as const,
      description: "rate.create.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "rate.create.errors.unauthorized.title" as const,
      description: "rate.create.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "rate.create.errors.forbidden.title" as const,
      description: "rate.create.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "rate.create.errors.notFound.title" as const,
      description: "rate.create.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "rate.create.errors.conflict.title" as const,
      description: "rate.create.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "rate.create.errors.server.title" as const,
      description: "rate.create.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "rate.create.errors.network.title" as const,
      description: "rate.create.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "rate.create.errors.unknown.title" as const,
      description: "rate.create.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "rate.create.errors.unsavedChanges.title" as const,
      description: "rate.create.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "rate.create.success.title" as const,
    description: "rate.create.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "550e8400-e29b-41d4-a716-446655440000",
        taxName: "VAT 20%",
        taxCode: "AT-VAT20",
        type: TaxType.VAT,
        rate: 0.2,
        country: "AT",
        region: undefined,
        isDefault: true,
      },
    },
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440001",
        resultCode: "AT-VAT20",
        resultName: "VAT 20%",
      },
    },
  },
});

export type TaxRateCreateRequestInput = typeof POST.types.RequestInput;
export type TaxRateCreateRequestOutput = typeof POST.types.RequestOutput;
export type TaxRateCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
