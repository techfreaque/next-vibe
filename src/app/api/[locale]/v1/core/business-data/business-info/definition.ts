/**
 * Business Info API Endpoint Definition
 * Defines the API endpoints for business info data management using createFormEndpoint
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
  BusinessSize,
  BusinessSizeOptions,
  BusinessType,
  BusinessTypeOptions,
  Industry,
  IndustryOptions,
} from "./enum";

/**
 * Business Info form endpoint with GET and POST methods
 */
const { GET, POST } = createFormEndpoint({
  // Shared configuration
  path: ["v1", "core", "business-data", "business-info"],
  category: "app.api.v1.core.businessData.category",
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],

  // Method-specific configuration
  methods: {
    GET: {
      title: "app.api.v1.core.businessData.businessInfo.get.title",
      description: "app.api.v1.core.businessData.businessInfo.get.description",
      tags: [
        "app.api.v1.core.businessData.businessInfo.tags.businessInfo",
        "app.api.v1.core.businessData.businessInfo.tags.company",
      ],
    },
    POST: {
      title: "app.api.v1.core.businessData.businessInfo.put.title",
      description: "app.api.v1.core.businessData.businessInfo.put.description",
      tags: [
        "app.api.v1.core.businessData.businessInfo.tags.businessInfo",
        "app.api.v1.core.businessData.businessInfo.tags.company",
        "app.api.v1.core.businessData.businessInfo.tags.update",
      ],
    },
  },

  // Shared field definitions - configured for GET (response-only) and POST (request+response)
  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.businessData.businessInfo.get.form.title",
      description:
        "app.api.v1.core.businessData.businessInfo.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    {
      GET: { response: true },
      POST: { request: "data", response: true },
    },
    {
      // Business name field
      businessName: field(
        z.string().max(200).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label:
            "app.api.v1.core.businessData.businessInfo.put.businessName.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.businessName.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.businessName.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Industry field
      industry: field(
        z.nativeEnum(Industry).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.businessData.businessInfo.put.industry.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.industry.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.industry.placeholder",
          options: IndustryOptions,
          layout: { columns: 6 },
        },
      ),

      // Business type field
      businessType: field(
        z.nativeEnum(BusinessType).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.businessData.businessInfo.put.businessType.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.businessType.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.businessType.placeholder",
          options: BusinessTypeOptions,
          layout: { columns: 6 },
        },
      ),

      // Business size field
      businessSize: field(
        z.nativeEnum(BusinessSize).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label:
            "app.api.v1.core.businessData.businessInfo.put.businessSize.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.businessSize.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.businessSize.placeholder",
          options: BusinessSizeOptions,
          layout: { columns: 6 },
        },
      ),

      // Founded year field
      foundedYear: field(
        z.number().int().min(1800).max(new Date().getFullYear()).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.businessData.businessInfo.put.foundedYear.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.foundedYear.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.foundedYear.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Employee count field
      employeeCount: field(
        z.number().int().min(0).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.businessData.businessInfo.put.employeeCount.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.employeeCount.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.employeeCount.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Business email field
      businessEmail: field(
        z.email().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.EMAIL,
          label:
            "app.api.v1.core.businessData.businessInfo.put.businessEmail.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.businessEmail.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.businessEmail.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Business phone field
      businessPhone: field(
        z.string().max(20).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.PHONE,
          label:
            "app.api.v1.core.businessData.businessInfo.put.businessPhone.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.businessPhone.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.businessPhone.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Country field
      country: field(
        z.string().max(100).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.businessData.businessInfo.put.country.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.country.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.country.placeholder",
          layout: { columns: 6 },
        },
      ),

      // City field
      city: field(
        z.string().max(100).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.businessData.businessInfo.put.city.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.city.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.city.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Location field
      location: field(
        z.string().max(300).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.businessData.businessInfo.put.location.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.location.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.location.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Website field
      website: field(
        z.string().url().optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.URL,
          label: "app.api.v1.core.businessData.businessInfo.put.website.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.website.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.website.placeholder",
          layout: { columns: 6 },
        },
      ),

      // Description field
      description: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.businessInfo.put.businessDescription.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.businessDescription.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.businessDescription.placeholder",
          layout: { columns: 12 },
        },
      ),

      // Products/Services field
      productsServices: field(
        z.string().max(1000).optional(),
        {
          GET: { response: true },
          POST: { request: "data", response: true },
        },
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label:
            "app.api.v1.core.businessData.businessInfo.put.productsServices.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.productsServices.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.productsServices.placeholder",
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
            "app.api.v1.core.businessData.businessInfo.put.additionalNotes.label",
          description:
            "app.api.v1.core.businessData.businessInfo.put.additionalNotes.description",
          placeholder:
            "app.api.v1.core.businessData.businessInfo.put.additionalNotes.placeholder",
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
            "app.api.v1.core.businessData.businessInfo.put.success.message",
        },
      ),

      // Completion status - for both GET and POST responses
      completionStatus: objectField(
        {
          type: WidgetType.CONTAINER,
          title:
            "app.api.v1.core.businessData.businessInfo.get.response.completionStatus.title",
          description:
            "app.api.v1.core.businessData.businessInfo.get.response.completionStatus.description",
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
              content: "app.api.v1.core.businessData.businessInfo.isComplete",
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
                "app.api.v1.core.businessData.businessInfo.completedFields",
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
              content: "app.api.v1.core.businessData.businessInfo.totalFields",
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
                "app.api.v1.core.businessData.businessInfo.completionPercentage",
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
                "app.api.v1.core.businessData.businessInfo.missingRequiredFields",
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
        "app.api.v1.core.businessData.businessInfo.get.errors.validation.title",
      description:
        "app.api.v1.core.businessData.businessInfo.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.businessData.businessInfo.get.errors.notFound.title",
      description:
        "app.api.v1.core.businessData.businessInfo.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.businessData.businessInfo.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.businessData.businessInfo.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.businessData.businessInfo.get.errors.forbidden.title",
      description:
        "app.api.v1.core.businessData.businessInfo.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.businessData.businessInfo.get.errors.server.title",
      description:
        "app.api.v1.core.businessData.businessInfo.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.businessData.businessInfo.get.errors.network.title",
      description:
        "app.api.v1.core.businessData.businessInfo.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.businessData.businessInfo.get.errors.unknown.title",
      description:
        "app.api.v1.core.businessData.businessInfo.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.businessData.businessInfo.put.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.businessData.businessInfo.put.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.businessData.businessInfo.put.errors.conflict.title",
      description:
        "app.api.v1.core.businessData.businessInfo.put.errors.conflict.description",
    },
  },
  successTypes: {
    title: "app.api.v1.core.businessData.businessInfo.get.success.title",
    description:
      "app.api.v1.core.businessData.businessInfo.get.success.description",
  },

  // Method-specific examples
  examples: {
    GET: {
      responses: {
        default: {
          businessName: "TechCorp Inc.",
          industry: Industry.TECHNOLOGY,
          businessType: BusinessType.CORPORATION,
          businessSize: BusinessSize.MEDIUM,
          businessEmail: "info@techcorp.com",
          businessPhone: "+1-555-0123",
          country: "United States",
          city: "San Francisco",
          foundedYear: 2015,
          employeeCount: 150,
          website: "https://techcorp.com",
          description:
            "A leading technology company specializing in AI solutions",
          productsServices: "AI software, consulting, cloud services",
          additionalNotes: "Focus on enterprise clients",
          completionStatus: {
            isComplete: true,
            completedFields: 11,
            totalFields: 11,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          businessName: "StartupCo",
          industry: Industry.TECHNOLOGY,
          completionStatus: {
            isComplete: false,
            completedFields: 2,
            totalFields: 11,
            completionPercentage: 18,
            missingRequiredFields: ["businessType"],
          },
        },
      },
    },
    POST: {
      requests: {
        default: {
          businessName: "TechCorp Inc.",
          industry: Industry.TECHNOLOGY,
          businessType: BusinessType.CORPORATION,
          businessSize: BusinessSize.MEDIUM,
          businessEmail: "info@techcorp.com",
          businessPhone: "+1-555-0123",
          country: "United States",
          city: "San Francisco",
          foundedYear: 2015,
          employeeCount: 150,
          website: "https://techcorp.com",
          description:
            "A leading technology company specializing in AI solutions",
          productsServices: "AI software, consulting, cloud services",
          additionalNotes: "Focus on enterprise clients",
        },
        minimal: {
          businessName: "StartupCo",
          industry: Industry.TECHNOLOGY,
        },
      },
      responses: {
        default: {
          businessName: "TechCorp Inc.",
          industry: Industry.TECHNOLOGY,
          businessType: BusinessType.CORPORATION,
          businessSize: BusinessSize.MEDIUM,
          businessEmail: "info@techcorp.com",
          businessPhone: "+1-555-0123",
          country: "United States",
          city: "San Francisco",
          foundedYear: 2015,
          employeeCount: 150,
          website: "https://techcorp.com",
          description:
            "A leading technology company specializing in AI solutions",
          productsServices: "AI software, consulting, cloud services",
          additionalNotes: "Focus on enterprise clients",
          message: "Business info updated successfully",
          completionStatus: {
            isComplete: true,
            completedFields: 11,
            totalFields: 11,
            completionPercentage: 100,
            missingRequiredFields: [],
          },
        },
        minimal: {
          businessName: "StartupCo",
          industry: Industry.TECHNOLOGY,
          message: "Business info updated successfully",
          completionStatus: {
            isComplete: false,
            completedFields: 2,
            totalFields: 11,
            completionPercentage: 18,
            missingRequiredFields: ["businessType"],
          },
        },
      },
    },
  },
});

// Extract types using the new enhanced system
export type BusinessInfoGetRequestTypeInput = typeof GET.types.RequestInput;
export type BusinessInfoGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type BusinessInfoGetResponseTypeInput = typeof GET.types.ResponseInput;
export type BusinessInfoGetResponseTypeOutput = typeof GET.types.ResponseOutput;

export type BusinessInfoPostRequestTypeInput = typeof POST.types.RequestInput;
export type BusinessInfoPostRequestTypeOutput = typeof POST.types.RequestOutput;
export type BusinessInfoPostResponseTypeInput = typeof POST.types.ResponseInput;
export type BusinessInfoPostResponseTypeOutput =
  typeof POST.types.ResponseOutput;

// Alias PUT types to POST types for backward compatibility
export type BusinessInfoPutRequestTypeInput = typeof POST.types.RequestInput;
export type BusinessInfoPutRequestTypeOutput = typeof POST.types.RequestOutput;
export type BusinessInfoPutResponseTypeInput = typeof POST.types.ResponseInput;
export type BusinessInfoPutResponseTypeOutput =
  typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const businessInfoDefinition = {
  GET,
  POST,
};

export { GET, POST };
export default businessInfoDefinition;
