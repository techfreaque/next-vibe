import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
  requestUrlPathParamsField,
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
import { lazyWidget } from "@/app/api/[locale]/system/unified-interface/unified-ui/widgets/_shared/lazy-widget";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";

const TagQueryContainer = lazyWidget(() =>
  import("./widget.cli").then((m) => ({ default: m.TagQueryContainer })),
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
    "tags-query",
  ],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "search",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.devices" as const],

  fields: customWidgetObject({
    render: TagQueryContainer,
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
        schema: z.string().optional(),
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
      limit: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.limit.label" as const,
        description: "post.limit.description" as const,
        placeholder: "post.limit.placeholder" as const,
        columns: 6,
        schema: z.coerce.number().optional(),
      }),
      mode: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.mode.label" as const,
        description: "post.mode.description" as const,
        columns: 6,
        schema: z
          .enum(["READ", "WRITE", "READ_HISTORY", "WRITE_HISTORY"])
          .optional(),
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
      results: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        columns: 12,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          layoutType: LayoutType.GRID,
          columns: 12,
          usage: { response: true },
          children: {
            deviceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.deviceId" as const,
              schema: z.string(),
            }),
            modelPath: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.modelPath" as const,
              schema: z.string(),
            }),
            rowCount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.rowCount" as const,
              schema: z.number(),
            }),
            latestValue: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.latestValue" as const,
              schema: z.string().nullable(),
            }),
            latestTimestamp: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.latestTimestamp" as const,
              schema: dateSchema.nullable(),
            }),
          },
        }),
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
      default: { modelPath: "**", limit: 100 },
    },
    responses: {
      default: {
        results: [
          {
            deviceId: "sNgo2bZFPt6IgNEGFpOrrw",
            modelPath: "Test_Model:1/Codesys_Heartbeat",
            rowCount: 42,
            latestValue: "115",
            latestTimestamp: 1777988877985,
          },
        ],
      },
    },
  },
});

export type TagQueryUrlVariablesOutput = typeof POST.types.UrlVariablesOutput;
export type TagQueryRequestOutput = typeof POST.types.RequestOutput;
export type TagQueryResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
