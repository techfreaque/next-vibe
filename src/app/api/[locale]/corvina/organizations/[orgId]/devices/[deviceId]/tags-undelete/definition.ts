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

const TagsUndeleteContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.TagsUndeleteContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: [
    "corvina",
    "organizations",
    "[orgId]",
    "devices",
    "[deviceId]",
    "tags-undelete",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "rotate-ccw",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.devices" as const],

  fields: customWidgetObject({
    render: TagsUndeleteContainer,
    usage: { request: "data&urlPathParams", response: true } as const,
    children: {
      orgId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.orgId.label" as const,
        description: "post.orgId.description" as const,
        schema: z.coerce.number(),
      }),
      deviceId: requestUrlPathParamsField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.deviceId.label" as const,
        description: "post.deviceId.description" as const,
        schema: z.string().min(1),
      }),
      modelPath: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.modelPath.label" as const,
        description: "post.modelPath.description" as const,
        placeholder: "post.modelPath.placeholder" as const,
        columns: 12,
        schema: z.string().optional().default("**"),
      }),
      since: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.since.label" as const,
        description: "post.since.description" as const,
        placeholder: "post.since.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      to: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.to.label" as const,
        description: "post.to.description" as const,
        placeholder: "post.to.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      filterCondition: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.filterCondition.label" as const,
        description: "post.filterCondition.description" as const,
        placeholder: "post.filterCondition.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      undeletedCount: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.undeletedCount" as const,
        schema: z.number(),
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
    urlPathParams: {
      default: { orgId: 45564, deviceId: "sNgo2bZFPt6IgNEGFpOrrw" },
    },
    requests: {
      default: { modelPath: "**" },
    },
    responses: {
      default: { undeletedCount: 15 },
    },
  },
});

export type TagsUndeleteUrlVariablesOutput =
  typeof POST.types.UrlVariablesOutput;
export type TagsUndeleteRequestOutput = typeof POST.types.RequestOutput;
export type TagsUndeleteResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
