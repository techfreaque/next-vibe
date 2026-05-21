import { z } from "zod";

import { dateSchema } from "@/app/api/[locale]/shared/types/common.schema";
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

import { AlarmAction, AlarmStatus } from "../enums";
import { scopedTranslation } from "./i18n";

const AlarmDetailContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AlarmDetailContainer })),
);

const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["corvina", "alarms", "[alarmId]"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "get.title" as const,
  description: "get.description" as const,
  icon: "bell",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.alarms" as const],
  aliases: ["corvina_alarm_detail"],

  fields: customWidgetObject({
    render: AlarmDetailContainer,
    usage: { request: "urlPathParams", response: true } as const,
    children: {
      alarmId: requestUrlPathParamsResponseField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "get.alarmId.label" as const,
        description: "get.alarmId.description" as const,
        schema: z.string().min(1),
      }),
      name: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.name" as const,
        schema: z.string(),
      }),
      description: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.description" as const,
        schema: z.string().nullable().optional(),
      }),
      deviceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceId" as const,
        schema: z.string().nullable().optional(),
      }),
      deviceLabel: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.deviceLabel" as const,
        schema: z.string().nullable().optional(),
      }),
      tag: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.tag" as const,
        schema: z.string().nullable().optional(),
      }),
      severity: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.severity" as const,
        schema: z.number().nullable().optional(),
      }),
      status: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.status" as const,
        schema: z.enum(AlarmStatus).nullable().optional(),
      }),
      action: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "get.response.action" as const,
        schema: z.enum(AlarmAction).nullable().optional(),
      }),
      alarmEnabled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.alarmEnabled" as const,
        schema: z.string().nullable().optional(),
      }),
      ack: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.ack" as const,
        schema: z.string().nullable().optional(),
      }),
      reset: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.reset" as const,
        schema: z.string().nullable().optional(),
      }),
      eventTimestamp: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.eventTimestamp" as const,
        schema: dateSchema.nullable().optional(),
      }),
      updatedAt: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.updatedAt" as const,
        schema: dateSchema.nullable().optional(),
      }),
      acknowledgedDate: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.acknowledgedDate" as const,
        schema: dateSchema.nullable().optional(),
      }),
      orgResourceId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.orgResourceId" as const,
        schema: z.string().nullable().optional(),
      }),
      user: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.user" as const,
        schema: z.string().nullable().optional(),
      }),
      comment: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.comment" as const,
        schema: z.string().nullable().optional(),
      }),
      realmId: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "get.response.realmId" as const,
        schema: z.string().nullable().optional(),
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
    urlPathParams: {
      default: { alarmId: "alarm-001" },
    },
    responses: {
      default: {
        alarmId: "alarm-001",
        name: "High Temperature",
        description: "Temperature exceeded threshold",
        deviceId: "sNgo2bZFPt6IgNEGFpOrrw",
        deviceLabel: "Device 001",
        tag: "Temp_Tag",
        severity: 4,
        status: AlarmStatus.ACTIVE,
        action: AlarmAction.NO_ACK,
        alarmEnabled: "ENABLED",
        ack: "REQUIRED",
        reset: "REQUIRED",
        eventTimestamp: "2025-01-15T10:30:00.000Z",
        updatedAt: "2025-01-15T10:30:00.000Z",
        acknowledgedDate: null,
        orgResourceId: "exorde.connex.connectika",
        user: null,
        comment: null,
        realmId: "corvina",
      },
    },
  },
});

export type AlarmDetailUrlVariablesOutput = typeof GET.types.UrlVariablesOutput;
export type AlarmDetailResponseOutput = typeof GET.types.ResponseOutput;

const definitions = { GET } as const;
export default definitions;
