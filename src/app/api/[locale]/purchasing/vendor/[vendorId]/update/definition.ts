/**
 * Vendor Update API Route Definition
 * PATCH — update vendor details
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import vendorListDefinitions from "@/app/api/[locale]/purchasing/vendor/list/definition";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
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

import { scopedTranslation } from "../../../i18n";

const VendorUpdateWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.VendorUpdateWidget })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["purchasing", "vendor", "[vendorId]", "update"],
  title: "vendorUpdate.patch.title" as const,
  titleShort: "vendorUpdate.patch.titleShort" as const,
  description: "vendorUpdate.patch.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Vendors",
  icon: "file" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.vendor" as const,
    "tags.update" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    usage: { request: "data&urlPathParams", response: true },
    render: VendorUpdateWidgetLazy,
    children: {
      vendorId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "vendorUpdate.patch.vendorId.label" as const,
        description: "vendorUpdate.patch.vendorId.description" as const,
        hidden: true,
        schema: z.uuid(),
        listEndpoint: vendorListDefinitions.GET,
        labelField: "name",
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.name.label" as const,
        description: "vendorUpdate.patch.name.description" as const,
        placeholder: "vendorUpdate.patch.name.placeholder" as const,
        columns: 8,
        schema: z.string().min(1).max(255).optional(),
      }),
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.code.label" as const,
        description: "vendorUpdate.patch.code.description" as const,
        placeholder: "vendorUpdate.patch.code.placeholder" as const,
        columns: 4,
        schema: z.string().max(50).optional(),
      }),
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.email.label" as const,
        description: "vendorUpdate.patch.email.description" as const,
        placeholder: "vendorUpdate.patch.email.placeholder" as const,
        columns: 6,
        schema: z.string().email().optional(),
      }),
      phone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.phone.label" as const,
        description: "vendorUpdate.patch.phone.description" as const,
        placeholder: "vendorUpdate.patch.phone.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional(),
      }),
      website: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.website.label" as const,
        description: "vendorUpdate.patch.website.description" as const,
        placeholder: "vendorUpdate.patch.website.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      vatNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.vatNumber.label" as const,
        description: "vendorUpdate.patch.vatNumber.description" as const,
        placeholder: "vendorUpdate.patch.vatNumber.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional(),
      }),
      taxId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.taxId.label" as const,
        description: "vendorUpdate.patch.taxId.description" as const,
        placeholder: "vendorUpdate.patch.taxId.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional(),
      }),
      addressLine1: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.addressLine1.label" as const,
        description: "vendorUpdate.patch.addressLine1.description" as const,
        placeholder: "vendorUpdate.patch.addressLine1.placeholder" as const,
        columns: 12,
        schema: z.string().max(255).optional(),
      }),
      addressLine2: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.addressLine2.label" as const,
        description: "vendorUpdate.patch.addressLine2.description" as const,
        placeholder: "vendorUpdate.patch.addressLine2.placeholder" as const,
        columns: 12,
        schema: z.string().max(255).optional(),
      }),
      city: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.city.label" as const,
        description: "vendorUpdate.patch.city.description" as const,
        placeholder: "vendorUpdate.patch.city.placeholder" as const,
        columns: 4,
        schema: z.string().max(100).optional(),
      }),
      region: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.region.label" as const,
        description: "vendorUpdate.patch.region.description" as const,
        placeholder: "vendorUpdate.patch.region.placeholder" as const,
        columns: 4,
        schema: z.string().max(100).optional(),
      }),
      postalCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.postalCode.label" as const,
        description: "vendorUpdate.patch.postalCode.description" as const,
        placeholder: "vendorUpdate.patch.postalCode.placeholder" as const,
        columns: 4,
        schema: z.string().max(20).optional(),
      }),
      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.country.label" as const,
        description: "vendorUpdate.patch.country.description" as const,
        placeholder: "vendorUpdate.patch.country.placeholder" as const,
        columns: 4,
        schema: z.string().min(2).max(2).optional(),
      }),
      defaultCurrency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorUpdate.patch.defaultCurrency.label" as const,
        description: "vendorUpdate.patch.defaultCurrency.description" as const,
        placeholder: "vendorUpdate.patch.defaultCurrency.placeholder" as const,
        columns: 4,
        schema: z.string().min(3).max(3).optional(),
      }),
      defaultPaymentTermsDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "vendorUpdate.patch.defaultPaymentTermsDays.label" as const,
        description:
          "vendorUpdate.patch.defaultPaymentTermsDays.description" as const,
        placeholder:
          "vendorUpdate.patch.defaultPaymentTermsDays.placeholder" as const,
        columns: 4,
        schema: z.number().int().min(0).max(365).optional(),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "vendorUpdate.patch.notes.label" as const,
        description: "vendorUpdate.patch.notes.description" as const,
        placeholder: "vendorUpdate.patch.notes.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "vendorUpdate.patch.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          nameResponse: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "vendorUpdate.patch.response.name" as const,
            schema: z.string(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "vendorUpdate.patch.response.isActive" as const,
            schema: z.boolean(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "vendorUpdate.patch.response.updatedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "vendorUpdate.patch.errors.validation.title" as const,
      description: "vendorUpdate.patch.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "vendorUpdate.patch.errors.unauthorized.title" as const,
      description:
        "vendorUpdate.patch.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "vendorUpdate.patch.errors.forbidden.title" as const,
      description: "vendorUpdate.patch.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "vendorUpdate.patch.errors.conflict.title" as const,
      description: "vendorUpdate.patch.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "vendorUpdate.patch.errors.server.title" as const,
      description: "vendorUpdate.patch.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "vendorUpdate.patch.errors.unknown.title" as const,
      description: "vendorUpdate.patch.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "vendorUpdate.patch.errors.network.title" as const,
      description: "vendorUpdate.patch.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "vendorUpdate.patch.errors.notFound.title" as const,
      description: "vendorUpdate.patch.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "vendorUpdate.patch.errors.unsavedChanges.title" as const,
      description:
        "vendorUpdate.patch.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "vendorUpdate.patch.success.title" as const,
    description: "vendorUpdate.patch.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: { vendorId: "456e7890-e89b-12d3-a456-426614174000" },
    },
    requests: {
      default: {
        name: "Acme GmbH Updated",
        code: undefined,
        email: undefined,
        phone: undefined,
        website: undefined,
        vatNumber: undefined,
        taxId: undefined,
        addressLine1: undefined,
        addressLine2: undefined,
        city: undefined,
        region: undefined,
        postalCode: undefined,
        country: undefined,
        defaultCurrency: undefined,
        defaultPaymentTermsDays: undefined,
        notes: undefined,
      },
    },
    responses: {
      default: {
        result: {
          id: "456e7890-e89b-12d3-a456-426614174000",
          nameResponse: "Acme GmbH Updated",
          isActive: true,
          updatedAt: new Date("2024-06-01"),
        },
      },
    },
  },
});

export type VendorUpdateRequestOutput = typeof PATCH.types.RequestOutput;
export type VendorUpdateResponseOutput = typeof PATCH.types.ResponseOutput;

const definitions = { PATCH } as const;
export default definitions;
