/**
 * Human Confirmation API Route Definition
 * Defines endpoint for responding to human confirmation requests
 */

import { z } from "zod";

import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import {
  objectField,
  requestDataField,
  requestUrlParamsField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import {
  ConfirmationResponseAction,
  ConfirmationResponseActionOptions,
} from "../../enum";

/**
 * Human Confirmation Response Endpoint (POST)
 * Responds to a human confirmation request (approve/reject)
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "confirmation", "[id]"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.agent.confirmation.id.post.title",
  description: "app.api.v1.core.agent.confirmation.id.post.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.confirmation",
    "app.api.v1.core.agent.tags.automation",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.confirmation.id.post.form.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true, urlParams: true },
    {
      // === URL PARAMETERS ===
      id: requestUrlParamsField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label: "app.api.v1.core.agent.confirmation.id.post.id.label",
          description:
            "app.api.v1.core.agent.confirmation.id.post.id.description",
          layout: { columns: 12 },
        },
        z.uuid(),
      ),

      // === REQUEST FIELDS ===
      confirmationId: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.UUID,
          label:
            "app.api.v1.core.agent.confirmation.id.post.confirmationId.label",
          description:
            "app.api.v1.core.agent.confirmation.id.post.confirmationId.description",
          layout: { columns: 6 },
        },
        z.uuid(),
      ),
      action: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.confirmation.id.post.action.label",
          description:
            "app.api.v1.core.agent.confirmation.id.post.action.description",
          layout: { columns: 3 },
          options: ConfirmationResponseActionOptions,
        },
        z.nativeEnum(ConfirmationResponseAction),
      ),
      reason: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.confirmation.id.post.reason.label",
          description:
            "app.api.v1.core.agent.confirmation.id.post.reason.description",
          layout: { columns: 6 },
          placeholder:
            "app.api.v1.core.agent.confirmation.id.post.reason.placeholder",
        },
        z.string().optional(),
      ),
      metadata: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.confirmation.id.post.metadata.label",
          description:
            "app.api.v1.core.agent.confirmation.id.post.metadata.description",
          layout: { columns: 6 },
          placeholder:
            "app.api.v1.core.agent.confirmation.id.post.metadata.placeholder",
        },
        z.record(z.string(), z.unknown()).optional(),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.confirmation.id.post.response.title",
          description:
            "app.api.v1.core.agent.confirmation.id.post.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          success: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.confirmation.id.post.response.success",
            },
            z.boolean(),
          ),
          message: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.confirmation.id.post.response.message",
            },
            z.string(),
          ),
        },
      ),
    },
  ),

  errorTypes: {
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.confirmation.id.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.confirmation.id.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.confirmation.id.post.errors.server.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.confirmation.id.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.confirmation.id.post.errors.network.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.confirmation.id.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.confirmation.id.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.confirmation.id.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.confirmation.id.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.confirmation.id.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.confirmation.id.post.success.title",
    description:
      "app.api.v1.core.agent.confirmation.id.post.success.description",
  },

  examples: {
    requests: {
      default: {
        confirmationId: "123e4567-e89b-12d3-a456-426614174000",
        action: ConfirmationResponseAction.APPROVE,
        reason: "Action approved by admin",
      },
      approve: {
        confirmationId: "123e4567-e89b-12d3-a456-426614174000",
        action: ConfirmationResponseAction.APPROVE,
        reason: "Action approved by admin",
      },
      reject: {
        confirmationId: "123e4567-e89b-12d3-a456-426614174000",
        action: ConfirmationResponseAction.REJECT,
        reason: "Action rejected due to policy violation",
      },
    },
    responses: {
      default: {
        response: {
          success: true,
          message: "Confirmation response processed successfully",
        },
      },
      approve: {
        response: {
          success: true,
          message: "Confirmation approved successfully",
        },
      },
      reject: {
        response: {
          success: true,
          message: "Confirmation rejected successfully",
        },
      },
    },
    urlPathVariables: undefined,
  },
});

// Extract types using the new enhanced system
export type HumanConfirmationResponsePostRequestTypeInput =
  typeof POST.types.RequestInput;
export type HumanConfirmationResponsePostRequestTypeOutput =
  typeof POST.types.RequestOutput;
export type HumanConfirmationResponsePostResponseTypeInput =
  typeof POST.types.ResponseInput;
export type HumanConfirmationResponsePostResponseTypeOutput =
  typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
};

export { POST };
export default definitions;
