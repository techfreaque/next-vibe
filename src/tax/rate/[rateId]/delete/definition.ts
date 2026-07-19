/**
 * Tax Rate Delete API Route Definition
 * POST endpoint to soft-delete (deactivate) a tax rate
 */

import { createEndpoint } from "next-vibe/core/definition/create";
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
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const ALLOWED_ROLES = [
  UserRole.ADMIN,
  UserRole.PARTNER_ADMIN,
  UserRole.PARTNER_EMPLOYEE,
] as const;

const TaxRateDeleteWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TaxRateDeleteWidget })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["tax", "rate", "[rateId]", "delete"],
  title: "rate.delete.title" as const,
  titleShort: "rate.delete.titleShort" as const,
  description: "rate.delete.description" as const,
  category: "tax" as const,
  subCategory: "Tax Rates" as const,
  tags: ["tags.tax" as const, "tags.rate" as const, "tags.delete" as const],
  allowedRoles: ALLOWED_ROLES,
  icon: "trash",

  fields: customWidgetObject({
    render: TaxRateDeleteWidgetLazy,
    usage: { request: "urlPathParams", response: true },
    children: {
      // === URL PATH PARAMS ===
      rateId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "rate.delete.rateId.label" as const,
        description: "rate.delete.rateId.description" as const,
        schema: z.string().uuid(),
        listEndpoint: async () =>
          (await import("../../../rate/list/definition")).default.GET,
        labelField: "name",
      }),

      // === RESPONSE FIELDS ===
      deleted: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "rate.delete.response.deleted" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "rate.delete.errors.validation.title" as const,
      description: "rate.delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "rate.delete.errors.unauthorized.title" as const,
      description: "rate.delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "rate.delete.errors.forbidden.title" as const,
      description: "rate.delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "rate.delete.errors.notFound.title" as const,
      description: "rate.delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "rate.delete.errors.conflict.title" as const,
      description: "rate.delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "rate.delete.errors.server.title" as const,
      description: "rate.delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "rate.delete.errors.network.title" as const,
      description: "rate.delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "rate.delete.errors.unknown.title" as const,
      description: "rate.delete.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "rate.delete.errors.unsavedChanges.title" as const,
      description: "rate.delete.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "rate.delete.success.title" as const,
    description: "rate.delete.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        rateId: "550e8400-e29b-41d4-a716-446655440001",
      },
    },
    responses: {
      default: {
        deleted: true,
      },
    },
  },
});

export type TaxRateDeleteUrlPathParams = typeof POST.types.UrlVariablesOutput;
export type TaxRateDeleteResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
