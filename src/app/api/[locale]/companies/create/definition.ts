/**
 * Companies Create API Route Definition
 * Defines endpoint for creating a new company
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
  requestField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { CompanyType, CompanyTypeOptions } from "../enum";
import { scopedTranslation } from "./i18n";

const CompanyCreateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CompanyCreateContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["companies", "create"],
  title: "post.title",
  titleShort: "post.titleShort",
  description: "post.description",
  category: "companies",
  subCategory: "Company Management",
  tags: ["tags.companies", "tags.create"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  icon: "building",

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: CompanyCreateWidget,
    children: {
      // === REQUEST FIELDS ===
      details: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          name: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.name.label",
            description: "post.name.description",
            placeholder: "post.name.placeholder",
            schema: z.string().min(1).max(255),
          }),
          type: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "post.type.label",
            description: "post.type.description",
            placeholder: "post.type.placeholder",
            options: CompanyTypeOptions,
            schema: z.enum(CompanyType),
          }),
          vatNumber: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.vatNumber.label",
            description: "post.vatNumber.description",
            placeholder: "post.vatNumber.placeholder",
            schema: z.string().max(50).optional(),
          }),
          country: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.country.label",
            description: "post.country.description",
            placeholder: "post.country.placeholder",
            schema: z.string().max(10).optional(),
          }),
          currency: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "post.currency.label",
            description: "post.currency.description",
            placeholder: "post.currency.placeholder",
            schema: z.string().length(3).optional(),
          }),
          email: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "post.email.label",
            description: "post.email.description",
            placeholder: "post.email.placeholder",
            schema: z
              .union([z.string().email(), z.literal("")])
              .optional()
              .transform((v) => (v === "" ? undefined : v)),
          }),
          phone: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEL,
            label: "post.phone.label",
            description: "post.phone.description",
            placeholder: "post.phone.placeholder",
            schema: z
              .union([
                z.string().regex(/^\+?[\d\s\-().]{4,30}$/),
                z.literal(""),
              ])
              .optional()
              .transform((v) => (v === "" ? undefined : v)),
          }),
          website: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.URL,
            label: "post.website.label",
            description: "post.website.description",
            placeholder: "post.website.placeholder",
            schema: z
              .union([z.string().url(), z.literal("")])
              .optional()
              .transform((v) => (v === "" ? undefined : v)),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.id",
            schema: z.uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            label: "post.response.name",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        details: {
          name: "Acme GmbH",
          type: CompanyType.B2B,
          vatNumber: "DE123456789",
          country: "DE",
          currency: "EUR",
          email: "contact@acme.example.com",
          phone: "+49 30 1234567",
          website: "https://acme.example.com",
        },
      },
      minimal: {
        details: {
          name: "Solo Ventures",
          type: CompanyType.INDIVIDUAL,
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "Acme GmbH",
        },
      },
      minimal: {
        result: {
          id: "456e7890-e89b-12d3-a456-426614174001",
          name: "Solo Ventures",
        },
      },
    },
  },
});

export type CompanyCreatePostRequestInput = typeof POST.types.RequestInput;
export type CompanyCreatePostRequestOutput = typeof POST.types.RequestOutput;
export type CompanyCreatePostResponseInput = typeof POST.types.ResponseInput;
export type CompanyCreatePostResponseOutput = typeof POST.types.ResponseOutput;

export type CompanyCreateRequestTypeOutput = CompanyCreatePostRequestOutput;

const definitions = {
  POST,
} as const;
export default definitions;
