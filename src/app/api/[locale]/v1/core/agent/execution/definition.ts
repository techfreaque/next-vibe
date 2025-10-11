/**
 * Email Agent Execution API Route Definition
 * Defines endpoint for manually triggering email agent action execution
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
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/fields/utils";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Email Agent Execution Endpoint (POST)
 * Manually triggers execution of approved actions and tool calls
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "execution"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.agent.execution.post.title",
  description: "app.api.v1.core.agent.execution.post.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.automation",
    "app.api.v1.core.agent.tags.execution",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.execution.post.form.title",
      description: "app.api.v1.core.agent.execution.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      confirmationIds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.execution.post.confirmationIds.label",
          description:
            "app.api.v1.core.agent.execution.post.confirmationIds.description",
          layout: { columns: 6 },
          placeholder:
            "app.api.v1.core.agent.execution.post.confirmationIds.placeholder",
        },
        z.array(z.uuid()).optional(),
      ),
      maxActionsPerRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label: "app.api.v1.core.agent.execution.post.maxActionsPerRun.label",
          description:
            "app.api.v1.core.agent.execution.post.maxActionsPerRun.description",
          layout: { columns: 3 },
        },
        z.number().min(1).max(100).default(25),
      ),
      enableToolExecution: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.execution.post.enableToolExecution.label",
          description:
            "app.api.v1.core.agent.execution.post.enableToolExecution.description",
          layout: { columns: 3 },
        },
        z.boolean().default(true),
      ),
      enableConfirmationCleanup: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.execution.post.enableConfirmationCleanup.label",
          description:
            "app.api.v1.core.agent.execution.post.enableConfirmationCleanup.description",
          layout: { columns: 3 },
        },
        z.boolean().default(true),
      ),
      confirmationExpiryHours: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.agent.execution.post.confirmationExpiryHours.label",
          description:
            "app.api.v1.core.agent.execution.post.confirmationExpiryHours.description",
          layout: { columns: 3 },
        },
        z.number().min(1).max(168).default(24),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.execution.post.response.title",
          description:
            "app.api.v1.core.agent.execution.post.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          actionsExecuted: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.execution.post.response.actionsExecuted",
            },
            z.number(),
          ),
          confirmationsProcessed: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.execution.post.response.confirmationsProcessed",
            },
            z.number(),
          ),
          expiredConfirmationsCleanedUp: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.execution.post.response.expiredConfirmationsCleanedUp",
            },
            z.number(),
          ),
          toolCallsExecuted: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.execution.post.response.toolCallsExecuted",
            },
            z.number(),
          ),
          errors: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              cardConfig: {
                title: "confirmationId",
                subtitle: "action",
                content: ["error"],
                metadata: ["emailId"],
              },
              layout: "list",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.agent.execution.post.response.errors.item",
                description:
                  "app.api.v1.core.agent.execution.post.response.errors.item",
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                confirmationId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.execution.post.response.errors.confirmationId",
                  },
                  z.string().optional(),
                ),
                emailId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.execution.post.response.errors.emailId",
                  },
                  z.string().optional(),
                ),
                action: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.execution.post.response.errors.action",
                  },
                  z.string(),
                ),
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.execution.post.response.errors.error",
                  },
                  z.string(),
                ),
              },
            ),
          ),
          summary: objectField(
            {
              type: WidgetType.CONTAINER,
              title:
                "app.api.v1.core.agent.execution.post.response.summary.title",
              description:
                "app.api.v1.core.agent.execution.post.response.summary.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              totalProcessed: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.execution.post.response.summary.totalProcessed",
                },
                z.number(),
              ),
              successfulExecutions: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.execution.post.response.summary.successfulExecutions",
                },
                z.number(),
              ),
              failedExecutions: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.execution.post.response.summary.failedExecutions",
                },
                z.number(),
              ),
              pendingConfirmations: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.execution.post.response.summary.pendingConfirmations",
                },
                z.number(),
              ),
              expiredConfirmations: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.execution.post.response.summary.expiredConfirmations",
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
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.v1.core.agent.execution.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.execution.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.execution.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.execution.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.execution.post.errors.server.title",
      description:
        "app.api.v1.core.agent.execution.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.execution.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.execution.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.execution.post.errors.network.title",
      description:
        "app.api.v1.core.agent.execution.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.execution.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.execution.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.execution.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.execution.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.agent.execution.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.execution.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.execution.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.execution.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.execution.post.success.title",
    description: "app.api.v1.core.agent.execution.post.success.description",
  },

  examples: {
    requests: {
      default: {
        maxActionsPerRun: 25,
        enableToolExecution: true,
        enableConfirmationCleanup: true,
        confirmationExpiryHours: 24,
      },
      withErrors: {
        maxActionsPerRun: 10,
        enableToolExecution: true,
        enableConfirmationCleanup: true,
        confirmationExpiryHours: 24,
      },
      specificConfirmations: {
        confirmationIds: ["123e4567-e89b-12d3-a456-426614174000"],
        enableToolExecution: true,
        enableConfirmationCleanup: false,
      },
      cleanupOnly: {
        maxActionsPerRun: 0,
        enableToolExecution: false,
        enableConfirmationCleanup: true,
        confirmationExpiryHours: 12,
      },
    },
    responses: {
      default: {
        response: {
          actionsExecuted: 15,
          confirmationsProcessed: 15,
          expiredConfirmationsCleanedUp: 5,
          toolCallsExecuted: 12,
          errors: [],
          summary: {
            totalProcessed: 15,
            successfulExecutions: 12,
            failedExecutions: 3,
            pendingConfirmations: 25,
            expiredConfirmations: 5,
          },
        },
      },
      withErrors: {
        response: {
          actionsExecuted: 8,
          confirmationsProcessed: 10,
          expiredConfirmationsCleanedUp: 2,
          toolCallsExecuted: 6,
          errors: [
            {
              confirmationId: "123e4567-e89b-12d3-a456-426614174000",
              emailId: "456e7890-e89b-12d3-a456-426614174000",
              action: "email_response",
              error: "SMTP service temporarily unavailable",
            },
          ],
          summary: {
            totalProcessed: 10,
            successfulExecutions: 6,
            failedExecutions: 4,
            pendingConfirmations: 20,
            expiredConfirmations: 2,
          },
        },
      },
      specificConfirmations: {
        response: {
          actionsExecuted: 1,
          confirmationsProcessed: 1,
          expiredConfirmationsCleanedUp: 0,
          toolCallsExecuted: 1,
          errors: [],
          summary: {
            totalProcessed: 1,
            successfulExecutions: 1,
            failedExecutions: 0,
            pendingConfirmations: 20,
            expiredConfirmations: 2,
          },
        },
      },
      cleanupOnly: {
        response: {
          actionsExecuted: 0,
          confirmationsProcessed: 0,
          expiredConfirmationsCleanedUp: 5,
          toolCallsExecuted: 0,
          errors: [],
          summary: {
            totalProcessed: 5,
            successfulExecutions: 0,
            failedExecutions: 0,
            pendingConfirmations: 20,
            expiredConfirmations: 5,
          },
        },
      },
    },
    urlPathVariables: undefined,
  },
});

// Extract types using the new enhanced system
export type EmailAgentExecutionPostRequestTypeInput =
  typeof POST.types.RequestInput;
export type EmailAgentExecutionPostRequestTypeOutput =
  typeof POST.types.RequestOutput;
export type EmailAgentExecutionPostResponseTypeInput =
  typeof POST.types.ResponseInput;
export type EmailAgentExecutionPostResponseTypeOutput =
  typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
};

export { POST };
export default definitions;
