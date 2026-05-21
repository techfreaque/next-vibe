import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
  submitButton,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const LicenseValidateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LicenseValidateContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "licenses", "validate"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "key",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaLicenses",
  tags: ["tags.corvina" as const, "tags.licenses" as const],
  aliases: ["corvina_licenses_validate"],

  fields: customWidgetObject({
    render: LicenseValidateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      licenseCode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.licenseCode.label" as const,
        description: "get.licenseCode.description" as const,
        placeholder: "get.licenseCode.placeholder" as const,
        columns: 12,
        schema: z.string(),
      }),
      licenseId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.licenseId" as const,
        schema: z.number(),
      }),
      productCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.productCode" as const,
        schema: z.string(),
      }),
      productLabel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.productLabel" as const,
        schema: z.string(),
      }),
      productType: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.productType" as const,
        schema: z.string(),
      }),
      productTrial: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.productTrial" as const,
        schema: z.boolean(),
      }),
      creationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.creationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      expirationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.expirationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      activationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.activationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      used: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.used" as const,
        schema: z.boolean(),
      }),
      code: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.code" as const,
        schema: z.string(),
      }),
      externalRef: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.externalRef" as const,
        schema: z.string().nullable().optional(),
      }),
      price: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.price" as const,
        schema: z.number().nullable().optional(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.currency" as const,
        schema: z.string().nullable().optional(),
      }),
      autorenew: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.autorenew" as const,
        schema: z.boolean(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable().optional(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "get.widget.title" as const,
        loadingText: "get.widget.noResult" as const,
        icon: "key",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

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
    requests: {
      default: { licenseCode: "XXXX-YYYY-ZZZZ-AAAA" },
    },
    responses: {
      default: {
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
        orgResourceId: null,
      },
    },
  },
});

export type LicenseValidateRequestOutput = typeof GET.types.RequestOutput;
export type LicenseValidateResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
