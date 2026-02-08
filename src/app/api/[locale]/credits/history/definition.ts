/**
 * Credits History API Route Definition
 * Defines endpoint for retrieving credit transaction history
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  customWidgetObject,
  objectFieldNew,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils-new";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ModelId } from "../../agent/models/models";
import { dateSchema } from "../../shared/types/common.schema";
import { paginationField } from "../../system/unified-interface/unified-ui/widgets/containers/pagination/types";
import { CreditTransactionType } from "../enum";
import { CreditHistoryContainer } from "./widget";

/**
 * Get Credit History Endpoint (GET)
 * Retrieves paginated credit transaction history
 */
const { GET } = createEndpoint({
  method: Methods.GET,
  path: ["credits", "history"],
  title: "app.api.agent.chat.credits.history.get.title",
  description: "app.api.agent.chat.credits.history.get.description",
  category: "app.api.agent.chat.category",
  tags: ["app.api.agent.chat.tags.credits", "app.api.agent.chat.tags.balance"],
  icon: "wallet",
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: CreditHistoryContainer,
    usage: { response: true, request: "data" } as const,
    children: {
      // === TRANSACTION LIST ===
      transactions: responseArrayField(
        {
          type: WidgetType.CONTAINER,
        },
        objectFieldNew({
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField({
              type: WidgetType.TEXT,
              content: "app.api.agent.chat.credits.history.get.id" as const,
              schema: z.string(),
            }),
            amount: responseField({
              type: WidgetType.TEXT,
              content: "app.api.agent.chat.credits.history.get.amount" as const,
              schema: z.coerce.number(),
            }),
            balanceAfter: responseField({
              type: WidgetType.TEXT,
              content: "app.subscription.subscription.history.balance" as const,
              schema: z.coerce.number(),
            }),
            type: responseField({
              type: WidgetType.TEXT,
              content: "app.api.agent.chat.credits.history.get.type" as const,
              schema: z.string().optional(),
            }),
            messageId: responseField({
              type: WidgetType.TEXT,
              content:
                "app.api.agent.chat.credits.history.get.messageId" as const,
              schema: z.string().nullable(),
            }),
            createdAt: responseField({
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.DATE,
              content:
                "app.api.agent.chat.credits.history.get.createdAt" as const,
              schema: dateSchema,
            }),
          },
        }),
      ),

      paginationInfo: paginationField({
        order: 2,
      }),
    },
  }),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "app.api.agent.chat.credits.history.get.success.title",
    description: "app.api.agent.chat.credits.history.get.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "app.api.agent.chat.credits.history.get.errors.validation.title",
      description:
        "app.api.agent.chat.credits.history.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "app.api.agent.chat.credits.history.get.errors.network.title",
      description:
        "app.api.agent.chat.credits.history.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "app.api.agent.chat.credits.history.get.errors.unauthorized.title",
      description:
        "app.api.agent.chat.credits.history.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "app.api.agent.chat.credits.history.get.errors.forbidden.title",
      description:
        "app.api.agent.chat.credits.history.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "app.api.agent.chat.credits.history.get.errors.notFound.title",
      description:
        "app.api.agent.chat.credits.history.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "app.api.agent.chat.credits.history.get.errors.server.title",
      description:
        "app.api.agent.chat.credits.history.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "app.api.agent.chat.credits.history.get.errors.unknown.title",
      description:
        "app.api.agent.chat.credits.history.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title:
        "app.api.agent.chat.credits.history.get.errors.unsavedChanges.title",
      description:
        "app.api.agent.chat.credits.history.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "app.api.agent.chat.credits.history.get.errors.conflict.title",
      description:
        "app.api.agent.chat.credits.history.get.errors.conflict.description",
    },
  },

  // === EXAMPLES ===
  examples: {
    requests: {
      default: {
        paginationInfo: {
          page: 1,
          limit: 50,
        },
      },
    },
    responses: {
      default: {
        transactions: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            amount: -5,
            balanceAfter: 1495,
            type: `${CreditTransactionType.USAGE} (${ModelId.GPT_5_MINI})`,
            messageId: "msg-123e4567-e89b-12d3-a456-426614174000",
            createdAt: "2025-10-16T12:00:00.000Z",
          },
          {
            id: "223e4567-e89b-12d3-a456-426614174000",
            amount: 500,
            balanceAfter: 1500,
            type: CreditTransactionType.PURCHASE,
            messageId: null,
            createdAt: "2025-10-15T10:00:00.000Z",
          },
        ],
        paginationInfo: {
          totalCount: 2,
          pageCount: 1,
        },
      },
    },
  },
});

export default { GET } as const;

export type CreditsHistoryGetRequestOutput = typeof GET.types.RequestOutput;
export type CreditsHistoryGetResponseOutput = typeof GET.types.ResponseOutput;
