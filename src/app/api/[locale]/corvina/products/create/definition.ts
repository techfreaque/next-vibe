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

const ProductCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ProductCreateContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "products", "create"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "box",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.products" as const],
  aliases: ["corvina_products_create"],

  fields: customWidgetObject({
    render: ProductCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      code: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.code.label" as const,
        description: "post.code.description" as const,
        placeholder: "post.code.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      type: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.type.label" as const,
        description: "post.type.description" as const,
        placeholder: "post.type.placeholder" as const,
        columns: 6,
        schema: z.string().min(1),
      }),
      productLabel: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.productLabel.label" as const,
        description: "post.productLabel.description" as const,
        placeholder: "post.productLabel.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      trial: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.trial.label" as const,
        description: "post.trial.description" as const,
        columns: 6,
        schema: z.boolean().default(false),
      }),
      autorenewDefaultValueForNewLicenses: requestResponseField(
        scopedTranslation,
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "post.autorenewDefaultValueForNewLicenses.label" as const,
          description:
            "post.autorenewDefaultValueForNewLicenses.description" as const,
          columns: 6,
          schema: z.boolean().default(false),
        },
      ),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgResourceId.label" as const,
        description: "post.orgResourceId.description" as const,
        placeholder: "post.orgResourceId.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number(),
      }),
      dealer: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.dealer" as const,
        schema: z.boolean(),
      }),
      creationDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.creationDate" as const,
        schema: z.number().nullable().optional(),
      }),
      lastModified: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.lastModified" as const,
        schema: z.number().nullable().optional(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "box",
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
        code: "CORVINA_STANDARD",
        type: "STANDARD",
        productLabel: "Corvina Standard",
        trial: false,
        autorenewDefaultValueForNewLicenses: true,
      },
    },
    responses: {
      default: {
        id: 42,
        code: "CORVINA_STANDARD",
        type: "STANDARD",
        productLabel: "Corvina Standard",
        dealer: false,
        trial: false,
        creationDate: 1700000000000,
        lastModified: 1700000000000,
        autorenewDefaultValueForNewLicenses: true,
      },
    },
  },
});

export type ProductCreateRequestOutput = typeof POST.types.RequestOutput;
export type ProductCreateResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
