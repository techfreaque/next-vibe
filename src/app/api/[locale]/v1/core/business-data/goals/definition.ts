/**
 * Goals API Endpoint Definition
 * Defines the API endpoints for goals data management using createFormEndpoint
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
import { BusinessGoal, BusinessGoalOptions } from "./enum";

/**
 * Goals form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "business-data", "goals"],
  category: "app.api.v1.core.businessData.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.businessData.goals.get.title",
      description: "app.api.v1.core.businessData.goals.get.description",
      tags: [
        "app.api.v1.core.businessData.goals.tags.goals",
        "app.api.v1.core.businessData.goals.tags.objectives",
      ],
    },
    POST: {
      title: "app.api.v1.core.businessData.goals.put.title",
      description: "app.api.v1.core.businessData.goals.put.description",
      tags: [
        "app.api.v1.core.businessData.goals.tags.goals",
        "app.api.v1.core.businessData.goals.tags.objectives",
        "app.api.v1.core.businessData.goals.tags.update",
      ],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.businessData.goals.get.form.title",
      description: "app.api.v1.core.businessData.goals.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Primary business goal field
      primaryBusinessGoal: field(
        z.nativeEnum(BusinessGoal).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.businessData.goals.put.primaryGoals.label",
          description:
            "app.api.v1.core.businessData.goals.put.primaryGoals.description",
          placeholder:
            "app.api.v1.core.businessData.goals.put.primaryGoals.placeholder",
          options: BusinessGoalOptions,
          layout: { columns: 6 },
        },
      ),

      // Short term goals field
      shortTermGoals: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.goals.put.shortTermGoals.label",
          description:
            "app.api.v1.core.businessData.goals.put.shortTermGoals.description",
          placeholder:
            "app.api.v1.core.businessData.goals.put.shortTermGoals.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Long term goals field
      longTermGoals: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.goals.put.longTermGoals.label",
          description:
            "app.api.v1.core.businessData.goals.put.longTermGoals.description",
          placeholder:
            "app.api.v1.core.businessData.goals.put.longTermGoals.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Revenue goals field
      revenueGoals: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.goals.put.revenueGoals.label",
          description:
            "app.api.v1.core.businessData.goals.put.revenueGoals.description",
          placeholder:
            "app.api.v1.core.businessData.goals.put.revenueGoals.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Growth goals field
      growthGoals: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.goals.put.growthGoals.label",
          description:
            "app.api.v1.core.businessData.goals.put.growthGoals.description",
          placeholder:
            "app.api.v1.core.businessData.goals.put.growthGoals.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Success metrics field
      successMetrics: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.goals.put.successMetrics.label",
          description:
            "app.api.v1.core.businessData.goals.put.successMetrics.description",
          placeholder:
            "app.api.v1.core.businessData.goals.put.successMetrics.placeholder",
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
          label: "app.api.v1.core.businessData.goals.put.additionalNotes.label",
          description:
            "app.api.v1.core.businessData.goals.put.additionalNotes.description",
          placeholder:
            "app.api.v1.core.businessData.goals.put.additionalNotes.placeholder",
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
          content: "app.api.v1.core.businessData.goals.put.success.message",
        },
      ),

      // Completion status - for both GET and POST responses
      completionStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.businessData.goals.get.response.completionStatus.title",
          description:
            "app.api.v1.core.businessData.goals.put.response.completionStatus.description",
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
              content: "app.api.v1.core.businessData.goals.isComplete",
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
              content: "app.api.v1.core.businessData.goals.completedFields",
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
              content: "app.api.v1.core.businessData.goals.totalFields",
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
                "app.api.v1.core.businessData.goals.completionPercentage",
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
                "app.api.v1.core.businessData.goals.missingRequiredFields",
            },
          ),
        },
      ),
    },
  ),

  // Shared error and success configuration
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.businessData.goals.get.errors.validation.title",
      description:
        "app.api.v1.core.businessData.goals.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.businessData.goals.get.errors.notFound.title",
      description:
        "app.api.v1.core.businessData.goals.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.businessData.goals.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.businessData.goals.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.businessData.goals.get.errors.forbidden.title",
      description:
        "app.api.v1.core.businessData.goals.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.businessData.goals.get.errors.server.title",
      description:
        "app.api.v1.core.businessData.goals.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.businessData.goals.get.errors.network.title",
      description:
        "app.api.v1.core.businessData.goals.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.businessData.goals.get.errors.unknown.title",
      description:
        "app.api.v1.core.businessData.goals.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.businessData.goals.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.businessData.goals.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.businessData.goals.get.errors.conflict.title",
      description:
        "app.api.v1.core.businessData.goals.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.businessData.goals.get.success.title",
    description: "app.api.v1.core.businessData.goals.get.success.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          primaryBusinessGoal: BusinessGoal.INCREASE_REVENUE,
          shortTermGoals:
            "Increase monthly recurring revenue by 25% in next 6 months",
          longTermGoals: "Become market leader in our segment within 3 years",
          revenueGoals: "$1M ARR by end of year, $5M ARR in 3 years",
          growthGoals: "30% YoY revenue growth, 15% monthly user growth",
          successMetrics: "Customer satisfaction >90%, churn rate <5%",
          additionalNotes: "Focus on sustainable growth and customer retention",
          completionStatus: {
            isComplete: true,
            completedFields: 7,
            totalFields: 7,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          primaryBusinessGoal: BusinessGoal.INCREASE_REVENUE,
          completionStatus: {
            isComplete: false,
            completedFields: 1,
            totalFields: 7,
            completionPercentage: 14,
            missingRequiredFields: [],
          },
        },
      },
    },
    POST: {
      requests: {
        default: {
          primaryBusinessGoal: BusinessGoal.INCREASE_REVENUE,
          shortTermGoals:
            "Increase monthly recurring revenue by 25% in next 6 months",
          longTermGoals: "Become market leader in our segment within 3 years",
          revenueGoals: "$1M ARR by end of year, $5M ARR in 3 years",
          growthGoals: "30% YoY revenue growth, 15% monthly user growth",
          successMetrics: "Customer satisfaction >90%, churn rate <5%",
          additionalNotes: "Focus on sustainable growth and customer retention",
        },
        minimal: {
          primaryBusinessGoal: BusinessGoal.INCREASE_REVENUE,
        },
      },
      responses: {
        default: {
          primaryBusinessGoal: BusinessGoal.INCREASE_REVENUE,
          shortTermGoals:
            "Increase monthly recurring revenue by 25% in next 6 months",
          longTermGoals: "Become market leader in our segment within 3 years",
          revenueGoals: "$1M ARR by end of year, $5M ARR in 3 years",
          growthGoals: "30% YoY revenue growth, 15% monthly user growth",
          successMetrics: "Customer satisfaction >90%, churn rate <5%",
          additionalNotes: "Focus on sustainable growth and customer retention",
          message: "Goals updated successfully",
          completionStatus: {
            isComplete: true,
            completedFields: 7,
            totalFields: 7,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          primaryBusinessGoal: BusinessGoal.INCREASE_REVENUE,
          message: "Goals updated successfully",
          completionStatus: {
            isComplete: false,
            completedFields: 1,
            totalFields: 7,
            completionPercentage: 14,
            missingRequiredFields: [],
          },
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type GoalsGetRequestTypeInput = typeof GET.types.RequestInput;
export type GoalsGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type GoalsGetResponseTypeInput = typeof GET.types.ResponseInput;
export type GoalsGetResponseTypeOutput = typeof GET.types.ResponseOutput;

export type GoalsPostRequestTypeInput = typeof POST.types.RequestInput;
export type GoalsPostRequestTypeOutput = typeof POST.types.RequestOutput;
export type GoalsPostResponseTypeInput = typeof POST.types.ResponseInput;
export type GoalsPostResponseTypeOutput = typeof POST.types.ResponseOutput;

// Alias PUT types to POST types for backward compatibility
export type GoalsPutRequestTypeInput = typeof POST.types.RequestInput;
export type GoalsPutRequestTypeOutput = typeof POST.types.RequestOutput;
export type GoalsPutResponseTypeInput = typeof POST.types.ResponseInput;
export type GoalsPutResponseTypeOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const goalsDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default goalsDefinition;
