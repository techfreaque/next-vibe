/**
 * Credits History API Route Definition
 * Defines endpoint for retrieving credit transaction history
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoint/create";
import {
  objectField,
  requestDataField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  LayoutType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

/**
 * Get Credit History Endpoint (GET)
 * Retrieves paginated credit transaction history
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["v1", "core", "credits", "history"],
  title: "app.api.v1.core.agent.chat.credits.history.get.title",
  description: "app.api.v1.core.agent.chat.credits.history.get.description",
  category: "app.api.v1.core.agent.chat.category",
  tags: [
    "app.api.v1.core.agent.chat.tags.credits",
    "app.api.v1.core.agent.chat.tags.balance",
  ],
  allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: objectField(
    {
      type: WidgetType.CONTAINER,
      title: "app.api.v1.core.agent.chat.credits.history.get.container.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.container.description",
      layout: { type: LayoutType.STACKED },
    },
    { request: "data", response: true },
    {
      // === REQUEST FIELDS (Query Parameters) ===
      limit: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.INT,
          label: "app.api.v1.core.agent.chat.credits.history.get.limit.label",
          description:
            "app.api.v1.core.agent.chat.credits.history.get.limit.description",
          validation: { required: false },
        },
        z.coerce.number().int().min(1).max(100).default(50),
      ),

      offset: requestDataField(
        {
          type: WidgetType.FORM_FIELD,
          fieldType: FieldDataType.INT,
          label: "app.api.v1.core.agent.chat.credits.history.get.offset.label",
          description:
            "app.api.v1.core.agent.chat.credits.history.get.offset.description",
          validation: { required: false },
        },
        z.coerce.number().int().min(0).default(0),
      ),

      // === RESPONSE FIELDS ===
      transactions: responseArrayField(
        {},
        objectField(
          {
            type: WidgetType.CONTAINER,
            layout: { type: LayoutType.STACKED },
          },
          { response: true },
          {
            id: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.credits.history.get.transaction.id.content",
              },
              z.uuid(),
            ),

            amount: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.credits.history.get.transaction.amount.content",
              },
              z.number().int(),
            ),

            balanceAfter: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.credits.history.get.transaction.balanceAfter.content",
              },
              z.number().int(),
            ),

            type: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.credits.history.get.transaction.type.content",
              },
              z.enum([
                "purchase",
                "subscription",
                "usage",
                "expiry",
                "free_tier",
                "monthly_reset",
              ]),
            ),

            modelId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.credits.history.get.transaction.modelId.content",
              },
              z.string().nullable(),
            ),

            messageId: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.credits.history.get.transaction.messageId.content",
              },
              z.uuid().nullable(),
            ),

            createdAt: responseField(
              {
                type: WidgetType.TEXT,
                content:
                  "app.api.v1.core.agent.chat.credits.history.get.transaction.createdAt.content",
              },
              z.string().datetime(),
            ),
          },
        ),
      ),

      totalCount: responseField(
        {
          type: WidgetType.TEXT,
          content:
            "app.api.v1.core.agent.chat.credits.history.get.totalCount.content",
        },
        z.number().int(),
      ),
    },
  ),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.v1.core.agent.chat.credits.history.get.success.title",
    description:
      "app.api.v1.core.agent.chat.credits.history.get.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title:
        "app.api.v1.core.agent.chat.credits.history.get.errors.validation.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.credits.history.get.errors.network.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title:
        "app.api.v1.core.agent.chat.credits.history.get.errors.unauthorized.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title:
        "app.api.v1.core.agent.chat.credits.history.get.errors.forbidden.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title:
        "app.api.v1.core.agent.chat.credits.history.get.errors.notFound.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.credits.history.get.errors.server.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title:
        "app.api.v1.core.agent.chat.credits.history.get.errors.unknown.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.v1.core.agent.chat.credits.history.get.errors.unsavedChanges.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title:
        "app.api.v1.core.agent.chat.credits.history.get.errors.conflict.title",
      description:
        "app.api.v1.core.agent.chat.credits.history.get.errors.conflict.description",
    },
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        limit: 50,
        offset: 0,
      },
    },
    responses: {
      default: {
        transactions: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            amount: -5,
            balanceAfter: 1495,
            type: "usage" as const,
            modelId: "gpt-4",
            messageId: "msg-123e4567-e89b-12d3-a456-426614174000",
            createdAt: "2025-10-16T12:00:00.000Z",
          },
          {
            id: "223e4567-e89b-12d3-a456-426614174000",
            amount: 500,
            balanceAfter: 1500,
            type: "purchase" as const,
            modelId: null,
            messageId: null,
            createdAt: "2025-10-15T10:00:00.000Z",
          },
        ],
        totalCount: 2,
      },
    },
  },
});

export default { GET } as const;

export type CreditsHistoryGetRequestOutput = typeof GET.types.RequestOutput;
export type CreditsHistoryGetResponseOutput = typeof GET.types.ResponseOutput;
