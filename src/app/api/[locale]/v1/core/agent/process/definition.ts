/**
 * Email Agent Processing API Route Definition
 * Defines endpoint for triggering email processing through the agent pipeline
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
 * Email Agent Processing Endpoint (POST)
 * Triggers email processing through the agent pipeline
 */
const { POST } = createEndpoint({
  method: Methods.POST,
  path: ["v1", "core", "agent", "process"],
  allowedRoles: [UserRole.ADMIN],

  title: "app.api.v1.core.agent.process.post.title",
  description: "app.api.v1.core.agent.process.post.description",
  category: "app.api.v1.core.agent.category",
  tags: [
    "app.api.v1.core.agent.tags.processing",
    "app.api.v1.core.agent.tags.automation",
  ],

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.process.post.form.title",
      description: "app.api.v1.core.agent.process.post.form.description",
      layout: { type: LayoutType.GRID, columns: 12 },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS ===
      emailIds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.process.post.emailIds.label",
          description:
            "app.api.v1.core.agent.process.post.emailIds.description",
          layout: { columns: 6 },
          placeholder:
            "app.api.v1.core.agent.process.post.emailIds.placeholder",
        },
        z.array(z.uuid()).optional(),
      ),
      accountIds: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.TEXTAREA,
          label: "app.api.v1.core.agent.process.post.accountIds.label",
          description:
            "app.api.v1.core.agent.process.post.accountIds.description",
          layout: { columns: 6 },
          placeholder:
            "app.api.v1.core.agent.process.post.accountIds.placeholder",
        },
        z.array(z.uuid()).optional(),
      ),
      forceReprocess: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.agent.process.post.forceReprocess.label",
          description:
            "app.api.v1.core.agent.process.post.forceReprocess.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),
      skipHardRules: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.agent.process.post.skipHardRules.label",
          description:
            "app.api.v1.core.agent.process.post.skipHardRules.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),
      skipAiProcessing: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.BOOLEAN,
          label: "app.api.v1.core.agent.process.post.skipAiProcessing.label",
          description:
            "app.api.v1.core.agent.process.post.skipAiProcessing.description",
          layout: { columns: 3 },
        },
        z.boolean().default(false),
      ),
      priority: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.SELECT,
          label: "app.api.v1.core.agent.process.post.priority.label",
          description:
            "app.api.v1.core.agent.process.post.priority.description",
          layout: { columns: 3 },
          options: ProcessingPriorityOptions,
        },
        z.nativeEnum(ProcessingPriority).default(ProcessingPriority.NORMAL),
      ),

      // === RESPONSE FIELDS ===
      response: objectField(
        {
          type: WidgetType.CONTAINER,
          title: "app.api.v1.core.agent.process.post.response.title",
          description:
            "app.api.v1.core.agent.process.post.response.description",
          layout: { type: LayoutType.GRID, columns: 12 },
        },
        { response: true },
        {
          processedEmails: responseField(
            {
              type: WidgetType.TEXT,
              content:
                "app.api.v1.core.agent.process.post.response.processedEmails",
            },
            z.number(),
          ),
          hardRulesResults: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              cardConfig: {
                title: "emailId",
                content: ["result"],
              },
              layout: "list",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.v1.core.agent.process.post.response.item",
                description: "app.api.v1.core.agent.process.post.response.item",
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                emailId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.process.post.response.hardRulesResults.emailId",
                  },
                  z.uuid(),
                ),
                result: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.process.post.response.hardRulesResults.result",
                  },
                  z.record(z.string(), z.unknown()),
                ),
              },
            ),
          ),
          aiProcessingResults: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              cardConfig: {
                title: "emailId",
                content: ["result"],
              },
              layout: "list",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title: "app.api.v1.core.agent.process.post.response.item",
                description: "app.api.v1.core.agent.process.post.response.item",
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                emailId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.process.post.response.aiProcessingResults.emailId",
                  },
                  z.uuid(),
                ),
                result: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.process.post.response.aiProcessingResults.result",
                  },
                  z.record(z.string(), z.unknown()),
                ),
              },
            ),
          ),
          confirmationRequests: responseArrayField(
            {
              type: WidgetType.DATA_CARDS,
              cardConfig: {
                title: "id",
                content: ["actionType", "status"],
              },
              layout: "list",
            },
            objectField(
              {
                type: WidgetType.CONTAINER,
                title:
                  "app.api.v1.core.agent.process.post.response.confirmationRequests.title",
                description:
                  "app.api.v1.core.agent.process.post.response.confirmationRequests.description",
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                id: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.process.post.response.confirmationRequests.id",
                  },
                  z.string(),
                ),
                actionType: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.process.post.response.confirmationRequests.actionType",
                  },
                  z.string(),
                ),
                status: responseField(
                  {
                    type: WidgetType.BADGE,
                    text: "app.api.v1.core.agent.process.post.response.confirmationRequests.status",
                  },
                  z.string(),
                ),
              },
            ),
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
                  "app.api.v1.core.agent.process.post.response.errors.title",
                description:
                  "app.api.v1.core.agent.process.post.response.errors.description",
                layout: { type: LayoutType.GRID, columns: 12 },
              },
              { response: true },
              {
                emailId: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.process.post.response.errors.emailId",
                  },
                  z.uuid(),
                ),
                error: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.process.post.response.errors.error",
                  },
                  z.string(),
                ),
                stage: responseField(
                  {
                    type: WidgetType.TEXT,
                    content:
                      "app.api.v1.core.agent.process.post.response.errors.stage",
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
                "app.api.v1.core.agent.process.post.response.summary.title",
              description:
                "app.api.v1.core.agent.process.post.response.summary.description",
              layout: { type: LayoutType.GRID, columns: 12 },
            },
            { response: true },
            {
              totalProcessed: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.process.post.response.summary.totalProcessed",
                },
                z.number(),
              ),
              hardRulesApplied: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.process.post.response.summary.hardRulesApplied",
                },
                z.number(),
              ),
              aiActionsRecommended: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.process.post.response.summary.aiActionsRecommended",
                },
                z.number(),
              ),
              confirmationsRequired: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.process.post.response.summary.confirmationsRequired",
                },
                z.number(),
              ),
              errorsEncountered: responseField(
                {
                  type: WidgetType.TEXT,
                  content:
                    "app.api.v1.core.agent.process.post.response.summary.errorsEncountered",
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
      title: "app.api.v1.core.agent.process.post.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.process.post.errors.unauthorized.description",
    },
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.v1.core.agent.process.post.errors.validation.title",
      description:
        "app.api.v1.core.agent.process.post.errors.validation.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.v1.core.agent.process.post.errors.server.title",
      description:
        "app.api.v1.core.agent.process.post.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.v1.core.agent.process.post.errors.unknown.title",
      description:
        "app.api.v1.core.agent.process.post.errors.unknown.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.v1.core.agent.process.post.errors.network.title",
      description:
        "app.api.v1.core.agent.process.post.errors.network.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.v1.core.agent.process.post.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.process.post.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.v1.core.agent.process.post.errors.notFound.title",
      description:
        "app.api.v1.core.agent.process.post.errors.notFound.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "app.api.v1.core.agent.process.post.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.process.post.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.v1.core.agent.process.post.errors.conflict.title",
      description:
        "app.api.v1.core.agent.process.post.errors.conflict.description",
    },
  },

  successTypes: {
    title: "app.api.v1.core.agent.process.post.success.title",
    description: "app.api.v1.core.agent.process.post.success.description",
  },

  examples: {
    requests: {
      default: {
        emailIds: ["123e4567-e89b-12d3-a456-426614174000"],
        forceReprocess: false,
        priority: ProcessingPriority.NORMAL,
      },
      accountProcessing: {
        accountIds: ["123e4567-e89b-12d3-a456-426614174001"],
        forceReprocess: true,
        priority: ProcessingPriority.HIGH,
      },
    },
    responses: {
      default: {
        response: {
          processedEmails: 5,
          hardRulesResults: [],
          aiProcessingResults: [],
          confirmationRequests: [],
          errors: [],
          summary: {
            totalProcessed: 5,
            hardRulesApplied: 3,
            aiActionsRecommended: 2,
            confirmationsRequired: 1,
            errorsEncountered: 0,
          },
        },
      },
      accountProcessing: {
        response: {
          processedEmails: 10,
          hardRulesResults: [],
          aiProcessingResults: [],
          confirmationRequests: [],
          errors: [],
          summary: {
            totalProcessed: 10,
            hardRulesApplied: 8,
            aiActionsRecommended: 5,
            confirmationsRequired: 2,
            errorsEncountered: 0,
          },
        },
      },
    },
    urlPathVariables: undefined,
  },
});

// Extract types using the new enhanced system
export type EmailAgentProcessingPostRequestTypeInput =
  typeof POST.types.RequestInput;
export type EmailAgentProcessingPostRequestTypeOutput =
  typeof POST.types.RequestOutput;
export type EmailAgentProcessingPostResponseTypeInput =
  typeof POST.types.ResponseInput;
export type EmailAgentProcessingPostResponseTypeOutput =
  typeof POST.types.ResponseOutput;

/**
 * Export definitions
 */
const definitions = {
  POST,
};

export { POST };
export default definitions;
