/**
 * Halt All Campaigns API Definition
 * POST endpoint to immediately halt all active email campaigns
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "./i18n";
import { HaltAllWidget } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["leads", "campaigns", "halt-all"],
  title: "post.title",
  description: "post.description",
  category: "endpointCategories.leadsCampaigns",
  icon: "shield-off",
  tags: ["title"],
  allowedRoles: [UserRole.ADMIN],

  fields: customWidgetObject({
    render: HaltAllWidget,
    usage: { request: "data", response: true } as const,
    children: {
      confirm: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.BOOLEAN,
        label: "post.fields.confirm.label",
        description: "post.fields.confirm.description",
        columns: 6,
        schema: z.boolean(),
      }),

      reason: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fields.reason.label",
        description: "post.fields.reason.description",
        columns: 6,
        schema: z.string().optional().default("admin_global_halt"),
      }),

      halted: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.halted",
        schema: z.number(),
      }),

      emailsCancelled: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.emailsCancelled",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server.title",
      description: "post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown.title",
      description: "post.errors.unknown.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation.title",
      description: "post.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.notFound.title",
      description: "post.errors.notFound.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network.title",
      description: "post.errors.network.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsavedChanges.title",
      description: "post.errors.unsavedChanges.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: { default: { confirm: true, reason: "admin_global_halt" } },
    responses: {
      default: {
        halted: 0,
        emailsCancelled: 0,
      },
    },
  },
});

export type HaltAllCampaignsPostRequestOutput = typeof POST.types.RequestOutput;
export type HaltAllCampaignsPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
