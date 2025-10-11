/**
 * Business Data API Endpoint Definitions
 * Defines the API endpoints for aggregated business data operations
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../core/user/user-roles/enum";

/**
 * Enhanced GET endpoint for aggregated business data
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "business-data"],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  title: "app.api.v1.core.businessData.get.title",
  description: "app.api.v1.core.businessData.get.description",
  category: "app.api.v1.core.businessData.category",
  tags: [
    "app.api.v1.core.businessData.tags.businessData",
    "app.api.v1.core.businessData.tags.aggregation",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.businessData.get.form.title",
      description: "app.api.v1.core.businessData.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      completionStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.businessData.get.response.completionStatus.title",
          description:
            "app.api.v1.core.businessData.get.response.completionStatus.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          audience: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.businessData.get.response.completionStatus.audience.title",
              description:
                "app.api.v1.core.businessData.get.response.completionStatus.audience.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              isComplete: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.audience.isComplete",
                },
                z.boolean(),
              ),
              completedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.audience.completedFields",
                },
                z.number(),
              ),
              totalFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.audience.totalFields",
                },
                z.number(),
              ),
              completionPercentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.audience.completionPercentage",
                },
                z.number(),
              ),
              missingRequiredFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.audience.missingRequiredFields",
                },
                z.array(z.string()).optional(),
              ),
            },
          ),
          brand: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.businessData.get.response.completionStatus.brand.title",
              description:
                "app.api.v1.core.businessData.get.response.completionStatus.brand.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              isComplete: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.brand.isComplete",
                },
                z.boolean(),
              ),
              completedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.brand.completedFields",
                },
                z.number(),
              ),
              totalFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.brand.totalFields",
                },
                z.number(),
              ),
              completionPercentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.brand.completionPercentage",
                },
                z.number(),
              ),
              missingRequiredFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.brand.missingRequiredFields",
                },
                z.array(z.string()).optional(),
              ),
            },
          ),
          businessInfo: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.businessData.get.response.completionStatus.businessInfo.title",
              description:
                "app.api.v1.core.businessData.get.response.completionStatus.businessInfo.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              isComplete: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.businessInfo.isComplete",
                },
                z.boolean(),
              ),
              completedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.businessInfo.completedFields",
                },
                z.number(),
              ),
              totalFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.businessInfo.totalFields",
                },
                z.number(),
              ),
              completionPercentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.businessInfo.completionPercentage",
                },
                z.number(),
              ),
              missingRequiredFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.businessInfo.missingRequiredFields",
                },
                z.array(z.string()).optional(),
              ),
            },
          ),
          challenges: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.businessData.get.response.completionStatus.challenges.title",
              description:
                "app.api.v1.core.businessData.get.response.completionStatus.challenges.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              isComplete: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.challenges.isComplete",
                },
                z.boolean(),
              ),
              completedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.challenges.completedFields",
                },
                z.number(),
              ),
              totalFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.challenges.totalFields",
                },
                z.number(),
              ),
              completionPercentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.challenges.completionPercentage",
                },
                z.number(),
              ),
              missingRequiredFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.challenges.missingRequiredFields",
                },
                z.array(z.string()).optional(),
              ),
            },
          ),
          competitors: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.businessData.get.response.completionStatus.competitors.title",
              description:
                "app.api.v1.core.businessData.get.response.completionStatus.competitors.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              isComplete: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.competitors.isComplete",
                },
                z.boolean(),
              ),
              completedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.competitors.completedFields",
                },
                z.number(),
              ),
              totalFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.competitors.totalFields",
                },
                z.number(),
              ),
              completionPercentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.competitors.completionPercentage",
                },
                z.number(),
              ),
              missingRequiredFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.competitors.missingRequiredFields",
                },
                z.array(z.string()).optional(),
              ),
            },
          ),
          goals: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.businessData.get.response.completionStatus.goals.title",
              description:
                "app.api.v1.core.businessData.get.response.completionStatus.goals.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              isComplete: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.goals.isComplete",
                },
                z.boolean(),
              ),
              completedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.goals.completedFields",
                },
                z.number(),
              ),
              totalFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.goals.totalFields",
                },
                z.number(),
              ),
              completionPercentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.goals.completionPercentage",
                },
                z.number(),
              ),
              missingRequiredFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.goals.missingRequiredFields",
                },
                z.array(z.string()).optional(),
              ),
            },
          ),
          profile: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.businessData.get.response.completionStatus.profile.title",
              description:
                "app.api.v1.core.businessData.get.response.completionStatus.profile.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              isComplete: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.profile.isComplete",
                },
                z.boolean(),
              ),
              completedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.profile.completedFields",
                },
                z.number(),
              ),
              totalFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.profile.totalFields",
                },
                z.number(),
              ),
              completionPercentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.profile.completionPercentage",
                },
                z.number(),
              ),
              missingRequiredFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.profile.missingRequiredFields",
                },
                z.array(z.string()).optional(),
              ),
            },
          ),
          social: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.businessData.get.response.completionStatus.social.title",
              description:
                "app.api.v1.core.businessData.get.response.completionStatus.social.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              isComplete: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.social.isComplete",
                },
                z.boolean(),
              ),
              completedFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.social.completedFields",
                },
                z.number(),
              ),
              totalFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.social.totalFields",
                },
                z.number(),
              ),
              completionPercentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.social.completionPercentage",
                },
                z.number(),
              ),
              missingRequiredFields: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.social.missingRequiredFields",
                },
                z.array(z.string()).optional(),
              ),
            },
          ),
          overall: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.businessData.get.response.completionStatus.overall.title",
              description:
                "app.api.v1.core.businessData.get.response.completionStatus.overall.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              isComplete: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.overall.isComplete",
                },
                z.boolean(),
              ),
              completedSections: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.overall.completedSections",
                },
                z.number(),
              ),
              totalSections: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.overall.totalSections",
                },
                z.number(),
              ),
              completionPercentage: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.businessData.get.response.completionStatus.overall.completionPercentage",
                },
                z.number(),
              ),
            },
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.businessData.errors.validation.title",
      description: "app.api.v1.core.businessData.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.businessData.errors.unauthorized.title",
      description:
        "app.api.v1.core.businessData.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.businessData.errors.server.title",
      description: "app.api.v1.core.businessData.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.businessData.errors.unknown.title",
      description: "app.api.v1.core.businessData.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.businessData.errors.network.title",
      description: "app.api.v1.core.businessData.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.businessData.errors.forbidden.title",
      description: "app.api.v1.core.businessData.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.businessData.errors.notFound.title",
      description: "app.api.v1.core.businessData.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.businessData.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.businessData.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.businessData.errors.conflict.title",
      description: "app.api.v1.core.businessData.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.businessData.success.title",
    description: "app.api.v1.core.businessData.success.description",
  },

  examples: {
    urlPathVariables: undefined,
    requests: undefined,
    responses: {
      default: {
        completionStatus: {
          audience: {
            isComplete: true,
            completedFields: 12,
            totalFields: 12,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
          brand: {
            isComplete: false,
            completedFields: 8,
            totalFields: 18,
            completionPercentage: 44,
            missingRequiredFields: ["brandVoice", "brandPersonality"],
          },
          businessInfo: {
            isComplete: false,
            completedFields: 3,
            totalFields: 10,
            completionPercentage: 30,
            missingRequiredFields: ["businessName", "businessType"],
          },
          challenges: {
            isComplete: false,
            completedFields: 2,
            totalFields: 8,
            completionPercentage: 25,
            missingRequiredFields: [],
          },
          competitors: {
            isComplete: false,
            completedFields: 0,
            totalFields: 10,
            completionPercentage: 0,
            missingRequiredFields: [],
          },
          goals: {
            isComplete: true,
            completedFields: 6,
            totalFields: 6,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
          profile: {
            isComplete: true,
            completedFields: 8,
            totalFields: 8,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
          social: {
            isComplete: false,
            completedFields: 4,
            totalFields: 15,
            completionPercentage: 27,
            missingRequiredFields: ["platforms"],
          },
          overall: {
            completedSections: 3,
            totalSections: 8,
            completionPercentage: 38,
            isComplete: false,
          },
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type BusinessDataGetRequestTypeInput = typeof GET.types.RequestInput;
export type BusinessDataGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type BusinessDataGetResponseTypeInput = typeof GET.types.ResponseInput;
export type BusinessDataGetResponseTypeOutput = typeof GET.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const businessDataEndpoints = {
  GET,
};

export { GET };
export default businessDataEndpoints;
