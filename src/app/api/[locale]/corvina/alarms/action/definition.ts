import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
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

import { AlarmActionType, AlarmActionTypeOptions } from "../enums";
import { scopedTranslation } from "./i18n";

const AlarmActionContainer = lazyWidget(() =>
  import("./widget").then((m) => ({ default: m.AlarmActionContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["corvina", "alarms", "action"],
  allowedRoles: [UserRole.ADMIN] as const,

  title: "post.title" as const,
  description: "post.description" as const,
  icon: "bell",
  category: "endpointCategories.corvina",
  subCategory: "endpointCategories.corvinaOrganizations",
  tags: ["tags.corvina" as const, "tags.alarms" as const],
  aliases: ["corvina_alarm_action"],

  fields: customWidgetObject({
    render: AlarmActionContainer,
    usage: { request: "data", response: true } as const,
    children: {
      alarmId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.alarmId.label" as const,
        description: "post.alarmId.description" as const,
        placeholder: "post.alarmId.placeholder" as const,
        columns: 12,
        schema: z.string().min(1),
      }),
      type: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.SELECT,
        label: "post.type.label" as const,
        description: "post.type.description" as const,
        columns: 6,
        schema: z.enum(AlarmActionType),
        options: AlarmActionTypeOptions,
      }),
      comment: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.comment.label" as const,
        description: "post.comment.description" as const,
        placeholder: "post.comment.placeholder" as const,
        columns: 12,
        schema: z.string().optional(),
      }),
      success: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        content: "post.response.success" as const,
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.message" as const,
        schema: z.string(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "post.widget.submitButton" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "post.widget.submitButton" as const,
        loadingText: "post.widget.submitLoading" as const,
        icon: "check",
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
        alarmId: "alarm-001",
        type: AlarmActionType.ACK,
        comment: "Acknowledged by operator",
      },
    },
    responses: {
      default: {
        success: true,
        message: "Alarm acknowledged.",
      },
    },
  },
});

export type AlarmActionRequestOutput = typeof POST.types.RequestOutput;
export type AlarmActionResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
