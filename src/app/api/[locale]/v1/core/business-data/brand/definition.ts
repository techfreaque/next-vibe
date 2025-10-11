/**
 * Brand API Endpoint Definition
 * Defines the API endpoints for brand data management using createFormEndpoint
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
import {
  BrandPersonality,
  BrandPersonalityOptions,
  BrandVoice,
  BrandVoiceOptions,
  VisualStyle,
  VisualStyleOptions,
} from "./enum";

/**
 * Brand form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "business-data", "brand"],
  category: "app.api.v1.core.businessData.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.businessData.brand.get.title",
      description: "app.api.v1.core.businessData.brand.get.description",
      tags: [
        "app.api.v1.core.businessData.brand.tags.brand",
        "app.api.v1.core.businessData.brand.tags.identity",
      ],
    },
    POST: {
      title: "app.api.v1.core.businessData.brand.put.title",
      description: "app.api.v1.core.businessData.brand.put.description",
      tags: [
        "app.api.v1.core.businessData.brand.tags.brand",
        "app.api.v1.core.businessData.brand.tags.identity",
        "app.api.v1.core.businessData.brand.tags.update",
      ],
    },
  },

  // Shared field definitions - optimized for UI/UX consistency
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.businessData.brand.get.form.title",
      description: "app.api.v1.core.businessData.brand.get.form.description",
      layout: { type: LayoutType.STACKED }, // Mobile-first responsive layout
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Brand guidelines field
      brandGuidelines: field(
        z.boolean().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.businessData.brand.put.brandGuidelines.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandGuidelines.description",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),

      // Brand description field - full width for better UX
      brandDescription: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.brand.put.brandDescription.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandDescription.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.brandDescription.placeholder",
          layout: { columns: 12 }, // Full width
          validation: { required: false },
        },
      ),

      // Brand values field
      brandValues: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.brand.put.brandValues.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandValues.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.brandValues.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
        },
      ),

      // Brand personality and voice - grouped for better UX
      brandPersonality: field(
        z.nativeEnum(BrandPersonality).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.businessData.brand.put.brandPersonality.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandPersonality.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.brandPersonality.placeholder",
          options: BrandPersonalityOptions,
          layout: { columns: 6 }, // Half width for select fields
          validation: { required: false },
        },
      ),

      brandVoice: field(
        z.nativeEnum(BrandVoice).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.businessData.brand.put.brandVoice.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandVoice.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.brandVoice.placeholder",
          options: BrandVoiceOptions,
          layout: { columns: 6 }, // Half width to pair with personality
          validation: { required: false },
        },
      ),

      // Brand tone field
      brandTone: field(
        z.string().max(200).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.businessData.brand.put.brandTone.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandTone.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.brandTone.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
        },
      ),

      // Visual design fields - grouped for consistency
      visualStyle: field(
        z.nativeEnum(VisualStyle).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.businessData.brand.put.visualStyle.label",
          description:
            "app.api.v1.core.businessData.brand.put.visualStyle.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.visualStyle.placeholder",
          options: VisualStyleOptions,
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),

      brandColors: field(
        z.string().max(200).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.businessData.brand.put.colorPalette.label",
          description:
            "app.api.v1.core.businessData.brand.put.colorPalette.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.colorPalette.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),

      brandFonts: field(
        z.string().max(200).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.businessData.brand.put.typography.label",
          description:
            "app.api.v1.core.businessData.brand.put.typography.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.typography.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),

      logoDescription: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.brand.put.logoDescription.label",
          description:
            "app.api.v1.core.businessData.brand.put.logoDescription.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.logoDescription.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),

      // Brand positioning fields
      brandPromise: field(
        z.string().max(300).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.brand.put.brandPromise.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandPromise.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.brandPromise.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
        },
      ),

      brandDifferentiators: field(
        z.string().max(500).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.brand.put.brandDifferentiators.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandDifferentiators.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.brandDifferentiators.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
        },
      ),

      // Mission and vision - paired for logical grouping
      brandMission: field(
        z.string().max(300).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.brand.put.brandMission.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandMission.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.brandMission.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),

      brandVision: field(
        z.string().max(300).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.businessData.brand.put.brandVision.label",
          description:
            "app.api.v1.core.businessData.brand.put.brandVision.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.brandVision.placeholder",
          layout: { columns: 6 },
          validation: { required: false },
        },
      ),

      // Brand assets - boolean fields grouped for better UX
      hasStyleGuide: field(
        z.boolean().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.businessData.brand.put.hasStyleGuide.label",
          description:
            "app.api.v1.core.businessData.brand.put.hasStyleGuide.description",
          layout: { columns: 4 }, // Three columns for boolean group
          validation: { required: false },
        },
      ),

      hasLogoFiles: field(
        z.boolean().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.businessData.brand.put.hasLogoFiles.label",
          description:
            "app.api.v1.core.businessData.brand.put.hasLogoFiles.description",
          layout: { columns: 4 },
          validation: { required: false },
        },
      ),

      hasBrandAssets: field(
        z.boolean().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.businessData.brand.put.hasBrandAssets.label",
          description:
            "app.api.v1.core.businessData.brand.put.hasBrandAssets.description",
          layout: { columns: 4 },
          validation: { required: false },
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
          label: "app.api.v1.core.businessData.brand.put.additionalNotes.label",
          description:
            "app.api.v1.core.businessData.brand.put.additionalNotes.description",
          placeholder:
            "app.api.v1.core.businessData.brand.put.additionalNotes.placeholder",
          layout: { columns: 12 },
          validation: { required: false },
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
          content: "app.api.v1.core.businessData.brand.put.success.message",
        },
      ),

      // Completion status - for both GET and POST responses
      completionStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.businessData.brand.get.response.completionStatus.title",
          description:
            "app.api.v1.core.businessData.brand.get.response.completionStatus.description",
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
              content: "app.api.v1.core.businessData.brand.isComplete",
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
              content: "app.api.v1.core.businessData.brand.completedFields",
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
              content: "app.api.v1.core.businessData.brand.totalFields",
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
                "app.api.v1.core.businessData.brand.completionPercentage",
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
                "app.api.v1.core.businessData.brand.missingRequiredFields",
            },
          ),
        },
      ),
    },
  ),

  // Shared error and success configuration
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.businessData.brand.get.errors.validation.title",
      description:
        "app.api.v1.core.businessData.brand.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.businessData.brand.get.errors.notFound.title",
      description:
        "app.api.v1.core.businessData.brand.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.businessData.brand.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.businessData.brand.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.businessData.brand.get.errors.forbidden.title",
      description:
        "app.api.v1.core.businessData.brand.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.businessData.brand.get.errors.server.title",
      description:
        "app.api.v1.core.businessData.brand.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.businessData.brand.get.errors.network.title",
      description:
        "app.api.v1.core.businessData.brand.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.businessData.brand.get.errors.unknown.title",
      description:
        "app.api.v1.core.businessData.brand.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.businessData.brand.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.businessData.brand.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.businessData.brand.get.errors.conflict.title",
      description:
        "app.api.v1.core.businessData.brand.get.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.businessData.brand.get.success.title",
    description: "app.api.v1.core.businessData.brand.get.success.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          brandDescription: "A modern, innovative tech company",
          brandValues: "Innovation, reliability, customer-first",
          brandPersonality: BrandPersonality.PROFESSIONAL,
          brandVoice: BrandVoice.PROFESSIONAL,
          brandTone: "Professional yet friendly",
          brandColors: "#007bff, #28a745, #ffffff",
          brandFonts: "Inter, Roboto",
          logoDescription: "Clean, modern logo with blue accent",
          visualStyle: VisualStyle.MODERN,
          brandPromise: "Delivering innovative solutions that work",
          brandDifferentiators: "Cutting-edge technology, exceptional support",
          brandMission: "To empower businesses through technology",
          brandVision: "A world where technology serves humanity",
          hasStyleGuide: true,
          hasLogoFiles: true,
          hasBrandAssets: true,
          additionalNotes: "Focus on accessibility and inclusivity",
          completionStatus: {
            isComplete: false,
            completedFields: 8,
            totalFields: 18,
            completionPercentage: 44,
            missingRequiredFields: [],
          },
        },
        minimal: {
          brandDescription: "A tech startup",
          brandPersonality: BrandPersonality.INNOVATIVE,
          brandVoice: BrandVoice.CASUAL,
          completionStatus: {
            isComplete: false,
            completedFields: 3,
            totalFields: 18,
            completionPercentage: 17,
            missingRequiredFields: [],
          },
        },
      },
    },
    POST: {
      requests: {
        default: {
          brandDescription: "A modern, innovative tech company",
          brandValues: "Innovation, reliability, customer-first",
          brandPersonality: BrandPersonality.PROFESSIONAL,
          brandVoice: BrandVoice.PROFESSIONAL,
          brandTone: "Professional yet friendly",
          brandColors: "#007bff, #28a745, #ffffff",
          brandFonts: "Inter, Roboto",
          logoDescription: "Clean, modern logo with blue accent",
          visualStyle: VisualStyle.MODERN,
          brandPromise: "Delivering innovative solutions that work",
          brandDifferentiators: "Cutting-edge technology, exceptional support",
          brandMission: "To empower businesses through technology",
          brandVision: "A world where technology serves humanity",
          hasStyleGuide: true,
          hasLogoFiles: true,
          hasBrandAssets: true,
          additionalNotes: "Focus on accessibility and inclusivity",
        },
        minimal: {
          brandDescription: "A tech startup",
          brandPersonality: BrandPersonality.INNOVATIVE,
          brandVoice: BrandVoice.CASUAL,
        },
      },
      responses: {
        default: {
          brandDescription: "A modern, innovative tech company",
          brandValues: "Innovation, reliability, customer-first",
          brandPersonality: BrandPersonality.PROFESSIONAL,
          brandVoice: BrandVoice.PROFESSIONAL,
          brandTone: "Professional yet friendly",
          brandColors: "#007bff, #28a745, #ffffff",
          brandFonts: "Inter, Roboto",
          logoDescription: "Clean, modern logo with blue accent",
          visualStyle: VisualStyle.MODERN,
          brandPromise: "Delivering innovative solutions that work",
          brandDifferentiators: "Cutting-edge technology, exceptional support",
          brandMission: "To empower businesses through technology",
          brandVision: "A world where technology serves humanity",
          hasStyleGuide: true,
          hasLogoFiles: true,
          hasBrandAssets: true,
          additionalNotes: "Focus on accessibility and inclusivity",
          message: "Brand updated successfully",
          completionStatus: {
            isComplete: true,
            completedFields: 18,
            totalFields: 18,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          brandDescription: "A tech startup",
          brandPersonality: BrandPersonality.INNOVATIVE,
          brandVoice: BrandVoice.CASUAL,
          message: "Brand updated successfully",
          completionStatus: {
            isComplete: false,
            completedFields: 3,
            totalFields: 18,
            completionPercentage: 17,
            missingRequiredFields: [],
          },
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type BrandGetRequestTypeInput = typeof GET.types.RequestInput;
export type BrandGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type BrandGetResponseTypeInput = typeof GET.types.ResponseInput;
export type BrandGetResponseTypeOutput = typeof GET.types.ResponseOutput;

export type BrandPostRequestTypeInput = typeof POST.types.RequestInput;
export type BrandPostRequestTypeOutput = typeof POST.types.RequestOutput;
export type BrandPostResponseTypeInput = typeof POST.types.ResponseInput;
export type BrandPostResponseTypeOutput = typeof POST.types.ResponseOutput;

// Alias PUT types to POST types for backward compatibility
export type BrandPutRequestTypeInput = typeof POST.types.RequestInput;
export type BrandPutRequestTypeOutput = typeof POST.types.RequestOutput;
export type BrandPutResponseTypeInput = typeof POST.types.ResponseInput;
export type BrandPutResponseTypeOutput = typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const brandDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default brandDefinition;
