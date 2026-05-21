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

const LicenseTrialContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LicenseTrialContainer })),
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

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "licenses", "trial"],
  allowedRoles: [UserRole.ADMIN] as const,
  title: "post.title" as const,
  description: "post.description" as const,
  icon: "key",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.licenses" as const],
  aliases: ["corvina_licenses_trial_create"],
  fields: customWidgetObject({
    render: LicenseTrialContainer,
    usage: { request: "data", response: true } as const,
    children: {
      deviceLicense: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.deviceLicense.label" as const,
        description: "post.deviceLicense.description" as const,
        placeholder: "post.deviceLicense.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      targetOrganization: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.targetOrganization.label" as const,
        description: "post.targetOrganization.description" as const,
        placeholder: "post.targetOrganization.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      ownerOrganization: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.ownerOrganization.label" as const,
        description: "post.ownerOrganization.description" as const,
        placeholder: "post.ownerOrganization.placeholder" as const,
        columns: 6,
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
      expirationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.expirationDate" as const,
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
      externalRef: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.externalRef" as const,
        schema: z.string().nullable().optional(),
      }),
      price: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.price" as const,
        schema: z.number().nullable().optional(),
      }),
      currency: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.currency" as const,
        schema: z.string().nullable().optional(),
      }),
      autorenew: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.autorenew" as const,
        schema: z.boolean(),
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
        deviceLicense: "XXXX-YYYY-ZZZZ-AAAA",
        targetOrganization: "exorde.connex.connectika",
      },
    },
    responses: { default: exampleTrialLicense },
  },
});

export type LicenseTrialCreateRequestOutput = typeof POST.types.RequestOutput;
export type LicenseTrialCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
