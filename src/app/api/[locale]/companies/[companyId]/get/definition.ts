/**
 * Company Get API Route Definition
 * Returns company details for a member of that company
 */

import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";
import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
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

import { CompanyType, CompanyTypeOptions } from "../../enum";
import { scopedTranslation } from "./i18n";

const CompanyGetWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.CompanyGetWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["companies", "[companyId]", "get"],
  title: "get.title",
  titleShort: "get.titleShort",
  description: "get.description",
  category: "companies",
  subCategory: "Company Management",
  tags: ["tags.companies", "tags.get"],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  icon: "building",

  fields: customWidgetObject({
    usage: { request: "urlPathParams", response: true },
    render: CompanyGetWidget,
    children: {
      companyId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        label: "get.companyId.label",
        description: "get.companyId.description",
        hidden: true,
        schema: z.uuid(),
        listEndpoint: async () =>
          (await import("@/app/api/[locale]/companies/list/definition")).default
            .GET,
        labelField: "name",
      }),

      // Response
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        hidden: true,
        schema: z.uuid(),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string(),
      }),
      type: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        enumOptions: CompanyTypeOptions,
        schema: z.enum(CompanyType),
      }),
      vatNumber: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      taxId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      country: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      email: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      phone: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.string().nullable(),
      }),
      website: responseField(scopedTranslation, {
        type: WidgetType.LINK,
        schema: z.string().nullable(),
      }),
      isActive: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        schema: z.boolean(),
      }),
      createdAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        fieldType: FieldDataType.DATETIME,
        schema: z.coerce.date(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        fieldType: FieldDataType.DATETIME,
        schema: z.coerce.date(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title",
      description: "get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title",
      description: "get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title",
      description: "get.errors.forbidden.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title",
      description: "get.errors.conflict.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title",
      description: "get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title",
      description: "get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title",
      description: "get.errors.network.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title",
      description: "get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title",
      description: "get.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "get.success.title",
    description: "get.success.description",
  },

  examples: {
    urlPathParams: {
      default: {
        companyId: "123e4567-e89b-12d3-a456-426614174000",
      },
    },
    responses: {
      default: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Acme GmbH",
        type: CompanyType.B2B,
        vatNumber: "DE123456789",
        taxId: null,
        country: "DE",
        currency: "EUR",
        email: "contact@acme.example.com",
        phone: "+49 30 1234567",
        website: "https://acme.example.com",
        isActive: true,
        createdAt: new Date("2024-01-01T00:00:00.000Z"),
        updatedAt: new Date("2024-01-01T00:00:00.000Z"),
      },
    },
  },
});

export type CompanyGetRequestOutput = typeof GET.types.RequestOutput;
export type CompanyGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = {
  GET,
} as const;
export default definitions;
