/**
 * Social API Endpoint Definition
 * Defines the API endpoints for social platform data management using createFormEndpoint
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createFormEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create-form-endpoint";
import {
  field,
  objectField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../user/user-roles/enum";
import { PlatformPriority, SocialPlatform } from "./enum";

/**
 * Social form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "business-data", "social"],
  category: "app.api.v1.core.businessData.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.businessData.social.get.title",
      description: "app.api.v1.core.businessData.social.get.description",
      tags: [
        "app.api.v1.core.businessData.social.tags.social",
        "app.api.v1.core.businessData.social.tags.platforms",
      ],
    },
    POST: {
      title: "app.api.v1.core.businessData.social.put.title",
      description: "app.api.v1.core.businessData.social.put.description",
      tags: [
        "app.api.v1.core.businessData.social.tags.social",
        "app.api.v1.core.businessData.social.tags.platforms",
        "app.api.v1.core.businessData.social.tags.update",
      ],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.businessData.social.get.form.title",
      description: "app.api.v1.core.businessData.social.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Platforms field - array of platform objects
      platforms: field(
        z
          .array(
            z.object({
              platform: z.nativeEnum(SocialPlatform),
              username: z.string(),
              isActive: z.boolean(),
              priority: z.nativeEnum(PlatformPriority),
            }),
          )
          .optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.ARRAY,
          label: "app.api.v1.core.businessData.social.put.platforms.label",
          description:
            "app.api.v1.core.businessData.social.put.platforms.description",
          placeholder:
            "app.api.v1.core.businessData.social.put.platforms.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
        },
      ),

      // Content strategy field
      contentStrategy: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.social.put.contentStrategy.label",
          description:
            "app.api.v1.core.businessData.social.put.contentStrategy.description",
          placeholder:
            "app.api.v1.core.businessData.social.put.contentStrategy.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Posting frequency field
      postingFrequency: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.social.put.postingFrequency.label",
          description:
            "app.api.v1.core.businessData.social.put.postingFrequency.description",
          placeholder:
            "app.api.v1.core.businessData.social.put.postingFrequency.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Goals field
      goals: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.social.put.goals.label",
          description:
            "app.api.v1.core.businessData.social.put.goals.description",
          placeholder:
            "app.api.v1.core.businessData.social.put.goals.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Additional notes field
      additionalNotes: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.social.put.additionalNotes.label",
          description:
            "app.api.v1.core.businessData.social.put.additionalNotes.description",
          placeholder:
            "app.api.v1.core.businessData.social.put.additionalNotes.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Response message - only for POST
      message: field(
        z.string(),
        {
          POST: { response: true },
        },
        {
          type: WidgetType.TEXT,
          content: "app.api.v1.core.businessData.social.put.success.message",
        },
      ),

      // Completion status - for both GET and POST responses
      completionStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.businessData.social.get.response.completionStatus.title",
          description:
            "app.api.v1.core.businessData.social.get.response.completionStatus.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        {
          GET: { response: true },
          POST: { response: true },
        },
        {
          isComplete: field(
            z.boolean(),
            {
              GET: { response: true },
              POST: { response: true },
            },
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.businessData.social.isComplete",
            },
          ),
          completedFields: field(
            z.number(),
            {
              GET: { response: true },
              POST: { response: true },
            },
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.businessData.social.completedFields",
            },
          ),
          totalFields: field(
            z.number(),
            {
              GET: { response: true },
              POST: { response: true },
            },
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.businessData.social.totalFields",
            },
          ),
          completionPercentage: field(
            z.number(),
            {
              GET: { response: true },
              POST: { response: true },
            },
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.businessData.social.completionPercentage",
            },
          ),
          missingRequiredFields: field(
            z.array(z.string()).optional(),
            {
              GET: { response: true },
              POST: { response: true },
            },
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.businessData.social.missingRequiredFields",
            },
          ),
        },
      ),
    },
  ),

  // Shared error and success configuration
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.businessData.social.get.errors.validation.title",
      description:
        "app.api.v1.core.businessData.social.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.businessData.social.get.errors.notFound.title",
      description:
        "app.api.v1.core.businessData.social.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.businessData.social.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.businessData.social.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.businessData.social.get.errors.forbidden.title",
      description:
        "app.api.v1.core.businessData.social.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.businessData.social.get.errors.server.title",
      description:
        "app.api.v1.core.businessData.social.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.businessData.social.get.errors.network.title",
      description:
        "app.api.v1.core.businessData.social.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.businessData.social.get.errors.unknown.title",
      description:
        "app.api.v1.core.businessData.social.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.businessData.social.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.businessData.social.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.businessData.social.get.errors.conflict.title",
      description:
        "app.api.v1.core.businessData.social.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.businessData.social.get.success.title",
    description: "app.api.v1.core.businessData.social.get.success.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          platforms: [
            {
              platform: SocialPlatform.INSTAGRAM,
              username: "@techcorp",
              isActive: true,
              priority: PlatformPriority.HIGH,
            },
            {
              platform: SocialPlatform.FACEBOOK,
              username: "TechCorpOfficial",
              isActive: true,
              priority: PlatformPriority.MEDIUM,
            },
            {
              platform: SocialPlatform.LINKEDIN,
              username: "techcorp-inc",
              isActive: true,
              priority: PlatformPriority.HIGH,
            },
          ],
          contentStrategy:
            "Focus on visual storytelling and behind-the-scenes content",
          postingFrequency:
            "Instagram: daily, Facebook: 3x/week, LinkedIn: 2x/week",
          goals: "Increase followers by 50%, improve engagement rate to 5%",
          additionalNotes:
            "Prioritize authentic content over promotional posts",
          completionStatus: {
            isComplete: true,
            completedFields: 6,
            totalFields: 6,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          platforms: [
            {
              platform: SocialPlatform.INSTAGRAM,
              username: "@startup",
              isActive: true,
              priority: PlatformPriority.HIGH,
            },
          ],
          completionStatus: {
            isComplete: false,
            completedFields: 1,
            totalFields: 6,
            completionPercentage: 17,
            missingRequiredFields: [],
          },
        },
      },
    },
    POST: {
      requests: {
        default: {
          platforms: [
            {
              platform: SocialPlatform.INSTAGRAM,
              username: "@techcorp",
              isActive: true,
              priority: PlatformPriority.HIGH,
            },
            {
              platform: SocialPlatform.FACEBOOK,
              username: "TechCorpOfficial",
              isActive: true,
              priority: PlatformPriority.MEDIUM,
            },
            {
              platform: SocialPlatform.LINKEDIN,
              username: "techcorp-inc",
              isActive: true,
              priority: PlatformPriority.HIGH,
            },
          ],
          contentStrategy:
            "Focus on visual storytelling and behind-the-scenes content",
          postingFrequency:
            "Instagram: daily, Facebook: 3x/week, LinkedIn: 2x/week",
          goals: "Increase followers by 50%, improve engagement rate to 5%",
          additionalNotes:
            "Prioritize authentic content over promotional posts",
        },
        minimal: {
          platforms: [
            {
              platform: SocialPlatform.INSTAGRAM,
              username: "@startup",
              isActive: true,
              priority: PlatformPriority.HIGH,
            },
          ],
        },
      },
      responses: {
        default: {
          platforms: [
            {
              platform: SocialPlatform.INSTAGRAM,
              username: "@techcorp",
              isActive: true,
              priority: PlatformPriority.HIGH,
            },
            {
              platform: SocialPlatform.FACEBOOK,
              username: "TechCorpOfficial",
              isActive: true,
              priority: PlatformPriority.MEDIUM,
            },
            {
              platform: SocialPlatform.LINKEDIN,
              username: "techcorp-inc",
              isActive: true,
              priority: PlatformPriority.HIGH,
            },
          ],
          contentStrategy:
            "Focus on visual storytelling and behind-the-scenes content",
          postingFrequency:
            "Instagram: daily, Facebook: 3x/week, LinkedIn: 2x/week",
          goals: "Increase followers by 50%, improve engagement rate to 5%",
          additionalNotes:
            "Prioritize authentic content over promotional posts",
          message: "Social platform data updated successfully",
          completionStatus: {
            isComplete: true,
            completedFields: 6,
            totalFields: 6,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          platforms: [
            {
              platform: SocialPlatform.INSTAGRAM,
              username: "@startup",
              isActive: true,
              priority: PlatformPriority.HIGH,
            },
          ],
          message: "Social platform data updated successfully",
          completionStatus: {
            isComplete: false,
            completedFields: 1,
            totalFields: 6,
            completionPercentage: 17,
            missingRequiredFields: [],
          },
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type SocialGetRequestTypeInput = typeof GET.types.RequestInput;
export type SocialGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type SocialGetResponseTypeInput = typeof GET.types.ResponseInput;
export type SocialGetResponseTypeOutput = typeof GET.types.ResponseOutput;

export type SocialPostRequestTypeInput = typeof POST.types.RequestInput;
export type SocialPostRequestTypeOutput = typeof POST.types.RequestOutput;
export type SocialPostResponseTypeInput = typeof POST.types.ResponseInput;
export type SocialPostResponseTypeOutput = typeof POST.types.ResponseOutput;

// Alias PUT types to POST types for backward compatibility
export type SocialPutRequestTypeInput = typeof POST.types.RequestInput;
export type SocialPutRequestTypeOutput = typeof POST.types.RequestOutput;
export type SocialPutResponseTypeInput = typeof POST.types.ResponseInput;
export type SocialPutResponseTypeOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const socialDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default socialDefinition;
