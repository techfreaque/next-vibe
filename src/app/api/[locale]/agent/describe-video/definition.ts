/**
 * Describe Video API Route Definition
 * Describes the contents of a video using a vision AI model.
 * Called by the LLM (on demand) or triggered by the system (gap-fill).
 */

import { lazy } from "react";
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

import { DESCRIBE_VIDEO_ALIAS } from "./constants";
import { scopedTranslation } from "./i18n";

const DescribeVideoContainer = lazy(() =>
  import("./widget").then((m) => ({ default: m.DescribeVideoContainer })),
);

const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["agent", "describe-video"],
  aliases: [DESCRIBE_VIDEO_ALIAS],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER, UserRole.PUBLIC],

  title: "post.title",
  description: "post.description",
  icon: "video",
  category: "endpointCategories.ai",
  tags: ["tags.video", "tags.vision", "tags.ai"],
  dynamicTitle: ({ request }) => {
    const fileUrl = request?.fileUrl;
    if (!fileUrl) {
      return undefined;
    }
    const filename = fileUrl.split("/").pop() ?? fileUrl;
    const short =
      filename.length > 40 ? `${filename.slice(0, 40)}...` : filename;
    return {
      message: "post.dynamicTitle" as const,
      messageParams: { filename: short },
    };
  },

  dynamicCredits: ({ response }) => response?.creditCost,

  fields: customWidgetObject({
    render: DescribeVideoContainer,
    usage: { request: "data", response: true } as const,
    children: {
      // === REQUEST FIELDS ===
      fileUrl: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "post.fileUrl.label",
        description: "post.fileUrl.description",
        columns: 12,
        schema: z.string().url(),
      }),
      context: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXTAREA,
        label: "post.context.label",
        description: "post.context.description",
        columns: 12,
        placeholder: "post.context.placeholder",
        schema: z.string().optional(),
      }),

      // === RESPONSE FIELDS ===
      text: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.text",
        schema: z.string(),
      }),
      model: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.model",
        schema: z.string(),
      }),
      creditCost: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "post.response.creditCost",
        schema: z.number(),
      }),
    },
  }),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "post.errors.validation_failed.title",
      description: "post.errors.validation_failed.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "post.errors.network_error.title",
      description: "post.errors.network_error.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "post.errors.unauthorized.title",
      description: "post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "post.errors.forbidden.title",
      description: "post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "post.errors.not_found.title",
      description: "post.errors.not_found.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "post.errors.server_error.title",
      description: "post.errors.server_error.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "post.errors.unknown_error.title",
      description: "post.errors.unknown_error.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "post.errors.unsaved_changes.title",
      description: "post.errors.unsaved_changes.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "post.errors.conflict.title",
      description: "post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "post.success.title",
    description: "post.success.description",
  },

  examples: {
    requests: {
      default: {
        fileUrl: "https://example.com/video.mp4",
      },
    },
    responses: {
      default: {
        text: "A short cinematic video of a mountain lake at sunset, with gentle ripples on the water and birds flying in the background.",
        model: "gemini-2.5-flash",
        creditCost: 3,
      },
    },
  },
});

export type DescribeVideoPostRequestInput = typeof POST.types.RequestInput;
export type DescribeVideoPostRequestOutput = typeof POST.types.RequestOutput;
export type DescribeVideoPostResponseInput = typeof POST.types.ResponseInput;
export type DescribeVideoPostResponseOutput = typeof POST.types.ResponseOutput;

const definitions = { POST } as const;
export default definitions;
