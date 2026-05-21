import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestResponseField,
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

const LicenseCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LicenseCreateContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "licenses", "create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "key",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaLicenses",
  tags: ["tags.corvina" as const, "tags.licenses" as const],
  aliases: ["corvina_licenses_create"],

  fields: customWidgetObject({
    render: LicenseCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      productId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.productId.label" as const,
        description: "post.productId.description" as const,
        placeholder: "post.productId.placeholder" as const,
        columns: 6,
        schema: z.coerce.number(),
      }),
      autorenew: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.autorenew.label" as const,
        description: "post.autorenew.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      expirationDate: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.expirationDate.label" as const,
        description: "post.expirationDate.description" as const,
        placeholder: "post.expirationDate.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().nullable().optional(),
      }),
      price: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.price.label" as const,
        description: "post.price.description" as const,
        placeholder: "post.price.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().nullable().optional(),
      }),
      currency: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.currency.label" as const,
        description: "post.currency.description" as const,
        placeholder: "post.currency.placeholder" as const,
        columns: 6,
        schema: z.string().nullable().optional(),
      }),
      externalRef: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.externalRef.label" as const,
        description: "post.externalRef.description" as const,
        placeholder: "post.externalRef.placeholder" as const,
        columns: 12,
        schema: z.string().nullable().optional(),
      }),
      targetOrgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.targetOrgResourceId.label" as const,
        description: "post.targetOrgResourceId.description" as const,
        placeholder: "post.targetOrgResourceId.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      licenseId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.licenseId" as const,
        schema: z.number(),
      }),
      productCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.productCode" as const,
        schema: z.string(),
      }),
      productLabel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.productLabel" as const,
        schema: z.string(),
      }),
      productType: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.productType" as const,
        schema: z.string(),
      }),
      productTrial: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.productTrial" as const,
        schema: z.boolean(),
      }),
      creationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.creationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      activationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.activationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      used: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.used" as const,
        schema: z.boolean(),
      }),
      code: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.code" as const,
        schema: z.string(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.orgResourceId" as const,
        schema: z.string().nullable().optional(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "key",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title" as const,
      description: "post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title" as const,
      description: "post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title" as const,
      description: "post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title" as const,
      description: "post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title" as const,
      description: "post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title" as const,
      description: "post.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title" as const,
      description: "post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title" as const,
      description: "post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title" as const,
      description: "post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "post.success.title" as const,
    description: "post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        productId: 42,
        autorenew: true,
        expirationDate: 1800000000000,
        currency: "EUR",
        price: 99.0,
      },
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
        activationDate: null,
        used: false,
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

export type LicenseCreateRequestOutput = typeof POST.types.RequestOutput;
export type LicenseCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
