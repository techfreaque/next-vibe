/**
 * Vendor Create API Route Definition
 * POST — register a new supplier vendor
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
import {
  objectField,
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils-i18n";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["purchasing", "vendor", "create"],
  title: "vendorCreate.post.title" as const,
  titleShort: "vendorCreate.post.titleShort" as const,
  description: "vendorCreate.post.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Vendors",
  icon: "file" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.vendor" as const,
    "tags.create" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "vendorCreate.post.title" as const,
    description: "vendorCreate.post.description" as const,
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        label: "vendorCreate.companyId.label" as const,
        description: "vendorCreate.companyId.description" as const,
        placeholder: "vendorCreate.companyId.placeholder" as const,
        columns: 12,
        schema: z.string().uuid(),
      }),
      name: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.name.label" as const,
        description: "vendorCreate.name.description" as const,
        placeholder: "vendorCreate.name.placeholder" as const,
        columns: 8,
        schema: z.string().min(1).max(255),
      }),
      code: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.code.label" as const,
        description: "vendorCreate.code.description" as const,
        placeholder: "vendorCreate.code.placeholder" as const,
        columns: 4,
        schema: z.string().max(50).optional(),
      }),
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.email.label" as const,
        description: "vendorCreate.email.description" as const,
        placeholder: "vendorCreate.email.placeholder" as const,
        columns: 6,
        schema: z.email().optional(),
      }),
      phone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.phone.label" as const,
        description: "vendorCreate.phone.description" as const,
        placeholder: "vendorCreate.phone.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional(),
      }),
      website: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.website.label" as const,
        description: "vendorCreate.website.description" as const,
        placeholder: "vendorCreate.website.placeholder" as const,
        columns: 6,
        schema: z.string().url().optional(),
      }),
      vatNumber: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.vatNumber.label" as const,
        description: "vendorCreate.vatNumber.description" as const,
        placeholder: "vendorCreate.vatNumber.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional(),
      }),
      taxId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.taxId.label" as const,
        description: "vendorCreate.taxId.description" as const,
        placeholder: "vendorCreate.taxId.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional(),
      }),
      addressLine1: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.addressLine1.label" as const,
        description: "vendorCreate.addressLine1.description" as const,
        placeholder: "vendorCreate.addressLine1.placeholder" as const,
        columns: 12,
        schema: z.string().max(255).optional(),
      }),
      addressLine2: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.addressLine2.label" as const,
        description: "vendorCreate.addressLine2.description" as const,
        placeholder: "vendorCreate.addressLine2.placeholder" as const,
        columns: 12,
        schema: z.string().max(255).optional(),
      }),
      city: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.city.label" as const,
        description: "vendorCreate.city.description" as const,
        placeholder: "vendorCreate.city.placeholder" as const,
        columns: 4,
        schema: z.string().max(100).optional(),
      }),
      region: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.region.label" as const,
        description: "vendorCreate.region.description" as const,
        placeholder: "vendorCreate.region.placeholder" as const,
        columns: 4,
        schema: z.string().max(100).optional(),
      }),
      postalCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.postalCode.label" as const,
        description: "vendorCreate.postalCode.description" as const,
        placeholder: "vendorCreate.postalCode.placeholder" as const,
        columns: 4,
        schema: z.string().max(20).optional(),
      }),
      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.country.label" as const,
        description: "vendorCreate.country.description" as const,
        placeholder: "vendorCreate.country.placeholder" as const,
        columns: 4,
        schema: z.string().min(2).max(2).optional(),
      }),
      defaultCurrency: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "vendorCreate.defaultCurrency.label" as const,
        description: "vendorCreate.defaultCurrency.description" as const,
        placeholder: "vendorCreate.defaultCurrency.placeholder" as const,
        columns: 4,
        schema: z.string().min(3).max(3).default("EUR"),
      }),
      defaultPaymentTermsDays: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "vendorCreate.defaultPaymentTermsDays.label" as const,
        description:
          "vendorCreate.defaultPaymentTermsDays.description" as const,
        placeholder:
          "vendorCreate.defaultPaymentTermsDays.placeholder" as const,
        columns: 4,
        schema: z.number().int().min(0).max(365).default(30),
      }),
      notes: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "vendorCreate.notes.label" as const,
        description: "vendorCreate.notes.description" as const,
        placeholder: "vendorCreate.notes.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),

      // Response fields
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "vendorCreate.post.response.id" as const,
        schema: z.uuid(),
      }),
      nameResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "vendorCreate.post.response.name" as const,
        schema: z.string(),
      }),
      codeResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "vendorCreate.post.response.code" as const,
        schema: z.string().nullable(),
      }),
      emailResponse: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "vendorCreate.post.response.email" as const,
        schema: z.string().nullable(),
      }),
      isActive: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "vendorCreate.post.response.isActive" as const,
        schema: z.boolean(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        label: "vendorCreate.post.response.createdAt" as const,
        schema: z.coerce.date(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "vendorCreate.post.errors.validation.title" as const,
      description: "vendorCreate.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "vendorCreate.post.errors.network.title" as const,
      description: "vendorCreate.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "vendorCreate.post.errors.unauthorized.title" as const,
      description: "vendorCreate.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "vendorCreate.post.errors.forbidden.title" as const,
      description: "vendorCreate.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "vendorCreate.post.errors.notFound.title" as const,
      description: "vendorCreate.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "vendorCreate.post.errors.server.title" as const,
      description: "vendorCreate.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "vendorCreate.post.errors.unknown.title" as const,
      description: "vendorCreate.post.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "vendorCreate.post.errors.unsavedChanges.title" as const,
      description:
        "vendorCreate.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "vendorCreate.post.errors.conflict.title" as const,
      description: "vendorCreate.post.errors.conflict.description" as const,
    },
  },

  successTypes: {
    title: "vendorCreate.post.success.title" as const,
    description: "vendorCreate.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: "00000000-0000-0000-0000-000000000001",
        name: "Acme GmbH",
        code: "ACM-001",
        email: "orders@acme.com",
        phone: "+49 30 12345678",
        website: "https://acme.com",
        vatNumber: "DE123456789",
        taxId: undefined,
        addressLine1: "123 Main Street",
        addressLine2: undefined,
        city: "Berlin",
        region: "Berlin",
        postalCode: "10115",
        country: "DE",
        defaultCurrency: "EUR",
        defaultPaymentTermsDays: 30,
        notes: "Preferred electronics supplier",
      },
    },
    responses: {
      default: {
        id: "456e7890-e89b-12d3-a456-426614174000",
        nameResponse: "Acme GmbH",
        codeResponse: "ACM-001",
        emailResponse: "orders@acme.com",
        isActive: true,
        createdAt: new Date("2024-01-15T00:00:00.000Z"),
      },
    },
  },
});

export type VendorCreateRequestOutput = typeof POST.types.RequestOutput;
export type VendorCreateResponseOutput = typeof POST.types.ResponseOutput;

const endpoints = { POST };
export default endpoints;
