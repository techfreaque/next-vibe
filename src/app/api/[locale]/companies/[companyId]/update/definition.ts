/**
 * Company Update API Route Definition
 * PATCH company details — requires ADMIN or OWNER role
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import companyListDefinitions from "@/app/api/[locale]/companies/list/definition";
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

import { CompanyType, CompanyTypeOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

const CompanyUpdateWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CompanyUpdateWidget })),
);

const { PATCH } = createEndpoint({
  scopedTranslation,
  method: Methods.PATCH,
  path: ["companies", "[companyId]", "update"],
  title: "patch.title",
  titleShort: "patch.titleShort",
  description: "patch.description",
  category: "companies",
  subCategory: "Company Management",
  tags: ["tags.companies", "tags.update"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  icon: "building",

  fields: customWidgetObject({
    usage: { request: "data&urlPathParams", response: true },
    render: CompanyUpdateWidget,
    children: {
      // URL path parameter
      companyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "patch.companyId.label",
        description: "patch.companyId.description",
        hidden: true,
        schema: z.uuid(),
        listEndpoint: companyListDefinitions.GET,
        labelField: "name",
      }),

      // Request data fields
      fields: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.GRID_2_COLUMNS,
        usage: { request: "data" },
        children: {
          name: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.name.label",
            description: "patch.name.description",
            placeholder: "patch.name.placeholder",
            schema: z.string().min(1).max(255).optional(),
          }),
          type: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.SELECT,
            label: "patch.type.label",
            description: "patch.type.description",
            placeholder: "patch.type.placeholder",
            options: CompanyTypeOptions,
            schema: z.enum(CompanyType).optional(),
          }),
          vatNumber: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.vatNumber.label",
            description: "patch.vatNumber.description",
            placeholder: "patch.vatNumber.placeholder",
            schema: z.string().max(50).optional(),
          }),
          country: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.country.label",
            description: "patch.country.description",
            placeholder: "patch.country.placeholder",
            schema: z.string().max(10).optional(),
          }),
          currency: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEXT,
            label: "patch.currency.label",
            description: "patch.currency.description",
            placeholder: "patch.currency.placeholder",
            schema: z.string().length(3).optional(),
          }),
          email: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.EMAIL,
            label: "patch.email.label",
            description: "patch.email.description",
            placeholder: "patch.email.placeholder",
            schema: z
              .union([z.string().email(), z.literal("")])
              .optional()
              .transform((v) => (v === "" ? undefined : v)),
          }),
          phone: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.TEL,
            label: "patch.phone.label",
            description: "patch.phone.description",
            placeholder: "patch.phone.placeholder",
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
            label: "patch.website.label",
            description: "patch.website.description",
            placeholder: "patch.website.placeholder",
            schema: z
              .union([z.string().url(), z.literal("")])
              .optional()
              .transform((v) => (v === "" ? undefined : v)),
          }),
        },
      }),

      // Response fields
      result: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        layoutType: LayoutType.STACKED,
        usage: { response: true },
        children: {
          id: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "patch.response.id",
            hidden: true,
            schema: z.uuid(),
          }),
          name: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "patch.response.name",
            schema: z.string(),
          }),
        },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "patch.errors.validation.title",
      description: "patch.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "patch.errors.unauthorized.title",
      description: "patch.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "patch.errors.forbidden.title",
      description: "patch.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "patch.errors.conflict.title",
      description: "patch.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "patch.errors.server.title",
      description: "patch.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "patch.errors.unknown.title",
      description: "patch.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "patch.errors.network.title",
      description: "patch.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "patch.errors.notFound.title",
      description: "patch.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "patch.errors.unsavedChanges.title",
      description: "patch.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "patch.success.title",
    description: "patch.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    requests: {
      default: {
        fields: {
          name: "Acme GmbH Updated",
          email: "new@acme.example.com",
        },
      },
    },
    responses: {
      default: {
        result: {
          id: "123e4567-e89b-12d3-a456-426614174000",
          name: "Acme GmbH Updated",
        },
      },
    },
  },
});

export type CompanyUpdateRequestOutput = typeof PATCH.types.RequestOutput;

const definitions = {
  PATCH,
} as const;
export default definitions;
