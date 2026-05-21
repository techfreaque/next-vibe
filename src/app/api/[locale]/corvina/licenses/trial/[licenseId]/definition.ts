import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestUrlPathParamsResponseField,
  responseField,
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

const LicenseTrialDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LicenseTrialDeleteContainer })),
);

const exampleTrialLicense = {
  licenseId: 2001,
  productCode: "CORVINA_TRIAL",
  productLabel: "Corvina Trial",
  productType: "TRIAL",
  productTrial: true,
  creationDate: 1700000000000,
  expirationDate: 1702592000000,
  activationDate: 1700000000000,
  used: false,
  code: "TRIAL-XXXX-YYYY-ZZZZ",
  externalRef: null,
  price: null,
  currency: null,
  autorenew: false,
  orgResourceId: null,
};

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["corvina", "licenses", "trial", "[licenseId]"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaLicenses",
  tags: ["tags.corvina" as const, "tags.licenses" as const],
  aliases: ["corvina_licenses_trial_delete"],
  fields: customWidgetObject({
    render: LicenseTrialDeleteContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      licenseId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "delete.licenseId.label" as const,
        description: "delete.licenseId.description" as const,
        schema: z.coerce.number(),
      }),
      productCode: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.productCode" as const,
        schema: z.string(),
      }),
      productLabel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.productLabel" as const,
        schema: z.string(),
      }),
      productType: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "delete.response.productType" as const,
        schema: z.string(),
      }),
      productTrial: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "delete.response.productTrial" as const,
        schema: z.boolean(),
      }),
      creationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.creationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      expirationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.expirationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      activationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.activationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      used: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "delete.response.used" as const,
        schema: z.boolean(),
      }),
      code: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.code" as const,
        schema: z.string(),
      }),
      externalRef: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.externalRef" as const,
        schema: z.string().nullable().optional(),
      }),
      price: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.price" as const,
        schema: z.number().nullable().optional(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.currency" as const,
        schema: z.string().nullable().optional(),
      }),
      autorenew: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "delete.response.autorenew" as const,
        schema: z.boolean(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.orgResourceId" as const,
        schema: z.string().nullable().optional(),
      }),
    },
  }),
  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title" as const,
      description: "delete.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title" as const,
      description: "delete.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title" as const,
      description: "delete.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title" as const,
      description: "delete.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title" as const,
      description: "delete.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.server.title" as const,
      description: "delete.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title" as const,
      description: "delete.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsavedChanges.title" as const,
      description: "delete.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title" as const,
      description: "delete.errors.unknown.description" as const,
    },
  },
  successTypes: {
    title: "delete.success.title" as const,
    description: "delete.success.description" as const,
  },
  examples: {
    urlPathParams: { default: { licenseId: 2001 } },
    responses: { default: exampleTrialLicense },
  },
});

export type LicenseTrialDeleteUrlParamsOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type LicenseTrialDeleteResponseOutput =
  typeof DELETE.types.ResponseOutput;

const definitions = { DELETE } as const;
export default definitions;
