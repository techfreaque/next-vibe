/**
 * User Addresses API Endpoint Definitions
 * GET - list all addresses for the authenticated user
 * POST - create a new address
 */

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
import { lazyWidget } from "next-vibe-ui/unified/_shared/lazy-widget";

import { UserRole } from "../../../user-roles/enum";
import { scopedTranslation } from "./i18n";

const UserAddressesContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserAddressesContainer })),
);

const UserAddressCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.UserAddressCreateContainer })),
);

/**
 * GET /user/private/me/addresses - list all addresses
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["user", "private", "me", "addresses"],
  title: "list.title" as const,
  titleShort: "list.titleShort" as const,
  description: "list.description" as const,
  icon: "list",
  category: "account",
  tags: ["tag" as const],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
  ] as const,

  fields: customWidgetObject({
    render: UserAddressesContainer,
    usage: { response: true } as const,
    children: {
      addresses: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        hidden: true,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.STACKED,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.id" as const,
              schema: z.uuid(),
            }),
            label: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string(),
            }),
            fullName: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string().nullable(),
            }),
            company: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string().nullable(),
            }),
            phone: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string().nullable(),
            }),
            vatNumber: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string().nullable(),
            }),
            taxId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string().nullable(),
            }),
            addressLine1: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string(),
            }),
            addressLine2: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string().nullable(),
            }),
            city: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string(),
            }),
            region: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string().nullable(),
            }),
            postalCode: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string().nullable(),
            }),
            country: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string(),
            }),
            isDefaultBilling: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "create.response.label" as const,
              schema: z.boolean(),
            }),
            isDefaultDelivery: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              text: "create.response.label" as const,
              schema: z.boolean(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "create.response.label" as const,
              schema: z.string(),
            }),
          },
        }),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "list.errors.validation.title" as const,
      description: "list.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "list.errors.unauthorized.title" as const,
      description: "list.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "list.errors.forbidden.title" as const,
      description: "list.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "list.errors.notFound.title" as const,
      description: "list.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "list.errors.conflict.title" as const,
      description: "list.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "list.errors.network.title" as const,
      description: "list.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "list.errors.unsavedChanges.title" as const,
      description: "list.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "list.errors.internal.title" as const,
      description: "list.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "list.errors.unknown.title" as const,
      description: "list.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "list.success.title" as const,
    description: "list.success.description" as const,
  },

  examples: {
    responses: {
      default: {
        addresses: [],
      },
    },
  },
});

/**
 * POST /user/private/me/addresses - create a new address
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "private", "me", "addresses"],
  title: "create.title" as const,
  titleShort: "create.titleShort" as const,
  description: "create.description" as const,
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
    render: UserAddressCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      addressLabel: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.label.label" as const,
        description: "create.fields.label.description" as const,
        placeholder: "create.fields.label.placeholder" as const,
        columns: 12,
        schema: z.string().max(100).default("Default"),
      }),

      fullName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.fullName.label" as const,
        description: "create.fields.fullName.description" as const,
        placeholder: "create.fields.fullName.placeholder" as const,
        columns: 6,
        schema: z.string().max(200).optional().nullable(),
      }),

      company: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.company.label" as const,
        description: "create.fields.company.description" as const,
        placeholder: "create.fields.company.placeholder" as const,
        columns: 6,
        schema: z.string().max(200).optional().nullable(),
      }),

      phone: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEL,
        label: "create.fields.phone.label" as const,
        description: "create.fields.phone.description" as const,
        placeholder: "create.fields.phone.placeholder" as const,
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
        label: "create.fields.vatNumber.label" as const,
        description: "create.fields.vatNumber.description" as const,
        placeholder: "create.fields.vatNumber.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional().nullable(),
      }),

      taxId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.taxId.label" as const,
        description: "create.fields.taxId.description" as const,
        placeholder: "create.fields.taxId.placeholder" as const,
        columns: 6,
        schema: z.string().max(50).optional().nullable(),
      }),

      addressLine1: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.addressLine1.label" as const,
        description: "create.fields.addressLine1.description" as const,
        placeholder: "create.fields.addressLine1.placeholder" as const,
        columns: 12,
        schema: z.string().max(255),
      }),

      addressLine2: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.addressLine2.label" as const,
        description: "create.fields.addressLine2.description" as const,
        placeholder: "create.fields.addressLine2.placeholder" as const,
        columns: 12,
        schema: z.string().max(255).optional().nullable(),
      }),

      city: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.city.label" as const,
        description: "create.fields.city.description" as const,
        placeholder: "create.fields.city.placeholder" as const,
        columns: 6,
        schema: z.string().max(100),
      }),

      region: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.region.label" as const,
        description: "create.fields.region.description" as const,
        placeholder: "create.fields.region.placeholder" as const,
        columns: 6,
        schema: z.string().max(100).optional().nullable(),
      }),

      postalCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.postalCode.label" as const,
        description: "create.fields.postalCode.description" as const,
        placeholder: "create.fields.postalCode.placeholder" as const,
        columns: 6,
        schema: z.string().max(20).optional().nullable(),
      }),

      country: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "create.fields.country.label" as const,
        description: "create.fields.country.description" as const,
        placeholder: "create.fields.country.placeholder" as const,
        columns: 6,
        schema: z.string().length(2).toUpperCase(),
      }),

      isDefaultBilling: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "create.fields.isDefaultBilling.label" as const,
        description: "create.fields.isDefaultBilling.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),

      isDefaultDelivery: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "create.fields.isDefaultDelivery.label" as const,
        description: "create.fields.isDefaultDelivery.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),

      // Response
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "create.response.id" as const,
        schema: z.uuid(),
      }),
      responseLabel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "create.response.label" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "create.errors.validation.title" as const,
      description: "create.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "create.errors.unauthorized.title" as const,
      description: "create.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "create.errors.forbidden.title" as const,
      description: "create.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "create.errors.notFound.title" as const,
      description: "create.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "create.errors.conflict.title" as const,
      description: "create.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "create.errors.network.title" as const,
      description: "create.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "create.errors.unsavedChanges.title" as const,
      description: "create.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "create.errors.internal.title" as const,
      description: "create.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "create.errors.unknown.title" as const,
      description: "create.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "create.success.title" as const,
    description: "create.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        addressLabel: "Home",
        fullName: "Jane Doe",
        addressLine1: "123 Main St",
        city: "Berlin",
        country: "DE",
        isDefaultBilling: true,
        isDefaultDelivery: false,
      },
    },
    responses: {
      default: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        responseLabel: "Home",
      },
    },
  },
});

const userAddressesEndpoints = { GET, POST } as const;
export default userAddressesEndpoints;

export type UserAddressesGetResponseOutput = typeof GET.types.ResponseOutput;
export type UserAddressesPostRequestOutput = typeof POST.types.RequestOutput;
export type UserAddressesPostResponseOutput = typeof POST.types.ResponseOutput;
