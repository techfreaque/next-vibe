/**
 * Vendor Get API Route Definition
 * GET — retrieve a vendor by ID
 */

import { createEndpoint } from "next-vibe/core/definition/create";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "next-vibe/core/definition/enums";
import { UserRole } from "next-vibe/identity/roles/enum";
import { lazyWidget } from "next-vibe/unified-ui/_shared/lazy-widget";
import {
  customWidgetObject,
  objectField,
  requestUrlPathParamsField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../../i18n";

const VendorGetWidgetLazy = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.VendorGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["purchasing", "vendor", "[vendorId]", "get"],
  aliases: ["purchasing-vendor-get"],
  title: "vendorGet.get.title" as const,
  titleShort: "vendorGet.get.titleShort" as const,
  description: "vendorGet.get.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Vendors",
  icon: "file" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.vendor" as const,
    "tags.get" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: VendorGetWidgetLazy,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      vendorId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "vendorGet.get.vendorId.label" as const,
        description: "vendorGet.get.vendorId.description" as const,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/purchasing/vendor/list/definition"))
            .default.GET,
        labelField: "name",
      }),

      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.id" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          companyId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.companyId" as const,
            hidden: true,
            schema: z.uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.name" as const,
            schema: z.string(),
          }),
          code: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.code" as const,
            schema: z.string().nullable(),
          }),
          email: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.email" as const,
            schema: z.string().nullable(),
          }),
          phone: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.phone" as const,
            schema: z.string().nullable(),
          }),
          website: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.website" as const,
            schema: z.string().nullable(),
          }),
          vatNumber: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.vatNumber" as const,
            schema: z.string().nullable(),
          }),
          taxId: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.taxId" as const,
            schema: z.string().nullable(),
          }),
          addressLine1: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.addressLine1" as const,
            schema: z.string().nullable(),
          }),
          addressLine2: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.addressLine2" as const,
            schema: z.string().nullable(),
          }),
          city: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.city" as const,
            schema: z.string().nullable(),
          }),
          region: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.region" as const,
            schema: z.string().nullable(),
          }),
          postalCode: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.postalCode" as const,
            schema: z.string().nullable(),
          }),
          country: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.country" as const,
            schema: z.string().nullable(),
          }),
          defaultCurrency: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.defaultCurrency" as const,
            schema: z.string(),
          }),
          defaultPaymentTermsDays: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.defaultPaymentTermsDays" as const,
            schema: z.number().nullable(),
          }),
          isActive: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.isActive" as const,
            schema: z.boolean(),
          }),
          notes: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.notes" as const,
            schema: z.string().nullable(),
          }),
          createdAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.createdAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
          updatedAt: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "vendorGet.get.response.updatedAt" as const,
            fieldType: FieldDataType.DATETIME,
            schema: z.coerce.date(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "vendorGet.get.errors.validation.title" as const,
      description: "vendorGet.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "vendorGet.get.errors.unauthorized.title" as const,
      description: "vendorGet.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "vendorGet.get.errors.forbidden.title" as const,
      description: "vendorGet.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "vendorGet.get.errors.conflict.title" as const,
      description: "vendorGet.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "vendorGet.get.errors.server.title" as const,
      description: "vendorGet.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "vendorGet.get.errors.unknown.title" as const,
      description: "vendorGet.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "vendorGet.get.errors.network.title" as const,
      description: "vendorGet.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "vendorGet.get.errors.notFound.title" as const,
      description: "vendorGet.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "vendorGet.get.errors.unsavedChanges.title" as const,
      description: "vendorGet.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "vendorGet.get.success.title" as const,
    description: "vendorGet.get.success.description" as const,
  },

  examples: {
    urlPathParams: {
      default: {
        vendorId: "456e7890-e89b-12d3-a456-426614174000",
      },
    },
    requests: undefined,
    responses: {
      default: {
        result: {
          id: "456e7890-e89b-12d3-a456-426614174000",
          companyId: "00000000-0000-0000-0000-000000000001",
          name: "Acme GmbH",
          code: "ACM-001",
          email: "orders@acme.com",
          phone: "+49 30 12345678",
          website: "https://acme.com",
          vatNumber: "DE123456789",
          taxId: null,
          addressLine1: "123 Main Street",
          addressLine2: null,
          city: "Berlin",
          region: "Berlin",
          postalCode: "10115",
          country: "DE",
          defaultCurrency: "EUR",
          defaultPaymentTermsDays: 30,
          isActive: true,
          notes: null,
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
        },
      },
    },
  },
});

export type VendorGetRequestOutput = typeof GET.types.RequestOutput;
export type VendorGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
