/**
 * Tax Rate Update API Route Definition
 * PATCH endpoint to update an existing tax rate
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import { scopedTranslation } from "../../../i18n";
import listDef0 from "../../../rate/list/definition";

const ALLOWED_ROLES = [
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

const TaxRateUpdateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TaxRateUpdateWidget })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["tax", "rate", "[rateId]", "update"],
  title: "rate.update.title" as const,
  titleShort: "rate.update.titleShort" as const,
  description: "rate.update.description" as const,
  category: "tax" as const,
  subCategory: "Tax Rates" as const,
  tags: ["tags.tax" as const, "tags.rate" as const, "tags.update" as const],
  allowedRoles: ALLOWED_ROLES,
  icon: "pencil",

  fields: customWidgetObject({
    render: TaxRateUpdateWidgetLazy,
    usage: { request: "data&urlPathParams", response: true },
    children: {
      // === URL PATH PARAMS ===
      rateId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "rate.update.rateId.label" as const,
        description: "rate.update.rateId.description" as const,
        schema: z.string().uuid(),
        listEndpoint: listDef0.GET,
        labelField: "name",
      }),

      // === REQUEST BODY FIELDS ===
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "rate.update.name.label" as const,
        description: "rate.update.name.description" as const,
        placeholder: "rate.update.name.placeholder" as const,
        schema: z.string().min(1).max(255).optional(),
      }),
      rate: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "rate.update.rate.label" as const,
        description: "rate.update.rate.description" as const,
        placeholder: "rate.update.rate.placeholder" as const,
        schema: z.number().min(0).max(1).optional(),
      }),
      isDefault: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "rate.update.isDefault.label" as const,
        description: "rate.update.isDefault.description" as const,
        schema: z.boolean().optional(),
      }),
      isActive: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "rate.update.isActive.label" as const,
        description: "rate.update.isActive.description" as const,
        schema: z.boolean().optional(),
      }),

      // === RESPONSE FIELDS ===
      updated: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "rate.update.response.updated" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "rate.update.errors.validation.title" as const,
      description: "rate.update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "rate.update.errors.unauthorized.title" as const,
      description: "rate.update.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "rate.update.errors.forbidden.title" as const,
      description: "rate.update.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "rate.update.errors.notFound.title" as const,
      description: "rate.update.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "rate.update.errors.conflict.title" as const,
      description: "rate.update.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "rate.update.errors.server.title" as const,
      description: "rate.update.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "rate.update.errors.network.title" as const,
      description: "rate.update.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "rate.update.errors.unknown.title" as const,
      description: "rate.update.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "rate.update.errors.unsavedChanges.title" as const,
      description: "rate.update.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "rate.update.success.title" as const,
    description: "rate.update.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        rateId: "550e8400-e29b-41d4-a716-446655440001",
      },
    },
    requests: {
      default: {
        name: "VAT 20% (updated)",
        rate: undefined,
        isDefault: undefined,
        isActive: undefined,
      },
    },
    responses: {
      default: {
        updated: true,
      },
    },
  },
});

export type TaxRateUpdateUrlPathParams = typeof PATCH.types.UrlVariablesOutput;
export type TaxRateUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type TaxRateUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

const definitions = { PATCH } as const;
export default definitions;
