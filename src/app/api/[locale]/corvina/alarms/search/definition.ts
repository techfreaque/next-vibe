import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectField,
  requestField,
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

import {
  AlarmAction,
  AlarmOrderBy,
  AlarmOrderByOptions,
  AlarmOrderDir,
  AlarmOrderDirOptions,
  AlarmStatus,
} from "../enums";
import { scopedTranslation } from "./i18n";

const AlarmSearchContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AlarmSearchContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "alarms", "search"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "bell",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.alarms" as const],
  aliases: ["corvina_alarms_search"],

  fields: customWidgetObject({
    render: AlarmSearchContainer,
    usage: { request: "data", response: true } as const,
    children: {
      filter: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.filter.label" as const,
        description: "post.filter.description" as const,
        placeholder: "post.filter.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      page: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.page.label" as const,
        description: "post.page.description" as const,
        columns: 6,
        schema: z.coerce.number().min(0).optional().default(0),
      }),
      pageSize: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "post.pageSize.label" as const,
        description: "post.pageSize.description" as const,
        columns: 6,
        schema: z.coerce.number().min(1).max(100).optional().default(20),
      }),
      orderBy: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.orderBy.label" as const,
        description: "post.orderBy.description" as const,
        columns: 6,
        schema: z
          .enum(AlarmOrderBy)
          .optional()
          .default(AlarmOrderBy.EVENT_TIMESTAMP),
        options: AlarmOrderByOptions,
      }),
      orderDir: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.orderDir.label" as const,
        description: "post.orderDir.description" as const,
        columns: 6,
        schema: z.enum(AlarmOrderDir).optional().default(AlarmOrderDir.DESC),
        options: AlarmOrderDirOptions,
      }),
      scopedOrganization: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.scopedOrganization.label" as const,
        description: "post.scopedOrganization.description" as const,
        placeholder: "post.scopedOrganization.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      deviceName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.deviceName.label" as const,
        description: "post.deviceName.description" as const,
        placeholder: "post.deviceName.placeholder" as const,
        columns: 6,
        schema: z.string().optional(),
      }),
      deviceGroups: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.deviceGroups.label" as const,
        description: "post.deviceGroups.description" as const,
        placeholder: "post.deviceGroups.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      alarms: responseArrayField(scopedTranslation, {
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
              content: "post.response.alarms.id" as const,
              schema: z.string(),
            }),
            name: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.alarms.name" as const,
              schema: z.string(),
            }),
            description: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.alarms.description" as const,
              schema: z.string().nullable().optional(),
            }),
            deviceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.alarms.deviceId" as const,
              schema: z.string().nullable().optional(),
            }),
            deviceLabel: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.alarms.deviceLabel" as const,
              schema: z.string().nullable().optional(),
            }),
            tag: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.alarms.tag" as const,
              schema: z.string().nullable().optional(),
            }),
            severity: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.alarms.severity" as const,
              schema: z.number().nullable().optional(),
            }),
            status: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "post.response.alarms.status" as const,
              schema: z.enum(AlarmStatus).nullable().optional(),
            }),
            action: responseField(scopedTranslation, {
              type: WidgetType.BADGE,
              content: "post.response.alarms.action" as const,
              schema: z.enum(AlarmAction).nullable().optional(),
            }),
            eventTimestamp: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.alarms.eventTimestamp" as const,
              schema: dateSchema.nullable().optional(),
            }),
            updatedAt: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.alarms.updatedAt" as const,
              schema: dateSchema.nullable().optional(),
            }),
            orgResourceId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "post.response.alarms.orgResourceId" as const,
              schema: z.string().nullable().optional(),
            }),
          },
        }),
      }),
      totalElements: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.totalElements" as const,
        schema: z.coerce.number(),
      }),
      totalPages: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.totalPages" as const,
        schema: z.coerce.number(),
      }),
      last: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.last" as const,
        schema: z.boolean(),
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
        page: 0,
        pageSize: 20,
        orderBy: AlarmOrderBy.EVENT_TIMESTAMP,
        orderDir: AlarmOrderDir.DESC,
      },
    },
    responses: {
      default: {
        alarms: [
          {
            id: "alarm-001",
            name: "High Temperature",
            description: "Temperature exceeded threshold",
            deviceId: "sNgo2bZFPt6IgNEGFpOrrw",
            deviceLabel: "Device 001",
            tag: "Temp_Tag",
            severity: 4,
            status: AlarmStatus.ACTIVE,
            action: AlarmAction.NO_ACK,
            eventTimestamp: "2025-01-15T10:30:00.000Z",
            updatedAt: "2025-01-15T10:30:00.000Z",
            orgResourceId: "exorde.connex.connectika",
          },
        ],
        totalElements: 1,
        totalPages: 1,
        last: true,
      },
    },
  },
});

export type AlarmSearchRequestOutput = typeof POST.types.RequestOutput;
export type AlarmSearchResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
