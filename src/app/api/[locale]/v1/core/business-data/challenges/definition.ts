/**
 * Challenges API Endpoint Definition
 * Defines the API endpoints for challenges data management using createFormEndpoint
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
 * Challenges form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "business-data", "challenges"],
  category: "app.api.v1.core.businessData.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.businessData.challenges.get.title",
      description: "app.api.v1.core.businessData.challenges.get.description",
      tags: [
        "app.api.v1.core.businessData.challenges.tags.challenges",
        "app.api.v1.core.businessData.tags.businessData",
      ],
    },
    POST: {
      title: "app.api.v1.core.businessData.challenges.put.title",
      description: "app.api.v1.core.businessData.challenges.put.description",
      tags: [
        "app.api.v1.core.businessData.challenges.tags.challenges",
        "app.api.v1.core.businessData.tags.businessData",
        "app.api.v1.core.businessData.challenges.tags.update",
      ],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.businessData.challenges.get.form.title",
      description:
        "app.api.v1.core.businessData.challenges.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Current challenges field
      currentChallenges: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.currentChallenges.label",
          description:
            "app.api.v1.core.businessData.challenges.put.currentChallenges.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.currentChallenges.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Pain points field
      painPoints: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.challenges.put.painPoints.label",
          description:
            "app.api.v1.core.businessData.challenges.put.painPoints.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.painPoints.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Obstacles field
      obstacles: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.challenges.put.obstacles.label",
          description:
            "app.api.v1.core.businessData.challenges.put.obstacles.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.obstacles.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Marketing challenges field
      marketingChallenges: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.marketingChallenges.label",
          description:
            "app.api.v1.core.businessData.challenges.put.marketingChallenges.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.marketingChallenges.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Operational challenges field
      operationalChallenges: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.operationalChallenges.label",
          description:
            "app.api.v1.core.businessData.challenges.put.operationalChallenges.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.operationalChallenges.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Financial challenges field
      financialChallenges: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.financialChallenges.label",
          description:
            "app.api.v1.core.businessData.challenges.put.financialChallenges.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.financialChallenges.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Technical challenges field
      technicalChallenges: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.technicalChallenges.label",
          description:
            "app.api.v1.core.businessData.challenges.put.technicalChallenges.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.technicalChallenges.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Market challenges field
      marketChallenges: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.marketChallenges.label",
          description:
            "app.api.v1.core.businessData.challenges.put.marketChallenges.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.marketChallenges.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Resource constraints field
      resourceConstraints: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.resourceConstraints.label",
          description:
            "app.api.v1.core.businessData.challenges.put.resourceConstraints.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.resourceConstraints.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Technology challenges field
      technologyChallenges: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.technologyChallenges.label",
          description:
            "app.api.v1.core.businessData.challenges.put.technologyChallenges.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.technologyChallenges.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Biggest challenge field
      biggestChallenge: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.biggestChallenge.label",
          description:
            "app.api.v1.core.businessData.challenges.put.biggestChallenge.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.biggestChallenge.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Challenge impact field
      challengeImpact: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.challengeImpact.label",
          description:
            "app.api.v1.core.businessData.challenges.put.challengeImpact.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.challengeImpact.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Previous solutions field
      previousSolutions: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.previousSolutions.label",
          description:
            "app.api.v1.core.businessData.challenges.put.previousSolutions.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.previousSolutions.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Budget constraints field
      budgetConstraints: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.budgetConstraints.label",
          description:
            "app.api.v1.core.businessData.challenges.put.budgetConstraints.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.budgetConstraints.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Time constraints field
      timeConstraints: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.timeConstraints.label",
          description:
            "app.api.v1.core.businessData.challenges.put.timeConstraints.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.timeConstraints.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Support needed field
      supportNeeded: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.supportNeeded.label",
          description:
            "app.api.v1.core.businessData.challenges.put.supportNeeded.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.supportNeeded.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Priority areas field
      priorityAreas: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.challenges.put.priorityAreas.label",
          description:
            "app.api.v1.core.businessData.challenges.put.priorityAreas.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.priorityAreas.placeholder",
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
            "app.api.v1.core.businessData.challenges.put.additionalNotes.label",
          description:
            "app.api.v1.core.businessData.challenges.put.additionalNotes.description",
          placeholder:
            "app.api.v1.core.businessData.challenges.put.additionalNotes.placeholder",
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
          content:
            "app.api.v1.core.businessData.challenges.put.success.message",
        },
      ),

      // Completion status - for both GET and POST responses
      completionStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.businessData.challenges.get.response.completionStatus.title",
          description:
            "app.api.v1.core.businessData.challenges.get.response.completionStatus.description",
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
              content: "app.api.v1.core.businessData.challenges.isComplete",
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
              content:
                "app.api.v1.core.businessData.challenges.completedFields",
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
              content: "app.api.v1.core.businessData.challenges.totalFields",
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
                "app.api.v1.core.businessData.challenges.completionPercentage",
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
                "app.api.v1.core.businessData.challenges.missingRequiredFields",
            },
          ),
        },
      ),
    },
  ),

  // Shared error and success configuration
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.businessData.challenges.get.errors.validation.title",
      description:
        "app.api.v1.core.businessData.challenges.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.businessData.challenges.get.errors.notFound.title",
      description:
        "app.api.v1.core.businessData.challenges.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.businessData.challenges.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.businessData.challenges.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.businessData.challenges.get.errors.forbidden.title",
      description:
        "app.api.v1.core.businessData.challenges.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.businessData.challenges.get.errors.server.title",
      description:
        "app.api.v1.core.businessData.challenges.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.businessData.challenges.get.errors.network.title",
      description:
        "app.api.v1.core.businessData.challenges.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.businessData.challenges.get.errors.unknown.title",
      description:
        "app.api.v1.core.businessData.challenges.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.businessData.challenges.put.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.businessData.challenges.put.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.businessData.challenges.put.errors.conflict.title",
      description:
        "app.api.v1.core.businessData.challenges.put.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.businessData.challenges.get.success.title",
    description:
      "app.api.v1.core.businessData.challenges.get.success.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          currentChallenges: "Limited marketing budget and brand awareness",
          painPoints: "Difficulty reaching target audience effectively",
          obstacles: "Competition from established players",
          marketChallenges:
            "Saturated market with high customer acquisition costs",
          resourceConstraints: "Small marketing team and limited budget",
          technologyChallenges:
            "Need for better analytics and automation tools",
          additionalNotes: "Looking to improve digital presence",
          completionStatus: {
            isComplete: true,
            completedFields: 7,
            totalFields: 7,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          currentChallenges: "Limited marketing budget",
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
          currentChallenges: "Limited marketing budget and brand awareness",
          painPoints: "Difficulty reaching target audience effectively",
          obstacles: "Competition from established players",
          marketChallenges:
            "Saturated market with high customer acquisition costs",
          resourceConstraints: "Small marketing team and limited budget",
          technologyChallenges:
            "Need for better analytics and automation tools",
          additionalNotes: "Looking to improve digital presence",
        },
        minimal: {
          currentChallenges: "Limited marketing budget",
        },
      },
      responses: {
        default: {
          currentChallenges: "Limited marketing budget and brand awareness",
          painPoints: "Difficulty reaching target audience effectively",
          obstacles: "Competition from established players",
          marketChallenges:
            "Saturated market with high customer acquisition costs",
          resourceConstraints: "Small marketing team and limited budget",
          technologyChallenges:
            "Need for better analytics and automation tools",
          additionalNotes: "Looking to improve digital presence",
          message: "Challenges updated successfully",
          completionStatus: {
            isComplete: true,
            completedFields: 7,
            totalFields: 7,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          currentChallenges: "Limited marketing budget",
          message: "Challenges updated successfully",
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
export type ChallengesGetRequestTypeInput = typeof GET.types.RequestInput;
export type ChallengesGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type ChallengesGetResponseTypeInput = typeof GET.types.ResponseInput;
export type ChallengesGetResponseTypeOutput = typeof GET.types.ResponseOutput;

export type ChallengesPostRequestTypeInput = typeof POST.types.RequestInput;
export type ChallengesPostRequestTypeOutput = typeof POST.types.RequestOutput;
export type ChallengesPostResponseTypeInput = typeof POST.types.ResponseInput;
export type ChallengesPostResponseTypeOutput = typeof POST.types.ResponseOutput;

// Alias PUT types to POST types for backward compatibility
export type ChallengesPutRequestTypeInput = typeof POST.types.RequestInput;
export type ChallengesPutRequestTypeOutput = typeof POST.types.RequestOutput;
export type ChallengesPutResponseTypeInput = typeof POST.types.ResponseInput;
export type ChallengesPutResponseTypeOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const challengesDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default challengesDefinition;
