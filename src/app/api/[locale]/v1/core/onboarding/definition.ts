import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { LayoutType } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

// Schema imports removed - using inline z.object() definitions

/**
 * Enhanced endpoint definition for onboarding GET operations
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "onboarding"],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],
  aliases: ["onboarding", "onboarding:get"],

  title: "app.api.v1.core.onboarding.get.title",
  description: "app.api.v1.core.onboarding.get.description",
  category: "app.api.v1.core.onboarding.category",
  tags: [
    "app.api.v1.core.onboarding.tags.onboarding",
    "app.api.v1.core.onboarding.tags.status",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.onboarding.get.form.title",
      description: "app.api.v1.core.onboarding.get.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { response: true },
    {
      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.onboarding.get.response.title",
          description: "app.api.v1.core.onboarding.get.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          userId: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.onboarding.get.response.userId.content",
            },
            z.string(),
          ),
          completedSteps: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.onboarding.get.response.completedSteps.content",
            },
            z.array(z.string()),
          ),
          currentStep: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.onboarding.get.response.currentStep.content",
            },
            z.string(),
          ),
          isCompleted: responseField(
            {
              type: WidgetType.TEXT,
              content: "app.api.v1.core.onboarding.get.response.isCompleted.content",
            },
            z.boolean(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.onboarding.get.errors.validation.title",
      description:
        "app.api.v1.core.onboarding.get.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.onboarding.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.onboarding.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.onboarding.get.errors.server.title",
      description: "app.api.v1.core.onboarding.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.onboarding.get.errors.unknown.title",
      description: "app.api.v1.core.onboarding.get.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.onboarding.get.errors.network.title",
      description: "app.api.v1.core.onboarding.get.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.onboarding.get.errors.forbidden.title",
      description:
        "app.api.v1.core.onboarding.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.onboarding.get.errors.notFound.title",
      description: "app.api.v1.core.onboarding.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.onboarding.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.onboarding.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.onboarding.get.errors.conflict.title",
      description: "app.api.v1.core.onboarding.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.onboarding.get.success.title",
    description: "app.api.v1.core.onboarding.get.success.description",
  },

  examples: {},
});

/**
 * Enhanced endpoint definition for onboarding POST operations
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "onboarding"],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],
  aliases: ["onboarding:post", "onboarding:update"],

  title: "app.api.v1.core.onboarding.post.title",
  description: "app.api.v1.core.onboarding.post.description",
  category: "app.api.v1.core.onboarding.category",
  tags: [
    "app.api.v1.core.onboarding.tags.onboarding",
    "app.api.v1.core.onboarding.tags.update",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.onboarding.post.form.title",
      description: "app.api.v1.core.onboarding.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      completedSteps: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.onboarding.post.completedSteps.label",
          description:
            "app.api.v1.core.onboarding.post.completedSteps.description",
          placeholder:
            "app.api.v1.core.onboarding.post.completedSteps.placeholder",
        },
        z.array(z.string()).optional(),
      ),

      currentStep: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.onboarding.post.currentStep.label",
          description:
            "app.api.v1.core.onboarding.post.currentStep.description",
          placeholder:
            "app.api.v1.core.onboarding.post.currentStep.placeholder",
        },
        z.string().optional(),
      ),

      isCompleted: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.onboarding.post.isCompleted.label",
          description:
            "app.api.v1.core.onboarding.post.isCompleted.description",
        },
        z.boolean().optional(),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.onboarding.post.response.title",
          description: "app.api.v1.core.onboarding.post.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        z.object({
          id: z.uuid(),
          userId: z.string(),
          completedSteps: z.array(z.string()),
          currentStep: z.string(),
          isCompleted: z.boolean(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.onboarding.post.errors.validation.title",
      description:
        "app.api.v1.core.onboarding.post.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.onboarding.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.onboarding.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.onboarding.post.errors.server.title",
      description: "app.api.v1.core.onboarding.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.onboarding.post.errors.unknown.title",
      description: "app.api.v1.core.onboarding.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.onboarding.post.errors.network.title",
      description: "app.api.v1.core.onboarding.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.onboarding.post.errors.forbidden.title",
      description:
        "app.api.v1.core.onboarding.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.onboarding.post.errors.notFound.title",
      description:
        "app.api.v1.core.onboarding.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.onboarding.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.onboarding.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.onboarding.post.errors.conflict.title",
      description:
        "app.api.v1.core.onboarding.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.onboarding.post.success.title",
    description: "app.api.v1.core.onboarding.post.success.description",
  },

  examples: {},
});

/**
 * Enhanced endpoint definition for onboarding PUT operations
 */
const { PUT } = createEndpoint({
  method: Methods.PUT,
  path: ["v1", "core", "onboarding"],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],
  aliases: ["onboarding:put", "onboarding:complete"],

  title: "app.api.v1.core.onboarding.put.title",
  description: "app.api.v1.core.onboarding.put.description",
  category: "app.api.v1.core.onboarding.category",
  tags: [
    "app.api.v1.core.onboarding.tags.onboarding",
    "app.api.v1.core.onboarding.tags.update",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.onboarding.put.form.title",
      description: "app.api.v1.core.onboarding.put.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST DATA FIELDS ===
      completedSteps: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.onboarding.put.completedSteps.label",
          description:
            "app.api.v1.core.onboarding.put.completedSteps.description",
          placeholder:
            "app.api.v1.core.onboarding.put.completedSteps.placeholder",
        },
        z.array(z.string()).optional(),
      ),

      currentStep: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXT,
          label: "app.api.v1.core.onboarding.put.currentStep.label",
          description: "app.api.v1.core.onboarding.put.currentStep.description",
          placeholder: "app.api.v1.core.onboarding.put.currentStep.placeholder",
        },
        z.string().optional(),
      ),

      isCompleted: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.onboarding.put.isCompleted.label",
          description: "app.api.v1.core.onboarding.put.isCompleted.description",
        },
        z.boolean().optional(),
      ),

      // === RESPONSE FIELDS ===
      response: responseField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.onboarding.put.response.title",
          description: "app.api.v1.core.onboarding.put.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        z.object({
          id: z.uuid(),
          userId: z.string(),
          completedSteps: z.array(z.string()),
          currentStep: z.string(),
          isCompleted: z.boolean(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.onboarding.put.errors.validation.title",
      description:
        "app.api.v1.core.onboarding.put.errors.validation.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.onboarding.put.errors.unauthorized.title",
      description:
        "app.api.v1.core.onboarding.put.errors.unauthorized.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.onboarding.put.errors.server.title",
      description: "app.api.v1.core.onboarding.put.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.onboarding.put.errors.unknown.title",
      description: "app.api.v1.core.onboarding.put.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.onboarding.put.errors.network.title",
      description: "app.api.v1.core.onboarding.put.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.onboarding.put.errors.forbidden.title",
      description:
        "app.api.v1.core.onboarding.put.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.onboarding.put.errors.notFound.title",
      description: "app.api.v1.core.onboarding.put.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.onboarding.put.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.onboarding.put.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.onboarding.put.errors.conflict.title",
      description: "app.api.v1.core.onboarding.put.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.onboarding.put.success.title",
    description: "app.api.v1.core.onboarding.put.success.description",
  },

  examples: {},
});

// Extract types using the new enhanced system
export type OnboardingGetRequestTypeInput = typeof GET.types.RequestInput;
export type OnboardingGetRequestTypeOutput = typeof GET.types.RequestOutput;
export type OnboardingGetResponseTypeInput = typeof GET.types.ResponseInput;
export type OnboardingGetResponseTypeOutput = typeof GET.types.ResponseOutput;

export type OnboardingPostRequestTypeInput = typeof POST.types.RequestInput;
export type OnboardingPostRequestTypeOutput = typeof POST.types.RequestOutput;
export type OnboardingPostResponseTypeInput = typeof POST.types.ResponseInput;
export type OnboardingPostResponseTypeOutput = typeof POST.types.ResponseOutput;

export type OnboardingPutRequestTypeInput = typeof PUT.types.RequestInput;
export type OnboardingPutRequestTypeOutput = typeof PUT.types.RequestOutput;
export type OnboardingPutResponseTypeInput = typeof PUT.types.ResponseInput;
export type OnboardingPutResponseTypeOutput = typeof PUT.types.ResponseOutput;

// Additional types for repository use
export type OnboardingStatusResponseType = {
  userId: string;
  isCompleted: boolean;
  currentStep: string;
  completedSteps: string[];
};

export type OnboardingType = {
  planId: string;
  name: string;
  email: string;
  address?: string;
  city?: string;
  postalCode: string;
  country: string;
  currency: string;
};

// Schema types removed - use EndpointDefinition types from above instead

/**
 * Export the endpoint definitions
 */
const onboardingEndpoints = {
  GET,
  POST,
  PUT,
};

export { GET, POST, PUT };
export default onboardingEndpoints;
