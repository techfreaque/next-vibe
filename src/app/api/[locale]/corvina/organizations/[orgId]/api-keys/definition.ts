import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
  responseArrayField,
  responseField,
  submitButton,
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

const ApiKeysListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ApiKeysListContainer })),
);

const ApiKeyCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.ApiKeyCreateContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "organizations", "[orgId]", "api-keys"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "key",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: ApiKeysListContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgId.label" as const,
        description: "get.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      keys: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.keys.id" as const,
              schema: z.number(),
            }),
            userId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.keys.userId" as const,
              schema: z.number(),
            }),
            organizationId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.keys.organizationId" as const,
              schema: z.number(),
            }),
            key: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "get.response.keys.key" as const,
              schema: z.string(),
            }),
          },
        }),
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
    urlPathParams: { default: { orgId: 45511 } },
    responses: {
      default: {
        keys: [
          {
            id: 1,
            userId: 100,
            organizationId: 45511,
            key: "abcdef1234567890",
          },
        ],
      },
    },
  },
});

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "organizations", "[orgId]", "api-keys"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "key",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.organizations" as const],

  fields: customWidgetObject({
    render: ApiKeyCreateContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgId.label" as const,
        description: "post.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      username: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.username.label" as const,
        description: "post.username.description" as const,
        placeholder: "post.username.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      id: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.id" as const,
        schema: z.number(),
      }),
      userId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.userId" as const,
        schema: z.number(),
      }),
      organizationId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.organizationId" as const,
        schema: z.number(),
      }),
      key: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.key" as const,
        schema: z.string(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "plus",
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
    urlPathParams: { default: { orgId: 45511 } },
    requests: { default: { username: "john.doe" } },
    responses: {
      default: {
        id: 1,
        userId: 100,
        organizationId: 45511,
        key: "abcdef1234567890abcdef1234567890",
      },
    },
  },
});

export type ApiKeysListUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;
export type ApiKeysListResponseOutput = typeof GET.types.ResponseOutput;
export type ApiKeysCreateRequestOutput = typeof POST.types.RequestOutput;
export type ApiKeysCreateResponseOutput = typeof POST.types.ResponseOutput;
export type ApiKeysCreateUrlVariablesOutput =
  typeof POST.types.UrlVariablesOutput;

const definitions = { GET, POST } as const;
export default definitions;
