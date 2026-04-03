/**
 * Credits History API Route Definition
 * Defines endpoint for retrieving credit transaction history
 */

import { z } from "zod";

import { createEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  backButton,
  customWidgetObject,
  objectField,
  requestField,
  responseArrayField,
  responseField,
} from "@/app/api/[locale]/system/unified-interface/shared/field/utils";
import {
  EndpointErrorTypes,
  FieldDataType,
  Methods,
  WidgetType,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { UserRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { dateSchema } from "../../shared/types/common.schema";
import { paginationField } from "../../system/unified-interface/unified-ui/widgets/containers/pagination/types";
import { CreditTransactionType } from "../enum";
import { scopedTranslation } from "../i18n";
import { CreditHistoryContainer } from "./widget";
/**
 * Get Credit History Endpoint (GET)
 * Retrieves paginated credit transaction history
 */
const { GET } = createEndpoint({
  scopedTranslation,
  method: Methods.GET,
  path: ["credits", "history"],
  title: "history.get.title",
  description: "history.get.description",
  category: "endpointCategories.credits",
  tags: ["tags.credits", "tags.balance"],
  icon: "wallet",
  allowedRoles: [UserRole.PUBLIC, UserRole.CUSTOMER, UserRole.ADMIN] as const,

  fields: customWidgetObject({
    render: CreditHistoryContainer,
    usage: { response: true, request: "data" },
    children: {
      backButton: backButton(scopedTranslation, {
        usage: { response: true, request: "data" },
      }),
      // === ADMIN: optional target user override ===
      targetUserId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "history.get.targetUserId.label" as const,
        hidden: true,
        schema: z.string().optional(),
        includeInCacheKey: true,
      }),

      // === ADMIN: optional target lead override ===
      targetLeadId: requestField(scopedTranslation, {
        type: WidgetType.FORM_FIELD,
        fieldType: FieldDataType.TEXT,
        label: "history.get.targetLeadId.label" as const,
        hidden: true,
        schema: z.string().optional(),
        includeInCacheKey: true,
      }),

      // === TRANSACTION LIST ===
      transactions: responseArrayField(scopedTranslation, {
        type: WidgetType.CONTAINER,
        child: objectField(scopedTranslation, {
          type: WidgetType.CONTAINER,
          usage: { response: true },
          children: {
            id: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "history.get.id" as const,
              schema: z.string(),
            }),
            amount: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "history.get.amount" as const,
              schema: z.coerce.number(),
            }),
            balanceAfter: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "history.get.transaction.balanceAfter.content" as const,
              schema: z.coerce.number(),
            }),
            type: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "history.get.type" as const,
              schema: z.string().optional(),
            }),
            messageId: responseField(scopedTranslation, {
              type: WidgetType.TEXT,
              content: "history.get.messageId" as const,
              schema: z.string().nullable(),
            }),
            createdAt: responseField(scopedTranslation, {
              type: WidgetType.FORM_FIELD,
              fieldType: FieldDataType.DATE,
              content: "history.get.createdAt" as const,
              schema: dateSchema,
            }),
          },
        }),
      }),

      paginationInfo: paginationField({
        order: 2,
      }),
    },
  }),

  // === SUCCESS HANDLING ===
  successTypes: {
    title: "history.get.success.title",
    description: "history.get.success.description",
  },

  // === ERROR HANDLING ===
  errorTypes: {
    [EndpointErrorTypes.VALIDATION_FAILED]: {
      title: "history.get.errors.validation.title",
      description: "history.get.errors.validation.description",
    },
    [EndpointErrorTypes.NETWORK_ERROR]: {
      title: "history.get.errors.network.title",
      description: "history.get.errors.network.description",
    },
    [EndpointErrorTypes.UNAUTHORIZED]: {
      title: "history.get.errors.unauthorized.title",
      description: "history.get.errors.unauthorized.description",
    },
    [EndpointErrorTypes.FORBIDDEN]: {
      title: "history.get.errors.forbidden.title",
      description: "history.get.errors.forbidden.description",
    },
    [EndpointErrorTypes.NOT_FOUND]: {
      title: "history.get.errors.notFound.title",
      description: "history.get.errors.notFound.description",
    },
    [EndpointErrorTypes.SERVER_ERROR]: {
      title: "history.get.errors.server.title",
      description: "history.get.errors.server.description",
    },
    [EndpointErrorTypes.UNKNOWN_ERROR]: {
      title: "history.get.errors.unknown.title",
      description: "history.get.errors.unknown.description",
    },
    [EndpointErrorTypes.UNSAVED_CHANGES]: {
      title: "history.get.errors.unsavedChanges.title",
      description: "history.get.errors.unsavedChanges.description",
    },
    [EndpointErrorTypes.CONFLICT]: {
      title: "history.get.errors.conflict.title",
      description: "history.get.errors.conflict.description",
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
      adminView: {
        targetLeadId: "123e4567-e89b-12d3-a456-426614174001",
        targetUserId: "123e4567-e89b-12d3-a456-426614174000",
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
            type: `${CreditTransactionType.USAGE} (${ChatModelId.GPT_5_MINI})`,
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
