import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  requestUrlPathParamsField,
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

const TagsDeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TagsDeleteContainer })),
);

const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: [
    "corvina",
    "organizations",
    "[orgId]",
    "devices",
    "[deviceId]",
    "tags-delete",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "delete.title" as const,
  description: "delete.description" as const,
  icon: "trash",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.devices" as const],

  fields: customWidgetObject({
    render: TagsDeleteContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.orgId.label" as const,
        description: "delete.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      deviceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.deviceId.label" as const,
        description: "delete.deviceId.description" as const,
        schema: z.string().min(1),
      }),
      modelPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.modelPath.label" as const,
        description: "delete.modelPath.description" as const,
        placeholder: "delete.modelPath.placeholder" as const,
        columns: 12,
        schema: z.string().optional().default("**"),
      }),
      since: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.since.label" as const,
        description: "delete.since.description" as const,
        placeholder: "delete.since.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.to.label" as const,
        description: "delete.to.description" as const,
        placeholder: "delete.to.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      filterCondition: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "delete.filterCondition.label" as const,
        description: "delete.filterCondition.description" as const,
        placeholder: "delete.filterCondition.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      deletedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.deletedCount" as const,
        schema: z.number(),
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
    urlPathParams: {
      default: { orgId: 45564, deviceId: "sNgo2bZFPt6IgNEGFpOrrw" },
    },
    requests: {
      default: { modelPath: "**" },
    },
    responses: {
      default: { deletedCount: 42 },
    },
  },
});

export type TagsDeleteUrlVariablesOutput =
  typeof DELETE.types.UrlVariablesOutput;
export type TagsDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type TagsDeleteResponseOutput = typeof DELETE.types.ResponseOutput;

const definitions = { DELETE } as const;
export default definitions;
