/**
 * Avatar Management API Endpoint Definition
 * Production-ready endpoints for user avatar upload and delete functionality
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../../user-roles/enum";

/**
 * POST /avatar - Upload avatar
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "user", "private", "me", "avatar"],
  title: "app.api.v1.core.user.private.me.avatar.upload.title",
  description: "app.api.v1.core.user.private.me.avatar.upload.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.private.me.avatar.tag"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
    UserRole.CLI_ONLY,
    UserRole.CLI_WEB,
    UserRole.WEB_ONLY,
  ],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.private.me.avatar.upload.title",
      description: "app.api.v1.core.user.private.me.avatar.upload.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === FILE UPLOAD SECTION ===
      fileUpload: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.user.private.me.avatar.upload.groups.fileUpload.title",
          description:
            "app.api.v1.core.user.private.me.avatar.upload.groups.fileUpload.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { request: "data" },
        {
          file: requestDataField(
            {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.FILE,
              label:
                "app.api.v1.core.user.private.me.avatar.upload.fields.file.label",
              description:
                "app.api.v1.core.user.private.me.avatar.upload.fields.file.description",
              placeholder:
                "app.api.v1.core.user.private.me.avatar.upload.fields.file.placeholder",
              required: true,
              layout: { columns: 12 },
              helpText:
                "app.api.v1.core.user.private.me.avatar.upload.fields.file.help",
            },
            z
              .instanceof(File)
              .refine((file) => file.size <= 5 * 1024 * 1024, {
                message:
                  "app.api.v1.core.user.private.me.avatar.upload.fields.file.validation.maxSize",
              })
              .refine((file) => file.type.startsWith("image/"), {
                message:
                  "app.api.v1.core.user.private.me.avatar.upload.fields.file.validation.imageOnly",
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
                  message:
                    "app.api.v1.core.user.private.me.avatar.upload.fields.file.validation.unsupportedFormat",
                },
              ),
          ),
        },
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.user.private.me.avatar.upload.response.title",
          description:
            "app.api.v1.core.user.private.me.avatar.upload.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.avatar.upload.response.success",
            },
            z.boolean(),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.avatar.upload.response.message",
            },
            z.string(),
          ),
          avatarUrl: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.avatar.upload.response.avatarUrl",
            },
            z.string().url().optional(),
          ),
          uploadTime: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.avatar.upload.response.uploadTime",
            },
            z.string().optional(),
          ),
          nextSteps: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.user.private.me.avatar.upload.response.nextSteps.item",
            },
            z.array(z.string()),
          ),
        },
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.user.private.me.avatar.upload.errors.validation.title",
      description:
        "app.api.v1.core.user.private.me.avatar.upload.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.private.me.avatar.upload.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.private.me.avatar.upload.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.user.private.me.avatar.upload.errors.internal.title",
      description:
        "app.api.v1.core.user.private.me.avatar.upload.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.user.private.me.avatar.upload.errors.unknown.title",
      description:
        "app.api.v1.core.user.private.me.avatar.upload.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.user.private.me.avatar.upload.errors.network.title",
      description:
        "app.api.v1.core.user.private.me.avatar.upload.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.user.private.me.avatar.upload.errors.forbidden.title",
      description:
        "app.api.v1.core.user.private.me.avatar.upload.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.user.private.me.avatar.upload.errors.notFound.title",
      description:
        "app.api.v1.core.user.private.me.avatar.upload.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.private.me.avatar.upload.errors.unsaved.title",
      description:
        "app.api.v1.core.user.private.me.avatar.upload.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.user.private.me.avatar.upload.errors.conflict.title",
      description:
        "app.api.v1.core.user.private.me.avatar.upload.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.private.me.avatar.upload.success.title",
    description:
      "app.api.v1.core.user.private.me.avatar.upload.success.description",
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
  method: Methods.DELETE,
  path: ["v1", "core", "user", "private", "me", "avatar"],
  title: "app.api.v1.core.user.private.me.avatar.delete.title",
  description: "app.api.v1.core.user.private.me.avatar.delete.description",
  category: "app.api.v1.core.user.category",
  tags: ["app.api.v1.core.user.private.me.avatar.tag"],
  allowedRoles: [
    UserRole.PUBLIC,
    UserRole.CUSTOMER,
    UserRole.PARTNER_ADMIN,
    UserRole.PARTNER_EMPLOYEE,
    UserRole.ADMIN,
    UserRole.CLI_ONLY,
    UserRole.CLI_WEB,
    UserRole.WEB_ONLY,
  ],
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.user.private.me.avatar.delete.response.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.response.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      success: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.user.private.me.avatar.delete.response.success",
        },
        z.boolean(),
      ),
      message: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.user.private.me.avatar.delete.response.message",
        },
        z.string(),
      ),
      nextSteps: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.user.private.me.avatar.delete.response.nextSteps.item",
        },
        z.array(z.string()),
      ),
    },
  ),

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.user.private.me.avatar.delete.errors.validation.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.user.private.me.avatar.delete.errors.unauthorized.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.user.private.me.avatar.delete.errors.internal.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.errors.internal.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.user.private.me.avatar.delete.errors.unknown.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.user.private.me.avatar.delete.errors.network.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.user.private.me.avatar.delete.errors.forbidden.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.user.private.me.avatar.delete.errors.notFound.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.user.private.me.avatar.delete.errors.unsaved.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.errors.unsaved.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.user.private.me.avatar.delete.errors.conflict.title",
      description:
        "app.api.v1.core.user.private.me.avatar.delete.errors.conflict.description",
    },
  },

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.user.private.me.avatar.delete.success.title",
    description:
      "app.api.v1.core.user.private.me.avatar.delete.success.description",
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
};

export { DELETE, POST };

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
