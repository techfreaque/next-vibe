/**
 * Avatar Management API Endpoint Definition
 * Production-ready endpoints for user avatar upload and delete functionality
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

import { UserRole } from "../../../user-roles/enum";
import { scopedTranslation } from "./i18n";

/**
 * POST /avatar - Upload avatar
 */
const { POST } = createEndpoint({
  scopedTranslation,
  method: Methods.POST,
  path: ["user", "private", "me", "avatar"],
  title: "upload.title",
  description: "upload.description",
  icon: "user",
  category: "app.endpointCategories.userAuth",
  tags: ["tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "upload.title",
    description: "upload.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { request: "data", response: true },
    children: {
      // === FILE UPLOAD SECTION ===
      fileUpload: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "upload.groups.fileUpload.title",
        description: "upload.groups.fileUpload.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { request: "data" },
        children: {
          file: requestField(scopedTranslation, {
            type: WidgetType.FORM_FIELD,
            fieldType: FieldDataType.FILE,
            label: "upload.fields.file.label",
            description: "upload.fields.file.description",
            placeholder: "upload.fields.file.placeholder",
            columns: 12,
            helpText: "upload.fields.file.help",
            schema: z
              .instanceof(File)
              .refine((file) => file.size <= 5 * 1024 * 1024, {
                message: "upload.fields.file.validation.maxSize",
              })
              .refine((file) => file.type.startsWith("image/"), {
                message: "upload.fields.file.validation.imageOnly",
              })
              .refine(
                (file) => {
                  const allowedTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "image/gif",
                  ];
                  return allowedTypes.includes(file.type);
                },
                {
                  message: "upload.fields.file.validation.unsupportedFormat",
                },
              ),
          }),
        },
      }),

      // === RESPONSE FIELDS ===
      response: objectField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        title: "upload.response.title",
        description: "upload.response.description",
        layoutType: LayoutType.GRID,
        columns: 12,
        usage: { response: true },
        children: {
          success: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "upload.response.success",
            schema: z.boolean(),
          }),
          message: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "upload.response.message",
            schema: z.string(),
          }),
          avatarUrl: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "upload.response.avatarUrl",
            schema: z.string().url().optional(),
          }),
          uploadTime: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "upload.response.uploadTime",
            schema: z.string().optional(),
          }),
          nextSteps: responseField(scopedTranslation, {
            type: WidgetType.TEXT,
            content: "upload.response.nextSteps.item",
            schema: z.array(z.string()),
          }),
        },
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "upload.errors.validation.title",
      description: "upload.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "upload.errors.unauthorized.title",
      description: "upload.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "upload.errors.internal.title",
      description: "upload.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "upload.errors.unknown.title",
      description: "upload.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "upload.errors.network.title",
      description: "upload.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "upload.errors.forbidden.title",
      description: "upload.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "upload.errors.notFound.title",
      description: "upload.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "upload.errors.unsaved.title",
      description: "upload.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "upload.errors.conflict.title",
      description: "upload.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "upload.success.title",
    description: "upload.success.description",
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        fileUpload: {
          file: new File([""], "avatar.jpg", { type: "image/jpeg" }),
        },
      },
      fileTooLarge: {
        fileUpload: {
          file: new File([new ArrayBuffer(10 * 1024 * 1024)], "large.jpg", {
            type: "image/jpeg",
          }),
        },
      },
      invalidFormat: {
        fileUpload: {
          file: new File([""], "document.pdf", { type: "application/pdf" }),
        },
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          message: "Avatar uploaded successfully",
          avatarUrl: "https://example.com/avatars/user-123.jpg",
          uploadTime: "1.2 seconds",
          nextSteps: [
            "Your new avatar will appear across the platform",
            "It may take a few minutes to update everywhere",
          ],
        },
      },
      fileTooLarge: {
        response: {
          success: false,
          message:
            "File size exceeds 5MB limit. Please choose a smaller image.",
          nextSteps: [
            "Compress your image using online tools",
            "Try a different image with smaller file size",
            "Crop the image to reduce file size",
          ],
        },
      },
      invalidFormat: {
        response: {
          success: false,
          message:
            "Unsupported file format. Please use JPEG, PNG, WebP, or GIF.",
          nextSteps: [
            "Convert your image to a supported format",
            "Use image editing software to save in the correct format",
          ],
        },
      },
    },
  },
});

/**
 * DELETE /avatar - Delete avatar
 */
const { DELETE } = createEndpoint({
  scopedTranslation,
  method: Methods.DELETE,
  path: ["user", "private", "me", "avatar"],
  title: "delete.title",
  description: "delete.description",
  icon: "user-x" as const,
  category: "app.endpointCategories.userAuth",
  tags: ["tag"],
  allowedRoles: [
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
    UserRole.AI_TOOL_OFF,
  ] as const,
  fields: objectField(scopedTranslation, {
    type: WidgetType.CONTAINER,
    title: "delete.response.title",
    description: "delete.response.description",
    layoutType: LayoutType.GRID,
    columns: 12,
    usage: { response: true },
    children: {
      success: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.success",
        schema: z.boolean(),
      }),
      message: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.message",
        schema: z.string(),
      }),
      nextSteps: responseField(scopedTranslation, {
        type: WidgetType.TEXT,
        content: "delete.response.nextSteps.item",
        schema: z.array(z.string()),
      }),
    },
  }),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "delete.errors.validation.title",
      description: "delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "delete.errors.unauthorized.title",
      description: "delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "delete.errors.internal.title",
      description: "delete.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "delete.errors.unknown.title",
      description: "delete.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "delete.errors.network.title",
      description: "delete.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "delete.errors.forbidden.title",
      description: "delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "delete.errors.notFound.title",
      description: "delete.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "delete.errors.unsaved.title",
      description: "delete.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "delete.errors.conflict.title",
      description: "delete.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "delete.success.title",
    description: "delete.success.description",
  },

  // === EXAMPLES ===
  examples: {
    responses: {
      default: {
        success: true,
        message: "Avatar deleted successfully",
        nextSteps: [
          "Default avatar will be used until you upload a new one",
          "Upload a new avatar anytime from your profile settings",
        ],
      },
      failed: {
        success: false,
        message: "Failed to delete avatar. Please try again.",
        nextSteps: [
          "Refresh the page and try again",
          "Contact support if the problem persists",
        ],
      },
    },
  },
});

/**
 * Avatar API endpoints
 * Combines all avatar endpoints into a single object
 */
const avatarEndpoints = {
  POST,
  DELETE,
} as const;
export default avatarEndpoints;

// Export types as required by migration guide
export type AvatarPostRequestInput = typeof POST.types.RequestInput;
export type AvatarPostRequestOutput = typeof POST.types.RequestOutput;
export type AvatarPostResponseInput = typeof POST.types.ResponseInput;
export type AvatarPostResponseOutput = typeof POST.types.ResponseOutput;

export type AvatarDeleteRequestInput = typeof DELETE.types.RequestInput;
export type AvatarDeleteRequestOutput = typeof DELETE.types.RequestOutput;
export type AvatarDeleteResponseInput = typeof DELETE.types.ResponseInput;
export type AvatarDeleteResponseOutput = typeof DELETE.types.ResponseOutput;
