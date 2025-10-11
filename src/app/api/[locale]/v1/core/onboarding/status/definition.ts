/**
 * Onboarding Status Endpoint Definition
 * Defines the API endpoint for retrieving onboarding status
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import { responseField } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Get Onboarding Status Endpoint Definition (GET)
 *
 * Defines the endpoint for retrieving onboarding status for a user.
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "onboarding", "status"],
  allowedRoles: [UserRole.ADMIN, UserRole.CUSTOMER],
  aliases: ["onboarding:status", "onboarding:check"],

  title: "app.api.v1.core.onboarding.status.get.title",
  description: "app.api.v1.core.onboarding.status.get.description",
  category: "app.api.v1.core.onboarding.status.category",
  tags: [
    "app.api.v1.core.onboarding.status.tags.onboarding",
    "app.api.v1.core.onboarding.status.tags.status",
  ],

  fields: responseField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.onboarding.status.get.response.title",
      description: "app.api.v1.core.onboarding.status.get.response.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    z.object({
      userId: z.string(),
      completedSteps: z.array(z.string()),
      currentStep: z.string(),
      isCompleted: z.boolean(),
    }),
  ),

  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.onboarding.status.get.errors.validation.title",
      description: "app.api.v1.core.onboarding.status.get.errors.validation.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.onboarding.status.get.errors.notFound.title",
      description: "app.api.v1.core.onboarding.status.get.errors.notFound.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.onboarding.status.get.errors.unauthorized.title",
      description: "app.api.v1.core.onboarding.status.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.onboarding.status.get.errors.forbidden.title",
      description: "app.api.v1.core.onboarding.status.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.onboarding.status.get.errors.server.title",
      description: "app.api.v1.core.onboarding.status.get.errors.server.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.onboarding.status.get.errors.network.title",
      description: "app.api.v1.core.onboarding.status.get.errors.network.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.onboarding.status.get.errors.unknown.title",
      description: "app.api.v1.core.onboarding.status.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.onboarding.status.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.onboarding.status.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.onboarding.status.get.errors.conflict.title",
      description: "app.api.v1.core.onboarding.status.get.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.onboarding.status.get.success.title",
    description: "app.api.v1.core.onboarding.status.get.success.description",
  },

  examples: {
    responses: {
      default: {
        userId: "user-123",
        completedSteps: ["profile", "preferences"],
        currentStep: "subscription",
        isCompleted: false,
      },
    },
  },
});

// Extract types using the new enhanced system
export type OnboardingStatusGetRequestTypeInput = typeof GET.types.RequestInput;
export type OnboardingStatusGetRequestTypeOutput =
  typeof GET.types.RequestOutput;
export type OnboardingStatusGetResponseTypeInput =
  typeof GET.types.ResponseInput;
export type OnboardingStatusGetResponseTypeOutput =
  typeof GET.types.ResponseOutput;

/**
 * Export the endpoint definitions
 */
const statusEndpoints = {
  GET,
};

export { GET };
export default statusEndpoints;
