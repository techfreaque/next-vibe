import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestResponseField,
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

const LimitsListContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LimitsListContainer })),
);
const LimitsCreateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LimitsCreateContainer })),
);
const LimitsUpdateContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.LimitsUpdateContainer })),
);

const limitItemChildren = {
  resourceType: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.limits.resourceType" as const,
    schema: z.string(),
  }),
  quantity: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.limits.quantity" as const,
    schema: z.number(),
  }),
  used: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.limits.used" as const,
    schema: z.number(),
  }),
  targetOrganization: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.limits.targetOrganization" as const,
    schema: z.string().nullable(),
  }),
  grantingOrganization: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.limits.grantingOrganization" as const,
    schema: z.string().nullable(),
  }),
  orgResourceId: responseField(scopedTranslation, {
    type: WidgetType.TEXT,
    content: "get.response.limits.orgResourceId" as const,
    schema: z.string().nullable(),
  }),
};

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "limits", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "bar-chart-2",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.limits" as const],
  aliases: ["corvina_limits_list"],

  fields: customWidgetObject({
    render: LimitsListContainer,
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
      status: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.status.label" as const,
        description: "get.status.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.orgResourceId.label" as const,
        description: "get.orgResourceId.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      limits: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: limitItemChildren,
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
        limits: [
          {
            resourceType: "DEVICE",
            quantity: 100,
            used: 42,
            targetOrganization: "exorde.connex",
            grantingOrganization: "corvina.root",
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

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "limits", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "plus-circle",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.limits" as const],
  aliases: ["corvina_limits_create"],

  fields: customWidgetObject({
    render: LimitsCreateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      resourceType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.resourceType.label" as const,
        description: "post.resourceType.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      quantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.quantity.label" as const,
        description: "post.quantity.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      orgResourceId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgResourceId.label" as const,
        description: "post.orgResourceId.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      targetOrganization: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.limits.targetOrganization" as const,
        schema: z.string().nullable(),
      }),
      grantingOrganization: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.limits.grantingOrganization" as const,
        schema: z.string().nullable(),
      }),
      used: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.limits.used" as const,
        schema: z.number(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.submitButton.label" as const,
        loadingText: "post.submitButton.loadingText" as const,
        icon: "plus-circle",
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
        resourceType: "DEVICE",
        quantity: 100,
        orgResourceId: "exorde.connex.connectika",
      },
    },
    responses: {
      default: {
        resourceType: "DEVICE",
        quantity: 100,
        used: 0,
        targetOrganization: "exorde.connex",
        grantingOrganization: "corvina.root",
        orgResourceId: "exorde.connex.connectika",
      },
    },
  },
});

const { PUT } = createEndpoint({
  scopedTranslation,
  method: Methods.PUT,
  path: ["corvina", "limits", "list"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "put.title" as const,
  description: "put.description" as const,
  icon: "edit",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvina",
  tags: ["tags.corvina" as const, "tags.limits" as const],
  aliases: ["corvina_limits_update"],

  fields: customWidgetObject({
    render: LimitsUpdateContainer,
    usage: { request: "data", response: true } as const,
    children: {
      resourceType: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.resourceType.label" as const,
        description: "put.resourceType.description" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      quantity: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "put.quantity.label" as const,
        description: "put.quantity.description" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      orgResourceId: requestResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "put.orgResourceId.label" as const,
        description: "put.orgResourceId.description" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      targetOrganization: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.limits.targetOrganization" as const,
        schema: z.string().nullable(),
      }),
      grantingOrganization: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.limits.grantingOrganization" as const,
        schema: z.string().nullable(),
      }),
      used: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.limits.used" as const,
        schema: z.number(),
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "put.submitButton.label" as const,
        loadingText: "put.submitButton.loadingText" as const,
        icon: "save",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "put.errors.unauthorized.title" as const,
      description: "put.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "put.errors.validation.title" as const,
      description: "put.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "put.errors.forbidden.title" as const,
      description: "put.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "put.errors.notFound.title" as const,
      description: "put.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "put.errors.conflict.title" as const,
      description: "put.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "put.errors.server.title" as const,
      description: "put.errors.server.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "put.errors.network.title" as const,
      description: "put.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "put.errors.unsavedChanges.title" as const,
      description: "put.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "put.errors.unknown.title" as const,
      description: "put.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "put.success.title" as const,
    description: "put.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        resourceType: "DEVICE",
        quantity: 200,
        orgResourceId: "exorde.connex.connectika",
      },
    },
    responses: {
      default: {
        resourceType: "DEVICE",
        quantity: 200,
        used: 42,
        targetOrganization: "exorde.connex",
        grantingOrganization: "corvina.root",
        orgResourceId: "exorde.connex.connectika",
      },
    },
  },
});

export type LimitsListRequestOutput = typeof GET.types.RequestOutput;
export type LimitsListResponseOutput = typeof GET.types.ResponseOutput;
export type LimitsCreateRequestOutput = typeof POST.types.RequestOutput;
export type LimitsCreateResponseOutput = typeof POST.types.ResponseOutput;
export type LimitsUpdateRequestOutput = typeof PUT.types.RequestOutput;
export type LimitsUpdateResponseOutput = typeof PUT.types.ResponseOutput;

const definitions = { GET, POST, PUT } as const;
export default definitions;
