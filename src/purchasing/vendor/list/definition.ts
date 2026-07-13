/**
 * Vendor List API Route Definition
 * GET — list vendors for a company
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
  responseArrayField,
  responseField,
} from "next-vibe/unified-ui/_shared/utils";
import { z } from "zod";

import { scopedTranslation } from "../../i18n";
import { PURCHASING_VENDORS_ALIAS } from "./constants";

const VendorListWidget = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.VendorListWidget })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["purchasing", "vendor", "list"],
  aliases: [PURCHASING_VENDORS_ALIAS] as const,
  title: "vendorList.get.title" as const,
  titleShort: "vendorList.get.titleShort" as const,
  description: "vendorList.get.description" as const,
  category: "purchasing",
  subCategory: "Purchasing: Vendors",
  icon: "file" as const,
  tags: [
    "tags.purchasing" as const,
    "tags.vendor" as const,
    "tags.list" as const,
  ],
  allowedRoles: [UserRole.ADMIN] as const,
  defaultWebPinned: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    usage: { request: "data", response: true },
    render: VendorListWidget,
    children: {
      companyId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.ENTITY_PICKER,
        listEndpoint: async () =>
          (await import("@/companies/list/definition")).default.GET,
        labelField: "name",
        label: "vendorList.companyId.label" as const,
        description: "vendorList.companyId.description" as const,
        schema: z.string().uuid().optional(),
      }),

      vendors: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID_2_COLUMNS,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "vendorList.get.response.id" as const,
              hidden: true,
              schema: z.uuid(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "vendorList.get.response.name" as const,
              schema: z.string(),
            }),
            code: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "vendorList.get.response.code" as const,
              schema: z.string().nullable(),
            }),
            email: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "vendorList.get.response.email" as const,
              schema: z.string().nullable(),
            }),
            vatNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "vendorList.get.response.vatNumber" as const,
              schema: z.string().nullable(),
            }),
            defaultCurrency: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "vendorList.get.response.defaultCurrency" as const,
              schema: z.string(),
            }),
            defaultPaymentTermsDays: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content:
                "vendorList.get.response.defaultPaymentTermsDays" as const,
              schema: z.number().nullable(),
            }),
            isActive: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "vendorList.get.response.isActive" as const,
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              label: "vendorList.get.response.createdAt" as const,
              fieldType: FieldDataType.DATETIME,
              schema: z.coerce.date(),
            }),
          },
        }),
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
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "vendorList.get.errors.validation.title" as const,
      description: "vendorList.get.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "vendorList.get.errors.unauthorized.title" as const,
      description: "vendorList.get.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "vendorList.get.errors.forbidden.title" as const,
      description: "vendorList.get.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "vendorList.get.errors.conflict.title" as const,
      description: "vendorList.get.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "vendorList.get.errors.server.title" as const,
      description: "vendorList.get.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "vendorList.get.errors.unknown.title" as const,
      description: "vendorList.get.errors.unknown.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "vendorList.get.errors.network.title" as const,
      description: "vendorList.get.errors.network.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "vendorList.get.errors.notFound.title" as const,
      description: "vendorList.get.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "vendorList.get.errors.unsavedChanges.title" as const,
      description: "vendorList.get.errors.unsavedChanges.description" as const,
    },
  },

  successTypes: {
    title: "vendorList.get.success.title" as const,
    description: "vendorList.get.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        companyId: undefined,
      },
    },
    responses: {
      default: {
        vendors: [
          {
            id: "456e7890-e89b-12d3-a456-426614174000",
            name: "Acme GmbH",
            code: "ACM-001",
            email: "orders@acme.com",
            vatNumber: "DE123456789",
            defaultCurrency: "EUR",
            defaultPaymentTermsDays: 30,
            isActive: true,
            createdAt: new Date("2024-01-01T00:00:00.000Z"),
          },
        ],
      },
    },
  },
});

export type VendorListGetRequestOutput = typeof GET.types.RequestOutput;
export type VendorListGetResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
