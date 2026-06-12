/**
 * User Address by ID API Endpoint Definitions
 * PATCH - update an address
 * DELETE - remove an address
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
import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import { UserRole } from "../../../../user-roles/enum";
import { scopedTranslation } from "./i18n";
import addressesListDefinitions from "@/app/api/[locale]/user/private/me/addresses/definition";

const UserAddressPatchContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserAddressPatchContainer })),
);

const UserAddressDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserAddressDeleteContainer })),
);

/**
 * PATCH /user/private/me/addresses/[addressId] - update an address
 */
const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["user", "private", "me", "addresses", "[addressId]"],
  title: "update.title" as const,
  titleShort: "update.titleShort" as const,
  description: "update.description" as const,
  icon: "package",
  category: "account",
  tags: ["tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: UserAddressPatchContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      // URL param
      addressId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: addressesListDefinitions.GET,
        labelField: "label",
        label: "update.fields.addressId.label" as const,
        description: "update.fields.addressId.description" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      // Optional update fields
      label: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.label.label" as const,
        description: "update.fields.label.description" as const,
        placeholder: "update.fields.label.placeholder" as const,
        columns: 12,
        schema: z.string().max(100).optional(),
      }),

      fullName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.fullName.label" as const,
        description: "update.fields.fullName.description" as const,
        placeholder: "update.fields.fullName.placeholder" as const,
        columns: 6,
        schema: z.string().max(200).optional().nullable(),
      }),

      company: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.company.label" as const,
        description: "update.fields.company.description" as const,
        placeholder: "update.fields.company.placeholder" as const,
        columns: 6,
        schema: z.string().max(200).optional().nullable(),
      }),

      phone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEL,
        label: "update.fields.phone.label" as const,
        description: "update.fields.phone.description" as const,
        placeholder: "update.fields.phone.placeholder" as const,
        columns: 6,
        schema: z
          .union([z.string().regex(/^\+?[\d\s\-().]{4,30}$/), z.literal("")])
          .optional()
          .nullable()
          .transform((v) => (v === "" ? null : v)),
      }),

      vatNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.vatNumber.label" as const,
        description: "update.fields.vatNumber.description" as const,
        placeholder: "update.fields.vatNumber.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional().nullable(),
      }),

      taxId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.taxId.label" as const,
        description: "update.fields.taxId.description" as const,
        placeholder: "update.fields.taxId.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional().nullable(),
      }),

      addressLine1: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.addressLine1.label" as const,
        description: "update.fields.addressLine1.description" as const,
        placeholder: "update.fields.addressLine1.placeholder" as const,
        columns: 12,
        schema: z.string().max(255).optional(),
      }),

      addressLine2: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.addressLine2.label" as const,
        description: "update.fields.addressLine2.description" as const,
        placeholder: "update.fields.addressLine2.placeholder" as const,
        columns: 12,
        schema: z.string().max(255).optional().nullable(),
      }),

      city: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.city.label" as const,
        description: "update.fields.city.description" as const,
        placeholder: "update.fields.city.placeholder" as const,
        columns: 6,
        schema: z.string().max(100).optional(),
      }),

      region: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.region.label" as const,
        description: "update.fields.region.description" as const,
        placeholder: "update.fields.region.placeholder" as const,
        columns: 6,
        schema: z.string().max(100).optional().nullable(),
      }),

      postalCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.postalCode.label" as const,
        description: "update.fields.postalCode.description" as const,
        placeholder: "update.fields.postalCode.placeholder" as const,
        columns: 6,
        schema: z.string().max(20).optional().nullable(),
      }),

      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "update.fields.country.label" as const,
        description: "update.fields.country.description" as const,
        placeholder: "update.fields.country.placeholder" as const,
        columns: 6,
        schema: z.string().length(2).toUpperCase().optional(),
      }),

      isDefaultBilling: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "update.fields.isDefaultBilling.label" as const,
        description: "update.fields.isDefaultBilling.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),

      isDefaultDelivery: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "update.fields.isDefaultDelivery.label" as const,
        description: "update.fields.isDefaultDelivery.description" as const,
        columns: 6,
        schema: z.boolean().optional(),
      }),

      // Response
      updated: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "update.response.updated" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "update.errors.validation.title" as const,
      description: "update.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "update.errors.unauthorized.title" as const,
      description: "update.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "update.errors.forbidden.title" as const,
      description: "update.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "update.errors.notFound.title" as const,
      description: "update.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "update.errors.conflict.title" as const,
      description: "update.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "update.errors.network.title" as const,
      description: "update.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "update.errors.unsavedChanges.title" as const,
      description: "update.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "update.errors.internal.title" as const,
      description: "update.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "update.errors.unknown.title" as const,
      description: "update.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "update.success.title" as const,
    description: "update.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        addressId: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
    requests: {
      default: {
        label: "Office",
        city: "Munich",
      },
    },
    responses: {
      default: {
        updated: true,
      },
    },
  },
});

/**
 * DELETE /user/private/me/addresses/[addressId] - remove an address
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["user", "private", "me", "addresses", "[addressId]"],
  title: "delete.title" as const,
  titleShort: "delete.titleShort" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "account",
  tags: ["tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: UserAddressDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      addressId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: addressesListDefinitions.GET,
        labelField: "label",
        label: "delete.fields.addressId.label" as const,
        description: "delete.fields.addressId.description" as const,
        columns: 12,
        schema: z.uuid(),
      }),

      deleted: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "delete.response.deleted" as const,
        schema: z.boolean(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.internal.title" as const,
      description: "delete.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        addressId: "550e8400-e29b-41d4-a716-446655440000",
      },
    },
    responses: {
      default: {
        deleted: true,
      },
    },
  },
});

const userAddressByIdEndpoints = { PATCH, DELETE } as const;
export default userAddressByIdEndpoints;

export type UserAddressPatchRequestOutput = typeof PATCH.types.RequestOutput;
export type UserAddressPatchUrlVariablesOutput =
  typeof PATCH.types.UrlVariablesOutput;
export type UserAddressPatchResponseOutput = typeof PATCH.types.ResponseOutput;
export type UserAddressDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type UserAddressDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;
