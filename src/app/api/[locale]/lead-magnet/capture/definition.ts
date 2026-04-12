/**
 * Lead Magnet Capture API Definition
 * PUBLIC endpoint - no login required
 * Captures a lead and forwards it to the skill owner's email platform
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  objectField,
  requestField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";
import { scopedTranslation } from "./i18n";

export const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["lead-magnet", "capture"],
  title: "submit.title" as const,
  description: "submit.description" as const,
  icon: "mail",
  category: "endpointCategories.leadMagnet",
  subCategory: "endpointCategories.leadMagnetCapture",
  tags: ["submit.tag" as const],
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "submit.groups.main.title" as const,
    description: "submit.groups.main.description" as const,
    layoutType: LayoutType.STACKED,
    usage: { request: "data", response: true },
    children: {
      skillId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "submit.fields.skillId.label" as const,
        description: "submit.fields.skillId.description" as const,
        schema: z.uuid(),
      }),
      firstName: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "submit.fields.firstName.label" as const,
        description: "submit.fields.firstName.description" as const,
        placeholder: "submit.fields.firstName.placeholder" as const,
        schema: z.string().min(1).max(100),
      }),
      email: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.EMAIL,
        label: "submit.fields.email.label" as const,
        description: "submit.fields.email.description" as const,
        placeholder: "submit.fields.email.placeholder" as const,
        schema: z.email(),
      }),
      // Response
      captured: responseField(scopedTranslation, {
        type: WidgetType.BADGE,
        text: "submit.response.captured" as const,
        schema: z.boolean(),
      }),
      nextStep: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "submit.response.nextStep" as const,
        schema: z.enum(["signup", "already_subscribed"]),
      }),
      signupUrl: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "submit.response.signupUrl" as const,
        schema: z.string(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "submit.errors.validation.title" as const,
      description: "submit.errors.validation.description" as const,
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "submit.errors.unauthorized.title" as const,
      description: "submit.errors.unauthorized.description" as const,
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "submit.errors.forbidden.title" as const,
      description: "submit.errors.forbidden.description" as const,
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "submit.errors.notFound.title" as const,
      description: "submit.errors.notFound.description" as const,
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "submit.errors.conflict.title" as const,
      description: "submit.errors.conflict.description" as const,
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "submit.errors.network.title" as const,
      description: "submit.errors.network.description" as const,
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "submit.errors.unsavedChanges.title" as const,
      description: "submit.errors.unsavedChanges.description" as const,
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "submit.errors.internal.title" as const,
      description: "submit.errors.internal.description" as const,
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "submit.errors.unknown.title" as const,
      description: "submit.errors.unknown.description" as const,
    },
  },

  successTypes: {
    title: "submit.success.title" as const,
    description: "submit.success.description" as const,
  },

  examples: {
    requests: {
      default: {
        skillId: "550e8400-e29b-41d4-a716-446655440000",
        firstName: "Alex",
        email: "alex@example.com",
      },
    },
    responses: {
      default: {
        captured: true,
        nextStep: "signup" as const,
        signupUrl:
          "/en-GLOBAL/user/sign-up?ref=creatorcode&email=alex%40example.com&firstName=Alex",
      },
    },
  },
});

const captureEndpoints = { POST } as const;
export default captureEndpoints;

export type CapturePostRequestOutput = typeof POST.types.RequestOutput;
export type CapturePostResponseOutput = typeof POST.types.ResponseOutput;
