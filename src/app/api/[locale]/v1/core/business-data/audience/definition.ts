/**
 * Business Data Audience API Endpoint Definition
 * Defines the API endpoints for audience data management using createFormEndpoint
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createFormEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create-form-endpoint"; // ✅ Fixed type inference
import {
  field,
  objectField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";

import { UserRole } from "../../user/user-roles/enum";
import {
  AgeRange,
  AgeRangeOptions,
  CommunicationChannel,
  CommunicationChannelOptions,
  Gender,
  GenderOptions,
  IncomeLevel,
  IncomeLevelOptions,
} from "./enum";

/**
 * Audience form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "business-data", "audience"],
  category: "app.api.v1.core.businessData.audience.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.businessData.audience.get.title",
      description: "app.api.v1.core.businessData.audience.get.description",
      tags: [
        "app.api.v1.core.businessData.audience.tags.audience",
        "app.api.v1.core.businessData.audience.tags.businessData",
        "app.api.v1.core.businessData.audience.tags.get",
      ],
    },
    POST: {
      title: "app.api.v1.core.businessData.audience.put.title",
      description: "app.api.v1.core.businessData.audience.put.description",
      tags: [
        "app.api.v1.core.businessData.audience.tags.audience",
        "app.api.v1.core.businessData.audience.tags.businessData",
        "app.api.v1.core.businessData.audience.tags.update",
      ],
    },
  },

  // Shared field definitions - optimized for UI/UX consistency
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.businessData.audience.get.form.title",
      description: "app.api.v1.core.businessData.audience.get.form.description",
      layout: { type: LayoutType.STACKED }, // Mobile-first responsive layout
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Main target audience description field
      targetAudience: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.audience.put.targetAudience.label",
          description:
            "app.api.v1.core.businessData.audience.put.targetAudience.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.targetAudience.placeholder",
          layout: { columns: 12 }, // Full width for main description
          validation: { required: false },
        },
      ),

      ageRange: field(
        z.array(z.nativeEnum(AgeRange)).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.businessData.audience.put.ageRange.label",
          description:
            "app.api.v1.core.businessData.audience.put.ageRange.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.ageRange.placeholder",
          options: AgeRangeOptions,
          layout: { columns: 6 }, // Half width for demographic selects
          validation: { required: false },
          behavior: { searchable: false, clearable: true },
        },
      ),
      gender: field(
        z.array(z.nativeEnum(Gender)).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.businessData.audience.put.gender.label",
          description:
            "app.api.v1.core.businessData.audience.put.gender.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.gender.placeholder",
          options: GenderOptions,
          layout: { columns: 6 }, // Pair with age range
          validation: { required: false },
          behavior: { searchable: false, clearable: true },
        },
      ),
      location: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.businessData.audience.put.location.label",
          description:
            "app.api.v1.core.businessData.audience.put.location.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.location.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
        },
      ),
      income: field(
        z.array(z.nativeEnum(IncomeLevel)).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label: "app.api.v1.core.businessData.audience.put.income.label",
          description:
            "app.api.v1.core.businessData.audience.put.income.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.income.placeholder",
          options: IncomeLevelOptions,
          layout: { columns: 6 },
          validation: { required: false },
          behavior: { searchable: false, clearable: true },
        },
      ),
      interests: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.audience.put.interests.label",
          description:
            "app.api.v1.core.businessData.audience.put.interests.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.interests.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),
      values: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.audience.put.values.label",
          description:
            "app.api.v1.core.businessData.audience.put.values.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.values.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),
      lifestyle: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.audience.put.lifestyle.label",
          description:
            "app.api.v1.core.businessData.audience.put.lifestyle.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.lifestyle.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),
      onlineBehavior: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.audience.put.onlineBehavior.label",
          description:
            "app.api.v1.core.businessData.audience.put.onlineBehavior.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.onlineBehavior.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),
      purchaseBehavior: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.audience.put.purchaseBehavior.label",
          description:
            "app.api.v1.core.businessData.audience.put.purchaseBehavior.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.purchaseBehavior.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),
      preferredChannels: field(
        z.array(z.nativeEnum(CommunicationChannel)).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.businessData.audience.put.preferredChannels.label",
          description:
            "app.api.v1.core.businessData.audience.put.preferredChannels.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.preferredChannels.placeholder",
          options: CommunicationChannelOptions,
          layout: { columns: 6 },
          validation: { required: false },
          behavior: { searchable: true, clearable: true },
        },
      ),
      painPoints: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.audience.put.painPoints.label",
          description:
            "app.api.v1.core.businessData.audience.put.painPoints.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.painPoints.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),
      motivations: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.audience.put.motivations.label",
          description:
            "app.api.v1.core.businessData.audience.put.motivations.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.motivations.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),
      additionalNotes: field(
        z.string().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.audience.put.additionalNotes.label",
          description:
            "app.api.v1.core.businessData.audience.put.additionalNotes.description",
          placeholder:
            "app.api.v1.core.businessData.audience.put.additionalNotes.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
        },
      ),

      // Response fields - completionStatus only for GET
      completionStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.businessData.audience.get.response.completionStatus.title",
          description:
            "app.api.v1.core.businessData.audience.put.response.completionStatus.description",
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
              content: "app.api.v1.core.businessData.audience.isComplete",
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
              content: "app.api.v1.core.businessData.audience.completedFields",
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
              content: "app.api.v1.core.businessData.audience.totalFields",
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
                "app.api.v1.core.businessData.audience.completionPercentage",
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
                "app.api.v1.core.businessData.audience.missingRequiredFields",
            },
          ),
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
          content: "app.api.v1.core.businessData.audience.put.success.message",
        },
      ),
    },
  ),

  // Method-specific examples - Updated after type inference fix
  examples: {
    GET: {
      responses: {
        default: {
          targetAudience:
            "Young professionals aged 25-35 interested in technology",
          ageRange: [
            "app.api.v1.core.businessData.audience.enums.ageRange.youngAdults",
          ],
          gender: ["app.api.v1.core.businessData.audience.enums.gender.all"],
          location: "Urban areas, tech hubs",
          interests: "Technology, innovation, career development",
          income: [
            "app.api.v1.core.businessData.audience.enums.incomeLevel.middle",
          ],
          values: "Innovation, efficiency, work-life balance",
          lifestyle: "Fast-paced, tech-savvy, career-focused",
          onlineBehavior: "Active on LinkedIn, follows tech blogs",
          purchaseBehavior: "Research-driven, values quality and efficiency",
          preferredChannels: [
            "app.api.v1.core.businessData.audience.enums.communicationChannel.email",
          ],
          painPoints: "Time constraints, information overload",
          motivations: "Career advancement, staying current with technology",
          additionalNotes: "Highly engaged with digital content",
          completionStatus: {
            isComplete: true,
            completedFields: 14,
            totalFields: 14,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
      },
    },
    POST: {
      requests: {
        default: {
          targetAudience:
            "app.api.v1.core.businessData.audience.examples.targetAudience",
          ageRange: [AgeRange.MILLENNIALS],
          gender: [Gender.ALL],
          location: "app.api.v1.core.businessData.audience.examples.location",
          income: [IncomeLevel.UPPER_MIDDLE],
          interests: "app.api.v1.core.businessData.audience.examples.interests",
          values: "app.api.v1.core.businessData.audience.examples.values",
          lifestyle: "app.api.v1.core.businessData.audience.examples.lifestyle",
          onlineBehavior:
            "app.api.v1.core.businessData.audience.examples.onlineBehavior",
          purchaseBehavior:
            "app.api.v1.core.businessData.audience.examples.purchaseBehavior",
          preferredChannels: [CommunicationChannel.EMAIL],
          painPoints:
            "app.api.v1.core.businessData.audience.examples.painPoints",
          motivations:
            "app.api.v1.core.businessData.audience.examples.motivations",
          additionalNotes:
            "app.api.v1.core.businessData.audience.examples.additionalNotes",
        },
      },
      responses: {
        default: {
          message: "app.api.v1.core.businessData.audience.put.success.message",
          completionStatus: {
            isComplete: true,
            completedFields: 14,
            totalFields: 14,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
      },
    },
  },

  // Shared error types
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.businessData.audience.errors.validation.title",
      description:
        "app.api.v1.core.businessData.audience.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.businessData.audience.errors.network.title",
      description:
        "app.api.v1.core.businessData.audience.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.businessData.audience.errors.unauthorized.title",
      description:
        "app.api.v1.core.businessData.audience.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.businessData.audience.errors.forbidden.title",
      description:
        "app.api.v1.core.businessData.audience.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.businessData.audience.errors.notFound.title",
      description:
        "app.api.v1.core.businessData.audience.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.businessData.audience.errors.server.title",
      description:
        "app.api.v1.core.businessData.audience.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.businessData.audience.errors.unknown.title",
      description:
        "app.api.v1.core.businessData.audience.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.businessData.audience.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.businessData.audience.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.businessData.audience.errors.conflict.title",
      description:
        "app.api.v1.core.businessData.audience.errors.conflict.description",
    },
  },

  // Shared success types
  successTypes: {
    title: "app.api.v1.core.businessData.audience.success.title",
    description: "app.api.v1.core.businessData.audience.success.description",
  },
});

// Use the method-specific types from the endpoint definitions
export type AudienceGetRequestInput = typeof GET.types.RequestInput;
export type AudienceGetRequestOutput = typeof GET.types.RequestOutput;
export type AudienceGetResponseInput = typeof GET.types.ResponseInput;
export type AudienceGetResponseOutput = typeof GET.types.ResponseOutput;

export type AudiencePostRequestInput = typeof POST.types.RequestInput;
export type AudiencePostRequestOutput = typeof POST.types.RequestOutput;
export type AudiencePostResponseInput = typeof POST.types.ResponseInput;
export type AudiencePostResponseOutput = typeof POST.types.ResponseOutput;

// Alias PUT types to POST types for backward compatibility
export type AudiencePutRequestInput = typeof POST.types.RequestInput;
export type AudiencePutRequestOutput = typeof POST.types.RequestOutput;
export type AudiencePutResponseInput = typeof POST.types.ResponseInput;
export type AudiencePutResponseOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  GET,
  POST,
};

export default definitions;
