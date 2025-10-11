/**
 * Profile API Endpoint Definition
 * Defines the API endpoints for profile data management using createFormEndpoint
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

/**
 * Profile form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "business-data", "profile"],
  category: "app.api.v1.core.businessData.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.businessData.profile.get.title",
      description: "app.api.v1.core.businessData.profile.get.description",
      tags: [
        "app.api.v1.core.businessData.profile.tags.profile",
        "app.api.v1.core.businessData.profile.tags.personal",
      ],
    },
    POST: {
      title: "app.api.v1.core.businessData.profile.put.title",
      description: "app.api.v1.core.businessData.profile.put.description",
      tags: [
        "app.api.v1.core.businessData.profile.tags.profile",
        "app.api.v1.core.businessData.profile.tags.personal",
        "app.api.v1.core.businessData.profile.tags.update",
      ],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.businessData.profile.get.form.title",
      description: "app.api.v1.core.businessData.profile.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Full name field
      fullName: field(
        z.string().max(200).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.businessData.profile.put.fullName.label",
          description:
            "app.api.v1.core.businessData.profile.put.fullName.description",
          placeholder:
            "app.api.v1.core.businessData.profile.put.fullName.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Job title field
      jobTitle: field(
        z.string().max(200).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.businessData.profile.put.jobTitle.label",
          description:
            "app.api.v1.core.businessData.profile.put.jobTitle.description",
          placeholder:
            "app.api.v1.core.businessData.profile.put.jobTitle.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Bio field
      bio: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.profile.put.bio.label",
          description:
            "app.api.v1.core.businessData.profile.put.bio.description",
          placeholder:
            "app.api.v1.core.businessData.profile.put.bio.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Expertise field
      expertise: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.profile.put.expertise.label",
          description:
            "app.api.v1.core.businessData.profile.put.expertise.description",
          placeholder:
            "app.api.v1.core.businessData.profile.put.expertise.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Professional background field
      professionalBackground: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.profile.put.professionalBackground.label",
          description:
            "app.api.v1.core.businessData.profile.put.professionalBackground.description",
          placeholder:
            "app.api.v1.core.businessData.profile.put.professionalBackground.placeholder",
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
            "app.api.v1.core.businessData.profile.put.additionalNotes.label",
          description:
            "app.api.v1.core.businessData.profile.put.additionalNotes.description",
          placeholder:
            "app.api.v1.core.businessData.profile.put.additionalNotes.placeholder",
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
          content: "app.api.v1.core.businessData.profile.put.success.message",
        },
      ),

      // Completion status - for both GET and POST responses
      completionStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.businessData.profile.get.response.completionStatus.title",
          description:
            "app.api.v1.core.businessData.profile.get.response.completionStatus.description",
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
              content: "app.api.v1.core.businessData.profile.isComplete",
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
              content: "app.api.v1.core.businessData.profile.completedFields",
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
              content: "app.api.v1.core.businessData.profile.totalFields",
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
                "app.api.v1.core.businessData.profile.completionPercentage",
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
                "app.api.v1.core.businessData.profile.missingRequiredFields",
            },
          ),
        },
      ),
    },
  ),

  // Shared error and success configuration
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.businessData.profile.get.errors.validation.title",
      description:
        "app.api.v1.core.businessData.profile.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.businessData.profile.get.errors.notFound.title",
      description:
        "app.api.v1.core.businessData.profile.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.businessData.profile.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.businessData.profile.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.businessData.profile.get.errors.forbidden.title",
      description:
        "app.api.v1.core.businessData.profile.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.businessData.profile.get.errors.server.title",
      description:
        "app.api.v1.core.businessData.profile.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.businessData.profile.get.errors.network.title",
      description:
        "app.api.v1.core.businessData.profile.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.businessData.profile.get.errors.unknown.title",
      description:
        "app.api.v1.core.businessData.profile.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.businessData.profile.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.businessData.profile.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.businessData.profile.get.errors.conflict.title",
      description:
        "app.api.v1.core.businessData.profile.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.businessData.profile.get.success.title",
    description: "app.api.v1.core.businessData.profile.get.success.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          fullName: "John Smith",
          jobTitle: "CEO & Founder",
          bio: "Experienced entrepreneur with 15+ years in tech industry",
          expertise: "Product strategy, team leadership, business development",
          professionalBackground: "Former VP at TechCorp, MBA from Stanford",
          additionalNotes: "Passionate about sustainable business practices",
          completionStatus: {
            isComplete: true,
            completedFields: 6,
            totalFields: 6,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          fullName: "John Smith",
          jobTitle: "CEO",
          completionStatus: {
            isComplete: false,
            completedFields: 2,
            totalFields: 6,
            completionPercentage: 33,
            missingRequiredFields: [],
          },
        },
      },
    },
    POST: {
      requests: {
        default: {
          fullName: "John Smith",
          jobTitle: "CEO & Founder",
          bio: "Experienced entrepreneur with 15+ years in tech industry",
          expertise: "Product strategy, team leadership, business development",
          professionalBackground: "Former VP at TechCorp, MBA from Stanford",
          additionalNotes: "Passionate about sustainable business practices",
        },
        minimal: {
          fullName: "John Smith",
          jobTitle: "CEO",
        },
      },
      responses: {
        default: {
          fullName: "John Smith",
          jobTitle: "CEO & Founder",
          bio: "Experienced entrepreneur with 15+ years in tech industry",
          expertise: "Product strategy, team leadership, business development",
          professionalBackground: "Former VP at TechCorp, MBA from Stanford",
          additionalNotes: "Passionate about sustainable business practices",
          message: "Profile updated successfully",
          completionStatus: {
            isComplete: true,
            completedFields: 6,
            totalFields: 6,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          fullName: "John Smith",
          jobTitle: "CEO",
          message: "Profile updated successfully",
          completionStatus: {
            isComplete: false,
            completedFields: 2,
            totalFields: 6,
            completionPercentage: 33,
            missingRequiredFields: [],
          },
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type ProfileGetRequestTypeInput = typeof GET.types.RequestInput;
export type ProfileGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type ProfileGetResponseTypeInput = typeof GET.types.ResponseInput;
export type ProfileGetResponseTypeOutput = typeof GET.types.ResponseOutput;

export type ProfilePostRequestTypeInput = typeof POST.types.RequestInput;
export type ProfilePostRequestTypeOutput = typeof POST.types.RequestOutput;
export type ProfilePostResponseTypeInput = typeof POST.types.ResponseInput;
export type ProfilePostResponseTypeOutput = typeof POST.types.ResponseOutput;

// Alias PUT types to POST types for backward compatibility
export type ProfilePutRequestTypeInput = typeof POST.types.RequestInput;
export type ProfilePutRequestTypeOutput = typeof POST.types.RequestOutput;
export type ProfilePutResponseTypeInput = typeof POST.types.ResponseInput;
export type ProfilePutResponseTypeOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const profileDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default profileDefinition;
