import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const LicenseListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LicenseListContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "licenses", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "key",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaLicenses",
  tags: ["tags.corvina" as const, "tags.licenses" as const],
  aliases: ["corvina_licenses_list"],

  fields: customWidgetObject({
    render: LicenseListContainer,
    usage: { request: "data", response: true } as const,
    children: {
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.page.label" as const,
        description: "get.page.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).optional().default(0),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "get.pageSize.label" as const,
        description: "get.pageSize.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).optional().default(10),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgResourceId.label" as const,
        description: "get.orgResourceId.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      licenses: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            licenseId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.licenseId" as const,
              schema: z.number(),
            }),
            productCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.productCode" as const,
              schema: z.string(),
            }),
            productLabel: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.productLabel" as const,
              schema: z.string(),
            }),
            productType: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.licenses.productType" as const,
              schema: z.string(),
            }),
            productTrial: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.licenses.productTrial" as const,
              schema: z.boolean(),
            }),
            creationDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.creationDate" as const,
              schema: z.number(),
            }),
            expirationDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.expirationDate" as const,
              schema: z.number().nullable(),
            }),
            activationDate: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.activationDate" as const,
              schema: z.number().nullable(),
            }),
            used: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.licenses.used" as const,
              schema: z.boolean(),
            }),
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.code" as const,
              schema: z.string(),
            }),
            externalRef: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.externalRef" as const,
              schema: z.string().nullable(),
            }),
            price: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.price" as const,
              schema: z.number().nullable(),
            }),
            currency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.currency" as const,
              schema: z.string().nullable(),
            }),
            autorenew: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "get.response.licenses.autorenew" as const,
              schema: z.boolean(),
            }),
            orgResourceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.licenses.orgResourceId" as const,
              schema: z.string().nullable(),
            }),
          },
        }),
      }),
      total: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.total" as const,
        schema: z.coerce.number(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.totalPages" as const,
        schema: z.coerce.number(),
      }),
      currentPage: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currentPage" as const,
        schema: z.coerce.number(),
      }),
    },
  }),

  options: {
    formOptions: {
      autoSubmit: true,
      debounceMs: 300,
    },
  },

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "get.errors.unauthorized.title" as const,
      description: "get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "get.errors.validation.title" as const,
      description: "get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "get.errors.forbidden.title" as const,
      description: "get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "get.errors.notFound.title" as const,
      description: "get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "get.errors.conflict.title" as const,
      description: "get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "get.errors.server.title" as const,
      description: "get.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "get.errors.network.title" as const,
      description: "get.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "get.errors.unsavedChanges.title" as const,
      description: "get.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "get.errors.unknown.title" as const,
      description: "get.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "get.success.title" as const,
    description: "get.success.description" as const,
  },

  examples: {
    requests: { default: { page: 0, pageSize: 10 } },
    responses: {
      default: {
        licenses: [
          {
            licenseId: 1001,
            productCode: "CORVINA_STANDARD",
            productLabel: "Corvina Standard",
            productType: "STANDARD",
            productTrial: false,
            creationDate: 1700000000000,
            expirationDate: 1800000000000,
            activationDate: 1700100000000,
            used: true,
            code: "XXXX-YYYY-ZZZZ-AAAA",
            externalRef: null,
            price: 99.0,
            currency: "EUR",
            autorenew: true,
            orgResourceId: "exorde.connex.connectika",
          },
        ],
        total: 1,
        totalPages: 1,
        currentPage: 0,
      },
    },
  },
});

export type LicenseListRequestOutput = typeof GET.types.RequestOutput;
export type LicenseListResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
