/**
 * Admin Add Credits API Definition
 * POST endpoint to add credit packs to a user account (admin only)
 */

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
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { scopedTranslation } from "../i18n";
import { AdminAddCreditsContainer } from "./widget";

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["credits", "admin-add"],
  title: "adminAdd.post.title" as const,
  description: "adminAdd.post.description" as const,
  category: "endpointCategories.credits",
  subCategory: "endpointCategories.creditsManagement",
  icon: "coins" as const,
  tags: ["adminAdd.post.tag" as const],
  allowedRoles: [UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: AdminAddCreditsContainer,
    usage: { request: "data", response: true } as const,
    children: {
      targetUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.UUID,
        label: "adminAdd.post.targetUserId.label" as const,
        description: "adminAdd.post.targetUserId.description" as const,
        columns: 12,
        hidden: true,
        schema: z.string().uuid(),
      }),
      amount: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.NUMBER,
        label: "adminAdd.post.amount.label" as const,
        description: "adminAdd.post.amount.description" as const,
        placeholder: "adminAdd.post.amount.placeholder" as const,
        columns: 12,
        schema: z.coerce.number().int().positive(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "adminAdd.post.response.message.content" as const,
        schema: z.string(),
      }),
      backButton: backButton(scopedTranslation, {
        label: "adminAdd.post.backButton.label" as const,
        icon: "arrow-left",
        variant: "outline",
        usage: { request: "data" },
      }),
      submitButton: submitButton(scopedTranslation, {
        label: "adminAdd.post.submitButton.label" as const,
        loadingText: "adminAdd.post.submitButton.loadingText" as const,
        icon: "send",
        variant: "primary",
        className: "w-full",
        usage: { request: "data" },
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "adminAdd.post.errors.unauthorized.title" as const,
      description: "adminAdd.post.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "adminAdd.post.errors.validation.title" as const,
      description: "adminAdd.post.errors.validation.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "adminAdd.post.errors.forbidden.title" as const,
      description: "adminAdd.post.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "adminAdd.post.errors.notFound.title" as const,
      description: "adminAdd.post.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "adminAdd.post.errors.conflict.title" as const,
      description: "adminAdd.post.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "adminAdd.post.errors.network.title" as const,
      description: "adminAdd.post.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "adminAdd.post.errors.unsavedChanges.title" as const,
      description: "adminAdd.post.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "adminAdd.post.errors.server.title" as const,
      description: "adminAdd.post.errors.server.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "adminAdd.post.errors.unknown.title" as const,
      description: "adminAdd.post.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "adminAdd.post.success.title" as const,
    description: "adminAdd.post.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        targetUserId: "123e4567-e89b-12d3-a456-426614174000",
        amount: 100,
      },
      large: {
        targetUserId: "123e4567-e89b-12d3-a456-426614174000",
        amount: 500,
      },
    },
    responses: {
      default: {
        message: "Successfully added 100 bonus credits",
      },
    },
  },
});

export type AdminAddCreditsPostRequestOutput = typeof POST.types.RequestOutput;
export type AdminAddCreditsPostResponseOutput =
  typeof POST.types.ResponseOutput;

const definitions = { POST };
export default definitions;
