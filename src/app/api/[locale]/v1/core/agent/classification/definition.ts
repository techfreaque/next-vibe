/**
 * Email Agent Classification API Route Definition
 * Defines endpoint for manually triggering email classification through the agent pipeline
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

import { ProcessingPriority, ProcessingPriorityOptions } from "../enum";

/**
 * Email Agent Classification Endpoint (POST)
 * Manually triggers email classification through the agent pipeline
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "classification"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.agent.classification.post.title",
  description: "app.api.v1.core.agent.classification.post.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.processing",
    "app.api.v1.core.agent.tags.classification",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.classification.post.form.title",
      description: "app.api.v1.core.agent.classification.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      emailIds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.classification.post.emailIds.label",
          description:
            "app.api.v1.core.agent.classification.post.emailIds.description",
          layout: { columns: 6 },
          placeholder:
            "app.api.v1.core.agent.classification.post.emailIds.placeholder",
        },
        z.array(z.uuid()).optional(),
      ),
      accountIds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.classification.post.accountIds.label",
          description:
            "app.api.v1.core.agent.classification.post.accountIds.description",
          layout: { columns: 6 },
          placeholder:
            "app.api.v1.core.agent.classification.post.accountIds.placeholder",
        },
        z.array(z.uuid()).optional(),
      ),
      maxEmailsPerRun: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.NUMBER,
          label:
            "app.api.v1.core.agent.classification.post.maxEmailsPerRun.label",
          description:
            "app.api.v1.core.agent.classification.post.maxEmailsPerRun.description",
          layout: { columns: 3 },
        },
        z.coerce.number().min(1).max(100).default(50),
      ),
      enableHardRules: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.classification.post.enableHardRules.label",
          description:
            "app.api.v1.core.agent.classification.post.enableHardRules.description",
          layout: { columns: 3 },
        },
        z.boolean().default(true),
      ),
      enableAiProcessing: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.classification.post.enableAiProcessing.label",
          description:
            "app.api.v1.core.agent.classification.post.enableAiProcessing.description",
          layout: { columns: 3 },
        },
        z.boolean().default(true),
      ),
      priorityFilter: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.MULTISELECT,
          label:
            "app.api.v1.core.agent.classification.post.priorityFilter.label",
          description:
            "app.api.v1.core.agent.classification.post.priorityFilter.description",
          layout: { columns: 3 },
          options: ProcessingPriorityOptions,
        },
        z.array(z.nativeEnum(ProcessingPriority)).optional(),
      ),
      forceReprocess: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label:
            "app.api.v1.core.agent.classification.post.forceReprocess.label",
          description:
            "app.api.v1.core.agent.classification.post.forceReprocess.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.classification.post.response.title",
          description:
            "app.api.v1.core.agent.classification.post.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          emailsProcessed: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.classification.post.response.emailsProcessed",
            },
            z.number(),
          ),
          hardRulesApplied: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.classification.post.response.hardRulesApplied",
            },
            z.number(),
          ),
          aiProcessingCompleted: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.classification.post.response.aiProcessingCompleted",
            },
            z.number(),
          ),
          confirmationRequestsCreated: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.classification.post.response.confirmationRequestsCreated",
            },
            z.number(),
          ),
          errors: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              cardConfig: {
                title: "emailId",
                subtitle: "stage",
                content: ["error"],
              },
              layout: "list",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.agent.classification.post.response.errors.item",
                description:
                  "app.api.v1.core.agent.classification.post.response.errors.item",
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                emailId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.classification.post.response.errors.emailId",
                  },
                  z.string(),
                ),
                stage: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.classification.post.response.errors.stage",
                  },
                  z.string(),
                ),
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.classification.post.response.errors.error",
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
                "app.api.v1.core.agent.classification.post.response.summary.title",
              description:
                "app.api.v1.core.agent.classification.post.response.summary.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              totalProcessed: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.classification.post.response.summary.totalProcessed",
                },
                z.number(),
              ),
              pendingCount: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.classification.post.response.summary.pendingCount",
                },
                z.number(),
              ),
              completedCount: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.classification.post.response.summary.completedCount",
                },
                z.number(),
              ),
              failedCount: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.classification.post.response.summary.failedCount",
                },
                z.number(),
              ),
              awaitingConfirmationCount: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.classification.post.response.summary.awaitingConfirmationCount",
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
      title:
        "app.api.v1.core.agent.classification.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.classification.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.classification.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.classification.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.classification.post.errors.server.title",
      description:
        "app.api.v1.core.agent.classification.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.classification.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.classification.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.classification.post.errors.network.title",
      description:
        "app.api.v1.core.agent.classification.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.classification.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.classification.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.classification.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.classification.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.classification.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.classification.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.classification.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.classification.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.classification.post.success.title",
    description:
      "app.api.v1.core.agent.classification.post.success.description",
  },

  examples: {
    requests: {
      default: {
        maxEmailsPerRun: 50,
        enableHardRules: true,
        enableAiProcessing: true,
      },
      specificEmails: {
        emailIds: ["123e4567-e89b-12d3-a456-426614174000"],
        enableHardRules: true,
        enableAiProcessing: true,
      },
      highPriority: {
        priorityFilter: [ProcessingPriority.HIGH],
        maxEmailsPerRun: 25,
        enableHardRules: true,
        enableAiProcessing: true,
      },
    },
    responses: {
      default: {
        response: {
          emailsProcessed: 25,
          hardRulesApplied: 20,
          aiProcessingCompleted: 15,
          confirmationRequestsCreated: 5,
          errors: [],
          summary: {
            totalProcessed: 25,
            pendingCount: 100,
            completedCount: 500,
            failedCount: 5,
            awaitingConfirmationCount: 10,
          },
        },
      },
      highPriority: {
        response: {
          emailsProcessed: 10,
          hardRulesApplied: 8,
          aiProcessingCompleted: 5,
          confirmationRequestsCreated: 2,
          errors: [],
          summary: {
            totalProcessed: 10,
            pendingCount: 90,
            completedCount: 505,
            failedCount: 5,
            awaitingConfirmationCount: 10,
          },
        },
      },
      specificEmails: {
        response: {
          emailsProcessed: 1,
          hardRulesApplied: 1,
          aiProcessingCompleted: 1,
          confirmationRequestsCreated: 1,
          errors: [],
          summary: {
            totalProcessed: 1,
            pendingCount: 99,
            completedCount: 501,
            failedCount: 5,
            awaitingConfirmationCount: 10,
          },
        },
      },
    },
    urlPathVariables: undefined,
  },
});

// Extract types using the new enhanced system
export type EmailAgentClassificationPostRequestTypeInput =
  typeof POST.types.RequestInput;
export type EmailAgentClassificationPostRequestTypeOutput =
  typeof POST.types.RequestOutput;
export type EmailAgentClassificationPostResponseTypeInput =
  typeof POST.types.ResponseInput;
export type EmailAgentClassificationPostResponseTypeOutput =
  typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
};

export { POST };
export default definitions;
