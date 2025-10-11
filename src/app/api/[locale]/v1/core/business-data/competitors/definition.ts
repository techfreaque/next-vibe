/**
 * Competitors API Endpoint Definition
 * Defines the API endpoints for competitors data management using createFormEndpoint
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
 * Competitors form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "business-data", "competitors"],
  category: "app.api.v1.core.businessData.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.businessData.competitors.get.title",
      description: "app.api.v1.core.businessData.competitors.get.description",
      tags: [
        "app.api.v1.core.businessData.competitors.tags.competitors",
        "app.api.v1.core.businessData.competitors.tags.market",
      ],
    },
    POST: {
      title: "app.api.v1.core.businessData.competitors.put.title",
      description: "app.api.v1.core.businessData.competitors.put.description",
      tags: [
        "app.api.v1.core.businessData.competitors.tags.competitors",
        "app.api.v1.core.businessData.competitors.tags.market",
        "app.api.v1.core.businessData.competitors.tags.update",
      ],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.businessData.competitors.get.form.title",
      description:
        "app.api.v1.core.businessData.competitors.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Competitors field
      competitors: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.competitors.put.competitors.label",
          description:
            "app.api.v1.core.businessData.competitors.put.competitors.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.competitors.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Main competitors field
      mainCompetitors: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.competitors.put.mainCompetitors.label",
          description:
            "app.api.v1.core.businessData.competitors.put.mainCompetitors.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.mainCompetitors.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Competitive advantages field
      competitiveAdvantages: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.competitors.put.competitiveAdvantages.label",
          description:
            "app.api.v1.core.businessData.competitors.put.competitiveAdvantages.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.competitiveAdvantages.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Market position field
      marketPosition: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.competitors.put.marketPosition.label",
          description:
            "app.api.v1.core.businessData.competitors.put.marketPosition.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.marketPosition.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Competitive disadvantages field
      competitiveDisadvantages: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.competitors.put.competitiveDisadvantages.label",
          description:
            "app.api.v1.core.businessData.competitors.put.competitiveDisadvantages.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.competitiveDisadvantages.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Differentiators field
      differentiators: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.competitors.put.differentiators.label",
          description:
            "app.api.v1.core.businessData.competitors.put.differentiators.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.differentiators.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Competitor strengths field
      competitorStrengths: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.competitors.put.competitorStrengths.label",
          description:
            "app.api.v1.core.businessData.competitors.put.competitorStrengths.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.competitorStrengths.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Competitor weaknesses field
      competitorWeaknesses: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.competitors.put.competitorWeaknesses.label",
          description:
            "app.api.v1.core.businessData.competitors.put.competitorWeaknesses.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.competitorWeaknesses.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Market gaps field
      marketGaps: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.competitors.put.marketGaps.label",
          description:
            "app.api.v1.core.businessData.competitors.put.marketGaps.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.marketGaps.placeholder",
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
            "app.api.v1.core.businessData.competitors.put.additionalNotes.label",
          description:
            "app.api.v1.core.businessData.competitors.put.additionalNotes.description",
          placeholder:
            "app.api.v1.core.businessData.competitors.put.additionalNotes.placeholder",
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
            "app.api.v1.core.businessData.competitors.put.success.message",
        },
      ),

      // Completion status - for both GET and POST responses
      completionStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.businessData.competitors.get.response.completionStatus.title",
          description:
            "app.api.v1.core.businessData.competitors.get.response.completionStatus.description",
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
              content: "app.api.v1.core.businessData.competitors.isComplete",
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
                "app.api.v1.core.businessData.competitors.completedFields",
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
              content: "app.api.v1.core.businessData.competitors.totalFields",
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
                "app.api.v1.core.businessData.competitors.completionPercentage",
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
                "app.api.v1.core.businessData.competitors.missingRequiredFields",
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
        "app.api.v1.core.businessData.competitors.get.errors.validation.title",
      description:
        "app.api.v1.core.businessData.competitors.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.businessData.competitors.get.errors.notFound.title",
      description:
        "app.api.v1.core.businessData.competitors.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.businessData.competitors.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.businessData.competitors.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.businessData.competitors.get.errors.forbidden.title",
      description:
        "app.api.v1.core.businessData.competitors.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.businessData.competitors.get.errors.server.title",
      description:
        "app.api.v1.core.businessData.competitors.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.businessData.competitors.get.errors.network.title",
      description:
        "app.api.v1.core.businessData.competitors.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.businessData.competitors.get.errors.unknown.title",
      description:
        "app.api.v1.core.businessData.competitors.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.businessData.competitors.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.businessData.competitors.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.businessData.competitors.get.errors.conflict.title",
      description:
        "app.api.v1.core.businessData.competitors.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.businessData.competitors.get.success.title",
    description:
      "app.api.v1.core.businessData.competitors.get.success.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          competitors: "CompanyA, CompanyB, CompanyC",
          mainCompetitors: "CompanyA and CompanyB are our direct competitors",
          competitiveAdvantages:
            "Better pricing, superior customer service, innovative features",
          competitiveDisadvantages:
            "Smaller market presence, limited resources",
          marketPosition: "Mid-market leader with strong growth potential",
          differentiators: "Unique AI-powered features, exceptional support",
          competitorStrengths: "Strong brand recognition, large customer base",
          competitorWeaknesses: "High prices, outdated technology",
          marketGaps: "Underserved small business segment",
          additionalNotes: "Focus on differentiation through innovation",
          completionStatus: {
            isComplete: true,
            completedFields: 10,
            totalFields: 10,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          competitors: "CompanyA, CompanyB",
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
          competitors: "CompanyA, CompanyB, CompanyC",
          mainCompetitors: "CompanyA and CompanyB are our direct competitors",
          competitiveAdvantages:
            "Better pricing, superior customer service, innovative features",
          competitiveDisadvantages:
            "Smaller market presence, limited resources",
          marketPosition: "Mid-market leader with strong growth potential",
          differentiators: "Unique AI-powered features, exceptional support",
          competitorStrengths: "Strong brand recognition, large customer base",
          competitorWeaknesses: "High prices, outdated technology",
          marketGaps: "Underserved small business segment",
          additionalNotes: "Focus on differentiation through innovation",
        },
        minimal: {
          competitors: "CompanyA, CompanyB",
        },
      },
      responses: {
        default: {
          competitors: "CompanyA, CompanyB, CompanyC",
          mainCompetitors: "CompanyA and CompanyB are our direct competitors",
          competitiveAdvantages:
            "Better pricing, superior customer service, innovative features",
          competitiveDisadvantages:
            "Smaller market presence, limited resources",
          marketPosition: "Mid-market leader with strong growth potential",
          differentiators: "Unique AI-powered features, exceptional support",
          competitorStrengths: "Strong brand recognition, large customer base",
          competitorWeaknesses: "High prices, outdated technology",
          marketGaps: "Underserved small business segment",
          additionalNotes: "Focus on differentiation through innovation",
          message: "Competitors updated successfully",
          completionStatus: {
            isComplete: true,
            completedFields: 10,
            totalFields: 10,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          competitors: "CompanyA, CompanyB",
          message: "Competitors updated successfully",
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
export type CompetitorsGetRequestTypeInput = typeof GET.types.RequestInput;
export type CompetitorsGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type CompetitorsGetResponseTypeInput = typeof GET.types.ResponseInput;
export type CompetitorsGetResponseTypeOutput = typeof GET.types.ResponseOutput;

export type CompetitorsPostRequestTypeInput = typeof POST.types.RequestInput;
export type CompetitorsPostRequestTypeOutput = typeof POST.types.RequestOutput;
export type CompetitorsPostResponseTypeInput = typeof POST.types.ResponseInput;
export type CompetitorsPostResponseTypeOutput =
  typeof POST.types.ResponseOutput;

// Alias PUT types to POST types for backward compatibility
export type CompetitorsPutRequestTypeInput = typeof POST.types.RequestInput;
export type CompetitorsPutRequestTypeOutput = typeof POST.types.RequestOutput;
export type CompetitorsPutResponseTypeInput = typeof POST.types.ResponseInput;
export type CompetitorsPutResponseTypeOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const competitorsDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default competitorsDefinition;
